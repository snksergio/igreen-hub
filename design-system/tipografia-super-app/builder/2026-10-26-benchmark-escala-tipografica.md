# Benchmark: escala tipográfica e de espaçamento do app iGreen

**Contexto:** app iGreen (conta de luz, telecom, cashback, Retorno iGreen) em iOS e Android. O protótipo HTML usa Manrope e coloca as listas dentro de cards brancos com borda: margem de tela 16 + borda 1 + padding interno 16–17 de cada lado.
**Decisão que apoia:** definir uma escala fixa, sem frações, de tipografia e espaçamento, e aplicá-la numa cópia do protótipo (`prototipo-cashback-v2.html`).
**Premissas:** 1 px no HTML = 1 pt no iOS = 1 dp no Android. A Manrope continua. Raios e alturas de componentes ficaram fora desta rodada.
**Data:** 2026-10-26 · **Modo:** Rápido (arquivo na pasta Tipografia, sem gravar no workspace)

---

## 1. Resumo

- **O mercado converge num núcleo pequeno.** Corpo 14/20, título de linha de lista 16 com subtítulo 14 (em lista de largura total), piso de 12 px, pesos até 700, espaçamento em base 4 e margem lateral de 16.
- **Compactação para o contexto em card.** O iOS (Subhead 15/20 e Footnote 13/18) e a Fluent 2 iOS (Body 2 e Caption 1, o par "denso" oficial) usam o mesmo par: **15/13**. É a escolha recomendada para as linhas de lista dentro de card, onde a coluna de título mede 206 px.
- **O protótipo atual tinha 28 tamanhos e a v2 tem 12.** Antes: 9.5, 11.5, 12.5, 13.5, 14.5 e 15.5 px, mais 30+ entrelinhas e peso 800 em um terço dos textos. Depois: 11, 12, 13, 14, 15, 16, 18, 20, 22, 28, 34 e 40, cada tamanho com uma entrelinha, e pesos 500, 600 e 700.
- **A Manrope é um degrau mais fina que SF, Inter e Roboto** (medido: traço do 400 = 0,073 em, contra 0,087 da Inter). O "regular" de mercado nela é o 500, por isso a v2 começa o texto em 500 (revisão 1, seção 12).
- **Maior risco em aberto:** 15/13 contra 16/14 nas linhas de lista. Uber, Wise e Mercado Pago usam 16/14, mas em listas sem card em volta. Precisa ser validado no aparelho.
- **Achado que afeta o teste:** num celular de 390 px, o protótipo antigo desenhava a moldura do iPhone a 86,5%. Um texto de 15 px aparecia com ~13 px. A v2 abre em tela cheia e 1:1 no celular.

## 2. Diagnóstico do protótipo atual (medido)

| O que foi medido | Antes | Na v2 |
|---|---|---|
| Tamanhos de fonte renderizados (178 telas, 27 fluxos) | 28 tamanhos, incluindo 9.5, 11.5, 12.5, 13.5, 14.5 e 15.5 | 12 tamanhos, todos inteiros |
| Tamanho mais usado | 12.5 px (1.341 textos) | 13 px |
| Peso 800 (ExtraBold) | 2.439 textos | 0 |
| Entrelinhas por tamanho | até 5 por tamanho (12.5 com 16, 17 e 18; 13.5 com 18, 18.2, 19 e 20) | 1 por tamanho |
| Valores de padding, margin e gap | 1, 3, 5, 7, 9, 11, 13, 14, 15, 17, 18, 22, 26, 30... | grade de 4, com 2, 6 e 10 para ajuste fino |
| Coluna útil do título numa linha de fatura | 206 px (texto começa em x = 34: margem 16 + borda 1 + padding 17; à direita fica a coluna do valor) | ~203 px (paddings na grade de 4) |
| Escala da moldura num celular de 390 px | 0,865: tudo aparece 13,5% menor | 1:1, tela cheia |
| Textos cortados | 7 (código Pix com reticências, intencional) | os mesmos 7, nenhum novo |

**Métricas da Manrope** (medidas no navegador com as fontes do Google Fonts):

| Fonte | Altura-x | Altura de maiúscula | Largura de uma frase PT-BR em 400 |
|---|---|---|---|
| Manrope | 0,54 em | 0,72 em | 29,85 em |
| Inter (usada pela Wise) | 0,55 em | 0,73 em | 31,44 em |
| Roboto (Android) | 0,53 em | 0,71 em | 29,51 em |

- **A Manrope não é "maior" que Inter ou Roboto no mesmo px.** O mesmo tamanho rende a mesma leitura, e descer de 16/14 para 15/13 se justifica pelo card, não pela fonte.
- **Cada degrau de peso alarga o texto em ~1,7%.** O 800 ocupa 3,2% a mais que o 600, e o mesmo título que cabia passa a quebrar antes.

**Espessura do traço** (haste do "l" a 200 px, em fração do em; medido no navegador):

| Peso | Manrope | Inter | Roboto |
|---|---|---|---|
| 400 | 0,073 | 0,087 | 0,091 |
| 500 | 0,089 | 0,106 | 0,118 |
| 600 | 0,104 | 0,126 | 0,141 |
| 700 | 0,120 | 0,146 | 0,141 |
| 800 | 0,136 | — | — |

