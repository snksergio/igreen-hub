import { useEffect, useMemo, useState } from "react";
import { download } from "../../lib/download";
import { rotuloOrigem } from "../../lib/eventos";
import { colunasDoFormulario, visivel, type Campo } from "../../lib/formularios";
import { reais } from "../../lib/ingresso";
import { pagamentoAoSairDaEspera } from "../../lib/inscrever";
import {
  formatarWhats,
  removeSubmissions,
  ROTULO_INSCRICAO,
  ROTULO_PAGAMENTO,
  statusDe,
  toCSV,
  updateSubmissions,
  type StatusInscricao,
  type StatusPagamento,
  type Submission,
} from "../../lib/submissions";
import { appBaseUrl } from "../../router";
import { Icone } from "../../ui/Icone";
import { ChipInscricao, ChipPagamento, QrCode } from "../comum";
import type { Espaco } from "./tipos";

type Filtros = { busca: string; status: "" | StatusInscricao; pagamento: "" | StatusPagamento; licenciado: string; cidade: string; periodo: "" | "hoje" | "7" | "30" };
const VAZIO: Filtros = { busca: "", status: "", pagamento: "", licenciado: "", cidade: "", periodo: "" };
const DIA = 86400000;
const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const dataHora = (t: number) => new Date(t).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
const valorTexto = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(", ") : v ?? "");

function filtrar(subs: Submission[], f: Filtros, agora = Date.now()): Submission[] {
  const busca = semAcento(f.busca.trim());
  const desde = f.periodo === "hoje" ? new Date(new Date().toDateString()).getTime() : f.periodo ? agora - Number(f.periodo) * DIA : 0;
  return subs.filter(
    (s) =>
      (!f.status || statusDe(s) === f.status) &&
      (!f.pagamento || s.pagamento?.status === f.pagamento) &&
      (!f.licenciado || (f.licenciado === "-" ? !s.ref : s.ref === f.licenciado)) &&
      (!f.cidade || s.cidade === f.cidade) &&
      s.createdAt >= desde &&
      (!busca || semAcento(`${s.nome} ${s.email} ${s.whats} ${s.codigo ?? ""}`).includes(busca))
  );
}

