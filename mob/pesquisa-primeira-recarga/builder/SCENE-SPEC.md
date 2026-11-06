# Spec de cena — leia inteiro antes de escrever qualquer arquivo

Você vai escrever cenas de um deck em Remotion. A fundação já existe e está
validada. **Não crie, não edite e não "melhore" nenhum arquivo fora de
`src/scenes/`.** Não instale pacotes. Não toque em `src/lib/`,
`src/components/`, `src/transitions/`, `Root.tsx` ou `Deck.tsx`.

## Regras que não se negociam

1. **Nada anima sozinho.** Zero CSS `transition`/`animation`, zero
   `useFrame()`. Toda animação é `interpolate(frame, ...)` com
   `useCurrentFrame()`.
2. **`interpolate()` inline no `style`**, nunca extraído para constante.
3. **`scale` / `translate` / `rotate` como propriedades CSS individuais.**
   Nunca a string `transform` em elementos HTML. (Em `<svg>`, o atributo
   `transform` é normal e permitido.)
4. **Uma única easing:** `Easing.bezier(0.16, 1, 0.3, 1)`.
5. **Um destaque por página.** Se tudo é acento, nada é.
6. **Nenhuma biblioteca nova.** Gráfico é SVG desenhado à mão a partir dos
   dados. Sem D3, Chart.js, GSAP, Framer Motion.
7. **Nenhuma imagem baixada da internet e nenhum emoji.** Ou vetor em código, ou os renders oficiais de `public/assets/` via `<Asset>`.
8. **Não invente número, texto ou fonte.** Use exatamente o que está em
   `src/lib/data.ts`. Se faltar um dado, a página fica sem ele.
9. **Marca de terceiro é texto tipográfico.** Nunca desenhe logotipo.

## Orçamento de layout — a causa nº 1 de erro

A área útil de conteúdo é **1712 × 784 px**. `<Frame>` já posiciona isso; o
seu conteúdo começa em (0,0) dentro dela.

**Some as alturas dos seus blocos antes de escrever.** Se passar de 784, o
conteúdo invade o rodapé. Referências de altura:

| Bloco | Altura aproximada |
|---|---|
| `<SectionHead>` com eyebrow + 2 linhas de 88 px | ~240 |
| `<SectionHead>` com eyebrow + 2 linhas de 76 px | ~215 |
| `<SectionHead>` com eyebrow + 2 linhas de 68 px | ~198 |
| Linha de texto de 27 px | ~40 |
| `<Card>` de 4 colunas | você define; 380–420 é o usual |
| `<StatGrid>` de 2 linhas | ~200 |
| `<Quote>` de 2 linhas | ~120 |
| `<ClosingLine>` de 44 px, 1 linha | ~56 |

Quatro cards lado a lado: largura **410** com `gap: 24` (4×410 + 3×24 = 1712).
Três colunas: largura **554** com `gap: 40`. Duas colunas: **836** com
`gap: 40`.

## Escala tipográfica

| Papel | px | Peso | Tracking |
|---|---|---|---|
| Título de seção | 68–88 | 600 | `-0.036em` |
| Número grande | 62–140 | 600 | `-0.04em` |
| Corpo / nota | 26–30 | 400 | — |
| Micro-label de card | 21–23 | 600 | `0.12em`, UPPERCASE |
| Rótulo pequeno | 18–21 | 500 | — |

Todo número recebe `fontVariantNumeric: "tabular-nums"`.
Nunca desça abaixo de 18 px.

## API dos componentes prontos

### `<Frame>` — `src/components/Chrome.tsx`

```tsx
<Frame
  variant="light"            // "light" | "paper" | "ink" | "forest" | "brand"
  section="O mercado real"   // aparece no trilho superior
  page="03"
  source={market.source}     // vira a coluna central do rodapé
  marker={market.marker}     // "pesquisa" | "regulacao" | "hipotese" | "fragil" | "gap"
  backdrop={<DotGrid color="#BEC4B8" step={44} radius={1.3} opacity={0.3} />}
>
  {/* conteúdo, 1712 × 784 */}
</Frame>
```

`tone(variant)` devolve `{ bg, fg, muted, accent, accentText, hairline }`.
**Use `accentText` para tipografia e traço** — o verde da marca #00A859 fica em
~2,8:1 sobre o papel claro, abaixo do piso de texto. `accent` só para
preenchimento de área. Sobre fundo escuro os dois são #5DD389.

Os cinco tons: `light` `paper` `ink` `forest` `brand` — `brand` é o fundo
#00A859 com tinta #06180F.

Outros: `<Mark>`, `<Pill>`, `<ArrowPill>`, `<Eyebrow>`, `<MarkerPill>`.

### `src/components/Blocks.tsx`

