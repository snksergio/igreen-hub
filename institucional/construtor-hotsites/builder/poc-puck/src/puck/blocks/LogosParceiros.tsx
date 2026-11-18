import type { ComponentConfig } from "@puckeditor/core";
import { safeImg } from "../../lib/imagens";
import { imagemField } from "../fields/ImagemField";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

type Logo = { imagemUrl: string; nome: string };
export type LogosParceirosProps = {
  titulo: string;
  logos: Logo[];
  exibicao: "grade" | "faixa";
  fundo: Fundo;
  travado?: boolean;
};

function Item({ logo }: { logo: Logo }) {
  const img = safeImg(logo.imagemUrl);
  return img ? <img className="hs-parceiro__img" src={img} alt={logo.nome} loading="lazy" decoding="async" /> : <span className="hs-parceiro__txt">{logo.nome}</span>;
}

export const LogosParceiros: ComponentConfig<LogosParceirosProps> = {
  label: "Logos de parceiros",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    logos: {
      type: "array",
      label: "Logos (até 16)",
      max: 16,
      arrayFields: { imagemUrl: imagemField("Logo"), nome: { type: "text", label: "Nome do parceiro" } },
      defaultItemProps: { imagemUrl: "", nome: "Parceiro" },
      getItemSummary: (l) => l.nome || "Logo",
    },
    exibicao: {
      type: "radio",
      label: "Como mostrar",
      options: [
        { label: "Grade parada", value: "grade" },
        { label: "Faixa em movimento", value: "faixa" },
      ],
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Parceiros que acompanham o cliente",
    logos: [{ imagemUrl: "", nome: "Parceiro 1" }, { imagemUrl: "", nome: "Parceiro 2" }, { imagemUrl: "", nome: "Parceiro 3" }, { imagemUrl: "", nome: "Parceiro 4" }],
    exibicao: "grade",
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => {
    const logos = p.logos ?? [];
    return (
      <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
        {p.exibicao === "faixa" ? (
          <div className="hs-marquee" {...r(1, "fade")}>
            {/* A lista aparece duas vezes para a faixa emendar sem buraco. */}
            <div className="hs-marquee__track">
              {[...logos, ...logos].map((l, i) => (
                <span key={i} className="hs-parceiro" aria-hidden={i >= logos.length}>
                  <Item logo={l} />
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="hs-parceiros">
            {logos.map((l, i) => (
              <span key={i} className="hs-parceiro" {...r(i + 1, "fade")}>
                <Item logo={l} />
              </span>
            ))}
          </div>
        )}
      </Section>
    );
  },
};
