import type { PuckAction, useGetPuck } from "@puckeditor/core";
import { createContext, useContext, useSyncExternalStore, type MutableRefObject } from "react";
import type { Alvo } from "../../lib/seo";

/** Comandos do Puck entregues para fora dele (os botões do painel SEO usam). */
export type ApiPuck = { dispatch: (acao: PuckAction) => void; getPuck: ReturnType<typeof useGetPuck> };

/**
 * O que as partes do editor (topo, painel da esquerda, cabeçalho dos campos) precisam da tela.
 * Elas rodam dentro do Puck, como overrides fixos; o que muda chega por este contexto.
 */
export type EditorCtx = {
  pageId: string;
  pageSlug: string;
  nome: string;
  setNome: (v: string) => void;
  salvarNome: () => void;
  slug: string;
  setSlug: (v: string) => void;
  confirmarSlug: () => void;
  salvo: string;
  conflito: boolean;
  comoLicenciado: boolean;
  alternarLicenciado: () => void;
  seoAberto: boolean;
  alternarSeo: () => void;
  irPara: (alvo: Alvo) => void;
  apiPuck: MutableRefObject<ApiPuck | null>;
};

export const EditorContext = createContext<EditorCtx | null>(null);

export function useEditor(): EditorCtx {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor fora do editor");
  return ctx;
}

/* Aba do painel da esquerda: o topo também troca (botões de peça e de imagens). */
export type Aba = "estrutura" | "pecas" | "imagens";
let abaAtual: Aba = "estrutura";
const ouvintes = new Set<() => void>();

export function setAba(a: Aba) {
  abaAtual = a;
  ouvintes.forEach((f) => f());
}

export function useAba(): Aba {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => abaAtual
  );
}
