import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { ContourField } from "../components/Backdrops";
import { ArrowPill, Frame } from "../components/Chrome";
import { Rise, useReveal } from "../components/motion";
import { agenda } from "../lib/data";
import { display } from "../lib/fonts";

/** Os três marcos do arco: abertura, o funil do pagamento e a tensão final. */
const isDark = (i: number) => i === 0 || i === 4 || i === 8;

export const S02Agenda: React.FC = () => {
  const frame = useCurrentFrame();
  const arrow = useReveal(24, 30);

  return (
    <Frame
      variant="brand"
      section="Conteúdo"
      page="02"
      backdrop={
        <ContourField
          cx={1720}
          cy={420}
          rings={20}
          gap={78}
          r0={120}
          color="#06180F"
          opacity={0.12}
          strokeWidth={2}
          speed={0.004}
          amplitude={0.2}
        />
      }
    >
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ overflow: "hidden", paddingBottom: 14 }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 164,
              fontWeight: 600,
              lineHeight: 0.92,
              letterSpacing: "-0.042em",
              color: "#06180F",
              translate: interpolate(frame, [4, 36], ["0px 116%", "0px 0%"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            Agenda
          </div>
        </div>
        <ArrowPill color="#06180F" width={166} height={78} progress={arrow} />
      </div>

      <div
        style={{
          marginTop: 26,
          maxWidth: 900,
          fontSize: 34,
          lineHeight: 1.44,
          color: "#0A3D22",
          opacity: interpolate(frame, [22, 46], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {agenda.subtitle}
      </div>

      <div
        style={{
          height: 1.5,
          backgroundColor: "rgba(11,14,11,0.2)",
          marginTop: 40,
          marginBottom: 42,
          scale: interpolate(frame, [16, 48], ["0 1", "1 1"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          transformOrigin: "left center",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "22px 26px",
          justifyItems: "start",
        }}
      >
        {agenda.items.map((item, i) => {
          const dark = isDark(i);
          return (
            <Rise key={item} delay={34 + i * 4} distance={22} duration={22}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 16,
                  height: 82,
                  padding: "0 34px",
                  borderRadius: 999,
                  backgroundColor: dark ? "#06180F" : "#FFFFFF",
                  color: dark ? "#5DD389" : "#06180F",
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  boxShadow: dark ? "none" : "0 2px 0 rgba(11,14,11,0.08)",
                }}
              >
                <span
                  style={{
                    fontFamily: display,
                    fontSize: 24,
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    opacity: 0.55,
                  }}
                >
                  {i + 1 < 10 ? `0${i + 1}` : `${i + 1}`}
                </span>
                {item}
              </div>
            </Rise>
          );
        })}
      </div>
    </Frame>
  );
};
