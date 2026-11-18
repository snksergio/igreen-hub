import type { ComponentConfig } from "@puckeditor/core";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type Item = { data: string; hora: string; local: string; descricao: string };
export type AgendaProps = { titulo: string; itens: Item[]; fundo: Fundo; travado?: boolean };

export const Agenda: ComponentConfig<AgendaProps> = {
  label: "Agenda (programação ou cidades)",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    itens: {
      type: "array",
      label: "Itens (até 12)",
      max: 12,
      arrayFields: {
        data: { type: "text", label: "Data (ex.: 20/10)" },
        hora: { type: "text", label: "Hora" },
        local: { type: "text", label: "Local ou cidade" },
        descricao: { type: "text", label: "O que acontece" },
      },
      defaultItemProps: { data: "", hora: "", local: "", descricao: "Atividade" },
      getItemSummary: (i) => [i.data, i.hora, i.descricao].filter(Boolean).join(" · ") || "Item",
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Programação",
    itens: [
      { data: "", hora: "19h00", local: "", descricao: "Recepção" },
      { data: "", hora: "19h30", local: "", descricao: "Apresentação" },
    ],
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <ul className="hs-agenda">
        {(p.itens ?? []).map((a, i) => (
          <li key={i} {...r(i + 1, "left")}>
            <span className="hs-agenda__when">{[a.data, a.hora].filter(Boolean).join(" · ")}</span>
            <span>
              <strong>{a.descricao}</strong>
              {a.local && <span className="hs-muted"> — {a.local}</span>}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  ),
};
