// Cena "carro + carregador" da tela de conectar: par solto/plugado (a versão plugada é uma edição
// da solta, com o mesmo enquadramento), recortado, com borda transparente e as posições em JSON.
import sharp from 'sharp';
import fs from 'fs';

const CENAS = {
  foto: { solto: 'ia/c-foto1.png', plugado: 'ia/c-foto1-plug.png', port: [985, 822], holster: [2030, 700], crop: { left: 100, top: 130, width: 2300, height: 1600 } },
  mini: { solto: 'ia/c-mini1.png', plugado: 'ia/c-mini1-plug.png', port: [841, 805], holster: [1690, 830], crop: { left: 100, top: 140, width: 2300, height: 1600 } },
};
const OUT_W = 1400;
const ss = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);

const geo = {};
for (const [id, C] of Object.entries(CENAS)) {
  const sc = OUT_W / C.crop.width, OUT_H = Math.round(C.crop.height * sc);
  // esquerda longa (o carro sai de quadro), demais lados curtos
  const alpha = Buffer.alloc(OUT_W * OUT_H);
  for (let y = 0; y < OUT_H; y++) for (let x = 0; x < OUT_W; x++)
    alpha[y * OUT_W + x] = Math.round(255 * ss(x / (OUT_W * .16)) * ss((OUT_W - 1 - x) / (OUT_W * .06)) * ss(y / (OUT_H * .07)) * ss((OUT_H - 1 - y) / (OUT_H * .12)));
  for (const nome of ['solto', 'plugado']) {
    const rgb = await sharp(C[nome]).removeAlpha().extract(C.crop).resize(OUT_W, OUT_H).raw().toBuffer();
    await sharp(rgb, { raw: { width: OUT_W, height: OUT_H, channels: 3 } })
      .joinChannel(alpha, { raw: { width: OUT_W, height: OUT_H, channels: 1 } })
      .webp({ quality: 84, alphaQuality: 90, effort: 5 }).toFile(`carregador-${id}-${nome}.webp`);
  }
  const { data } = await sharp(C.solto).removeAlpha().extract({ left: 20, top: 20, width: 40, height: 40 }).raw().toBuffer({ resolveWithObject: true });
  let bg = [0, 0, 0];
  for (let i = 0; i < data.length; i += 3) { bg[0] += data[i]; bg[1] += data[i + 1]; bg[2] += data[i + 2]; }
  const T = p => [+((p[0] - C.crop.left) * sc).toFixed(1), +((p[1] - C.crop.top) * sc).toFixed(1)];
  geo[id] = { w: OUT_W, h: OUT_H, port: T(C.port), holster: T(C.holster), bg: bg.map(v => Math.round(v / 1600)) };
  console.log(id, JSON.stringify(geo[id]));
}
fs.writeFileSync('carregador.json', JSON.stringify(geo, null, 2));
