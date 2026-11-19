import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./confirmar.css";

export type PedidoConfirmacao = {
  titulo: string;
  texto: ReactNode;
  /** O texto do botão diz o que acontece ("Publicar agora", "Encerrar inscrições"). */
  confirmar: string;
  /** Ação que tira algo do ar ou apaga: botão vermelho. */
  perigo?: boolean;
  aoConfirmar: () => void;
};

/**
 * Pergunta antes de uma ação que muda algo de verdade (publicar, encerrar, tirar do ar, apagar).
 * Diz o que vai acontecer e o botão repete a ação. Esc ou clicar fora cancela.
 */
export function Confirmar({ pedido, fechar }: { pedido: PedidoConfirmacao | null; fechar: () => void }) {
  const botao = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!pedido) return;
    const anterior = document.activeElement as HTMLElement | null;
    botao.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("keydown", tecla);
      anterior?.focus?.();
    };
  }, [pedido, fechar]);
  if (!pedido) return null;
  // Dentro do .app, para os botões do app valerem aqui também.
  const alvo = document.querySelector(".app") ?? document.body;
  return createPortal(
    <div className="cfm-fundo" onMouseDown={(e) => e.target === e.currentTarget && fechar()}>
      <div className="cfm" role="alertdialog" aria-modal="true" aria-labelledby="cfm-tit" aria-describedby="cfm-txt" data-perigo={pedido.perigo || undefined}>
        <h2 id="cfm-tit">{pedido.titulo}</h2>
        <div id="cfm-txt" className="cfm-txt">
          {pedido.texto}
        </div>
        <div className="cfm-acoes">
          <button type="button" className="bt" onClick={fechar}>
            Cancelar
          </button>
          <button
            ref={botao}
            type="button"
            className={pedido.perigo ? "bt mn-perigo-bt" : "bt bt-pri"}
            onClick={() => {
              pedido.aoConfirmar();
              fechar();
            }}
          >
            {pedido.confirmar}
          </button>
        </div>
      </div>
    </div>,
    alvo
  );
}

/** Atalho: `pedir({...})` abre a confirmação; `dialogo` vai no JSX de quem usa. */
export function useConfirmar() {
  const [pedido, setPedido] = useState<PedidoConfirmacao | null>(null);
  const fechar = useCallback(() => setPedido(null), []);
  return { pedir: setPedido, dialogo: <Confirmar pedido={pedido} fechar={fechar} /> };
}
