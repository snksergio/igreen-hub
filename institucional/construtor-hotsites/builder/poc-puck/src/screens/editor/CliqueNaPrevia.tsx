import { useGetPuck } from "@puckeditor/core";
import { useEffect } from "react";
import { setAba } from "./contexto";
import { campoPeloClique, focarCampo, pedirCampo } from "./navegar";
import { camposDe } from "./PainelEsquerdo";

const iframePrevia = () => document.querySelector<HTMLIFrameElement>(".ed iframe");

/**
 * Clicar num texto, botão ou imagem da prévia (no modo Editar) seleciona a peça, como antes, e
 * também o campo daquele elemento: contorno rosa na prévia, campo aberto no painel da direita.
 */
export function CliqueNaPrevia() {
  const getPuck = useGetPuck();
  useEffect(() => {
    let doc: Document | null = null;
    let espera: number | undefined;
    const aoClicar = (e: MouseEvent) => {
      const { appState } = getPuck();
      if (appState.ui.previewMode !== "edit" || e.button !== 0) return;
      const d = (e.target as Node | null)?.ownerDocument;
      if (!d) return;
      // A camada de seleção do Puck fica por cima: pega tudo o que está sob o ponteiro.
      const pilha = d.elementsFromPoint(e.clientX, e.clientY);
      const bloco = pilha.map((el) => el.closest("[data-puck-component]")).find(Boolean);
      const id = bloco?.getAttribute("data-puck-component");
      const item = id ? appState.data.content.find((c) => c.props.id === id) : undefined;
      if (!bloco || !id || !item) return;
      // No modo Editar o Puck desliga o clique do conteúdo da peça (pointer-events: none), então os
      // elementos sob o ponteiro saem da geometria: os que têm o ponto dentro da caixa deles.
      const { clientX: x, clientY: y } = e;
      const sob = [...bloco.querySelectorAll("*")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      });
      const campos = camposDe(item.type);
      const chave = campoPeloClique(bloco, sob, item.props as Record<string, unknown>, campos.map((c) => c.chave));
      const campo = campos.find((c) => c.chave === chave);
      if (!campo) return;
      // Espera o Puck trocar a peça selecionada (isso limpa o campo marcado) antes de marcar este.
      window.clearTimeout(espera);
      espera = window.setTimeout(() => {
        setAba("estrutura");
        pedirCampo(`${id}:${campo.chave}`);
        focarCampo(campo.rotulo);
      }, 140);
    };
    // O documento da prévia pode ser recriado: confere e religa de tempos em tempos.
    const ligar = () => {
      const d = iframePrevia()?.contentDocument ?? null;
      if (d && d !== doc) {
        doc?.removeEventListener("click", aoClicar, true);
        doc = d;
        d.addEventListener("click", aoClicar, true);
      }
    };
    ligar();
    const t = window.setInterval(ligar, 1000);
    return () => {
      window.clearInterval(t);
      window.clearTimeout(espera);
      doc?.removeEventListener("click", aoClicar, true);
    };
  }, [getPuck]);
  return null;
}
