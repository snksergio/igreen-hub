import { describe, expect, it } from "vitest";
import { envolverCodigo, escoparCss, importarHtml, separarCssGlobal, textoColado } from "./importarHtml";

const PAGINA_DA_IA = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Seção</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <style>
    :root { --cor: #a8ff35; }
    body { margin: 0; font-family: sans-serif; }
    .cartao { color: var(--cor); background: url(img/fundo.png); }
  </style>
</head>
<body>
  <h1 class="titulo">Nossos eletropostos</h1>
  <img src="img/foto.jpg" alt="Foto">
  <div class="cartao">Oi</div>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelector(".cartao").textContent = "pronto";
    });
  </script>
</body>
</html>`;

describe("importarHtml", () => {
  const r = importarHtml(PAGINA_DA_IA, { "foto.jpg": "foto.webp", "fundo.png": "fundo.webp" });

  it("separa conteúdo, CSS e JavaScript", () => {
    expect(r.html).toContain('class="cartao"');
    expect(r.html).not.toMatch(/<script|<style|<head|<body/);
    expect(r.css).toContain(".cartao");
    expect(r.js).toContain("DOMContentLoaded");
  });

  it("troca <h1> por <h2> mantendo atributos e avisa", () => {
    expect(r.html).toContain('<h2 class="titulo">Nossos eletropostos</h2>');
    expect(r.html).not.toContain("<h1");
    expect(r.avisos.join(" ")).toMatch(/h1/);
  });

  it(":root e body passam a valer só na seção", () => {
    expect(r.css).toMatch(/&\s*\{\s*--cor/);
    expect(r.css).not.toMatch(/:root|(^|[\s}])body\s*\{/);
  });

  it("aponta as imagens enviadas junto para os arquivos da seção", () => {
    expect(r.html).toContain('src="arquivo:foto.webp"');
    expect(r.css).toContain("url(arquivo:fundo.webp)");
  });

  it("mantém biblioteca externa, descarta Tailwind pelo CDN e avisa os dois", () => {
    expect(r.scripts).toEqual(["https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"]);
    expect(r.estilos).toEqual(["https://fonts.googleapis.com/css2?family=Inter"]);
    expect(r.avisos.join(" ")).toMatch(/Tailwind/);
  });

  it("aceita só um pedaço de HTML (sem <html>/<body>)", () => {
    const s = importarHtml('<section><p class="x">Oi</p></section>', {});
    expect(s.html).toContain('<p class="x">Oi</p>');
    expect(s.css).toBe("");
    expect(s.js).toBe("");
  });
});

describe("escoparCss", () => {
  it("não mexe em seletores que só contêm a palavra", () => {
    expect(escoparCss(".body-texto { color: red; }")).toBe(".body-texto { color: red; }");
    expect(escoparCss("body.escuro, html { color: red; }")).toBe("&.escuro, & { color: red; }");
  });
});

describe("envolverCodigo", () => {
  it("roda o código com a seção e faz DOMContentLoaded funcionar mesmo com a página já carregada", async () => {
    document.body.innerHTML = '<section id="livre-t"><div class="cartao">antes</div></section>';
    const codigo = envolverCodigo(
      'document.addEventListener("DOMContentLoaded", () => { secao.querySelector(".cartao").textContent = "depois"; });',
      "livre-t"
    );
    new Function(codigo)();
    await new Promise((ok) => setTimeout(ok, 10));
    expect(document.querySelector(".cartao")?.textContent).toBe("depois");
    // depois de rodar, o addEventListener original volta
    expect(document.addEventListener).toBe(Document.prototype.addEventListener);
  });

  it("não deixa o código fechar a tag script", () => {
    expect(envolverCodigo('x("</script>")', "a")).not.toContain("</script>");
  });

  it("window.onload também roda com a página já carregada", async () => {
    document.body.innerHTML = '<section id="livre-o"><p>antes</p></section>';
    new Function(envolverCodigo('window.onload = () => { secao.querySelector("p").textContent = "carregou"; };', "livre-o"))();
    await new Promise((ok) => setTimeout(ok, 10));
    expect(document.querySelector("#livre-o p")?.textContent).toBe("carregou");
    expect(window.onload).toBeNull();
  });

  it("DOMContentLoaded da seção roda antes do load da página (HTML estático)", async () => {
    document.body.innerHTML = '<section id="livre-ordem"><p>-</p></section>';
    // página ainda carregando imagens: DOMContentLoaded já passou, load ainda não
    Object.defineProperty(document, "readyState", { get: () => "interactive", configurable: true });
    try {
      new Function(
        envolverCodigo(
          'document.addEventListener("DOMContentLoaded", () => { secao.querySelector("p").textContent = "dcl"; });\nwindow.onload = () => { secao.querySelector("p").textContent += "+load"; };',
          "livre-ordem"
        )
      )();
      await Promise.resolve(); // fim do <script>: o navegador roda as microtarefas antes do próximo evento
      window.dispatchEvent(new Event("load"));
      expect(document.querySelector("#livre-ordem p")?.textContent).toBe("dcl+load");
    } finally {
      delete (document as unknown as { readyState?: string }).readyState;
      window.onload = null;
    }
  });

  it("funções declaradas ficam disponíveis para onclick do HTML", () => {
    document.body.innerHTML = '<section id="livre-f"></section>';
    new Function(envolverCodigo("function alternarPainel(){ return 1 }", "livre-f"))();
    expect(typeof (window as unknown as Record<string, unknown>).alternarPainel).toBe("function");
  });

  it("não sobrescreve funções do navegador com o mesmo nome", () => {
    document.body.innerHTML = '<section id="livre-g"></section>';
    const original = window.open;
    new Function(envolverCodigo("function open(){ return 1 }", "livre-g"))();
    expect(window.open).toBe(original);
  });
});

describe("separarCssGlobal", () => {
  it("tira @import, @keyframes e @font-face de dentro da seção (CSS aninhado não aceita)", () => {
    const { global, local } = separarCssGlobal(
      `@import url("https://fonts.googleapis.com/css2?family=Inter");