/** Aba Inscrições (2.3, 3.9, 4.3): só desta página, com filtros, status, detalhe, CSV e ações em lote. */
export function Inscritos({ d }: { d: Espaco }) {
  const [f, setF] = useState<Filtros>(VAZIO);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [aberta, setAberta] = useState<string | null>(() => {
    const id = sessionStorage.getItem("poc-hotsite:abrir-inscricao");
    sessionStorage.removeItem("poc-hotsite:abrir-inscricao");
    return id;
  });
  const [limite, setLimite] = useState(100);
  const lista = useMemo(() => filtrar(d.subs, f), [d.subs, f]);
  const colunas = useMemo(() => colunasDoFormulario(d.form).filter((c) => c.id !== "ref" && c.id !== "origem"), [d.form]);
  const temPagamento = d.subs.some((s) => s.pagamento);
  const nomeLic = useMemo(() => new Map(d.links.map((l) => [l.ref, l.nome])), [d.links]);
  const refs = useMemo(() => [...new Set(d.subs.map((s) => s.ref).filter(Boolean) as string[])].sort(), [d.subs]);
  const cidades = useMemo(() => [...new Set(d.subs.map((s) => s.cidade).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, "pt-BR")), [d.subs]);
  const detalhe = aberta ? d.subs.find((s) => s.id === aberta) : undefined;
  const todosMarcados = lista.length > 0 && lista.every((s) => sel.has(s.id));
  const mudar = (p: Partial<Filtros>) => {
    setF((x) => ({ ...x, ...p }));
    setLimite(100);
  };

  useEffect(() => setSel((s) => new Set([...s].filter((id) => d.subs.some((x) => x.id === id)))), [d.subs]);

  const exportar = (subs: Submission[], sufixo = "") =>
    download(`inscricoes-${d.page.slug}${sufixo}.csv`, toCSV(subs, colunasDoFormulario(d.form)), "text/csv;charset=utf-8");

  function emLote(status: StatusInscricao) {
    if (!mudarStatus(d, d.subs.filter((s) => sel.has(s.id)), status)) return;
    setSel(new Set());
    d.recarregar();
  }

  const marcar = (id: string, sim: boolean) =>
    setSel((s) => {
      const n = new Set(s);
      if (sim) n.add(id);
      else n.delete(id);
      return n;
    });

  return (
    <div className="ins">
      <div className="pn-filtros">
        <label className="pn-busca">
          <Icone nome="busca" tamanho={16} />
          <input type="search" placeholder="Nome, e-mail, WhatsApp ou código" value={f.busca} onChange={(e) => mudar({ busca: e.target.value })} aria-label="Buscar inscrição" />
        </label>
        <select className="pn-sel" value={f.status} onChange={(e) => mudar({ status: e.target.value as Filtros["status"] })} aria-label="Status">
          <option value="">Todos os status</option>
          {(Object.keys(ROTULO_INSCRICAO) as StatusInscricao[]).map((s) => (
            <option key={s} value={s}>
              {ROTULO_INSCRICAO[s]}
            </option>
          ))}
        </select>
        {temPagamento && (
          <select className="pn-sel" value={f.pagamento} onChange={(e) => mudar({ pagamento: e.target.value as Filtros["pagamento"] })} aria-label="Pagamento">
            <option value="">Todo pagamento</option>
            {(Object.keys(ROTULO_PAGAMENTO) as StatusPagamento[]).map((s) => (
              <option key={s} value={s}>
                {ROTULO_PAGAMENTO[s]}
              </option>
            ))}
          </select>
        )}
        <select className="pn-sel" value={f.licenciado} onChange={(e) => mudar({ licenciado: e.target.value })} aria-label="Licenciado">
          <option value="">Todos os licenciados</option>
          <option value="-">Sem licenciado</option>
          {refs.map((r) => (
            <option key={r} value={r}>
              {nomeLic.get(r) ? `${nomeLic.get(r)} (${r})` : r}
            </option>
          ))}
        </select>
        <select className="pn-sel" value={f.cidade} onChange={(e) => mudar({ cidade: e.target.value })} aria-label="Cidade">
          <option value="">Todas as cidades</option>
          {cidades.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="pn-sel" value={f.periodo} onChange={(e) => mudar({ periodo: e.target.value as Filtros["periodo"] })} aria-label="Data da inscrição">
          <option value="">Qualquer data</option>
          <option value="hoje">Hoje</option>
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
        </select>
        <span className="pn-sep" />
        <button className="bt" onClick={() => exportar(lista)} disabled={!lista.length}>
          <Icone nome="baixar" tamanho={16} />
          Exportar CSV
        </button>
      </div>

      <div className="ins-resumo">
        <span>
          <b>{lista.length.toLocaleString("pt-BR")}</b> de {d.subs.length.toLocaleString("pt-BR")} inscrições
        </span>
        {JSON.stringify(f) !== JSON.stringify(VAZIO) && (
          <button className="app-linkbtn" onClick={() => mudar(VAZIO)}>
            Limpar filtros
          </button>
        )}
      </div>

      {sel.size > 0 && (
        <div className="ins-lote" role="toolbar" aria-label="Ações nas inscrições marcadas">
          <strong>{sel.size} marcadas</strong>
          <button className="bt bt-p" onClick={() => emLote("confirmado")}>
            Confirmar
          </button>
          <button className="bt bt-p" onClick={() => emLote("presente")}>
            Marcar presença
          </button>
          <button className="bt bt-p" onClick={() => emLote("faltou")}>
            Não veio
          </button>
          <button className="bt bt-p" onClick={() => exportar(d.subs.filter((s) => sel.has(s.id)), "-selecionadas")}>
            <Icone nome="baixar" tamanho={15} />
            Exportar marcadas
          </button>
          <button className="app-linkbtn" onClick={() => setSel(new Set())}>
            Desmarcar
          </button>
        </div>
      )}

      {d.subs.length === 0 ? (
        <section className="app-card app-empty pn-vazio">
          <h2 className="app-h2">Nenhuma inscrição ainda</h2>
          <p className="app-muted">Abra a página pública e faça uma inscrição de teste: ela aparece aqui.</p>
          <a className="bt" href={`#/p/${d.page.slug}`}>
            Ver página
          </a>
        </section>
      ) : (
        <div className="app-card ins-tabela-card">
          <table className="ins-tabela">
            <thead>
              <tr>
                <th className="ins-fixa">
                  <span className="ins-cab-nome">
                    <label className="ins-check">
                      <input
                        type="checkbox"
                        checked={todosMarcados}
                        onChange={(e) => setSel(e.target.checked ? new Set(lista.map((s) => s.id)) : new Set())}
                        aria-label="Marcar todas as inscrições filtradas"
                      />
                    </label>
                    Nome
                  </span>
                </th>
                <th>Status</th>
                {temPagamento && <th>Pagamento</th>}
                <th>Licenciado</th>
                <th>Origem</th>
                <th>Cidade</th>
                <th>Inscrição</th>
                {colunas.map((c) => (
                  <th key={c.id} title={c.rotulo}>
                    {c.rotulo.length > 28 ? `${c.rotulo.slice(0, 26)}…` : c.rotulo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lista.slice(0, limite).map((s) => (
                <tr key={s.id} onClick={() => setAberta(s.id)} data-marcada={sel.has(s.id) || undefined}>
                  <td className="ins-fixa">
                    <div className="ins-nome">
                      <label className="ins-check" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={sel.has(s.id)} onChange={(e) => marcar(s.id, e.target.checked)} aria-label={`Marcar ${s.nome}`} />
                      </label>
                      <button className="ins-abrir" onClick={() => setAberta(s.id)}>
                        <strong>{s.nome}</strong>
                        <span>{formatarWhats(s.whats)}</span>
                      </button>
                    </div>
                  </td>
                  <td>
                    <ChipInscricao status={statusDe(s)} />
                  </td>
                  {temPagamento && <td>{s.pagamento ? <ChipPagamento status={s.pagamento.status} /> : <span className="pn-fraco">—</span>}</td>}
                  <td className="pn-nowrap">{s.ref ? nomeLic.get(s.ref) ?? s.ref : <span className="pn-fraco">—</span>}</td>
                  <td className="pn-nowrap">{rotuloOrigem(s.origem ?? (s.ref ? "licenciado" : "direto"))}</td>
                  <td className="pn-nowrap">{s.cidade ?? <span className="pn-fraco">—</span>}</td>
                  <td className="pn-nowrap pn-fraco">{dataHora(s.createdAt)}</td>
                  {colunas.map((c) => (
                    <td key={c.id} className="ins-resp">
                      {valorTexto(s.respostas?.[c.id]) || <span className="pn-fraco">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length > limite && (
            <div className="ins-mais">
              <button className="bt" onClick={() => setLimite((l) => l + 100)}>
                Mostrar mais {Math.min(100, lista.length - limite)}
              </button>
            </div>
          )}
          {lista.length === 0 && <p className="app-muted ins-nada">Nenhuma inscrição com esses filtros.</p>}
        </div>
      )}

      {detalhe && <Detalhe s={detalhe} d={d} nomeLic={nomeLic} fechar={() => setAberta(null)} />}
    </div>
  );
}

/**
 * Muda o status de uma ou mais inscrições. Quem sai da lista de espera ocupa vaga (avisa se as vagas
 * acabaram) e, em evento pago, passa a dever o ingresso. Devolve false se a pessoa desistiu.
 */
function mudarStatus(d: Espaco, alvo: Submission[], status: StatusInscricao): boolean {
  const saindo = status === "espera" ? [] : alvo.filter((s) => statusDe(s) === "espera");
  if (saindo.length && d.vagas && d.inscritos + saindo.length > d.vagas) {
    const msg = `As ${d.vagas} vagas já estão ocupadas. Tirar ${saindo.length === 1 ? "esta pessoa" : `${saindo.length} pessoas`} da lista de espera mesmo assim?`;
    if (!confirm(msg)) return false;
  }
  const nota = `Marcado como ${ROTULO_INSCRICAO[status].toLowerCase()}`;
  const comum = alvo.filter((s) => !saindo.includes(s));
  if (comum.length) updateSubmissions(comum.map((s) => s.id), { status }, nota);
  for (const s of saindo) {
    const pagamento = pagamentoAoSairDaEspera(s, d.form);
    updateSubmissions([s.id], { status, pagamento }, pagamento?.status === "pendente" ? `${nota}: saiu da lista de espera, pagamento pendente` : `${nota}: saiu da lista de espera`);
  }
  return true;
}

const RESPOSTA_ESPECIAL: Record<string, (v: string) => string> = {
  lgpd: (v) => (v === "sim" ? "Aceito" : v),
  ingresso: (v) => (v === "meia" ? "Meia-entrada" : "Inteira"),
};

/** Detalhe de um inscrito: dados, de onde veio, quando aceitou receber avisos, pagamento e ingresso. */
function Detalhe({ s, d, nomeLic, fechar }: { s: Submission; d: Espaco; nomeLic: Map<string, string>; fechar: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [fechar]);

  const mudar = (patch: Partial<Submission>, nota: string) => {
    updateSubmissions([s.id], patch, nota);
    d.recarregar();
  };
  const pagar = (status: StatusPagamento, nota: string) =>
    s.pagamento && mudar({ pagamento: { ...s.pagamento, status, atualizadoEm: Date.now() } }, nota);
  const campos: Campo[] = (d.form?.campos ?? []).filter((c) => !["etapa", "info", "oculto"].includes(c.tipo) && !c.base && visivel(c, s.respostas ?? {}));
  const status = statusDe(s);
  const ingresso = `${appBaseUrl()}#/ingresso/${s.codigo}`;

  return (
    <div className="gv-fundo" onClick={fechar}>
      <aside className="gv" role="dialog" aria-modal="true" aria-label={`Inscrição de ${s.nome}`} onClick={(e) => e.stopPropagation()}>
        <header className="gv-topo">
          <div>
            <h2 className="gv-nome">{s.nome}</h2>
            <p className="app-muted">Inscrição em {dataHora(s.createdAt)}</p>
          </div>
          <button className="bt bt-ic bt-p" onClick={fechar} aria-label="Fechar" autoFocus>
            <Icone nome="fechar" />
          </button>
        </header>

        <div className="gv-corpo">
          <section className="gv-sec">
            <h3>Status</h3>
            <div className="seg seg-quebra" role="group" aria-label="Status da inscrição">
              {(["inscrito", "confirmado", "presente", "faltou"] as StatusInscricao[]).concat(status === "espera" ? ["espera"] : []).map((st) => (
                <button key={st} aria-pressed={status === st} onClick={() => status !== st && mudarStatus(d, [s], st) && d.recarregar()}>
                  {ROTULO_INSCRICAO[st]}
                </button>
              ))}
            </div>
          </section>

          <section className="gv-sec">
            <h3>Contato</h3>
            <dl className="ep-dl">
              <dt>WhatsApp</dt>
              <dd>
                <a href={`https://wa.me/${s.whats}`} target="_blank" rel="noopener noreferrer">
                  {formatarWhats(s.whats)}
                </a>
              </dd>
              <dt>E-mail</dt>
              <dd>{s.email || <span className="pn-fraco">—</span>}</dd>
              <dt>Cidade</dt>
              <dd>{s.cidade || <span className="pn-fraco">—</span>}</dd>
            </dl>
          </section>

          <section className="gv-sec">
            <h3>De onde veio</h3>
            <dl className="ep-dl">
              <dt>Origem</dt>
              <dd>{rotuloOrigem(s.origem ?? (s.ref ? "licenciado" : "direto"))}</dd>
              <dt>Licenciado</dt>
              <dd>{s.ref ? `${nomeLic.get(s.ref) ?? "Sem link cadastrado"} · ${s.ref}` : <span className="pn-fraco">Nenhum</span>}</dd>
              <dt>Aceitou avisos</dt>
              <dd>{s.consentimentoEm ? dataHora(s.consentimentoEm) : <span className="pn-fraco">Inscrição antiga, sem registro</span>}</dd>
            </dl>
          </section>

          {(campos.length > 0 || s.interesse) && (
            <section className="gv-sec">
              <h3>Respostas</h3>
              <dl className="gv-resp">
                {campos.map((c) => {
                  const v = valorTexto(s.respostas?.[c.id]);
                  const txt = v && RESPOSTA_ESPECIAL[c.tipo] ? RESPOSTA_ESPECIAL[c.tipo](v) : v;
                  return (
                    <div key={c.id}>
                      <dt>{c.tipo === "lgpd" ? "Aceite de LGPD" : c.rotulo}</dt>
                      <dd>{txt || <span className="pn-fraco">Sem resposta</span>}</dd>
                    </div>
                  );
                })}
                {s.interesse && (
                  <div>
                    <dt>Interesse</dt>
                    <dd>{s.interesse}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {s.pagamento && (
            <section className="gv-sec">
              <h3>Pagamento (simulado)</h3>
              <div className="gv-pag">
                <ChipPagamento status={s.pagamento.status} />
                <strong>{reais(s.pagamento.valor)}</strong>
                <span className="app-muted">
                  {[s.pagamento.lote, s.pagamento.meia && "meia-entrada", s.pagamento.cupom && `cupom ${s.pagamento.cupom}`, s.pagamento.metodo === "pix" ? "Pix" : s.pagamento.metodo && "cartão"]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              <div className="app-actions">
                {s.pagamento.status === "pendente" && (
                  <>
                    <button className="bt bt-p" onClick={() => pagar("pago", "Pagamento marcado como pago")}>
                      Marcar como pago
                    </button>
                    <button className="bt bt-p" onClick={() => pagar("cancelado", "Pagamento cancelado")}>
                      Cancelar
                    </button>
                  </>
                )}
                {s.pagamento.status === "pago" && (
                  <button className="bt bt-p" onClick={() => confirm(`Estornar ${reais(s.pagamento!.valor)} (simulação)?`) && pagar("estornado", "Pagamento estornado")}>
                    Estornar
                  </button>
                )}
              </div>
            </section>
          )}

          {s.codigo && (
            <section className="gv-sec">
              <h3>Ingresso</h3>
              <div className="gv-ingresso">
                <QrCode texto={ingresso} tamanho={96} rotulo={`QR code do ingresso ${s.codigo}`} />
                <div>
                  <p className="gv-codigo">{s.codigo}</p>
                  <a className="bt bt-p" href={`#/ingresso/${s.codigo}`} target="_blank" rel="noopener noreferrer">
                    Abrir ingresso
                    <Icone nome="externo" tamanho={14} />
                  </a>
                </div>
              </div>
            </section>
          )}

          {s.historico && s.historico.length > 0 && (
            <section className="gv-sec">
              <h3>Histórico</h3>
              <ol className="gv-hist">
                {[...s.historico].reverse().map((h, i) => (
                  <li key={i}>
                    <span>{h.texto}</span>
                    <time>{dataHora(h.em)}</time>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <footer className="gv-pe">
          <button
            className="bt bt-p mn-perigo-bt"
            onClick={() => {
              if (!confirm(`Apagar a inscrição de ${s.nome}? Não dá para desfazer.`)) return;
              removeSubmissions([s.id]);
              fechar();
              d.recarregar();
            }}
          >
            <Icone nome="lixo" tamanho={15} />
            Apagar inscrição
          </button>
        </footer>
      </aside>
    </div>
  );
}
