import css from "../hotsite.css?inline";

/*
 * Prévia da Seção livre com JavaScript, no editor. A seção vira uma pagininha própria
 * (num iframe dentro da prévia), montada como a publicada: assim o código roda igual e,
 * a cada mudança, recomeça do zero (sem timers e ouvintes acumulados da versão anterior).
 * Só o editor carrega este arquivo, então a página publicada não leva este CSS duplicado.
 */

type Previa = {
  id: string;
  fundo: string;
  html: string;
  /** CSS pronto: o global (@keyframes…) e o da seção dentro de #id { … }. */
  estilo: string;
  estilos: string[];
  scripts: string[];
  /** JavaScript já envolvido por envolverCodigo. */
  codigo: string;
};

const atributo = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const semFechar = (s: string, tag: "style" | "script") => s.replace(new RegExp(`</${tag}`, "gi"), `<\\/${tag}`);

/** Primeiro script da pagininha: manda cada erro para o editor mostrar (evento erro-livre no iframe). */
const AVISAR_ERROS = `(function(){var f=window.frameElement;function av(m){try{f&&f.dispatchEvent(new CustomEvent("erro-livre",{detail:String(m)}))}catch(e){}}
addEventListener("error",function(e){var t=e.target;av(e.message||("Não carregou "+((t&&(t.src||t.href))||"um arquivo")))},true);
var ce=console.error;console.error=function(){av([].map.call(arguments,function(a){return a&&a.message?a.message:String(a)}).join(" "));return ce.apply(console,arguments)};})();`;

export function documentoDaPrevia(p: Previa): string {
  const links = p.estilos.map((h) => `<link rel="stylesheet" href="${atributo(h)}">`).join("");
  const libs = p.scripts.map((s) => `<script src="${atributo(s)}" defer></script>`).join("");
  const codigo = p.scripts.length ? `document.addEventListener("DOMContentLoaded",function(){${p.codigo}});` : p.codigo;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<script>${AVISAR_ERROS}</script>
<style>${css}</style><style>html,body{background:transparent}.hs{min-height:0}</style>${links}
${p.estilo ? `<style>${semFechar(p.estilo, "style")}</style>` : ""}
</head><body><div class="hs"><section id="${atributo(p.id)}" class="hs-sec hs-livre" data-fundo="${atributo(p.fundo)}"><div class="hs-wrap"><div class="hs-livre__conteudo">${p.html}</div></div></section></div>
${libs}${codigo ? `<script>${semFechar(codigo, "script")}</script>` : ""}
</body></html>`;
}
