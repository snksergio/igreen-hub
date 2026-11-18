/** Dados do licenciado que chegam pelo link (?nome=&cidade=&whats=&foto=&ref=). */
export type Persona = { nome?: string; cidade?: string; whats?: string; foto?: string; ref?: string };

export const PERSONA_KEYS = ["nome", "cidade", "whats", "foto", "ref"] as const;

/** Usado no editor para pré-visualizar a página como se viesse do link de um licenciado. */
export const PERSONA_DEMO: Persona = {
  nome: "Thiago Souza",
  cidade: "Belo Horizonte · MG",
  whats: "5531999999999",
  ref: "LIC123",
};

const clip = (v: string) => v.trim().slice(0, 80);

function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Número brasileiro para o wa.me. Com DDD e sem o 55 (10 ou 11 dígitos), o 55 entra na frente.
 * Com 12 ou 13 dígitos, precisa começar com 55. Qualquer outra coisa é descartada.
 */
export function normalizarWhats(v: string): string | undefined {
  if (!/^\d+$/.test(v)) return undefined;
  if (v.length === 10 || v.length === 11) return `55${v}`;
  if ((v.length === 12 || v.length === 13) && v.startsWith("55")) return v;
  return undefined;
}

/** Lê a query do link e descarta qualquer valor fora do padrão. */
export function parsePersona(q: URLSearchParams): Persona {
  const p: Persona = {};
  const nome = clip(q.get("nome") ?? "");
  const cidade = clip(q.get("cidade") ?? "");
  const whats = (q.get("whats") ?? "").trim();
  const foto = (q.get("foto") ?? "").trim();
  const ref = (q.get("ref") ?? "").trim();
  if (nome) p.nome = nome;
  if (cidade) p.cidade = cidade;
  const numero = normalizarWhats(whats);
  if (numero) p.whats = numero;
  if (foto && isHttpUrl(foto)) p.foto = foto;
  if (/^[A-Za-z0-9_-]{1,60}$/.test(ref)) p.ref = ref;
  return p;
}

/** Troca {nome} e {cidade}. Sem dado, nome vira "iGreen" e cidade some. */
export function applyTokens(text: string, p: Persona): string {
  return (text ?? "")
    .replace(/\{nome\}/g, p.nome ?? "iGreen")
    .replace(/\{cidade\}/g, p.cidade ?? "")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function buildInviteLink(baseUrl: string, slug: string, p: Persona): string {
  const q = new URLSearchParams();
  for (const k of PERSONA_KEYS) {
    const v = p[k];
    if (v) q.set(k, v);
  }
  const qs = q.toString();
  return `${baseUrl}#/p/${slug}${qs ? `?${qs}` : ""}`;
}

/** Sem número, abre o WhatsApp para o visitante escolher o contato (como no hotsite Migre a bandeira). */
export function whatsHref(p: Persona, mensagem: string): string {
  const text = encodeURIComponent(mensagem);
  return p.whats ? `https://wa.me/${p.whats}?text=${text}` : `https://wa.me/?text=${text}`;
}
