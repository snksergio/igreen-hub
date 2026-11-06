import React from "react";
import { ClosingLine, SectionHead } from "../components/Blocks";
import { IgreenWatermark } from "../components/Logo";
import { Frame, tone } from "../components/Chrome";

import { Rise, useReveal } from "../components/motion";
import { regulators } from "../lib/data";
import { display } from "../lib/fonts";
import { landLattice, project } from "../lib/geo";

const MAP_W = 660;
const MAP_H = 246;
const LAT_MIN = -56;
const LAT_MAX = 78;

const DOTS = landLattice(3, LAT_MIN, LAT_MAX);

/**
 * Bruxelas e Londres caem a ~8 px uma da outra nesta projeção. Os rótulos
 * saem em direções opostas — Londres para cima-esquerda, Bruxelas para
 * baixo-direita — para que nem o texto nem as guias se cruzem.
 */
const LABELS: Record<
  string,
  { dx: number; dy: number; anchor: "start" | "end" }
> = {
  Bruxelas: { dx: 28, dy: 32, anchor: "start" },
  Londres: { dx: -26, dy: -34, anchor: "end" },
  Washington: { dx: -22, dy: 36, anchor: "end" },
};

/**
 * Orçamento vertical: cabeçalho 221 + 18 + faixa mapa/stat 246 + 20 +
 * cards 268 = 773 dos 784 disponíveis.
 */
export const S16Regulators: React.FC = () => {
  const t = tone("ink");
  const sweep = useReveal(12, 58);

  return (
    <Frame
      variant="ink"
      section="O que o mundo provou"
      page="16"
      source={regulators.source}
      marker={regulators.marker}
      backdrop={<IgreenWatermark color="#5DD389" opacity={0.04} />}
    >
      <SectionHead
        variant="ink"
        eyebrow="12 — O que o mundo provou"
        lines={regulators.title}
        size={80}
        accentLine={1}
      />

      <div style={{ display: "flex", gap: 56, marginTop: 18 }}>
        <svg
          width={MAP_W}
          height={MAP_H}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          style={{ display: "block", flex: `0 0 ${MAP_W}px` }}
        >
          {DOTS.map((d, i) => {
            const { x, y } = project(d.lon, d.lat, MAP_W, MAP_H, LAT_MIN, LAT_MAX);
            const local = Math.max(
              0,
              Math.min(1, (sweep - (x / MAP_W) * 0.7) / 0.18),
            );
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={1.9 * local}
                fill="rgba(234,246,238,0.22)"
              />
            );
          })}

          {regulators.pins.map((p, i) => {
            const { x, y } = project(p.lon, p.lat, MAP_W, MAP_H, LAT_MIN, LAT_MAX);
            const o = LABELS[p.city];
            const reveal = Math.max(
              0,
              Math.min(1, (sweep - 0.5 - i * 0.06) / 0.22),
            );
            return (
              <g key={p.city} opacity={reveal}>
                <circle
                  cx={x}
                  cy={y}
                  r={9 + (1 - reveal) * 22}
                  fill="none"
                  stroke="#5DD389"
                  strokeWidth={1.6}
                  opacity={(1 - reveal) * 0.7}
                />
                <circle cx={x} cy={y} r={8} fill="#08120C" />
                <circle cx={x} cy={y} r={5} fill="#5DD389" />
                <line
                  x1={x + (o.anchor === "end" ? -7 : 7)}
                  y1={y}
                  x2={x + o.dx}
                  y2={y + o.dy}
                  stroke="#5DD389"
                  strokeWidth={1.3}
                  opacity={0.55}
                />
                <text
                  x={x + o.dx + (o.anchor === "end" ? -7 : 7)}
                  y={y + o.dy + 7}
                  textAnchor={o.anchor}
                  fill={t.fg}
                  fontFamily={display}
                  fontSize={21}
                  fontWeight={600}
                  letterSpacing="-0.012em"
                >
                  {p.city}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          style={{
            flex: 1,
            borderTop: `1.5px solid ${t.hairline}`,
            paddingTop: 18,
          }}
        >
          <Rise delay={54} distance={26} duration={28}>
            <div
              style={{
                fontFamily: display,
                fontSize: 50,
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "#5DD389",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {regulators.headline}
            </div>
          </Rise>
          <Rise delay={62} distance={18} duration={24}>
            <div
              style={{
                marginTop: 12,
                fontSize: 22,
                lineHeight: 1.5,
                color: t.muted,
              }}
            >
              {regulators.headlineCaption}
            </div>
          </Rise>
          <ClosingLine
            variant="ink"
            plain={regulators.closing}
            delay={76}
            size={32}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
        {regulators.cards.map((c, i) => (
          <Rise
            key={c.place}
            delay={62 + i * 8}
            distance={30}
            duration={26}
            style={{ flex: 1 }}
          >
            <div
              style={{
                height: 268,
                boxSizing: "border-box",
                borderRadius: 24,
                backgroundColor: "rgba(234,246,238,0.05)",
                border: `1.5px solid ${t.hairline}`,
                padding: "22px 24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontFamily: display,
                  fontSize: 30,
                  fontWeight: 600,
                  lineHeight: 1.1,
                  letterSpacing: "-0.024em",
                  color: t.fg,
                }}
              >
                {c.place}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 19,
                  fontWeight: 500,
                  lineHeight: 1.35,
                  color: t.muted,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {c.norm}
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 22,
                  lineHeight: 1.45,
                  color: t.fg,
                }}
              >
                {c.body}
              </div>
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 12,
                  fontSize: 20,
                  lineHeight: 1.4,
                  color: t.muted,
                }}
              >
                {c.foot}
              </div>
            </div>
          </Rise>
        ))}
      </div>
    </Frame>
  );
};
