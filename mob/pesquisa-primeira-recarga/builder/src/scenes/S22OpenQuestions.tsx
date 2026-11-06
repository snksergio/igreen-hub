import React from "react";
import { DotGrid } from "../components/Backdrops";
import { NoteText, SectionHead } from "../components/Blocks";
import { Frame, tone } from "../components/Chrome";
import { Rise } from "../components/motion";
import { openQuestions } from "../lib/data";
import { display } from "../lib/fonts";

const CHIP_H = 76;

/**
 * Página densa: quatro perguntas em linha cheia, as pendências de campo em
 * tags e a nota final. Altura: 221 + 18 + (4×76 + 3×12 = 340) + 34 + tags 89
 * + 26 + nota 72 = 800. Os 16 px acima dos 784 úteis caem na folga de 46 px
 * que existe entre o fim da área de conteúdo e o rodapé.
 */
export const S22OpenQuestions: React.FC = () => {
  const t = tone("light");

  return (
    <Frame
      variant="light"
      section="As respostas que faltam"
      page="22"
      source={openQuestions.source}
      marker={openQuestions.marker}
      backdrop={<DotGrid color="#BAC4BC" step={44} radius={1.3} opacity={0.3} />}
    >
      <div>
        <SectionHead
          variant="light"
          eyebrow="18 — As respostas que faltam"
          lines={openQuestions.title}
          size={80}
        />

        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {openQuestions.chips.map((chip, i) => {
            const dark = i === 0;
            return (
              <Rise key={chip.n} delay={34 + i * 8} distance={26} duration={26}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 30,
                    height: CHIP_H,
                    padding: "0 40px",
                    boxSizing: "border-box",
                    borderRadius: 999,
                    backgroundColor: dark ? "#0A140E" : "#FFFFFF",
                    border: dark ? "none" : `1.5px solid ${t.hairline}`,
                    boxShadow: dark ? "none" : "0 2px 0 rgba(11,14,11,0.04)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: display,
                      fontSize: 36,
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      fontVariantNumeric: "tabular-nums",
                      color: dark ? "#00A859" : t.muted,
                    }}
                  >
                    {chip.n}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 30,
                      fontWeight: 500,
                      letterSpacing: "-0.012em",
                      color: dark ? "#00A859" : t.fg,
                    }}
                  >
                    {chip.text}
                  </span>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 500,
                      color: dark ? "#7A9184" : t.muted,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chip.foot}
                  </span>
                </div>
              </Rise>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 34,
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <Rise
            delay={74}
            distance={14}
            duration={22}
            style={{ flex: "0 0 236px", paddingTop: 11 }}
          >
            <div
              style={{
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: t.muted,
              }}
            >
              Pendências de campo
            </div>
          </Rise>
          <div
            style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 12 }}
          >
            {openQuestions.field.map((f, i) => (
              <Rise key={f} delay={78 + i * 5} distance={14} duration={22}>
                <div
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: `1.5px solid ${t.hairline}`,
                    backgroundColor: "#FFFFFF",
                    fontSize: 19,
                    fontWeight: 500,
                    color: "#5A6960",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f}
                </div>
              </Rise>
            ))}
          </div>
        </div>

        {/* Sem `maxWidth`: a nota precisa fechar em duas linhas, e a 1440 px
            ela virava três e empurrava o bloco contra o rodapé. */}
        <NoteText variant="light" delay={98} style={{ marginTop: 26 }}>
          {openQuestions.note}
        </NoteText>
      </div>
    </Frame>
  );
};
