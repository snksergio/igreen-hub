import { useEffect, useRef, useState } from "react";
import { Campo as CampoView } from "../../form/Campo";
import { Conversa, valorDeTeste } from "../../form/Conversa";
import { Fluxo } from "../../form/Fluxo";
import "../../form/conversa.css";
import "../../form/form.css";
import { camposNaPagina, dividirEtapas, podeFicarNaPagina, ROTULO_TIPO, type AjusteSecao, type Campo, type Formulario } from "../../lib/formularios";
import type { PageRecord } from "../../lib/pages";
import type { Respostas } from "../../lib/submissions";
import { enderecoPrevia } from "../../ui/Aparelho";
import { Icone } from "../../ui/Icone";
import "./passos.css";

/* O construtor de formulário em três passos: montar as perguntas, ver o que fica na página e
   ver o que a pessoa vê ao enviar. Cada prévia mostra o que existe de verdade na página ligada. */

export type Passo = "montagem" | "pagina" | "enviar";

export const PASSOS: { id: Passo; titulo: string; texto: string }[] = [
  {
    id: "montagem",
    titulo: "Montagem",
    texto: "Todas as perguntas do formulário, na ordem em que são feitas. No próximo passo você escolhe quais aparecem na página.",
  },
  {
    id: "pagina",
    titulo: "Na página",
    texto: "Escolha à esquerda quais perguntas aparecem no cartão da página. Ao lado, o cartão como fica. As outras são feitas depois de enviar.",
  },
  {
    id: "enviar",
    titulo: "Ao enviar",
    texto: "Prévia da janela que abre quando a pessoa envia: as perguntas que faltam, o resumo e a confirmação. Dá para clicar e testar; nada é gravado.",
  },
];

