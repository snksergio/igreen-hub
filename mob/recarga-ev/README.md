# Recarga EV

As duas telas de recarga em eletroposto do iGreen Mob: **conectar o cabo** (com o tempo para conectar e o conector liberado) e **acompanhar a recarga** (porcentagem, potência, energia, custo até agora e encerrar).

A versão final tem **dois carros ilustrados, o Minimal SUV e o Minimal raio-x**, e a bateria desenhada por código, em Barra 3D ou Blocos. Ela vem num pacote para o dev implementar no app: o mockup, a especificação `IMPLEMENTACAO.md` (com o caminho para React Native) e as imagens em PNG @2x/@3x, prontas para React Native, iOS e Android.

Migrado em 2026-11-06, no modo completo, de duas pastas locais que nunca foram commitadas nem publicadas:

- **A versão final**, de `Área de Trabalho/mob app` (27 e 28/09/2026): o pacote `entrega/recarga-ev-handoff`, a apresentação, os fluxos e os moldes em fundo verde.
- **A primeira versão**, de `.claude/worktrees/ev-charging-station-screens-3a9143` no projeto `Área de Trabalho/Mob` (26 a 28/09/2026): o protótipo com a análise de mercado, os 8 moldes e uma referência das telas. O pedido do pacote foi interrompido no meio, e o pacote final foi refeito na pasta `mob app`.

Daqui em diante a fonte é esta pasta (veja o [README do builder](builder/README.md)).

| Página | Endereço no hub |
|---|---|
| Mockup final das duas telas | https://snksergio.github.io/igreen-hub/mob/recarga-ev/entrega/mockup.html |
| Apresentação | https://snksergio.github.io/igreen-hub/mob/recarga-ev/prototipos/recarga-ev-apresentacao.html |
| Fluxo com os moldes escolhidos | https://snksergio.github.io/igreen-hub/mob/recarga-ev/prototipos/recarga-ev-fluxo.html |
| Fluxo com 5 moldes | https://snksergio.github.io/igreen-hub/mob/recarga-ev/prototipos/recarga-ev-fluxo-5-moldes.html |
| Moldes no fundo verde e no branco | https://snksergio.github.io/igreen-hub/mob/recarga-ev/prototipos/recarga-ev-moldes-verde.html |
| Moldes de carro (escolher e ver nas duas telas) | https://snksergio.github.io/igreen-hub/mob/recarga-ev/prototipos/recarga-ev-moldes.html |
| Telas e análise de mercado (primeira proposta) | https://snksergio.github.io/igreen-hub/mob/recarga-ev/prototipos/recarga-ev.html |
| Referência com 8 moldes (pacote interrompido) | https://snksergio.github.io/igreen-hub/mob/recarga-ev/handoff/recarga-ev/ |

## Estrutura

- `entrega/` — o pacote final para o dev, como foi entregue: `mockup.html`, `README.md`, `IMPLEMENTACAO.md`, `assets/web` (webp 480/960/1440 px), `assets/png` (@2x/@3x), `assets/geometria.json`, `previews/`, `referencias/` e `fontes/` (o script `processar-hd.mjs` e as referências em alta; os renders da IA ficaram de fora).
- `prototipos/recarga-ev-apresentacao.html` — a apresentação limpa das duas telas, que deu origem ao pacote.
- `prototipos/recarga-ev-fluxo.html` e `recarga-ev-fluxo-5-moldes.html` — os fluxos em fundo verde, com os dois moldes escolhidos e com 5 moldes.
- `prototipos/recarga-ev-moldes-verde.html` — os 8 moldes no fundo verde e no branco.
- `prototipos/recarga-ev-moldes.html` e `recarga-ev.html` — a primeira versão: os 8 moldes no fundo escuro e o protótipo com a análise de mercado.
- `prototipos/ilustracoes/` — as ilustrações usadas pelas páginas (`hd/` para a apresentação, `verde/` para os fluxos e moldes verdes).
- `handoff/recarga-ev/` — a referência com os 8 moldes, do pacote interrompido.
- `index.html` — só leva para o mockup final.
- `builder/` — os scripts, a geometria e as referências das ilustrações. Não aparece na vitrine.
