import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// No ambiente de teste o CSS importado vem vazio; lê o arquivo de verdade.
const css = readFileSync(`${process.cwd()}/src/hotsite.css`, "utf8");
import { CLASSES, guiaParaIA, MODELOS_LIVRE, TOKENS } from "./guia";

const existeClasse = (c: string) => new RegExp(`\\.${c.replace(/^\./, "")}(?![\\w-])`).test(css);

describe("guia da seção livre", () => {
  it("toda classe do guia existe no CSS do hotsite", () => {
    for (const c of CLASSES) expect(existeClasse(c.classe), c.classe).toBe(true);
  });

  it("todo token do guia existe no :root", () => {
    for (const t of TOKENS) expect(css, t.token).toContain(`${t.token}:`);
  });

  it("os modelos de partida só usam classes hs- que existem e nunca usam h1", () => {
    for (const [id, m] of Object.entries(MODELOS_LIVRE)) {
      const usadas = [...m.html.matchAll(/class="([^"]+)"/g)].flatMap((x) => x[1].split(/\s+/)).filter((c) => c.startsWith("hs-"));
      for (const c of usadas) expect(existeClasse(c), `${id}: ${c}`).toBe(true);
      expect(m.html, id).not.toMatch(/<h1[\s>]/);
    }
  });

  it("o texto para IA explica estrutura, SEO, tokens, classes e movimento", () => {
    const g = guiaParaIA();
    for (const trecho of ["hs-wrap", "Nunca use <h1>", "--verde", "data-r", "--i", "secao", "prefers-reduced-motion", "alt", "arquivo:", ".html completo", "Tailwind"])
      expect(g, trecho).toContain(trecho);
  });
});
