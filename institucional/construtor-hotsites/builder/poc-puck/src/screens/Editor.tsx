import { createUsePuck, Puck, useGetPuck, type Data, type Overrides, type Plugin } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import "../app.css";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Alvo } from "../lib/seo";
import { uid } from "../lib/slug";
import { manterTopoTravado } from "../lib/locks";
import { alteradaEmOutroLugar, getPage, savePage, setSlug, type PageRecord } from "../lib/pages";
import { PERSONA_DEMO } from "../lib/persona";
import { PageContext } from "../puck/context";
import { config } from "../puck/config";
import { DICIONARIO, TELAS } from "../puck/dicionario";
import { ItemGaveta } from "../puck/ItemGaveta";
import { Assistente } from "./editor/Assistente";
import { CamposComCabecalho, RadioSegmentado } from "./editor/Campos";
import { CliqueNaPrevia } from "./editor/CliqueNaPrevia";
import { RotuloDoCampo } from "./editor/Rotulo";
import { EditorContext, setAba, useEditor, type ApiPuck, type EditorCtx } from "./editor/contexto";
import { focarCampo, mostrarNaPrevia, rotuloDoCampo, ZONA } from "./editor/navegar";
import { Atalhos } from "./editor/Atalhos";
import { MenuNaPrevia, MenuPeca } from "./editor/MenuPeca";
import { PainelEsquerdo } from "./editor/PainelEsquerdo";
import { Topo } from "./editor/Topo";
import { PainelSeo } from "./PainelSeo";
import { NaoEncontrada } from "./Shell";

const usePuck = createUsePuck();

/**
 * Roda dentro do Puck. Se alguém soltar uma peça acima da Abertura travada,
 * devolve as peças travadas do topo para o lugar delas.
 */
function GuardaTrava() {
  const content = usePuck((s) => s.appState.data.content);
  const dispatch = usePuck((s) => s.dispatch);
  const anterior = useRef(content);
  useEffect(() => {
    const corrigido = manterTopoTravado(anterior.current, content);
    if (corrigido) {
      dispatch({ type: "setData", data: { content: corrigido } });
      return;
    }
    anterior.current = content;
  }, [content, dispatch]);
  return null;
}

/** Roda dentro do Puck e entrega para fora os comandos de selecionar e inserir peças. */
function Ponte() {
  const { apiPuck } = useEditor();
  const dispatch = usePuck((s) => s.dispatch);
  const getPuck = useGetPuck();
  useEffect(() => {
    apiPuck.current = { dispatch, getPuck };
  }, [apiPuck, dispatch, getPuck]);
  return null;
}

/*
 * O layout continua sendo o do Puck (ele cuida de arrastar, zoom e tamanhos de tela);
 * por cima, o topo, o painel da esquerda, o cabeçalho dos campos e as opções são nossos.
 * Ficam fora do componente para não serem recriados a cada mudança: o que muda chega
 * pelo EditorContext.
 */
const OVERRIDES: Partial<Overrides> = {
  header: () => (
    <>
      <Ponte />
      <GuardaTrava />
      <Atalhos />
      <MenuNaPrevia />
      <MenuPeca />
      <Topo />
      <CliqueNaPrevia />
      <Assistente />
    </>
  ),
  drawerItem: ({ name }) => <ItemGaveta name={name} />,
  fields: ({ children }) => <CamposComCabecalho>{children}</CamposComCabecalho>,
  fieldTypes: { radio: RadioSegmentado as never },
  // O que está entre parênteses no rótulo vira um ícone de ajuda com a explicação.
  fieldLabel: RotuloDoCampo as never,
};

/**
 * O painel da esquerda substitui as abas "Peças" e "Estrutura" do Puck. A Estrutura dele vira
 * uma aba vazia: o Puck abre a primeira da lista, e assim a primeira é a nossa.
 */
const PLUGINS: Plugin[] = [
  { name: "blocks", label: "Painel", render: () => <PainelEsquerdo /> },
  { name: "outline", label: "Estrutura", render: () => <></> },
];

