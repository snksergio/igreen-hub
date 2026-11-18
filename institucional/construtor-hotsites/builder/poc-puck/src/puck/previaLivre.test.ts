import { describe, expect, it } from "vitest";
import { documentoDaPrevia } from "./previaLivre";

const base = {
  id: "livre-abc",
  fundo: "escuro",
  html: '<p id="v">Oi</p>',
  estilo: "#livre-abc{.x{color:red}}",
  estilos: [] as string[],
  scripts: [] as string[],
  codigo: "(function(){console.log(1)})();",
};

describe("prévia da Seção livre no editor", () => {
  it("monta uma página só com a seção, do mesmo jeito que a publicada", () => {
    const d = documentoDaPrevia(base);
    expect(d).toMatch(/^<!doctype html>/);
    expect(d).toContain('<section id="livre-abc" class="hs-sec hs-livre" data-fundo="escuro"><div class="hs-wrap"><div class="hs-livre__conteudo"><p id="v">Oi</p></div></div></section>');
    expect(d).toContain("<style>#livre-abc{.x{color:red}}</style>");
    expect(d).toContain("<script>(function(){console.log(1)})();</script>");
  });

  it("a altura vem do conteúdo, não da janela (sem 100vh do .hs)", () => {
    expect(documentoDaPrevia(base)).toContain(".hs{min-height:0}");
  });

  it("avisa o editor dos erros antes de qualquer outro script rodar", () => {
    const d = documentoDaPrevia({ ...base, scripts: ["https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"] });
    const aviso = d.indexOf("erro-livre");
    expect(aviso).toBeGreaterThan(0);
    expect(aviso).toBeLessThan(d.indexOf("gsap.min.js"));
    expect(aviso).toBeLessThan(d.indexOf("console.log(1)"));
  });

  it("com biblioteca externa: ela carrega com defer e o código espera", () => {
    const d = documentoDaPrevia({ ...base, scripts: ["https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"], estilos: ["https://fonts.googleapis.com/css2?family=Inter"] });
    expect(d).toContain('<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>');
    expect(d).toContain('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">');
    expect(d).toContain('document.addEventListener("DOMContentLoaded",function(){(function(){console.log(1)})();});');
  });

  it("texto da seção não fecha as tags de estilo e script por dentro", () => {
    const d = documentoDaPrevia({ ...base, estilo: "a{content:'</style>'}", codigo: 'x("</script>")' });
    expect(d).not.toContain("'</style>'");
    expect(d).not.toContain('"</script>"');
  });

  it("endereço externo com aspas não quebra o HTML", () => {
    expect(documentoDaPrevia({ ...base, scripts: ['https://a.com/x.js"onload="alert(1)'] })).not.toContain('"onload="');
  });
});
