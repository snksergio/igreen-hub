import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { Icone, rico, Seta, useHref, useLive } from "../../../live/ui";
import { useTokens } from "../../context";
import { travaPermissions } from "../../ui";

type Pergunta = { pergunta: string; resposta: string };

export type LivePerguntasProps = {
  etiqueta: string;
  titulo: string;
  texto: string;
  ajudaTitulo: string;
  ajudaTexto: string;
  botaoWhatsTexto: string;
  mensagemWhats: string;
  itens: Pergunta[];
  travado?: boolean;
};

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });

function View(p: LivePerguntasProps) {
  const t = useTokens();
  const href = useHref();
  const ref = useLive<HTMLElement>("revelar");
  return (
    <div className="lv">
      <section className="secao" id="perguntas" ref={ref} data-lv="revelar">
        <div className="wrap faq">
          <div className="faq-esq">
            {p.etiqueta && (
              <span className="etiqueta">
                <i />
                {p.etiqueta}
              </span>
            )}
            <h2 className="h-grande revela">{rico(t(p.titulo))}</h2>
            {p.texto && (
              <p className="lead revela" {...i(1)}>
                {p.texto}
              </p>
            )}
            {(p.ajudaTitulo || p.botaoWhatsTexto) && (
              <div className="ajuda revela" {...i(2)}>
                {p.ajudaTitulo && <b>{p.ajudaTitulo}</b>}
                {p.ajudaTexto && <p>{p.ajudaTexto}</p>}
                {p.botaoWhatsTexto && (
                  <a className="btn btn-whats" {...href({ destino: "whatsapp", link: "", mensagemWhats: p.mensagemWhats })}>
                    <Icone nome="whats" className="" />
                    {p.botaoWhatsTexto} <Seta />
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="faq-lista revela" {...i(1)}>
            {p.itens.map((q, k) => (
              <details key={k} open={k === 0}>
                <summary>
                  {q.pergunta}
                  <span className="mais">
                    <Icone nome="mais" />
                  </span>
                </summary>
                <p>{q.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export const LivePerguntas: ComponentConfig<LivePerguntasProps> = {
  label: "Perguntas Live",
  fields: {
    etiqueta: { type: "text", label: "Selo" },
    titulo: { type: "textarea", label: "Título (*verde*, _cinza_)" },
    texto: { type: "textarea", label: "Texto de apoio" },
    ajudaTitulo: { type: "text", label: "Bloco de ajuda: título" },
    ajudaTexto: { type: "textarea", label: "Bloco de ajuda: texto" },
    botaoWhatsTexto: { type: "text", label: "Botão do WhatsApp (do licenciado, se vier no link)" },
    mensagemWhats: { type: "text", label: "Mensagem que já abre no WhatsApp" },
    itens: {
      type: "array",
      label: "Perguntas (a primeira já vem aberta)",
      arrayFields: {
        pergunta: { type: "text", label: "Pergunta" },
        resposta: { type: "textarea", label: "Resposta" },
      },
      defaultItemProps: { pergunta: "Pergunta?", resposta: "Resposta." },
      getItemSummary: (q) => q.pergunta || "Pergunta",
      max: 12,
    },
  },
  defaultProps: {
    etiqueta: "Antes de ir",
    titulo: "Perguntas de quem vai _pela primeira vez_",
    texto: "Inscrição, acompanhante, horário e o que levar: o essencial para chegar tranquilo no dia.",
    ajudaTitulo: "Ainda com dúvida?",
    ajudaTexto: "Fale com a equipe do evento pelo WhatsApp. A gente responde no mesmo dia.",
    botaoWhatsTexto: "Falar no WhatsApp",
    mensagemWhats: "Olá! Tenho uma dúvida sobre o iGreen Live BH.",
    itens: [
      { pergunta: "O evento é gratuito?", resposta: "Sim. A vaga é gratuita, mas limitada: confirme pelo formulário e guarde a mensagem que chega no WhatsApp." },
      { pergunta: "Preciso ser licenciado para participar?", resposta: "Não. Clientes e curiosos são bem-vindos. Quem é licenciado pode levar convidados pelo link próprio." },
      { pergunta: "Posso levar acompanhante?", resposta: "Pode. Cada pessoa precisa de uma inscrição, para garantirmos lugar para todos." },
      { pergunta: "Vai ter transmissão ao vivo?", resposta: "Os principais momentos ficam disponíveis no app depois do evento. A experiência completa é presencial." },
    ],
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
