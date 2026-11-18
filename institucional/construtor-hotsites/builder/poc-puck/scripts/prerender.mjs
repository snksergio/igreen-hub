/*
 * Gera o HTML estático dos exemplos em dist/estatico/<slug>/index.html, mais sitemap.xml,
 * robots.txt e llms.txt. É o que o MVP faria ao publicar uma página.
 * Uso: npm run build:estatico   (BASE_URL muda o endereço usado no canônico e no sitemap)
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createServer } from "vite";

const BASE = (process.env.BASE_URL ?? "http://localhost:5192/estatico").replace(/\/$/, "");
const SAIDA = "dist/estatico";

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
try {
  const { gerarHtmlEstatico, gerarSitemap, gerarRobots, gerarLlmsTxt } = await vite.ssrLoadModule("/src/lib/estatico.tsx");
  const { EXAMPLES } = await vite.ssrLoadModule("/src/templates.ts");
  const itens = [];

  for (const [i, e] of EXAMPLES.entries()) {
    const data = JSON.parse(JSON.stringify(e.data));
    data.content = data.content.map((c, j) => ({ ...c, props: { ...c.props, id: `${c.type}-${j}` } }));
    const page = { id: `exemplo-${i}`, slug: e.slug, title: e.title, templateId: e.templateId, data, updatedAt: Date.now() };
    const url = `${BASE}/${e.slug}/`;
    const { html, seo } = gerarHtmlEstatico(page, url);
    await mkdir(join(SAIDA, e.slug), { recursive: true });
    await writeFile(join(SAIDA, e.slug, "index.html"), html);
    itens.push({ url, titulo: seo.title, descricao: seo.description, atualizado: page.updatedAt, indexar: !seo.robots.startsWith("noindex") });
    console.log(`ok ${e.slug}: ${(html.length / 1024).toFixed(1)} KB, ${seo.jsonLd.length} blocos de dados estruturados`);
  }

  await writeFile(join(SAIDA, "sitemap.xml"), gerarSitemap(itens));
  // robots.txt e llms.txt valem na raiz do domínio: no teste local, a raiz é dist/.
  await writeFile(join("dist", "robots.txt"), gerarRobots(`${BASE}/sitemap.xml`));
  await writeFile(join("dist", "llms.txt"), gerarLlmsTxt(itens));
  console.log(`ok ${SAIDA}/sitemap.xml, dist/robots.txt, dist/llms.txt`);
} finally {
  await vite.close();
}
