import { Fragment, useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { abrirFormulario } from "../form/abrir";
import { whatsHref } from "../lib/persona";
import { usePageCtx } from "../puck/context";
import { safeUrl, type CtaProps } from "../puck/ui";
import "./live.css";
import "./comportamentos.js";

/* Peças compartilhadas do kit iGreen Live (o visual de mockups/landing-evento.html). */

declare global {
  interface Window {
    igreenLive?: { iniciar: (el: Element | null, nome: string, op?: { publico?: boolean }) => (() => void) | undefined };
  }
}

/** Liga um ou mais comportamentos de comportamentos.js no elemento ("revelar contar"). */
export function useLive<T extends Element>(nomes: string, deps: unknown[] = []) {
  const ref = useRef<T>(null);
  const { mode } = usePageCtx();
  useEffect(() => {
    const el = ref.current;
    if (!el || mode === "miniatura" || !window.igreenLive) return;
    const limpezas = nomes
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => window.igreenLive!.iniciar(el, n, { publico: mode === "publico" }));
    return () => limpezas.forEach((f) => f?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, nomes, ...deps]);
  return ref;
}

/**
 * Texto com destaque, sem HTML: *assim* fica verde, _assim_ fica cinza e **assim** fica em negrito claro.
 * Quebra de linha vira <br>.
 */
export function rico(texto: string | undefined): ReactNode {
  const linhas = (texto ?? "").split("\n");
  return linhas.map((linha, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {linha.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g).map((parte, j) => {
        if (/^\*\*[^*]+\*\*$/.test(parte)) return <strong key={j}>{parte.slice(2, -2)}</strong>;
        if (/^\*[^*]+\*$/.test(parte)) return <span key={j} className="lima">{parte.slice(1, -1)}</span>;
        if (/^_[^_]+_$/.test(parte)) return <span key={j} className="apagado">{parte.slice(1, -1)}</span>;
        return <Fragment key={j}>{parte}</Fragment>;
      })}
    </Fragment>
  ));
}

/** Separa "+500 mil" em sinal antes (verde), número (conta) e o resto; "%" no fim fica verde. */
export function partesValor(valor: string): { antes: string; numero: string; depois: string; depoisVerde: boolean } {
  const m = /^([^\d]*)([\d.,]+)(.*)$/.exec((valor ?? "").trim());
  if (!m) return { antes: "", numero: "", depois: valor ?? "", depoisVerde: false };
  const depois = m[3];
  return { antes: m[1], numero: m[2], depois, depoisVerde: /^\s*[%+]\s*$/.test(depois) };
}

/** Valor numérico para a contagem: "3.000" → 3000, "15" → 15. Vazio se não der para contar. */
export function numeroParaContar(numero: string): number | undefined {
  const n = Number(numero.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 && Number.isInteger(n) ? n : undefined;
}

/** Número com o sinal verde e a contagem ligada, no padrão do kit. */
export function Valor({ valor, sup = false }: { valor: string; sup?: boolean }) {
  const p = partesValor(valor);
  const alvo = numeroParaContar(p.numero);
  const Fim = sup ? "sup" : "em";
  return (
    <>
      {p.antes && <em>{p.antes}</em>}
      <span data-lv-conta={alvo}>{p.numero}</span>
      {p.depois && (p.depoisVerde ? <Fim>{p.depois.trim()}</Fim> : p.depois)}
    </>
  );
}

const PATHS: Record<string, ReactNode> = {
  seta: <path d="M7 17L17 7M8 7h9v9" />,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />,
  cal: <><rect x="3" y="4.5" width="18" height="17" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  relogio: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  carro: <><path d="M3.5 16.5v-3.2c0-.6.4-1.1 1-1.3l2-.6 1.7-3.4c.3-.6.9-1 1.6-1h4.4c.7 0 1.3.4 1.6 1l1.7 3.4 2 .6c.6.2 1 .7 1 1.3v3.2M3.5 16.5h1.8M8.7 16.5h6.6M18.7 16.5h1.8M7.6 11.6h8.8" /><circle cx="7" cy="16.8" r="1.7" /><circle cx="17" cy="16.8" r="1.7" /></>,
  acesso: <><circle cx="12" cy="4.5" r="1.8" /><path d="M5 8.5l7 1 7-1M12 9.5v5M9 21l3-6.5 3 6.5" /></>,
  ok: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  menu: <path d="M4 8h16M4 16h16" />,
  mais: <path d="M12 5v14M5 12h14" />,
  menos: <path d="M5 12h14" />,
  cima: <path d="M12 19V5M5 12l7-7 7 7" />,
  raio: <path d="M13 2.5L5 13.5h6.5L10.5 21.5 19 10.5h-6.5L13 2.5z" />,
  sinal: <><path d="M2.5 9a14 14 0 0 1 19 0M6 12.6a9 9 0 0 1 12 0M9.4 16.1a4.2 4.2 0 0 1 5.2 0" /><circle cx="12" cy="19.4" r="1.1" fill="currentColor" stroke="none" /></>,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  escudo: <><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6L12 3z" /><path d="M9 12l2 2 4-4" /></>,
  estrela: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z" />,
  tomada: <path d="M9 2.5v5M15 2.5v5M6.5 7.5h11v3a5.5 5.5 0 0 1-11 0v-3zM12 16v5.5" />,
  whats: <path fill="currentColor" stroke="none" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 5 5.1-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c-.1-.1-.3-.2-.5-.3z" />,
};

export const ICONES_FAIXA = [
  { label: "Raio", value: "raio" },
  { label: "Sinal", value: "sinal" },
  { label: "Carro", value: "carro" },
  { label: "Sol", value: "sol" },
  { label: "Escudo", value: "escudo" },
  { label: "Estrela", value: "estrela" },
  { label: "Tomada", value: "tomada" },
];

export function Icone({ nome, className = "icone", style }: { nome: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" style={style}>
      {PATHS[nome] ?? PATHS.seta}
    </svg>
  );
}

export const Seta = () => (
  <span className="seta">
    <Icone nome="seta" />
  </span>
);

/** Para onde o botão leva: formulário da página, WhatsApp do licenciado ou outro link. */
export function useHref() {
  const { persona } = usePageCtx();
  return (p: Pick<CtaProps, "destino" | "link" | "mensagemWhats">) => {
    if (p.destino === "inscricao") return { href: "#inscricao" };
    if (p.destino === "formulario")
      return {
        href: "#inscricao",
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          abrirFormulario(e.currentTarget.ownerDocument, { completo: true });
        },
      };
    if (p.destino === "whatsapp")
      return { href: whatsHref(persona, p.mensagemWhats || "Olá! Quero saber mais."), target: "_blank", rel: "noopener noreferrer" };
    const url = safeUrl(p.link);
    if (!url) return { href: "#" };
    return url.startsWith("#") ? { href: url } : { href: url, target: "_blank", rel: "noopener noreferrer" };
  };
}

/** Link interno da página (#programacao) ou externo. */
export function hrefSimples(link: string | undefined) {
  const v = (link ?? "").trim();
  if (v.startsWith("#")) return { href: v };
  const url = safeUrl(v);
  return url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : { href: "#" };
}

/** Botão verde com a seta no círculo escuro (o botão do iGreen Live). Vazio = sem botão. */
export function BotaoLima(p: CtaProps & { className?: string; revela?: number }) {
  const href = useHref();
  if (!p.botaoTexto) return null;
  return (
    <a className={`btn ${p.className ?? ""}`} {...href(p)}>
      {p.botaoTexto} <Seta />
    </a>
  );
}

export const listaDeTexto = (v: string | undefined) =>
  (v ?? "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
