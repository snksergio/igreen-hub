# A primeira recarga — o que ficou construído

Documento do que **existe no código**, não do que foi planejado. Onde este
arquivo divergir do `BRIEFING-DECK-MOBI.md`, o código venceu — as divergências
estão na seção 7.

Prints de cada página em `slides/` (23 PNGs).

---

## 1. O deck

| | |
|---|---|
| Título | **A primeira recarga** — dossiê de descoberta, Conexão MOB |
| Composição | `ConexaoMOB` |
| Formato | 1920 × 1080, 30 fps |
| Duração | **3747 frames ≈ 125 s** |
| Páginas | 23 |
| Autor | Sérgio Vieira |
| Saída | `out/ConexaoMOB-PrimeiraRecarga.mp4` — mudo |
| Saída narrada | `out/ConexaoMOB-PrimeiraRecarga-NARRADO.mp4` |
| Projeto | `conexao-mobi/`, separado do `capital-outlook/` |

Nada foi alterado no projeto `capital-outlook`.

---

## 2. Marca

### Cor

O verde institucional **#00A859** é o acento. Sobre fundo escuro ele perde
presença, então os tons escuros usam a variante clara **#5DD389**.

| Tom | Fundo | Tinta | Secundário | Acento (área) | Acento (texto) |
|---|---|---|---|---|---|
| `light` | `#F1F3F0` | `#0A140E` | `#6F7C73` | `#00A859` | `#00874A` |
| `paper` | `#FFFFFF` | `#0A140E` | `#6F7C73` | `#00A859` | `#00874A` |
| `ink` | `#08120C` | `#F2F7F3` | `#7A9184` | `#5DD389` | `#5DD389` |
| `forest` | `#073A22` | `#EAF6EE` | `#86B79B` | `#5DD389` | `#5DD389` |
| `brand` | `#00A859` | `#06180F` | `rgba(6,24,15,.68)` | `#06180F` | `#06180F` |