.a { color: red; }
@keyframes giro { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@font-face { font-family: X; src: url(a.woff2); }
@media (max-width: 600px) { .a { color: blue; } }`
    );
    expect(global).toMatch(/^@import url\("https:\/\/fonts\.googleapis\.com\/css2\?family=Inter"\);/);
    expect(global).toContain("@keyframes giro { from { transform: rotate(0); } to { transform: rotate(360deg); } }");
    expect(global).toContain("@font-face { font-family: X; src: url(a.woff2); }");
    expect(local).toContain(".a { color: red; }");
    expect(local).toContain("@media (max-width: 600px) { .a { color: blue; } }");
    expect(local).not.toMatch(/@keyframes|@font-face|@import/);
  });

  it("não se perde com chaves dentro de texto e comentário", () => {
    const { global, local } = separarCssGlobal('.a::after { content: "}"; } /* { */ @keyframes x { to { opacity: 1; } }');
    expect(local).toContain('.a::after { content: "}"; }');
    expect(global).toContain("@keyframes x { to { opacity: 1; } }");
  });
});

describe("importação com arquivos juntos", () => {
  it("usa o .css e o .js enviados no lugar dos links e avisa o que faltou", () => {
    const r = importarHtml(
      `<html><head><link rel="stylesheet" href="css/estilo.css"></head>
<body><img src="img/falta.png" alt="x"><p>Oi</p><script src="app.js"></script></body></html>`,
      {},
      { "estilo.css": "body { color: red; }", "app.js": "console.log('app')" }
    );
    expect(r.css).toContain("& { color: red; }");
    expect(r.js).toContain("console.log('app')");
    expect(r.avisos.join(" ")).toMatch(/falta\.png/);
    expect(r.avisos.join(" ")).not.toMatch(/estilo\.css|app\.js/);
  });

  it("aceita só .css e .js, sem HTML", () => {
    const r = importarHtml("", {}, { "a.css": ".x { color: red; }", "b.js": "1" });
    expect(r.css).toBe(".x { color: red; }");
    expect(r.js).toBe("1");
  });
});

describe("textoColado", () => {
  it("resposta da IA em blocos ```html ```css ```js vira um HTML só", () => {
    const t = textoColado("Aqui está:\n```html\n<p>Oi</p>\n```\nCSS:\n```css\n.x{color:red}\n```\n```javascript\nconsole.log(1)\n```");
    const r = importarHtml(t);
    expect(r.html).toBe("<p>Oi</p>");
    expect(r.css).toBe(".x{color:red}");
    expect(r.js).toBe("console.log(1)");
  });

  it("texto sem blocos passa direto", () => {
    expect(textoColado("<p>Oi</p>")).toBe("<p>Oi</p>");
  });
});
