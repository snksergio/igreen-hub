import type { ComponentConfig } from "@puckeditor/core";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type Item = { titulo: string; texto: string };
export type ItensNumeradosProps = { titulo: string; itens: Item[]; fundo: Fundo; travado?: boolean };

export const ItensNumerados: ComponentConfig<ItensNumeradosProps> = {
  label: "Itens numerados",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    itens: {
      type: "array",
      label: "Itens (até 6)",
      max: 6,
      arrayFields: { titulo: { type: "text", label: "Título" }, texto: { type: "textarea", label: "Texto" } },
      defaultItemProps: { titulo: "Novo item", texto: "" },
      getItemSummary: (i) => i.titulo || "Item",
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Como funciona",
    itens: [
      { titulo: "Primeiro passo", texto: "Explique em uma frase." },
      { titulo: "Segundo passo", texto: "Explique em uma frase." },
      { titulo: "Terceiro passo", texto: "Explique em uma frase." },
    ],
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <ol className="hs-steps">
        {(p.itens ?? []).map((it, i) => (
          <li key={i} className="hs-step" {...r(i + 1)}>
            <span className="hs-step__n">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="hs-h3">{it.titulo}</h3>
              {it.texto && <p>{it.texto}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  ),
};
