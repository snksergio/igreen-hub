// v12: volta os textos de "Seus ganhos", move o link da análise e enriquece a origem.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let t = fs.readFileSync(arq, "utf8");
const trocas = [
  // 1. tira o ícone de gráfico do título
  [`          <button type="button" class="ic-graf" aria-label="Ver análise completa" data-hub-ir="economia">\${svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',20)}</button>\n`, ``],
  // 2. "Ver detalhes" com ícone de gráfico no título "Seus ganhos"
  [`      <h4 class="titulo-sec">Seus ganhos</h4>`,
   `      <div class="sec-cab"><h4 class="titulo-sec">Seus ganhos</h4><button type="button" class="link link-ic" data-hub-ir="economia">\${svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',16)} Ver detalhes</button></div>`],
  // 3. textos de "Seus ganhos" como eram antes
  [`          <span class="t">nas suas contas</span>\n          <span class="m-mini"><span class="k">Energia limpa</span><b>\${h.kwh.toLocaleString("pt-BR")} kWh</b></span>`,
   `          <span class="t">de economia nas suas contas</span>\n          <span class="s">\${h.kwh.toLocaleString("pt-BR")} kWh de energia limpa na sua conta</span>`],
  [`          <span class="t">em cashback</span>`, `          <span class="t">de cashback em indicações e no Pay</span>`],
  [`          <span class="t">no Club</span>`, `          <span class="t">para usar no Club</span>`],
  [`.m-card .t,.m-card .s,.linha-acao .txt b,.linha-acao .txt span{`, `.linha-acao .txt b,.linha-acao .txt span{`],
  // 4. origem: valor colado na barra, ganho do mês e o dado do produto
  [`          [I.energia, "Energia", h.ecoEnergia + 30.30, \`\${h.kwh.toLocaleString("pt-BR")} kWh de energia limpa\`],
          [I.telecom, "Telecom", h.ecoTelecom + 9.40, "+5 GB por mês no plano"],
          [I.seguro, "Seguros", 6.80, "Cashback de indicação"]
        ].map(([ic, nome, total, cap]) => \`
        <div class="orig4">
          <div class="o4-cab"><span class="ic" aria-hidden="true">\${svg(ic,20)}</span><b>\${nome}</b><span class="o4-pct">\${pct(total, h.total)}%</span></div>
          <b class="o4-v">\${brl(total)}</b>
          <span class="o4-barra" aria-hidden="true"><i style="width:\${pct(total, h.total)}%"></i></span>
          <span class="o4-cap">\${cap}</span>
        </div>\`).join("")}`,
   `          [I.energia, "Energia", h.ecoEnergia + 30.30, h.p ? 30.80 : 8.00, "Desconto de 15% e cashback", \`\${h.kwh.toLocaleString("pt-BR")} kWh de energia limpa\`],
          [I.telecom, "Telecom", h.ecoTelecom + 9.40, 10.00, "Desconto promocional e cashback", "+5 GB por mês no plano"],
          [I.seguro, "Seguros", 6.80, 0, "Cashback de indicação", "Mensalidade sem desconto"]
        ].map(([ic, nome, total, mes, origem, dado]) => \`
        <div class="orig4">
          <div class="o4-cab"><span class="ic" aria-hidden="true">\${svg(ic,20)}</span><span class="o4-nome"><b>\${nome}</b><span>\${origem}</span></span><span class="o4-pct">\${pct(total, h.total)}%</span></div>
          <div class="o4-valor"><b class="o4-v">\${brl(total)}</b><span class="o4-barra" aria-hidden="true"><i style="width:\${pct(total, h.total)}%"></i></span></div>
          <div class="o4-info">
            <span>\${svg(I.eco,14)} \${mes > 0 ? "+ " + brl(mes) + " em outubro" : "Nenhum ganho em outubro"}</span>
            <span>\${svg(ic,14)} \${dado}</span>
          </div>
        </div>\`).join("")}`],
  // 5. estilos novos
  [`.status-auto{display:inline-flex;`,
   `/* v12 */
.sec-cab{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:22px 2px 10px}
.sec-cab .titulo-sec{margin:0}
.sec-cab .link{min-height:40px}
.o4-nome{flex:1;min-width:0}
.o4-nome b{display:block;font-size:1rem}
.o4-nome span{display:block;font-size:.76rem;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.o4-valor{display:grid;gap:6px}
.o4-info{display:grid;gap:6px;border-top:1px solid var(--line);padding-top:10px}
.o4-info span{display:flex;align-items:center;gap:6px;font-size:.8rem;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.o4-info span svg{flex:none;color:var(--gain)}
.o4-info span:first-child{color:var(--gain);font-weight:700}
.status-auto{display:inline-flex;`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 80)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok, " + trocas.length + " trocas");
