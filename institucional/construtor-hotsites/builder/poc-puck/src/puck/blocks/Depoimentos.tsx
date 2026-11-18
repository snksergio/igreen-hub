import type { ComponentConfig } from "@puckeditor/core";
import { imagemField } from "../fields/ImagemField";
import { Avatar, fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type Depoimento = { texto: string; nome: string; papel: string; fotoUrl: string };
export type DepoimentosProps = { titulo: string; itens: Depoimento[]; fundo: Fundo; travado?: boolean };

export const Depoimentos: ComponentConfig<DepoimentosProps> = {
  label: "Depoimentos",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    itens: {
      type: "array",
      label: "Depoimentos (até 6)",
      max: 6,
      arrayFields: {
        texto: { type: "textarea", label: "O que a pessoa disse" },
        nome: { type: "text", label: "Nome" },
        papel: { type: "text", label: "Quem é (ex.: Licenciada em Recife)" },
        fotoUrl: imagemField("Foto"),
      },
      defaultItemProps: { texto: "", nome: "Nome", papel: "", fotoUrl: "" },
      getItemSummary: (i) => i.nome || "Depoimento",
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Direto de quem viveu isso",
    itens: [
      { texto: "Saí do evento sabendo exatamente o próximo passo.", nome: "Nome Sobrenome", papel: "Participante", fotoUrl: "" },
      { texto: "Conheci pessoas que hoje fazem parte da minha rede.", nome: "Nome Sobrenome", papel: "Participante", fotoUrl: "" },
    ],
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <div className="hs-quotes">
        {(p.itens ?? []).map((d, i) => (
          <figure key={i} className="hs-quote" {...r(i + 1)}>
            <blockquote>“{d.texto}”</blockquote>
            <figcaption>
              <Avatar src={d.fotoUrl} nome={d.nome} />
              <span>
                <strong>{d.nome}</strong>
                {d.papel && <span className="hs-muted">{d.papel}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  ),
};
