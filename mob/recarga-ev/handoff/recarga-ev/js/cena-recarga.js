// Cena da Tela 2: o carro com a bateria no assoalho mostrando a carga real.
//
// Molde "foto": duas imagens alinhadas pixel a pixel. A "vazio" é a base; a "cheio" só aparece
//   dentro do recorte region(H, 0, carga). A luz verde do chão é a própria imagem "cheio" vista
//   por uma elipse (luzChao), cortada abaixo da borda de perto do pack.
// Molde "mini": só a base "vazio"; os blocos são desenhados aqui, com degradê ciano → verde.
//
// Camadas, de baixo para cima:
//   1 base vazia · 2 luz no chão (só carregando) · 3 carga (imagem cheia recortada ou blocos)
//   4 varredura do AC · 5 brilho que corre · 6 escurecimento depois do limite · 7 borda de avanço
//   8 limite (tracejado + ▲ + %) · 9 cabo, fluxo e porta
import { homography, region, edge, EMPTY, mix, rgb } from './geometria.js';

const CONTORNO = '#d6ece2';
const CIANO = [56, 178, 226], VERDE = [124, 238, 164]; // degradê dos blocos minimalistas
const GAP_BLOCO = .014;                                  // fresta entre blocos, em fração do pack

export function createChargeScene(host, mold, { id, assetsBase }) {
  const H = homography(mold.pack), mini = mold.tipo === 'mini';
  const { largura: W, altura: Hh } = mold;
  const [px, py] = mold.porta;
  const N = mold.blocos;
  const cellU = i => mini ? [i / N + GAP_BLOCO / 2, (i + 1) / N - GAP_BLOCO / 2] : [i / N, (i + 1) / N];
  const src = name => `${assetsBase}/${mold.imagens[name]}`;

  // luz no chão: só abaixo da borda de perto do pack, senão revelaria o pack cheio
  const A = H(0, 1), B = H(1, 1), yAt = x => A[1] + (B[1] - A[1]) * (x - A[0]) / (B[0] - A[0]) + 6;
  const below = `M0 ${yAt(0).toFixed(1)} L${W} ${yAt(W).toFixed(1)} L${W} ${Hh + 50} L0 ${Hh + 50} Z`;

  let scan = '', emptyCells = '', fillCells = '';
  for (let i = 0; i < N; i++) {
    const [u0, u1] = cellU(i);
    scan += `<path class="cell" style="--i:${i}" d="${region(H, u0, u1)}"/>`;
    if (mini) {
      emptyCells += `<path d="${region(H, u0, u1)}" fill="url(#${id}-ce)" stroke="#fff" stroke-opacity=".09" stroke-width="1.5" stroke-linejoin="round"/>`;
      fillCells += `<path class="fc" d="${EMPTY}" stroke-width="1.6" stroke-linejoin="round"/><path class="fh" d="${EMPTY}" fill="url(#${id}-hi)"/>`;
    }
  }

  const charge = mini
    ? `<g>${emptyCells}</g><g>${fillCells}</g>`
    : `<g class="fx-charging" clip-path="url(#${id}-below)"><image href="${src('cheio')}" width="${W}" height="${Hh}" clip-path="url(#${id}-spill)" class="breathe"/></g>
       <image href="${src('cheio')}" width="${W}" height="${Hh}" clip-path="url(#${id}-fill)"/>`;

  // cabo: sai da porta, contorna a roda traseira por fora e deixa o quadro pela direita
  const cable = `M${px + 12} ${py + 16} C ${px + 120} ${py + 50} ${px + 180} ${py + 280} ${W + 60} ${Hh - 40}`;
  const cableCore = mini ? 'stroke="#bfffe0" stroke-width="5"' : 'stroke="#0b0f0d" stroke-width="14"';
  const cableOut = mini ? 'stroke="#4be6a0" stroke-opacity=".3" stroke-width="16"' : `stroke="${CONTORNO}" stroke-opacity=".26" stroke-width="20"`;

  host.innerHTML = `<svg viewBox="${mold.viewBox.join(' ')}" class="scene-svg" aria-hidden="true">
    <defs>
      <clipPath id="${id}-fill"><path class="c-fill" d="${EMPTY}"/></clipPath>
      ${mold.luzChao ? `<clipPath id="${id}-spill"><ellipse cx="${mold.luzChao.cx}" cy="${mold.luzChao.cy}" rx="${mold.luzChao.rx}" ry="${mold.luzChao.ry}"/></clipPath>` : ''}
      <clipPath id="${id}-below"><path d="${below}"/></clipPath>
      <radialGradient id="${id}-port"><stop offset="0" stop-color="#4be6a0" stop-opacity=".85"/><stop offset="1" stop-color="#4be6a0" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}-ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5257"/><stop offset="1" stop-color="#2b3034"/></linearGradient>
      <linearGradient id="${id}-hi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".45" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
    <image href="${src('vazio')}" width="${W}" height="${Hh}"/>
    ${charge}
    <g>${scan}</g>
    <g clip-path="url(#${id}-fill)" class="fx-charging"><path class="shim" d="${EMPTY}" fill="#fff" fill-opacity="${mini ? .14 : .2}"/></g>
    <g class="pk-limit-g"><path class="beyond" d="${EMPTY}" fill="#000" fill-opacity="${mini ? .3 : .38}"/></g>
    ${mini ? '' : `<path class="lead" d="${EMPTY}" stroke="#d8ffe9" stroke-width="5" stroke-linecap="round"/>`}
    <g class="pk-limit-g">
      <path class="lim" d="${EMPTY}" stroke="#fff" stroke-opacity=".85" stroke-width="4" stroke-dasharray="14 10"/>
      <path class="tri" d="${EMPTY}" fill="#fff" fill-opacity=".92"/>
      <text class="lim-t" font-size="42" font-weight="600" fill="#fff" fill-opacity=".75"></text>
    </g>
    <path d="${cable}" fill="none" ${cableOut} stroke-linecap="round"/>
    <path d="${cable}" fill="none" ${cableCore} stroke-linecap="round"/>
    <path d="${cable}" class="flow fx-charging" fill="none" stroke="#4be6a0" stroke-width="6" stroke-linecap="round"/>
    <circle class="breathe fx-charging" cx="${px}" cy="${py}" r="62" fill="url(#${id}-port)"/>
    <circle cx="${px}" cy="${py}" r="22" fill="#0d1210" stroke="${CONTORNO}" stroke-opacity=".55" stroke-width="3"/>
    <circle cx="${px}" cy="${py}" r="13" fill="none" stroke="#3fe394" stroke-width="4"/>
    <circle cx="${px}" cy="${py}" r="4" fill="#3fe394"/>
  </svg>`;

  const svg = host.querySelector('svg'), q = s => svg.querySelector(s);
  const el = { fill: q('.c-fill'), lead: q('.lead'), shim: q('.shim'), lim: q('.lim'), tri: q('.tri'), limText: q('.lim-t'), beyond: q('.beyond') };
  const fillCellsEl = [...svg.querySelectorAll('.fc')], fillHighlightEl = [...svg.querySelectorAll('.fh')];
  let raf = 0;

  const scene = {
    svg,
    charge: 0,

    /** Carga de 0 a 1 (soc / 100). No AC, a carga fica em 0 e a cena usa a varredura (is-scan). */
    setCharge(f) {
      scene.charge = f;
      el.fill.setAttribute('d', f > .004 ? region(H, 0, f) : EMPTY);
      if (el.lead) el.lead.setAttribute('d', f > .004 && f < .998 ? edge(H, f) : EMPTY);
      if (!mini) return;
      for (let i = 0; i < N; i++) {
        const [u0, u1] = cellU(i);
        if (f <= u0 + .003) { fillCellsEl[i].setAttribute('d', EMPTY); fillHighlightEl[i].setAttribute('d', EMPTY); continue; }
        const d = region(H, u0, Math.min(u1, f));
        const color = mix(CIANO, VERDE, Math.min(1, ((u0 + u1) / 2) / f)); // primeiro bloco ciano, o da frente da carga verde
        fillCellsEl[i].setAttribute('d', d);
        fillHighlightEl[i].setAttribute('d', d);
        fillCellsEl[i].setAttribute('fill', rgb(color));
        fillCellsEl[i].setAttribute('stroke', rgb(mix(color, [255, 255, 255], .45)));
      }
    },

    /** Transição suave da carga (700 ms, ease-out cúbico). onFrame recebe a carga do quadro. */
    animateCharge(to, duration = 700, onFrame) {
      cancelAnimationFrame(raf);
      const from = scene.charge, t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / duration), e = 1 - Math.pow(1 - k, 3);
        scene.setCharge(from + (to - from) * e);
        onFrame && onFrame(scene.charge);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    },

    /** Limite de 0 a 1, ou null para esconder (AC). */
    setLimit(l) {
      svg.querySelectorAll('.pk-limit-g').forEach(n => n.style.display = l == null ? 'none' : '');
      if (l == null) return;
      el.lim.setAttribute('d', edge(H, l));
      el.beyond.setAttribute('d', region(H, l, 1));
      const [x, y] = H(l, 1), y0 = y + mold.limiteOffset + 10;
      el.tri.setAttribute('d', `M${(x - 22).toFixed(1)} ${(y0 + 30).toFixed(1)} L${(x + 22).toFixed(1)} ${(y0 + 30).toFixed(1)} L${x.toFixed(1)} ${y0.toFixed(1)} Z`);
      el.limText.setAttribute('x', (x + 32).toFixed(1));
      el.limText.setAttribute('y', (y0 + 31).toFixed(1));
      el.limText.textContent = Math.round(l * 100) + '%';
    },

    /** Brilho que corre dentro da parte cheia (ciclo de 2,6 s), seguindo a perspectiva. */
    tick(now) {
      const f = scene.charge;
      if (f < .02) { el.shim.setAttribute('d', EMPTY); return; }
      const t = (now % 2600) / 2600, w = .09, s = -w + t * (f + w);
      el.shim.setAttribute('d', region(H, Math.max(0, s), Math.min(f, s + w)));
    },

    /** 'charging' | 'complete' | 'scan' */
    setState(state) {
      svg.classList.toggle('is-charging', state !== 'complete');
      svg.classList.toggle('is-complete', state === 'complete');
      svg.classList.toggle('is-scan', state === 'scan');
    },
  };
  return scene;
}
