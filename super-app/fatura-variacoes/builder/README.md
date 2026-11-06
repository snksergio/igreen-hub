# Builder: variações da fatura

## O que é

O protótipo da fatura iGreen: o Invoice Web (desktop e mobile) e a Fatura PDF no layout da V1 aprovada, em uma variante para cada um dos 7 tipos de cobrança que a API devolve. Este builder guarda o estudo completo e gera o output, que é o que a vitrine abre: https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/

## Origem

Migrado da pasta local `C:\Users\sergi\OneDrive\Área de Trabalho\fatura-igreen-variacoes` (sem git) em 2026-11-06, no modo completo. A primeira publicação no hub foi em 2026-11-03. O arquivo de trabalho de lá, `fatura-igreen-variacoes.html` (sha1 `6c1cff76bcb8…`), é o `index.html` deste builder, sem mudança; a pasta `assets/` é a mesma. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

## Estado atual

- **Pronto e aprovado:** a Fatura PDF V1 com os ajustes do Calebe (histórico de economia acumulada, iGreen Club com QR code, Evite fraudes e Informações adicionais, detalhamento no modelo da FIT Energia, valores riscados e regra padrão de 10%) e o Invoice Web sem o porquinho, com "Pix da Energia".
- **Pronto para validar:** as 7 variantes por tipo de cobrança, com os blocos decididos pela matriz por tipo. Alturas padronizadas entre os tipos e todas cabendo no A4.
- **Pela metade:** as regras que dependem de cobrança e N2 (seção Pendências). Cada tela do estudo lista as suas, no quadro abaixo da folha.
- Os dados são fictícios: cliente, valores, tarifa Cemig (1,14903226), taxa de disponibilidade (50 kWh), iluminação pública (R$ 31,86), acordo e linha digitável.

## Decisões tomadas

| Decisão | Por quê |
|---|---|
| A V1 é o modelo dos 7 tipos; V2 e V3 saíram do protótipo | A V1 foi aprovada. V2 e V3 continuam abrindo nas versões v3 e v2 |
| Um modelo e uma matriz única (`TIPOS` e `REGRAS` no JS) | Evita sete layouts soltos. Tipo novo entra como linha nova, e a mesma tabela monta a tela "Matriz por tipo" |
| Padrão com 10%; antecipado com 16% até D-1 e 10% depois | A regra padrão de 10% veio do Calebe. O percentual adicional não foi definido: 16% é exemplo |
| Conta dupla: repasses fora da tabela, só no bloco "Você recebe duas contas" | Está na descrição da task |
| Sem injeção e distribuidora: sem Pix, linha digitável de arrecadação da Cemig | Descrição da task, e a regra de nunca mostrar dois meios de pagamento conflitantes |
| Acordo: boleto e Pix da iGreen; sem histórico, leitura e Club | A parcela não cobra energia do mês. O Pix está a confirmar |
| Grafia "Pix da Energia" e fim da variação Cashback | Pedido do Calebe; é a grafia do manual da marca Pix |
| Histórico no estilo do gráfico do app iGreen Club (linha com área, total na pílula) | Pedido do Calebe; referência nas telas do app na Play Store |
| Detalhamento no modelo da FIT Energia, com preço Cemig e "sem a iGreen" riscados | Pedido do Calebe, com print da FIT |
| Alturas padronizadas: cards do resumo, avisos, Evite fraudes, pagamento e espaçamento | Facilitar a implementação |
| Output gerado pelo builder, com marcadores `estudo:inicio`/`estudo:fim` e `MODO` | Uma fonte só. O output é o link que vai para as pessoas |
| Link direto por tela (`#UNIQUE_DEFAULT_DISCOUNT`, `#web-mobile`...) | Compartilhar um tipo específico e tirar os prints da vitrine |

## Pendências

A confirmar com cobrança e N2:

- **Antecipado:** o percentual do desconto adicional; o que fazer quando D-1 cai em fim de semana ou feriado; se D-1 conta a partir do vencimento da iGreen ou do da distribuidora.
- **Sem injeção:** se a API entrega a linha digitável, o código de barras e o vencimento da distribuidora; se o total é a conta inteira da distribuidora.
- **Conta dupla:** se a API entrega os valores dos repasses para o bloco informativo.
- **Acordo:** os campos na API (número, parcela, saldo, faturas, multa e juros); se a parcela tem Pix; a regra de atraso e de cancelamento do acordo.
- **Distribuidora:** se é o PDF original da distribuidora (aí a tela não se aplica); se o valor é só o repasse.
- **Geral:** mapear cada campo no payload da API; ler a linha digitável e o código de barras com leitor; validar os 7 PDFs com cobrança e N2.
- **Em aberto:** a V1 usa um boleto simplificado. O benchmark recomenda a ficha de compensação no padrão do Banco Central, que existia na antiga Fatura PDF V3 (abre nas versões v2 e v3 desta ficha).

