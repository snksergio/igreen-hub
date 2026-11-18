import { createUsePuck, useGetPuck } from "@puckeditor/core";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, Fragment } from "react";
import { createPortal } from "react-dom";
import { uid } from "../../lib/slug";
import { CATALOGO, GRUPOS, type PecaId } from "../../puck/catalogo";
import { Icone } from "../../ui/Icone";
import { mostrarNaPrevia, ZONA } from "./navegar";

const usePuck = createUsePuck();

/* Pedido de abrir o menu: vem da Estrutura (botão direito ou "⋯") e da prévia (botão direito). */
type Pedido = { x: number; y: number; index: number } | null;
let pedido: Pedido = null;
const ouvintes = new Set<() => void>();

export function abrirMenuPeca(p: Pedido) {
  pedido = p;
  ouvintes.forEach((f) => f());
}

function usePedido(): Pedido {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => pedido
  );
}

const iframePrevia = () => document.querySelector<HTMLIFrameElement>(".ed iframe");

/** Menu de ações de uma seção: mover, duplicar, adicionar abaixo, travar ou destravar, apagar. */
export function MenuPeca() {
  const p = usePedido();
  const content = usePuck((s) => s.appState.data.content);
  const dispatch = usePuck((s) => s.dispatch);
  const ref = useRef<HTMLDivElement>(null);
  const [lista, setLista] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  // Abre onde o clique aconteceu, sem sair da tela.
  useLayoutEffect(() => {
    if (!p || !ref.current) return;
    const { offsetWidth: w, offsetHeight: h } = ref.current;
    setPos({
      left: Math.max(8, Math.min(p.x, window.innerWidth - w - 8)),
      top: Math.max(8, Math.min(p.y, window.innerHeight - h - 8)),
    });
  }, [p, lista]);

  useEffect(() => {
    setLista(false);
    if (!p) return;
    const fechar = () => abrirMenuPeca(null);
    const fora = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) fechar();
    };
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    const doc = iframePrevia()?.contentDocument;
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", tecla);
    doc?.addEventListener("mousedown", fechar);
    window.addEventListener("resize", fechar);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", tecla);
      doc?.removeEventListener("mousedown", fechar);
      window.removeEventListener("resize", fechar);
    };
  }, [p]);

  if (!p) return null;
  const i = p.index;
  const item = content[i];
  if (!item) return null;
  const ficha = CATALOGO[item.type as PecaId];
  const travado = Boolean((item.props as { travado?: boolean }).travado);
  const anteriorTravado = Boolean((content[i - 1]?.props as { travado?: boolean } | undefined)?.travado);

  const selecionar = (index: number) => dispatch({ type: "setUi", ui: { itemSelector: { index, zone: ZONA }, rightSideBarVisible: true } });
  const feito = (acao: () => void) => () => {
    acao();
    abrirMenuPeca(null);
  };

  const mover = (para: number) => {
    dispatch({ type: "move", sourceIndex: i, sourceZone: ZONA, destinationIndex: para, destinationZone: ZONA });
    selecionar(para);
  };
  const inserir = (tipo: PecaId) => {
    const id = `${tipo}-${uid()}`;
    dispatch({ type: "insert", componentType: tipo, destinationIndex: i + 1, destinationZone: ZONA, id });
    selecionar(i + 1);
    setTimeout(() => mostrarNaPrevia(id), 150);
  };
  const alternarTrava = () =>
    dispatch({
      type: "replace",
      destinationIndex: i,
      destinationZone: ZONA,
      data: { ...item, props: { ...item.props, travado: !travado } },
    });

  return createPortal(
    <div ref={ref} className="mc" role="menu" aria-label={`Ações de ${ficha?.nome ?? item.type}`} style={pos}>
      <div className="mc-cab">
        <b>{ficha?.nome ?? item.type}</b>
        <span>{ficha?.tecnico}</span>
      </div>
      <button role="menuitem" disabled={i === 0 || travado || anteriorTravado} onClick={feito(() => mover(i - 1))}>
        <Icone nome="chevCima" tamanho={16} />
        Mover para cima
      </button>
      <button role="menuitem" disabled={i === content.length - 1 || travado} onClick={feito(() => mover(i + 1))}>
        <Icone nome="chev" tamanho={16} />
        Mover para baixo
      </button>
      <button role="menuitem" disabled={travado} onClick={feito(() => dispatch({ type: "duplicate", sourceIndex: i, sourceZone: ZONA }))}>
        <Icone nome="copiar" tamanho={16} />
        Duplicar
      </button>
      <button role="menuitem" aria-expanded={lista} onClick={() => setLista((v) => !v)}>
        <Icone nome="mais" tamanho={16} />
        Adicionar peça abaixo
        <Icone nome={lista ? "chev" : "chevDir"} tamanho={14} className="mc-fim" />
      </button>
      {lista && (
        <div className="mc-lista">
          {Object.values(GRUPOS).map((g) => (
            <Fragment key={g.title}>
              <p className="mc-grupo">{g.title}</p>
              {g.components.map((c) => (
                <button key={c} role="menuitem" onClick={feito(() => inserir(c))}>
                  {CATALOGO[c].nome}
                  <span>{CATALOGO[c].tecnico}</span>
                </button>
              ))}
            </Fragment>
          ))}
        </div>
      )}
      <div className="mc-div" />
      <button role="menuitem" onClick={feito(alternarTrava)}>
        <Icone nome="cadeado" tamanho={16} />
        {travado ? "Destravar" : "Travar no lugar"}
      </button>
      <button
        role="menuitem"
        className="mc-perigo"
        disabled={travado}
        onClick={feito(() => {
          dispatch({ type: "remove", index: i, zone: ZONA });
          dispatch({ type: "setUi", ui: { itemSelector: null } });
        })}
      >
        <Icone nome="lixo" tamanho={16} />
        Apagar
        <kbd className="mc-fim">Del</kbd>
      </button>
      {travado && <p className="mc-nota">Travada pelo modelo: destrave para mover, duplicar ou apagar.</p>}
    </div>,
    document.body
  );
}

