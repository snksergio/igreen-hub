# Builder: variações da fatura

O construtor do output. Guarda o estudo completo, os assets de origem e as versões anteriores. Não aparece na vitrine do hub: o link que vai para as pessoas é o output, um nível acima (`../index.html`).

## O que tem aqui

| Arquivo | O que é |
|---|---|
| `index.html` | O estudo completo: Invoice Web, os 7 tipos de cobrança com o quadro de regras e pendências, a matriz por tipo, o benchmark e as anotações ("O que saiu", "Origem dos dados") |
| `gerar-output.mjs` | Gera o output a partir deste `index.html` |
| `assets/` | Os ícones e imagens de origem. No HTML eles vão embutidos, então o output não depende desta pasta |
| `historico/` | As versões anteriores, para consulta |

### Histórico

| Arquivo | Versão |
|---|---|
| `2026-11-03-v1-aprovada-com-v2-v3.html` | Fatura PDF V1 aprovada com os ajustes do Calebe, ainda ao lado das V2 e V3 |
| `2026-10-21-v2-menu-lateral.html` | Menu lateral com Invoice Web e as Faturas PDF V1, V2 e V3 |
| `2026-10-21-v1-abas-no-topo.html` | Abas no topo, com a Fatura PDF V4 |

## Como atualizar

1. Edite `index.html` (o estudo).
2. Gere o output:
   ```bash
   node gerar-output.mjs
   ```
   O script troca o `MODO` para `output` e tira tudo o que está entre os marcadores `estudo:inicio` e `estudo:fim` (pesquisa, matriz, regras e anotações).
3. Siga o pipeline do `ORQUESTRADOR.md` da raiz do hub: refaça os prints se a tela mudou, valide e publique.

Tudo o que for só de estudo deve ficar entre os marcadores, ou atrás de `MODO === 'estudo'` no JS, para não vazar no output.

## Links diretos

Tanto o estudo quanto o output abrem uma tela pelo endereço: `#web-desktop`, `#web-mobile`, `#UNIQUE_DEFAULT_DISCOUNT`, `#UNIQUE_WITH_ADDITIONAL_DISCOUNT`, `#UNIQUE_WITH_NO_INJECTION`, `#COMMON_DEFAULT_DISCOUNT`, `#COMMON_WITH_ADDITIONAL_DISCOUNT`, `#DEBT_INSTALLMENT_PLAN`, `#DISTRIBUTOR`. Só no estudo: `#matriz` e `#bench`.
