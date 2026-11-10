// Gera teste.html a partir de index.html, sem alterar o index: uma tela por vez, fluxo ligado
// (pagar → comprovante → hub) e sem os elementos de apresentação. Para recomeçar, recarregar a página.
const fs = require("fs"), path = require("path");
// Uso: node gerar-teste.js [entrada] [saída] [versão]  (padrão: index.html → teste.html)
const pasta = path.resolve(__dirname, "..");
const [entrada = "index.html", saida = "teste.html", versao = ""] = process.argv.slice(2);
let t = fs.readFileSync(path.join(pasta, entrada), "utf8");

const trocas = [
  ["<title>Pagamento universal iGreen</title>", `<title>Pagamento iGreen · teste${versao ? " " + versao : ""}</title>`],
  // depois de pagar, abre o comprovante em vez de rolar a página até ele
  [`    const p2 = document.getElementById("phone2");
    p2.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"center"});
    p2.classList.remove("pulse"); void p2.offsetWidth; p2.classList.add("pulse");`,
   `    mostrar("recibo");`],
  // estilos: o celular ocupa a tela inteira; fora dele, nada de apresentação
  ["</style>", `/* versão de teste */
body.teste .page{max-width:none;padding:0}
body.teste .page-head,body.teste .col-head,body.teste .estados,body.teste .tag-ficticio,body.teste .demo-nota,body.teste .status{display:none}
body.teste .board{display:block}
body.teste .col{display:none}
body.teste .col.ativa{display:grid}
body.teste .phone{max-width:none;width:100%;height:100vh;height:100dvh;border:0;border-radius:0;box-shadow:none}
@media (min-width:600px){body.teste .phone{max-width:420px;margin:0 auto;border-left:1px solid var(--line);border-right:1px solid var(--line)}}
</style>`],
  // navegação entre as telas
  ["render1(); render2(); render3(); render4();\n</script>", `render1(); render2(); render3(); render4();

/* Versão de teste: uma tela por vez */
document.body.classList.add("teste");
const COLS = {pagar: document.querySelector('[aria-labelledby="t1"]'), recibo: document.querySelector('[aria-labelledby="t2"]'), hub: document.querySelector('[aria-labelledby="t4"]')};
let trocouEm = 0;
function mostrar(k){
  trocouEm = Date.now();
  Object.entries(COLS).forEach(([n, c]) => c.classList.toggle("ativa", n === k));
  window.scrollTo(0, 0);
  const s = COLS[k].querySelector(".screen"); if (s) s.scrollTop = 0;
  if (k === "hub") irHub("hub");
}
// atalhos do hub que antes destacavam a tela 1 agora abrem a tela
destacar = id => { const k = {phone1: "pagar", phone2: "recibo", phone4: "hub"}[id]; if (k) mostrar(k); };
// comprovante: "Início" e a seta de voltar levam ao hub; no hub, a aba "Pagar" volta para a fatura
// (um toque logo depois de trocar de tela é ignorado, para o mesmo toque não abrir duas telas)
document.addEventListener("click", e => {
  if (Date.now() - trocouEm < 400) return;
  if (e.target.closest("#recibo-acoes .btn--sec") || e.target.closest('#recibo .cp-topo [aria-label="Voltar"]')) mostrar("hub");
  const aba = e.target.closest("#phone4 .tabbar button");
  if (aba && aba.textContent.trim() === "Pagar") mostrar("pagar");
});
mostrar("pagar");
</script>`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 80)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(path.join(pasta, saida), t);
console.log("ok");
