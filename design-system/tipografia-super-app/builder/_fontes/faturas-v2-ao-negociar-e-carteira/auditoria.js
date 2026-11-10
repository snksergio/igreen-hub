// Runs in the page: walks every flow and step, and reports type values off the scale,
// size/line-height pairs off the token, and text that got clipped.
// window.__ESCALA = { "11": 16, "12": 16, ... } (size -> line-height) must be set first; empty = only collect.
(async () => {
  const esc = window.__ESCALA || {};
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const fluxos = [...document.querySelectorAll('#fluxos .fluxo')];
  const tam = {}, pares = {}, pesos = {}, foraEscala = new Set(), lhErrado = new Set(), cortes = new Set();
  for (let f = 0; f < fluxos.length; f++) {
    fluxos[f].click(); await espera(450);
    const passos = [...document.querySelectorAll('.passo')];
    for (let p = 0; p < passos.length; p++) {
      passos[p].click(); await espera(450);
      const onde = `${f + 1}.${p + 1}`;
      document.querySelectorAll('.tela .camada *').forEach(el => {
        const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        if (txt) {
          const fsz = parseFloat(cs.fontSize), lh = cs.lineHeight === 'normal' ? 'normal' : parseFloat(cs.lineHeight);
          tam[fsz] = (tam[fsz] || 0) + 1;
          pares[`${fsz}/${lh}`] = (pares[`${fsz}/${lh}`] || 0) + 1;
          pesos[cs.fontWeight] = (pesos[cs.fontWeight] || 0) + 1;
          if (Object.keys(esc).length) {
            if (!(String(fsz) in esc)) foraEscala.add(`${fsz}px @${onde} "${txt.slice(0, 30)}"`);
            else if (lh !== 'normal' && esc[fsz] !== lh && lh < fsz * 1.9) lhErrado.add(`${fsz}/${lh} (token ${esc[fsz]}) @${onde} "${txt.slice(0, 30)}"`);
          }
        }
        // clipped text: ellipsis/overflow hidden with content wider than the box, or text taller than a fixed box
        if (txt && el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1 && (cs.overflow.includes('hidden') || cs.textOverflow === 'ellipsis')) cortes.add(`largura @${onde} "${txt.slice(0, 40)}" ${el.scrollWidth}>${el.clientWidth}`);
        if (txt && el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 2 && cs.overflow.includes('hidden') && el.children.length === 0) cortes.add(`altura @${onde} "${txt.slice(0, 40)}" ${el.scrollHeight}>${el.clientHeight}`);
      });
    }
  }
  window.__AUDIT = { tam, pares, pesos, foraEscala: [...foraEscala], lhErrado: [...lhErrado], cortes: [...cortes] };
  return 'ok';
})();
