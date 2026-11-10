// v19: espaços do título e do valor, e versão 2 de "Seus ganhos" (mais limpa) abaixo da atual.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let t = fs.readFileSync(arq, "utf8");
const versao2 = `      <h4 class="titulo-sec">Seus ganhos <span class="tag-opcao">Versão 2 · mais limpa</span></h4>
      <div class="mosaico num">
        <button type="button" class="m2 m-grande" data-hub-ir="economia">
          <span class="m2-top"><span class="m2-ic">\${svg(I.energia,22)}</span>\${svg(I.seta,18)}</span>
          <span class="m2-baixo"><b class="v">\${brl(h.ecoTotal)}</b><span class="t">de economia nas suas contas</span><span class="s">\${h.kwh.toLocaleString("pt-BR")} kWh de energia limpa</span></span>
        </button>
        <button type="button" class="m2" data-hub-ir="cashback">
          <span class="m2-top"><span class="m2-ic sm">\${svg(I.cb,16)}</span>\${svg(I.seta,16)}</span>
          <b class="v">\${brl(h.cbRecebido)}</b><span class="t">de cashback recebido</span>
        </button>
        <button type="button" class="m2" data-club4>
          <span class="m2-top"><span class="m2-ic sm">\${svg(I.club,16)}</span>\${svg(I.seta,16)}</span>
          <b class="v neutro">5 cupons</b><span class="t">para usar no Club</span>
        </button>
      </div>

`;
const trocas = [
  [`.sec-cab{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:22px 2px 10px}`,
   `.sec-cab{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:22px 2px 6px}`],
  [`.hero3 .v{font-size:2.3rem;font-weight:800;letter-spacing:-.02em;line-height:1.1;margin:0 0 8px}`,
   `.hero3 .v{font-size:2.3rem;font-weight:800;letter-spacing:-.02em;line-height:1.1;margin:3px 0 8px}`],
  [`<h4 class="titulo-sec">Seus ganhos</h4><button`,
   `<h4 class="titulo-sec">Seus ganhos <span class="tag-opcao">Versão 1 · atual</span></h4><button`],
  [`      <h4 class="titulo-sec">Origem dos seus ganhos</h4>`,
   versao2 + `      <h4 class="titulo-sec">Origem dos seus ganhos</h4>`],
  [`/* v12 */`,
   `/* v19: versão 2 de "Seus ganhos", com o cartão inteiro tocável e seta no canto */
.m2{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:2px;text-align:left;min-height:104px;width:100%}
.m2.m-grande{justify-content:space-between}
.m2-top{display:flex;justify-content:space-between;align-items:flex-start;color:var(--ink-2);margin-bottom:10px}
.m2-ic{width:44px;height:44px;border-radius:50%;background:var(--gain-bg);color:var(--gain);display:grid;place-items:center}
.m2-ic.sm{width:32px;height:32px;border-radius:10px}
.m2-baixo{display:flex;flex-direction:column;gap:2px}
.m2 .v{font-size:1.2rem;font-weight:800;color:var(--gain)}
.m2 .v.neutro{color:var(--ink)}
.m2 .t{font-size:.8rem}
.m2 .s{font-size:.74rem;color:var(--ink-2);margin-top:4px}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 80)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok");
