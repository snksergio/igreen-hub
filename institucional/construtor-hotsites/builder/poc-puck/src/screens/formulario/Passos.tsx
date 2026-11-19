import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Campo as CampoView } from "../../form/Campo";
import { Conversa, valorDeTeste } from "../../form/Conversa";
import { Fluxo } from "../../form/Fluxo";
import "../../form/conversa.css";
import "../../form/form.css";
import { camposNaPagina, dividirEtapas, podeFicarNaPagina, ROTULO_TIPO, type AjusteSecao, type Campo, type Formulario } from "../../lib/formularios";
import type { PageRecord } from "../../lib/pages";
import type { Respostas } from "../../lib/submissions";
import { Icone } from "../../ui/Icone";
import "../../ui/confirmar.css";
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
    titulo: "Visualização na página",
    texto: "Escolha à esquerda quais perguntas aparecem no cartão da página. Ao lado, o cartão como fica. As outras são feitas depois de enviar.",
  },
  {
    id: "enviar",
    titulo: "Ao enviar",
    texto: "Prévia da janela que abre quando a pessoa envia: as perguntas que faltam, o resumo e a confirmação. Dá para clicar e testar; nada é gravado.",
  },
];

/** Os três passos no topo da coluna do meio, ligados por uma linha. */
export function Passos({ atual, ir }: { atual: Passo; ir: (p: Passo) => void }) {
  const i = PASSOS.findIndex((p) => p.id === atual);
  return (
    <div className="ps">
      <ol className="ps-lista" aria-label="Passos do formulário">
        {PASSOS.map((p, n) => (
          <li key={p.id} data-estado={n < i ? "antes" : n === i ? "agora" : "depois"}>
            <button type="button" aria-current={n === i ? "step" : undefined} onClick={() => ir(p.id)}>
              <span className="ps-n" aria-hidden="true">
                {n < i ? <Icone nome="check" tamanho={14} /> : n + 1}
              </span>
              <span className="ps-nome">
                {p.titulo}
                {n < i && <span className="ps-feito"> (feito)</span>}
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


/* ---------- Passo 2: o cartão na página ---------- */

type Menu = { id: string; x: number; y: number };

/**
 * O cartão do formulário montado aqui mesmo (sem carregar a página): fundo verde-escuro chapado e
 * o cartão sempre no mesmo desenho, para todo formulário. Muda na hora, sem pulo de tamanho.
 * Cada pergunta pode ser clicada (ou clicada com o botão direito) para tirar da página ou editar.
 */
function CartaoNaPagina({ f, ajuste, tirar, editar }: { f: Formulario; ajuste: AjusteSecao | undefined; tirar: (id: string) => void; editar: (id: string) => void }) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const caixaMenu = useRef<HTMLDivElement>(null);
  const campos = camposNaPagina(f, ajuste);

  // O menu fecha com Esc ou clicando fora dele.
  useEffect(() => {
    if (!menu) return;
    caixaMenu.current?.querySelector("button")?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    const fora = (e: MouseEvent) => !caixaMenu.current?.contains(e.target as Node) && setMenu(null);
    document.addEventListener("keydown", tecla);
    document.addEventListener("mousedown", fora);
    return () => {
      document.removeEventListener("keydown", tecla);
      document.removeEventListener("mousedown", fora);
    };
  }, [menu]);

  const abrir = (id: string, alvo: HTMLElement, ponto?: { x: number; y: number }) => {
    const base = area.current!.getBoundingClientRect();
    const r = alvo.getBoundingClientRect();
    const x = ponto ? ponto.x - base.left : r.right - base.left - 214;
    const y = ponto ? ponto.y - base.top : r.top - base.top + 10;
    setMenu({ id, x: Math.max(8, Math.min(x, base.width - 220)), y });
  };

  return (
    <div className="ps-pagina">
      <div className="ps-cartao-area" ref={area}>
        <div className="fm-pagina ps-cartao" data-tema="live">
          {campos.length === 0 ? (
            <p className="fm-texto">Nenhuma pergunta ligada para a página. O cartão mostra só o botão, que abre o formulário inteiro.</p>
          ) : (
            <div className="fm-linhas">
              {campos.map((c) => (
                <div key={c.id} className="ps-campo" data-meia={c.meia ? "" : undefined}>
                  <div inert>
                    <CampoView campo={{ ...c, condicao: undefined, meia: false }} r={{}} erros={{}} muda={() => {}} pele="fm" form={f} pageId="" />
                  </div>
                  <button
                    type="button"
                    className="ps-alvo"
                    data-aberto={menu?.id === c.id || undefined}
                    aria-label={`${nomeDoCampo(c)}: tirar da página ou editar`}
                    aria-haspopup="menu"
                    onClick={(e) => abrir(c.id, e.currentTarget)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      abrir(c.id, e.currentTarget, { x: e.clientX, y: e.clientY });
                    }}
                  >
                    <span className="ps-alvo-dica" aria-hidden="true">
                      Clique para tirar
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="fm-acoes">
            <button className="fm-bt fm-bt-pri" type="button" disabled>
              {f.botaoPagina || "Continuar"}
            </button>
          </div>
        </div>
        {menu && (
          <div className="ps-menu" role="menu" ref={caixaMenu} style={{ left: menu.x, top: menu.y }}>
            <p className="ps-menu-tit">{nomeDoCampo(f.campos.find((c) => c.id === menu.id))}</p>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                tirar(menu.id);
                setMenu(null);
              }}
            >
              <Icone nome="olho" tamanho={15} />
              Tirar da página
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                editar(menu.id);
                setMenu(null);
              }}
            >
              <Icone nome="lapis" tamanho={15} />
              Editar pergunta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function NaPagina({ f, pagina, tirar, editar }: { f: Formulario; pagina: PageRecord | undefined; tirar: (id: string) => void; editar: (id: string) => void }) {
  const secao = secaoDoFormulario(pagina, f.id);
  const ajuste = secao?.props.camposSecao;
  const ajustada = Boolean(ajuste && Object.keys(ajuste).length);
  return (
    <div className="ps-palco ps-palco-largo">
      <CartaoNaPagina f={f} ajuste={ajuste} tirar={tirar} editar={editar} />
      <p className="ps-legenda">
        <span>Clique numa pergunta para tirar da página.</span>
        {pagina && (
          <a href={`#/ver/${pagina.slug}`} target="_blank" rel="noopener">
            Ver a página inteira
            <Icone nome="externo" tamanho={13} />
          </a>
        )}
      </p>
      {!pagina && (
        <p className="ps-aviso">
          <Icone nome="alerta" tamanho={15} />
          Este formulário ainda não está em nenhuma página. Para usar, escolha ele no bloco de inscrição de uma página.
        </p>
      )}
      {ajustada && (
        <p className="ps-aviso">
          <Icone nome="ajustes" tamanho={15} />
          Na página {pagina?.title}, a seção esconde ou traz perguntas só nela (em “Campos nesta seção”). O cartão acima já mostra assim.
        </p>
      )}
    </div>
  );
}

/* ---------- Passo 3: a janela que abre ao enviar ---------- */

/** Página do kit Live: a janela de inscrição dela é escura. */
const ehLive = (p: PageRecord | undefined) => Boolean(p?.data.content?.some((b) => b.type.startsWith("Live")));

/** O que a pessoa já teria digitado no cartão da página (valores de teste). */
function respostasDaPagina(f: Formulario, ajuste: AjusteSecao | undefined): Respostas {
  const r: Respostas = {};
  for (const c of camposNaPagina(f, ajuste)) {
    if (c.tipo === "info") continue;
    const v = valorDeTeste(c);
    if (v !== undefined) r[c.id] = v;
  }
  return r;
}

/**
 * A janela de inscrição com o desenho do site (clara, ou escura no kit Live), parada sobre um
 * fundo verde padrão. Não carrega a página: fica leve e não depende do que a página tiver.
 */
export function AoEnviar({ f, pagina }: { f: Formulario; pagina: PageRecord | undefined }) {
  const [direto, setDireto] = useState(false);
  const [rodada, setRodada] = useState(0);
  const ajuste = secaoDoFormulario(pagina, f.id)?.props.camposSecao;
  const tema = ehLive(pagina) ? "live" : "claro";
  const iniciais = direto ? {} : respostasDaPagina(f, ajuste);
  const ctx = { page: pagina, pageId: pagina?.id ?? "", pageSlug: pagina?.slug ?? "", origem: "direto", previa: true };
  const recomecar = () => setRodada((n) => n + 1);
  const chave = `${direto}-${rodada}-${f.estilo}-${f.atualizadoEm}-${JSON.stringify(f.campos).length}`;

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

/* ---------- Concluir: confirma com o resumo do que mudou e comemora ---------- */

const TEXTOS_DO_FORM: (keyof Formulario)[] = ["nome", "regras", "botaoPagina", "botaoFinal", "estilo"];
const lista = (nomes: string[]) => (nomes.length <= 3 ? nomes.join(", ") : `${nomes.slice(0, 3).join(", ")} e mais ${nomes.length - 3}`);

/** O que mudou no formulário desde que a tela foi aberta, em frases curtas. */
export function resumoDasMudancas(antes: Formulario, agora: Formulario): string[] {
  const idsAntes = new Map(antes.campos.map((c) => [c.id, c]));
  const idsAgora = new Map(agora.campos.map((c) => [c.id, c]));
  const nome = (c: Campo) => (c.tipo === "etapa" ? `etapa “${c.rotulo}”` : nomeDoCampo(c));
  const novas = agora.campos.filter((c) => !idsAntes.has(c.id)).map(nome);
  const tiradas = antes.campos.filter((c) => !idsAgora.has(c.id)).map(nome);
  const semPagina = (c: Campo) => JSON.stringify({ ...c, naPagina: undefined });
  const editadas = agora.campos.filter((c) => idsAntes.has(c.id) && semPagina(c) !== semPagina(idsAntes.get(c.id)!)).map(nome);
  const entrou = agora.campos.filter((c) => idsAntes.has(c.id) && Boolean(c.naPagina) && !idsAntes.get(c.id)!.naPagina).map(nome);
  const saiu = agora.campos.filter((c) => idsAntes.has(c.id) && !c.naPagina && Boolean(idsAntes.get(c.id)!.naPagina)).map(nome);
  const ficaram = agora.campos.filter((c) => idsAntes.has(c.id)).map((c) => c.id);
  const ordem = ficaram.join() !== antes.campos.filter((c) => idsAgora.has(c.id)).map((c) => c.id).join();
  const textos = TEXTOS_DO_FORM.some((k) => JSON.stringify(antes[k]) !== JSON.stringify(agora[k]));

  const frases: string[] = [];
  if (novas.length) frases.push(`${novas.length === 1 ? "Pergunta nova" : `${novas.length} perguntas novas`}: ${lista(novas)}`);
  if (tiradas.length) frases.push(`${tiradas.length === 1 ? "Pergunta tirada" : `${tiradas.length} perguntas tiradas`}: ${lista(tiradas)}`);
  if (editadas.length) frases.push(`${editadas.length === 1 ? "Pergunta editada" : `${editadas.length} perguntas editadas`}: ${lista(editadas)}`);
  if (entrou.length) frases.push(`Passou a aparecer na página: ${lista(entrou)}`);
  if (saiu.length) frases.push(`Saiu da página: ${lista(saiu)}`);
  if (ordem) frases.push("A ordem das perguntas mudou");
  if (textos) frases.push("Regras e textos do formulário (botões, vagas, prazos ou estilo)");
  return frases;
}

/** Pedacinhos que saem do check quando conclui (cor, ângulo, distância, atraso). */
const CONFETES = Array.from({ length: 18 }, (_, i) => ({
  a: `${(360 / 18) * i + (i % 2 ? 8 : -6)}deg`,
  d: `${70 + (i % 3) * 22}px`,
  c: ["#00a859", "#a8ff35", "#4cd494", "#d8ffa6", "#007a3d"][i % 5],
  s: `${(i % 4) * 0.03}s`,
  w: i % 3 === 0 ? "10px" : "6px",
}));

/**
 * "Concluir formulário": primeiro pergunta se salva e conclui, mostrando o que mudou; no sim,
 * salva, comemora e oferece continuar editando ou voltar. Esc ou clicar fora fecham.
 */
export function Concluir({
  f,
  inicial,
  voltar,
  salvar,
  fechar,
}: {
  f: Formulario;
  inicial: Formulario;
  voltar: { href: string; fim: string };
  salvar: () => void;
  fechar: () => void;
}) {
  const [fase, setFase] = useState<"confirmar" | "pronto">("confirmar");
  const caixa = useRef<HTMLDivElement>(null);
  const [mudancas] = useState(() => resumoDasMudancas(inicial, f));

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("keydown", tecla);
      anterior?.focus?.();
    };
  }, [fechar]);
  // O foco vai para o botão principal de cada fase.
  useEffect(() => {
    caixa.current?.querySelector<HTMLElement>("[data-principal]")?.focus();
  }, [fase]);

  const alvo = document.querySelector(".app") ?? document.body;
  return createPortal(
    <div className="cfm-fundo" onMouseDown={(e) => e.target === e.currentTarget && fechar()}>
      <div className="cfm ps-fim" role="dialog" aria-modal="true" aria-labelledby="ps-fim-tit" data-fase={fase} ref={caixa}>
        {fase === "confirmar" ? (
          <div className="ps-fim-corpo" key="confirmar">
            <h2 id="ps-fim-tit">Salvar e concluir o formulário?</h2>
            <div className="cfm-txt">
              {mudancas.length ? (
                <>
                  <p>O que você mudou desde que abriu:</p>
                  <ul className="ps-mudancas">
                    {mudancas.map((m) => (
                      <li key={m}>
                        <Icone nome="check" tamanho={14} />
                        {m}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Nenhuma mudança desde que você abriu. Pode concluir.</p>
              )}
            </div>
            <div className="cfm-acoes">
              <button type="button" className="bt" onClick={fechar}>
                Continuar editando
              </button>
              <button
                type="button"
                className="bt bt-pri"
                data-principal=""
                onClick={() => {
                  salvar();
                  setFase("pronto");
                }}
              >
                Sim, salvar e concluir
              </button>
            </div>
          </div>
        ) : (
          <div className="ps-fim-corpo ps-fim-pronto" key="pronto" role="status">
            <div className="ps-festa" aria-hidden="true">
              {CONFETES.map((p, i) => (
                <i key={i} style={{ "--a": p.a, "--d": p.d, "--c": p.c, "--s": p.s, "--w": p.w } as CSSProperties} />
              ))}
              <span className="ps-ok-ic">
                <svg viewBox="0 0 24 24">
                  <path pathLength={1} d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
            </div>
            <h2 id="ps-fim-tit">Formulário concluído com sucesso</h2>
            <p className="cfm-txt">As alterações foram salvas.</p>
            <div className="cfm-acoes">
              <button type="button" className="bt" onClick={fechar}>
                Continuar editando
              </button>
              <a className="bt bt-pri" href={voltar.href} data-principal="">
                {voltar.fim}
                <Icone nome="chevDir" tamanho={15} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>,
    alvo
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
