import { useSyncExternalStore } from "react";
import { Icone } from "./Icone";

/*
 * Tema do builder (claro ou escuro). Sem escolha guardada, segue o sistema.
 * Vale só para a interface do builder: o site do evento e a prévia dele não mudam.
 */
export type Tema = "claro" | "escuro";
const CHAVE = "poc-hotsite:tema";
const ouvintes = new Set<() => void>();
const media = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null);

function guardado(): Tema | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "claro" || v === "escuro" ? v : null;
  } catch {
    return null;
  }
}

const doSistema = (): Tema => (media()?.matches ? "escuro" : "claro");
export const temaAtual = (): Tema => (document.documentElement.dataset.tema === "escuro" ? "escuro" : "claro");

function aplicar(t: Tema) {
  document.documentElement.dataset.tema = t;
  ouvintes.forEach((f) => f());
}

/** Chamado uma vez ao abrir: aplica a escolha guardada ou a do sistema, e acompanha o sistema. */
export function iniciarTema() {
  aplicar(guardado() ?? doSistema());
  media()?.addEventListener("change", () => {
    if (!guardado()) aplicar(doSistema());
  });
}

export function alternarTema() {
  const novo: Tema = temaAtual() === "escuro" ? "claro" : "escuro";
  try {
    localStorage.setItem(CHAVE, novo);
  } catch {
    /* sem armazenamento: vale até fechar a aba */
  }
  aplicar(novo);
}

export function useTema(): Tema {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    temaAtual,
    () => "claro"
  );
}

/** Botão de alternar o tema (lua no claro, sol no escuro). */
export function BotaoTema() {
  const tema = useTema();
  const rotulo = tema === "escuro" ? "Usar modo claro" : "Usar modo escuro";
  return (
    <button className="bt bt-ic" title={rotulo} aria-label={rotulo} onClick={alternarTema}>
      <Icone nome={tema === "escuro" ? "sol" : "lua"} />
    </button>
  );
}
