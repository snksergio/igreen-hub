import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { etapasDoModal, mascaraCpf, mascaraWhats, UFS, validarCampo, validarCampos, visivel, type Campo, type Formulario } from "../lib/formularios";
import { reais } from "../lib/ingresso";
import { inscrever, totalDoIngresso, type Resultado } from "../lib/inscrever";
import { formatarWhats, type Respostas, type Submission } from "../lib/submissions";
import { Anexo, Campo as CampoView } from "./Campo";
import { Confirmacao } from "./Confirmacao";
import { Pagamento, type Contexto } from "./Fluxo";
import "./conversa.css";

/* Inscrição como conversa: uma pergunta por vez, a resposta aparece como mensagem da pessoa.
   O que já veio da versão curta (na página) aparece resumido no começo, sem perguntar de novo. */

type Fase = { tipo: "conversa" } | { tipo: "pagamento"; sub: Submission } | { tipo: "fim"; sub: Submission; espera: boolean };

const primeiroNome = (v: unknown) => (typeof v === "string" ? v.trim().split(/\s+/)[0] : "");
const ESPERA_DIGITANDO = 520;

/** A resposta como aparece na bolha da pessoa. */
function textoDaResposta(c: Campo, r: Respostas, form: Formulario, pageId: string): string {
  const v = r[c.id];
  if (v === undefined || (Array.isArray(v) && !v.length)) return "Pular";
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
    anexo: `${r} (pode anexar aqui embaixo).`,
  };
  if (c.base === "nome") return "Como você se chama?";
  return porTipo[c.tipo] ?? r;
}

/** Negrito com **asteriscos** (texto do aceite). */
const rico = (t: string): ReactNode[] => t.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p));

function Bolha({ de, children, largo = false }: { de: "bot" | "eu"; children: ReactNode; largo?: boolean }) {
  return (
    <div className="cv-linha" data-de={de}>
      {de === "bot" && (
        <span className="cv-av" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15zM5 19l7-7" />
          </svg>
        </span>
      )}
      <div className={`cv-bolha${largo ? " cv-bolha-larga" : ""}`}>{children}</div>
    </div>
  );
}

