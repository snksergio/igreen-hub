import { beforeEach, describe, expect, it } from "vitest";
import { listarEventos, origemDoAcesso, registrarUmaVez, resumir, type Evento } from "./eventos";
import { garantirDadosDeExemplo, restaurarExemplos } from "./exemplo";
import {
  baseDasRespostas,
  camposNaPagina,
  checarRegras,
  cpfValido,
  criarFormulario,
  dividirEtapas,
  etapasDoModal,
  formularioDaPagina,
  getFormulario,
  listarFormularios,
  mascaraCpf,
  mascaraWhats,
  novoCampo,
  validarCampo,
  validarCampos,
  visivel,
  type Formulario,
} from "./formularios";
import { calcularTotal, checarCupom, INGRESSO_PADRAO, precoAgora, type ConfigIngresso } from "./ingresso";
import { criarLink, listarLinks } from "./links";
import { dataCurta, infoEvento, motivoFechada, preencher, statusVisivel } from "./meta";
import { createPage, duplicatePage, listPages, setMeta, type PageRecord } from "./pages";
import { FILTROS_PADRAO, filtrarLinhas, montarLinhas } from "./painel";
import { _limparMemoria } from "./store";
import { addSubmission, listSubmissions, toCSV, updateSubmissions, type Submission } from "./submissions";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  _limparMemoria();
});

const AGORA = new Date("2026-11-18T12:00:00-03:00");

describe("status da página", () => {
  it("agendada antes de publicarEm, encerrada depois de encerrarEm", () => {
    expect(statusVisivel({ status: "publicada", publicarEm: "2026-11-25T09:00" }, AGORA)).toBe("agendada");
    expect(statusVisivel({ status: "publicada", encerrarEm: "2026-11-10T09:00" }, AGORA)).toBe("encerrada");
    expect(statusVisivel({ status: "publicada" }, AGORA)).toBe("publicada");
    expect(statusVisivel({ status: "arquivada", publicarEm: "2026-11-25T09:00" }, AGORA)).toBe("arquivada");
  });
  it("página nova nasce rascunho e a cópia também, sem as datas", () => {
    const p = createPage("evento", "Teste");
    expect(p.meta?.status).toBe("rascunho");
    setMeta(p.id, { status: "publicada", encerrarEm: "2026-12-01T10:00", vagas: 40 });
    const c = duplicatePage(p.id);
    expect(c.meta).toEqual({ status: "rascunho", vagas: 40 });
  });
  it("motivo de não aceitar inscrição", () => {
    expect(motivoFechada("publicada", 10, 10)).toBe("esgotada");
    expect(motivoFechada("publicada", 10, 10, true)).toBeUndefined();
    expect(motivoFechada("encerrada", 0, null)).toBe("encerrada");
    expect(motivoFechada("rascunho", 0, null)).toBe("rascunho");
  });
});

describe("data do evento vem das peças", () => {
  it("Local vence a contagem", () => {
    const data = {
      content: [
        { type: "ContagemRegressiva", props: { id: "a", quando: "2026-12-01T10:00" } },
        { type: "Local", props: { id: "b", inicio: "2026-12-12T19:00", nomeLocal: "Expominas", cidade: "Belo Horizonte", uf: "MG" } },
      ],
      root: { props: {} },
    };
    expect(infoEvento(data as never)).toMatchObject({ inicio: "2026-12-12T19:00", local: "Expominas", cidade: "Belo Horizonte" });
    expect(dataCurta("2026-12-12T19:00")).toMatch(/12.*dez.*19h/);
  });
  it("preencher troca as chaves", () => {
    expect(preencher("Oi, {nome}! Código {codigo}.{x}", { nome: "Ana", codigo: "AB12" })).toBe("Oi, Ana! Código AB12.");
  });
});

