import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { BotaoLima, hrefSimples, Icone, Seta, useLive, Valor } from "../../../live/ui";
import { safeImg } from "../../../lib/imagens";
import { useTokens } from "../../context";
import { dataHoraField } from "../../fields/DataHoraField";
import { imagemField } from "../../fields/ImagemField";
import { ctaFields, travaPermissions, type CtaProps } from "../../ui";
import { IMG_LIVE, isoBrasilia } from "./comum";

type Link = { texto: string; link: string };
type Numero = { valor: string; rotulo: string; detalhe: string };

export type LiveAberturaProps = CtaProps & {
  marca: string;
  menu: Link[];
  botaoTopo: string;
  chamada: string;
  titulo: string;
  destaque: string;
  subtitulo: string;
  botao2Texto: string;
  botao2Link: string;
  imagemUrl: string;
  imagemAlt: string;
  palavra1: string;
  palavra2: string;
  numeros: Numero[];
  quando: string;
  dataTexto: string;
  status: string;
  localNome: string;
  localDetalhe: string;
  confirmados: string;
  confirmadosDetalhe: string;
  avatares: { imagemUrl: string }[];
  botaoContagem: string;
  travado?: boolean;
};

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });

function View(p: LiveAberturaProps) {
  const t = useTokens();
  const ref = useLive<HTMLElement>("revelar contar relogio");
  const img = safeImg(p.imagemUrl);
  return (
    <div className="lv">
      <header className="hero" ref={ref} data-lv="revelar contar relogio">
        <div className="hero-cartao">
          <span className="pontos-base" aria-hidden="true" />
          <span className="pontos" aria-hidden="true" />
          <nav className="nav" aria-label="Seções do evento">
            <a className="logo" href="#">
              <i />
              {p.marca}
            </a>
            {p.menu.length > 0 && (
              <div className="nav-links">
                {p.menu.map((m, k) => (
                  <a key={k} {...hrefSimples(m.link)} aria-current={k === 0 ? "page" : undefined}>
                    {m.texto}
                  </a>
                ))}
              </div>
            )}
            {p.botaoTopo && (
              <a className="btn-creme" href="#inscricao">
                {p.botaoTopo}
              </a>
            )}
            <button className="nav-menu" type="button" aria-label="Abrir menu">
              <Icone nome="menu" />
            </button>
          </nav>

          <div className="hero-palco" aria-hidden="true">
            {(p.palavra1 || p.palavra2) && (
              <span className="hero-palavra">
                {p.palavra1 && <span>{p.palavra1}</span>}
                {p.palavra2 && <span>{p.palavra2}</span>}
              </span>
            )}
            {img && <img className="hero-pessoa" src={img} alt="" fetchPriority="high" />}
          </div>

          <div className="hero-conteudo">
            <div className="hero-esq">
              {p.chamada && (
                <span className="etiqueta revela">
                  <i />
                  {t(p.chamada)}
                </span>
              )}
              <h1 className="revela" {...i(1)}>
                {t(p.titulo)}
                {p.destaque && (
                  <>
                    <br />
                    <em>{t(p.destaque)}</em>
                  </>
                )}
              </h1>
              {p.subtitulo && (
                <p className="lead revela" {...i(2)}>
                  {t(p.subtitulo)}
                </p>
              )}
              <div className="hero-acoes revela" {...i(3)}>
                <BotaoLima {...p} />
                {p.botao2Texto && (
                  <a className="btn-fantasma" {...hrefSimples(p.botao2Link)}>
                    {p.botao2Texto}
                  </a>
                )}
              </div>
            </div>
          </div>

          {p.numeros.length > 0 && (
            <div className="hero-base">
              {p.numeros.slice(0, 2).map((n, k) => (
                <div key={k} className="num-cartao vidro revela" {...i(3 + k)}>
                  <div>
                    <b>
                      <Valor valor={n.valor} sup />
                    </b>
                    <span>{n.rotulo}</span>
                  </div>
                  {n.detalhe && <small>{n.detalhe}</small>}
                </div>
              ))}
            </div>
          )}

          <aside className="conta vidro revela" {...i(4)} aria-label="Contagem regressiva e inscrição">
            <div className="topo">
              <span>{p.dataTexto}</span>
              {p.status && (
                <span className="ao-vivo">
                  <i />
                  {p.status}
                </span>
              )}
            </div>
            <div className="relogio" data-alvo={isoBrasilia(p.quando)}>
              {(["d", "h", "m", "s"] as const).map((u) => (
                <div key={u}>
                  <b data-u={u}>00</b>
                  <small>{{ d: "dias", h: "horas", m: "min", s: "seg" }[u]}</small>
                </div>
              ))}
            </div>
            {(p.localNome || p.localDetalhe) && (
              <div className="onde">
                <b>{p.localNome}</b>
                <span>{p.localDetalhe}</span>
              </div>
            )}
            {p.confirmados && (
              <div className="conta-prova">
                {p.avatares.length > 0 && (
                  <span className="avatares">
                    {p.avatares.slice(0, 4).map((a, k) => (
                      <span key={k}>{safeImg(a.imagemUrl) && <img src={safeImg(a.imagemUrl)} alt="" loading="lazy" />}</span>
                    ))}
                  </span>
                )}
                <span>
                  <b>{p.confirmados}</b>
                  {p.confirmadosDetalhe}
                </span>
              </div>
            )}
            {p.botaoContagem && (
              <a className="btn" href="#inscricao">
                {p.botaoContagem} <Seta />
              </a>
            )}
          </aside>
        </div>
      </header>
    </div>
  );
}

