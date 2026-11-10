// node busca.js <html> <regex> [ctx]: counts matches in the page source and in the unpacked blob
const fs = require('fs'), zlib = require('zlib');
const src = fs.readFileSync(process.argv[2], 'utf8');
const blob = zlib.gunzipSync(Buffer.from(src.match(/const DADOS_GZ = "([^"]+)"/)[1], 'base64')).toString('utf8').replace(/\\"/g, '"').replace(/\n/g, '\n');
const html = src.replace(/const DADOS_GZ = "[^"]+"/, '').replace(/const IMGS = \{[^\n]*/, '');
const re = new RegExp(process.argv[3], 'g'), ctx = +process.argv[4] || 0;
for (const [nome, txt] of [['html', html], ['blob', blob]]) {
  const c = {};
  for (const m of txt.matchAll(re)) { const k = ctx ? txt.slice(Math.max(0, m.index - ctx), m.index + m[0].length + ctx).replace(/\n/g, '⏎') : m[0]; c[k] = (c[k] || 0) + 1; }
  for (const [k, v] of Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(nome, v, k);
}
