import { comunicacaoDe, dataPorExtenso, infoEvento, inicioDoEvento, lugarCurto, preencher, type MetaPagina } from "./meta";
import type { PageRecord } from "./pages";

/* Comunicação com o participante (Etapa 5), simulada: o texto que iria por WhatsApp ou e-mail. */

export type Destinatario = { nome: string; codigo?: string };

const primeiroNome = (n: string) => n.trim().split(/\s+/)[0] || n;

function valores(page: PageRecord, d: Destinatario, linkIngresso: string) {
  const ev = infoEvento(page.data);
  return {
    nome: primeiroNome(d.nome),
    evento: page.title,
    data: dataPorExtenso(ev.inicio) || "data a confirmar",
    local: lugarCurto(ev) || "local a confirmar",
    codigo: d.codigo ?? "",
    ingresso: linkIngresso,
  };
}

export function textoConfirmacao(page: PageRecord, meta: MetaPagina, d: Destinatario, linkIngresso: string): string {
  return preencher(comunicacaoDe(meta).confirmacao, valores(page, d, linkIngresso));
}

export function textoLembrete(page: PageRecord, meta: MetaPagina, d: Destinatario, linkIngresso: string): string {
  return preencher(comunicacaoDe(meta).lembrete, valores(page, d, linkIngresso));
}

/** Quando o lembrete sairia: X horas antes do evento. Sem data do evento ou sem lembrete, null. */
export function quandoLembrete(page: PageRecord, meta: MetaPagina): Date | null {
  const c = comunicacaoDe(meta);
  const inicio = inicioDoEvento(infoEvento(page.data));
  if (!c.lembreteAtivo || !inicio) return null;
  return new Date(inicio.getTime() - Math.max(1, c.lembreteHoras) * 3600000);
}

/** WhatsApp usa *negrito*; na tela da POC vira <b>. */
export function partesWhats(texto: string): { negrito: boolean; t: string }[] {
  return texto.split(/(\*[^*\n]+\*)/g).filter(Boolean).map((t) => (t.startsWith("*") && t.endsWith("*") && t.length > 2 ? { negrito: true, t: t.slice(1, -1) } : { negrito: false, t }));
}
