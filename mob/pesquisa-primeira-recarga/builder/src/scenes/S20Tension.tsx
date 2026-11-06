import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { DotGrid } from "../components/Backdrops";
import { SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { TensionDiagram } from "../components/TensionDiagram";
import { tension } from "../lib/data";

/**
 * Página de hipótese: as duas forças, a saída proposta e a pergunta que
 * continua aberta. A pill é o único destaque — o bloco central do diagrama
 * já é preto, então o contorno no acento fica só na pergunta.
 *
 * Altura: cabeçalho 205 + 30 + diagrama ~390 + 22 + pergunta ~98 = 745 nos
 * 784 úteis. O bloco central do diagrama vai a 32 px justamente para caber
 * em duas linhas; se cair para três, a soma vai a 786 e ainda fecha.
 */
export const S20Tension: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("light");

  return (
    <Frame
      variant="light"
      section="A tensão do modelo"
      page="20"
      source={tension.source}
      marker={tension.marker}
      backdrop={<DotGrid color="#BAC4BC" step={44} radius={1.3} opacity={0.3} />}
    >
      <div>
        <SectionHead
          variant="light"
          eyebrow="16 — A tensão do modelo"
          lines={tension.title}
          size={72}
        />

        <div style={{ marginTop: 30 }}>
          <TensionDiagram
            variant="light"
            left={tension.left}
            right={tension.right}
            center={tension.center}
            delay={30}
          />
        </div>

        <div style={{ marginTop: 22, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              maxWidth: 1600,
              padding: "12px 42px",
              borderRadius: 999,
              border: `2px solid ${t.accentText}`,
              fontSize: 27,
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: "-0.008em",
              color: t.fg,
              opacity: interpolate(frame, [92, 116], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(frame, [92, 122], ["0px 22px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {tension.question}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 22,
              lineHeight: 1.4,
              color: t.muted,
              opacity: interpolate(frame, [100, 124], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {tension.questionFoot}
          </div>
        </div>
      </div>
    </Frame>
  );
};
