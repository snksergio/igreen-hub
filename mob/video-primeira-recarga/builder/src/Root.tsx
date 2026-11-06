import React from 'react';
import {Composition} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {wipe} from '@remotion/transitions/wipe';
import {Fonts} from './fonts';
import {W, H, FPS} from './theme';
import {MOMENTS} from './data';
import {Cover, Numbers, Ruler, Personas} from './scenes/intro';
import {Moment} from './scenes/moment';
import {Curve, TwoProblems, World, Tension, Close} from './scenes/outro';

const TR = 14;
const t = (dir: any) => ({presentation: wipe({direction: dir}), timing: linearTiming({durationInFrames: TR})});
const fd = {presentation: fade(), timing: linearTiming({durationInFrames: TR})};

const Film: React.FC = () => (
  <>
    <Fonts />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150}><Cover /></TransitionSeries.Sequence>
      <TransitionSeries.Transition {...t('from-right')} />
      <TransitionSeries.Sequence durationInFrames={210}><Numbers /></TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fd} />
      <TransitionSeries.Sequence durationInFrames={230}><Ruler /></TransitionSeries.Sequence>
      <TransitionSeries.Transition {...t('from-bottom')} />
      <TransitionSeries.Sequence durationInFrames={230}><Personas /></TransitionSeries.Sequence>
      {MOMENTS.map((m, i) => (
        <React.Fragment key={m.m}>
          <TransitionSeries.Transition {...(i % 3 === 0 ? t('from-right') : fd)} />
          <TransitionSeries.Sequence durationInFrames={m.dur}><Moment o={m} idx={i} /></TransitionSeries.Sequence>
        </React.Fragment>
      ))}
      <TransitionSeries.Transition {...t('from-bottom')} />
      <TransitionSeries.Sequence durationInFrames={270}><Curve /></TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fd} />
      <TransitionSeries.Sequence durationInFrames={250}><TwoProblems /></TransitionSeries.Sequence>
      <TransitionSeries.Transition {...t('from-right')} />
      <TransitionSeries.Sequence durationInFrames={280}><World /></TransitionSeries.Sequence>
      <TransitionSeries.Transition {...fd} />
      <TransitionSeries.Sequence durationInFrames={270}><Tension /></TransitionSeries.Sequence>
      <TransitionSeries.Transition {...t('from-bottom')} />
      <TransitionSeries.Sequence durationInFrames={250}><Close /></TransitionSeries.Sequence>
    </TransitionSeries>
  </>
);

const TOTAL = 150 + 210 + 230 + 230 + MOMENTS.reduce((a, m) => a + m.dur, 0) + 270 + 250 + 280 + 270 + 250
  - TR * (4 + MOMENTS.length + 5);

export const Root: React.FC = () => (
  <Composition id="PrimeiraRecarga" component={Film} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
