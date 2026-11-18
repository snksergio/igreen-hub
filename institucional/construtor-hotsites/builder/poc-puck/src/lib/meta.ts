import type { Data } from "@puckeditor/core";
import { deBrasilia, lerLocal } from "./tempo";

/* Status, datas e configurações da página: o que o painel e o espaço da página mostram
   sem abrir o construtor. Fica ao lado do conteúdo (PageRecord.meta), não dentro dele. */

/** O que quem cuida da página escolhe. */
export type StatusPagina = "rascunho" | "publicada" | "encerrada" | "arquivada";
/** O que a tela mostra: "agendada" e "encerrada" também saem das datas. */
export type StatusVisivel = "rascunho" | "agendada" | "publicada" | "encerrada" | "arquivada";

export type Comunicacao = {
  canal: "whatsapp" | "email" | "ambos";
  confirmacao: string;
  lembreteAtivo: boolean;
  lembreteHoras: number;
  lembrete: string;
};

export type MetaPagina = {
  status: StatusPagina;
  /** Horário de Brasília, "2026-12-01T09:00". Com status "publicada", antes disso a página está agendada. */
  publicarEm?: string;
  /** As inscrições fecham sozinhas nesse horário. */
  encerrarEm?: string;
  /** Vagas do evento. Vazio: usa o limite do formulário (ou sem limite). */
  vagas?: number;
  responsaveis?: string[];
  ga4?: string;
  metaPixel?: string;
  comunicacao?: Partial<Comunicacao>;
};

export const ROTULO_STATUS: Record<StatusVisivel, string> = {
  rascunho: "Rascunho",
  agendada: "Agendada",
  publicada: "Publicada",
  encerrada: "Encerrada",
  arquivada: "Arquivada",
};

export const META_PADRAO: MetaPagina = { status: "publicada" };

export const COMUNICACAO_PADRAO: Comunicacao = {
  canal: "whatsapp",
  confirmacao:
    "Oi, {nome}! Sua inscrição no *{evento}* está confirmada. 🎉\n\n📅 {data}\n📍 {local}\n\nSeu código de entrada é *{codigo}*. É só mostrar o QR code na chegada: {ingresso}",
  lembreteAtivo: true,
  lembreteHoras: 24,
  lembrete: "Oi, {nome}! Amanhã é dia de *{evento}*. Te esperamos em {local}, {data}. Seu código: *{codigo}*.",
};

export const comunicacaoDe = (m: MetaPagina): Comunicacao => ({ ...COMUNICACAO_PADRAO, ...(m.comunicacao ?? {}) });

/** Status que vale agora, contando agendamento e encerramento automático. */
export function statusVisivel(m: MetaPagina, agora = new Date()): StatusVisivel {
  if (m.status === "arquivada" || m.status === "encerrada" || m.status === "rascunho") return m.status;
  const publicar = deBrasilia(m.publicarEm);
  if (publicar && publicar > agora) return "agendada";
  const encerrar = deBrasilia(m.encerrarEm);
  if (encerrar && encerrar <= agora) return "encerrada";
  return "publicada";
}

/** Por que a página não aceita inscrição agora (ou undefined se aceita). */
export function motivoFechada(
  status: StatusVisivel,
  inscritos: number,
  vagas: number | null,
  listaEspera = false
): "rascunho" | "agendada" | "encerrada" | "esgotada" | undefined {
  if (status === "rascunho" || status === "agendada") return status;
  if (status === "encerrada" || status === "arquivada") return "encerrada";
  if (vagas && inscritos >= vagas && !listaEspera) return "esgotada";
  return undefined;
}

export type InfoEvento = {
  /** "2026-12-12T19:00", horário de Brasília. */
  inicio?: string;
  duracaoMin?: number;
  local?: string;
  endereco?: string;
  cidade?: string;
  uf?: string;
};

type Bloco = { type: string; props: Record<string, unknown> };
const texto = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/** Data e local do evento, tirados das peças da página (Local vence a contagem e a abertura). */
export function infoEvento(data: Data): InfoEvento {
  const blocos = (data.content ?? []) as Bloco[];
  const local = blocos.find((b) => b.type === "LiveLocal" || b.type === "Local");
  if (local && texto(local.props.inicio)) {
    const p = local.props;
    return {
      inicio: texto(p.inicio),
      duracaoMin: Number(p.duracaoMin) || undefined,
      local: texto(p.nomeLocal),
      endereco: texto(p.endereco),
      cidade: texto(p.cidade),
      uf: texto(p.uf),
    };
  }
  const outro = blocos.find((b) => (b.type === "LiveAbertura" || b.type === "ContagemRegressiva") && texto(b.props.quando));
  return outro ? { inicio: texto(outro.props.quando) } : {};
}

/** Quando o evento começa, como instante exato. */
export const inicioDoEvento = (info: InfoEvento) => deBrasilia(info.inicio);

/** "sáb., 12 de dez. · 19h" — curto, para card e lista. */
export function dataCurta(inicio: string | undefined): string {
  const d = lerLocal(inicio);
  if (!d) return "";
  const dia = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "numeric", month: "short" }).format(d);
  const h = `${d.getHours()}h${d.getMinutes() ? String(d.getMinutes()).padStart(2, "0") : ""}`;
  return `${dia} · ${h}`;
}

/** "12/12/2026 às 19h" — para textos de mensagem. */
export function dataPorExtenso(inicio: string | undefined): string {
  const d = lerLocal(inicio);
  if (!d) return "";
  const dia = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(d);
  const h = `${d.getHours()}h${d.getMinutes() ? String(d.getMinutes()).padStart(2, "0") : ""}`;
  return `${dia}, às ${h}`;
}

export const lugarCurto = (i: InfoEvento) => [i.local, [i.cidade, i.uf].filter(Boolean).join("/")].filter(Boolean).join(" · ");

/** Troca {nome}, {evento}… pelos valores. Chave sem valor some. */
export function preencher(modelo: string, valores: Record<string, string | undefined>): string {
  return modelo.replace(/\{(\w+)\}/g, (_, k: string) => valores[k] ?? "");
}
