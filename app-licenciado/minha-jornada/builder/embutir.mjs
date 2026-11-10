// Coloca protótipos dentro de uma documentação (base64), entre PROTOS-INICIO e PROTOS-FIM.
// Uso: node embutir.mjs <pasta> <doc.html> chave=arquivo.html [chave=arquivo.html ...]
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [pasta, docNome, ...pares] = process.argv.slice(2);
const doc = join(pasta, docNome);
const html = await readFile(doc, 'utf8');
const ini = '/*PROTOS-INICIO*/', fim = '/*PROTOS-FIM*/';
const a = html.indexOf(ini), b = html.indexOf(fim);
if (a < 0 || b < 0) throw new Error('marcadores não encontrados em ' + docNome);
const linhas = [];
for (const p of pares){
  const [chave, arq] = p.split('=');
  const b64 = Buffer.from(await readFile(join(pasta, arq), 'utf8'), 'utf8').toString('base64');
  linhas.push(`  ${chave}: "${b64}"`);
}
const bloco = `${ini}\nconst PROTO_SRC = {\n${linhas.join(',\n')}\n};\n`;
await writeFile(doc, html.slice(0, a) + bloco + html.slice(b), 'utf8');
console.log('ok', docNome, (await readFile(doc)).length, 'bytes');
