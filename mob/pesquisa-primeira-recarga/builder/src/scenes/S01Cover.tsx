import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Asset } from "../components/Asset";
import { ContourField, Glow } from "../components/Backdrops";
import { Mark, Pill } from "../components/Chrome";
import { Ticker } from "../components/motion";
import { brand, cover } from "../lib/data";
import { display, text } from "../lib/fonts";

export const S01Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#08120C", fontFamily: text, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          scale: interpolate(frame, [0, 5 * fps], [1.06, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <ContourField
          cx={1560}
          cy={620}
          rings={22}
          gap={62}
          r0={70}
          color="#16281D"
          opacity={0.85}
          strokeWidth={1.5}
          speed={0.0055}
        />
        <Glow x={1520} y={520} size={1100} color="rgba(93,211,137,0.22)" opacity={0.55} />
        <Glow x={520} y={880} size={900} color="rgba(63,207,106,0.12)" opacity={0.7} />
      </div>

      {/* A 22% o render deixa de ser objeto e passa a ser textura: no mesmo
          eixo do 39% em lime, qualquer coisa mais opaca disputa a leitura.
          Sangra pela direita de propósito e termina em 830, longe do rodapé —
          corte embaixo leria como erro. */}
      <div
        style={{
          position: "absolute",
          right: -70,
          top: 210,
          opacity: interpolate(frame, [30, 68], [0, 0.22], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [30, 68], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <Asset name="bomba3" width={620} />
      </div>

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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Mark size={34} fg="#5DD389" bg="#08120C" />
          <span
            style={{
              fontFamily: display,
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#F2F7F3",
            }}
          >
            {brand.product}
          </span>
        </div>
        <Pill fg="#08120C" bg="#5DD389" dot="#08120C" size={21}>
          {brand.kind} · {brand.date}
        </Pill>
      </div>

      <div style={{ position: "absolute", left: 104, right: 104, top: 278 }}>
        <div
          style={{
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#5DD389",
            marginBottom: 34,
            opacity: interpolate(frame, [8, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(frame, [8, 30], ["-24px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {cover.eyebrow}
        </div>

        <div style={{ overflow: "hidden", paddingBottom: 12 }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 168,
              fontWeight: 600,
              lineHeight: 0.94,
              letterSpacing: "-0.042em",
              color: "#F2F7F3",
              whiteSpace: "nowrap",
              translate: interpolate(frame, [10, 42], ["0px 118%", "0px 0%"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {cover.line1}
          </div>
        </div>

        <div style={{ overflow: "hidden", paddingBottom: 18 }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 168,
              fontWeight: 600,
              lineHeight: 0.94,
              letterSpacing: "-0.042em",
              color: "#5DD389",
              whiteSpace: "nowrap",
              translate: interpolate(frame, [18, 50], ["0px 118%", "0px 0%"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {cover.line2}
          </div>
        </div>

        <div
          style={{
            marginTop: 38,
            maxWidth: 920,
            fontSize: 34,
            lineHeight: 1.44,
            color: "#9BA79A",
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
          {cover.subtitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 104,
          top: 686,
          textAlign: "right",
          opacity: interpolate(frame, [44, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontSize: 128,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "#5DD389",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <Ticker to={cover.stat} suffix="%" delay={44} duration={44} />
        </div>
        <div
          style={{
            marginTop: 14,
            maxWidth: 520,
            marginLeft: "auto",
            fontSize: 25,
            lineHeight: 1.35,
            fontWeight: 500,
            letterSpacing: "0.01em",
            color: "#7A9184",
          }}
        >
          {cover.statCaption}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 62,
          left: 104,
          right: 104,
          display: "flex",
          // A quarta coluna (autor) entrou depois: o gap cai para manter folga
          // dentro dos 1712 px do trilho.
          gap: 92,
          opacity: interpolate(frame, [52, 78], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {cover.rail.map(([k, v]) => (
          <div key={k}>
            <div
              style={{
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#5DD389",
                marginBottom: 10,
              }}
            >
              {k}
            </div>
            <div style={{ fontSize: 27, fontWeight: 500, color: "#D9E5DD" }}>{v}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