- **A Manrope é um peso inteiro mais fina.** Manrope 500 ≈ Inter/Roboto 400; Manrope 600 ≈ Inter 500; Manrope 700 fica entre Inter 500 e 600.
- **Consequência:** copiar os pesos de um design system feito em SF, Inter ou Proxima Nova (400 no texto, 600 no título) deixa a Manrope com cara de light. Foi exatamente o que apareceu no teste da primeira v2.
- **Na coluna de 206 px,** "Setembro · Loja de conveniência" mede 229 px em 15/600, 244 px em 16/600 e 260 px em 17/600. Em 17, cabem uns 24 caracteres por linha; em 15, uns 27.

## 3. Players e normas consultadas

| Player ou design system | Por que está aqui |
|---|---|
| Apple HIG (iOS) | Plataforma; default de 17 pt; é o "grande demais" de referência |
| Material 3 (Android) | Plataforma; tokens de lista e card |
| Microsoft Fluent 2 (iOS e Android) | Único sistema que nomeia uma escala densa sobre o iOS |
| Uber Base | App de consumo global; lista é mais de 80% da UI; regra de escala documentada |
| Wise | Fintech internacional com design system em código público |
| Mercado Pago / Mercado Livre (Andes UI) | A referência de densidade que você citou; a única escala brasileira verificável |
| Atlassian, Shopify Polaris, GitHub Primer | Produtos densos com o raciocínio publicado (piso de 12, grade de 4) |
| Nubank, iFood, Inter, C6, Itaú, BB, PicPay | Só a fonte foi verificada; nenhum publica a escala do app |

## 4. Matriz comparativa

| Critério | iOS HIG | Material 3 | Fluent 2 iOS | Uber Base | Wise | Mercado Pago (Andes) | Maturidade |
|---|---|---|---|---|---|---|---|
| Título de linha de lista | 17/22 Body ou Headline [1] | 16/24 [4] | 15/20 Body 2, denso [6] | 16/20 · 500 [8] | 16/24 · 600 [11] | 16 (medium), 14 (small) [13] | **Consolidado:** 16 em lista de largura total |
| Subtítulo de linha | não verificado para lista; Subhead 15/20, Footnote 13/18 [1] | 14/20 [4] | 13/18 Caption 1 [6] | 14/20 [8] | 14/1,55 [11] | 14 (medium), 12 (small) [13] | **Consolidado:** 14 |
| Corpo de interface | 17/22 [1] | 14/20 Body M; 16/24 Body L [3] | 17/22 e 15/20 [6] | 14/20; 16/24 em multilinha [8][9] | 14/1,55; 16/1,5 [10] | 14 e 16 [12] | **Consolidado:** 14/20 em produto denso |
| Menor tamanho | 11 [2] | 11 (Label S) [3] | 12 [6] | 12, no máximo 3 linhas [9] | 12 [10] | 12 [12] | **Consolidado:** 12; 11 só em uso restrito (Atlassian subiu de 11 para 12 [16]) |
| Título de tela ou seção | 17 na nav; 20, 22 e 28 [1] | 22/28; 24/32 [3] | 20/25; 22/28 [6] | 20/28; 24/32 [9] | 18, 22, 26, 30 [10] | 18, 20, 24 [12] | Divergente: 18 a 24 |
| Valor ou saldo em destaque | 28/34; 34/41 [1] | 28 a 36 [3] | 28/34; 34/41 [6] | 36 a 44 [9] | 30 [10] | 28 a 32 [12] | Divergente: 28 a 40 |
| Entrelinha | ~1,29 a 1,38 [1] | ~1,2 em títulos, ~1,5 em corpo [3] | igual à Apple [6] | ×1,45, arredondada a 4 [8] | 1,35 a 1,55 [10] | ~1,25 [12] | **Consolidado:** 1,3 a 1,5 no texto, ~1,2 em títulos |
| Pesos | Regular, Semibold, Bold [1] | 400, 500 (700 enfatizado) [3] | Regular, Semibold, Bold [6] | 400, 500, 700 [8] | 400, 500, 600 [10] | 400 e 600 [12] | **Consolidado:** nada acima de 700 |
| Base de espaçamento | margens de 16 a 20 [2] | 4 e 8 dp (M2) [5] | 4, com 2, 6 e 10 [7] | 4 [9] | 4 [10] | múltiplos de 8, com 12 interno [14] | **Consolidado:** 4 |
| Margem lateral | 16 a 20 [2] | 16 [5] | não verificado | 16 [9] | 16 [10] | 16 [14] | **Consolidado:** 16 |
| Padding de card | não verificado | 16 [5] | não verificado | não se aplica | não se aplica | 16 [14] | **Consolidado:** 16 |
| Altura de linha de lista | não verificado | 56/72/88 [4] | não verificado | mín. 48 compacta, 64 padrão [8] | padding 12 [11] | 40/48/68 [13] | **Consolidado:** 56–64 com duas linhas |
| Alvo de toque | 44 [2] | 48 [5] | não verificado | não verificado | não verificado | botão 48 [14] | **Consolidado** |

