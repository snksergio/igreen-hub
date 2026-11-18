import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { importarHtml } from "../../lib/importarHtml";
import { PageContext } from "../context";
import { lerExternos, SecaoLivre, type SecaoLivreProps } from "./SecaoLivre";

const base = { ...(SecaoLivre.defaultProps as SecaoLivreProps), id: "abc" };
const resolver = (props: SecaoLivreProps & { id: string }, changed: Record<string, boolean>) =>
  SecaoLivre.resolveData!({ props, readOnly: {} } as never, { changed, trigger: "replace" } as never) as {
    props: SecaoLivreProps;
  };

describe("Seção livre: importar", () => {
  const importado = importarHtml(
    '<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script><style>.x{color:red}</style><p class="x">Oi</p><script>console.log(1)</script>'
  );
  const arquivos = [{ nome: "foto.webp", src: "data:image/webp;base64,AAA" }];

  it("distribui o arquivo importado nos campos e guarda só o resumo", () => {
    const r = resolver(
      { ...base, arquivos: [{ nome: "foto.webp", src: "velha" }, { nome: "outra.webp", src: "x" }], importacao: { pendente: { ...importado, arquivos, origem: "secao.html" } } },
      { importacao: true }
    );
    expect(r.props.html).toBe('<p class="x">Oi</p>');
    expect(r.props.css).toBe(".x{color:red}");
    expect(r.props.js).toBe("console.log(1)");
    expect(r.props.externos).toBe("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js");
    // mesmo nome: vale o novo; os outros ficam
    expect(r.props.arquivos).toEqual([{ nome: "outra.webp", src: "x" }, ...arquivos]);
    expect(r.props.importacao).toEqual({ resumo: { origem: "secao.html", avisos: importado.avisos } });
  });

  it("o resumo não reaplica a importação (o Puck marca como mudado na edição seguinte)", () => {
    const props = { ...base, html: "<p>editado à mão</p>", importacao: { resumo: { origem: "a.html", avisos: [] } } };
    expect(resolver(props, { importacao: true, html: true }).props.html).toBe("<p>editado à mão</p>");
  });
});

describe("Seção livre: bibliotecas externas", () => {
  it("separa estilos e scripts e ignora o que não é https", () => {
    expect(
      lerExternos("https://fonts.googleapis.com/css2?family=Inter\nhttp://inseguro.js\nhttps://unpkg.com/aos@2.3.1/dist/aos.css\n\nhttps://unpkg.com/aos@2.3.1/dist/aos.js")
    ).toEqual({
      estilos: ["https://fonts.googleapis.com/css2?family=Inter", "https://unpkg.com/aos@2.3.1/dist/aos.css"],
      scripts: ["https://unpkg.com/aos@2.3.1/dist/aos.js"],
    });
  });
});

describe("Seção livre: HTML publicado", () => {
  const props = {
    ...base,
    html: "<p>Oi</p>",
    css: "@keyframes giro { to { transform: rotate(1turn); } }\n.x { animation: giro 1s; }",
    js: "console.log(1)",
    externos: "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js\nhttps://fonts.googleapis.com/css2?family=Inter",
  };
  const render = (estatico: boolean) =>
    renderToStaticMarkup(
      <PageContext.Provider value={{ persona: {}, mode: "publico", pageId: "p", pageSlug: "p", estatico }}>
        {SecaoLivre.render(props as never)}
      </PageContext.Provider>
    );

  it("no HTML estático: biblioteca com defer, código esperando ela, @keyframes fora do aninhado", () => {
    const h = render(true);
    expect(h).toContain('<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer="">');
    expect(h).toContain('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter"/>');
    expect(h).toMatch(/document\.addEventListener\("DOMContentLoaded",function\(\)\{\(function\(\)\{var secao=document\.getElementById\("livre-abc"\)/);
    expect(h).toMatch(/<style>@keyframes giro \{ to \{ transform: rotate\(1turn\); \} \}\n#livre-abc\{\.x \{ animation: giro 1s; \}\}<\/style>/);
  });

  it("na página aberta pela POC não vai <script> no HTML (quem roda é o efeito)", () => {
    expect(render(false)).not.toContain("<script");
  });
});

describe("Seção livre: no editor", () => {
  const noEditor = (p: Partial<SecaoLivreProps>) =>
    renderToStaticMarkup(
      <PageContext.Provider value={{ persona: {}, mode: "editor", pageId: "p", pageSlug: "p" }}>
        {SecaoLivre.render({ ...base, ...p } as never)}
      </PageContext.Provider>
    );

  it("com JavaScript, mostra a prévia isolada (onde o código roda)", () => {
    const h = noEditor({ html: "<p>Oi</p>", js: "console.log(1)" });
    expect(h).toContain("<iframe");
    expect(h).toContain('title="Prévia da Seção livre com JavaScript"');
    expect(h).not.toContain("<script");
  });

  it("só com biblioteca externa também usa a prévia isolada", () => {
    expect(noEditor({ js: "", externos: "https://unpkg.com/aos@2.3.1/dist/aos.js" })).toContain("<iframe");
  });

  it("sem JavaScript, continua a seção normal", () => {
    const h = noEditor({ html: "<p>Oi</p>", js: "" });
    expect(h).not.toContain("<iframe");
    expect(h).toContain('<section id="livre-abc"');
  });
});
