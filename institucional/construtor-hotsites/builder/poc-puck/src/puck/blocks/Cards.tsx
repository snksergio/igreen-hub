import type { ComponentConfig } from "@puckeditor/core";
import { safeImg } from "../../lib/imagens";
import { imagemField } from "../fields/ImagemField";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type Card = { imagemUrl: string; titulo: string; texto: string };
export type CardsProps = { titulo: string; itens: Card[]; fundo: Fundo; travado?: boolean };

export const Cards: ComponentConfig<CardsProps> = {
  label: "Cards (produtos, ecossistema)",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    itens: {
      type: "array",
      label: "Cards (até 8)",
      max: 8,
      arrayFields: {
        imagemUrl: imagemField("Imagem"),
        titulo: { type: "text", label: "Título" },
        texto: { type: "textarea", label: "Texto" },
      },
      defaultItemProps: { imagemUrl: "", titulo: "Novo card", texto: "" },
      getItemSummary: (i) => i.titulo || "Card",
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Conheça",
    itens: [
      { imagemUrl: "", titulo: "Produto 1", texto: "Uma linha sobre ele." },
      { imagemUrl: "", titulo: "Produto 2", texto: "Uma linha sobre ele." },
      { imagemUrl: "", titulo: "Produto 3", texto: "Uma linha sobre ele." },
    ],
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <div className="hs-grid">
        {(p.itens ?? []).map((c, i) => {
          const img = safeImg(c.imagemUrl);
          return (
            <article key={i} className="hs-card" {...r(i + 1)}>
              {img ? <img src={img} alt={c.titulo} className="hs-card__img" loading="lazy" decoding="async" /> : <div className="hs-card__img hs-ph">Imagem</div>}
              <h3 className="hs-h3">{c.titulo}</h3>
              {c.texto && <p>{c.texto}</p>}
            </article>
          );
        })}
      </div>
    </Section>
  ),
};
