// Gera os assets de ../assets a partir dos originais desta pasta (tela verde, os dois minimalistas).
// Requer: npm i sharp   ·   saída em ./hd (copie para ../assets/web e ../assets/png)
//  - Carros: parte das fontes ampliadas 2x no Magnific (ref/u25-hd.jpg, ref/u27-hd.jpg), apaga os blocos
//    coloridos, recorta pelo carro e aplica borda transparente.
//  - Carregadores: pares solto/plugado da tela 1 (ia/*.png).
//  - Tudo sai já pronto para a soma com o verde: o fundo embutido vira preto com uma transição suave
//    (sem "comer" a suavização das linhas finas) e cada imagem é exportada em 3 larguras, reduzidas com
//    Lanczos, para o navegador não precisar reduzir 4x (é isso que serrilhava anéis e contornos).
// Uso: node processar-hd.mjs
import fs from 'fs';
import { createRequire } from 'module';

let sharp;
try { sharp = (await import("sharp")).default; }
catch { console.error("Instale o sharp antes: npm i sharp"); process.exit(1); }

const OUT = 'hd', LARGURAS = [480, 960, 1440];
fs.mkdirSync(OUT, { recursive: true });

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ss = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
const segDist = (px, py, a, b) => {
  const vx = b[0] - a[0], vy = b[1] - a[1], t = clamp(((px - a[0]) * vx + (py - a[1]) * vy) / (vx * vx + vy * vy), 0, 1);
  return Math.hypot(px - a[0] - t * vx, py - a[1] - t * vy);
};
const inside = (px, py, q) => { let c = false; for (let i = 0, j = 3; i < 4; j = i++) { const [xi, yi] = q[i], [xj, yj] = q[j]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) c = !c; } return c; };
const quadDist = (x, y, q) => inside(x, y, q) ? 0 : Math.min(...[0, 1, 2, 3].map(i => segDist(x, y, q[i], q[(i + 1) % 4])));

// fundo embutido → preto, com joelho suave de KNEE níveis (em vez de um corte seco)
const KNEE = 16;
function levels(rgb, bg) {
  const lut = bg.map(c => {
    const t = c + 3, a = new Uint8Array(256), top = 255 - t - KNEE / 2;
    for (let v = 0; v < 256; v++) {
      const d = v - t, o = d <= 0 ? 0 : d < KNEE ? d * d / (2 * KNEE) : d - KNEE / 2;
      a[v] = Math.round(clamp(o / top, 0, 1) * 255);
    }
    return a;
  });
  for (let i = 0; i < rgb.length; i += 3) for (let c = 0; c < 3; c++) rgb[i + c] = lut[c][rgb[i + c]];
}

async function exportar(rgb, W, H, alpha, nome) {
  const full = await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
  for (const w of LARGURAS) {
    await sharp(full).resize(w, null, { kernel: 'lanczos3' })
      .webp({ quality: 90, alphaQuality: 95, effort: 6, smartSubsample: true }).toFile(`${OUT}/${nome}-${w}.webp`);
  }
  // PNG com sufixo de densidade (React Native / iOS / Android): 480 = @1x, 960 = @2x, 1440 = @3x
  fs.mkdirSync(`${OUT}/png`, { recursive: true });
  for (const [w, suf] of [[480, ''], [960, '@2x'], [1440, '@3x']]) {
    await sharp(full).resize(w, null, { kernel: 'lanczos3' }).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(`${OUT}/png/${nome}${suf}.png`);
  }
}

