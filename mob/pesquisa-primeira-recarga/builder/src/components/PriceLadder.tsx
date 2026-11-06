import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Rise } from "./motion";
import { display } from "../lib/fonts";

type Step = { tier: string; value: string; best: boolean };
type Column = { operator: string; steps: Step[] };

/**
 * A escada de preço. O degrau mais barato fica no topo e o atrito cresce
 * para baixo — a forma diz a tese antes do texto: não se trava o acesso,
 * cobra-se mais caro por ele.
 *
 * Vive sobre o tom `lime`, onde o acento do deck é o preto.
 */
export const PriceLadder: React.FC<{
  columns: Column[];
  delay?: number;
  width?: number;
}> = ({ columns, delay = 0, width = 1712 }) => {
  const frame = useCurrentFrame();
  const gap = 40;
  const colW = (width - gap * (columns.length - 1)) / columns.length;

  return (
    <div style={{ display: "flex", gap }}>
      {columns.map((col, ci) => (
        <div key={col.operator} style={{ width: colW }}>
          <Rise delay={delay + ci * 8} distance={22} duration={24}>
            <div
              style={{
                fontFamily: display,
                fontSize: 40,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "#06180F",
                paddingBottom: 14,
                borderBottom: "2px solid rgba(6,24,15,0.30)",
                marginBottom: 22,
              }}
            >
              {col.operator}
            </div>
          </Rise>

          {col.steps.map((step, si) => {
            const d = delay + 14 + ci * 8 + si * 9;
            return (
              <div key={step.tier}>
                {si > 0 ? (
                  <div
                    style={{
                      height: 34,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: interpolate(frame, [d - 6, d + 14], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      }),
                    }}
                  >
                    <svg width={18} height={34} viewBox="0 0 18 34">
                      <path
                        d="M9 2 L9 24 M3 19 L9 26 L15 19"
                        fill="none"
                        stroke="rgba(6,24,15,0.45)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : null}

                <Rise delay={d} distance={26} duration={26}>
                  <div
                    style={{
                      height: 128,
                      boxSizing: "border-box",
                      borderRadius: 22,
                      backgroundColor: step.best ? "#06180F" : "transparent",
                      border: step.best ? "none" : "2px solid rgba(6,24,15,0.32)",
                      padding: "22px 28px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 21,
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: step.best ? "#5DD389" : "rgba(6,24,15,0.7)",
                      }}
                    >
                      {step.tier}
                    </div>
                    <div
                      style={{
                        fontFamily: display,
                        fontSize: 54,
                        fontWeight: 600,
                        lineHeight: 1,
                        letterSpacing: "-0.035em",
                        color: step.best ? "#F2F7F3" : "#06180F",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {step.value}
                    </div>
                  </div>
                </Rise>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
