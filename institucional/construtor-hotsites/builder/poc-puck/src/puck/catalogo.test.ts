import { describe, expect, it } from "vitest";
import { CATALOGO, GRUPOS } from "./catalogo";
import { config } from "./config";

describe("catálogo de peças", () => {
  const pecas = Object.keys(config.components);

  it("toda peça tem ficha (nome, subtítulo, descrição, como funciona)", () => {
    for (const p of pecas) {
      const f = CATALOGO[p as keyof typeof CATALOGO];
      expect(f, p).toBeDefined();
      expect(f.nome && f.tecnico && f.descricao && f.comoFunciona, p).toBeTruthy();
    }
  });

  it("toda peça está em exatamente um grupo da gaveta", () => {
    const nosGrupos = Object.values(GRUPOS).flatMap((g) => g.components);
    for (const p of pecas) expect(nosGrupos.filter((x) => x === p), p).toHaveLength(1);
    expect(nosGrupos.length).toBe(pecas.length);
  });

  it("inclui as peças tiradas das referências", () => {
    for (const p of ["Depoimentos", "Galeria", "LogosParceiros", "ContagemRegressiva", "LinhaDoTempo", "Planos", "FaixaAnimada"]) {
      expect(pecas).toContain(p);
    }
  });
});