/* ---------------- carros (minimalistas) ---------------- */
// coordenadas das fontes originais (1672×941, as mesmas de processar-ia.mjs) × 2 da ampliação
const CARROS = {
  m25: { src: 'ref/u25-hd.jpg', quad: [[582.5, 458.5], [1094, 458.5], [1108, 566.5], [565, 568]], port: [1415, 425], car: [140, 176, 1505, 800], cells: 8 },
  // a ampliação do u27 voltou 10 px mais baixa (6 cortados em cima, 4 embaixo): as bordas são recompostas
  m27: { src: 'ref/u27-hd.jpg', pad: { top: 6, bottom: 4 }, quad: [[572.5, 457.5], [1111, 457.5], [1150, 550], [524, 550]], port: [1440, 415], car: [110, 160, 1560, 795], cells: 11 },
};
const K = 2, GEO_W = 1600;
const geo = {};
for (const [id, E] of Object.entries(CARROS)) {
  let img = sharp(E.src).removeAlpha();
  if (E.pad) img = sharp(await img.extend({ top: E.pad.top, bottom: E.pad.bottom, extendWith: 'copy' }).png().toBuffer());
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, q = E.quad.map(p => p.map(v => v * K));
  let bg = [0, 0, 0], n = 0;
  for (const [cx, cy] of [[40, 40], [W - 120, 40], [40, H - 120], [W - 120, H - 120]])
    for (let y = cy; y < cy + 80; y++) for (let x = cx; x < cx + 80; x++) { const i = (y * W + x) * 3; bg[0] += data[i]; bg[1] += data[i + 1]; bg[2] += data[i + 2]; n++; }
  bg = bg.map(v => v / n);

  // blocos coloridos (ciano/verde) viram o cinza dos blocos vazios; a carga é desenhada por código
  const [bx0, by0, bx1, by1] = [Math.min(...q.map(p => p[0])) - 60, Math.min(...q.map(p => p[1])) - 60, Math.max(...q.map(p => p[0])) + 60, Math.max(...q.map(p => p[1])) + 60].map(Math.round);
  for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) {
    const i = (y * W + x) * 3, r = data[i], g = data[i + 1], b = data[i + 2];
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat < 30) continue;
    const w = clamp(1 - (quadDist(x, y, q) - 10 * K) / (14 * K), 0, 1);
    if (w <= 0) continue;
    const s = clamp((sat - 30) / 50, 0, 1) * w, L = 0.3 * r + 0.59 * g + 0.11 * b;
    const v = 26 + L * 0.26, t = [v, v + 4, v + 7];
    data[i] = r + (t[0] - r) * s; data[i + 1] = g + (t[1] - g) * s; data[i + 2] = b + (t[2] - b) * s;
  }

  // bateria sólida: a face inteira (células e frestas) vira uma placa escura uniforme, e o brilho verde
  // que as células acesas deixavam na moldura é neutralizado. Assim os blocos do SVG ficam sobre uma base
  // lisa e, com a bateria em 0%, não aparece divisão entre o que era claro e o que era escuro.
  const SLAB = [20, 24, 27], IN = 5 * K, SOFT = 3 * K, BAND = 28 * K;
  for (let y = by0 - BAND; y < by1 + BAND; y++) for (let x = bx0 - BAND; x < bx1 + BAND; x++) {
    const i = (y * W + x) * 3, dist = quadDist(x, y, q);
    const wSlab = clamp(1 - (dist - IN) / SOFT, 0, 1);
    if (wSlab > 0) { for (let c = 0; c < 3; c++) data[i + c] = data[i + c] + (SLAB[c] - data[i + c]) * wSlab; if (wSlab === 1) continue; }
    const r = data[i], g = data[i + 1], b = data[i + 2], sat = Math.max(r, g, b) - Math.min(r, g, b);
    const wBand = clamp(1 - (dist - IN) / BAND, 0, 1) * clamp((sat - 12) / 50, 0, 1) * (1 - wSlab);
    if (wBand <= 0) continue;
    const L = 0.3 * r + 0.59 * g + 0.11 * b, t = [L * .96, L, L * 1.03];
    for (let c = 0; c < 3; c++) data[i + c] = data[i + c] + (t[c] - data[i + c]) * wBand;
  }

  // enquadramento pelo carro, margem larga que vira transição transparente (igual a processar-ia.mjs)
  const [cx0, cy0, cx1, cy1] = E.car.map(v => v * K), cw = cx1 - cx0, ch = cy1 - cy0, M = Math.round(cw * 0.125);
  const top = Math.max(0, Math.round(cy0 - ch * 0.12)), bottom = Math.min(H, Math.round(cy1 + ch * 0.32));
  const crop = { left: cx0 - M, top, width: cw + 2 * M, height: bottom - top };
  const extL = Math.max(0, -crop.left), extR = Math.max(0, crop.left + crop.width - W);
  const fade = { x: M, top: cy0 - top, bottom: bottom - cy1 };
  let src = sharp(data, { raw: { width: W, height: H, channels: 3 } });
  if (extL || extR) src = sharp(await src.extend({ left: extL, right: extR, extendWith: 'copy' }).raw().toBuffer(), { raw: { width: W + extL + extR, height: H, channels: 3 } });
  const rgb = await src.extract({ left: crop.left + extL, top: crop.top, width: crop.width, height: crop.height }).raw().toBuffer();
  levels(rgb, bg);
  const CW = crop.width, CH = crop.height, alpha = Buffer.alloc(CW * CH), ft = fade.top * .9;
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++)
    alpha[y * CW + x] = Math.round(255 * ss(x / fade.x) * ss((CW - 1 - x) / fade.x) * ss(y / ft) * ss((CH - 1 - y) / fade.bottom));
  await exportar(rgb, CW, CH, alpha, `carro-${id}-vazio`);

  const sc = GEO_W / CW, T = p => [+((p[0] * K - crop.left) * sc).toFixed(1), +((p[1] * K - crop.top) * sc).toFixed(1)];
  geo[id] = { w: GEO_W, h: Math.round(CH * sc), quad: E.quad.map(T), port: T(E.port), cells: E.cells, bg: bg.map(Math.round) };
  console.log(id, JSON.stringify(geo[id]));
}

/* ---------------- carregadores (tela 1) ---------------- */
const CENAS = {
  mini: { solto: 'ia/c-mini1.png', plugado: 'ia/c-mini1-plug.png' },
  minisuv: { solto: 'ia/c-minisuv.png', plugado: 'ia/c-minisuv-plug.png' },
};
const CROP = { left: 100, top: 140, width: 2300, height: 1600 }; // o mesmo de processar-carregador.mjs
for (const [id, C] of Object.entries(CENAS)) {
  const CW = CROP.width, CH = CROP.height, alpha = Buffer.alloc(CW * CH);
  // esquerda longa (o carro sai de quadro), demais lados curtos
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++)
    alpha[y * CW + x] = Math.round(255 * ss(x / (CW * .16)) * ss((CW - 1 - x) / (CW * .06)) * ss(y / (CH * .07)) * ss((CH - 1 - y) / (CH * .12)));
  const probe = await sharp(C.solto).removeAlpha().extract({ left: 20, top: 20, width: 40, height: 40 }).raw().toBuffer();
  const bg = [0, 1, 2].map(c => { let s = 0; for (let i = c; i < probe.length; i += 3) s += probe[i]; return s / 1600; });
  for (const nome of ['solto', 'plugado']) {
    const rgb = await sharp(C[nome]).removeAlpha().extract(CROP).raw().toBuffer();
    levels(rgb, bg);
    await exportar(rgb, CW, CH, alpha, `carregador-${id}-${nome}`);
  }
  console.log(id, 'bg', bg.map(Math.round).join(','));
}
fs.writeFileSync(`${OUT}/geometria.json`, JSON.stringify(geo, null, 2));
