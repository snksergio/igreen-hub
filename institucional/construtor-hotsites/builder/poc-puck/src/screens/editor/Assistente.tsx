import { createUsePuck } from "@puckeditor/core";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type PointerEvent as EventoPonteiro, type ReactNode } from "react";
import { CATALOGO, type PecaId } from "../../puck/catalogo";
import { Icone, type NomeIcone } from "../../ui/Icone";
import { useCampoMarcado } from "./navegar";
import { camposDe } from "./PainelEsquerdo";
import "./assistente.css";

const usePuck = createUsePuck();

/* Assistente que monta a página por conversa. Na POC é só a parte visual: ele "pensa", mostra a
   proposta de mudanças e os atalhos de ajuste, mas não altera a página. No projeto real, o pedido
   vai para a API do Claude, que escolhe e ajusta as peças seguindo o design system. */

type Mudanca = { tipo: "adicionar" | "editar" | "visual" | "ordem"; titulo: string; onde: string };
type Proposta = { abertura: string; mudancas: Mudanca[]; refinos: string[] };
type Msg = { id: number; de: "eu"; texto: string; anexo?: string; ref?: string } | { id: number; de: "ia"; proposta: Proposta; segundos: number };
/** Onde o pedido vale: o rótulo da referência ("Abertura Live › Título") e a frase para o texto. */
type Alvo = { rotulo: string; frase: string };
const PAGINA: Alvo = { rotulo: "página inteira", frase: "a página inteira" };

/* Tamanho do painel: normal, expandido ou o que a pessoa puxou pelo canto (fica guardado). */
type Tam = { w: number; h: number };
const CHAVE_TAM = "igreen-ia-tamanho";
function lerTam(): Tam | null {
  try {
    const t = JSON.parse(localStorage.getItem(CHAVE_TAM) ?? "null");
    return t && typeof t.w === "number" && typeof t.h === "number" ? t : null;
  } catch {
    return null;
  }
}
function guardarTam(t: Tam | null) {
  try {
    if (t) localStorage.setItem(CHAVE_TAM, JSON.stringify(t));
    else localStorage.removeItem(CHAVE_TAM);
  } catch {
    /* sem armazenamento: o tamanho só não fica guardado */
  }
}

const SUGESTOES: { icone: NomeIcone; titulo: string; detalhe: string; pedido: string }[] = [
  { icone: "pagina", titulo: "Montar uma página de evento", detalhe: "Abertura, agenda, local e inscrição", pedido: "Monte uma página de evento presencial em BH" },
  { icone: "texto", titulo: "Reescrever os textos", detalhe: "Tom mais animado, sem mudar o layout", pedido: "Deixe os textos da Abertura mais animados" },
  { icone: "mais", titulo: "Adicionar uma seção", detalhe: "Perguntas frequentes sobre o ingresso", pedido: "Adicione perguntas frequentes sobre o ingresso" },
  { icone: "brilho", titulo: "Aplicar o kit iGreen Live", detalhe: "Visual premium escuro com verde-lima", pedido: "Aplique o visual do kit iGreen Live" },
];

const ICONE_MUDANCA: Record<Mudanca["tipo"], NomeIcone> = { adicionar: "mais", editar: "lapis", visual: "brilho", ordem: "camadas" };
const ROTULO_MUDANCA: Record<Mudanca["tipo"], string> = { adicionar: "Nova seção", editar: "Texto", visual: "Visual", ordem: "Ordem" };

/** O que o assistente faria com o pedido (simulação). */
function proporPara(pedido: string, alvo: Alvo, temAnexo: boolean): Proposta {
  const onde = alvo.rotulo;
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
  if (!m.length) m.push({ tipo: "editar", titulo: `Ajustar ${alvo.frase} conforme o pedido`, onde });
  if (temAnexo) m.push({ tipo: "visual", titulo: "Usar o print enviado como referência de cor e espaçamento", onde });
  return {
    abertura: `Olhei ${alvo.frase} e preparei ${m.length === 1 ? "esta mudança" : `estas ${m.length} mudanças`}. Nada é aplicado sem você aprovar.`,
    mudancas: m,
    refinos: ["Mais curto", "Tom mais formal", "Me mostre outra opção"],
  };
}

