// Hand-made changes on top of transform.js: real-size phone mode, the type tokens as CSS variables,
// and the few styles built from JS expressions that a text pass can't reach.
// node patch.js <file.html>
const fs = require('fs');
const ARQ = process.argv[2];
let s = fs.readFileSync(ARQ, 'utf8');
// TOLERANTE=1 (another prototype built on the same base): a piece that is not in the file is skipped and listed
const TOLERANTE = !!process.env.TOLERANTE, pulados = [];
const troca = (de, para, n = 1) => {
  const partes = s.split(de);
  if (TOLERANTE && partes.length === 1) { pulados.push(de.slice(0, 70).replace(/\n/g, '⏎')); return; }
  if (partes.length - 1 !== n) throw new Error(`esperava ${n}x, achei ${partes.length - 1}x: ${de.slice(0, 80)}`);
  s = partes.join(para);
};

// ---------- the scale this file follows, for whoever implements it ----------
const fimTitulo = s.indexOf('</title>\n') + 9;
s = s.slice(0, fimTitulo) + `<!--
  Escala tipográfica do app iGreen (v2, 26/10/2026) · Manrope · px = pt (iOS) = dp (Android)
  tamanho/entrelinha · peso
  caption-caps 11/16 · 600, maiúsculas, +0.06em (só overline e eixo de gráfico)
  caption      12/16 · 500–600 (badge, status, legenda)
  footnote     13/18 · 400–500 (subtítulo de linha, meta, descrição curta)
  body         14/20 · 400–600 (texto corrido, chips, abas)
  subhead      15/20 · 600     (título de linha de lista e de card, botões)
  callout      16/22 · 600–700 (valor em linha, título de grupo)
  title-sm     18/24 · 700     (título de tela no cabeçalho)
  title-md     20/24 · 700     (título de seção, valor de destaque, título de sheet)
  title-lg     22/28 · 700     (confirmação, nome de plano, resumo)
  stat-sm      28/34 · 700 · -0.02em
  stat-md      34/40 · 700 · -0.02em
  stat-lg      40/48 · 700 · -0.02em (um por tela)
  Pesos: 500 texto, 600 ênfase, 700 título. A Manrope tem traço um degrau mais fino que SF/Inter/Roboto
  (400 = 0,073em contra 0,087 da Inter), então o "regular" de mercado nela é 500.
  Espaçamento: 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48. Título de seção a 16 do conteúdo, seções a 32.
-->
` + s.slice(fimTitulo);

