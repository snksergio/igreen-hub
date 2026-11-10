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

// Outras páginas: os .html da pasta do projeto que não estão na ficha, lidas pelo <title>. Só a busca da vitrine
// usa, para achar telas soltas (um app com um arquivo por tela, por exemplo). Ficam de fora o builder/ (código e
// versões de trabalho, que não aparecem na vitrine), o _vitrine/, páginas que só redirecionam e título repetido.
const NAO_ENTRAM_NA_BUSCA = new Set(['builder', '_vitrine', 'node_modules']);
const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', middot: '·', bull: '•' };
const textoPuro = (s) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
      e[0] === '#' ? String.fromCodePoint(/x/i.test(e[1]) ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTIDADES[e.toLowerCase()] ?? m,
    )
    .replace(/\s+/g, ' ')
    .trim();
// Conteúdo das telas: as palavras do texto visível de cada tela que é um arquivo só, com quantas vezes aparecem.
// Vai para busca.js, que a vitrine só carrega quando alguém usa a busca. Protótipo com todas as telas num arquivo
// (as que abrem por #âncora) fica de fora: não dá para saber de qual tela é cada texto.
const PALAVRAS_VAZIAS = new Set(
  'que com para por uma uns umas dos das nos nas aos sua seu suas seus nao sim mais como ate sem sob pelo pela pelos pelas este esta isso isto esse essa voce voces ele ela eles elas the and for'.split(' '),
);
const conteudo = {};
function indexarConteudo(urlTela) {
  if (/^https?:\/\//.test(urlTela) || urlTela.includes('#') || conteudo[urlTela] !== undefined) return;
  let arquivo = urlTela.split('?')[0];
  if (arquivo.endsWith('/')) arquivo += 'index.html';
  if (!existsSync(join(raiz, arquivo))) {
    try {
      arquivo = decodeURI(arquivo);
    } catch {
      return;
    }
  }
  if (!/\.html?$/i.test(arquivo) || !existsSync(join(raiz, arquivo))) return;
  const corpo = readFileSync(join(raiz, arquivo), 'utf8')
    .replace(/<head[\s\S]*?<\/head>/i, ' ')
    .replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, ' ');
  const vezes = new Map();
  const palavras = textoPuro(corpo).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  for (const w of palavras) if (!PALAVRAS_VAZIAS.has(w) && !/^\d+$/.test(w)) vezes.set(w, (vezes.get(w) ?? 0) + 1);
  if (!vezes.size) return;
  conteudo[urlTela] = [...vezes]
    .sort((a, b) => b[1] - a[1])
    .map(([w, n]) => (n > 1 ? `${w}:${n}` : w))
    .join(' ');
}
const paginasHtml = (dir, rel = '') =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith('.')) return [];
    const caminho = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) return NAO_ENTRAM_NA_BUSCA.has(e.name) ? [] : paginasHtml(join(dir, e.name), caminho);
    return /\.html?$/i.test(e.name) ? [caminho] : [];
  });

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

    // O padrão da ficha para a busca (seção 3 do ORQUESTRADOR): descrição curta, tags de assunto, página com nome.
    if (typeof p.descricao === 'string' && p.descricao.length > 220) aviso(`"descricao" com ${p.descricao.length} caracteres: o padrão é até uns 200`);
    const nTags = Array.isArray(p.tags) ? p.tags.length : 0;
    if (nTags < 3) aviso(`${nTags === 0 ? 'sem tags' : `só ${nTags} ${nTags === 1 ? 'tag' : 'tags'}`}: ponha de 5 a 10 assuntos, para a busca achar o projeto`);
    if (!p.paginas?.length) aviso('sem "paginas": a entrada aparece como "Abrir"; dê a ela o nome do que mostra');
    else for (const pg of p.paginas) if (/^\s*abrir\s*$/i.test(pg.nome ?? '')) aviso('página chamada "Abrir": dê o nome do que ela mostra');

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
    const imagens = (dir) =>
      ehPasta(dir)
        ? readdirSync(dir)
            .filter((f) => IMAGEM.test(f))
            .sort((a, b) => b.startsWith('capa.') - a.startsWith('capa.') || a.localeCompare(b))
        : [];
    const telas = imagens(pastaVitrine);
    if (!telas.length) aviso('sem imagens em _vitrine/ (a vitrine mostra uma capa provisória)');

    // Acervo: as variações do projeto em grupos (uma aba própria na ficha). Cada grupo pode ter
    // os próprios prints em _vitrine/<prints>/, que a galeria mostra quando o grupo está aberto.
    let acervo = null;
    if (p.acervo !== undefined) {
      const grupos = Array.isArray(p.acervo?.grupos) ? p.acervo.grupos : [];
      if (!grupos.length) aviso('"acervo" precisa de "grupos", cada um com "nome" e "paginas"');
      acervo = {
        nome: p.acervo?.nome || 'Acervo',
        grupos: grupos.map((g) => {
          const itens = Array.isArray(g.paginas) ? g.paginas : [];
          if (!g.nome || !itens.length) aviso('cada grupo do "acervo" precisa de "nome" e "paginas"');
          const falta = (arquivo) => !p.link && !externo(arquivo) && !existsSync(join(pasta, arquivo.split(/[?#]/)[0]));
          for (const it of itens) {
            if (!it.nome || typeof it.arquivo !== 'string') aviso(`acervo "${g.nome}": cada página precisa de "nome" e "arquivo"`);
            else if (falta(it.arquivo)) aviso(`acervo "${g.nome}": "${it.arquivo}" não existe na pasta`);
          }
          if (g.arquivo !== undefined && (typeof g.arquivo !== 'string' || falta(g.arquivo))) aviso(`acervo "${g.nome}": "arquivo" do grupo não existe na pasta`);
          let telasGrupo = [];
          if (g.prints) {
            if (!SLUG.test(g.prints)) aviso(`acervo "${g.nome}": "prints" é o nome de uma subpasta de _vitrine/ (minúsculas e hífen)`);
            telasGrupo = imagens(join(pastaVitrine, g.prints));
            if (!telasGrupo.length) aviso(`acervo "${g.nome}": sem imagens em _vitrine/${g.prints}/`);
          }
          return {
            nome: g.nome ?? '',
            url: typeof g.arquivo === 'string' ? url(g.arquivo) : null,
            rotulo: g.rotulo ?? null,
            paginas: itens.filter((it) => it.nome && typeof it.arquivo === 'string').map((it) => ({ nome: it.nome, url: url(it.arquivo), marca: it.marca ?? null })),
            telas: telasGrupo.map((f) => `${id}/_vitrine/${g.prints}/${f}`),
          };
        }),
      };
    }

    const semAncora = (arquivo) => {
      const s = arquivo.split(/[?#]/)[0];
      return !s || s.endsWith('/') ? `${s}index.html` : s;
    };
    const naFicha = new Set(
      [...paginas, ...versoes, ...(p.acervo?.grupos ?? []).flatMap((g) => [g, ...(Array.isArray(g.paginas) ? g.paginas : [])])]
        .map((x) => x?.arquivo)
        .filter((a) => typeof a === 'string' && !externo(a))
        .map(semAncora),
    );
    const titulosVistos = new Set();
    const outras = p.link
      ? []
      : paginasHtml(pasta)
          .filter((rel) => !naFicha.has(rel))
          .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))
          .flatMap((rel) => {
            const html = readFileSync(join(pasta, rel), 'utf8');
            if (/http-equiv=["']?refresh/i.test(html)) return [];
            const nome =
              textoPuro(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '') ||
              rel.split('/').pop().replace(/\.html?$/i, '').replace(/[-_]+/g, ' ');
            if (titulosVistos.has(nome)) return [];
            titulosVistos.add(nome);
            return [{ nome, url: url(rel) }];
          });

    if (!p.link) {
      const telasDaFicha = [...paginas, ...versoes, ...(acervo?.grupos ?? []).flatMap((g) => g.paginas)];
      for (const x of telasDaFicha) {
        if (typeof x?.url === 'string') indexarConteudo(x.url);
        else if (typeof x?.arquivo === 'string') indexarConteudo(url(x.arquivo));
      }
      for (const o of outras) indexarConteudo(o.url);
    }

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
      acervo,
      outras,
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
writeFileSync(
  join(raiz, 'busca.js'),
  `// Gerado por scripts/gerar-catalogo.mjs. Não edite. Texto das telas para a busca da vitrine: endereço da tela -> palavras (palavra:vezes).\nwindow.BUSCA = ${JSON.stringify(conteudo)};\n`,
);

console.log(`catalogo.js: ${projetos.length} projeto(s)`);
if (avisos.length) {
  console.log(`\n${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`  - ${a}`);
}
if (checar && avisos.length) process.exit(1);
