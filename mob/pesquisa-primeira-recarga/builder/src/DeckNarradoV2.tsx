import { Audio } from "@remotion/media";
import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Easing, staticFile } from "remotion";
import { S01Cover } from "./scenes/S01Cover";
import { S02Agenda } from "./scenes/S02Agenda";
import { S03Market } from "./scenes/S03Market";
import { S04Platforms } from "./scenes/S04Platforms";
import { S05PainRanking } from "./scenes/S05PainRanking";
import { S06MoneyDonut } from "./scenes/S06MoneyDonut";
import { S07AppRatings } from "./scenes/S07AppRatings";
import { S08Journey } from "./scenes/S08Journey";
import { S09Territory } from "./scenes/S09Territory";
import { S10Physical } from "./scenes/S10Physical";
import { S11Divider } from "./scenes/S11Divider";
import { S12FrictionRuler } from "./scenes/S12FrictionRuler";
import { S13PaymentValves } from "./scenes/S13PaymentValves";
import { S14OtpDrop } from "./scenes/S14OtpDrop";
import { S15LockCards } from "./scenes/S15LockCards";
import { S16Regulators } from "./scenes/S16Regulators";
import { S17PriceLadder } from "./scenes/S17PriceLadder";
import { S18BrazilRails } from "./scenes/S18BrazilRails";
import { S19TollAnalogy } from "./scenes/S19TollAnalogy";
import { S20Tension } from "./scenes/S20Tension";
import { S21ProposedFlow } from "./scenes/S21ProposedFlow";
import { S22OpenQuestions } from "./scenes/S22OpenQuestions";
import { S23Closing } from "./scenes/S23Closing";
import { clip, lines, startOf } from "./lib/narration2";
import { riseOver, sweep } from "./transitions/presentations";

const SPRING = springTiming({ config: { damping: 200 }, durationInFrames: 24 });
const WIPE = linearTiming({
  durationInFrames: 22,
  easing: Easing.bezier(0.76, 0, 0.24, 1),
});

/**
 * O deck narrado, versão 2 — a que o vídeo mudo NÃO é.
 *
 * Mesmas 23 cenas, mesmos 22 cortes, mesma ordem. A única diferença é que a
 * duração de cada página vem de `lines[i].frames`, que foi medido a partir da
 * locução, em vez de ser um número escolhido para leitura silenciosa.
 *
 * A cena 08 recebe os tempos de viagem esticados: ela passa de 14 s para 37 s,
 * e sem isso o carro chegaria ao fim do trilho aos 11 s e ficaria parado o
 * resto do tempo.
 *
 * A composição `ConexaoMOB` continua intacta e é a versão final sem áudio.
 */
export const DeckNarradoV2: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
      <TransitionSeries.Sequence
        durationInFrames={lines[0].frames}
        name="01 Capa"
      >
        <S01Cover />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[1].frames}
        name="02 Agenda"
      >
        <S02Agenda />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[2].frames}
        name="03 O mercado real"
      >
        <S03Market />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[3].frames}
        name="04 Quatro plataformas"
      >
        <S04Platforms />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[4].frames}
        name="05 As dores por peso"
      >
        <S05PainRanking />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[5].frames}
        name="06 O problema é dinheiro"
      >
        <S06MoneyDonut />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[6].frames}
        name="07 Amado x odiado"
      >
        <S07AppRatings />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[7].frames}
        name="08 Nove momentos"
      >
        <S08Journey travelStart={60} travelEnd={700} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[8].frames}
        name="09 Um terço sem sinal"
      >
        <S09Territory />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[9].frames}
        name="10 O totem ao sol"
      >
        <S10Physical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[10].frames}
        name="11 M6 funil de morte"
      >
        <S11Divider />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[11].frames}
        name="12 Duas ou vinte ações"
      >
        <S12FrictionRuler />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[12].frames}
        name="13 As quatro válvulas"
      >
        <S13PaymentValves />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[13].frames}
        name="14 O teto do SMS"
      >
        <S14OtpDrop />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[14].frames}
        name="15 O app como fechadura"
      >
        <S15LockCards />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[15].frames}
        name="16 Três reguladores"
      >
        <S16Regulators />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[16].frames}
        name="17 Não se trava, se recompensa"
      >
        <S17PriceLadder />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[17].frames}
        name="18 O que o Brasil tem"
      >
        <S18BrazilRails />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[18].frames}
        name="19 A tag do pedágio"
      >
        <S19TollAnalogy />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[19].frames}
        name="20 A tensão do modelo"
      >
        <S20Tension />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[20].frames}
        name="21 O fluxo proposto"
      >
        <S21ProposedFlow />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence
        durationInFrames={lines[21].frames}
        name="22 As respostas que faltam"
      >
        <S22OpenQuestions />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence
        durationInFrames={lines[22].frames}
        name="23 Encerramento"
      >
        <S23Closing />
      </TransitionSeries.Sequence>
      </TransitionSeries>

      {lines.map((l) => (
        <Audio
          key={l.scene}
          name={`Narração ${l.scene}`}
          src={staticFile(clip(l.scene))}
          from={startOf(l.scene)}
          durationInFrames={Math.ceil(l.dur * 30)}
        />
      ))}
    </AbsoluteFill>
  );
};
