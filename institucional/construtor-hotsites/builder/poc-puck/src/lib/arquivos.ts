import { slugify } from "./slug";

/** Arquivo enviado para uma Seção livre. No código, é usado como "arquivo:NOME". */
export type Arquivo = { nome: string; src: string };

/** Troca cada arquivo:NOME (no HTML ou no CSS) pelo arquivo de verdade. Nome desconhecido fica como está. */
export function resolverArquivos(texto: string, arquivos: Arquivo[] | undefined): string {
  if (!texto || !arquivos?.length) return texto ?? "";
  const mapa = new Map(arquivos.map((a) => [a.nome, a.src]));
  return texto.replace(/arquivo:([A-Za-z0-9._-]+)/g, (inteiro, nome: string) => mapa.get(nome) ?? inteiro);
}

/** "Foto do Palco.PNG" → "foto-do-palco.webp", sem repetir um nome que já existe na seção. */
export function nomeDeArquivo(original: string, extensao: string, existentes: string[]): string {
  const base = slugify(original.replace(/\.[^.]+$/, "")) || "arquivo";
  let nome = `${base}.${extensao}`;
  for (let n = 2; existentes.includes(nome); n++) nome = `${base}-${n}.${extensao}`;
  return nome;
}