## Como gerar o resultado e publicar

1. Edite o estudo, `builder/index.html`.
2. Gere o output:
   ```bash
   cd builder
   node gerar-output.mjs
   ```
   O script troca o `MODO` para `output` e tira o que está entre `estudo:inicio` e `estudo:fim`. Nunca edite o `../index.html` à mão. O que for só de estudo fica entre os marcadores ou atrás de `MODO === 'estudo'` no JS.
3. Siga o `ORQUESTRADOR.md`, seção 5, "Alterar": prints (`node scripts/capturar-telas.mjs super-app/fatura-variacoes ...` e `--grupo=tipos` / `--grupo=invoice` para o acervo), `node scripts/gerar-catalogo.mjs --checar` e push.

## Onde está cada coisa

| O que | Arquivo | Abrir |
|---|---|---|
| Output (o link para as pessoas) | [`../index.html`](../index.html) | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/) |
| Estudo completo | [`index.html`](index.html) | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/) |
| Benchmark (13 players, 55 fontes, 21/10) | [`index.html`](index.html), tela Benchmark | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/#bench) |
| Matriz por tipo de cobrança | [`index.html`](index.html), tela Matriz | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/#matriz) |
| Regras e pendências de cada tipo | [`index.html`](index.html), telas 3 a 9 | [Boleto Único padrão](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/#UNIQUE_DEFAULT_DISCOUNT) |
| Anotações "O que saiu" e "Origem dos dados" | [`index.html`](index.html), botões em "Mostrar" | [Invoice Web](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/builder/#web-desktop) |
| Gerador do output | [`gerar-output.mjs`](gerar-output.mjs) | |
| Ícones e imagens de origem | [`assets/`](assets/) | |
| Ficha da vitrine (páginas, acervo, versões) | [`../projeto.json`](../projeto.json) | [na vitrine](https://snksergio.github.io/igreen-hub/#super-app/fatura-variacoes) |

### Versões

Ficam na raiz do projeto, para abrir pela vitrine (aba de versões da ficha).

| Versão | Arquivo | Data | Abrir |
|---|---|---|---|
| v4 · 7 tipos de cobrança | [`../index.html`](../index.html) | 2026-11-03 | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/) |
| v3 · Fatura PDF V1 aprovada, com as V2 e V3 | [`../v3-pdf-v1-aprovada.html`](../v3-pdf-v1-aprovada.html) | 2026-10-22 | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/v3-pdf-v1-aprovada.html) |
| v2 · menu lateral, web e mobile | [`../v2-menu-lateral.html`](../v2-menu-lateral.html) | 2026-10-21 | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/v2-menu-lateral.html) |
| v1 · abas no topo, com a Fatura PDF V4 | [`../v1-abas-no-topo.html`](../v1-abas-no-topo.html) | 2026-10-21 | [abrir](https://snksergio.github.io/igreen-hub/super-app/fatura-variacoes/v1-abas-no-topo.html) |

A v1 carrega as imagens de `builder/assets/`; as outras têm tudo embutido. As versões antigas não têm link direto por tela: abrem na primeira tela e navegam pelo menu delas.

## O que ficou de fora

- Nada deste projeto. O original tem só o HTML de trabalho e a pasta `assets/`, os dois aqui.
- `fatura-igreen-variacoes.zip`, na Área de Trabalho do Sergio: a cópia de 22/10, idêntica à `v3-pdf-v1-aprovada.html`.
- Na mesma Área de Trabalho, arquivos de outro projeto, o Faturas de energia (fonte: `snksergio/pagar-fatura-igreen`, ficha `super-app/faturas-energia`): `faturas-energia-fluxo-v2.html`, `faturas-energia-fluxo-padrao-app.html`, os prints `fatura1/2/3.png` e "Retorno iGreen · hub antes de pagar a fatura de outubro". E o `faturas-pix-desconto.html` ("PIX da Energia e Desconto"), que não está em nenhum repositório. Migram pelo projeto deles.

## Visto no original

Nada quebrado. Ficaram como estão:

- a variável CSS `--track`, sem uso;
- os ícones de Cashback e o porquinho em `assets/`, que o HTML atual não usa (o HTML leva os assets embutidos; a pasta é a origem);
- a função do Benchmark continua no JS do output, mas não tem como ser aberta lá;
- as versões antigas, como eram: "PIX da Energia" em texto misto e o porquinho nas V2 e V3.

## Para continuar num outro chat

> Continua o projeto `super-app/fatura-variacoes` do iGreen Hub. Leia antes o ORQUESTRADOR.md e o `builder/README.md` dele.
