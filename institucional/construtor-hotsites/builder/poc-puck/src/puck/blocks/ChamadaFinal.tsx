import type { ComponentConfig } from "@puckeditor/core";
import { useTokens } from "../context";
import { Cta, ctaFields, fundoField, r, Section, travaPermissions, type CtaProps, type Fundo } from "../ui";

export type ChamadaFinalProps = CtaProps & { titulo: string; texto: string; fundo: Fundo; travado?: boolean };

function View(p: ChamadaFinalProps) {
  const t = useTokens();
  return (
    <Section fundo={p.fundo} travado={p.travado} className="hs-end">
      <h2 className="hs-h2" {...r(0)}>
        {t(p.titulo)}
      </h2>
      {p.texto && (
        <p className="hs-lead" {...r(1)}>
          {t(p.texto)}
        </p>
      )}
      <div {...r(2, "zoom")}>
        <Cta {...p} />
      </div>
    </Section>
  );
}

export const ChamadaFinal: ComponentConfig<ChamadaFinalProps> = {
  label: "Chamada final",
  fields: {
    titulo: { type: "text", label: "Título (aceita {nome} e {cidade})" },
    texto: { type: "textarea", label: "Texto" },
    ...ctaFields,
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Te esperamos lá.",
    texto: "",
    botaoTexto: "Garantir minha vaga",
    destino: "inscricao",
    link: "",
    mensagemWhats: "",
    fundo: "escuro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
