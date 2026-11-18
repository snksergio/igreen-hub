import type { ComponentConfig } from "@puckeditor/core";
import { useEffect, useRef, useState } from "react";
import { resolverArquivos, type Arquivo } from "../../lib/arquivos";
import { envolverCodigo, separarCssGlobal } from "../../lib/importarHtml";
import { formatarNumero, partesNumero } from "../../lib/tempo";
import { usePageCtx } from "../context";
import { arquivosField } from "../fields/ArquivosField";
import { codigoField, guiaField } from "../fields/CodigoField";
import { importarField, type Importacao } from "../fields/ImportarField";
import { MODELOS_LIVRE } from "../guia";
import { fundoField, Section, travaPermissions, useVisivel, type Fundo } from "../ui";

/*
 * Seção livre: HTML, CSS e JavaScript de quem edita (ou de uma IA), dentro do container
 * e do fundo do padrão. É código com poder total: no MVP, só para quem tiver permissão.
 * - CSS: vale só nesta seção (vai dentro de #livre-ID, com CSS aninhado). @keyframes,
 *   @font-face e @import ficam fora, porque não valem aninhados.
 * - JS: roda na página publicada, recebendo `secao`, como se a página fosse dele
 *   (DOMContentLoaded, onload e onclick="função()" funcionam). No editor, roda numa
 *   prévia isolada (PreviaComJs); nas miniaturas do painel, não roda.
 * - Bibliotecas externas (https): carregam antes do JS.
 */
export type SecaoLivreProps = {
  guia: string;
  modelo: string;
  importacao: Importacao;
  /** Imagens e PDFs enviados para esta seção, usados no código como arquivo:NOME. */
  arquivos: Arquivo[];
  html: string;
  css: string;
  js: string;
  /** Endereços https de bibliotecas (.js) e estilos (.css), um por linha. */
  externos: string;
  fundo: Fundo;
  travado?: boolean;
};

/** Impede o conteúdo de fechar a tag <style> por dentro. */
const semFechamento = (s: string) => s.replace(/<\/style/gi, "<\\/style");

const ehEstilo = (u: string) => /\.css(\?|#|$)/i.test(u) || /fonts\.googleapis\.com\/css/i.test(u);

/** Separa os endereços externos em estilos e scripts. Só https entra. */
export function lerExternos(texto: string | undefined): { estilos: string[]; scripts: string[] } {
  const linhas = (texto ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^https:\/\/\S+$/i.test(l));
  return { estilos: linhas.filter(ehEstilo), scripts: linhas.filter((l) => !ehEstilo(l)) };
}

/* Na página aberta no navegador (sem HTML estático), o JS da seção roda por aqui. */
const carregando = new Map<string, Promise<void>>();
function carregarScript(src: string): Promise<void> {
  let p = carregando.get(src);
  if (!p) {
    p = new Promise<void>((ok, falha) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => ok();
      s.onerror = () => falha(new Error(`Não carregou ${src}`));
      document.head.appendChild(s);
    });
    carregando.set(src, p);
  }
  return p;
}
/** Seção que já rodou este código: evita rodar duas vezes (o React em modo dev monta duas vezes). */
const jaRodou = new WeakMap<Element, string>();

