import type { Respostas } from "../lib/submissions";

/* Abrir o formulário em modal de qualquer lugar da página (peça de inscrição, botão "Formulário
   completo"). O pedido vai como evento no documento da página: no editor, o do iframe da prévia. */

export const EVENTO_FORMULARIO = "igreen:formulario";

export type PedidoFormulario = {
  /** Sem id: usa o formulário da peça de inscrição da página. */
  formId?: string;
  /** O que já foi digitado na versão curta. */
  iniciais?: Respostas;
  /** true: mostra todos os campos (modal direto). false: só os que não estão na página. */
  completo: boolean;
};

export function abrirFormulario(doc: Document, pedido: PedidoFormulario) {
  doc.dispatchEvent(new CustomEvent<PedidoFormulario>(EVENTO_FORMULARIO, { detail: pedido }));
}
