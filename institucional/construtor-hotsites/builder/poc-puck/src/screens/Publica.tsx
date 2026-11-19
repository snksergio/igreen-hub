import type { Config, Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core/rsc";
import { useEffect, useMemo, useState } from "react";
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

/** O que a prévia escuta: quando o construtor salva página ou formulário, ela se redesenha. */
const CHAVES_PREVIA = ["poc-hotsite:pages", "poc-hotsite:formularios"];

/**
 * Página pública dentro da POC (roda no navegador). O que o Google e as IAs leem de verdade
 * é o HTML estático gerado por lib/estatico.tsx; aqui o <head> é preenchido para conferência.
 *
 * Com `?previa=1` (dentro das telas de prévia): nada é gravado, os avisos da POC somem e a página
 * se atualiza sozinha quando outra aba salva. Com `&bloco=<id>`, mostra só aquela seção.
 */
export function Publica({ slug, query }: { slug: string; query: URLSearchParams }) {
  const previa = query.get("previa") === "1";
  const bloco = query.get("bloco");
  const [versao, setVersao] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const page = useMemo(() => getPageBySlug(slug), [slug, versao]);
  const persona = useMemo(() => parsePersona(query), [query]);
  const origem = useMemo(() => origemDoAcesso(query, document.referrer, persona.ref), [query, persona.ref]);
  // Status, datas e vagas valendo na página (2.7).
  const estado = useMemo(() => {
    if (!page) return null;
    return { meta: metaDe(page), ...estadoInscricoes(page) };
  }, [page]);
  const data = useMemo<Data | undefined>(() => {
    if (!page) return undefined;
    if (!bloco) return page.data;
    return { ...page.data, content: (page.data.content ?? []).filter((b) => b.props?.id === bloco) };
  }, [page, bloco]);

  // Visita conta uma vez por aba, só para página que está no ar (a prévia não conta).
  useEffect(() => {
    if (previa) return;
    if (page && estado && estado.status !== "rascunho" && estado.status !== "agendada")
      registrarUmaVez({ pageId: page.id, tipo: "visita", origem, ref: persona.ref });
  }, [page, estado, origem, persona.ref, previa]);

  // Prévia: outra aba (o construtor) salvou → redesenha com o que mudou.
  useEffect(() => {
    if (!previa) return;
    const mudou = (e: StorageEvent) => {
      if (e.key && CHAVES_PREVIA.includes(e.key)) setVersao((v) => v + 1);
    };
    window.addEventListener("storage", mudou);
    return () => window.removeEventListener("storage", mudou);
  }, [previa]);

  // Prévia: barra de rolagem fina e discreta, como no celular, em vez da clara padrão do navegador.
  useEffect(() => {
    if (!previa) return;
    const estilo = document.createElement("style");
    estilo.textContent = "html{scrollbar-width:thin;scrollbar-color:rgba(128,132,140,.5) transparent}";
    document.head.appendChild(estilo);
    return () => estilo.remove();
  }, [previa]);

  // Ao abrir: volta ao topo e preenche o <head>. Só quando troca de página, não a cada atualização da prévia.
  const existe = Boolean(page);
  useEffect(() => {
    window.scrollTo(0, 0);
    const p = getPageBySlug(slug);
    if (!p) {
      document.title = "Página não encontrada";
      return;
    }
    const seo = montarSeo({ data: p.data, url: `${appBaseUrl()}#/p/${p.slug}`, nomePagina: p.title });
    return aplicarNoDocumento(seo, document);
  }, [slug, existe]);

  if (!page || !data)
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
    <PageContext.Provider value={{ persona, mode: previa ? "previa" : "publico", pageId: page.id, pageSlug: page.slug, origem, inscricoes: estado?.inscricoes }}>
      {!previa && estado && (estado.status !== "publicada" || estado.inscricoes.fechada === "encerrada") && (
        <p className="pub-aviso" role="status">
          <i />
          {estado.status === "rascunho" && "Rascunho: ainda não está no ar. Inscrições de teste não são gravadas."}
          {estado.status === "agendada" && `Agendada: entra no ar ${dataPorExtenso(estado.meta.publicarEm)}. Inscrições de teste não são gravadas.`}
          {estado.status === "encerrada" && "Inscrições encerradas."}
          {estado.status === "publicada" && estado.inscricoes.fechada === "encerrada" && "Inscrições encerradas pelo prazo do formulário."}
          {estado.status === "arquivada" && "Página arquivada: inscrições encerradas."}
        </p>
      )}
      <Render config={config as unknown as Config} data={data} />
      {!previa && (
        <a className="pub-back" href="#/">
          ← Painel da POC
        </a>
      )}
    </PageContext.Provider>
  );
}
