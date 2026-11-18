import { uid } from "./slug";
import { readJSON, writeJSON } from "./store";

export type Imagem = { id: string; nome: string; src: string };

const KEY = "poc-hotsite:imgs";

/** Imagens dos hotsites de referência, para quem ainda não subiu nenhuma. */
export const AMOSTRAS: Imagem[] = [
  { id: "a-mobi", nome: "Eletroposto Mobi", src: "https://snksergio.github.io/igreen-hub/mob/live-lancamento/img/pre-cadastro/solto-mobi.webp" },
  { id: "a-thiago", nome: "Thiago", src: "https://snksergio.github.io/igreen-eventos-v2/speakers/thiago-cut.png" },
  { id: "a-rafael", nome: "Rafael", src: "https://snksergio.github.io/igreen-eventos-v2/speakers/rafael-cut.png" },
  { id: "a-amanda", nome: "Amanda", src: "https://snksergio.github.io/igreen-eventos-v2/speakers/amanda-cut.png" },
];

/** Só deixa passar link http(s) ou imagem embutida (data:image/png|jpeg|webp|gif). */
export function safeImg(v: string | undefined): string | undefined {
  if (!v) return undefined;
  if (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(v)) return v;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : undefined;
  } catch {
    return undefined;
  }
}

export function listImagens(): Imagem[] {
  const v = readJSON<Imagem[]>(KEY);
  return Array.isArray(v) ? v : [];
}

/** Guarda na biblioteca. Mesma imagem não entra duas vezes. Sem espaço, devolve null. */
export function addImagem(nome: string, src: string): Imagem | null {
  const atuais = listImagens();
  const existente = atuais.find((i) => i.src === src);
  if (existente) return existente;
  const nova: Imagem = { id: uid(), nome, src };
  return writeJSON(KEY, [nova, ...atuais]) ? nova : null;
}

export function removeImagem(id: string): void {
  writeJSON(
    KEY,
    listImagens().filter((i) => i.id !== id)
  );
}
