import type { ComponentConfig } from "@puckeditor/core";
import { safeImg } from "../../lib/imagens";
import { useTokens } from "../context";
import { imagemField } from "../fields/ImagemField";
import { Cta, ctaFields, fundoField, r, Section, travaPermissions, type CtaProps, type Fundo } from "../ui";

export type AberturaProps = CtaProps & {
  chamada: string;
  titulo: string;
  subtitulo: string;
  imagemUrl: string;
  imagemAlt: string;
  fundo: Fundo;
  travado?: boolean;
};

function View(p: AberturaProps) {
  const t = useTokens();
  const img = safeImg(p.imagemUrl);
  return (
    <Section fundo={p.fundo} travado={p.travado} className="hs-hero">
      <div className="hs-hero__grid">
        <div>
          {p.chamada && (
            <p className="hs-eyebrow" {...r(0)}>
              {t(p.chamada)}
            </p>
          )}
          <h1 className="hs-h1" {...r(1)}>
            {t(p.titulo)}
          </h1>
          {p.subtitulo && (
            <p className="hs-lead" {...r(2)}>
              {t(p.subtitulo)}
            </p>
          )}
          <div {...r(3)}>
            <Cta {...p} />
          </div>
        </div>
        {img ? (
          // Imagem da primeira dobra: costuma ser o maior elemento (LCP), então carrega com prioridade.
          <img className="hs-hero__img" src={img} alt={p.imagemAlt ?? ""} fetchPriority="high" {...r(2, "zoom")} />
        ) : (
          <div className="hs-hero__img hs-ph" {...r(2, "zoom")}>
            Imagem
          </div>
        )}
      </div>
    </Section>
  );
}

export const Abertura: ComponentConfig<AberturaProps> = {
  label: "Abertura",
  fields: {
    chamada: { type: "text", label: "Chamada curta acima do título" },
    titulo: { type: "text", label: "Título (aceita {nome} e {cidade})" },
    subtitulo: { type: "textarea", label: "Subtítulo" },
    imagemUrl: imagemField("Imagem"),
    imagemAlt: { type: "text", label: "O que a imagem mostra (Google e leitores de tela)" },
    ...ctaFields,
    fundo: fundoField,
  },
  defaultProps: {
    chamada: "Evento iGreen",
    titulo: "Título do evento",
    subtitulo: "Uma frase que diz por que vale a pena estar lá.",
    imagemUrl: "",
    imagemAlt: "",
    botaoTexto: "Quero participar",
    destino: "inscricao",
    link: "",
    mensagemWhats: "",
    fundo: "escuro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