describe("filtros do painel", () => {
  const pagina = (slug: string, templateId: string, inicio: string | undefined, meta: PageRecord["meta"], updatedAt: number): PageRecord => ({
    id: slug,
    slug,
    title: slug.replace(/-/g, " "),
    templateId,
    updatedAt,
    meta,
    data: { content: inicio ? [{ type: "Local", props: { id: "l", inicio } }] : [], root: { props: {} } } as never,
  });
  const linhas = montarLinhas(
    [
      pagina("live-bh", "premium", "2026-12-12T19:00", { status: "publicada", responsaveis: ["Marina"] }, 3),
      pagina("encontro-sp", "evento", "2026-11-25T19:00", { status: "rascunho", responsaveis: ["Rafael"] }, 2),
      pagina("velha", "evento", "2026-10-01T19:00", { status: "arquivada" }, 1),
      pagina("campanha", "campanha", undefined, { status: "publicada", responsaveis: ["Rafael"] }, 4),
    ],
    () => 0,
    () => null,
    AGORA
  );
  const slugs = (f: Partial<typeof FILTROS_PADRAO>) => filtrarLinhas(linhas, { ...FILTROS_PADRAO, ...f }, AGORA).map((l) => l.page.slug);

  it("arquivada sai do painel por padrão", () => {
    expect(slugs({})).toEqual(["campanha", "live-bh", "encontro-sp"]);
    expect(slugs({ status: "arquivada" })).toEqual(["velha"]);
  });
  it("filtros combinam entre si", () => {
    expect(slugs({ responsavel: "Rafael", modelo: "evento" })).toEqual(["encontro-sp"]);
    expect(slugs({ data: "proximas" })).toEqual(["live-bh", "encontro-sp"]);
    expect(slugs({ data: "sem-data" })).toEqual(["campanha"]);
    expect(slugs({ busca: "ENCONTRO" })).toEqual(["encontro-sp"]);
  });
  it("ordem por data do evento: próximos primeiro, sem data no fim", () => {
    expect(slugs({ ordem: "evento", status: "todas" })).toEqual(["encontro-sp", "live-bh", "velha", "campanha"]);
    expect(slugs({ ordem: "nome" })).toEqual(["campanha", "encontro-sp", "live-bh"]);
  });
});

describe("formulário", () => {
  it("valida CPF, WhatsApp, e-mail, cidade e nome completo", () => {
    expect(cpfValido("529.982.247-25")).toBe(true);
    expect(cpfValido("111.111.111-11")).toBe(false);
    expect(validarCampo(novoCampo("whats", { obrigatorio: true }), "(31) 9 9999")).toBeTruthy();
    expect(validarCampo(novoCampo("whats"), "(31) 9 9999-0000")).toBeUndefined();
    expect(validarCampo(novoCampo("email"), "a@b")).toBeTruthy();
    expect(validarCampo(novoCampo("cidade"), "Belo Horizonte/MG")).toBeUndefined();
    expect(validarCampo(novoCampo("cidade"), "Belo Horizonte/")).toBeTruthy();
    expect(validarCampo(novoCampo("texto", { validacao: "nome-completo" }), "Ana")).toBeTruthy();
    expect(validarCampo(novoCampo("texto", { max: 3 }), "abcd")).toBe("Use até 3 caracteres.");
    expect(validarCampo(novoCampo("lgpd"), "")).toBeTruthy();
    expect(validarCampo(novoCampo("numero", { minimo: 1, maximo: 5 }), "9")).toBe("O máximo é 5.");
  });
  it("máscaras", () => {
    expect(mascaraWhats("31999990000")).toBe("(31) 9 9999-0000");
    expect(mascaraCpf("52998224725")).toBe("529.982.247-25");
  });
  it("lógica: campo só aparece com a resposta pedida e não é cobrado escondido", () => {
    const pai = novoCampo("unica", { id: "lic", opcoes: ["Sim", "Não"] });
    const filho = novoCampo("texto", { id: "cod", obrigatorio: true, condicao: { campo: "lic", valor: "Sim" } });
    expect(visivel(filho, { lic: "Não" })).toBe(false);
    expect(validarCampos([pai, filho], { lic: "Não" })).toEqual({});
    expect(validarCampos([pai, filho], { lic: "Sim" })).toHaveProperty("cod");
  });
  it("versão curta na página e o resto no modal, em etapas", () => {
    const f = criarFormulario("ingresso");
    expect(camposNaPagina(f).map((c) => c.id)).toEqual(["nome", "whats", "email", "cidade"]);
    const etapas = etapasDoModal(f, false);
    expect(etapas.map((e) => e.titulo)).toEqual(["Ingresso"]);
    expect(dividirEtapas(f.campos).map((e) => e.titulo)).toEqual(["Seus dados", "Ingresso"]);
    expect(etapasDoModal(f, true)).toHaveLength(2);
  });
  it("regras: repetida, vagas com e sem lista de espera, encerramento", () => {
    const f: Formulario = { ...criarFormulario("simples"), regras: { ...criarFormulario("simples").regras, vagas: 1 } };
    const ja = [{ whats: "5531999990000", email: "a@a.com", status: "inscrito" }] as Submission[];
    const r = { nome: "Bia Lima", whats: "(31) 9 9999-0000", email: "b@b.com" };
    expect(checarRegras(f, { inscricoesDaPagina: ja, agora: AGORA }, r)).toMatchObject({ ok: false, motivo: expect.stringMatching(/Já existe/) });
    const outra = { ...r, whats: "(31) 9 8888-0000" };
    expect(checarRegras(f, { inscricoesDaPagina: ja, agora: AGORA }, outra)).toMatchObject({ ok: false, motivo: "As vagas acabaram." });
    f.regras.listaEspera = true;
    expect(checarRegras(f, { inscricoesDaPagina: ja, agora: AGORA }, outra)).toEqual({ ok: true, espera: true });
    expect(checarRegras(f, { inscricoesDaPagina: [], agora: AGORA, encerrarDaPagina: "2026-11-01T10:00" }, outra)).toMatchObject({ ok: false });
    expect(baseDasRespostas(f, r)).toEqual({ nome: "Bia Lima", whats: "31999990000", email: "b@b.com", cidade: undefined });
  });
  it("biblioteca e ligação com a página", () => {
    const f = criarFormulario("live", "Minha live");
    expect(listarFormularios().map((x) => x.nome)).toEqual(["Minha live"]);
    expect(formularioDaPagina({ content: [{ type: "LiveInscricao", props: { id: "x", formularioId: f.id } }], root: {} } as never)).toBe(f.id);
    expect(getFormulario(f.id)?.campos.some((c) => c.tipo === "lgpd")).toBe(true);
  });
});

