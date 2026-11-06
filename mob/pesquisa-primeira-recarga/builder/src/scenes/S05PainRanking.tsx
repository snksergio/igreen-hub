import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { NoteText, SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { Rise } from "../components/motion";
import { painRanking } from "../lib/data";
import { display } from "../lib/fonts";

const LABEL_W = 420;
const TRACK_W = 900;
const VALUE_W = 110;
const ROW_H = 40;
const ROW_GAP = 5;
const BAR_H = 26;

const AXIS_MAX = Math.max(...painRanking.rows.map((r) => r.count));

/**
 * Onze linhas em 784 px úteis: cabeçalho em 72 px (~205) + 11×40 + 10×5 (490)
 * + nota (~36) e duas margens de 26 e 20 = 777.
 */
export const S05PainRanking: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("light");

  return (
    <Frame
      variant="light"
      section="As dores, por peso"
      page="05"
      source={painRanking.source}
      marker={painRanking.marker}
    >
      <SectionHead
        variant="light"
        eyebrow="03 — As dores, por peso"
        lines={painRanking.title}
        size={72}
      />

      <div style={{ marginTop: 26 }}>
        {painRanking.rows.map((row, i) => (
          <Rise
            key={row.name}
            delay={22 + i * 4}
            distance={14}
            duration={22}
            style={{ marginTop: i === 0 ? 0 : ROW_GAP }}
          >
            <div style={{ display: "flex", alignItems: "center", height: ROW_H }}>
              <div
                style={{
                  width: LABEL_W,
                  paddingRight: 24,
                  boxSizing: "border-box",
                  fontSize: 26,
                  fontWeight: 500,
                  lineHeight: 1.2,
                  color: t.fg,
                }}
              >
                {row.name}
              </div>

              <div style={{ width: TRACK_W }}>
                <div
                  style={{
                    width: (row.count / AXIS_MAX) * TRACK_W,
                    height: BAR_H,
                    borderRadius: 6,
                    backgroundColor: row.money ? "#00A859" : "#0A140E",
                    transformOrigin: "left center",
                    scale: interpolate(
                      frame,
                      [26 + i * 4, 58 + i * 4],
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
                  width: VALUE_W,
                  paddingLeft: 24,
                  boxSizing: "border-box",
                  fontFamily: display,
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: row.money ? t.accentText : t.fg,
                  fontVariantNumeric: "tabular-nums",
                  opacity: interpolate(frame, [42 + i * 4, 64 + i * 4], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                }}
              >
                {row.count}
              </div>
            </div>
          </Rise>
        ))}
      </div>

      <NoteText
        variant="light"
        delay={80}
        maxWidth={900}
        style={{ marginTop: 20 }}
      >
        {painRanking.disclaimer}
      </NoteText>
    </Frame>
  );
};
