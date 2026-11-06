import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Asset } from "../components/Asset";
import { ClosingLine, NoteText, Quote, SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { BoltGlyph } from "../components/EvAssets";
import { Rise, Ticker, useReveal } from "../components/motion";
import { moneyDonut } from "../lib/data";
import { display } from "../lib/fonts";

const SIZE = 460;
const RADIUS = 180;
const RING = 56;
const CIRC = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

/** Coluna direita: 560 de largura para o donut de 460 caber com o raio ao lado. */
const RIGHT_W = 560;

const SLICES = [
  { key: "money", value: moneyDonut.money, color: "#5DD389" },
  {
    key: "rest",
    value: moneyDonut.total - moneyDonut.money,
    color: "rgba(234,246,238,0.12)",
  },
];

export const S06MoneyDonut: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("forest");
  const sweep = useReveal(24, 62);
  const shown = sweep * CIRC;

  let cursor = 0;
  const segments = SLICES.map((s) => {
    const start = cursor;
    const length = (s.value / moneyDonut.total) * CIRC;
    cursor += length;
    return { ...s, start, length };
  });

  // Meio da fatia de dinheiro, medido do topo, para ancorar o raio do lado de fora.
  const midAngle =
    (-90 + (segments[0].length / CIRC) * 180) * (Math.PI / 180);
  const markerR = RADIUS + RING / 2 + 26;

  return (
    <Frame
      variant="forest"
      section="O problema nº 1"
      page="06"
      source={moneyDonut.source}
      marker={moneyDonut.marker}
    >
      <SectionHead
        variant="forest"
        eyebrow="04 — O problema nº 1"
        lines={moneyDonut.title}
        size={80}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
          marginTop: 40,
        }}
      >
        <div style={{ flex: 1 }}>
          {/* A carteira fica ao lado da citação, não acima: acima somaria 232 px
              à coluna e a página passaria dos 784 px úteis. */}
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Rise delay={30} distance={22} duration={28} style={{ flexShrink: 0 }}>
              <Asset name="ilustracao9" width={210} />
            </Rise>

            <Quote
              variant="forest"
              text={moneyDonut.quote.text}
              credit={moneyDonut.quote.credit}
              delay={38}
              size={40}
              maxWidth={820}
            />
          </div>

          <div style={{ marginTop: 40 }}>
            <ClosingLine
              variant="forest"
              plain={moneyDonut.closing}
              delay={58}
              size={44}
              maxWidth={900}
            />
          </div>

          <NoteText
            variant="forest"
            delay={74}
            size={26}
            maxWidth={820}
            style={{ marginTop: 26 }}
          >
            {moneyDonut.breakdown}
          </NoteText>
        </div>

        <div
          style={{
            flex: `0 0 ${RIGHT_W}px`,
            position: "relative",
            height: SIZE,
          }}
        >
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {segments.map((s) => {
              const visible = Math.max(
                0,
                Math.min(s.length - 5, shown - s.start),
              );
              return (
                <circle
                  key={s.key}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={RING}
                  strokeDasharray={`${visible} ${CIRC - visible}`}
                  strokeDashoffset={-s.start}
                  transform={`rotate(-90 ${CENTER} ${CENTER})`}
                />
              );
            })}
          </svg>

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: SIZE,
              height: SIZE,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: interpolate(frame, [50, 76], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            <div
              style={{
                fontFamily: display,
                fontSize: 86,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.045em",
                color: t.fg,
              }}
            >
              <Ticker to={moneyDonut.percent} suffix="%" delay={50} duration={44} />
            </div>
            <div
              style={{
                marginTop: 12,
                maxWidth: 240,
                textAlign: "center",
                fontSize: 24,
                fontWeight: 500,
                lineHeight: 1.35,
                color: t.muted,
              }}
            >
              {moneyDonut.centerCaption}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: CENTER + Math.cos(midAngle) * markerR - 22,
              top: CENTER + Math.sin(midAngle) * markerR - 22,
              opacity: interpolate(frame, [72, 94], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            <BoltGlyph size={44} color="#5DD389" />
          </div>
        </div>
      </div>
    </Frame>
  );
};