**Por que existem dois acentos.** #00A859 sobre o papel claro dá ~2,8:1 de
contraste — abaixo do piso de texto. Então `accent` serve para preencher área
(barra, card, fundo) e `accentText` (#00874A) para tipografia e traço de
gráfico. Sobre fundo escuro os dois coincidem em #5DD389.

O tom `brand` é o antigo `lime`: fundo #00A859 com tinta quase preta. Aparece
três vezes — agenda (02), a virada da tese (17) e encerramento (23).

Rampa de verdes para gráficos: `#5DD389 · #2FBE72 · #00A859 · #048C4C ·
#07713E · #0A5730`.

**Uma cor de estado fora da marca:** `#FF5C5C`, só na cena 09, para o trecho
sem cobertura. Em verde escuro ele se confundia com o resto do mapa e o dado
mais importante da página passava batido.

### Tipografia

**Outfit** carrega o deck inteiro, display e texto, nos pesos 300–700. É mais
larga que a Inter Tight que estava aqui antes, então todos os tamanhos de
título foram reconferidos página a página depois da troca.

### Logo

Os SVGs oficiais viraram componentes em `src/components/Logo.tsx`, com o fill
trocado por prop — a marca acompanha o tom da página em vez de exigir uma
versão por fundo.

- `<IgreenMark>` — isotipo, no trilho superior de todas as páginas.
- `<IgreenLogo>` — lockup completo, no encerramento.
- `<IgreenWatermark>` — o isotipo em escala grande, girando devagar, como
  marca-d'água. Está em **duas** páginas (11 e 16), no lugar dos raios. Em
  todas viraria papel de parede.

O encerramento fecha com o **conector Type 2** (`bomba4`) em escala grande no
canto direito, no lugar do raio que estava ali antes. Existe também uma
`S23ClosingV2` fora do deck, registrada no Studio como
`23b-Encerramento-v2`, que troca as curvas de nível por um campo em
perspectiva (`<SolarField>`) — ficou como alternativa de fundo em teste.

---

## 3. Assets

Os renders 3D oficiais estão em `public/assets/` e entram sempre por
`<Asset name="..." width={N} />` (`src/components/Asset.tsx`), nunca por `<Img>`
solto. São PNGs quadrados de 1254 px com fundo transparente.

| Asset | Onde aparece |
|---|---|
| `bomba1` totem 3/4 | 10 (ilustração do cabeçalho) |
| `bomba2` totem duplo | 10 (card "O visor") |
| `bomba3` totem fino | 01 (textura da capa) |
| `bomba4` conector em close | — disponível, não usado |
| `Carro`, `carro3`, `carro4`, `carro6` | — disponíveis, não usados |
| `carro2` lateral | 08 (o carro que percorre a jornada), 15 |
| `carro5` traseira 3/4 | 11 |
| `ilustracao1` celular com mapa | 07, 08 (M1), 13 (SMS/OTP) |
| `ilustracao2` carro em estrada | 08 (M2), 21 (Chegar) |
| `ilustracao3` totem com lupa | 08 (M3), 10 (card "A ajuda") |
| `ilustracao4` vaga com check | 08 (M4), 10 (card "A vaga") |
| `ilustracao5` totem com QR | 08 (M5), 10 (card "O QR") |
| `ilustracao6` pagamento por aproximação | 07, 08 (M6), 13, 21 (Pagar) |
| `ilustracao7` carro carregando com relógio | 08 (M7), 13, 21 (Carregar) |
| `ilustracao8` totem com carro saindo | 08 (M8) |
| `ilustracao9` carteira e recibo | 06, 08 (M9), 13, 21 (Voltar) |

**As nove ilustrações mapeiam um a um nos nove momentos da jornada** — foi
para isso que foram feitas, e é assim que a cena 08 as usa.

**Regra de uso:** asset é ilustração, não destaque. Em página de dado denso ele
entra como selo pequeno no canto do card; em página de respiro pode ser
protagonista; na capa entra como textura a 22% de opacidade, porque um render
colorido e opaco atrás de um número em verde vira um segundo foco e mata a
legibilidade.

### Vetores que continuam em código

`src/components/EvAssets.tsx` guarda o que é **diagrama técnico**, não
ilustração: `<ConnectorGlyph>` (CCS2 · Type 2 · GB/T · CHAdeMO, na cena 10),
`<BoltGlyph>`, `<BoltWatermark>` (marca-d'água das páginas 04 e 12),
`<CableCurve>`, `<BatteryStrip>` e `<SignalVoid>`. Silhueta de conector precisa
ser esquemática; um render bonito não comunicaria a diferença entre os padrões.

---

## 4. As duas cenas que foram reescritas

### 08 — A jornada, com o carro percorrendo

A faixa tem **3780 px** e não cabe na tela. O carro anda por ela em velocidade
constante, do primeiro ao nono momento. Cada estação começa apagada (20% de
opacidade) e **sobe para 100% quando o carro chega**, com o bloco de texto
subindo de baixo; a bolinha do trilho passa de vazia para marcada, e o trecho
já percorrido fica no acento. Ao mesmo tempo **a câmera vai se afastando**, de
modo que quando o carro chega no nono momento a faixa inteira já cabe.

A cena tem **420 frames** (14 s): ~37 frames (1,2 s) por momento no percurso e
**100 frames (3,3 s) parados no panorama** antes do corte. Passou por 210 → 300
→ 420 — nas duas primeiras versões não dava tempo de ler cada momento, e o
corte para o slide seguinte vinha em cima do fim do percurso.

Três decisões que valem registro, porque foram defeitos reais:

- **Tudo é HTML; nada é `<text>` de SVG.** Um `<g opacity>` dentro de um SVG
  que depois é escalado por CSS é rasterizado pelo browser ANTES da escala, e o
  buffer corta as letras no meio. Era isso que aparecia como texto picado, com
  uma borda vertical dura no meio das palavras.
- **A câmera é um clamp, não uma máquina de estados.** Ela segue o carro, mas
  nunca a ponto de deixar mundo vazio na borda:
  `cx = clamp(carX, halfView, WORLD_W − halfView)`. Quando o zoom abre o
  bastante, os dois limites se encontram e o clamp sozinho centraliza a faixa —
  sem fase separada de "abrir", que era onde aparecia o enquadramento torto.
- O PNG lateral do carro vem virado para a esquerda; sem espelhar em X ele anda
  de ré.
- **Ponto visitado é sempre o acento.** O que distingue o momento em foco (M6) é
  o raio maior e o halo pulsante, não uma segunda cor — com o foco em verde e os
  demais em preto, o panorama terminava com dois estados concorrendo.
- O carro para **130 px depois** da última estação. Parando em cima dela, ela
  congelava a 57% de opacidade e ficava mais apagada que todas as outras.

### 09 — Território, sem globo

O globo 3D saiu. Ficou o **mapa do Brasil plano**, em matriz de pontos, com as
12 capitais e **14 corredores rodoviários** ligando-as — 7 com cobertura, 7 sem.

Os sem cobertura são **tracejados em vermelho**, com um **Wi-Fi cortado**
piscando e uma **carinha triste** no meio do trecho. Os que funcionam levam um
**coração verde**. Legenda embaixo separando os dois estados.

Duas correções de leitura vieram de revisão:

- **Corredores no miolo.** A primeira versão só tinha o cluster do Sudeste e a
  corrente costeira do Nordeste, então tudo ficava nos cantos e o meio do mapa
  era um campo de pontos vazio. Entraram São Paulo–Belo Horizonte, Belo
  Horizonte–Salvador e Manaus–Belém.
- **Marcador só nos trechos representativos** (4 dos 7 sem cobertura, 3 dos 7
  com). Um marcador por corredor virava ruído e apagava justamente o que se
  queria destacar.

As barras de sinal que ficavam no rodapé saíram junto. Com isso o deck **não
usa mais Three.js** em nenhuma página.

---

## 5. O que veio do deck anterior sem mudar

- **Grade** — margem 104, área útil 1712 × 784, trilho superior e inferior.
- **Movimento** — `Easing.bezier(0.16, 1, 0.3, 1)` como única curva; helpers
  `useReveal`, `Rise`, `SlideIn`, `Curtain`, `Ticker`. Nada anima sozinho.
- **Transições** — `riseOver()` e `sweep(accent)`. Nenhuma terceira foi criada,
  e entre páginas do mesmo tom é sempre `riseOver`.
- **O gesto tipográfico** — última expressão do título no acento.
- **Um destaque por página.**

### Componentes próprios deste deck

| Componente | O que faz |
|---|---|
| `<MarkerPill>` | procedência da página: PESQUISA · REGULAÇÃO · HIPÓTESE · FONTE FRÁGIL · LACUNA |
| `<Frame source>` | a coluna central do rodapé é a fonte do dado daquela página |
| `<SectionHead>` | eyebrow + título em máscara + nota lateral, igual em todas as páginas |
| `<Quote>` · `<ClosingLine>` · `<NoteText>` · `<StatGrid>` · `<Card>` | blocos repetidos |
| `<Journey>` · `<PriceLadder>` · `<TensionDiagram>` | as três páginas com forma própria |

`<SectionHead>` foi a decisão mais útil: com 23 páginas escritas em paralelo, é
ele que garante que todo cabeçalho tenha o mesmo ritmo e a mesma máscara.

### Geometria — `geoBr.ts`

Anel `[lon, lat]` do contorno do Brasil desenhado à mão, com `isBrazil()` por
ray casting e `brazilLattice(step)` para a malha de pontos, mais `BR_CAPITALS`
e `BR_CORRIDORS`. Nenhum GeoJSON importado; a silhueta foi conferida por
rasterização ASCII antes de virar tela.

---

## 6. Ritmo e mapa de cortes

```
01 ink → 02 brand → 03 light → 04 ink → 05 light → 06 forest → 07 paper
→ 08 light → 09 ink → 10 light → 11 forest → 12 forest → 13 light
→ 14 paper → 15 light → 16 ink → 17 brand → 18 light → 19 forest
→ 20 light → 21 paper → 22 light → 23 brand
```

| # | Cena | Tom | Frames | Marcador | Corte seguinte |
|---|---|---|---|---|---|
| 01 | Capa | ink | 150 | — | `sweep` · 22f |
| 02 | Agenda | brand | 150 | — | `riseOver` · 24f |
| 03 | O mercado real | light | 168 | Pesquisa | `sweep` · 22f |
| 04 | Quatro plataformas | ink | 174 | Pesquisa | `riseOver` · 24f |
| 05 | As dores por peso | light | 186 | Pesquisa | `sweep` · 22f |
| 06 | O problema é dinheiro | forest | 168 | Pesquisa | `riseOver` · 24f |
| 07 | Amado × odiado | paper | 168 | Fonte frágil | `riseOver` · 24f |
| 08 | Nove momentos | light | 420 | Pesquisa | `sweep` · 22f |
| 09 | Um terço sem sinal | ink | 195 | Pesquisa | `riseOver` · 24f |
| 10 | O totem ao sol | light | 180 | Pesquisa | `sweep` · 22f |
| 11 | M6, o funil de morte | forest | 156 | — | `riseOver` · 24f |
| 12 | Duas ou vinte ações | forest | 180 | Pesquisa | `sweep` · 22f |
| 13 | As quatro válvulas | light | 186 | Pesquisa | `riseOver` · 24f |
| 14 | O teto do SMS | paper | 168 | Pesquisa | `riseOver` · 24f |
| 15 | O app como fechadura | light | 174 | Pesquisa | `sweep` · 22f |
| 16 | Três reguladores | ink | 186 | Regulação | `sweep` · 22f |
| 17 | **Não se trava. Se recompensa** | brand | 195 | Pesquisa | `sweep` · 22f |
| 18 | O que o Brasil tem | light | 174 | Pesquisa | `sweep` · 22f |
| 19 | A tag do pedágio | forest | 168 | Regulação | `sweep` · 22f |
| 20 | A tensão do modelo | light | 180 | Hipótese | `riseOver` · 24f |
| 21 | O fluxo proposto | paper | 195 | Hipótese | `riseOver` · 24f |
| 22 | As respostas que faltam | light | 180 | Lacuna | `sweep` · 22f |
| 23 | Encerramento | brand | 150 | — | — |

Soma das cenas **4251**, soma das transições **504** (10 × `riseOver` 24 +
12 × `sweep` 22), `durationInFrames` = **3747**.

> Se mudar qualquer duração, recalcule e atualize `Root.tsx`. Não é automático.

---

## 7. Divergências em relação ao briefing

1. **`<MarkerPill>` vive no trilho superior**, não no canto da área de
   conteúdo. Quase toda página usa esse canto para a nota lateral do
   `<SectionHead>`, e o marcador colidia.
2. **Existe um quinto `kind` de marcador: `gap` → LACUNA.** A cena 22 é sobre o
   que ainda não se sabe, e nenhum dos quatro do briefing servia.
3. **A cena 09 não tem 3D.** O briefing dava Rota A (Brasil) e Rota B (globo);
   o pedido posterior foi mapa plano, e é o que está no código.
4. **`<SignalVoid>` não é usado em nenhuma página.** Continua disponível.
5. **O par Baymard não entrou.** O briefing permitia com ressalva na tela; foi
   deixado de fora porque a página de dores já sustenta o argumento com o
   corpus próprio.
6. **`<ConnectorGlyphs>` virou `<ConnectorGlyph kind>`** — um componente com
   uma prop, não quatro componentes.
7. **Os títulos não usam `Interactive.Div`.** Só afeta a edição visual no
   Remotion Studio, não o render.

---

## 8. Assets que fariam falta

Onde uma ilustração está sendo **reaproveitada** de outro contexto, porque não
existe uma dedicada. Nenhuma página ficou sem — mas estas sete ganhariam:

| Precisaria de | Hoje usa | Onde |
|---|---|---|
| Celular recebendo código SMS | `ilustracao1` (celular com mapa) | 13, card "SMS / OTP" |
| Cartão com valor bloqueado / caução | `ilustracao6` (pagamento) | 13, card "Pré-autorização" |
| Carteira com cadeado (saldo preso) | `ilustracao9` (carteira) | 13, card "Saldo preso" |
| Multa / parquímetro (ociosidade) | `ilustracao7` (carga com relógio) | 13, card "Ociosidade" |
| Documento de norma / regulação | — | 16, três reguladores |
| Tag de pedágio / pórtico | — | 19, a tag do pedágio |
| Formulário de cadastro sendo preenchido | — | 04 e 05, o atrito de cadastro |

---

## 9. Narração

Existem **duas composições**, com a mesma imagem:

| Composição | O que é |
|---|---|
| `ConexaoMOB` | o deck mudo, exatamente como foi aprovado |
| `ConexaoMOB-Narrado` | o mesmo `<Deck>` importado inteiro, mais uma camada de áudio |

`DeckNarrado.tsx` não altera nenhuma cena: ele renderiza o `<Deck>` original e
põe os clipes de voz como irmãos. Por isso a versão muda continua idêntica.

- **Voz:** Tiago Fonseca (ElevenLabs, pt-BR), velocidade 0,95.
- **22 clipes** em `public/vo/`, um por cena. A cena 02 é silêncio de propósito.
- Cada clipe é fixado no frame em que sua cena entra (`from={line.start}`).
  Um arquivo contínuo único iria dessincronizando ao longo dos dois minutos se
  o ritmo real da locução diferisse da estimativa; preso por cena, cada fala
  começa no frame exato.
- O roteiro e o raciocínio por trás dele estão em `ROTEIRO-NARRACAO.md`.

**Para trocar uma linha:** gere o MP3 novo, substitua em `public/vo/`, e
atualize `dur` em `src/lib/narration.ts` com a duração medida. O campo
`window` ao lado diz quanto espaço aquela cena tem — se `dur` passar de
`window`, a fala atropela a da cena seguinte.

---

## 10. Como mexer

```bash
cd conexao-mobi
npm i

npx remotion studio                      # cada cena isolada na pasta "Cenas"
npx remotion still 17-Escada out.png --frame=172
npx remotion render ConexaoMOB out/ConexaoMOB-PrimeiraRecarga.mp4 --codec=h264 --crf=17
npx tsc --noEmit && npx eslint src
```

Todo o conteúdo está em **`src/lib/data.ts`**, com `source` e `marker` em cada
bloco alimentando o rodapé e o marcador sem hardcode na cena.

**Cuidado com comprimento de texto.** Várias páginas estão calibradas para
caber exato nos 784 px úteis. Depois de qualquer mudança de copy, renderize os
stills e olhe — erro de diagramação não quebra a compilação.

---

## 11. Linguagem

O deck é lido por gente de produto e de negócio, não por quem fez a pesquisa.
Termos de bastidor foram tirados de todas as páginas:

| Saiu | Entrou |
|---|---|
| "Dossiê de descoberta" | "Pesquisa de mercado" |
| "matriz CSD", "CONTEXT.md", "os seis anexos" | "Um levantamento amplo e analítico do mercado de recarga…" |
| "gaps-pendencias.md" | "questões em aberto · 07/09/2026" |
| "dossiê, seção 12" / "seções 7 e 9" | "análise do modelo de negócio" / "síntese da pesquisa" |
| "service blueprint" | "mapeamento da jornada" |
| "corpus" (3 lugares) | "material analisado", "avaliações de usuários" |
| "pesquisa desktop" | "investigação em fontes públicas" |
| "veículos secundários" | "fontes secundárias" |
| "review de app store" | "avaliação de app" |
| "Fim do dossiê" | "Fim da apresentação" |

O que **não** mudou: nome de fonte real continua na tela (ABVE, Anatel, BCB,
Reclame Aqui, Twilio, Mastercard, as normas com artigo e data). Isso não é
jargão — é a procedência que sustenta o número.

---

## 12. O que continua valendo do briefing

- **Nada aqui é regra da iGreen.** Todo o conteúdo é pesquisa ou hipótese, e o
  marcador de cada página diz qual.
- **Nenhum dos números vetados** da seção 2.2 do briefing existe no `data.ts`.
- **Marcas de terceiros aparecem só como texto.** Nenhum logotipo de terceiro
  foi desenhado ou reproduzido.
- **Nenhuma hipótese é apresentada como conclusão.**
