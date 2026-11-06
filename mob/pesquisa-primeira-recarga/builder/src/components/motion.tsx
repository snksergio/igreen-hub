import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

/** Eased 0 → 1 ramp starting at `delay`. The house easing for the whole deck. */
export const useReveal = (delay = 0, duration = 22) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

/** Fade + lift. Used for stacked list items and repeated cards. */
export const Rise: React.FC<{
  delay?: number;
  distance?: number;
  duration?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, distance = 30, duration = 24, style, children }) => {
  const p = useReveal(delay, duration);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.35),
        translate: `0px ${(1 - p) * distance}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Horizontal variant, for rail items and pills. */
export const SlideIn: React.FC<{
  delay?: number;
  distance?: number;
  duration?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, distance = 40, duration = 26, style, children }) => {
  const p = useReveal(delay, duration);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.4),
        translate: `${(1 - p) * -distance}px 0px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Masked wipe — text rises out from behind a hard edge. */
export const Curtain: React.FC<{
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, duration = 30, style, children }) => {
  const p = useReveal(delay, duration);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.12em", ...style }}>
      <div
        style={{
          translate: `0px ${(1 - p) * 110}%`,
          opacity: p < 0.02 ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const fmt = (n: number, decimals: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** Count-up that lands exactly on the target value. */
export const Ticker: React.FC<{
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  duration?: number;
}> = ({ to, decimals = 0, prefix = "", suffix = "", delay = 0, duration = 46 }) => {
  const p = useReveal(delay, duration);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {fmt(to * p, decimals)}
      {suffix}
    </span>
  );
};