const PASSOS = (frase: string) => [`Lendo ${frase}`, "Escolhendo peças do design system", "Montando a proposta"];

/**
 * A esfera do assistente, no jeito das esferas de voz: sempre redonda, com a cor fluindo por dentro.
 * Ao abrir o painel, a grande entra com um único giro e para. Depois, só se mexe enquanto pensa
 * (respira e a cor gira devagar por dentro). Esperando, fica parada.
 */
function Orbe({ grande = false, ativo = false }: { grande?: boolean; ativo?: boolean }) {
  return (
    <span className={`ia-orbe${grande ? " ia-orbe-g" : ""}${ativo ? " ia-orbe-ativo" : ""}`} aria-hidden="true">
      <span className="ia-orbe-cor" />
      <span className="ia-orbe-cor ia-orbe-cor-2" />
      <span className="ia-orbe-luz" />
    </span>
  );
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
  const [tam, setTam] = useState<Tam | null>(lerTam);
  const [puxando, setPuxando] = useState(false);
  const painel = useRef<HTMLElement>(null);
  const selecionada = usePuck((s) => s.selectedItem);
  const marcado = useCampoMarcado();
  const nomeSecao = selecionada ? CATALOGO[selecionada.type as PecaId]?.nome ?? selecionada.type : null;
  // O item marcado dentro da seção selecionada (na Estrutura ou com clique na prévia) entra na referência.
  const idSecao = (selecionada?.props as { id?: string } | undefined)?.id;
  const nomeCampo =
    selecionada && marcado?.startsWith(`${idSecao}:`) ? camposDe(selecionada.type).find((c) => c.chave === marcado.slice(marcado.indexOf(":") + 1))?.curto : undefined;
  const referencia: Alvo | null = nomeSecao
    ? nomeCampo
      ? { rotulo: `${nomeSecao} › ${nomeCampo}`, frase: `o item ${nomeCampo} da seção ${nomeSecao}` }
      : { rotulo: nomeSecao, frase: `a seção ${nomeSecao}` }
    : null;
  const alvo = usarSelecao && referencia ? referencia : PAGINA;
  const onde = alvo.rotulo;

  // Selecionou outra coisa: a referência volta a valer.
  useEffect(() => setUsarSelecao(true), [referencia?.rotulo]);
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
    setMsgs((m) => [...m, { id: ++seq.current, de: "eu", texto: t, anexo: anexo?.url, ref: alvo === PAGINA ? undefined : alvo.rotulo }]);
    setTexto("");
    setAnexo(null);
    setPensando(0);
    const ondeAgora = alvo;
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

  // Puxar pelo canto de cima à esquerda (o painel fica preso embaixo à direita).
  function puxar(e: EventoPonteiro<HTMLSpanElement>) {
    const el = painel.current;
    if (!el || e.button !== 0) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    const inicio = { x: e.clientX, y: e.clientY, w: r.width, h: r.height };
    const limite = { w: r.right - 16, h: r.bottom - 64 };
    let ultimo: Tam = { w: r.width, h: r.height };
    setPuxando(true);
    const mover = (ev: PointerEvent) => {
      ultimo = {
        w: Math.round(Math.min(limite.w, Math.max(360, inicio.w + inicio.x - ev.clientX))),
        h: Math.round(Math.min(limite.h, Math.max(420, inicio.h + inicio.y - ev.clientY))),
      };
      setTam(ultimo);
    };
    const soltar = () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      setPuxando(false);
      guardarTam(ultimo);
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
  }

  function alternarTamanho() {
    const el = painel.current;
    if (tam || !el) {
      setTam(null);
      guardarTam(null);
      return;
    }
    const r = el.getBoundingClientRect();
    // Expandido: mais largo e da altura toda, sem cobrir a prévia inteira (dá para puxar pelo canto).
    const grande = { w: Math.round(Math.min(600, r.right - 16)), h: Math.round(Math.min(900, r.bottom - 64)) };
    setTam(grande);
    guardarTam(grande);
  }

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
        <section
          ref={painel}
          className={`ia${puxando ? " ia-puxando" : ""}`}
          style={tam ? { width: tam.w, height: tam.h } : undefined}
          role="dialog"
          aria-label="Assistente de IA"
        >
          <span className="ia-canto" onPointerDown={puxar} title="Arraste para mudar o tamanho" aria-hidden="true" />
          <span className="ia-aura" aria-hidden="true" />
          <span className="ia-aura ia-aura-2" aria-hidden="true" />
          <header className="ia-topo">
            <Orbe ativo={pensando !== null} />
            <div className="ia-tit">
              <strong>Assistente</strong>
              <span>Criação visual da página</span>
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
            <button
              type="button"
              className="ia-ic"
              onClick={alternarTamanho}
              aria-label={tam ? "Voltar ao tamanho normal" : "Expandir o assistente"}
              title={tam ? "Tamanho normal" : "Expandir"}
            >
              <Icone nome={tam ? "recolher" : "expandir"} tamanho={16} />
            </button>
            <button type="button" className="ia-ic" onClick={() => setAberto(false)} aria-label="Fechar o assistente" title="Fechar">
              <Icone nome="fechar" tamanho={16} />
            </button>
          </header>

          <div className="ia-corpo" role="log" aria-live="polite">
            {vazio ? (
              <div className="ia-boas">
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
                      {m.ref && (
                        <span className="ia-eu-ref">
                          <Icone nome={m.ref.includes("›") ? "texto" : "secao"} tamanho={12} />
                          {m.ref}
                        </span>
                      )}
                      {m.anexo && <img src={m.anexo} alt="Imagem enviada" className="ia-eu-img" />}
                      <p>{m.texto}</p>
                    </div>
                  ) : (
                    <Resposta key={m.id} m={m} ultima={m.id === msgs[msgs.length - 1]?.id} refinar={enviar} />
                  )
                )}
                {pensando !== null && <Pensando passo={pensando} onde={alvo.frase} />}
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
              <span className="ia-ref">
                <button
                  type="button"
                  className="ia-contexto"
                  aria-pressed={alvo !== PAGINA}
                  aria-describedby="ia-ref-dica"
                  onClick={() => referencia && setUsarSelecao((u) => !u)}
                >
                  <Icone nome={alvo === PAGINA ? "pagina" : nomeCampo ? "texto" : "secao"} tamanho={14} />
                  {alvo === PAGINA ? (
                    <span className="ia-contexto-txt">Página inteira</span>
                  ) : (
                    <span className="ia-contexto-txt">
                      {nomeSecao}
                      {nomeCampo && (
                        <>
                          <span className="ia-contexto-sep">›</span>
                          <b>{nomeCampo}</b>
                        </>
                      )}
                    </span>
                  )}
                </button>
                <span role="tooltip" id="ia-ref-dica" className="ia-ref-dica">
                  <b>{alvo === PAGINA ? "O assistente olha a página inteira." : `O assistente mexe só em ${alvo.rotulo}.`}</b>
                  {referencia
                    ? " Para trocar, selecione outra seção ou um item dela na Estrutura, à esquerda, ou clique na prévia. Clicar aqui alterna com a página inteira."
                    : " Para focar numa parte, selecione uma seção ou um item dela na Estrutura, à esquerda, ou clique nele na prévia."}
                </span>
              </span>
              {texto.length > 600 && <span className="ia-dica">{800 - texto.length} caracteres</span>}
              <button type="submit" className="ia-enviar" disabled={!texto.trim() || pensando !== null} aria-label="Enviar pedido">
                <Icone nome="cima" tamanho={18} />
              </button>
            </div>
          </form>
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
