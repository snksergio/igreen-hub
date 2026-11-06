import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Asset } from "../components/Asset";
import { ClosingLine, SectionHead, StatGrid } from "../components/Blocks";
import { IgreenWatermark } from "../components/Logo";
import { Frame } from "../components/Chrome";

import { Rise } from "../components/motion";
import { divider } from "../lib/data";

/**
 * Orçamento vertical (784 úteis): título 204 + 96 + frase 55 = 355, e a grade
 * de números ancorada no rodapé ocupa 652–784.
 *
 * O carro cabe na faixa 118–638 da coluna direita (x 1192–1712): abaixo da
 * primeira linha do título, à direita da frase (max 1180) e acima da grade.
 */
export const S11Divider: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame
      variant="forest"
      section="O funil de morte"
      page="11"
      backdrop={<IgreenWatermark color="#5DD389" opacity={0.05} />}
    >
      {/* Página de respiro: os três blocos ficam propositalmente distantes. */}
      <div
        style={{
          position: "relative",
          height: 784,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SectionHead
          variant="forest"
          lines={[divider.line1, divider.line2]}
          size={96}
          accentLine={1}
        />

        <div style={{ marginTop: 96 }}>
          <ClosingLine
            variant="forest"
            plain={divider.sentence}
            delay={46}
            size={44}
            maxWidth={1180}
          />
        </div>

        <div style={{ marginTop: "auto" }}>
          <StatGrid
            variant="forest"
            items={divider.stats}
            columns={3}
            valueSize={72}
            delay={68}
            maxWidth={1360}
          />
        </div>

        <Rise
          delay={78}
          distance={30}
          duration={30}
          style={{ position: "absolute", right: 0, top: 118 }}
        >
          <Asset
            name="carro5"
            width={520}
            style={{
              scale: interpolate(frame, [78, 112], [0.94, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          />
        </Rise>
      </div>
    </Frame>
  );
};
