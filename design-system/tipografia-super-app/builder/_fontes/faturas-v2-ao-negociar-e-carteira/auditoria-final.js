// In the page: every flow and step; reports type off the scale, clipped text, horizontal spill, sheets taller than the
// screen, success screens that scroll, text contrast below WCAG AA (against the first solid background behind it)
// and touch targets under 44px (counting the invisible ::after extension).
window.__FINAL = null;
(async () => {
  const ESC = { 11: 16, 12: 16, 13: 18, 14: 20, 15: 20, 16: 22, 18: 24, 20: 24, 22: 28, 28: 34, 34: 40, 40: 48 };
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
  const lum = ([r, g, b]) => [r, g, b].map(v => v / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const razao = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const fundo = el => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; // gradient or picture: not measured
      const c = rgb(cs.backgroundColor);
      if (c.length >= 3 && (c[3] === undefined || c[3] > 0.95)) return c.slice(0, 3);
      if (c.length === 4 && c[3] > 0.05) return null; // translucent: not measured
    }
    return [255, 255, 255];
  };
  const fluxos = [...document.querySelectorAll('#fluxos .fluxo')];
  const out = { fora: new Set(), cortes: new Set(), largos: new Set(), sheets: new Set(), rolam: new Set(), contraste: new Set(), toque: new Set() };
  let telas = 0;
  for (let f = 0; f < fluxos.length; f++) {
    fluxos[f].click(); await espera(450);
    const passos = [...document.querySelectorAll('.passo')];
    for (let p = 0; p < passos.length; p++) {
      passos[p].click(); await espera(650); telas++;
      const onde = `${f + 1}.${p + 1}`, T = document.querySelector('.tela').getBoundingClientRect();
      const cam = [...document.querySelectorAll('.camada')].pop();
      document.querySelectorAll('.tela [role=dialog]').forEach(d => { if (d.getBoundingClientRect().top < T.top + 40) out.sheets.add(`${onde} ${d.getAttribute('aria-label')}`); });
      const rol = cam.querySelector('.rolagem'), h1 = cam.querySelector('h1');
      if (rol && h1 && /Pagamento confirmado|Fatura paga|Pagamento feito/.test(h1.textContent) && rol.scrollHeight > rol.clientHeight + 2) out.rolam.add(`${onde} ${rol.scrollHeight}>${rol.clientHeight}`);
      cam.querySelectorAll('*').forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.5) return;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || r.bottom < T.top || r.top > T.bottom) return;
        const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
        if (txt) {
          const fs = parseFloat(cs.fontSize), peso = +cs.fontWeight;
          if (!(fs in ESC)) out.fora.add(`${fs}px @${onde}`);
          if (el.clientWidth && el.scrollWidth > el.clientWidth + 1 && (cs.overflow.includes('hidden') || cs.textOverflow === 'ellipsis') && !/br\.gov\.bcb/.test(txt)) out.cortes.add(`${onde} "${txt.slice(0, 30)}"`);
          if (r.right > T.right + 1 && cs.position !== 'absolute' && !el.closest('[style*="overflow-x: auto"]')) out.largos.add(`${onde} "${txt.slice(0, 30)}"`);
          const bg = fundo(el), cor = rgb(cs.color);
          if (bg && cor.length >= 3 && (cor[3] === undefined || cor[3] > 0.95) && !el.closest('[aria-disabled="true"], [disabled]')) {
            const grande = fs >= 24 || (fs >= 18.66 && peso >= 700);
            const cr = razao(cor.slice(0, 3), bg);
            if (cr < (grande ? 3 : 4.5)) out.contraste.add(`${cr.toFixed(2)} ${cs.color} em rgb(${bg}) ${fs}px/${peso} "${txt.slice(0, 26)}" @${onde}`);
          }
        }
        if (el.matches('button, a, [role=tab], [role=radio], [role=switch]') && !el.closest('[aria-hidden="true"]')) {
          const pa = getComputedStyle(el, '::after');
          const ext = pa.content !== 'none' && pa.position === 'absolute' ? Math.max(0, -parseFloat(pa.top) || 0) + Math.max(0, -parseFloat(pa.bottom) || 0) : 0;
          const s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--s')) || 1, k = document.body.classList.contains('real') ? 1 : s;
          const h = r.height / k + ext, w = r.width / k;
          if (Math.min(h, w) < 44 && !el.closest('nav')) out.toque.add(`${Math.round(w)}x${Math.round(h)} "${(el.getAttribute('aria-label') || el.innerText || '').trim().split('\n')[0].slice(0, 26)}" @${onde}`);
        }
      });
    }
  }
  window.__FINAL = { telas, ...Object.fromEntries(Object.entries(out).map(([k, v]) => [k, [...v]])) };
})();
