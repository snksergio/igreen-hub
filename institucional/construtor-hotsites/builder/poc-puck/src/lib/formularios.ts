import type { Data } from "@puckeditor/core";
import { INGRESSO_PADRAO, precoAgora, type ConfigIngresso } from "./ingresso";
import type { PageRecord } from "./pages";
import { uid } from "./slug";
import { readJSON, writeJSON } from "./store";
import { deBrasilia } from "./tempo";
import { normalizarWhats } from "./persona";
import { ocupaVaga, statusDe, type Respostas, type Submission } from "./submissions";

/* Formulários (Etapa 3): guardados à parte e reaproveitados por várias páginas. A peça de
   inscrição só aponta para um (formularioId) e as respostas ficam separadas por página (0.1). */

export type TipoCampo =
  | "texto"
  | "paragrafo"
  | "email"
  | "whats"
  | "cpf"
  | "data"
  | "numero"
  | "cidade"
  | "unica"
  | "multipla"
  | "lista"
  | "info"
  | "lgpd"
  | "ingresso"
  | "oculto"
  | "anexo"
  | "etapa";

export type Campo = {
  id: string;
  tipo: TipoCampo;
  rotulo: string;
  ajuda?: string;
  obrigatorio?: boolean;
  /** Exemplo dentro do campo (placeholder). */
  exemplo?: string;
  /** Limite de caracteres (texto). */
  max?: number;
  /** Menor e maior valor (número). */
  minimo?: number;
  maximo?: number;
  opcoes?: string[];
  validacao?: "nenhuma" | "nome-completo" | "so-letras";
  /** Fica na versão curta, na própria página (3.8). */
  naPagina?: boolean;
  /** Só aparece se outro campo tiver esta resposta (3.5). */
  condicao?: { campo: string; valor: string };
  /** Campo oculto: preenchido sozinho. */
  fonte?: "ref" | "origem";
  /** Liga o campo à lista de inscritos e ao check-in. Campo com base não sai do formulário. */
  base?: "nome" | "whats" | "email" | "cidade";
  ingresso?: ConfigIngresso;
  /** Meia largura: dois campos lado a lado no computador. */
  meia?: boolean;
  /** Anexo: que arquivos aceita e o tamanho máximo. */
  aceita?: "pdf-imagem" | "pdf" | "imagem" | "qualquer";
  maxMb?: number;
};

export type Regras = {
  /** Vagas (vazio = sem limite). A página pode ter as próprias vagas, que valem antes. */
  vagas?: number;
  /** As inscrições fecham nesse horário (Brasília). */
  encerraEm?: string;
  listaEspera: boolean;
  bloquearRepetida: "nao" | "whats" | "email" | "whats-ou-email";
  sucesso: "mensagem" | "redirecionar";
  mensagemSucesso: string;
  redirecionarPara?: string;
};

export type Formulario = {
  id: string;
  nome: string;
  campos: Campo[];
  regras: Regras;
  /** Botão da versão curta, na página. */
  botaoPagina: string;
  /** Botão do fim do formulário. */
  botaoFinal: string;
  /** Como o modal pergunta: uma pergunta por vez, como conversa (padrão), ou campos em etapas. */
  estilo?: "conversa" | "formulario";
  criadoEm: number;
  atualizadoEm: number;
};

export const ROTULO_TIPO: Record<TipoCampo, string> = {
  texto: "Texto curto",
  paragrafo: "Texto longo",
  email: "E-mail",
  whats: "WhatsApp",
  cpf: "CPF",
  data: "Data",
  numero: "Número",
  cidade: "Cidade e UF",
  unica: "Escolha única",
  multipla: "Múltipla escolha",
  lista: "Lista suspensa",
  info: "Texto informativo",
  lgpd: "Aceite de LGPD",
  ingresso: "Ingresso e pagamento",
  oculto: "Campo oculto",
  anexo: "Anexo (arquivo)",
  etapa: "Nova etapa",
};

