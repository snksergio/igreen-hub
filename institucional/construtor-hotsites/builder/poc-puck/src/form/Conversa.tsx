import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { camposNaPagina, etapasDoModal, mascaraCpf, mascaraWhats, UFS, validarCampo, validarCampos, visivel, type Campo, type Formulario } from "../lib/formularios";
import { reais } from "../lib/ingresso";
import { inscrever, totalDoIngresso, type Resultado } from "../lib/inscrever";
import type { Respostas, Submission } from "../lib/submissions";
import { Anexo, Campo as CampoView } from "./Campo";
import { Confirmacao } from "./Confirmacao";
import { Pagamento, type Contexto } from "./Fluxo";
import "./conversa.css";

/* Inscrição como conversa, no mesmo jeito do chat do assistente do construtor: cores neutras,
   a esfera da marca falando sem balão, as respostas da pessoa num balão cinza à direita.
   - uma pergunta por vez, com uma frase de ligação ("Prazer, Ana!", "Anotado.") para soar como gente;
   - perguntas de escolha: as opções aparecem embaixo da pergunta e a caixa de texto fica parada;
   - o que veio da página aparece num cartão da pessoa; tocar numa resposta corrige ali mesmo;
   - nada é enviado antes de a pessoa conferir e confirmar;
   - o progresso é só uma linha fina no topo, sem nomes de etapa. */

type Fase = { tipo: "conversa" } | { tipo: "pagamento"; sub: Submission } | { tipo: "fim"; sub: Submission; espera: boolean };
type Aviso = { texto: string; campo?: string; tentar?: boolean };
type Valor = string | string[] | undefined;

const primeiroNome = (v: unknown) => (typeof v === "string" ? v.trim().split(/\s+/)[0] : "");
const temValor = (v: unknown) => v !== undefined && v !== "" && !(Array.isArray(v) && !v.length);
const ESPERA_DIGITANDO = 480;
const ESCOLHA = new Set<Campo["tipo"]>(["unica", "lista", "multipla", "lgpd"]);
const SEM_TEXTO = new Set<Campo["tipo"]>(["unica", "lista", "multipla", "lgpd", "ingresso", "anexo", "info", "oculto", "etapa"]);
const CURTO: Record<string, string> = { nome: "Nome", whats: "WhatsApp", email: "E-mail", cidade: "Cidade" };
const LIGACOES = ["Anotado.", "Perfeito.", "Combinado.", "Show, obrigado!", "Entendi."];

/** Nome curto do campo, para o cartão de dados e a correção. */
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

/**
 * A frase que liga uma pergunta à resposta anterior, para a conversa não soar como formulário.
 * Determinística (pela posição), para não trocar de texto quando a tela redesenha.
 */
function ligacao(anterior: Campo | undefined, c: Campo, r: Respostas, i: number, veioDaPagina: boolean): string {
  if (c.tipo === "info") return "";
  if (c.tipo === "lgpd") return "Última coisa, prometo.";
  if (!anterior) return veioDaPagina ? "Pra fechar a sua inscrição, só preciso de mais algumas coisinhas." : "";
  if (anterior.tipo === "info") return "";
  const v = r[anterior.id];
  if (!temValor(v)) return "Sem problema.";
  if (anterior.base === "nome") return `Prazer, ${primeiroNome(v)}!`;
  if (anterior.tipo === "whats") return "Anotado. É por lá que vai chegar a sua confirmação.";
  return LIGACOES[i % LIGACOES.length];
}

/** Negrito com **asteriscos** (texto do aceite). */
const rico = (t: string): ReactNode[] => t.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p));

