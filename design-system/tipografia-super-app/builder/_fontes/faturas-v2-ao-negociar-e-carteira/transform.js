// Rewrites the prototype's type, weight and spacing values onto the new scale.
// node transform.js <in.html> <out.html> <config.json>
// Works on the plain HTML/JS and on the gzipped DADOS_GZ blob (boards + ready screens).
const fs = require('fs'), zlib = require('zlib');
const [, , ENTRADA, SAIDA, CONFIG] = process.argv;
const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));

const num = s => +parseFloat(s).toFixed(2);
const tamanho = v => cfg.fontSize[String(num(v))] ?? num(v);
const peso = v => cfg.fontWeight[String(v)] ?? +v;
const espaco = (v, prop) => {
  const n = num(v), neg = n < 0, a = Math.abs(n);
  const m = (prop.endsWith('gap') ? cfg.gap : cfg.spacing)[String(a)];
  return m === undefined ? n : (neg ? -m : m);
};
const lhDe = s => cfg.lineHeight[String(s)];
const lsDe = (s, atual) => {
  if (atual !== undefined && /^0\.0[4-9]em|^0\.1/.test(atual)) return cfg.trackingCaps; // uppercase overlines keep positive tracking
  for (const [min, v] of cfg.tracking) if (s >= min) return v;
  return null;
};

const stats = { size: 0, lh: 0, lhAdded: 0, weight: 0, space: 0, ls: 0 };

