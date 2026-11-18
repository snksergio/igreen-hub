import type { PageRecord } from "./pages";
import { infoEvento, inicioDoEvento, statusVisivel, type InfoEvento, type MetaPagina, type StatusVisivel } from "./meta";

/* Busca, filtros e ordem do painel de páginas (Etapa 1). Puro: recebe as contagens prontas. */

export type FiltroData = "todas" | "proximas" | "futuras" | "passadas" | "sem-data";
export type Ordem = "edicao" | "evento" | "nome";

export type FiltrosPainel = {
  busca: string;
  /** "ativas" = tudo menos arquivada (o padrão: arquivada sai do painel principal). */
  status: "ativas" | "todas" | StatusVisivel;
  modelo: string;
  data: FiltroData;
  responsavel: string;
  ordem: Ordem;
};

export const FILTROS_PADRAO: FiltrosPainel = { busca: "", status: "ativas", modelo: "", data: "todas", responsavel: "", ordem: "edicao" };

export type LinhaPainel = {
  page: PageRecord;
  meta: MetaPagina;
  status: StatusVisivel;
  evento: InfoEvento;
  inicio: Date | null;
  inscritos: number;
  vagas: number | null;
};

export const metaDe = (p: PageRecord): MetaPagina => ({ status: "publicada", ...(p.meta ?? {}) });

export function montarLinhas(
  pages: PageRecord[],
  contar: (pageId: string) => number,
  vagasDe: (p: PageRecord) => number | null,
  agora = new Date()
): LinhaPainel[] {
  return pages.map((page) => {
    const meta = metaDe(page);
    const evento = infoEvento(page.data);
    return {
      page,
      meta,
      status: statusVisivel(meta, agora),
      evento,
      inicio: inicioDoEvento(evento),
      inscritos: contar(page.id),
      vagas: vagasDe(page),
    };
  });
}

const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const DIA = 86400000;

function passaData(l: LinhaPainel, f: FiltroData, agora: Date): boolean {
  if (f === "todas") return true;
  if (f === "sem-data") return !l.inicio;
  if (!l.inicio) return false;
  const t = l.inicio.getTime();
  if (f === "passadas") return t < agora.getTime();
  if (f === "futuras") return t >= agora.getTime();
  return t >= agora.getTime() && t <= agora.getTime() + 30 * DIA;
}

/** Todos os filtros combinam entre si (E). */
export function filtrarLinhas(linhas: LinhaPainel[], f: FiltrosPainel, agora = new Date()): LinhaPainel[] {
  const busca = semAcento(f.busca.trim());
  const saida = linhas.filter((l) => {
    if (f.status === "ativas" ? l.status === "arquivada" : f.status !== "todas" && l.status !== f.status) return false;
    if (f.modelo && l.page.templateId !== f.modelo) return false;
    if (f.responsavel && !(l.meta.responsaveis ?? []).includes(f.responsavel)) return false;
    if (!passaData(l, f.data, agora)) return false;
    if (busca && !semAcento(`${l.page.title} ${l.page.slug}`).includes(busca)) return false;
    return true;
  });
  return ordenar(saida, f.ordem, agora);
}

/** Por data do evento: os próximos primeiro (do mais perto ao mais longe), depois os que já passaram, depois sem data. */
export function ordenar(linhas: LinhaPainel[], ordem: Ordem, agora = new Date()): LinhaPainel[] {
  const l = [...linhas];
  if (ordem === "nome") return l.sort((a, b) => a.page.title.localeCompare(b.page.title, "pt-BR"));
  if (ordem === "edicao") return l.sort((a, b) => b.page.updatedAt - a.page.updatedAt);
  const agoraT = agora.getTime();
  const grupo = (x: LinhaPainel) => (!x.inicio ? 2 : x.inicio.getTime() >= agoraT ? 0 : 1);
  return l.sort((a, b) => {
    const ga = grupo(a);
    const gb = grupo(b);
    if (ga !== gb) return ga - gb;
    if (ga === 2) return b.page.updatedAt - a.page.updatedAt;
    const ta = a.inicio!.getTime();
    const tb = b.inicio!.getTime();
    return ga === 0 ? ta - tb : tb - ta;
  });
}

/** Nomes de responsáveis que aparecem nas páginas, em ordem alfabética (para o filtro). */
export function responsaveisDe(linhas: LinhaPainel[]): string[] {
  return [...new Set(linhas.flatMap((l) => l.meta.responsaveis ?? []))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
