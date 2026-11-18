import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties, ReactNode } from "react";
import { hrefSimples, Icone, rico, useLive } from "../../../live/ui";
import { safeImg } from "../../../lib/imagens";
import { useTokens } from "../../context";
import { imagemField } from "../../fields/ImagemField";
import { travaPermissions } from "../../ui";
import { IMG_LIVE } from "./comum";

type Item = { titulo: string; texto: string; estilo: "card" | "destaque" | "foto"; imagemUrl: string };

export type LiveBeneficiosProps = {
  etiqueta: string;
  titulo: string;
  itens: Item[];
  frase: string;
  textoLateral: string;
  botaoLateralTexto: string;
  botaoLateralLink: string;
  travado?: boolean;
};

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });

function Cartao({ it, ordem }: { it: Item; ordem: number }) {
  const canto = (
    <span className="canto">
      <Icone nome="seta" />
    </span>
  );
  if (it.estilo === "foto") {
    const img = safeImg(it.imagemUrl);
    return (
      <article className="beneficio foto-b foto revela" {...i(ordem)}>
        {img && <img src={img} alt="" loading="lazy" />}
        {canto}
        <div className="txt">
          <h3>{it.titulo}</h3>
          <p>{it.texto}</p>
        </div>
      </article>
    );
  }
  return (
    <article className={`beneficio card ${it.estilo === "destaque" ? "destaque " : ""}revela`} {...i(ordem)}>
      {canto}
      <h3>{it.titulo}</h3>
      <p>{it.texto}</p>
    </article>
  );
}

/* Grade em mosaico: cartão, cartão, frase solta, cartão, texto com botão e o resto dos cartões. */
function View(p: LiveBeneficiosProps) {
  const t = useTokens();
  const ref = useLive<HTMLElement>("revelar");
  const celulas: ReactNode[] = p.itens.map((it, k) => <Cartao key={`c${k}`} it={it} ordem={k % 5} />);
  if (p.frase)
    celulas.splice(Math.min(2, celulas.length), 0, (
      <div key="frase" className="leva-texto">
        <p className="frase">{p.frase}</p>
      </div>
    ));
  if (p.textoLateral || p.botaoLateralTexto)
    celulas.splice(Math.min(4, celulas.length), 0, (
      <div key="lateral" className="leva-texto revela" {...i(1)}>
        {p.textoLateral && <p>{p.textoLateral}</p>}
        {p.botaoLateralTexto && (
          <a className="btn-fantasma" {...hrefSimples(p.botaoLateralLink)}>
            {p.botaoLateralTexto}
          </a>
        )}
      </div>
    ));
  return (
    <div className="lv">
      <section className="secao" ref={ref} data-lv="revelar">
        <div className="wrap">
          <div className="leva-cabeca">
            {p.etiqueta && (
              <span className="etiqueta">
                <i />
                {p.etiqueta}
              </span>
            )}
            <h2 className="h-grande revela">{rico(t(p.titulo))}</h2>
          </div>
          <div className="leva-grade">{celulas}</div>
        </div>
      </section>
    </div>
  );
}

export const LiveBeneficios: ComponentConfig<LiveBeneficiosProps> = {
  label: "Benefícios Live",
  fields: {
    etiqueta: { type: "text", label: "Selo" },
    titulo: { type: "textarea", label: "Título (*verde*, _cinza_)" },
    itens: {
      type: "array",
      label: "Cartões (o mosaico encaixa a frase e o texto lateral entre eles)",
      arrayFields: {
        titulo: { type: "text", label: "Título" },
        texto: { type: "textarea", label: "Texto" },
        estilo: {
          type: "radio",
          label: "Estilo",
          options: [
            { label: "Escuro", value: "card" },
            { label: "Verde", value: "destaque" },
            { label: "Com foto", value: "foto" },
          ],
        },
        imagemUrl: imagemField("Foto (só no estilo Com foto: pessoa recortada)"),
      },
      defaultItemProps: { titulo: "Benefício", texto: "Uma frase curta.", estilo: "card", imagemUrl: "" },
      getItemSummary: (it) => it.titulo || "Cartão",
      max: 8,
    },
    frase: { type: "textarea", label: "Frase solta no meio do mosaico (vazio = sem frase)" },
    textoLateral: { type: "textarea", label: "Texto com botão no mosaico" },
    botaoLateralTexto: { type: "text", label: "Botão do texto (vazio = sem botão)" },
    botaoLateralLink: { type: "text", label: "Botão leva para (#programacao ou um link)" },
  },
  defaultProps: {
    etiqueta: "Por que ir",
    titulo: "*O que você leva* para casa depois desta noite",
    itens: [
      { titulo: "Conteúdo prático", texto: "Como apresentar a economia, responder objeções e fechar a primeira indicação.", estilo: "card", imagemUrl: "" },
      { titulo: "Networking de verdade", texto: "Licenciados da sua região e do Brasil.", estilo: "foto", imagemUrl: IMG_LIVE.carla },
      { titulo: "Ao vivo com o Thiago", texto: "Perguntas abertas com o fundador, sem roteiro.", estilo: "destaque", imagemUrl: "" },
      { titulo: "Benefícios exclusivos", texto: "Condições que só aparecem para quem está no evento.", estilo: "card", imagemUrl: "" },
      { titulo: "Certificado de presença", texto: "Conta para as trilhas de formação da iGreen Academy.", estilo: "card", imagemUrl: "" },
      { titulo: "Brindes e sorteios", texto: "Durante toda a noite, para quem estiver na plateia.", estilo: "card", imagemUrl: "" },
    ],
    frase: "Você não precisa saber tudo. Só precisa estar na sala certa.",
    textoLateral: "Cada edição é pensada para um momento da jornada: começar, crescer e liderar uma rede. Esta é para quem quer dar o próximo passo.",
    botaoLateralTexto: "Ver programação",
    botaoLateralLink: "#programacao",
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
