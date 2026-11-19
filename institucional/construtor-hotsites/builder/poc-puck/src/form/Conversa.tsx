import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { camposNaPagina, etapasDoModal, mascaraCpf, mascaraWhats, UFS, validarCampo, validarCampos, visivel, type AjusteSecao, type Campo, type Formulario } from "../lib/formularios";
import { reais } from "../lib/ingresso";
import { inscrever, pagar, totalDoIngresso, type Resultado } from "../lib/inscrever";
import type { Respostas, Submission } from "../lib/submissions";
import { Anexo, Campo as CampoView } from "./Campo";
import { Confirmacao } from "./Confirmacao";
import { Pagamento, type Contexto } from "./Fluxo";
import "./conversa.css";

/* Inscrição como conversa, no mesmo jeito do chat do assistente do construtor: cores neutras,
   a esfera da marca falando sem balão, as respostas da pessoa num balão cinza à direita.
   - cada fala nova vem com os três pontinhos e depois é "digitada" aos poucos;
   - entre as perguntas, uma frase que reage à resposta ("Prazer, Ana! 😊", "Ah, Contagem! Anotado.");
   - perguntas de escolha: as opções aparecem embaixo da pergunta e a caixa de texto fica parada;
   - tocar numa resposta corrige ali mesmo;
   - no fim, um resumo de tudo para conferir antes de confirmar; nada é enviado antes disso;
   - o progresso é só uma linha fina no topo, sem nomes de etapa.
   No modal há também um botão de teste, fora da caixa, que faz o caminho feliz até a confirmação. */

type Fase = { tipo: "conversa" } | { tipo: "pagamento"; sub: Submission } | { tipo: "fim"; sub: Submission; espera: boolean };
type Aviso = { texto: string; campo?: string; tentar?: boolean };
type Valor = string | string[] | undefined;
type Parte = { texto: string; cls?: string };

const primeiroNome = (v: unknown) => (typeof v === "string" ? v.trim().split(/\s+/)[0] : "");
const temValor = (v: unknown) => v !== undefined && v !== "" && !(Array.isArray(v) && !v.length);
const ESPERA_DIGITANDO = 420;
const ESCOLHA = new Set<Campo["tipo"]>(["unica", "lista", "multipla", "lgpd"]);
const SEM_TEXTO = new Set<Campo["tipo"]>(["unica", "lista", "multipla", "lgpd", "ingresso", "anexo", "info", "oculto", "etapa"]);
const CURTO: Record<string, string> = { nome: "Nome", whats: "WhatsApp", email: "E-mail", cidade: "Cidade" };
/** Escolhe uma frase pela posição: varia ao longo da conversa, mas não troca quando a tela redesenha. */
const umaDe = (frases: string[], i: number) => frases[i % frases.length];

/** Nome curto do campo, para os cartões de dados e a correção. */
const rotuloCurto = (c: Campo) => (c.base ? CURTO[c.base] : c.rotulo.replace(/\s*\([^)]*\)/g, "").trim()) || "Resposta";

/** A resposta como aparece no balão da pessoa. */
function textoDaResposta(c: Campo, r: Respostas, form: Formulario, pageId: string): string {
  const v = r[c.id];
  if (!temValor(v)) return "Prefiro pular essa";
  if (Array.isArray(v)) return v.join(", ");
  if (c.tipo === "lgpd") return "Aceito";
  if (c.tipo === "whats") return mascaraWhats(v);
  if (c.tipo === "cidade") return v.replace("/", ", ");
  if (c.tipo === "data") return new Date(`${v}T12:00:00`).toLocaleDateString("pt-BR");
  if (c.tipo === "anexo") return `📎 ${v}`;
  if (c.tipo === "ingresso") {
    const t = totalDoIngresso(form, r, pageId);
    const cupom = r[`${c.id}-cupom`];
    return [v === "meia" ? "Meia-entrada" : "Inteira", t ? (t.total > 0 ? reais(t.total) : "grátis") : "", cupom ? `cupom ${cupom}` : ""].filter(Boolean).join(" · ");
  }
  return v;
}

/** Rótulo curto ("CPF", "E-mail") vira pergunta de conversa; pergunta já escrita fica como está. */
function perguntaDe(c: Campo): string {
  const r = c.rotulo.trim();
  if (r.endsWith("?") || r.length > 28) return r;
  const porTipo: Partial<Record<Campo["tipo"], string>> = {
    cpf: "Qual é o seu CPF?",
    email: "Qual é o seu melhor e-mail?",
    whats: "Qual é o seu WhatsApp, com DDD?",
    cidade: "De qual cidade você é?",
    data: `${r}: qual a data?`,
    anexo: `Pode me mandar ${r.charAt(0).toLowerCase()}${r.slice(1)}?`,
  };
  if (c.base === "nome") return "Qual é o seu nome?";
  return porTipo[c.tipo] ?? r;
}

