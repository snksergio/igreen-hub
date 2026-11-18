import { describe, expect, it } from "vitest";
import { applyTokens, buildInviteLink, parsePersona, whatsHref } from "./persona";
import { slugify } from "./slug";

describe("slugify", () => {
  it("tira acento, espaço e pontuação", () => {
    expect(slugify("Evento Thiago BH!")).toBe("evento-thiago-bh");
    expect(slugify("  Encontro em São João  ")).toBe("encontro-em-sao-joao");
  });
  it("nunca devolve vazio", () => {
    expect(slugify("!!!")).toBe("pagina");
  });
});

describe("parsePersona", () => {
  it("descarta foto javascript:, WhatsApp com letra e código fora do padrão", () => {
    expect(parsePersona(new URLSearchParams("foto=javascript:alert(1)&whats=55abc&ref=a b"))).toEqual({});
  });
  it("aceita valores válidos e corta nome longo", () => {
    const p = parsePersona(
      new URLSearchParams(`nome=${"x".repeat(100)}&cidade=BH&whats=5531999999999&foto=https://a.com/f.jpg&ref=LIC_1`)
    );
    expect(p.nome).toHaveLength(80);
    expect(p).toMatchObject({ cidade: "BH", whats: "5531999999999", foto: "https://a.com/f.jpg", ref: "LIC_1" });
  });
});

describe("applyTokens", () => {
  it("usa iGreen quando não há nome", () => {
    expect(applyTokens("Convite de {nome}", {})).toBe("Convite de iGreen");
  });
  it("troca nome e cidade e limpa espaço duplo", () => {
    expect(applyTokens("Com {nome} em {cidade}", { nome: "Thiago", cidade: "BH" })).toBe("Com Thiago em BH");
    expect(applyTokens("Olá {cidade} hoje", {})).toBe("Olá hoje");
  });
});

describe("buildInviteLink", () => {
  it("não inclui chave vazia e codifica espaço", () => {
    const url = buildInviteLink("https://x.io/poc/", "live-mobi", { nome: "Thiago Souza", whats: "" });
    expect(url).toBe("https://x.io/poc/#/p/live-mobi?nome=Thiago+Souza");
  });
});

describe("whatsHref", () => {
  it("sem número abre o WhatsApp para escolher contato", () => {
    expect(whatsHref({}, "Oi")).toBe("https://wa.me/?text=Oi");
  });
  it("com número vai direto", () => {
    expect(whatsHref({ whats: "5531999999999" }, "Oi tudo")).toBe("https://wa.me/5531999999999?text=Oi%20tudo");
  });
});

describe("WhatsApp brasileiro", () => {
  it("sem o 55 ganha o 55 na frente", () => {
    expect(parsePersona(new URLSearchParams("whats=31999999999")).whats).toBe("5531999999999");
    expect(parsePersona(new URLSearchParams("whats=3133334444")).whats).toBe("553133334444");
  });
  it("12 ou 13 dígitos que não começam com 55 são descartados", () => {
    expect(parsePersona(new URLSearchParams("whats=1231999999999")).whats).toBeUndefined();
  });
});
