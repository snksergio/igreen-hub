// Gera os assets de cada molde a partir do render de origem e grava a geometria em JSON.
//  - tipo "foto": o render tem o pack 100% verde. Sai o par cheio/vazio, alinhado pixel a pixel
//    (o vazio é o mesmo render com o verde do pack e a luz do chão neutralizados).
//  - tipo "mini": só a base com os blocos apagados; os blocos coloridos são desenhados por código.
// Uso: node processar-ia.mjs            (todos)
//      node processar-ia.mjs s21 m25    (só alguns)
import sharp from 'sharp';
import fs from 'fs';

const ESTILOS = {
  a2: { tipo: 'foto', src: 'ia/a2.png', quad: [[965, 751], [1560, 750], [1604, 902], [920, 903]], port: [1997, 653], crop: { left: 130, top: 230, width: 2240, height: 1000 }, spill: { dy: 185, rx: 1.7, ry: 240 } },
  a3: { tipo: 'foto', src: 'ia/a3.png', quad: [[1025, 647], [1666, 721], [1517, 943], [826, 856]], port: [2022, 692], crop: { left: 110, top: 80, width: 2340, height: 1130 }, spill: { dy: 160, rx: 1.6, ry: 230 } },
  s21: { tipo: 'foto', src: 'ia/u21.png', quad: [[959, 622], [1799, 622], [1846, 895], [894, 892]], port: [2305, 680], car: [277, 228, 2449, 1095], spill: { dy: 160, rx: 1.9, ry: 260 } },
  s22: { tipo: 'foto', src: 'ia/u22.png', quad: [[920, 674], [1739, 673], [1791, 933], [858, 933]], port: [2345, 705], car: [260, 226, 2470, 1085], spill: { dy: 160, rx: 1.9, ry: 260 } },
  s23: { tipo: 'foto', src: 'ia/u23.png', quad: [[937, 644], [1847, 626], [1891, 911], [883, 908]], port: [2320, 700], car: [200, 211, 2540, 1105], spill: { dy: 160, rx: 1.9, ry: 260 } },
  s24: { tipo: 'foto', src: 'ia/u24.png', quad: [[931, 662], [1775, 663], [1815, 951], [885, 942]], port: [2378, 695], car: [189, 215, 2533, 1125], spill: { dy: 160, rx: 1.9, ry: 260 } },
  m25: { tipo: 'mini', src: 'ref/u25.webp', quad: [[582.5, 458.5], [1094, 458.5], [1108, 566.5], [565, 568]], port: [1415, 425], car: [140, 176, 1505, 800], cells: 8 },
  m27: { tipo: 'mini', src: 'ref/u27.webp', quad: [[572.5, 457.5], [1111, 457.5], [1150, 550], [524, 550]], port: [1440, 415], car: [110, 160, 1560, 795], cells: 11 },
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const segDist = (px, py, a, b) => {
  const vx = b[0] - a[0], vy = b[1] - a[1], t = clamp(((px - a[0]) * vx + (py - a[1]) * vy) / (vx * vx + vy * vy), 0, 1);
  return Math.hypot(px - a[0] - t * vx, py - a[1] - t * vy);
};
const inside = (px, py, q) => { let c = false; for (let i = 0, j = 3; i < 4; j = i++) { const [xi, yi] = q[i], [xj, yj] = q[j]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) c = !c; } return c; };
const quadDist = (x, y, q) => inside(x, y, q) ? 0 : Math.min(segDist(x, y, q[0], q[1]), segDist(x, y, q[1], q[2]), segDist(x, y, q[2], q[3]), segDist(x, y, q[3], q[0]));

const geoFile = 'carros-ia.json';
const geo = fs.existsSync(geoFile) ? JSON.parse(fs.readFileSync(geoFile, 'utf8')) : {};
const alvo = process.argv.slice(2);

