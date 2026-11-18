/* Contagem regressiva, convite de calendário e números que "contam" na animação. */

export type Restante = { acabou: boolean; dias: number; horas: number; minutos: number; segundos: number };

export function tempoRestante(alvo: Date, agora: Date): Restante {
  const ms = alvo.getTime() - agora.getTime();
  if (!Number.isFinite(ms) || ms <= 0) return { acabou: true, dias: 0, horas: 0, minutos: 0, segundos: 0 };
  const s = Math.floor(ms / 1000);
  return {
    acabou: false,
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
  };
}

export type Compromisso = { titulo: string; inicio: Date; duracaoMin: number; local?: string; descricao?: string; uid?: string };

/** 20261020T220000Z (sempre em UTC). */
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escapaIcs = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

const fim = (c: Compromisso) => new Date(c.inicio.getTime() + Math.max(1, c.duracaoMin) * 60000);

/** Arquivo .ics para "Adicionar à agenda" (Apple, Outlook e Google aceitam). */
export function gerarIcs(c: Compromisso): string {
  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//iGreen//Hotsites POC//PT",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${c.uid ?? `${utc(c.inicio)}-${Math.random().toString(36).slice(2)}`}@hotsites.igreen`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(c.inicio)}`,
    `DTEND:${utc(fim(c))}`,
    `SUMMARY:${escapaIcs(c.titulo)}`,
    ...(c.local ? [`LOCATION:${escapaIcs(c.local)}`] : []),
    ...(c.descricao ? [`DESCRIPTION:${escapaIcs(c.descricao)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return linhas.join("\r\n") + "\r\n";
}

export function googleAgendaUrl(c: Compromisso): string {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: c.titulo,
    dates: `${utc(c.inicio)}/${utc(fim(c))}`,
    ...(c.local ? { location: c.local } : {}),
    ...(c.descricao ? { details: c.descricao } : {}),
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/** "2026-12-04T20:00" no horário de Brasília → instante exato (vale para visitante em qualquer fuso). */
export function deBrasilia(s: string | undefined): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s ?? "")) return null;
  const d = new Date(`${s}:00-03:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "2026-12-12T19:00" (horário local) → Date, sem depender do fuso de quem roda. */
export function lerLocal(s: string | undefined): Date | null {
  const m = (s ?? "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : null;
}

const hora = (d: Date) => `${d.getHours()}h${d.getMinutes() ? String(d.getMinutes()).padStart(2, "0") : ""}`;

/** Data e horário por extenso para a página: "sexta-feira, 12 de dezembro" e "19h às 22h". */
export function formatarQuando(inicio: string, duracaoMin: number): { data: string; hora: string } {
  const d = lerLocal(inicio);
  if (!d) return { data: "", hora: "" };
  const fimD = new Date(d.getTime() + Math.max(0, Number(duracaoMin) || 0) * 60000);
  const data = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(d);
  return { data, hora: duracaoMin ? `${hora(d)} às ${hora(fimD)}` : hora(d) };
}

export type PartesNumero = { prefixo: string; valor: number; sufixo: string; decimais: number };

/** "R$ 1.500" → prefixo "R$ ", valor 1500. Sem número, devolve null (não anima). */
export function partesNumero(s: string): PartesNumero | null {
  const m = (s ?? "").match(/^(\D*?)(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?(.*)$/s);
  if (!m) return null;
  const inteiro = Number(m[2].replace(/\./g, ""));
  const dec = m[3] ?? "";
  return { prefixo: m[1], valor: dec ? Number(`${inteiro}.${dec}`) : inteiro, sufixo: m[4], decimais: dec.length };
}

export function formatarNumero(p: PartesNumero, v: number): string {
  return `${p.prefixo}${v.toLocaleString("pt-BR", { minimumFractionDigits: p.decimais, maximumFractionDigits: p.decimais })}${p.sufixo}`;
}
