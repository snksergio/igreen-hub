# Simulador do investidor

O simulador de investimento em eletroposto guiado pelo DRE (o "fluxo Gerador"). A v2, em `#investir`, é um formulário linear; a v1, em `#gerador`, tem as premissas em abas, com retorno e ROI. As duas seguem para dados, eletroposto, resumo e proposta.

Migrado de [snksergio/igreen-mob-link](https://github.com/snksergio/igreen-mob-link) (commit `5af67d1`) em 2026-11-06, no modo completo: o código-fonte está em [`builder/`](builder/) e daqui em diante a fonte é esta pasta. O original fica intocado, só como registro.

| Página | Endereço no hub |
|---|---|
| Início | https://snksergio.github.io/igreen-hub/mob/simulador-investidor/#investir |
| Simulador | https://snksergio.github.io/igreen-hub/mob/simulador-investidor/#investir/simulador |
| Dados do investidor | https://snksergio.github.io/igreen-hub/mob/simulador-investidor/#investir/dados |
| v1 · premissas em abas: Início | https://snksergio.github.io/igreen-hub/mob/simulador-investidor/#gerador |
| v1 · premissas em abas: Simulador | https://snksergio.github.io/igreen-hub/mob/simulador-investidor/#gerador/simulador |
| v1 · premissas em abas: Dados do investidor | https://snksergio.github.io/igreen-hub/mob/simulador-investidor/#gerador/dados |

## Estrutura

- `index.html`, `assets/`, `favicon.png` — o app pronto (build do Vite com caminho relativo). É um app React só, com rotas por hash; esta ficha mostra o simulador do investidor (fluxo Gerador, v2 em `#investir` e v1 em `#gerador`).
- `builder/` — o código-fonte, os testes, os scripts e a documentação, na organização do original, mais o gerador do resultado ([README do builder](builder/README.md)). Não aparece na vitrine.

O mesmo app está também em `mob/cadastro-investidor`, `mob/proposta-investidor`, `mob/oferta-live`, cada pasta com a sua cópia.
