import type { Data } from "@puckeditor/core";
import { EXAMPLES, TEMPLATES } from "../templates";
import { slugify, uid } from "./slug";
import type { MetaPagina } from "./meta";
import { readJSON, writeJSON } from "./store";

export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  templateId: string;
  data: Data;
  updatedAt: number;
  /** Status, datas e configurações. Página antiga, sem meta, conta como publicada. */
  meta?: MetaPagina;
};

const KEY = "poc-hotsite:pages";

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** Cada peça precisa de id único dentro da página; ao criar ou duplicar, todos são refeitos. */
function freshIds(data: Data): Data {
  const d = clone(data);
  d.content = (d.content ?? []).map((c) => ({ ...c, props: { ...c.props, id: `${c.type}-${uid()}` } }));
  return d;
}

function isPage(v: unknown): v is PageRecord {
  const p = v as PageRecord;
  return Boolean(p && typeof p.id === "string" && typeof p.slug === "string" && Array.isArray(p.data?.content));
}

function examples(): PageRecord[] {
  return EXAMPLES.map((e, i) => ({
    id: uid(),
    slug: e.slug,
    title: e.title,
    templateId: e.templateId,
    data: freshIds(e.data),
    updatedAt: Date.now() - i,
  }));
}

/** Quais exemplos o painel já ofereceu (para um exemplo novo entrar uma vez só). */
const KEY_SEMEADOS = "poc-hotsite:exemplos-semeados";
/** Os exemplos que existiam antes de o painel guardar essa lista. */
const EXEMPLOS_ANTIGOS = ["evento-thiago-bh", "live-mobi", "migre-a-bandeira"];

function load(): PageRecord[] {
  const v = readJSON<unknown>(KEY);
  if (!Array.isArray(v)) {
    const ex = examples();
    writeJSON(KEY, ex);
    writeJSON(KEY_SEMEADOS, EXAMPLES.map((e) => e.slug));
    return ex;
  }
  return comExemplosNovos(v.filter(isPage));
}

/**
 * Exemplo novo (como a demo do kit iGreen Live) entra no topo para quem já tinha páginas salvas,
 * uma vez só: se a pessoa apagar, não volta. Endereço já usado por outra página não é tocado.
 */
function comExemplosNovos(pages: PageRecord[]): PageRecord[] {
  const lista = readJSON<unknown>(KEY_SEMEADOS);
  const semeados = new Set(Array.isArray(lista) ? (lista as string[]) : EXEMPLOS_ANTIGOS);
  const faltam = EXAMPLES.filter((e) => !semeados.has(e.slug));
  if (!faltam.length) {
    if (!Array.isArray(lista)) writeJSON(KEY_SEMEADOS, [...semeados]);
    return pages;
  }
  const usados = new Set(pages.map((p) => p.slug));
  const entram: PageRecord[] = faltam
    .filter((e) => !usados.has(e.slug))
    .map((e) => ({ id: uid(), slug: e.slug, title: e.title, templateId: e.templateId, data: freshIds(e.data), updatedAt: Date.now() }));
  const tudo = [...entram, ...pages];
  if (entram.length) writeJSON(KEY, tudo);
  writeJSON(KEY_SEMEADOS, [...semeados, ...faltam.map((e) => e.slug)]);
  return tudo;
}

function store(pages: PageRecord[]): boolean {
  return writeJSON(KEY, pages);
}

