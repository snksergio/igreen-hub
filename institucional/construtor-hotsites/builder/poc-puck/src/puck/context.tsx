import { createContext, useContext } from "react";
import { applyTokens, type Persona } from "../lib/persona";

/** O que toda peça precisa saber além das próprias props. */
/** "miniatura" é a prévia pequena do painel: nada interage e nada grava. */
/** "estatico": gerando o HTML publicado (os <script> vão no HTML; no navegador da POC rodam por efeito). */
export type PageCtx = {
  persona: Persona;
  mode: "editor" | "publico" | "miniatura";
  pageId: string;
  pageSlug: string;
  estatico?: boolean;
};

export const PageContext = createContext<PageCtx>({ persona: {}, mode: "publico", pageId: "", pageSlug: "" });

export const usePageCtx = () => useContext(PageContext);

/** Atalho: aplica {nome} e {cidade} do licenciado ao texto. */
export function useTokens() {
  const { persona } = usePageCtx();
  return (s: string | undefined) => applyTokens(s ?? "", persona);
}
