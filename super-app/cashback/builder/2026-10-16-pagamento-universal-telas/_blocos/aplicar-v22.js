// v22: gráfico empilhado por produto, correção do cashback automático, rodapé do automático e extrato arejado com detalhe.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let L = fs.readFileSync(arq, "utf8").split("\n");
const confere = (i, s) => { if (!L[i - 1].includes(s)) { console.log("linha", i, "não confere:", L[i - 1].slice(0, 70)); process.exit(1); } };
// 1. extrato (por linha)
confere(1195, 'else if (v === "extrato"){'); confere(1208, "  }"); confere(1209, "  else {");
L.splice(1194, 1208 - 1195 + 1, ...fs.readFileSync(path.join(__dirname, "extrato2.txt"), "utf8").replace(/\n$/, "").split("\n"));
let t = L.join("\n");

const auxiliares = `// Extrato: ícone, origem e situação de cada movimentação
const MOV = {
  pay:       {ic: I.pay,     origem: "Pagamento com o Pay"},
  indicacao: {ic: I.amigo,   origem: "Indicação"},
  uso:       {ic: I.usado,   origem: "Uso em fatura"},
  resgate:   {ic: I.resgate, origem: "Resgate"}
};
const statusMov = x => x.caminho ? ["A receber", "aviso"] : x.v > 0 ? ["Recebido", "ok"] : x.tipo === "resgate" ? ["Resgatado", "neutro"] : ["Usado", "neutro"];
const valorMov = x => (x.v > 0 ? "+ " : "− ") + brl(Math.abs(x.v));
const itemMov = (x, i) => { const [s, c] = statusMov(x), m = MOV[x.tipo];
  return \`<li><button type="button" class="mov" data-mov="\${i}"><span class="mov-ic \${c}" aria-hidden="true">\${svg(x.caminho ? I.relogio : m.ic, 18)}</span><span class="txt"><b>\${x.t}</b><span>\${x.d}</span></span><span class="mov-v"><b class="\${x.v > 0 ? "mais" : ""}">\${valorMov(x)}</b><span class="mov-st \${c}">\${s}</span></span></button></li>\`; };
function detalheMov(x){
  const [s, c] = statusMov(x), m = MOV[x.tipo];
  folha(4, "Detalhe da movimentação", \`
    <div class="det">
      <span class="det-ic \${c}" aria-hidden="true">\${svg(x.caminho ? I.relogio : m.ic, 24)}</span>
      <b class="det-tit">\${x.t}</b>
      <span class="mov-st \${c}">\${s}</span>
      <div class="det-v num \${x.v > 0 ? "mais" : ""}">\${valorMov(x)}</div>
    </div>
    <div class="det-corte" aria-hidden="true"></div>
    <dl class="contas num" style="margin:4px 0 14px">
      <div><dt>Data</dt><dd>\${x.d}</dd></div>
      <div><dt>Origem</dt><dd>\${m.origem}</dd></div>
      <div><dt>Tipo</dt><dd>Cashback</dd></div>
      <div><dt>Situação</dt><dd>\${s}</dd></div>
      <div><dt>ID</dt><dd class="codigo">CB\${x.d.replace(/\\D/g, "")}\${Math.round(Math.abs(x.v) * 100)}</dd></div>
    </dl>\${ENTENDI}\`);
}

function render4(){`;

