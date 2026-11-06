import React from 'react';
import {useCurrentFrame, spring, interpolate, useVideoConfig} from 'remotion';
import {C, SANS, SERIF, MONO, PAD} from './theme';

export const useRise = (delay = 0, dist = 34) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.7, stiffness: 110}});
  return {opacity: s, transform: `translateY(${(1 - s) * dist}px)`};
};

export const Rise: React.FC<{d?: number; dist?: number; style?: any; children: any}> = ({d = 0, dist = 34, style, children}) => (
  <div style={{...useRise(d, dist), ...style}}>{children}</div>
);

/** título com <i>palavra</i> em serifa itálica */
export const T: React.FC<{children: string; size?: number; color?: string; w?: number; style?: any}> = ({children, size = 108, color = C.ink, w = 600, style}) => {
  const parts = children.split(/(<i>.*?<\/i>)/g).filter(Boolean);
  return (
    <h1 style={{margin: 0, fontFamily: SANS, fontWeight: w, fontSize: size, lineHeight: 0.94,
      letterSpacing: '-0.045em', color, ...style}}>
      {parts.map((p, i) => p.startsWith('<i>')
        ? <em key={i} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, letterSpacing: '-0.015em', fontSize: '1.06em'}}>{p.slice(3, -4)}</em>
        : <span key={i}>{p}</span>)}
    </h1>
  );
};

export const Kicker: React.FC<{children: any; color?: string; line?: boolean}> = ({children, color = C.ink2, line = true}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: MONO, fontSize: 19,
    letterSpacing: '0.16em', textTransform: 'uppercase', color}}>
    {line && <span style={{width: 46, height: 1, background: color, opacity: .5, display: 'block'}} />}
    {children}
  </div>
);

export const Chip: React.FC<{children: any; color?: string; bg?: string; bd?: string}> = ({children, color = C.ink, bg = 'transparent', bd}) => (
  <span style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.1em', textTransform: 'uppercase',
    padding: '10px 20px', borderRadius: 999, border: `1px solid ${bd ?? color}`, color, background: bg, whiteSpace: 'nowrap'}}>
    {children}
  </span>
);

export const ArrowCircle: React.FC<{size?: number; color?: string; rot?: number}> = ({size = 74, color = C.ink, rot = 0}) => (
  <div style={{width: size, height: size, borderRadius: '50%', border: `1px solid ${color}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${rot}deg)`}}>
    <svg width={size * .34} height={size * .34} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  </div>
);

export const Ast: React.FC<{size?: number; color?: string; spin?: number}> = ({size = 40, color = C.lime, spin = 0}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `rotate(${spin}deg)`}}>
    <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const Frame: React.FC<{bg?: string; children: any; foot?: string; num?: string; dark?: boolean}> = ({bg = C.paper, children, foot, num, dark}) => {
  const fc = dark ? C.mute : C.ink2;
  return (
    <div style={{position: 'absolute', inset: 0, background: bg, padding: `${PAD - 24}px ${PAD}px ${PAD - 40}px`,
      display: 'flex', flexDirection: 'column', fontFamily: SANS, overflow: 'hidden'}}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0}}>{children}</div>
      <div style={{marginTop: 26, paddingTop: 22, borderTop: `1px solid ${dark ? '#2E3D1D' : '#CCD2BE'}`,
        display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 17, letterSpacing: '0.09em',
        textTransform: 'uppercase', color: fc}}>
        <span>Conexão Mobi</span>
        <span style={{margin: '0 16px', opacity: .45}}>/</span>
        <span>{foot ?? 'Discovery · primeira recarga'}</span>
        <span style={{marginLeft: 'auto'}}>{num}</span>
      </div>
    </div>
  );
};

/** número grande com gradiente lima */
export const BigNum: React.FC<{children: any; size?: number; from?: string; to?: string}> = ({children, size = 168, from = C.lime, to = C.lime2}) => (
  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 0.88, letterSpacing: '-0.055em',
    background: `linear-gradient(105deg,${from},${to})`, WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent', fontVariantNumeric: 'tabular-nums'}}>{children}</div>
);

/** contador animado */
export const Count: React.FC<{to: number; delay?: number; dur?: number; fmt?: (n: number) => string}> = ({to, delay = 0, dur = 34, fmt}) => {
  const f = useCurrentFrame();
  const t = interpolate(f - delay, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const e = 1 - Math.pow(1 - t, 3);
  const v = to * e;
  return <>{fmt ? fmt(v) : Math.round(v).toLocaleString('pt-BR')}</>;
};

/** barra escalonada com gradiente (ref: barras do deck verde) */
export const StepBar: React.FC<{w: number; delay: number; label: string; value: string; bad?: boolean; h?: number}> = ({w, delay, label, value, bad, h = 116}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 200, mass: 1, stiffness: 60}});
  const grad = bad
    ? `linear-gradient(90deg,${C.olive} 0%, ${C.olive2} 55%, rgba(74,93,44,0.06) 100%)`
    : `linear-gradient(90deg,${C.lime2} 0%, ${C.lime} 45%, rgba(201,242,77,0.05) 100%)`;
  const tight = w < 30;
  const bar = (
    <div style={{height: h, width: `${w * s}%`, background: grad, borderRadius: '0 8px 8px 0',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingLeft: tight ? 0 : 34, overflow: 'hidden', flex: 'none'}}>
      {!tight && <>
        <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: bad ? C.limeSoft : C.deep, opacity: .8, whiteSpace: 'nowrap'}}>{label}</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 52, letterSpacing: '-0.04em',
          color: bad ? C.white : C.deep, marginTop: 4, whiteSpace: 'nowrap'}}>{value}</div>
      </>}
    </div>
  );
  if (!tight) return bar;
  return (
    <div style={{display: 'flex', alignItems: 'center', width: '100%', gap: 26, opacity: s}}>
      {bar}
      <div style={{flex: 'none'}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, letterSpacing: '-0.04em',
          color: C.ink, lineHeight: 1}}>{value}</div>
        <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: '0.11em', textTransform: 'uppercase',
          color: C.ink2, marginTop: 8, whiteSpace: 'nowrap'}}>{label}</div>
      </div>
    </div>
  );
};

/** disco em perspectiva — o "3D" da abertura */
export const Disc: React.FC<{size?: number}> = ({size = 620}) => {
  const f = useCurrentFrame();
  const rot = f * 0.55;
  const tilt = interpolate(f, [0, 60], [78, 66], {extrapolateRight: 'clamp'});
  return (
    <div style={{width: size, height: size, perspective: 1400, position: 'relative'}}>
      {[0, 1, 2].map((i) => {
        const sc = 1 - i * 0.16;
        const op = 1 - i * 0.3;
        return (
          <div key={i} style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt}deg) rotateZ(${rot * (1 + i * 0.35)}deg) scale(${sc}) translateZ(${i * 46}px)`}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%',
              background: `conic-gradient(from 0deg, rgba(201,242,77,0) 0deg, ${C.lime} 130deg, rgba(201,242,77,0) 260deg, rgba(201,242,77,0) 360deg)`,
              opacity: op,
              WebkitMaskImage: 'radial-gradient(circle, transparent 58%, black 60%, black 74%, transparent 76%)',
              maskImage: 'radial-gradient(circle, transparent 58%, black 60%, black 74%, transparent 76%)'}} />
          </div>
        );
      })}
    </div>
  );
};
