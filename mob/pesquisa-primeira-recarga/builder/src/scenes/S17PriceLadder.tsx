import React from "react";
import { ContourField } from "../components/Backdrops";
import { SectionHead } from "../components/Blocks";
import { Frame, MarkerPill } from "../components/Chrome";
import { PriceLadder } from "../components/PriceLadder";
import { Rise } from "../components/motion";
import { priceLadder } from "../lib/data";
import { display } from "../lib/fonts";

const LADDER_W = 1120;

/**
 * Orçamento vertical: cabeçalho 221 + 18 + faixa única de 538 = 777.
 *
 * A escada da Fastned tem três degraus (86 de cabeçalho + 3×128 + 2×34 =
 * 538) e não cabe com um bloco de texto empilhado embaixo. A saída foi
 * estreitar a escada para 1120 e pôr fechamento e hipótese numa coluna à
 * direita, na mesma altura — nenhum degrau foi reduzido.
 */
export const S17PriceLadder: React.FC = () => {
  return (
    <Frame
      variant="brand"
      section="A virada"
      page="17"
      source={priceLadder.source}
      marker={priceLadder.marker}
      backdrop={
        <ContourField
          cx={1580}
          cy={900}
          rings={14}
          gap={74}
          r0={130}
          color="#06180F"
          opacity={0.06}
          strokeWidth={1.4}
        />
      }
    >
      <SectionHead
        variant="brand"
        eyebrow="13 — A virada"
        lines={priceLadder.title}
        size={80}
        accentLine={1}
      />

      <div style={{ display: "flex", gap: 44, marginTop: 18 }}>
        <div style={{ flex: `0 0 ${LADDER_W}px` }}>
          <PriceLadder columns={priceLadder.columns} delay={30} width={LADDER_W} />
        </div>

        <div style={{ flex: 1 }}>
          <Rise delay={80} distance={28} duration={28}>
            <div
              style={{
                borderRadius: 24,
                backgroundColor: "#06180F",
                padding: "24px 26px",
              }}
            >
              <div style={{ fontSize: 22, lineHeight: 1.35, color: "#D9E5DD" }}>
                {priceLadder.closing.plain}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: display,
                  fontSize: 40,
                  fontWeight: 600,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: "#5DD389",
                }}
              >
                {priceLadder.closing.accent}
              </div>
            </div>
          </Rise>

          <Rise
            delay={92}
            distance={26}
            duration={28}
            style={{ marginTop: 26 }}
          >
            <div
              style={{
                borderRadius: 24,
                border: "2px solid rgba(11,14,11,0.3)",
                padding: "22px 26px",
              }}
            >
              <MarkerPill kind="hipotese" variant="brand" />
              <div
                style={{
                  marginTop: 14,
                  fontSize: 25,
                  lineHeight: 1.4,
                  color: "#06180F",
                }}
              >
                {priceLadder.hypothesis}
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </Frame>
  );
};
