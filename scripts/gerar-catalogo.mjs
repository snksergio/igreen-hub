// Junta os projeto.json de cada <categoria>/<slug>/ em catalogo.js, que a vitrine (index.html) lê.
// Roda sozinho na publicação. Não edite catalogo.js à mão.
//
//   node scripts/gerar-catalogo.mjs            gera e lista os avisos
//   node scripts/gerar-catalogo.mjs --checar   idem, mas sai com erro se houver aviso

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const { categorias, tipos } = JSON.parse(readFileSync(join(raiz, 'categorias.json'), 'utf8'));
const checar = process.argv.includes('--checar');

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATA = /^\d{4}-\d{2}-\d{2}$/;
const IMAGEM = /\.(png|jpe?g|webp|avif|gif)$/i;
const STATUS = ['ativo', 'rascunho', 'arquivado'];
const NAO_SAO_CATEGORIA = new Set(['scripts', 'node_modules']);

const ehPasta = (p) => existsSync(p) && statSync(p).isDirectory();
const avisos = [];
const projetos = [];

for (const nome of readdirSync(raiz)) {
  if (nome.startsWith('.') || NAO_SAO_CATEGORIA.has(nome) || !ehPasta(join(raiz, nome))) continue;
  if (!categorias.some((c) => c.id === nome)) avisos.push(`${nome}/: pasta na raiz que não está em categorias.json`);
}

for (const categoria of categorias) {
  const pastaCategoria = join(raiz, categoria.id);
  if (!ehPasta(pastaCategoria)) continue;

  for (const slug of readdirSync(pastaCategoria)) {
    const pasta = join(pastaCategoria, slug);
    if (!ehPasta(pasta)) continue;
    const id = `${categoria.id}/${slug}`;
    const aviso = (msg) => avisos.push(`${id}: ${msg}`);

    if (!SLUG.test(slug)) aviso('nome da pasta fora do padrão (minúsculas, números e hífen)');
    const ficha = join(pasta, 'projeto.json');
    if (!existsSync(ficha)) {
      aviso('sem projeto.json, não aparece na vitrine');
      continue;
    }

    let p;
    try {
      p = JSON.parse(readFileSync(ficha, 'utf8'));
    } catch (e) {
      aviso(`projeto.json inválido (${e.message})`);
      continue;
    }

    for (const campo of ['nome', 'descricao', 'tipo', 'atualizado']) if (!p[campo]) aviso(`falta "${campo}" no projeto.json`);
    if (p.tipo && !tipos[p.tipo]) aviso(`tipo "${p.tipo}" não existe em categorias.json`);
    if (p.atualizado && !DATA.test(p.atualizado)) aviso('"atualizado" deve ser AAAA-MM-DD');
    if (p.status && !STATUS.includes(p.status)) aviso(`"status" deve ser ${STATUS.join(', ')}`);

    // "arquivo" é relativo à pasta do projeto, ou ao "link" quando o projeto mora fora daqui.
    // Uma URL completa também vale (uma versão antiga que mora em outro endereço, por exemplo).
    const paginas = p.paginas?.length ? p.paginas : [{ nome: 'Abrir', arquivo: p.link ? '' : 'index.html' }];
    const versoes = p.versoes ?? [];
    const externo = (arquivo) => /^https?:\/\//.test(arquivo);
    const url = (arquivo) =>
      externo(arquivo) || p.link
        ? new URL(arquivo, p.link ?? undefined).href
        : `${id}/${arquivo.replace(/^index\.html(?=$|[?#])/, '')}`;
    if (!p.link) {
      for (const { arquivo } of [...paginas, ...versoes]) {
        if (!externo(arquivo) && !existsSync(join(pasta, arquivo.split(/[?#]/)[0]))) aviso(`"${arquivo}" não existe na pasta`);
      }
    }
    for (const v of versoes) {
      if (!v.nome || v.arquivo === undefined) aviso('cada item de "versoes" precisa de "nome" e "arquivo"');
      if (v.data && !DATA.test(v.data)) aviso(`versão "${v.nome}": "data" deve ser AAAA-MM-DD`);
    }

    const pastaVitrine = join(pasta, '_vitrine');
    const telas = ehPasta(pastaVitrine)
      ? readdirSync(pastaVitrine)
          .filter((f) => IMAGEM.test(f))
          .sort((a, b) => b.startsWith('capa.') - a.startsWith('capa.') || a.localeCompare(b))
      : [];
    if (!telas.length) aviso('sem imagens em _vitrine/ (a vitrine mostra uma capa provisória)');

    projetos.push({
      id,
      categoria: categoria.id,
      nome: p.nome ?? slug,
      descricao: p.descricao ?? '',
      tipo: p.tipo ?? '',
      atualizado: p.atualizado ?? '',
      status: p.status ?? 'ativo',
      paginas: paginas.map((pg) => ({ nome: pg.nome, url: url(pg.arquivo) })),
      versoes: versoes.map((v) => ({ nome: v.nome, url: url(v.arquivo), data: v.data ?? null })),
      externo: Boolean(p.link),
      repo: p.repo ?? null,
      tags: p.tags ?? [],
      telas: telas.map((f) => `${id}/_vitrine/${f}`),
    });
  }
}

projetos.sort((a, b) => b.atualizado.localeCompare(a.atualizado) || a.nome.localeCompare(b.nome));

const catalogo = { gerado: new Date().toISOString(), categorias, tipos, projetos };
writeFileSync(
  join(raiz, 'catalogo.js'),
  `// Gerado por scripts/gerar-catalogo.mjs. Não edite.\nwindow.CATALOGO = ${JSON.stringify(catalogo, null, 1)};\n`,
);

console.log(`catalogo.js: ${projetos.length} projeto(s)`);
if (avisos.length) {
  console.log(`\n${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`  - ${a}`);
}
if (checar && avisos.length) process.exit(1);
