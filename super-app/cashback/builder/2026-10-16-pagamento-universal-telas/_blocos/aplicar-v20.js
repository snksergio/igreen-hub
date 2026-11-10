// v20: fica a versão 1 de "Seus ganhos"; ajustes na análise da economia e no "Meu cashback".
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let L = fs.readFileSync(arq, "utf8").split("\n");
const bloco = n => fs.readFileSync(path.join(__dirname, n), "utf8").replace(/\n$/, "").split("\n");
const confere = (i, s) => { if (!L[i - 1].includes(s)) { console.log("linha", i, "não confere:", L[i - 1].slice(0, 70)); process.exit(1); } };
// 1. blocos por linha (de baixo para cima)
confere(1097, 'else if (v === "cashback"){'); confere(1139, "  }"); confere(1140, 'else if (v === "extrato"){');
confere(1048, 'if (v === "economia"){'); confere(1076, "  }"); confere(1077, 'else if (v === "historico-eco"){');
confere(1041, "Usar na fatura"); confere(1040, "Resgatar");
L.splice(1096, 1139 - 1097 + 1, ...bloco("cashback3.txt"));
L.splice(1047, 1076 - 1048 + 1, ...bloco("analise3.txt"));
L[1039] = L[1039].replace('class="acao3" data-resg4', 'class="acao3 acao3--pri" data-resg4');
L[1040] = L[1040].replace("Usar na fatura</button>", "Usar</button>");
let t = L.join("\n");
// 2. trocas por texto
const ini2 = t.indexOf('      <h4 class="titulo-sec">Seus ganhos <span class="tag-opcao">Versão 2 · mais limpa</span></h4>');
const origem = '      <h4 class="titulo-sec">Origem dos seus ganhos</h4>';
const iniO = t.indexOf(origem);
if (ini2 < 0 || iniO < ini2) { console.log("versão 2 não encontrada"); process.exit(1); }
t = t.slice(0, ini2) + t.slice(iniO);
const trocas = [
  [' <span class="tag-opcao">Versão 1 · atual</span>', ""],
  ["/* v12 */", `/* v20: análise e meu cashback */
.divisoria-cheia{margin:12px -16px 0;padding:0 16px;border-top:1px solid var(--line)}
.prodx{width:204px;gap:10px}
.prodx-valor{display:grid;gap:6px;margin-top:6px}
.prodx .dado{font-size:.74rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.acao3--pri{background:var(--gain);color:#fff}
.acao3--pri:disabled{background:var(--neutral-bg);color:#8A8F88}
.info-box{display:flex;gap:8px;align-items:flex-start;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-top:12px;font-size:.8rem;color:var(--ink-2)}
.info-box svg{flex:none;color:var(--gain);margin-top:1px}
.sec-cab .muted{font-size:.8rem}
.abas--card{margin:12px 12px 4px}
.origem6 li{padding:12px 16px;gap:12px}
.origem6 .txt b{display:block;margin-bottom:8px}
.origem6 .trilho{display:block;height:6px;border-radius:3px;background:var(--neutral-bg)}
.origem6 .trilho i{display:block;height:100%;border-radius:3px;background:var(--gain)}
.o6-v{flex:none;text-align:right}
.o6-v b{display:block;font-weight:800}
.o6-v span{font-size:.76rem;color:var(--ink-2)}
.auto-linha{display:flex;align-items:center;gap:12px}
.auto-linha .txt{flex:1;min-width:0}
.auto-linha .txt b{display:block;font-size:.95rem}
.auto-ativos{border-top:1px solid var(--line);padding:12px 16px 14px;display:grid;gap:10px}
.chips-ativos{display:flex;gap:6px;flex-wrap:wrap}
.gerenciar{min-height:44px;font-size:.9rem}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 70)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok");
