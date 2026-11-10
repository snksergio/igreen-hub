// v23: títulos curtos no extrato e mini central de ajuda no hub e no "Meu cashback".
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let t = fs.readFileSync(arq, "utf8");

const ajudaJs = `// Mini central de ajuda (regras fictícias do teste)
const AJ = {
  calculo:  ["Como calculamos seus ganhos", () => \`<p class="muted" style="margin:6px 0 10px">Somamos o desconto das contas já pagas e o cashback que já caiu.</p><p class="muted" style="margin-bottom:14px">O cashback usado para pagar não conta de novo. O que está a receber entra quando cair. Os cupons do Club ainda não entram no valor.</p>\`],
  regras:   ["Regras do cashback", () => \`<ul class="regras">
      <li>Pagando com o saldo Pay, você ganha 1% do valor, até R$ 5,00 por fatura.</li>
      <li>Por indicação, você ganha a cada fatura paga por quem indicou.</li>
      <li>O cashback cai em até 2 dias úteis e vale 12 meses.</li>
      <li>Se o indicado cancelar, o cashback dele é cancelado.</li>
      <li>Mensalidade de seguro não rende cashback.</li>
      <li>Você pode usar numa fatura ou resgatar para o Pay ou por Pix.</li></ul>\`],
  desconto: ["Como funciona o desconto na energia", () => \`<p class="muted" style="margin:6px 0 10px">O desconto de 15% vem da energia limpa que a iGreen compensa na sua conta de luz.</p><p class="muted" style="margin-bottom:14px">Se pagar depois do vencimento, aquela fatura fica com 10% de desconto. A próxima, paga em dia, volta aos 15%.</p>\`],
  elegivel: ["Como me torno elegível", () => \`<ul class="regras">
      <li>Ter pelo menos um serviço ativo da iGreen.</li>
      <li>Para o 1% de cashback: ativar o iGreen Pay e pagar com o saldo.</li>
      <li>Para a indicação: o indicado precisa ser aprovado e pagar a fatura.</li>
      <li>O Club é incluso para quem tem serviço ativo.</li></ul>\`],
  auto:     ["Histórico de uso automático", () => st.auto
      ? \`<p class="muted" style="margin:6px 0 14px">Ainda não houve abatimento automático. Quando a próxima fatura chegar, o abatimento aparece aqui.</p>\`
      : \`<p class="muted" style="margin:6px 0 14px">O cashback automático está desligado. Ligue para ver aqui os abatimentos feitos sozinho.</p>\`]
};
const ICA = {calculo: I.ajuda, regras: '<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 9h8M8 13h6"/>', desconto: I.energia, elegivel: I.check, auto: I.relogio};
const ajudaSecao = itens => \`<h4 class="titulo-sec">Ajuda e regras</h4><div class="card">\${itens.map(([k, tit, sub]) => \`<button type="button" class="linha-acao" data-aj="\${k}"><span class="ic" aria-hidden="true">\${svg(ICA[k],18)}</span><span class="txt"><b>\${tit}</b><span>\${sub}</span></span>\${svg(I.seta,18)}</button>\`).join("")}</div>
      <p class="demo-nota">\${svg(I.check,14,3)} Demonstração: regras fictícias, sem valor real.</p>\`;

// Extrato: ícone, origem e situação de cada movimentação`;

const trocas = [
  ["// Extrato: ícone, origem e situação de cada movimentação", ajudaJs],
  // títulos curtos na lista do extrato (o texto completo fica no detalhe)
  ["<span class=\"txt\"><b>${x.t}</b><span>${x.d}</span></span>",
   "<span class=\"txt\"><b>${TIT_MOV[x.tipo]}</b><span>${x.d}</span></span>"],
  ["const statusMov = x =>",
   "const TIT_MOV = {pay: \"Cashback do Pay\", indicacao: \"Indicação aprovada\", uso: \"Uso na fatura de energia\", resgate: \"Resgate\"};\nconst statusMov = x =>"],
  // ajuda no fim do hub
  ["<span>Mantenha os 15% de desconto</span></span>${svg(I.seta,18)}</button>`}\n      </div>`;",
   "<span>Mantenha os 15% de desconto</span></span>${svg(I.seta,18)}</button>`}\n      </div>\n      ${ajudaSecao([[\"calculo\",\"Como calculamos seus ganhos\",\"Economia e cashback, sem contar duas vezes\"],[\"regras\",\"Regras do cashback\",\"Validade, limites e cancelamento\"],[\"desconto\",\"Como funciona o desconto\",\"Os 15% na conta de luz\"],[\"elegivel\",\"Como me torno elegível\",\"O que é preciso para ganhar\"]])}`;"],
  // ajuda no fim do "Meu cashback"
  ["      <div class=\"card\"><ul class=\"comp\">${extratoCashback().slice(0, 3).map(itemC).join(\"\")}</ul></div>`;",
   "      <div class=\"card\"><ul class=\"comp\">${extratoCashback().slice(0, 3).map(itemC).join(\"\")}</ul></div>\n      ${ajudaSecao([[\"auto\",\"Histórico de uso automático\",\"Veja os abatimentos já feitos\"],[\"regras\",\"Regras do cashback\",\"Validade, limites e cancelamento\"],[\"elegivel\",\"Como me torno elegível\",\"O que é preciso para ganhar\"]])}`;"],
  // abrir os itens da ajuda (ações comuns da tela 4)
  ["  el.querySelectorAll(\"[data-ganhe4]\").forEach(",
   "  el.querySelectorAll(\"[data-aj]\").forEach(b => b.addEventListener(\"click\", () => { const [tit, corpo] = AJ[b.dataset.aj]; folha(4, tit, corpo() + ENTENDI); }));\n  el.querySelectorAll(\"[data-ganhe4]\").forEach("],
  ["/* v12 */", `/* v23: ajuda */
.regras{margin:8px 0 14px;padding-left:18px;display:grid;gap:8px;font-size:.88rem;color:var(--ink-2)}
.demo-nota{display:flex;align-items:center;gap:6px;font-size:.76rem;color:var(--ink-2);margin:10px 2px 4px}
.demo-nota svg{color:var(--gain);flex:none}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 90)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok");
