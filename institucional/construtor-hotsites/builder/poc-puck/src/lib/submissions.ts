import { readJSON, writeJSON } from "./store";
import { uid } from "./slug";

export type StatusInscricao = "inscrito" | "confirmado" | "presente" | "faltou" | "espera";
export type StatusPagamento = "pendente" | "pago" | "cancelado" | "estornado";

export const ROTULO_INSCRICAO: Record<StatusInscricao, string> = {
  inscrito: "Inscrito",
  confirmado: "Confirmado",
  presente: "Presente",
  faltou: "Não veio",
  espera: "Lista de espera",
};
export const ROTULO_PAGAMENTO: Record<StatusPagamento, string> = {
  pendente: "Pendente",
  pago: "Pago",
  cancelado: "Cancelado",
  estornado: "Estornado",
};

export type Pagamento = {
  status: StatusPagamento;
  /** Em reais. */
  valor: number;
  lote?: string;
  cupom?: string;
  meia?: boolean;
  metodo?: "pix" | "cartao";
  atualizadoEm: number;
};

/** Respostas do formulário pelo id do campo. Múltipla escolha vira lista. */
export type Respostas = Record<string, string | string[]>;

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
  /** Sem status = inscrito (inscrições antigas). */
  status?: StatusInscricao;
  formId?: string;
  respostas?: Respostas;
  /** De onde a pessoa veio: licenciado, instagram, whatsapp, direto… */
  origem?: string;
  /** Quando aceitou receber avisos (o envio do formulário com o aceite marcado). */
  consentimentoEm?: number;
  pagamento?: Pagamento;
  /** Código curto do ingresso, que vai no QR code. */
  codigo?: string;
  historico?: { em: number; texto: string }[];
};

const KEY = "poc-hotsite:subs";

function load(): Submission[] {
  const v = readJSON<Submission[]>(KEY);
  return Array.isArray(v) ? v : [];
}

function save(subs: Submission[]): boolean {
  return writeJSON(KEY, subs);
}

const SEM_CONFUSAO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
/** Código de ingresso de 6 letras e números, sem 0/O e 1/I para ler em voz alta. */
export function gerarCodigo(aleatorio: () => number = Math.random): string {
  let c = "";
  for (let i = 0; i < 6; i++) c += SEM_CONFUSAO[Math.floor(aleatorio() * SEM_CONFUSAO.length)];
  return c;
}

export const statusDe = (s: Submission): StatusInscricao => s.status ?? "inscrito";

export function addSubmission(s: Omit<Submission, "id" | "createdAt"> & { createdAt?: number }): Submission {
  const subs = load();
  const usados = new Set(subs.map((x) => x.codigo));
  let codigo = s.codigo ?? gerarCodigo();
  while (usados.has(codigo)) codigo = gerarCodigo();
  const createdAt = s.createdAt ?? Date.now();
  const sub: Submission = {
    ...s,
    id: uid(),
    createdAt,
    codigo,
    historico: s.historico ?? [{ em: createdAt, texto: s.status === "espera" ? "Entrou na lista de espera" : "Inscrição enviada" }],
  };
  save([...subs, sub]);
  return sub;
}

/** Grava várias de uma vez (dados de exemplo). */
export function addMuitas(novas: Submission[]): void {
  save([...load(), ...novas]);
}

export function listSubmissions(filtro: { pageId?: string } = {}): Submission[] {
  return load()
    .filter((s) => !filtro.pageId || s.pageId === filtro.pageId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getSubmission(id: string): Submission | undefined {
  return load().find((s) => s.id === id);
}

export function getPorCodigo(codigo: string): Submission | undefined {
  const c = codigo.trim().toUpperCase();
  return load().find((s) => s.codigo === c);
}

/** Muda uma ou várias inscrições; `nota` entra no histórico de cada uma. */
export function updateSubmissions(ids: string[], patch: Partial<Omit<Submission, "id">>, nota?: string): void {
  const alvo = new Set(ids);
  const agora = Date.now();
  save(
    load().map((s) =>
      alvo.has(s.id) ? { ...s, ...patch, historico: nota ? [...(s.historico ?? []), { em: agora, texto: nota }] : s.historico } : s
    )
  );
}

export function removeSubmissions(ids: string[]): void {
  const alvo = new Set(ids);
  save(load().filter((s) => !alvo.has(s.id)));
}

/** Tira as inscrições de uma página (ao apagar a página ou refazer os exemplos). */
export function removePorPagina(pageIds: string[]): void {
  const alvo = new Set(pageIds);
  save(load().filter((s) => !alvo.has(s.pageId)));
}

export function clearSubmissions(): void {
  writeJSON(KEY, []);
}

/** A inscrição ocupa vaga? Lista de espera e pagamento cancelado ou estornado não ocupam. */
export const ocupaVaga = (s: Submission) =>
  statusDe(s) !== "espera" && s.pagamento?.status !== "cancelado" && s.pagamento?.status !== "estornado";

/** "5531999990000" → "55 (31) 99999-0000": legível e lido como texto pelo Excel. */
export function formatarWhats(d: string): string {
  const m = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  if (m) return `55 (${m[1]}) ${m[2]}-${m[3]}`;
  const n = d.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  return n ? `(${n[1]}) ${n[2]}-${n[3]}` : d;
}

const cell = (v: string | undefined) => {
  let s = v ?? "";
  // Célula que começa com = + - @ vira fórmula no Excel; o apóstrofo neutraliza.
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Coluna extra do CSV: uma por campo do formulário (3.9). */
export type ColunaExtra = { id: string; rotulo: string };

const respostaTexto = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(", ") : v);

/** CSV para o Excel em português: ponto e vírgula e BOM no início. */
export function toCSV(subs: Submission[], extras: ColunaExtra[] = []): string {
  const head = [
    "Data",
    "Página",
    "Código do licenciado",
    "Nome",
    "WhatsApp",
    "E-mail",
    "Cidade",
    "Interesse",
    "Status",
    "Pagamento",
    "Valor",
    "Origem",
    "Código do ingresso",
    ...extras.map((c) => c.rotulo),
  ];
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
      ROTULO_INSCRICAO[statusDe(s)],
      s.pagamento ? ROTULO_PAGAMENTO[s.pagamento.status] : "",
      s.pagamento ? s.pagamento.valor.toFixed(2).replace(".", ",") : "",
      s.origem,
      s.codigo,
      ...extras.map((c) => respostaTexto(s.respostas?.[c.id])),
    ]
      .map(cell)
      .join(";")
  );
  return "﻿" + [head.join(";"), ...rows].join("\n");
}
