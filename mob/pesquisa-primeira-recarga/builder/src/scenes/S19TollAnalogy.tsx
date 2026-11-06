import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { ContourField } from "../components/Backdrops";
import { NoteText, SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { SlideIn, useReveal } from "../components/motion";
import { tollAnalogy } from "../lib/data";
import { display } from "../lib/fonts";

const COL_W = 700;
const ROW_H = 62;

const Arrow: React.FC<{ color: string; progress: number }> = ({
  color,
  progress,
}) => (
  <svg width={64} height={22} viewBox="0 0 64 22">
    <path
      d="M2 11 H52 M44 4.5 L52 11 L44 17.5"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={90}
      strokeDashoffset={90 * (1 - progress)}
    />
  </svg>
);

/**
 * Orçamento vertical: cabeçalho 198 + 18 + cabeça de coluna 43 +
 * 4 linhas de 62 = 248 + 18 + destaque 161 + 14 + nota 66 = 766 dos 784.
 */
export const S19TollAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("forest");
  const arrows = useReveal(44, 34);

  return (
    <Frame
      variant="forest"
      section="A tag do pedágio"
      page="19"
      source={tollAnalogy.source}
      marker={tollAnalogy.marker}
      backdrop={
        <ContourField
          cx={1600}
          cy={880}
          rings={16}
          gap={66}
          r0={110}
          color="#5DD389"
          opacity={0.06}
          strokeWidth={1.3}
        />
      }
    >
      <SectionHead
        variant="forest"
        eyebrow="15 — A tag do pedágio"
        lines={tollAnalogy.title}
        size={68}
        accentLine={1}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          marginTop: 18,
          paddingBottom: 12,
          borderBottom: `2px solid ${t.hairline}`,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: t.muted,
          opacity: interpolate(frame, [26, 46], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <div style={{ flex: `0 0 ${COL_W}px`, textAlign: "right" }}>Pedágio</div>
        <div style={{ flex: 1 }} />
        <div style={{ flex: `0 0 ${COL_W}px` }}>Eletroposto</div>
      </div>

      {tollAnalogy.rows.map((r, i) => (
        <div
          key={r.toll}
          style={{
            display: "flex",
            alignItems: "center",
            height: ROW_H,
            borderBottom: `1.5px solid ${t.hairline}`,
          }}
        >
          <SlideIn
            delay={34 + i * 7}
            distance={44}
            duration={26}
            style={{ flex: `0 0 ${COL_W}px` }}
          >
            <div
              style={{
                textAlign: "right",
                fontSize: 25,
                lineHeight: 1.3,
                color: t.fg,
              }}
            >
              {r.toll}
            </div>
          </SlideIn>

          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Arrow
              color={t.accentText}
              progress={Math.max(0, Math.min(1, (arrows - i * 0.14) / 0.5))}
            />
          </div>

          <SlideIn
            delay={38 + i * 7}
            distance={-44}
            duration={26}
            style={{ flex: `0 0 ${COL_W}px` }}
          >
            <div style={{ fontSize: 25, lineHeight: 1.3, color: t.fg }}>
              {r.ev}
            </div>
          </SlideIn>
        </div>
      ))}

      <div
        style={{
          marginTop: 18,
          borderRadius: 24,
          backgroundColor: "#5DD389",
          padding: "22px 30px",
          display: "flex",
          alignItems: "flex-start",
          gap: 40,
          opacity: interpolate(frame, [74, 100], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [74, 100], ["0px 28px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <div style={{ flex: "0 0 660px" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#08120C",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {tollAnalogy.highlight.head}
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: display,
              fontSize: 30,
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: "-0.028em",
              color: "#08120C",
            }}
          >
            {tollAnalogy.highlight.accent}
          </div>
        </div>
        <div style={{ flex: 1, fontSize: 26, lineHeight: 1.5, color: "#08120C" }}>
          {tollAnalogy.highlight.body}
        </div>
      </div>

      <NoteText
        variant="forest"
        delay={92}
        size={22}
        maxWidth={1500}
        style={{ marginTop: 14 }}
      >
        {tollAnalogy.note}
      </NoteText>
    </Frame>
  );
};