**Nubank:** fonte Nu Sans (Display e Text), lançada em março/2026, com algarismos tabulares [17]. A escala do NuDS não é pública.
**iFood:** fontes iFood Títulos e iFood Textos [18]. O design system não é público.
**Inter, C6, Itaú e BB:** todos usam fonte proprietária com um corte "Text" para o app [19].
Nenhum desses publicou tamanhos, então ficam como não verificados.

## 5. Síntese

**Convergências**
- 14/20 é o corpo de produto denso: Uber, Atlassian, Fluent Android, Wise e Material Body M [3][8][10][16].
- Em lista, a hierarquia vem de peso (500–600 contra 400) e cor (primária contra secundária), não de saltos grandes de tamanho [8][11].
- Piso de 12 para texto, base 4 para espaçamento, margem 16 e padding de card 16.
- Peso máximo 700. Ninguém usa 800 em texto de interface.

**Divergências e o que as explica**
- **16/14 contra 15/13 nas linhas.** Uber, Wise e Andes medium desenham listas de largura total, sem card. Quando a linha vive dentro de um card com padding próprio, a coluna perde ~34 px, e o par compacto (15/13, o mesmo do iOS e da Fluent iOS) mantém 2 a 3 caracteres a mais por linha. O próprio Andes tem uma variante small (14/12) para listas mais compactas.
- **Apple "grande" (17).** Vale para listas de largura total, nas quais o texto tem ~340 px. A Uber também defende tamanhos maiores ("Go big"), mas para texto corrido multilinha, não para linhas de lista [9].
- **Títulos.** Uber e Andes vão de 18 a 24. A Apple pula de 22 para 28. A v2 fica com 18, 20 e 22, mais o tier de valores (28, 34, 40).

**Anti-padrões que existiam no protótipo**
- Tamanhos fracionados (12.5, 13.5, 14.5), que não existem em nenhum design system consultado.
- Peso 800 como padrão de título e valor.
- Até 5 entrelinhas diferentes para o mesmo tamanho.
- Moldura que encolhe o app no próprio celular, distorcendo a avaliação de tamanho.

## 6. Escala aplicada na v2

### Tipografia

| Token | Tamanho/entrelinha | Peso | Tracking | Uso no app | Referência |
|---|---|---|---|---|---|
| `caption-caps` | 11/16 | 700 | +0,06em, maiúsculas | Overline ("A IGREEN JÁ TE DEVOLVEU"), eixo de gráfico | M3 Label S 11/16 |
| `caption` | 12/16 | 500 a 600 (700 em badge) | — | Badge, status ("Em dia", "há 6 dias"), legenda | iOS Caption 1, M3 Label M |
| `footnote` | 13/18 | 500 (600 ênfase) | — | Subtítulo de linha ("Venceu em 30/09"), descrição curta, meta | iOS Footnote, Fluent iOS Caption 1 |
| `body` | 14/20 | 500 a 700 | — | Texto corrido, chips, abas, avisos | M3 Body M, Uber Paragraph S |
| `subhead` | 15/20 | 700 | — | Título de linha de lista e de card, botão | iOS Subhead, Fluent iOS Body 2 |
| `callout` | 16/22 | 700 | — | Valor em linha ("R$ 486,20"), título de grupo ("Energia") | iOS Callout |
| `title-sm` | 18/24 | 700 | −0,01em | Título de tela no cabeçalho ("Faturas em aberto") | Andes Title XS, Fluent Android Title 3 |
| `title-md` | 20/24 | 700 | −0,01em | Título de seção ("Serviços", "Minha conta de luz"), valor de destaque em card, título de sheet | Andes Title S, Fluent Android Title 2, Mercado Pago (print) |
| `title-lg` | 22/28 | 700 | −0,01em | Confirmação ("Pagamento confirmado"), nome de plano, totais de resumo | iOS Title 2, M3 Title L |
| `stat-sm` | 28/34 | 700 | −0,02em | Valor principal dentro de card | iOS Title 1 |
| `stat-md` | 34/40 | 700 | −0,02em | Saldo, valor de pagamento | iOS Large Title |
| `stat-lg` | 40/48 | 700 | −0,02em | Hero (home, Retorno). No máximo um por tela | Uber Heading XXL (40) |

O "R$" e os centavos acompanham o número: 28 leva 13/14, 34 leva 16/18 e 40 leva 18/20. Os valores usam `font-variant-numeric: tabular-nums`.

### Pesos

**500 texto · 600 ênfase · 700 título e valor.** É a régua de mercado (400/500/600–700 em SF, Inter ou Roboto) traduzida pela espessura medida da Manrope (seção 2).
- **Conversão a partir do original:** 400 → 500 · 500 → 600 · 600 → 600 · 700 → 700 · 800 → 700.
- **A base das telas é 500.** Assim, até o texto que não declara peso (e herdava 400) sai em 500.
- **Pares de seleção** (mês ativo, aba ativa) mantêm o lado não selecionado em 500, para o contraste continuar visível: 700 contra 500.
- **Sem 400 nem 800 em interface.** O 400 da Manrope lê como light em tela de celular, e o 800 é o teto que a escala decidiu não usar.
- **Primeira v2 (substituída):** tinha descido tudo um degrau (800 → 700, 700 → 600, 600 → 500). No teste no celular, títulos de seção e textos de apoio ficaram finos.