/** A frase que reage à resposta anterior, para a conversa não soar como formulário. */
function ligacao(anterior: Campo | undefined, c: Campo, r: Respostas, i: number, veioDaPagina: boolean): string {
  if (c.tipo === "info") return "";
  if (c.tipo === "lgpd") return "Última coisa, prometo. 🙏";
  if (!anterior) return veioDaPagina ? "Pra fechar a sua inscrição, só preciso de mais algumas coisinhas." : "Pra começar:";
  if (anterior.tipo === "info") return "";
  const v = r[anterior.id];
  if (!temValor(v)) return umaDe(["Sem problema, seguimos.", "Tudo bem, pode deixar sem.", "Sem problema!"], i);
  if (anterior.base === "nome") return `Prazer, ${primeiroNome(v)}! 😊`;
  switch (anterior.tipo) {
    case "whats":
      return "Anotado! É por lá que vai chegar a sua confirmação.";
    case "email":
      return "Show, e-mail anotado.";
    case "cpf":
      return "Valeu! CPF anotado.";
    case "cidade":
      return `Ah, ${String(v).split("/")[0].trim()}! Anotado.`;
    case "ingresso":
      return v === "meia" ? "Meia-entrada escolhida. 👍" : "Ingresso escolhido. 👍";
    case "anexo":
      return "Recebi o arquivo, obrigado!";
    case "multipla":
      return Array.isArray(v) && v.length > 1 ? "Boa, ótimas escolhas!" : "Boa escolha!";
    case "unica":
    case "lista": {
      const s = String(v).trim().toLowerCase();
      if (s === "sim") return "Que bom!";
      if (s === "não" || s === "nao") return "Tudo bem!";
      return umaDe(["Boa escolha!", "Legal, anotado!", "Entendi, obrigado!"], i);
    }
  }
  return umaDe(["Perfeito, obrigado!", "Anotado!", "Ótimo!", "Show!"], i);
}

/** Negrito com **asteriscos** (texto do aceite). */
const rico = (t: string): ReactNode[] => t.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p));

/**
 * Texto que vai sendo "digitado", como nos chats de IA. A fala da vez escreve aos poucos e avisa
 * quando termina (aí aparecem as opções e a caixa de escrever). O leitor de tela recebe o texto
 * inteiro de uma vez; o que vai aparecendo na tela fica escondido dele.
 */
function Escrita({ partes, vez = false, animar = true, fim, cresce }: { partes: Parte[]; vez?: boolean; animar?: boolean; fim?: () => void; cresce?: () => void }) {
  const letras = partes.map((p) => Array.from(p.texto));
  const total = letras.reduce((n, l) => n + l.length, 0);
  const [n, setN] = useState(vez && animar ? 0 : total);
  useEffect(() => {
    if (n >= total) {
      if (vez) fim?.();
      return;
    }
    cresce?.();
    const t = window.setTimeout(() => setN((x) => Math.min(total, x + 2)), 16);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, total, vez]);
  let resto = n;
  return (
    <>
      {partes.map((p, i) => {
        const visivel = letras[i].slice(0, Math.max(0, resto)).join("");
        resto -= letras[i].length;
        return (
          <p key={i} className={`${p.cls ?? ""}${visivel || i === 0 ? "" : " cv-sr"}`}>
            <span aria-hidden="true">{visivel}</span>
            <span className="cv-sr">{p.texto}</span>
          </p>
        );
      })}
    </>
  );
}

function partesDaPergunta(c: Campo, liga: string): Parte[] {
  if (c.tipo === "info") return [{ texto: c.rotulo }];
  const pergunta =
    c.tipo === "lgpd"
      ? "Posso usar seus dados para a inscrição e para te mandar os avisos do evento?"
      : c.tipo === "ingresso"
        ? "Agora, o seu ingresso. Qual você prefere?"
        : perguntaDe(c);
  return [...(liga ? [{ texto: liga, cls: "cv-liga" }] : []), { texto: pergunta, cls: "cv-pergunta" }];
}

/** A esfera da marca: a mesma do assistente do construtor. Parada; respira só enquanto "digita". */
function Orbe({ grande = false, ativo = false }: { grande?: boolean; ativo?: boolean }) {
  return (
    <span className={`cv-orbe${grande ? " cv-orbe-g" : ""}${ativo ? " cv-orbe-ativo" : ""}`} aria-hidden="true">
      <span className="cv-orbe-cor" />
      <span className="cv-orbe-luz" />
    </span>
  );
}

/** Fala do assistente: esfera ao lado e texto sem balão, como no chat do construtor. */
function Fala({ children, alerta = false, agora = false }: { children: ReactNode; alerta?: boolean; agora?: boolean }) {
  return (
    <div className="cv-fala" data-alerta={alerta || undefined} data-agora={agora || undefined}>
      <Orbe />
      <div className="cv-fala-txt">{children}</div>
    </div>
  );
}

