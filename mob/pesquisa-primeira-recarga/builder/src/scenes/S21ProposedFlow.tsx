import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Asset, type AssetName } from "../components/Asset";
import { DotGrid } from "../components/Backdrops";
import { NoteText, SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { Rise } from "../components/motion";
import { proposedFlow } from "../lib/data";

const CARD_W = 396;
const CARD_H = 340;
const STEP_X = 426;
const STEP_Y = 34;
const BASELINE = STEP_Y * 3 + CARD_H;

/**
 * Uma ilustração por fase. O conteúdo do card ocupa ~286 dos 340 px, então o
 * asset entra sobreposto no canto inferior direito — abaixo da última linha
 * de pontos e à direita dela — em vez de crescer o card.
 *
 * O recuo de 18 px é o que mantém o selo inteiro dentro do card: o raio de
 * 24 px do canto morde qualquer coisa encostada na borda, e o `overflow`
 * escondido do card corta o que sobra em vez de deixar vazar.
 */
const PHASE_ASSETS: Record<string, AssetName> = {
  Chegar: "ilustracao2",
  Pagar: "ilustracao6",
  Carregar: "ilustracao7",
  Voltar: "ilustracao9",
};

export const S21ProposedFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("paper");

  return (
    <Frame
      variant="paper"
      section="O fluxo proposto"
      page="21"
      source={proposedFlow.source}
      marker={proposedFlow.marker}
      backdrop={<DotGrid color="#CCD6CE" step={44} radius={1.3} opacity={0.34} />}
    >
      <div>
        <SectionHead
          variant="paper"
          eyebrow="17 — O fluxo proposto"
          lines={proposedFlow.title}
          size={72}
        />

        <div style={{ position: "relative", height: BASELINE, marginTop: 28 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: BASELINE - 1,
              height: 1.5,
              backgroundColor: t.hairline,
              transformOrigin: "left center",
              scale: interpolate(frame, [26, 66], ["0 1", "1 1"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          />

          {proposedFlow.phases.map((phase, i) => {
            const top = (proposedFlow.phases.length - 1 - i) * STEP_Y;
            const first = i === 0;
            return (
              <div
                key={phase.stage}
                style={{ position: "absolute", left: i * STEP_X, top }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: CARD_H,
                    width: 1.5,
                    height: BASELINE - top - CARD_H,
                    backgroundColor: t.hairline,
                    transformOrigin: "top center",
                    scale: interpolate(
                      frame,
                      [40 + i * 8, 70 + i * 8],
                      ["1 0", "1 1"],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      },
                    ),
                  }}
                />
                <Rise delay={30 + i * 8} distance={40} duration={30}>
                  <div
                    style={{
                      position: "relative",
                      width: CARD_W,
                      height: CARD_H,
                      boxSizing: "border-box",
                      borderRadius: 24,
                      backgroundColor: "#FFFFFF",
                      border: `1.5px solid ${t.hairline}`,
                      boxShadow: "0 22px 54px rgba(11,14,11,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: first ? 8 : 4,
                        backgroundColor: first ? "#00A859" : "#0A140E",
                        transformOrigin: "left center",
                        scale: interpolate(
                          frame,
                          [36 + i * 8, 64 + i * 8],
                          ["0 1", "1 1"],
                          {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(0.16, 1, 0.3, 1),
                          },
                        ),
                      }}
                    />
                    <Asset
                      name={PHASE_ASSETS[phase.stage]}
                      width={64}
                      style={{ position: "absolute", right: 18, bottom: 18 }}
                    />
                    <div style={{ padding: "22px 30px 24px" }}>
                      <div
                        style={{
                          fontSize: 21,
                          fontWeight: 600,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: first ? t.accentText : t.muted,
                        }}
                      >
                        {phase.stage}
                      </div>
                      <div
                        style={{
                          marginTop: 12,
                          fontSize: 23,
                          lineHeight: 1.46,
                          color: "#5A6960",
                        }}
                      >
                        {phase.body}
                      </div>
                      <div
                        style={{
                          marginTop: 16,
                          paddingTop: 14,
                          borderTop: `1.5px solid ${t.hairline}`,
                        }}
                      >
                        {phase.points.map((p) => (
                          <div
                            key={p}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              marginBottom: 7,
                              fontSize: 21,
                              fontWeight: 500,
                              color: t.fg,
                            }}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: 999,
                                backgroundColor: first ? "#00874A" : "#B4C0B7",
                              }}
                            />
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Rise>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 22 }}>
          <div
            style={{
              height: 1.5,
              backgroundColor: t.hairline,
              transformOrigin: "left center",
              scale: interpolate(frame, [84, 116], ["0 1", "1 1"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          />
          <NoteText variant="paper" delay={90} style={{ paddingTop: 14 }}>
            {proposedFlow.lgpd}
          </NoteText>
        </div>
      </div>
    </Frame>
  );
};