export const LiveAbertura: ComponentConfig<LiveAberturaProps> = {
  label: "Abertura Live",
  fields: {
    marca: { type: "text", label: "Marca no topo" },
    menu: {
      type: "array",
      label: "Menu do topo (link: #programacao, #palestrantes, #local, #perguntas)",
      arrayFields: { texto: { type: "text", label: "Texto" }, link: { type: "text", label: "Link" } },
      defaultItemProps: { texto: "Seção", link: "#" },
      getItemSummary: (m) => m.texto || "Link",
      max: 6,
    },
    botaoTopo: { type: "text", label: "Botão do topo (leva à inscrição; vazio = sem botão)" },
    chamada: { type: "text", label: "Selo acima do título" },
    titulo: { type: "text", label: "Título, primeira linha (aceita {nome} e {cidade})" },
    destaque: { type: "text", label: "Título, linha verde (curta, para caber numa linha)" },
    subtitulo: { type: "textarea", label: "Texto de apoio" },
    ...ctaFields,
    botao2Texto: { type: "text", label: "Segundo botão (vazio = sem botão)" },
    botao2Link: { type: "text", label: "Segundo botão leva para (#programacao ou um link)" },
    imagemUrl: imagemField("Pessoa recortada, PNG sem fundo"),
    imagemAlt: { type: "text", label: "Quem é a pessoa (Google e leitores de tela)" },
    palavra1: { type: "text", label: "Palavra grande atrás da pessoa, linha 1" },
    palavra2: { type: "text", label: "Palavra grande atrás da pessoa, linha 2" },
    numeros: {
      type: "array",
      label: "Cartões de número (até 2)",
      arrayFields: {
        valor: { type: "text", label: "Número (3.000+, 15%)" },
        rotulo: { type: "text", label: "O que é" },
        detalhe: { type: "text", label: "Detalhe" },
      },
      defaultItemProps: { valor: "100+", rotulo: "participantes", detalhe: "" },
      getItemSummary: (n) => `${n.valor} ${n.rotulo}`,
      max: 2,
    },
    quando: dataHoraField("Começa em (horário de Brasília, para a contagem)"),
    dataTexto: { type: "text", label: "Data por extenso no cartão" },
    status: { type: "text", label: "Aviso piscando no cartão (vazio = sem aviso)" },
    localNome: { type: "text", label: "Local" },
    localDetalhe: { type: "text", label: "Cidade e horário" },
    confirmados: { type: "text", label: "Confirmados (vazio = esconde a linha)" },
    confirmadosDetalhe: { type: "text", label: "Detalhe dos confirmados" },
    avatares: {
      type: "array",
      label: "Rostos ao lado dos confirmados (até 4)",
      arrayFields: { imagemUrl: imagemField("Foto") },
      defaultItemProps: { imagemUrl: "" },
      getItemSummary: (_a, k) => `Rosto ${(k ?? 0) + 1}`,
      max: 4,
    },
    botaoContagem: { type: "text", label: "Botão do cartão (leva à inscrição)" },
  },
  defaultProps: {
    marca: "iGreen",
    menu: [
      { texto: "Início", link: "#" },
      { texto: "Programação", link: "#programacao" },
      { texto: "Palestrantes", link: "#palestrantes" },
      { texto: "Local", link: "#local" },
      { texto: "Perguntas", link: "#perguntas" },
    ],
    botaoTopo: "Garantir vaga",
    chamada: "Evento presencial · Belo Horizonte",
    titulo: "Energia limpa,",
    destaque: "renda de verdade.",
    subtitulo: "Uma noite com quem já transformou conta de luz em renda. Conteúdo prático, conexões e o próximo passo da sua jornada na iGreen.",
    botaoTexto: "Quero participar",
    destino: "inscricao",
    link: "",
    mensagemWhats: "",
    botao2Texto: "Ver programação",
    botao2Link: "#programacao",
    imagemUrl: IMG_LIVE.thiago,
    imagemAlt: "Thiago, CEO e fundador da iGreen",
    palavra1: "LIVE",
    palavra2: "BH",
    numeros: [
      { valor: "3.000+", rotulo: "participantes", detalhe: "somando as edições de 2025 e 2026 pelo Brasil" },
      { valor: "15%", rotulo: "de economia média", detalhe: "na conta de luz de quem já é cliente" },
    ],
    quando: "2026-12-12T19:00",
    dataTexto: "Sábado, 12 de dezembro",
    status: "Vagas abertas",
    localNome: "Expominas · Auditório 2",
    localDetalhe: "Belo Horizonte, MG · 19h às 22h",
    confirmados: "+1.200 confirmados",
    confirmadosDetalhe: "nas últimas 48 horas",
    avatares: [{ imagemUrl: IMG_LIVE.amanda }, { imagemUrl: IMG_LIVE.rafael }, { imagemUrl: IMG_LIVE.ana }],
    botaoContagem: "Garantir minha vaga",
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
