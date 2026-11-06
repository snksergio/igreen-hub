# Recarga EV

As duas telas de recarga em eletroposto do iGreen Mob: **conectar o cabo** (com o tempo para conectar e o conector liberado) e **acompanhar a recarga** (porcentagem, potência, energia, custo até agora e encerrar). A cena do carro mostra a bateria apagada na primeira tela e enchendo na segunda. O protótipo traz também a análise de mercado e a primeira proposta; a página de moldes compara os carros que servem de base para a cena.

Migrado em 2026-11-06 da pasta local de trabalho `.claude/worktrees/ev-charging-station-screens-3a9143` do projeto `Área de Trabalho/Mob` (branch `claude/ev-charging-station-screens-3a9143` do [igreen-mob-link](https://github.com/snksergio/igreen-mob-link)). Os arquivos, de 26 a 28/09/2026, nunca foram commitados nem publicados. Migrado no modo completo: daqui em diante a fonte é esta pasta (veja o [README do builder](builder/README.md)).

| Página | Endereço no hub |
|---|---|
| Referência das duas telas | https://snksergio.github.io/igreen-hub/mob/recarga-ev/handoff/recarga-ev/ |
| Telas e análise | https://snksergio.github.io/igreen-hub/mob/recarga-ev/prototipos/recarga-ev.html |
| Moldes de carro | https://snksergio.github.io/igreen-hub/mob/recarga-ev/prototipos/recarga-ev-moldes.html |

## Estrutura

- `handoff/recarga-ev/` — a referência visual e de comportamento das duas telas (HTML, CSS e módulos JS; carrega `assets/moldes/moldes.json` e `assets/conectar/cenas.json`, por isso precisa de servidor: no hub, abre direto).
- `prototipos/recarga-ev.html` — o protótipo com as telas, a análise de mercado e a primeira proposta.
- `prototipos/recarga-ev-moldes.html` — os moldes de carro (vazio e cheio) para escolher e ver nas duas telas; leva para `recarga-ev.html`.
- `prototipos/ilustracoes/` — as ilustrações finais em webp usadas pelos protótipos.
- `index.html` — só leva para a referência (o original não tinha entrada na raiz).
- `builder/` — os scripts, a geometria e as referências das ilustrações. Não aparece na vitrine.
