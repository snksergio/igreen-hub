import { describe, expect, it } from "vitest";
import { parseHash } from "./router";

describe("parseHash", () => {
  it("reconhece as rotas", () => {
    expect(parseHash("")).toEqual({ name: "painel" });
    expect(parseHash("#/editar/abc")).toEqual({ name: "editar", id: "abc" });
    expect(parseHash("#/convite/live-mobi")).toEqual({ name: "convite", slug: "live-mobi" });
    expect(parseHash("#/inscricoes")).toEqual({ name: "inscricoes" });
  });
  it("página pública traz a query do licenciado", () => {
    const r = parseHash("#/p/live-mobi?nome=Thiago+Souza&ref=LIC1");
    expect(r.name).toBe("publica");
    if (r.name === "publica") {
      expect(r.slug).toBe("live-mobi");
      expect(r.query.get("nome")).toBe("Thiago Souza");
    }
  });
  it("rota desconhecida ou malformada vira 404 sem quebrar", () => {
    expect(parseHash("#/qualquer")).toEqual({ name: "404" });
    expect(parseHash("#/p/%E0%A4%A")).toMatchObject({ name: "publica", slug: "%E0%A4%A" });
  });
});

describe("rotas do espaço da página, formulários e check-in", () => {
  it("reconhece aba, formulário, check-in, ingresso e números do licenciado", () => {
    expect(parseHash("#/pagina/abc")).toEqual({ name: "pagina", id: "abc", aba: "visao" });
    expect(parseHash("#/pagina/abc/links")).toEqual({ name: "pagina", id: "abc", aba: "links" });
    expect(parseHash("#/pagina/abc/xyz")).toEqual({ name: "pagina", id: "abc", aba: "visao" });
    expect(parseHash("#/formularios")).toEqual({ name: "formularios" });
    expect(parseHash("#/f/f-1?pagina=live").name).toBe("form");
    expect(parseHash("#/checkin/abc")).toEqual({ name: "checkin", id: "abc" });
    expect(parseHash("#/ingresso/AB23CD")).toEqual({ name: "ingresso", codigo: "AB23CD" });
    expect(parseHash("#/numeros/live/LIC1")).toEqual({ name: "numeros", slug: "live", ref: "LIC1" });
  });
});

describe("rota de nova página", () => {
  it("reconhece #/nova", () => {
    expect(parseHash("#/nova")).toEqual({ name: "nova" });
  });
});
