import { createUsePuck } from "@puckeditor/core";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type PointerEvent as EventoPonteiro, type ReactNode } from "react";
import { CATALOGO, type PecaId } from "../../puck/catalogo";
import { Icone, type NomeIcone } from "../../ui/Icone";
import "./assistente.css";

const usePuck = createUsePuck();

/* Assistente que monta a página por conversa. Na POC é só a parte visual: ele "pensa", mostra a
   proposta de mudanças e os atalhos de ajuste, mas não altera a página. No projeto real, o pedido
   vai para a API do Claude, que escolhe e ajusta as peças seguindo o design system. */

type Mudanca = { tipo: "adicionar" | "editar" | "visual" | "ordem"; titulo: string; onde: string };
type Proposta = { abertura: string; mudancas: Mudanca[]; refinos: string[] };
type Msg = { id: number; de: "eu"; texto: string; anexo?: string } | { id: number; de: "ia"; proposta: Proposta; segundos: number };

const SUGESTOES: { icone: NomeIcone; titulo: string; detalhe: string; pedido: string }[] = [
  { icone: "pagina", titulo: "Montar uma página de evento", detalhe: "Abertura, agenda, local e inscrição", pedido: "Monte uma página de evento presencial em BH" },
  { icone: "texto", titulo: "Reescrever os textos", detalhe: "Tom mais animado, sem mudar o layout", pedido: "Deixe os textos da Abertura mais animados" },
  { icone: "mais", titulo: "Adicionar uma seção", detalhe: "Perguntas frequentes sobre o ingresso", pedido: "Adicione perguntas frequentes sobre o ingresso" },
  { icone: "brilho", titulo: "Aplicar o kit iGreen Live", detalhe: "Visual premium escuro com verde-lima", pedido: "Aplique o visual do kit iGreen Live" },
];

const ICONE_MUDANCA: Record<Mudanca["tipo"], NomeIcone> = { adicionar: "mais", editar: "lapis", visual: "brilho", ordem: "camadas" };
const ROTULO_MUDANCA: Record<Mudanca["tipo"], string> = { adicionar: "Nova seção", editar: "Texto", visual: "Visual", ordem: "Ordem" };

/** O que o assistente faria com o pedido (simulação). */
function proporPara(pedido: string, onde: string, temAnexo: boolean): Proposta {
  const p = pedido.toLowerCase();
  const m: Mudanca[] = [];
  if (/pergunt|faq|d[uú]vida/.test(p)) m.push({ tipo: "adicionar", titulo: "Perguntas frequentes com 5 respostas sobre ingresso, horário e local", onde: "antes da Inscrição" });
  if (/abertura|t[ií]tulo|hero|texto|animad/.test(p)) {
    m.push({ tipo: "editar", titulo: "Título com mais energia, até 8 palavras", onde: "Abertura" });
    m.push({ tipo: "editar", titulo: "Texto de apoio mais curto, com a data e o local", onde: "Abertura" });
  }
  if (/live|premium|escuro|visual/.test(p)) {
    m.push({ tipo: "visual", titulo: "Trocar as seções pelas peças do kit iGreen Live, mantendo os textos", onde: "página inteira" });
    m.push({ tipo: "ordem", titulo: "Faixa animada logo depois da Abertura", onde: "página inteira" });
  }
  if (!m.length && /evento|p[aá]gina|monte|crie|criar/.test(p))
    m.push(
      { tipo: "adicionar", titulo: "Abertura com título, data e botão de inscrição", onde: "topo" },
      { tipo: "adicionar", titulo: "Programação e Local, com o mapa", onde: "meio" },
      { tipo: "adicionar", titulo: "Inscrição com o formulário da biblioteca", onde: "fim" }
    );
  if (!m.length) m.push({ tipo: "editar", titulo: `Ajustar ${onde} conforme o pedido`, onde });
  if (temAnexo) m.push({ tipo: "visual", titulo: "Usar o print enviado como referência de cor e espaçamento", onde });
  return {
    abertura: `Olhei ${onde === "página inteira" ? "a página inteira" : `a seção ${onde}`} e preparei ${m.length === 1 ? "esta mudança" : `estas ${m.length} mudanças`}. Nada é aplicado sem você aprovar.`,
    mudancas: m,
    refinos: ["Mais curto", "Tom mais formal", "Me mostre outra opção"],
  };
}

