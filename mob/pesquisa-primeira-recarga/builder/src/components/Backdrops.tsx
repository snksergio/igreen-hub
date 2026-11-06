import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * Topographic contour field — the swirling line texture used on the dark and
 * lime pages of the reference decks. Rings are perturbed by layered sines and
 * the phase is driven by the frame, so it drifts slowly.
 */
export const ContourField: React.FC<{
  cx: number;
  cy: number;
  rings?: number;
  gap?: number;
  r0?: number;
  color: string;
  opacity?: number;
  strokeWidth?: number;
  speed?: number;
  amplitude?: number;
}> = ({
  cx,
  cy,
  rings = 26,
  gap = 54,
  r0 = 90,
  color,
  opacity = 0.5,
  strokeWidth = 1.6,
  speed = 0.006,
  amplitude = 0.17,
}) => {
  const frame = useCurrentFrame();
  const phase = frame * speed;

  const paths: string[] = [];
  for (let k = 0; k < rings; k++) {
    const base = r0 + k * gap;
    let d = "";
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      const wobble =
        1 +
        amplitude * Math.sin(3 * a + phase + k * 0.34) +
        amplitude * 0.55 * Math.sin(5 * a - phase * 0.8 + k * 0.18) +
        amplitude * 0.3 * Math.sin(2 * a + phase * 1.4);
      const r = base * wobble;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.72;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    paths.push(d + "Z");
  }

  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={0.25 + 0.75 * (1 - i / paths.length)}
        />
      ))}
    </svg>
  );
};

/** Faint dot lattice, used to give light pages a measured, engineered feel. */
export const DotGrid: React.FC<{
  color: string;
  step?: number;
  radius?: number;
  opacity?: number;
}> = ({ color, step = 40, radius = 1.4, opacity = 0.5 }) => {
  const dots: React.ReactNode[] = [];
  for (let y = step / 2; y < 1080; y += step) {
    for (let x = step / 2; x < 1920; x += step) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={radius} fill={color} />);
    }
  }
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {dots}
    </svg>
  );
};

/** Soft radial bloom, keeps large dark areas from going flat. */
export const Glow: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  opacity?: number;
}> = ({ x, y, size, color, opacity = 0.35 }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
      opacity,
      filter: "blur(20px)",
    }}
  />
);

/** Oversized glyph watermark, as on the dark pitch pages of the references. */
export const GlyphWatermark: React.FC<{
  color: string;
  opacity?: number;
}> = ({ color, opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {[
        [1580, 180, 520],
        [1300, 760, 380],
        [1820, 640, 300],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${frame * 0.05 + i * 24})`}>
          {[0, 60, 120].map((a) => (
            <rect
              key={a}
              x={-s * 0.09}
              y={-s * 0.46}
              width={s * 0.18}
              height={s * 0.92}
              rx={s * 0.09}
              fill={color}
              transform={`rotate(${a})`}
            />
          ))}
        </g>
      ))}
    </svg>
  );
};

/**
 * Campo em perspectiva de um ponto — lê como painel solar visto de baixo, ou
 * como pista. É o parente reto do `<ContourField>`: mesma ideia de textura de
 * linha fina, geometria oposta.
 *
 * As travessas se adensam em direção ao horizonte e as colunas convergem no
 * ponto de fuga; a cada três, a linha engrossa, que é o que dá leitura de
 * "painel" em vez de "grade".
 */
export const SolarField: React.FC<{
  color: string;
  opacity?: number;
  vpX?: number;
  vpY?: number;
  rows?: number;
  cols?: number;
  /** Máscara que apaga a grade onde o texto vive. */
  mask?: string;
}> = ({
  color,
  opacity = 0.12,
  vpX = 1560,
  vpY = 250,
  rows = 13,
  cols = 15,
  mask = "linear-gradient(104deg, transparent 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.8) 46%, rgba(0,0,0,1) 72%)",
}) => {
  const W = 1920;
  const H = 1080;
  const lines: React.ReactNode[] = [];

  for (let j = 0; j <= cols; j++) {
    lines.push(
      <line
        key={`c${j}`}
        x1={vpX}
        y1={vpY}
        x2={-1400 + (j / cols) * (W + 2900)}
        y2={H + 40}
        stroke={color}
        strokeWidth={j % 3 === 0 ? 2.2 : 1.2}
      />,
    );
  }

  for (let i = 1; i <= rows; i++) {
    const y = vpY + (H - vpY) * Math.pow(i / rows, 2.1);
    lines.push(
      <line
        key={`r${i}`}
        x1={-200}
        y1={y}
        x2={W + 200}
        y2={y}
        stroke={color}
        strokeWidth={i % 3 === 0 ? 2.2 : 1.2}
      />,
    );
  }

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      {lines}
    </svg>
  );
};