for (const [id, E] of Object.entries(ESTILOS)) {
  if (alvo.length && !alvo.includes(id)) continue;
  const { data, info } = await sharp(E.src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, q = E.quad;
  let bg = [0, 0, 0], k = 0;
  for (const [cx, cy] of [[20, 20], [W - 60, 20], [20, H - 60], [W - 60, H - 60]])
    for (let y = cy; y < cy + 40; y++) for (let x = cx; x < cx + 40; x++) { const i = (y * W + x) * 3; bg[0] += data[i]; bg[1] += data[i + 1]; bg[2] += data[i + 2]; k++; }
  bg = bg.map(v => v / k);

  const empty = Buffer.from(data);
  let sp = null;
  if (E.tipo === 'foto') {
    const near = [(q[2][0] + q[3][0]) / 2, Math.max(q[2][1], q[3][1])];
    const len = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]);
    sp = { cx: near[0], cy: near[1] + E.spill.dy, rx: len * E.spill.rx / 2, ry: E.spill.ry };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3, r = data[i], g = data[i + 1], b = data[i + 2];
      const d = g - Math.max(r, b);
      if (d < 6) continue;
      const wPack = clamp(1 - (quadDist(x, y, q) - 30) / 40, 0, 1);
      const e = Math.hypot((x - sp.cx) / sp.rx, (y - sp.cy) / sp.ry);
      const wSpill = y > near[1] - 10 ? clamp((1.5 - e) / 0.75, 0, 1) : 0;
      if (wPack <= 0 && wSpill <= 0) continue;
      const s = clamp((d - 6) / 34, 0, 1), L = 0.3 * r + 0.59 * g + 0.11 * b;
      const t = wPack >= wSpill ? [12 + L * 0.24, 15 + L * 0.24, 14 + L * 0.24] : bg;
      const w = s * Math.max(wPack, wSpill);
      empty[i] = r + (t[0] - r) * w; empty[i + 1] = g + (t[1] - g) * w; empty[i + 2] = b + (t[2] - b) * w;
    }
  } else {
    // minimalista: blocos coloridos (ciano/verde) viram o cinza dos blocos vazios
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3, r = data[i], g = data[i + 1], b = data[i + 2];
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      if (sat < 30) continue;
      const w = clamp(1 - (quadDist(x, y, q) - 10) / 14, 0, 1);
      if (w <= 0) continue;
      const s = clamp((sat - 30) / 50, 0, 1) * w, L = 0.3 * r + 0.59 * g + 0.11 * b;
      const v = 26 + L * 0.26, t = [v, v + 4, v + 7];
      empty[i] = r + (t[0] - r) * s; empty[i + 1] = g + (t[1] - g) * s; empty[i + 2] = b + (t[2] - b) * s;
    }
  }

  // enquadramento: pelo carro (margem larga que vira transição transparente) ou recorte fixo (A2/A3)
  let extL = 0, extR = 0, fade = { x: 48, top: 48, bottom: 90 };
  if (E.car) {
    const [cx0, cy0, cx1, cy1] = E.car, cw = cx1 - cx0, ch = cy1 - cy0, M = Math.round(cw * 0.125);
    const top = Math.max(0, Math.round(cy0 - ch * 0.12)), bottom = Math.min(H, Math.round(cy1 + ch * 0.32));
    E.crop = { left: cx0 - M, top, width: cw + 2 * M, height: bottom - top };
    extL = Math.max(0, -E.crop.left); extR = Math.max(0, E.crop.left + E.crop.width - W);
    fade = { x: M, top: cy0 - top, bottom: bottom - cy1 };
  }
  const OUT_W = Math.min(1600, E.crop.width), sc = OUT_W / E.crop.width, OUT_H = Math.round(E.crop.height * sc);
  // bordas com transparência suave: a imagem funde com qualquer fundo (útil no RN, sem máscara)
  const alpha = Buffer.alloc(OUT_W * OUT_H);
  const ss = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
  const fx = fade.x * sc, ft = fade.top * sc * .9, fb = fade.bottom * sc;
  for (let y = 0; y < OUT_H; y++) for (let x = 0; x < OUT_W; x++)
    alpha[y * OUT_W + x] = Math.round(255 * ss(x / fx) * ss((OUT_W - 1 - x) / fx) * ss(y / ft) * ss((OUT_H - 1 - y) / fb));
  const save = async (buf, name) => {
    let src = sharp(buf, { raw: { width: W, height: H, channels: 3 } });
    if (extL || extR) { src = sharp(await src.extend({ left: extL, right: extR, extendWith: 'copy' }).raw().toBuffer(), { raw: { width: W + extL + extR, height: H, channels: 3 } }); }
    const rgb = await src.extract({ left: E.crop.left + extL, top: E.crop.top, width: E.crop.width, height: E.crop.height }).resize(OUT_W, OUT_H).raw().toBuffer();
    await sharp(rgb, { raw: { width: OUT_W, height: OUT_H, channels: 3 } })
      .joinChannel(alpha, { raw: { width: OUT_W, height: OUT_H, channels: 1 } })
      .webp({ quality: 84, alphaQuality: 90, effort: 5 }).toFile(`carro-${id}-${name}.webp`);
  };
  if (E.tipo === 'foto') await save(data, 'cheio');
  await save(empty, 'vazio');

  const T = p => [+((p[0] - E.crop.left) * sc).toFixed(1), +((p[1] - E.crop.top) * sc).toFixed(1)];
  geo[id] = { tipo: E.tipo, w: OUT_W, h: OUT_H, quad: q.map(T), port: T(E.port), bg: bg.map(v => Math.round(v)) };
  if (sp) { const c = T([sp.cx, sp.cy]); geo[id].spill = { cx: c[0], cy: c[1], rx: +(sp.rx * sc).toFixed(1), ry: +(sp.ry * sc).toFixed(1) }; }
  if (E.cells) geo[id].cells = E.cells;
  console.log(id, JSON.stringify(geo[id]));
}
fs.writeFileSync(geoFile, JSON.stringify(geo, null, 2));
