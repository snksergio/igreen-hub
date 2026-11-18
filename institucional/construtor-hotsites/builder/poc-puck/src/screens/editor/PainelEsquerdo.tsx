import { createUsePuck, Puck } from "@puckeditor/core";
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent as EventoMouse } from "react";
import { addImagem, AMOSTRAS, listImagens, type Imagem } from "../../lib/imagens";
import { CATALOGO, type PecaId } from "../../puck/catalogo";
import { config } from "../../puck/config";
import { CAMPOS_IMAGEM, comprimir } from "../../puck/fields/ImagemField";
import { Icone, type NomeIcone } from "../../ui/Icone";
import { setAba, useAba, type Aba } from "./contexto";
import { abrirMenuPeca } from "./MenuPeca";
import { separarRotulo } from "../../ui/Ajuda";
import { destacarNaPrevia, EVENTO_CAMPO, focarCampo, limparDestaqueNaPrevia, mostrarNaPrevia, pegarCampoPedido, tituloNoPainel, ZONA } from "./navegar";

/** Campos do botão que não aparecem como texto: o destaque cai no próprio botão. */
const CAMPOS_DO_BOTAO = new Set(["destino", "link", "mensagemWhats"]);

const usePuck = createUsePuck();

type Campo = { chave: string; rotulo: string; curto: string; icone: NomeIcone | "T" | "#" };

/** Campos de uma peça, na ordem do painel da direita, para listar na Estrutura. */
export function camposDe(tipo: string): Campo[] {
  const fields = ((config.components as Record<string, { fields?: Record<string, { type: string; label?: string }> }>)[tipo]?.fields ??
    {}) as Record<string, { type: string; label?: string }>;
  return Object.entries(fields)
    .filter(([, f]) => f.label && f.label !== "Padrões e guia para IA")
    .map(([chave, f]) => ({
      chave,
      rotulo: f.label!,
      curto: f.label!.replace(/\s*\(.*?\)\s*/g, "").trim(),
      icone: CAMPOS_IMAGEM.has(f)
        ? "imagem"
        : f.type === "text" || f.type === "textarea"
          ? "T"
          : f.type === "number"
            ? "#"
            : f.type === "array"
              ? "lista"
              : f.type === "radio" || f.type === "select"
                ? "alternar"
                : "codigo",
    }));
}

const nomeDa = (tipo: string) => CATALOGO[tipo as PecaId]?.nome ?? tipo;
const tecnicoDa = (tipo: string) => CATALOGO[tipo as PecaId]?.tecnico ?? "";

function Glifo({ icone }: { icone: Campo["icone"] }) {
  return (
    <span className="ar-cglifo" aria-hidden="true">
      {icone === "T" || icone === "#" ? icone : <Icone nome={icone} tamanho={12} />}
    </span>
  );
}