/** O que o seletor de arquivo aceita para cada opção do anexo. */
export const ACEITA: Record<NonNullable<Campo["aceita"]>, { rotulo: string; accept: string; tipos: RegExp }> = {
  "pdf-imagem": { rotulo: "PDF ou imagem", accept: "application/pdf,image/*", tipos: /^(application\/pdf|image\/)/ },
  pdf: { rotulo: "Só PDF", accept: "application/pdf", tipos: /^application\/pdf$/ },
  imagem: { rotulo: "Só imagem", accept: "image/*", tipos: /^image\// },
  qualquer: { rotulo: "Qualquer arquivo", accept: "", tipos: /./ },
};

/** Confere o arquivo escolhido: tipo e tamanho. */
export function checarArquivo(c: Campo, arq: { type: string; size: number }): string | undefined {
  const regra = ACEITA[c.aceita ?? "pdf-imagem"];
  if (!regra.tipos.test(arq.type || "x")) return `Envie ${regra.rotulo.toLowerCase().replace("só ", "")}.`;
  const max = (c.maxMb ?? 5) * 1024 * 1024;
  if (arq.size > max) return `O arquivo passa de ${c.maxMb ?? 5} MB.`;
  return undefined;
}

export const tamanhoLegivel = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1).replace(".", ",")} MB`);

export const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

const TEXTO_LGPD =
  "Aceito que a iGreen use meus dados para a inscrição neste evento e para me mandar avisos sobre ele por WhatsApp e e-mail. Posso cancelar quando quiser.";

/** Campo novo com o que cada tipo precisa para funcionar de cara. */
export function novoCampo(tipo: TipoCampo, extra: Partial<Campo> = {}): Campo {
  const base: Campo = { id: `c-${uid().slice(0, 8)}`, tipo, rotulo: ROTULO_TIPO[tipo], obrigatorio: false };
  const porTipo: Partial<Record<TipoCampo, Partial<Campo>>> = {
    texto: { rotulo: "Pergunta", max: 120 },
    paragrafo: { rotulo: "Conte para a gente", max: 600 },
    email: { rotulo: "E-mail", exemplo: "seu@email.com" },
    whats: { rotulo: "WhatsApp", exemplo: "(31) 9 9999-9999" },
    cpf: { rotulo: "CPF", exemplo: "000.000.000-00", ajuda: "Só pedimos o CPF quando o evento exige (ex.: emissão de ingresso)." },
    data: { rotulo: "Data" },
    numero: { rotulo: "Quantidade", minimo: 0 },
    cidade: { rotulo: "Cidade" },
    unica: { rotulo: "Escolha uma opção", opcoes: ["Opção 1", "Opção 2"] },
    multipla: { rotulo: "Marque quantas quiser", opcoes: ["Opção 1", "Opção 2", "Opção 3"] },
    lista: { rotulo: "Escolha na lista", opcoes: ["Opção 1", "Opção 2", "Opção 3"] },
    info: { rotulo: "Um aviso para quem preenche." },
    lgpd: { rotulo: TEXTO_LGPD, obrigatorio: true },
    ingresso: { rotulo: "Ingresso", obrigatorio: true, ingresso: { ...INGRESSO_PADRAO } },
    oculto: { rotulo: "Código do licenciado", fonte: "ref" },
    anexo: { rotulo: "Envie um arquivo", aceita: "pdf-imagem", maxMb: 5, ajuda: "PDF ou imagem, até 5 MB." },
    etapa: { rotulo: "Nova etapa" },
  };
  return { ...base, ...porTipo[tipo], ...extra };
}

/* ---------- Modelos prontos (3.7) ---------- */

const REGRAS_PADRAO: Regras = {
  listaEspera: false,
  bloquearRepetida: "whats-ou-email",
  sucesso: "mensagem",
  mensagemSucesso: "Inscrição feita! A confirmação chega no seu WhatsApp.",
};

const basicos = (): Campo[] => [
  novoCampo("texto", { id: "nome", base: "nome", rotulo: "Nome completo", exemplo: "Como quer ser chamado", obrigatorio: true, naPagina: true, validacao: "nome-completo", max: 100 }),
  novoCampo("whats", { id: "whats", base: "whats", obrigatorio: true, naPagina: true, meia: true }),
  novoCampo("email", { id: "email", base: "email", obrigatorio: true, naPagina: true, meia: true }),
];

const ocultos = (): Campo[] => [
  novoCampo("oculto", { id: "ref", rotulo: "Código do licenciado", fonte: "ref" }),
  novoCampo("oculto", { id: "origem", rotulo: "Origem do acesso", fonte: "origem" }),
];

export type ModeloForm = { id: string; nome: string; descricao: string; montar: () => Pick<Formulario, "nome" | "campos" | "regras" | "botaoPagina" | "botaoFinal"> };

export const MODELOS_FORM: ModeloForm[] = [
  {
    id: "simples",
    nome: "Inscrição simples",
    descricao: "Nome, WhatsApp, e-mail e cidade na página; o resto no modal.",
    montar: () => ({
      nome: "Inscrição simples",
      campos: [
        ...basicos(),
        novoCampo("cidade", { id: "cidade", base: "cidade", rotulo: "Cidade", naPagina: true, obrigatorio: true }),
        novoCampo("unica", { id: "conheceu", rotulo: "Como ficou sabendo do evento?", opcoes: ["Por um licenciado", "Instagram", "WhatsApp", "Indicação de amigo", "Outro"] }),
        novoCampo("lgpd", { id: "lgpd" }),
        ...ocultos(),
      ],
      regras: { ...REGRAS_PADRAO },
      botaoPagina: "Continuar inscrição",
      botaoFinal: "Confirmar inscrição",
    }),
  },
  {
    id: "ingresso",
    nome: "Inscrição com ingresso",
    descricao: "Dados, CPF e o ingresso com lotes, cupom e meia-entrada.",
    montar: () => ({
      nome: "Inscrição com ingresso",
      campos: [
        ...basicos(),
        novoCampo("cidade", { id: "cidade", base: "cidade", rotulo: "Cidade", naPagina: true, obrigatorio: true }),
        novoCampo("etapa", { id: "etapa-ingresso", rotulo: "Ingresso" }),
        novoCampo("cpf", { id: "cpf", obrigatorio: true }),
        novoCampo("ingresso", { id: "ingresso", rotulo: "Ingresso", ingresso: { ...INGRESSO_PADRAO, meia: true } }),
        novoCampo("lgpd", { id: "lgpd" }),
        ...ocultos(),
      ],
      regras: { ...REGRAS_PADRAO, listaEspera: false },
      botaoPagina: "Garantir meu ingresso",
      botaoFinal: "Ir para o pagamento",
    }),
  },
  {
    id: "live",
    nome: "Pré-cadastro de live",
    descricao: "Rápido: nome, WhatsApp e e-mail, sem modal.",
    montar: () => ({
      nome: "Pré-cadastro de live",
      campos: [
        novoCampo("texto", { id: "nome", base: "nome", rotulo: "Nome", exemplo: "Como quer ser chamado", obrigatorio: true, naPagina: true, max: 100 }),
        novoCampo("whats", { id: "whats", base: "whats", obrigatorio: true, naPagina: true }),
        novoCampo("email", { id: "email", base: "email", obrigatorio: false, naPagina: true }),
        novoCampo("lgpd", { id: "lgpd", naPagina: true, rotulo: "Aceito receber o link e os avisos da live pelo WhatsApp. Posso cancelar quando quiser." }),
        ...ocultos(),
      ],
      regras: { ...REGRAS_PADRAO, mensagemSucesso: "Pronto! O link da live chega no seu WhatsApp." },
      botaoPagina: "Quero o link da live",
      botaoFinal: "Quero o link da live",
    }),
  },
];

/* ---------- Biblioteca (3.1) ---------- */

const KEY = "poc-hotsite:formularios";

function load(): Formulario[] {
  const v = readJSON<Formulario[]>(KEY);
  return Array.isArray(v) ? v.filter((f) => f && typeof f.id === "string" && Array.isArray(f.campos)) : [];
}

export function listarFormularios(): Formulario[] {
  return load().sort((a, b) => b.atualizadoEm - a.atualizadoEm);
}

export function getFormulario(id: string | undefined): Formulario | undefined {
  return id ? load().find((f) => f.id === id) : undefined;
}

export function salvarFormulario(f: Formulario): Formulario {
  const lista = load();
  const novo = { ...f, atualizadoEm: Date.now() };
  const i = lista.findIndex((x) => x.id === f.id);
  if (i >= 0) lista[i] = novo;
  else lista.push(novo);
  writeJSON(KEY, lista);
  return novo;
}

export function criarFormulario(modeloId = "simples", nome?: string, id = `f-${uid().slice(0, 8)}`): Formulario {
  const m = (MODELOS_FORM.find((x) => x.id === modeloId) ?? MODELOS_FORM[0]).montar();
  const agora = Date.now();
  return salvarFormulario({ ...m, nome: nome?.trim() || m.nome, id, criadoEm: agora, atualizadoEm: agora });
}

export function duplicarFormulario(id: string): Formulario {
  const f = getFormulario(id);
  if (!f) throw new Error("Formulário não encontrado");
  const agora = Date.now();
  return salvarFormulario({ ...JSON.parse(JSON.stringify(f)), id: `f-${uid().slice(0, 8)}`, nome: `${f.nome} (cópia)`, criadoEm: agora, atualizadoEm: agora });
}

export function apagarFormulario(id: string): void {
  writeJSON(KEY, load().filter((f) => f.id !== id));
}

export function addFormularios(lista: Formulario[]): void {
  const ids = new Set(lista.map((f) => f.id));
  writeJSON(KEY, [...load().filter((f) => !ids.has(f.id)), ...lista]);
}

const PECAS_DE_INSCRICAO = new Set(["Inscricao", "LiveInscricao"]);

/** O formulário que a página usa: o da primeira peça de inscrição que aponta para um. */
export function formularioDaPagina(data: Data): string | undefined {
  for (const c of data.content ?? []) {
    const id = (c.props as { formularioId?: string }).formularioId;
    if (PECAS_DE_INSCRICAO.has(c.type) && id) return id;
  }
  return undefined;
}

/** Páginas que usam o formulário (para avisar antes de mudar ou apagar). */
export function paginasQueUsam(formId: string, pages: PageRecord[]): PageRecord[] {
  return pages.filter((p) => formularioDaPagina(p.data) === formId);
}

/* ---------- Etapas, lógica e validação (3.4, 3.5) ---------- */

export type Etapa = { titulo: string; campos: Campo[] };

/** Divide pelos campos "Nova etapa". A primeira etapa se chama "Seus dados". */
export function dividirEtapas(campos: Campo[]): Etapa[] {
  const etapas: Etapa[] = [{ titulo: "Seus dados", campos: [] }];
  for (const c of campos) {
    if (c.tipo === "etapa") etapas.push({ titulo: c.rotulo || "Etapa", campos: [] });
    else etapas[etapas.length - 1].campos.push(c);
  }
  return etapas.filter((e) => e.campos.some((c) => c.tipo !== "oculto"));
}

/**
 * Ajuste de uma seção da página sobre o formulário: id do campo → fica na seção (true) ou vai
 * para a janela (false). Campo fora do ajuste segue o que o formulário diz.
 */
export type AjusteSecao = Record<string, boolean>;

/** Campos que podem ficar na página (os outros só existem na janela ou nem aparecem). */
export const podeFicarNaPagina = (c: Campo) => c.tipo !== "etapa" && c.tipo !== "oculto" && c.tipo !== "ingresso";

/**
 * O campo fica mesmo na página? Só se estiver marcado (no formulário ou no ajuste da seção) e,
 * tendo condição, o campo de que depende também ficar. Senão ele iria para um lugar onde a
 * resposta que o libera não existe.
 */
export function ficaNaPagina(f: Formulario, c: Campo, visto = new Set<string>(), ajuste?: AjusteSecao): boolean {
  const marcado = ajuste?.[c.id] ?? c.naPagina;
  if (!marcado || !podeFicarNaPagina(c)) return false;
  if (!c.condicao?.campo) return true;
  if (visto.has(c.id)) return false;
  visto.add(c.id);
  const pai = f.campos.find((x) => x.id === c.condicao!.campo);
  return Boolean(pai && ficaNaPagina(f, pai, visto, ajuste));
}

/** Os campos que vão para a página (versão curta). */
export const camposNaPagina = (f: Formulario, ajuste?: AjusteSecao) => f.campos.filter((c) => ficaNaPagina(f, c, new Set(), ajuste));

/** O que sobra para o modal, já em etapas. `completo`: o modal direto mostra tudo. */
export function etapasDoModal(f: Formulario, completo: boolean, ajuste?: AjusteSecao): Etapa[] {
  return dividirEtapas(completo ? f.campos : f.campos.filter((c) => !ficaNaPagina(f, c, new Set(), ajuste)));
}

/** Tira as respostas de campos que a lógica escondeu (não vão para a lista nem para o CSV). */
export function semCamposEscondidos(f: Formulario, r: Respostas): Respostas {
  const saida: Respostas = { ...r };
  // Repete porque uma condição pode depender de outra que acabou de sumir.
  for (let volta = 0; volta <= f.campos.length; volta++) {
    let mudou = false;
    for (const c of f.campos) {
      if (c.id in saida && !visivel(c, saida)) {
        delete saida[c.id];
        for (const k of Object.keys(saida)) if (k.startsWith(`${c.id}-`)) delete saida[k];
        mudou = true;
      }
    }
    if (!mudou) break;
  }
  return saida;
}

const resposta = (r: Respostas, id: string) => r[id];

/** Campo com condição só aparece se o outro campo tiver a resposta pedida (em múltipla, se ela estiver marcada). */
export function visivel(c: Campo, r: Respostas): boolean {
  if (!c.condicao?.campo) return true;
  const v = resposta(r, c.condicao.campo);
  return Array.isArray(v) ? v.includes(c.condicao.valor) : v === c.condicao.valor;
}

export const soDigitos = (v: string) => v.replace(/\D/g, "");

export function cpfValido(v: string): boolean {
  const d = soDigitos(v);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const dig = (n: number) => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(d[i]) * (n + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return dig(9) === Number(d[9]) && dig(10) === Number(d[10]);
}

export function mascaraWhats(v: string): string {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

export function mascaraCpf(v: string): string {
  const d = soDigitos(v).slice(0, 11);
  return d.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mensagem de erro do campo, ou undefined se está certo. */
export function validarCampo(c: Campo, valor: string | string[] | undefined): string | undefined {
  if (c.tipo === "info" || c.tipo === "etapa" || c.tipo === "oculto" || c.tipo === "ingresso") return undefined;
  const lista = Array.isArray(valor) ? valor : undefined;
  const v = Array.isArray(valor) ? "" : (valor ?? "").trim();
  const vazio = lista ? lista.length === 0 : !v;
  if (c.tipo === "lgpd") return v === "sim" ? undefined : "Para enviar, marque o aceite.";
  if (vazio) return c.obrigatorio ? (c.tipo === "multipla" ? "Marque pelo menos uma opção." : "Campo obrigatório.") : undefined;
  if (c.max && v.length > c.max) return `Use até ${c.max} caracteres.`;
  switch (c.tipo) {
    case "email":
      return EMAIL.test(v) ? undefined : "Confira o e-mail.";
    case "whats": {
      const d = soDigitos(v);
      return d.length >= 10 && d.length <= 13 ? undefined : "WhatsApp com DDD.";
    }
    case "cpf":
      return cpfValido(v) ? undefined : "CPF inválido. Confira os números.";
    case "data":
      return /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(`${v}T12:00:00`).getTime()) ? undefined : "Data inválida.";
    case "numero": {
      const n = Number(v.replace(",", "."));
      if (!Number.isFinite(n)) return "Digite um número.";
      if (c.minimo != null && n < c.minimo) return `O mínimo é ${c.minimo}.`;
      if (c.maximo != null && n > c.maximo) return `O máximo é ${c.maximo}.`;
      return undefined;
    }
    case "cidade":
      return /\/[A-Z]{2}$/.test(v) && v.split("/")[0].trim() ? undefined : "Informe a cidade e a UF.";
    case "texto":
      if (c.validacao === "nome-completo" && v.split(/\s+/).length < 2) return "Escreva nome e sobrenome.";
      if (c.validacao === "so-letras" && /[^\p{L}\s'-]/u.test(v)) return "Use só letras.";
      return undefined;
    default:
      return undefined;
  }
}

/** Erros dos campos visíveis. Campo escondido pela lógica não é cobrado. */
export function validarCampos(campos: Campo[], r: Respostas): Record<string, string> {
  const erros: Record<string, string> = {};
  for (const c of campos) {
    if (!visivel(c, r)) continue;
    const e = validarCampo(c, r[c.id]);
    if (e) erros[c.id] = e;
    if (c.tipo === "ingresso" && c.ingresso?.meia && r[c.id] === "meia" && r[`${c.id}-declaro`] !== "sim")
      erros[`${c.id}-declaro`] = "Para a meia-entrada, marque a declaração.";
  }
  return erros;
}

/* ---------- Regras (3.6) e ligação com a inscrição ---------- */

export const campoIngresso = (f: Formulario | undefined) => f?.campos.find((c) => c.tipo === "ingresso" && c.ingresso);

/** Evento gratuito pula o pagamento sem configurar nada (4.4). */
export function cobra(f: Formulario | undefined, agora = new Date()): boolean {
  const c = campoIngresso(f);
  if (!c?.ingresso) return false;
  return precoAgora(c.ingresso, agora).preco > 0 || c.ingresso.lotes.some((l) => l.preco > 0);
}

export type Contexto = { inscricoesDaPagina: Submission[]; vagasDaPagina?: number | null; encerrarDaPagina?: string; agora?: Date };

export type Vaga = { ok: true; espera: boolean } | { ok: false; motivo: string };

/** Pode se inscrever? Confere encerramento, vagas (com lista de espera) e inscrição repetida. */
export function checarRegras(f: Formulario, ctx: Contexto, r: Respostas): Vaga {
  const agora = ctx.agora ?? new Date();
  for (const fim of [ctx.encerrarDaPagina, f.regras.encerraEm]) {
    const d = deBrasilia(fim);
    if (d && d <= agora) return { ok: false, motivo: "As inscrições estão encerradas." };
  }
  const base = baseDasRespostas(f, r);
  const rep = f.regras.bloquearRepetida;
  if (rep !== "nao") {
    const whats = mesmoWhats(base.whats);
    const email = base.email.toLowerCase();
    // Pagamento cancelado ou estornado libera a pessoa para se inscrever de novo.
    const repetida = ctx.inscricoesDaPagina.some(
      (s) =>
        s.pagamento?.status !== "cancelado" &&
        s.pagamento?.status !== "estornado" &&
        (((rep === "whats" || rep === "whats-ou-email") && Boolean(whats) && mesmoWhats(s.whats) === whats) ||
          ((rep === "email" || rep === "whats-ou-email") && Boolean(email) && s.email.toLowerCase() === email))
    );
    if (repetida)
      return { ok: false, motivo: "Já existe uma inscrição com este WhatsApp ou e-mail. Para pagar uma inscrição pendente, use o link do ingresso." };
  }
  const vagas = ctx.vagasDaPagina || f.regras.vagas;
  if (vagas) {
    const cheio = ctx.inscricoesDaPagina.filter(ocupaVaga).length >= vagas;
    // Com gente esperando, quem chega entra no fim da fila, mesmo que uma vaga tenha aberto.
    const fila = f.regras.listaEspera && ctx.inscricoesDaPagina.some((s) => statusDe(s) === "espera");
    if (cheio || fila) return f.regras.listaEspera ? { ok: true, espera: true } : { ok: false, motivo: "As vagas acabaram." };
  }
  return { ok: true, espera: false };
}

/** WhatsApp inteiro, com 55 e DDD, para comparar (só o final confunde DDDs diferentes). */
function mesmoWhats(v: string): string {
  const d = soDigitos(v);
  return normalizarWhats(d) ?? d;
}

/** Nome, WhatsApp, e-mail e cidade pelos campos marcados como base (a lista e o check-in usam). */
export function baseDasRespostas(f: Formulario, r: Respostas): { nome: string; whats: string; email: string; cidade?: string } {
  const de = (b: Campo["base"]) => {
    const c = f.campos.find((x) => x.base === b);
    const v = c ? r[c.id] : undefined;
    return (Array.isArray(v) ? v.join(", ") : v ?? "").trim();
  };
  return { nome: de("nome"), whats: soDigitos(de("whats")), email: de("email"), cidade: de("cidade") || undefined };
}

/** Colunas extras da lista e do CSV: os campos com resposta que não são base (3.9). */
export function colunasDoFormulario(f: Formulario | undefined): { id: string; rotulo: string }[] {
  if (!f) return [];
  return f.campos
    .filter((c) => !c.base && !["info", "etapa", "lgpd", "ingresso"].includes(c.tipo))
    .map((c) => ({ id: c.id, rotulo: c.tipo === "oculto" ? c.rotulo : c.rotulo.slice(0, 60) }));
}
