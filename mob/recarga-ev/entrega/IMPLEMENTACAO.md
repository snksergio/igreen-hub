# Recarga EV — especificação de implementação

Duas telas do fluxo de recarga em eletroposto do iGreen Mob: **Tela 1 · Conectar o cabo** e **Tela 2 · Acompanhar a recarga**, na tela verde, com dois carros ilustrados (**Minimal SUV** e **Minimal raio-x**) e uma bateria desenhada por código em dois estilos (**Barra 3D**, padrão, e **Blocos**).

A fonte da verdade do visual e do comportamento é `mockup.html`: todo valor exato (cor, tamanho, tempo) que não estiver aqui está no CSS ou no `<script>` dele. Este documento explica o que o código não conta sozinho: como as camadas se compõem, a matemática da bateria e as armadilhas.

## Passos

1. **Reconheça o app de destino.** Descubra a stack (React Native/Expo, React web, Flutter…), onde vivem as telas de recarga atuais, o design system (cores, fonte, botão, card, cabeçalho) e de onde vêm os dados da sessão de recarga. Pronto quando cada item da seção [Telas](#telas) tiver um componente do app que vai desenhá-lo e cada número da seção [Dados](#dados) tiver uma origem real.
2. **Rode o mockup.** Abra `mockup.html` e passe pelo painel "Simular": os 2 carros, Barra 3D e Blocos, carga ao conectar de 5% a 70%, limite 80/90/100, % do limite em cima e embaixo, os 4 tamanhos de celular, "Simular conexão" e "Carregar até o limite". Pronto quando você tiver visto cada combinação que o checklist cobre.
3. **Traga os assets** para o app no formato da stack ([Assets](#assets)).
4. **Monte o fundo e a soma de luz** ([Composição](#composição-soma-de-luz)). É a parte que mais quebra: faça antes das telas.
5. **Implemente a Tela 1** ([Tela 1](#tela-1--conectar-o-cabo)).
6. **Implemente o componente de bateria** ([Geometria](#geometria-e-homografia) e [Bateria](#bateria)), lendo `assets/geometria.json`.
7. **Implemente a Tela 2** e ligue aos dados reais ([Tela 2](#tela-2--acompanhar-a-recarga), [Dados](#dados)).
8. **Verifique** cada item do [Checklist](#checklist) nos 4 tamanhos (360, 375, 390, 430 pt) e na densidade real do aparelho. Pronto quando todos passarem.

## Assets

Tudo em `assets/`. Cada ilustração existe em 3 resoluções com o mesmo desenho:

| Uso | Web (`assets/web/`) | App nativo (`assets/png/`) |
|---|---|---|
| até ~540 px físicos | `nome-480.webp` | `nome.png` (@1x, 480 px) |
| até ~1000 px físicos | `nome-960.webp` | `nome@2x.png` (960 px) |
| acima | `nome-1440.webp` | `nome@3x.png` (1440 px) |

Escolha pela largura **física** exibida (largura em pt × densidade). No React Native, `require('./carro-m25-vazio.png')` já escolhe @2x/@3x sozinho. Evite deixar a plataforma reduzir o arquivo de 1440 px para uma tela de 390 pt: a redução forte em tempo real serrilha os anéis do chão e os contornos finos, e foi exatamente isso que as 3 resoluções resolveram.

| Arquivo | O que é |
|---|---|
| `carros/carro-m25-vazio` | Minimal SUV, bateria como placa escura lisa (a carga é desenhada por cima) |
| `carros/carro-m27-vazio` | Minimal raio-x, idem |
| `carregadores/carregador-minisuv-solto` / `-plugado` | Tela 1 do Minimal SUV: plugue no suporte / plugue na tampa |
| `carregadores/carregador-mini-solto` / `-plugado` | Tela 1 do Minimal raio-x (tom azulado, combina com os anéis ciano do carro) |
| `geometria.json` | Cantos da bateria, porta e suporte, espaço lógico de cada imagem |

As imagens dos carros têm a face da bateria pintada como **placa uniforme** de propósito: o desenho da bateria cobre a face inteira e, em 0%, nenhuma diferença da imagem aparece por baixo. Mantenha o desenho cobrindo a face toda.

`fontes/` guarda os originais e o script que gera tudo (`node processar-hd.mjs`, precisa de `sharp`). Só mexa lá para exportar outro tamanho.

## Composição (soma de luz)

Todas as ilustrações vêm com **fundo preto puro** e bordas com transparência suave. Elas são feitas para a **soma de luz** (modo de mistura *screen*) sobre o fundo verde: o preto some e só a luz do carro aparece. Desenhadas por cima sem essa mistura, aparecem como retângulos pretos.

- **Fundo da tela:** degradê vertical `#020705` (0%) → `#06120c` (45%) → `#0c1f16` (100%), mais escuro em cima.
- **Web:** `mix-blend-mode: screen` no elemento que contém a ilustração e o desenho da bateria (no mockup, `.art`).
- **React Native:** `@shopify/react-native-skia` com o fundo e a ilustração no mesmo `Canvas` e a ilustração num `Group` com `blendMode="screen"`. Alternativa: RN 0.77+ com a nova arquitetura, estilo `mixBlendMode: 'screen'`.
- **Flutter:** `BlendMode.screen`.

No mockup, a imagem **e** o desenho da bateria estão no mesmo grupo somado ao fundo. Reproduza assim, porque as cores da bateria foram calibradas somadas ao verde. O **rótulo do limite** ("80%" com ▼) fica numa camada **fora** da soma, por cima: o halo escuro atrás dele só funciona sem o *screen*.

## Geometria e homografia

Todas as coordenadas de `geometria.json` estão no **espaço lógico** da imagem (carros com 1600 de largura, carregadores com 1400), valendo para qualquer resolução do arquivo. Para desenhar, escale por `larguraExibida / larguraLógica`.

`pack` são os 4 cantos da face de cima da bateria, em perspectiva: **longe-frente, longe-trás, perto-trás, perto-frente**. Os eixos da face:

- `u` vai da frente do carro (esquerda, 0%) até a traseira (direita, 100%). **A carga é `u`**: 68% de bateria significa preencher de `u = 0` a `u = 0,68`.
- `v` vai da borda de longe (0) até a de perto (1).

A homografia leva `(u, v)` para `(x, y)` na imagem e mantém a perspectiva correta ao longo da barra:

```js
function homography(q) {                 // q = pack
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / det, h = (dx1 * dy3 - dx3 * dy1) / det;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  return (u, v) => { const w = g * u + h * v + 1; return [(a * u + b * v + x0) / w, (d * u + e * v + y0) / w]; };
}
// trecho da face entre u0 e u1:  H(u0,0) → H(u1,0) → H(u1,1) → H(u0,1)
```

**Barra 3D:** a face da frente é a faixa entre a borda de perto `H(u,1)` e a mesma borda deslocada **16 unidades para baixo** (`bateria.espessuraFrenteBarra3D`). Marcadores verticais (ponta da carga, limite, início) viram a linha quebrada `H(u,0) → H(u,1) → H(u,1)+16`.

**Blocos:** N blocos iguais em `u` (`blocos`: 8 no SUV, 11 no raio-x), cada um de `i/N + 0,007` a `(i+1)/N − 0,007`.

## Bateria

Três entradas, todas de 0 a 1: **f** = bateria agora, **s** = carga ao conectar (`s ≤ f`), **lim** = limite da recarga. Camadas de baixo para cima (cores e gradientes exatos em `createScene` no mockup):

1. **Trilho vazio.** Barra 3D: face de cima em degradê `#3d4449` → `#262b2e` e frente `#1f2427` → `#141719`. Blocos: cada bloco `#4a5257` → `#2b3034`.
2. **Já tinha (azul), de 0 a s.** Barra: `#3a9ee0` → `#205f98`, frente `#174a73`. Blocos: do azul `rgb(28,96,160)` ao `rgb(54,158,222)`.
3. **Esta recarga (caminho neon), de s a f.** Degradê **ao longo de `u`**, de `H(s,.5)` a `H(f,.5)`: fraco no início e neon na ponta (`#1d5a38`@60% → `#2f9c5c` → `#3cf08e` → `#9dffc9`). A frente usa a versão escura. Em blocos, cada bloco recebe a cor do degradê na sua posição, com opacidade de 0,55 a 1.
4. **Vidro.** Barra 3D: brilho na face de cima, contorno branco 12% e **quina iluminada** na borda de perto (branco 28%). Blocos: brilho em cada bloco preenchido.
5. **Linha de início** em `s`, em branco-azulado 55%, só quando `f > s`.
6. **Brilho da ponta:** traço `#3cf08e` com desfoque, recortado pela bateria, e **reflexo na borda de perto** de `s` a `f`, que clareia até a ponta.
7. **Depois do limite** (`lim` a 1): preto 34% por cima, só se `lim < 1`.
8. **Carregando** (`f` a `lim`): verde `#3aa35e` 13% mais uma **faixa de brilho** que desliza de `f` até `lim` e recomeça, só se `lim − f > 0,004`.
9. **Ponta da carga:** linha `#d8ffe9` de 4 unidades, pulsando.
10. **Limite:** tracejado branco (14/10) em `lim`.
11. **Rótulo do limite**, na camada fora da soma. *Em cima*: "80%" (fonte 48, centralizado) sobre um ▼ que aponta para o topo do tracejado, com halo escuro (`#021008` 85%, desfoque 10). *Embaixo*: ▲ abaixo da bateria e texto à direita, ou à esquerda quando `lim > 90%`, sem halo.

Animações:

| O quê | Como |
|---|---|
| Faixa de brilho do "carregando" | ciclo de 2,6 s, *ease-in-out*; largura `max(0,1; 0,75 × (lim − f))` em `u`; opacidade máxima 28% |
| Ponta da carga | opacidade 0,55 ↔ 1 em 1,4 s; parada em 0,5 quando a recarga termina |
| Mudança de `f` | *ease-out* cúbico em 700 ms |
| Recarga concluída (`f ≥ lim`) | some o "carregando" e a ponta para de pulsar |

Respeite *reduzir movimento* do sistema desligando as animações de repetição.

## Tela 1 · Conectar o cabo

Conteúdo, de cima para baixo: fechar · chip "Shell Paulista · C-01" (dado de exemplo) · ajuda · título "Conecte o cabo no carro" · texto · **cena do carregador** · status · card do conector ("Conector C-01", "CCS2 · DC · até 150 kW", selo "Liberado") · "O conector não encaixa no carro?" · rodapé com "Conecte em até 2:00" (contagem com barra) e botão "Cancelar".

A **cena do carregador** usa o par do carro escolhido (`carros.*.carregador`) e o espaço lógico 1400 × 974:

- **Aguardando:** imagem *solto*; tracejado que marcha do suporte até a porta (curva quadrática suporte → controle → porta); um **plugue-fantasma** percorre a curva em loop de 2,8 s (55% indo, 25% parado, 20% sumindo; opacidade 0,7); anel pulsando na porta; etiqueta "Entrada" 150 unidades acima da porta.
- **Ao conectar:** o plugue vai do suporte à porta pela mesma curva em 1 s (*ease-in-out*). Depois a imagem *plugado* aparece por cima em 0,6 s, some o guia e a porta ganha um halo verde. O status fica "Carro conectado · lendo a bateria…" e, 1,15 s depois, "Bateria em {s}% · iniciando a recarga". No app, segue para a Tela 2 (no mockup, volta ao início após 5,6 s).

Pontos exatos da curva: `guide` e `approach` em `createChargerScene` no mockup.

## Tela 2 · Acompanhar a recarga

Conteúdo: minimizar · título "Carregando" com ponto ao vivo (ou "Recarga concluída") e "Shell Paulista · C-01 · CCS2" · mais opções · **% grande** e "~16 min para chegar em 80%" (ou "Limite de 80% atingido") · **carro com a bateria** · **3 métricas** (Potência, Energia, Decorrido) · card de custo (valor, tarifa, barra custo/teto, "Encerra sozinha em 80% ou R$ 60,00", "Alterar") · lista ("Avisar ao chegar em 80%" com interruptor, "Detalhes da recarga") · rodapé: "Encerrar recarga" durante a recarga e **"Desconectar e ver recibo"** (botão principal `#338449`) quando `f ≥ lim`.

A tela 2 não desenha cabo nem plugue saindo do carro: a conexão já foi mostrada na tela 1. O percentual é sempre informado; este fluxo não tem modo sem %.

## Dados

Os números do mockup são **simulados** (`renderS2`) e existem só para a apresentação. Ligue cada um ao dado real da sessão:

| Na tela | Dado real | Simulação no mockup |
|---|---|---|
| % grande, `f` | SoC atual | slider "Bateria agora" |
| parte azul, `s` | SoC no momento em que o cabo conectou | slider "Carga ao conectar" |
| tracejado, `lim` | limite escolhido pelo usuário | 80 / 90 / 100 |
| Potência | kW atual do carregador | curva que cai acima de 50% |
| Energia | kWh entregues na sessão | (f − s) × 60 kWh |
| Decorrido | tempo desde o início | kWh ÷ 62 kW |
| "~N min para chegar" | estimativa do backend, se houver | kWh restantes ÷ potência média |
| Custo, tarifa, teto | cobrança da sessão | R$ 1,30/kWh, teto R$ 60 |

## Layout responsivo

- **3 métricas**, não 4: em 360 pt, com 4 colunas cada uma teria ~82 pt, e "100,0 kWh" não cabe. Colunas `minmax(0, 1fr)`, valores sem quebra de linha.
- Título do conector, subtítulo do cabeçalho e texto do "Avisar" terminam em reticências se não couberem.
- Ilustração na largura total da tela. Na Tela 1, altura máxima de 30% da tela.
- **Tela baixa (altura < 700 pt, iPhone SE):** título 22, texto 14, cena da Tela 1 até 172 pt, card do conector e ajuda mais compactos, rodapé com menos respiro. Valores em `.screen.curta` no mockup.
- Resultado medido no mockup, com valores no pior caso ("150 kW", "100,0 kWh", "1h35", "R$ 130,00", "~125 min"): nada vaza na horizontal em 360/375/390/430. A Tela 1 cabe sem rolar nos 4. A Tela 2 cabe inteira em 390 e 430; em 360 e no SE a lista do fim rola, com o essencial (%, bateria, métricas, custo) visível.

## Tokens

| Token | Valor | Uso |
|---|---|---|
| Marca | `#338449` | botão principal, interruptor, barra de custo (início) |
| Destaque | `#9ee3b1` | texto pequeno em destaque sobre o verde ("~16 min", "Alterar", pontos ao vivo) |
| Texto | `#f2f7f3` · 76% · 60% | principal · secundário · terciário |
| Superfície | branco 6% (card) · 9% (ícone) | cards, botões de ícone |
| Linha | `rgba(214,240,222,.12)` · `.22` | bordas, divisórias, tracejado da ajuda |
| Botão secundário | fundo `#338449` 16%, borda 50% | "Cancelar", "Encerrar recarga" |
| Fonte | Geist 400–700; Geist Mono no cronômetro | — |

Raios: tela 50, cards 20, botões 18, chips 999. Se o app já tiver tokens equivalentes, use os dele e mantenha estas relações: o `#338449` é o verde mais vivo da tela, e o fundo fica escuro e pouco saturado para ele se destacar (contraste ≥ 3:1).

## Checklist

- [ ] Com 0% de carga nova (`f = s`), a bateria mostra só azul e trilho, sem nenhuma emenda da imagem aparecendo.
- [ ] Com `s = 5%` e `f = 68%`: fatia azul, caminho neon do fraco ao forte terminando na ponta, "carregando" até o limite, tracejado e rótulo.
- [ ] Limite 100%: sem faixa escurecida no fim, rótulo inteiro dentro do carro.
- [ ] `f` chegando ao limite: some o "carregando", a ponta para de pulsar e aparece "Desconectar e ver recibo".
- [ ] Barra 3D e Blocos nos dois carros, alinhados à face da bateria em 360, 375, 390 e 430 pt.
- [ ] Nenhum retângulo preto em volta das ilustrações (soma de luz ativa).
- [ ] Rótulo "80%" em cima legível sobre a lataria (halo fora da soma).
- [ ] Anéis do chão e contornos sem serrilhado na densidade real do aparelho (arquivo certo por densidade).
- [ ] Tela 1: plugue-fantasma em loop, conexão em 1 s, troca para *plugado* sem salto, os dois textos de status.
- [ ] Minimal SUV usa o carregador verde (`minisuv`); Minimal raio-x usa o azulado (`mini`).
- [ ] Nenhum texto vaza na horizontal em 360 pt com os valores do pior caso.
