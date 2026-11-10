const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const blob = fs.readFileSync(process.argv[3], 'utf8').replace(/\\"/g, '"');
const all = html.replace(/const DADOS_GZ = "[^"]+"/, '').replace(/const IMGS = \{[^\n]*/, '') + '\n' + blob;
const combos = {};
// grab each style="..." or css rule body
const re = /font-size:\s*([0-9.]+)px[^"`}]*/g;
let m;
while ((m = re.exec(all))) {
  const s = m[0];
  const lh = (s.match(/line-height:\s*([0-9.]+)px/) || [])[1] || '-';
  const fw = (s.match(/font-weight:\s*(\d+)/) || [])[1] || '-';
  const k = `${m[1]}/${lh}/${fw}`;
  combos[k] = (combos[k] || 0) + 1;
}
Object.entries(combos).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]) || b[1] - a[1]).forEach(([k, v]) => console.log(String(v).padStart(4), k));
