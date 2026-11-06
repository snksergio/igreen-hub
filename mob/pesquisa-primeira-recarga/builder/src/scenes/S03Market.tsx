import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Card, cardInk, SectionHead } from "../components/Blocks";
import { Frame, Pill } from "../components/Chrome";
import { market } from "../lib/data";
import { display } from "../lib/fonts";

/**
 * Ordem de ênfase: o card 3 (veículos por ponto) é o cálculo próprio e vai em
 * preto; o card 4 (rodovia sem dados) é o único destaque em lime, porque é o
 * dado que sustenta o resto do deck.
 */
const EMPHASIS = ["plain", "plain", "dark", "accent"] as const;

const PILL_INK = (emphasis: (typeof EMPHASIS)[number]) => {
  if (emphasis === "accent") return { bg: "rgba(11,14,11,0.10)", fg: "#0A140E" };
  if (emphasis === "dark") return { bg: "rgba(93,211,137,0.14)", fg: "#00A859" };
  return { bg: "#E8EFE9", fg: "#0A4F2C" };
};

export const S03Market: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame
      variant="light"
      section="O mercado real"
      page="03"
      source={market.source}
      marker={market.marker}
    >
      <SectionHead
        variant="light"
        eyebrow="01 — O mercado real"
        lines={market.title}
        size={88}
        note={market.note}
        titleWidth={880}
      />

      <div style={{ display: "flex", gap: 24, marginTop: 48 }}>
        {market.cards.map((card, i) => {
          const emphasis = EMPHASIS[i];
          const ink = cardInk("light", emphasis);
          const pill = PILL_INK(emphasis);
          return (
            <Card
              key={card.label}
              variant="light"
              emphasis={emphasis}
              width={410}
              height={400}
              delay={30 + i * 7}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  lineHeight: 1.3,
                  color: ink.muted,
                  minHeight: 58,
                }}
              >
                {card.label}
              </div>

              <div style={{ overflow: "hidden", paddingBottom: 6 }}>
                <div
                  style={{
                    fontFamily: display,
                    fontSize: 76,
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    color: ink.fg,
                    fontVariantNumeric: "tabular-nums",
                    translate: interpolate(
                      frame,
                      [36 + i * 7, 68 + i * 7],
                      ["0px 116%", "0px 0%"],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      },
                    ),
                  }}
                >
                  {card.display}
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  opacity: interpolate(frame, [48 + i * 7, 72 + i * 7], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                }}
              >
                <Pill fg={pill.fg} bg={pill.bg} size={22}>
                  {card.pill}
                </Pill>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  fontSize: 23,
                  lineHeight: 1.4,
                  color: ink.muted,
                }}
              >
                {card.note}
              </div>
            </Card>
          );
        })}
      </div>
    </Frame>
  );
};
