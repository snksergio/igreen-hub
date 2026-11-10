// v2.1: correções da revisão da v2 (ws-ux-flow) pedidas pelo Sergio em 19/10. Lê index-v2.html e grava index-v21.html.
// 1 Pix com QR e copia e cola, aguardando pagamento · 2 boleto ou Pix pendente fácil de achar (fatura e hub), com "Pagar de outro jeito"
// 3 linhas novas quebram em vez de cortar · 4 a faixa do prazo diz a perda em reais
const fs = require("fs"), path = require("path");
const pasta = path.resolve(__dirname, "..");
let t = fs.readFileSync(path.join(pasta, "index-v2.html"), "utf8");
const um = (a, b) => {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 90)); process.exit(1); }
  t = t.replace(a, b);
};

// ---- página
um("<h1>Pagamento universal no app iGreen · v2</h1>", "<h1>Pagamento universal no app iGreen · v2.1</h1>");
um("<p><b>Versão 2</b>, com as correções do teste simulado:", "<p><b>Versão 2.1</b>: o Pix gera QR e código copia e cola, o boleto ou Pix gerado fica fácil de achar, as linhas quebram com fonte grande e a faixa do prazo diz a perda em reais. Da versão 2, com as correções do teste simulado:");

// ---- 4. faixa do prazo com a perda em reais (e o estado da fatura depois de gerar ou pagar)
um(`<span class="faixa faixa--prazo num"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span class="t">Após 23/10, o desconto cai para 10%</span></span>`,
   `<span class="faixa faixa--prazo num" id="faixa-fatura"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span class="t">Após 23/10, você paga R$ 7,60 a mais</span></span>`);
um("function render1(){\n  const v = restante(), g = cb1(v), m = metodos.find(x => x.id === st.metodo), pago = !!st.pago;",
   `function render1(){
  const v = restante(), g = cb1(v), m = metodos.find(x => x.id === st.metodo), pago = !!st.pago;
  const pend = !!(st.pago && st.pago.pendente);
  const ff = document.getElementById("faixa-fatura");
  if (ff){
    ff.className = "faixa num" + (pago && !pend ? "" : " faixa--prazo");
    ff.querySelector(".t").textContent = !pago ? "Após 23/10, você paga R$ 7,60 a mais"
      : pend ? (st.pago.metodo.id === "boleto" ? "Boleto" : "Pix") + " gerado · aguardando pagamento" : "Fatura paga";
  }`);

// ---- 1 e 2. Pix e boleto gerados ficam pendentes até o pagamento
um(`  // boleto gerado ainda não é fatura paga: a economia só entra quando o boleto for pago
  const p0 = st.pago, p = p0 && p0.metodo.id !== "boleto" ? p0 : null,`,
   `  // boleto ou Pix gerado ainda não é fatura paga: a economia só entra quando for pago
  const p0 = st.pago, p = p0 && !p0.pendente ? p0 : null,`);
um(`<input type="radio" name="metodo" value="\${x.id}" \${st.metodo === x.id ? "checked" : ""} aria-label="\${x.nome}">`,
   `<input type="radio" name="metodo" value="\${x.id}" \${st.metodo === x.id ? "checked" : ""} \${pago ? "disabled" : ""} aria-label="\${x.nome}">`);
um("  document.getElementById(\"footer-bonus\").innerHTML = (m && m.rende && !pago) ?",
   "  document.getElementById(\"footer-bonus\").innerHTML = pend ? `<button type=\"button\" class=\"link link-outro\" data-outro-jeito>Pagar de outro jeito</button>` : (m && m.rende && !pago) ?");
um("  if (pago){ cta.disabled = true; cta.textContent = st.pago.metodo.id === \"boleto\" ? \"Boleto gerado ✓\" : \"Fatura paga ✓\"; }\n  else { cta.disabled = !m; cta.textContent = !m ? \"Escolha como pagar\" : m.id === \"boleto\" ? `Gerar boleto • ${brl(v)}` : `Pagar com ${m.curto} • ${brl(v)}`; }",
   "  if (pend){ cta.disabled = false; cta.textContent = st.pago.metodo.id === \"boleto\" ? \"Ver o boleto\" : \"Ver o código Pix\"; }\n  else if (pago){ cta.disabled = true; cta.textContent = \"Fatura paga ✓\"; }\n  else { cta.disabled = !m; cta.textContent = !m ? \"Escolha como pagar\" : m.id === \"boleto\" ? `Gerar boleto • ${brl(v)}` : m.id === \"pix\" ? `Gerar Pix • ${brl(v)}` : `Pagar com ${m.curto} • ${brl(v)}`; }\n  const oj = document.querySelector(\"[data-outro-jeito]\");\n  if (oj) oj.addEventListener(\"click\", () => { st.pago = null; render1(); render2(); render3(); render4(); });");
um(`document.getElementById("cta").addEventListener("click", e => {
  const btn = e.currentTarget,`,
   `document.getElementById("cta").addEventListener("click", e => {
  if (st.pago && st.pago.pendente) { destacar("phone2"); return; }
  const btn = e.currentTarget,`);
um(`(st.metodo === "boleto" ? "Gerando…" : "Pagando…")`, `(st.metodo === "boleto" || st.metodo === "pix" ? "Gerando…" : "Pagando…")`);
um("    st.pago = {metodo:m, valor:v, cb: st.usarCb ? CB_INICIAL : 0, ganho: m.rende ? cb1(v) : 0};",
   "    st.pago = {metodo:m, valor:v, cb: st.usarCb ? CB_INICIAL : 0, ganho: m.rende ? cb1(v) : 0, pendente: m.id === \"boleto\" || m.id === \"pix\"};");

