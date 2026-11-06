import React from "react";
import { Composition, Folder } from "remotion";
import { Deck } from "./Deck";
import { DeckNarradoV2 } from "./DeckNarradoV2";
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
import { S23ClosingV2 } from "./scenes/S23ClosingV2";
import { totalFrames } from "./lib/narration2";
import "./index.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ConexaoMOB"
        component={Deck}
        durationInFrames={3747}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ConexaoMOB-Narrado"
        component={DeckNarradoV2}
        durationInFrames={totalFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Cenas">
        <Composition
          id="01-Capa"
          component={S01Cover}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="02-Agenda"
          component={S02Agenda}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="03-Mercado"
          component={S03Market}
          durationInFrames={168}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="04-Plataformas"
          component={S04Platforms}
          durationInFrames={174}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="05-Dores"
          component={S05PainRanking}
          durationInFrames={186}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="06-Dinheiro"
          component={S06MoneyDonut}
          durationInFrames={168}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="07-Notas"
          component={S07AppRatings}
          durationInFrames={168}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="08-Jornada"
          component={S08Journey}
          durationInFrames={420}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="09-Territorio"
          component={S09Territory}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="10-Totem"
          component={S10Physical}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="11-Funil"
          component={S11Divider}
          durationInFrames={156}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="12-Atrito"
          component={S12FrictionRuler}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="13-Valvulas"
          component={S13PaymentValves}
          durationInFrames={186}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="14-SMS"
          component={S14OtpDrop}
          durationInFrames={168}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="15-Fechadura"
          component={S15LockCards}
          durationInFrames={174}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="16-Reguladores"
          component={S16Regulators}
          durationInFrames={186}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="17-Escada"
          component={S17PriceLadder}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="18-Brasil"
          component={S18BrazilRails}
          durationInFrames={174}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="19-Pedagio"
          component={S19TollAnalogy}
          durationInFrames={168}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="20-Tensao"
          component={S20Tension}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="21-Fluxo"
          component={S21ProposedFlow}
          durationInFrames={195}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="22-Perguntas"
          component={S22OpenQuestions}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="23-Encerramento"
          component={S23Closing}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="23b-Encerramento-v2"
          component={S23ClosingV2}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
