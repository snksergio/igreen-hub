import type { ComponentConfig } from "@puckeditor/core";
import { BotaoLima, hrefSimples, Icone, rico, useHref, useLive } from "../../../live/ui";
import { useTokens } from "../../context";
import { ctaFields, travaPermissions, type CtaProps } from "../../ui";
import { IMG_LIVE } from "./comum";

type Link = { texto: string; link: string };
type Linha = { rotulo: string; valor: string };

export type LiveRodapeProps = CtaProps & {
  frase1: string;
  frase2: string;
  proxima: string;
  menu: Link[];
  quandoTitulo: string;
  quando: Linha[];
  contatoTitulo: string;
  email: string;
  whatsTexto: string;
  endereco: string;
  botaoEquipe: string;
  redes: Link[];
  copyright: string;
  legais: Link[];
  travado?: boolean;
};

/* O rodapé D "Aurora viva" do iGreen Live, mais calmo: névoa baixa, pontos e granulação. */
function View(p: LiveRodapeProps) {
  const t = useTokens();
  const href = useHref();
  const ref = useLive<HTMLElement>("rodape");
  const whats = href({ destino: "whatsapp", link: "", mensagemWhats: p.mensagemWhats });
  return (
    <div className="lv">
      <footer className="rodape" ref={ref} data-lv="rodape">
        <div className="ceu" aria-hidden="true">
          <img className="luz luz-faixa" src={IMG_LIVE.aurora} alt="" loading="lazy" />
          <span className="luz luz-corpo" />
          <span className="luz luz-cortina-a" />
          <span className="luz luz-cortina-b" />
          <span className="luz luz-chao" />
          <span className="pontos-base" />
          <span className="pontos" />
          <span className="grao" />
          <span className="veu" />
        </div>
        <div className="rodape-in">
          <div className="rodape-cabeca">
            <h2 className="rodape-frase">
              <span>{t(p.frase1)}</span>
              {p.frase2 && <span>{t(p.frase2)}</span>}
            </h2>
            {p.proxima && (
              <p className="rodape-prox">
                <span className="ponto-luz" aria-hidden="true" />
                <span>{rico(t(p.proxima))}</span>
              </p>
            )}
          </div>
          <div className="rodape-linha">
            {p.menu.length > 0 && (
              <nav className="rodape-menu" aria-label="Menu do rodapé">
                {p.menu.map((m, k) => (
                  <a key={k} className="menu-a" {...hrefSimples(m.link)}>
                    <span className="menu-rola">
                      <span>{m.texto}</span>
                      <span aria-hidden="true">{m.texto}</span>
                    </span>
                  </a>
                ))}
              </nav>
            )}
            <div className="rodape-quando">
              <h3 className="rodape-h">{p.quandoTitulo}</h3>
              <ul className="rodape-lista">
                {p.quando.map((l, k) => (
                  <li key={k} className={k === 0 ? "destaque" : undefined}>
                    <span>{l.rotulo}</span>
                    <span>{l.valor}</span>
                  </li>
                ))}
              </ul>
              <BotaoLima {...p} />
            </div>
            <div className="rodape-contato">
              <h3 className="rodape-h">{p.contatoTitulo}</h3>
              {p.email && (
                <a className="link rodape-mail" href={`mailto:${p.email}`}>
                  {p.email}
                </a>
              )}
              {p.whatsTexto && (
                <a className="link rodape-whats" {...whats}>
                  {p.whatsTexto}
                </a>
              )}
              {p.endereco && <p className="rodape-end">{p.endereco}</p>}
              {p.botaoEquipe && (
                <a className="btn-fantasma" {...whats}>
                  {p.botaoEquipe}
                </a>
              )}
              {p.redes.length > 0 && (
                <ul className="rodape-social">
                  {p.redes.map((r, k) => (
                    <li key={k}>
                      <a className="link" {...hrefSimples(r.link)}>
                        {r.texto}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="rodape-barra">
            <p>{p.copyright}</p>
            <nav className="rodape-legal" aria-label="Legal">
              {p.legais.map((l, k) => (
                <a key={k} className="link" {...hrefSimples(l.link)}>
                  {l.texto}
                </a>
              ))}
            </nav>
            <a className="topo-link" href="#">
              Voltar ao topo <Icone nome="cima" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const linkFields = { texto: { type: "text" as const, label: "Texto" }, link: { type: "text" as const, label: "Link" } };

export const LiveRodape: ComponentConfig<LiveRodapeProps> = {
  label: "Rodapé Live",
  fields: {
    frase1: { type: "text", label: "Frase grande, linha 1" },
    frase2: { type: "text", label: "Frase grande, linha 2 (cinza)" },
    proxima: { type: "text", label: "Próxima parada (**negrito**)" },
    menu: {
      type: "array",
      label: "Menu (link: #programacao, #palestrantes, #local, #perguntas, #inscricao)",
      arrayFields: linkFields,
      defaultItemProps: { texto: "Seção", link: "#" },
      getItemSummary: (m) => m.texto || "Link",
      max: 8,
    },
    quandoTitulo: { type: "text", label: "Coluna de data e local: título" },
    quando: {
      type: "array",
      label: "Coluna de data e local: linhas (a primeira fica em destaque)",
      arrayFields: { rotulo: { type: "text", label: "Rótulo" }, valor: { type: "text", label: "Valor" } },
      defaultItemProps: { rotulo: "Rótulo", valor: "Valor" },
      getItemSummary: (l) => `${l.rotulo}: ${l.valor}`,
      max: 8,
    },
    ...ctaFields,
    contatoTitulo: { type: "text", label: "Coluna de contato: título" },
    email: { type: "text", label: "E-mail" },
    whatsTexto: { type: "text", label: "Link do WhatsApp (do licenciado, se vier no link)" },
    endereco: { type: "text", label: "Endereço curto" },
    botaoEquipe: { type: "text", label: "Botão falar com a equipe (abre o WhatsApp)" },
    redes: {
      type: "array",
      label: "Redes sociais",
      arrayFields: linkFields,
      defaultItemProps: { texto: "Instagram", link: "" },
      getItemSummary: (r) => r.texto || "Rede",
      max: 6,
    },
    copyright: { type: "text", label: "Texto de direitos" },
    legais: {
      type: "array",
      label: "Links legais",
      arrayFields: linkFields,
      defaultItemProps: { texto: "Política de privacidade", link: "" },
      getItemSummary: (l) => l.texto || "Link",
      max: 4,
    },
  },
  defaultProps: {
    frase1: "Te vejo em",
    frase2: "Belo Horizonte.",
    proxima: "Próxima parada: **Belo Horizonte**, 12 dez · Expominas",
    menu: [
      { texto: "Programação", link: "#programacao" },
      { texto: "Palestrantes", link: "#palestrantes" },
      { texto: "Local", link: "#local" },
      { texto: "Perguntas", link: "#perguntas" },
      { texto: "Inscrição", link: "#inscricao" },
    ],
    quandoTitulo: "Quando e onde",
    quando: [
      { rotulo: "Sábado", valor: "12 dez" },
      { rotulo: "Credenciamento", valor: "18h30" },
      { rotulo: "Palco", valor: "19h às 22h" },
      { rotulo: "Local", valor: "Expominas · Aud. 2" },
      { rotulo: "Entrada", valor: "Gratuita" },
    ],
    botaoTexto: "Garantir minha vaga",
    destino: "inscricao",
    link: "",
    mensagemWhats: "Olá! Quero falar com a equipe do iGreen Live BH.",
    contatoTitulo: "Contato",
    email: "contato@seuevento.com.br",
    whatsTexto: "Falar no WhatsApp",
    endereco: "iGreen Energy · Belo Horizonte, MG",
    botaoEquipe: "Falar com a equipe",
    redes: [
      { texto: "Instagram", link: "" },
      { texto: "YouTube", link: "" },
      { texto: "LinkedIn", link: "" },
    ],
    copyright: "© 2026 iGreen Energy",
    legais: [
      { texto: "Política de privacidade", link: "" },
      { texto: "Termos de uso", link: "" },
      { texto: "Uso de dados", link: "" },
    ],
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
