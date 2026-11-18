import { lazy, Suspense, useMemo, useState } from "react";
import { listarEventos, resumir } from "../../lib/eventos";
import { cobra } from "../../lib/formularios";
import { listarLinks } from "../../lib/links";
import { dataCurta, dataPorExtenso, infoEvento, lugarCurto, statusVisivel } from "../../lib/meta";
import { formularioDe, vagasDaPagina } from "../../lib/pagina";
import { metaDe } from "../../lib/painel";
import { duplicatePage, getPage, getPageBySlug, setMeta, type PageRecord } from "../../lib/pages";
import { listSubmissions, ocupaVaga, statusDe } from "../../lib/submissions";
import { appBaseUrl, go, type AbaPagina } from "../../router";
import { Icone } from "../../ui/Icone";
import { baixarQr, Bloco, ChipInscricao, ChipStatus, Copiar, Numero, QrCode, Vagas } from "../comum";
import { NaoEncontrada, Shell } from "../Shell";
import "../espaco.css";
import type { Espaco as Dados } from "./tipos";

const Inscritos = lazy(() => import("./Inscritos").then((m) => ({ default: m.Inscritos })));
const Resultados = lazy(() => import("./Resultados").then((m) => ({ default: m.Resultados })));
const Links = lazy(() => import("./Links").then((m) => ({ default: m.Links })));
const Config = lazy(() => import("./Config").then((m) => ({ default: m.Config })));

export const linkPublico = (p: PageRecord) => `${appBaseUrl()}#/p/${p.slug}`;

/** Espaço da página (Etapa 2): acompanhar e configurar sem abrir o construtor. */
export function Espaco({ id, aba }: { id: string; aba: AbaPagina }) {
  const [versao, setVersao] = useState(0);
  // Aceita o id ou o endereço (#/pagina/igreen-live-bh), para dar para mandar o link do espaço.
  const page = useMemo(() => getPage(id) ?? getPageBySlug(id), [id, versao]);
  const dados = useMemo<Dados | null>(() => {
    if (!page) return null;
    const meta = metaDe(page);
    const subs = listSubmissions({ pageId: page.id });
    return {
      page,
      meta,
      status: statusVisivel(meta),
      evento: infoEvento(page.data),
      form: formularioDe(page),
      subs,
      inscritos: subs.filter(ocupaVaga).length,
      vagas: vagasDaPagina(page),
      eventos: listarEventos(page.id),
      links: listarLinks(page.id),
      recarregar: () => setVersao((v) => v + 1),
    };
  }, [page, versao]);

  if (!page || !dados) return <NaoEncontrada />;
  const nInscricoes = dados.subs.length;

  const abas: { id: AbaPagina; rotulo: string; conta?: number }[] = [
    { id: "visao", rotulo: "Visão geral" },
    { id: "inscricoes", rotulo: "Inscrições", conta: nInscricoes },
    { id: "resultados", rotulo: "Resultados" },
    { id: "links", rotulo: "Links de licenciado", conta: dados.links.length },
    { id: "config", rotulo: "Configurações" },
  ];

  return (
    <Shell ativo="paginas">
      <div className="ep-topo">
        <a className="ep-voltar" href="#/">
          <Icone nome="voltar" tamanho={16} />
          Páginas
        </a>
        <div className="ep-cab">
          <div className="ep-cab-txt">
            <div className="ep-titulo-linha">
              <h1 className="app-h1 ep-titulo">{page.title}</h1>
              <ChipStatus status={dados.status} />
            </div>
            <p className="ep-sub">
              {dados.evento.inicio && (
                <span>
                  <Icone nome="calendario" tamanho={15} />
                  {dataCurta(dados.evento.inicio)}
                </span>
              )}
              {lugarCurto(dados.evento) && (
                <span>
                  <Icone nome="pin" tamanho={15} />
                  {lugarCurto(dados.evento)}
                </span>
              )}
              <a href={`#/p/${page.slug}`}>/p/{page.slug}</a>
            </p>
          </div>
          <div className="app-actions">
            <a className="bt" href={`#/p/${page.slug}`}>
              <Icone nome="externo" tamanho={16} />
              Ver página
            </a>
            <a className="bt bt-pri" href={`#/editar/${page.id}`}>
              <Icone nome="lapis" tamanho={16} />
              Abrir construtor
            </a>
          </div>
        </div>
        <nav className="pn-abas ep-abas" aria-label="Partes da página">
          {abas.map((a) => (
            <a key={a.id} href={`#/pagina/${page.id}/${a.id}`} aria-current={aba === a.id ? "page" : undefined}>
              {a.rotulo}
              {a.conta !== undefined && <span className="pn-conta">{a.conta.toLocaleString("pt-BR")}</span>}
            </a>
          ))}
        </nav>
      </div>

      <Suspense fallback={<p className="app-muted">Carregando…</p>}>
        {aba === "visao" && <VisaoGeral d={dados} />}
        {aba === "inscricoes" && <Inscritos d={dados} />}
        {aba === "resultados" && <Resultados d={dados} />}
        {aba === "links" && <Links d={dados} />}
        {aba === "config" && <Config d={dados} />}
      </Suspense>
    </Shell>
  );
}

