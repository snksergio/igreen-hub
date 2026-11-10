// v27: bolinhas do carrossel fora do cartão, ilustrações próprias, cor dos botões de "Seus ganhos" e check do comprovante mais perto do cabeçalho.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
let t = fs.readFileSync(arq, "utf8");

// Ilustrações soltas, no estilo do raio com moedas do topo (provisórias: depois podem virar 3D)
const ilus = `// Ilustrações do carrossel "Dá pra ganhar mais"
const ILUS = {
  pay: \`<svg class="promo-ilus" width="80" height="80" viewBox="0 0 88 88" aria-hidden="true"><circle cx="44" cy="44" r="38" fill="#E2F2E7"/><rect x="16" y="30" width="46" height="32" rx="7" fill="#1C7443"/><rect x="16" y="36" width="46" height="6" fill="#145A33"/><rect x="46" y="44" width="20" height="12" rx="4" fill="#2E8B57"/><circle cx="54" cy="50" r="2.5" fill="#E2F2E7"/><ellipse cx="68" cy="68" rx="11" ry="4" fill="#B8912A"/><ellipse cx="68" cy="64" rx="11" ry="4" fill="#E6C14F"/><ellipse cx="68" cy="60" rx="11" ry="4" fill="#B8912A"/><ellipse cx="68" cy="56" rx="11" ry="4" fill="#E6C14F"/><circle cx="24" cy="22" r="10" fill="#E6C14F"/><text x="24" y="26.5" font-size="12" font-weight="800" text-anchor="middle" fill="#5C3A00" font-family="Figtree,sans-serif">%</text></svg>\`,
  ind: \`<svg class="promo-ilus" width="80" height="80" viewBox="0 0 88 88" aria-hidden="true"><circle cx="44" cy="44" r="38" fill="#E2F2E7"/><circle cx="32" cy="34" r="9" fill="#1C7443"/><path d="M17 66c0-10 7-17 15-17s15 7 15 17z" fill="#1C7443"/><circle cx="56" cy="38" r="8" fill="#7FBF8E"/><path d="M43 68c0-9 6-15 13-15s13 6 13 15z" fill="#7FBF8E"/><circle cx="64" cy="20" r="10" fill="#E6C14F"/><path d="M64 26s-5.5-3.3-5.5-7a2.8 2.8 0 0 1 5.5-1 2.8 2.8 0 0 1 5.5 1c0 3.7-5.5 7-5.5 7z" fill="#fff"/></svg>\`,
  dia: \`<svg class="promo-ilus" width="80" height="80" viewBox="0 0 88 88" aria-hidden="true"><circle cx="44" cy="44" r="38" fill="#E2F2E7"/><rect x="18" y="24" width="44" height="40" rx="7" fill="#fff" stroke="#1C7443" stroke-width="3"/><path d="M18 31a7 7 0 0 1 7-7h30a7 7 0 0 1 7 7v4H18z" fill="#1C7443"/><path d="M28 19v9M52 19v9" stroke="#1C7443" stroke-width="3.5" stroke-linecap="round"/><path d="m31 49 6 6 12-13" stroke="#1C7443" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="66" cy="64" r="12" fill="#E6C14F"/><path d="M68 55 60 66h6l-2 8 8-11h-6z" fill="#5C3A00"/></svg>\`
};
const CTA_PROMO = {pay: "Pagar com o Pay", ind: "Indicar agora", dia: "Ver a fatura"};

// Mini central de ajuda (regras fictícias do teste)`;

const trocas = [
  ["// Mini central de ajuda (regras fictícias do teste)", ilus],
  // slide: texto à esquerda com uma ação curta, ilustração à direita
  ["`<button type=\"button\" class=\"promo-slide\" ${acao} aria-label=\"${tit}. ${sub}. ${i + 1} de ${arr.length}\"><span class=\"ic\" aria-hidden=\"true\">${svg(ic,20)}</span><span class=\"txt\"><b>${tit}</b><span>${sub}</span></span>${svg(I.seta,18)}</button>`",
   "`<button type=\"button\" class=\"promo-slide\" ${acao} aria-label=\"${tit}. ${sub}. ${i + 1} de ${arr.length}\"><span class=\"txt\"><b>${tit}</b><span>${sub}</span><span class=\"promo-cta\">${CTA_PROMO[k]} ${svg(I.seta,14)}</span></span>${ILUS[k]}</button>`"],
  // bolinhas fora do cartão
  ["        </div>\n        <div class=\"promo-dots\" id=\"promo-dots\"></div>\n      </div>",
   "        </div>\n      </div>\n      <div class=\"promo-dots\" id=\"promo-dots\"></div>"],
  // check do comprovante pela metade da distância
  [".cp-head{margin:22px 0 36px;", ".cp-head{margin:11px 0 36px;"],
  // estilos
  ["/* v12 */", `/* v27 */
.promo-slide{padding:14px 12px 14px 16px;gap:10px;min-height:108px}
.promo-slide .txt b{font-size:1rem}
.promo-slide .txt > span:not(.promo-cta){margin-top:2px}
.promo-cta{display:inline-flex;align-items:center;gap:2px;margin-top:10px;font-size:.84rem;font-weight:800;color:var(--ink);white-space:nowrap}
.promo-ilus{flex:none}
.promo-dots{padding:6px 0 0}
.m-cta{color:var(--ink)}
/* v12 */`]
];
for (const [a, b] of trocas) {
  const n = t.split(a).length - 1;
  if (n !== 1) { console.log("falhou (" + n + "):", a.slice(0, 90)); process.exit(1); }
  t = t.replace(a, b);
}
fs.writeFileSync(arq, t);
console.log("ok");
