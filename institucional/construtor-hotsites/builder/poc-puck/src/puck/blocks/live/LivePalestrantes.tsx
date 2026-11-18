import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { BotaoLima, useLive } from "../../../live/ui";
import { safeImg } from "../../../lib/imagens";
import { useTokens } from "../../context";
import { imagemField } from "../../fields/ImagemField";
import { ctaFields, travaPermissions, type CtaProps } from "../../ui";
import { IMG_LIVE } from "./comum";

type Pessoa = { nome: string; cargo: string; imagemUrl: string };

export type LivePalestrantesProps = CtaProps & {
  etiqueta: string;
  titulo1: string;
  titulo2: string;
  texto: string;
  pessoas: Pessoa[];
  travado?: boolean;
};

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });

/* O componente "As vozes" do iGreen Live: cabeça centrada, partículas atrás e carrossel infinito. */
function View(p: LivePalestrantesProps) {
  const t = useTokens();
  const pessoas = p.pessoas.filter((x) => x.nome);
  const secao = useLive<HTMLElement>("revelar");
  const tela = useLive<HTMLCanvasElement>("particulas");
  const carrossel = useLive<HTMLDivElement>("carrossel", [pessoas.length, JSON.stringify(pessoas)]);
  const n = pessoas.length;
  return (
    <div className="lv">
      <section className="palestrantes" id="palestrantes" ref={secao} data-lv="revelar">
        <canvas className="particulas" ref={tela} data-lv="particulas" aria-hidden="true" />
        <div className="pal-cabeca">
          <span className="etiqueta revela">
            <i />
            {p.etiqueta ? (
              p.etiqueta
            ) : (
              <>
                <b>{n}</b> {n === 1 ? "palestrante confirmado" : "palestrantes confirmados"}
              </>
            )}
          </span>
          <h2 className="h-grande revela" {...i(1)}>
            {t(p.titulo1)}
            {p.titulo2 && (
              <>
                <br />
                <span>{t(p.titulo2)}</span>
              </>
            )}
          </h2>
          {p.texto && (
            <p className="revela" {...i(2)}>
              {p.texto.split("\n").map((linha, k) => (
                <span key={k}>
                  {k > 0 && <br />}
                  {linha}
                </span>
              ))}
            </p>
          )}
          {p.botaoTexto && (
            <div className="revela" {...i(3)}>
              <BotaoLima {...p} />
            </div>
          )}
        </div>
        {n > 0 && (
          <div className="carrossel revela" {...i(2)} ref={carrossel} data-lv="carrossel" data-itens={n} aria-label="Palestrantes (arraste para ver mais)">
            <div className="trilho">
              {[0, 1, 2].map((copia) =>
                pessoas.map((x, k) => {
                  const img = safeImg(x.imagemUrl);
                  return (
                    <article key={`${copia}-${k}`} className="pessoa" aria-hidden={copia > 0 || undefined}>
                      <span className="painel" />
                      {img && <img src={img} alt={copia ? "" : `${x.nome}, ${x.cargo}`} loading="lazy" draggable={false} />}
                      <span className="desfoque" />
                      <span className="esmaece" />
                      <div className="nome">
                        <b>{x.nome}</b>
                        <span>{x.cargo}</span>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export const LivePalestrantes: ComponentConfig<LivePalestrantesProps> = {
  label: "Palestrantes Live",
  fields: {
    etiqueta: { type: "text", label: "Selo (vazio = conta as pessoas sozinho)" },
    titulo1: { type: "text", label: "Título, primeira linha" },
    titulo2: { type: "text", label: "Título, segunda linha (cinza)" },
    texto: { type: "textarea", label: "Texto de apoio" },
    ...ctaFields,
    pessoas: {
      type: "array",
      label: "Pessoas do carrossel",
      arrayFields: {
        nome: { type: "text", label: "Nome" },
        cargo: { type: "text", label: "Cargo" },
        imagemUrl: imagemField("Foto recortada, PNG sem fundo"),
      },
      defaultItemProps: { nome: "Nome", cargo: "Cargo", imagemUrl: "" },
      getItemSummary: (x) => x.nome || "Pessoa",
      max: 16,
    },
  },
  defaultProps: {
    etiqueta: "",
    titulo1: "As vozes",
    titulo2: "por trás do palco",
    texto: "Sócios e líderes que vivem a iGreen todos os dias — \ne transformam oportunidade em resultado real.",
    botaoTexto: "Participe do evento",
    destino: "inscricao",
    link: "",
    mensagemWhats: "",
    pessoas: [
      { nome: "Thiago", cargo: "CEO e fundador", imagemUrl: IMG_LIVE.thiago },
      { nome: "Rafael Costa", cargo: "Diretor de estratégia", imagemUrl: IMG_LIVE.rafael },
      { nome: "Amanda", cargo: "Head de marketing", imagemUrl: IMG_LIVE.amanda },
      { nome: "Ana Beltrão", cargo: "Head de expansão", imagemUrl: IMG_LIVE.ana },
      { nome: "Carla Mendes", cargo: "Líder de licenciados", imagemUrl: IMG_LIVE.carla },
      { nome: "Bruno Sales", cargo: "Diretor comercial", imagemUrl: IMG_LIVE.bruno },
      { nome: "Juliana Reis", cargo: "Head de treinamento", imagemUrl: IMG_LIVE.juliana },
      { nome: "Pedro Rocha", cargo: "Licenciado destaque", imagemUrl: IMG_LIVE.pedro },
    ],
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
