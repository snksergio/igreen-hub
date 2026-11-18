import type { Config } from "@puckeditor/core";
import { Render } from "@puckeditor/core/rsc";
import { renderToStaticMarkup } from "react-dom/server";
import css from "../hotsite.css?inline";
import cssLive from "../live/live.css?inline";
import runtimeLive from "../live/comportamentos.js?raw";
import { PageContext } from "../puck/context";
import { config } from "../puck/config";
import { cabecalhoHtml } from "./cabecalho";
import runtime from "./estatico-runtime.js?raw";
import type { PageRecord } from "./pages";
import { montarSeo, type Seo } from "./seo";

/*
 * Gera a página publicada como HTML pronto, do jeito que o MVP vai servir:
 * conteúdo já no HTML (Google e IAs leem sem rodar JavaScript), <head> com SEO
 * e dados estruturados, CSS do hotsite embutido e um script pequeno só para
 * animação, contagem, simulador e vídeo.
 */
/** Fonte do kit iGreen Live (Instrument Sans), só nas páginas que usam as peças Live. */
const FONTE_LIVE = [
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">',
  "",
].join("\n");

export function gerarHtmlEstatico(page: PageRecord, url: string): { html: string; seo: Seo } {
  const seo = montarSeo({ data: page.data, url, nomePagina: page.title });
  // Peças do kit iGreen Live: levam o CSS, a fonte e o script do kit (só quando a página usa alguma).
  const temLive = (page.data.content ?? []).some((b) => String(b.type).startsWith("Live"));
  const corpo = renderToStaticMarkup(
    <PageContext.Provider value={{ persona: {}, mode: "publico", pageId: page.id, pageSlug: page.slug, estatico: true }}>
      <Render config={config as unknown as Config} data={page.data} />
    </PageContext.Provider>
  );
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%278%27 fill=%27%23020604%27/%3E%3Ccircle cx=%2716%27 cy=%2716%27 r=%277%27 fill=%27%23a8ff35%27/%3E%3C/svg%3E">
${cabecalhoHtml(seo)}
${temLive ? FONTE_LIVE : ""}<style>${css}${temLive ? cssLive : ""}</style>
</head>
<body>
${corpo}
<script>${runtime}</script>${temLive ? `
<script>${runtimeLive}</script>` : ""}
</body>
</html>
`;
  return { html, seo };
}

/** sitemap.xml das páginas publicadas que podem aparecer no Google. */
export function gerarSitemap(itens: { url: string; atualizado: number; indexar: boolean }[]): string {
  const urls = itens
    .filter((i) => i.indexar)
    .map((i) => `  <url><loc>${i.url}</loc><lastmod>${new Date(i.atualizado).toISOString().slice(0, 10)}</lastmod></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * robots.txt que deixa buscadores e robôs de IA lerem as páginas de evento.
 * (A política final é da iGreen: ver o achado do bloqueio da Cloudflare.)
 */
export function gerarRobots(sitemapUrl: string): string {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapUrl}`, ""].join("\n");
}

/** llms.txt: resumo em texto para IAs. É uma proposta de padrão (llmstxt.org), não regra do Google. */
export function gerarLlmsTxt(itens: { titulo: string; url: string; descricao: string }[]): string {
  return [
    "# Eventos iGreen Energy",
    "",
    "> Páginas oficiais de eventos e campanhas da iGreen Energy. Dados de data, local e organizador estão marcados em schema.org (Event) em cada página.",
    "",
    "## Páginas",
    ...itens.map((i) => `- [${i.titulo}](${i.url}): ${i.descricao}`),
    "",
  ].join("\n");
}
