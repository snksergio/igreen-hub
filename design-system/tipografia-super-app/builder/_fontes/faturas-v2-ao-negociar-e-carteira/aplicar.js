// Applies "before -> after" blocks to a file, each checked by an exact count.
// node aplicar.js <file.html> <ajustes.txt>
// Block format:
//   @@@ name [xN]
//   <<<
//   exact old text (any characters, no escaping)
//   ===
//   new text
//   >>>
const fs = require('fs');
const [, , ARQ, AJ] = process.argv;
let s = fs.readFileSync(ARQ, 'utf8');
const txt = fs.readFileSync(AJ, 'utf8').replace(/\r\n/g, '\n');
const re = /^@@@ (.+?)(?: x(\d+))?\n<<<\n([\s\S]*?)\n===\n([\s\S]*?)\n>>>$/gm;
const TOLERANTE = !!process.env.TOLERANTE, pulados = [];
let m, n = 0;
while ((m = re.exec(txt))) {
  const [, nome, vezes = '1', de, para] = m;
  const partes = s.split(de);
  if (TOLERANTE && partes.length === 1) { pulados.push(nome); continue; }
  if (partes.length - 1 !== +vezes) throw new Error(`[${nome}] esperava ${vezes}x, achei ${partes.length - 1}x`);
  s = partes.join(para);
  n++;
}
fs.writeFileSync(ARQ, s);
console.log(`ajustes ok: ${n} blocos` + (pulados.length ? `, ${pulados.length} pulados:\n  ` + pulados.join('\n  ') : ''));
