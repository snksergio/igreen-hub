# Builder — Recarga EV

**O que é.** As duas telas de recarga em eletroposto do iGreen Mob (conectar o cabo e acompanhar a recarga), com a cena do carro e da bateria feita a partir de renders e de geometria em JSON. A versão final usa dois carros, o **Minimal SUV** (`m25`) e o **Minimal raio-x** (`m27`), com a bateria desenhada por código em Barra 3D ou Blocos, e foi entregue como pacote para o dev em `../entrega/`.

**Origem.** Migrado em 2026-11-06 de duas pastas locais que nunca foram commitadas nem publicadas. Daqui em diante a fonte é esta pasta; as originais ficam intocadas, só como registro.

| Pasta de origem | Datas | O que veio dela |
|---|---|---|
| `Área de Trabalho/mob app` (sem git) | 26 a 28/09/2026 | O pacote final (`../entrega/`), a apresentação, os fluxos, os moldes em verde, os scripts `processar-hd`, `processar-u29` e `processar-verde` e, da raiz, o estudo inicial (`../estudo/`) |
| `.claude/worktrees/ev-charging-station-screens-3a9143` no projeto `Área de Trabalho/Mob` (branch `claude/ev-charging-station-screens-3a9143` do [igreen-mob-link](https://github.com/snksergio/igreen-mob-link)) | 26 a 28/09/2026 | A primeira versão: o protótipo com a análise de mercado, os 8 moldes e a referência `../handoff/recarga-ev/` |

## Estado atual

- **A versão final é o pacote `../entrega/`**: `mockup.html` é a referência de visual e comportamento, e `IMPLEMENTACAO.md` é a especificação para implementar no app, escrita para o Claude do dev ler antes de escrever código. Foi feito em 28/09 à noite, a pedido do usuário, para passar a um amigo dev ("para que ele possa simplesmente pegar com o Claude dele e adaptar nas telas do aplicativo atual").
- `../prototipos/recarga-ev-apresentacao.html` é a apresentação de onde o pacote saiu; o pacote é a mesma tela, com os arquivos separados.
- `../estudo/` é o primeiro estudo das duas telas (26/09), antes das ilustrações dos carros. As notas da análise das 25 referências estão em [`estudo/ESTUDO.md`](estudo/ESTUDO.md) e os prompts em [`estudo/PROMPTS.md`](estudo/PROMPTS.md). Fica só como registro, na aba de versões.
- `../handoff/recarga-ev/` é o pacote anterior, pedido na pasta de trabalho do Mob e **interrompido pelo usuário no meio** (28/09, 18:50). Ainda traz os 8 moldes. Fica só como registro, na aba de versões.
- O que não sei pelos arquivos: se o pacote já foi entregue ao dev e se o app já implementou as telas. Pergunte ao usuário antes de continuar.

## Decisões tomadas

Pelas conversas de 27 e 28/09 e pelos próprios arquivos:

- **Dois carros, não um:** "O melhor acho que ficou foi o minimal SUV e o minimal raio-x… Eu quero prosseguir com esses dois" (28/09). O SUV vidro e o carro fantasma foram descartados.
- **Tela verde:** fundo verde escurecido a partir de `#338449`, com os botões em `#338449` e mais contraste entre fundo e botões.
- **Ilustração somada ao fundo em modo "screen":** os renders trazem um fundo escuro embutido, que os scripts trocam por preto puro; a página mistura a imagem com o verde e só a luz do carro aparece.
- **Bateria por código:** a imagem do carro vem com a bateria apagada, e a carga (já carregado, até onde vai e o trecho enchendo) é desenhada por cima, com a geometria de `../entrega/assets/geometria.json`.
- **3 larguras por imagem (480, 960 e 1440 px), e @2x/@3x no PNG:** reduzir forte em tempo real serrilhava os anéis do chão e os contornos finos.
- **React Native** (`IMPLEMENTACAO.md`): `@shopify/react-native-skia`, com a ilustração num `Group` com `blendMode="screen"`, ou `mixBlendMode: 'screen'` no RN 0.77+ com a nova arquitetura.

## Pendências e perguntas em aberto

- Confirmar com o usuário se o pacote foi entregue e qual é o próximo passo.
- Em 2026-11-06 o usuário lembrou de ter pedido "um modelo único, um carro só" e o HTML adaptado para React Native. Nas duas conversas encontradas, a decisão registrada é dos **dois** carros; o pedido de um carro só não apareceu. Se existir uma versão com um carro só, ela está em outro lugar.

## Como gerar o resultado

Não há build: as páginas são o próprio arquivo de trabalho. Edite-as direto e publique.

As ilustrações são geradas pelos scripts de `prototipos/ilustracoes/`, com Node e `sharp` (`npm i sharp` na pasta):

```sh
cd builder/prototipos/ilustracoes
node processar-hd.mjs            # pacote final: os dois minimalistas e os carregadores, em 3 larguras (saída em ./hd)
node processar-verde.mjs         # cópias para a tela verde (saída em ./verde); ou: node processar-verde.mjs carregador-minisuv
node processar-carregador.mjs    # cena de conectar (solto/plugado); ou: node processar-carregador.mjs minisuv
node processar-u29.mjs           # base vazia do SUV 3/4 (ref/u29.webp)
node processar-ia.mjs            # os 8 moldes da primeira versão
node analisar.mjs                # acha o quadrilátero do pack num render
node desenhar-quad.mjs           # desenha o quadrilátero para conferência
```

Os scripts leem os renders brutos em `ia/*.png`, que **ficaram de fora** (veja abaixo), e as referências em `ref/`. Depois de gerar:

- a saída de `processar-hd.mjs` vai para `../../prototipos/ilustracoes/hd/` e para o pacote, em `../../entrega/assets/web/` (webp) e `../../entrega/assets/png/` (png @2x/@3x);
- a de `processar-verde.mjs`, para `../../prototipos/ilustracoes/verde/`;
- os demais `.webp`, para `../../prototipos/ilustracoes/`.

O pacote tem uma cópia própria do script em `../entrega/fontes/processar-hd.mjs`, para o dev rodar dentro do pacote. Ela faz o mesmo; só muda o comentário do topo e, sem o `sharp` instalado, ela para com um aviso em vez de procurá-lo no projeto Mob.

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com `mob/recarga-ev`, edite, refaça os prints se a tela mudou, atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/recarga-ev: <o que mudou>`. Para os prints, sirva o clone por HTTP e passe endereços `http://` ao `capturar-telas.mjs`: a referência antiga carrega JSON e módulos, e por `file://` sai em branco. O print `_vitrine/01.webp` mostra o mockup com o Minimal raio-x e os Blocos selecionados; o script não clica, então ele foi tirado à parte.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../entrega/mockup.html`](../entrega/mockup.html) | **O mockup final**, com o painel "Simular" (carro, bateria, carga, limite, celular) |
| [`../entrega/IMPLEMENTACAO.md`](../entrega/IMPLEMENTACAO.md) | A especificação para implementar no app, inclusive em React Native |
| [`../entrega/README.md`](../entrega/README.md) | Como abrir o mockup e como pedir ao Claude |
| [`../entrega/assets/`](../entrega/assets/) | `web/` (webp 480/960/1440), `png/` (@2x/@3x) e `geometria.json` |
| [`../entrega/previews/`](../entrega/previews/) e [`../entrega/referencias/`](../entrega/referencias/) | Capturas do mockup e as referências da barra de bateria |
| [`../prototipos/recarga-ev-apresentacao.html`](../prototipos/recarga-ev-apresentacao.html) | A apresentação de onde saiu o pacote (usa `ilustracoes/hd/`) |
| [`../prototipos/recarga-ev-fluxo.html`](../prototipos/recarga-ev-fluxo.html) | Fluxo em fundo verde com os dois moldes escolhidos |
| [`../prototipos/recarga-ev-fluxo-5-moldes.html`](../prototipos/recarga-ev-fluxo-5-moldes.html) | O mesmo fluxo com 5 moldes |
| [`../prototipos/recarga-ev-moldes-verde.html`](../prototipos/recarga-ev-moldes-verde.html) | Os 8 moldes no fundo verde e no branco (usa `ilustracoes/verde/`) |
| [`../prototipos/recarga-ev-moldes.html`](../prototipos/recarga-ev-moldes.html) | Os 8 moldes no fundo escuro (primeira versão) |
| [`../prototipos/recarga-ev.html`](../prototipos/recarga-ev.html) | O protótipo com telas, análise de mercado e primeira proposta |
| [`../handoff/recarga-ev/index.html`](../handoff/recarga-ev/index.html) | A referência com 8 moldes, do pacote interrompido |
| [`../estudo/index.html`](../estudo/index.html) | O estudo inicial das duas telas (26/09) |
| [`estudo/`](estudo/) | As notas do estudo inicial (`ESTUDO.md`, `PROMPTS.md`), as capturas e os prompts das imagens |
| [`prototipos/ilustracoes/processar-hd.mjs`](prototipos/ilustracoes/processar-hd.mjs) | Gera as imagens do pacote final em 3 larguras |
| [`prototipos/ilustracoes/processar-verde.mjs`](prototipos/ilustracoes/processar-verde.mjs) | Gera as cópias para a tela verde |
| [`prototipos/ilustracoes/processar-carregador.mjs`](prototipos/ilustracoes/processar-carregador.mjs) | Gera a cena de conectar (solto/plugado), com o carregador do Minimal SUV |
| [`prototipos/ilustracoes/processar-u29.mjs`](prototipos/ilustracoes/processar-u29.mjs) | Base vazia do SUV 3/4 |
| [`prototipos/ilustracoes/processar-ia.mjs`](prototipos/ilustracoes/processar-ia.mjs) | Gera os assets de cada um dos 8 moldes e a geometria |
| [`prototipos/ilustracoes/analisar.mjs`](prototipos/ilustracoes/analisar.mjs) | Detecta a face de cima do pack num render |
| [`prototipos/ilustracoes/desenhar-quad.mjs`](prototipos/ilustracoes/desenhar-quad.mjs) | Desenha o quadrilátero detectado, para conferir |
| [`prototipos/ilustracoes/carros-ia.json`](prototipos/ilustracoes/carros-ia.json) | Geometria dos moldes |
| [`prototipos/ilustracoes/carregador.json`](prototipos/ilustracoes/carregador.json) | Geometria da cena de conectar |
| [`prototipos/ilustracoes/ref/`](prototipos/ilustracoes/ref/) | Referências (u21 a u29, as versões em alta `u25-hd.jpg` e `u27-hd.jpg`, e a barra de referência) |

## O que ficou de fora

- Os renders brutos gerados por IA: `prototipos/ilustracoes/ia/*.png` (cerca de 70 MB em `mob app`, e uma parte deles, 55 MB, na pasta de trabalho do Mob) e `entrega/recarga-ev-handoff/fontes/ia/*.png` (4 arquivos, 18 MB). São a fonte pesada dos scripts e continuam nas pastas locais de origem.
- `mob app/prototipos/ilustracoes/hd/png/`: idêntica a `../entrega/assets/png/`, que está aqui.
- `mob app/entrega/recarga-ev-handoff.zip`: o mesmo pacote compactado (31 MB, com os renders da IA).
- `mob app/output/` (cerca de 197 MB): imagens geradas nas explorações, e também os cartões iGreen, que são outro assunto.
- Do estudo inicial, as imagens geradas por IA em `mob app/assets/` (`car-study-v3` a `v7`, `car-ghost*.png`, `connect.png`, `proposta-verde-*.png`, cerca de 18 MB), fonte pesada. A página usa só `car-ghost-v2.webp` e `connect.webp`, que estão em `../estudo/assets/`.
- O resto da pasta de trabalho do Mob é o app de cadastro do igreen-mob-link num commit antigo (`77a2a52`), já migrado em `mob/cadastro-investidor`, `mob/simulador-investidor`, `mob/proposta-investidor` e `mob/oferta-live`. Também ficaram de fora as configurações locais de ferramentas (`.claude/`, `.impeccable/`, `.playwright-mcp/`).

## Visto no original

- A referência antiga (`../handoff/recarga-ev/`) cita `IMPLEMENTACAO.md` e `referencia/`, que nunca foram escritos naquela pasta: o pacote foi interrompido. O `IMPLEMENTACAO.md` que vale é o de `../entrega/`.
- `processar-hd`, `processar-verde`, `processar-carregador` e `processar-u29` procuram o `sharp` primeiro na própria pasta e, se não acharem, no `package.json` do projeto Mob local (`SHARP_FROM`).