describe("ingresso", () => {
  const cfg: ConfigIngresso = {
    ...INGRESSO_PADRAO,
    preco: 80,
    meia: true,
    lotes: [
      { id: "2", nome: "2º lote", preco: 60, ate: "2026-12-05T23:59" },
      { id: "1", nome: "1º lote", preco: 40, ate: "2026-11-25T23:59" },
    ],
    cupons: [
      { codigo: "DEZ", tipo: "percentual", valor: 10 },
      { codigo: "VINTE", tipo: "valor", valor: 20, limite: 2, validade: "2026-11-20T23:59" },
    ],
  };
  it("o lote muda sozinho na data e depois vale o preço único", () => {
    expect(precoAgora(cfg, AGORA)).toMatchObject({ nome: "1º lote", preco: 40, depois: { nome: "2º lote", preco: 60 } });
    expect(precoAgora(cfg, new Date("2026-11-30T12:00:00-03:00")).nome).toBe("2º lote");
    expect(precoAgora(cfg, new Date("2026-12-10T12:00:00-03:00"))).toMatchObject({ nome: "Preço final", preco: 80 });
  });
  it("cupom: validade, limite e desconto depois da meia", () => {
    expect(checarCupom(cfg, "vinte", 2, AGORA)).toMatchObject({ ok: false });
    expect(checarCupom(cfg, "vinte", 0, new Date("2026-11-21T12:00:00-03:00"))).toMatchObject({ ok: false, erro: "Este cupom já venceu." });
    const dez = checarCupom(cfg, "dez", 0, AGORA);
    expect(dez.ok).toBe(true);
    if (!dez.ok) return;
    expect(calcularTotal(cfg, { meia: true, cupom: dez.cupom }, AGORA)).toEqual({ lote: "1º lote", base: 40, descontoMeia: 20, descontoCupom: 2, total: 18 });
    expect(calcularTotal(cfg, { cupom: { codigo: "X", tipo: "valor", valor: 999 } }, AGORA).total).toBe(0);
  });
});

