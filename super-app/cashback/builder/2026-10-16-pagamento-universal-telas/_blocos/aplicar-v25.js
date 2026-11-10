// v25: comprovante com rodapé fixo e cabeçalho separado; hub e meu cashback mais enxutos.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let t = fs.readFileSync(arq, "utf8");
const INFO = `\${svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',16)}`;
const trocas = [
  // ---- comprovante: rodapé fixo fora da rolagem
  [`<div class="screen" id="recibo"></div>`, `<div class="screen" id="recibo"></div>\n        <div class="footer" id="recibo-acoes"></div>`],
  // cabeçalho só com voltar e baixar; o check e o valor descem, fora do cabeçalho
  [`      <button class="icon-btn" type="button" aria-label="Voltar">\${svg(I.voltar,24,2.2)}</button>
      <span class="cp-ok" aria-hidden="true">\${svg(I.check,22,3)}</span>
      <button class="icon-btn" type="button" aria-label="Baixar comprovante">`,
   `      <button class="icon-btn" type="button" aria-label="Voltar">\${svg(I.voltar,24,2.2)}</button>
      <button class="icon-btn" type="button" aria-label="Baixar comprovante">`],
  [`    <div class="cp-head"><div class="cp-status">\${d.status}</div>`,
   `    <div class="cp-head"><span class="cp-ok" aria-hidden="true">\${svg(I.check,22,3)}</span><div class="cp-status">\${d.status}</div>`],
  [`    </div>
    <div class="cp-acoes">
      <button class="btn btn--sec" type="button">\${svg(I.casa,18)} Início</button>
      <button class="btn btn--pri" type="button">\${svg(I.share,18)} Compartilhar</button>
    </div>\`;`,
   `    </div>\`;
  document.getElementById("recibo-acoes").innerHTML = \`<div class="cp-acoes">
      <button class="btn btn--sec" type="button">\${svg(I.casa,18)} Início</button>
      <button class="btn btn--pri" type="button">\${svg(I.share,18)} Compartilhar</button>
    </div>\`;`],
  // ---- hub: sai o cashback automático de "Dá pra ganhar mais"
  [`        <button type="button" class="linha-acao" data-auto4><span class="ic" aria-hidden="true">\${svg(I.cb,18)}</span><span class="txt"><b>Cashback automático</b><span>\${st.auto ? "Ligado nas faturas escolhidas" : "Abate suas faturas sozinho"}</span></span>\${svg(I.seta,18)}</button>\n`, ``],
  // hub: "a receber" dentro do cartão do saldo
  [`      <div class="saldo3" style="margin-top:14px">
        <span class="bolinha">\${svg(I.cb,20)}</span>
        <span class="txt"><span>Seu cashback</span><b class="num">\${brl(h.disp)}</b></span>
        <button type="button" class="btn" data-hub-ir="cashback">Ver cashback \${svg(I.seta,16)}</button>
      </div>
      \${h.caminho ? \`<div class="faixa num" style="margin-top:8px">\${svg(I.relogio,16)}<span class="t">\${brl(h.caminho)} a receber · cai até \${CAI_ATE}</span><button type="button" class="acao" data-hub-ir="cashback">Ver</button></div>\` : ""}`,
   `      <div class="saldo-card4" style="margin-top:14px">
        <div class="saldo3">
          <span class="bolinha">\${svg(I.cb,20)}</span>
          <span class="txt"><span>Seu cashback</span><b class="num">\${brl(h.disp)}</b></span>
          <button type="button" class="btn" data-hub-ir="cashback">Ver cashback \${svg(I.seta,16)}</button>
        </div>
        \${h.caminho ? \`<div class="saldo-receber num">\${svg(I.relogio,16)}<span>\${brl(h.caminho)} a receber · cai até \${CAI_ATE}</span></div>\` : ""}
      </div>`],
  // ---- meu cashback: aviso de uma linha e "a receber" em cartão informativo
  [`(h.caminho ? "Resgatar e usar liberam quando o cashback cair." : "Sem saldo agora.")`,
   `(h.caminho ? "Resgate e uso liberam quando cair" : "Sem saldo agora")`],
  [`        \${h.caminho ? \`<p class="nota num">\${brl(h.caminho)} a receber fica fora da conta até cair.</p>\` : ""}
      </div>
      <h4 class="titulo-sec">De onde vem</h4>`,
   `        \${h.caminho ? \`<div class="info-box info-box--leve num" style="margin:10px 0 2px">${INFO}<span>\${brl(h.caminho)} a receber entra quando cair</span></div>\` : ""}
      </div>
      <h4 class="titulo-sec">De onde vem</h4>`],
  // estilos
  [`/* v12 */`, `/* v25 */
.cp-head{margin:22px 0 36px;display:grid;justify-items:center;gap:4px}
.cp-head .cp-ok{margin-bottom:6px}
#recibo-acoes .cp-acoes{margin-top:0;width:100%}
.saldo-card4{background:var(--surface);border:1px solid var(--line);border-radius:16px}
.saldo-card4 .saldo3{border:0;background:transparent}
.saldo-receber{display:flex;align-items:center;gap:8px;border-top:1px solid var(--line);padding:10px 14px;font-size:.82rem;font-weight:700;color:var(--gain)}
.saldo-receber span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.info-box span{min-width:0}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 90)); process.exit(1); }
  t = t.replace(a, b);
}
// ajuda: sai "Como me torno elegível" do hub e do meu cashback
const eleg = `,["elegivel","Como me torno elegível","O que é preciso para ganhar"]`;
const n = t.split(eleg).length - 1;
if (n !== 2) { console.log("elegível: esperava 2, achei " + n); process.exit(1); }
t = t.split(eleg).join("");
fs.writeFileSync(arq, t);
console.log("ok");