const PASSOS = (onde: string) => [`Lendo ${onde === "página inteira" ? "a página" : onde}`, "Escolhendo peças do design system", "Montando a proposta"];

/**
 * A esfera do assistente, como um líquido: gotas verdes que se movem e se fundem (filtro "goo"
 * do SVG). Pensando, ela acelera. A grande estica na direção do ponteiro e volta como gelatina.
 */
function Orbe({ grande = false, ativo = false }: { grande?: boolean; ativo?: boolean }) {
  return (
    <span className={`ia-orbe${grande ? " ia-orbe-g" : ""}${ativo ? " ia-orbe-ativo" : ""}`} aria-hidden="true">
      <span className="ia-goo">
        <i />
        <i />
        <i />
        <i />
        <i className="ia-segue" />
      </span>
      <span className="ia-luz" />
    </span>
  );
}

/**
 * Filtros do efeito líquido: o desfoque junta as gotas e mistura as cores; o corte de transparência
 * devolve uma borda lisa. O resultado é um corpo só, sem as bolas aparecendo.
 */
function FiltrosLiquidos() {
  return (
    <svg className="ia-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <filter id="ia-goo-g" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="borrado" />
        <feColorMatrix in="borrado" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" result="gota" />
      </filter>
      <filter id="ia-goo-p" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="borrado" />
        <feColorMatrix in="borrado" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="gota" />
      </filter>
    </svg>
  );
}

/** Leva a posição do ponteiro (de -1 a 1 em cada eixo) para a esfera grande esticar na direção dele. */
function seguirPonteiro(e: EventoPonteiro<HTMLElement>) {
  const orbe = e.currentTarget.querySelector<HTMLElement>(".ia-orbe-g");
  if (!orbe) return;
  const r = orbe.getBoundingClientRect();
  const dx = (e.clientX - (r.left + r.width / 2)) / (r.width * 2.2);
  const dy = (e.clientY - (r.top + r.height / 2)) / (r.height * 2.2);
  const lim = (v: number) => Math.max(-1, Math.min(1, v));
  orbe.style.setProperty("--mx", lim(dx).toFixed(3));
  orbe.style.setProperty("--my", lim(dy).toFixed(3));
}
function soltarPonteiro(e: EventoPonteiro<HTMLElement>) {
  const orbe = e.currentTarget.querySelector<HTMLElement>(".ia-orbe-g");
  orbe?.style.setProperty("--mx", "0");
  orbe?.style.setProperty("--my", "0");
}

