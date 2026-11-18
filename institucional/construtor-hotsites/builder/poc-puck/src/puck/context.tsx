import { createContext, useContext } from "react";
import { applyTokens, type Persona } from "../lib/persona";

/** O que toda peça precisa saber além das próprias props. */
/** "miniatura" é a prévia pequena do painel: nada interage e nada grava. */
/** "estatico": gerando o HTML publicado (os <script> vão no HTML; no navegador da POC rodam por efeito). */
/** Se a página aceita inscrição agora (status, datas e vagas), calculado pela página pública. */
export type EstadoInscricao = {
  /** rascunho/agendada: o formulário funciona como prévia. encerrada/esgotada: some o formulário. */
  fechada?: "rascunho" | "agendada" | "encerrada" | "esgotada";
  inscritos: number;
  vagas: number | null;
};

export type PageCtx = {
  persona: Persona;
  mode: "editor" | "publico" | "miniatura";
  pageId: string;
  pageSlug: string;
  estatico?: boolean;
  /** De onde a pessoa veio (licenciado, instagram…), para a inscrição e os Resultados. */
  origem?: string;
  inscricoes?: EstadoInscricao;
};

export const PageContext = createContext<PageCtx>({ persona: {}, mode: "publico", pageId: "", pageSlug: "" });

export const usePageCtx = () => useContext(PageContext);

/** Atalho: aplica {nome} e {cidade} do licenciado ao texto. */
export function useTokens() {
  const { persona } = usePageCtx();
  return (s: string | undefined) => applyTokens(s ?? "", persona);
}
