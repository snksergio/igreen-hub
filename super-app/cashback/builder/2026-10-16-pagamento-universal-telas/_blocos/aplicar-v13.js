// v13: mostra as duas opções de "Origem dos seus ganhos" para comparar (A = atual, B = anterior, mais completa).
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let t = fs.readFileSync(arq, "utf8");
const opcaoB = `      <h4 class="titulo-sec">Origem dos seus ganhos <span class="tag-opcao">Opção B · anterior</span></h4>
      <div class="hscroll num">
        \${[
          [I.energia, "ENERGIA", "Conta de luz", h.ecoEnergia + 30.30, h.ecoEnergia, 30.30, \`\${h.kwh.toLocaleString("pt-BR")} kWh de energia limpa\`],
          [I.telecom, "TELECOM", "Plano de celular", h.ecoTelecom + 9.40, h.ecoTelecom, 9.40, "+5 GB por mês no plano"],
          [I.seguro, "SEGUROS", "Seguro Auto", 6.80, 0, 6.80, "Mensalidade sem desconto"]
        ].map(([ic, cat, nome, total, desc, cb, extra]) => \`
        <div class="orig3">
          <div class="o-cab"><span class="ic" aria-hidden="true">\${svg(ic,20)}</span><div><span class="eyebrow">\${cat}</span><b>\${nome}</b></div></div>
          <div class="o-stats">
            <div><span class="k">Você ganhou</span><b class="verde">\${brl(total)}</b></div>
            <div><span class="k">Dos seus ganhos</span><b>\${pct(total, h.total)}%</b></div>
          </div>
          <div class="o-linha"><span>Desconto \${brl(desc)}</span><span>Cashback \${brl(cb)}</span></div>
          <span class="trilho" aria-hidden="true"><i style="width:\${pct(total, h.total)}%"></i></span>
          <span class="o-extra">\${extra}</span>
        </div>\`).join("")}
      </div>

`;
const trocas = [
  [`      <h4 class="titulo-sec">Origem dos seus ganhos</h4>`,
   `      <h4 class="titulo-sec">Origem dos seus ganhos <span class="tag-opcao">Opção A · atual</span></h4>`],
  [`      <h4 class="titulo-sec">Dá pra ganhar mais</h4>`,
   opcaoB + `      <h4 class="titulo-sec">Dá pra ganhar mais</h4>`],
  [`/* v12 */`,
   `/* v13: etiqueta para comparar as opções */
.tag-opcao{display:inline-flex;vertical-align:middle;margin-left:6px;font-size:.68rem;font-weight:800;border-radius:999px;padding:2px 8px;background:var(--warn-bg);color:#5C3A00}
.orig3{grid-template-columns:minmax(0,1fr)}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 80)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok");
