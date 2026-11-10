// Propostas de header, rodada 2 (pedido do Sergio em 22/10): A sem "usar hoje" nem cashback automático, com a divisão
// economia × cashback e o painel escuro levando à central de cashback; B com conteúdo próprio em cada aba.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "header-propostas.html");
let t = fs.readFileSync(arq, "utf8");
const um = (a, b) => {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 90)); process.exit(1); }
  t = t.replace(a, b);
};

// JS das duas propostas
const ini = t.indexOf("/* ---------- Proposta A ---------- */"), fim = t.indexOf('document.querySelectorAll("[data-estado]")');
if (ini < 0 || fim < ini) { console.log("marcadores do JS não encontrados"); process.exit(1); }
t = t.slice(0, ini) + fs.readFileSync(path.join(__dirname, "header-js-r2.txt"), "utf8") + t.slice(fim);
um("  usar: st.pago ? 0 : 9.20, receber: st.pago ? 1.20 : 0, emDia: st.pago ? 6 : 5",
   "  disp: st.pago ? 0 : 9.20, receber: st.pago ? 1.20 : 0, emDia: st.pago ? 6 : 5,\n  kwh: st.pago ? 1296 : 1080, ecoEnergia: st.pago ? 114.90 : 92.10");

// Textos da página
um(`A proposta A segue o print de referência. A proposta B dá mais peso à meta e ao mês a mês. Toque nos meses e nas abas: os números mudam.`,
   `A proposta A segue o print de referência. A proposta B separa o conteúdo em abas. Toque nos meses e nas abas: os números mudam.`);
um(`<p>Segue o print: número grande com selo, barra da meta, pares de informação, meses em círculos e o painel escuro com o que dá para usar hoje.</p>`,
   `<p>Segue o print: número grande com selo, barra da meta, divisão entre economia e cashback, meses em círculos e o painel escuro que leva à central de cashback.</p>`);
um(`<p>Cartão verde com abas Total, Economia e Cashback, barras mês a mês e a meta num anel. O que dá para usar hoje fica num cartão branco logo abaixo.</p>`,
   `<p>Cartão verde com três abas, cada uma com o seu conteúdo: Total mostra o que você já fez e a meta; Economia, a análise mês a mês; Cashback, o saldo, de onde veio e as últimas movimentações.</p>`);

// Estilos
um("/* ===== Proposta B: meta em destaque ===== */", `/* A, rodada 2: divisão e painel da central de cashback */
.ha-div{display:grid;gap:10px}
.ha-div-cab{display:flex;justify-content:space-between;align-items:baseline;font-size:.9rem;font-weight:700}
.ha-div-cab .muted{font-size:.8rem;font-weight:500;color:var(--ink-2)}
.ha-div-barra{display:flex;gap:4px;height:14px}
.ha-div-barra i{display:block;border-radius:999px;transition:width .4s ease}
.ha-div-barra .e{background:var(--broto)}
.ha-div-barra .c{background:var(--ouro)}
.ha-div-leg{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ha-div-leg dt{display:flex;align-items:center;gap:6px;font-size:.82rem;color:var(--ink-2)}
.ha-div-leg dt i{width:10px;height:10px;border-radius:3px;display:block;flex:none}
.ha-div-leg dt i.e{background:var(--broto)}
.ha-div-leg dt i.c{background:var(--ouro)}
.ha-div-leg dd{font-size:1.1rem;font-weight:600;margin-top:2px}
.ha-div-leg dd span{font-size:.76rem;color:var(--ink-2);font-weight:700;margin-left:6px}
.ha-meses{margin-top:20px}
.ha-dark-ic{position:absolute;right:16px;top:16px;width:52px;height:52px;border-radius:50%;background:var(--ouro);color:#3D2A00;display:grid;place-items:center;box-shadow:0 6px 18px -4px rgba(230,193,79,.7)}
.ha-dark .sub{font-size:.84rem;color:rgba(255,255,255,.72);margin-top:2px;padding-right:60px}
.ha-cta{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:48px;margin-top:14px;border-radius:999px;background:#fff;color:var(--ink);font-weight:700;font-size:.92rem}

/* ===== Proposta B: meta em destaque ===== */`);
um(".pulsa{animation:pulsa .7s ease}", `/* B, rodada 2: conteúdo por aba */
.hb-sec{font-size:.86rem;font-weight:700;margin:18px 0 8px;position:relative;color:rgba(255,255,255,.92)}
.hb-bloco{margin-top:14px;position:relative}
.hb-barra2 .e{background:#fff}
.hb-barra2 .c{background:var(--ouro)}
.hb-barra2 .p{background:rgba(255,255,255,.5)}
.hb-leg{display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px 12px;margin-top:8px;font-size:.82rem;color:rgba(255,255,255,.88);position:relative}
.hb-leg span{display:flex;align-items:center;gap:6px}
.hb-leg i{width:10px;height:10px;border-radius:3px;display:block}
.hb-leg i.e{background:#fff}
.hb-leg i.c{background:var(--ouro)}
.hb-leg i.p{background:rgba(255,255,255,.5)}
.hb-feitos{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;position:relative}
.hb-feitos div{background:rgba(255,255,255,.12);border-radius:16px;padding:12px}
.hb-feitos b{display:block;font-size:1.1rem}
.hb-feitos span{display:block;font-size:.78rem;color:rgba(255,255,255,.78)}
.hb-kpis{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;position:relative}
.hb-kpis div{background:rgba(255,255,255,.12);border-radius:16px;padding:10px 12px}
.hb-kpis span{display:block;font-size:.76rem;color:rgba(255,255,255,.78)}
.hb-kpis b{font-size:1.05rem}
.hb-prod{list-style:none;padding:0;display:grid;gap:10px;position:relative}
.hb-prod li{display:grid;grid-template-columns:64px 1fr auto;align-items:center;gap:10px;font-size:.86rem}
.hb-prod i{display:block;height:8px;border-radius:999px;background:rgba(255,255,255,.18);position:relative;overflow:hidden}
.hb-prod i::after{content:"";position:absolute;top:0;bottom:0;left:0;width:var(--w);background:#fff;border-radius:999px}
.hb-cta{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-height:48px;margin-top:16px;border-radius:999px;background:#fff;color:var(--gain);font-weight:700;font-size:.9rem;position:relative}
.hb-saldo2{background:rgba(255,255,255,.12);border-radius:18px;padding:12px 14px;margin-top:14px;position:relative}
.hb-saldo2 span{display:block;font-size:.8rem;color:rgba(255,255,255,.78)}
.hb-saldo2 b{font-size:1.5rem;font-weight:800}
.hb-saldo2 p{font-size:.8rem;color:#F6E3A3;margin-top:4px}
.hb-movs{list-style:none;padding:0;position:relative}
.hb-movs li{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.14);font-size:.84rem}
.hb-movs li:last-child{border-bottom:0}
.hb-movs li span{display:block;font-size:.74rem;color:rgba(255,255,255,.7)}
.hb-movs .v{font-weight:700;white-space:nowrap}
.hb-movs .v.mais{color:#CDEFC0}
.hb-movs .v.rec{color:#F6E3A3}
.pulsa{animation:pulsa .7s ease}`);

fs.writeFileSync(arq, t);
console.log("ok");
