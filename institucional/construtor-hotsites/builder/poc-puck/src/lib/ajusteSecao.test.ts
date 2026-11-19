import { beforeEach, describe, expect, it } from "vitest";
import { camposNaPagina, criarFormulario, etapasDoModal, novoCampo, type Formulario } from "./formularios";
import { _limparMemoria } from "./store";

/* Ajuste da seção (bloco de inscrição): esconder ou trazer campos só naquela seção. */

beforeEach(() => {
  localStorage.clear();
  _limparMemoria();
});

function formulario(): Formulario {
  const f = criarFormulario("simples");
  f.campos = [
    novoCampo("texto", { id: "nome", naPagina: true }),
    novoCampo("whats", { id: "whats", naPagina: true }),
    novoCampo("email", { id: "email", naPagina: true }),
    novoCampo("unica", { id: "lic", opcoes: ["Sim", "Não"] }),
    novoCampo("texto", { id: "cod", naPagina: true, condicao: { campo: "lic", valor: "Sim" } }),
    novoCampo("oculto", { id: "ref", fonte: "ref", naPagina: true }),
  ];
  return f;
}
const ids = (cs: { id: string }[]) => cs.map((c) => c.id);

describe("ajuste da seção", () => {
  it("sem ajuste, vale o que o formulário define", () => {
    const f = formulario();
    expect(ids(camposNaPagina(f))).toEqual(["nome", "whats", "email"]);
    expect(ids(camposNaPagina(f, {}))).toEqual(["nome", "whats", "email"]);
  });

  it("campo desmarcado na seção some da página e vai para a janela, sem sair do formulário", () => {
    const f = formulario();
    const ajuste = { nome: false };
    expect(ids(camposNaPagina(f, ajuste))).toEqual(["whats", "email"]);
    expect(ids(etapasDoModal(f, false, ajuste)[0].campos)).toEqual(["nome", "lic", "cod", "ref"]);
    // O formulário em si não muda.
    expect(f.campos[0].naPagina).toBe(true);
  });

  it("campo trazido na seção aparece na página, e o que depende dele vem junto", () => {
    const f = formulario();
    expect(ids(camposNaPagina(f, { lic: true }))).toEqual(["nome", "whats", "email", "lic", "cod"]);
    // Na janela só sobraria o campo oculto: nenhuma etapa para perguntar.
    expect(etapasDoModal(f, false, { lic: true })).toEqual([]);
  });

  it("campo oculto nunca vai para a página, mesmo marcado no ajuste", () => {
    const f = formulario();
    expect(ids(camposNaPagina(f, { ref: true }))).toEqual(["nome", "whats", "email"]);
  });

  it("id de outro formulário no ajuste é ignorado", () => {
    const f = formulario();
    expect(ids(camposNaPagina(f, { naoExiste: true, outro: false }))).toEqual(["nome", "whats", "email"]);
  });

  it("modal direto (completo) mostra tudo, com ou sem ajuste", () => {
    const f = formulario();
    expect(ids(etapasDoModal(f, true, { nome: false })[0].campos)).toEqual(["nome", "whats", "email", "lic", "cod", "ref"]);
  });
});
