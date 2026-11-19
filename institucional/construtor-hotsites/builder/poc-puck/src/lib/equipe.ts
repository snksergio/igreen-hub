/* Quem pode cuidar de uma página (responsáveis). Na POC é uma lista fictícia; no projeto real vem
   das pessoas com acesso ao construtor. Quem já é responsável por alguma página entra também. */

export type Pessoa = { nome: string; area: string };

export const EQUIPE: Pessoa[] = [
  { nome: "Ana Martins", area: "Eventos" },
  { nome: "Bruno Lima", area: "Marketing" },
  { nome: "Carla Souza", area: "Eventos" },
  { nome: "Daniel Rocha", area: "Comercial" },
  { nome: "Elisa Moraes", area: "Comunicação" },
  { nome: "Felipe Duarte", area: "Expansão" },
  { nome: "Gabriela Pinto", area: "Marketing" },
  { nome: "Henrique Alves", area: "Eventos" },
  { nome: "Isabela Cunha", area: "Atendimento" },
  { nome: "João Pedro Reis", area: "Comercial" },
  { nome: "Larissa Freitas", area: "Comunicação" },
  { nome: "Marcelo Tavares", area: "Expansão" },
];

const simples = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** A equipe mais quem já cuida de alguma página, filtrada pelo que foi digitado (sem termo, todos). */
export function buscarPessoas(termo: string, conhecidos: string[]): Pessoa[] {
  const t = simples(termo.trim());
  const todos = new Map(EQUIPE.map((p) => [simples(p.nome), p]));
  for (const n of conhecidos) if (!todos.has(simples(n))) todos.set(simples(n), { nome: n, area: "Já cuida de outra página" });
  return [...todos.values()].filter((p) => !t || simples(`${p.nome} ${p.area}`).includes(t)).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}
