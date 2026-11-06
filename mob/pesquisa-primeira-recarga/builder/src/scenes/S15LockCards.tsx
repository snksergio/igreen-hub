import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Asset } from "../components/Asset";
import { DotGrid } from "../components/Backdrops";
import { Card, ClosingLine, SectionHead, cardInk } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { lockCards } from "../lib/data";

/**
 * Orçamento vertical (784 úteis):
 * cabeçalho 213 (size 76) + 52 + cards 330 + 56 + fechamento ~56 = 707.
 *
 * O carro ocupa a faixa 1392–1712 px, à direita do `titleWidth` de 1120 — é
 * o "cabo não sai" do primeiro card, não decoração solta. O asset é quadrado,
 * então sobe 58 px para dentro da margem superior e termina em 262, acima dos
 * cards que começam em 265.
 */
const CARD_H = 330;
const TITLE_W = 1120;

export const S15LockCards: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("light");
  const ink = cardInk("light", "plain");

  return (
    <Frame
      variant="light"
      section="O app como fechadura"
      page="15"
      source={lockCards.source}
      marker={lockCards.marker}
      backdrop={<DotGrid color="#BAC4BC" step={44} radius={1.3} opacity={0.3} />}
    >
      <div style={{ position: "relative" }}>
        <SectionHead
          variant="light"
          eyebrow="11 — O app como fechadura"
          lines={lockCards.title}
          size={76}
          titleWidth={TITLE_W}
        />
        <div style={{ position: "absolute", right: 0, top: -58 }}>
          <Asset
            name="carro2"
            width={320}
            style={{
              opacity: interpolate(frame, [18, 56], [0, 0.9], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(frame, [18, 56], ["0px 24px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 52 }}>
        {lockCards.cards.map((card, i) => (
          <Card
            key={card.label}
            variant="light"
            width={410}
            height={CARD_H}
            delay={26 + i * 8}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: ink.muted,
              }}
            >
              {card.label}
            </div>
            <div style={{ marginTop: 16, fontSize: 23, lineHeight: 1.45, color: ink.fg }}>
              {card.body}
            </div>
            {card.quote ? (
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 20,
                  display: "flex",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    flex: "0 0 3px",
                    borderRadius: 999,
                    backgroundColor: t.accentText,
                  }}
                />
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    lineHeight: 1.36,
                    letterSpacing: "0.004em",
                    color: ink.fg,
                  }}
                >
                  {card.quote}
                </div>
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 56 }}>
        <ClosingLine
          variant="light"
          plain={lockCards.closing.body}
          accent={lockCards.closing.accent}
          size={44}
          delay={74}
        />
      </div>
    </Frame>
  );
};
