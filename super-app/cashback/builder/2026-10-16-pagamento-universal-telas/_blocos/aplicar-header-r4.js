// Propostas de header, rodada 4 (pedido do Sergio em 22/10): na B, a meta vira cartão largo (meia-lua à esquerda,
// texto à direita) e os indicadores viram cartões maiores com ilustração; proposta C nova: branca, com as abas da B
// e os meses clicáveis da A.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "header-propostas.html");
let t = fs.readFileSync(arq, "utf8");
const um = (a, b) => {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 90)); process.exit(1); }
  t = t.replace(a, b);
};

// JS: meta, ilustrações e aba Total da B
let ini = t.indexOf("// Medidor em meia-lua"), fim = t.indexOf("function abaEconomia(d, e, sel){");
if (ini < 0 || fim < ini) { console.log("marcadores da B não encontrados"); process.exit(1); }
t = t.slice(0, ini) + fs.readFileSync(path.join(__dirname, "header-meta-r4.txt"), "utf8") + "\n" + t.slice(fim);
// JS: proposta C
um('document.querySelectorAll("[data-estado]").forEach(b => b.addEventListener("click", () => {',
   fs.readFileSync(path.join(__dirname, "header-c-r4.txt"), "utf8") + 'document.querySelectorAll("[data-estado]").forEach(b => b.addEventListener("click", () => {');
const n = t.split("renderA(); renderB();").length - 1;
if (n !== 2) { console.log("renderA/renderB: esperava 2, achei " + n); process.exit(1); }
t = t.split("renderA(); renderB();").join("renderA(); renderB(); renderC();");
um('document.getElementById("tabB").innerHTML = tabbar();', 'document.getElementById("tabB").innerHTML = tabbar();\ndocument.getElementById("tabC").innerHTML = tabbar();');
um('const st = {pago:false, mesA:null, metrica:"total", mesB:null, auto:false};', 'const st = {pago:false, mesA:null, metrica:"total", mesB:null, metC:"total", mesC:null};');

// HTML: coluna C
um(`        <nav class="tabbar" aria-label="Navegação principal" id="tabB"></nav>
      </div>
    </section>`, `        <nav class="tabbar" aria-label="Navegação principal" id="tabB"></nav>
      </div>
    </section>

    <section class="col" aria-labelledby="tc">
      <div class="col-head"><h2 id="tc">C · Mescla da A com a B</h2><p>Cartão branco da A com as abas da B. Os meses da A ficam clicáveis em todas as abas e mudam o número mostrado. Na aba Cashback, o painel escuro da A leva à central de cashback.</p></div>
      <div class="phone">
        <div class="status" aria-hidden="true"><span>9:41</span><span>▮▮▮ ◔</span></div>
        <span class="tag">Regras fictícias</span>
        <div class="screen">
          <div class="bar"><button class="icon-btn" type="button" aria-label="Voltar"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button></div>
          <div id="propC"></div>
          <div class="depois" aria-hidden="true"><h4>Dá pra ganhar mais</h4><div class="fantasma">o resto do hub continua como na v1</div></div>
        </div>
        <nav class="tabbar" aria-label="Navegação principal" id="tabC"></nav>
      </div>
    </section>`);

// Página
um(".page{max-width:1000px;", ".page{max-width:1320px;");
um("<h1>Header do hub · duas propostas</h1>", "<h1>Header do hub · três propostas</h1>");
um(`A proposta A segue o print de referência. A proposta B separa o conteúdo em abas. Toque nos meses e nas abas: os números mudam.`,
   `A proposta A segue o print de referência. A proposta B separa o conteúdo em abas. A C junta as duas: o cartão branco da A com as abas da B. Toque nos meses e nas abas: os números mudam.`);

