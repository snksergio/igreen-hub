// In the page: for the open screen, lists vertical gaps between consecutive visible blocks
// that separate different groups (section title, card, chart, badge, button) and are tighter than the rhythm asks.
window.respiro = () => {
  const cam = [...document.querySelectorAll('.camada')].pop();
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height > 0 && r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.position !== 'absolute' && cs.position !== 'fixed'; };
  const papel = el => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (el.querySelector('svg') && r.height >= 80 && r.width >= 200 && !el.querySelector('h2')) return 'grafico';
    if (/^H[1-3]$/.test(el.tagName) || (el.children.length <= 2 && parseFloat(cs.fontSize) >= 18 && r.height <= 40)) return 'titulo';
    if (el.querySelector('h2') && r.height <= 48) return 'titulo';
    if (parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderRadius) >= 12 && r.height >= 56) return 'card';
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(cs.borderRadius) >= 12 && r.height >= 56) return 'card';
    if (el.tagName === 'BUTTON' && r.height >= 40) return 'botao';
    if (parseFloat(cs.borderRadius) >= 8 && r.height <= 36 && r.width < 300) return 'selo';
    return 'texto';
  };
  const minimo = (a, b) => {
    if (b === 'titulo') return 24;
    if (a === 'titulo') return 12;
    if (a === 'grafico' || b === 'grafico') return 20;
    if (a === 'card' && b === 'card') return 8;
    if (a === 'card' || b === 'card') return 16;
    if (a === 'selo' || b === 'selo') return 8;
    if (a === 'botao' || b === 'botao') return 16;
    return 0;
  };
  const achados = [];
  cam.querySelectorAll('*').forEach(pai => {
    const filhos = [...pai.children].filter(vis);
    for (let i = 1; i < filhos.length; i++) {
      const a = filhos[i - 1], b = filhos[i];
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      if (rb.top < ra.bottom - 2 || Math.abs(rb.left - ra.left) > 120 && rb.top < ra.bottom + 2) continue; // side by side
      const gap = Math.round(rb.top - ra.bottom);
      const pa = papel(a), pb = papel(b), m = minimo(pa, pb);
      if (m && gap < m) achados.push(`${pa}→${pb} ${gap}px (mín ${m}) · "${(a.innerText || '').trim().split('\n')[0].slice(0, 26)}" → "${(b.innerText || '').trim().split('\n')[0].slice(0, 26)}"`);
    }
  });
  return [...new Set(achados)];
};
