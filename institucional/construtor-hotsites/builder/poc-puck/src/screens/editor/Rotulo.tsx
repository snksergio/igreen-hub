import { FieldLabel } from "@puckeditor/core";
import type { ComponentProps } from "react";
import { Ajuda, separarRotulo } from "../../ui/Ajuda";

/** Rótulo de todos os campos do Puck: o que estava entre parênteses vira o ícone de ajuda. */
export function RotuloDoCampo({ label, endIcon, ...resto }: ComponentProps<typeof FieldLabel>) {
  const { titulo, ajuda } = separarRotulo(label);
  return (
    <FieldLabel
      {...resto}
      label={titulo}
      endIcon={
        ajuda || endIcon ? (
          <>
            {ajuda && <Ajuda texto={ajuda} />}
            {endIcon}
          </>
        ) : undefined
      }
    />
  );
}