// Estilos
um(".pulsa{animation:pulsa .7s ease}", `/* rodada 4: cartão da meta, indicadores com ilustração e proposta C */
.meta-card{display:flex;align-items:center;gap:14px;border-radius:20px;padding:14px 14px 14px 10px;background:rgba(255,255,255,.12);position:relative}
.meta-card.claro{background:var(--broto-bg)}
.meta-g{position:relative;width:132px;height:78px;flex:none}
.meta-n{position:absolute;left:0;right:0;bottom:-2px;text-align:center;line-height:1}
.meta-n b{font-size:1.7rem;font-weight:700;letter-spacing:-.02em}
.meta-n small{font-size:.74rem;font-weight:600;margin-left:3px;opacity:.8}
.meta-t{display:grid;gap:4px;min-width:0}
.meta-t .chip{justify-self:start}
.meta-t b{font-size:.98rem;line-height:1.2}
.meta-t > span:not(.chip){font-size:.78rem;opacity:.85}
.meta-t .bolas{display:flex;gap:4px;margin-top:2px}
.meta-t .bolas i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.3)}
.meta-t .bolas i.ok{background:var(--ouro)}
.meta-t .bolas i.agora{background:transparent;border:1.5px dashed rgba(255,255,255,.7)}
.meta-card.claro .meta-t > span:not(.chip){color:var(--ink-2);opacity:1}
.meta-card.claro .meta-t .bolas i{background:#D9D5CA}
.meta-card.claro .meta-t .bolas i.ok{background:var(--broto)}
.meta-card.claro .meta-t .bolas i.agora{background:transparent;border-color:#B8B2A2}
.ind-carrossel{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -18px;padding:0 18px 6px;scrollbar-width:none;position:relative}
.ind-carrossel::-webkit-scrollbar{height:0}
.ind-card{flex:0 0 164px;scroll-snap-align:start;border-radius:20px;padding:14px;display:grid;gap:2px;align-content:start;background:rgba(255,255,255,.12);min-height:156px}
.ind-card svg{width:52px;height:52px;margin-bottom:8px}
.ind-card b{font-size:1.25rem;font-weight:700}
.ind-card span{font-size:.8rem;color:rgba(255,255,255,.8)}
.ind-carrossel.claro{margin:0 -20px;padding:0 20px 6px}
.ind-carrossel.claro .ind-card{background:var(--paper);border:1px solid var(--line)}
.ind-carrossel.claro .ind-card span{color:var(--ink-2)}
.ha-ilus.hc-ilus{top:-22px;right:-30px;width:112px;height:112px}
.hc-seg{display:grid;grid-template-columns:repeat(3,1fr);background:var(--vazio);border-radius:999px;padding:4px;margin-top:16px;position:relative}
.hc-seg button{min-height:40px;border-radius:999px;font-size:.86rem;font-weight:700;color:var(--ink-2)}
.hc-seg button[aria-pressed="true"]{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(26,29,26,.18)}
.hc-meses{margin-top:16px}
.hc-bloco{margin-top:16px}
.hc-sec{font-size:.92rem;font-weight:700;margin:18px 0 10px}
.hc-graf{position:relative;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;align-items:end;height:118px}
.hc-graf button{display:grid;justify-items:center;align-content:end;gap:6px;height:100%}
.hc-graf .pilha2 .ene{background:var(--gain)}
.hc-graf .pilha2 .tel{background:#3B6FB6}
.hc-graf .pilha2.agora{outline-color:#B8B2A2}
.hc-graf button[aria-pressed="true"] .pilha2{box-shadow:0 0 0 3px var(--ouro)}
.hc-graf .m{font-size:.74rem;font-weight:600;color:var(--ink-2)}
.hc-media{position:absolute;left:0;right:0;border-top:2px dashed #8E978F;z-index:1;pointer-events:none}
.hc-media span{position:absolute;right:0;top:-21px;font-size:.66rem;font-weight:800;background:var(--ink-2);color:#fff;border-radius:999px;padding:2px 7px;white-space:nowrap}
.hc-leg{display:flex;gap:16px;margin-top:8px;font-size:.82rem;color:var(--ink-2)}
.hc-leg span{display:flex;align-items:center;gap:6px}
.hc-leg i{width:10px;height:10px;border-radius:3px;display:block}
.hc-leg i.ene{background:var(--gain)}
.hc-leg i.tel{background:#3B6FB6}
.hc-kpis{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.hc-kpis div{background:var(--paper);border-radius:16px;padding:10px 12px}
.hc-kpis span{display:block;font-size:.76rem;color:var(--ink-2)}
.hc-kpis b{font-size:1.05rem}
.hc-cta{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-height:48px;margin:16px 0 12px;border-radius:999px;border:1.5px solid var(--ink);font-weight:700;font-size:.9rem}
.pulsa{animation:pulsa .7s ease}`);

fs.writeFileSync(arq, t);
console.log("ok");
