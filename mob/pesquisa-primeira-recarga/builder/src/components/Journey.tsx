import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Asset, type AssetName } from "./Asset";
import { tone, type Tone } from "./Chrome";
import { display, text } from "../lib/fonts";

/**
 * A régua de nove momentos, percorrida por um carro.
 *
 * O carro anda pela linha em velocidade constante. Cada estação começa
 * apagada e sobe para 100% quando o carro chega nela, e a bolinha do trilho
 * fica marcada. Ao mesmo tempo a câmera vai se afastando, de modo que quando
 * o carro chega na nona estação a faixa inteira já cabe na tela.
 *
 * **Tudo é HTML, nada é `<text>` de SVG.** Um `<g opacity>` dentro de um SVG
 * que depois é escalado por CSS é rasterizado pelo browser ANTES da escala, e
 * o buffer corta as letras no meio — foi exatamente o defeito que aparecia
 * como "texto picado". Div com texto escala limpo.
 */

const SLOT = 420;
const COUNT = 9;
const WORLD_W = SLOT * COUNT;
const WORLD_H = 400;
const VIEW_W = 1712;
const VIEW_H = 560;

const K_FIT = VIEW_W / WORLD_W;
/** Zoom máximo: acima disso o mundo não cabe na altura do viewport. */
const K_NEAR = 1.35;
const RAIL_Y = 356;
const CAR_W = 130;

const sx = (i: number) => SLOT / 2 + i * SLOT;

