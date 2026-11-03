# Builder: variações da fatura

O construtor do output e o backup do estudo. Não aparece na vitrine do hub. O link que vai para as pessoas é o output, um nível acima: https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/

As regras de builder e output estão no `ORQUESTRADOR.md` da raiz do hub, seção 2, "Builder e output".

## Onde está cada coisa

Boa parte do estudo mora dentro do `index.html` deste builder, numa tela própria. Por isso, navegando pelo GitHub, ela não aparece como arquivo. A tabela abaixo leva direto a cada uma.

| O que | Onde | Abrir |
|---|---|---|
| Estudo completo | [`index.html`](index.html) | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/) |
| Benchmark (pesquisa de mercado, 13 players e 55 fontes) | [`index.html`](index.html), tela Benchmark | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/#bench) |
| Matriz por tipo de cobrança (blocos × tipos, regras gerais e origem de cada regra) | [`index.html`](index.html), tela Matriz por tipo | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/#matriz) |
| Regras e pendências de cada tipo (quadro abaixo de cada folha) | [`index.html`](index.html), telas 3 a 9 | [Boleto Único padrão](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/#UNIQUE_DEFAULT_DISCOUNT) |
| Anotações "O que saiu" e "Origem dos dados" | [`index.html`](index.html), botões em "Mostrar" | [Invoice Web](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/#web-desktop) |
| Gerador do output | [`gerar-output.mjs`](gerar-output.mjs) | |
| Ícones e imagens de origem | [`assets/`](assets/) | |
| Versões anteriores | [`historico/`](historico/) | tabela abaixo |

### Histórico

| Arquivo | Versão | Abrir |
|---|---|---|
| [`2026-11-03-v1-aprovada-com-v2-v3.html`](historico/2026-11-03-v1-aprovada-com-v2-v3.html) | Fatura PDF V1 aprovada com os ajustes do Calebe, ainda ao lado das V2 e V3 | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/historico/2026-11-03-v1-aprovada-com-v2-v3.html) |
| [`2026-10-21-v2-menu-lateral.html`](historico/2026-10-21-v2-menu-lateral.html) | Menu lateral com Invoice Web e as Faturas PDF V1, V2 e V3 | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/historico/2026-10-21-v2-menu-lateral.html) |
| [`2026-10-21-v1-abas-no-topo.html`](historico/2026-10-21-v1-abas-no-topo.html) | Abas no topo, com a Fatura PDF V4 | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/historico/2026-10-21-v1-abas-no-topo.html) |

## Estudo × output

| | Estudo (`builder/index.html`) | Output (`../index.html`) |
|---|---|---|
| Invoice Web, desktop e mobile | Sim | Sim |
| Fatura PDF nos 7 tipos de cobrança | Sim | Sim |
| Quadro de regras e pendências abaixo de cada folha | Sim | Não |
| Matriz por tipo | Sim | Não |
| Benchmark | Sim | Não |
| Botões "O que saiu" e "Origem dos dados" | Sim | Não |

## Como atualizar

1. Edite `index.html` (o estudo).
2. Gere o output:
   ```bash
   node gerar-output.mjs
   ```
   O script troca o `MODO` para `output` e tira tudo o que está entre os marcadores `estudo:inicio` e `estudo:fim` (pesquisa, matriz, regras e anotações). Nunca edite o output à mão.
3. Siga o pipeline do `ORQUESTRADOR.md`: refaça os prints se a tela mudou, valide e publique.

Tudo o que for só de estudo deve ficar entre os marcadores, ou atrás de `MODO === 'estudo'` no JS, para não vazar no output.

## Links diretos

Tanto o estudo quanto o output abrem uma tela pelo endereço: `#web-desktop`, `#web-mobile`, `#UNIQUE_DEFAULT_DISCOUNT`, `#UNIQUE_WITH_ADDITIONAL_DISCOUNT`, `#UNIQUE_WITH_NO_INJECTION`, `#COMMON_DEFAULT_DISCOUNT`, `#COMMON_WITH_ADDITIONAL_DISCOUNT`, `#DEBT_INSTALLMENT_PLAN`, `#DISTRIBUTOR`. Só no estudo: `#matriz` e `#bench`.
