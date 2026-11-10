// node ajustar-blob.js <file.html>: the packed screens (DADOS_GZ) get the receipt adjustments that the module code got
// through ajustes.txt: details folded, Início and Compartilhar side by side, the balloons 8 apart.
const fs = require('fs'), zlib = require('zlib');
const ARQ = process.argv[2];
let s = fs.readFileSync(ARQ, 'utf8');
const RE_GZ = /const DADOS_GZ = "([^"]+)"/;
const d = JSON.parse(zlib.gunzipSync(Buffer.from(s.match(RE_GZ)[1], 'base64')).toString('utf8'));

const REGRAS = [
  ['baloes a 8', /<div style="margin-top: 10px; (border-radius: 14px; background: #F(?:3F8F5|4F6F5); padding: (?:10px 12px 10px 10px|8px 12px 8px 8px);)/g, '<div style="margin-top: 8px; $1'],
  ['detalhes fechados', /<button aria-expanded="true"( style="width: 100%; height: 44px; margin-top: -4px;[^"]*">Detalhes do pagamento<span style="display: flex; color: #545C57); transform: rotate\(180deg\)(">(?:(?!<\/button>)[\s\S])*<\/button>\n)<div>/g, '<button aria-expanded="false"$1$2<div style="display: none">'],
  ['Inicio e Compartilhar lado a lado', /(<button style="width: 100%; height: 52px; flex-shrink: 0; border-radius: 26px; border: 0; background: #338449;(?:(?!<\/button>)[\s\S])*Compartilhar<\/button>)<div style="margin-top: 10px">(<button(?:(?!<\/button>)[\s\S])*Início<\/button>)<\/div>/g, '<div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 8px">$2$1</div>'],
];
for (const [nome, re, para] of REGRAS) {
  let n = 0;
  d.cont = d.cont.map(h => h.replace(re, (...a) => { n++; return para.replace(/\$(\d)/g, (x, k) => a[+k]); }));
  console.log(`${nome}: ${n}`);
}
const gz = zlib.gzipSync(Buffer.from(JSON.stringify(d), 'utf8'), { level: 9 }).toString('base64');
s = s.replace(RE_GZ, () => `const DADOS_GZ = "${gz}"`);
fs.writeFileSync(ARQ, s);
