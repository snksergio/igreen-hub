import { addEventos, removeEventosPorPagina, type Evento } from "./eventos";
import { addFormularios, novoCampo, MODELOS_FORM, type Campo, type Formulario } from "./formularios";
import { INGRESSO_PADRAO } from "./ingresso";
import { addLinks, removeLinksPorPagina, type LinkLicenciado } from "./links";
import type { MetaPagina } from "./meta";
import { atualizarPecas, listPages, resetToExamples, setMeta } from "./pages";
import { readJSON, writeJSON } from "./store";
import { addMuitas, gerarCodigo, removePorPagina, type StatusInscricao, type StatusPagamento, type Submission } from "./submissions";

/* Dados de exemplo (Etapa 2.0): inscrições, visitas, links de licenciado e formulários fictícios
   para as páginas de exemplo. Nomes e contatos são inventados (e-mails em exemplo.com).
   Sorteio com semente fixa: a mesma quantidade e a mesma distribuição em qualquer navegador. */

const KEY = "poc-hotsite:dados-exemplo";
const VERSAO = "v1";

/** Gerador com semente (mulberry32). */
function sorteio(semente: number) {
  let a = semente >>> 0;
  const r = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const um = <T,>(lista: readonly T[]) => lista[Math.floor(r() * lista.length)];
  /** Escolhe pelo peso: [["a", 3], ["b", 1]]. */
  const peso = <T,>(lista: readonly (readonly [T, number])[]) => {
    const total = lista.reduce((s, [, p]) => s + p, 0);
    let x = r() * total;
    for (const [v, p] of lista) if ((x -= p) < 0) return v;
    return lista[lista.length - 1][0];
  };
  return { r, um, peso };
}

const NOMES = ["Ana", "Bruno", "Camila", "Daniel", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "João", "Larissa", "Lucas", "Mariana", "Mateus", "Natália", "Otávio", "Paula", "Rafael", "Renata", "Rodrigo", "Sabrina", "Thiago", "Vanessa", "Vinícius", "Beatriz", "Caio", "Débora", "Gustavo", "Letícia", "Marcelo"];
const SOBRENOMES = ["Silva", "Souza", "Oliveira", "Santos", "Pereira", "Lima", "Carvalho", "Ferreira", "Rodrigues", "Almeida", "Costa", "Gomes", "Martins", "Araújo", "Ribeiro", "Barbosa", "Rocha", "Dias", "Moreira", "Teixeira", "Mendes", "Nunes", "Freitas", "Prado", "Campos"];
const CIDADES: readonly (readonly [string, number])[] = [
  ["Belo Horizonte/MG", 10],
  ["Contagem/MG", 3],
  ["Betim/MG", 2],
  ["Nova Lima/MG", 2],
  ["Sete Lagoas/MG", 1],
  ["Ipatinga/MG", 1],
  ["Juiz de Fora/MG", 1],
  ["Uberlândia/MG", 1],
];

const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Licenciados fictícios (o primeiro é o da demo do convite). */
const LICENCIADOS = [
  { ref: "LIC123", nome: "Thiago Souza", cidade: "Belo Horizonte · MG", peso: 9 },
  { ref: "LIC204", nome: "Ana Ribeiro", cidade: "Contagem · MG", peso: 6 },
  { ref: "LIC318", nome: "Carlos Mendes", cidade: "Betim · MG", peso: 4 },
  { ref: "LIC427", nome: "Juliana Prado", cidade: "Nova Lima · MG", peso: 3 },
  { ref: "LIC512", nome: "Pedro Almeida", cidade: "Belo Horizonte · MG", peso: 2 },
  { ref: "LIC633", nome: "Fernanda Lopes", cidade: "Sete Lagoas · MG", peso: 1 },
];

/* ---------- Formulários de exemplo ---------- */

const FORM_LIVE = "f-igreen-live-bh";
const FORM_ENCONTRO = "f-encontro-bh";
const FORM_PRE_LIVE = "f-pre-live";

