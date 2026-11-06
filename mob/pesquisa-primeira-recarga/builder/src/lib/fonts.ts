import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";

/**
 * Outfit é a fonte principal da marca e carrega o deck inteiro — display e
 * texto. É mais larga que a Inter Tight que estava aqui antes, então os
 * tamanhos de título foram reconferidos página a página depois da troca.
 */
const outfit = loadOutfit("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
}).fontFamily;

export const display = outfit;
export const text = outfit;