export const Journey: React.FC<{
  variant: Tone;
  nodes: { id: string; label: string[]; pain: string }[];
  assets: AssetName[];
  failurePoints: number[];
  focusIndex: number;
  /** Frame em que o carro começa a andar. */
  travelStart?: number;
  /** Frame em que o carro chega na última estação. */
  travelEnd?: number;
}> = ({
  variant,
  nodes,
  assets,
  failurePoints,
  focusIndex,
  travelStart = 24,
  travelEnd = 320,
}) => {
  const frame = useCurrentFrame();
  const t = tone(variant);

  // O carro para 130 px depois da última estação: parando em cima dela, ela
  // congelaria a 57% e ficaria mais apagada que todas as outras no panorama.
  const carX = interpolate(frame, [travelStart, travelEnd], [sx(0), sx(COUNT - 1) + 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  const k = interpolate(
    frame,
    [0, travelStart, (travelStart + travelEnd) / 2, travelEnd],
    [1.5, K_NEAR, 1.02, K_FIT],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.4, 1),
    },
  );

  /**
   * A câmera segue o carro, mas nunca a ponto de deixar mundo vazio na borda.
   * Quando o zoom abre o bastante, os dois limites se encontram e o clamp
   * sozinho já centraliza a faixa — sem precisar de uma fase separada.
   */
  const halfView = VIEW_W / (2 * k);
  const cx = Math.min(Math.max(carX, halfView), WORLD_W - halfView);
  const tx = VIEW_W / (2 * k) - cx;

  /** Quanto a estação já foi "visitada": 0 antes do carro, 1 depois. */
  const visitOf = (i: number) =>
    Math.max(0, Math.min(1, (carX - (sx(i) - 170)) / 300));

  /** Estação perto da borda perde opacidade em vez de ser cortada no meio. */
  const edgeOf = (worldX: number) => {
    const d = Math.abs(k * (worldX + tx) - VIEW_W / 2);
    return Math.max(0, Math.min(1, (VIEW_W / 2 - d) / 150));
  };

  return (
    <div style={{ width: VIEW_W, height: VIEW_H, position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: (VIEW_H - WORLD_H) / 2,
          width: WORLD_W,
          height: WORLD_H,
          transformOrigin: "0px 50%",
          translate: `${tx}px 0px`,
          scale: k,
        }}
      >
        {failurePoints.map((idx) => (
          <div
            key={`band-${idx}`}
            style={{
              position: "absolute",
              left: sx(idx) - SLOT / 2 + 14,
              top: 4,
              width: SLOT - 28,
              height: 340,
              borderRadius: 20,
              backgroundColor: t.accentText,
              opacity: 0.1 * visitOf(idx) * edgeOf(sx(idx)),
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: 0,
            top: RAIL_Y - 1.5,
            width: WORLD_W,
            height: 3,
            borderRadius: 2,
            backgroundColor: t.hairline,
          }}
        />

        {/* O trecho já percorrido fica no acento — é o rastro do carro. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: RAIL_Y - 1.5,
            width: Math.max(0, carX),
            height: 3,
            borderRadius: 2,
            backgroundColor: t.accentText,
            opacity: 0.55,
          }}
        />

        {nodes.map((n, i) => {
          const p = visitOf(i);
          const edge = edgeOf(sx(i));
          const focus = i === focusIndex;
          const visited = p > 0.55;

          return (
            <div
              key={n.id}
              style={{
                position: "absolute",
                left: sx(i) - SLOT / 2,
                top: 0,
                width: SLOT,
                textAlign: "center",
                opacity: (0.2 + 0.8 * p) * edge,
                translate: `0px ${(1 - p) * 36}px`,
              }}
            >
              <div
                style={{
                  fontFamily: display,
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: focus && visited ? t.accentText : t.muted,
                  marginBottom: 6,
                }}
              >
                {n.id}
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Asset name={assets[i]} width={150} />
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontFamily: display,
                  fontSize: 28,
                  fontWeight: 600,
                  lineHeight: 1.14,
                  letterSpacing: "-0.015em",
                  color: t.fg,
                }}
              >
                {n.label[0]}
                <br />
                {n.label[1]}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontFamily: text,
                  fontSize: 21,
                  fontWeight: focus ? 600 : 500,
                  lineHeight: 1.2,
                  color: focus && visited ? t.accentText : t.muted,
                }}
              >
                {n.pain}
              </div>
            </div>
          );
        })}

        {/* As bolinhas ficam fora do bloco que sobe, para o trilho não tremer. */}
        {nodes.map((n, i) => {
          const p = visitOf(i);
          const edge = edgeOf(sx(i));
          const focus = i === focusIndex;
          const visited = p > 0.55;
          const halo = ((frame + 10) % 72) / 72;
          const r = visited ? (focus ? 13 : 9) : 6;

          return (
            <div key={`dot-${n.id}`} style={{ opacity: edge }}>
              {focus && visited ? (
                <div
                  style={{
                    position: "absolute",
                    left: sx(i) - (16 + halo * 30),
                    top: RAIL_Y - (16 + halo * 30),
                    width: (16 + halo * 30) * 2,
                    height: (16 + halo * 30) * 2,
                    borderRadius: 999,
                    border: `2.5px solid ${t.accentText}`,
                    opacity: (1 - halo) * 0.6,
                  }}
                />
              ) : null}
              <div
                style={{
                  position: "absolute",
                  left: sx(i) - r - 5,
                  top: RAIL_Y - r - 5,
                  width: (r + 5) * 2,
                  height: (r + 5) * 2,
                  borderRadius: 999,
                  backgroundColor: t.bg,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: sx(i) - r,
                  top: RAIL_Y - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: 999,
                  // Visitado é sempre o acento: o que distingue o momento em
                  // foco é o raio maior e o halo, não uma segunda cor.
                  backgroundColor: visited ? t.accentText : t.hairline,
                }}
              />
            </div>
          );
        })}

        {/*
          O PNG lateral vem virado para a esquerda; sem o flip o carro anda de
          ré. Ele vive dentro do mundo, então encolhe junto com a câmera — que
          é o que se espera de um carro numa estrada vista de longe.
        */}
        <div
          style={{
            position: "absolute",
            left: carX - CAR_W / 2,
            top: RAIL_Y - CAR_W / 2,
            scale: "-1 1",
            opacity: interpolate(frame, [travelStart - 16, travelStart], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <Asset name="carro2" width={CAR_W} />
        </div>
      </div>
    </div>
  );
};