function TextoDaPergunta({ c, liga }: { c: Campo; liga: string }) {
  if (c.tipo === "info") return <p>{c.rotulo}</p>;
  if (c.tipo === "lgpd")
    return (
      <>
        <p>{liga} Posso usar seus dados para a inscrição e para te mandar os avisos do evento?</p>
        <p className="cv-termo">{rico(c.rotulo)}</p>
      </>
    );
  const pergunta = c.tipo === "ingresso" ? "Agora, o seu ingresso. Qual você prefere?" : perguntaDe(c);
  if (!liga) return <p>{pergunta}</p>;
  return liga.length > 28 ? (
    <>
      <p>{liga}</p>
      <p>{pergunta}</p>
    </>
  ) : (
    <p>
      {liga} {pergunta}
    </p>
  );
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
function Fala({ children, alerta = false }: { children: ReactNode; alerta?: boolean }) {
  return (
    <div className="cv-fala" data-alerta={alerta || undefined}>
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
  // O que a pessoa já preencheu na página: vira o cartão dela no começo da conversa.
  const [daPagina] = useState(() => (completo ? [] : camposNaPagina(form).filter((c) => c.tipo !== "info" && c.tipo !== "lgpd" && temValor(iniciais[c.id]))));
  const [r, setR] = useState<Respostas>(iniciais);
  const [feitos, setFeitos] = useState<string[]>([]);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [fase, setFase] = useState<Fase>({ tipo: "conversa" });
  const [editando, setEditando] = useState<string | null>(null);
  const [confirmou, setConfirmou] = useState(false);
  const [enviando, setEnviando] = useState(false);
  // Escolha do ingresso (inteira ou meia, declaração e cupom) enquanto a pessoa não confirma.
  const [ingresso, setIngresso] = useState<Respostas>({});
  const [erroIngresso, setErroIngresso] = useState("");
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
  // "Digitando": cada fala nova (a pergunta da vez, a conferência, o pagamento) espera um instante.
  // Vem de comparar com a última fala mostrada, para a pergunta nova nunca aparecer antes dos três pontinhos.
  const vez = fase.tipo === "conversa" ? (atual?.id ?? "conferir") : fase.tipo;
  const [vista, setVista] = useState<string | null>(null);
  const digitando = vista !== vez;

  // Progresso: só uma linha. O que veio da página já conta; o pagamento é o último pedaço.
  const doModal = new Set(perguntas.map((c) => c.id));
  const contam = form.campos.filter((c) => !["oculto", "info", "etapa"].includes(c.tipo) && visivel(c, r));
  const prontas = contam.filter((c) => !doModal.has(c.id) || feitos.includes(c.id)).length;
  const progresso = fase.tipo === "pagamento" ? 0.92 : (contam.length ? prontas / contam.length : 1) * (cobra ? 0.84 : 0.94);

  useEffect(() => {
    if (!digitando) return;
    const t = window.setTimeout(() => setVista(vez), reduz ? 0 : ESPERA_DIGITANDO);
    return () => window.clearTimeout(t);
  }, [vez, digitando, reduz]);

  // Texto informativo não espera resposta: segue sozinho.
  useEffect(() => {
    if (!atual || atual.tipo !== "info" || digitando) return;
    const t = window.setTimeout(() => setFeitos((f) => [...f, atual.id]), 900);
    return () => window.clearTimeout(t);
  }, [atual, digitando]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Rola até a última mensagem e põe o foco onde a pessoa responde (caixa de texto ou primeira opção).
  useEffect(() => {
    if (editando) return;
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduz ? "auto" : "smooth" });
    if (digitando) return;
    const alvo =
      raiz.current?.querySelector<HTMLElement>(".cv-escrever .cv-in:not(:disabled)") ?? raiz.current?.querySelector<HTMLElement>(".cv-agora button:not(:disabled)");
    alvo?.focus({ preventScroll: true });
  }, [feitos.length, digitando, aviso, fase.tipo, enviando, editando, confirmou, reduz]);

  // Corrigindo: mostra a resposta e põe o foco no campo da correção.
  useEffect(() => {
    if (!editando) return;
    const bloco = raiz.current?.querySelector(`[data-resposta="${CSS.escape(editando)}"]`);
    bloco?.scrollIntoView({ block: "nearest", behavior: reduz ? "auto" : "smooth" });
    bloco?.querySelector<HTMLElement>("input:not([type=file]), textarea, .cv-chip")?.focus({ preventScroll: true });
  }, [editando, reduz]);

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

  // A caixa de baixo só recebe texto quando a pergunta da vez é de escrever.
  const alvo = conversando && !editando && atual && !digitando ? atual : undefined;
  const dica = enviando
    ? "Enviando a sua inscrição…"
    : fase.tipo === "pagamento"
      ? "Escolha como pagar acima"
      : editando
        ? "Corrigindo uma resposta acima"
        : !atual
          ? "Confira e confirme acima"
          : digitando || atual.tipo === "info"
            ? "Escreva aqui"
            : atual.tipo === "multipla"
              ? "Marque as opções acima"
              : atual.tipo === "ingresso"
                ? "Escolha o ingresso acima"
                : atual.tipo === "anexo"
                  ? "Anexe o arquivo acima"
                  : "Escolha uma opção acima";

  return (
    <div className="cv" ref={raiz}>
      <span className="cv-aura" aria-hidden="true" />

      <header className="cv-topo">
        <Orbe grande ativo={(digitando && fase.tipo === "conversa" && Boolean(atual)) || enviando} />
        <div className="cv-quem">
          <strong>{ctx.page?.title ?? "Inscrição"}</strong>
          <span>{(digitando && atual && fase.tipo === "conversa") || enviando ? "digitando…" : "Inscrição"}</span>
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
                editando === c.id ? (
                  <div key={c.id} className="cv-dado cv-dado-edita" data-resposta={c.id}>
                    <span className="cv-dado-rot">{rotuloCurto(c)}</span>
                    <Corrigir c={c} valor={r[c.id]} salvar={(v) => responder(c, v)} cancelar={() => setEditando(null)} />
                  </div>
                ) : (
                  <button
                    key={c.id}
                    type="button"
                    className="cv-dado"
                    data-resposta={c.id}
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

        {/* Respondidas e a pergunta da vez numa lista só: ao responder, a pergunta continua no lugar
            e só a resposta entra. */}
        {lista.map((c, i) => {
          const daVez = c === atual;
          return (
            <div key={c.id} className="cv-par">
              {daVez && digitando ? (
                <Digitando />
              ) : (
                <Fala>
                  <TextoDaPergunta c={c} liga={ligacao(lista[i - 1], c, r, i, daPagina.length > 0)} />
                  {daVez && c.ajuda && c.tipo !== "info" && <p className="cv-ajuda">{c.ajuda}</p>}
                  {daVez && ESCOLHA.has(c.tipo) && <Escolhas key={c.id} c={c} valor={r[c.id]} escolher={(v) => responder(c, v)} pular={!c.obrigatorio && c.tipo !== "lgpd"} agora />}
                  {daVez && c.tipo === "anexo" && <PerguntaAnexo key={c.id} c={c} inicial="" enviar={(v) => responder(c, v)} pular={!c.obrigatorio} agora />}
                  {daVez && c.tipo === "ingresso" && (
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
                  {daVez && !SEM_TEXTO.has(c.tipo) && !c.obrigatorio && (
                    <div className="cv-rapidas">
                      <button type="button" className="cv-chip cv-chip-leve" onClick={() => responder(c, undefined)}>
                        Prefiro pular
                      </button>
                    </div>
                  )}
                </Fala>
              )}
              {!daVez &&
                c.tipo !== "info" &&
                (editando === c.id ? (
                  <div className="cv-eu" data-resposta={c.id}>
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

        {/* Tudo respondido: a pessoa confere e confirma. Só aqui a inscrição é enviada. */}
        {!atual && !(digitando && fase.tipo === "conversa") && (
          <>
            <Fala>
              <p>Pronto{nome ? `, ${nome}` : ""}! Dá uma conferida nas respostas aqui em cima. Se alguma estiver errada, é só tocar nela pra corrigir.</p>
              {!confirmou && conversando && (
                <div className="cv-rapidas cv-agora">
                  <button type="button" className="cv-bt-pri" onClick={confirmar}>
                    {cobra ? "Confirmar e ir para o pagamento" : "Confirmar inscrição"}
                  </button>
                </div>
              )}
            </Fala>
            {confirmou && <Resposta texto={cobra ? "Confirmar e ir para o pagamento" : "Confirmar inscrição"} />}
          </>
        )}
        {enviando && <Digitando />}
        {aviso && conversando && (
          <Fala alerta>
            <p>{aviso.texto}</p>
            <div className="cv-rapidas cv-agora">
              {aviso.campo && (
                <button
                  type="button"
                  className="cv-bt-pri"
                  onClick={() => {
                    const c = form.campos.find((x) => x.id === aviso.campo);
                    if (c) editar(c);
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
            <Fala>
              <p>Inscrição feita! 🎉 Agora é só pagar o ingresso pra garantir a sua vaga.</p>
              <div className="cv-cartao cv-pag">
                <Pagamento
                  sub={fase.sub}
                  previa={ctx.previa}
                  resolver={(sub, aprovado) => aprovado && setFase({ tipo: "fim", sub, espera: false })}
                  desistir={() => setFase({ tipo: "fim", sub: fase.sub, espera: false })}
                />
              </div>
            </Fala>
          ))}
      </div>

      <div className="cv-compor">
        {alvo && !SEM_TEXTO.has(alvo.tipo) ? (
          <Entrada key={alvo.id} c={alvo} inicial={typeof r[alvo.id] === "string" ? (r[alvo.id] as string) : ""} enviar={(v) => responder(alvo, v)} />
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
    <button type="button" className="cv-chip cv-chip-leve" onClick={() => escolher(undefined)}>
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
          <button type="button" className="cv-chip cv-chip-leve" onClick={() => enviar(undefined)}>
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
function Entrada({ c, inicial, enviar, cancelar }: { c: Campo; inicial: string; enviar: (v: string | undefined) => void; cancelar?: () => void }) {
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
