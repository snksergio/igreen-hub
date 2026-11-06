// Geometria da ilustração. Tudo em pixels da imagem do molde.
// Estas funções são puras: no React Native viram worklets ('worklet') e rodam na UI thread.

/**
 * Homografia do quadrado unitário para a face de cima do pack.
 * q = [frente-longe, trás-longe, trás-perto, frente-perto] (campo "pack" do moldes.json).
 * Retorna H(u, v): u vai da frente (0) para trás (1), v do lado de longe (0) para o de perto (1).
 * É o que faz o recorte da carga seguir a perspectiva da foto.
 */
export function homography(q) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / det, h = (dx1 * dy3 - dx3 * dy1) / det;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  return (u, v) => { const w = g * u + h * v + 1; return [(a * u + b * v + x0) / w, (d * u + e * v + y0) / w]; };
}

const pt = p => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
export const EMPTY = 'M0 0';

/** Faixa do pack entre u0 e u1 (largura inteira em v). É o recorte da carga: region(H, 0, soc). */
export function region(H, u0, u1) {
  if (u1 - u0 < .002) return EMPTY;
  return 'M' + [H(u0, 0), H(u1, 0), H(u1, 1), H(u0, 1)].map(pt).join(' L') + ' Z';
}

/** Linha transversal do pack na posição u (borda de avanço e linha do limite). */
export const edge = (H, u) => 'M' + pt(H(u, 0)) + ' L' + pt(H(u, 1));

/** Ponto na curva quadrática a → c → b em t ∈ [0, 1] (caminho do conector na tela 1). */
export const quadBezier = (a, c, b, t) => {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
};

export const easeInOutQuad = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

export const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
export const rgb = c => `rgb(${c[0]},${c[1]},${c[2]})`;
