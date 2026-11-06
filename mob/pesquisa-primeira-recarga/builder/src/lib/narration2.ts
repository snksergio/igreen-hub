/**
 * Narração v2 — a que manda no tempo do vídeo.
 *
 * Aqui a ordem é a correta: a fala foi escrita solta, gravada, medida, e a
 * duração de cada cena saiu **dessa medição**. `scene` é a duração final da
 * página: a fala inteira mais `TAIL` de silêncio, que é o respiro entre uma
 * ideia e a seguinte.
 *
 * Na v1 eu tinha feito o inverso — escrevi para caber num vídeo pronto — e o
 * resultado soou mecânico justamente por isso: frase curta não dá pista para
 * a entonação subir e descer.
 */

/** Silêncio depois de cada fala, em segundos. */
export const TAIL = 1.5;

/** Nenhuma página fica menos que isto, por mais curta que seja a fala. */
export const MIN_FRAMES = 150;

export type Line = {
  scene: number;
  /** Duração medida do MP3, em segundos. */
  dur: number;
  /** Duração final da cena, em frames — a fala mais o respiro. */
  frames: number;
};

export const lines: Line[] = [
  { scene: 1, dur: 17.87, frames: 582 },
  { scene: 2, dur: 4.05, frames: 167 },
  { scene: 3, dur: 23.17, frames: 741 },
  { scene: 4, dur: 18.99, frames: 615 },
  { scene: 5, dur: 15.15, frames: 500 },
  { scene: 6, dur: 17.71, frames: 577 },
  { scene: 7, dur: 13.95, frames: 464 },
  { scene: 8, dur: 35.63, frames: 1114 },
  { scene: 9, dur: 21.24, frames: 683 },
  { scene: 10, dur: 16.93, frames: 553 },
  { scene: 11, dur: 10.84, frames: 371 },
  { scene: 12, dur: 19.88, frames: 642 },
  { scene: 13, dur: 29.23, frames: 922 },
  { scene: 14, dur: 14.6, frames: 484 },
  { scene: 15, dur: 16.77, frames: 549 },
  { scene: 16, dur: 22.52, frames: 721 },
  { scene: 17, dur: 19.88, frames: 642 },
  { scene: 18, dur: 22.6, frames: 723 },
  { scene: 19, dur: 22.99, frames: 735 },
  { scene: 20, dur: 18.05, frames: 587 },
  { scene: 21, dur: 23.33, frames: 745 },
  { scene: 22, dur: 14.52, frames: 481 },
  { scene: 23, dur: 5.15, frames: 200 },
];

/** Transições, na ordem em que aparecem no deck. 24 = riseOver, 22 = sweep. */
export const transitions = [
  22, 24, 22, 24, 22, 24, 24, 22, 24, 22, 24, 22, 24, 24, 22, 22, 22, 22, 22,
  24, 24, 22,
];

/** Frame em que cada cena entra: soma das anteriores menos as transições. */
export const startOf = (scene: number) => {
  let f = 0;
  for (let i = 0; i < scene - 1; i++) f += lines[i].frames - transitions[i];
  return f;
};

export const totalFrames =
  lines.reduce((a, l) => a + l.frames, 0) -
  transitions.reduce((a, t) => a + t, 0);

export const clip = (scene: number) =>
  `vo2/n${String(scene).padStart(2, "0")}.mp3`;
