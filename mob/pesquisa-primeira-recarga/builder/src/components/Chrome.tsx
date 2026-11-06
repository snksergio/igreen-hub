import React from "react";
import { AbsoluteFill } from "remotion";
import { footer as footerCopy, brand, type Marker } from "../lib/data";
import { display, text } from "../lib/fonts";
import { IgreenMark } from "./Logo";

export type Tone = "light" | "paper" | "ink" | "forest" | "brand";

/**
 * Os cinco tons, derivados da marca iGreen. O verde institucional #00A859 é
 * o acento; sobre fundo escuro ele perde presença, então `ink` e `forest`
 * usam a variante clara #5DD389.
 *
 * `accentText` existe porque #00A859 fica em ~2,8:1 sobre o papel claro —
 * abaixo do piso de texto — então a tipografia usa uma variante escurecida.
 * Sobre fundo escuro os dois coincidem.
 */
const TONES: Record<
  Tone,
  {
    bg: string;
    fg: string;
    muted: string;
    accent: string;
    accentText: string;
    hairline: string;
  }
> = {
  light: {
    bg: '#F1F3F0',
    fg: '#0A140E',
    muted: '#6F7C73',
    accent: '#00A859',
    accentText: '#00874A',
    hairline: '#D6DCD6',
  },
  paper: {
    bg: '#FFFFFF',
    fg: '#0A140E',
    muted: '#6F7C73',
    accent: '#00A859',
    accentText: '#00874A',
    hairline: '#E1E7E1',
  },
  ink: {
    bg: '#08120C',
    fg: '#F2F7F3',
    muted: '#7A9184',
    accent: '#5DD389',
    accentText: '#5DD389',
    hairline: 'rgba(242,247,243,0.12)',
  },
  forest: {
    bg: '#073A22',
    fg: '#EAF6EE',
    muted: '#86B79B',
    accent: '#5DD389',
    accentText: '#5DD389',
    hairline: 'rgba(93,211,137,0.20)',
  },
  brand: {
    bg: '#00A859',
    fg: '#06180F',
    muted: 'rgba(6,24,15,0.68)',
    accent: '#06180F',
    accentText: '#06180F',
    hairline: 'rgba(6,24,15,0.22)',
  },
};

export const tone = (t: Tone) => TONES[t];

/**
 * O isotipo oficial da iGreen. Mantém a assinatura `{size, fg, bg}` do
 * monograma que existia antes para não quebrar quem já o chamava; `bg` não é
 * usado, porque a marca real é de uma cor só.
 */
export const Mark: React.FC<{ size?: number; fg: string; bg?: string }> = ({
  size = 38,
  fg,
}) => <IgreenMark size={size} color={fg} />;

export const Pill: React.FC<{
  fg: string;
  bg: string;
  border?: string;
  dot?: string;
  size?: number;
  children: React.ReactNode;
}> = ({ fg, bg, border, dot, size = 26, children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      backgroundColor: bg,
      color: fg,
      border: border ? `1.5px solid ${border}` : "none",
      borderRadius: 999,
      padding: `${Math.round(size * 0.48)}px ${Math.round(size * 0.96)}px`,
      fontFamily: text,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: "-0.005em",
      whiteSpace: "nowrap",
    }}
  >
    {dot ? (
      <span
        style={{
          width: Math.round(size * 0.38),
          height: Math.round(size * 0.38),
          borderRadius: 999,
          backgroundColor: dot,
        }}
      />
    ) : null}
    {children}
  </div>
);

export const ArrowPill: React.FC<{
  color: string;
  width?: number;
  height?: number;
  progress?: number;
}> = ({ color, width = 148, height = 70, progress = 1 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 148 70"
    style={{ verticalAlign: "middle", marginBottom: "0.06em" }}
  >
    <rect
      x={1.4}
      y={1.4}
      width={145.2}
      height={67.2}
      rx={33.6}
      fill="none"
      stroke={color}
      strokeWidth={2.8}
      strokeDasharray={430}
      strokeDashoffset={430 * (1 - progress)}
    />
    <path
      d={`M40 35 H${40 + 62 * Math.min(1, Math.max(0, (progress - 0.55) / 0.45))}`}
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
      opacity={progress > 0.55 ? 1 : 0}
    />
    <path
      d="M96 26 L106 35 L96 44"
      fill="none"
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={progress > 0.86 ? 1 : 0}
    />
  </svg>
);

export const Eyebrow: React.FC<{
  color: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ color, children, style }) => (
  <div
    style={{
      fontFamily: text,
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

const MARKER_LABEL: Record<Marker, string> = {
  pesquisa: "Pesquisa",
  regulacao: "Regulação",
  hipotese: "Hipótese",
  fragil: "Fonte frágil",
  gap: "Lacuna",
};

/**
 * O componente mais importante do deck: diz de onde vem a autoridade da
 * página. É metadado, não destaque — por isso usa hairline e `muted`, e não
 * o acento. A exceção é `hipotese`, a única categoria que o leitor precisa
 * notar de longe.
 */
export const MarkerPill: React.FC<{ kind: Marker; variant: Tone }> = ({
  kind,
  variant,
}) => {
  const t = TONES[variant];
  const loud = kind === "hipotese";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 34,
        padding: "0 16px",
        borderRadius: 999,
        border: `1.5px solid ${loud ? t.accentText : t.hairline}`,
        color: loud ? t.accentText : t.muted,
        fontFamily: text,
        fontSize: 19,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {MARKER_LABEL[kind]}
    </span>
  );
};

/**
 * Chrome de página. Diferença em relação ao deck original: a coluna central
 * do rodapé deixa de ser a data fixa e passa a ser a procedência do dado
 * principal da página, e o trilho superior ganha o marcador.
 */
export const Frame: React.FC<{
  variant?: Tone;
  section: string;
  page: string;
  source?: string;
  marker?: Marker;
  backdrop?: React.ReactNode;
  children: React.ReactNode;
}> = ({ variant = "light", section, page, source, marker, backdrop, children }) => {
  const t = TONES[variant];
  return (
    <AbsoluteFill
      style={{ backgroundColor: t.bg, fontFamily: text, overflow: "hidden" }}
    >
      {backdrop}

      <div
        style={{
          position: "absolute",
          top: 58,
          left: 104,
          right: 104,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Mark size={34} fg={t.accent} />
          <span
            style={{
              fontFamily: display,
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: t.fg,
            }}
          >
            {brand.product}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {marker ? <MarkerPill kind={marker} variant={variant} /> : null}
          <span
            style={{
              fontSize: 25,
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: t.muted,
            }}
          >
            {section}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 54,
              height: 42,
              padding: "0 14px",
              borderRadius: 999,
              border: `1.5px solid ${t.hairline}`,
              fontFamily: display,
              fontSize: 24,
              fontWeight: 600,
              color: t.fg,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {page}
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 168,
          left: 104,
          right: 104,
          bottom: 128,
        }}
      >
        {children}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 104,
          right: 104,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 40,
          fontSize: 24,
          fontWeight: 500,
          color: t.muted,
        }}
      >
        <span style={{ flex: 1 }}>{footerCopy.left}</span>
        <span style={{ flex: 1, textAlign: "center", whiteSpace: "nowrap" }}>
          {source ?? ""}
        </span>
        <span style={{ flex: 1, textAlign: "right" }}>{footerCopy.right}</span>
      </div>
    </AbsoluteFill>
  );
};
