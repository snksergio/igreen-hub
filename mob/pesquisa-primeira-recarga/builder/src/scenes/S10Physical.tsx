import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Asset, type AssetName } from "../components/Asset";
import { DotGrid } from "../components/Backdrops";
import { Card, cardInk, NoteText, SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { ConnectorGlyph } from "../components/EvAssets";
import { Rise } from "../components/motion";
import { physical } from "../lib/data";

type ConnectorKind = React.ComponentProps<typeof ConnectorGlyph>["kind"];

/** Um render por card, na ordem de `physical.cards`. */
const CARD_ASSETS: AssetName[] = [
  "ilustracao4",
  "bomba2",
  "ilustracao5",
  "ilustracao3",
];

export const S10Physical: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("light");

  return (
    <Frame
      variant="light"
      section="O totem ao sol"
      page="10"
      source={physical.source}
      marker={physical.marker}
      backdrop={<DotGrid color="#BAC4BC" step={44} radius={1.3} opacity={0.3} />}
    >
      {/* Fora do fluxo, à direita do título (que tem 1180 px) e acima da faixa
          de cards, que começa em 280. O recuo de 100 abre a coluna vertical
          entre os selos dos cards 3 e 4, para os renders não se tocarem. */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: 100,
          opacity: interpolate(frame, [16, 54], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [16, 54], ["0px 28px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <Asset name="bomba1" width={330} />
      </div>

      <SectionHead
        variant="light"
        eyebrow="07 — O totem ao sol"
        lines={physical.title}
        size={80}
        titleWidth={1180}
      />

      <div style={{ display: "flex", gap: 24, marginTop: 58 }}>
        {physical.cards.map((c, i) => {
          const emphasis = i === 2 ? "dark" : "plain";
          const ink = cardInk("light", emphasis);
          return (
            <Card
              key={c.label}
              variant="light"
              emphasis={emphasis}
              width={410}
              height={340}
              delay={26 + i * 8}
            >
              {/* Caixa de altura zero: o render encosta no canto do card sem
                  entrar na conta dos 340 px nem cair sobre o micro-label. */}
              <div style={{ position: "relative", height: 0 }}>
                <div style={{ position: "absolute", top: -58, right: -8 }}>
                  <Asset name={CARD_ASSETS[i]} width={92} />
                </div>
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: ink.muted,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontSize: 24,
                  lineHeight: 1.42,
                  color: ink.fg,
                }}
              >
                {c.body}
              </div>
              <div
                style={{
                  marginTop: "auto",
                  fontSize: 21,
                  lineHeight: 1.4,
                  color: ink.muted,
                }}
              >
                {c.foot}
              </div>
            </Card>
          );
        })}
      </div>

      <div
        style={{
          height: 2,
          marginTop: 26,
          borderRadius: 999,
          backgroundColor: t.hairline,
          transformOrigin: "left center",
          scale: interpolate(frame, [56, 92], ["0 1", "1 1"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 60,
          paddingTop: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 64 }}>
          {physical.connectors.map((kind, i) => (
            <Rise key={kind} delay={62 + i * 7} distance={20} duration={26}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <ConnectorGlyph
                  kind={kind as ConnectorKind}
                  size={72}
                  color={t.fg}
                />
                <span style={{ fontSize: 19, fontWeight: 500, color: t.muted }}>
                  {kind}
                </span>
              </div>
            </Rise>
          ))}
        </div>

        <NoteText variant="light" delay={86} size={24} maxWidth={480}>
          {physical.connectorCaption}
        </NoteText>
      </div>
    </Frame>
  );
};