### Espaçamento

Escala: **2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48**. É a mesma base do iGreen DS (admin) e converge com Uber, Fluent e Primer.
- Margem de tela: 16. Padding de card: 16. Gap entre título e subtítulo: 2.
- **Ritmo vertical (revisão 1):**
  - Entre seções: 32.
  - Do título de seção ao conteúdo: 16 (revisão 2).
  - Do valor ao selo logo abaixo: 12.
  - Do bloco de texto a um gráfico: 24.
  - Do gráfico à legenda: 12.
  - A regra é agrupar apertado o que é da mesma coisa (2 a 4) e separar com folga o que é outro grupo (12 a 32).
- O 14 saiu da escala e virou 16. A Uber é o único dos sistemas consultados que tem 14.
- Ficaram como estavam, de propósito: o 1 px (fio e ajuste óptico) e os recuos de layout (34 na linha do tempo; 46, 58 e 60–100 para abrir espaço a ilustração e barra fixa).

### Regras

1. Nenhum tamanho fracionado. Cada tamanho tem uma única entrelinha.
2. Pesos 500, 600 e 700 apenas. O texto começa em 500, porque o 400 da Manrope é fino demais em tela. O teto é 700.
3. 11 px só em maiúsculas curtas (overline e eixo). Texto de leitura começa em 12.
4. Linha de lista dentro de card: `subhead` 15/20 + `footnote` 13/18. Em lista de largura total (configurações, extrato em tela cheia), dá para subir para 16/14 sem criar token novo.
5. No app nativo, manter `allowFontScaling` (default `true` no React Native). Limitar `maxFontSizeMultiplier` só em elementos de altura fixa, como tab bar e chips. Usar `min-height` em vez de `height` onde há texto [20][21].

## 7. De → para aplicado

| Antes (px) | Depois | | Antes (px) | Depois |
|---|---|---|---|---|
| 9.5, 10, 10.5, 11 | 11 | | 17 | 18 |
| 11.5, 12 | 12 | | 19, 20, 21 | 20 |
| 12.5, 13 | 13 | | 22, 24, 26 | 22 |
| 13.5, 14 | 14 | | 28, 30 | 28 |
| 14.5, 15 | 15 | | 34, 36 | 34 |
| 15.5, 16, 16.5 | 16 | | 38 a 50, 58 | 40 |

Espaçamento: 3 e 5 → 4 · 7 e 9 → 8 · 11 e 13 → 12 · 14, 15, 17 e 18 → 16 · 22 e 26 → 24 · 30 → 32 · gap de 1 → 2.

## 8. Recomendação

**Adotar** (consolidado)
- A escala da seção 6, com corpo 14/20, piso de 12 e pesos 500 a 700.
- Espaçamento em base 4, com margem e padding de card de 16.
- Algarismos tabulares em todo valor monetário.

**Considerar** (com risco explícito)
- **15/13 nas linhas de lista em card.** O par tem respaldo do iOS e da Fluent iOS, mas o mercado de fintech usa 16/14 em listas sem card. Se no aparelho o 15 parecer pequeno, a troca é só de token (`subhead` para `callout`, `footnote` para `body`), sem mexer na escala.
- **Redesenhar o card para não somar paddings.** O M3 sugere usar um só, card ou linha [4]: card sem padding horizontal e linhas com 16. A coluna de texto ganharia ~16 px.

**Evitar**
- Frações, peso 800 e uma entrelinha diferente para cada tela.
- Manrope 400 em texto de interface, e copiar pesos de design system feito em outra fonte sem medir o traço.
- `height` fixo em contêiner com texto. Com fonte ampliada (até 200% no Android 14 e AX5 no iOS), o texto corta [20][22].
- Avaliar tamanho com o protótipo dentro da moldura no celular.

**Suposições a validar**
- Acreditamos que 15/13 nas linhas em card vai parecer "nem grande nem pequeno" (entre Mercado Pago e iOS), porque é o par denso do iOS e da Fluent iOS e mantém ~27 caracteres na coluna de 206 px. Validamos quando 5 pessoas lerem a Aba Pagar e a lista de faturas no próprio celular sem aproximar o aparelho e acharem as faturas certas sem erro. Prioridade alta.
- Acreditamos que tirar o 800 não vai apagar a hierarquia, porque títulos e valores ficam em 700 sobre texto em 500, e a diferença de tamanho e cor faz o resto. Validamos numa comparação lado a lado, antes e depois, das telas Home, Aba Pagar e Retorno. Prioridade média.

## 9. CSD

**Certezas**
- Sabemos que o default do iOS é 17/22 e o mínimo é 11 pt. Fonte: [1][2].
- Sabemos que o M3 usa 16/24 no título da linha de lista e 14/20 no texto de apoio. Fonte: [4].
- Sabemos que a Fluent 2 iOS define 15/20 (Body 2) e 13/18 (Caption 1). Fonte: [6].
- Sabemos que Uber (16/20 + 14/20) e Wise (16/24 + 14) usam 16/14 nas listas. Fonte: [8][11].
- Sabemos que o Andes (Mercado Pago) tem corpo de 12, 14, 16 e 18, títulos de 18 a 32, e pesos 400 e 600. Fonte: [12][13].
- Sabemos que a Manrope tem altura-x de 0,54 em, contra 0,55 da Inter e 0,53 da Roboto. Fonte: medição própria.
- Sabemos que o traço da Manrope é um peso mais fino que o da Inter e o da Roboto (400 = 0,073 em, contra 0,087 e 0,091). Fonte: medição própria.