export function Assistente() {
  const [aberto, setAberto] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [texto, setTexto] = useState("");
  const [anexo, setAnexo] = useState<{ nome: string; url: string } | null>(null);
  const [pensando, setPensando] = useState<number | null>(null);
  const [usarSelecao, setUsarSelecao] = useState(true);
  const fim = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);
  const seq = useRef(0);
  const selecionada = usePuck((s) => s.selectedItem);
  const nomeSecao = selecionada ? CATALOGO[selecionada.type as PecaId]?.nome ?? selecionada.type : null;
  const onde = usarSelecao && nomeSecao ? nomeSecao : "página inteira";

  useEffect(() => setUsarSelecao(true), [nomeSecao]);
  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [msgs, pensando]);
  useEffect(() => {
    if (!aberto) return;
    campo.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [aberto]);
  // A caixa de pedido cresce com o texto (até um limite) e volta ao tamanho ao enviar.
  useLayoutEffect(() => {
    const t = campo.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = `${Math.min(150, t.scrollHeight)}px`;
  }, [texto, aberto]);
  // Os passos do "pensando" aparecem um a um.
  useEffect(() => {
    if (pensando === null || pensando >= 3) return;
    const t = window.setTimeout(() => setPensando((p) => (p === null ? p : p + 1)), 650);
    return () => window.clearTimeout(t);
  }, [pensando]);

  function enviar(pedido: string) {
    const t = pedido.trim();
    if (!t || pensando !== null) return;
    const comAnexo = Boolean(anexo);
    setMsgs((m) => [...m, { id: ++seq.current, de: "eu", texto: t, anexo: anexo?.url }]);
    setTexto("");
    setAnexo(null);
    setPensando(0);
    const ondeAgora = onde;
    window.setTimeout(() => {
      setPensando(null);
      setMsgs((m) => [...m, { id: ++seq.current, de: "ia", proposta: proporPara(t, ondeAgora, comAnexo), segundos: 2 }]);
    }, 2300);
  }

  const aoEnviar = (e: FormEvent) => {
    e.preventDefault();
    enviar(texto);
  };
  const vazio = msgs.length === 0 && pensando === null;

  return (
    <>
      {!aberto && (
        <button type="button" className="ia-fab" onClick={() => setAberto(true)} aria-label="Abrir o assistente de IA">
          <span className="ia-fab-brilho" aria-hidden="true" />
          <Icone nome="brilho" tamanho={18} />
          Criar com IA
        </button>
      )}
      {aberto && (
        <section className="ia" role="dialog" aria-label="Assistente de IA">
          <FiltrosLiquidos />
          <span className="ia-aura" aria-hidden="true" />
          <span className="ia-aura ia-aura-2" aria-hidden="true" />
          <header className="ia-topo">
            <Orbe ativo={pensando !== null} />
            <div className="ia-tit">
              <strong>Assistente</strong>
              <span>Com Claude · segue o design system iGreen</span>
            </div>
            <button
              type="button"
              className="ia-ic"
              title="Nova conversa"
              aria-label="Nova conversa"
              disabled={vazio}
              onClick={() => {
                setMsgs([]);
                setPensando(null);
              }}
            >
              <Icone nome="lapis" tamanho={16} />
            </button>
            <button type="button" className="ia-ic" onClick={() => setAberto(false)} aria-label="Fechar o assistente" title="Fechar">
              <Icone nome="fechar" tamanho={16} />
            </button>
          </header>

          <div className="ia-corpo" role="log" aria-live="polite">
            {vazio ? (
              <div className="ia-boas" onPointerMove={seguirPonteiro} onPointerLeave={soltarPonteiro}>
                <Orbe grande />
                <h2>O que vamos construir?</h2>
                <p>Peça uma seção, um texto ou um ajuste de visual. Você aprova antes de aplicar.</p>
                <ul className="ia-sug">
                  {SUGESTOES.map((s) => (
                    <li key={s.titulo}>
                      <button type="button" onClick={() => enviar(s.pedido)}>
                        <span className="ia-sug-ic">
                          <Icone nome={s.icone} tamanho={16} />
                        </span>
                        <span className="ia-sug-txt">
                          <b>{s.titulo}</b>
                          <small>{s.detalhe}</small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                {msgs.map((m) =>
                  m.de === "eu" ? (
                    <div key={m.id} className="ia-eu">
                      {m.anexo && <img src={m.anexo} alt="Imagem enviada" className="ia-eu-img" />}
                      <p>{m.texto}</p>
                    </div>
                  ) : (
                    <Resposta key={m.id} m={m} ultima={m.id === msgs[msgs.length - 1]?.id} refinar={enviar} />
                  )
                )}
                {pensando !== null && <Pensando passo={pensando} onde={onde} />}
              </>
            )}
            <div ref={fim} />
          </div>

          <form className="ia-caixa" onSubmit={aoEnviar}>
            {anexo && (
              <div className="ia-anexo">
                <img src={anexo.url} alt="" />
                <span>{anexo.nome}</span>
                <button type="button" aria-label="Tirar a imagem" onClick={() => setAnexo(null)}>
                  <Icone nome="fechar" tamanho={13} />
                </button>
              </div>
            )}
            <textarea
              ref={campo}
              rows={1}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviar(texto);
                }
              }}
              placeholder={vazio ? "Descreva o que você quer na página…" : "Peça um ajuste…"}
              aria-label="Seu pedido para o assistente"
              maxLength={800}
            />
            <div className="ia-barra">
              <label className="ia-ic ia-clipe" title="Anexar um print de referência">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const a = e.target.files?.[0];
                    e.target.value = "";
                    if (a) setAnexo({ nome: a.name, url: URL.createObjectURL(a) });
                  }}
                />
                <Icone nome="imagem" tamanho={16} />
              </label>
              <button
                type="button"
                className="ia-contexto"
                aria-pressed={onde !== "página inteira"}
                onClick={() => nomeSecao && setUsarSelecao((u) => !u)}
                title={nomeSecao ? "Alternar entre a seção selecionada e a página inteira" : "Selecione uma seção na prévia para focar nela"}
              >
                <Icone nome={onde === "página inteira" ? "pagina" : "secao"} tamanho={14} />
                {onde === "página inteira" ? "Página inteira" : onde}
              </button>
              <span className="ia-dica">{texto.length > 600 ? `${800 - texto.length} caracteres` : "Enter envia"}</span>
              <button type="submit" className="ia-enviar" disabled={!texto.trim() || pensando !== null} aria-label="Enviar pedido">
                <Icone nome="cima" tamanho={18} />
              </button>
            </div>
          </form>
          <p className="ia-nota">Prévia do assistente: nesta POC ele ainda não altera a página.</p>
        </section>
      )}
    </>
  );
}

