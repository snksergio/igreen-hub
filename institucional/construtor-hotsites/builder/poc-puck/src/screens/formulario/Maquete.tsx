import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Formulario } from "../../lib/formularios";
import type { PageRecord } from "../../lib/pages";
import { Aparelho, APARELHOS, enderecoPrevia } from "../../ui/Aparelho";
import { Icone } from "../../ui/Icone";
import "./maquete.css";

/* EXPERIMENTO (pedido em 2026-11-19): maquete ao vivo na aba Montagem. Para tirar, reverter o
   commit que criou este arquivo (ele só mexe aqui, em maquete.css e em uma linha do Construtor). */

type Tela = "celular" | "computador";
const ID_TELA = { celular: "celular", computador: "notebook" } as const;

/** A seção da página que mostra este formulário (a peça de inscrição). */
function secaoDoFormulario(p: PageRecord, formId: string) {
  return (p.data.content ?? []).find((b) => (b.props as { formularioId?: string } | undefined)?.formularioId === formId);
}

/**
 * A seção de inscrição de verdade, dentro de um celular ou de uma tela de computador, ao lado da
 * montagem. Cada mudança salva no formulário aparece nela em seguida.
 */
export function Maquete({ f, paginas, preferida, semPagina }: { f: Formulario; paginas: PageRecord[]; preferida?: PageRecord; semPagina: ReactNode }) {
  const comSecao = paginas.filter((p) => secaoDoFormulario(p, f.id));
  const [pid, setPid] = useState(() => (preferida && secaoDoFormulario(preferida, f.id) ? preferida.id : comSecao[0]?.id));
  const pagina = comSecao.find((p) => p.id === pid) ?? comSecao[0];
  const secao = pagina ? secaoDoFormulario(pagina, f.id) : undefined;
  const [tela, setTela] = useState<Tela>("celular");
  const caixa = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const [fixa, setFixa] = useState<{ top: number; height: number }>();
  const [tam, setTam] = useState({ w: 320, h: 560 });

  const id = ID_TELA[tela];
  const a = APARELHOS[id];
  const escala = Math.max(0.1, Math.min(1, (tam.w - 20) / a.largura, (tam.h - 20) / a.altura));
  const src = pagina && secao ? enderecoPrevia(pagina.slug, { bloco: String((secao.props as { id?: string }).id ?? "") }) : "";

  // A maquete ocupa a altura que sobra na coluna do meio e fica parada enquanto a lista rola.
  useEffect(() => {
    const meio = caixa.current?.closest<HTMLElement>(".fc-meio");
    const mont = caixa.current?.parentElement;
    const el = palco.current;
    if (!meio || !mont) return;
    const medir = () => {
      const lado = getComputedStyle(caixa.current!).position === "sticky";
      if (lado) {
        // Distância do topo da coluna até a montagem (as abas ficam em cima), sem contar a rolagem.
        // (O `top` do sticky conta a partir de dentro do recuo da coluna, por isso o desconto.)
        const topo = mont.getBoundingClientRect().top - meio.getBoundingClientRect().top + meio.scrollTop;
        const recuo = parseFloat(getComputedStyle(meio).paddingTop) || 0;
        setFixa({ top: topo - recuo, height: Math.max(420, meio.clientHeight - topo - 16) });
      } else setFixa(undefined);
      if (el) setTam({ w: el.clientWidth, h: el.clientHeight });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(meio);
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [src]);

  // Leva a prévia até o formulário quando ele não cabe na tela (no celular, vem depois do texto).
  useEffect(() => {
    const frame = palco.current?.querySelector("iframe");
    if (!frame) return;
    let timer = 0;
    const levar = () => {
      window.clearInterval(timer);
      let n = 0;
      timer = window.setInterval(() => {
        const w = frame.contentWindow;
        const alvo = frame.contentDocument?.querySelector("[data-form-inscricao]");
        if (alvo && w) {
          window.clearInterval(timer);
          const r = alvo.getBoundingClientRect();
          if (r.bottom > w.innerHeight) w.scrollTo(0, Math.max(0, r.top + w.scrollY - 16));
          else if (r.top < 0) w.scrollTo(0, 0);
        } else if (++n > 50) window.clearInterval(timer);
      }, 120);
    };
    levar();
    frame.addEventListener("load", levar);
    return () => {
      window.clearInterval(timer);
      frame.removeEventListener("load", levar);
    };
  }, [src, tela]);

  return (
    <aside className="mq" ref={caixa} aria-label="Maquete da seção na página" style={fixa}>
      <div className="mq-topo">
        <span className="mq-tit">
          <b>Na página</b>
          <small>{pagina ? "Muda enquanto você monta" : "Ainda sem página"}</small>
        </span>
        {pagina && (
          <div className="seg seg-ic mq-telas" role="group" aria-label="Tamanho da tela">
            <button aria-pressed={tela === "celular"} onClick={() => setTela("celular")} aria-label="Celular" title="Celular">
              <Icone nome="celular" tamanho={15} />
            </button>
            <button aria-pressed={tela === "computador"} onClick={() => setTela("computador")} aria-label="Computador" title="Computador">
              <Icone nome="monitor" tamanho={15} />
            </button>
          </div>
        )}
      </div>

      {comSecao.length > 1 && pagina && (
        <label className="mq-pagina">
          <span>Página</span>
          <select value={pagina.id} onChange={(e) => setPid(e.target.value)}>
            {comSecao.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
      )}

      {pagina && secao ? (
        <>
          <div className="mq-palco" ref={palco}>
            <Aparelho id={id} src={src} escala={escala} />
          </div>
          <p className="mq-pe">
            <span>{comSecao.length > 1 ? "" : `${pagina.title} · `}seção de inscrição</span>
            <a href={`#/ver/${pagina.slug}?modo=todas`} target="_blank" rel="noopener">
              <Icone nome="grade" tamanho={13} />
              Página inteira
            </a>
          </p>
        </>
      ) : (
        <div className="mq-vazio">
          <p>Este formulário ainda não está em nenhuma página. Quando estiver, a seção de verdade aparece aqui. Por enquanto, a versão curta numa peça padrão:</p>
          {semPagina}
        </div>
      )}
    </aside>
  );
}
