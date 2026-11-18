import type { Config, Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core/rsc";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AMOSTRAS } from "../lib/imagens";
import { CATALOGO, pecaPorNome, type PecaId } from "./catalogo";
import { config } from "./config";
import { PageContext } from "./context";
import { Ilustracao } from "./ilustracoes";

const LARGURA_RENDER = 1024;
const LARGURA_POP = 360;
const ATRASO_MS = 350;

/** Mesma configuração, mas sem cabeçalho e rodapé: só a peça. */
const configPrevia: Config = {
  ...(config as unknown as Config),
  root: { render: ({ children }: { children?: ReactNode }) => <div className="hs">{children}</div> },
};

/** Na prévia, algumas peças ficam mais fáceis de entender com imagem de verdade. */
const [MOBI, THIAGO, RAFAEL, AMANDA] = AMOSTRAS.map((a) => a.src);
const PREVIA_PROPS: Partial<Record<PecaId, Record<string, unknown>>> = {
  Abertura: { imagemUrl: MOBI },
  Pessoas: {
    pessoas: [
      { fotoUrl: THIAGO, nome: "Thiago", papel: "Anfitrião" },
      { fotoUrl: RAFAEL, nome: "Rafael", papel: "Convidado" },
      { fotoUrl: AMANDA, nome: "Amanda", papel: "Convidada" },
    ],
  },
};

/** "Você muda: Título, Subtítulo…" a partir dos campos da própria peça. */
function campos(id: PecaId): string {
  const fields = (config.components[id] as { fields?: Record<string, { label?: string }> }).fields ?? {};
  const nomes = Object.values(fields)
    .map((f) => (f.label ?? "").replace(/\s*\(.*?\)\s*/g, "").trim())
    .filter(Boolean);
  const mostra = nomes.slice(0, 5).join(", ");
  return nomes.length > 5 ? `${mostra} e mais ${nomes.length - 5}` : mostra;
}

function PreviaPeca({ id }: { id: PecaId }) {
  const inner = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState(160);
  const escala = (LARGURA_POP - 24) / LARGURA_RENDER;
  const data: Data = {
    root: { props: {} },
    content: [
      { type: id, props: { ...(config.components[id].defaultProps ?? {}), ...(PREVIA_PROPS[id] ?? {}), id: `previa-${id}` } },
    ],
  } as Data;

  // Acompanha a altura real da peça (as imagens carregam depois e mudam o tamanho).
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const medir = () => setAltura(Math.min(200, el.scrollHeight * escala));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [escala]);

  return (
    <div className="pp-prev" style={{ height: altura }}>
      <div ref={inner} className="pp-prev__inner" style={{ width: LARGURA_RENDER, transform: `scale(${escala})` }}>
        <PageContext.Provider value={{ persona: {}, mode: "miniatura", pageId: "", pageSlug: "" }}>
          <Render config={configPrevia} data={data} />
        </PageContext.Provider>
      </div>
    </div>
  );
}

type Ancora = { card: DOMRect; borda: number };

function Popover({ id, ancora }: { id: PecaId; ancora: Ancora }) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(ancora.card.top);
  const c = CATALOGO[id];

  // Sempre na mesma coluna (logo depois do painel), centrado na altura do card e dentro da tela.
  // Recalcula quando a prévia muda de altura (a peça e as imagens terminam de desenhar depois).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const posicionar = () => {
      const h = el.offsetHeight;
      const centro = ancora.card.top + ancora.card.height / 2 - h / 2;
      setTop(Math.max(12, Math.min(centro, window.innerHeight - h - 12)));
    };
    posicionar();
    const ro = new ResizeObserver(posicionar);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ancora]);

  return createPortal(
    <div ref={ref} className="pp" role="tooltip" style={{ top, left: ancora.borda + 16, width: LARGURA_POP }}>
      <div className="pp-head">
        <strong>{c.nome}</strong>
        <span>{c.tecnico}</span>
      </div>
      <PreviaPeca id={id} />
      <p className="pp-desc">{c.descricao}</p>
      <p className="pp-como">
        <strong>Como funciona:</strong> {c.comoFunciona}
      </p>
      <p className="pp-campos">
        <strong>Você muda:</strong> {campos(id)}.
      </p>
      <p className="pp-dica">Arraste para a página para usar.</p>
    </div>,
    document.body
  );
}

/** Card da gaveta de peças: ilustração, nome e um subtítulo. No hover, abre a prévia. */
export function ItemGaveta({ name }: { name: string }) {
  const id = pecaPorNome(name);
  const el = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [ancora, setAncora] = useState<Ancora | null>(null);

  const fechar = () => {
    window.clearTimeout(timer.current);
    setAncora(null);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!id) return <div className="dw-item">{name}</div>;
  const c = CATALOGO[id];

  return (
    <div
      ref={el}
      className="dw-item"
      onMouseEnter={() => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          if (!el.current) return;
          const card = el.current.getBoundingClientRect();
          // Borda direita do painel flutuante (ou do card, fora do editor).
          const painel = el.current.closest('[class*="_Sidebar--left_"]')?.getBoundingClientRect();
          setAncora({ card, borda: painel?.right ?? card.right });
        }, ATRASO_MS);
      }}
      onMouseLeave={fechar}
      onMouseDown={fechar}
    >
      <span className="dw-tile">
        <Ilustracao id={id} />
      </span>
      <span className="dw-txt">
        <span className="dw-nome">{c.nome}</span>
        <span className="dw-sub">{c.tecnico}</span>
      </span>
      {ancora && <Popover id={id} ancora={ancora} />}
    </div>
  );
}
