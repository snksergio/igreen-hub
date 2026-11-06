import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DotGrid } from "../components/Backdrops";
import { NoteText, SectionHead } from "../components/Blocks";
import { Frame, MarkerPill, tone } from "../components/Chrome";
import { Rise } from "../components/motion";
import { brazilRails } from "../lib/data";
import { display } from "../lib/fonts";

const R = 124;
const STROKE = 18;
/** Arco de 270°, aberto embaixo: sobra o miolo para a porcentagem. */
const ARC = 0.75;
const C = 2 * Math.PI * R;
const BOX_W = (R + STROKE / 2) * 2;
/** Só a metade superior do círculo é usada; a caixa acompanha. */
const BOX_H = Math.round(R + STROKE / 2 + R * Math.SQRT1_2 + STROKE / 2);
const CX = BOX_W / 2;
const CY = R + STROKE / 2;

const Gauge: React.FC<{ value: number; color: string; progress: number }> = ({
  value,
  color,
  progress,
}) => (
  <svg width={BOX_W} height={BOX_H} viewBox={`0 0 ${BOX_W} ${BOX_H}`}>
    <circle
      cx={CX}
      cy={CY}
      r={R}
      fill="none"
      stroke="#D7DED8"
      strokeWidth={STROKE}
      strokeDasharray={`${C * ARC} ${C}`}
      transform={`rotate(135 ${CX} ${CY})`}
    />
    <circle
      cx={CX}
      cy={CY}
      r={R}
      fill="none"
      stroke={color}
      strokeWidth={STROKE}
      strokeDasharray={`${C * ARC * (value / 100) * progress} ${C}`}
      transform={`rotate(135 ${CX} ${CY})`}
    />
    <text
      x={CX}
      y={CY + 22}
      textAnchor="middle"
      fill="#0A140E"
      fontFamily={display}
      fontSize={64}
      fontWeight={600}
      letterSpacing="-0.045em"
    >
      {Math.round(value * progress)}%
    </text>
  </svg>
);

/**
 * Orçamento vertical: cabeçalho 214 + 20 + faixa medidores/corte 338 +
 * 26 + notas 115 + 20 + aviso 33 = 766 dos 784.
 */
export const S18BrazilRails: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("light");

  return (
    <Frame
      variant="light"
      section="O que o Brasil tem"
      page="18"
      source={brazilRails.source}
      marker={brazilRails.marker}
      backdrop={<DotGrid color="#BAC4BC" step={44} radius={1.3} opacity={0.3} />}
    >
      <SectionHead
        variant="light"
        eyebrow="14 — O que o Brasil tem"
        lines={brazilRails.title}
        size={76}
        accentLine={1}
        titleWidth={1080}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 56,
          marginTop: 20,
        }}
      >
        <div style={{ display: "flex", gap: 40 }}>
          {brazilRails.gauges.map((g, i) => (
            <Rise key={g.label} delay={26 + i * 9} distance={30} duration={28}>
              <div style={{ width: BOX_W, textAlign: "center" }}>
                <Gauge
                  value={g.value}
                  color={i === 1 ? t.accentText : "#0A140E"}
                  progress={interpolate(
                    frame,
                    [32 + i * 9, 88 + i * 9],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  )}
                />
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: display,
                    fontSize: 30,
                    fontWeight: 600,
                    letterSpacing: "-0.024em",
                    color: "#0A140E",
                  }}
                >
                  {g.label}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 20,
                    lineHeight: 1.4,
                    color: t.muted,
                  }}
                >
                  {g.caption}
                </div>
              </div>
            </Rise>
          ))}
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px 24px",
          }}
        >
          {brazilRails.cut.map(([label, value], i) => (
            <Rise key={label} delay={64 + i * 5} distance={18} duration={22}>
              <div style={{ borderTop: `1.5px solid ${t.hairline}`, paddingTop: 12 }}>
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 40,
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    color: "#0A140E",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 20,
                    fontWeight: 500,
                    color: t.muted,
                  }}
                >
                  {label}
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 40, marginTop: 26 }}>
        <Rise delay={92} distance={20} duration={24} style={{ flex: 1 }}>
          <div
            style={{
              borderTop: `1.5px solid ${t.hairline}`,
              paddingTop: 14,
              fontSize: 22,
              lineHeight: 1.5,
              color: "#5A6960",
            }}
          >
            {brazilRails.notes[0]}
          </div>
        </Rise>
        <Rise delay={100} distance={20} duration={24} style={{ flex: 1 }}>
          <div
            style={{
              borderTop: `1.5px solid ${t.hairline}`,
              paddingTop: 14,
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <MarkerPill kind="hipotese" variant="light" />
            <div style={{ fontSize: 22, lineHeight: 1.5, color: "#5A6960" }}>
              {brazilRails.notes[1]}
            </div>
          </div>
        </Rise>
      </div>

      <NoteText
        variant="light"
        delay={108}
        size={22}
        maxWidth={1500}
        style={{ marginTop: 20 }}
      >
        <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 12 }}>
          <svg width={22} height={20} viewBox="0 0 22 20" style={{ marginTop: 6 }}>
            <path
              d="M11 2.2 L20.4 18.4 L1.6 18.4 Z"
              fill="none"
              stroke={t.muted}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
            <path
              d="M11 8 L11 12.8"
              stroke={t.muted}
              strokeWidth={1.8}
              strokeLinecap="round"
            />
            <circle cx={11} cy={15.6} r={1.2} fill={t.muted} />
          </svg>
          <span>{brazilRails.warning}</span>
        </span>
      </NoteText>
    </Frame>
  );
};
