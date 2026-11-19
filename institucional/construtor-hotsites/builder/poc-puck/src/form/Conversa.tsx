import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { camposNaPagina, dividirEtapas, etapasDoModal, mascaraCpf, mascaraWhats, UFS, validarCampo, validarCampos, visivel, type Campo, type Formulario } from "../lib/formularios";
import { reais } from "../lib/ingresso";
import { inscrever, totalDoIngresso, type Resultado } from "../lib/inscrever";
import type { Respostas, Submission } from "../lib/submissions";
import { Anexo, Campo as CampoView } from "./Campo";
import { Confirmacao } from "./Confirmacao";
import { Pagamento, type Contexto } from "./Fluxo";
import "./conversa.css";

/* Inscrição como conversa, no jeito dos apps de mensagem:
   - uma pergunta por vez; nas de escolha, as opções aparecem embaixo da mensagem (respostas rápidas)
     e a caixa de texto fica parada;
   - o que veio da página aparece num cartão do lado da pessoa;
   - toda resposta tem um lápis para corrigir, e nada é enviado antes de a pessoa confirmar;
   - no topo, o progresso por etapas. */

type Fase = { tipo: "conversa" } | { tipo: "pagamento"; sub: Submission } | { tipo: "fim"; sub: Submission; espera: boolean };
type Aviso = { texto: string; campo?: string; tentar?: boolean };

const primeiroNome = (v: unknown) => (typeof v === "string" ? v.trim().split(/\s+/)[0] : "");
const temValor = (v: unknown) => v !== undefined && v !== "" && !(Array.isArray(v) && !v.length);
const ESPERA_DIGITANDO = 520;
const ESCOLHA = new Set<Campo["tipo"]>(["unica", "lista", "multipla", "lgpd"]);
const SEM_TEXTO = new Set<Campo["tipo"]>(["unica", "lista", "multipla", "lgpd", "ingresso", "anexo", "info", "oculto", "etapa"]);
const CURTO: Record<string, string> = { nome: "Nome", whats: "WhatsApp", email: "E-mail", cidade: "Cidade" };

/** Nome curto do campo, para o cartão de dados e a faixa de correção. */
const rotuloCurto = (c: Campo) => (c.base ? CURTO[c.base] : c.rotulo.replace(/\s*\([^)]*\)/g, "").trim()) || "Resposta";

/** A resposta como aparece na bolha da pessoa. */
function textoDaResposta(c: Campo, r: Respostas, form: Formulario, pageId: string): string {
  const v = r[c.id];
  if (!temValor(v)) return "Prefiro pular";
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
    email: "Qual é o seu e-mail?",
    whats: "Qual é o seu WhatsApp, com DDD?",
    cidade: "De que cidade você é?",
    data: `${r}: qual a data?`,
    anexo: `${r}: pode anexar aqui embaixo.`,
  };
  if (c.base === "nome") return "Como você se chama?";
  return porTipo[c.tipo] ?? r;
}

/** Negrito com **asteriscos** (texto do aceite). */
const rico = (t: string): ReactNode[] => t.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p));

const textoDaPergunta = (c: Campo): ReactNode =>
  c.tipo === "lgpd" ? rico(c.rotulo) : c.tipo === "ingresso" ? "Agora, o seu ingresso. Qual você prefere?" : c.tipo === "info" ? c.rotulo : perguntaDe(c);

/** A esfera da marca: a mesma do assistente do construtor. Parada; respira só enquanto "digita". */
function Orbe({ grande = false, ativo = false }: { grande?: boolean; ativo?: boolean }) {
  return (
    <span className={`cv-orbe${grande ? " cv-orbe-g" : ""}${ativo ? " cv-orbe-ativo" : ""}`} aria-hidden="true">
      <span className="cv-orbe-cor" />
      <span className="cv-orbe-luz" />
    </span>
  );
}

