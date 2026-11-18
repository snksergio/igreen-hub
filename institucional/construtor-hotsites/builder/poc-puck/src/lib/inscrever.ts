import { baseDasRespostas, campoIngresso, checarRegras, type Formulario } from "./formularios";
import { calcularTotal, checarCupom, type Total } from "./ingresso";
import { formularioDaPagina, getFormulario } from "./formularios";
import { metaDe } from "./painel";
import { vagasDaPagina } from "./pagina";
import { paginaSalva as getPage } from "./paginaSalva";
import { normalizarWhats } from "./persona";
import { addSubmission, listSubmissions, updateSubmissions, type Pagamento, type Respostas, type Submission } from "./submissions";

/* O envio da inscrição: regras, campos ocultos, ingresso e gravação. Usado pelo modal e pelo
   endereço próprio do formulário. Na prévia do construtor nada é gravado. */

export type Origem = { pageId: string; pageSlug: string; ref?: string; origem: string; previa: boolean };

export type Resultado =
  | { ok: true; sub: Submission; espera: boolean; total: Total | null; aPagar: boolean }
  | { ok: false; motivo: string };

/** Quantas inscrições da página já usaram o cupom (para o limite de usos). */
export function usosDoCupom(pageId: string, codigo: string): number {
  const c = codigo.trim().toUpperCase();
  return listSubmissions({ pageId }).filter((s) => s.pagamento?.cupom?.toUpperCase() === c && s.pagamento.status !== "cancelado").length;
}

/** O formulário de uma página (o da peça de inscrição). */
export const formularioDaPaginaId = (pageId: string): Formulario | undefined => {
  const p = getPage(pageId);
  return p ? getFormulario(formularioDaPagina(p.data)) : undefined;
};

export function totalDoIngresso(f: Formulario, r: Respostas, pageId: string, agora = new Date()): Total | null {
  const c = campoIngresso(f);
  if (!c?.ingresso) return null;
  const codigo = String(r[`${c.id}-cupom`] ?? "").trim();
  const cupom = codigo ? checarCupom(c.ingresso, codigo, usosDoCupom(pageId, codigo), agora) : null;
  return calcularTotal(c.ingresso, { meia: r[c.id] === "meia", cupom: cupom?.ok ? cupom.cupom : undefined }, agora);
}

export function inscrever(f: Formulario, respostas: Respostas, o: Origem, agora = new Date()): Resultado {
  const page = getPage(o.pageId);
  const meta = page ? metaDe(page) : undefined;
  const r: Respostas = { ...respostas };
  for (const c of f.campos) {
    if (c.tipo !== "oculto") continue;
    if (c.fonte === "ref" && o.ref) r[c.id] = o.ref;
    if (c.fonte === "origem") r[c.id] = o.origem;
  }
  const doPagina = o.previa ? [] : listSubmissions({ pageId: o.pageId });
  const vaga = checarRegras(f, { inscricoesDaPagina: doPagina, vagasDaPagina: page ? vagasDaPagina(page) : null, encerrarDaPagina: meta?.encerrarEm, agora }, r);
  if (!vaga.ok) return vaga;

  const base = baseDasRespostas(f, r);
  const total = totalDoIngresso(f, r, o.pageId, agora);
  const c = campoIngresso(f);
  let pagamento: Pagamento | undefined;
  if (total && c && !vaga.espera) {
    pagamento = {
      status: total.total > 0 ? "pendente" : "pago",
      valor: total.total,
      lote: total.lote,
      meia: total.descontoMeia > 0 || undefined,
      cupom: total.descontoCupom > 0 ? String(r[`${c.id}-cupom`]).trim().toUpperCase() : undefined,
      atualizadoEm: agora.getTime(),
    };
  }
  const dados = {
    pageId: o.pageId,
    pageSlug: o.pageSlug,
    ref: o.ref,
    nome: base.nome,
    // Sempre com o 55 na frente, como os links de WhatsApp pedem.
    whats: normalizarWhats(base.whats) ?? base.whats,
    email: base.email,
    cidade: base.cidade,
    status: vaga.espera ? ("espera" as const) : ("inscrito" as const),
    formId: f.id,
    respostas: r,
    origem: o.origem,
    consentimentoEm: agora.getTime(),
    pagamento,
  };
  const sub: Submission = o.previa ? { ...dados, id: "previa", createdAt: agora.getTime(), codigo: "PREVIA" } : addSubmission(dados);
  return { ok: true, sub, espera: vaga.espera, total, aPagar: Boolean(pagamento && pagamento.status === "pendente") };
}

/** Resultado do pagamento simulado. Recusado deixa pendente (a pessoa pode tentar de novo). */
export function pagar(sub: Submission, aprovado: boolean, metodo: "pix" | "cartao", previa: boolean): Submission {
  if (!sub.pagamento) return sub;
  const pagamento: Pagamento = { ...sub.pagamento, metodo, status: aprovado ? "pago" : "pendente", atualizadoEm: Date.now() };
  if (!previa) updateSubmissions([sub.id], { pagamento }, aprovado ? "Pagamento aprovado" : "Pagamento recusado");
  return { ...sub, pagamento };
}