function uniqueSlug(wanted: string, pages: PageRecord[], exceptId?: string): string {
  const base = slugify(wanted);
  const taken = new Set(pages.filter((p) => p.id !== exceptId).map((p) => p.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export function listPages(): PageRecord[] {
  return load().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getPage(id: string): PageRecord | undefined {
  return load().find((p) => p.id === id);
}

export function getPageBySlug(slug: string): PageRecord | undefined {
  return load().find((p) => p.slug === slug);
}

/** A página foi salva (em outra aba, por exemplo) depois da versão que está aberta aqui? */
export function alteradaEmOutroLugar(id: string, versaoAberta: number): boolean {
  const atual = getPage(id);
  return Boolean(atual && atual.updatedAt > versaoAberta);
}

/** `persistido: false` quando o navegador ficou sem espaço: a edição vale só até fechar a aba. */
export function savePage(page: PageRecord): PageRecord & { persistido: boolean } {
  const pages = load();
  const { persistido: _ignorar, ...limpa } = page as PageRecord & { persistido?: boolean };
  const next: PageRecord = { ...limpa, updatedAt: Date.now() };
  const i = pages.findIndex((p) => p.id === page.id);
  if (i >= 0) pages[i] = next;
  else pages.push(next);
  return { ...next, persistido: store(pages) };
}

function insert(title: string, templateId: string, data: Data, slugBase = title, meta: MetaPagina = { status: "rascunho" }): PageRecord {
  const pages = load();
  const page: PageRecord = {
    id: uid(),
    slug: uniqueSlug(slugBase, pages),
    title: title.trim() || "Nova página",
    templateId,
    data: freshIds(data),
    updatedAt: Date.now(),
    meta,
  };
  store([...pages, page]);
  return page;
}

export function createPage(templateId: string, title: string): PageRecord {
  const t = TEMPLATES.find((x) => x.id === templateId) ?? TEMPLATES.find((x) => x.id === "evento")!;
  const data = clone(t.data);
  data.root = { ...data.root, props: { ...(data.root?.props ?? {}), titulo: title } } as Data["root"];
  return insert(title, t.id, data);
}

export function duplicatePage(id: string): PageRecord {
  const src = getPage(id);
  if (!src) throw new Error("Página não encontrada");
  // A cópia nasce rascunho, com as mesmas configurações; as datas de publicar e encerrar não vêm junto.
  const { publicarEm: _p, encerrarEm: _e, ...resto } = src.meta ?? { status: "publicada" };
  return insert(src.title, src.templateId, src.data, src.title, { ...resto, status: "rascunho" });
}

/** Junta as mudanças na meta da página (status, datas, vagas, responsáveis…). */
export function setMeta(id: string, patch: Partial<MetaPagina>): PageRecord {
  const pages = load();
  const page = pages.find((p) => p.id === id);
  if (!page) throw new Error("Página não encontrada");
  page.meta = { status: "publicada", ...(page.meta ?? {}), ...patch };
  page.updatedAt = Date.now();
  store(pages);
  return page;
}

/** Nome da página no painel e campos do root (título no Google, descrição, imagem, indexar). */
export function atualizarPagina(id: string, mudar: { title?: string; root?: Record<string, unknown> }): PageRecord {
  const pages = load();
  const page = pages.find((p) => p.id === id);
  if (!page) throw new Error("Página não encontrada");
  if (mudar.title !== undefined) page.title = mudar.title.trim() || page.title;
  if (mudar.root) {
    const root = (page.data.root ?? {}) as { props?: Record<string, unknown> };
    page.data = { ...page.data, root: { ...root, props: { ...(root.props ?? {}), ...mudar.root } } as Data["root"] };
  }
  page.updatedAt = Date.now();
  store(pages);
  return page;
}

type Peca = { type: string; props: Record<string, unknown> };

/** Troca props de peças da página (ex.: o formulário que a peça de inscrição usa). */
export function atualizarPecas(id: string, mudar: (peca: Peca) => Record<string, unknown> | undefined): void {
  const pages = load();
  const page = pages.find((p) => p.id === id);
  if (!page) return;
  let mudou = false;
  const content = (page.data.content ?? []).map((c) => {
    const novo = mudar(c as unknown as Peca);
    if (!novo) return c;
    mudou = true;
    return { ...c, props: { ...c.props, ...novo } };
  });
  if (!mudou) return;
  page.data = { ...page.data, content };
  store(pages);
}

export function deletePage(id: string): void {
  store(load().filter((p) => p.id !== id));
}

/** Devolve o endereço final, já normalizado e sem repetir o de outra página. */
export function setSlug(id: string, wanted: string): string {
  const pages = load();
  const page = pages.find((p) => p.id === id);
  if (!page) throw new Error("Página não encontrada");
  page.slug = uniqueSlug(wanted, pages, id);
  page.updatedAt = Date.now();
  store(pages);
  return page.slug;
}

export function exportPage(id: string): string {
  const p = getPage(id);
  if (!p) throw new Error("Página não encontrada");
  return JSON.stringify({ title: p.title, slug: p.slug, templateId: p.templateId, data: p.data }, null, 2);
}

export function importPage(json: string): PageRecord {
  let parsed: { title?: string; slug?: string; templateId?: string; data?: Data };
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Arquivo inválido");
  }
  if (!parsed || !Array.isArray(parsed.data?.content)) throw new Error("Arquivo inválido");
  const title = parsed.title || "Página importada";
  return insert(title, parsed.templateId ?? "evento", parsed.data as Data, parsed.slug || title);
}

export function resetToExamples(): void {
  store(examples());
  writeJSON(KEY_SEMEADOS, EXAMPLES.map((e) => e.slug));
}