function Digitando() {
  return (
    <div className="cv-fala" aria-label="Digitando">
      <Orbe ativo />
      <div className="cv-digitando">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

const Lapis = () => (
  <svg className="cv-lapis" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />
  </svg>
);

/** Resposta da pessoa. Tocar nela abre a correção ali mesmo. */
function Resposta({ id, texto, rotulo, editar }: { id?: string; texto: string; rotulo?: string; editar?: () => void }) {
  return (
    <div className="cv-eu" data-resposta={id}>
      {editar ? (
        <button type="button" className="cv-eu-bt" onClick={editar} aria-label={`${texto}. Corrigir ${rotulo ?? "resposta"}`} title="Toque para corrigir">
          <span className="cv-eu-ic">
            <Lapis />
          </span>
          <span className="cv-eu-bolha">{texto}</span>
        </button>
      ) : (
        <div className="cv-eu-bolha">{texto}</div>
      )}
    </div>
  );
}

/** Resposta de teste para cada tipo de campo (botão "Simular fluxo feliz"). */
function valorDeTeste(c: Campo): Valor {
  switch (c.tipo) {
    case "texto":
      return c.base === "nome" || c.validacao === "nome-completo" ? "Ana Teste" : "Teste";
    case "paragrafo":
      return "Resposta de teste.";
    case "email":
      return "ana.teste@exemplo.com";
    case "whats":
      return "(31) 9 9999-0000";
    case "cpf":
      return "529.982.247-25";
    case "data":
      return "1990-05-10";
    case "numero":
      return String(c.minimo ?? 1);
    case "cidade":
      return "Belo Horizonte/MG";
    case "unica":
    case "lista":
      return c.opcoes?.[0];
    case "multipla":
      return c.opcoes?.length ? [c.opcoes[0]] : undefined;
    case "lgpd":
      return "sim";
    case "anexo":
      return "comprovante.pdf · 120 KB";
    case "ingresso":
      return "inteira";
    default:
      return undefined;
  }
}

export function Conversa({
  form,
  ctx,
  iniciais = {},
  completo,
  ajuste,
  fechar,
}: {
  form: Formulario;
  ctx: Contexto;
  iniciais?: Respostas;
  completo: boolean;
  /** Ajuste da seção que abriu a conversa (campos escondidos ou trazidos só nela). */
  ajuste?: AjusteSecao;
  /** No modal: o X do cabeçalho da conversa (e o botão de teste fora da caixa). */
  fechar?: () => void;
}) {
  const etapas = useMemo(() => etapasDoModal(form, completo, ajuste), [form, completo, ajuste]);
  const perguntas = useMemo(() => etapas.flatMap((e) => e.campos.filter((c) => c.tipo !== "oculto")), [etapas]);
  // O que a pessoa já preencheu na página: vira o cartão dela no começo da conversa.
  const [daPagina] = useState(() => (completo ? [] : camposNaPagina(form, ajuste).filter((c) => c.tipo !== "info" && c.tipo !== "lgpd" && temValor(iniciais[c.id]))));
  const [r, setR] = useState<Respostas>(iniciais);
  const [feitos, setFeitos] = useState<string[]>([]);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [fase, setFase] = useState<Fase>({ tipo: "conversa" });
  const [editando, setEditando] = useState<string | null>(null);
  // De onde veio a correção: da própria resposta na conversa ou do resumo do fim.
  const [ondeEdita, setOndeEdita] = useState<"conversa" | "resumo">("conversa");
  const [confirmou, setConfirmou] = useState(false);
  const [enviando, setEnviando] = useState(false);
  // Escolha do ingresso (inteira ou meia, declaração e cupom) enquanto a pessoa não confirma.
  const [ingresso, setIngresso] = useState<Respostas>({});
  const [erroIngresso, setErroIngresso] = useState("");
  const [corpo, setCorpo] = useState<HTMLElement | null>(null);
  // O botão "Simular fluxo feliz" é só para teste: aparece na prévia do construtor ou com ?teste=1
  // no endereço (ex.: #/p/meu-evento?teste=1). Quem visita a página publicada não vê.
  const [modoTeste] = useState(() => ctx.previa || (typeof window !== "undefined" && /[?&]teste=1(?:&|$)/.test(window.location.hash + window.location.search)));
  const raiz = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const enviado = useRef(false);
  const timer = useRef(0);
  const [reduz] = useState(() => typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches));

  // A próxima pergunta é a primeira visível que ainda não foi respondida (a lógica vale na hora,
  // então corrigir uma resposta pode fazer aparecer ou sumir perguntas).
  const fila = perguntas.filter((c) => visivel(c, r));
  const atual = fila.find((c) => !feitos.includes(c.id));
  const respondidas = feitos.map((id) => perguntas.find((c) => c.id === id)).filter((c): c is Campo => Boolean(c && visivel(c, r)));
  const lista = atual && fase.tipo === "conversa" ? [...respondidas, atual] : respondidas;
  const total = totalDoIngresso(form, r, ctx.pageId);
  const cobra = fase.tipo === "pagamento" || Boolean(total && total.total > 0);
  const conversando = fase.tipo === "conversa" && !enviando;
  const nome = primeiroNome(r.nome ?? iniciais.nome);
  // Cada fala nova (a pergunta da vez, o resumo, o pagamento): primeiro os três pontinhos,
  // depois o texto sendo escrito; só então aparecem as opções e a caixa de escrever.
  const vez = fase.tipo === "conversa" ? (atual?.id ?? "conferir") : fase.tipo;
  const [vista, setVista] = useState<string | null>(null);
  const [escrita, setEscrita] = useState<string | null>(null);
  const digitando = vista !== vez;
  const pronto = !digitando && escrita === vez;
  const terminou = () => setEscrita(vez);
  const acompanhar = () => {
    const l = log.current;
    if (l) l.scrollTop = l.scrollHeight;
  };

  // Progresso: só uma linha. O que veio da página já conta; o pagamento é o último pedaço.
  const doModal = new Set(perguntas.map((c) => c.id));
  const contam = form.campos.filter((c) => !["oculto", "info", "etapa"].includes(c.tipo) && visivel(c, r));
  const prontas = contam.filter((c) => !doModal.has(c.id) || feitos.includes(c.id)).length;
  const progresso = fase.tipo === "pagamento" ? 0.92 : (contam.length ? prontas / contam.length : 1) * (cobra ? 0.84 : 0.94);

  useEffect(() => setCorpo(raiz.current?.ownerDocument.body ?? null), []);

  useEffect(() => {
    if (!digitando) return;
    const t = window.setTimeout(() => setVista(vez), reduz ? 0 : ESPERA_DIGITANDO);
    return () => window.clearTimeout(t);
  }, [vez, digitando, reduz]);

  // Texto informativo não espera resposta: segue sozinho depois de escrito.
  useEffect(() => {
    if (!atual || atual.tipo !== "info" || !pronto) return;
    const t = window.setTimeout(() => setFeitos((f) => [...f, atual.id]), 900);
    return () => window.clearTimeout(t);
  }, [atual, pronto]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Rola até a última mensagem e põe o foco onde a pessoa responde (caixa de texto ou primeira opção).
  useEffect(() => {
    if (editando) return;
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduz ? "auto" : "smooth" });
    if (!pronto) return;
    const alvo =
      raiz.current?.querySelector<HTMLElement>(".cv-escrever .cv-in:not(:disabled)") ?? raiz.current?.querySelector<HTMLElement>(".cv-agora button:not(:disabled)");
    alvo?.focus({ preventScroll: true });
  }, [feitos.length, digitando, pronto, aviso, fase.tipo, enviando, editando, confirmou, reduz]);

  // Corrigindo: mostra a correção aberta e põe o foco no campo dela.
  useEffect(() => {
    if (!editando) return;
    const bloco = raiz.current?.querySelector("[data-corrigindo]");
    bloco?.scrollIntoView({ block: "nearest", behavior: reduz ? "auto" : "smooth" });
    bloco?.querySelector<HTMLElement>("input:not([type=file]), textarea, .cv-chip")?.focus({ preventScroll: true });
  }, [editando, ondeEdita, reduz]);

  function responder(c: Campo, valor: Valor, extra: Respostas = {}) {
    setR((x) => {
      const n = { ...x };
      if (c.tipo === "ingresso") for (const k of Object.keys(n)) if (k.startsWith(`${c.id}-`)) delete n[k];
      Object.assign(n, extra);
      if (!temValor(valor)) delete n[c.id];
      else n[c.id] = valor!;
      return n;
    });
    if (editando === c.id) setEditando(null);
    else if (!feitos.includes(c.id)) setFeitos((f) => [...f, c.id]);
    setAviso(null);
    setConfirmou(false);
    enviado.current = false;
  }

  function editar(c: Campo, onde: "conversa" | "resumo" = "conversa") {
    // Corrigir volta a conversa para a conferência: o aviso some e o "Confirmar" reaparece depois.
    setAviso(null);
    setConfirmou(false);
    if (c.tipo === "ingresso") {
      // O ingresso volta a ser perguntado, já com a escolha de antes marcada.
      setIngresso(Object.fromEntries(Object.entries(r).filter(([k]) => k === c.id || k.startsWith(`${c.id}-`))));
      setFeitos((f) => f.filter((x) => x !== c.id));
      setEditando(null);
      return;
    }
    setOndeEdita(onde);
    setEditando(c.id);
  }
  const corrigindo = (c: Campo, onde: "conversa" | "resumo") => editando === c.id && ondeEdita === onde;

  function concluir(res: Resultado) {
    if (!res.ok) {
      enviado.current = false;
      setAviso({ texto: res.motivo, tentar: true });
      return;
    }
    setFase(res.aPagar ? { tipo: "pagamento", sub: res.sub } : { tipo: "fim", sub: res.sub, espera: res.espera });
  }

  function confirmar() {
    if (enviado.current) return;
    setConfirmou(true);
    const erros = validarCampos(form.campos, r);
    const chave = Object.keys(erros)[0];
    if (chave) {
      const c = form.campos.find((x) => x.id === chave) ?? form.campos.find((x) => chave.startsWith(`${x.id}-`));
      setAviso({ texto: `Opa, ${c ? rotuloCurto(c).toLowerCase() : "um dado"}: ${erros[chave].charAt(0).toLowerCase()}${erros[chave].slice(1)}`, campo: c?.id });
      return;
    }
    enviado.current = true;
    setAviso(null);
    setEnviando(true);
    const respostas = r;
    timer.current = window.setTimeout(
      () => {
        setEnviando(false);
        concluir(inscrever(form, respostas, ctx));
      },
      reduz ? 0 : 800,
    );
  }

  /**
   * Só para teste da POC: completa o que falta com dados de teste, envia, aprova o pagamento
   * simulado e mostra a tela final. Se o WhatsApp ou o e-mail já estiverem inscritos, tenta com outros.
   */
  function fluxoFeliz() {
    window.clearTimeout(timer.current);
    if (fase.tipo === "pagamento") {
      setFase({ tipo: "fim", sub: pagar(fase.sub, true, "pix", ctx.previa), espera: false });
      return;
    }
    const rr: Respostas = { ...r };
    for (let volta = 0; volta < 6; volta++) {
      let mudou = false;
      for (const c of form.campos) {
        if (c.tipo === "info" || c.tipo === "etapa" || c.tipo === "oculto" || !visivel(c, rr) || temValor(rr[c.id])) continue;
        const v = valorDeTeste(c);
        if (temValor(v)) {
          rr[c.id] = v!;
          mudou = true;
        }
      }
      if (!mudou) break;
    }
    let res = inscrever(form, rr, ctx);
    if (!res.ok) {
      const n = String(Date.now()).slice(-8);
      for (const c of form.campos) {
        if (c.tipo === "whats") rr[c.id] = `(31) 9 ${n.slice(0, 4)}-${n.slice(4)}`;
        if (c.tipo === "email") rr[c.id] = `teste.${n}@exemplo.com`;
      }
      res = inscrever(form, rr, ctx);
    }
    setR(rr);
    setEditando(null);
    if (!res.ok) {
      setAviso({ texto: res.motivo, tentar: true });
      return;
    }
    enviado.current = true;
    setFase({ tipo: "fim", sub: res.aPagar ? pagar(res.sub, true, "pix", ctx.previa) : res.sub, espera: res.espera });
  }

  function continuarIngresso(c: Campo) {
    const rr = { ...r, ...ingresso };
    const escolha = (rr[c.id] as string) ?? "inteira";
    if (c.ingresso?.meia && escolha === "meia" && rr[`${c.id}-declaro`] !== "sim") {
      setErroIngresso("Para a meia-entrada, marque a declaração.");
      return;
    }
    responder(c, escolha, Object.fromEntries(Object.entries(ingresso).filter(([k]) => k !== c.id)));
  }

  if (fase.tipo === "fim") return <Confirmacao sub={fase.sub} page={ctx.page} form={form} espera={fase.espera} previa={ctx.previa} />;

  // A caixa de baixo só recebe texto quando a pergunta da vez é de escrever e já terminou de aparecer.
  const alvo = conversando && !editando && atual && pronto ? atual : undefined;
  const escrevendo = (fase.tipo !== "conversa" || Boolean(atual) || !confirmou) && !pronto;
  const dica = enviando
    ? "Enviando a sua inscrição…"
    : fase.tipo === "pagamento"
      ? "Escolha como pagar acima"
      : editando
        ? "Corrigindo uma resposta acima"
        : !atual
          ? "Confira e confirme acima"
          : !pronto || atual.tipo === "info"
            ? "Escreva aqui"
            : atual.tipo === "multipla"
              ? "Marque as opções acima"
              : atual.tipo === "ingresso"
                ? "Escolha o ingresso acima"
                : atual.tipo === "anexo"
                  ? "Anexe o arquivo acima"
                  : "Escolha uma opção acima";
  // O resumo do fim: o que veio da página e as respostas da conversa.
  const resumo = [...daPagina, ...respondidas.filter((c) => c.tipo !== "info" && c.tipo !== "lgpd")];

  return (
    <div className="cv" ref={raiz}>
      <span className="cv-aura" aria-hidden="true" />

      <header className="cv-topo">
        <Orbe grande ativo={escrevendo || enviando} />
        <div className="cv-quem">
          <strong>{ctx.page?.title ?? "Inscrição"}</strong>
          <span>{escrevendo || enviando ? "digitando…" : ctx.page ? "Inscrição" : "Assistente da iGreen"}</span>
        </div>
        {ctx.previa && (
          <span className="cv-previa" title="A inscrição não é gravada">
            Prévia
          </span>
        )}
        {fechar && (
          <button type="button" className="cv-fechar" onClick={fechar} aria-label="Fechar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
        <span className="cv-linha-prog" aria-hidden="true">
          <i style={{ width: `${Math.round(progresso * 100)}%` }} />
        </span>
      </header>

      <div className="cv-log" ref={log} role="log" aria-live="polite" aria-label="Conversa da inscrição">
        <div className="cv-par">
          <Fala>
            <p>
              Oi{nome ? `, ${nome}` : ""}! 👋{" "}
              {ctx.page ? (
                <>
                  Que bom que você quer participar do <b>{ctx.page.title}</b>.
                </>
              ) : (
                "Que bom ter você por aqui."
              )}
            </p>
            <p>{daPagina.length ? "Já peguei os dados que você colocou na página:" : "Vou fazer a sua inscrição por aqui mesmo. É rapidinho, menos de um minuto."}</p>
          </Fala>

          {daPagina.length > 0 && (
            <div className="cv-eu">
              <div className="cv-dados">
                {daPagina.map((c) =>
                  corrigindo(c, "conversa") ? (
                    <div key={c.id} className="cv-dado cv-dado-edita" data-corrigindo="">
                      <span className="cv-dado-rot">{rotuloCurto(c)}</span>
                      <Corrigir c={c} valor={r[c.id]} salvar={(v) => responder(c, v)} cancelar={() => setEditando(null)} />
                    </div>
                  ) : (
                    <button
                      key={c.id}
                      type="button"
                      className="cv-dado"
                      disabled={!conversando}
                      onClick={() => editar(c)}
                      aria-label={`${rotuloCurto(c)}: ${textoDaResposta(c, r, form, ctx.pageId)}. Corrigir`}
                    >
                      <span className="cv-dado-txt">
                        <span className="cv-dado-rot">{rotuloCurto(c)}</span>
                        <span className="cv-dado-val">{temValor(r[c.id]) ? textoDaResposta(c, r, form, ctx.pageId) : "Não informado"}</span>
                      </span>
                      {conversando && (
                        <span className="cv-eu-ic">
                          <Lapis />
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Respondidas e a pergunta da vez numa lista só: ao responder, a pergunta continua no lugar
            e só a resposta entra. */}
        {lista.map((c, i) => {
          const daVez = c === atual;
          const mostra = daVez && pronto;
          return (
            <div key={c.id} className="cv-par">
              {daVez && digitando ? (
                <Digitando />
              ) : (
                <Fala agora={daVez}>
                  <Escrita partes={partesDaPergunta(c, ligacao(lista[i - 1], c, r, i, daPagina.length > 0))} vez={daVez} animar={!reduz} fim={terminou} cresce={acompanhar} />
                  {c.tipo === "lgpd" && (!daVez || pronto) && <p className="cv-termo">{rico(c.rotulo)}</p>}
                  {mostra && c.ajuda && c.tipo !== "info" && <p className="cv-ajuda">{c.ajuda}</p>}
                  {mostra && ESCOLHA.has(c.tipo) && <Escolhas key={c.id} c={c} valor={r[c.id]} escolher={(v) => responder(c, v)} pular={!c.obrigatorio && c.tipo !== "lgpd"} agora />}
                  {mostra && c.tipo === "anexo" && <PerguntaAnexo key={c.id} c={c} inicial="" enviar={(v) => responder(c, v)} pular={!c.obrigatorio} agora />}
                  {mostra && c.tipo === "ingresso" && (
                    <>
                      <div className="cv-cartao cv-ing">
                        <CampoView
                          campo={c}
                          r={{ ...r, ...ingresso }}
                          erros={erroIngresso ? { [`${c.id}-declaro`]: erroIngresso } : {}}
                          muda={(id, valor) => {
                            setErroIngresso("");
                            setIngresso((x) => {
                              const n = { ...x };
                              if (valor === undefined) delete n[id];
                              else n[id] = valor;
                              return n;
                            });
                          }}
                          pele="fm"
                          form={form}
                          pageId={ctx.pageId}
                        />
                      </div>
                      <div className="cv-rapidas cv-agora">
                        <button type="button" className="cv-bt-pri" onClick={() => continuarIngresso(c)}>
                          Continuar
                        </button>
                      </div>
                    </>
                  )}
                </Fala>
              )}
              {!daVez &&
                c.tipo !== "info" &&
                (corrigindo(c, "conversa") ? (
                  <div className="cv-eu" data-corrigindo="">
                    <div className="cv-corrige">
                      <p className="cv-corrige-tit">Corrigindo a resposta</p>
                      <Corrigir c={c} valor={r[c.id]} salvar={(v) => responder(c, v)} cancelar={() => setEditando(null)} />
                    </div>
                  </div>
                ) : (
                  <Resposta
                    id={c.id}
                    texto={textoDaResposta(c, r, form, ctx.pageId)}
                    rotulo={rotuloCurto(c)}
                    editar={conversando && c.tipo !== "lgpd" ? () => editar(c) : undefined}
                  />
                ))}
            </div>
          );
        })}

        {/* Tudo respondido: o resumo de tudo para conferir. Só aqui a inscrição é enviada. */}
        {!atual &&
          (fase.tipo === "conversa" && digitando ? (
            <Digitando />
          ) : (
            <div className="cv-par">
              <Fala agora={!confirmou && conversando}>
                <Escrita
                  partes={[
                    { texto: `Legal${nome ? `, ${nome}` : ""}! Agora eu tenho tudo o que preciso. 🙌`, cls: "cv-pergunta" },
                    { texto: "Dá uma conferida se está tudo certinho:", cls: "cv-liga" },
                  ]}
                  vez={fase.tipo === "conversa"}
                  animar={!reduz}
                  fim={terminou}
                  cresce={acompanhar}
                />
                {(pronto || fase.tipo !== "conversa" || confirmou) && (
                  <>
                    <div className="cv-resumo">
                      {resumo.map((c) =>
                        corrigindo(c, "resumo") ? (
                          <div key={c.id} className="cv-resumo-linha cv-resumo-edita" data-corrigindo="">
                            <span className="cv-resumo-rot">{rotuloCurto(c)}</span>
                            <Corrigir c={c} valor={r[c.id]} salvar={(v) => responder(c, v)} cancelar={() => setEditando(null)} />
                          </div>
                        ) : (
                          <button
                            key={c.id}
                            type="button"
                            className="cv-resumo-linha"
                            disabled={!conversando || confirmou}
                            onClick={() => editar(c, "resumo")}
                            aria-label={`${rotuloCurto(c)}: ${textoDaResposta(c, r, form, ctx.pageId)}. Corrigir`}
                          >
                            <span className="cv-resumo-rot">{rotuloCurto(c)}</span>
                            <span className="cv-resumo-val">{temValor(r[c.id]) ? textoDaResposta(c, r, form, ctx.pageId) : "Não informado"}</span>
                            {conversando && !confirmou && (
                              <span className="cv-eu-ic">
                                <Lapis />
                              </span>
                            )}
                          </button>
                        )
                      )}
                    </div>
                    {!confirmou && conversando && (
                      <>
                        <p className="cv-liga">Se algo estiver errado, é só tocar no item pra corrigir. Está tudo certo?</p>
                        <div className="cv-rapidas cv-agora">
                          <button type="button" className="cv-bt-pri" onClick={confirmar}>
                            {cobra ? "Tudo certo, ir para o pagamento" : "Tudo certo, confirmar inscrição"}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </Fala>
              {confirmou && <Resposta texto={cobra ? "Tudo certo! Vamos pro pagamento." : "Tudo certo, pode confirmar!"} />}
            </div>
          ))}
        {enviando && <Digitando />}
        {aviso && conversando && (
          <Fala alerta agora>
            <p className="cv-pergunta">{aviso.texto}</p>
            <div className="cv-rapidas cv-agora">
              {aviso.campo && (
                <button
                  type="button"
                  className="cv-bt-pri"
                  onClick={() => {
                    const c = form.campos.find((x) => x.id === aviso.campo);
                    if (c) editar(c, "resumo");
                  }}
                >
                  Corrigir
                </button>
              )}
              {aviso.tentar && (
                <button type="button" className="cv-bt-pri" onClick={confirmar}>
                  Tentar de novo
                </button>
              )}
            </div>
          </Fala>
        )}
        {fase.tipo === "pagamento" &&
          (digitando ? (
            <Digitando />
          ) : (
            <Fala agora>
              <Escrita
                partes={[{ texto: "Inscrição feita! 🎉 Agora é só pagar o ingresso pra garantir a sua vaga.", cls: "cv-pergunta" }]}
                vez
                animar={!reduz}
                fim={terminou}
                cresce={acompanhar}
              />
              {pronto && (
                <div className="cv-cartao cv-pag">
                  <Pagamento
                    sub={fase.sub}
                    previa={ctx.previa}
                    resolver={(sub, aprovado) => aprovado && setFase({ tipo: "fim", sub, espera: false })}
                    desistir={() => setFase({ tipo: "fim", sub: fase.sub, espera: false })}
                  />
                </div>
              )}
            </Fala>
          ))}
      </div>

      <div className="cv-compor">
        {alvo && !SEM_TEXTO.has(alvo.tipo) ? (
          <Entrada
            key={alvo.id}
            c={alvo}
            inicial={typeof r[alvo.id] === "string" ? (r[alvo.id] as string) : ""}
            enviar={(v) => responder(alvo, v)}
            pular={alvo.obrigatorio ? undefined : () => responder(alvo, undefined)}
          />
        ) : (
          <div className="cv-escrever" data-parado="">
            <div className="cv-caixa">
              <input className="cv-in" disabled placeholder={dica} aria-label={dica} />
              <button type="button" className="cv-enviar" disabled aria-label="Enviar resposta">
                <Seta />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botão de teste, fora da caixa do modal: faz o caminho feliz até a tela final */}
      {fechar &&
        corpo &&
        modoTeste &&
        createPortal(
          <button type="button" className="cv-teste" onClick={fluxoFeliz}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l10.5-6.5z" />
            </svg>
            <span>
              <b>Simular fluxo feliz</b>
              <small>Teste: preenche, confirma e paga</small>
            </span>
          </button>,
          corpo
        )}
    </div>
  );
}

/** Correção no próprio lugar da resposta: o mesmo jeito de responder, com Salvar e Cancelar. */
function Corrigir({ c, valor, salvar, cancelar }: { c: Campo; valor: Valor; salvar: (v: Valor) => void; cancelar: () => void }) {
  const esc = (e: KeyboardEvent) => {
    // Esc sai da correção sem fechar o modal.
    if (e.key === "Escape") {
      e.stopPropagation();
      cancelar();
    }
  };
  if (ESCOLHA.has(c.tipo) || c.tipo === "anexo")
    return (
      <div className="cv-inline" onKeyDown={esc}>
        {c.tipo === "anexo" ? (
          <PerguntaAnexo c={c} inicial={typeof valor === "string" ? valor : ""} enviar={salvar} pular={!c.obrigatorio} acao="Salvar" />
        ) : (
          <Escolhas c={c} valor={valor} escolher={salvar} pular={!c.obrigatorio && c.tipo !== "lgpd"} acao="Salvar" />
        )}
        <div className="cv-inline-acoes">
          <button type="button" className="cv-bt-leve" onClick={cancelar}>
            Cancelar
          </button>
        </div>
      </div>
    );
  return (
    <div onKeyDown={esc}>
      <Entrada c={c} inicial={typeof valor === "string" ? valor : ""} enviar={salvar} cancelar={cancelar} />
    </div>
  );
}

/** Respostas rápidas: as opções aparecem embaixo da pergunta, como nos apps de mensagem. */
function Escolhas({
  c,
  valor,
  escolher,
  pular,
  agora = false,
  acao = "Confirmar",
}: {
  c: Campo;
  valor?: Valor;
  escolher: (v: Valor) => void;
  pular?: boolean;
  agora?: boolean;
  acao?: string;
}) {
  const [lista, setLista] = useState<string[]>(Array.isArray(valor) ? valor : []);
  const cls = `cv-rapidas${agora ? " cv-agora" : ""}`;
  const botaoPular = pular && (
    <button type="button" className="cv-chip cv-chip-pular" onClick={() => escolher(undefined)}>
      Prefiro pular
    </button>
  );

  if (c.tipo === "lgpd")
    return (
      <div className={cls} role="group" aria-label="Aceite">
        <button type="button" className="cv-bt-pri" onClick={() => escolher("sim")}>
          Aceito
        </button>
      </div>
    );

  if (c.tipo === "multipla")
    return (
      <div className={cls} role="group" aria-label={c.rotulo}>
        {(c.opcoes ?? []).map((o) => {
          const marcado = lista.includes(o);
          return (
            <button key={o} type="button" className="cv-chip" aria-pressed={marcado} onClick={() => setLista((l) => (l.includes(o) ? l.filter((x) => x !== o) : [...l, o]))}>
              {marcado && <Check />}
              {o}
            </button>
          );
        })}
        <span className="cv-rapidas-fim">
          <button type="button" className="cv-bt-pri" disabled={!lista.length} onClick={() => escolher(lista)}>
            {lista.length ? `${acao} (${lista.length})` : acao}
          </button>
          {botaoPular}
        </span>
      </div>
    );

  return (
    <div className={cls} role="group" aria-label={c.rotulo}>
      {(c.opcoes ?? []).map((o) => (
        <button key={o} type="button" className="cv-chip" aria-pressed={valor === o} onClick={() => escolher(o)}>
          {valor === o && <Check />}
          {o}
        </button>
      ))}
      {botaoPular}
    </div>
  );
}

function PerguntaAnexo({
  c,
  inicial,
  enviar,
  pular,
  agora = false,
  acao = "Enviar arquivo",
}: {
  c: Campo;
  inicial: string;
  enviar: (v: string | undefined) => void;
  pular?: boolean;
  agora?: boolean;
  acao?: string;
}) {
  const [v, setV] = useState(inicial);
  return (
    <>
      <div className="cv-cartao">
        <Anexo c={c} valor={v} muda={(x) => setV(x ?? "")} />
      </div>
      <div className={`cv-rapidas${agora ? " cv-agora" : ""}`}>
        <button type="button" className="cv-bt-pri" disabled={!v} onClick={() => enviar(v)}>
          {acao}
        </button>
        {pular && (
          <button type="button" className="cv-chip cv-chip-pular" onClick={() => enviar(undefined)}>
            Prefiro pular
          </button>
        )}
      </div>
    </>
  );
}

/**
 * Onde a pessoa escreve, com a máscara do tipo. Vazio em pergunta opcional = pular.
 * Com `cancelar`, vira a correção no lugar da resposta (campo + Cancelar e Salvar).
 */
function Entrada({
  c,
  inicial,
  enviar,
  cancelar,
  pular,
}: {
  c: Campo;
  inicial: string;
  enviar: (v: string | undefined) => void;
  cancelar?: () => void;
  /** Pergunta opcional: o botão "Pular" fica dentro da caixa, ao lado de enviar. */
  pular?: () => void;
}) {
  const mascara = c.tipo === "whats" ? mascaraWhats : c.tipo === "cpf" ? mascaraCpf : (s: string) => s;
  const [v, setV] = useState(() => mascara(inicial));
  const [erro, setErro] = useState("");

  const mandar = (e?: FormEvent) => {
    e?.preventDefault();
    const vazio = c.tipo === "cidade" ? !v.replace("/", "").trim() : !v.trim();
    if (vazio && !c.obrigatorio) return enviar(undefined);
    const valor = vazio ? undefined : v.trim();
    const problema = validarCampo(c, valor);
    if (problema) return setErro(problema);
    enviar(valor);
  };
  const muda = (x: string) => {
    setErro("");
    setV(x);
  };

  let campo: ReactNode;
  if (c.tipo === "cidade") {
    const [cidade, uf = ""] = v.includes("/") ? [v.slice(0, v.lastIndexOf("/")), v.slice(v.lastIndexOf("/") + 1)] : [v, ""];
    campo = (
      <>
        <input className="cv-in" value={cidade} onChange={(e) => muda(`${e.target.value}/${uf}`)} placeholder={c.exemplo ?? "Sua cidade"} aria-label={c.rotulo} autoComplete="address-level2" aria-invalid={erro ? true : undefined} />
        <select className="cv-in cv-uf" value={uf} data-vazio={!uf || undefined} onChange={(e) => muda(`${cidade}/${e.target.value}`)} aria-label="UF">
          <option value="">UF</option>
          {UFS.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </>
    );
  } else if (c.tipo === "paragrafo") {
    campo = (
      <textarea
        className="cv-in"
        rows={1}
        value={v}
        onChange={(e) => muda(e.target.value)}
        onKeyDown={(e) => {
          // Enter envia; Shift+Enter quebra a linha.
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            mandar();
          }
        }}
        placeholder={c.exemplo ?? "Escreva aqui"}
        aria-label={c.rotulo}
        maxLength={c.max}
        aria-invalid={erro ? true : undefined}
      />
    );
  } else {
    const tipo = { email: "email", whats: "tel", data: "date", numero: "number" }[c.tipo as string] ?? "text";
    campo = (
      <input
        className="cv-in"
        type={tipo}
        inputMode={c.tipo === "whats" ? "tel" : c.tipo === "cpf" || c.tipo === "numero" ? "numeric" : undefined}
        autoComplete={c.tipo === "email" ? "email" : c.tipo === "whats" ? "tel-national" : c.base === "nome" ? "name" : undefined}
        value={v}
        onChange={(e) => muda(mascara(e.target.value))}
        placeholder={c.exemplo ?? (c.tipo === "whats" ? "(00) 0 0000-0000" : "Escreva aqui")}
        aria-label={c.rotulo}
        maxLength={c.max ?? (c.tipo === "whats" ? 20 : undefined)}
        aria-invalid={erro ? true : undefined}
      />
    );
  }

  if (cancelar)
    return (
      <form className="cv-inline" onSubmit={mandar} noValidate>
        <div className="cv-campo" data-erro={erro ? "" : undefined}>
          {campo}
        </div>
        {erro && (
          <p className="cv-erro" role="alert">
            {erro}
          </p>
        )}
        <div className="cv-inline-acoes">
          <button type="button" className="cv-bt-leve" onClick={cancelar}>
            Cancelar
          </button>
          <button type="submit" className="cv-bt-pri cv-bt-p">
            Salvar
          </button>
        </div>
      </form>
    );

  return (
    <form className="cv-escrever" onSubmit={mandar} noValidate>
      {erro && (
        <p className="cv-erro" role="alert">
          {erro}
        </p>
      )}
      <div className="cv-caixa" data-erro={erro ? "" : undefined}>
        {campo}
        {pular && (
          <button type="button" className="cv-pular" onClick={pular}>
            Pular
          </button>
        )}
        <button type="submit" className="cv-enviar" aria-label="Enviar resposta">
          <Seta />
        </button>
      </div>
    </form>
  );
}

const Seta = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

const Check = () => (
  <svg className="cv-check" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