**Suposições**
- Ver a seção 8.

**Dúvidas**
- Qual escala o Nubank e o iFood usam no app? Como descobrir: medir prints do app em tamanho real (mesmo aparelho, Dynamic Type padrão) e comparar com a grade.
- A Proxima Nova (Andes) parece menor que a Manrope no mesmo px? Como descobrir: medir as métricas com o arquivo da fonte. Ela não está no Google Fonts, por isso não foi medida aqui.
- O que muda na Uber Typography 2.0? Como descobrir: a página exige login (SSO). Só dá para conferir com acesso.

## 10. Limitações

- Mercado Pago: os valores vêm do código oficial (MIT, 2020–21) via fork público, conferidos com o CSS de produção de 2026. As alturas de linha do app nativo atual não foram confirmadas.
- Wise: a página de tipografia retornou 404, então usei o pacote oficial de CSS (npm). A tipografia dos apps nativos não foi verificada.
- Raios de borda e alturas de botão e linha não foram mexidos. Os raios do protótipo usam a conta do raio concêntrico (externo − borda), e mudá-los à parte quebraria essa relação. Fica para uma próxima rodada.

## 11. Fontes

Todas acessadas em 2026-10-26.

[1] Apple HIG, Typography: tamanhos do Dynamic Type no Large, tabela de tracking do SF Pro. Fato. https://developer.apple.com/design/human-interface-guidelines/typography
[2] Apple HIG, Accessibility e Layout: mínimo de 11 pt, alvo de 44×44 pt, margens de sistema de 16 a 20 pt. Fato. https://developer.apple.com/design/human-interface-guidelines/accessibility · https://developer.apple.com/documentation/swiftui/contentmarginguide/container
[3] Material 3, Type scale tokens e Applying type. Fato. https://m3.material.io/styles/typography/type-scale-tokens · https://m3.material.io/styles/typography/applying-type
[4] Material 3, Lists specs: 56/72/88 dp, padding 16, label 16/24, supporting 14/20. Fato. https://m3.material.io/components/lists/specs
[5] Material 3, Cards e Layout: padding 16, margens de 16 no compact, alvo de 48 dp; grade de 4 e 8 dp no M2. Fato. https://m3.material.io/components/cards/specs · https://m3.material.io/foundations/layout/breakpoints/compact · https://m2.material.io/design/layout/spacing-methods.html
[6] Microsoft Fluent 2, Typography (iOS e Android). Fato. https://fluent2.microsoft.design/typography
[7] Fluent 2 Apple, tokens globais de espaçamento. Fato (código). https://github.com/microsoft/fluentui-apple
[8] Uber Base, List item e Typography: Label M 16/20 + Paragraph S 14/20, mín. 48 e 64. Fato. https://base.uber.com/6d2425e9f/p/96ccc3-list-item/b/284ec6 · https://base.uber.com/6d2425e9f/p/976582-typography-10/b/13e172
[9] Uber Base Web, typography.ts e sizing.ts; Dimensions. Fato (código). https://github.com/uber/baseweb/blob/main/src/themes/shared/typography.ts · https://base.uber.com/6d2425e9f/p/598458-dimensions/b/907985
[10] Wise, neptune-css 14.30.0: tipos e espaçamento. Fato (código). https://unpkg.com/@transferwise/neptune-css@14.30.0/dist/css/neptune.css
[11] Wise, ListItem (components 46.166.0). Fato (código). https://unpkg.com/@transferwise/components@46.166.0/src/ListItem/ListItem.tsx
[12] Mercado Livre, Andes UI: escala de texto Android e iOS (MIT). Fato (código). https://github.com/lmadrazo/fury_andesui-android/blob/HEAD/components/src/main/res/values/dimens_text.xml · https://github.com/AndriuCoelho/fury_andesui-ios/blob/HEAD/LibraryComponents/Classes/Core/Stylesheet/AndesFontStyle.swift
[13] Mercado Livre, Andes List (iOS, por tamanho) e CSS de produção. Fato e Observação. https://github.com/AndriuCoelho/fury_andesui-ios · http2.mlstatic.com (CSS com hash)
[14] Mercado Livre, Andes Card e Button. Fato (código). https://github.com/lmadrazo/fury_andesui-android
[15] Shopify Polaris, tokens de texto e espaço. Fato (código). https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/themes/base/text.ts
[16] Atlassian, Typography e Spacing; piso subiu de 11 para 12. Fato. https://atlassian.design/foundations/typography · https://atlassian.design/foundations/spacing
[17] Nubank, Nu Sans. Fato. https://blog.nubank.com.br/nu-sans/
[18] iFood, site institucional: famílias iFood Títulos e iFood Textos. Observação. https://institucional.ifood.com.br
[19] C6 Sans, Itaú Display e Text, fonte do Banco do Brasil. Fato (imprensa e páginas oficiais). https://transformmagazine.net/articles/2018/brazilian-bank-follows-custom-typeface-trend/ · https://nossomeio.com.br/banco-do-brasil-apresenta-tipografia-propria/
[20] Android 14: escala de fonte até 200%, não linear. Fato. https://developer.android.com/about/versions/14/features
[21] React Native, Text: `allowFontScaling` e `maxFontSizeMultiplier`. Fato. https://reactnative.dev/docs/text
[22] WCAG 2.2: 1.4.4, 1.4.12, 2.5.8. Fato. https://www.w3.org/TR/WCAG22/