export function Conversa({ form, ctx, iniciais = {}, completo }: { form: Formulario; ctx: Contexto; iniciais?: Respostas; completo: boolean }) {
  const etapas = useMemo(() => etapasDoModal(form, completo), [form, completo]);
  const perguntas = useMemo(() => etapas.flatMap((e) => e.campos.filter((c) => c.tipo !== "oculto")), [etapas]);
  const etapaDe = useMemo(() => new Map(etapas.flatMap((e) => e.campos.map((c) => [c.id, e.titulo] as const))), [etapas]);
  const [r, setR] = useState<Respostas>(iniciais);
  const [feitos, setFeitos] = useState<string[]>([]);
  const [digitando, setDigitando] = useState(true);
  const [motivo, setMotivo] = useState("");
  const [fase, setFase] = useState<Fase>({ tipo: "conversa" });
  const fim = useRef<HTMLDivElement>(null);
  const enviado = useRef(false);

  // A próxima pergunta é a primeira visível que ainda não foi respondida (a lógica vale na hora).
  const fila = perguntas.filter((c) => visivel(c, r));
  const atual = fila.find((c) => !feitos.includes(c.id));
  const respondidas = feitos.map((id) => perguntas.find((c) => c.id === id)).filter((c): c is Campo => Boolean(c && visivel(c, r)));
  // Quantas perguntas faltam, contado uma vez na abertura (não muda enquanto a pessoa responde).
  const [faltam] = useState(() => perguntas.filter((c) => visivel(c, iniciais) && c.tipo !== "info" && c.tipo !== "lgpd").length);
  // Escolha do ingresso (inteira ou meia, declaração e cupom) enquanto a pessoa não confirma.
  const [ingresso, setIngresso] = useState<Respostas>({});
  const [erroIngresso, setErroIngresso] = useState("");

  // Nova pergunta: o "digitando" aparece um instante antes dela.
  useEffect(() => {
    const reduz = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setDigitando(true);
    const t = window.setTimeout(() => setDigitando(false), reduz ? 0 : ESPERA_DIGITANDO);
    return () => window.clearTimeout(t);
  }, [atual?.id, fase.tipo]);

  // Texto informativo não espera resposta: segue sozinho.
  useEffect(() => {
    if (!atual || atual.tipo !== "info" || digitando) return;
    const t = window.setTimeout(() => setFeitos((f) => [...f, atual.id]), 700);
    return () => window.clearTimeout(t);
  }, [atual, digitando]);

  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    const campo = fim.current?.closest(".cv")?.querySelector<HTMLElement>(".cv-compor input:not([type=file]):not([type=checkbox]):not([type=radio]), .cv-compor textarea");
    if (!digitando) campo?.focus({ preventScroll: true });
  }, [feitos.length, digitando, motivo, fase.tipo]);

  function concluir(res: Resultado) {
    if (!res.ok) {
      setMotivo(res.motivo);
      return;
    }
    setFase(res.aPagar ? { tipo: "pagamento", sub: res.sub } : { tipo: "fim", sub: res.sub, espera: res.espera });
  }

  // Tudo respondido: confere e envia uma vez.
  useEffect(() => {
    if (atual || fase.tipo !== "conversa" || enviado.current || digitando) return;
    const erros = validarCampos(form.campos, r);
    if (Object.keys(erros).length) {
      setMotivo("Faltou algum dado obrigatório. Volte uma pergunta e confira.");
      return;
    }
    enviado.current = true;
    concluir(inscrever(form, r, ctx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atual, fase.tipo, digitando]);

  function responder(c: Campo, valor: string | string[] | undefined, extra: Respostas = {}) {
    setR((x) => {
      const n = { ...x, ...extra };
      if (valor === undefined || (Array.isArray(valor) && !valor.length)) delete n[c.id];
      else n[c.id] = valor;
      return n;
    });
    setFeitos((f) => [...f, c.id]);
    setMotivo("");
  }

  function voltar() {
    // Desfaz a última resposta de verdade (os textos informativos que vieram depois dela saem junto).
    const n = [...feitos];
    let tirar: string | undefined;
    while (n.length && !tirar) {
      const id = n.pop()!;
      if (perguntas.find((x) => x.id === id)?.tipo !== "info") tirar = id;
    }
    setFeitos(n);
    if (tirar)
      setR((x) => {
        const m = { ...x };
        for (const k of Object.keys(m)) if (k === tirar || k.startsWith(`${tirar}-`)) delete m[k];
        return m;
      });
    enviado.current = false;
    setMotivo("");
  }

  if (fase.tipo === "fim") return <Confirmacao sub={fase.sub} page={ctx.page} form={form} espera={fase.espera} previa={ctx.previa} />;

  const nome = primeiroNome(r.nome ?? iniciais.nome);
  const resumo = Object.keys(iniciais).length > 0 && !completo;
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

  return (
    <div className="cv">
      <div className="cv-log" role="log" aria-live="polite" aria-label="Conversa da inscrição">
        <Bolha de="bot">
          <p>
            Oi{nome ? `, ${nome}` : ""}! 👋 Que bom ter você {ctx.page ? <>no <b>{ctx.page.title}</b></> : "por aqui"}.
          </p>
        </Bolha>
        {resumo ? (
          <Bolha de="bot">
            <p>Já anotei o que você preencheu na página:</p>
            <ul className="cv-resumo">
              {(["nome", "whats", "email", "cidade"] as const)
                .map((b) => form.campos.find((c) => c.base === b))
                .filter((c): c is Campo => Boolean(c && iniciais[c.id]))
                .map((c) => (
                  <li key={c.id}>
                    <span aria-hidden="true">✓</span>
                    {c.tipo === "whats" ? formatarWhats(String(iniciais[c.id]).replace(/\D/g, "")) : textoDaResposta(c, iniciais, form, ctx.pageId)}
                  </li>
                ))}
            </ul>
            <p>{faltam > 1 ? `Agora faltam só ${faltam} perguntas.` : faltam === 1 ? "Agora falta só uma pergunta." : "Falta só confirmar."}</p>
          </Bolha>
        ) : (
          <Bolha de="bot">
            <p>Vou te fazer algumas perguntas rápidas. Leva menos de um minuto.</p>
          </Bolha>
        )}

        {respondidas.map((c) => (
          <div key={c.id} className="cv-par">
            {divisor(c)}
            <Bolha de="bot">
              <p>{c.tipo === "lgpd" ? rico(c.rotulo) : c.tipo === "info" ? c.rotulo : perguntaDe(c)}</p>
            </Bolha>
            {c.tipo !== "info" && (
              <Bolha de="eu">
                <p>{textoDaResposta(c, r, form, ctx.pageId)}</p>
              </Bolha>
            )}
          </div>
        ))}

        {atual && (
          <>
            {divisor(atual)}
            {digitando ? (
              <div className="cv-linha" data-de="bot" aria-label="Escrevendo">
                <span className="cv-av" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15zM5 19l7-7" />
                  </svg>
                </span>
                <div className="cv-bolha cv-digitando">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            ) : (
              <>
                <Bolha de="bot">
                  <p>
                    {atual.tipo === "lgpd" ? rico(atual.rotulo) : atual.tipo === "ingresso" ? "Agora, o seu ingresso. Qual você prefere?" : atual.tipo === "info" ? atual.rotulo : perguntaDe(atual)}
                  </p>
                  {atual.ajuda && atual.tipo !== "info" && <p className="cv-ajuda">{atual.ajuda}</p>}
                </Bolha>
                {atual.tipo === "ingresso" && (
                  <div className="cv-pag cv-ing">
                    <CampoView
                      campo={atual}
                      r={{ ...r, ...ingresso }}
                      erros={erroIngresso ? { [`${atual.id}-declaro`]: erroIngresso } : {}}
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
                )}
              </>
            )}
          </>
        )}

        {!atual && fase.tipo === "conversa" && !motivo && (
          <Bolha de="bot">
            <p>Enviando sua inscrição…</p>
          </Bolha>
        )}
        {motivo && (
          <Bolha de="bot">
            <p className="cv-alerta">{motivo}</p>
          </Bolha>
        )}
        {fase.tipo === "pagamento" && (
          <>
            <Bolha de="bot">
              <p>Último passo: o pagamento do ingresso.</p>
            </Bolha>
            <div className="cv-pag">
              <Pagamento
                sub={fase.sub}
                previa={ctx.previa}
                resolver={(sub, aprovado) => aprovado && setFase({ tipo: "fim", sub, espera: false })}
                desistir={() => setFase({ tipo: "fim", sub: fase.sub, espera: false })}
              />
            </div>
          </>
        )}
        <div ref={fim} />
      </div>

      {fase.tipo === "conversa" && (
        <div className="cv-compor">
          {atual && !digitando && atual.tipo === "ingresso" ? (
            <div className="cv-opcoes cv-fim-ing">
              <button
                type="button"
                className="fm-bt fm-bt-pri"
                onClick={() => {
                  const rr = { ...r, ...ingresso };
                  const escolha = (rr[atual.id] as string) ?? "inteira";
                  if (atual.ingresso?.meia && escolha === "meia" && rr[`${atual.id}-declaro`] !== "sim") {
                    setErroIngresso("Para a meia-entrada, marque a declaração.");
                    return;
                  }
                  responder(atual, escolha, ingresso);
                }}
              >
                Continuar
              </button>
            </div>
          ) : atual && !digitando && atual.tipo !== "info" ? (
            <Compor key={atual.id} c={atual} r={r} form={form} pageId={ctx.pageId} responder={responder} />
          ) : (
            <p className="cv-espera">{atual ? "…" : motivo ? "" : "Só um instante…"}</p>
          )}
          {feitos.length > 0 && (
            <button type="button" className="cv-voltar" onClick={voltar}>
              ← Voltar uma pergunta
            </button>
          )}
          {ctx.previa && <p className="fm-previa">Prévia: a inscrição não é gravada.</p>}
        </div>
      )}
    </div>
  );
}

/** Onde a pessoa responde a pergunta da vez: o jeito muda com o tipo do campo. */
function Compor({
  c,
  r,
  form,
  pageId,
  responder,
}: {
  c: Campo;
  r: Respostas;
  form: Formulario;
  pageId: string;
  responder: (c: Campo, v: string | string[] | undefined, extra?: Respostas) => void;
}) {
  const [v, setV] = useState<string>(typeof r[c.id] === "string" ? (r[c.id] as string) : "");
  const [lista, setLista] = useState<string[]>(Array.isArray(r[c.id]) ? (r[c.id] as string[]) : []);
  const [erro, setErro] = useState("");
  const pular = !c.obrigatorio && c.tipo !== "lgpd" && (
    <button type="button" className="cv-pular" onClick={() => responder(c, undefined)}>
      Pular
    </button>
  );

  const enviar = (e?: FormEvent) => {
    e?.preventDefault();
    const valor = c.tipo === "multipla" ? lista : v.trim() || undefined;
    const problema = validarCampo(c, valor);
    if (problema) {
      setErro(problema);
      return;
    }
    responder(c, valor);
  };

  if (c.tipo === "lgpd")
    return (
      <div className="cv-opcoes">
        <button type="button" className="fm-bt fm-bt-pri" onClick={() => responder(c, "sim")}>
          Aceito
        </button>
      </div>
    );

  if (c.tipo === "unica" || c.tipo === "lista")
    return (
      <div className="cv-opcoes">
        {(c.opcoes ?? []).map((o) => (
          <button key={o} type="button" className="cv-chip" onClick={() => responder(c, o)}>
            {o}
          </button>
        ))}
        {pular}
      </div>
    );

  if (c.tipo === "multipla")
    return (
      <div className="cv-opcoes">
        {(c.opcoes ?? []).map((o) => {
          const marcado = lista.includes(o);
          return (
            <button
              key={o}
              type="button"
              className="cv-chip"
              aria-pressed={marcado}
              onClick={() => {
                setErro("");
                setLista((l) => (l.includes(o) ? l.filter((x) => x !== o) : [...l, o]));
              }}
            >
              {marcado && <span aria-hidden="true">✓ </span>}
              {o}
            </button>
          );
        })}
        <button type="button" className="fm-bt fm-bt-pri cv-pronto" onClick={() => enviar()} disabled={c.obrigatorio && !lista.length}>
          Pronto
        </button>
        {pular}
        {erro && <span className="fm-erro cv-erro">{erro}</span>}
      </div>
    );

  if (c.tipo === "anexo")
    return (
      <div className="cv-bloco">
        <Anexo c={c} valor={v} muda={(x) => setV(x ?? "")} />
        <div className="cv-opcoes">
          <button type="button" className="fm-bt fm-bt-pri" disabled={!v} onClick={() => enviar()}>
            Enviar
          </button>
          {pular}
        </div>
      </div>
    );

  if (c.tipo === "cidade") {
    const [cidade, uf = ""] = v.includes("/") ? [v.slice(0, v.lastIndexOf("/")), v.slice(v.lastIndexOf("/") + 1)] : [v, ""];
    return (
      <form className="cv-escrever" onSubmit={enviar} noValidate>
        <input className="cv-in" value={cidade} onChange={(e) => (setErro(""), setV(`${e.target.value}/${uf}`))} placeholder={c.exemplo ?? "Sua cidade"} aria-label={c.rotulo} autoComplete="address-level2" />
        <select className="cv-in cv-uf" value={uf} data-vazio={!uf || undefined} onChange={(e) => (setErro(""), setV(`${cidade}/${e.target.value}`))} aria-label="UF">
          <option value="">UF</option>
          {UFS.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
        <BotaoEnviar />
        {erro && <span className="fm-erro cv-erro">{erro}</span>}
        {pular}
      </form>
    );
  }

  const tipo = { email: "email", whats: "tel", data: "date", numero: "number" }[c.tipo as string] ?? "text";
  const mascara = c.tipo === "whats" ? mascaraWhats : c.tipo === "cpf" ? mascaraCpf : (s: string) => s;
  return (
    <form className="cv-escrever" onSubmit={enviar} noValidate>
      {c.tipo === "paragrafo" ? (
        <textarea className="cv-in" rows={2} value={v} onChange={(e) => (setErro(""), setV(e.target.value))} placeholder={c.exemplo ?? "Escreva aqui"} aria-label={c.rotulo} maxLength={c.max} />
      ) : (
        <input
          className="cv-in"
          type={tipo}
          inputMode={c.tipo === "whats" ? "tel" : c.tipo === "cpf" || c.tipo === "numero" ? "numeric" : undefined}
          value={v}
          onChange={(e) => (setErro(""), setV(mascara(e.target.value)))}
          placeholder={c.exemplo ?? "Escreva aqui"}
          aria-label={c.rotulo}
          maxLength={c.max ?? (c.tipo === "whats" ? 20 : undefined)}
          aria-invalid={erro ? true : undefined}
        />
      )}
      <BotaoEnviar />
      {erro && <span className="fm-erro cv-erro">{erro}</span>}
      {pular}
    </form>
  );
}

function BotaoEnviar() {
  return (
    <button type="submit" className="cv-enviar" aria-label="Enviar resposta">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
