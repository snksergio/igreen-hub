// Tira os prints da vitrine com o Chrome ou o Edge instalados, sem dependências.
//
//   node scripts/capturar-telas.mjs <categoria>/<slug> [alvo ...] [--celular] [--espera=segundos] [--grupo=pasta]
//
// Sem alvo, usa a primeira página do projeto.json (ou o "link", se o projeto mora fora daqui).
// O primeiro alvo vira _vitrine/capa.webp (1440×900); os outros, 01.webp, 02.webp...
// Alvo é um arquivo da pasta (com #ancora ou ?parametro, se quiser) ou uma URL completa.
// --celular captura a galeria (não a capa) em 390×844, bom para telas de app.
// --espera=8 espera 8 s depois de carregar (padrão 4), para página com abertura animada.
// --grupo=hero tira os prints de um grupo do acervo em _vitrine/hero/ (01.webp, 02.webp..., sem capa).
//   Sem alvo, usa as 8 primeiras páginas do grupo que tem "prints": "hero" no projeto.json.
// Outro navegador: defina CHROME com o caminho do executável.

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const celular = args.includes('--celular');
const espera = Number(args.find((a) => a.startsWith('--espera='))?.split('=')[1] ?? 4) * 1000;
const grupo = args.find((a) => a.startsWith('--grupo='))?.split('=')[1];
const [projeto, ...alvos] = args.filter((a) => !a.startsWith('--'));

if (!projeto) {
  console.error('Uso: node scripts/capturar-telas.mjs <categoria>/<slug> [alvo ...] [--celular] [--espera=segundos] [--grupo=pasta]');
  process.exit(1);
}

const pasta = join(raiz, projeto);
const ficha = join(pasta, 'projeto.json');
if (!existsSync(ficha)) {
  console.error(`Não achei ${projeto}/projeto.json. Crie a ficha antes de capturar.`);
  process.exit(1);
}
const p = JSON.parse(readFileSync(ficha, 'utf8'));
if (grupo && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(grupo)) {
  console.error('--grupo é o nome de uma subpasta de _vitrine/: minúsculas, números e hífen.');
  process.exit(1);
}
if (!alvos.length && grupo) {
  const g = p.acervo?.grupos?.find((x) => x.prints === grupo);
  if (!g) {
    console.error(`Nenhum grupo do acervo com "prints": "${grupo}" no projeto.json. Passe os alvos ou ajuste a ficha.`);
    process.exit(1);
  }
  alvos.push(...g.paginas.slice(0, 8).map((pg) => pg.arquivo));
}
if (!alvos.length) alvos.push(p.paginas?.[0]?.arquivo ?? (p.link ? '' : 'index.html'));

const pf = process.env.PROGRAMFILES;
const pf86 = process.env['PROGRAMFILES(X86)'];
const candidatos = {
  win32: [
    `${pf}\\Google\\Chrome\\Application\\chrome.exe`,
    `${pf86}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    `${pf86}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${pf}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ],
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  linux: ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'],
}[process.platform] ?? [];
const chrome = process.env.CHROME || candidatos.find((c) => existsSync(c));
if (!chrome) {
  console.error('Não achei Chrome nem Edge. Defina CHROME com o caminho do navegador ou tire os prints de outro jeito.');
  process.exit(1);
}

const endereco = (alvo) => {
  if (/^https?:\/\//.test(alvo)) return alvo;
  if (p.link) return new URL(alvo, p.link).href;
  const [arquivo, resto = ''] = alvo.split(/(?=[?#])/);
  return pathToFileURL(join(pasta, arquivo || 'index.html')).href + resto;
};
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

// Abre o navegador em modo headless e conversa com ele pelo protocolo do DevTools.
const perfil = mkdtempSync(join(tmpdir(), 'capturar-telas-'));
const navegador = spawn(chrome, [
  '--headless=new',
  '--remote-debugging-port=0',
  `--user-data-dir=${perfil}`,
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--mute-audio',
  'about:blank',
]);
const wsUrl = await new Promise((resolve, reject) => {
  let saida = '';
  navegador.stderr.on('data', (d) => {
    saida += d;
    const m = saida.match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) resolve(m[1]);
  });
  navegador.on('exit', () => reject(new Error('O navegador fechou antes de abrir.')));
  setTimeout(() => reject(new Error('O navegador não respondeu em 20 s.')), 20_000).unref();
});

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let proximo = 0;
const pendentes = new Map();
const ouvintes = new Set();
ws.addEventListener('message', ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.id && pendentes.has(msg.id)) {
    const { resolve, reject } = pendentes.get(msg.id);
    pendentes.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  } else for (const f of ouvintes) f(msg);
});
const enviar = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = ++proximo;
    pendentes.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

const { targetId } = await enviar('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await enviar('Target.attachToTarget', { targetId, flatten: true });
await enviar('Page.enable', {}, sessionId);

const saida = grupo ? join(pasta, '_vitrine', grupo) : join(pasta, '_vitrine');
const relativo = grupo ? `_vitrine/${grupo}` : '_vitrine';
mkdirSync(saida, { recursive: true });
for (const f of readdirSync(saida)) if (/^(capa|\d{2})\.webp$/.test(f)) rmSync(join(saida, f));

try {
  for (const [i, alvo] of alvos.entries()) {
    const nome = grupo ? `${String(i + 1).padStart(2, '0')}.webp` : i === 0 ? 'capa.webp' : `${String(i).padStart(2, '0')}.webp`;
    const tela = (i > 0 || grupo) && celular ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true } : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };
    const url = endereco(alvo);

    await enviar('Emulation.setDeviceMetricsOverride', tela, sessionId);
    const carregou = new Promise((resolve) => {
      const f = (msg) => msg.sessionId === sessionId && msg.method === 'Page.loadEventFired' && (ouvintes.delete(f), resolve());
      ouvintes.add(f);
      setTimeout(resolve, 30_000).unref(); // página que nunca termina de carregar: captura assim mesmo
    });
    await enviar('Page.navigate', { url }, sessionId);
    await carregou;
    await pausa(espera);

    const { data } = await enviar('Page.captureScreenshot', { format: 'webp', quality: 82 }, sessionId);
    writeFileSync(join(saida, nome), Buffer.from(data, 'base64'));
    console.log(`${projeto}/${relativo}/${nome}  ${Math.round(statSync(join(saida, nome)).size / 1024)} KB  ← ${url}`);
  }
} finally {
  await enviar('Browser.close').catch(() => {});
  ws.close();
  await pausa(500);
  try {
    rmSync(perfil, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    // No Windows o navegador às vezes ainda segura o perfil temporário; o sistema limpa depois.
  }
}
