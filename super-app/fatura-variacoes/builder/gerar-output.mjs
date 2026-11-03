// Gera o output (só as variações da fatura) a partir do estudo completo do builder.
// Uso, dentro de builder/:  node gerar-output.mjs  [entrada=index.html]  [saida=../index.html]
// Tira os blocos marcados com estudo:inicio / estudo:fim (pesquisa, matriz, regras, anotações)
// e liga o MODO 'output', que esconde o quadro de regras e as telas de estudo.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const entrada = resolve(aqui, process.argv[2] || 'index.html');
const saida = resolve(aqui, process.argv[3] || '../index.html');

let s = readFileSync(entrada, 'utf8');
const antes = s.length;

function trocar(re, por, rotulo, minimo){
  const n = (s.match(re) || []).length;
  if(n < minimo) throw new Error(`${rotulo}: achei ${n}, esperava pelo menos ${minimo}`);
  s = s.replace(re, por);
  console.log(`${rotulo}: ${n}`);
}

trocar(/const MODO = 'estudo';/g, "const MODO = 'output';", 'modo', 1);
trocar(/^[ \t]*<!-- estudo:inicio -->[\s\S]*?<!-- estudo:fim -->[ \t]*\r?\n/gm, '', 'blocos HTML de estudo', 3);
trocar(/^\/\* estudo:inicio[\s\S]*?\/\* estudo:fim \*\/[ \t]*\r?\n/gm, '', 'blocos CSS de estudo', 1);
if(/estudo:(inicio|fim)/.test(s)) throw new Error('sobrou marcador de estudo no output');

writeFileSync(saida, s);
console.log(`output: ${saida} (${Math.round(s.length / 1024)} KB; estudo tinha ${Math.round(antes / 1024)} KB)`);
