import React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { tone, type Tone } from "./Chrome";
import { Rise, useReveal } from "./motion";
import { display } from "../lib/fonts";

/**
 * Blocos de conteúdo compartilhados. Existem para que as 23 páginas tenham
 * exatamente o mesmo comportamento de cabeçalho, citação e fechamento — a
 * consistência aqui é o que faz o deck parecer de uma peça só.
 */

/**
 * Cabeçalho padrão: eyebrow + título em máscara + nota lateral opcional.
 *
 * Altura aproximada, para orçar o resto da página nos 784 px úteis:
 *   50 + (nº de linhas × tamanho) + 6 por linha
 * Ex.: duas linhas de 88 px ≈ 238 px.
 */
export const SectionHead: React.FC<{
  variant: Tone;
  eyebrow?: string;
  lines: string[];
  /** Índice da linha que recebe o acento. -1 desliga. */
  accentLine?: number;
  size?: number;
  note?: string;
  noteWidth?: number;
  titleWidth?: number;
  delay?: number;
}> = ({
  variant,
  eyebrow,
  lines,
  accentLine = 1,
  size = 88,
  note,
  noteWidth,
  titleWidth,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const t = tone(variant);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 80,
      }}
    >
      <div style={titleWidth ? { flex: `0 0 ${titleWidth}px` } : { flex: 1 }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: t.muted,
              marginBottom: 20,
              opacity: interpolate(frame, [delay, delay + 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        {lines.map((line, i) => (
          <div key={line} style={{ overflow: "hidden", paddingBottom: 6 }}>
            <Interactive.Div
              name="Title line"
              style={{
                fontFamily: display,
                fontSize: size,
                fontWeight: 600,
                lineHeight: 1.0,
                letterSpacing: "-0.036em",
                color: i === accentLine ? t.accentText : t.fg,
                translate: interpolate(
                  frame,
                  [delay + 4 + i * 7, delay + 34 + i * 7],
                  ["0px 116%", "0px 0%"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              {line}
            </Interactive.Div>
          </div>
        ))}
      </div>

      {note ? (
        <div
          style={{
            flex: noteWidth ? `0 0 ${noteWidth}px` : 1,
            paddingBottom: 10,
            fontSize: 27,
            lineHeight: 1.5,
            color: variant === "ink" || variant === "forest" ? t.muted : "#5A6960",
            opacity: interpolate(frame, [delay + 22, delay + 48], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {note}
        </div>
      ) : null}
    </div>
  );
};

/** Citação curta: barra no acento, frase em máscara, crédito atrasado. */
export const Quote: React.FC<{
  variant: Tone;
  text: string;
  credit: string;
  delay?: number;
  size?: number;
  maxWidth?: number;
}> = ({ variant, text, credit, delay = 0, size = 30, maxWidth }) => {
  const t = tone(variant);
  const p = useReveal(delay, 28);
  return (
    <div style={{ display: "flex", gap: 22, maxWidth }}>
      <div
        style={{
          flex: "0 0 3px",
          backgroundColor: t.accentText,
          borderRadius: 999,
          transformOrigin: "top center",
          scale: `1 ${p}`,
        }}
      />
      <div>
        <div style={{ overflow: "hidden", paddingBottom: 4 }}>
          <div
            style={{
              fontSize: size,
              fontWeight: 500,
              lineHeight: 1.4,
              color: t.fg,
              translate: `0px ${(1 - p) * 110}%`,
            }}
          >
            {text}
          </div>
        </div>
        <Rise delay={delay + 8} distance={14} duration={22}>
          <div style={{ marginTop: 10, fontSize: 21, fontWeight: 500, color: t.muted }}>
            {credit}
          </div>
        </Rise>
      </div>
    </div>
  );
};

/** Frase de fechamento — parte neutra + parte no acento. */
export const ClosingLine: React.FC<{
  variant: Tone;
  plain?: string;
  accent?: string;
  delay?: number;
  size?: number;
  maxWidth?: number;
}> = ({ variant, plain, accent, delay = 0, size = 44, maxWidth }) => {
  const t = tone(variant);
  return (
    <Rise delay={delay} distance={22} duration={26}>
      <div
        style={{
          maxWidth,
          fontFamily: display,
          fontSize: size,
          fontWeight: 600,
          lineHeight: 1.24,
          letterSpacing: "-0.028em",
          color: t.fg,
        }}
      >
        {plain ? `${plain} ` : ""}
        {accent ? <span style={{ color: t.accentText }}>{accent}</span> : null}
      </div>
    </Rise>
  );
};

/** Nota pequena em `muted` — ressalvas, avisos de amostra, alertas. */
export const NoteText: React.FC<{
  variant: Tone;
  children: React.ReactNode;
  delay?: number;
  size?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({ variant, children, delay = 0, size = 24, maxWidth, style }) => {
  const t = tone(variant);
  return (
    <Rise delay={delay} distance={14} duration={22} style={style}>
      <div style={{ maxWidth, fontSize: size, lineHeight: 1.5, color: t.muted }}>
        {children}
      </div>
    </Rise>
  );
};

/** Grade de estatísticas com filete superior. */
export const StatGrid: React.FC<{
  variant: Tone;
  items: { value: string; label: string }[];
  columns?: number;
  delay?: number;
  valueSize?: number;
  gap?: string;
  maxWidth?: number;
}> = ({
  variant,
  items,
  columns = 2,
  delay = 0,
  valueSize = 62,
  gap = "34px 60px",
  maxWidth,
}) => {
  const t = tone(variant);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        maxWidth,
      }}
    >
      {items.map((s, i) => (
        <Rise key={s.label} delay={delay + i * 7} distance={22} duration={24}>
          <div style={{ borderTop: `1.5px solid ${t.hairline}`, paddingTop: 18 }}>
            <div
              style={{
                fontFamily: display,
                fontSize: valueSize,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: t.fg,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </div>
            <div style={{ marginTop: 10, fontSize: 25, fontWeight: 500, color: t.muted }}>
              {s.label}
            </div>
          </div>
        </Rise>
      ))}
    </div>
  );
};

/** Card padrão do deck. Usado nas páginas de quatro cards. */
export const Card: React.FC<{
  variant: Tone;
  emphasis?: "plain" | "accent" | "dark";
  width?: number | string;
  height?: number;
  delay?: number;
  children: React.ReactNode;
}> = ({ variant, emphasis = "plain", width, height, delay = 0, children }) => {
  const t = tone(variant);
  const dark = variant === "ink" || variant === "forest";
  const bg =
    emphasis === "accent"
      ? t.accent
      : emphasis === "dark"
        ? "#08120C"
        : dark
          ? "rgba(234,246,238,0.05)"
          : "#FFFFFF";
  return (
    <Rise delay={delay} distance={36} duration={28}>
      <div
        style={{
          width,
          height,
          boxSizing: "border-box",
          borderRadius: 26,
          backgroundColor: bg,
          border: dark && emphasis === "plain" ? "1.5px solid rgba(234,246,238,0.1)" : "none",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          boxShadow:
            dark || emphasis !== "plain"
              ? "none"
              : "0 1px 0 rgba(6,24,15,0.05), 0 22px 54px rgba(6,24,15,0.06)",
        }}
      >
        {children}
      </div>
    </Rise>
  );
};

/** Cores de texto dentro de um `<Card>`, conforme a ênfase. */
export const cardInk = (variant: Tone, emphasis: "plain" | "accent" | "dark") => {
  if (emphasis === "accent") return { fg: "#06180F", muted: "rgba(6,24,15,0.66)" };
  if (emphasis === "dark") return { fg: "#F2F7F3", muted: "#7A9184" };
  const dark = variant === "ink" || variant === "forest";
  return dark
    ? { fg: "#EAF6EE", muted: "#86B79B" }
    : { fg: "#0A140E", muted: "#6F7C73" };
};
