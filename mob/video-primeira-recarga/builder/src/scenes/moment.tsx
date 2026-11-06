import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {C, SANS, SERIF, MONO} from '../theme';
import {Frame, T, Kicker, Rise} from '../ui';
import {Icon} from '../icons';
import {REN, JOR, Mom} from '../data';

const sevColor = (s: string) => s === 'ponto cego' ? '#8C7FB8' : s === 'alto' ? C.olive2 : C.brick;

const Bubble: React.FC<{d: number; who: string; accent: string; text: string; ctx: string; dark?: boolean}> = ({d, who, accent, text, ctx, dark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - d, fps, config: {damping: 200, stiffness: 95, mass: 0.8}});
  return (
    <div style={{opacity: s, transform: `translateY(${(1 - s) * 26}px)`}}>
      <div style={{display: 'flex', gap: 20, alignItems: 'flex-start'}}>
        <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: accent, paddingTop: 26, flex: '0 0 108px', textAlign: 'right'}}>{who}</div>
        <div style={{flex: 1}}>
          <div style={{background: dark ? 'rgba(255,255,255,0.055)' : C.white, borderRadius: '22px 22px 22px 6px',
            padding: '28px 36px', border: `1px solid ${dark ? 'rgba(255,255,255,0.09)' : '#DCE0D0'}`}}>
            <div style={{fontFamily: SANS, fontSize: 41, lineHeight: 1.22, letterSpacing: '-0.028em',
              color: dark ? C.paper : C.ink, fontWeight: 500}}>{text}</div>
          </div>
          <div style={{marginTop: 14, fontSize: 21, lineHeight: 1.42, color: dark ? C.mute : C.ink2, maxWidth: 620}}>{ctx}</div>
        </div>
      </div>
    </div>
  );
};

/** curva viva no rodapé, marcando o momento atual */
const MiniCurve: React.FC<{idx: number; dark?: boolean}> = ({idx, dark}) => {
  const f = useCurrentFrame();
  const w = 1180, h = 158, pad = 12;
  const X = (i: number) => pad + i * ((w - pad * 2) / 12);
  const Y = (v: number) => 16 + (v - 40) * (h - 42) / 132;
  const line = (a: number[]) => a.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  const grow = interpolate(f, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
  const mx = X(idx);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width: '100%', height: h}}>
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.brick} stopOpacity="0.22" />
          <stop offset="100%" stopColor={C.brick} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`${line(REN)} ${X(12)},${h} ${X(0)},${h}`} fill="url(#mg)" stroke="none" opacity={grow} />
      <polyline points={line(JOR)} fill="none" stroke={dark ? C.lime : C.olive2} strokeWidth="2.6" strokeLinejoin="round" opacity={0.85 * grow} />
      <polyline points={line(REN)} fill="none" stroke={C.brick} strokeWidth="3.2" strokeLinejoin="round" opacity={grow} />
      <line x1={mx} y1="0" x2={mx} y2={h} stroke={dark ? C.lime : C.ink} strokeWidth="1.4" strokeDasharray="4 5" opacity="0.65" />
      <circle cx={mx} cy={Y(REN[idx])} r="10" fill={C.brick} />
      <circle cx={mx} cy={Y(JOR[idx])} r="9" fill={dark ? C.lime : C.olive2} />
    </svg>
  );
};

export const Moment: React.FC<{o: Mom; idx: number}> = ({o, idx}) => {
  const dark = !!o.dark;
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, o.dur], [0, -10]);
  return (
    <Frame bg={dark ? C.deep : C.paper} dark={dark} num={o.m.replace('·', '.')} foot={o.where}>
      <div style={{transform: `translateY(${drift}px)`, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0}}>
        <Rise d={0}><Kicker color={dark ? C.lime : C.ink2}>{o.m} · {o.where}</Kicker></Rise>
        <Rise d={4} style={{marginTop: 22}}>
          <T size={82} color={dark ? C.paper : C.ink}>{o.t}</T>
        </Rise>
        <div style={{display: 'flex', gap: 70, marginTop: 44, flex: 1, minHeight: 0, alignItems: 'center'}}>
          <Rise d={10} style={{flex: '0 0 384px', alignSelf: 'center'}}>
            <div style={{width: 384, height: 286, background: dark ? 'rgba(255,255,255,0.04)' : C.white,
              borderRadius: 24, padding: 34, border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#DCE0D0'}`}}>
              <Icon name={o.ic} c={dark ? C.lime : C.olive2} />
            </div>
          </Rise>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 38, justifyContent: 'center'}}>
            <Bubble d={16} who="Renata" accent={C.brick} text={o.a} ctx={o.ac} dark={dark} />
            <Bubble d={30} who="Jorge" accent={dark ? C.lime : C.olive2} text={o.b} ctx={o.bc} dark={dark} />
          </div>
        </div>
        <Rise d={46} style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 24}}>
          <span style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '9px 16px', background: sevColor(o.sev), color: dark ? C.deep : C.white, borderRadius: 4, whiteSpace: 'nowrap'}}>{o.sev}</span>
          <p style={{margin: 0, fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: '-0.026em',
            color: dark ? C.paper : C.ink, lineHeight: 1.2}}>{o.hurt}</p>
        </Rise>
        <div style={{marginTop: 20, opacity: 0.95}}><MiniCurve idx={idx} dark={dark} /></div>
      </div>
    </Frame>
  );
};
