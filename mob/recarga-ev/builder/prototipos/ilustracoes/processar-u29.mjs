// SUV 3/4 (ref/u29.webp): a imagem vem com parte das células em ciano. Gera a base vazia
// (todas as células no cinza das células vazias), para a carga ser desenhada por código.
// Uso: node processar-u29.mjs
import { createRequire } from 'module';

let sharp;
try { sharp = (await import('sharp')).default; }
catch { sharp = createRequire(process.env.SHARP_FROM || 'C:/Users/sergi/OneDrive/Área de Trabalho/Mob/package.json')('sharp'); }

const SRC = 'ref/u29.webp', OUT = 'carro-u29-vazio.webp';
const Q = [[556, 571], [998, 571], [1013, 646.5], [534, 646.5]]; // face das células, na imagem de origem

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const segDist = (px, py, a, b) => {
  const vx = b[0] - a[0], vy = b[1] - a[1], t = clamp(((px - a[0]) * vx + (py - a[1]) * vy) / (vx * vx + vy * vy), 0, 1);
  return Math.hypot(px - a[0] - t * vx, py - a[1] - t * vy);
};
const inside = (px, py, q) => { let c = false; for (let i = 0, j = 3; i < 4; j = i++) { const [xi, yi] = q[i], [xj, yj] = q[j]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) c = !c; } return c; };
const quadDist = (x, y, q) => inside(x, y, q) ? 0 : Math.min(...[0, 1, 2, 3].map(i => segDist(x, y, q[i], q[(i + 1) % 4])));

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const at = (x, y) => (y * W + x) * 4;
const L = i => 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
const isCyan = i => Math.min(data[i + 1], data[i + 2]) - data[i] > 40;

// referência de cor: células ciano (lado esquerdo) e cinzas (lado direito), no miolo do pack
let cy = 0, nc = 0, gr = [0, 0, 0], ng = 0;
for (let y = 585; y < 635; y++) {
  for (let x = 575; x < 740; x++) { const i = at(x, y); if (isCyan(i)) { cy += L(i); nc++; } }
  for (let x = 800; x < 980; x++) { const i = at(x, y); if (!isCyan(i)) { gr[0] += data[i]; gr[1] += data[i + 1]; gr[2] += data[i + 2]; ng++; } }
}
cy /= nc; gr = gr.map(v => v / ng);
const grL = 0.3 * gr[0] + 0.59 * gr[1] + 0.11 * gr[2];
console.log('ciano L médio', cy.toFixed(1), '· cinza médio', gr.map(v => v.toFixed(0)).join(','));

// troca: mantém o desenho (separadores e degradê) pela luminância relativa, com a cor do cinza vazio
let n = 0;
for (let y = 540; y < 690; y++) for (let x = 500; x < 1060; x++) {
  const i = at(x, y);
  if (!isCyan(i)) continue;
  const w = clamp(1 - (quadDist(x, y, Q) - 3) / 6, 0, 1);
  if (w <= 0) continue;
  const k = L(i) / cy, s = clamp((Math.min(data[i + 1], data[i + 2]) - data[i] - 40) / 40, 0, 1) * w;
  for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] + (clamp(gr[c] * k, 0, 255) - data[i + c]) * s);
  n++;
}
await sharp(data, { raw: info }).webp({ quality: 84, alphaQuality: 90, effort: 5 }).toFile(OUT);
console.log(`${OUT}: ${n} px ajustados (${W}x${H})`);
