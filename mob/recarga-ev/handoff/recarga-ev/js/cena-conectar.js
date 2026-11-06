// Cena da Tela 1: carro + carregador.
//
// Duas imagens com o mesmo enquadramento: "solto" (conector no suporte) e "plugado" (edição da
// mesma cena com o cabo na porta). Enquanto espera, um conector fantasma faz o caminho do suporte
// até a porta em loop. Ao conectar, o conector anda até a porta e a imagem "plugado" entra por
// crossfade (600 ms, em cena.css).
import { quadBezier, easeInOutQuad } from './geometria.js';

const CONTORNO = '#d6ece2';
const plug = (cls, extra = '') => `<g class="${cls}" ${extra}><circle r="24" fill="#0d1210" stroke="${CONTORNO}" stroke-opacity=".6" stroke-width="3.5"/><circle r="14" fill="none" stroke="#3fe394" stroke-width="3.5"/><circle r="4.5" fill="#3fe394"/></g>`;

export const GHOST_CYCLE_MS = 2800; // ida (55%), pausa perto da porta (25%), some (20%)
export const PLUG_TRAVEL_MS = 1000;

export function createConnectScene(host, cena, { id, assetsBase }) {
  const [px, py] = cena.porta, [hx, hy] = cena.suporte;
  const { largura: W, altura: H } = cena;
  const src = name => `${assetsBase}/${cena.imagens[name]}`;

  // caminho do conector: sai do suporte, desce em curva e chega à porta
  const path = { from: { x: hx - 16, y: hy + 34 }, control: { x: (hx + px) / 2, y: Math.max(hy, py) + 190 }, to: { x: px, y: py } };
  const nearPort = { x: px + 44, y: py + 14 }; // o fantasma para aqui, sem "entrar" na porta

  host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="scene-svg" aria-hidden="true">
    <defs>
      <radialGradient id="${id}-port"><stop offset="0" stop-color="#4be6a0" stop-opacity=".85"/><stop offset="1" stop-color="#4be6a0" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}-glow"><stop offset="0" stop-color="#e8fff3" stop-opacity=".45"/><stop offset="1" stop-color="#e8fff3" stop-opacity="0"/></radialGradient>
    </defs>
    <image href="${src('solto')}" width="${W}" height="${H}"/>
    <image class="plugado" href="${src('plugado')}" width="${W}" height="${H}"/>
    <g class="fx-guide">
      <path d="M${path.from.x} ${path.from.y} Q ${path.control.x} ${path.control.y} ${nearPort.x} ${nearPort.y}" fill="none" stroke="#e8fff3" stroke-opacity=".45" stroke-width="3.5" stroke-linecap="round" class="march"/>
      <circle cx="${hx}" cy="${hy + 20}" r="44" fill="url(#${id}-glow)" class="breathe"/>
      <circle cx="${px}" cy="${py}" r="54" fill="url(#${id}-glow)" class="breathe"/>
      <circle cx="${px}" cy="${py}" r="26" fill="none" stroke="#e8fff3" stroke-width="3.5" class="ping"/>
      <path d="M${px} ${py - 34} V${py - 118}" stroke="#e8fff3" stroke-opacity=".45" stroke-width="2.5" stroke-dasharray="6 7"/>
      <g transform="translate(${px} ${py - 150})">
        <rect x="-92" y="-30" width="184" height="60" rx="30" fill="#0d1612" fill-opacity=".8" stroke="#e8fff3" stroke-opacity=".35" stroke-width="2"/>
        <text y="14" font-size="40" font-weight="600" text-anchor="middle" fill="#e8fff3">Entrada</text>
      </g>
    </g>
    <g class="fx-connected"><circle cx="${px}" cy="${py}" r="80" fill="url(#${id}-port)" class="breathe"/></g>
    ${plug('plug', 'opacity="0"')}${plug('ghost', 'opacity="0"')}
  </svg>`;

  const svg = host.querySelector('svg');
  const plugEl = svg.querySelector('.plug'), ghostEl = svg.querySelector('.ghost');
  const place = (node, p, opacity) => {
    node.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    node.setAttribute('opacity', opacity);
  };

  return {
    svg,

    /** Conector fantasma em loop (chamar a cada quadro enquanto aguarda). */
    tickGhost(now) {
      const t = (now % GHOST_CYCLE_MS) / GHOST_CYCLE_MS;
      let k, a;
      if (t < .55) { k = easeInOutQuad(t / .55); a = Math.min(1, t / .08); }
      else if (t < .8) { k = 1; a = 1; }
      else { k = 1; a = 1 - (t - .8) / .2; }
      place(ghostEl, quadBezier(path.from, path.control, nearPort, k), (a * .7).toFixed(3));
    },
    hideGhost() { ghostEl.setAttribute('opacity', 0); },

    /** Anima o conector do suporte até a porta e chama onArrive ao chegar. */
    plugIn(onArrive) {
      this.hideGhost();
      const t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / PLUG_TRAVEL_MS);
        place(plugEl, quadBezier(path.from, path.control, path.to, easeInOutQuad(k)), 1);
        if (k < 1) requestAnimationFrame(step);
        else { svg.classList.add('is-connected'); onArrive && onArrive(); }
      };
      requestAnimationFrame(step);
    },

    reset() {
      svg.classList.remove('is-connected');
      plugEl.setAttribute('opacity', 0);
    },
  };
}
