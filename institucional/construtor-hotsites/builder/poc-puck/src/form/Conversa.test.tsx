import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Campo, Formulario } from "../lib/formularios";
import type { Respostas } from "../lib/submissions";
import { Conversa } from "./Conversa";
import type { Contexto } from "./Fluxo";

/* A conversa de inscrição, de ponta a ponta no navegador simulado: corrigir uma resposta, o resumo
   antes de confirmar, nada enviado antes do "Tudo certo", e o botão de teste do fluxo feliz.
   Com "movimento reduzido", a conversa não anima (sem pontinhos nem digitação), então dá para
   testar sem esperar. */

const campos: Campo[] = [
  { id: "nome", tipo: "texto", base: "nome", rotulo: "Nome completo", obrigatorio: true, naPagina: true },
  { id: "lic", tipo: "unica", rotulo: "Você já é licenciado iGreen?", opcoes: ["Sim", "Não"], obrigatorio: true },
  { id: "cod", tipo: "texto", rotulo: "Qual é o seu código de licenciado?", condicao: { campo: "lic", valor: "Sim" } },
  { id: "lgpd", tipo: "lgpd", rotulo: "Aceito que a iGreen use meus dados para a inscrição.", obrigatorio: true },
];
const form: Formulario = {
  id: "f-teste",
  nome: "Teste",
  campos,
  regras: { listaEspera: false, bloquearRepetida: "nao", sucesso: "mensagem", mensagemSucesso: "" },
  botaoPagina: "Quero participar",
  botaoFinal: "Enviar",
  estilo: "conversa",
  criadoEm: 0,
  atualizadoEm: 0,
};
const ctx = (previa = true): Contexto => ({ page: undefined, pageId: "p-teste", pageSlug: "teste", origem: "direto", previa });

let raiz: Root;
let caixa: HTMLDivElement;

beforeAll(() => {
  // Movimento reduzido: sem animação de pontinhos e de digitação.
  window.matchMedia = ((q: string) => ({
    matches: q.includes("reduce"),
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  if (!("CSS" in globalThis)) (globalThis as unknown as { CSS: { escape: (s: string) => string } }).CSS = { escape: (s) => s };
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
});

beforeEach(() => {
  caixa = document.createElement("div");
  document.body.appendChild(caixa);
  raiz = createRoot(caixa);
  window.location.hash = "";
});
afterEach(() => {
  act(() => raiz.unmount());
  caixa.remove();
});

/** Deixa os efeitos e os temporizadores curtos rodarem. */
const esperar = async (ms = 20) => {
  for (let i = 0; i < 4; i++) await act(() => new Promise((r) => setTimeout(r, ms / 4)));
};
const montar = async (props: { completo: boolean; iniciais?: Respostas; previa?: boolean; fechar?: () => void }) => {
  await act(async () => raiz.render(<Conversa form={form} ctx={ctx(props.previa ?? true)} completo={props.completo} iniciais={props.iniciais} fechar={props.fechar} />));
  await esperar();
};
const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
const $$ = (s: string) => [...document.querySelectorAll<HTMLElement>(s)];
const perguntaDaVez = () => $(".cv-fala[data-agora] .cv-pergunta")?.textContent ?? "";
const clicar = async (el: HTMLElement | null | undefined) => {
  expect(el, "botão não encontrado").toBeTruthy();
  await act(async () => el!.click());
  await esperar();
};
const botao = (texto: string, dentro = "") => $$(`${dentro} button`).find((b) => b.textContent?.trim() === texto);
const escrever = async (texto: string) => {
  const campo = $<HTMLInputElement>(".cv-escrever .cv-in:not(:disabled)");
  expect(campo, "caixa de escrever parada").toBeTruthy();
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(campo, texto);
    campo!.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(async () => campo!.form!.requestSubmit());
  await esperar();
};

describe("Conversa de inscrição", () => {
  it("corrigir uma resposta faz aparecer a pergunta que depende dela", async () => {
    await montar({ completo: true });
    await escrever("Ana Souza");
    expect(perguntaDaVez()).toContain("licenciado");

    await clicar(botao("Não", ".cv-agora"));
    // com "Não", a pergunta do código não aparece: a próxima é o aceite
    expect(document.body.textContent).not.toContain("código de licenciado");
    expect(perguntaDaVez()).toContain("Posso usar seus dados");

    // toca na resposta "Não" e troca para "Sim"
    await clicar($$(".cv-eu-bt").find((b) => b.textContent?.includes("Não")));
    await clicar(botao("Sim", ".cv-corrige"));
    expect(perguntaDaVez()).toContain("código de licenciado");
  });

  it("mostra o resumo e só envia depois do Tudo certo", async () => {
    await montar({ completo: false, iniciais: { nome: "Ana Souza" } });
    // o nome veio da página: não é perguntado de novo
    expect(perguntaDaVez()).toContain("licenciado");
    await clicar(botao("Sim", ".cv-agora"));
    await escrever("LIC9");
    await clicar(botao("Aceito", ".cv-agora"));

    // conferência: resumo com o que veio da página e as respostas
    const resumo = $$(".cv-resumo-linha").map((l) => l.textContent);
    expect(resumo.join(" | ")).toContain("Ana Souza");
    expect(resumo.join(" | ")).toContain("Sim");
    expect(resumo.join(" | ")).toContain("LIC9");

    // nada enviado ainda, mesmo esperando
    await esperar(60);
    expect($(".fm-sucesso")).toBeNull();

    await clicar(botao("Tudo certo, confirmar inscrição", ".cv-agora"));
    await esperar(40);
    expect($(".fm-sucesso")).toBeTruthy();
    expect($(".fm-sucesso-tit")?.textContent).toContain("Inscrição confirmada");
  });

  it("o botão Simular fluxo feliz preenche, envia e chega à tela final", async () => {
    await montar({ completo: true, fechar: () => {} });
    await clicar($<HTMLElement>(".cv-teste"));
    expect($(".fm-sucesso")).toBeTruthy();
    expect($(".cv-teste")).toBeNull();
  });

  it("o botão de teste não aparece na página publicada, só com ?teste=1", async () => {
    await montar({ completo: true, previa: false, fechar: () => {} });
    expect($(".cv-teste")).toBeNull();
    act(() => raiz.unmount());

    window.location.hash = "#/p/teste?teste=1";
    raiz = createRoot(caixa);
    await montar({ completo: true, previa: false, fechar: () => {} });
    expect($(".cv-teste")).toBeTruthy();
  });
});

// Evita que um aviso de "act" de outro teste vaze para este arquivo.
vi.spyOn(console, "error").mockImplementation((...a) => {
  if (String(a[0]).includes("not wrapped in act")) return;
  // eslint-disable-next-line no-console
  console.warn(...a);
});
