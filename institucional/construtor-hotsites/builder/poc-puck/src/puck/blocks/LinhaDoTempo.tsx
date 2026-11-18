import type { ComponentConfig } from "@puckeditor/core";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type Marco = { quando: string; titulo: string; texto: string };
export type LinhaDoTempoProps = { titulo: string; marcos: Marco[]; fundo: Fundo; travado?: boolean };

export const LinhaDoTempo: ComponentConfig<LinhaDoTempoProps> = {
  label: "Linha do tempo",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    marcos: {
      type: "array",
      label: "Marcos (até 10)",
      max: 10,
      arrayFields: {
        quando: { type: "text", label: "Quando (ex.: 2021)" },
        titulo: { type: "text", label: "O que aconteceu" },
        texto: { type: "textarea", label: "Detalhe (opcional)" },
      },
      defaultItemProps: { quando: "", titulo: "Novo marco", texto: "" },
      getItemSummary: (m) => [m.quando, m.titulo].filter(Boolean).join(" · ") || "Marco",
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Uma jornada em constante evolução",
    marcos: [
      { quando: "Ano 1", titulo: "O começo", texto: "" },
      { quando: "Ano 2", titulo: "A primeira expansão", texto: "" },
      { quando: "Hoje", titulo: "Onde estamos", texto: "" },
    ],
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <ol className="hs-timeline">
        {(p.marcos ?? []).map((m, i) => (
          <li key={i} {...r(i + 1, "left")}>
            <span className="hs-timeline__q">{m.quando}</span>
            <strong>{m.titulo}</strong>
            {m.texto && <p>{m.texto}</p>}
          </li>
        ))}
      </ol>
    </Section>
  ),
};