function formularios(agora: number): Formulario[] {
  const simples = MODELOS_FORM[0].montar();
  const comIngresso = MODELOS_FORM[1].montar();
  const live = MODELOS_FORM[2].montar();
  const sobreVoce: Campo[] = [
    novoCampo("etapa", { id: "etapa-sobre", rotulo: "Sobre você" }),
    novoCampo("unica", { id: "ja-licenciado", rotulo: "Você já é licenciado iGreen?", opcoes: ["Sim", "Não", "Quero saber como ser"], obrigatorio: true }),
    novoCampo("texto", { id: "codigo-licenciado", rotulo: "Qual é o seu código de licenciado?", exemplo: "Ex.: LIC123", max: 20, condicao: { campo: "ja-licenciado", valor: "Sim" } }),
    novoCampo("multipla", { id: "interesses", rotulo: "O que mais te interessa no evento?", opcoes: ["Palestras", "Conhecer o negócio", "Networking", "Show de encerramento"], obrigatorio: true }),
    novoCampo("lista", { id: "acompanhante", rotulo: "Vai levar acompanhante?", opcoes: ["Não", "Sim, 1 pessoa", "Sim, 2 pessoas"] }),
    novoCampo("info", { id: "aviso-entrada", rotulo: "A entrada é gratuita. A confirmação e o QR code de entrada chegam no seu WhatsApp." }),
  ];
  const lgpd = simples.campos.find((c) => c.tipo === "lgpd")!;
  const ocultos = simples.campos.filter((c) => c.tipo === "oculto");
  const base = simples.campos.filter((c) => c.base);
  return [
    {
      id: FORM_LIVE,
      nome: "Inscrição · iGreen Live BH",
      campos: [...base, ...sobreVoce, lgpd, ...ocultos],
      regras: { ...simples.regras, vagas: 250, listaEspera: true, mensagemSucesso: "Pronto! A confirmação chega no seu WhatsApp." },
      botaoPagina: "Quero participar",
      botaoFinal: "Confirmar inscrição",
      criadoEm: agora - 20 * 86400000,
      atualizadoEm: agora - 2 * 86400000,
    },
    {
      id: FORM_ENCONTRO,
      nome: "Ingresso · Encontro iGreen BH",
      campos: comIngresso.campos.map((c) =>
        c.tipo === "ingresso"
          ? {
              ...c,
              ingresso: {
                ...INGRESSO_PADRAO,
                nomeIngresso: "Ingresso",
                preco: 79,
                meia: true,
                lotes: [
                  { id: "l1", nome: "1º lote", preco: 39, ate: "2026-11-25T23:59" },
                  { id: "l2", nome: "2º lote", preco: 59, ate: "2026-12-05T23:59" },
                ],
                cupons: [
                  { codigo: "LIC123", tipo: "percentual", valor: 10, licenciado: "LIC123" },
                  { codigo: "THIAGO20", tipo: "valor", valor: 20, limite: 30, validade: "2026-12-10T23:59" },
                ],
              },
            }
          : c
      ),
      regras: { ...comIngresso.regras, vagas: 120 },
      botaoPagina: comIngresso.botaoPagina,
      botaoFinal: comIngresso.botaoFinal,
      criadoEm: agora - 30 * 86400000,
      atualizadoEm: agora - 5 * 86400000,
    },
    { id: FORM_PRE_LIVE, ...live, nome: "Pré-cadastro · Live Mobi", criadoEm: agora - 8 * 86400000, atualizadoEm: agora - 8 * 86400000 },
  ];
}

/* ---------- O que cada página de exemplo recebe ---------- */

type Plano = {
  meta: MetaPagina;
  form?: string;
  inscricoes: number;
  visitas: number;
  dias: number;
  /** Quantos dias atrás terminou a divulgação (página encerrada). */
  fimHa?: number;
  licenciados: number;
};

const PLANOS: Record<string, Plano> = {
  "igreen-live-bh": {
    meta: { status: "publicada", vagas: 250, responsaveis: ["Marina Costa"] },
    form: FORM_LIVE,
    inscricoes: 186,
    visitas: 2380,
    dias: 21,
    licenciados: 6,
  },
  "evento-thiago-bh": {
    meta: { status: "publicada", vagas: 120, responsaveis: ["Rafael Lima", "Marina Costa"] },
    form: FORM_ENCONTRO,
    inscricoes: 74,
    visitas: 960,
    dias: 18,
    licenciados: 3,
  },
  "live-mobi": {
    meta: { status: "publicada", publicarEm: "2026-11-25T09:00", responsaveis: ["Júlia Andrade"] },
    form: FORM_PRE_LIVE,
    inscricoes: 0,
    visitas: 0,
    dias: 0,
    licenciados: 2,
  },
  "migre-a-bandeira": {
    meta: { status: "encerrada", responsaveis: ["Rafael Lima"] },
    inscricoes: 52,
    visitas: 1410,
    dias: 30,
    fimHa: 12,
    licenciados: 3,
  },
};

