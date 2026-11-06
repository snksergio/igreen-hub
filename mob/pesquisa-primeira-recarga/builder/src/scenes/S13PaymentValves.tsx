import React from "react";
import { Asset, type AssetName } from "../components/Asset";
import { Card, SectionHead, cardInk } from "../components/Blocks";
import { DotGrid } from "../components/Backdrops";
import { Frame, tone } from "../components/Chrome";
import { Rise } from "../components/motion";
import { paymentValves } from "../lib/data";
import { display } from "../lib/fonts";

/**
 * Orçamento vertical (784 úteis):
 * cabeçalho 205 (size 72) + 18 + cards 348 + 18 + fechamento ~192 = 781.
 * O título desce de 80 para 72 porque o bloco preto de fechamento precisa
 * de duas linhas de corpo mais a frase de acento.
 */
const CARD_H = 348;

/**
 * Uma ilustração por válvula. Entra num invólucro de altura zero, para o
 * asset ficar sobreposto no canto sem empurrar o micro-label, o número nem o
 * corpo do card — a coluna útil do card tem 346 px e o rótulo mais longo
 * ("Pré-autorização") para antes dos 86 px reservados à direita.
 */
const VALVE_ASSETS: Record<string, AssetName> = {
  "SMS / OTP": "ilustracao1",
  "Pré-autorização": "ilustracao6",
  "Saldo preso": "ilustracao9",
  Ociosidade: "ilustracao7",
};

export const S13PaymentValves: React.FC = () => {
  const t = tone("light");
  const ink = cardInk("light", "plain");

  return (
    <Frame
      variant="light"
      section="O funil do pagamento"
      page="13"
      source={paymentValves.source}
      marker={paymentValves.marker}
      backdrop={<DotGrid color="#BAC4BC" step={44} radius={1.3} opacity={0.3} />}
    >
      <SectionHead
        variant="light"
        eyebrow="09 — As quatro válvulas"
        lines={paymentValves.title}
        size={72}
      />

      <div style={{ display: "flex", gap: 24, marginTop: 18 }}>
        {paymentValves.cards.map((card, i) => (
          <Card
            key={card.label}
            variant="light"
            width={410}
            height={CARD_H}
            delay={24 + i * 8}
          >
            <div style={{ position: "relative", height: 0 }}>
              <Asset
                name={VALVE_ASSETS[card.label]}
                width={86}
                style={{ position: "absolute", right: 0, top: -6 }}
              />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: ink.muted,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: display,
                fontSize: 54,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: t.accentText,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {card.figure}
            </div>
            <div style={{ marginTop: 14, fontSize: 23, lineHeight: 1.36, color: ink.fg }}>
              {card.body}
            </div>
            <div
              style={{
                marginTop: "auto",
                paddingTop: 16,
                fontSize: 19,
                lineHeight: 1.3,
                color: ink.muted,
              }}
            >
              {card.foot}
            </div>
          </Card>
        ))}
      </div>

      <Rise delay={64} distance={28} duration={28} style={{ marginTop: 18 }}>
        <div
          style={{
            display: "flex",
            gap: 44,
            boxSizing: "border-box",
            borderRadius: 26,
            backgroundColor: "#0A140E",
            padding: 30,
          }}
        >
          <div
            style={{
              flex: "0 0 360px",
              fontSize: 20,
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#00A859",
            }}
          >
            {paymentValves.closing.head}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 27, lineHeight: 1.4, color: "#D9E5DD" }}>
              {paymentValves.closing.body}
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: display,
                fontSize: 32,
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: "-0.028em",
                color: "#00A859",
              }}
            >
              {paymentValves.closing.accent}
            </div>
          </div>
        </div>
      </Rise>
    </Frame>
  );
};
