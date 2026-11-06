import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {C} from './theme';

const S: React.FC<{children: any; c?: string}> = ({children, c = C.lime}) => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [4, 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg viewBox="0 0 200 140" width="100%" height="100%" fill="none" stroke={c} strokeWidth="2.6"
      strokeLinecap="round" strokeLinejoin="round"
      style={{strokeDasharray: 1400, strokeDashoffset: 1400 * (1 - draw)}}>{children}</svg>
  );
};

export const Icon: React.FC<{name: string; c?: string}> = ({name, c}) => {
  const f = useCurrentFrame();
  const pulse = 1 + Math.sin(f / 16) * 0.02;
  const spin = f * 1.4;
  const inner = () => {
    switch (name) {
      case 'home': return <S c={c}><path d="M30 62l30-25 30 25"/><path d="M38 60v40h44V60"/><rect x="118" y="30" width="54" height="80" rx="7"/><path d="M145 54c-7 0-12 5-12 12 0 9 12 21 12 21s12-12 12-21c0-7-5-12-12-12z"/><circle cx="145" cy="66" r="4"/></S>;
      case 'road': return <S c={c}><path d="M18 92h92v-16l-12-18H42L28 76H18z"/><circle cx="42" cy="97" r="8"/><circle cx="92" cy="97" r="8"/><path d="M150 100V44"/><path d="M134 100l16-56 16 56"/><path d="M139 78h22"/></S>;
      case 'maze': return <S c={c}><rect x="18" y="24" width="164" height="90"/><path d="M18 56h46M82 24v32M112 56h70M82 80v34M112 80h70M18 80h46"/><path d="M40 100c19 0 19-22 38-22s19 19 38 19" strokeDasharray="6 6"/></S>;
      case 'spot': return <S c={c}><rect x="14" y="26" width="172" height="84" strokeDasharray="8 7"/><path d="M38 96h112v-22l-15-22H55L38 74z"/><circle cx="62" cy="101" r="8"/><circle cx="128" cy="101" r="8"/><path d="M70 20l54 36"/></S>;
      case 'totem': return <S c={c}><rect x="54" y="18" width="64" height="102" rx="6"/><rect x="64" y="32" width="44" height="32"/><rect x="70" y="78" width="32" height="32"/><path d="M76 84h7v7h-7zM88 84h7v7h-7zM76 96h7v7h-7zM88 96h20"/><circle cx="160" cy="40" r="14"/><path d="M160 16v-8M160 72v-8M184 40h8M128 40h8"/></S>;
      case 'form': return <S c={c}><rect x="40" y="12" width="70" height="118" rx="8"/><path d="M54 42h42M54 58h42M54 74h28"/><rect x="126" y="62" width="46" height="36" rx="4"/><path d="M136 62V49a13 13 0 0 1 26 0v13"/><circle cx="149" cy="78" r="4"/></S>;
      case 'money': return <S c={c}><rect x="32" y="16" width="136" height="108" rx="8"/><path d="M48 100h27M84 100h27M120 100h35"/><text x="100" y="74" textAnchor="middle" fontFamily="Instrument Sans" fontSize="40" fontWeight="700" fill={c ?? C.lime} stroke="none">R$</text></S>;
      case 'pix': return <S c={c}><path d="M60 26l32 32-32 32-32-32z"/><path d="M28 58h-8M100 58h10"/><circle cx="142" cy="80" r="26"/><path d="M130 80l8 9 17-20"/></S>;
      case 'plug': return <S c={c}><path d="M18 118c0-46 27-62 56-62"/><rect x="74" y="34" width="46" height="44" rx="12"/><path d="M85 78v12M109 78v12"/><circle cx="158" cy="88" r="22"/><path d="M158 74v14l9 7"/></S>;
      case 'wave': return <S c={c}><path d="M10 94h58V74l-11-16H29L16 74h-6z"/><circle cx="32" cy="99" r="7"/><circle cx="60" cy="99" r="7"/><rect x="150" y="28" width="40" height="82" rx="6"/><path d="M161 44h18"/><path d="M92 54c8 11 8 22 0 33M112 44c13 16 13 38 0 54" strokeDasharray="2 8"/></S>;
      case 'charge': return <S c={c}><path d="M14 98h92V80L92 60H36L20 80h-6z"/><circle cx="42" cy="104" r="8"/><circle cx="88" cy="104" r="8"/><path d="M106 82h22V50"/><rect x="118" y="26" width="20" height="24" rx="4"/><circle cx="166" cy="86" r="20"/><path d="M166 73v13l9 6"/></S>;
      case 'lock': return <S c={c}><rect x="24" y="46" width="46" height="52" rx="8"/><path d="M70 72h30"/><circle cx="37" cy="64" r="4"/><circle cx="56" cy="64" r="4"/><rect x="114" y="16" width="62" height="102" rx="8"/><path d="M132 50l26 32M158 50l-26 32"/></S>;
      case 'card': return <S c={c}><rect x="18" y="34" width="92" height="62" rx="7"/><path d="M18 54h92M32 78h22"/><path d="M156 40a32 32 0 1 0 11 24"/><path d="M167 34v19h-19"/><path d="M148 62h-19M138 52v19"/></S>;
      default: return <S c={c}><circle cx="100" cy="70" r="40"/></S>;
    }
  };
  return <div style={{width: '100%', height: '100%', transform: `scale(${pulse})`}}>{inner()}</div>;
};