/** Botão direito numa seção da prévia: seleciona e abre o mesmo menu (a prévia é um iframe). */
export function MenuNaPrevia() {
  const getPuck = useGetPuck();
  useEffect(() => {
    let doc: Document | null = null;
    const aoClicar = (e: MouseEvent) => {
      const alvo = (e.target as Element | null)?.closest?.("[data-puck-component]");
      if (!alvo) return;
      const { appState, dispatch } = getPuck();
      const index = appState.data.content.findIndex((c) => c.props.id === alvo.getAttribute("data-puck-component"));
      const iframe = iframePrevia();
      if (index < 0 || !iframe) return;
      e.preventDefault();
      const r = iframe.getBoundingClientRect();
      const escala = iframe.clientWidth ? r.width / iframe.clientWidth : 1; // a prévia pode estar com zoom
      dispatch({ type: "setUi", ui: { itemSelector: { index, zone: ZONA }, rightSideBarVisible: true } });
      abrirMenuPeca({ x: r.left + e.clientX * escala, y: r.top + e.clientY * escala, index });
    };
    // O documento da prévia pode ser recriado: confere e religa de tempos em tempos.
    const ligar = () => {
      const d = iframePrevia()?.contentDocument ?? null;
      if (d && d !== doc) {
        doc?.removeEventListener("contextmenu", aoClicar);
        doc = d;
        d.addEventListener("contextmenu", aoClicar);
      }
    };
    ligar();
    const t = window.setInterval(ligar, 1000);
    return () => {
      window.clearInterval(t);
      doc?.removeEventListener("contextmenu", aoClicar);
    };
  }, [getPuck]);
  return null;
}
