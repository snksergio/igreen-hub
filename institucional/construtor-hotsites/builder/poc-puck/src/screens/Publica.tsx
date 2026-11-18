import type { Config } from "@puckeditor/core";
import { Render } from "@puckeditor/core/rsc";
import { useEffect, useMemo } from "react";
import { aplicarNoDocumento } from "../lib/cabecalho";
import { getPageBySlug } from "../lib/pages";
import { parsePersona } from "../lib/persona";
import { montarSeo } from "../lib/seo";
import { PageContext } from "../puck/context";
import { config } from "../puck/config";
import { appBaseUrl } from "../router";


/**
 * Página pública dentro da POC (roda no navegador). O que o Google e as IAs leem de verdade
 * é o HTML estático gerado por lib/estatico.tsx; aqui o <head> é preenchido para conferência.
 */
export function Publica({ slug, query }: { slug: string; query: URLSearchParams }) {
  const page = useMemo(() => getPageBySlug(slug), [slug]);
  const persona = useMemo(() => parsePersona(query), [query]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!page) {
      document.title = "Página não encontrada";
      return;
    }
    const seo = montarSeo({ data: page.data, url: `${appBaseUrl()}#/p/${page.slug}`, nomePagina: page.title });
    return aplicarNoDocumento(seo, document);
  }, [page]);

  if (!page)
    return (
      <main className="hs-404">
        <h1>Página não encontrada</h1>
        <p>O endereço pode ter mudado ou a página saiu do ar.</p>
        <a className="hs-btn" href="#/">
          Voltar ao painel
        </a>
      </main>
    );

  return (
    <PageContext.Provider value={{ persona, mode: "publico", pageId: page.id, pageSlug: page.slug }}>
      <Render config={config as unknown as Config} data={page.data} />
      <a className="pub-back" href="#/">
        ← Painel da POC
      </a>
    </PageContext.Provider>
  );
}
