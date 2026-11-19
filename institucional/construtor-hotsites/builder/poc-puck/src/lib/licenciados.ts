import { todosOsLinks } from "./links";

/* Lista de licenciados para a busca ao gerar um link (2.5). Na POC é uma lista fictícia; no
   projeto real vem do cadastro de licenciados da iGreen. Quem já ganhou link em alguma página
   entra na busca também. */

export type Licenciado = { ref: string; nome: string; cidade: string; whats?: string };

export const LICENCIADOS: Licenciado[] = [
  { ref: "LIC123", nome: "Thiago Souza", cidade: "Belo Horizonte · MG", whats: "5531990001123" },
  { ref: "LIC204", nome: "Ana Ribeiro", cidade: "Contagem · MG", whats: "5531990001204" },
  { ref: "LIC318", nome: "Carlos Mendes", cidade: "Betim · MG", whats: "5531990001318" },
  { ref: "LIC427", nome: "Juliana Prado", cidade: "Nova Lima · MG", whats: "5531990001427" },
  { ref: "LIC512", nome: "Pedro Almeida", cidade: "Belo Horizonte · MG", whats: "5531990001512" },
  { ref: "LIC633", nome: "Fernanda Lopes", cidade: "Sete Lagoas · MG", whats: "5531990001633" },
  { ref: "LIC705", nome: "Rafael Costa", cidade: "Uberlândia · MG", whats: "5534990001705" },
  { ref: "LIC718", nome: "Camila Andrade", cidade: "Juiz de Fora · MG", whats: "5532990001718" },
  { ref: "LIC742", nome: "Lucas Ferreira", cidade: "Goiânia · GO", whats: "5562990001742" },
  { ref: "LIC756", nome: "Mariana Teixeira", cidade: "Brasília · DF", whats: "5561990001756" },
  { ref: "LIC781", nome: "Bruno Cardoso", cidade: "São Paulo · SP", whats: "5511990001781" },
  { ref: "LIC803", nome: "Patrícia Gomes", cidade: "Campinas · SP", whats: "5519990001803" },
  { ref: "LIC827", nome: "Diego Martins", cidade: "Rio de Janeiro · RJ", whats: "5521990001827" },
  { ref: "LIC849", nome: "Aline Barbosa", cidade: "Vitória · ES", whats: "5527990001849" },
  { ref: "LIC866", nome: "Thiago Nogueira", cidade: "Ipatinga · MG", whats: "5531990001866" },
  { ref: "LIC890", nome: "Ana Paula Dias", cidade: "Montes Claros · MG", whats: "5538990001890" },
];

const simples = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Busca por nome, código ou cidade, sem ligar para acento e maiúscula. Quem começa com o termo vem
 * antes de quem só o contém. Sem termo, vêm todos, em ordem de nome (a lista abre ao clicar no campo).
 */
export function buscarLicenciados(termo: string, limite = Infinity): Licenciado[] {
  const t = simples(termo.trim());
  const todos = new Map(LICENCIADOS.map((l) => [l.ref, l]));
  for (const l of todosOsLinks()) if (!todos.has(l.ref)) todos.set(l.ref, { ref: l.ref, nome: l.nome, cidade: l.cidade ?? "", whats: l.whats });
  const comeca = (l: Licenciado) => (simples(l.nome).startsWith(t) || simples(l.ref).startsWith(t) ? 0 : 1);
  return [...todos.values()]
    .filter((l) => simples(`${l.nome} ${l.ref} ${l.cidade}`).includes(t))
    .sort((a, b) => comeca(a) - comeca(b) || a.nome.localeCompare(b.nome, "pt-BR"))
    .slice(0, limite);
}