const ORIGENS: readonly (readonly [string, number])[] = [
  ["licenciado", 38],
  ["instagram", 24],
  ["whatsapp", 16],
  ["direto", 12],
  ["google", 6],
  ["campanha", 4],
];

function semearPagina(pageId: string, slug: string, plano: Plano, form: Formulario | undefined, agora: number, semente: number) {
  const s = sorteio(semente);
  const fim = agora - (plano.fimHa ?? 0) * 86400000;
  /** Mais movimento perto do fim (a divulgação esquenta). */
  const quando = () => {
    // Instante contínuo para trás (mais perto do fim, mais movimento); madrugada vira manhã.
    let t = fim - Math.pow(s.r(), 1.7) * plano.dias * 86400000 - 5 * 60000;
    if (new Date(t).getHours() < 8 && t + 8 * 3600000 < agora) t += 8 * 3600000;
    return Math.round(t);
  };
  const lics = LICENCIADOS.slice(0, plano.licenciados);
  const pesosLic = lics.map((l) => [l.ref, l.peso] as const);

  const links: LinkLicenciado[] = lics.map((l, i) => ({
    id: `lk-${slug}-${l.ref}`,
    pageId,
    ref: l.ref,
    nome: l.nome,
    cidade: l.cidade,
    criadoEm: agora - (plano.dias + 2 - i) * 86400000,
  }));

  const eventos: Evento[] = [];
  for (let i = 0; i < plano.visitas; i++) {
    const origem = s.peso(ORIGENS);
    eventos.push({ pageId, tipo: "visita", em: quando(), origem, ref: origem === "licenciado" ? s.peso(pesosLic) : undefined });
  }
  // Mais gente começa do que termina o formulário.
  for (let i = 0; i < Math.round(plano.inscricoes * 1.55); i++) eventos.push({ pageId, tipo: "form-inicio", em: quando(), origem: "direto" });

  const cobra = form?.campos.some((c) => c.tipo === "ingresso");
  const subs: Submission[] = [];
  const usados = new Set<string>();
  for (let i = 0; i < plano.inscricoes; i++) {
    const nome = `${s.um(NOMES)} ${s.um(SOBRENOMES)}`;
    const email = `${semAcento(nome).replace(/\s+/g, ".")}${Math.floor(s.r() * 90 + 10)}@exemplo.com`;
    const whats = `55319${String(Math.floor(s.r() * 1e8)).padStart(8, "0")}`;
    const cidade = s.peso(CIDADES);
    const origem = s.peso(ORIGENS);
    const ref = origem === "licenciado" ? s.peso(pesosLic) : undefined;
    const createdAt = quando();
    let codigo = gerarCodigo(s.r);
    while (usados.has(codigo)) codigo = gerarCodigo(s.r);
    usados.add(codigo);

    let pagamento: Submission["pagamento"];
    if (cobra) {
      const st = s.peso<StatusPagamento>([["pago", 72], ["pendente", 16], ["cancelado", 8], ["estornado", 4]]);
      const lote = createdAt < new Date("2026-11-25T23:59:00-03:00").getTime() ? { nome: "1º lote", preco: 39 } : { nome: "2º lote", preco: 59 };
      const meia = s.r() < 0.18;
      const cupom = ref === "LIC123" && s.r() < 0.6 ? "LIC123" : undefined;
      let valor = meia ? lote.preco / 2 : lote.preco;
      if (cupom) valor = Math.round(valor * 0.9 * 100) / 100;
      pagamento = { status: st, valor, lote: lote.nome, meia, cupom, metodo: s.r() < 0.7 ? "pix" : "cartao", atualizadoEm: createdAt + 120000 };
    }
    let status: StatusInscricao = s.peso<StatusInscricao>([["inscrito", 52], ["confirmado", 48]]);
    if (pagamento && pagamento.status !== "pago" && status === "confirmado") status = "inscrito";

    const respostas: Submission["respostas"] = { nome, whats, email, cidade, lgpd: "sim", origem, ...(ref ? { ref } : {}) };
    if (form?.id === FORM_LIVE) {
      const lic = s.peso([["Não", 6], ["Sim", 3], ["Quero saber como ser", 3]] as const);
      respostas["ja-licenciado"] = lic;
      if (lic === "Sim") respostas["codigo-licenciado"] = `LIC${100 + Math.floor(s.r() * 899)}`;
      respostas.interesses = ["Palestras", "Conhecer o negócio", "Networking", "Show de encerramento"].filter(() => s.r() < 0.5);
      if (!respostas.interesses.length) respostas.interesses = ["Palestras"];
      respostas.acompanhante = s.peso([["Não", 6], ["Sim, 1 pessoa", 3], ["Sim, 2 pessoas", 1]] as const);
    }
    if (form?.id === FORM_ENCONTRO) {
      respostas.cpf = "";
      respostas.conheceu = s.um(["Por um licenciado", "Instagram", "WhatsApp", "Indicação de amigo"]);
      respostas.ingresso = pagamento?.meia ? "meia" : "inteira";
    }
    const historico = [{ em: createdAt, texto: "Inscrição enviada" }];
    if (pagamento?.status === "pago") historico.push({ em: createdAt + 120000, texto: "Pagamento aprovado" });
    if (status === "confirmado") historico.push({ em: createdAt + 8 * 3600000, texto: "Marcado como confirmado" });

    subs.push({
      id: `ex-${slug}-${i}`,
      pageId,
      pageSlug: slug,
      ref,
      createdAt,
      nome,
      whats,
      email,
      cidade,
      status,
      formId: form?.id,
      respostas,
      origem,
      consentimentoEm: createdAt,
      pagamento,
      codigo,
      historico,
      ...(form ? {} : { interesse: s.um(["Energia", "Telefonia", "Eletropostos MOB"]) }),
    });
  }
  return { links, eventos, subs };
}

