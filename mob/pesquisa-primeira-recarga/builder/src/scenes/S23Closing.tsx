import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ContourField } from "../components/Backdrops";
import { Pill } from "../components/Chrome";
import { Asset } from "../components/Asset";
import { IgreenLogo } from "../components/Logo";
import { brand, closing } from "../lib/data";
import { display, text } from "../lib/fonts";

export const S23Closing: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#00A859", fontFamily: text, overflow: "hidden" }}
    >
      <ContourField
        cx={1620}
        cy={560}
        rings={18}
        gap={86}
        r0={130}
        color="#06180F"
        opacity={0.155}
        strokeWidth={2}
        speed={0.0042}
        amplitude={0.18}
      />

      <div
        style={{
          position: "absolute",
          top: 58,
          left: 104,
          right: 104,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {/* Página de assinatura: aqui cabe o lockup inteiro, não o isotipo. */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <IgreenLogo width={190} color="#06180F" />
          <span
            style={{
              fontFamily: display,
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#06180F",
            }}
          >
            {brand.product}
          </span>
        </div>
        <Pill fg="#5DD389" bg="#06180F" dot="#5DD389">
          Fim da apresentação
        </Pill>
      </div>

      {/* O conector entra pela direita e desacelera — não gira nem pulsa. */}
      <div
        style={{
          position: "absolute",
          right: -110,
          top: 168,
          opacity: interpolate(frame, [12, 46], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [12, 58], ["120px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <Asset name="bomba4" width={620} />
      </div>

      <div style={{ position: "absolute", left: 104, right: 104, top: 318 }}>
        <div style={{ overflow: "hidden", paddingBottom: 12 }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 168,
              fontWeight: 600,
              lineHeight: 0.94,
              letterSpacing: "-0.045em",
              color: "#06180F",
              whiteSpace: "nowrap",
              translate: interpolate(frame, [4, 36], ["0px 116%", "0px 0%"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {closing.line1}
          </div>
        </div>

        <div style={{ overflow: "hidden", paddingBottom: 16 }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 168,
              fontWeight: 600,
              lineHeight: 0.94,
              letterSpacing: "-0.045em",
              color: "#06180F",
              whiteSpace: "nowrap",
              translate: interpolate(frame, [14, 46], ["0px 116%", "0px 0%"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {closing.line2}
          </div>
        </div>

        <div
          style={{
            marginTop: 34,
            maxWidth: 1020,
            fontSize: 34,
            lineHeight: 1.44,
            color: "#0A3D22",
            opacity: interpolate(frame, [34, 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [34, 60], ["0px 22px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {closing.subtitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 62,
          left: 104,
          right: 104,
          display: "flex",
          gap: 118,
          opacity: interpolate(frame, [46, 72], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {closing.rail.map(([k, v]) => (
          <div key={k}>
            <div
              style={{
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(6,24,15,0.68)",
                marginBottom: 10,
              }}
            >
              {k}
            </div>
            <div style={{ fontSize: 27, fontWeight: 500, color: "#06180F" }}>{v}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
