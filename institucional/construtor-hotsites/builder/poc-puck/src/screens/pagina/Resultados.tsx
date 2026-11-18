import { useEffect, useMemo, useRef, useState } from "react";
import { resumir, rotuloOrigem } from "../../lib/eventos";
import { cobra } from "../../lib/formularios";
import { Bloco, Numero } from "../comum";
import type { Espaco } from "./tipos";

/* Resultados (2.6). Gráficos de uma série só: sem legenda (o título diz o que é), uma cor,
   barras finas com ponta arredondada, linha de 2 px, grade recessiva, dica ao passar o mouse
   e a mesma informação em tabela. */

const nf = (n: number) => n.toLocaleString("pt-BR");
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);
const diaCurto = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};
const diaLongo = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });

/** Largura real do elemento, para desenhar o SVG sem esticar o texto. */
function useLargura<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setW(el.clientWidth);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** Marcas redondas do eixo: 0, 50, 100… até passar do máximo. */
function escala(max: number) {
  const bruto = Math.max(1, max) / 3;
  const pot = 10 ** Math.floor(Math.log10(bruto));
  const passo = [1, 2, 2.5, 5, 10].map((m) => m * pot).find((p) => p >= bruto) ?? pot * 10;
  const topo = Math.ceil(Math.max(1, max) / passo) * passo;
  const marcas: number[] = [];
  for (let v = 0; v <= topo + 1e-9; v += passo) marcas.push(Math.round(v));
  return { topo, marcas };
}

type Ponto = { dia: string; valor: number };
const ALTURA = 200;
const M = { cima: 12, baixo: 26, esq: 40, dir: 14 };

function Dica({ x, y, largura, titulo, valor }: { x: number; y: number; largura: number; titulo: string; valor: string }) {
  const esquerda = Math.min(Math.max(8, x - 70), largura - 148);
  return (
    <div className="gr-dica" style={{ left: esquerda, top: Math.max(0, y - 58) }} role="status">
      <strong>{valor}</strong>
      <span>{titulo}</span>
    </div>
  );
}

