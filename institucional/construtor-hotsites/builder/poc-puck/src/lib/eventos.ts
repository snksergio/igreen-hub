import { readJSON, writeJSON } from "./store";
import { ocupaVaga, statusDe, type Submission } from "./submissions";

/* Visitas e uso do formulário de cada página (Etapa 2.6). Na POC fica no navegador;
   no projeto real viria do GA4 ou de um contador no servidor. */

export type TipoEvento = "visita" | "form-inicio";
export type Evento = { pageId: string; tipo: TipoEvento; em: number; ref?: string; origem: string };

const KEY = "poc-hotsite:eventos";

function load(): Evento[] {
  const v = readJSON<Evento[]>(KEY);
  return Array.isArray(v) ? v : [];
}

export function registrarEvento(e: Omit<Evento, "em"> & { em?: number }): void {
  writeJSON(KEY, [...load(), { ...e, em: e.em ?? Date.now() }]);
}

export function addEventos(lista: Evento[]): void {
  writeJSON(KEY, [...load(), ...lista]);
}

export function removeEventosPorPagina(pageIds: string[]): void {
  const alvo = new Set(pageIds);
  writeJSON(KEY, load().filter((e) => !alvo.has(e.pageId)));
}

/** Conta uma vez por aba: recarregar a página não vira visita nova. */
export function registrarUmaVez(e: Omit<Evento, "em">): void {
  const chave = `poc-hotsite:${e.tipo}:${e.pageId}`;
  try {
    if (sessionStorage.getItem(chave)) return;
    sessionStorage.setItem(chave, "1");
  } catch {
    /* sem sessionStorage: conta mesmo assim */
  }
  registrarEvento(e);
}

export function listarEventos(pageId: string): Evento[] {
  return load().filter((e) => e.pageId === pageId);
}

export const ROTULO_ORIGEM: Record<string, string> = {
  licenciado: "Link de licenciado",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  google: "Google",
  email: "E-mail",
  campanha: "Campanha paga",
  direto: "Acesso direto",
};
export const rotuloOrigem = (o: string | undefined) => ROTULO_ORIGEM[o ?? "direto"] ?? o ?? "Acesso direto";

/** De onde a pessoa veio: ?origem= ou utm_source manda; link com código é licenciado; senão, o site anterior. */
export function origemDoAcesso(query: URLSearchParams, referrer = "", ref?: string): string {
  const pedida = (query.get("origem") || query.get("utm_source") || "").trim().toLowerCase();
  if (pedida) {
    if (/insta/.test(pedida)) return "instagram";
    if (/whats|wa\b/.test(pedida)) return "whatsapp";
    if (/face|fb|meta/.test(pedida)) return "facebook";
    if (/google|gads|adwords/.test(pedida)) return "google";
    if (/mail/.test(pedida)) return "email";
    if (/lic/.test(pedida)) return "licenciado";
    return pedida.slice(0, 30);
  }
  if (ref) return "licenciado";
  if (/instagram\./.test(referrer)) return "instagram";
  if (/facebook\.|fb\./.test(referrer)) return "facebook";
  if (/google\./.test(referrer)) return "google";
  if (/whatsapp\.|wa\.me/.test(referrer)) return "whatsapp";
  return "direto";
}

export type Resumo = {
  visitas: number;
  comecaram: number;
  inscricoes: number;
  pagos: number;
  presentes: number;
  /** Inscrições / visitas, em %. */
  conversao: number;
  porDia: { dia: string; visitas: number; inscricoes: number }[];
  porOrigem: { origem: string; visitas: number; inscricoes: number }[];
  ranking: { ref: string; visitas: number; inscricoes: number; presentes: number }[];
};

const diaDe = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Junta visitas e inscrições de uma página. `dias`: tamanho da série por dia, terminando hoje. */
export function resumir(eventos: Evento[], subs: Submission[], dias = 14, agora = new Date()): Resumo {
  const visitas = eventos.filter((e) => e.tipo === "visita");
  const validas = subs.filter(ocupaVaga);
  const comecaram = Math.max(eventos.filter((e) => e.tipo === "form-inicio").length, subs.length);

  const serie = new Map<string, { visitas: number; inscricoes: number }>();
  for (let i = dias - 1; i >= 0; i--) serie.set(diaDe(agora.getTime() - i * 86400000), { visitas: 0, inscricoes: 0 });
  for (const v of visitas) {
    const s = serie.get(diaDe(v.em));
    if (s) s.visitas++;
  }
  for (const s of subs) {
    const d = serie.get(diaDe(s.createdAt));
    if (d) d.inscricoes++;
  }

  const origens = new Map<string, { visitas: number; inscricoes: number }>();
  const pega = (o: string) => origens.get(o) ?? origens.set(o, { visitas: 0, inscricoes: 0 }).get(o)!;
  for (const v of visitas) pega(v.origem || "direto").visitas++;
  for (const s of subs) pega(s.origem || (s.ref ? "licenciado" : "direto")).inscricoes++;

  const refs = new Map<string, { visitas: number; inscricoes: number; presentes: number }>();
  const pegaRef = (r: string) => refs.get(r) ?? refs.set(r, { visitas: 0, inscricoes: 0, presentes: 0 }).get(r)!;
  for (const v of visitas) if (v.ref) pegaRef(v.ref).visitas++;
  for (const s of subs) {
    if (!s.ref) continue;
    const r = pegaRef(s.ref);
    r.inscricoes++;
    if (statusDe(s) === "presente") r.presentes++;
  }

  return {
    visitas: visitas.length,
    comecaram,
    inscricoes: subs.length,
    pagos: subs.filter((s) => s.pagamento?.status === "pago").length,
    presentes: validas.filter((s) => statusDe(s) === "presente").length,
    conversao: visitas.length ? Math.round((subs.length / visitas.length) * 1000) / 10 : 0,
    porDia: [...serie].map(([dia, v]) => ({ dia, ...v })),
    porOrigem: [...origens]
      .map(([origem, v]) => ({ origem, ...v }))
      .sort((a, b) => b.inscricoes - a.inscricoes || b.visitas - a.visitas),
    ranking: [...refs]
      .map(([ref, v]) => ({ ref, ...v }))
      .sort((a, b) => b.inscricoes - a.inscricoes || b.visitas - a.visitas),
  };
}
