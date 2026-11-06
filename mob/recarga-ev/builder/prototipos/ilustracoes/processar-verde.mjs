// Gera as cópias das ilustrações usadas na tela verde (recarga-ev-moldes-verde.html).
// Os renders trazem um fundo escuro embutido. Aqui esse fundo vira preto puro (níveis por canal,
// a partir da cor de fundo de cada imagem), e a página mistura a imagem com o verde em modo "screen":
// o preto some e só a luz do carro aparece sobre o fundo. As originais não são alteradas.
// Uso: node processar-verde.mjs                 (todas)
//      node processar-verde.mjs carregador-minisuv   (só os arquivos cujo nome contém o termo)
import fs from 'fs';
import { createRequire } from 'module';

let sharp;
try { sharp = (await import('sharp')).default; }
catch { sharp = createRequire(process.env.SHARP_FROM || 'C:/Users/sergi/OneDrive/Área de Trabalho/Mob/package.json')('sharp'); }

// folga acima da cor de fundo registrada: absorve a vinheta leve que alguns renders têm
const PAD = 7;
const OUT = 'verde';

const carros = JSON.parse(fs.readFileSync('carros-ia.json', 'utf8'));
const carregador = JSON.parse(fs.readFileSync('carregador.json', 'utf8'));
const jobs = [];
for (const [k, g] of Object.entries(carros))
  for (const n of ['vazio', 'cheio']) jobs.push({ f: `carro-${k}-${n}.webp`, bg: g.bg });
for (const [e, g] of Object.entries(carregador))
  for (const n of ['solto', 'plugado']) jobs.push({ f: `carregador-${e}-${n}.webp`, bg: g.bg });

const alvo = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
for (const { f, bg } of jobs) {
  if (!fs.existsSync(f) || (alvo.length && !alvo.some(a => f.includes(a)))) continue;
  const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const lut = bg.map(c => {
    const t = Math.min(250, c + PAD), a = new Uint8Array(256);
    for (let v = 0; v < 256; v++) a[v] = Math.round(Math.max(0, (v - t) / (255 - t)) * 255);
    return a;
  });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = lut[0][data[i]];
    data[i + 1] = lut[1][data[i + 1]];
    data[i + 2] = lut[2][data[i + 2]];
  }
  await sharp(data, { raw: info }).webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/${f}`);
  console.log(`${OUT}/${f}`);
}