/** Os três passos no topo da coluna do meio, ligados por uma linha. */
export function Passos({ atual, ir, naPagina }: { atual: Passo; ir: (p: Passo) => void; naPagina: number }) {
  const i = PASSOS.findIndex((p) => p.id === atual);
  return (
    <div className="ps">
      <ol className="ps-lista" aria-label="Passos do formulário">
        {PASSOS.map((p, n) => (
          <li key={p.id} data-estado={n < i ? "antes" : n === i ? "agora" : "depois"}>
            <button type="button" aria-current={n === i ? "step" : undefined} onClick={() => ir(p.id)}>
              <span className="ps-n" aria-hidden="true">
                {n + 1}
              </span>
              <span className="ps-nome">
                {p.titulo}
                {p.id === "pagina" && <small> · {naPagina === 1 ? "1 pergunta" : `${naPagina} perguntas`}</small>}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="ps-texto">{PASSOS[i].texto}</p>
    </div>
  );
}

/** Voltar e seguir, no fim de cada passo. No último, concluir. */
export function NavPasso({ atual, ir, concluir }: { atual: Passo; ir: (p: Passo) => void; concluir: () => void }) {
  const i = PASSOS.findIndex((p) => p.id === atual);
  const antes = PASSOS[i - 1];
  const depois = PASSOS[i + 1];
  return (
    <nav className="ps-nav" aria-label="Navegar entre os passos">
      {antes ? (
        <button type="button" className="bt" onClick={() => ir(antes.id)}>
          <Icone nome="voltar" tamanho={15} />
          {antes.titulo}
        </button>
      ) : (
        <span />
      )}
      {depois ? (
        <button type="button" className="bt bt-pri" onClick={() => ir(depois.id)}>
          Próximo: {depois.titulo}
          <Icone nome="chevDir" tamanho={15} />
        </button>
      ) : (
        <button type="button" className="bt bt-pri" onClick={concluir}>
          <Icone nome="check" tamanho={15} />
          Concluir formulário
        </button>
      )}
    </nav>
  );
}

/** A seção da página que mostra este formulário (a peça de inscrição). */
export function secaoDoFormulario(p: PageRecord | undefined, formId: string) {
  return (p?.data.content ?? []).find((b) => (b.props as { formularioId?: string } | undefined)?.formularioId === formId) as
    | { type: string; props: { id?: string; camposSecao?: AjusteSecao } }
    | undefined;
}

/** Página do kit Live: a janela de inscrição dela é escura. */
const ehLive = (p: PageRecord | undefined) => Boolean(p?.data.content?.some((b) => b.type.startsWith("Live")));

/* ---------- Passo 2: o cartão na página ---------- */

const LARGURA = 390; // a página desenhada como num celular
const MARGEM = 24;

/**
 * Só o cartão do formulário, recortado da página de verdade (desenhada na largura de um celular).
 * A altura acompanha o cartão: muda quando uma pergunta entra ou sai da página.
 */
function RecorteDoCartao({ src }: { src: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [caixa, setCaixa] = useState<{ x: number; y: number; w: number; h: number; raio: string } | null>(null);

  useEffect(() => {
    setCaixa(null);
    let ultimo = "";
    const t = window.setInterval(() => {
      const f = frame.current;
      const w = f?.contentWindow;
      const d = f?.contentDocument;
      const alvo = d?.querySelector<HTMLElement>("[data-form-inscricao]");
      if (!w || !d || !alvo) return;
      if (!d.getElementById("ps-recorte")) {
        const s = d.createElement("style");
        s.id = "ps-recorte";
        s.textContent = "html{overflow:hidden!important;scrollbar-width:none}";
        d.head.appendChild(s);
      }
      const r = alvo.getBoundingClientRect();
      const topo = r.top + w.scrollY;
      if (Math.abs(r.top - MARGEM) > 1) w.scrollTo(0, Math.max(0, topo - MARGEM));
      const n = { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.ceil(r.height), raio: w.getComputedStyle(alvo).borderRadius };
      const chave = JSON.stringify(n);
      if (chave !== ultimo) {
        ultimo = chave;
        setCaixa(n);
      }
    }, 250);
    return () => window.clearInterval(t);
  }, [src]);

  const altura = Math.max(844, (caixa?.h ?? 0) + MARGEM * 2);
  return (
    <div
      className="ps-recorte"
      data-pronto={caixa ? "" : undefined}
      style={caixa ? { width: caixa.w, height: caixa.h, borderRadius: caixa.raio } : { width: LARGURA - 32, height: 460 }}
      inert
    >
      <iframe
        ref={frame}
        src={src}
        title="Prévia do cartão de inscrição na página"
        tabIndex={-1}
        style={{ width: LARGURA, height: altura, transform: caixa ? `translate(${-caixa.x}px, ${-caixa.y}px)` : undefined }}
      />
      {!caixa && <span className="ps-carregando">Carregando a prévia…</span>}
    </div>
  );
}

/** Sem página ligada: a versão curta numa peça padrão, só para ter uma ideia. */
function CartaoPadrao({ f }: { f: Formulario }) {
  const [r, setR] = useState<Respostas>({});
  const campos = camposNaPagina(f);
  return (
    <div className="fc-cartao fm-pagina ps-padrao">
      {campos.length === 0 ? (
        <p className="fm-texto">Nenhuma pergunta marcada “Mostrar na página”. A seção mostra só o botão, que abre o formulário inteiro.</p>
      ) : (
        <div className="fm-linhas">
          {campos.map((c) => (
            <CampoView key={c.id} campo={c} r={r} erros={{}} muda={(id, v) => setR((x) => ({ ...x, [id]: v ?? "" }))} pele="fm" form={f} pageId="" />
          ))}
        </div>
      )}
      <div className="fm-acoes">
        <button className="fm-bt fm-bt-pri" type="button" disabled>
          {f.botaoPagina || "Continuar"}
        </button>
      </div>
    </div>
  );
}

export function NaPagina({ f, pagina }: { f: Formulario; pagina: PageRecord | undefined }) {
  const secao = secaoDoFormulario(pagina, f.id);
  if (!pagina || !secao?.props.id)
    return (
      <div className="ps-palco">
        <p className="ps-aviso">
          <Icone nome="alerta" tamanho={15} />
          Este formulário ainda não está em nenhuma página. Quando estiver, aparece aqui o cartão de verdade. Por enquanto, uma peça padrão:
        </p>
        <CartaoPadrao f={f} />
      </div>
    );
  const ajustada = Boolean(secao.props.camposSecao && Object.keys(secao.props.camposSecao).length);
  return (
    <div className="ps-palco">
      <RecorteDoCartao src={enderecoPrevia(pagina.slug, { bloco: secao.props.id })} />
      <p className="ps-legenda">
        <span>
          Seção de inscrição de <b>{pagina.title}</b>, no celular
        </span>
        <a href={`#/ver/${pagina.slug}`} target="_blank" rel="noopener">
          Ver a página inteira
          <Icone nome="externo" tamanho={13} />
        </a>
      </p>
      {ajustada && (
        <p className="ps-aviso">
          <Icone nome="ajustes" tamanho={15} />
          Esta seção esconde ou traz perguntas só nela (no construtor da página, em “Campos nesta seção”). A prévia já mostra assim.
        </p>
      )}
    </div>
  );
}

/* ---------- Passo 3: a janela que abre ao enviar ---------- */

/**
 * A janela de inscrição com o mesmo desenho da página (claro, ou escuro no kit Live): o mesmo
 * modal, só que parado aqui em vez de flutuar sobre a página.
 */
export function AoEnviar({ f, pagina }: { f: Formulario; pagina: PageRecord | undefined }) {
  const [direto, setDireto] = useState(false);
  const [rodada, setRodada] = useState(0);
  const ajuste = secaoDoFormulario(pagina, f.id)?.props.camposSecao;
  const tema = ehLive(pagina) ? "live" : "claro";
  const iniciais: Respostas = {};
  if (!direto)
    for (const c of camposNaPagina(f, ajuste)) {
      if (c.tipo === "info") continue;
      const v = valorDeTeste(c);
      if (v !== undefined) iniciais[c.id] = v;
    }
  const ctx = { page: pagina, pageId: pagina?.id ?? "", pageSlug: pagina?.slug ?? "", origem: "direto", previa: true };
  const recomecar = () => setRodada((n) => n + 1);
  const chave = `${direto}-${rodada}-${f.estilo}-${f.atualizadoEm}`;

  return (
    <div className="ps-palco ps-palco-largo">
      <div className="ps-barra">
        <div className="seg" role="group" aria-label="Como a janela abre">
          <button aria-pressed={!direto} onClick={() => setDireto(false)}>
            Depois de preencher a página
          </button>
          <button aria-pressed={direto} onClick={() => setDireto(true)}>
            Aberta direto por um botão
          </button>
        </div>
        <button type="button" className="bt bt-p" onClick={recomecar}>
          <Icone nome="desfazer" tamanho={14} />
          Recomeçar
        </button>
      </div>
      <div className="fm-fundo ps-janela" data-tema={tema}>
        <div className="fm-modal" role="dialog" aria-label="Prévia da janela de inscrição">
          <header className="fm-modal-topo">
            <span className="fm-modal-evento">{pagina?.title ?? "Inscrição"}</span>
            <button type="button" className="fm-fechar" onClick={recomecar} aria-label="Fechar (recomeça a prévia)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>
          <div className="fm-modal-corpo">
            {f.estilo === "formulario" ? (
              <Fluxo key={chave} form={f} completo={direto} ajuste={ajuste} iniciais={iniciais} ctx={ctx} />
            ) : (
              <Conversa key={chave} form={f} completo={direto} ajuste={ajuste} iniciais={iniciais} ctx={ctx} fechar={recomecar} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Passo 2: a lista de perguntas, para mostrar ou esconder na página ---------- */

const naoPergunta = (c: Campo) => c.tipo === "etapa" || c.tipo === "oculto" || c.tipo === "info";

/** Nome curto: o aceite e o texto informativo têm rótulos longos. */
function nomeDoCampo(c: Campo | undefined) {
  if (!c) return "outra pergunta";
  if (c.tipo === "lgpd") return "Aceite de privacidade";
  const r = (c.rotulo || ROTULO_TIPO[c.tipo]).trim();
  return r.length > 44 ? `${r.slice(0, 42).trimEnd()}…` : r;
}

/**
 * No lugar dos tipos de campo (não é hora de incluir nem tirar perguntas): as perguntas que o
 * formulário já tem, cada uma com o botão de mostrar no cartão da página ou deixar para depois.
 */
export function ListaNaPagina({ f, pagina, muda }: { f: Formulario; pagina: PageRecord | undefined; muda: (id: string, naPagina: boolean) => void }) {
  const ajuste = secaoDoFormulario(pagina, f.id)?.props.camposSecao;
  const ficam = new Set(camposNaPagina(f).map((c) => c.id));
  const etapas = dividirEtapas(f.campos)
    .map((e) => ({ ...e, campos: e.campos.filter(podeFicarNaPagina) }))
    .filter((e) => e.campos.length);
  const aqui = f.campos.filter((c) => ficam.has(c.id) && !naoPergunta(c)).length;
  const depois = f.campos.filter((c) => !ficam.has(c.id) && !naoPergunta(c)).length;
  const sempreDepois = f.campos.some((c) => c.tipo === "ingresso" || c.tipo === "oculto");

  return (
    <div className="pl">
      <div className="pl-topo">
        <h2>Perguntas na página</h2>
        <p>Ligue as que aparecem no cartão. As desligadas são feitas depois de enviar.</p>
      </div>
      {etapas.map((e, i) => (
        <section key={i} className="pl-grupo" aria-label={e.titulo}>
          {etapas.length > 1 && <h3>{e.titulo}</h3>}
          {e.campos.map((c) => {
            const marcado = Boolean(c.naPagina);
            const fica = ficam.has(c.id);
            const pai = c.condicao?.campo ? f.campos.find((x) => x.id === c.condicao!.campo) : undefined;
            const estado = fica ? "No cartão da página" : marcado ? `Depois de enviar: depende de “${nomeDoCampo(pai)}”` : "Depois de enviar";
            const naSecao = ajuste?.[c.id];
            return (
              <label key={c.id} className="fc-liga pl-item" data-fora={!fica || undefined}>
                <input type="checkbox" role="switch" checked={marcado} onChange={(ev) => muda(c.id, ev.target.checked)} />
                <span className="fc-trilho" aria-hidden="true" />
                <span className="fc-liga-txt pl-txt">
                  <b>{nomeDoCampo(c)}</b>
                  <small>{estado}</small>
                  {naSecao !== undefined && <em>Nesta página, a seção {naSecao ? "mostra" : "esconde"}</em>}
                </span>
              </label>
            );
          })}
        </section>
      ))}
      <p className="pl-conta">
        <b>{aqui}</b> no cartão · <b>{depois}</b> depois de enviar
      </p>
      <p className="fc-dica">
        {sempreDepois ? "Ingresso e campos ocultos ficam sempre para depois de enviar. " : ""}Para incluir ou tirar perguntas, volte à Montagem.
      </p>
    </div>
  );
}

/** O resumo no "Concluir formulário". */
export function ResumoConclusao({ f, pagina }: { f: Formulario; pagina: PageRecord | undefined }) {
  const total = f.campos.filter((c) => !naoPergunta(c)).length;
  const noCartao = camposNaPagina(f).filter((c) => !naoPergunta(c)).length;
  return (
    <>
      <p>Tudo o que você fez já está salvo. Ao concluir, você volta para onde estava.</p>
      <ul className="pl-resumo">
        <li>
          <b>{total}</b> {total === 1 ? "pergunta" : "perguntas"} no formulário
        </li>
        <li>
          <b>{noCartao}</b> no cartão da página
        </li>
        <li>
          <b>{total - noCartao}</b> depois de enviar
        </li>
      </ul>
      <p>
        {pagina ? (
          <>
            Aparece na página <b>{pagina.title}</b>.
          </>
        ) : (
          "Ainda não está em nenhuma página: escolha este formulário no bloco de inscrição de uma página."
        )}
      </p>
    </>
  );
}