/** Estrutura da página: as seções na ordem, e os campos da que está aberta (clicar leva ao campo). */
function Estrutura() {
  const content = usePuck((s) => s.appState.data.content);
  // Página do kit Live sem a moldura padrão: o cabeçalho e o rodapé fixos não existem.
  const semMoldura = usePuck((s) => (s.appState.data.root?.props as { moldura?: string } | undefined)?.moldura === "sem");
  const sel = usePuck((s) => s.appState.ui.itemSelector);
  const dispatch = usePuck((s) => s.dispatch);
  const selIndex = sel && sel.zone === ZONA ? sel.index : -1;
  const selId = selIndex >= 0 ? content[selIndex]?.props.id : undefined;
  // Aberta/fechada é separado de selecionada: dá para recolher a seção mesmo com ela selecionada.
  // A selecionada abre sozinha; o que a pessoa abriu ou fechou à mão fica como ela deixou.
  const [manuais, setManuais] = useState<Record<string, boolean>>({});
  const [campoAtivo, setCampoAtivo] = useState<string | null>(null);

  // Selecionar uma seção (aqui, na prévia ou por um aviso) abre ela na Estrutura.
  useEffect(() => {
    if (selId)
      setManuais((m) => {
        const n = { ...m };
        delete n[selId];
        return n;
      });
    setCampoAtivo(null);
  }, [selId]);

  // Campo escolhido aparece contornado na prévia. Trocar de campo rola até ele; digitar só acompanha.
  const ultimoDestacado = useRef<string | null>(null);
  useEffect(() => {
    if (!campoAtivo) {
      ultimoDestacado.current = null;
      limparDestaqueNaPrevia();
      return;
    }
    const [id, chave] = campoAtivo.split(":");
    const item = content.find((c) => c.props.id === id);
    if (!item) return limparDestaqueNaPrevia();
    const props = item.props as Record<string, unknown>;
    const campo = camposDe(item.type).find((c) => c.chave === chave);
    const valores = CAMPOS_DO_BOTAO.has(chave) ? [props.botaoTexto] : [props[chave]];
    const rolar = ultimoDestacado.current !== campoAtivo;
    ultimoDestacado.current = campoAtivo;
    // espera a prévia desenhar o valor novo antes de procurar
    const t = window.setTimeout(() => destacarNaPrevia(id, valores, campo?.curto ?? chave, rolar), 60);
    return () => window.clearTimeout(t);
  }, [campoAtivo, content]);
  useEffect(() => () => limparDestaqueNaPrevia(), []);

  // Clique num texto ou botão da prévia escolhe o campo dele (CliqueNaPrevia pede; aqui marca).
  useEffect(() => {
    const pedido = pegarCampoPedido();
    if (pedido) setCampoAtivo(pedido);
    const ouvir = (e: Event) => {
      pegarCampoPedido();
      setCampoAtivo((e as CustomEvent<string>).detail);
    };
    window.addEventListener(EVENTO_CAMPO, ouvir);
    return () => window.removeEventListener(EVENTO_CAMPO, ouvir);
  }, []);

  // Campo com o cursor no painel da direita fica marcado aqui também.
  useEffect(() => {
    const aoFocar = (e: FocusEvent) => {
      const alvo = e.target as HTMLElement;
      const campo = alvo.closest?.('[class*="_Sidebar--right_"] [class*="PuckFields-field"]');
      if (!campo || selIndex < 0) return;
      const titulo = tituloNoPainel(campo);
      const achado = camposDe(content[selIndex]?.type ?? "").find((c) => separarRotulo(c.rotulo).titulo === titulo);
      if (achado) setCampoAtivo(`${selId}:${achado.chave}`);
    };
    document.addEventListener("focusin", aoFocar);
    return () => document.removeEventListener("focusin", aoFocar);
  }, [content, selIndex, selId]);

  const selecionar = (index: number | null, id?: string) => {
    dispatch({ type: "setUi", ui: { itemSelector: index === null ? null : { index, zone: ZONA }, rightSideBarVisible: true } });
    if (id) mostrarNaPrevia(id);
  };
  const menu = (e: EventoMouse, index: number) => {
    e.preventDefault();
    selecionar(index);
    abrirMenuPeca({ x: e.clientX, y: e.clientY, index });
  };

  return (
    <div className="ar">
      <button className="ar-pagina" aria-pressed={sel === null} onClick={() => selecionar(null)}>
        <Icone nome="pagina" />
        <span className="ar-txt">
          <b>Página</b>
          <small>Título no Google, compartilhar, animações</small>
        </span>
      </button>

      <div className="ar-cab">
        <Icone nome="camadas" />
        Seções
        <span className="ar-conta">{content.length}</span>
      </div>

      <ul className="ar-lista">
        {!semMoldura && (
          <li className="ar-no ar-fixo">
            <Icone nome="secao" tamanho={15} className="ar-glifo" />
            <span className="ar-nome">Cabeçalho</span>
            <span className="ar-tec">fixo</span>
            <Icone nome="cadeado" tamanho={14} className="ar-trava" />
          </li>
        )}
        {content.map((item, i) => {
          const id = item.props.id;
          const atual = i === selIndex;
          const aberto = manuais[id] ?? id === selId;
          const travado = Boolean((item.props as { travado?: boolean }).travado);
          return (
            <li key={id}>
              <div className="ar-linha" data-atual={atual || undefined} onContextMenu={(e) => menu(e, i)}>
                <button
                  className="ar-seta"
                  aria-expanded={aberto}
                  aria-label={`${aberto ? "Recolher" : "Mostrar campos de"} ${nomeDa(item.type)}`}
                  onClick={() => setManuais((m) => ({ ...m, [id]: !aberto }))}
                >
                  <Icone nome={aberto ? "chev" : "chevDir"} tamanho={13} />
                </button>
                <button className="ar-no" aria-current={atual || undefined} onClick={() => selecionar(i, id)}>
                  <Icone nome={item.type === "SecaoLivre" ? "codigo" : "secao"} tamanho={15} className="ar-glifo" />
                  <span className="ar-nome">{nomeDa(item.type)}</span>
                  <span className="ar-tec">{tecnicoDa(item.type)}</span>
                  {travado && <Icone nome="cadeado" tamanho={14} className="ar-trava" />}
                </button>
                <button
                  className="ar-mais"
                  aria-label={`Ações de ${nomeDa(item.type)}`}
                  title="Mover, duplicar, destravar, apagar…"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    selecionar(i);
                    abrirMenuPeca({ x: r.left, y: r.bottom + 4, index: i });
                  }}
                >
                  <Icone nome="pontos" tamanho={16} />
                </button>
              </div>
              {aberto && (
                <ul className="ar-campos">
                  {camposDe(item.type).map((c) => {
                    const chave = `${id}:${c.chave}`;
                    return (
                      <li key={c.chave}>
                        <button
                          className="ar-no ar-campo"
                          aria-current={campoAtivo === chave || undefined}
                          onClick={() => {
                            setCampoAtivo(chave);
                            if (!atual) selecionar(i, id);
                            focarCampo(c.rotulo);
                          }}
                        >
                          <Glifo icone={c.icone} />
                          <span className="ar-nome">{c.curto}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
        {!semMoldura && (
          <li className="ar-no ar-fixo">
            <Icone nome="secao" tamanho={15} className="ar-glifo" />
            <span className="ar-nome">Rodapé</span>
            <span className="ar-tec">fixo</span>
            <Icone nome="cadeado" tamanho={14} className="ar-trava" />
          </li>
        )}
      </ul>
      {content.length === 0 && (
        <p className="ar-vazio">
          Página vazia. Abra <button onClick={() => setAba("pecas")}>Peças</button> e arraste a primeira para a página.
        </p>
      )}
      <p className="ar-dica">Botão direito numa seção, aqui ou na página: mover, duplicar, destravar e apagar.</p>
    </div>
  );
}

/** Biblioteca de imagens: enviar, e aplicar na peça selecionada (quando ela tem campo de imagem). */
function Imagens() {
  const [lista, setLista] = useState<Imagem[]>(() => [...listImagens(), ...AMOSTRAS]);
  const [msg, setMsg] = useState("");
  const [enviando, setEnviando] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const selecionada = usePuck((s) => s.selectedItem);
  const sel = usePuck((s) => s.appState.ui.itemSelector);
  const dispatch = usePuck((s) => s.dispatch);

  const fields = selecionada
    ? ((config.components as Record<string, { fields?: Record<string, object> }>)[selecionada.type]?.fields ?? {})
    : {};
  const campo = Object.entries(fields).find(([, f]) => CAMPOS_IMAGEM.has(f))?.[0];

  function aplicar(img: Imagem) {
    if (!selecionada || !campo || !sel) {
      setMsg("Selecione uma peça com imagem (ex.: Abertura). Em listas, como Cards e Galeria, use o campo de cada item.");
      return;
    }
    dispatch({
      type: "replace",
      destinationIndex: sel.index,
      destinationZone: sel.zone ?? ZONA,
      data: { ...selecionada, props: { ...selecionada.props, [campo]: img.src } },
    });
    setMsg(`Imagem aplicada em ${nomeDa(selecionada.type)}.`);
  }

  async function enviar(e: ChangeEvent<HTMLInputElement>) {
    const arquivos = [...(e.target.files ?? [])];
    e.target.value = "";
    if (!arquivos.length) return;
    setEnviando(true);
    try {
      for (const f of arquivos) {
        if (!f.type.startsWith("image/")) continue;
        addImagem(f.name, await comprimir(f));
      }
      setLista([...listImagens(), ...AMOSTRAS]);
      setMsg("Imagem guardada na biblioteca.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Não consegui usar essa imagem.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="im">
      <p className="im-nota">
        {selecionada && campo
          ? `Clique numa imagem para usar em ${nomeDa(selecionada.type)}.`
          : "Imagens enviadas ficam aqui para todas as páginas. Selecione uma peça com imagem para aplicar."}
      </p>
      <div className="im-grade">
        <button className="im-enviar" onClick={() => input.current?.click()} disabled={enviando}>
          <Icone nome="enviar" />
          {enviando ? "Preparando…" : "Enviar"}
        </button>
        {lista.map((img) => (
          <button key={img.id} className="im-op" title={img.nome} onClick={() => aplicar(img)}>
            <img src={img.src} alt={img.nome} loading="lazy" />
          </button>
        ))}
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={enviar} />
      {msg && (
        <p className="im-msg" role="status">
          {msg}
        </p>
      )}
    </div>
  );
}

const ABAS: [Aba, string][] = [
  ["estrutura", "Estrutura"],
  ["pecas", "Peças"],
  ["imagens", "Imagens"],
];

/** Painel flutuante da esquerda (substitui as abas do Puck). */
export function PainelEsquerdo() {
  const aba = useAba();
  return (
    <div className="pe">
      <div className="seg pe-abas" role="tablist" aria-label="Painel">
        {ABAS.map(([id, nome]) => (
          <button key={id} role="tab" aria-selected={aba === id} aria-pressed={aba === id} onClick={() => setAba(id)}>
            {nome}
          </button>
        ))}
      </div>
      <div className="pe-corpo">
        {aba === "estrutura" && <Estrutura />}
        {aba === "pecas" && (
          <div className="pe-pecas">
            <p className="im-nota">Arraste uma peça para a página. Passe o mouse para ver como ela fica.</p>
            <Puck.Components />
          </div>
        )}
        {aba === "imagens" && <Imagens />}
      </div>
    </div>
  );
}
