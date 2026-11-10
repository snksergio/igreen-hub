// node remover-bloco.js <ajustes.txt> "<block name>" ...: removes whole blocks by name
const fs = require('fs');
const [, , ARQ, ...nomes] = process.argv;
let t = fs.readFileSync(ARQ, 'utf8').replace(/\r\n/g, '\n');
for (const nome of nomes) {
  const ini = t.indexOf(`@@@ ${nome}\n`);
  if (ini < 0) { console.log(`não achado: ${nome}`); continue; }
  const fim = t.indexOf('\n>>>', ini) + 4;
  t = t.slice(0, ini) + t.slice(fim).replace(/^\n+/, '');
  console.log(`removido: ${nome}`);
}
fs.writeFileSync(ARQ, t);
