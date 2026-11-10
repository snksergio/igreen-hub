// v26: "Dá pra ganhar mais" vira carrossel de cartões, com indicadores dentro do cartão, abaixo do saldo e acima de "Seus ganhos".
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let t = fs.readFileSync(arq, "utf8");

// 1. tira a seção antiga (do título até a ajuda)
const ini = t.indexOf('      <h4 class="titulo-sec">Dá pra ganhar mais</h4>');
const fim = t.indexOf("      ${ajudaSecao([", ini);
if (ini < 0 || fim < ini) { console.log("seção antiga não encontrada"); process.exit(1); }
const antiga = t.slice(ini, fim);
if (!antiga.includes('data-mais="pay"') || !antiga.includes("data-ind4")) { console.log("trecho inesperado"); process.exit(1); }
t = t.slice(0, ini) + t.slice(fim);

// 2. carrossel novo antes de "Seus ganhos"
const carrossel = `      <h4 class="titulo-sec">Dá pra ganhar mais</h4>
      <div class="promo" aria-roledescription="carrossel" aria-label="Dá pra ganhar mais">
        <div class="promo-trilho" id="promo-trilho">
          \${[
            ["pay", I.pay, "Pague com o saldo Pay", "Ganhe 1% de cashback por fatura", 'data-mais="pay"'],
            ["ind", I.amigo, "Indique e ganhe", "Cashback a cada fatura paga", "data-ind4"],
            ...(h.p ? [] : [["dia", I.relogio, "Pague em dia", "Mantenha os 15% de desconto", 'data-mais="emdia"']])
          ].map(([k, ic, tit, sub, acao], i, arr) => \`<button type="button" class="promo-slide" \${acao} aria-label="\${tit}. \${sub}. \${i + 1} de \${arr.length}"><span class="ic" aria-hidden="true">\${svg(ic,20)}</span><span class="txt"><b>\${tit}</b><span>\${sub}</span></span>\${svg(I.seta,18)}</button>\`).join("")}
        </div>
        <div class="promo-dots" id="promo-dots"></div>
      </div>
`;
const marcador = '      <div class="sec-cab"><h4 class="titulo-sec">Seus ganhos</h4>';
if (t.split(marcador).length !== 2) { console.log("marcador de Seus ganhos não confere"); process.exit(1); }
t = t.replace(marcador, carrossel + marcador);

// 3. comportamento: indicadores, deslizar e troca automática (para quando a pessoa interage ou prefere menos movimento)
const comportamento = `function iniciarPromo(){
  clearInterval(window.promoTimer);
  const tr = document.getElementById("promo-trilho"), dots = document.getElementById("promo-dots");
  if (!tr || !dots) return;
  const n = tr.children.length;
  dots.innerHTML = Array.from({length: n}, (_, i) => \`<button type="button" class="dot" data-dot="\${i}" aria-label="Ir para o item \${i + 1}" aria-current="\${i === 0}"></button>\`).join("");
  const atual = () => Math.round(tr.scrollLeft / tr.clientWidth);
  const marcarDot = () => dots.querySelectorAll(".dot").forEach((d, i) => d.setAttribute("aria-current", i === atual()));
  const ir = i => tr.scrollTo({left: i * tr.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  tr.addEventListener("scroll", marcarDot, {passive: true});
  dots.querySelectorAll(".dot").forEach(d => d.addEventListener("click", () => ir(+d.dataset.dot)));
  let pausado = false;
  const promo = tr.closest(".promo");
  ["pointerenter", "focusin", "touchstart"].forEach(ev => promo.addEventListener(ev, () => { pausado = true; }, {passive: true}));
  ["pointerleave", "focusout"].forEach(ev => promo.addEventListener(ev, () => { pausado = false; }));
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && n > 1)
    window.promoTimer = setInterval(() => { if (!pausado && document.body.contains(tr)) ir((atual() + 1) % n); }, 4500);
}
function irHub(v){`;
const trocas = [
  ["function irHub(v){", comportamento],
  ["  // ações comuns da tela 4", "  iniciarPromo();\n  // ações comuns da tela 4"],
  ["/* v12 */", `/* v26: carrossel "Dá pra ganhar mais" */
.promo{background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.promo-trilho{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.promo-trilho::-webkit-scrollbar{height:0}
.promo-slide{flex:0 0 100%;scroll-snap-align:start;display:flex;align-items:center;gap:12px;padding:16px 16px 6px;text-align:left;min-height:72px}
.promo-slide .ic{width:44px;height:44px;border-radius:12px;background:var(--gain-bg);color:var(--gain)}
.promo-slide .txt{flex:1;min-width:0}
.promo-slide .txt b{display:block;font-size:.95rem}
.promo-slide .txt span{font-size:.82rem;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.promo-dots{display:flex;justify-content:center;gap:2px;padding:0 0 8px}
.dot{width:24px;height:24px;display:grid;place-items:center;padding:0}
.dot::after{content:"";width:8px;height:8px;border-radius:999px;background:#D7D3C6;transition:width .2s ease}
.dot[aria-current="true"]::after{width:20px;background:var(--gain)}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const k = t.split(a).length - 1;
  if (k !== 1) { console.log("falhou (" + k + "):", a.slice(0, 80)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok");
