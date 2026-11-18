import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { BotaoLima, Icone, listaDeTexto, rico, useLive, Valor } from "../../../live/ui";
import { safeImg } from "../../../lib/imagens";
import { useTokens } from "../../context";
import { imagemField } from "../../fields/ImagemField";
import { ctaFields, travaPermissions, type CtaProps } from "../../ui";
import { IMG_LIVE } from "./comum";

export type LiveSobreProps = CtaProps & {
  etiqueta: string;
  titulo: string;
  imagemUrl: string;
  imagemAlt: string;
  legendaImagem: string;
  texto: string;
  apoio: string;
  avatares: { imagemUrl: string }[];
  maisTexto: string;
  numero: string;
  numeroRotulo: string;
  numeroDetalhe: string;
  marcas: string;
  estados: string;
  estadosRotulo: string;
  cidadeSigla: string;
  cidadeNome: string;
  cidadeDetalhe: string;
  travado?: boolean;
};

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });

function View(p: LiveSobreProps) {
  const t = useTokens();
  const ref = useLive<HTMLElement>("revelar contar");
  const mapa = useLive<HTMLElement>("mapa", [p.cidadeSigla]);
  const img = safeImg(p.imagemUrl);
  return (
    <div className="lv">
      <section className="secao" ref={ref} data-lv="revelar contar">
        <div className="wrap">
          {p.etiqueta && (
            <div className="cabeca">
              <span className="etiqueta">
                <i />
                {p.etiqueta}
              </span>
            </div>
          )}
          <h2 className="h-grande sobre-titulo revela">{rico(t(p.titulo))}</h2>
          <div className="sobre-grade">
            <figure className="sobre-foto foto revela">
              {img && <img src={img} alt={p.imagemAlt} loading="lazy" />}
              {p.legendaImagem && (
                <figcaption className="legenda">
                  <span className="etiqueta">
                    <i />
                    {p.legendaImagem}
                  </span>
                </figcaption>
              )}
            </figure>
            <div className="sobre-dir">
              <div className="sobre-texto revela" {...i(1)}>
                <p>{t(p.texto)}</p>
                <div className="sobre-pessoas">
                  <p>{p.apoio}</p>
                  {p.avatares.length > 0 && (
                    <span className="avatares">
                      {p.avatares.slice(0, 4).map((a, k) => (
                        <span key={k}>{safeImg(a.imagemUrl) && <img src={safeImg(a.imagemUrl)} alt="" loading="lazy" />}</span>
                      ))}
                      {p.maisTexto && <span className="mais">{p.maisTexto}</span>}
                    </span>
                  )}
                </div>
              </div>
              <div className="sobre-cartoes">
                <div className="dado card revela" {...i(2)}>
                  <b>
                    <Valor valor={p.numero} />
                  </b>
                  <span>{p.numeroRotulo}</span>
                  <small>{p.numeroDetalhe}</small>
                  {listaDeTexto(p.marcas).length > 0 && (
                    <div className="marcas">
                      {listaDeTexto(p.marcas).map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  )}
                  <BotaoLima {...p} />
                </div>
                <figure
                  ref={mapa}
                  className="mapa-br card revela"
                  {...i(3)}
                  data-lv="mapa"
                  data-sigla={p.cidadeSigla}
                  role="button"
                  tabIndex={0}
                  aria-pressed="false"
                  aria-label={`Mapa do Brasil com Minas Gerais em destaque. Aproximar em ${p.cidadeNome}`}
                >
                  <svg className="br-svg" viewBox="-74.5 -5.8 40.2 40" aria-hidden="true" />
                  <span className="mapa-zoom" aria-hidden="true">
                    <Icone nome="mais" className="icone mais" />
                    <Icone nome="menos" className="icone menos" />
                  </span>
                  <figcaption className="sobre">
                    <div className="de-longe">
                      <b>
                        <Valor valor={p.estados} />
                      </b>
                      <small>{p.estadosRotulo}</small>
                    </div>
                    <div className="de-perto">
                      <b>{p.cidadeNome}</b>
                      <small>{p.cidadeDetalhe}</small>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const LiveSobre: ComponentConfig<LiveSobreProps> = {
  label: "Sobre Live",
  fields: {
    etiqueta: { type: "text", label: "Selo" },
    titulo: { type: "textarea", label: "Título (*verde*, _cinza_)" },
    imagemUrl: imagemField("Pessoa recortada, PNG sem fundo"),
    imagemAlt: { type: "text", label: "Quem é a pessoa" },
    legendaImagem: { type: "text", label: "Legenda sobre a foto" },
    texto: { type: "textarea", label: "Texto principal" },
    apoio: { type: "textarea", label: "Texto menor ao lado dos rostos" },
    avatares: {
      type: "array",
      label: "Rostos (até 4)",
      arrayFields: { imagemUrl: imagemField("Foto") },
      defaultItemProps: { imagemUrl: "" },
      getItemSummary: (_a, k) => `Rosto ${(k ?? 0) + 1}`,
      max: 4,
    },
    maisTexto: { type: "text", label: "Bolinha verde depois dos rostos (+12)" },
    numero: { type: "text", label: "Número do cartão (350+)" },
    numeroRotulo: { type: "text", label: "O que é o número" },
    numeroDetalhe: { type: "text", label: "Detalhe do número" },
    marcas: { type: "text", label: "Etiquetas do cartão, separadas por vírgula" },
    ...ctaFields,
    estados: { type: "text", label: "Número do mapa (27)" },
    estadosRotulo: { type: "text", label: "Legenda do mapa" },
    cidadeSigla: { type: "text", label: "Sigla ao lado do ponto (o mapa destaca Minas Gerais)" },
    cidadeNome: { type: "text", label: "Cidade, ao aproximar o mapa" },
    cidadeDetalhe: { type: "text", label: "Local e data, ao aproximar o mapa" },
  },
  defaultProps: {
    etiqueta: "Sobre o evento",
    titulo: "Mais que palestras: *uma noite para conectar* quem já vive a _energia limpa no dia a dia._",
    imagemUrl: IMG_LIVE.rafael,
    imagemAlt: "Rafael Costa, diretor de estratégia da iGreen",
    legendaImagem: "Rafael Costa · Estratégia",
    texto: "Juntamos licenciados, clientes e o time da iGreen para mostrar, com números e histórias reais, como a energia por assinatura vira economia para quem consome e renda para quem indica.",
    apoio: "Um encontro feito para quem quer resultado: menos teoria, mais exemplos de quem já está no caminho.",
    avatares: [{ imagemUrl: IMG_LIVE.carla }, { imagemUrl: IMG_LIVE.bruno }, { imagemUrl: IMG_LIVE.juliana }],
    maisTexto: "+12",
    numero: "350+",
    numeroRotulo: "licenciados confirmados",
    numeroDetalhe: "Gente que já indica e acompanha clientes",
    marcas: "Green, Telecom, Mobi, Solis, Seguros, Club",
    botaoTexto: "Garantir vaga",
    destino: "inscricao",
    link: "",
    mensagemWhats: "",
    estados: "27",
    estadosRotulo: "estados com a iGreen",
    cidadeSigla: "BH",
    cidadeNome: "Belo Horizonte",
    cidadeDetalhe: "Expominas · 12 de dezembro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