// ---------- phone mode: on a phone the app runs at 1:1, full screen, without the frame ----------
troca('body.limpo .lateral, body.limpo .simular { visibility: hidden; }\n', `body.limpo .lateral, body.limpo .simular { visibility: hidden; }

/* ---------- on a phone: the app at its real size (1 CSS px = 1 pt), full screen, no frame ---------- */
body.real .palco { display: flex; flex-direction: column; align-items: stretch; gap: 24px; padding: 0 0 32px; }
body.real .centro { order: 1; gap: 16px; }
body.real .lateral { order: 2; width: auto; max-width: none; margin: 0 16px; scroll-margin-top: 56px; }
body.real .lateral.esq { order: 3; }
body.real .moldura { width: 100vw; height: 100vh; height: 100dvh; }
body.real .celular { width: 100%; height: 100%; padding: 0; border-radius: 0; background: none; box-shadow: none; transform: none; }
body.real .botao, body.real #status, body.real #ilha, body.real #indicador { display: none; }
body.real .tela { width: 100%; height: 100%; border-radius: 0; }
/* small controls keep their look and get a 44px tall touch area (chips, segmented tabs, 32-40px buttons) */
.tela [role=tab], .tela [aria-pressed], .tela :is(button, a)[style*="height: 32px"], .tela :is(button, a)[style*="height: 36px"], .tela :is(button, a)[style*="height: 40px"] { position: relative; }
.tela [role=tab]::after, .tela [aria-pressed]::after, .tela :is(button, a)[style*="height: 36px"]::after { content: ''; position: absolute; left: 0; right: 0; top: -4px; bottom: -4px; }
.tela :is(button, a)[style*="height: 40px"]::after { content: ''; position: absolute; left: 0; right: 0; top: -2px; bottom: -2px; }
.tela :is(button, a)[style*="height: 38px"] { position: relative; }
.tela :is(button, a)[style*="height: 38px"]::after { content: ''; position: absolute; left: 0; right: 0; top: -3px; bottom: -3px; }
.tela :is(button, a)[style*="height: 32px"]::after { content: ''; position: absolute; left: 0; right: 0; top: -6px; bottom: -6px; }
/* the statement search is a real field */
.tela input { -webkit-user-select: text; user-select: text; }
.tela input::placeholder { color: #6A726D; opacity: 1; }
.tela input[type=search]::-webkit-search-cancel-button { -webkit-appearance: none; }
/* some packed screens (invoice detail, receipts) keep a 390px root; on a 360px phone they follow the screen instead of spilling */
body.real .tela div[style^="width: 390px; height:"] { width: 100% !important; }
#irFluxos { display: none; position: fixed; z-index: 40; top: calc(env(safe-area-inset-top, 0px) + 10px); left: 50%; transform: translateX(-50%); height: 32px; padding: 0 12px 0 10px; border-radius: 16px; border: 0; background: rgba(17,21,19,0.8); color: #FFFFFF; font: 600 13px/18px 'Manrope', sans-serif; align-items: center; gap: 6px; -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
body.real #irFluxos { display: inline-flex; }
`);
troca('<body>\n<main class="palco">\n', `<body>
<main class="palco">
<button id="irFluxos" type="button" aria-label="Ver a lista de fluxos"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"></path></svg><span>Fluxos</span></button>
`);
troca(`  const ajustar = () => {
    const largo = innerWidth > 980;`, `  // a phone shows the app full screen at 1:1; the floating button jumps between the app and the flows
  const real = matchMedia('(max-width: 600px)');
  const irFluxos = $('#irFluxos');
  const noApp = () => $('#moldura').getBoundingClientRect().bottom > innerHeight / 2;
  const rotular = () => { const a = noApp(); irFluxos.lastChild.textContent = a ? 'Fluxos' : 'Voltar ao app'; irFluxos.setAttribute('aria-label', a ? 'Ver a lista de fluxos' : 'Voltar ao app'); };
  irFluxos.addEventListener('click', () => (noApp() ? $('#fluxos').closest('.lateral') : $('#moldura')).scrollIntoView({ behavior: 'smooth', block: 'start' }));
  addEventListener('scroll', rotular, { passive: true });
  const ajustar = () => {
    document.body.classList.toggle('real', real.matches);
    const largo = innerWidth > 980;`);

// ---------- styles built from JS expressions: sizes and line-heights onto the tokens ----------
// big money values: three stat sizes (28, 34, 40), each with its R$, cents and line-height
troca(`  const [i, d] = brl(v).replace('R$ ', '').split(',');
  return \``, `  const [i, d] = brl(v).replace('R$ ', '').split(',');
  const [rs, cs, lh] = t >= 38 ? [18, 20, 48] : t >= 31 ? [16, 18, 40] : [13, 14, 34];
  t = t >= 38 ? 40 : t >= 31 ? 34 : 28;
  return \``);