## 12. Revisão 1: teste no celular (26/10/2026)

**O que apareceu no aparelho:**
- Títulos de seção ("Serviços", "Para você", "Meus produtos", "Minha conta de luz", "Minhas faturas") ficaram finos.
- Valor da conta, abas e consumo pediam mais peso.
- Faltou respiro: título colado no conteúdo, e o gráfico perto do selo de desconto.

**Diagnóstico:**
- **Peso:** a primeira v2 desceu tudo um degrau. Como o traço da Manrope já é um degrau mais fino que o das fontes de referência (seção 2), o resultado ficou dois degraus abaixo do que o mercado mostra.
- **Respiro:** título de seção a 8–10 px do conteúdo, seções a 28 px, gráfico a 16 px do selo, legenda a 10 px do gráfico e selo a 8 px do valor.

**O que mudou:**

| Item | Primeira v2 | Revisão 1 |
|---|---|---|
| Texto de apoio (era 400) | 400 | 500 |
| Ênfase (era 500 ou 600) | 500 | 600 |
| Títulos de seção e de linha (era 700) | 600 | 700 |
| Títulos e valores (era 800) | 700 | 700 |
| Base das telas (texto sem peso declarado) | 400 herdado | 500 |
| Título de seção → conteúdo | 8–10 | 12 |
| Entre seções | 28–32 | 32 |
| Valor → selo de desconto | 8 | 12 |
| Selo → gráfico | 16 | 24 |
| Gráfico → legenda | 10 | 12 |

Escala de tamanhos e entrelinhas: sem mudança.

## 13. Revisão 2: ritmo do Mercado Pago (prints do app, 26/10/2026)

**Medido nos prints** (Android, 720 px de largura). A conversão para dp usa a margem lateral de 16 dp, que no print mede 30 px. Classificação: Observação.

| No Mercado Pago | Medida aproximada |
|---|---|
| Fim de um card → título da próxima seção | 32–36 dp |
| Título de seção | ~20 dp, semibold |
| Título → link "Consultar →" logo abaixo | ~4 dp (fazem um grupo só) |
| Link → conteúdo | ~16 dp |
| Padding interno do card | 16 dp |
| Texto do card e das linhas | ~16 dp |
| Linhas de "Últimas atividades" | sem divisória, ~24 dp entre itens, avatar ~48 dp |

**O que entrou na v2:**
- **Título de seção:** 18 → **20/24 bold** (`title-md`). A proporção para o texto continua a do Mercado Pago (20/16 ≈ 1,25; aqui 20/15 ≈ 1,33). O que separa um contexto do outro é o salto de tamanho somado ao espaço.
- **Título → conteúdo:** 12 → **16**.
- **Entre seções:** mantido em **32**. Visualmente, o espaço até o título fica em ~40, porque o título ocupa uma linha de 24 dentro de uma faixa de 28.
- **Título de tela no cabeçalho:** continua 18. O título de seção fica maior que ele, como no iOS (App Store e Music usam título inline de 17 e cabeçalho de seção de 22).

**O que não entrou, de propósito:**
- O texto do Mercado Pago é 16. Aqui a linha de lista dentro de card continua 15/13, por causa da coluna estreita (seção 5). Se no aparelho o 15 parecer pequeno, a troca para 16/14 é de token.
- As linhas sem divisória e com 24 dp entre itens são outro padrão de lista. Vale testar na lista de faturas e no extrato, mas isso é mudança de componente, não de escala.

## 14. Revisão 3: sheets e lista de faturas (teste no Samsung S23, 26/10/2026)

O S23 tem 360 px de largura útil (CSS px = dp), e não os 390 usados até aqui. A partir desta revisão, a auditoria roda nas duas larguras.

**Sheets (todos os 8: 3 montados no código e 5 pré-montados)**

| Item | Antes | Agora |
|---|---|---|
| Alça | a 10 do topo, 6 até o cabeçalho | a 8 do topo, 12 até o cabeçalho |
| Título com 2+ linhas | começava logo abaixo da alça (só o de 1 linha ficava centralizado com o botão fechar) | sempre começa no mesmo ponto: alinhado ao topo do botão fechar, 10 abaixo, o que mantém o caso de 1 linha centralizado |
| Quebra do título | "Como calculamos seus / ganhos" | linhas equilibradas (`text-wrap: balance`) |
| Altura | sem limite: em 360×780, o sheet de Regras passava da tela e cortava alça e título | no máximo a tela menos 48; rola por dentro |
| Ilustração | 2 abaixo do título | 16 |
| Botão "Entendi" | 16 acima | 24 |