function Conteudo({ html, vazio }: { html: string; vazio: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { visivel, animar } = useVisivel();

  // Números com data-conta contam até o valor quando a seção entra na tela (como nas outras peças).
  useEffect(() => {
    if (!animar || !visivel || !ref.current) return;
    ref.current.querySelectorAll<HTMLElement>("[data-conta]").forEach((el) => {
      const p = partesNumero(el.dataset.conta ?? "");
      if (!p) return;
      const t0 = performance.now();
      const passo = (t: number) => {
        const k = Math.min(1, (t - t0) / 1200);
        el.textContent = formatarNumero(p, p.valor * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
  }, [animar, visivel]);

  if (!html.trim()) return vazio ? <div className="hs-ph">{vazio}</div> : null;
  return <div ref={ref} className="hs-livre__conteudo" dangerouslySetInnerHTML={{ __html: html }} />;
}

type DadosPrevia = { id: string; fundo: string; html: string; estilo: string; estilos: string[]; scripts: string[]; codigo: string };

/**
 * No editor, a seção com JavaScript aparece numa pagininha própria (iframe) onde o código roda
 * como na página publicada. Cada mudança remonta a pagininha (com uma pausa curta enquanto se digita),
 * clicar nela seleciona a peça e erros do JavaScript aparecem num aviso.
 */
function PreviaComJs(p: DadosPrevia) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [doc, setDoc] = useState("");
  const [altura, setAltura] = useState(200);
  const [erros, setErros] = useState<string[]>([]);
  const chave = JSON.stringify(p);

  useEffect(() => {
    let vivo = true;
    const t = setTimeout(
      async () => {
        const { documentoDaPrevia } = await import("../previaLivre");
        if (!vivo) return;
        setErros([]);
        setDoc(documentoDaPrevia(JSON.parse(chave) as DadosPrevia));
      },
      doc ? 600 : 0
    );
    return () => {
      vivo = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só a mudança do conteúdo remonta a prévia
  }, [chave]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const aoErrar = (e: Event) => {
      const msg = String((e as CustomEvent).detail).replace(/^Seção livre "?livre-[^\s:]*:?\s*/, "");
      setErros((lista) => (lista.includes(msg) ? lista : [...lista, msg].slice(-3)));
    };
    el.addEventListener("erro-livre", aoErrar);
    return () => el.removeEventListener("erro-livre", aoErrar);
  }, []);

  function aoCarregar() {
    const el = ref.current;
    const w = el?.contentWindow;
    const d = el?.contentDocument;
    const hs = d?.querySelector<HTMLElement>(".hs");
    if (!el || !w || !d || !hs) return;
    const medir = () => setAltura(Math.min(4000, Math.ceil(hs.getBoundingClientRect().height)));
    medir();
    // ResizeObserver da própria pagininha: observa o conteúdo dela e some junto quando ela recarrega.
    new (w as Window & typeof globalThis).ResizeObserver(medir).observe(hs);
    // Clicar no conteúdo também seleciona a peça no editor (o clique segue para o código da seção).
    d.addEventListener("click", () => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })), true);
  }

  return (
    <div className="hs-livre-previa">
      {erros.length > 0 && (
        <div className="hs-livre-erro" role="alert">
          <strong>Erro no JavaScript desta seção</strong>
          {erros.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
      <iframe
        ref={ref}
        title="Prévia da Seção livre com JavaScript"
        srcDoc={doc}
        onLoad={aoCarregar}
        style={{ display: "block", width: "100%", height: altura, border: 0 }}
      />
    </div>
  );
}

function View(p: SecaoLivreProps & { id: string }) {
  const { mode, estatico } = usePageCtx();
  const idSecao = `livre-${p.id}`;
  // arquivo:NOME vira o arquivo enviado, no HTML e no CSS.
  const { global, local } = separarCssGlobal(resolverArquivos((p.css ?? "").trim(), p.arquivos));
  const html = resolverArquivos(p.html ?? "", p.arquivos);
  const js = (p.js ?? "").trim();
  const codigo = js ? envolverCodigo(js, idSecao) : "";
  const { estilos, scripts } = lerExternos(p.externos);
  const chaveScripts = scripts.join("\n");

  useEffect(() => {
    if (mode !== "publico" || estatico || !codigo) return;
    const secao = document.getElementById(idSecao);
    if (!secao || jaRodou.get(secao) === codigo) return;
    jaRodou.set(secao, codigo);
    (async () => {
      for (const src of chaveScripts ? chaveScripts.split("\n") : []) {
        try {
          await carregarScript(src);
        } catch (e) {
          console.error(`Seção livre (${idSecao}):`, e);
        }
      }
      new Function(codigo)();
    })();
  }, [mode, estatico, codigo, idSecao, chaveScripts]);

  const estilo = [global, local && `#${idSecao}{${local}}`].filter(Boolean).join("\n");

  if (mode === "editor" && (codigo || scripts.length))
    return <PreviaComJs id={idSecao} fundo={p.fundo ?? "claro"} html={html} estilo={estilo} estilos={estilos} scripts={scripts} codigo={codigo} />;

  return (
    <Section id={idSecao} fundo={p.fundo} travado={p.travado} className="hs-livre">
      {estilos.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {estilo && <style dangerouslySetInnerHTML={{ __html: semFechamento(estilo) }} />}
      <Conteudo html={html} vazio={mode === "editor" ? "Seção livre vazia: escolha um modelo, importe ou escreva o HTML" : ""} />
      {/* No HTML estático o navegador roda estes <script>; na POC aberta no navegador, quem roda é o useEffect. */}
      {estatico && scripts.map((src) => <script key={src} src={src} defer />)}
      {estatico && codigo && (
        <script
          dangerouslySetInnerHTML={{
            // Com biblioteca externa (defer), o código espera ela carregar.
            __html: scripts.length ? `document.addEventListener("DOMContentLoaded",function(){${codigo}});` : codigo,
          }}
        />
      )}
    </Section>
  );
}

export const SecaoLivre: ComponentConfig<SecaoLivreProps> = {
  label: "Seção livre",
  fields: {
    guia: guiaField,
    modelo: {
      type: "select",
      label: "Começar com (trocar substitui o código abaixo)",
      options: Object.entries(MODELOS_LIVRE).map(([value, m]) => ({ label: m.nome, value })),
    },
    importacao: importarField,
    arquivos: arquivosField,
    html: codigoField("HTML", "Sem <section> e sem <h1>. O container já vem pronto.", 12),
    css: codigoField("CSS (vale só nesta seção)", ".minha-classe { color: var(--verde); }", 8),
    js: codigoField("JavaScript (use a variável secao)", 'secao.querySelector(".x")', 8),
    externos: codigoField(
      "Bibliotecas externas (https, uma por linha)",
      "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js",
      3
    ),
    fundo: fundoField,
  },
  defaultProps: {
    guia: "",
    modelo: "titulo-texto",
    importacao: null,
    arquivos: [],
    html: MODELOS_LIVRE["titulo-texto"].html,
    css: MODELOS_LIVRE["titulo-texto"].css,
    js: MODELOS_LIVRE["titulo-texto"].js,
    externos: "",
    fundo: "claro",
  },
  resolveData: (data, { changed, trigger }) => {
    const p = data.props;
    // Importação: distribui o arquivo da IA nos campos de código e guarda só o resumo.
    // (O Puck compara com a última entrada, então o resumo também conta como "mudou": por isso o teste de pendente.)
    if (changed.importacao && p.importacao && "pendente" in p.importacao) {
      const n = p.importacao.pendente;
      const novos = new Set(n.arquivos.map((a) => a.nome));
      return {
        ...data,
        props: {
          ...p,
          html: n.html,
          css: n.css,
          js: n.js,
          externos: [...n.estilos, ...n.scripts].join("\n"),
          // Arquivo com o mesmo nome: vale o que acabou de chegar.
          arquivos: [...(p.arquivos ?? []).filter((a) => !novos.has(a.nome)), ...n.arquivos],
          importacao: { resumo: { origem: n.origem, avisos: n.avisos } },
        },
      };
    }
    // Escolher outro modelo troca o código de partida (só quando a pessoa muda o campo).
    const m = MODELOS_LIVRE[p.modelo];
    if (trigger === "replace" && changed.modelo && m) return { ...data, props: { ...p, html: m.html, css: m.css, js: m.js } };
    return data;
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...(p as SecaoLivreProps & { id: string })} />,
};
