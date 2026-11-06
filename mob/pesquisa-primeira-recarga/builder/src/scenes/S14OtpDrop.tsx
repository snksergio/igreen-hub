import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SectionHead } from "../components/Blocks";
import { Frame, MarkerPill, tone } from "../components/Chrome";
import { Rise, useReveal } from "../components/motion";
import { otpDrop } from "../lib/data";
import { display } from "../lib/fonts";

/**
 * Orçamento vertical (784 úteis):
 * cabeçalho 221 + 18 + gráfico 358 + 18 + bloco passkey ~138 = 753.
 */
const CW = 1260;
const CH = 358;
const PAD_L = 46;
const PAD_R = 130;
const BASE_Y = 300;
const TOP_Y = 34;
const Y_MAX = 100;
const LAST = otpDrop.series.length - 1;

const xAt = (i: number) => PAD_L + (i / LAST) * (CW - PAD_L - PAD_R);
const yAt = (v: number) => BASE_Y - (v / Y_MAX) * (BASE_Y - TOP_Y);

const RULES: { value: number; label: string }[] = [
  { value: otpDrop.ceiling, label: "teto" },
  { value: otpDrop.floor, label: "piso" },
];

export const S14OtpDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("paper");
  const draw = useReveal(26, 74);

  const pts = otpDrop.series.map((d, i) => [xAt(i), yAt(d.value)] as const);
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${pts[LAST][0].toFixed(1)} ${BASE_Y} L${pts[0][0].toFixed(1)} ${BASE_Y} Z`;

  return (
    <Frame
      variant="paper"
      section="O teto do SMS"
      page="14"
      source={otpDrop.source}
      marker={otpDrop.marker}
    >
      <SectionHead
        variant="paper"
        eyebrow="10 — O teto do SMS"
        lines={otpDrop.title}
        size={80}
        note={otpDrop.note}
        titleWidth={880}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 52, marginTop: 18 }}>
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`}>
          <defs>
            <linearGradient id="otpArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00A859" stopOpacity={0.85} />
              <stop offset="58%" stopColor="#00A859" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00A859" stopOpacity={0} />
            </linearGradient>
            <clipPath id="otpClip">
              <rect x={0} y={0} width={CW * draw} height={CH} />
            </clipPath>
          </defs>

          {RULES.map((rule) => (
            <g key={rule.label}>
              <line
                x1={0}
                y1={yAt(rule.value)}
                x2={xAt(LAST) + 24}
                y2={yAt(rule.value)}
                stroke="#93A198"
                strokeWidth={1.6}
                strokeDasharray="8 9"
                opacity={interpolate(frame, [20, 44], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}
              />
              <text
                x={xAt(LAST) + 38}
                y={yAt(rule.value) + 9}
                fill="#5A6960"
                fontSize={25}
                fontWeight={600}
                letterSpacing="0.14em"
                opacity={interpolate(frame, [28, 52], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}
              >
                {rule.label.toUpperCase()}
              </text>
            </g>
          ))}

          {otpDrop.series.map((d, i) => (
            <line
              key={`stem-${i}`}
              x1={xAt(i)}
              y1={yAt(d.value)}
              x2={xAt(i)}
              y2={BASE_Y}
              stroke="#C4CEC6"
              strokeWidth={1.6}
              strokeDasharray="2 7"
              opacity={draw >= i / LAST ? 0.9 : 0}
            />
          ))}

          <g clipPath="url(#otpClip)">
            <path d={area} fill="url(#otpArea)" />
            <path
              d={line}
              fill="none"
              stroke="#00874A"
              strokeWidth={4.2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>

          <line x1={0} y1={BASE_Y} x2={CW} y2={BASE_Y} stroke="#0A140E" strokeWidth={1.6} />

          {otpDrop.series.map((d, i) => {
            const shown = draw >= i / LAST;
            return (
              <g key={`pt-${i}`}>
                <circle cx={xAt(i)} cy={yAt(d.value)} r={shown ? 8 : 0} fill="#0A140E" />
                <text
                  x={xAt(i)}
                  y={yAt(d.value) - 26}
                  textAnchor="middle"
                  fill="#0A140E"
                  fontFamily={display}
                  fontSize={32}
                  fontWeight={600}
                  letterSpacing="-0.03em"
                  opacity={shown ? 1 : 0}
                >
                  {d.value}%
                </text>
                {d.label ? (
                  <text
                    x={xAt(i)}
                    y={BASE_Y + 42}
                    textAnchor="middle"
                    fill="#5A6960"
                    fontSize={25}
                    fontWeight={500}
                    opacity={shown ? 1 : 0.28}
                  >
                    {d.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        <Rise delay={58} distance={26} duration={28} style={{ flex: 1 }}>
          <div
            style={{
              boxSizing: "border-box",
              borderRadius: 26,
              border: `1.5px solid ${t.hairline}`,
              backgroundColor: "#FFFFFF",
              padding: 30,
              boxShadow: "0 1px 0 rgba(11,14,11,0.05), 0 22px 54px rgba(11,14,11,0.05)",
            }}
          >
            <div
              style={{
                fontFamily: display,
                fontSize: 84,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: t.accentText,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {otpDrop.secondEvent}
            </div>
            <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.35, color: t.muted }}>
              {otpDrop.secondEventLabel}
            </div>
          </div>
        </Rise>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 56,
          marginTop: 18,
          paddingTop: 20,
          borderTop: `1.5px solid ${t.hairline}`,
        }}
      >
        <div style={{ flex: "0 0 640px" }}>
          <Rise delay={70} distance={16} duration={22}>
            <div style={{ display: "flex", height: 30 }}>
              <div style={{ flex: "0 0 200px" }} />
              <div
                style={{
                  flex: "0 0 220px",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: t.accentText,
                }}
              >
                Passkey
              </div>
              <div
                style={{
                  flex: "0 0 220px",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: t.muted,
                }}
              >
                MFA
              </div>
            </div>
          </Rise>

          {otpDrop.passkey.rows.map((row, i) => (
            <Rise key={row.label} delay={76 + i * 7} distance={16} duration={22}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 44,
                  borderTop: `1.5px solid ${t.hairline}`,
                }}
              >
                <div style={{ flex: "0 0 200px", fontSize: 24, fontWeight: 500, color: t.muted }}>
                  {row.label}
                </div>
                <div
                  style={{
                    flex: "0 0 220px",
                    fontFamily: display,
                    fontSize: 30,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: t.accentText,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {row.passkey}
                </div>
                <div
                  style={{
                    flex: "0 0 220px",
                    fontFamily: display,
                    fontSize: 30,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: t.fg,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {row.mfa}
                </div>
              </div>
            </Rise>
          ))}
        </div>

        <Rise delay={84} distance={16} duration={22} style={{ flex: 1, paddingTop: 4 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 22 }}>
            <MarkerPill kind={otpDrop.passkey.marker} variant="paper" />
            <div style={{ flex: 1, maxWidth: 700, fontSize: 23, lineHeight: 1.45, color: t.muted }}>
              {otpDrop.passkey.caveat}
            </div>
          </div>
        </Rise>
      </div>
    </Frame>
  );
};
