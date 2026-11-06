import React from "react";
import { Img, staticFile } from "remotion";

/**
 * Os renders 3D da marca, servidos de `public/assets/`. São PNGs quadrados de
 * 1254 px com fundo transparente, então `width` sozinho já define o tamanho.
 *
 * `<Img>` bloqueia o render até a imagem carregar — é o que impede um frame
 * sair sem o asset durante o render final.
 */
export type AssetName =
  | "Carro"
  | "carro2"
  | "carro3"
  | "carro4"
  | "carro5"
  | "carro6"
  | "bomba1"
  | "bomba2"
  | "bomba3"
  | "bomba4"
  | "ilustracao1"
  | "ilustracao2"
  | "ilustracao3"
  | "ilustracao4"
  | "ilustracao5"
  | "ilustracao6"
  | "ilustracao7"
  | "ilustracao8"
  | "ilustracao9";

export const Asset: React.FC<{
  name: AssetName;
  width: number;
  style?: React.CSSProperties;
}> = ({ name, width, style }) => (
  <Img
    src={staticFile(`assets/${name}.png`)}
    style={{ width, height: width, objectFit: "contain", ...style }}
  />
);

/**
 * As nove ilustrações mapeiam um para um nos nove momentos da jornada — foi
 * para isso que elas foram feitas. A ordem aqui é a ordem de M1 a M9.
 */
export const JOURNEY_ASSETS: AssetName[] = [
  "ilustracao1",
  "ilustracao2",
  "ilustracao3",
  "ilustracao4",
  "ilustracao5",
  "ilustracao6",
  "ilustracao7",
  "ilustracao8",
  "ilustracao9",
];
