import type { ComponentConfig } from "@puckeditor/core";
import { Conta, fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type Num = { valor: string; legenda: string };
export type NumerosProps = { titulo: string; itens: Num[]; fundo: Fundo; travado?: boolean };

export const Numeros: ComponentConfig<NumerosProps> = {
  label: "Números",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    itens: {
      type: "array",
      label: "Números (até 4)",
      max: 4,
      arrayFields: { valor: { type: "text", label: "Valor (ex.: +500)" }, legenda: { type: "text", label: "Legenda" } },
      defaultItemProps: { valor: "0", legenda: "Legenda" },
      getItemSummary: (i) => `${i.valor} ${i.legenda}`,
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Em números",
    itens: [
      { valor: "00", legenda: "legenda do número" },
      { valor: "00", legenda: "legenda do número" },
      { valor: "00", legenda: "legenda do número" },
    ],
    fundo: "escuro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <dl className="hs-nums">
        {(p.itens ?? []).map((n, i) => (
          <div key={i} className="hs-num" {...r(i + 1)}>
            <dt className="hs-num__v">
              <Conta texto={n.valor} />
            </dt>
            <dd>{n.legenda}</dd>
          </div>
        ))}
      </dl>
    </Section>
  ),
};
