import React from 'react';
import {staticFile} from 'remotion';
const face = (fam: string, file: string, weight: string, style = 'normal') =>
  `@font-face{font-family:'${fam}';src:url('${staticFile('fonts/' + file)}') format('woff2');font-weight:${weight};font-style:${style};font-display:block}`;
export const Fonts: React.FC = () => (
  <style>{[
    face('Instrument Sans','instrument-sans-latin-400-normal.woff2','400'),
    face('Instrument Sans','instrument-sans-latin-500-normal.woff2','500'),
    face('Instrument Sans','instrument-sans-latin-600-normal.woff2','600'),
    face('Instrument Sans','instrument-sans-latin-700-normal.woff2','700'),
    face('Instrument Serif','instrument-serif-latin-400-italic.woff2','400','italic'),
    face('DM Mono','dm-mono-latin-400-normal.woff2','400'),
    face('DM Mono','dm-mono-latin-500-normal.woff2','500'),
    '*{box-sizing:border-box;-webkit-font-smoothing:antialiased}',
  ].join('')}</style>
);
