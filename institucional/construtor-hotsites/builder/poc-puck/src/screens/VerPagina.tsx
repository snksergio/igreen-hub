import { useEffect, useMemo, useRef, useState } from "react";
import { getPageBySlug } from "../lib/pages";
import { Aparelho, APARELHOS, enderecoPrevia, type IdAparelho } from "../ui/Aparelho";
import { Icone } from "../ui/Icone";
import { NaoEncontrada } from "./Shell";
import "../app.css";
import "./verpagina.css";

type Modo = IdAparelho | "todas";
const TODAS: IdAparelho[] = ["computador", "tablet", "celular"];
const MODOS: Modo[] = ["computador", "notebook", "tablet", "celular", "todas"];
const NOME_MODO: Record<Modo, string> = { ...Object.fromEntries(Object.entries(APARELHOS).map(([k, a]) => [k, a.nome])), todas: "Lado a lado" } as Record<Modo, string>;
type IconeModo = (typeof APARELHOS)[IdAparelho]["icone"] | "grade";
const ICONE_MODO = { ...Object.fromEntries(Object.entries(APARELHOS).map(([k, a]) => [k, a.icone])), todas: "grade" } as Record<Modo, IconeModo>;
const FOLGA = 32; // margem da área em volta das telas
const BARRA = 96; // espaço embaixo para a barra flutuante não cobrir as telas
const VAO = 40; // espaço entre as telas, lado a lado
const LEGENDA = 40; // altura da legenda embaixo de cada tela
const CHAVE_RECOLHIDA = "poc-hotsite:ver-recolhida";

const lerRecolhida = () => {
  try {
    return sessionStorage.getItem(CHAVE_RECOLHIDA) === "1";
  } catch {
    return false;
  }
};

/**
 * "Ver página" do construtor. No computador, a página ocupa a tela inteira, como aberta direto.
 * Notebook, tablet e celular aparecem numa tela do tamanho do aparelho, e "Lado a lado" mostra
 * computador, tablet e celular juntos. As opções ficam numa barra flutuante que recolhe num
 * botão pequeno. Atualiza sozinha quando o construtor salva.
 */
export function VerPagina({ slug, query }: { slug: string; query: URLSearchParams }) {
  const page = useMemo(() => getPageBySlug(slug), [slug]);
  const inicial = query.get("modo") as Modo | null;
  const [modo, setModo] = useState<Modo>(inicial && MODOS.includes(inicial) ? inicial : "computador");
  const [recolhida, setRecolhida] = useState(lerRecolhida);
  const [recarga, setRecarga] = useState(0);
  const area = useRef<HTMLDivElement>(null);
  const mini = useRef<HTMLButtonElement>(null);
  const esconder = useRef<HTMLButtonElement>(null);
  const focar = useRef(false);
  const [tam, setTam] = useState({ w: 1200, h: 700 });
  const cheia = modo === "computador";

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
  }, [page, cheia]);

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

  // Quem usa o teclado continua no botão que aparece no lugar do que sumiu.
  useEffect(() => {
    if (!focar.current) return;
    focar.current = false;
    (recolhida ? mini : esconder).current?.focus();
  }, [recolhida]);

  const recolher = (sim: boolean) => {
    focar.current = true;
    setRecolhida(sim);
    try {
      sessionStorage.setItem(CHAVE_RECOLHIDA, sim ? "1" : "0");
    } catch {
      /* sem armazenamento: vale só até recarregar */
    }
  };

  if (!page) return <NaoEncontrada oQue="Página" />;

  const lista: IdAparelho[] = modo === "todas" ? TODAS : cheia ? [] : [modo];
  const larguras = lista.reduce((s, id) => s + APARELHOS[id].largura, 0);
  const altura = Math.max(1, ...lista.map((id) => APARELHOS[id].altura));
  const embaixo = recolhida ? FOLGA : BARRA;
  const escala = lista.length
    ? Math.max(0.1, Math.min(1, (tam.w - FOLGA * 2 - VAO * (lista.length - 1)) / larguras, (tam.h - FOLGA - embaixo - LEGENDA) / altura))
    : 1;
  const pct = Math.round(escala * 100);

  return (
    <div className="app vp" data-cheia={cheia || undefined}>
      {cheia ? (
        <iframe key={recarga} className="vp-cheia" src={src} title={`${page.title} (prévia)`} />
      ) : (
        <div className="vp-area" ref={area} style={{ paddingBottom: embaixo, paddingTop: FOLGA }}>
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
      )}

      {recolhida ? (
        <button ref={mini} className="vp-mini" onClick={() => recolher(false)} aria-label="Mostrar as opções da prévia" title="Mostrar as opções da prévia">
          <Icone nome={ICONE_MODO[modo]} tamanho={18} />
        </button>
      ) : (
        <div className="vp-barra" role="toolbar" aria-label="Opções da prévia">
          <a className="vp-bt" href={`#/editar/${page.id}`} aria-label="Voltar ao construtor" title={`Voltar ao construtor · ${page.title}`}>
            <Icone nome="voltar" tamanho={16} />
          </a>
          <span className="vp-sep" aria-hidden="true" />
          <div className="vp-modos" role="group" aria-label="Tamanho da tela">
            {MODOS.map((m) => (
              <button
                key={m}
                className="vp-bt vp-modo"
                aria-pressed={modo === m}
                onClick={() => setModo(m)}
                aria-label={NOME_MODO[m]}
                title={m === "todas" ? "Computador, tablet e celular ao mesmo tempo" : `${NOME_MODO[m]}${m === "computador" ? " · tela inteira" : ` · ${APARELHOS[m as IdAparelho].largura} × ${APARELHOS[m as IdAparelho].altura}`}`}
              >
                <Icone nome={ICONE_MODO[m]} tamanho={16} />
                <span className="vp-nome">{NOME_MODO[m]}</span>
              </button>
            ))}
          </div>
          <span className="vp-sep" aria-hidden="true" />
          <button className="vp-bt" onClick={() => setRecarga((n) => n + 1)} aria-label="Recarregar a página" title="Recarregar a página">
            <Icone nome="refazer" tamanho={16} />
          </button>
          <a className="vp-bt" href={`#/p/${page.slug}`} target="_blank" rel="noopener" aria-label="Abrir a página publicada em outra aba" title="Abrir a página publicada em outra aba">
            <Icone nome="externo" tamanho={16} />
          </a>
          <button ref={esconder} className="vp-bt" onClick={() => recolher(true)} aria-label="Esconder as opções" title="Esconder as opções">
            <Icone nome="recolher" tamanho={16} />
          </button>
        </div>
      )}
    </div>
  );
}
