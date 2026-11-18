import { createUsePuck } from "@puckeditor/core";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CATALOGO, type PecaId } from "../../puck/catalogo";
import { Icone } from "../../ui/Icone";
import "./assistente.css";

const usePuck = createUsePuck();

type Msg = { de: "ia" | "eu"; texto: string; plano?: string[] };

const SUGESTOES = [
  "Monte uma página de evento presencial em BH",
  "Deixe os textos da Abertura mais animados",
  "Adicione perguntas frequentes sobre o ingresso",
  "Aplique o visual do kit iGreen Live",
];

/** O que o assistente faria com o pedido (simulação: na POC nada muda na página). */
function planoPara(pedido: string, contexto: string): string[] {
  const p = pedido.toLowerCase();
  const passos: string[] = [];
  if (/pergunt|faq|d[uú]vida/.test(p)) passos.push("Adicionar a peça Perguntas frequentes com 5 perguntas sobre ingresso, local e horário");
  if (/abertura|t[ií]tulo|hero|texto/.test(p)) passos.push(`Reescrever o título e o texto de apoio ${contexto === "a página inteira" ? "da Abertura" : `de ${contexto}`} num tom mais animado`);
  if (/live|premium|escuro/.test(p)) passos.push("Trocar as seções pelas peças do kit iGreen Live, mantendo os textos");
  if (/evento|p[aá]gina|monte|crie|criar/.test(p) && !passos.length)
    passos.push("Começar do modelo Evento presencial", "Preencher data e local", "Colocar a peça de inscrição com o formulário da biblioteca");
  if (!passos.length) passos.push(`Entender o pedido e propor as mudanças em ${contexto}`);
  passos.push("Mostrar a prévia para você aprovar antes de aplicar");
  return passos;
}

/**
 * Assistente que monta a página por conversa (só a parte visual na POC). No projeto real, o pedido
 * vai para a API do Claude, que escolhe e ajusta as peças seguindo o design system.
 */
export function Assistente() {
  const [aberto, setAberto] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const fim = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);
  const selecionada = usePuck((s) => s.selectedItem);
  const contexto = selecionada ? `a seção ${CATALOGO[selecionada.type as PecaId]?.nome ?? selecionada.type}` : "a página inteira";

  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end" });
  }, [msgs, pensando]);
  useEffect(() => {
    if (aberto) campo.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    if (aberto) document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [aberto]);

  function enviar(pedido: string) {
    const t = pedido.trim();
    if (!t || pensando) return;
    setMsgs((m) => [...m, { de: "eu", texto: t }]);
    setTexto("");
    setPensando(true);
    window.setTimeout(() => {
      setPensando(false);
      setMsgs((m) => [
        ...m,
        {
          de: "ia",
          texto: `Entendi. Olhando ${contexto}, este seria o plano:`,
          plano: planoPara(t, contexto),
        },
      ]);
    }, 1100);
  }

  const aoEnviar = (e: FormEvent) => {
    e.preventDefault();
    enviar(texto);
  };

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
          <header className="ia-topo">
            <span className="ia-av" aria-hidden="true">
              <Icone nome="brilho" tamanho={16} />
            </span>
            <div className="ia-tit">
              <strong>Assistente iGreen</strong>
              <span>Monta e ajusta a página com as peças do design system</span>
            </div>
            <span className="ia-selo">Prévia</span>
            <button type="button" className="ia-x" onClick={() => setAberto(false)} aria-label="Fechar o assistente">
              <Icone nome="fechar" tamanho={16} />
            </button>
          </header>

          <div className="ia-contexto" aria-live="polite">
            <Icone nome="olho" tamanho={14} />
            Vendo: <b>{contexto}</b>
          </div>

          <div className="ia-corpo">
            <div className="ia-msg" data-de="ia">
              <p>Oi! Diga o que você quer na página e eu proponho as mudanças: textos, seções, ordem e visual.</p>
            </div>
            {msgs.length === 0 && (
              <div className="ia-sugestoes">
                {SUGESTOES.map((s) => (
                  <button key={s} type="button" onClick={() => enviar(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className="ia-msg" data-de={m.de}>
                <p>{m.texto}</p>
                {m.plano && (
                  <>
                    <ol className="ia-plano">
                      {m.plano.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ol>
                    <div className="ia-plano-acoes">
                      <button type="button" className="ia-bt-pri" disabled title="Na POC o assistente ainda não altera a página">
                        Aplicar
                      </button>
                      <span>Simulação: nada foi alterado na página.</span>
                    </div>
                  </>
                )}
              </div>
            ))}
            {pensando && (
              <div className="ia-msg ia-digitando" data-de="ia" aria-label="O assistente está escrevendo">
                <i />
                <i />
                <i />
              </div>
            )}
            <div ref={fim} />
          </div>

          <form className="ia-escrever" onSubmit={aoEnviar}>
            <textarea
              ref={campo}
              rows={2}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviar(texto);
                }
              }}
              placeholder="Peça uma seção, um texto, um ajuste…"
              aria-label="Seu pedido para o assistente"
              maxLength={600}
            />
            <button type="submit" className="ia-enviar" disabled={!texto.trim() || pensando} aria-label="Enviar">
              <Icone nome="seta" tamanho={18} />
            </button>
          </form>
          <p className="ia-nota">Na POC o assistente só conversa. No projeto real, usa a API do Claude e segue as regras do design system.</p>
        </section>
      )}
    </>
  );
}
