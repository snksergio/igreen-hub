import type { Seo } from "./seo";

/** Tags do <head> para Google, IAs e cartões de compartilhamento (WhatsApp, redes). */
type Tag = { tag: "meta" | "link"; attrs: Record<string, string> };

function tags(seo: Seo): Tag[] {
  const t: Tag[] = [
    { tag: "meta", attrs: { name: "description", content: seo.description } },
    { tag: "meta", attrs: { name: "robots", content: seo.robots } },
    { tag: "link", attrs: { rel: "canonical", href: seo.canonical } },
    { tag: "meta", attrs: { name: "theme-color", content: "#020604" } },
    { tag: "meta", attrs: { property: "og:type", content: "website" } },
    { tag: "meta", attrs: { property: "og:site_name", content: "iGreen Energy" } },
    { tag: "meta", attrs: { property: "og:locale", content: "pt_BR" } },
    { tag: "meta", attrs: { property: "og:title", content: seo.title } },
    { tag: "meta", attrs: { property: "og:description", content: seo.description } },
    { tag: "meta", attrs: { property: "og:url", content: seo.canonical } },
    { tag: "meta", attrs: { name: "twitter:card", content: seo.image ? "summary_large_image" : "summary" } },
  ];
  if (seo.image) t.push({ tag: "meta", attrs: { property: "og:image", content: seo.image } });
  return t.filter((x) => Object.values(x.attrs).every((v) => v !== ""));
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** JSON dentro de <script>: "<" vira < para ninguém fechar a tag pelo conteúdo. */
const jsonSeguro = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");

export function cabecalhoHtml(seo: Seo): string {
  const linhas = [
    `<title>${esc(seo.title)}</title>`,
    ...tags(seo).map(({ tag, attrs }) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(" ")}>`),
    ...seo.jsonLd.map((j) => `<script type="application/ld+json">${jsonSeguro(j)}</script>`),
  ];
  return linhas.join("\n");
}

/** Versão para a página aberta no navegador. Devolve a função que desfaz. */
export function aplicarNoDocumento(seo: Seo, doc: Document): () => void {
  const tituloAntes = doc.title;
  doc.title = seo.title;
  const criadas: Element[] = [];
  for (const { tag, attrs } of tags(seo)) {
    const el = doc.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    el.setAttribute("data-seo", "");
    doc.head.appendChild(el);
    criadas.push(el);
  }
  for (const j of seo.jsonLd) {
    const s = doc.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-seo", "");
    s.textContent = jsonSeguro(j);
    doc.head.appendChild(s);
    criadas.push(s);
  }
  return () => {
    criadas.forEach((el) => el.remove());
    doc.title = tituloAntes;
  };
}
