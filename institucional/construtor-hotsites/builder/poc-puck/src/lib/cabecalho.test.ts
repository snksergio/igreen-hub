import { describe, expect, it } from "vitest";
import { aplicarNoDocumento, cabecalhoHtml } from "./cabecalho";
import type { Seo } from "./seo";

const seo: Seo = {
  title: 'Encontro "iGreen" & amigos',
  description: "Descrição <curta>",
  canonical: "https://ex.com/encontro",
  robots: "index, follow",
  image: "https://ex.com/a.jpg",
  jsonLd: [{ "@context": "https://schema.org", "@type": "Event", name: "</script><script>alert(1)</script>" }],
  avisos: [],
};

describe("cabecalhoHtml", () => {
  const html = cabecalhoHtml(seo);
  it("traz título, descrição, canônico, robots e Open Graph escapados", () => {
    expect(html).toContain("<title>Encontro &quot;iGreen&quot; &amp; amigos</title>");
    expect(html).toContain('<meta name="description" content="Descrição &lt;curta&gt;">');
    expect(html).toContain('<link rel="canonical" href="https://ex.com/encontro">');
    expect(html).toContain('<meta name="robots" content="index, follow">');
    expect(html).toContain('<meta property="og:image" content="https://ex.com/a.jpg">');
    expect(html).toContain('<meta property="og:locale" content="pt_BR">');
  });
  it("JSON-LD não deixa fechar a tag script", () => {
    expect(html).toContain('<script type="application/ld+json">');
    expect(html).not.toContain("</script><script>alert(1)");
    expect(html).toContain("\\u003c/script>");
  });
});

describe("aplicarNoDocumento", () => {
  it("coloca e depois remove as tags no head", () => {
    const remover = aplicarNoDocumento(seo, document);
    expect(document.title).toBe(seo.title);
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(seo.description);
    expect(document.head.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    remover();
    expect(document.head.querySelectorAll("[data-seo]")).toHaveLength(0);
  });
});
