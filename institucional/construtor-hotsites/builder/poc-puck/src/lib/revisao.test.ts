import { beforeEach, describe, expect, it } from "vitest";
import { origemDoAcesso, rotuloOrigem } from "./eventos";
import { camposNaPagina, checarRegras, criarFormulario, etapasDoModal, novoCampo, semCamposEscondidos, type Formulario } from "./formularios";
import { INGRESSO_PADRAO } from "./ingresso";
import { pagamentoAoSairDaEspera } from "./inscrever";
import { _limparMemoria } from "./store";
import { listSubmissions, type Submission } from "./submissions";

/* Casos achados na revisão das Etapas 1 a 5 (2026-11-18). */

beforeEach(() => {
  localStorage.clear();
  _limparMemoria();
});

const AGORA = new Date("2026-11-18T12:00:00-03:00");
const sub = (p: Partial<Submission>): Submission => ({ id: Math.random().toString(36), pageId: "p", pageSlug: "p", createdAt: 0, nome: "X", whats: "", email: "", ...p });

describe("lista de espera", () => {
  it("com gente esperando, quem chega vai para o fim da fila mesmo com vaga aberta", () => {
    const f: Formulario = { ...criarFormulario("simples"), regras: { ...criarFormulario("simples").regras, vagas: 2, listaEspera: true } };
    const ja = [sub({ whats: "5531911110000", status: "inscrito" }), sub({ whats: "5531922220000", status: "espera" })];
    expect(checarRegras(f, { inscricoesDaPagina: ja, agora: AGORA }, { whats: "(31) 9 3333-0000", email: "n@n.com" })).toEqual({ ok: true, espera: true });
  });
  it("quem sai da espera num evento pago passa a dever o ingresso", () => {
    const f = criarFormulario("ingresso");
    f.campos = f.campos.map((c) => (c.tipo === "ingresso" ? { ...c, ingresso: { ...INGRESSO_PADRAO, preco: 50 } } : c));
    const p = pagamentoAoSairDaEspera(sub({ status: "espera", respostas: {} }), f, AGORA);
    expect(p).toMatchObject({ status: "pendente", valor: 50 });
    expect(pagamentoAoSairDaEspera(sub({ status: "espera" }), criarFormulario("simples"), AGORA)).toBeUndefined();
  });
});

describe("inscrição repetida", () => {
  const f = criarFormulario("simples");
  it("compara o WhatsApp inteiro, com DDD", () => {
    const ja = [sub({ whats: "5531999990000" })];
    expect(checarRegras(f, { inscricoesDaPagina: ja, agora: AGORA }, { whats: "(41) 9 9999-0000", email: "b@b.com" }).ok).toBe(true);
    expect(checarRegras(f, { inscricoesDaPagina: ja, agora: AGORA }, { whats: "(31) 9 9999-0000", email: "b@b.com" }).ok).toBe(false);
  });
  it("pagamento cancelado ou estornado libera nova inscrição", () => {
    const ja = [sub({ whats: "5531999990000", pagamento: { status: "cancelado", valor: 10, atualizadoEm: 0 } })];
    expect(checarRegras(f, { inscricoesDaPagina: ja, agora: AGORA }, { whats: "(31) 9 9999-0000", email: "b@b.com" }).ok).toBe(true);
  });
});

describe("lógica condicional", () => {
  it("resposta de campo escondido não é gravada", () => {
    const f = criarFormulario("simples");
    f.campos = [
      novoCampo("unica", { id: "lic", opcoes: ["Sim", "Não"] }),
      novoCampo("texto", { id: "cod", condicao: { campo: "lic", valor: "Sim" } }),
      novoCampo("texto", { id: "neto", condicao: { campo: "cod", valor: "X" } }),
    ];
    expect(semCamposEscondidos(f, { lic: "Não", cod: "LIC1", neto: "a" })).toEqual({ lic: "Não" });
    expect(semCamposEscondidos(f, { lic: "Sim", cod: "LIC1" })).toEqual({ lic: "Sim", cod: "LIC1" });
  });
  it("campo marcado para a página que depende de uma resposta do modal vai para o modal", () => {
    const f = criarFormulario("simples");
    f.campos = [
      novoCampo("texto", { id: "nome", naPagina: true }),
      novoCampo("unica", { id: "lic", opcoes: ["Sim", "Não"] }),
      novoCampo("texto", { id: "cod", naPagina: true, obrigatorio: true, condicao: { campo: "lic", valor: "Sim" } }),
    ];
    expect(camposNaPagina(f).map((c) => c.id)).toEqual(["nome"]);
    expect(etapasDoModal(f, false)[0].campos.map((c) => c.id)).toEqual(["lic", "cod"]);
  });
});

describe("dados estranhos", () => {
  it("origem esquisita na URL não vira nome reservado nem quebra o rótulo", () => {
    expect(origemDoAcesso(new URLSearchParams("origem=__proto__"))).toBe("proto");
    expect(origemDoAcesso(new URLSearchParams("origem=constructor"))).toBe("campanha");
    expect(origemDoAcesso(new URLSearchParams("utm_source=tiktok"))).toBe("tiktok");
    expect(typeof rotuloOrigem("__proto__")).toBe("string");
    expect(rotuloOrigem("constructor")).toBe("constructor");
  });
  it("item corrompido dentro da lista de inscrições é ignorado", () => {
    localStorage.setItem("poc-hotsite:subs", JSON.stringify([null, "x", { id: "1", pageId: "p", pageSlug: "p", createdAt: 0, nome: "A", whats: "", email: "" }]));
    expect(listSubmissions()).toHaveLength(1);
  });
});
