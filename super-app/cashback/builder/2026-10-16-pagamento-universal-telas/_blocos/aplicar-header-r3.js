// Propostas de header, rodada 3 (pedido do Sergio em 22/10), só na B:
// Total com medidor em meia-lua e carrossel "O que você já fez"; Economia com gráfico empilhado por produto e legenda;
// Cashback sem "Últimas movimentações".
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "header-propostas.html");
let t = fs.readFileSync(arq, "utf8");
const um = (a, b) => {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 90)); process.exit(1); }
  t = t.replace(a, b);
};
const ini = t.indexOf("function abaTotal(d){"), fim = t.indexOf("function renderB(){");
if (ini < 0 || fim < ini) { console.log("marcadores das abas não encontrados"); process.exit(1); }
t = t.slice(0, ini) + fs.readFileSync(path.join(__dirname, "header-abas-r3.txt"), "utf8") + "\n" + t.slice(fim);

um(`<p>Cartão verde com três abas, cada uma com o seu conteúdo: Total mostra o que você já fez e a meta; Economia, a análise mês a mês; Cashback, o saldo, de onde veio e as últimas movimentações.</p>`,
   `<p>Cartão verde com três abas, cada uma com o seu conteúdo: Total mostra a meta num medidor e o que você já fez; Economia, o mês a mês por produto; Cashback, o saldo e de onde veio.</p>`);

um(".pulsa{animation:pulsa .7s ease}", `/* B, rodada 3: medidor, carrossel e gráfico empilhado */
.hb-medidor{position:relative;width:220px;height:122px;margin:18px auto 0}
.hb-medidor-c{position:absolute;left:0;right:0;bottom:0;display:grid;justify-items:center;gap:6px}
.hb-medidor-c b{font-size:2.6rem;font-weight:700;line-height:1;letter-spacing:-.03em}
.hb-medidor-c b small{font-size:.9rem;font-weight:600;margin-left:4px;opacity:.8;letter-spacing:0}
.chip.saude{background:#B8EEC5;color:#0E4A2A}
.hb-medidor-t{text-align:center;font-size:.84rem;color:rgba(255,255,255,.88);margin-top:10px;position:relative}
.hb-medidor-t span{color:rgba(255,255,255,.7)}
.hb-carrossel{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -18px;padding:0 18px 4px;scrollbar-width:none;position:relative}
.hb-carrossel::-webkit-scrollbar{height:0}
.hb-ind{flex:0 0 136px;scroll-snap-align:start;background:rgba(255,255,255,.12);border-radius:16px;padding:12px}
.hb-ind b{display:block;font-size:1.1rem}
.hb-ind span{display:block;font-size:.76rem;color:rgba(255,255,255,.78);margin-top:2px}
.hb-graf{position:relative;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;align-items:end;height:118px;margin-top:16px}
.hb-graf button{display:grid;justify-items:center;align-content:end;gap:6px;height:100%}
.pilha2{display:flex;flex-direction:column-reverse;width:100%;max-width:30px;border-radius:8px 8px 4px 4px;overflow:hidden}
.pilha2 i{display:block;transition:height .35s ease}
.pilha2 .ene{background:#fff}
.pilha2 .tel{background:#8DB8F2}
.pilha2.agora{outline:2px dashed rgba(255,255,255,.6);outline-offset:2px}
.hb-graf button[aria-pressed="true"] .pilha2{box-shadow:0 0 0 3px var(--ouro)}
.hb-graf .m{font-size:.74rem;font-weight:600;color:rgba(255,255,255,.8)}
.hb-media{position:absolute;left:0;right:0;border-top:2px dashed rgba(255,255,255,.55);z-index:1;pointer-events:none}
.hb-media span{position:absolute;right:0;top:-21px;font-size:.66rem;font-weight:800;background:rgba(0,0,0,.25);color:#fff;border-radius:999px;padding:2px 7px;white-space:nowrap}
.hb-leg-graf{justify-content:flex-start;gap:16px}
.hb-leg i.ene{background:#fff}
.hb-leg i.tel{background:#8DB8F2}
.pulsa{animation:pulsa .7s ease}`);

fs.writeFileSync(arq, t);
console.log("ok");
