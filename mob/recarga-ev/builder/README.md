# Builder — Recarga EV

**O que é.** As duas telas de recarga em eletroposto do iGreen Mob (conectar o cabo e acompanhar a recarga), com a cena do carro e da bateria feita a partir de renders e de geometria em JSON. Há três páginas: a referência das telas (handoff), o protótipo com a análise de mercado e a primeira proposta, e a página dos moldes de carro.

**Origem:** Migrado em 2026-11-06 da pasta local de trabalho `.claude/worktrees/ev-charging-station-screens-3a9143` do projeto `Área de Trabalho/Mob` (branch `claude/ev-charging-station-screens-3a9143` do [igreen-mob-link](https://github.com/snksergio/igreen-mob-link)). Os arquivos, de 26 a 28/09/2026, nunca foram commitados nem publicados. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

## Estado atual

- As três páginas funcionam como estão: a referência (`../handoff/recarga-ev/`), o protótipo (`../prototipos/recarga-ev.html`) e os moldes (`../prototipos/recarga-ev-moldes.html`).
- O que mais não sei pelos arquivos: se a referência já foi entregue ao desenvolvimento, qual molde foi o escolhido e se o trabalho parou de propósito em 28/09. Pergunte ao usuário antes de continuar.

## Decisões tomadas

O que dá para ler nos próprios arquivos:

- Cena das duas telas com a **mesma arte**: na tela 1 a bateria fica apagada e a porta de recarga pisca; na tela 2 a bateria enche (texto do protótipo).
- Moldes de carro de dois tipos (comentário de `processar-ia.mjs`): **foto** (render com o pack 100% verde; sai o par cheio/vazio alinhado pixel a pixel) e **mini** (só a base com os blocos apagados; os blocos coloridos são desenhados por código).
- Cena de conectar com o par **solto/plugado** do mesmo enquadramento (a versão plugada é uma edição da solta), recortado com borda transparente e posições em JSON (`processar-carregador.mjs`).

## Pendências e perguntas em aberto

- A referência cita `IMPLEMENTACAO.md` (especificação completa) e uma pasta `referencia/` (prints de cada estado), que não existem na pasta original. Talvez nunca tenham sido escritos.
- Confirmar com o usuário o que falta e qual é o próximo passo.

## Como gerar o resultado

Não há build: as páginas da pasta acima são o próprio arquivo de trabalho. Edite-as direto e publique.

As ilustrações são geradas pelos scripts desta pasta, com Node e `sharp` (`npm i sharp` na pasta dos scripts):

```sh
cd builder/prototipos/ilustracoes
node processar-ia.mjs            # todos os moldes; ou: node processar-ia.mjs s21 m25
node processar-carregador.mjs    # cena de conectar (solto/plugado)
node analisar.mjs                # acha o quadrilátero do pack num render
node desenhar-quad.mjs           # desenha o quadrilátero para conferência
```

Os scripts leem os renders brutos em `ia/*.png`, que **ficaram de fora** (veja abaixo), e gravam os `.webp` e os JSON na própria pasta. Depois de gerar, copie os `.webp` para `../../prototipos/ilustracoes/`. Os assets da referência (`../handoff/recarga-ev/assets/`) são os mesmos desenhos com outros nomes; não achei script que os gere, então foram montados à mão (não sei o passo a passo).

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com `mob/recarga-ev`, edite, refaça os prints se a tela mudou, atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/recarga-ev: <o que mudou>`. Para tirar os prints, sirva o clone por HTTP e passe endereços `http://` ao `capturar-telas.mjs`: a referência carrega JSON e módulos, e por `file://` sai em branco.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../handoff/recarga-ev/index.html`](../handoff/recarga-ev/index.html) | A referência das duas telas |
| [`../handoff/recarga-ev/js/`](../handoff/recarga-ev/js/) | `app.js`, `cena-conectar.js`, `cena-recarga.js`, `geometria.js`, `sessao.js` |
| [`../handoff/recarga-ev/assets/`](../handoff/recarga-ev/assets/) | Moldes e cena de conectar (webp + `moldes.json`, `cenas.json`) |
| [`../prototipos/recarga-ev.html`](../prototipos/recarga-ev.html) | O protótipo com telas, análise de mercado e primeira proposta |
| [`../prototipos/recarga-ev-moldes.html`](../prototipos/recarga-ev-moldes.html) | Os moldes de carro |
| [`../prototipos/ilustracoes/`](../prototipos/ilustracoes/) | As ilustrações finais (webp) usadas pelos protótipos |
| [`prototipos/ilustracoes/processar-ia.mjs`](prototipos/ilustracoes/processar-ia.mjs) | Gera os assets de cada molde e a geometria |
| [`prototipos/ilustracoes/processar-carregador.mjs`](prototipos/ilustracoes/processar-carregador.mjs) | Gera a cena de conectar (solto/plugado) |
| [`prototipos/ilustracoes/analisar.mjs`](prototipos/ilustracoes/analisar.mjs) | Detecta a face de cima do pack num render |
| [`prototipos/ilustracoes/desenhar-quad.mjs`](prototipos/ilustracoes/desenhar-quad.mjs) | Desenha o quadrilátero detectado, para conferir |
| [`prototipos/ilustracoes/carros-ia.json`](prototipos/ilustracoes/carros-ia.json) | Geometria dos moldes |
| [`prototipos/ilustracoes/carregador.json`](prototipos/ilustracoes/carregador.json) | Geometria da cena de conectar |
| [`prototipos/ilustracoes/ref/`](prototipos/ilustracoes/ref/) | Imagens de referência (u21 a u27) |

## O que ficou de fora

- `prototipos/ilustracoes/ia/*.png`: os 11 renders brutos gerados por IA (cerca de 5 MB cada, 55 MB no total), fonte pesada. Continuam na pasta local de origem.
- O resto daquela pasta local é o app de cadastro do igreen-mob-link num commit antigo (`77a2a52`), já migrado em `mob/cadastro-investidor`, `mob/simulador-investidor`, `mob/proposta-investidor` e `mob/oferta-live`. Também ficaram de fora as configurações locais de ferramentas (`.claude/`, `.impeccable/`, `.playwright-mcp/`).

## Visto no original

- A referência cita `IMPLEMENTACAO.md` e `referencia/`, que não estão na pasta.
- A referência mostra um aviso de que precisa de servidor local; no hub ela é servida por HTTP e abre direto.
