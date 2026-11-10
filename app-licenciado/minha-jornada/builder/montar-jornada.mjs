// Monta documentacao-jornada.html: o <head> (estilos) da documentação de reconhecimento + o corpo da jornada.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [pasta, corpo] = process.argv.slice(2);
const base = await readFile(join(pasta, 'documentacao.html'), 'utf8');
const fimHead = base.indexOf('</head>');
if (fimHead < 0) throw new Error('</head> não encontrado');
const head = base.slice(0, fimHead + '</head>'.length)
  .replace(/<title>[^<]*<\/title>/, '<title>Minha jornada · documentação</title>');
const body = await readFile(corpo, 'utf8');
await writeFile(join(pasta, 'documentacao-jornada.html'), head + '\n' + body, 'utf8');
console.log('ok documentacao-jornada.html');