troca('font-size: ${Math.round(t * 0.46)}px', 'font-size: ${rs}px');
troca('font-size: ${t}px; line-height: ${t + 6}px', 'font-size: ${t}px; line-height: ${lh}px');
troca('font-size: ${Math.round(t * 0.5)}px', 'font-size: ${cs}px');
troca('const cents = (inteiro, dec, t = 50)', 'const cents = (inteiro, dec, t = 40)');
troca('font-size: ${Math.round(t * 0.44)}px', 'font-size: ${t >= 38 ? 18 : t >= 31 ? 16 : 13}px');
troca('font-size: ${t}px; line-height: ${t + 8}px', 'font-size: ${t >= 38 ? 40 : t >= 31 ? 34 : 28}px; line-height: ${t >= 38 ? 48 : t >= 31 ? 40 : 34}px');
troca('font-size: ${Math.round(t * 0.48)}px', 'font-size: ${t >= 38 ? 20 : t >= 31 ? 18 : 14}px');
troca('rotuloValor, tam = 58 })', 'rotuloValor, tam = 40 })');
// line-heights that sat next to a size written as an expression
troca('font-size: ${forte ? 15 : 14}px; line-height: 19px', 'font-size: ${forte ? 15 : 14}px; line-height: 20px');
troca('const valorCbP = (cb, fs = 14) => `<span style="font-size: ${fs}px; line-height: 19px;', 'const valorCbP = (cb, fs = 14) => `<span style="font-size: ${fs}px; line-height: ${fs < 14 ? 18 : 20}px;');
troca('valorCbP(cb, 13.5)', 'valorCbP(cb, 14)');
troca('font-size: ${k ? 13 : 14}px; line-height: ${k ? 17 : 19}px', 'font-size: ${k ? 13 : 14}px; line-height: ${k ? 18 : 20}px');
troca('font-size: ${larga ? 12 : 11}px; line-height: 14px', 'font-size: ${larga ? 12 : 11}px; line-height: 16px');
// ---------- weight: Manrope's stroke is one step thinner than SF, Inter or Roboto, so the app's text starts at 500 ----------
troca('.tela a { -webkit-user-drag: none; }', `.tela { font-weight: 500; }
.tela button, .tela input { font-weight: inherit; }
.tela a { -webkit-user-drag: none; }`);
// ---------- breathing room: section title 16px over its content, sections 32px apart (Mercado Pago's rhythm) ----------
troca('const secao = (titulo, dir, c, gap = 10)', 'const secao = (titulo, dir, c, gap = 16)');
troca("{ link = '', gap = 8 }", "{ link = '', gap = 16 }");
troca("secao('Para você', '', oferta, 8)", "secao('Para você', '', oferta, 16)");
troca("secao('Central de ajuda', '', ajuda, 8)", "secao('Central de ajuda', '', ajuda, 16)");
troca("const tituloSec = (t, direita = '', mt = 28) => `<div style=\"margin: ${mt}px 16px 10px;", "const tituloSec = (t, direita = '', mt = 32) => `<div style=\"margin: ${mt}px 16px 16px;");
// when the title and its right-hand note don't fit on one line, the note drops under the title (as Mercado Pago does), the title never wraps
troca('min-height: 28px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-left: 4px">\n<h2', 'min-height: 28px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 12px; padding-left: 4px">\n<h2');
// energy hero: value, discount badge, chart and legend each get their own band
troca('data-leitura="c" style="align-self: flex-start; margin-top: 6px;', 'data-leitura="c" style="align-self: flex-start; margin-top: 10px;');
troca('aria-label="Valor das faturas por mês" style="position: relative; margin-top: 16px', 'aria-label="Valor das faturas por mês" style="position: relative; margin-top: 24px');
troca('aria-label="Consumo por mês" style="position: relative; margin-top: 16px', 'aria-label="Consumo por mês" style="position: relative; margin-top: 24px');
troca('const legenda = valor ? `<div style="margin-top: 10px', 'const legenda = valor ? `<div style="margin-top: 12px');
// ---------- sheets: the header rule transform.js applies to the packed sheets, here for the two builders in the page ----------
{
  const re = /<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-left: 4px">\n<span style="min-width: 0; display: flex; flex-direction: column; gap: 2px"><h2 style="/g;
  const n = (s.match(re) || []).length;
  if (n < 2 && !TOLERANTE) throw new Error(`cabeçalho de sheet: esperava 2+, achei ${n}`);
  // pinned while the sheet scrolls; top-aligned with the close button whatever the number of lines
  s = s.replace(re, '<div style="position: sticky; top: 0; z-index: 3; margin: 0 -16px; padding: 8px 16px 8px 20px; background: #FFFFFF; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px">\n<span style="min-width: 0; display: flex; flex-direction: column; gap: 4px; padding-top: 10px"><h2 style="text-wrap: balance; ');
}
// ---------- sheets: room around the illustration, the rows and the button ----------
troca("const iluMonte = (tok, s = 78) => `<div style=\"margin-top: 2px;", "const iluMonte = (tok, s = 78) => `<div style=\"margin-top: 16px;");
troca('const entendi = `<div style="margin-top: 16px">', 'const entendi = `<div style="margin-top: 24px">');
troca("const cartaoIdeias = itens => `<div style=\"margin: 12px 4px 0; border-radius: 20px; background: #F4F6F5; border: 1px solid #E7EBE8; padding: 2px 16px\">", "const cartaoIdeias = itens => `<div style=\"margin: 16px 4px 0; border-radius: 20px; background: #F4F6F5; border: 1px solid #E7EBE8; padding: 4px 16px\">");
troca("min-height: 54px; box-sizing: border-box; padding: 8px 0; display: flex; align-items: center; gap: 12px\">${circulo(svg(ic, 17, 2.1)", "min-height: 56px; box-sizing: border-box; padding: 12px 0; display: flex; align-items: center; gap: 12px\">${circulo(svg(ic, 17, 2.1)");
// rules of the cashback: each rule gets its own band
troca("iluMonte('__ILU_CASINHA__', 72)}<div style=\"margin-top: 4px; padding: 0 4px\">", "iluMonte('__ILU_CASINHA__', 72)}<div style=\"margin-top: 12px; padding: 0 4px\">");
troca("padding: 10px 0; display: flex; align-items: center; gap: 12px\">${bola(ic, { s: 40 })}", "padding: 14px 0; display: flex; align-items: center; gap: 16px\">${bola(ic, { s: 40 })}");
// how we count your gains: the sentence becomes the sheet's subtitle, each part shows its name over its value
// (no more "Cashback que já / caiu" squeezed beside the number on a 360px phone), the total keeps label and value side by side
troca("U.sheet('Como calculamos seus ganhos', `${rotuloSheet('Somamos o desconto das contas já pagas e o cashback que já caiu', 10)}<div style=\"margin: 6px 4px 0; border-radius: 20px; background: #F4F6F5; border: 1px solid #E7EBE8; padding: 2px 16px\">", "U.sheet('Como calculamos seus ganhos', `<div style=\"margin: 16px 4px 0; border-radius: 20px; background: #F4F6F5; border: 1px solid #E7EBE8; padding: 4px 16px\">");
troca("</div>${entendi}`),\n  AjudaRegras:", "</div>${entendi}`, 'Somamos o desconto das contas já pagas e o cashback que já caiu'),\n  AjudaRegras:");
troca("const parcela = (ic, t, v, i) => `<div style=\"${i ? 'border-top: 1px solid #E7EBE8; ' : ''}min-height: 54px; padding: 8px 0; display: flex; align-items: center; gap: 12px\">${circulo(svg(ic, 18, 2), { bg: '#FFFFFF', cor: '#3E4541', s: 40 })}<span style=\"flex-grow: 1; min-width: 0; font-size: 14px; line-height: 20px; color: #3E4541\">${t}</span><span style=\"flex-shrink: 0; font-size: 15px; line-height: 20px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap\">${v}</span></div>`;",
  "const parcela = (ic, t, v, i) => `<div style=\"${i ? 'border-top: 1px solid #E7EBE8; ' : ''}padding: 12px 0; display: flex; align-items: center; gap: 12px\">${circulo(svg(ic, 18, 2), { bg: '#FFFFFF', cor: '#3E4541', s: 40 })}<span style=\"min-width: 0; display: flex; flex-direction: column; gap: 2px\"><span style=\"font-size: 13px; line-height: 18px; color: #545C57\">${t}</span><span style=\"font-size: 16px; line-height: 22px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap\">${v}</span></span></div>`;");
