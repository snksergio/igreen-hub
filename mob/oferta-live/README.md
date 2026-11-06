# Oferta da live

A tela única da live (`#cadastro-simplificado`): escolher o eletroposto nos cards do simulador (com o valor), ver especificações e formas de pagamento se quiser, informar os dados, aceitar o contrato e pagar a entrada de R$ 9.997 no cartão ou no Pix. O pagamento é simulado.

Migrado de [snksergio/igreen-mob-link](https://github.com/snksergio/igreen-mob-link) (commit `5af67d1`) em 2026-11-06, no modo completo: o código-fonte está em [`builder/`](builder/) e daqui em diante a fonte é esta pasta. O original fica intocado, só como registro.

| Página | Endereço no hub |
|---|---|
| Abrir | https://snksergio.github.io/igreen-hub/mob/oferta-live/?responsavel=Juliana%20Martins#cadastro-simplificado |

## Estrutura

- `index.html`, `assets/`, `favicon.png` — o app pronto (build do Vite com caminho relativo). É um app React só, com rotas por hash; esta ficha mostra a oferta da live (`#cadastro-simplificado`).
- `builder/` — o código-fonte, os testes, os scripts e a documentação, na organização do original, mais o gerador do resultado ([README do builder](builder/README.md)). Não aparece na vitrine.

O mesmo app está também em `mob/cadastro-investidor`, `mob/simulador-investidor`, `mob/proposta-investidor`, cada pasta com a sua cópia.
