# Proposta do investidor

A página que o investidor recebe depois que a proposta é gerada, com dados de exemplo e um seletor de cenários no topo (`?cenario=`). A versão atual é `#proposta-v3/9E89C902`; o primeiro modelo, `#proposta-v2/9E89C902`, ficou para comparação.

Migrado de [snksergio/igreen-mob-link](https://github.com/snksergio/igreen-mob-link) (commit `5af67d1`) em 2026-11-06, no modo completo: o código-fonte está em [`builder/`](builder/) e daqui em diante a fonte é esta pasta. O original fica intocado, só como registro.

| Página | Endereço no hub |
|---|---|
| Proposta enviada | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=nova |
| Entrada em aberto | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=pagamento |
| Distribuir carregadores | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=distribuir |
| Vistoria com aditivo | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=vistoria |
| Entrega para aceite | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=entrega |
| v2 · todos os cenários: Contrato para assinar | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=contrato |
| v2 · todos os cenários: 10 carregadores para distribuir | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=muitos |
| v2 · todos os cenários: Pontos enviados | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=pontos |
| v2 · todos os cenários: Instalação, parcela vencida | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=instalacao |
| v2 · todos os cenários: Proposta recusada | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v3/9E89C902?cenario=recusada |
| v1 · modelo com trilho: Proposta enviada | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v2/9E89C902?cenario=nova |
| v1 · modelo com trilho: Contrato para assinar | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v2/9E89C902?cenario=contrato |
| v1 · modelo com trilho: Entrada em aberto | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v2/9E89C902?cenario=pagamento |
| v1 · modelo com trilho: Vistoria com aditivo | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v2/9E89C902?cenario=vistoria |
| v1 · modelo com trilho: Instalação, parcela vencida | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v2/9E89C902?cenario=instalacao |
| v1 · modelo com trilho: Entrega para aceite | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v2/9E89C902?cenario=entrega |
| v1 · modelo com trilho: Proposta recusada | https://snksergio.github.io/igreen-hub/mob/proposta-investidor/#proposta-v2/9E89C902?cenario=recusada |

## Estrutura

- `index.html`, `assets/`, `favicon.png` — o app pronto (build do Vite com caminho relativo). É um app React só, com rotas por hash; esta ficha mostra a página da proposta gerada (`#proposta-v3`, atual, e `#proposta-v2`, o primeiro modelo).
- `builder/` — o código-fonte, os testes, os scripts e a documentação, na organização do original, mais o gerador do resultado ([README do builder](builder/README.md)). Não aparece na vitrine.

A oferta da live (`#cadastro-simplificado`), o link que a licenciada manda durante a live para escolher o eletroposto e pagar a entrada numa tela só, também abre daqui: https://snksergio.github.io/igreen-hub/mob/proposta-investidor/?responsavel=Juliana%20Martins#cadastro-simplificado

O mesmo app está também em `mob/simulador-investidor` (o simulador e o cadastro original), com a sua cópia. Até 2026-11-06 a oferta da live tinha um card próprio, `mob/oferta-live`, com uma cópia idêntica do app; ele foi juntado aqui.
