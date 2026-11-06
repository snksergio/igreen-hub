import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Asset } from "../components/Asset";
import { DotGrid } from "../components/Backdrops";
import { NoteText, SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { Rise } from "../components/motion";
import { appRatings } from "../lib/data";
import { display } from "../lib/fonts";

/** As notas chegam como número para poderem ser formatadas no padrão BR. */
const nota = (n: number) => n.toFixed(1).replace(".", ",");

export const S07AppRatings: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("paper");

  /**
   * A cor da nota é o único destaque da página: o grupo que resolve
   * descoberta vem no acento, o que resolve transação vem em preto.
   */
  const groups = [
    {
      label: "Resolve descoberta",
      rows: appRatings.discovery,
      ink: t.accentText,
      asset: "ilustracao1" as const,
    },
    {
      label: "Resolve transação",
      rows: appRatings.transaction,
      ink: "#0A140E",
      asset: "ilustracao6" as const,
    },
  ];

  return (
    <Frame
      variant="paper"
      section="Amado × odiado"
      page="07"
      source={appRatings.source}
      marker={appRatings.marker}
      backdrop={<DotGrid color="#D7DED8" step={44} radius={1.3} opacity={0.42} />}
    >
      <SectionHead
        variant="paper"
        eyebrow="05 — Amado × odiado"
        lines={appRatings.title}
        size={64}
      />

      <div style={{ display: "flex", gap: 40, marginTop: 30 }}>
        {groups.map((g, gi) => (
          <div key={g.label} style={{ flex: "0 0 836px" }}>
            <div
              style={{
                height: 3,
                borderRadius: 999,
                backgroundColor: t.hairline,
                transformOrigin: "left center",
                scale: interpolate(
                  frame,
                  [18 + gi * 6, 48 + gi * 6],
                  ["0 1", "1 1"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            />
            {/* O rótulo é curto, então o render ocupa a folga que já existia à
                direita dele, dentro do fluxo: 72 de altura contra os 26,5 da
                linha antiga é o que a página tinha para dar. */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                height: 72,
                marginTop: 10,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: t.muted,
                  opacity: interpolate(
                    frame,
                    [22 + gi * 6, 46 + gi * 6],
                    [0, 1],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.16, 1, 0.3, 1),
                    },
                  ),
                }}
              >
                {g.label}
              </div>

              <Rise delay={24 + gi * 6} distance={18} duration={28}>
                <Asset name={g.asset} width={72} />
              </Rise>
            </div>

            {g.rows.map((r, i) => (
              <Rise
                key={r.name}
                delay={30 + gi * 5 + i * 8}
                distance={22}
                duration={26}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 32,
                    borderTop: `1.5px solid ${t.hairline}`,
                    paddingTop: 16,
                    paddingBottom: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: display,
                        fontSize: 30,
                        fontWeight: 600,
                        lineHeight: 1.15,
                        letterSpacing: "-0.022em",
                        color: t.fg,
                      }}
                    >
                      {r.name}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 21,
                        fontWeight: 500,
                        color: t.muted,
                      }}
                    >
                      {r.role}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: display,
                        fontSize: 48,
                        fontWeight: 600,
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        color: g.ink,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {nota(r.rating)}
                    </div>
                    {r.volume ? (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 19,
                          fontWeight: 500,
                          color: t.muted,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {r.volume}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        ))}
      </div>

      <NoteText
        variant="paper"
        delay={92}
        size={24}
        maxWidth={1180}
        style={{ marginTop: 4 }}
      >
        {appRatings.caveat}
      </NoteText>
    </Frame>
  );
};
