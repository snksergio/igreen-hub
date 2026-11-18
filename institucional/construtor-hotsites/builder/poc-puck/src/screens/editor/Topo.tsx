import { createUsePuck, useGetPuck } from "@puckeditor/core";
import { useMemo } from "react";
import { PERSONA_DEMO } from "../../lib/persona";
import { montarSeo } from "../../lib/seo";
import { uid } from "../../lib/slug";
import { Icone } from "../../ui/Icone";
import { Menu } from "../../ui/Menu";
import { BotaoTema } from "../../ui/tema";
import { setAba, useEditor } from "./contexto";
import { focarCampo, mostrarNaPrevia, ZONA } from "./navegar";

const usePuck = createUsePuck();

const iniciais = (nome: string) =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

/** Pendências de SEO (só as de atenção), para o número no botão. */
function usePendencias(nome: string, slug: string): number {
  const data = usePuck((s) => s.appState.data);
  return useMemo(
    () => montarSeo({ data, url: `https://exemplo.test/p/${slug}`, nomePagina: nome }).avisos.filter((a) => a.nivel === "atencao").length,
    [data, nome, slug]
  );
}

/** Topo do editor (substitui o cabeçalho do Puck): ferramentas, página e ações. */
export function Topo() {
  const ed = useEditor();
  const getPuck = useGetPuck();
  const history = usePuck((s) => s.history);
  const previewMode = usePuck((s) => s.appState.ui.previewMode);
  const dispatch = usePuck((s) => s.dispatch);
  const pendencias = usePendencias(ed.nome, ed.slug);

  /** Seção livre no fim da página, já selecionada; com IA, abre direto o campo de importar. */
  function inserirLivre(importar: boolean) {
    const { appState, dispatch: d } = getPuck();
    const index = appState.data.content.length;
    const id = `SecaoLivre-${uid()}`;
    d({ type: "insert", componentType: "SecaoLivre", destinationIndex: index, destinationZone: ZONA, id });
    d({ type: "setUi", ui: { itemSelector: { index, zone: ZONA }, rightSideBarVisible: true } });
    setTimeout(() => mostrarNaPrevia(id), 150);
    focarCampo(importar ? "Importar código da IA" : "HTML");
  }

  return (
    <header className="tp">
      <div className="tp-lado">
        <Menu
          rotulo="Menu do construtor"
          classeGatilho="bt tp-marca"
          gatilho={() => (
            <>
              <span className="tp-logo">
                <Icone nome="folha" tamanho={16} />
              </span>
              <span className="bt-rotulo">Hotsites</span>
              <Icone nome="chev" tamanho={15} />
            </>
          )}
        >
          {(fechar) => (
            <nav className="mn-lista" onClick={fechar}>
              <a href="#/">
                <Icone nome="pagina" />
                Todas as páginas
              </a>
              <a href="#/inscricoes">
                <Icone nome="pessoas" />
                Inscrições
              </a>
              <a href={`#/convite/${ed.pageSlug}`}>
                <Icone nome="link" />
                Link de licenciado
              </a>
            </nav>
          )}
        </Menu>
        <button className="bt bt-ic" title="Adicionar peça" aria-label="Adicionar peça" onClick={() => setAba("pecas")}>
          <Icone nome="mais" />
        </button>
        <button className="bt bt-ic tp-esconde-estreito" title="Seção livre (seu código)" aria-label="Adicionar Seção livre" onClick={() => inserirLivre(false)}>
          <Icone nome="codigo" />
        </button>
        <button className="bt bt-ic tp-esconde-estreito" title="Importar código da IA" aria-label="Importar código da IA" onClick={() => inserirLivre(true)}>
          <Icone nome="brilho" />
        </button>
        <button className="bt bt-ic tp-esconde-estreito" title="Imagens" aria-label="Imagens" onClick={() => setAba("imagens")}>
          <Icone nome="imagem" />
        </button>
        <span className="tp-div" aria-hidden="true" />
        <button className="bt bt-ic" title="Desfazer" aria-label="Desfazer" disabled={!history.hasPast} onClick={history.back}>
          <Icone nome="desfazer" />
        </button>
        <button className="bt bt-ic" title="Refazer" aria-label="Refazer" disabled={!history.hasFuture} onClick={history.forward}>
          <Icone nome="refazer" />
        </button>
        <span className="tp-div" aria-hidden="true" />
        <div className="seg seg-ic" role="group" aria-label="Modo da prévia">
          <button
            aria-pressed={previewMode === "edit"}
            title="Editar: clicar seleciona a peça"
            onClick={() => dispatch({ type: "setUi", ui: { previewMode: "edit" } })}
          >
            <Icone nome="cursor" tamanho={16} />
          </button>
          <button
            aria-pressed={previewMode === "interactive"}
            title="Testar: botões, abas e links funcionam"
            onClick={() => dispatch({ type: "setUi", ui: { previewMode: "interactive" } })}
          >
            <Icone nome="play" tamanho={15} cheio />
          </button>
        </div>
      </div>

      <div className="tp-centro">
        <Menu
          rotulo="Nome e endereço da página"
          classeGatilho="tp-titulo"
          lado="centro"
          gatilho={() => (
            <>
              <span className="tp-titulo-txt">{ed.nome || "Sem nome"}</span>
              <Icone nome="chev" tamanho={15} />
            </>
          )}
        >
          {() => (
            <div className="mn-form">
              <label className="cp-campo">
                <span>Nome da página</span>
                <input className="in" value={ed.nome} onChange={(e) => ed.setNome(e.target.value)} onBlur={ed.salvarNome} />
              </label>
              <label className="cp-campo">
                <span>Endereço</span>
                <span className="in in-prefixo">
                  <span>/p/</span>
                  <input
                    value={ed.slug}
                    onChange={(e) => ed.setSlug(e.target.value)}
                    onBlur={ed.confirmarSlug}
                    onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
                  />
                </span>
              </label>
              <p className="mn-nota">O nome aparece no painel; o endereço é o link da página.</p>
            </div>
          )}
        </Menu>
        <span className="tp-salvo" data-erro={ed.conflito || undefined}>
          <span className="tp-salvo-txt">{ed.conflito ? "Não está salvando" : ed.salvo}</span>
        </span>
      </div>

      <div className="tp-lado tp-dir">
        <BotaoTema />
        <button
          className="bt tp-pessoa"
          aria-pressed={ed.comoLicenciado}
          title="Ver a página como o link de um licenciado mostra"
          onClick={ed.alternarLicenciado}
        >
          <span className="av" data-vazio={!ed.comoLicenciado || undefined}>
            {ed.comoLicenciado ? iniciais(PERSONA_DEMO.nome ?? "") : <Icone nome="pessoas" tamanho={15} />}
          </span>
          <span className="tp-pessoa-txt">
            <small>Ver como</small>
            <b>{ed.comoLicenciado ? PERSONA_DEMO.nome : "Visitante"}</b>
          </span>
        </button>
        <button className="bt" aria-pressed={ed.seoAberto} onClick={ed.alternarSeo}>
          <Icone nome="grafico" />
          <span className="bt-rotulo">SEO e IA</span>
          {pendencias > 0 && <span className="selo">{pendencias}</span>}
        </button>
        <a className="bt bt-pri" href={`#/p/${ed.pageSlug}`} target="_blank" rel="noopener">
          <span className="bt-rotulo">Ver página</span>
          <Icone nome="externo" tamanho={16} />
        </a>
      </div>
    </header>
  );
}
