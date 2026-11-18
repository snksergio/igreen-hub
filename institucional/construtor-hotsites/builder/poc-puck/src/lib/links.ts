import { readJSON, writeJSON } from "./store";
import { uid } from "./slug";

/* Links de licenciado de cada página (Etapa 2.5). O licenciado recebe o link para divulgar
   e um segundo link, só de números, sem nome nem contato de ninguém (decisão 0.2). */

export type LinkLicenciado = {
  id: string;
  pageId: string;
  /** Código do licenciado: vai no link (?ref=) e identifica as inscrições. */
  ref: string;
  nome: string;
  cidade?: string;
  whats?: string;
  criadoEm: number;
};

const KEY = "poc-hotsite:links";

function load(): LinkLicenciado[] {
  const v = readJSON<LinkLicenciado[]>(KEY);
  return Array.isArray(v) ? v : [];
}

export function listarLinks(pageId: string): LinkLicenciado[] {
  return load()
    .filter((l) => l.pageId === pageId)
    .sort((a, b) => b.criadoEm - a.criadoEm);
}

export function linkPorRef(pageId: string, ref: string): LinkLicenciado | undefined {
  const r = ref.trim().toUpperCase();
  return load().find((l) => l.pageId === pageId && l.ref.toUpperCase() === r);
}

/** O código fica em maiúsculas, sem espaço; repetir o código na mesma página dá erro. */
export function criarLink(pageId: string, dados: { ref: string; nome: string; cidade?: string; whats?: string }): LinkLicenciado {
  const ref = dados.ref.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
  if (!ref) throw new Error("Informe o código do licenciado.");
  if (!dados.nome.trim()) throw new Error("Informe o nome do licenciado.");
  if (linkPorRef(pageId, ref)) throw new Error(`O código ${ref} já tem link nesta página.`);
  const link: LinkLicenciado = {
    id: uid(),
    pageId,
    ref,
    nome: dados.nome.trim().slice(0, 80),
    cidade: dados.cidade?.trim().slice(0, 80) || undefined,
    whats: dados.whats?.replace(/\D/g, "").slice(0, 13) || undefined,
    criadoEm: Date.now(),
  };
  writeJSON(KEY, [...load(), link]);
  return link;
}

export function addLinks(lista: LinkLicenciado[]): void {
  writeJSON(KEY, [...load(), ...lista]);
}

export function removerLink(id: string): void {
  writeJSON(KEY, load().filter((l) => l.id !== id));
}

export function removeLinksPorPagina(pageIds: string[]): void {
  const alvo = new Set(pageIds);
  writeJSON(KEY, load().filter((l) => !alvo.has(l.pageId)));
}
