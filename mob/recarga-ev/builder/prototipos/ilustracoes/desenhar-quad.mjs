// Desenha o quadrilátero detectado sobre a imagem, para conferência visual.
import sharp from 'sharp';
const [f, out, q] = [process.argv[2], process.argv[3], JSON.parse(process.argv[4])];
const m = await sharp(f).metadata();
const pts = q.map(p => p.join(',')).join(' ');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${m.width}" height="${m.height}"><polygon points="${pts}" fill="none" stroke="#ff2d55" stroke-width="3"/>${q.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="#ff2d55"/><text x="${p[0] + 12}" y="${p[1] - 12}" font-size="40" fill="#fff">${i}</text>`).join('')}</svg>`;
const buf = await sharp(f).composite([{ input: Buffer.from(svg) }]).png().toBuffer();
await sharp(buf).extract({ left: 600, top: 550, width: 1250, height: 520 }).png().toFile(out);