function Bolha({ de, children, alerta = false }: { de: "bot" | "eu"; children: ReactNode; alerta?: boolean }) {
  return (
    <div className="cv-linha" data-de={de}>
      {de === "bot" && <Orbe />}
      <div className="cv-bolha" data-alerta={alerta || undefined}>
        {children}
      </div>
    </div>
  );
}

function Digitando({ texto }: { texto?: string }) {
  return (
    <div className="cv-linha" data-de="bot" aria-label={texto ?? "Escrevendo"}>
      <Orbe ativo />
      <div className="cv-bolha cv-digitando">
        <i />
        <i />
        <i />
        {texto && <span>{texto}</span>}
      </div>
    </div>
  );
}

function Lapis({ rotulo, onClick }: { rotulo: string; onClick: () => void }) {
  return (
    <button type="button" className="cv-lapis" onClick={onClick} aria-label={rotulo} title={rotulo}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />
      </svg>
    </button>
  );
}

type Segmento = { titulo: string; ids: string[]; total: number; feitas: number };

function Progresso({ segmentos, ativo }: { segmentos: Segmento[]; ativo: number }) {
  if (!segmentos.length) return null;
  return (
    <ol className="cv-prog" aria-label="Etapas da inscrição" data-um={segmentos.length === 1 || undefined}>
      {segmentos.map((s, i) => {
        const pct = s.total ? Math.round((s.feitas / s.total) * 100) : 0;
        return (
          <li key={`${s.titulo}-${i}`} data-estado={pct >= 100 ? "feito" : i === ativo ? "agora" : "falta"} aria-current={i === ativo ? "step" : undefined}>
            <span className="cv-prog-barra">
              <i style={{ width: `${pct}%` }} />
            </span>
            <span className="cv-prog-rot">{s.titulo}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function Conversa({
  form,
  ctx,
  iniciais = {},
  completo,
  fechar,
}: {
  form: Formulario;
  ctx: Contexto;
  iniciais?: Respostas;
  completo: boolean;
  /** No modal: o X do cabeçalho da conversa. */
  fechar?: () => void;
}) {
  const etapas = useMemo(() => etapasDoModal(form, completo), [form, completo]);
  const perguntas = useMemo(() => etapas.flatMap((e) => e.campos.filter((c) => c.tipo !== "oculto")), [etapas]);
  const etapaDe = useMemo(() => new Map(etapas.flatMap((e) => e.campos.map((c) => [c.id, e.titulo] as const))), [etapas]);
  // O que a pessoa já preencheu na página: vira o cartão "seus dados", com lápis em cada linha.
  const [daPagina] = useState(() => (completo ? [] : camposNaPagina(form).filter((c) => c.tipo !== "info" && c.tipo !== "lgpd" && temValor(iniciais[c.id]))));
  const [r, setR] = useState<Respostas>(iniciais);
  const [feitos, setFeitos] = useState<string[]>([]);
  const [digitando, setDigitando] = useState(true);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [fase, setFase] = useState<Fase>({ tipo: "conversa" });
  const [editando, setEditando] = useState<string | null>(null);
  const [confirmou, setConfirmou] = useState(false);
  const [enviando, setEnviando] = useState(false);
  // Escolha do ingresso (inteira ou meia, declaração e cupom) enquanto a pessoa não confirma.
  const [ingresso, setIngresso] = useState<Respostas>({});
  const [erroIngresso, setErroIngresso] = useState("");
  const raiz = useRef<HTMLDivElement>(null);
  const fim = useRef<HTMLDivElement>(null);
  const enviado = useRef(false);
  const timer = useRef(0);
  const [reduz] = useState(() => typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches));

  // A próxima pergunta é a primeira visível que ainda não foi respondida (a lógica vale na hora,
  // então corrigir uma resposta pode fazer aparecer ou sumir perguntas).
  const fila = perguntas.filter((c) => visivel(c, r));
  const atual = fila.find((c) => !feitos.includes(c.id));
  const respondidas = feitos.map((id) => perguntas.find((c) => c.id === id)).filter((c): c is Campo => Boolean(c && visivel(c, r)));
  const faltam = fila.filter((c) => c.tipo !== "info" && !feitos.includes(c.id)).length;
  const [totalInicial] = useState(() => perguntas.filter((c) => visivel(c, iniciais) && c.tipo !== "info" && c.tipo !== "lgpd").length);
  const total = totalDoIngresso(form, r, ctx.pageId);
  const cobra = fase.tipo === "pagamento" || Boolean(total && total.total > 0);
  const conversando = fase.tipo === "conversa" && !enviando;
  const campoEditado = editando && conversando ? form.campos.find((c) => c.id === editando) : undefined;
  const nome = primeiroNome(r.nome ?? iniciais.nome);

  // Progresso por etapas do formulário inteiro: o que veio da página já conta como feito.
  const doModal = new Set(perguntas.map((c) => c.id));
  const segmentos: Segmento[] = dividirEtapas(form.campos)
    .map((e) => {
      const qs = e.campos.filter((c) => c.tipo !== "oculto" && c.tipo !== "info" && visivel(c, r));
      return { titulo: e.titulo, ids: e.campos.map((c) => c.id), total: qs.length, feitas: qs.filter((c) => !doModal.has(c.id) || feitos.includes(c.id)).length };
    })
    .filter((s) => s.total > 0);
  if (cobra) segmentos.push({ titulo: "Pagamento", ids: [], total: 2, feitas: fase.tipo === "pagamento" ? 1 : 0 });
  const ativo = fase.tipo === "pagamento" ? segmentos.length - 1 : atual ? segmentos.findIndex((s) => s.ids.includes(atual.id)) : -1;

  const status = enviando
    ? "enviando…"
    : fase.tipo === "pagamento"
      ? "Último passo: o pagamento"
      : digitando && atual
        ? "digitando…"
        : !atual
          ? "Tudo respondido"
          : faltam > 1
            ? `Faltam ${faltam} perguntas`
            : faltam === 1
              ? "Última pergunta"
              : "Quase lá";

  // Nova pergunta: o "digitando" aparece um instante antes dela.
  useEffect(() => {
    setDigitando(true);
    const t = window.setTimeout(() => setDigitando(false), reduz ? 0 : ESPERA_DIGITANDO);
    return () => window.clearTimeout(t);
  }, [atual?.id, fase.tipo, reduz]);

  // Texto informativo não espera resposta: segue sozinho.
  useEffect(() => {
    if (!atual || atual.tipo !== "info" || digitando) return;
    const t = window.setTimeout(() => setFeitos((f) => [...f, atual.id]), 700);
    return () => window.clearTimeout(t);
  }, [atual, digitando]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Rola até a última mensagem e põe o foco onde a pessoa responde (caixa de texto ou primeira opção).
  useEffect(() => {
    if (editando) return;
    fim.current?.scrollIntoView({ block: "end", behavior: reduz ? "auto" : "smooth" });
    if (digitando) return;
    const alvo =
      raiz.current?.querySelector<HTMLElement>(".cv-escrever .cv-in:not(:disabled)") ?? raiz.current?.querySelector<HTMLElement>(".cv-rapidas-agora button:not(:disabled)");
    alvo?.focus({ preventScroll: true });
  }, [feitos.length, digitando, aviso, fase.tipo, enviando, editando, confirmou, reduz]);

  // Corrigindo: mostra a resposta que vai mudar e leva o foco para a faixa de correção.
  useEffect(() => {
    if (!editando) return;
    raiz.current?.querySelector(`[data-resposta="${CSS.escape(editando)}"]`)?.scrollIntoView({ block: "nearest", behavior: reduz ? "auto" : "smooth" });
    raiz.current?.querySelector<HTMLElement>(".cv-edita .cv-chip, .cv-edita input, .cv-escrever .cv-in:not(:disabled)")?.focus({ preventScroll: true });
  }, [editando, reduz]);

  function responder(c: Campo, valor: string | string[] | undefined, extra: Respostas = {}) {
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

  function editar(c: Campo) {
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
    setEditando(c.id);
  }

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
      setAviso({ texto: `${c ? rotuloCurto(c) : "Um dado"}: ${erros[chave]}`, campo: c?.id });
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
      reduz ? 0 : 700,
    );
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

  let etapaAnterior = "";
  const divisor = (c: Campo) => {
    const e = etapaDe.get(c.id) ?? "";
    const mostra = etapas.length > 1 && e !== etapaAnterior;
    etapaAnterior = e;
    return mostra ? (
      <p className="cv-etapa" key={`etapa-${c.id}`}>
        {e}
      </p>
    ) : null;
  };

  // A caixa de baixo só recebe texto quando a pergunta da vez (ou a resposta sendo corrigida) é de escrever.
  const alvo = conversando ? (campoEditado ?? (atual && !digitando ? atual : undefined)) : undefined;
  const dica = enviando
    ? "Enviando sua inscrição…"
    : fase.tipo === "pagamento"
      ? "Conclua o pagamento acima"
      : campoEditado
        ? campoEditado.tipo === "anexo"
          ? "Anexe o novo arquivo acima"
          : "Escolha a nova resposta acima"
        : !atual
          ? "Confirme a inscrição acima"
          : digitando || atual.tipo === "info"
            ? "Escreva sua resposta"
            : atual.tipo === "multipla"
              ? "Marque as opções acima"
              : atual.tipo === "ingresso"
                ? "Escolha o ingresso acima"
                : atual.tipo === "anexo"
                  ? "Anexe o arquivo acima"
                  : atual.tipo === "lgpd"
                    ? "Toque em Aceito acima"
                    : "Escolha uma opção acima";

  return (
    <div className="cv" ref={raiz}>
      <span className="cv-aura" aria-hidden="true" />
      <span className="cv-aura cv-aura-2" aria-hidden="true" />

      <header className="cv-topo">
        <div className="cv-quem">
          <Orbe grande ativo={(digitando && fase.tipo === "conversa" && Boolean(atual)) || enviando} />
          <div className="cv-quem-txt">
            <strong>{ctx.page?.title ?? "Inscrição"}</strong>
            <span data-vivo={digitando || enviando || undefined}>{status}</span>
          </div>
          {ctx.previa && (
            <span className="cv-previa" title="Prévia: a inscrição não é gravada">
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
        </div>
        <Progresso segmentos={segmentos} ativo={ativo} />
      </header>

      <div className="cv-log" role="log" aria-live="polite" aria-label="Conversa da inscrição">
        <Bolha de="bot">
          <p>
            Oi{nome ? `, ${nome}` : ""}! 👋 {daPagina.length ? "Falta pouco para garantir sua vaga" : "Vamos fazer sua inscrição"}
            {ctx.page ? (
              <>
                {" "}
                no <b>{ctx.page.title}</b>
              </>
            ) : null}
            .
          </p>
        </Bolha>
        {daPagina.length > 0 ? (
          <>
            <Bolha de="bot">
              <p>Já anotei o que você preencheu na página:</p>
            </Bolha>
            <div className="cv-linha" data-de="eu">
              <dl className="cv-dados">
                {daPagina.map((c) => (
                  <div key={c.id} className="cv-dado" data-resposta={c.id} data-editando={editando === c.id || undefined}>
                    <dt>{rotuloCurto(c)}</dt>
                    <dd>{temValor(r[c.id]) ? textoDaResposta(c, r, form, ctx.pageId) : "Não informado"}</dd>
                    {conversando && <Lapis rotulo={`Corrigir ${rotuloCurto(c)}`} onClick={() => editar(c)} />}
                  </div>
                ))}
              </dl>
            </div>
          </>
        ) : (
          totalInicial > 0 && (
            <Bolha de="bot">
              <p>{totalInicial > 1 ? `São ${totalInicial} perguntas rápidas. Leva menos de um minuto.` : "É só uma pergunta rápida."}</p>
            </Bolha>
          )
        )}

        {/* Respondidas e a pergunta da vez numa lista só: ao responder, a pergunta continua no lugar
            (não pisca de novo) e só a resposta entra. */}
        {(atual && fase.tipo === "conversa" ? [...respondidas, atual] : respondidas).map((c) => {
          const daVez = c === atual;
          return (
            <div key={c.id} className="cv-par">
              {divisor(c)}
              {daVez && digitando ? (
                <Digitando />
              ) : (
                <Bolha de="bot">
                  <p>{textoDaPergunta(c)}</p>
                  {daVez && c.ajuda && c.tipo !== "info" && <p className="cv-ajuda">{c.ajuda}</p>}
                </Bolha>
              )}
              {!daVez && c.tipo !== "info" && (
                <div className="cv-linha" data-de="eu" data-resposta={c.id} data-editando={editando === c.id || undefined}>
                  {conversando && c.tipo !== "lgpd" && <Lapis rotulo={`Corrigir: ${rotuloCurto(c)}`} onClick={() => editar(c)} />}
                  <div className="cv-bolha">
                    <p>{textoDaResposta(c, r, form, ctx.pageId)}</p>
                  </div>
                </div>
              )}
              {daVez && !digitando && (
                <>
                  {ESCOLHA.has(c.tipo) && <Escolhas key={c.id} c={c} valor={r[c.id]} escolher={(v) => responder(c, v)} pular={!c.obrigatorio && c.tipo !== "lgpd"} agora />}
                  {c.tipo === "anexo" && <PerguntaAnexo key={c.id} c={c} inicial="" enviar={(v) => responder(c, v)} pular={!c.obrigatorio} agora />}
                  {c.tipo === "ingresso" && (
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
                      <div className="cv-rapidas cv-rapidas-agora">
                        <button type="button" className="cv-chip cv-chip-pri" onClick={() => continuarIngresso(c)}>
                          Continuar
                        </button>
                      </div>
                    </>
                  )}
                  {!SEM_TEXTO.has(c.tipo) && !c.obrigatorio && (
                    <div className="cv-rapidas">
                      <button type="button" className="cv-chip cv-chip-leve" onClick={() => responder(c, undefined)}>
                        Pular esta
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Tudo respondido: a pessoa confere e confirma. Só aqui a inscrição é enviada. */}
        {!atual && !(digitando && fase.tipo === "conversa") && (
          <>
            <Bolha de="bot">
              <p>
                Pronto{nome ? `, ${nome}` : ""}! Confira suas respostas. Se algo estiver errado, toque no lápis ao lado dela para corrigir.
              </p>
            </Bolha>
            {confirmou ? (
              <Bolha de="eu">
                <p>{cobra ? "Confirmar e ir para o pagamento" : "Confirmar inscrição"}</p>
              </Bolha>
            ) : (
              conversando && (
                <div className="cv-rapidas cv-rapidas-agora">
                  <button type="button" className="cv-chip cv-chip-pri" onClick={confirmar}>
                    {cobra ? "Confirmar e ir para o pagamento" : "Confirmar inscrição"}
                  </button>
                </div>
              )
            )}
          </>
        )}
        {enviando && <Digitando texto="Enviando sua inscrição" />}
        {aviso && conversando && (
          <>
            <Bolha de="bot" alerta>
              <p>{aviso.texto}</p>
            </Bolha>
            <div className="cv-rapidas cv-rapidas-agora">
              {aviso.campo && (
                <button
                  type="button"
                  className="cv-chip cv-chip-pri"
                  onClick={() => {
                    const c = form.campos.find((x) => x.id === aviso.campo);
                    if (c) editar(c);
                  }}
                >
                  Corrigir
                </button>
              )}
              {aviso.tentar && (
                <button type="button" className="cv-chip cv-chip-pri" onClick={confirmar}>
                  Tentar de novo
                </button>
              )}
            </div>
          </>
        )}
        {fase.tipo === "pagamento" &&
          (digitando ? (
            <Digitando />
          ) : (
            <>
              <Bolha de="bot">
                <p>Inscrição recebida! Último passo: o pagamento do ingresso.</p>
              </Bolha>
              <div className="cv-cartao cv-pag">
                <Pagamento
                  sub={fase.sub}
                  previa={ctx.previa}
                  resolver={(sub, aprovado) => aprovado && setFase({ tipo: "fim", sub, espera: false })}
                  desistir={() => setFase({ tipo: "fim", sub: fase.sub, espera: false })}
                />
              </div>
            </>
          ))}
        <div ref={fim} />
      </div>

      <div
        className="cv-compor"
        onKeyDown={(e) => {
          // Esc sai da correção sem fechar o modal.
          if (e.key === "Escape" && editando) {
            e.stopPropagation();
            setEditando(null);
          }
        }}
      >
        {campoEditado && (
          <div className="cv-edita">
            <div className="cv-edita-topo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />
              </svg>
              <span>
                Corrigindo <b>{rotuloCurto(campoEditado)}</b>
              </span>
              <button type="button" className="cv-edita-sair" onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </div>
            {ESCOLHA.has(campoEditado.tipo) && (
              <Escolhas key={campoEditado.id} c={campoEditado} valor={r[campoEditado.id]} escolher={(v) => responder(campoEditado, v)} pular={!campoEditado.obrigatorio} acao="Salvar" />
            )}
            {campoEditado.tipo === "anexo" && (
              <PerguntaAnexo
                key={campoEditado.id}
                c={campoEditado}
                inicial={typeof r[campoEditado.id] === "string" ? (r[campoEditado.id] as string) : ""}
                enviar={(v) => responder(campoEditado, v)}
                pular={!campoEditado.obrigatorio}
                acao="Salvar"
              />
            )}
          </div>
        )}
        {alvo && !SEM_TEXTO.has(alvo.tipo) ? (
          <Entrada key={`${alvo.id}-${campoEditado ? "corrige" : "nova"}`} c={alvo} inicial={typeof r[alvo.id] === "string" ? (r[alvo.id] as string) : ""} enviar={(v) => responder(alvo, v)} />
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
  valor?: string | string[];
  escolher: (v: string | string[] | undefined) => void;
  pular?: boolean;
  agora?: boolean;
  acao?: string;
}) {
  const [lista, setLista] = useState<string[]>(Array.isArray(valor) ? valor : []);
  const cls = `cv-rapidas${agora ? " cv-rapidas-agora" : ""}`;
  const botaoPular = pular && (
    <button type="button" className="cv-chip cv-chip-leve" onClick={() => escolher(undefined)}>
      Pular
    </button>
  );

  if (c.tipo === "lgpd")
    return (
      <div className={cls} role="group" aria-label="Aceite">
        <button type="button" className="cv-chip cv-chip-pri" onClick={() => escolher("sim")}>
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
        <button type="button" className="cv-chip cv-chip-pri" disabled={!lista.length} onClick={() => escolher(lista)}>
          {lista.length ? `${acao} (${lista.length})` : acao}
        </button>
        {botaoPular}
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
      <div className={`cv-rapidas${agora ? " cv-rapidas-agora" : ""}`}>
        <button type="button" className="cv-chip cv-chip-pri" disabled={!v} onClick={() => enviar(v)}>
          {acao}
        </button>
        {pular && (
          <button type="button" className="cv-chip cv-chip-leve" onClick={() => enviar(undefined)}>
            Pular
          </button>
        )}
      </div>
    </>
  );
}

/** A caixa de escrever, com a máscara do tipo. Vazia em pergunta opcional = pular. */
function Entrada({ c, inicial, enviar }: { c: Campo; inicial: string; enviar: (v: string | undefined) => void }) {
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

  return (
    <form className="cv-escrever" onSubmit={mandar} noValidate>
      {erro && (
        <p className="cv-erro" role="alert">
          {erro}
        </p>
      )}
      <div className="cv-caixa" data-erro={erro ? "" : undefined}>
        {campo}
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
