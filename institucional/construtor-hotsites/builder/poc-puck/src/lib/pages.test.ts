import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createPage,
  deletePage,
  duplicatePage,
  exportPage,
  getPageBySlug,
  importPage,
  listPages,
  resetToExamples,
  savePage,
  setSlug,
  alteradaEmOutroLugar,
} from "./pages";
import { _limparMemoria } from "./store";

beforeEach(() => {
  localStorage.clear();
  _limparMemoria();
  vi.restoreAllMocks();
});

const ids = (p: { data: { content: { props: { id: string } }[] } }) => p.data.content.map((c) => c.props.id);

describe("páginas", () => {
  it("sem nada salvo, devolve os exemplos", () => {
    const pages = listPages();
    expect(pages.map((p) => p.slug).sort()).toEqual(["evento-thiago-bh", "igreen-live-bh", "live-mobi", "migre-a-bandeira"]);
  });

  it("JSON corrompido volta para os exemplos", () => {
    localStorage.setItem("poc-hotsite:pages", "{quebrado");
    expect(listPages()).toHaveLength(4);
  });

  it("localStorage indisponível não derruba", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    expect(listPages().length).toBeGreaterThan(0);
  });

  it("mesmo título gera endereços x e x-2, e toda peça tem id único", () => {
    const a = createPage("evento", "Evento Teste");
    const b = createPage("evento", "Evento Teste");
    expect(a.slug).toBe("evento-teste");
    expect(b.slug).toBe("evento-teste-2");
    const all = ids(a);
    expect(new Set(all).size).toBe(all.length);
    expect(all.every(Boolean)).toBe(true);
  });

  it("peça travada do modelo continua travada", () => {
    const a = createPage("live", "Live X");
    expect(a.data.content[0].props.travado).toBe(true);
  });

  it("duplicar gera novos ids e novo endereço", () => {
    const a = createPage("campanha", "Campanha");
    const c = duplicatePage(a.id);
    expect(c.slug).toBe("campanha-2");
    expect(ids(c).some((id) => ids(a).includes(id))).toBe(false);
  });

  it("mudar endereço normaliza e evita repetição", () => {
    const a = createPage("evento", "Um");
    createPage("evento", "Dois");
    expect(setSlug(a.id, "Dois")).toBe("dois-2");
    expect(setSlug(a.id, "Évento Novo")).toBe("evento-novo");
    expect(getPageBySlug("evento-novo")?.id).toBe(a.id);
  });

  it("exportar e importar devolve uma cópia nova", () => {
    const a = createPage("evento", "Exportar");
    const b = importPage(exportPage(a.id));
    expect(b.id).not.toBe(a.id);
    expect(b.slug).toBe("exportar-2");
  });

  it("arquivo inválido é recusado", () => {
    expect(() => importPage("{")).toThrow("Arquivo inválido");
    expect(() => importPage('{"data":{}}')).toThrow("Arquivo inválido");
  });

  it("apagar e restaurar exemplos", () => {
    const a = createPage("evento", "Apagar");
    deletePage(a.id);
    expect(getPageBySlug("apagar")).toBeUndefined();
    resetToExamples();
    expect(listPages()).toHaveLength(4);
  });
});

describe("edição em outra aba", () => {
  it("detecta quando a página foi salva depois da versão aberta", () => {
    const a = createPage("evento", "Conflito");
    expect(alteradaEmOutroLugar(a.id, a.updatedAt)).toBe(false);
    vi.spyOn(Date, "now").mockReturnValue(a.updatedAt + 5000);
    savePage({ ...a, title: "Mudou na outra aba" });
    expect(alteradaEmOutroLugar(a.id, a.updatedAt)).toBe(true);
  });
});

describe("começar do zero e espaço cheio", () => {
  it("modelo em branco cria página sem peças", () => {
    expect(createPage("branco", "Do zero").data.content).toHaveLength(0);
  });
  it("sem espaço no navegador, avisa e mantém a edição até fechar a aba", () => {
    const a = createPage("evento", "Cheio");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("cheio", "QuotaExceededError");
    });
    const r = savePage({ ...a, title: "Mudou" });
    expect(r.persistido).toBe(false);
    expect(getPageBySlug("cheio")?.title).toBe("Mudou");
  });
  it("quem já tinha páginas recebe a demo do kit Live uma vez, no topo; apagada, não volta", () => {
    const antiga = { id: "a1", slug: "minha", title: "Minha página", templateId: "evento", data: { root: { props: {} }, content: [], zones: {} }, updatedAt: 1 };
    localStorage.setItem("poc-hotsite:pages", JSON.stringify([antiga]));
    _limparMemoria();
    const pages = listPages();
    expect(pages.map((p) => p.slug)).toEqual(["igreen-live-bh", "minha"]);
    expect(pages[0].data.content).toHaveLength(12);
    deletePage(pages[0].id);
    _limparMemoria();
    expect(listPages().map((p) => p.slug)).toEqual(["minha"]);
  });
});
