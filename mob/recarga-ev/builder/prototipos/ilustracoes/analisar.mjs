// Detecta a face de cima do pack (verde forte) e acha o quadrilátero que a contorna.
import sharp from 'sharp';
const f = process.argv[2];
const { data, info } = await sharp(f).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;
const mask = new Uint8Array(N);
for (let p = 0; p < N; p++) {
  const r = data[p * 3], g = data[p * 3 + 1], b = data[p * 3 + 2];
  if (g > 175 && g - r > 70 && g - b > 35) mask[p] = 1;
}
// dilatação para juntar os módulos separados por frestas
const R = +(process.argv[3] ?? 9), tmp = new Uint8Array(N), dil = new Uint8Array(N);
for (let y = 0; y < H; y++) { let run = -1e9; for (let x = 0; x < W; x++) { if (mask[y * W + x]) run = x; tmp[y * W + x] = x - run <= R ? 1 : 0; } run = 1e9; for (let x = W - 1; x >= 0; x--) { if (mask[y * W + x]) run = x; if (run - x <= R) tmp[y * W + x] = 1; } }
for (let x = 0; x < W; x++) { let run = -1e9; for (let y = 0; y < H; y++) { if (tmp[y * W + x]) run = y; dil[y * W + x] = y - run <= R ? 1 : 0; } run = 1e9; for (let y = H - 1; y >= 0; y--) { if (tmp[y * W + x]) run = y; if (run - y <= R) dil[y * W + x] = 1; } }
const lab = new Int32Array(N).fill(-1); let best = -1, bestN = 0, comp = 0; const st = [];
for (let s = 0; s < N; s++) {
  if (!dil[s] || lab[s] >= 0) continue; let cnt = 0; st.push(s); lab[s] = comp;
  while (st.length) { const p = st.pop(); cnt++; const x = p % W;
    if (x > 0 && dil[p - 1] && lab[p - 1] < 0) { lab[p - 1] = comp; st.push(p - 1); }
    if (x < W - 1 && dil[p + 1] && lab[p + 1] < 0) { lab[p + 1] = comp; st.push(p + 1); }
    if (p >= W && dil[p - W] && lab[p - W] < 0) { lab[p - W] = comp; st.push(p - W); }
    if (p < N - W && dil[p + W] && lab[p + W] < 0) { lab[p + W] = comp; st.push(p + W); } }
  if (cnt > bestN) { bestN = cnt; best = comp; } comp++;
}
const pts = [];
for (let p = 0; p < N; p++) if (mask[p] && lab[p] === best) pts.push([p % W, (p / W) | 0]);
// casco convexo (monotone chain)
pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
const lo = [], up = [];
for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
const hull = lo.slice(0, -1).concat(up.slice(0, -1));
// quadrilátero de maior área com vértices no casco
const area = q => { let s = 0; for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; };
const step = Math.max(1, Math.floor(hull.length / 60)); const Hs = hull.filter((_, i) => i % step === 0);
let bq = null, ba = 0;
for (let a = 0; a < Hs.length; a++) for (let b = a + 1; b < Hs.length; b++) for (let c = b + 1; c < Hs.length; c++) for (let d = c + 1; d < Hs.length; d++) {
  const q = [Hs[a], Hs[b], Hs[c], Hs[d]], ar = area(q); if (ar > ba) { ba = ar; bq = q; } }
console.log(JSON.stringify({ W, H, comp: bestN, hull: hull.length, quad: bq, area: ba }));
