const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const blob = fs.readFileSync(process.argv[3], 'utf8').replace(/\\"/g, '"');
const all = html.replace(/const DADOS_GZ = "[^"]+"/, '').replace(/const IMGS = \{[^\n]*/, '') + '\n' + blob;
const props = ['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'margin', 'margin-top', 'margin-bottom', 'gap', 'border-radius', 'min-height', 'height', 'width'];
for (const p of props) {
  const re = new RegExp('(?<![-a-z])' + p + ':\s*([^;"`}]+)', 'g');
  const vals = {};
  let m;
  while ((m = re.exec(all))) for (const v of m[1].trim().split(/\s+/)) { if (/^-?[0-9.]+px$/.test(v)) vals[v] = (vals[v] || 0) + 1; }
  const s = Object.entries(vals).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])).map(([k, v]) => `${k.replace('px', '')}(${v})`).join(' ');
  console.log(p.padEnd(15), s);
}
