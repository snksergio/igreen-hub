import type { ComponentConfig } from "@puckeditor/core";
import { safeImg } from "../../lib/imagens";
import { imagemField } from "../fields/ImagemField";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type Foto = { imagemUrl: string; legenda: string };
export type GaleriaProps = { titulo: string; fotos: Foto[]; fundo: Fundo; travado?: boolean };

export const Galeria: ComponentConfig<GaleriaProps> = {
  label: "Galeria",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    fotos: {
      type: "array",
      label: "Fotos (até 12)",
      max: 12,
      arrayFields: { imagemUrl: imagemField("Foto"), legenda: { type: "text", label: "Legenda (opcional)" } },
      defaultItemProps: { imagemUrl: "", legenda: "" },
      getItemSummary: (f, i) => f.legenda || `Foto ${(i ?? 0) + 1}`,
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Edições que marcaram história",
    fotos: [
      { imagemUrl: "", legenda: "Primeira edição" },
      { imagemUrl: "", legenda: "Turma prática" },
      { imagemUrl: "", legenda: "Edição arena" },
    ],
    fundo: "escuro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <div className="hs-gallery">
        {(p.fotos ?? []).map((f, i) => {
          const img = safeImg(f.imagemUrl);
          return (
            <figure key={i} {...r(i + 1, "zoom")}>
              {img ? <img src={img} alt={f.legenda || `Foto ${i + 1}`} loading="lazy" decoding="async" /> : <div className="hs-ph">Foto</div>}
              {f.legenda && <figcaption>{f.legenda}</figcaption>}
            </figure>
          );
        })}
      </div>
    </Section>
  ),
};
