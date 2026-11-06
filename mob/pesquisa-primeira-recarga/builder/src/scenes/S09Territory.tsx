import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Glow } from "../components/Backdrops";
import { ClosingLine, Quote, SectionHead, StatGrid } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { connectivity } from "../lib/data";
import { display, text } from "../lib/fonts";
import { BR_CAPITALS, BR_CORRIDORS, brazilLattice, capitalByName } from "../lib/geoBr";

const MAP = 700;
const LON_MIN = -74;
const LON_MAX = -34;
const LAT_MIN = -34;
const LAT_MAX = 6;

const LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
  "Brasília": { dx: -16, dy: -14, anchor: "end" },
  "São Paulo": { dx: -16, dy: 9, anchor: "end" },
  "Rio de Janeiro": { dx: 16, dy: 7, anchor: "start" },
};

const RED = "#FF5C5C";
const GREEN = "#5DD389";

const px = (lon: number) => ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP;
const py = (lat: number) => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAP;

/**
 * Rodovia entre duas capitais: uma quadrática com a curvatura empurrada para
 * o lado, para a malha não virar uma teia de retas saindo de Brasília.
 */
const road = (a: { lon: number; lat: number }, b: { lon: number; lat: number }) => {
  const x1 = px(a.lon);
  const y1 = py(a.lat);
  const x2 = px(b.lon);
  const y2 = py(b.lat);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const bow = len * 0.12;
  const cx = mx - (dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return {
    d: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`,
    mid: [(x1 + 2 * cx + x2) / 4, (y1 + 2 * cy + y2) / 4] as const,
    len,
  };
};

/** Carinha triste: o marcador de "aqui não deu certo". */
const SadFace: React.FC<{ x: number; y: number; color: string; bg: string; scale?: number }> = ({
  x,
  y,
  color,
  bg,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle cx={0} cy={0} r={15} fill={bg} />
    <circle cx={0} cy={0} r={13} fill="none" stroke={color} strokeWidth={2.2} />
    <circle cx={-4.6} cy={-3.4} r={1.9} fill={color} />
    <circle cx={4.6} cy={-3.4} r={1.9} fill={color} />
    <path
      d="M-5.6 7.4 Q0 2.4 5.6 7.4"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </g>
);

/** Coração: o marcador de "aqui funciona". */
const HeartMark: React.FC<{ x: number; y: number; color: string; bg: string; scale?: number }> = ({
  x,
  y,
  color,
  bg,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle cx={0} cy={0} r={15} fill={bg} />
    <path
      d="M0 7.6 C-8 1.4 -7.6 -6 -3.6 -6 C-1.5 -6 0 -4.2 0 -2.6 C0 -4.2 1.5 -6 3.6 -6 C7.6 -6 8 1.4 0 7.6 Z"
      fill={color}
    />
  </g>
);

/** Wi-Fi cortado — o sinal cai neste trecho. */
const NoSignal: React.FC<{
  x: number;
  y: number;
  color: string;
  bg: string;
  scale?: number;
}> = ({ x, y, color, bg, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle cx={0} cy={0} r={22} fill={bg} />
    <g
      fill="none"
      stroke={color}
      strokeWidth={2.9}
      strokeLinecap="round"
      transform="translate(0 3)"
    >
      <path d="M-12 -5 A 17 17 0 0 1 12 -5" />
      <path d="M-7 1 A 10 10 0 0 1 7 1" />
      <circle cx={0} cy={7} r={2} fill={color} stroke="none" />
      <path d="M-12 10 L12 -10" />
    </g>
  </g>
);

export const S09Territory: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("ink");

  const dots = useMemo(() => brazilLattice(0.85), []);
  const roads = useMemo(
    () =>
      BR_CORRIDORS.map((c) => ({
        ...c,
        ...road(capitalByName(c.from), capitalByName(c.to)),
      })),
    [],
  );
  const voids = roads.filter((r) => !r.covered && r.mark);

  const sweep = interpolate(frame, [8, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <Frame
      variant="ink"
      section="Um terço sem sinal"
      page="09"
      source={connectivity.source}
      marker={connectivity.marker}
      backdrop={
        <div style={{ position: "absolute", inset: 0 }}>
          <Glow x={1330} y={520} size={1120} color="rgba(93,211,137,0.14)" opacity={0.85} />
        </div>
      }
    >
      <div style={{ width: 800 }}>
        <SectionHead
          variant="ink"
          eyebrow="Território — cobertura de dados"
          lines={connectivity.title}
          accentLine={1}
          size={72}
        />

        <div style={{ marginTop: 26 }}>
          <StatGrid
            variant="ink"
            items={connectivity.stats}
            columns={2}
            valueSize={48}
            gap="22px 48px"
            delay={34}
            maxWidth={780}
          />
        </div>

        <div style={{ marginTop: 26 }}>
          <Quote
            variant="ink"
            text={connectivity.quote.text}
            credit={connectivity.quote.credit}
            delay={62}
            size={25}
            maxWidth={760}
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <ClosingLine
            variant="ink"
            plain="Cadastro online, SMS ou QR que abre página web"
            accent="não termina numa fatia grande do território."
            delay={84}
            size={32}
            maxWidth={780}
          />
        </div>
      </div>

      <svg
        width={MAP}
        height={MAP}
        viewBox={`0 0 ${MAP} ${MAP}`}
        style={{ position: "absolute", left: 952, top: 18 }}
      >
        {dots.map((d, i) => {
          const x = px(d.lon);
          const y = py(d.lat);
          const local = Math.max(0, Math.min(1, (sweep - (y / MAP) * 0.55) / 0.2));
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3.2 * local}
              fill="#2F6845"
              opacity={0.5 + 0.5 * local}
            />
          );
        })}

        {roads.map((r, i) => {
          const draw = interpolate(frame, [40 + i * 5, 84 + i * 5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          });
          return (
            <path
              key={`${r.from}-${r.to}`}
              d={r.d}
              fill="none"
              stroke={r.covered ? GREEN : RED}
              strokeWidth={r.covered ? 2.8 : 2.6}
              strokeLinecap="round"
              strokeDasharray={r.covered ? r.len : "6 11"}
              strokeDashoffset={r.covered ? r.len * (1 - draw) : 0}
              opacity={r.covered ? 1 : draw * 0.95}
            />
          );
        })}

        {BR_CAPITALS.map((c, i) => {
          const p = interpolate(frame, [56 + i * 3, 76 + i * 3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <g key={c.city} opacity={p}>
              <circle cx={px(c.lon)} cy={py(c.lat)} r={c.major ? 8 : 5.5} fill="#F2F7F3" />
              {c.major ? (
                <text
                  x={px(c.lon) + LABEL[c.city].dx}
                  y={py(c.lat) + LABEL[c.city].dy}
                  textAnchor={LABEL[c.city].anchor}
                  fill="#F2F7F3"
                  fontFamily={display}
                  fontSize={20}
                  fontWeight={600}
                >
                  {c.city}
                </text>
              ) : null}
            </g>
          );
        })}

        {roads
          .filter((r) => r.covered && r.mark)
          .map((r, i) => {
            const p = interpolate(frame, [96 + i * 7, 116 + i * 7], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            return (
              <g key={`ok-${r.from}-${r.to}`} opacity={p}>
                <HeartMark x={r.mid[0]} y={r.mid[1]} color={GREEN} bg="#08120C" scale={p} />
              </g>
            );
          })}

        {voids.map((r, i) => {
          const p = interpolate(frame, [92 + i * 7, 112 + i * 7], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const blink = 0.72 + 0.28 * Math.sin((frame + i * 13) * 0.16);
          return (
            <g key={`void-${r.from}-${r.to}`} opacity={p}>
              <g opacity={blink}>
                <NoSignal x={r.mid[0]} y={r.mid[1]} color={RED} bg="#08120C" scale={p} />
              </g>
              <SadFace
                x={r.mid[0] + 27}
                y={r.mid[1] + 25}
                color={RED}
                bg="#08120C"
                scale={p * 0.8}
              />
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 952,
          top: 726,
          display: "flex",
          gap: 34,
          alignItems: "center",
          fontFamily: text,
          fontSize: 20,
          color: t.muted,
          opacity: interpolate(frame, [104, 126], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width={72} height={30} viewBox="0 0 72 30">
            <line x1={0} y1={15} x2={34} y2={15} stroke={GREEN} strokeWidth={2.8} />
            <HeartMark x={52} y={15} color={GREEN} bg="#08120C" scale={0.78} />
          </svg>
          corredor com cobertura
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width={72} height={30} viewBox="0 0 72 30">
            <line
              x1={0}
              y1={15}
              x2={34}
              y2={15}
              stroke={RED}
              strokeWidth={2.6}
              strokeDasharray="6 6"
            />
            <SadFace x={52} y={15} color={RED} bg="#08120C" scale={0.78} />
          </svg>
          trecho sem sinal
        </span>
      </div>
    </Frame>
  );
};
