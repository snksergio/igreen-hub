import type { ComponentConfig } from "@puckeditor/core";
import { imagemField } from "../fields/ImagemField";
import { Avatar, fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type Pessoa = { fotoUrl: string; nome: string; papel: string };
export type PessoasProps = { titulo: string; pessoas: Pessoa[]; fundo: Fundo; travado?: boolean };

export const Pessoas: ComponentConfig<PessoasProps> = {
  label: "Pessoas (palestrantes, rede)",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    pessoas: {
      type: "array",
      label: "Pessoas (até 12)",
      max: 12,
      arrayFields: {
        fotoUrl: imagemField("Foto"),
        nome: { type: "text", label: "Nome" },
        papel: { type: "text", label: "Papel (ex.: Palestrante)" },
      },
      defaultItemProps: { fotoUrl: "", nome: "Nome", papel: "" },
      getItemSummary: (i) => i.nome || "Pessoa",
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Quem vai estar lá",
    pessoas: [
      { fotoUrl: "", nome: "Nome Sobrenome", papel: "Palestrante" },
      { fotoUrl: "", nome: "Nome Sobrenome", papel: "Palestrante" },
    ],
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <ul className="hs-people">
        {(p.pessoas ?? []).map((x, i) => (
          <li key={i} className="hs-person" {...r(i + 1, "zoom")}>
            <Avatar src={x.fotoUrl} nome={x.nome} />
            <strong>{x.nome}</strong>
            {x.papel && <span className="hs-muted">{x.papel}</span>}
          </li>
        ))}
      </ul>
    </Section>
  ),
};