/** Colunas por dia (inscrições). */
function Colunas({ dados, unidade }: { dados: Ponto[]; unidade: [string, string] }) {
  const [ref, w] = useLargura<HTMLDivElement>();
  const [ativo, setAtivo] = useState<number | null>(null);
  const { topo, marcas } = escala(Math.max(...dados.map((d) => d.valor)));
  const larguraUtil = Math.max(0, w - M.esq - M.dir);
  const faixa = dados.length ? larguraUtil / dados.length : 0;
  const barra = Math.max(2, Math.min(24, faixa - 2));
  const y = (v: number) => M.cima + (ALTURA - M.cima - M.baixo) * (1 - v / topo);
  const passoRotulo = Math.ceil(dados.length / Math.max(1, Math.floor(larguraUtil / 52)));
  const fmt = (v: number) => `${nf(v)} ${v === 1 ? unidade[0] : unidade[1]}`;

  return (
    <div className="gr" ref={ref}>
      {w > 0 && (
        <svg width={w} height={ALTURA} role="img" aria-label={`Colunas por dia: ${dados.map((d) => `${diaCurto(d.dia)} ${d.valor}`).join(", ")}`}>
          {marcas.map((m) => (
            <g key={m}>
              <line x1={M.esq} x2={w - M.dir} y1={y(m)} y2={y(m)} className="gr-grade" />
              <text x={M.esq - 8} y={y(m)} className="gr-eixo" textAnchor="end" dominantBaseline="middle">
                {nf(m)}
              </text>
            </g>
          ))}
          {dados.map((d, i) => {
            const cx = M.esq + faixa * i + faixa / 2;
            const topoY = y(d.valor);
            const base = y(0);
            const h = base - topoY;
            const r = Math.min(4, h, barra / 2);
            const x0 = cx - barra / 2;
            const caminho = h > 0 ? `M${x0},${base}V${topoY + r}Q${x0},${topoY} ${x0 + r},${topoY}H${x0 + barra - r}Q${x0 + barra},${topoY} ${x0 + barra},${topoY + r}V${base}Z` : "";
            return (
              <g key={d.dia}>
                {caminho && <path d={caminho} className="gr-col" data-ativo={ativo === i || undefined} />}
                <rect
                  x={M.esq + faixa * i}
                  y={M.cima}
                  width={faixa}
                  height={ALTURA - M.cima - M.baixo}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${diaLongo(d.dia)}: ${fmt(d.valor)}`}
                  onPointerEnter={() => setAtivo(i)}
                  onPointerLeave={() => setAtivo(null)}
                  onFocus={() => setAtivo(i)}
                  onBlur={() => setAtivo(null)}
                />
                {i % passoRotulo === (dados.length - 1) % passoRotulo && (
                  <text x={cx} y={ALTURA - 8} className="gr-eixo" textAnchor="middle">
                    {diaCurto(d.dia)}
                  </text>
                )}
              </g>
            );
          })}
          <line x1={M.esq} x2={w - M.dir} y1={y(0)} y2={y(0)} className="gr-base" />
        </svg>
      )}
      {ativo !== null && dados[ativo] && (
        <Dica x={M.esq + faixa * ativo + faixa / 2} y={y(dados[ativo].valor)} largura={w} titulo={diaLongo(dados[ativo].dia)} valor={fmt(dados[ativo].valor)} />
      )}
    </div>
  );
}

/** Linha por dia (visitas), com área suave, ponto no fim e régua ao passar o mouse. */
function Linha({ dados, unidade }: { dados: Ponto[]; unidade: [string, string] }) {
  const [ref, w] = useLargura<HTMLDivElement>();
  const [ativo, setAtivo] = useState<number | null>(null);
  const { topo, marcas } = escala(Math.max(...dados.map((d) => d.valor)));
  const larguraUtil = Math.max(0, w - M.esq - M.dir);
  const x = (i: number) => M.esq + (dados.length > 1 ? (larguraUtil * i) / (dados.length - 1) : larguraUtil / 2);
  const y = (v: number) => M.cima + (ALTURA - M.cima - M.baixo) * (1 - v / topo);
  const pontos = dados.map((d, i) => `${x(i).toFixed(1)},${y(d.valor).toFixed(1)}`);
  const passoRotulo = Math.ceil(dados.length / Math.max(1, Math.floor(larguraUtil / 52)));
  const fmt = (v: number) => `${nf(v)} ${v === 1 ? unidade[0] : unidade[1]}`;
  const ultimo = dados.length - 1;

  const mover = (ev: React.PointerEvent<SVGRectElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    const i = Math.round(((ev.clientX - r.left) / Math.max(1, r.width)) * ultimo);
    setAtivo(Math.max(0, Math.min(ultimo, i)));
  };

  return (
    <div className="gr" ref={ref}>
      {w > 0 && dados.length > 0 && (
        <svg width={w} height={ALTURA} role="img" aria-label={`Linha por dia: ${dados.map((d) => `${diaCurto(d.dia)} ${d.valor}`).join(", ")}`}>
          {marcas.map((m) => (
            <g key={m}>
              <line x1={M.esq} x2={w - M.dir} y1={y(m)} y2={y(m)} className="gr-grade" />
              <text x={M.esq - 8} y={y(m)} className="gr-eixo" textAnchor="end" dominantBaseline="middle">
                {nf(m)}
              </text>
            </g>
          ))}
          <path d={`M${pontos.join("L")}L${x(ultimo)},${y(0)}L${x(0)},${y(0)}Z`} className="gr-area" />
          <polyline points={pontos.join(" ")} className="gr-linha" />
          {dados.map((d, i) =>
            i % passoRotulo === ultimo % passoRotulo ? (
              <text key={d.dia} x={x(i)} y={ALTURA - 8} className="gr-eixo" textAnchor="middle">
                {diaCurto(d.dia)}
              </text>
            ) : null
          )}
          <line x1={M.esq} x2={w - M.dir} y1={y(0)} y2={y(0)} className="gr-base" />
          {ativo !== null && <line x1={x(ativo)} x2={x(ativo)} y1={M.cima} y2={y(0)} className="gr-regua" />}
          <circle cx={x(ativo ?? ultimo)} cy={y(dados[ativo ?? ultimo].valor)} r={4.5} className="gr-ponto" />
          <rect
            x={M.esq}
            y={M.cima}
            width={larguraUtil}
            height={ALTURA - M.cima - M.baixo}
            fill="transparent"
            tabIndex={0}
            aria-label="Use as setas para ver cada dia"
            onPointerMove={mover}
            onPointerLeave={() => setAtivo(null)}
            onFocus={() => setAtivo(ultimo)}
            onBlur={() => setAtivo(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setAtivo((a) => Math.max(0, (a ?? ultimo) - 1));
              if (e.key === "ArrowRight") setAtivo((a) => Math.min(ultimo, (a ?? ultimo) + 1));
            }}
          />
        </svg>
      )}
      {ativo !== null && dados[ativo] && <Dica x={x(ativo)} y={y(dados[ativo].valor)} largura={w} titulo={diaLongo(dados[ativo].dia)} valor={fmt(dados[ativo].valor)} />}
    </div>
  );
}

/** Barra horizontal com o número na ponta (funil e origem). */
function Barra({ valor, max }: { valor: number; max: number }) {
  return (
    <span className="gr-hbar" aria-hidden="true">
      <i style={{ width: `${max ? Math.max(valor ? 1.5 : 0, (valor / max) * 100) : 0}%` }} />
    </span>
  );
}

export function Resultados({ d }: { d: Espaco }) {
  const [dias, setDias] = useState(21);
  const [tabela, setTabela] = useState(false);
  const r = useMemo(() => resumir(d.eventos, d.subs, dias), [d.eventos, d.subs, dias]);
  const total = useMemo(() => resumir(d.eventos, d.subs, 1), [d.eventos, d.subs]);
  const nomeLic = useMemo(() => new Map(d.links.map((l) => [l.ref, l.nome])), [d.links]);
  const pago = cobra(d.form) || d.subs.some((s) => s.pagamento);

  const funil = [
    { rotulo: "Visitaram a página", valor: total.visitas },
    { rotulo: "Começaram o formulário", valor: total.comecaram },
    { rotulo: "Enviaram a inscrição", valor: total.inscricoes },
    ...(pago ? [{ rotulo: "Pagaram", valor: total.pagos }] : []),
  ];
  const maxOrigem = Math.max(1, ...total.porOrigem.map((o) => o.visitas));

  if (!total.visitas && !d.subs.length)
    return (
      <section className="app-card app-empty pn-vazio">
        <h2 className="app-h2">Sem resultados ainda</h2>
        <p className="app-muted">Visitas e inscrições aparecem aqui quando a página estiver no ar.</p>
      </section>
    );

  return (
    <div className="rs">
      <div className="nm-linha">
        <Numero rotulo="Visitas" valor={nf(total.visitas)} />
        <Numero rotulo="Inscrições" valor={nf(total.inscricoes)} apoio={`${nf(d.inscritos)} ocupando vaga`} />
        <Numero rotulo="Conversão" valor={`${total.conversao.toLocaleString("pt-BR")}%`} apoio="das visitas viraram inscrição" />
        <Numero rotulo="Terminaram o formulário" valor={`${pct(total.inscricoes, total.comecaram).toLocaleString("pt-BR")}%`} apoio={`de ${nf(total.comecaram)} que começaram`} />
      </div>

      <div className="rs-filtro">
        <div className="seg" role="group" aria-label="Período dos gráficos">
          {[7, 14, 21, 30].map((n) => (
            <button key={n} aria-pressed={dias === n} onClick={() => setDias(n)}>
              {n} dias
            </button>
          ))}
        </div>
        <label className="rs-tabela-liga">
          <input type="checkbox" checked={tabela} onChange={(e) => setTabela(e.target.checked)} />
          Ver em tabela
        </label>
      </div>

      {tabela ? (
        <Bloco titulo={`Por dia · últimos ${dias} dias`}>
          <div className="app-table-wrap">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Visitas</th>
                  <th>Inscrições</th>
                  <th>Conversão</th>
                </tr>
              </thead>
              <tbody>
                {[...r.porDia].reverse().map((p) => (
                  <tr key={p.dia}>
                    <td>{diaLongo(p.dia)}</td>
                    <td>{nf(p.visitas)}</td>
                    <td>{nf(p.inscricoes)}</td>
                    <td>{pct(p.inscricoes, p.visitas).toLocaleString("pt-BR")}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Bloco>
      ) : (
        <div className="rs-duas">
          <Bloco titulo={`Visitas por dia`}>
            <Linha dados={r.porDia.map((p) => ({ dia: p.dia, valor: p.visitas }))} unidade={["visita", "visitas"]} />
          </Bloco>
          <Bloco titulo={`Inscrições por dia`}>
            <Colunas dados={r.porDia.map((p) => ({ dia: p.dia, valor: p.inscricoes }))} unidade={["inscrição", "inscrições"]} />
          </Bloco>
        </div>
      )}

      <div className="rs-duas">
        <Bloco titulo="Do acesso à inscrição">
          <ol className="gr-funil">
            {funil.map((f, i) => (
              <li key={f.rotulo}>
                <span className="gr-funil-rot">{f.rotulo}</span>
                <Barra valor={f.valor} max={funil[0].valor || 1} />
                <span className="gr-funil-val">
                  <b>{nf(f.valor)}</b>
                  {i > 0 && <small>{pct(f.valor, funil[i - 1].valor).toLocaleString("pt-BR")}% da etapa anterior</small>}
                </span>
              </li>
            ))}
          </ol>
        </Bloco>

        <Bloco titulo="De onde vieram">
          <table className="gr-tab">
            <thead>
              <tr>
                <th>Origem</th>
                <th className="gr-tab-barra">Visitas</th>
                <th>Inscrições</th>
                <th>Conversão</th>
              </tr>
            </thead>
            <tbody>
              {total.porOrigem.map((o) => (
                <tr key={o.origem}>
                  <td>{rotuloOrigem(o.origem)}</td>
                  <td className="gr-tab-barra">
                    <span className="gr-tab-par">
                      <Barra valor={o.visitas} max={maxOrigem} />
                      <span>{nf(o.visitas)}</span>
                    </span>
                  </td>
                  <td>{nf(o.inscricoes)}</td>
                  <td>{o.visitas ? `${pct(o.inscricoes, o.visitas).toLocaleString("pt-BR")}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Bloco>
      </div>

      <Bloco titulo="Ranking de licenciados">
        {total.ranking.length === 0 ? (
          <p className="app-muted">Nenhuma visita ou inscrição veio de link de licenciado ainda.</p>
        ) : (
          <div className="app-table-wrap">
            <table className="app-table rs-ranking">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Licenciado</th>
                  <th>Visitas</th>
                  <th>Inscrições</th>
                  <th>Conversão</th>
                  <th>Presentes</th>
                </tr>
              </thead>
              <tbody>
                {total.ranking.map((x, i) => (
                  <tr key={x.ref}>
                    <td className="pn-fraco">{i + 1}</td>
                    <td>
                      <strong>{nomeLic.get(x.ref) ?? "Sem link cadastrado"}</strong> <span className="pn-fraco">{x.ref}</span>
                    </td>
                    <td>{nf(x.visitas)}</td>
                    <td>{nf(x.inscricoes)}</td>
                    <td>{x.visitas ? `${pct(x.inscricoes, x.visitas).toLocaleString("pt-BR")}%` : "—"}</td>
                    <td>{nf(x.presentes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Bloco>
      <p className="ep-nota">POC: visitas e inscrições das páginas de exemplo são fictícias. No projeto real, as visitas viriam do GA4 (7.9).</p>
    </div>
  );
}
