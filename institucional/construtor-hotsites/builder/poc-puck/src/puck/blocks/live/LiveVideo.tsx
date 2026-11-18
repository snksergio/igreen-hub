import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { Icone, rico, useLive } from "../../../live/ui";
import { safeImg } from "../../../lib/imagens";
import { useTokens } from "../../context";
import { imagemField } from "../../fields/ImagemField";
import { safeUrl, travaPermissions } from "../../ui";
import { IMG_LIVE, iniciais } from "./comum";

type Depoimento = { texto: string; nome: string; detalhe: string };

export type LiveVideoProps = {
  etiqueta: string;
  titulo: string;
  videoPrevia: string;
  poster: string;
  videoCompleto: string;
  duracao: string;
  legendaTitulo: string;
  legendaDetalhe: string;
  depoimentos: Depoimento[];
  travado?: boolean;
};

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });

/* Vídeo na linha inteira com brilho ambiente atrás (como o do YouTube) e depoimentos embaixo. */
function View(p: LiveVideoProps) {
  const t = useTokens();
  const secao = useLive<HTMLElement>("revelar");
  const palco = useLive<HTMLDivElement>("video", [p.videoPrevia, p.videoCompleto]);
  const previa = safeUrl(p.videoPrevia);
  const poster = safeImg(p.poster);
  const completo = safeUrl(p.videoCompleto);
  return (
    <div className="lv">
      <section className="secao" ref={secao} data-lv="revelar">
        <div className="wrap">
          <div className="cabeca">
            {p.etiqueta && (
              <span className="etiqueta">
                <i />
                {p.etiqueta}
              </span>
            )}
            <h2 className="h-grande revela">{rico(t(p.titulo))}</h2>
          </div>
          <div className="video-palco revela" ref={palco} data-lv="video">
            <canvas className="video-luz" width={64} height={32} aria-hidden="true" />
            <div className="video" role={completo ? "button" : undefined} tabIndex={completo ? 0 : undefined} aria-label={completo ? `Assistir: ${p.legendaTitulo}` : undefined} data-video={completo}>
              {previa ? (
                <video key={previa} src={previa} poster={poster} muted loop playsInline preload="metadata" />
              ) : (
                poster && <img src={poster} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              )}
              {p.duracao && (
                <span className="etiqueta duracao">
                  <i />
                  {p.duracao}
                </span>
              )}
              {completo && (
                <div className="centro">
                  <span className="aro">
                    <span>
                      <Icone nome="play" style={{ width: 22, height: 22 }} />
                    </span>
                  </span>
                </div>
              )}
              <div className="legenda-v">
                <div>
                  <b>{p.legendaTitulo}</b>
                  <small>{p.legendaDetalhe}</small>
                </div>
              </div>
            </div>
          </div>
          {p.depoimentos.length > 0 && (
            <div className="depo">
              {p.depoimentos.map((d, k) => (
                <figure key={k} className="depo-cartao card revela" {...i(k)}>
                  <span className="aspas" aria-hidden="true">
                    “
                  </span>
                  <blockquote>{d.texto}</blockquote>
                  <figcaption className="quem">
                    <span className="ini" aria-hidden="true">
                      {iniciais(d.nome)}
                    </span>
                    <span className="txt">
                      <b>{d.nome}</b>
                      <small>{d.detalhe}</small>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export const LiveVideo: ComponentConfig<LiveVideoProps> = {
  label: "Vídeo Live",
  fields: {
    etiqueta: { type: "text", label: "Selo" },
    titulo: { type: "textarea", label: "Título (*verde*, _cinza_)" },
    videoPrevia: { type: "text", label: "Prévia que roda muda, em loop (.mp4 curto)" },
    poster: imagemField("Imagem antes do vídeo carregar"),
    videoCompleto: { type: "text", label: "Vídeo completo, ao clicar (.mp4; vazio = sem botão de play)" },
    duracao: { type: "text", label: "Duração do vídeo completo" },
    legendaTitulo: { type: "text", label: "Título sobre o vídeo" },
    legendaDetalhe: { type: "text", label: "Detalhe sobre o vídeo" },
    depoimentos: {
      type: "array",
      label: "Depoimentos embaixo do vídeo (até 3 por linha)",
      arrayFields: {
        texto: { type: "textarea", label: "Depoimento" },
        nome: { type: "text", label: "Nome" },
        detalhe: { type: "text", label: "Quem é (cidade, desde quando)" },
      },
      defaultItemProps: { texto: "O que a pessoa disse.", nome: "Nome", detalhe: "" },
      getItemSummary: (d) => d.nome || "Depoimento",
      max: 6,
    },
  },
  defaultProps: {
    etiqueta: "Última edição · São Paulo",
    titulo: "Direto de *quem viveu* isso",
    videoPrevia: IMG_LIVE.videoPrevia,
    poster: IMG_LIVE.plateia,
    videoCompleto: IMG_LIVE.videoCompleto,
    duracao: "2:00",
    legendaTitulo: "Como foi a última edição",
    legendaDetalhe: "iGreen Live São Paulo · 2026",
    depoimentos: [
      { texto: "Saí do evento com três indicações agendadas e entendendo de verdade como explicar a economia.", nome: "Carla M.", detalhe: "Licenciada em Contagem, MG" },
      { texto: "A conta caiu 17% no primeiro mês. Vim ao evento para entender como levar isso para a minha família.", nome: "Pedro R.", detalhe: "Cliente desde 2025" },
      { texto: "Fui como cliente e voltei licenciada. O evento mostra o caminho com exemplos de quem já está nele.", nome: "Mariana S.", detalhe: "Licenciada em Betim, MG" },
    ],
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
