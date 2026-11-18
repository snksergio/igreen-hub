import { deBrasilia } from "./tempo";

/* Preço do ingresso (Etapa 4): preço único, lotes por data, cupom e meia-entrada. Tudo em reais. */

export type Lote = { id: string; nome: string; preco: number; /** Vale até esse horário (Brasília). */ ate: string };
export type Cupom = {
  codigo: string;
  tipo: "valor" | "percentual";
  valor: number;
  /** Quantas vezes pode ser usado no total (vazio = sem limite). */
  limite?: number;
  /** Vale até esse horário (Brasília). */
  validade?: string;
  /** Cupom de um licenciado: o código dele aparece no ranking. */
  licenciado?: string;
};
export type ConfigIngresso = {
  nomeIngresso: string;
  /** Preço único; com lotes, vale depois que o último lote acaba. */
  preco: number;
  lotes: Lote[];
  cupons: Cupom[];
  meia: boolean;
  textoMeia: string;
};

export const INGRESSO_PADRAO: ConfigIngresso = {
  nomeIngresso: "Ingresso",
  preco: 50,
  lotes: [],
  cupons: [],
  meia: false,
  textoMeia: "Declaro que tenho direito à meia-entrada (estudante, professor, pessoa com deficiência ou acima de 60 anos) e vou apresentar o documento na entrada.",
};

export const reais = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const limpo = (n: number) => Math.max(0, Math.round(n * 100) / 100);

/** Lotes que ainda têm data válida, do que acaba primeiro ao último. */
function lotesEmOrdem(cfg: ConfigIngresso) {
  return cfg.lotes
    .map((l) => ({ ...l, fim: deBrasilia(l.ate) }))
    .filter((l): l is Lote & { fim: Date } => Boolean(l.fim))
    .sort((a, b) => a.fim.getTime() - b.fim.getTime());
}

export type PrecoAgora = { nome: string; preco: number; ate?: string; depois?: { nome: string; preco: number } };

/** O preço que vale agora: o primeiro lote que não acabou; sem lote aberto, o preço único. */
export function precoAgora(cfg: ConfigIngresso, agora = new Date()): PrecoAgora {
  const lotes = lotesEmOrdem(cfg);
  const i = lotes.findIndex((l) => l.fim > agora);
  if (i < 0) return { nome: lotes.length ? "Preço final" : cfg.nomeIngresso, preco: limpo(cfg.preco) };
  const l = lotes[i];
  const prox = lotes[i + 1];
  return {
    nome: l.nome,
    preco: limpo(l.preco),
    ate: l.ate,
    depois: prox ? { nome: prox.nome, preco: limpo(prox.preco) } : { nome: "Preço final", preco: limpo(cfg.preco) },
  };
}

export type ResultadoCupom = { ok: true; cupom: Cupom } | { ok: false; erro: string };

/** `usos`: quantas inscrições já usaram o código (pagas ou pendentes). */
export function checarCupom(cfg: ConfigIngresso, codigo: string, usos: number, agora = new Date()): ResultadoCupom {
  const c = codigo.trim().toUpperCase();
  if (!c) return { ok: false, erro: "Digite o cupom." };
  const cupom = cfg.cupons.find((x) => x.codigo.trim().toUpperCase() === c);
  if (!cupom) return { ok: false, erro: "Cupom não encontrado." };
  const validade = deBrasilia(cupom.validade);
  if (validade && validade <= agora) return { ok: false, erro: "Este cupom já venceu." };
  if (cupom.limite && usos >= cupom.limite) return { ok: false, erro: "Este cupom já foi usado o máximo de vezes." };
  return { ok: true, cupom };
}

export type Total = { lote: string; base: number; descontoMeia: number; descontoCupom: number; total: number };

/** Meia-entrada é metade do preço do lote; o cupom vale depois da meia. Nunca fica negativo. */
export function calcularTotal(cfg: ConfigIngresso, escolha: { meia?: boolean; cupom?: Cupom }, agora = new Date()): Total {
  const p = precoAgora(cfg, agora);
  const base = p.preco;
  const descontoMeia = cfg.meia && escolha.meia ? limpo(base / 2) : 0;
  const depoisMeia = base - descontoMeia;
  let descontoCupom = 0;
  if (escolha.cupom) {
    descontoCupom = escolha.cupom.tipo === "percentual" ? (depoisMeia * Math.min(100, escolha.cupom.valor)) / 100 : escolha.cupom.valor;
    descontoCupom = limpo(Math.min(depoisMeia, descontoCupom));
  }
  return { lote: p.nome, base, descontoMeia, descontoCupom, total: limpo(depoisMeia - descontoCupom) };
}