troca('<div style="border-top: 1px dashed #CFD6D1; padding: 12px 0 12px;', '<div style="border-top: 1px dashed #CFD6D1; padding: 16px 0;');
troca("<div style=\"margin: 12px 4px 0; border-radius: 20px; background: #F4F6F5; border: 1px solid #E7EBE8; padding: 2px 16px\">${[[P.check, 'O cashback usado", "<div style=\"margin: 16px 4px 0; border-radius: 20px; background: #F4F6F5; border: 1px solid #E7EBE8; padding: 4px 16px\">${[[P.check, 'O cashback usado");
troca("padding: 8px 0; display: flex; align-items: center; gap: 10px; font-size: 13px; line-height: 18px; color: #3E4541\"", "padding: 12px 0; display: flex; align-items: center; gap: 12px; font-size: 13px; line-height: 18px; color: #3E4541\"");
// ---------- invoice lists: the whole row is the tap target, no chevron; the badge's coin gets room from the edge ----------
troca("const SETA_LISTA = `<span style=\"align-self: center; display: flex\">${svg(P.direita, 18, 2.2).replace('stroke=\"currentColor\"', 'stroke=\"#8A928D\"')}</span>`;", "const SETA_LISTA = '';");
troca("  const seta = `<span style=\"align-self: center; display: flex\">${svg(P.direita, 18, 2.2).replace('stroke=\"currentColor\"', 'stroke=\"#8A928D\"')}</span>`;", "  const seta = '';");
troca('gap: 6px; padding: 4px 10px 4px 4px; border-radius: 12px; background: #EEF6F0', 'gap: 8px; padding: 4px 12px 4px 8px; border-radius: 12px; background: #EEF6F0', 2);
troca('padding: 4px 12px 4px 6px; border-radius: 12px; background: #EEF6F0', 'padding: 4px 12px 4px 8px; border-radius: 12px; background: #EEF6F0');
// page chrome: the simulate buttons use the font shorthand
troca("font: 700 13.5px 'Manrope', sans-serif", "font: 600 14px/20px 'Manrope', sans-serif");

