import type { ReactNode } from "react";
import type { PecaId } from "./catalogo";

/**
 * Desenho esquemático de cada peça (wireframe), para reconhecer de relance.
 * Cinza = estrutura; verde = o elemento que define a peça.
 */
const C = { fundo: "#eef0f2", linha: "#c8ccd2", forte: "#6b7079", verde: "#00a859" };

const barra = (x: number, y: number, w: number, h = 3, cor = C.linha) => (
  <rect x={x} y={y} width={w} height={h} rx={1.5} fill={cor} />
);

const DESENHOS_BASE: Record<Exclude<PecaId, `Live${string}`>, ReactNode> = {
  Abertura: (
    <>
      {barra(6, 10, 22, 4, C.forte)}
      {barra(6, 17, 18, 4, C.forte)}
      {barra(6, 24, 16)}
      <rect x={6} y={30} width={12} height={5} rx={2.5} fill={C.verde} />
      <rect x={34} y={8} width={16} height={26} rx={2} fill={C.linha} />
    </>
  ),
  ItensNumerados: (
    <>
      {[8, 18, 28].map((y, i) => (
        <g key={y}>
          <text x={6} y={y + 4} fontSize={7} fontWeight={700} fill={C.verde}>
            {`0${i + 1}`}
          </text>
          {barra(18, y, 30)}
        </g>
      ))}
    </>
  ),
  Cards: (
    <>
      {[5, 22, 39].map((x) => (
        <g key={x}>
          <rect x={x} y={8} width={13} height={24} rx={2} fill="#fff" stroke={C.linha} />
          <rect x={x + 2} y={10} width={9} height={8} rx={1} fill={C.verde} />
          {barra(x + 2, 21, 9, 2)}
          {barra(x + 2, 25, 6, 2)}
        </g>
      ))}
    </>
  ),
  Numeros: (
    <>
      {[6, 24, 42].map((x) => (
        <g key={x}>
          <text x={x} y={22} fontSize={11} fontWeight={800} fill={C.verde}>
            00
          </text>
          {barra(x, 27, 10, 2)}
        </g>
      ))}
    </>
  ),
  Video: (
    <>
      <rect x={8} y={6} width={40} height={28} rx={3} fill={C.forte} />
      <path d="M25 14 L33 20 L25 26 Z" fill={C.verde} />
    </>
  ),
  Local: (
    <>
      <rect x={6} y={8} width={16} height={18} rx={2} fill="#fff" stroke={C.linha} />
      <rect x={6} y={8} width={16} height={5} rx={2} fill={C.verde} />
      {barra(9, 17, 10, 2)}
      {barra(9, 21, 7, 2)}
      <path d="M38 8 a7 7 0 0 1 7 7 c0 5 -7 12 -7 12 s-7 -7 -7 -12 a7 7 0 0 1 7 -7 z" fill={C.verde} />
      <circle cx={38} cy={15} r={2.5} fill="#fff" />
    </>
  ),
  Agenda: (
    <>
      {[8, 17, 26].map((y) => (
        <g key={y}>
          {barra(6, y, 10, 3, C.verde)}
          {barra(20, y, 28)}
        </g>
      ))}
    </>
  ),
  Pessoas: (
    <>
      {[12, 28, 44].map((x) => (
        <g key={x}>
          <circle cx={x} cy={16} r={6} fill={C.linha} />
          <circle cx={x} cy={14} r={2.5} fill={C.forte} />
          {barra(x - 5, 26, 10, 2, C.forte)}
        </g>
      ))}
    </>
  ),
  Inscricao: (
    <>
      {[7, 15, 23].map((y) => (
        <rect key={y} x={8} y={y} width={40} height={5} rx={1.5} fill="#fff" stroke={C.linha} />
      ))}
      <rect x={8} y={31} width={18} height={5} rx={2.5} fill={C.verde} />
    </>
  ),
  ContatoConsultor: (
    <>
      <circle cx={14} cy={20} r={8} fill={C.linha} />
      <circle cx={14} cy={17} r={3} fill={C.forte} />
      {barra(26, 12, 20, 3, C.forte)}
      {barra(26, 18, 14)}
      <rect x={26} y={24} width={18} height={6} rx={3} fill={C.verde} />
    </>
  ),
  PerguntasFrequentes: (
    <>
      {[7, 17, 27].map((y) => (
        <g key={y}>
          <rect x={6} y={y} width={44} height={7} rx={1.5} fill="#fff" stroke={C.linha} />
          {barra(9, y + 2, 22, 2, C.forte)}
          <path d={`M44 ${y + 2.5} l2 2 l2 -2`} stroke={C.verde} strokeWidth={1.2} fill="none" />
        </g>
      ))}
    </>
  ),
  ChamadaFinal: (
    <>
      {barra(14, 12, 28, 4, C.forte)}
      {barra(18, 19, 20)}
      <rect x={20} y={26} width={16} height={6} rx={3} fill={C.verde} />
    </>
  ),
  Depoimentos: (
    <>
      <rect x={6} y={7} width={44} height={26} rx={3} fill="#fff" stroke={C.linha} />
      <text x={10} y={19} fontSize={14} fontWeight={800} fill={C.verde}>
        “
      </text>
      {barra(18, 12, 28, 2, C.forte)}
      {barra(18, 17, 22, 2)}
      <circle cx={13} cy={27} r={3} fill={C.linha} />
      {barra(19, 26, 14, 2, C.forte)}
    </>
  ),
  Galeria: (
    <>
      {[
        [6, 7, 20, 13],
        [28, 7, 22, 13],
        [6, 22, 13, 12],
        [21, 22, 29, 12],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={2} fill={i === 1 ? C.verde : C.linha} />
      ))}
    </>
  ),
  LogosParceiros: (
    <>
      {[6, 20, 34].map((x, i) => (
        <rect key={x} x={x} y={10} width={12} height={8} rx={2} fill={i === 1 ? C.verde : C.linha} />
      ))}
      {[13, 27].map((x) => (
        <rect key={x} x={x} y={22} width={12} height={8} rx={2} fill={C.linha} />
      ))}
    </>
  ),
  ContagemRegressiva: (
    <>
      {[5, 17, 29, 41].map((x, i) => (
        <g key={x}>
          <rect x={x} y={10} width={10} height={14} rx={2} fill={i === 0 ? C.verde : "#fff"} stroke={C.linha} />
          {barra(x + 2, 27, 6, 2)}
        </g>
      ))}
    </>
  ),
  LinhaDoTempo: (
    <>
      <rect x={13} y={6} width={2} height={28} fill={C.linha} />
      {[9, 19, 29].map((y, i) => (
        <g key={y}>
          <circle cx={14} cy={y} r={3} fill={i === 2 ? C.verde : C.forte} />
          {barra(21, y - 1.5, 26 - i * 4)}
        </g>
      ))}
    </>
  ),
  Planos: (
    <>
      <rect x={6} y={10} width={20} height={24} rx={2} fill="#fff" stroke={C.linha} />
      <rect x={30} y={6} width={20} height={28} rx={2} fill="#fff" stroke={C.verde} strokeWidth={1.5} />
      {barra(9, 14, 10, 2, C.forte)}
      {barra(33, 10, 12, 3, C.verde)}
      {barra(9, 20, 14, 2)}
      {barra(33, 17, 14, 2)}
      <rect x={9} y={27} width={14} height={4} rx={2} fill={C.linha} />
      <rect x={33} y={27} width={14} height={4} rx={2} fill={C.verde} />
    </>
  ),
  FaixaAnimada: (
    <>
      <rect x={0} y={13} width={56} height={14} fill={C.forte} />
      {barra(4, 18.5, 12, 3, "#fff")}
      <circle cx={20} cy={20} r={1.5} fill={C.verde} />
      {barra(24, 18.5, 14, 3, "#fff")}
      <circle cx={42} cy={20} r={1.5} fill={C.verde} />
      {barra(46, 18.5, 10, 3, "#fff")}
    </>
  ),
  SecaoLivre: (
    <>
      <rect x={6} y={7} width={44} height={26} rx={3} fill="#fff" stroke={C.linha} strokeDasharray="3 2" />
      <path d="M22 14 l-6 6 l6 6" stroke={C.verde} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 14 l6 6 l-6 6" stroke={C.verde} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 12 l-4 16" stroke={C.forte} strokeWidth={2} strokeLinecap="round" />
    </>
  ),
  Simulador: (
    <>
      {barra(6, 10, 44)}
      <circle cx={22} cy={11.5} r={3.5} fill={C.verde} />
      <rect x={6} y={20} width={20} height={13} rx={2} fill="#fff" stroke={C.linha} />
      <rect x={30} y={20} width={20} height={13} rx={2} fill="#fff" stroke={C.linha} />
      {barra(9, 25, 12, 3, C.forte)}
      {barra(33, 25, 12, 3, C.forte)}
    </>
  ),
};

