import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { Easing } from "remotion";
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
import { riseOver, sweep } from "./transitions/presentations";

const SPRING = springTiming({ config: { damping: 200 }, durationInFrames: 24 });
const WIPE = linearTiming({
  durationInFrames: 22,
  easing: Easing.bezier(0.76, 0, 0.24, 1),
});

/**
 * 23 cenas, 22 cortes. A duração total é a soma das cenas menos a soma das
 * transições: 4251 − 504 = 3747 frames.
 *
 * Regra herdada: entre duas páginas do mesmo tom, sempre `riseOver` — o
 * crossfade deixaria os dois títulos legíveis ao mesmo tempo. A cor passada
 * ao `sweep` é a da linha que cavalga a borda, escolhida para contrastar com
 * a página que entra.
 */
export const Deck: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150} name="01 Capa">
        <S01Cover />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={150} name="02 Agenda">
        <S02Agenda />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={168} name="03 O mercado real">
        <S03Market />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={174} name="04 Quatro plataformas">
        <S04Platforms />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={186} name="05 As dores por peso">
        <S05PainRanking />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={168} name="06 O problema é dinheiro">
        <S06MoneyDonut />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={168} name="07 Amado x odiado">
        <S07AppRatings />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={420} name="08 Nove momentos">
        <S08Journey />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={195} name="09 Um terço sem sinal">
        <S09Territory />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={180} name="10 O totem ao sol">
        <S10Physical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={156} name="11 M6 funil de morte">
        <S11Divider />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={180} name="12 Duas ou vinte ações">
        <S12FrictionRuler />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={186} name="13 As quatro válvulas">
        <S13PaymentValves />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={168} name="14 O teto do SMS">
        <S14OtpDrop />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={174} name="15 O app como fechadura">
        <S15LockCards />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={186} name="16 Três reguladores">
        <S16Regulators />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={195} name="17 Não se trava, se recompensa">
        <S17PriceLadder />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={174} name="18 O que o Brasil tem">
        <S18BrazilRails />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#C9F53C")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={168} name="19 A tag do pedágio">
        <S19TollAnalogy />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={180} name="20 A tensão do modelo">
        <S20Tension />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={195} name="21 O fluxo proposto">
        <S21ProposedFlow />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={riseOver()} timing={SPRING} />

      <TransitionSeries.Sequence durationInFrames={180} name="22 As respostas que faltam">
        <S22OpenQuestions />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={sweep("#0B0E0B")} timing={WIPE} />

      <TransitionSeries.Sequence durationInFrames={150} name="23 Encerramento">
        <S23Closing />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