/** Semeia uma vez por navegador. `forcar`: refaz (usado ao restaurar os exemplos). */
export function garantirDadosDeExemplo(forcar = false, agora = Date.now()): void {
  if (!forcar && readJSON<string>(KEY) === VERSAO) return;
  const forms = formularios(agora);
  addFormularios(forms);
  const pages = listPages().filter((p) => PLANOS[p.slug]);
  const ids = pages.map((p) => p.id);
  removePorPagina(ids);
  removeEventosPorPagina(ids);
  removeLinksPorPagina(ids);
  const todosLinks: LinkLicenciado[] = [];
  const todosEventos: Evento[] = [];
  const todasSubs: Submission[] = [];
  // Do último ao primeiro: o primeiro exemplo (a demo iGreen Live) fica como o editado por último, no topo do painel.
  [...pages].reverse().forEach((p, i) => {
    const plano = PLANOS[p.slug];
    if (!p.meta || forcar) setMeta(p.id, plano.meta);
    if (plano.form) {
      const formId = plano.form;
      atualizarPecas(p.id, (peca) => (peca.type === "Inscricao" || peca.type === "LiveInscricao" ? { formularioId: formId } : undefined));
    }
    const { links, eventos, subs } = semearPagina(p.id, p.slug, plano, forms.find((f) => f.id === plano.form), agora, 1000 + i * 97);
    todosLinks.push(...links);
    todosEventos.push(...eventos);
    todasSubs.push(...subs);
  });
  addLinks(todosLinks);
  addEventos(todosEventos);
  addMuitas(todasSubs);
  writeJSON(KEY, VERSAO);
}

/** "Restaurar exemplos": volta as páginas e refaz os dados fictícios delas. */
export function restaurarExemplos(): void {
  const antigas = listPages().map((p) => p.id);
  resetToExamples();
  removePorPagina(antigas);
  removeEventosPorPagina(antigas);
  removeLinksPorPagina(antigas);
  garantirDadosDeExemplo(true);
}