/** As peças do kit Live usam o desenho da peça equivalente. */
const DESENHOS: Record<PecaId, ReactNode> = {
  ...DESENHOS_BASE,
  LiveAbertura: DESENHOS_BASE.Abertura,
  LiveFaixa: DESENHOS_BASE.FaixaAnimada,
  LiveSobre: DESENHOS_BASE.Numeros,
  LiveBeneficios: DESENHOS_BASE.Cards,
  LivePalestrantes: DESENHOS_BASE.Pessoas,
  LiveAgenda: DESENHOS_BASE.Agenda,
  LiveNumeros: DESENHOS_BASE.Numeros,
  LiveLocal: DESENHOS_BASE.Local,
  LiveVideo: DESENHOS_BASE.Video,
  LivePerguntas: DESENHOS_BASE.PerguntasFrequentes,
  LiveInscricao: DESENHOS_BASE.Inscricao,
  LiveRodape: DESENHOS_BASE.ChamadaFinal,
};

export function Ilustracao({ id }: { id: PecaId }) {
  return (
    <svg className="dw-ilu" viewBox="0 0 56 40" width={56} height={40} aria-hidden="true">
      <rect width={56} height={40} rx={6} fill={C.fundo} />
      {DESENHOS[id]}
    </svg>
  );
}
