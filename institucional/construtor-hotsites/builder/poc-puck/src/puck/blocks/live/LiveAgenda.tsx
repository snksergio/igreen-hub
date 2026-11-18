import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { BotaoLima, listaDeTexto, useLive } from "../../../live/ui";
import { safeImg } from "../../../lib/imagens";
import { useTokens } from "../../context";
import { imagemField } from "../../fields/ImagemField";
import { ctaFields, travaPermissions, type CtaProps } from "../../ui";
import { IMG_LIVE } from "./comum";

type Item = { hora: string; titulo: string; texto: string; tags: string; imagemUrl: string };

export type LiveAgendaProps = CtaProps & {
  etiqueta: string;
  titulo: string;
  texto: string;
  itens: Item[];
  travado?: boolean;
};

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });

function View(p: LiveAgendaProps) {
  const t = useTokens();
  const ref = useLive<HTMLElement>("revelar");
  return (
    <div className="lv">
      <section className="secao" id="programacao" ref={ref} data-lv="revelar">
        <div className="wrap prog">
          <div className="prog-esq">
            {p.etiqueta && (
              <span className="etiqueta">
                <i />
                {p.etiqueta}
              </span>
            )}
            <h2 className="h-grande revela">{t(p.titulo)}</h2>
            {p.texto && (
              <p className="lead revela" {...i(1)}>
                {p.texto}
              </p>
            )}
            {p.botaoTexto && (
              <div className="revela" {...i(2)}>
                <BotaoLima {...p} />
              </div>
            )}
          </div>
          <ol className="prog-lista">
            {p.itens.map((it, k) => {
              const img = safeImg(it.imagemUrl);
              return (
                <li key={k} className={`prog-item ${k === 0 ? "ativo " : ""}revela`} {...i(k)}>
                  <time>{it.hora}</time>
                  <div>
                    <h3>{it.titulo}</h3>
                    {it.texto && <p>{it.texto}</p>}
                    {listaDeTexto(it.tags).length > 0 && (
                      <div className="tags">
                        {listaDeTexto(it.tags).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {img ? (
                    <div className="prog-foto">
                      <img src={img} alt="" loading="lazy" />
                    </div>
                  ) : (
                    <span />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}

export const LiveAgenda: ComponentConfig<LiveAgendaProps> = {
  label: "Programação Live",
  fields: {
    etiqueta: { type: "text", label: "Selo" },
    titulo: { type: "text", label: "Título" },
    texto: { type: "textarea", label: "Texto de apoio" },
    ...ctaFields,
    itens: {
      type: "array",
      label: "Momentos da noite (o primeiro fica em destaque)",
      arrayFields: {
        hora: { type: "text", label: "Hora (19h00)" },
        titulo: { type: "text", label: "Título" },
        texto: { type: "textarea", label: "Texto" },
        tags: { type: "text", label: "Etiquetas, separadas por vírgula" },
        imagemUrl: imagemField("Foto do momento (horizontal)"),
      },
      defaultItemProps: { hora: "20h00", titulo: "Momento", texto: "", tags: "", imagemUrl: "" },
      getItemSummary: (it) => `${it.hora} ${it.titulo}`,
      max: 10,
    },
  },
  defaultProps: {
    etiqueta: "12 de dezembro · 19h",
    titulo: "Programação da noite",
    texto: "Três horas, do credenciamento à conversa livre. Chegue cedo: as melhores conversas começam antes do palco.",
    botaoTexto: "Quero participar",
    destino: "inscricao",
    link: "",
    mensagemWhats: "",
    itens: [
      { hora: "19h00", titulo: "Credenciamento e boas-vindas", texto: "Retire seu crachá, conheça o espaço e as soluções em exposição.", tags: "Recepção, Exposição", imagemUrl: IMG_LIVE.plateia },
      { hora: "19h30", titulo: "Abertura com Thiago", texto: "Onde a iGreen está, para onde vai e o que muda para quem está na rede.", tags: "Palco principal", imagemUrl: IMG_LIVE.palco },
      { hora: "20h15", titulo: "Quem já economiza", texto: "Clientes e licenciados contam números reais, sem filtro.", tags: "Painel, Histórias", imagemUrl: IMG_LIVE.painel },
      { hora: "21h00", titulo: "Conversa livre e sorteios", texto: "Perguntas abertas, brindes e networking até o fim da noite.", tags: "Networking, Sorteios", imagemUrl: IMG_LIVE.festa },
    ],
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
