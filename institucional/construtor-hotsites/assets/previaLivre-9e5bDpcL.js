import{t as e}from"./hotsite-B_E3ZKXT.js";var t=e=>e.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`),n=(e,t)=>e.replace(RegExp(`</${t}`,`gi`),`<\\/${t}`),r=`(function(){var f=window.frameElement;function av(m){try{f&&f.dispatchEvent(new CustomEvent("erro-livre",{detail:String(m)}))}catch(e){}}
addEventListener("error",function(e){var t=e.target;av(e.message||("Não carregou "+((t&&(t.src||t.href))||"um arquivo")))},true);
var ce=console.error;console.error=function(){av([].map.call(arguments,function(a){return a&&a.message?a.message:String(a)}).join(" "));return ce.apply(console,arguments)};})();`;function i(i){let a=i.estilos.map(e=>`<link rel="stylesheet" href="${t(e)}">`).join(``),o=i.scripts.map(e=>`<script src="${t(e)}" defer><\/script>`).join(``),s=i.scripts.length?`document.addEventListener("DOMContentLoaded",function(){${i.codigo}});`:i.codigo;return`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<script>${r}<\/script>
<style>${e}</style><style>html,body{background:transparent}.hs{min-height:0}</style>${a}
${i.estilo?`<style>${n(i.estilo,`style`)}</style>`:``}
</head><body><div class="hs"><section id="${t(i.id)}" class="hs-sec hs-livre" data-fundo="${t(i.fundo)}"><div class="hs-wrap"><div class="hs-livre__conteudo">${i.html}</div></div></section></div>
${o}${s?`<script>${n(s,`script`)}<\/script>`:``}
</body></html>`}export{i as documentoDaPrevia};