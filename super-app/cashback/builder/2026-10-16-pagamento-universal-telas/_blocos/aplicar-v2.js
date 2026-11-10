// v2: correções do teste simulado (avaliacao-prototipo-v1.md). Lê index.html e grava index-v2.html; o index.html não muda.
// 1 faixa do prazo com a consequência · 2 Pay explicado · 3 valor pago em destaque no comprovante
// 4 boleto que não paga sozinho · 5 hub: o que dá para usar hoje primeiro · 6 cartão de cashback recebido sem parecer saldo
const fs = require("fs"), path = require("path");
const pasta = path.resolve(__dirname, "..");
let t = fs.readFileSync(path.join(pasta, "index.html"), "utf8");

const um = (a, b) => {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 90)); process.exit(1); }
  t = t.replace(a, b);
};

// ---- página
um("<h1>Pagamento universal no app iGreen</h1>", "<h1>Pagamento universal no app iGreen · v2</h1>");
um(`<p>Três telas: pagar a fatura, o comprovante e o hub "Retorno iGreen", com a análise da economia e o cashback completo. Os números do comprovante e do hub mudam depois que você paga na tela 1.</p>`,
   `<p><b>Versão 2</b>, com as correções do teste simulado: a faixa do prazo diz o que se perde, o Pay se explica, o comprovante destaca o valor pago, o boleto não paga sozinho e o hub mostra primeiro o que dá para usar hoje. Os números do comprovante e do hub mudam depois que você paga na tela 1.</p>`);

// ---- 1. faixa do prazo
um(`<span class="t">Pague até 23/10 e mantenha os 15%</span>`, `<span class="t">Após 23/10, o desconto cai para 10%</span>`);

// ---- 2. Pay explicado
um(`sub:"R$ 250,00 disponíveis",        curto:"saldo Pay", rende:true}`, `sub:"Sua carteira no app · R$ 250,00", curto:"saldo Pay", rende:true}`);
um("<span class=\"t\">Ganhe ${brl(g)} de cashback com o Pay</span></div></div>` : \"\"}",
   "<span class=\"t\">Ganhe ${brl(g)} de cashback com o Pay</span></div><button type=\"button\" class=\"link link-pay\" data-o-que-pay>O que é o Pay?</button></div>` : \"\"}");
um(`  document.querySelectorAll('input[name="metodo"]').forEach(r => r.addEventListener("change", e => {st.metodo = e.target.value; render1();}));`,
   `  document.querySelectorAll('input[name="metodo"]').forEach(r => r.addEventListener("change", e => {st.metodo = e.target.value; render1();}));
  const oq = document.querySelector("[data-o-que-pay]");
  if (oq) oq.addEventListener("click", () => folha(1, "O que é o iGreen Pay", \`
    <p class="muted" style="margin:6px 0 10px">É a sua carteira dentro do app da iGreen. Você coloca dinheiro por Pix e paga suas contas daqui.</p>
    <p class="muted" style="margin-bottom:10px">O dinheiro fica numa conta de pagamento do Parceiro Exemplo, instituição autorizada pelo Banco Central. A iGreen é a marca que você vê.</p>
    <p class="muted" style="margin-bottom:14px">Pagar com o saldo Pay rende 1% de cashback, até R$ 5,00 por fatura. O cashback cai em até 2 dias úteis.</p>\${ENTENDI}\`));`);

// ---- 4. boleto: botão, estado e economia só depois de pago
um("  if (pago){ cta.disabled = true; cta.textContent = \"Fatura paga ✓\"; }\n  else { cta.disabled = !m; cta.textContent = m ? `Pagar com ${m.curto} • ${brl(v)}` : \"Escolha como pagar\"; }",
   "  if (pago){ cta.disabled = true; cta.textContent = st.pago.metodo.id === \"boleto\" ? \"Boleto gerado ✓\" : \"Fatura paga ✓\"; }\n  else { cta.disabled = !m; cta.textContent = !m ? \"Escolha como pagar\" : m.id === \"boleto\" ? `Gerar boleto • ${brl(v)}` : `Pagar com ${m.curto} • ${brl(v)}`; }");
um(`btn.disabled = true; btn.innerHTML = '<span class="spin" aria-hidden="true"></span> Pagando…';`,
   `btn.disabled = true; btn.innerHTML = '<span class="spin" aria-hidden="true"></span> ' + (st.metodo === "boleto" ? "Gerando…" : "Pagando…");`);
um("  const p = st.pago, usado = p ? p.cb : 0, caminho = p ? p.ganho : 0;",
   "  // boleto gerado ainda não é fatura paga: a economia só entra quando o boleto for pago\n  const p0 = st.pago, p = p0 && p0.metodo.id !== \"boleto\" ? p0 : null, usado = p0 ? p0.cb : 0, caminho = p0 ? p0.ganho : 0;");

