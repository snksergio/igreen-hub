/*
 * Importação de código para a Seção livre: a pessoa pede uma página à IA, recebe um .html
 * completo (com <style> e <script>) e sobe o arquivo. Aqui ele é separado em HTML, CSS e
 * JavaScript, e ajustado para viver dentro de uma seção da página, não como página inteira.
 */

export type Importado = {
  html: string;
  css: string;
  js: string;
  /** Bibliotecas externas (https) mantidas, carregadas antes do código. */
  scripts: string[];
  /** Folhas de estilo externas (https) mantidas. */
  estilos: string[];
  avisos: string[];
};

const escapaRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ehHttps = (u: string) => /^https:\/\//i.test(u);
const nomeBase = (caminho: string) => caminho.split(/[?#]/)[0].split("/").pop() ?? "";
/** Endereço que não aponta para um arquivo local (link de fora, dado embutido, âncora…). */
const naoLocal = (u: string) => !u.trim() || /^(https?:|data:|blob:|arquivo:|#|mailto:|tel:|javascript:|\/\/)/i.test(u.trim());

/** :root, html e body passam a significar "esta seção" (&), senão mudariam a página inteira. */
export function escoparCss(css: string): string {
  return css.replace(/(^|[\s{},;>~+(])(:root|html|body)(?=$|[\s,{.:#[>~+)])/gm, "$1&");
}

/* ---------- CSS que não pode ficar dentro de #livre-ID { … } ---------- */

const REGRA_GLOBAL = /^@(?:-webkit-)?(?:keyframes|font-face|import|property|counter-style|font-feature-values|charset)\b/i;

function fimTexto(css: string, i: number): number {
  const aspas = css[i];
  for (let j = i + 1; j < css.length; j++) {
    if (css[j] === "\\") j++;
    else if (css[j] === aspas || css[j] === "\n") return j + 1;
  }
  return css.length;
}

function fimComentario(css: string, i: number): number {
  const fim = css.indexOf("*/", i + 2);
  return fim < 0 ? css.length : fim + 2;
}

/** Fim de uma regra que começa em i: depois do ";" (ex.: @import) ou da "}" que fecha o bloco. */
function fimRegra(css: string, i: number): number {
  let nivel = 0;
  for (let j = i; j < css.length; j++) {
    const c = css[j];
    if (c === "/" && css[j + 1] === "*") j = fimComentario(css, j) - 1;
    else if (c === '"' || c === "'") j = fimTexto(css, j) - 1;
    else if (c === ";" && nivel === 0) return j + 1;
    else if (c === "{") nivel++;
    else if (c === "}" && --nivel <= 0) return j + 1;
  }
  return css.length;
}

/**
 * O CSS da seção vai dentro de #livre-ID { … } (CSS aninhado). @keyframes, @font-face e @import
 * não valem ali dentro: saem para fora (global), o resto fica na seção (local).
 */
export function separarCssGlobal(css: string): { global: string; local: string } {
  const imports: string[] = [];
  const globais: string[] = [];
  let local = "";
  let nivel = 0;
  let i = 0;
  while (i < css.length) {
    const c = css[i];
    let j = i + 1;
    if (c === "/" && css[i + 1] === "*") j = fimComentario(css, i);
    else if (c === '"' || c === "'") j = fimTexto(css, i);
    else if (c === "@" && nivel === 0 && REGRA_GLOBAL.test(css.slice(i, i + 40))) {
      j = fimRegra(css, i);
      const regra = css.slice(i, j).trim();
      if (/^@import/i.test(regra)) imports.push(regra);
      else if (!/^@charset/i.test(regra)) globais.push(regra);
      i = j;
      continue;
    } else if (c === "{") nivel++;
    else if (c === "}") nivel = Math.max(0, nivel - 1);
    local += css.slice(i, j);
    i = j;
  }
  return { global: [...imports, ...globais].join("\n"), local: local.trim() };
}

/* ---------- Importar ---------- */

/** Caminhos de arquivos enviados junto (img/foto.jpg) viram arquivo:NOME da seção. */
function reapontar(texto: string, renomear: Record<string, string>): string {
  let saida = texto;
  for (const [original, novo] of Object.entries(renomear)) {
    const re = new RegExp(`(["'(=\\s])((?:[^"'()\\s]*/)?)${escapaRegex(original)}(?=["')\\s])`, "g");
    saida = saida.replace(re, `$1arquivo:${novo}`);
  }
  return saida;
}

/** Imagens e arquivos citados no código que não vieram no upload. */
function faltando(html: string, css: string): string[] {
  const achados = new Set<string>();
  for (const m of html.matchAll(/\b(?:src|poster)="([^"]+)"/gi)) if (!naoLocal(m[1])) achados.add(nomeBase(m[1]));
  for (const m of html.matchAll(/\bhref="([^"]+)"/gi))
    if (!naoLocal(m[1]) && /\.(png|jpe?g|webp|gif|svg|avif|pdf|mp4|webm)(\?|#|$)/i.test(m[1])) achados.add(nomeBase(m[1]));
  for (const m of `${html}\n${css}`.matchAll(/url\(\s*['"]?([^'")]+)/gi)) if (!naoLocal(m[1])) achados.add(nomeBase(m[1]));
  return [...achados].filter(Boolean);
}

/**
 * Separa um .html (completo ou só um pedaço) em HTML, CSS e JS da seção.
 * - renomear: nome original de cada imagem enviada junto → nome dela na seção (arquivo:NOME).
 * - anexos: .css e .js enviados junto, pelo nome do arquivo. Entram no lugar do <link>/<script src>.
 */
export function importarHtml(
  texto: string,
  renomear: Record<string, string> = {},
  anexos: Record<string, string> = {}
): Importado {
  const doc = new DOMParser().parseFromString(texto, "text/html");
  const avisos: string[] = [];
  const scripts: string[] = [];
  const estilos: string[] = [];
  const css: string[] = [];
  const js: string[] = [];
  const usados = new Set<string>();

  // <style> e <link> na ordem em que aparecem (a ordem muda o resultado do CSS).
  doc.querySelectorAll('style, link[rel~="stylesheet"]').forEach((el) => {
    if (el.tagName === "STYLE") css.push(el.textContent ?? "");
    else {
      const href = el.getAttribute("href") ?? "";
      const base = nomeBase(href);
      if (!ehHttps(href) && base in anexos) {
        css.push(anexos[base]);
        usados.add(base);
      } else if (ehHttps(href)) estilos.push(href);
      else if (href) avisos.push(`O CSS "${href}" não veio junto: envie o arquivo no mesmo upload.`);
    }
    el.remove();
  });

  doc.querySelectorAll("script").forEach((s) => {
    const src = s.getAttribute("src") ?? "";
    const tipo = (s.getAttribute("type") ?? "").toLowerCase();
    const base = nomeBase(src);
    if (tipo === "application/ld+json") {
      avisos.push("Tirei dados estruturados (ld+json) do arquivo: a página já gera os dela.");
    } else if (src && !ehHttps(src) && base in anexos) {
      js.push(anexos[base]);
      usados.add(base);
    } else if (src) {
      if (/cdn\.tailwindcss\.com/i.test(src))
        avisos.push("Tirei o Tailwind pelo CDN: ele muda o visual da página inteira. Peça à IA CSS puro.");
      else if (ehHttps(src)) scripts.push(src);
      else avisos.push(`O script "${src}" não veio junto: envie o arquivo no mesmo upload.`);
    } else {
      const codigo = s.textContent ?? "";
      if (tipo === "module" || /^\s*import\s/m.test(codigo))
        avisos.push("O JavaScript usa import (módulo): pode não funcionar. Peça à IA um script sem import.");
      js.push(codigo);
    }
    s.remove();
  });

  // .css e .js enviados junto que o HTML não citava: entram no fim.
  for (const [nome, conteudo] of Object.entries(anexos)) {
    if (usados.has(nome)) continue;
    if (/\.css$/i.test(nome)) css.push(conteudo);
    else if (/\.m?js$/i.test(nome)) js.push(conteudo);
  }

  const h1s = [...doc.body.querySelectorAll("h1")];
  for (const h1 of h1s) {
    const h2 = doc.createElement("h2");
    for (const a of [...h1.attributes]) h2.setAttribute(a.name, a.value);
    while (h1.firstChild) h2.appendChild(h1.firstChild);
    h1.replaceWith(h2);
  }
  if (h1s.length)
    avisos.push(`Troquei ${h1s.length === 1 ? "1 <h1>" : `${h1s.length} <h1>`} por <h2>: a página já tem um título principal.`);

  const classeBody = doc.body.getAttribute("class");
  if (classeBody) avisos.push(`O <body> tinha class="${classeBody}": se o CSS dependia dela, ajuste o CSS.`);

  const cssBruto = css.map((c) => c.trim()).filter(Boolean).join("\n\n");
  const cssEscopado = escoparCss(cssBruto);
  if (cssEscopado !== cssBruto)
    avisos.push("Ajustei :root, html e body do CSS para valerem só nesta seção (confira fundo e altura).");
  if (estilos.length) avisos.push(`Mantive ${estilos.length} estilo(s) externo(s): deixam a página um pouco mais lenta.`);
  if (scripts.length)
    avisos.push(`Mantive ${scripts.length} biblioteca(s) externa(s): carregam antes do código e pesam no desempenho.`);

  const html = reapontar(doc.body.innerHTML.trim(), renomear);
  const cssFinal = reapontar(cssEscopado, renomear);
  const faltam = faltando(html, cssFinal);
  if (faltam.length) avisos.push(`Não vieram junto: ${faltam.join(", ")}. Envie no mesmo upload, junto com o .html.`);

  return {
    html,
    css: cssFinal,
    js: js.map((c) => c.trim()).filter(Boolean).join("\n\n"),
    scripts,
    estilos,
    avisos,
  };
}

/** Texto colado: se for a resposta da IA com blocos ```html ```css ```js, junta num HTML só. */
export function textoColado(texto: string): string {
  if (!texto.includes("```")) return texto;
  const html: string[] = [];
  const css: string[] = [];
  const js: string[] = [];
  for (const m of texto.matchAll(/```([\w-]*)[^\n]*\n([\s\S]*?)```/g)) {
    const lingua = m[1].toLowerCase();
    const corpo = m[2].trim();
    if (/^(css|scss)$/.test(lingua)) css.push(corpo);
    else if (/^(js|javascript|jsx|mjs)$/.test(lingua)) js.push(corpo);
    else if (/^(html|htm|xml)$/.test(lingua) || (!lingua && corpo.startsWith("<"))) html.push(corpo);
  }
  return `${html.join("\n")}${css.length ? `<style>${css.join("\n")}</style>` : ""}${js.length ? `<script>${js.join("\n")}</script>` : ""}`;
}

/* ---------- Rodar ---------- */

/** Funções que o código declara: ficam em window para onclick="nome()" do HTML funcionar. */
function funcoesDeclaradas(js: string): string[] {
  const nomes = new Set<string>();
  for (const m of js.matchAll(/(?:^|[\n;{}])\s*(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/g)) nomes.add(m[1]);
  for (const m of js.matchAll(
    /(?:^|[\n;{}])\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g
  ))
    nomes.add(m[1]);
  return [...nomes];
}

/**
 * Envolve o JavaScript da seção para rodar como numa página própria:
 * - recebe `secao` (e também acha tudo por document, como o código da IA costuma fazer);
 * - DOMContentLoaded, load e window.onload funcionam mesmo se a página já carregou;
 * - funções declaradas ficam disponíveis para onclick="…" do HTML (sem trocar as do navegador);
 * - um erro no código da seção não derruba o resto da página.
 */
export function envolverCodigo(js: string, idSecao: string): string {
  const corpo = js.replace(/<\/script/gi, "<\\/script");
  const id = JSON.stringify(idSecao);
  const expor = funcoesDeclaradas(js)
    .map((n) => `if(!(${JSON.stringify(n)} in window)&&typeof ${n}==="function")window.${n}=${n};`)
    .join("");
  return `(function(){var secao=document.getElementById(${id});if(!secao)return;
var d=document,w=window,da=d.addEventListener,wa=w.addEventListener,ol=w.onload;
function passou(t){return t==="DOMContentLoaded"?d.readyState!=="loading":t==="load"&&d.readyState==="complete";}
function chamar(alvo,f,t){Promise.resolve().then(function(){var ev=new Event(t);if(typeof f==="function")f.call(alvo,ev);else if(f&&f.handleEvent)f.handleEvent(ev);});}
function ponte(alvo,orig){return function(t,f,o){if(passou(t)){chamar(alvo,f,t);return;}return orig.call(this,t,f,o);};}
d.addEventListener=ponte(d,da);w.addEventListener=ponte(w,wa);
try{(function(secao){
${corpo}
;try{${expor}}catch(e){}
}).call(secao,secao);}catch(e){console.error("Seção livre "+${id}+":",e);}
finally{delete d.addEventListener;delete w.addEventListener;}
if(w.onload!==ol&&passou("load")){var f=w.onload;w.onload=ol;chamar(w,f,"load");}
})();`;
}
