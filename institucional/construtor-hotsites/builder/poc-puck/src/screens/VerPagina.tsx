import { useEffect, useMemo, useRef, useState } from "react";
import { getPageBySlug } from "../lib/pages";
import { Aparelho, APARELHOS, enderecoPrevia, type IdAparelho } from "../ui/Aparelho";
import { Icone } from "../ui/Icone";
import { BotaoTema } from "../ui/tema";
import { NaoEncontrada } from "./Shell";
import "../app.css";
import "./verpagina.css";

type Modo = IdAparelho | "todas";
const TODAS: IdAparelho[] = ["computador", "tablet", "celular"];
const MODOS: Modo[] = ["computador", "notebook", "tablet", "celular", "todas"];
const FOLGA = 32; // margem da área em volta das telas
const VAO = 40; // espaço entre as telas, lado a lado
const LEGENDA = 40; // altura da legenda embaixo de cada tela

/**
 * "Ver página" do construtor: a página em tamanhos de tela diferentes, sem mexer no navegador,
 * ou as três (computador, tablet e celular) lado a lado. Atualiza sozinha quando o construtor salva.
 */
export function VerPagina({ slug, query }: { slug: string; query: URLSearchParams }) {
  const page = useMemo(() => getPageBySlug(slug), [slug]);
  const inicial = query.get("modo") as Modo | null;
  const [modo, setModo] = useState<Modo>(inicial && MODOS.includes(inicial) ? inicial : "computador");
  const [recarga, setRecarga] = useState(0);
  const area = useRef<HTMLDivElement>(null);
  const [tam, setTam] = useState({ w: 1200, h: 700 });

  // Os parâmetros que vieram (licenciado, origem…) seguem para a página; `modo` é só desta tela.
  const extra = useMemo(() => {
    const q = new URLSearchParams(query);
    q.delete("modo");
    return q;
  }, [query]);
  const src = page ? enderecoPrevia(page.slug, extra) : "";

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const medir = () => setTam({ w: el.clientWidth, h: el.clientHeight });
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [page]);

  useEffect(() => {
    document.title = `Ver página · ${page?.title ?? ""}`;
  }, [page?.title]);

  // Guarda o modo no endereço: recarregar a aba volta no mesmo tamanho.
  useEffect(() => {
    const q = new URLSearchParams(extra);
    if (modo !== "computador") q.set("modo", modo);
    const qs = q.toString();
    history.replaceState(null, "", `#/ver/${encodeURIComponent(slug)}${qs ? `?${qs}` : ""}`);
  }, [modo, extra, slug]);

  if (!page) return <NaoEncontrada oQue="Página" />;

  const lista = modo === "todas" ? TODAS : [modo];
  const larguras = lista.reduce((s, id) => s + APARELHOS[id].largura, 0);
  const altura = Math.max(...lista.map((id) => APARELHOS[id].altura));
  const escala = Math.min(1, (tam.w - FOLGA * 2 - VAO * (lista.length - 1)) / larguras, (tam.h - FOLGA * 2 - LEGENDA) / altura);
  const pct = Math.round(escala * 100);

  return (
    <div className="app vp">
      <header className="vp-topo">
        <div className="vp-lado">
          <a className="bt bt-p" href={`#/editar/${page.id}`} aria-label="Voltar ao construtor">
            <Icone nome="voltar" tamanho={15} />
            <span className="vp-some">Construtor</span>
          </a>
          <span className="vp-titulo">
            <b>{page.title}</b>
            <small>Atualiza sozinha quando você salva no construtor</small>
          </span>
        </div>

        <div className="seg vp-modos" role="group" aria-label="Tamanho da tela">
          {(Object.keys(APARELHOS) as IdAparelho[]).map((id) => (
            <button key={id} aria-pressed={modo === id} onClick={() => setModo(id)} aria-label={APARELHOS[id].nome} title={`${APARELHOS[id].nome} · ${APARELHOS[id].largura} × ${APARELHOS[id].altura}`}>
              <Icone nome={APARELHOS[id].icone} tamanho={15} />
              <span className="vp-some">{APARELHOS[id].nome}</span>
            </button>
          ))}
          <span className="vp-div" aria-hidden="true" />
          <button aria-pressed={modo === "todas"} onClick={() => setModo("todas")} aria-label="Lado a lado" title="Computador, tablet e celular ao mesmo tempo">
            <Icone nome="grade" tamanho={15} />
            <span className="vp-some">Lado a lado</span>
          </button>
        </div>

        <div className="vp-lado vp-dir">
          <button className="bt bt-p bt-ic" onClick={() => setRecarga((n) => n + 1)} title="Recarregar a página" aria-label="Recarregar a página">
            <Icone nome="refazer" tamanho={15} />
          </button>
          <BotaoTema />
          <a className="bt bt-p" href={`#/p/${page.slug}`} target="_blank" rel="noopener" aria-label="Abrir a página publicada em outra aba">
            <span className="vp-some">Abrir página</span>
            <Icone nome="externo" tamanho={15} />
          </a>
        </div>
      </header>

      <div className="vp-area" ref={area} data-modo={modo}>
        <div className="vp-telas" style={{ gap: VAO }}>
          {lista.map((id) => (
            <Aparelho
              key={id}
              id={id}
              src={src}
              escala={escala}
              recarga={recarga}
              rotulo={`${APARELHOS[id].nome} · ${APARELHOS[id].largura} × ${APARELHOS[id].altura}${pct < 100 ? ` · ${pct}%` : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