// ---- 3 e 4. comprovante
const iniE = t.indexOf(`    : {status:"Fatura paga", topo:"R$ 129,20", ic:I.energia,`);
const fimE = t.indexOf("       pagou: brl(p.valor)};", iniE);
if (iniE < 0 || fimE < iniE) { console.log("ramo de energia do comprovante não encontrado"); process.exit(1); }
const ramoAntigo = t.slice(iniE, fimE + "       pagou: brl(p.valor)};".length);
const ramoNovo = `    : p.metodo.id === "boleto"
    ? {status:"Boleto gerado", pend:true, topo: brl(p.valor), legenda:"Aguardando pagamento · vence 23/10", ic:I.energia, nome:"Fatura de energia · outubro", marca:"iGreen Energia",
       linhas: linha("Valor da fatura", "R$ 129,20") + (p.cb ? linha("Cashback usado", "− " + brl(p.cb), "menos") : ""),
       pills: \`<div class="cp-pill neutro">\${svg(I.relogio,16)} A economia de R$ 22,80 entra quando o boleto for pago</div>\`,
       extra: \`<div class="cp-boleto"><span class="k">Código do boleto (exemplo)</span><span class="codigo">00000.00000 00000.000000 00000.000000 0 1023\${String(Math.round(p.valor * 100)).padStart(10, "0")}</span><div class="cp-bol-acoes"><button class="btn btn--sec" type="button" data-copiar>Copiar código</button><button class="btn btn--sec" type="button">Baixar boleto</button></div></div>\`,
       det: [["Forma","Boleto"],["Situação","Aguardando pagamento"],["Vencimento","23/10/2026"],["Gerado em","16/10/2026, 14:35"]],
       totalLabel: "A pagar", pagou: brl(p.valor)}
    : {status:"Fatura paga", topo: brl(p.valor), legenda:"valor pago", ic:I.energia, nome:"Fatura de energia · outubro", marca:"iGreen Energia",
${ramoAntigo.split("\n").slice(1).join("\n")}`;
t = t.slice(0, iniE) + ramoNovo + t.slice(iniE + ramoAntigo.length);
um("<div class=\"cp-head\"><span class=\"cp-ok\" aria-hidden=\"true\">${svg(I.check,22,3)}</span><div class=\"cp-status\">${d.status}</div><div class=\"cp-valor num\">${d.topo}</div></div>",
   "<div class=\"cp-head\"><span class=\"cp-ok${d.pend ? \" pend\" : \"\"}\" aria-hidden=\"true\">${d.pend ? svg(I.relogio,22,2.4) : svg(I.check,22,3)}</span><div class=\"cp-status${d.pend ? \" pend\" : \"\"}\">${d.status}</div><div class=\"cp-valor num\">${d.topo}</div>${d.legenda ? `<div class=\"cp-legenda\">${d.legenda}</div>` : \"\"}</div>");
um("<div class=\"cp-total\"><span>Você pagou</span><b class=\"num\">${d.pagou}</b></div>",
   "<div class=\"cp-total\"><span>${d.totalLabel || \"Você pagou\"}</span><b class=\"num\">${d.pagou}</b></div>");
um(`  el.querySelector("[data-det]").addEventListener("click", () => { st.det = !st.det; render2(); el.querySelector("[data-det]").focus(); });`,
   `  el.querySelector("[data-det]").addEventListener("click", () => { st.det = !st.det; render2(); el.querySelector("[data-det]").focus(); });
  const cpb = el.querySelector("[data-copiar]"); if (cpb) cpb.addEventListener("click", () => { cpb.textContent = "Código copiado ✓"; });`);

// ---- 5. hub: o que dá para usar hoje vem primeiro; o total desce, com rótulo que não sugere dinheiro entregue
const iniH = t.indexOf(`      <div class="hero3">`);
const iniS = t.indexOf(`      <div class="saldo-card4" style="margin-top:14px">`, iniH);
const fimS = t.indexOf(`      <h4 class="titulo-sec">Dá pra ganhar mais</h4>`, iniS);
if (iniH < 0 || iniS < iniH || fimS < iniS) { console.log("topo do hub não encontrado"); process.exit(1); }
const hero = t.slice(iniH, iniS), saldo = t.slice(iniS, fimS);
t = t.slice(0, iniH) + saldo + hero + t.slice(fimS);
um(`      <div class="saldo-card4" style="margin-top:14px">`, `      <div class="saldo-card4" style="margin-top:4px">`);
um(`<span class="txt"><span>Seu cashback</span><b class="num">\${brl(h.disp)}</b></span>\n          <button type="button" class="btn" data-hub-ir="cashback">`,
   `<span class="txt"><span>Para usar hoje</span><b class="num">\${brl(h.disp)}</b></span>\n          <button type="button" class="btn" data-hub-ir="cashback">`);
um(`      <div class="hero3">`, `      <div class="hero3 v2-total">`);
um(`<h3 class="titulo">A iGreen já te devolveu</h3>`, `<h3 class="titulo">Economia + cashback</h3>`);
um(`<div class="s">Economia e cashback desde maio de 2026</div>`, `<div class="s">Soma desde maio de 2026 · não é saldo</div>`);

// ---- 6. cartão de cashback recebido
um(`<span class="t">de cashback em indicações e no Pay</span>`, `<span class="t">de cashback recebido desde maio</span>`);

// ---- estilos
um("/* v12 */", `/* v2 do teste */
.cp-legenda{font-size:.82rem;color:var(--ink-2);font-weight:600}
.cp-ok.pend{background:var(--warn-bg);color:var(--warn)}
.cp-status.pend{color:var(--warn)}
.cp-boleto{display:grid;gap:6px;background:var(--paper);border-radius:12px;padding:12px}
.cp-boleto .k{font-size:.8rem;color:var(--ink-2);font-weight:700}
.cp-boleto .codigo{font-family:var(--mono);font-size:.76rem;word-break:break-all;line-height:1.4}
.cp-bol-acoes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
.cp-bol-acoes .btn{min-height:44px;font-size:.85rem}
.link-pay{min-height:40px;font-size:.82rem;margin-top:2px}
.hero3.v2-total{margin-top:22px}
/* v12 */`);

fs.writeFileSync(path.join(pasta, "index-v2.html"), t);
console.log("ok");
