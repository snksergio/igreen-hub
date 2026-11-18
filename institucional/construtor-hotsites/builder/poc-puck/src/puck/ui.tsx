import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { abrirFormulario } from "../form/abrir";
import { safeImg } from "../lib/imagens";
import { whatsHref } from "../lib/persona";
import { formatarNumero, partesNumero } from "../lib/tempo";
import { usePageCtx } from "./context";

export type Fundo = "claro" | "escuro";
export type Destino = "inscricao" | "formulario" | "whatsapp" | "link";

/** A única variação visual permitida em qualquer peça. */
export const fundoField = {
  type: "radio" as const,
  label: "Fundo",
  options: [
    { label: "Claro", value: "claro" },
    { label: "Escuro", value: "escuro" },
  ],
};

export const ctaFields = {
  botaoTexto: { type: "text" as const, label: "Texto do botão (vazio = sem botão)" },
  destino: {
    type: "select" as const,
    label: "O botão leva para",
    options: [
      { label: "Formulário de inscrição da página", value: "inscricao" },
      { label: "Formulário completo, em janela (modal)", value: "formulario" },
      { label: "WhatsApp (do licenciado, se vier no link)", value: "whatsapp" },
      { label: "Outro link", value: "link" },
    ],
  },
  link: { type: "text" as const, label: "Link (só se escolher 'Outro link')" },
  mensagemWhats: { type: "text" as const, label: "Mensagem que já abre no WhatsApp" },
};

export type CtaProps = { botaoTexto: string; destino: Destino; link: string; mensagemWhats: string };

export function safeUrl(v: string | undefined): string | undefined {
  if (!v) return undefined;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : undefined;
  } catch {
    return undefined;
  }
}

/** Trava vinda do modelo: a peça não sai, não muda de lugar e não duplica. */
export const travaPermissions = (data: { props: { travado?: boolean } }) =>
  data.props.travado
    ? { delete: false, drag: false, duplicate: false }
    : { delete: true, drag: true, duplicate: true };

/* ---------- Animação de entrada ----------
   Cada peça marca o que anima com r(ordem, tipo). A seção decide quando entra:
   só na página pública, só com "Animações ao rolar" ligadas e só se o sistema
   do visitante não pede movimento reduzido. No editor e nas prévias, tudo aparece parado. */

type Visivel = { visivel: boolean; animar: boolean };
const VisivelContext = createContext<Visivel>({ visivel: true, animar: false });
export const useVisivel = () => useContext(VisivelContext);

export type TipoEntrada = "up" | "left" | "zoom" | "fade";

/** Marca um elemento para entrar ao rolar. `ordem` escalona a entrada (0, 1, 2…). */
export const r = (ordem = 0, tipo: TipoEntrada = "up") => ({
  "data-r": tipo,
  style: { "--i": Math.min(ordem, 12) } as CSSProperties,
});

export function Section(props: {
  fundo?: Fundo;
  id?: string;
  titulo?: string;
  travado?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const { mode } = usePageCtx();
  const ref = useRef<HTMLElement>(null);
  const [estado, setEstado] = useState<Visivel>({ visivel: true, animar: false });
  const [primeiraDobra, setPrimeiraDobra] = useState(false);

  // useLayoutEffect: esconde antes da primeira pintura, sem piscar.
  useLayoutEffect(() => {
    const el = ref.current;
    const win = el?.ownerDocument.defaultView;
    const ligada = el?.closest(".hs")?.getAttribute("data-anim") !== "off";
    const reduzido = win?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (mode !== "publico" || !el || !win || !ligada || reduzido || !("IntersectionObserver" in win)) {
      setEstado({ visivel: true, animar: false });
      return;
    }
    // O que já aparece ao abrir a página anima só com movimento, sem começar transparente:
    // elemento invisível não conta como pintado, e isso pioraria o LCP do Lighthouse.
    setPrimeiraDobra(el.getBoundingClientRect().top < win.innerHeight);
    setEstado({ visivel: false, animar: true });
    const io = new win.IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEstado({ visivel: true, animar: true });
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  return (
    <section
      ref={ref}
      id={props.id}
      className={`hs-sec ${props.className ?? ""}`}
      data-fundo={props.fundo ?? "claro"}
      data-estado={estado.animar ? (estado.visivel ? "in" : "out") : undefined}
      data-primeira={primeiraDobra || undefined}
    >
      {mode === "editor" && props.travado && <span className="hs-lock">Peça travada pelo modelo</span>}
      <VisivelContext.Provider value={estado}>
        <div className="hs-wrap">
          {props.titulo && (
            <h2 className="hs-h2" {...r(0)}>
              {props.titulo}
            </h2>
          )}
          {props.children}
        </div>
      </VisivelContext.Provider>
    </section>
  );
}

/** Número que conta de 0 até o valor quando a seção entra na tela ("+500", "R$ 1.500", "4%"). */
export function Conta({ texto }: { texto: string }) {
  const { visivel, animar } = useVisivel();
  const partes = useMemo(() => partesNumero(texto), [texto]);
  const [valor, setValor] = useState<number | null>(null);

  useEffect(() => {
    if (!animar || !partes) return;
    if (!visivel) {
      setValor(0);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const passo = (t: number) => {
      const k = Math.min(1, (t - t0) / 1200);
      setValor(partes.valor * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [visivel, animar, partes]);

  // data-conta: o HTML estático usa para animar sem React.
  if (!partes || !animar || valor === null) return <span data-conta={partes ? texto : undefined}>{texto}</span>;
  return <span data-conta={texto}>{formatarNumero(partes, valor)}</span>;
}

export function Cta({ botaoTexto, destino, link, mensagemWhats }: CtaProps) {
  const { persona } = usePageCtx();
  if (!botaoTexto) return null;
  if (destino === "formulario") {
    // Abre o formulário inteiro em modal; sem JavaScript (HTML estático), leva à seção de inscrição.
    const abrir = (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      abrirFormulario(e.currentTarget.ownerDocument, { completo: true });
    };
    return (
      <a className="hs-btn" href="#inscricao" onClick={abrir}>
        {botaoTexto}
      </a>
    );
  }
  if (destino === "inscricao") {
    // Link de verdade (#inscricao): funciona sem JavaScript e o Google entende.
    // No painel da POC a rota usa "#", então o clique rola a página em vez de trocar o endereço.
    const go = (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.currentTarget.ownerDocument.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth" });
    };
    return (
      <a className="hs-btn" href="#inscricao" onClick={go}>
        {botaoTexto}
      </a>
    );
  }
  const href = destino === "whatsapp" ? whatsHref(persona, mensagemWhats || "Olá! Quero saber mais.") : safeUrl(link);
  return (
    <a className="hs-btn" href={href ?? "#"} target="_blank" rel="noopener noreferrer">
      {botaoTexto}
    </a>
  );
}

export function Avatar({ src, nome }: { src?: string; nome?: string }) {
  const url = safeImg(src);
  const ini = (nome ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return url ? <img className="hs-avatar" src={url} alt={nome ?? ""} loading="lazy" decoding="async" width={112} height={112} /> : <span className="hs-avatar hs-avatar--ini">{ini}</span>;
}
