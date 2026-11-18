import { readJSON, writeJSON } from "./store";
import { uid } from "./slug";

export type Submission = {
  id: string;
  /** Vínculo com a página: não muda quando o endereço muda. */
  pageId: string;
  /** Endereço no momento da inscrição, só para leitura humana. */
  pageSlug: string;
  ref?: string;
  createdAt: number;
  nome: string;
  whats: string;
  email: string;
  cidade?: string;
  interesse?: string;
};

const KEY = "poc-hotsite:subs";

function load(): Submission[] {
  const v = readJSON<Submission[]>(KEY);
  return Array.isArray(v) ? v : [];
}

export function addSubmission(s: Omit<Submission, "id" | "createdAt">): Submission {
  const sub: Submission = { ...s, id: uid(), createdAt: Date.now() };
  writeJSON(KEY, [...load(), sub]);
  return sub;
}

export function listSubmissions(filtro: { pageId?: string } = {}): Submission[] {
  return load()
    .filter((s) => !filtro.pageId || s.pageId === filtro.pageId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function clearSubmissions(): void {
  writeJSON(KEY, []);
}

/** "5531999990000" → "55 (31) 99999-0000": legível e lido como texto pelo Excel. */
function formatarWhats(d: string): string {
  const m = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  return m ? `55 (${m[1]}) ${m[2]}-${m[3]}` : d;
}

const cell = (v: string | undefined) => {
  let s = v ?? "";
  // Célula que começa com = + - @ vira fórmula no Excel; o apóstrofo neutraliza.
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** CSV para o Excel em português: ponto e vírgula e BOM no início. */
export function toCSV(subs: Submission[]): string {
  const head = ["Data", "Página", "Código do licenciado", "Nome", "WhatsApp", "E-mail", "Cidade", "Interesse"];
  const rows = subs.map((s) =>
    [
      new Date(s.createdAt).toLocaleString("pt-BR"),
      s.pageSlug,
      s.ref,
      s.nome,
      formatarWhats(s.whats),
      s.email,
      s.cidade,
      s.interesse,
    ]
      .map(cell)
      .join(";")
  );
  return "﻿" + [head.join(";"), ...rows].join("\n");
}