describe("visitas, origem e links", () => {
  it("origem pela URL, pelo código e pelo site anterior", () => {
    expect(origemDoAcesso(new URLSearchParams("utm_source=Instagram"))).toBe("instagram");
    expect(origemDoAcesso(new URLSearchParams(""), "", "LIC1")).toBe("licenciado");
    expect(origemDoAcesso(new URLSearchParams(""), "https://www.google.com/")).toBe("google");
    expect(origemDoAcesso(new URLSearchParams(""))).toBe("direto");
  });
  it("visita conta uma vez por aba", () => {
    registrarUmaVez({ pageId: "p", tipo: "visita", origem: "direto" });
    registrarUmaVez({ pageId: "p", tipo: "visita", origem: "direto" });
    expect(listarEventos("p")).toHaveLength(1);
  });
  it("resumo junta visitas, inscrições, origem e ranking", () => {
    const t = AGORA.getTime();
    const ev: Evento[] = [
      { pageId: "p", tipo: "visita", em: t, origem: "licenciado", ref: "L1" },
      { pageId: "p", tipo: "visita", em: t, origem: "instagram" },
      { pageId: "p", tipo: "visita", em: t, origem: "instagram" },
      { pageId: "p", tipo: "visita", em: t, origem: "direto" },
    ];
    const subs = [{ createdAt: t, ref: "L1", origem: "licenciado", status: "presente" }] as Submission[];
    const r = resumir(ev, subs, 7, AGORA);
    expect(r).toMatchObject({ visitas: 4, inscricoes: 1, conversao: 25, presentes: 1 });
    expect(r.porDia).toHaveLength(7);
    expect(r.porDia[6]).toMatchObject({ visitas: 4, inscricoes: 1 });
    expect(r.ranking).toEqual([{ ref: "L1", visitas: 1, inscricoes: 1, presentes: 1 }]);
    expect(r.porOrigem[0]).toMatchObject({ origem: "licenciado", inscricoes: 1 });
  });
  it("link de licenciado: código único por página", () => {
    criarLink("p", { ref: "lic 9", nome: "Ana" });
    expect(listarLinks("p")[0].ref).toBe("LIC9");
    expect(() => criarLink("p", { ref: "LIC9", nome: "Bia" })).toThrow(/já tem link/);
  });
});

describe("inscrições com status, pagamento e colunas do formulário", () => {
  it("status em lote com histórico e CSV com uma coluna por campo", () => {
    const a = addSubmission({ pageId: "p", pageSlug: "p", nome: "Ana", whats: "1", email: "a", respostas: { interesses: ["Palestras", "Shows"] } });
    expect(a.codigo).toMatch(/^[A-Z2-9]{6}$/);
    updateSubmissions([a.id], { status: "confirmado" }, "Marcado como confirmado");
    const s = listSubmissions({ pageId: "p" })[0];
    expect(s.status).toBe("confirmado");
    expect(s.historico?.map((h) => h.texto)).toEqual(["Inscrição enviada", "Marcado como confirmado"]);
    const csv = toCSV([s], [{ id: "interesses", rotulo: "Interesses" }]);
    expect(csv.split("\n")[0]).toMatch(/Status;Pagamento;Valor;Origem;Código do ingresso;Interesses$/);
    expect(csv).toContain("Confirmado");
    expect(csv).toContain("Palestras, Shows");
  });
});

describe("dados de exemplo", () => {
  it("semeia uma vez, com metas, formulários, inscrições, visitas e links", () => {
    garantirDadosDeExemplo(false, AGORA.getTime());
    const live = listPages().find((p) => p.slug === "igreen-live-bh")!;
    expect(live.meta).toMatchObject({ status: "publicada", vagas: 250 });
    expect(formularioDaPagina(live.data)).toBe("f-igreen-live-bh");
    expect(listSubmissions({ pageId: live.id })).toHaveLength(186);
    expect(listarEventos(live.id).filter((e) => e.tipo === "visita")).toHaveLength(2380);
    expect(listarLinks(live.id)).toHaveLength(6);
    const encontro = listPages().find((p) => p.slug === "evento-thiago-bh")!;
    expect(listSubmissions({ pageId: encontro.id }).every((s) => s.pagamento)).toBe(true);
    // segunda vez não duplica
    garantirDadosDeExemplo(false, AGORA.getTime());
    expect(listSubmissions({ pageId: live.id })).toHaveLength(186);
  });
  it("restaurar exemplos refaz tudo sem sobrar inscrição órfã", () => {
    garantirDadosDeExemplo(false, AGORA.getTime());
    const total = listSubmissions().length;
    restaurarExemplos();
    expect(listSubmissions().length).toBe(total);
    const ids = new Set(listPages().map((p) => p.id));
    expect(listSubmissions().every((s) => ids.has(s.pageId))).toBe(true);
  });
});