// ---------- motion on the success screens: the check pops in, then the title, the amount and the cards rise one by one ----------
{
  const fim = s.lastIndexOf('</body>');
  s = s.slice(0, fim) + `<script>
// success screens (payment confirmed, invoice paid, rescue done): a short entrance, skipped when the phone asks for less motion
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const SAI = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const SUCESSO = /^(Pagamento confirmado|Pagamento feito|Fatura paga|Resgate feito)/;
  const subir = (el, atraso, d = 12) => el.animate([{ transform: 'translateY(' + d + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 460, delay: atraso, easing: SAI, fill: 'backwards' });
  const animar = cam => {
    const h1 = [...cam.querySelectorAll('h1')].find(h => SUCESSO.test(h.textContent.trim()));
    if (!h1) return;
    const bloco = h1.parentElement, check = bloco.firstElementChild;
    check.animate([{ transform: 'scale(0.5)', opacity: 0 }, { transform: 'scale(1.06)', opacity: 1, offset: 0.62 }, { transform: 'scale(1)' }], { duration: 620, easing: SAI, fill: 'backwards' });
    [...bloco.children].slice(1).forEach((el, i) => subir(el, 200 + i * 70));
    let el = bloco.nextElementSibling, k = 0;
    while (el && k < 4) { if (!el.hasAttribute('data-fixo') && el.getBoundingClientRect().height) { subir(el, 340 + k * 90, 18); k++; } el = el.nextElementSibling; }
    const pe = cam.querySelector('[data-fixo]');
    if (pe) subir(pe, 520, 24);
  };
  const camadas = document.getElementById('camadas');
  if (camadas) new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 && n.classList.contains('camada')) requestAnimationFrame(() => animar(n)); }))).observe(camadas, { childList: true });
})();
// bottom bar: every tab shows its name under the icon; the current one gets the green pill behind the icon.
// Runs before paint on every new screen, so the bars drawn ahead of time follow too (the links keep their actions)
(() => {
  const VERDE = '#276638';
  const redesenhar = nav => {
    if (nav.dataset.rotulos) return;
    nav.dataset.rotulos = '1';
    const abas = [...nav.querySelectorAll('a')];
    nav.style.gridTemplateColumns = 'repeat(' + abas.length + ', minmax(0, 1fr))';
    nav.style.padding = '0 4px';
    abas.forEach(a => {
      const atual = a.hasAttribute('aria-current'), nome = a.getAttribute('aria-label') || a.textContent.trim(), icone = a.querySelector('svg');
      if (icone) { icone.setAttribute('width', '20'); icone.setAttribute('height', '20'); }
      a.style.cssText = 'height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; text-decoration: none; font-size: 12px; line-height: 16px; font-weight: ' + (atual ? 700 : 600) + '; color: ' + (atual ? VERDE : '#545C57');
      const pilula = document.createElement('span');
      pilula.style.cssText = 'width: 56px; height: 32px; border-radius: 16px; display: flex; align-items: center; justify-content: center' + (atual ? '; background: #E5F1E8' : '');
      if (icone) pilula.appendChild(icone);
      const rotulo = document.createElement('span');
      rotulo.textContent = nome;
      a.replaceChildren(pilula, rotulo);
      if (!a.hasAttribute('aria-label')) a.setAttribute('aria-label', nome);
    });
  };
  const varrer = raiz => raiz.querySelectorAll && raiz.querySelectorAll('nav[aria-label="Navegação principal"]').forEach(redesenhar);
  const alvo = document.getElementById('camadas');
  if (alvo) { varrer(alvo); new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && varrer(n)))).observe(alvo, { childList: true, subtree: true }); }
})();
</script>
` + s.slice(fim);
}

fs.writeFileSync(ARQ, s);
console.log('patch ok' + (pulados.length ? `, ${pulados.length} pulados:\n  ` + pulados.join('\n  ') : ''));
