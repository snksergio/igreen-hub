import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { registrarUmaVez } from "../lib/eventos";
import { getFormulario } from "../lib/formularios";
import { formularioDaPaginaId } from "../lib/inscrever";
import { paginaSalva as getPage } from "../lib/paginaSalva";
import { usePageCtx } from "../puck/context";
import { EVENTO_FORMULARIO, type PedidoFormulario } from "./abrir";
import { Conversa } from "./Conversa";
import { Fluxo } from "./Fluxo";

const MSG_FECHADA = {
  encerrada: ["Inscrições encerradas", "Este evento não está recebendo inscrições agora."],
  esgotada: ["Vagas esgotadas", "Todas as vagas foram preenchidas."],
} as const;

/**
 * Fica na raiz da página e abre o formulário em modal quando alguém pede (3.8):
 * a versão curta da peça de inscrição ou um botão "Formulário completo".
 */
export function HostFormulario() {
  const ctx = usePageCtx();
  const ancora = useRef<HTMLSpanElement>(null);
  const [doc, setDoc] = useState<Document | null>(null);
  const [pedido, setPedido] = useState<PedidoFormulario | null>(null);

  useEffect(() => {
    const d = ancora.current?.ownerDocument;
    if (!d) return;
    setDoc(d);
    const abrir = (e: Event) => setPedido({ ...(e as CustomEvent<PedidoFormulario>).detail });
    d.addEventListener(EVENTO_FORMULARIO, abrir);
    return () => d.removeEventListener(EVENTO_FORMULARIO, abrir);
  }, []);

  if (ctx.mode === "miniatura" || ctx.estatico) return null;
  return (
    <>
      <span ref={ancora} hidden />
      {doc && pedido && createPortal(<Modal pedido={pedido} doc={doc} fechar={() => setPedido(null)} />, doc.body)}
    </>
  );
}

function Modal({ pedido, doc, fechar }: { pedido: PedidoFormulario; doc: Document; fechar: () => void }) {
  const ctx = usePageCtx();
  const caixa = useRef<HTMLDivElement>(null);
  const form = pedido.formId ? getFormulario(pedido.formId) : formularioDaPaginaId(ctx.pageId);
  const page = getPage(ctx.pageId);
  const fechada = ctx.inscricoes?.fechada;
  const bloqueada = fechada === "encerrada" || (fechada === "esgotada" && !form?.regras.listaEspera);
  // Kit iGreen Live: o modal fica escuro, com o verde-lima, para combinar com a página.
  const tema = doc.querySelector(".lv") ? "live" : "claro";

  useEffect(() => {
    const anterior = doc.activeElement as HTMLElement | null;
    const corpo = doc.body.style.overflow;
    doc.body.style.overflow = "hidden";
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key !== "Tab" || !caixa.current) return;
      // Prende o foco dentro do modal.
      const itens = [...caixa.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([type=hidden]), select, textarea")].filter((el) => el.offsetParent !== null);
      if (!itens.length) return;
      const [primeiro, ultimo] = [itens[0], itens[itens.length - 1]];
      if (e.shiftKey && doc.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && doc.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    doc.addEventListener("keydown", tecla);
    if (ctx.mode === "publico" && pedido.completo) registrarUmaVez({ pageId: ctx.pageId, tipo: "form-inicio", origem: ctx.origem ?? "direto", ref: ctx.persona.ref });
    return () => {
      doc.removeEventListener("keydown", tecla);
      doc.body.style.overflow = corpo;
      anterior?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fm-fundo" data-tema={tema} onMouseDown={(e) => e.target === e.currentTarget && fechar()}>
      <div className="fm-modal" role="dialog" aria-modal="true" aria-label={`Inscrição · ${page?.title ?? "evento"}`} ref={caixa}>
        <header className="fm-modal-topo">
          <span className="fm-modal-evento">{page?.title ?? "Inscrição"}</span>
          <button type="button" className="fm-fechar" onClick={fechar} aria-label="Fechar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        <div className="fm-modal-corpo">
          {!form ? (
            <div className="fm-fim">
              <h2 className="fm-titulo">Formulário não encontrado</h2>
              <p className="fm-texto">Escolha um formulário na peça de inscrição ou nas configurações da página.</p>
            </div>
          ) : bloqueada ? (
            <div className="fm-fim">
              <h2 className="fm-titulo">{MSG_FECHADA[fechada === "encerrada" ? "encerrada" : "esgotada"][0]}</h2>
              <p className="fm-texto">{MSG_FECHADA[fechada === "encerrada" ? "encerrada" : "esgotada"][1]}</p>
            </div>
          ) : (
            (() => {
              const contexto = {
                page,
                pageId: ctx.pageId,
                pageSlug: ctx.pageSlug,
                ref: ctx.persona.ref,
                origem: ctx.origem ?? "direto",
                previa: ctx.mode !== "publico" || fechada === "rascunho" || fechada === "agendada",
              };
              return form.estilo === "formulario" ? (
                <Fluxo form={form} completo={pedido.completo} iniciais={pedido.iniciais} ctx={contexto} />
              ) : (
                <Conversa form={form} completo={pedido.completo} iniciais={pedido.iniciais} ctx={contexto} />
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
