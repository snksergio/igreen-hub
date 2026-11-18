import { useState } from "react";
import { download } from "../lib/download";
import type { PageRecord } from "../lib/pages";
import { montarSeo, type Alvo } from "../lib/seo";

/** Endereço de exemplo: o domínio de verdade sai da decisão do MVP (subdomínio, já que o site oficial está no Wix). */
export const BASE_EXEMPLO = "https://eventos.igreenenergy.com.br";

const ICONE = { ok: "✓", atencao: "!", info: "i" } as const;

/** Painel lateral do editor: prévia no Google, conferência de SEO e dados estruturados. */
export function PainelSeo({ page, onFechar, onIr }: { page: PageRecord; onFechar: () => void; onIr: (alvo: Alvo) => void }) {
  const url = `${BASE_EXEMPLO}/${page.slug}`;
  const seo = montarSeo({ data: page.data, url, nomePagina: page.title });
  const [gerando, setGerando] = useState(false);
  const pendencias = seo.avisos.filter((a) => a.nivel === "atencao").length;

  async function baixar() {
    setGerando(true);
    try {
      // Carregado só aqui: o gerador traz o renderizador de servidor do React.
      const { gerarHtmlEstatico } = await import("../lib/estatico");
      download(`${page.slug}.html`, gerarHtmlEstatico(page, url).html, "text/html;charset=utf-8");
    } finally {
      setGerando(false);
    }
  }

  return (
    <aside className="seo" aria-label="SEO e leitura por IA">
      <div className="seo-topo">
        <strong>SEO e IA</strong>
        <button className="app-btn app-btn--ghost" onClick={onFechar}>
          Fechar
        </button>
      </div>

      <section>
        <h3>Como aparece no Google</h3>
        <div className="seo-serp">
          <span className="seo-serp__url">
            eventos.igreenenergy.com.br › {page.slug}
          </span>
          <span className="seo-serp__titulo">{seo.title}</span>
          <span className="seo-serp__desc">{seo.description || "Sem descrição: o Google escolhe um trecho da página."}</span>
        </div>
        <p className="app-muted seo-nota">Endereço de exemplo. O domínio de verdade sai da decisão do MVP.</p>
      </section>

      <section>
        <h3>Conferência {pendencias ? `(${pendencias} para ajustar)` : "(tudo certo)"}</h3>
        <ul className="seo-lista">
          {seo.avisos.map((a) => (
            <li key={a.texto} data-nivel={a.nivel}>
              <span aria-hidden="true">{ICONE[a.nivel]}</span>
              <div className="seo-item">
                {a.texto}
                {a.alvo && (
                  <button className="seo-ir" onClick={() => onIr(a.alvo!)}>
                    {a.acao ?? "Ajustar"} →
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <details className="seo-json">
        <summary>Dados estruturados para Google e IAs ({seo.jsonLd.length})</summary>
        <pre>{JSON.stringify(seo.jsonLd, null, 2)}</pre>
      </details>

      <button className="app-btn" onClick={baixar} disabled={gerando}>
        {gerando ? "Gerando…" : "Baixar HTML estático"}
      </button>
      <p className="app-muted seo-nota">
        É a página como o MVP vai publicar: conteúdo já no HTML, lido pelo Google e por IAs sem rodar JavaScript.
      </p>
    </aside>
  );
}