const trocas = [
  ["function render4(){", auxiliares],
  // 2. gráfico empilhado por produto, com linha tracejada da média e legenda
  [`    const NOME = {Mai:"maio", Jun:"junho", Jul:"julho", Ago:"agosto", Set:"setembro", Out:"outubro"};
    const prodCard`,
   `    const NOME = {Mai:"maio", Jun:"junho", Jul:"julho", Ago:"agosto", Set:"setembro", Out:"outubro"};
    const ENE = [14.10, 17.40, 20.20, 18.90, 21.50, h.p ? 22.80 : 0], media = h.ecoTotal / 6, ALT = 72;
    const prodCard`],
  [`        <div class="barras" role="img" aria-label="Economia por mês: \${serie.map(x => x[0] + " " + brl(x[1])).join(", ")}">
          \${serie.map((x, i) => \`<div class="\${i === serie.length - 1 ? "atual" : ""}"><span style="height:\${Math.max(4, Math.round(x[1] / max * 58))}px"></span><small>\${x[0]}</small></div>\`).join("")}
        </div>
        <dl class="contas num divisoria-cheia">`,
   `        <div class="graf" role="img" aria-label="Economia por mês: \${serie.map((x, i) => x[0] + " " + brl(x[1]) + ", sendo energia " + brl(ENE[i]) + " e Telecom " + brl(x[1] - ENE[i])).join("; ")}">
          <span class="media-linha" style="bottom:\${Math.round(media / max * ALT)}px"><span>Média \${brl(media)}</span></span>
          \${serie.map((x, i) => \`<div><span class="pilha"><i class="ene" style="height:\${Math.round(ENE[i] / max * ALT)}px"></i><i class="tel" style="height:\${Math.round((x[1] - ENE[i]) / max * ALT)}px"></i></span></div>\`).join("")}
        </div>
        <div class="graf-meses">\${serie.map((x, i) => \`<span class="\${i === serie.length - 1 ? "atual" : ""}">\${x[0]}</span>\`).join("")}</div>
        <div class="legenda-graf"><span><i class="sw ene"></i>Energia</span><span><i class="sw tel"></i>Telecom</span></div>
        <dl class="contas num divisoria-cheia">`],
  // 3. correção: marcar faturas atualiza o cartão na hora; com o automático desligado, a lista fica inativa
  ["    ${[[\"energia\",\"Energia\"],[\"telecom\",\"Telecom\"],[\"seguro\",\"Seguros\"]].map(([k, t]) => `<label class=\"check-row\">",
   "    <div id=\"prods${n}\" class=\"${st.auto ? \"\" : \"desligado\"}\">${[[\"energia\",\"Energia\"],[\"telecom\",\"Telecom\"],[\"seguro\",\"Seguros\"]].map(([k, t]) => `<label class=\"check-row\">"],
  ["aria-label=\"${t}\"></label>`).join(\"\")}\n    <p class=\"nota\" style=\"margin:10px 0 14px\">Você vê o abatimento",
   "aria-label=\"${t}\"></label>`).join(\"\")}</div>\n    <p class=\"nota\" style=\"margin:10px 0 14px\">Você vê o abatimento"],
  ["document.getElementById(`sw-auto${n}`).addEventListener(\"click\", e => { st.auto = !st.auto; e.currentTarget.setAttribute(\"aria-checked\", st.auto); render3(); render4(); });",
   "document.getElementById(`sw-auto${n}`).addEventListener(\"click\", e => { st.auto = !st.auto; e.currentTarget.setAttribute(\"aria-checked\", st.auto); document.getElementById(`prods${n}`).classList.toggle(\"desligado\", !st.auto); render3(); render4(); });"],
  ["c.addEventListener(\"change\", () => { st.autoProd[c.dataset.prod] = c.checked; })",
   "c.addEventListener(\"change\", () => { st.autoProd[c.dataset.prod] = c.checked; render3(); render4(); })"],
  // 4. rodapé do automático: faturas em carrossel, sem rótulo, e "Gerenciar" como link
  ["        <div class=\"auto-ativos${st.auto ? \"\" : \" vazio\"}\">\n          ${st.auto\n            ? `<span class=\"muted\">Ativo nas faturas de</span><div class=\"chips-ativos\">${ativos.map(([k, n]) => `<span class=\"mini-tag\">${svg(I[k],13)} ${n}</span>`).join(\"\") || `<span class=\"muted\">Nenhuma fatura escolhida</span>`}</div><button type=\"button\" class=\"btn btn--sec gerenciar\" data-auto4>Gerenciar</button>`",
   "        <div class=\"auto-ativos${st.auto ? \" on\" : \" vazio\"}\">\n          ${st.auto\n            ? `<div class=\"chips-ativos\">${ativos.map(([k, n]) => `<span class=\"chip-fat\">${svg(I[k],14)} ${n}</span>`).join(\"\") || `<span class=\"muted\">Nenhuma fatura escolhida</span>`}</div><button type=\"button\" class=\"link\" data-auto4>Gerenciar ›</button>`"],
  // 5. estilos
  ["/* v12 */", `/* v22 */
.graf{position:relative;height:80px;display:grid;grid-template-columns:repeat(6,1fr);gap:10px;align-items:end;margin-top:18px;padding:0 4px}
.graf > div{display:flex;justify-content:center;align-items:flex-end;height:100%}
.pilha{display:flex;flex-direction:column-reverse;width:100%;max-width:28px;border-radius:6px 6px 2px 2px;overflow:hidden}
.pilha i{display:block}
.pilha .ene,.sw.ene{background:var(--gain)}
.pilha .tel,.sw.tel{background:#3B6FB6}
.media-linha{position:absolute;left:0;right:0;border-top:2px dashed #8E978F;z-index:1;pointer-events:none}
.media-linha span{position:absolute;left:0;top:-21px;font-size:.66rem;font-weight:800;background:var(--ink-2);color:#fff;border-radius:999px;padding:2px 7px;white-space:nowrap}
.graf-meses{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;padding:0 4px;margin-top:6px;text-align:center;font-size:.72rem;color:var(--ink-2);font-weight:600}
.graf-meses .atual{color:var(--ink);font-weight:800}
.legenda-graf{display:flex;gap:16px;margin-top:10px;font-size:.78rem;color:var(--ink-2)}
.legenda-graf span{display:inline-flex;align-items:center;gap:6px}
.sw{width:10px;height:10px;border-radius:3px;display:inline-block}
.desligado{opacity:.45;pointer-events:none}
.auto-ativos.on{display:flex;align-items:center;gap:10px;padding:8px 10px 8px 16px}
.auto-ativos.on .chips-ativos{flex:1;min-width:0;flex-wrap:nowrap;overflow-x:auto}
.auto-ativos.on .chips-ativos::-webkit-scrollbar{height:0}
.chip-fat{flex:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border-radius:999px;background:var(--paper);font-size:.8rem;font-weight:700;white-space:nowrap}
.chip-fat svg{color:var(--gain)}
.auto-ativos.on .link{flex:none;min-height:40px}
.titulo-mes{margin:20px 2px 8px;font-size:.95rem}
.movs{list-style:none;padding:0}
.movs li{border-top:1px solid var(--line)}
.movs li:first-child{border-top:0}
.mov{display:flex;align-items:center;gap:12px;width:100%;padding:14px 16px;min-height:70px;text-align:left}
.mov-ic{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--neutral-bg);color:var(--ink-2);flex:none}
.mov-ic.ok,.det-ic.ok{background:var(--gain-bg);color:var(--gain)}
.mov-ic.aviso,.det-ic.aviso{background:var(--warn-bg);color:#5C3A00}
.mov .txt{flex:1;min-width:0}
.mov .txt b{display:block;font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mov .txt span{font-size:.78rem;color:var(--ink-2)}
.mov-v{flex:none;display:grid;gap:4px;justify-items:end}
.mov-v b{font-weight:800}
.mov-v b.mais{color:var(--gain)}
.mov-st{font-size:.7rem;font-weight:800;border-radius:999px;padding:2px 8px;background:var(--neutral-bg);color:var(--ink-2)}
.mov-st.ok{background:var(--gain-bg);color:var(--gain)}
.mov-st.aviso{background:var(--warn-bg);color:#5C3A00}
.det{display:grid;justify-items:center;gap:6px;text-align:center;padding:6px 0 12px}
.det-ic{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:var(--neutral-bg);color:var(--ink-2);margin-bottom:4px}
.det-tit{font-size:1rem}
.det-v{font-size:1.8rem;font-weight:800;margin-top:4px}
.det-v.mais{color:var(--gain)}
.det-corte{border-top:2px dashed var(--line);margin:6px 0 4px}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 90)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok");