/** "Pensando": os passos aparecem um a um, com brilho correndo no texto do passo atual. */
function Pensando({ passo, onde }: { passo: number; onde: string }) {
  const passos = PASSOS(onde);
  return (
    <div className="ia-resp">
      <Orbe ativo />
      <div className="ia-pensa">
        <span className="ia-brilho-txt">Pensando</span>
        <ol>
          {passos.slice(0, passo + 1).map((p, i) => (
            <li key={p} data-feito={i < passo || undefined}>
              <span className="ia-passo-ic" aria-hidden="true">
                {i < passo ? <Icone nome="check" tamanho={12} /> : <i />}
              </span>
              {p}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Resposta({ m, ultima, refinar }: { m: Extract<Msg, { de: "ia" }>; ultima: boolean; refinar: (t: string) => void }) {
  const { proposta: p } = m;
  const [verPassos, setVerPassos] = useState(false);
  const [aviso, setAviso] = useState("");
  const avisar = (t: string) => {
    setAviso(t);
    window.setTimeout(() => setAviso(""), 2600);
  };
  return (
    <div className="ia-resp">
      <Orbe />
      <div className="ia-resp-corpo">
        <button type="button" className="ia-pensou" aria-expanded={verPassos} onClick={() => setVerPassos((v) => !v)}>
          Pensou por {m.segundos} s
          <Icone nome="chev" tamanho={13} />
        </button>
        {verPassos && (
          <ol className="ia-passos-feitos">
            {PASSOS("o pedido").map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        )}
        <p>{p.abertura}</p>
        <Cartao>
          <div className="ia-prop-topo">
            <strong>Proposta</strong>
            <span>
              {p.mudancas.length} {p.mudancas.length === 1 ? "mudança" : "mudanças"}
            </span>
          </div>
          <ul className="ia-mudancas">
            {p.mudancas.map((x, i) => (
              <li key={i}>
                <span className="ia-mud-ic" data-tipo={x.tipo}>
                  <Icone nome={ICONE_MUDANCA[x.tipo]} tamanho={14} />
                </span>
                <span className="ia-mud-txt">
                  {x.titulo}
                  <small>
                    {ROTULO_MUDANCA[x.tipo]}, {x.onde}
                  </small>
                </span>
              </li>
            ))}
          </ul>
          <div className="ia-prop-acoes">
            <button type="button" className="ia-aplicar" onClick={() => avisar("Na POC o assistente ainda não altera a página.")}>
              <Icone nome="check" tamanho={15} />
              Aplicar mudanças
            </button>
            <button type="button" className="ia-sec" onClick={() => avisar("No projeto real, a prévia abre aqui antes de aplicar.")}>
              <Icone nome="olho" tamanho={15} />
              Ver prévia
            </button>
          </div>
          {aviso && (
            <p className="ia-aviso" role="status">
              {aviso}
            </p>
          )}
        </Cartao>
        {ultima && (
          <div className="ia-refinos" aria-label="Ajustar a proposta">
            {p.refinos.map((r) => (
              <button key={r} type="button" onClick={() => refinar(r)}>
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Cartao = ({ children }: { children: ReactNode }) => <div className="ia-prop">{children}</div>;