/** Visão geral (2.2): status, link, QR, data, vagas e atalhos. */
function VisaoGeral({ d }: { d: Dados }) {
  const { page, status, evento, subs } = d;
  const url = linkPublico(page);
  const r = useMemo(() => resumir(d.eventos, subs, 14), [d.eventos, subs]);
  const pago = cobra(d.form);
  const confirmados = subs.filter((s) => ["confirmado", "presente"].includes(statusDe(s))).length;
  const ultimas = subs.slice(0, 5);
  const aba = (a: AbaPagina) => `#/pagina/${page.id}/${a}`;

  const mudarStatus = (meta: Parameters<typeof setMeta>[1]) => {
    setMeta(page.id, meta);
    d.recarregar();
  };

  return (
    <div className="ep-grade">
      <div className="ep-col">
        <div className="nm-linha">
          <Numero rotulo="Inscritos" valor={d.inscritos.toLocaleString("pt-BR")} apoio={d.vagas ? `de ${d.vagas} vagas` : "sem limite de vagas"} />
          <Numero rotulo="Visitas" valor={r.visitas.toLocaleString("pt-BR")} apoio="desde a publicação" />
          <Numero rotulo="Conversão" valor={`${r.conversao.toLocaleString("pt-BR")}%`} apoio="visitas que viraram inscrição" />
          {pago ? (
            <Numero rotulo="Pagos" valor={r.pagos.toLocaleString("pt-BR")} apoio={`${subs.filter((s) => s.pagamento?.status === "pendente").length} pendentes`} />
          ) : (
            <Numero rotulo="Confirmados" valor={confirmados.toLocaleString("pt-BR")} apoio={`${r.presentes} presentes no check-in`} />
          )}
        </div>

        <Bloco
          titulo="Últimas inscrições"
          acao={
            <a className="bt bt-p" href={aba("inscricoes")}>
              Ver todas
              <Icone nome="seta" tamanho={15} />
            </a>
          }
        >
          {ultimas.length === 0 ? (
            <p className="app-muted">Nenhuma inscrição ainda. Quando alguém se inscrever, aparece aqui.</p>
          ) : (
            <ul className="ep-ultimas">
              {ultimas.map((s) => (
                <li key={s.id}>
                  <a href={`${aba("inscricoes")}`} onClick={() => sessionStorage.setItem("poc-hotsite:abrir-inscricao", s.id)}>
                    <span className="ep-ultimas-nome">
                      <strong>{s.nome}</strong>
                      <span>
                        {s.cidade ?? "—"} · {new Date(s.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </span>
                    <ChipInscricao status={statusDe(s)} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Bloco>

        <Bloco
          titulo="Formulário de inscrição"
          acao={
            d.form ? (
              <a className="bt bt-p" href={`#/formulario/${d.form.id}?pagina=${page.id}`}>
                <Icone nome="lapis" tamanho={15} />
                Editar formulário
              </a>
            ) : (
              <a className="bt bt-p" href={aba("config")}>
                Escolher formulário
              </a>
            )
          }
        >
          {d.form ? (
            <p className="ep-form-resumo">
              <Icone nome="formulario" tamanho={18} />
              <span>
                <strong>{d.form.nome}</strong>
                <span>
                  {d.form.campos.filter((c) => c.naPagina && c.tipo !== "oculto").length} campos na página ·{" "}
                  {d.form.campos.filter((c) => !c.naPagina && !["etapa", "oculto", "info"].includes(c.tipo)).length} no modal
                  {pago ? " · com ingresso pago" : " · gratuito"}
                </span>
              </span>
            </p>
          ) : (
            <p className="app-muted">A página usa o formulário fixo da peça de inscrição (nome, WhatsApp, e-mail e cidade). Escolha um formulário da biblioteca para ter etapas, regras e ingresso.</p>
          )}
        </Bloco>
      </div>

      <aside className="ep-col ep-lado">
        <Bloco titulo="Status">
          <div className="ep-status">
            <ChipStatus status={status} />
            <span className="app-muted">
              {status === "agendada" && `Entra no ar ${dataPorExtenso(d.meta.publicarEm)}.`}
              {status === "publicada" && (d.meta.encerrarEm ? `Inscrições fecham ${dataPorExtenso(d.meta.encerrarEm)}.` : "No ar, recebendo inscrições.")}
              {status === "rascunho" && "Ainda não está no ar."}
              {status === "encerrada" && "No ar, com as inscrições encerradas."}
              {status === "arquivada" && "Fora do painel principal e com as inscrições encerradas."}
            </span>
          </div>
          <div className="ep-status-acoes">
            {(status === "rascunho" || status === "agendada") && (
              <button className="bt bt-pri bt-p" onClick={() => mudarStatus({ status: "publicada", publicarEm: undefined })}>
                Publicar agora
              </button>
            )}
            {status === "publicada" && (
              <button className="bt bt-p" onClick={() => confirm("Encerrar as inscrições agora? A página continua no ar.") && mudarStatus({ status: "encerrada" })}>
                Encerrar inscrições
              </button>
            )}
            {(status === "encerrada" || status === "arquivada") && (
              <button className="bt bt-p" onClick={() => mudarStatus({ status: "publicada", encerrarEm: undefined })}>
                Reabrir inscrições
              </button>
            )}
            <a className="bt bt-p" href={aba("config")}>
              <Icone nome="relogio" tamanho={15} />
              Agendar
            </a>
          </div>
        </Bloco>

        <Bloco titulo="Link da página">
          <div className="ep-link">
            <code title={url}>{url.replace(/^https?:\/\//, "")}</code>
            <Copiar texto={url} />
          </div>
          <div className="ep-qr">
            <QrCode texto={url} tamanho={132} rotulo={`QR code do link de ${page.title}`} />
            <div className="ep-qr-txt">
              <p className="app-muted">Para cartaz, telão e material impresso.</p>
              <button className="bt bt-p" onClick={() => baixarQr(url, `qr-${page.slug}`)}>
                <Icone nome="baixar" tamanho={15} />
                Baixar QR code
              </button>
            </div>
          </div>
        </Bloco>

        <Bloco titulo="Evento">
          <dl className="ep-dl">
            <dt>Quando</dt>
            <dd>{evento.inicio ? dataPorExtenso(evento.inicio) : <span className="pn-fraco">Sem data na página</span>}</dd>
            <dt>Onde</dt>
            <dd>{lugarCurto(evento) || <span className="pn-fraco">Sem local na página</span>}</dd>
          </dl>
          <Vagas inscritos={d.inscritos} vagas={d.vagas} />
          <p className="ep-nota">Data e local vêm das peças da página (Data e local, Abertura ou Contagem). Para mudar, abra o construtor.</p>
        </Bloco>

        <Bloco titulo="Atalhos">
          <div className="ep-atalhos">
            <a className="bt bt-p" href={`#/editar/${page.id}`}>
              <Icone nome="lapis" tamanho={15} />
              Editar
            </a>
            <a className="bt bt-p" href={`#/p/${page.slug}`}>
              <Icone nome="externo" tamanho={15} />
              Ver
            </a>
            <button
              className="bt bt-p"
              onClick={() => {
                const c = duplicatePage(page.id);
                go(`/pagina/${c.id}`);
              }}
            >
              <Icone nome="copiar" tamanho={15} />
              Duplicar
            </button>
            <button
              className="bt bt-p"
              onClick={() => mudarStatus({ status: status === "arquivada" ? "rascunho" : "arquivada" })}
            >
              <Icone nome="arquivar" tamanho={15} />
              {status === "arquivada" ? "Desarquivar" : "Arquivar"}
            </button>
            <a className="bt bt-p" href={`#/checkin/${page.id}`}>
              <Icone nome="check" tamanho={15} />
              Check-in
            </a>
          </div>
        </Bloco>
      </aside>
    </div>
  );
}
