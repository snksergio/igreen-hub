import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * The deck's signature cut: the incoming page rises over the outgoing one,
 * which sinks back and dims. Rounded corners on the way in sell the "card"
 * language of the reference layouts.
 */
const RiseOverComponent: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationDirection, presentationProgress }) => {
  if (presentationDirection === "entering") {
    return (
      <AbsoluteFill
        style={{
          translate: `0px ${(1 - presentationProgress) * 102}%`,
          borderTopLeftRadius: (1 - presentationProgress) * 56,
          borderTopRightRadius: (1 - presentationProgress) * 56,
          overflow: "hidden",
          boxShadow: `0px -50px 140px rgba(0,0,0,${0.45 * (1 - presentationProgress)})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        scale: 1 - presentationProgress * 0.07,
        filter: `brightness(${1 - presentationProgress * 0.3})`,
        borderRadius: presentationProgress * 40,
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const riseOver = (): TransitionPresentation<Record<string, never>> => ({
  component: RiseOverComponent,
  props: {},
});

/**
 * Diagonal hard-edge sweep with an accent line riding the boundary.
 */
const SweepComponent: React.FC<
  TransitionPresentationComponentProps<{ accent: string }>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          scale: 1 - presentationProgress * 0.04,
          filter: `brightness(${1 - presentationProgress * 0.18})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const edgeTop = (1 - presentationProgress) * 134 - 17;
  const edgeBottom = edgeTop + 17;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `polygon(${edgeTop}% 0%, 110% 0%, 110% 100%, ${edgeBottom}% 100%)`,
          translate: `${(1 - presentationProgress) * 2.5}% 0px`,
        }}
      >
        {children}
      </AbsoluteFill>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <line
          x1={edgeTop}
          y1={0}
          x2={edgeBottom}
          y2={100}
          stroke={passedProps.accent}
          strokeWidth={0.32}
          vectorEffect="non-scaling-stroke"
          opacity={presentationProgress > 0.985 ? 0 : 1}
        />
      </svg>
    </AbsoluteFill>
  );
};

export const sweep = (
  accent = "#C9F53C",
): TransitionPresentation<{ accent: string }> => ({
  component: SweepComponent,
  props: { accent },
});
