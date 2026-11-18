import { useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { download } from "../lib/download";
import { restaurarExemplos } from "../lib/exemplo";
import { dataCurta, type StatusVisivel } from "../lib/meta";
import { deletePage, duplicatePage, exportPage, importPage, listPages, setMeta, type PageRecord } from "../lib/pages";
import { FILTROS_PADRAO, filtrarLinhas, montarLinhas, responsaveisDe, type FiltrosPainel, type LinhaPainel } from "../lib/painel";
import { contarInscritos, vagasDaPagina } from "../lib/pagina";
import { go } from "../router";
import { TEMPLATES } from "../templates";
import { Icone } from "../ui/Icone";
import { Menu } from "../ui/Menu";
import { Avatar, ChipStatus, Vagas } from "./comum";
import { Miniatura } from "./Miniatura";
import { Shell } from "./Shell";

const nomeModelo = (id: string) => TEMPLATES.find((t) => t.id === id)?.nome ?? id;
const quando = (ts: number) => new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

const ABAS_STATUS: { valor: FiltrosPainel["status"]; rotulo: string }[] = [
  { valor: "ativas", rotulo: "Todas" },
  { valor: "publicada", rotulo: "Publicadas" },
  { valor: "agendada", rotulo: "Agendadas" },
  { valor: "rascunho", rotulo: "Rascunhos" },
  { valor: "encerrada", rotulo: "Encerradas" },
  { valor: "arquivada", rotulo: "Arquivadas" },
];

const CHAVE_VISTA = "poc-hotsite:painel-vista";
const lerVista = (): "grade" | "lista" => {
  try {
    return localStorage.getItem(CHAVE_VISTA) === "lista" ? "lista" : "grade";
  } catch {
    return "grade";
  }
};

/** Primeira tela: as páginas, com status, data do evento e vagas; busca, filtros, grade ou lista (Etapa 1). */
export function Painel() {
  const [pages, setPages] = useState<PageRecord[]>(() => listPages());
  const [f, setF] = useState<FiltrosPainel>(FILTROS_PADRAO);
  const [vista, setVista] = useState(lerVista);
  const [erro, setErro] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const refresh = () => setPages(listPages());

  const linhas = useMemo(() => {
    const contagem = contarInscritos();
    return montarLinhas(pages, (id) => contagem.get(id) ?? 0, vagasDaPagina);
  }, [pages]);
  const visiveis = useMemo(() => filtrarLinhas(linhas, f), [linhas, f]);
  const responsaveis = useMemo(() => responsaveisDe(linhas), [linhas]);
  const contaStatus = (s: FiltrosPainel["status"]) => filtrarLinhas(linhas, { ...FILTROS_PADRAO, status: s }).length;
  const filtrando = f.busca || f.modelo || f.data !== "todas" || f.responsavel;
  const mudar = (p: Partial<FiltrosPainel>) => setF((x) => ({ ...x, ...p }));

  function trocarVista(v: "grade" | "lista") {
    setVista(v);
    try {
      localStorage.setItem(CHAVE_VISTA, v);
    } catch {
      /* só preferência */
    }
  }

  async function importar(e: ChangeEvent<HTMLInputElement>) {
    const arq = e.target.files?.[0];
    e.target.value = "";
    if (!arq) return;
    try {
      importPage(await arq.text());
      setErro("");
      refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Arquivo inválido");
    }
  }

  const acoes = {
    duplicar: (p: PageRecord) => {
      duplicatePage(p.id);
      refresh();
    },
    arquivar: (p: PageRecord, arquivar: boolean) => {
      setMeta(p.id, { status: arquivar ? "arquivada" : "rascunho" });
      refresh();
    },
    apagar: (p: PageRecord) => {
      if (confirm(`Apagar "${p.title}"? Não dá para desfazer.`)) {
        deletePage(p.id);
        refresh();
      }
    },
  };

  return (
    <Shell ativo="paginas">
      <div className="app-row">
        <div>
          <h1 className="app-h1">Páginas</h1>
          <p className="app-muted">
            {contaStatus("ativas")} {contaStatus("ativas") === 1 ? "página ativa" : "páginas ativas"} de evento e campanha
          </p>
        </div>
        <div className="app-actions">
          <button className="bt" onClick={() => fileRef.current?.click()}>
            <Icone nome="enviar" />
            Importar arquivo
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={importar} />
          <a className="bt bt-pri" href="#/nova">
            <Icone nome="mais" />
            Nova página
          </a>
        </div>
      </div>
      {erro && <p className="app-err">{erro}</p>}

      {pages.length === 0 ? (
        <section className="app-card app-empty">
          <h2 className="app-h2">Nenhuma página ainda</h2>
          <p className="app-muted">Crie a primeira a partir de um modelo ou do zero.</p>
          <div className="app-actions">
            <a className="bt bt-pri" href="#/nova">
              <Icone nome="mais" />
              Nova página
            </a>
            <button
              className="bt"
              onClick={() => {
                restaurarExemplos();
                refresh();
              }}
            >
              Trazer os exemplos de volta
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="pn-barra">
            <nav className="pn-abas" aria-label="Status">
              {ABAS_STATUS.map((a) => (
                <button key={a.valor} aria-pressed={f.status === a.valor} onClick={() => mudar({ status: a.valor })}>
                  {a.rotulo}
                  <span className="pn-conta">{contaStatus(a.valor)}</span>
                </button>
              ))}
            </nav>
            <div className="pn-filtros">
              <label className="pn-busca">
                <Icone nome="busca" tamanho={16} />
                <input
                  type="search"
                  placeholder="Buscar pelo nome"
                  value={f.busca}
                  onChange={(e) => mudar({ busca: e.target.value })}
                  aria-label="Buscar pelo nome da página"
                />
              </label>
              <select className="pn-sel" value={f.modelo} onChange={(e) => mudar({ modelo: e.target.value })} aria-label="Modelo">
                <option value="">Todos os modelos</option>
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
              <select className="pn-sel" value={f.data} onChange={(e) => mudar({ data: e.target.value as FiltrosPainel["data"] })} aria-label="Data do evento">
                <option value="todas">Qualquer data</option>
                <option value="proximas">Nos próximos 30 dias</option>
                <option value="futuras">Ainda vão acontecer</option>
                <option value="passadas">Já aconteceram</option>
                <option value="sem-data">Sem data</option>
              </select>
              <select className="pn-sel" value={f.responsavel} onChange={(e) => mudar({ responsavel: e.target.value })} aria-label="Responsável">
                <option value="">Todos os responsáveis</option>
                {responsaveis.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <span className="pn-sep" aria-hidden="true" />
              <select className="pn-sel" value={f.ordem} onChange={(e) => mudar({ ordem: e.target.value as FiltrosPainel["ordem"] })} aria-label="Ordenar por">
                <option value="edicao">Editadas por último</option>
                <option value="evento">Data do evento</option>
                <option value="nome">Nome (A–Z)</option>
              </select>
              <div className="seg seg-ic" role="group" aria-label="Ver como">
                <button aria-pressed={vista === "grade"} onClick={() => trocarVista("grade")} title="Grade">
                  <Icone nome="grade" tamanho={16} />
                </button>
                <button aria-pressed={vista === "lista"} onClick={() => trocarVista("lista")} title="Lista">
                  <Icone nome="lista" tamanho={16} />
                </button>
              </div>
            </div>
          </div>

          {visiveis.length === 0 ? (
            <section className="app-card app-empty pn-vazio">
              <h2 className="app-h2">Nenhuma página com esses filtros</h2>
              {filtrando && (
                <button className="bt" onClick={() => setF({ ...FILTROS_PADRAO, status: f.status, ordem: f.ordem })}>
                  Limpar filtros
                </button>
              )}
            </section>
          ) : vista === "grade" ? (
            <ul className="pg-lista">
              {visiveis.map((l) => (
                <Card key={l.page.id} l={l} acoes={acoes} />
              ))}
            </ul>
          ) : (
            <Lista linhas={visiveis} acoes={acoes} />
          )}
        </>
      )}

      {pages.length > 0 && (
        <p className="app-muted app-rodape">
          POC: as páginas e os dados de exemplo ficam neste navegador.{" "}
          <button
            className="app-linkbtn"
            onClick={() => {
              if (confirm("Apagar todas as páginas e voltar para os exemplos (com inscrições e visitas fictícias)?")) {
                restaurarExemplos();
                refresh();
              }
            }}
          >
            Restaurar exemplos
          </button>
        </p>
      )}
    </Shell>
  );
}

type Acoes = {
  duplicar: (p: PageRecord) => void;
  arquivar: (p: PageRecord, arquivar: boolean) => void;
  apagar: (p: PageRecord) => void;
};

const abrirEspaco = (p: PageRecord) => go(`/pagina/${p.id}`);

/** Enter e espaço no card fazem o mesmo que o clique. */
const teclaAbre = (p: PageRecord) => (e: KeyboardEvent) => {
  if (e.target !== e.currentTarget) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    abrirEspaco(p);
  }
};

/** Os cliques nos botões do card não abrem o espaço da página. */
const naoAbre = { onClick: (e: { stopPropagation: () => void }) => e.stopPropagation() };

function MenuPagina({ p, status, acoes }: { p: PageRecord; status: StatusVisivel; acoes: Acoes }) {
  return (
    <span {...naoAbre}>
      <Menu rotulo={`Mais ações de ${p.title}`} classeGatilho="bt bt-ic bt-p pg-mais" lado="dir" gatilho={() => <Icone nome="pontos" />}>
        {(fechar) => (
          <div className="mn-lista" onClick={fechar}>
            <button onClick={() => acoes.duplicar(p)}>
              <Icone nome="copiar" />
              Duplicar
            </button>
            <button onClick={() => download(`${p.slug}.json`, exportPage(p.id), "application/json")}>
              <Icone nome="baixar" />
              Exportar arquivo
            </button>
            <button onClick={() => acoes.arquivar(p, status !== "arquivada")}>
              <Icone nome="arquivar" />
              {status === "arquivada" ? "Desarquivar (volta como rascunho)" : "Arquivar"}
            </button>
            <button className="mn-perigo" onClick={() => acoes.apagar(p)}>
              <Icone nome="lixo" />
              Apagar
            </button>
          </div>
        )}
      </Menu>
    </span>
  );
}

function Atalhos({ p, compacto = false }: { p: PageRecord; compacto?: boolean }) {
  return (
    <div className="pg-atalhos" {...naoAbre}>
      <a className="bt bt-p" href={`#/editar/${p.id}`}>
        <Icone nome="lapis" tamanho={15} />
        {!compacto && "Editar"}
      </a>
      <a className="bt bt-p bt-ic" href={`#/p/${p.slug}`} title="Ver a página" aria-label={`Ver ${p.title}`}>
        <Icone nome="externo" tamanho={15} />
      </a>
      <a className="bt bt-p bt-ic" href={`#/pagina/${p.id}/links`} title="Links de licenciado" aria-label={`Links de licenciado de ${p.title}`}>
        <Icone nome="link" tamanho={15} />
      </a>
    </div>
  );
}

function Card({ l, acoes }: { l: LinhaPainel; acoes: Acoes }) {
  const { page: p, status } = l;
  const data = dataCurta(l.evento.inicio);
  const resp = l.meta.responsaveis ?? [];
  return (
    <li className="pg" tabIndex={0} role="link" aria-label={`Abrir ${p.title}`} onClick={() => abrirEspaco(p)} onKeyDown={teclaAbre(p)}>
      <div className="pg-thumb">
        <Miniatura data={p.data} />
      </div>
      <div className="pg-corpo">
        <div className="pg-topo">
          <ChipStatus status={status} />
          <span className="pg-modelo">{nomeModelo(p.templateId)}</span>
          <MenuPagina p={p} status={status} acoes={acoes} />
        </div>
        <strong className="pg-titulo" title={p.title}>
          {p.title}
        </strong>
        <span className={`pg-data${data ? "" : " pg-data-vazia"}`}>
          <Icone nome="calendario" tamanho={14} />
          {data || "Sem data do evento"}
        </span>
        <span className="pg-slug">/p/{p.slug}</span>
        <Vagas inscritos={l.inscritos} vagas={l.vagas} />
      </div>
      <div className="pg-pe">
        <Atalhos p={p} />
        {resp.length > 0 && (
          <span className="pg-resp" title={`Responsáveis: ${resp.join(", ")}`}>
            <Avatar nome={resp[0]} />
            {resp[0].split(" ")[0]}
            {resp.length > 1 && <span className="pg-resp-mais">+{resp.length - 1}</span>}
          </span>
        )}
      </div>
    </li>
  );
}

function Lista({ linhas, acoes }: { linhas: LinhaPainel[]; acoes: Acoes }) {
  return (
    <div className="app-card pn-tabela-card">
      <table className="pn-tabela">
        <thead>
          <tr>
            <th>Página</th>
            <th>Status</th>
            <th>Evento</th>
            <th>Inscritos</th>
            <th>Responsáveis</th>
            <th>Editada</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.page.id} tabIndex={0} onClick={() => abrirEspaco(l.page)} onKeyDown={teclaAbre(l.page)} aria-label={`Abrir ${l.page.title}`}>
              <td>
                <div className="pn-pagina">
                  <div className="pn-mini">
                    <Miniatura data={l.page.data} />
                  </div>
                  <div className="pn-pagina-txt">
                    <strong title={l.page.title}>{l.page.title}</strong>
                    <span>
                      /p/{l.page.slug} · {nomeModelo(l.page.templateId)}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <ChipStatus status={l.status} />
              </td>
              <td className="pn-nowrap">{dataCurta(l.evento.inicio) || <span className="pn-fraco">Sem data</span>}</td>
              <td className="pn-vagas-cel">
                <Vagas inscritos={l.inscritos} vagas={l.vagas} compacto />
              </td>
              <td>{(l.meta.responsaveis ?? []).join(", ") || <span className="pn-fraco">—</span>}</td>
              <td className="pn-nowrap pn-fraco">{quando(l.page.updatedAt)}</td>
              <td>
                <div className="pn-acoes">
                  <Atalhos p={l.page} compacto />
                  <MenuPagina p={l.page} status={l.status} acoes={acoes} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
