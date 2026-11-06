# Cadastro de investidor

O fluxo atual de cadastro do investidor Green Mob, na rota raiz do app: início, simulador por CPF, dados do investidor, modelo do eletroposto, endereço (CEP, mapa) e resumo, até a proposta final. Feito em React a partir do Figma e do design system Novo Link Cadastro.

Migrado de [snksergio/igreen-mob-link](https://github.com/snksergio/igreen-mob-link) (commit `5af67d1`) em 2026-11-06, no modo completo: o código-fonte está em [`builder/`](builder/) e daqui em diante a fonte é esta pasta. O original fica intocado, só como registro.

| Página | Endereço no hub |
|---|---|
| Início | https://snksergio.github.io/igreen-hub/mob/cadastro-investidor/ |
| Simulador por CPF | https://snksergio.github.io/igreen-hub/mob/cadastro-investidor/#simulador |
| Dados do investidor | https://snksergio.github.io/igreen-hub/mob/cadastro-investidor/#step1 |
| Modelo do eletroposto | https://snksergio.github.io/igreen-hub/mob/cadastro-investidor/#step2 |
| Endereço do eletroposto | https://snksergio.github.io/igreen-hub/mob/cadastro-investidor/#step3 |
| Resumo | https://snksergio.github.io/igreen-hub/mob/cadastro-investidor/#step4 |

## Estrutura

- `index.html`, `assets/`, `favicon.png` — o app pronto (build do Vite com caminho relativo). É um app React só, com rotas por hash; esta ficha mostra o fluxo atual de cadastro do investidor (a rota raiz do app).
- `builder/` — o código-fonte, os testes, os scripts e a documentação, na organização do original, mais o gerador do resultado ([README do builder](builder/README.md)). Não aparece na vitrine.

O mesmo app está também em `mob/simulador-investidor`, `mob/proposta-investidor`, `mob/oferta-live`, cada pasta com a sua cópia.