**Conteúdo dos sheets**
- **Regras do cashback:** cada regra com 14 em cima e embaixo (eram 10), 16 entre o ícone e o texto, e 12 entre a ilustração e a lista.
- **Como funciona:**
  - Linhas da lista com 12 em cima e embaixo (eram 8), o que dá 56 de altura mínima.
  - A caixa ganhou 16 de margem acima e padding de 4/16.
- **Como calculamos seus ganhos:**
  - A frase "Somamos o desconto…" deixou de ser um rótulo cinza em negrito e virou o subtítulo do sheet.
  - Cada parcela mostra o nome em cima e o valor embaixo, 13/18 e 16/22 bold. Em 360 px, o nome ao lado do valor quebrava como "Cashback que já / caiu".
  - O total continua com rótulo e valor na mesma linha, com 16 de folga.
  - As notas ganharam 12 em cima e embaixo de cada linha.

**Lista de faturas**
- **Sem a seta à direita:** a linha inteira já é a área de toque. A seta vinha do protótipo original e ocupava 34 px da coluna de texto.
- **Selo de cashback:**
  - O texto passou a ser "+R$ 34,07 cashback gerado", sem o "de", e cabe numa linha em 360 px.
  - A casinha ganhou 8 de folga da borda (eram 4), com 8 até o texto.

**Achado da auditoria em 360 px**
- **O problema:** 12 telas pré-montadas (detalhe de fatura e comprovantes) tinham a raiz travada em 390 px. No S23, o conteúdo vazava 10 a 14 px pela direita.
- **Correção:** no modo celular, a raiz dessas telas acompanha a largura da tela. O texto `width: 390px` continua no código, porque o app o usa para achar a raiz de cada tela.

## 15. Revisão 4: refinamentos de navegação (26/10/2026)

### Números: por que pareciam "separadinhos"

Medição (Manrope Bold, 100 px):

| Algarismo | Tabular | Proporcional |
|---|---|---|
| 1 | 0,62 em | 0,44 em |
| 7 | 0,62 em | 0,53 em |
| "135" | 1,86 em | 1,61 em (−13%) |
| "212" | 1,86 em | 1,63 em (−12%) |

- **A causa era o `tabular-nums`, não o espaçamento entre letras.** O protótipo usava algarismos tabulares em todo valor. Na Manrope, o "1" tabular é 40% mais largo que o proporcional, o que abre um vão em volta de cada 1 e cada 7. Só apertar o espaçamento entre letras (como no original, −0,04em) não fecha esse vão.
- **Regra nova:**
  - **Valores de 18 px para cima** (saldo, total, valor de destaque): algarismos proporcionais.
  - **Números de 28 px para cima:** espaçamento entre letras de −0,03em.
  - **Valores pequenos empilhados em coluna** (linhas de fatura, extrato, detalhamento): continuam tabulares, para os centavos alinharem.
  - **Contagem animada do Retorno:** roda com tabular, para não tremer, e termina proporcional.

### Padrão de linha de lista

| Parte | Regra |
|---|---|
| Linha | alinhada pelo topo (`flex-start`); padding vertical 12–16; divisória de 1 px entre itens |
| Ícone | círculo de 40–44 px. O fundo e a cor seguem o status: verde (`#E5F1E8` / `#276638`) em entrada recebida, âmbar em a receber, cinza em saída |
| Título | 15/20 · 700 |
| Subtítulo | 13/18 · 500 · `#545C57`, a **2 px** do título em todas as listas (o original misturava 1 e 3; "Como pagar" estava com 4) |
| Meta (data) | 12/16 · `#6A726D` |
| Valor | à direita, alinhado ao título (mesma linha de 20 px), com o selo de status 4 px abaixo |

### O que mudou

- **Extrato do cashback:**
  - Os filtros (Todos, Entradas, Saídas, A receber) rolam para o lado em vez de quebrar linha.
  - A busca ganhou o botão "Período" dentro do campo. Ele abre o sheet "Filtrar por período": 30 dias, 3 meses, 6 meses, este ano ou escolher as datas.
  - As linhas seguem o padrão acima.
- **Sheets:**
  - Cabeçalho fixo: título e botão de fechar ficam no topo enquanto o conteúdo rola.
  - O ícone do detalhe da movimentação segue a cor do status.
- **Botões de largura total:** uma altura só, 52 (eram 54, 52, 50 e 40). Inclui o "Ver comprovante" do detalhe, que tinha 40.
- **Comprovante:**
  - O check, "Fatura paga" e o valor sobem para a altura do cabeçalho (−40 px).
  - "Valor da fatura" e os balões ficam a 8 px um do outro (antes 10).
  - "Início" e "Compartilhar" ficam lado a lado.
  - "Detalhes do pagamento" começa recolhido. O comprovante cabe numa tela de 360×780 sem rolar.
- **Altura mínima das telas:** passou a ser a da tela real, não os 844 do iPhone. Pagamento confirmado e comprovantes não rolam mais no S23.
- **Motion nas telas de sucesso:**
  - O check entra com um leve salto (620 ms).
  - Título, valor, cards e rodapé sobem em sequência.
  - Nada se move quando o celular pede movimento reduzido.