```tsx
<SectionHead
  variant="light"
  eyebrow="03 — O mercado real"
  lines={market.title}       // array de strings
  accentLine={1}             // índice da linha no acento; -1 desliga
  size={88}
  note={market.note}         // coluna direita, opcional
  titleWidth={900}           // opcional
  noteWidth={620}            // opcional
  delay={0}
/>

<Quote variant="forest" text="..." credit="..." delay={40} maxWidth={800} />
<ClosingLine variant="light" plain="..." accent="..." delay={60} size={44} />
<NoteText variant="light" delay={70} maxWidth={900}>...</NoteText>
<StatGrid variant="ink" items={[{value,label}]} columns={2} delay={40} />

<Card variant="light" emphasis="plain" width={410} height={400} delay={30}>
  ...
</Card>
// emphasis: "plain" | "accent" (verde da marca) | "dark" (quase preto)
// cardInk(variant, emphasis) devolve { fg, muted } para o texto de dentro
```

### `src/components/motion.tsx`

`useReveal(delay, duration)` → 0..1 · `<Rise delay distance duration>` ·
`<SlideIn>` · `<Curtain>` · `<Ticker to decimals prefix suffix delay duration>`

### `src/components/EvAssets.tsx` — o vocabulário de mobilidade elétrica

```tsx
<BoltGlyph size={70} color="#00874A" rotate={0} />
<BoltWatermark color="#5DD389" opacity={0.04} />        // fundo de página escura
<CableCurve width={620} color="#0A140E" progress={p} />
<ConnectorGlyph kind="CCS2" size={76} color="#0A140E" />  // CCS2 | Type 2 | GB/T | CHAdeMO
<SignalVoid width={1020} height={130} color="#5DD389" voidColor="rgba(93,211,137,.14)" columns={52} progress={p} />
<BatteryStrip width={230} segments={6} filled={4} color="#0A140E" trackColor="#D7DED8" />
```

`progress` desenha o traço via `strokeDashoffset` — passe `useReveal(delay, dur)`.

Estes vetores servem para diagrama técnico e textura de fundo. Para
ilustração de verdade, prefira os renders oficiais em `<Asset>`.

### `src/components/Asset.tsx` — os renders 3D da marca

```tsx
<Asset name="bomba1" width={330} />   // sempre este componente, nunca <Img>
```

PNGs quadrados de 1254 px com fundo transparente: `bomba1..4`, `Carro`,
`carro2..6`, `ilustracao1..9`. As nove ilustrações mapeiam um a um nos nove
momentos da jornada (`JOURNEY_ASSETS`).

Asset é ilustração, não destaque: nenhum pode virar o segundo foco da página.

### `src/components/Logo.tsx`

`<IgreenMark size color />` (isotipo) e `<IgreenLogo width color />` (lockup),
vindos dos SVGs oficiais com o fill trocado por prop.

### `src/components/Backdrops.tsx`

`<ContourField cx cy rings gap r0 color opacity strokeWidth speed amplitude>` ·
`<DotGrid color step radius opacity>` · `<Glow x y size color opacity>`

### Componentes de página única

`<Journey>` (cena 08) · `<PriceLadder>` (cena 17) ·
`<TensionDiagram>` (cena 20) — já prontos, leia o arquivo antes de usar.

## Padrões de animação

| Elemento | Técnica |
|---|---|
| Título | `<SectionHead>` já faz (máscara + subida) |
| Barra vertical | `scale: "1 0"` → `"1 1"`, `transformOrigin: "bottom center"` |
| Barra horizontal | `scale: "0 1"` → `"1 1"`, `transformOrigin: "left center"` |
| Linha / arco SVG | `strokeDasharray` + `strokeDashoffset` |
| Área de gráfico | `clipPath` com `<rect>` de largura crescente |
| Números | `<Ticker>` |
| Listas / cards | escalonar: `delay = base + i * 6…10` |

Cronograma típico de uma cena de 180 frames: título 0–40, corpo 25–70,
gráfico 30–90, fechamento 60–100. Nada começa depois do frame ~100.

## Formato do arquivo

Um arquivo por cena em `src/scenes/`, com o nome exato que a sua tarefa
manda. Exporte um componente nomeado, igual ao nome do arquivo:

```tsx
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Frame, tone } from "../components/Chrome";
import { SectionHead } from "../components/Blocks";
import { market } from "../lib/data";
import { display } from "../lib/fonts";

export const S03Market: React.FC = () => {
  const frame = useCurrentFrame();
  const t = tone("light");
  return (
    <Frame variant="light" section="O mercado real" page="03"
           source={market.source} marker={market.marker}>
      <SectionHead variant="light" eyebrow="01 — O mercado real"
                   lines={market.title} size={88} note={market.note}
                   titleWidth={900} />
      {/* ... */}
    </Frame>
  );
};
```

## Antes de entregar

1. `npx tsc --noEmit` tem que passar limpo. Rode e corrija.
2. Releia o orçamento de altura da sua página e confirme a soma.
3. Não deixe `console.log`, código morto nem comentário do tipo "TODO".
4. Comente só o que não é óbvio pelo código — a razão de uma escolha, nunca
   o que a linha faz.

Não renderize vídeo nem stills; quem coordena faz a conferência visual.
