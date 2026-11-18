import type { Config } from "@puckeditor/core";
import { Render } from "@puckeditor/core/rsc";
import { useEffect, useMemo } from "react";
import "../form/form.css";
import { aplicarNoDocumento } from "../lib/cabecalho";
import { origemDoAcesso, registrarUmaVez } from "../lib/eventos";
import { estadoInscricoes } from "../lib/pagina";
import { dataPorExtenso } from "../lib/meta";
import { metaDe } from "../lib/painel";
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
  const origem = useMemo(() => origemDoAcesso(query, document.referrer, persona.ref), [query, persona.ref]);
  // Status, datas e vagas valendo na página (2.7).
  const estado = useMemo(() => {
    if (!page) return null;
    return { meta: metaDe(page), ...estadoInscricoes(page) };
  }, [page]);

  // Visita conta uma vez por aba, só para página que está no ar.
  useEffect(() => {
    if (page && estado && estado.status !== "rascunho" && estado.status !== "agendada")
      registrarUmaVez({ pageId: page.id, tipo: "visita", origem, ref: persona.ref });
  }, [page, estado, origem, persona.ref]);

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
    <PageContext.Provider value={{ persona, mode: "publico", pageId: page.id, pageSlug: page.slug, origem, inscricoes: estado?.inscricoes }}>
      {estado && (estado.status !== "publicada" || estado.inscricoes.fechada === "encerrada") && (
        <p className="pub-aviso" role="status">
          <i />
          {estado.status === "rascunho" && "Rascunho: ainda não está no ar. Inscrições de teste não são gravadas."}
          {estado.status === "agendada" && `Agendada: entra no ar ${dataPorExtenso(estado.meta.publicarEm)}. Inscrições de teste não são gravadas.`}
          {estado.status === "encerrada" && "Inscrições encerradas."}
          {estado.status === "publicada" && estado.inscricoes.fechada === "encerrada" && "Inscrições encerradas pelo prazo do formulário."}
          {estado.status === "arquivada" && "Página arquivada: inscrições encerradas."}
        </p>
      )}
      <Render config={config as unknown as Config} data={page.data} />
      <a className="pub-back" href="#/">
        ← Painel da POC
      </a>
    </PageContext.Provider>
  );
}
