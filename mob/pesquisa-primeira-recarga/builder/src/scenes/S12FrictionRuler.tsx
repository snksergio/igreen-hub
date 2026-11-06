import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { NoteText, SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { BoltWatermark } from "../components/EvAssets";
import { Rise } from "../components/motion";
import { frictionRuler } from "../lib/data";
import { display } from "../lib/fonts";

/**
 * Orçamento vertical (784 úteis):
 * cabeçalho 205 (size 72) + 14 + faixas 418 (11 × 38) + 6 + eixo 28 + 18
 * + pill 46 + 12 + nota 32 = 779, mais ~3 px de filetes = 782.
 *
 * As faixas ficam encostadas e separadas por filete, no lugar do gap de 5 px:
 * é o que libera altura para o eixo rotulado sem espremer as barras.
 */
const LABEL_W = 430;
const TRACK_W = 780;
const AXIS_MAX = 20;
const TICKS = [0, 5, 10, 15, 20];
const ROW_H = 38;
const ROWS_H = frictionRuler.rows.length * ROW_H;

/** min = max não pode virar cotoco: 22 px mantém o valor único legível como bloco. */
const MIN_BAR = 22;

const BAR_COLOR: Record<string, string> = {
  accent: "#5DD389",
  dark: "#2FBE72",
  plain: "rgba(234,246,238,0.42)",
};

export const S12FrictionRuler: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("forest");

  return (
    <Frame
      variant="forest"
      section="O funil do pagamento"
      page="12"
      source={frictionRuler.source}
      marker={frictionRuler.marker}
      backdrop={<BoltWatermark color="#5DD389" opacity={0.035} />}
    >
      <SectionHead
        variant="forest"
        eyebrow="08 — O funil do pagamento"
        lines={frictionRuler.title}
        size={72}
      />

      <div style={{ position: "relative", marginTop: 14 }}>
        <div style={{ position: "absolute", left: LABEL_W, top: 0, width: TRACK_W }}>
          {TICKS.map((tick) => (
            <div
              key={tick}
              style={{
                position: "absolute",
                left: (tick / AXIS_MAX) * TRACK_W,
                top: 0,
                width: 1.5,
                height: ROWS_H,
                backgroundColor: tick === 0 ? "rgba(93,211,137,0.32)" : "rgba(234,246,238,0.1)",
                opacity: interpolate(frame, [12, 40], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                }),
              }}
            />
          ))}
        </div>

        {frictionRuler.rows.map((row, i) => {
          const loud = row.tone === "accent";
          return (
            <Rise key={row.name} delay={18 + i * 5} distance={14} duration={22}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: ROW_H,
                  boxSizing: "border-box",
                  borderTop: `1.5px solid ${
                    i === 0 ? "rgba(93,211,137,0.3)" : "rgba(234,246,238,0.08)"
                  }`,
                }}
              >
                <div
                  style={{
                    flex: `0 0 ${LABEL_W}px`,
                    paddingRight: 26,
                    fontSize: 24,
                    fontWeight: loud ? 600 : 500,
                    color: loud ? t.accentText : t.fg,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.name}
                </div>

                <div style={{ flex: `0 0 ${TRACK_W}px`, position: "relative", height: ROW_H }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 7,
                      left: (row.min / AXIS_MAX) * TRACK_W,
                      width: Math.max(((row.max - row.min) / AXIS_MAX) * TRACK_W, MIN_BAR),
                      height: 22,
                      borderRadius: 6,
                      backgroundColor: BAR_COLOR[row.tone],
                      transformOrigin: "left center",
                      scale: interpolate(frame, [24 + i * 5, 58 + i * 5], ["0 1", "1 1"], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      }),
                    }}
                  />
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontFamily: display,
                    fontSize: 30,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: loud ? t.accentText : t.fg,
                    fontVariantNumeric: "tabular-nums",
                    opacity: interpolate(frame, [44 + i * 5, 66 + i * 5], [0, 1], {
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
          );
        })}

        <div
          style={{
            display: "flex",
            marginTop: 6,
            paddingTop: 4,
            borderTop: "1.5px solid rgba(234,246,238,0.08)",
          }}
        >
          <div style={{ flex: `0 0 ${LABEL_W}px` }} />
          <div style={{ flex: `0 0 ${TRACK_W}px`, position: "relative", height: 28 }}>
            {TICKS.map((tick) => (
              <span
                key={tick}
                style={{
                  position: "absolute",
                  left: (tick / AXIS_MAX) * TRACK_W,
                  top: 0,
                  translate: "-50% 0px",
                  fontSize: 21,
                  fontWeight: 500,
                  color: t.muted,
                  fontVariantNumeric: "tabular-nums",
                  opacity: interpolate(frame, [70, 94], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  }),
                }}
              >
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Rise delay={80} distance={16} duration={24} style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 46,
              padding: "0 24px",
              borderRadius: 999,
              backgroundColor: "#08120C",
              color: "#5DD389",
              fontFamily: display,
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {frictionRuler.multiple}
          </span>
          <span style={{ fontSize: 22, fontWeight: 500, color: t.muted }}>
            {frictionRuler.multipleCaption}
          </span>
        </div>
      </Rise>

      <NoteText variant="forest" delay={88} size={21} style={{ marginTop: 12 }}>
        {frictionRuler.note}
      </NoteText>
    </Frame>
  );
};
