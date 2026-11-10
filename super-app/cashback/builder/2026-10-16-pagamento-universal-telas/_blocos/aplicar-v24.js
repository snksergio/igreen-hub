// v24: comprovante no modelo do print e saída da tela 3 (ganhos).
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let t = fs.readFileSync(arq, "utf8");
// 1. render2 novo (de "function render2(){" até o marcador da tela 3)
const i2 = t.indexOf("function render2(){"), i3 = t.indexOf("/* ---------- Tela 3 ---------- */");
if (i2 < 0 || i3 < i2) { console.log("render2 não encontrado"); process.exit(1); }
t = t.slice(0, i2) + fs.readFileSync(path.join(__dirname, "render2.txt"), "utf8") + t.slice(i3);
// 2. tira a coluna da tela 3 (HTML)
const c3 = t.indexOf("    <!-- ===== 3. Ganhos ===== -->"), c4 = t.indexOf("    <!-- ===== 4. Retorno iGreen (proposta de hub) ===== -->");
if (c3 < 0 || c4 < c3) { console.log("coluna 3 não encontrada"); process.exit(1); }
t = t.slice(0, c3) + t.slice(c4);
const trocas = [
  // render3 deixa de quebrar sem a coluna
  ['  const el = document.getElementById("painel"), m = M();', '  const el = document.getElementById("painel"), m = M();\n  if (!el) return;'],
  // renumera o hub e atualiza o texto da página
  ["4. Retorno iGreen · proposta de hub</h2><p>Área central do que a iGreen já devolveu: o total, o cashback com atalhos, de onde veio, os produtos e como ganhar mais. Dois níveis abaixo: análise da economia e o cashback completo. A tela 3 continua como estava.</p>",
   "3. Retorno iGreen · hub</h2><p>Área central do que a iGreen já devolveu: o total, o cashback com atalhos, de onde veio, os produtos e como ganhar mais. Dois níveis abaixo: análise da economia e o cashback completo.</p>"],
  ['    <p>Versão 7: entra a tela 4, uma proposta de hub ("Retorno iGreen"), sem apagar a tela 3. Versão 6: volta o termo cashback. Ganhos mostra primeiro o cashback (dinheiro seu, que se usa ou se resgata) e depois a economia (o desconto nas faturas pagas). Cada um tem a sua tela e o seu histórico. Os números da tela 3 mudam depois que você paga na tela 1.</p>',
   '    <p>Três telas: pagar a fatura, o comprovante e o hub "Retorno iGreen", com a análise da economia e o cashback completo. Os números do comprovante e do hub mudam depois que você paga na tela 1.</p>'],
  // ícone de casa para o botão Início
  ["  ajuda:'<circle cx=\"12\" cy=\"12\" r=\"9\"/>", "  casa:'<path d=\"M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z\"/>',\n  ajuda:'<circle cx=\"12\" cy=\"12\" r=\"9\"/>"],
  // estilos do comprovante
  ["/* v12 */", `/* v24: comprovante */
.cp-topo{display:flex;justify-content:space-between;align-items:center;margin:0 -8px}
.cp-ok{width:44px;height:44px;border-radius:50%;background:var(--gain);color:#fff;display:grid;place-items:center}
.cp-head{text-align:center;margin:8px 0 36px}
.cp-status{color:var(--gain);font-weight:800;font-size:1rem}
.cp-valor{font-size:2.2rem;font-weight:800;letter-spacing:-.02em;line-height:1.15}
.cp-card{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:40px 16px 14px;display:grid;gap:10px}
.cp-logo{position:absolute;top:-28px;left:50%;transform:translateX(-50%);width:56px;height:56px;border-radius:50%;background:var(--surface);border:1px solid var(--line);color:var(--gain);display:grid;place-items:center;box-shadow:0 2px 6px rgba(26,29,26,.08)}
.cp-nome{display:block;text-align:center;font-size:1rem}
.cp-marca{display:block;text-align:center;font-size:.8rem;color:var(--ink-2);margin-top:-8px}
.cp-linhas div{display:flex;justify-content:space-between;gap:12px;padding:6px 0;font-size:.88rem}
.cp-linhas dt{color:var(--ink-2)}
.cp-linhas dd{font-weight:700;text-align:right}
.cp-linhas dd.menos{color:var(--gain)}
.cp-pill{display:flex;align-items:center;justify-content:center;gap:6px;background:var(--gain-bg);color:var(--gain);border-radius:12px;padding:10px 12px;font-size:.84rem;font-weight:700;text-align:center}
.cp-pill.neutro{background:var(--neutral-bg);color:var(--ink-2)}
.cp-apolice{display:grid;gap:4px;margin-top:4px}
.cp-apolice > b{font-size:.88rem}
.cp-corte{position:relative;border-top:2px dashed var(--line);margin:8px -16px 2px}
.cp-corte::before,.cp-corte::after{content:"";position:absolute;top:-12px;width:22px;height:22px;border-radius:50%;background:var(--paper);border:1px solid var(--line)}
.cp-corte::before{left:-12px;clip-path:inset(0 0 0 50%)}
.cp-corte::after{right:-12px;clip-path:inset(0 50% 0 0)}
.cp-det-cab{display:flex;justify-content:space-between;align-items:center;width:100%;min-height:40px;font-weight:800;font-size:.92rem}
.cp-det-cab svg{transition:transform .2s ease;color:var(--ink-2)}
.cp-det-cab[aria-expanded="false"] svg{transform:rotate(-90deg)}
.cp-total{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--line);padding-top:12px;font-weight:700}
.cp-total b{font-size:1.15rem;font-weight:800}
.cp-acoes{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}
.cp-acoes .btn{min-height:50px;font-size:.92rem}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 80)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok");
