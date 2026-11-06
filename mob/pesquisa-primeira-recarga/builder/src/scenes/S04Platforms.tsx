import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { BoltWatermark } from "../components/EvAssets";
import { Rise } from "../components/motion";
import { platforms } from "../lib/data";
import { display } from "../lib/fonts";

const LABEL_W = 430;
const TRACK_W = 760;
const ROW_H = 86;
const BAR_H = 34;

/** A escala é a maior plataforma; nenhuma barra pode passar do trilho. */
const AXIS_MAX = Math.max(...platforms.rows.map((r) => r.count));

export const S04Platforms: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("ink");

  return (
    <Frame
      variant="ink"
      section="Quem manda na plataforma"
      page="04"
      source={platforms.source}
      marker={platforms.marker}
      backdrop={<BoltWatermark color="#5DD389" opacity={0.03} />}
    >
      <SectionHead
        variant="ink"
        eyebrow="02 — Quem manda na plataforma"
        lines={platforms.title}
        size={76}
      />

      <div style={{ marginTop: 24 }}>
        {platforms.rows.map((row, i) => (
          <Rise key={row.name} delay={26 + i * 7} distance={18} duration={22}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: ROW_H,
                borderTop: `1.5px solid ${i === 0 ? "rgba(93,211,137,0.3)" : t.hairline}`,
              }}
            >
              <div style={{ width: LABEL_W, paddingRight: 12, boxSizing: "border-box" }}>
                <div style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.2, color: t.fg }}>
                  {row.name}
                </div>
                {/* Uma linha só: a lista mais longa mede ~410 px nos 418 disponíveis. */}
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 19,
                    fontWeight: 400,
                    lineHeight: 1.3,
                    color: t.muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.examples}
                </div>
              </div>

              <div
                style={{
                  width: TRACK_W,
                  height: BAR_H,
                  borderRadius: 8,
                  backgroundColor: "rgba(242,247,243,0.05)",
                }}
              >
                <div
                  style={{
                    width: (row.count / AXIS_MAX) * TRACK_W,
                    height: BAR_H,
                    borderRadius: 8,
                    backgroundColor:
                      row.count === AXIS_MAX ? "#5DD389" : "rgba(93,211,137,0.35)",
                    transformOrigin: "left center",
                    scale: interpolate(
                      frame,
                      [30 + i * 7, 64 + i * 7],
                      ["0 1", "1 1"],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      },
                    ),
                  }}
                />
              </div>

              <div
                style={{
                  flex: 1,
                  paddingLeft: 32,
                  fontFamily: display,
                  fontSize: 46,
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: t.fg,
                  fontVariantNumeric: "tabular-nums",
                  opacity: interpolate(frame, [46 + i * 7, 70 + i * 7], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                }}
              >
                {row.display}
              </div>
            </div>
          </Rise>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        {platforms.consequences.map((line, i) => (
          <Rise key={line} delay={62 + i * 8} distance={16} duration={22}>
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: i === 0 ? 0 : 16,
                maxWidth: 1500,
              }}
            >
              <span
                style={{
                  flex: "0 0 44px",
                  fontFamily: display,
                  fontSize: 28,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: t.muted,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {`0${i + 1}`}
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: i === 2 ? t.accentText : t.fg,
                }}
              >
                {line}
              </span>
            </div>
          </Rise>
        ))}
      </div>
    </Frame>
  );
};
