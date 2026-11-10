// v14: opção C de "Origem dos seus ganhos" (meio-termo entre A e B), mantendo A e B para comparar.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let t = fs.readFileSync(arq, "utf8");
const opcaoC = `      <h4 class="titulo-sec">Origem dos seus ganhos <span class="tag-opcao">Opção C · meio-termo</span></h4>
      <div class="hscroll num">
        \${[
          [I.energia, "Energia", "Desconto e cashback", h.ecoEnergia + 30.30, h.ecoEnergia, 30.30],
          [I.telecom, "Telecom", "Desconto e cashback", h.ecoTelecom + 9.40, h.ecoTelecom, 9.40],
          [I.seguro, "Seguros", "Cashback de indicação", 6.80, 0, 6.80]
        ].map(([ic, nome, origem, total, desc, cb]) => \`
        <div class="orig4 orig5">
          <div class="o4-cab"><span class="ic" aria-hidden="true">\${svg(ic,20)}</span><span class="o4-nome"><b>\${nome}</b><span>\${origem}</span></span></div>
          <div class="o4-valor"><div class="o4-linha-v"><b class="o4-v">\${brl(total)}</b><span class="o4-pct">\${pct(total, h.total)}%</span></div><span class="o4-barra" aria-hidden="true"><i style="width:\${pct(total, h.total)}%"></i></span></div>
          <div class="o5-duo">
            <div><span class="k">Desconto</span><b>\${brl(desc)}</b></div>
            <div><span class="k">Cashback</span><b>\${brl(cb)}</b></div>
          </div>
        </div>\`).join("")}
      </div>

`;
const trocas = [
  [`      <h4 class="titulo-sec">Dá pra ganhar mais</h4>`, opcaoC + `      <h4 class="titulo-sec">Dá pra ganhar mais</h4>`],
  [`/* v12 */`, `/* v14: opção C, um pouco mais larga, com desconto e cashback lado a lado */
.orig5{width:80%}
.o5-duo{display:grid;grid-template-columns:1fr 1fr;gap:10px;border-top:1px solid var(--line);padding-top:10px}
.o5-duo .k{display:block;font-size:.76rem;color:var(--ink-2);font-weight:600}
.o5-duo b{font-size:.98rem;font-weight:800}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 80)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok");
