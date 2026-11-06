import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * Vocabulário visual de mobilidade elétrica. Tudo é vetor desenhado em
 * código — nenhuma imagem, ícone baixado ou textura. As peças de traço
 * aceitam `progress` para desenhar via `strokeDashoffset`, na mesma
 * linguagem de movimento do resto do deck.
 */

const DASH = 4000;

/** Raio. A forma base da marca e do acento do deck. */
export const BoltGlyph: React.FC<{
  size?: number;
  color: string;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ size = 64, color, rotate = 0, style }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={style}>
    <path
      d="M14 -42 L-24 4 L-4 4 L-14 42 L24 -6 L4 -6 Z"
      fill={color}
      transform={`rotate(${rotate})`}
    />
  </svg>
);

/** Marca-d'água das páginas escuras: raios gigantes girando devagar. */
export const BoltWatermark: React.FC<{ color: string; opacity?: number }> = ({
  color,
  opacity = 0.05,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {[
        [1580, 200, 5.4],
        [1300, 780, 3.9],
        [1830, 660, 3.1],
      ].map(([x, y, s], i) => (
        <g
          key={i}
          transform={`translate(${x} ${y}) rotate(${frame * 0.05 + i * 26}) scale(${s})`}
        >
          <path d="M14 -42 L-24 4 L-4 4 L-14 42 L24 -6 L4 -6 Z" fill={color} />
        </g>
      ))}
    </svg>
  );
};

/** Silhueta lateral de um carro elétrico, com a portinhola de recarga. */
export const EvCar: React.FC<{
  width?: number;
  color: string;
  accent?: string;
  progress?: number;
  strokeWidth?: number;
}> = ({ width = 420, color, accent, progress = 1, strokeWidth = 3 }) => (
  <svg width={width} height={width * (130 / 300)} viewBox="0 0 300 130">
    <g
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={DASH}
      strokeDashoffset={DASH * (1 - progress)}
    >
      <path
        d="M24 104 L36 104 A22 22 0 0 1 80 104 L186 104 A22 22 0 0 1 230 104
           L252 104 C268 104 278 96 278 84 L278 74 C278 64 270 58 258 56
           L214 50 L176 26 C170 22 162 20 154 20 L96 20 C86 20 78 24 72 32
           L46 56 L36 58 C28 60 22 66 22 76 L22 96 C22 100 22 100 24 104 Z"
      />
      <path d="M92 34 L146 34 L146 54 L70 54 Z" />
      <path d="M158 34 L166 34 L198 54 L158 54 Z" />
      <circle cx={58} cy={104} r={22} />
      <circle cx={208} cy={104} r={22} />
      <circle cx={58} cy={104} r={9} />
      <circle cx={208} cy={104} r={9} />
    </g>
    <circle
      cx={40}
      cy={76}
      r={9}
      fill="none"
      stroke={accent ?? color}
      strokeWidth={strokeWidth}
      opacity={progress > 0.85 ? 1 : 0}
    />
    <g
      transform="translate(40 76) scale(0.13)"
      opacity={progress > 0.92 ? 1 : 0}
    >
      <path d="M14 -42 L-24 4 L-4 4 L-14 42 L24 -6 L4 -6 Z" fill={accent ?? color} />
    </g>
  </svg>
);

/** Totem de recarga: pilar, visor, raio e o cabo pendurado. */
export const ChargerTotem: React.FC<{
  height?: number;
  color: string;
  accent?: string;
  progress?: number;
  strokeWidth?: number;
  screenFill?: string;
}> = ({
  height = 420,
  color,
  accent,
  progress = 1,
  strokeWidth = 3,
  screenFill,
}) => (
  <svg width={height * (210 / 330)} height={height} viewBox="0 0 210 330">
    <g
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={DASH}
      strokeDashoffset={DASH * (1 - progress)}
    >
      <rect x={34} y={16} width={96} height={280} rx={20} />
      <rect x={50} y={40} width={64} height={58} rx={9} fill={screenFill ?? "none"} />
      <path d="M26 296 L138 296 L138 312 L26 312 Z" />
      <path d="M130 128 C182 138 196 200 166 244" />
      <rect
        x={150}
        y={242}
        width={32}
        height={44}
        rx={9}
        transform="rotate(12 166 264)"
      />
    </g>
    <g transform="translate(82 148) scale(0.62)" opacity={progress > 0.8 ? 1 : 0}>
      <path d="M14 -42 L-24 4 L-4 4 L-14 42 L24 -6 L4 -6 Z" fill={accent ?? color} />
    </g>
  </svg>
);

/** Cabo de recarga solto — usado como divisor decorativo. */
export const CableCurve: React.FC<{
  width?: number;
  color: string;
  progress?: number;
  strokeWidth?: number;
}> = ({ width = 620, color, progress = 1, strokeWidth = 3 }) => (
  <svg width={width} height={width * (120 / 620)} viewBox="0 0 620 120">
    <g
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={DASH}
      strokeDashoffset={DASH * (1 - progress)}
    >
      <path d="M16 20 C120 24 150 104 300 104 C450 104 486 26 596 22" />
      <rect x={2} y={6} width={26} height={30} rx={8} />
      <rect x={592} y={8} width={26} height={30} rx={8} />
    </g>
  </svg>
);

