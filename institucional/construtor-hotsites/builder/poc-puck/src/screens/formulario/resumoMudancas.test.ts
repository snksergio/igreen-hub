import { beforeEach, describe, expect, it } from "vitest";
import { criarFormulario, novoCampo, type Formulario } from "../../lib/formularios";
import { _limparMemoria } from "../../lib/store";
import { resumoDasMudancas } from "./Passos";

/* O resumo do "Concluir formulário": o que mudou desde que a tela foi aberta. */

beforeEach(() => {
  localStorage.clear();
  _limparMemoria();
});

function base(): Formulario {
  const f = criarFormulario("simples");
  f.campos = [
    novoCampo("texto", { id: "nome", rotulo: "Nome completo", naPagina: true }),
    novoCampo("whats", { id: "whats", rotulo: "WhatsApp", naPagina: true }),
    novoCampo("cidade", { id: "cidade", rotulo: "Cidade" }),
  ];
  return f;
}
const copia = (f: Formulario): Formulario => JSON.parse(JSON.stringify(f));

describe("resumo do que mudou", () => {
  it("sem mudança, lista vazia", () => {
    const f = base();
    expect(resumoDasMudancas(f, copia(f))).toEqual([]);
  });

  it("pergunta nova, tirada e editada aparecem com o nome", () => {
    const antes = base();
    const agora = copia(antes);
    agora.campos = agora.campos.filter((c) => c.id !== "cidade");
    agora.campos[0].rotulo = "Seu nome";
    agora.campos.push(novoCampo("cpf", { id: "cpf", rotulo: "CPF" }));
    expect(resumoDasMudancas(antes, agora)).toEqual(["Pergunta nova: CPF", "Pergunta tirada: Cidade", "Pergunta editada: Seu nome"]);
  });

  it("mostrar ou esconder na página não conta como editar", () => {
    const antes = base();
    const agora = copia(antes);
    agora.campos[0].naPagina = false;
    agora.campos[2].naPagina = true;
    expect(resumoDasMudancas(antes, agora)).toEqual(["Passou a aparecer na página: Cidade", "Saiu da página: Nome completo"]);
  });

  it("ordem e textos do formulário", () => {
    const antes = base();
    const agora = copia(antes);
    agora.campos.reverse();
    agora.botaoPagina = "Quero ir";
    expect(resumoDasMudancas(antes, agora)).toEqual(["A ordem das perguntas mudou", "Regras e textos do formulário (botões, vagas, prazos ou estilo)"]);
  });
});