export function Editor({ id }: { id: string }) {
  const inicial = useMemo(() => getPage(id), [id]);
  const pageRef = useRef<PageRecord | undefined>(inicial);
  const conflitoRef = useRef(false);
  const [slug, setSlugInput] = useState(inicial?.slug ?? "");
  const [nome, setNome] = useState(inicial?.title ?? "");
  const [comoLicenciado, setComoLicenciado] = useState(false);
  const [salvo, setSalvo] = useState("Salvo");
  const [conflito, setConflito] = useState(false);
  const [seoAberto, setSeoAberto] = useState(false);
  const [, setVersao] = useState(0);
  const apiPuck = useRef<ApiPuck | null>(null);

  /** Botão "Ajustar"/"Adicionar" de um aviso: seleciona o lugar certo e foca o campo. */
  const irPara = (alvo: Alvo) => {
    const api = apiPuck.current;
    if (!api) return;
    const abrir = (itemSelector: { index: number; zone: string } | null) =>
      api.dispatch({ type: "setUi", ui: { itemSelector, rightSideBarVisible: true } });

    if (alvo.tipo === "pagina") {
      abrir(null);
      focarCampo(rotuloDoCampo(null, alvo.campo));
      return;
    }
    if (alvo.tipo === "peca") {
      const content = api.getPuck().appState.data.content;
      const index = content.findIndex((c) => c.props.id === alvo.id);
      if (index < 0) return;
      abrir({ index, zone: ZONA });
      mostrarNaPrevia(alvo.id);
      focarCampo(rotuloDoCampo(content[index].type, alvo.campo));
      return;
    }
    const novoId = `${alvo.peca}-${uid()}`;
    api.dispatch({ type: "insert", componentType: alvo.peca, destinationIndex: alvo.posicao, destinationZone: ZONA, id: novoId });
    abrir({ index: alvo.posicao, zone: ZONA });
    setTimeout(() => mostrarNaPrevia(novoId), 150);
    focarCampo(rotuloDoCampo(alvo.peca, "titulo"));
  };

  useEffect(() => {
    document.title = `Editando · ${inicial?.title ?? "página"}`;
    setAba("estrutura"); // cada página abre na Estrutura
  }, [inicial]);

  // Outra aba salvou esta mesma página: para de salvar aqui para não apagar o trabalho de lá.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "poc-hotsite:pages" || !pageRef.current) return;
      if (alteradaEmOutroLugar(id, pageRef.current.updatedAt)) {
        conflitoRef.current = true;
        setConflito(true);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [id]);

  if (!inicial || !pageRef.current) return <NaoEncontrada />;

  const salvar = (patch: Partial<PageRecord>) => {
    if (conflitoRef.current) return;
    const atual = pageRef.current!;
    const { persistido, ...pagina } = savePage({ ...atual, ...patch });
    pageRef.current = pagina;
    setVersao((v) => v + 1);
    setSalvo(
      persistido
        ? `Salvo às ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
        : "Navegador sem espaço: as mudanças valem só até fechar a aba. Use imagens menores."
    );
  };

  const confirmarSlug = () => {
    if (conflitoRef.current) return;
    const final = setSlug(id, slug || nome);
    pageRef.current = getPage(id);
    setSlugInput(final);
    setSalvo("Endereço atualizado");
  };

  const ctx = {
    persona: comoLicenciado ? PERSONA_DEMO : {},
    mode: "editor" as const,
    pageId: id,
    pageSlug: pageRef.current.slug,
  };

  const editor: EditorCtx = {
    pageId: id,
    pageSlug: pageRef.current.slug,
    nome,
    setNome,
    salvarNome: () => salvar({ title: nome.trim() || "Sem nome" }),
    slug,
    setSlug: setSlugInput,
    confirmarSlug,
    salvo,
    conflito,
    comoLicenciado,
    alternarLicenciado: () => setComoLicenciado((v) => !v),
    seoAberto,
    alternarSeo: () => setSeoAberto((a) => !a),
    irPara,
    apiPuck,
  };

  return (
    <div className="ed">
      {conflito && (
        <div className="ed-conflito" role="alert">
          Esta página foi alterada em outra aba. Para não apagar o que foi feito lá, esta aba parou de salvar.
          <button className="bt" onClick={() => window.location.reload()}>
            Carregar a versão mais nova
          </button>
        </div>
      )}
      {seoAberto && <PainelSeo page={pageRef.current} onFechar={() => setSeoAberto(false)} onIr={irPara} />}
      <div className="ed-puck">
        <EditorContext.Provider value={editor}>
          <PageContext.Provider value={ctx}>
            <Puck
              config={config}
              data={inicial.data}
              onChange={(data: Data) => salvar({ data })}
              onPublish={(data: Data) => salvar({ data })}
              headerTitle={nome}
              height="100%"
              dictionary={DICIONARIO}
              viewports={TELAS}
              plugins={PLUGINS}
              overrides={OVERRIDES}
            />
          </PageContext.Provider>
        </EditorContext.Provider>
      </div>
    </div>
  );
}