const PIN = (cx: number, cy: number, r: number, color: string) => (
  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={color} />
);

/**
 * Os quatro padrões de conector, como silhueta. Só a geometria que
 * distingue um do outro: a face achatada do Type 2, os dois pinos DC do
 * CCS2, a coroa de pinos do GB/T e os dois grandes do CHAdeMO.
 */
export const ConnectorGlyph: React.FC<{
  kind: "CCS2" | "Type 2" | "GB/T" | "CHAdeMO";
  size?: number;
  color: string;
  strokeWidth?: number;
}> = ({ kind, size = 76, color, strokeWidth = 2.6 }) => {
  const s = (n: number) => n;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {kind === "Type 2" ? (
        <>
          {/* Círculo com a face superior achatada — a assinatura do Mennekes. */}
          <path
            d="M23.5 32 L76.5 32 A32 32 0 1 1 23.5 32 Z"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
          {[
            [36, 44],
            [64, 44],
          ].map(([x, y]) => PIN(s(x), s(y), 7, color))}
          {[
            [32, 62],
            [50, 60],
            [68, 62],
            [40, 76],
            [60, 76],
          ].map(([x, y]) => PIN(s(x), s(y), 5.4, color))}
        </>
      ) : null}

      {kind === "CCS2" ? (
        <>
          {/* Type 2 achatado em cima, dois pinos DC embaixo. */}
          <path
            d="M31 18 L69 18 A24 24 0 1 1 31 18 Z"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
          {[
            [40, 28],
            [60, 28],
          ].map(([x, y]) => PIN(s(x), s(y), 5.4, color))}
          {[
            [36, 42],
            [50, 40],
            [64, 42],
          ].map(([x, y]) => PIN(s(x), s(y), 4.4, color))}
          <circle
            cx={50}
            cy={72}
            r={22}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
          {[
            [40, 72],
            [60, 72],
          ].map(([x, y]) => PIN(s(x), s(y), 8.6, color))}
        </>
      ) : null}

      {kind === "GB/T" ? (
        <>
          <circle cx={50} cy={50} r={36} fill="none" stroke={color} strokeWidth={strokeWidth} />
          {PIN(50, 50, 8, color)}
          {[0, 51, 103, 154, 206, 257, 309].map((deg) => {
            const a = (deg * Math.PI) / 180;
            return PIN(50 + Math.cos(a) * 22, 50 + Math.sin(a) * 22, 5, color);
          })}
        </>
      ) : null}

      {kind === "CHAdeMO" ? (
        <>
          <circle cx={50} cy={50} r={36} fill="none" stroke={color} strokeWidth={strokeWidth} />
          {PIN(36, 40, 10, color)}
          {PIN(64, 40, 10, color)}
          {[
            [32, 64],
            [44, 68],
            [56, 68],
            [68, 64],
            [50, 24],
          ].map(([x, y]) => PIN(s(x), s(y), 4.6, color))}
        </>
      ) : null}
    </svg>
  );
};

/**
 * Campo de barras de sinal com buracos — a tradução visual dos 31,2% de
 * rodovia sem cobertura. As colunas apagadas são determinísticas (derivadas
 * do índice), nunca aleatórias, para o render não tremer.
 */
export const SignalVoid: React.FC<{
  width?: number;
  height?: number;
  color: string;
  voidColor: string;
  columns?: number;
  progress?: number;
  style?: React.CSSProperties;
}> = ({
  width = 1920,
  height = 1080,
  color,
  voidColor,
  columns = 84,
  progress = 1,
  style,
}) => {
  const bars: React.ReactNode[] = [];
  const step = width / columns;
  for (let i = 0; i < columns; i++) {
    const wave = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11));
    const dead = i % 3 === 1 && Math.sin(i * 1.7) > -0.35;
    const h = height * wave * (dead ? 0.1 : 1);
    const local = Math.max(0, Math.min(1, (progress - (i / columns) * 0.5) / 0.3));
    bars.push(
      <rect
        key={i}
        x={i * step + step * 0.28}
        y={height - h * local}
        width={step * 0.44}
        height={h * local}
        rx={step * 0.22}
        fill={dead ? voidColor : color}
      />,
    );
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style}>
      {bars}
    </svg>
  );
};

/** Bateria segmentada — indicador compacto de progresso. */
export const BatteryStrip: React.FC<{
  width?: number;
  segments?: number;
  filled?: number;
  color: string;
  trackColor: string;
}> = ({ width = 220, segments = 6, filled = 4, color, trackColor }) => {
  const h = width * (70 / 220);
  const cells: React.ReactNode[] = [];
  const inner = width - 26;
  const cellW = (inner - 10 - (segments - 1) * 5) / segments;
  for (let i = 0; i < segments; i++) {
    cells.push(
      <rect
        key={i}
        x={9 + i * (cellW + 5)}
        y={13}
        width={cellW}
        height={h - 26}
        rx={3}
        fill={i < filled ? color : trackColor}
      />,
    );
  }
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
      <rect
        x={2}
        y={4}
        width={inner}
        height={h - 8}
        rx={10}
        fill="none"
        stroke={color}
        strokeWidth={2.6}
      />
      <rect x={inner + 6} y={h * 0.3} width={12} height={h * 0.4} rx={4} fill={color} />
      {cells}
    </svg>
  );
};
