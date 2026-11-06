import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { tone, type Tone } from "./Chrome";
import { Rise } from "./motion";
import { display } from "../lib/fonts";

const W = 1712;

/**
 * As duas forças. As setas crescem simultaneamente de fora para o centro; o
 * bloco de saída entra depois, com atraso — a hipótese só aparece quando a
 * tensão já está montada na tela.
 */
export const TensionDiagram: React.FC<{
  variant: Tone;
  left: { head: string; body: string };
  right: { head: string; body: string };
  center: string;
  delay?: number;
}> = ({ variant, left, right, center, delay = 0 }) => {
  const frame = useCurrentFrame();
  const t = tone(variant);

  const grow = interpolate(frame, [delay, delay + 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const col: React.CSSProperties = { flex: "0 0 660px" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 60 }}>
        <div style={col}>
          <Rise delay={delay} distance={24} duration={26}>
            <div
              style={{
                fontFamily: display,
                fontSize: 40,
                fontWeight: 600,
                lineHeight: 1.18,
                letterSpacing: "-0.03em",
                color: t.fg,
              }}
            >
              {left.head}
            </div>
            <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.46, color: t.muted }}>
              {left.body}
            </div>
          </Rise>
        </div>
        <div style={{ ...col, textAlign: "right" }}>
          <Rise delay={delay + 6} distance={24} duration={26}>
            <div
              style={{
                fontFamily: display,
                fontSize: 40,
                fontWeight: 600,
                lineHeight: 1.18,
                letterSpacing: "-0.03em",
                color: t.fg,
              }}
            >
              {right.head}
            </div>
            <div style={{ marginTop: 12, fontSize: 26, lineHeight: 1.46, color: t.muted }}>
              {right.body}
            </div>
          </Rise>
        </div>
      </div>

      <svg width={W} height={76} viewBox={`0 0 ${W} 76`} style={{ marginTop: 26 }}>
        <g stroke={t.accentText} strokeWidth={3} strokeLinecap="round" fill="none">
          <path d={`M40 38 H${40 + 700 * grow}`} />
          <path
            d={`M${716 - 26} ${38 - 13} L${716} 38 L${716 - 26} ${38 + 13}`}
            opacity={grow > 0.92 ? 1 : 0}
            strokeLinejoin="round"
          />
          <path d={`M${W - 40} 38 H${W - 40 - 700 * grow}`} />
          <path
            d={`M${W - 716 + 26} ${38 - 13} L${W - 716} 38 L${W - 716 + 26} ${38 + 13}`}
            opacity={grow > 0.92 ? 1 : 0}
            strokeLinejoin="round"
          />
        </g>
      </svg>

      <Rise delay={delay + 50} distance={28} duration={28}>
        <div
          style={{
            margin: "0 auto",
            maxWidth: 1160,
            boxSizing: "border-box",
            borderRadius: 26,
            backgroundColor: variant === "ink" || variant === "forest" ? "#5DD389" : "#0A140E",
            padding: "30px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: display,
              fontSize: 32,
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "-0.026em",
              color: variant === "ink" || variant === "forest" ? "#06180F" : "#F2F7F3",
            }}
          >
            {center}
          </div>
        </div>
      </Rise>
    </div>
  );
};
