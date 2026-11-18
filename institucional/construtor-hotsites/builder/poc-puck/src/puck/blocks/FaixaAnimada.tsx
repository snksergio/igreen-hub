import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { fundoField, Section, travaPermissions, type Fundo } from "../ui";

/** Seção feita só para dar movimento: frases curtas correndo pela tela. */
export type FaixaAnimadaProps = { frases: string; velocidade: "lenta" | "normal" | "rapida"; fundo: Fundo; travado?: boolean };

const SEGUNDOS = { lenta: 60, normal: 35, rapida: 20 };

export const FaixaAnimada: ComponentConfig<FaixaAnimadaProps> = {
  label: "Faixa em movimento",
  fields: {
    frases: { type: "textarea", label: "Frases (uma por linha)" },
    velocidade: {
      type: "radio",
      label: "Velocidade",
      options: [
        { label: "Lenta", value: "lenta" },
        { label: "Normal", value: "normal" },
        { label: "Rápida", value: "rapida" },
      ],
    },
    fundo: fundoField,
  },
  defaultProps: {
    frases: "Energia\nTelecom\nSeguros\nMobilidade elétrica\nRenda recorrente",
    velocidade: "normal",
    fundo: "escuro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => {
    const frases = (p.frases ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const lista = frases.length ? frases : ["Escreva uma frase por linha"];
    return (
      <Section fundo={p.fundo} travado={p.travado} className="hs-band-sec">
        <div className="hs-marquee hs-band" style={{ "--dur": `${SEGUNDOS[p.velocidade] ?? 35}s` } as CSSProperties}>
          <div className="hs-marquee__track">
            {[...lista, ...lista].map((f, i) => (
              <span key={i} className="hs-band__item" aria-hidden={i >= lista.length}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </Section>
    );
  },
};
