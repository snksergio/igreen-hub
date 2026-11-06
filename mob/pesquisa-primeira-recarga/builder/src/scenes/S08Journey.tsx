import React from "react";
import { JOURNEY_ASSETS } from "../components/Asset";
import { SectionHead } from "../components/Blocks";
import { Frame } from "../components/Chrome";
import { Journey } from "../components/Journey";
import { journey } from "../lib/data";

/**
 * Os dois tempos da viagem são props porque a versão narrada estica a cena de
 * 14 s para 37 s: sem esticar o percurso junto, o carro chegaria ao fim e
 * ficaria parado mais de vinte segundos. Os padrões são os valores da versão
 * muda, então ela não muda em nada.
 */
export const S08Journey: React.FC<{
  travelStart?: number;
  travelEnd?: number;
}> = ({ travelStart = 24, travelEnd = 320 }) => {
  return (
    <Frame
      variant="light"
      section="Nove momentos"
      page="08"
      source={journey.source}
      marker={journey.marker}
    >
      <SectionHead
        variant="light"
        eyebrow="06 — Nove momentos"
        lines={journey.title}
        size={68}
        titleWidth={720}
        note={journey.note}
        noteWidth={900}
      />

      <div style={{ marginTop: 22 }}>
        <Journey
          variant="light"
          nodes={journey.nodes}
          assets={JOURNEY_ASSETS}
          failurePoints={journey.failurePoints}
          focusIndex={journey.focusIndex}
          travelStart={travelStart}
          travelEnd={travelEnd}
        />
      </div>
    </Frame>
  );
};
