import { useEffect } from "react";

/**
 * Atalhos do editor. Ctrl/⌘ + Z, Shift + Z e Y (desfazer e refazer) já vêm do Puck.
 * Aqui: Ctrl/⌘ + "+" e "−" aproximam e afastam a prévia, e Ctrl/⌘ + 0 volta ao zoom automático,
 * no lugar do zoom do navegador. Valem com o foco no editor e dentro da prévia.
 */
const botao = (rotulo: string) =>
  document.querySelector<HTMLButtonElement>(`[class*="_ViewportControls_"] button[title="${rotulo}"], [class*="_ViewportControls_"] button[aria-label="${rotulo}"]`);

function aoTeclar(e: KeyboardEvent) {
  if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
  if (e.key === "=" || e.key === "+") {
    e.preventDefault();
    botao("Aproximar")?.click();
  } else if (e.key === "-" || e.key === "_") {
    e.preventDefault();
    botao("Afastar")?.click();
  } else if (e.key === "0") {
    e.preventDefault();
    const select = document.querySelector<HTMLSelectElement>('[class*="_ViewportControls-zoomSelect_"]');
    if (select && select.options.length) {
      // A opção "(automático)" é o zoom que faz a página caber na tela; a lista vem em ordem crescente.
      const opcoes = [...select.options];
      const auto = opcoes.find((o) => /autom/i.test(o.label)) ?? opcoes[opcoes.length - 1];
      select.value = auto.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}

export function Atalhos() {
  useEffect(() => {
    let doc: Document | null = null;
    window.addEventListener("keydown", aoTeclar, true);
    const ligar = () => {
      const d = document.querySelector<HTMLIFrameElement>(".ed iframe")?.contentDocument ?? null;
      if (d && d !== doc) {
        doc?.removeEventListener("keydown", aoTeclar, true);
        doc = d;
        d.addEventListener("keydown", aoTeclar, true);
      }
    };
    ligar();
    const t = window.setInterval(ligar, 1000);
    return () => {
      window.removeEventListener("keydown", aoTeclar, true);
      window.clearInterval(t);
      doc?.removeEventListener("keydown", aoTeclar, true);
    };
  }, []);
  return null;
}
