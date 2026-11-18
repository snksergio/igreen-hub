import type { ComponentConfig } from "@puckeditor/core";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type QA = { pergunta: string; resposta: string };
export type PerguntasFrequentesProps = { titulo: string; itens: QA[]; fundo: Fundo; travado?: boolean };

export const PerguntasFrequentes: ComponentConfig<PerguntasFrequentesProps> = {
  label: "Perguntas frequentes",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    itens: {
      type: "array",
      label: "Perguntas (até 15)",
      max: 15,
      arrayFields: { pergunta: { type: "text", label: "Pergunta" }, resposta: { type: "textarea", label: "Resposta" } },
      defaultItemProps: { pergunta: "Nova pergunta?", resposta: "" },
      getItemSummary: (i) => i.pergunta || "Pergunta",
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Perguntas frequentes",
    itens: [
      { pergunta: "Preciso pagar para participar?", resposta: "Não. A participação é gratuita." },
      { pergunta: "Posso levar alguém?", resposta: "Sim, basta a pessoa fazer a inscrição também." },
    ],
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <div className="hs-faq">
        {(p.itens ?? []).map((q, i) => (
          <details key={i} {...r(i + 1)}>
            <summary>{q.pergunta}</summary>
            <p className="hs-pre">{q.resposta}</p>
          </details>
        ))}
      </div>
    </Section>
  ),
};