// ---- 1. comprovante do Pix gerado: QR, copia e cola, "Já paguei"
um("function render2(){", `// QR e código de exemplo: não são pagáveis
function qrExemplo(){
  const n = 25, s = 6, lado = n * s;
  let semente = 7; const r = () => (semente = (semente * 9301 + 49297) % 233280) / 233280;
  const canto = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const borda = (x, y) => ((x === 7 || x === n - 8) && (y < 8 || y >= n - 8)) || ((y === 7 || y === n - 8) && (x < 8 || x >= n - 8));
  let d = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let on;
    if (canto(x, y)) { const fx = x >= n - 7 ? x - (n - 7) : x, fy = y >= n - 7 ? y - (n - 7) : y; on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4); }
    else on = !borda(x, y) && r() > 0.52;
    if (on) d += \`M\${x * s} \${y * s}h\${s}v\${s}h-\${s}z\`;
  }
  return \`<svg class="cp-qr" width="156" height="156" viewBox="-12 -12 \${lado + 24} \${lado + 24}" role="img" aria-label="QR Code de exemplo"><rect x="-12" y="-12" width="\${lado + 24}" height="\${lado + 24}" fill="#fff"/><path d="\${d}" fill="#1A1D1A"/></svg>\`;
}
const pixExemplo = v => "00020126580014br.gov.bcb.pix0136exemplo-igreen-0000-0000-0000-000052040000530398654" + String(v.toFixed(2).length).padStart(2, "0") + v.toFixed(2) + "5802BR5914IGREEN ENERGIA6009EXEMPLO62070503***6304ABCD";

function render2(){`);
um(`    : p.metodo.id === "boleto"
    ? {status:"Boleto gerado", pend:true,`,
   `    : p.pendente && p.metodo.id === "pix"
    ? {status:"Pix gerado", pend:true, topo: brl(p.valor), legenda:"Aguardando pagamento", ic:I.energia, nome:"Fatura de energia · outubro", marca:"iGreen Energia",
       linhas: linha("Valor da fatura", "R$ 129,20") + (p.cb ? linha("Cashback usado", "− " + brl(p.cb), "menos") : ""),
       pills: \`<div class="cp-pill neutro">\${svg(I.relogio,16)} A economia de R$ 22,80 entra quando o Pix for pago</div>\`,
       extra: \`<div class="cp-pix"><span class="k">Pague no app do seu banco</span>\${qrExemplo()}<span class="cp-qr-leg">QR Code de exemplo</span><span class="k">Pix copia e cola</span><span class="codigo">\${pixExemplo(p.valor)}</span><div class="cp-bol-acoes"><button class="btn btn--sec" type="button" data-copiar>Copiar código</button><button class="btn btn--pri" type="button" data-ja-paguei>Já paguei</button></div></div>\`,
       det: [["Forma","Pix"],["Situação","Aguardando pagamento"],["Recebedor","iGreen Energia"],["Gerado em","16/10/2026, 14:35"]],
       totalLabel: "A pagar", pagou: brl(p.valor)}
    : p.pendente && p.metodo.id === "boleto"
    ? {status:"Boleto gerado", pend:true,`);
um(`  const cpb = el.querySelector("[data-copiar]"); if (cpb) cpb.addEventListener("click", () => { cpb.textContent = "Código copiado ✓"; });`,
   `  const cpb = el.querySelector("[data-copiar]"); if (cpb) cpb.addEventListener("click", () => { cpb.textContent = "Código copiado ✓"; });
  const jp = el.querySelector("[data-ja-paguei]");
  if (jp) jp.addEventListener("click", () => { jp.disabled = true; jp.textContent = "Confirmando…"; setTimeout(() => { st.pago.pendente = false; render1(); render2(); render3(); render4(); }, 900); });`);

// ---- 2. hub: aviso do boleto ou Pix pendente, que leva ao código
um("  return {...m,", "  return {...m, pend: st.pago && st.pago.pendente ? (st.pago.metodo.id === \"boleto\" ? \"Boleto\" : \"Pix\") : \"\",");
um(`      <div class="saldo-card4" style="margin-top:4px">`,
   `      \${h.pend ? \`<button type="button" class="faixa faixa--prazo pend-hub" data-ver-pend>\${svg(I.relogio,16,2.2)}<span class="t">\${h.pend} da luz aguardando pagamento</span><span class="acao">Ver</span></button>\` : ""}
      <div class="saldo-card4" style="margin-top:4px">`);
um("  // ações comuns da tela 4", "  // ações comuns da tela 4\n  el.querySelectorAll(\"[data-ver-pend]\").forEach(b => b.addEventListener(\"click\", () => destacar(\"phone2\")));");

// ---- 3. linhas que quebram com fonte grande, mais os estilos novos
um("</style>", `/* v2.1 */
.faixa{padding-top:8px;padding-bottom:8px}
.faixa .t,.hero3 .s,.saldo3 .txt span,.saldo-receber span{white-space:normal;overflow:visible;text-overflow:clip}
.cp-pix{display:grid;gap:8px;justify-items:center;background:var(--paper);border-radius:12px;padding:14px 12px}
.cp-pix .k{font-size:.8rem;color:var(--ink-2);font-weight:700;justify-self:start}
.cp-pix .codigo{font-family:var(--mono);font-size:.74rem;word-break:break-all;line-height:1.4;justify-self:stretch}
.cp-pix .cp-bol-acoes{justify-self:stretch}
.cp-qr{border-radius:8px}
.cp-qr-leg{font-size:.72rem;color:var(--ink-2);margin-top:-4px}
.link-outro{display:flex;justify-content:center;width:100%;min-height:40px;font-size:.85rem}
.pend-hub{margin:2px 0 10px;text-align:left}
</style>`);

fs.writeFileSync(path.join(pasta, "index-v21.html"), t);
console.log("ok");