- **Meu cashback:**
  - "Indique e receba" com 16 de padding em cima e embaixo (antes 10).
  - "Seu cashback em números" ganhou uma barra empilhada com o destino do cashback: disponível, usado em faturas e resgatado, com %.
- **Origem dos ganhos:** cada card (Retorno) e cada linha de "De onde vem → Por produto" (Meu cashback) abre um sheet com o detalhe. O sheet mostra quanto voltou, a fatia no total, a divisão entre desconto e cashback e as regras daquele produto.
- **Ajustes de 2 px:**
  - Abas segmentadas: 4 px em cima e 4 embaixo (antes 4 e 6).
  - Subtítulo dos slides de "Dá pra ganhar mais": 2 px do título (antes 4).
  - Data das faturas: 2 px do mês (antes 4).

## 16. Revisão 5: acessibilidade e UX (26/10/2026)

### Contraste (medido tela a tela contra o fundo real de cada texto)

| Cor | Onde | Antes | Agora |
|---|---|---|---|
| Laranja de vencida | texto, botão "Pagar", faixa "Vencida" | `#F46600` · 3,1:1 | `#B84A00` · 5,2:1 (4,5:1 no selo claro); a faixa mantém o brilho embaixo e escurece onde está o texto branco |
| Cinza de texto pequeno | placeholder, metas | `#8A928D` · 3,2:1 | `#6A726D` · 4,95:1 |
| Centavos dos valores grandes | "R$ 212**,30**" | `#8A928D` · 2,8:1 no fundo cinza | `#646C67` · 4,7:1 (seguem mais apagados que o número inteiro) |
| Verde em texto pequeno | "+R$ 34,07", totais de 13–14 px | `#338449` · 4,0–4,2:1 | `#276638` · 5,9:1+ |
| Verde-claro dos balões | "cashback gerado", "de cashback" | `#5A7A63` · 4,2:1 | `#4D6E57` · 4,9:1+ |
| Meses sem dado no gráfico | "Mar", "Abr" | `#A9B1AC` · 2,2:1 | `#6A726D` |
| Setas e pontos (ícones) | chevrons | `#9AA39E` · 2,6:1 | `#8A928D` · 3,2:1 (ícone pede 3:1) |

O verde de marca `#338449` continua nos botões, ícones, barras e em textos de 18 px para cima.

### Área de toque

Chips, abas segmentadas e botões de 32 a 40 px mantêm o visual. Ganharam uma extensão invisível que completa 44 px de toque. A linha "R$ 31,40 vencem… · Prazos" do Meu cashback tinha 18 px de altura; agora tem 44, sem mudar o visual. A única exceção são as colunas do gráfico de meses: 41 px de largura por 120 de altura, acima do mínimo do WCAG 2.5.8 (24 px).

### UX

- **Barra inferior:** todas as abas mostram o nome sob o ícone; a ativa ganha a pílula verde atrás do ícone. Vale também para as barras das telas pré-montadas.
- **Extrato:**
  - Os chips filtram de verdade: Todos, Entradas, Saídas e A receber.
  - A busca é um campo de texto que filtra enquanto se digita.
  - O "Período" filtra por 30 dias ou 3 meses e mostra a escolha no botão. Ao reabrir, o sheet vem com o período em uso marcado.
  - Os meses sem lançamento somem. Sem resultado, aparece "Nada por aqui".
  - A escolha vale enquanto o protótipo estiver aberto.
- **Origem dos ganhos:** a partir do Retorno, o sheet mostra o retorno total do produto (desconto + cashback). A partir do Meu cashback, mostra só o cashback daquele produto e a fatia dele no seu cashback, com uma nota sobre o desconto à parte.
- **Toques fora do escopo:** o protótipo já avisava "Esta parte fica fora do protótipo". Nada a mudar.

## 17. Revisão 6: laranja de vencida (26/10/2026)

O `#B84A00` da revisão 5 passava no contraste, mas puxava para o marrom. Ficou o âmbar `#B45309`, em dois tons da mesma matiz (26°):

| Tom | Uso | Contraste |
|---|---|---|
| `#B45309` | botão "Pagar", faixa "Vencida", ícones, texto de 18 px para cima | 5,0:1 no branco; texto branco por cima 5,0:1 |
| `#A84E08` | texto pequeno: "1 vencida", selos "Vencida há 6 dias", multa e juros, "Ver" | 5,6:1 no branco; 4,9:1 no cinza da página; 4,8:1 no selo pêssego |

- **Por que dois tons:** o `#B45309` sozinho cai para 4,3–4,4:1 sobre o selo pêssego e o cinza da página, abaixo de 4,5. Por isso o texto pequeno usa o tom um pouco mais fechado. A diferença entre os dois mal aparece.
- **Faixa "Vencida":** fica sólida em `#B45309` onde está o texto branco e se abre em âmbar mais claro embaixo (`#E8862E` → `#FBCB9A`). O brilho em volta saiu do laranja-avermelhado e foi para a mesma família.
- **Auditoria:** 178 telas em 360×780 e 390×844, com zero falhas de contraste, toque, corte ou layout.