// one declaration list (a style attribute, a CSS rule body, or a run between quotes)
function declaracoes(seg) {
  const fsM = seg.match(/font-size:\s*([0-9.]+)px/);
  let novoTam = null;
  if (fsM) novoTam = tamanho(fsM[1]);
  let out = seg.replace(/font-size:\s*([0-9.]+)px/g, (_, v) => { const t = tamanho(v); if (t !== num(v)) stats.size++; return `font-size: ${t}px`; });
  if (novoTam !== null && lhDe(novoTam)) {
    let achou = false;
    out = out.replace(/line-height:\s*([0-9.]+)px/g, (_, v) => { achou = true; const lh = lhDe(novoTam); if (lh !== num(v)) stats.lh++; return `line-height: ${lh}px`; });
    // unitless line-heights (1.05, 1.2, 1.35) become the token too; a bare 1 is kept (icon glyphs)
    out = out.replace(/line-height:\s*(1\.\d+)(?![\dpx%])/g, () => { achou = true; stats.lh++; return `line-height: ${lhDe(novoTam)}px`; });
    out = out.replace(/letter-spacing:\s*(-?[0-9.]+em)/g, (_, v) => { const ls = lsDe(novoTam, v); if (ls === null || ls === v) return `letter-spacing: ${v}`; stats.ls++; return `letter-spacing: ${ls}`; });
    // no line-height next to the size: write the token's, right after the size, so the text style is complete
    if (!achou && !/line-height:/.test(out)) { out = out.replace(/font-size: ([0-9.]+)px/, (m, v) => `${m}; line-height: ${lhDe(+v)}px`); stats.lhAdded++; }
  }
  // Manrope's tabular "1" is 0.62em wide against 0.44em proportional: big standalone numbers read gappy ("1 3 5").
  // From 18px up the digits are proportional; small values stacked in a column keep tabular to line up
  if (novoTam !== null && novoTam >= 18) out = out.replace(/font-variant-numeric: tabular-nums/g, () => { stats.ls++; return 'font-variant-numeric: proportional-nums'; });
  // small text in #8A928D (3.2:1) moves to #6A726D (4.95:1); big bold cents keep it (large text asks 3:1)
  if (novoTam !== null && novoTam < 18) out = out.replace(/(?<!-)color: #8A928D/g, () => { stats.ls++; return 'color: #6A726D'; });
  // small green text: #338449 gave 4.0-4.2:1 on the grey and light-green backgrounds; #276638 gives 5.9:1+
  if (novoTam !== null && novoTam < 18) out = out.replace(/(?<!-)color: #338449/g, () => { stats.ls++; return 'color: #276638'; });
  // small orange text takes the text tone of the overdue amber
  if (novoTam !== null && novoTam < 18) out = out.replace(/(?<!-)color: #B45309/g, () => { stats.ls++; return 'color: #A84E08'; });
  // big muted cents: #646C67 (they read as large text, but 2.8:1 on the grey page was below even that)
  if (novoTam !== null && novoTam >= 18) out = out.replace(/(?<!-)color: #8A928D/g, () => { stats.ls++; return 'color: #646C67'; });
  out = out.replace(/font-weight:\s*(\d{3})\b/g, (_, v) => { const p = peso(v); if (p !== +v) stats.weight++; return `font-weight: ${p}`; });
  out = out.replace(/\b(padding|padding-top|padding-bottom|padding-left|padding-right|margin|margin-top|margin-bottom|margin-left|margin-right|gap|row-gap|column-gap):\s*([^;"`\\<>{}]+)/g, (all, prop, vals) => {
    const novo = vals.replace(/(-?[0-9.]+)px/g, (_, v) => { const e = espaco(v, prop); if (e !== num(v)) stats.space++; return `${e}px`; });
    return `${prop}: ${novo}`;
  });
  return out;
}

// split text into declaration runs: boundaries are quotes, backticks and tag brackets;
// CSS rule bodies in <style> are handled by the same split because they sit between { and }
function transformar(txt) {
  // the overdue orange: #F46600 gave 3.1:1. Two tones of one amber hue (26°): #B45309 for surfaces under white text,
  // icons and large text (5.0:1), #A84E08 for small text, the only one that clears 4.5:1 on white, the grey page and the
  // peach chip too. Every orange the code passes as a value ('#F46600', the original's text orange #B84D00) is text.
  // (a file can keep its own orange: config "manterLaranja")
  if (!cfg.manterLaranja) {
    txt = txt.split("'#F46600'").join("'#A84E08'").split('#B84D00').join('#A84E08').split('#F46600').join('#B45309');
    // the overdue band and its glow move to the same amber family
    txt = txt.split('#F7843A').join('#E8862E').split('#FBC9A6').join('#FBCB9A').split('rgba(244,102,0,').join('rgba(217,119,6,');
  }
  // chevrons and dots go from #9AA39E (2.6:1) to #8A928D (3.2:1, above the 3:1 asked of icons)
  txt = txt.split('#9AA39E').join('#8A928D');
  // measured on the screens: the light cashback green (#5A7A63, 4.2:1) goes to #4D6E57 (4.9:1+ on every background),
  // the empty-month labels (#A9B1AC, 2.2:1) to #6A726D, and the muted cents of big amounts (#8A928D, 2.8:1 on the grey
  // page) to #646C67 (4.7:1)
  txt = txt.split('#5A7A63').join('#4D6E57').split('#A9B1AC').join('#6A726D');
  txt = txt.split("dec = '#8A928D'").join("dec = '#646C67'").split('color: #8A928D">${dec}').join('color: #646C67">${dec}');
  // small green amounts whose colour comes from a container or an expression (the badge value, the list headers' total)
  txt = txt.split('color: #338449; white-space: nowrap">+${brl(cb)}').join('color: #276638; white-space: nowrap">+${brl(cb)}');
  txt = txt.split("modelo.startsWith('moeda') ? '#338449' : VERDE_TXT").join('VERDE_TXT');
  txt = txt.split("color: ${agu ? '#9A4A00' : '#338449'}\">+${brl(v)}").join("color: ${agu ? '#9A4A00' : '#276638'}\">+${brl(v)}");
  txt = txt.replace(/(gap: [45]px; color: )#338449(">\$\{moeda\(true, 20, CASINHA\)\})/g, '$1#276638$2');
  // receipts (built in the page and packed ahead): the check rises into the header only halfway (its top at the middle
  // of the 48px header row, not at its top), the amount is stat-md 34 and the ticket sits 40 under it
  txt = txt.replace(/(<div style=\\?")margin-top: 6px(; padding: 0 24px; display: flex; flex-direction: column; align-items: center; text-align: center\\?">)/g, (_, a, b) => { stats.space++; return `${a}position: relative; margin-top: -24px${b}`; });
  txt = txt.split('position: relative; margin: 46px 16px 0').join('position: relative; margin: 40px 16px 0');
  // "Fatura paga" sits 12 under the check (gives back part of the height the check took by coming down)
  txt = txt.replace(/(<h1 style=\\?")margin: 16px 0 0(; font-size: 15px; line-height: 20px; font-weight: 800; color: )/g, (_, a, b) => { stats.space++; return `${a}margin: 12px 0 0${b}`; });
  // the band stays solid #B45309 where the white "Vencida" sits, then glows out in lighter amber
  txt = txt.split('linear-gradient(180deg, #B45309 0%, #E8862E 55%, #FBCB9A 100%)').join('linear-gradient(180deg, #B45309 0%, #B45309 26%, #E8862E 58%, #FBCB9A 100%)');
  // tracking tighter than the token on big numbers, wherever it sits
  for (const [de, para] of Object.entries(cfg.lsGlobal || {})) txt = txt.split(`letter-spacing: ${de}`).join(`letter-spacing: ${para}`);
  // ternaries inside templates: font-weight: ${on ? 800 : 700} and font-size: ${forte ? 14.5 : 13.5}px
  // a ternary picks selected vs not: the unselected side keeps 500 so the pair stays apart
  txt = txt.replace(/font-weight: \$\{([^{}]*)\}/g, (_, e) => `font-weight: \${${e.replace(/\b([1-9]00)\b/g, (m, v) => { stats.weight++; return cfg.fontWeightTernary?.[v] ?? peso(v); })}}`);
  // a section's title sits 16px over its content (was 8 or 10), as in Mercado Pago
  txt = txt.replace(/(section style=\\?"display: flex; flex-direction: column; gap: )(?:8|10)px(; padding: 0 16px)/g, (_, a, b) => { stats.space++; return `${a}16px${b}`; });
  txt = txt.replace(/font-size: \$\{([^{}]*\?[^{}]*)\}px/g, (_, e) => `font-size: \${${e.replace(/\b(\d+(?:\.\d+)?)\b/g, (m, v) => { const t = tamanho(v); if (t !== num(v)) stats.size++; return t; })}}px`);
  txt = txt.replace(/[^"`<>{}]*(?:font-size|font-weight|padding|margin|gap|line-height)[^"`<>{}]*/g, seg => declaracoes(seg));
  // section titles (the h2 over a group) go up to title-md 20/24: the title is what splits one context from the next
  txt = txt.replace(/(<h2 style=\\?"[^"]*?)font-size: 18px; line-height: 24px/g, (_, a) => { stats.size++; return `${a}font-size: 20px; line-height: 24px`; });
  // sheets: grabber 8px from the top and 12px over the header; the title starts at the same height whether it has
  // one line or three (top-aligned with the close button, 10px down so a single line still centres on it)
  txt = txt.replace(/width: 36px; height: 4px; margin: 0 auto 6px;/g, () => { stats.space++; return 'width: 36px; height: 4px; margin: 0 auto 12px;'; });
  // a sheet never grows past the screen: it stops 48px under the top and scrolls inside (a 360x780 phone can't fit the long ones)
  txt = txt.replace(/(box-shadow: 0 -12px 40px rgba\(17,21,19,0\.2\); padding: )10px( 16px 32px)/g, (_, a, b) => { stats.space++; return `max-height: calc(100% - 48px); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; ${a}8px${b}`; });
  txt = txt.replace(/(display: flex; align-items: )center(; justify-content: space-between; gap: 12px; padding-left: 4px\\?">(?:\n|\\n)<span style=\\?"min-width: 0; display: flex; flex-direction: column; gap: )2px(\\?"><h2 style=\\?")/g, (_, a, b, c) => { stats.space++; return `${a}flex-start${b}4px; padding-top: 10px${c}text-wrap: balance; `; });
  // packed receipts: the amount under "Fatura paga" is stat-md 34 like the ones built in the page (runs after the size pass)
  txt = txt.replace(/(>(?:Fatura paga|Pagamento feito)<\/h1>\\n<span style=\\"margin-top: 2px\\"><span style=\\"display: flex; align-items: baseline; gap: 4px; font-variant-numeric: (?:tabular|proportional)-nums\\"><span style=\\")font-size: 18px; line-height: 24px(; font-weight: 700\\">R\$<\/span><span style=\\")font-size: 40px; line-height: 48px(; font-weight: 700; letter-spacing: -0\.03em\\">)/g, (_, a, b, c) => { stats.size++; return `${a}font-size: 16px; line-height: 22px${b}font-size: 34px; line-height: 40px${c}`; });
  // the cashback badge reads "+R$ 34,07 cashback gerado": without "de" it stays on one line on a 360px phone
  txt = txt.split('de cashback gerado').join('cashback gerado');
  // containers of big amounts (R$ + number + cents) set their digits for every child: proportional too
  txt = txt.replace(/(display: flex; align-items: baseline; gap: 4px;[^"\\]*?font-variant-numeric: )tabular-nums/g, (_, a) => { stats.ls++; return `${a}proportional-nums`; });
  // a title over its subtitle sits 2px apart everywhere (the original mixed 1 and 3)
  txt = txt.replace(/(flex-direction: column; gap: )4px(\\?"><span style=\\?"font-size: 1[56]px; line-height: 2[02]px; font-weight: 700)/g, (_, a, b) => { stats.space++; return `${a}2px${b}`; });
  // full-width buttons: one height for all, 52 (they were 54 and 50)
  txt = txt.replace(/(<button style=\\?"[^"\\]*?width: 100%; height: )(?:54|50)px(; (?:flex-shrink: 0; )?border-radius: )(?:27|25)px/g, (_, a, b) => { stats.space++; return `${a}52px${b}26px`; });
  // segmented tabs: 4px around a 36px tab (the 46px box left 6 under and 4 over)
  txt = txt.replace(/(role=\\?"tablist\\?" style=\\?"height: )46px(; box-sizing: border-box; padding: )4px 6px(; border-radius: )23px/g, (_, a, b, c) => { stats.space++; return `${a}44px${b}4px${c}22px`; });
  // sheets: the header stays pinned while the sheet scrolls; the grabber gives 8 of its gap to the header's own padding
  txt = txt.replace(/width: 36px; height: 4px; margin: 0 auto 12px;/g, 'width: 36px; height: 4px; margin: 0 auto 4px;');
  return txt.replace(/(<div style=\\?")(display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; )padding-left: 4px(\\?">(?:\n|\\n)<span style=\\?"min-width: 0; display: flex; flex-direction: column; gap: 4px; padding-top: 10px)/g, (_, a, b, c) => { stats.space++; return `${a}position: sticky; top: 0; z-index: 3; margin: 0 -16px; padding: 8px 16px 8px 20px; background: #FFFFFF; ${b.trim()}${c}`; });
}

// the template-literal styles keep ${...} inside a style attribute; the split above stops at { and },
// so inside templates each piece is fixed on its own (font-size and line-height in different pieces are
// reported by the runtime audit and fixed by hand)
const src = fs.readFileSync(ENTRADA, 'utf8');
const mGz = src.match(/const DADOS_GZ = "([^"]+)"/);
const json = zlib.gunzipSync(Buffer.from(mGz[1], 'base64')).toString('utf8');
const jsonNovo = transformar(json);
JSON.parse(jsonNovo); // must still be valid JSON
const gzNovo = zlib.gzipSync(Buffer.from(jsonNovo, 'utf8'), { level: 9 }).toString('base64');

// keep the image line and the blob line out of the text pass
const linhas = src.split('\n');
const saida = linhas.map(l => {
  if (l.startsWith('const DADOS_GZ = ')) return `const DADOS_GZ = "${gzNovo}";`;
  if (l.startsWith('const IMGS = ')) return l;
  return transformar(l);
}).join('\n');
fs.writeFileSync(SAIDA, saida);
console.log(JSON.stringify(stats));
