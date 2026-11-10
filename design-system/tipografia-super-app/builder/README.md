# Builder · Super App · Tipografia

O estudo por trás do padrão tipográfico do Super App. Aqui estão o benchmark que definiu a escala Manrope, os scripts que aplicam a escala num protótipo e as iterações do cashback até a versão aprovada. Esta pasta não aparece na vitrine.

O output é [`../prototipo-cashback-v2.html`](../prototipo-cashback-v2.html): o protótipo de cashback em que a escala foi testada, no celular, até o Sergio aprovar e parar de mexer. Ele é a referência de tipografia e espaçamento para produzir as próximas telas.

## Origem

Migrado em 10/11/2026 de duas pastas locais, sem repositório git:
- `Área de Trabalho/Tipografia`: o output, o protótipo de entrada e o benchmark;
- `Área de Trabalho/Nova pasta/_fontes/faturas-v2-ao-negociar-e-carteira`: os scripts, os ajustes e as iterações.

Daqui em diante, a fonte é esta pasta. Os originais ficam intocados, só como registro.

Na cópia, só as quebras de linha mudaram: alguns originais estão em CRLF, e o Git do hub guarda LF. A receita de "Como gerar o output" foi conferida com os dois.

## Estado atual

- **A escala está fechada.** Ela está na seção 6 do benchmark. As revisões 1 a 6 trazem os ajustes depois do teste no celular: o ritmo do Mercado Pago, as folhas no Samsung S23, a navegação, a acessibilidade e o laranja de vencida.
- **O output está pronto.** É o cashback v2: sem tamanho fracionado, sem peso 800, e a origem dos ganhos por produto abre uma folha com abas e linha do tempo.
- **A auditoria final passou.** Foram 178 telas, em 360×780 e 390×844, com zero falhas de contraste, toque, corte ou layout (revisão 6).
- **A mesma escala já foi aplicada às faturas v2,** com os mesmos scripts (veja "Aplicar a escala a outro protótipo"). Elas estão em `super-app/faturas-energia`, na página `faturas-energia-v2.html`.

## A escala, em uma tela

O detalhe e o porquê de cada item estão no benchmark, seção 6.

| Tamanho/entrelinha | Peso | Uso |
|---|---|---|
| 11/16 | 700, maiúsculas, +0,06em | Overline, eixo de gráfico |
| 12/16 | 500 a 600 (700 em badge) | Badge, status, legenda |
| 13/18 | 500 (600 ênfase) | Subtítulo de linha, descrição curta |
| 14/20 | 500 a 700 | Texto corrido, chips, abas, avisos |
| 15/20 | 700 | Título de linha de lista e de card, botão |
| 16/22 | 700 | Valor em linha, título de grupo |
| 18/24 | 700, −0,01em | Título de tela no cabeçalho |
| 20/24 | 700, −0,01em | Título de seção, título de folha |
| 22/28 | 700, −0,01em | Confirmação, totais de resumo |
| 28/34 | 700, −0,02em | Valor principal dentro de card |
| 34/40 | 700, −0,02em | Saldo, valor de pagamento |
| 40/48 | 700, −0,02em | Hero, no máximo um por tela |

- **Pesos:** 500 no texto, 600 na ênfase, 700 em título e valor. A interface não usa 400 nem 800.
- **Espaços:** 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48. A margem de tela e o padding de card são 16.
- **Ritmo:** 32 entre seções e 16 do título de seção ao conteúdo. O que é da mesma coisa fica a 2 a 4; o que é outro grupo, a 12 a 32.

## Decisões tomadas

- **A Manrope começa em 500.** O traço dela é um peso inteiro mais fino que o da SF, da Inter e da Roboto (medido: 0,073em contra 0,087em da Inter). A primeira v2 desceu os pesos um degrau e ficou fina no celular (revisão 1).
- **As linhas de lista dentro de card usam 15/13,** não o 17 do iOS. O card com margem, borda e padding deixa cerca de 200 px para o título, e o 17 ficou grande demais. O iFood ficou pequeno demais. A referência de densidade e de respiro é o Mercado Pago.
- **Cada tamanho tem uma entrelinha só, e nenhum tamanho é fracionado.** O protótipo de entrada tinha 28 tamanhos (9.5, 12.5, 13.5...) e mais de 30 entrelinhas. A escala tem 12 tamanhos.
- **O laranja de vencida é âmbar:** `#B45309` em superfície, ícone e texto grande, e `#A84E08` em texto pequeno. O `#F46600` reprova no contraste, e o `#B84A00` puxava para o marrom (revisão 6).
- **Os alvos de toque têm 44 px,** com uma extensão invisível nos controles pequenos (revisão 5).

## Como gerar o output

O output sai do protótipo de entrada em sete comandos. A receita foi conferida em 10/11/2026 e gera um arquivo idêntico, byte a byte, ao `../prototipo-cashback-v2.html`. Precisa só de Node, sem dependências.

```sh
cd _fontes/faturas-v2-ao-negociar-e-carteira
node transform.js ../../prototipo-cashback.html gerado.html config.json   # tamanhos, entrelinhas, pesos e espaços na escala
node patch.js gerado.html                                                # tela cheia 1:1 no celular, tokens em variáveis CSS
node aplicar.js gerado.html ajustes.txt                                  # botões, extrato, comprovante, toque e links diretos; aqui o arquivo é igual ao v8.html
node aplicar.js gerado.html ajustes-animacao.txt
node aplicar.js gerado.html ajustes-linhas.txt
node aplicar.js gerado.html ajustes-origem.txt                           # a origem dos ganhos em folha com abas; aqui é igual ao cb8.html
cp gerado.html ../../../prototipo-cashback-v2.html && rm gerado.html
```

`aplicar.js` troca blocos "antes → depois" e confere quantas vezes cada um aparece. Se o texto de um bloco não estiver no arquivo, o script para e não grava nada. `remover-bloco.js` tira blocos de um arquivo de ajustes pelo nome.

**Para mudar o output,** mude o arquivo de ajustes certo (ou crie um novo), gere de novo com os comandos acima e publique pelo passo "Alterar um projeto" da seção 5 do ORQUESTRADOR.md. A mensagem do commit é `design-system/tipografia-super-app: <o que mudou>`. Depois de gerar, refaça os prints. Não edite o output à mão.

## Aplicar a escala a outro protótipo

Foi assim que a escala chegou às faturas v2, em 27/10/2026:

```sh
node transform.js <tela.html> <saida.html> config-faturas.json
TOLERANTE=1 node patch.js <saida.html>
TOLERANTE=1 node aplicar.js <saida.html> ajustes.txt   # TOLERANTE pula os blocos que a outra tela não tem
```

Depois disso, cada tela teve os seus próprios ajustes, que ficaram com o projeto dela. `config.json` e `config-faturas.json` são os mapas do tamanho antigo para o novo; cada protótipo tinha tamanhos antigos diferentes.

Os scripts conhecem a estrutura destes protótipos: as telas prontas ficam compactadas em `DADOS_GZ`, e o código fica nos módulos `__M[...]`. Numa tela feita de outro jeito, use a escala do benchmark como regra e confira com as auditorias abaixo.

## Auditar uma tela

| Script | Onde roda | O que faz |
|---|---|---|
| `auditoria-final.js` | colar no console da página | Percorre todos os fluxos e passos e aponta o que fugiu da escala: texto cortado, conteúdo que vaza na horizontal, folha mais alta que a tela, tela de sucesso que rola, contraste abaixo de AA e alvo de toque abaixo de 44 px. O resultado fica em `window.__FINAL` |
| `auditoria.js` | console da página | A primeira auditoria: tamanho fora da escala e par tamanho/entrelinha fora do token. Defina antes `window.__ESCALA` |
| `respiro.js` | console da página | `respiro()` lista os espaços entre grupos da tela aberta que estão mais apertados que o ritmo pede |
| `spacing.js`, `combos.js` | Node: `node spacing.js <tela.html> <blob.json>` | Contam os valores de espaço e as combinações de tamanho, entrelinha e peso, no HTML e nas telas compactadas |
| `extract.js`, `dump-gz.js` | Node | Abrem o `DADOS_GZ` num JSON, para ver as telas compactadas |
| `busca.js` | Node: `node busca.js <tela.html> <regex>` | Conta um padrão no código e nas telas compactadas |

## Onde está cada coisa

| Item | O que é |
|---|---|
| [`2026-10-26-benchmark-escala-tipografica.md`](2026-10-26-benchmark-escala-tipografica.md) | O estudo: diagnóstico, players, matriz, a escala (seção 6), o "de → para", a CSD, as fontes e as revisões 1 a 6 |
| [`prototipo-cashback.html`](prototipo-cashback.html) | A entrada: o protótipo de cashback antes da escala, com os tamanhos quebrados |
| [`../prototipo-cashback-v2.html`](../prototipo-cashback-v2.html) | O output, a referência |
| [`_fontes/faturas-v2-ao-negociar-e-carteira/`](_fontes/faturas-v2-ao-negociar-e-carteira/) | Os scripts, os ajustes, as iterações e os dados |
| [`transform.js`](_fontes/faturas-v2-ao-negociar-e-carteira/transform.js), [`patch.js`](_fontes/faturas-v2-ao-negociar-e-carteira/patch.js), [`aplicar.js`](_fontes/faturas-v2-ao-negociar-e-carteira/aplicar.js), [`ajustar-blob.js`](_fontes/faturas-v2-ao-negociar-e-carteira/ajustar-blob.js) | O gerador. `ajustar-blob.js` levou os ajustes do comprovante para as telas compactadas das faturas v2 |
| [`config.json`](_fontes/faturas-v2-ao-negociar-e-carteira/config.json), [`config-faturas.json`](_fontes/faturas-v2-ao-negociar-e-carteira/config-faturas.json) | Os mapas de tamanho, entrelinha, peso e espaço |
| [`ajustes.txt`](_fontes/faturas-v2-ao-negociar-e-carteira/ajustes.txt), [`ajustes-animacao.txt`](_fontes/faturas-v2-ao-negociar-e-carteira/ajustes-animacao.txt), [`ajustes-linhas.txt`](_fontes/faturas-v2-ao-negociar-e-carteira/ajustes-linhas.txt), [`ajustes-origem.txt`](_fontes/faturas-v2-ao-negociar-e-carteira/ajustes-origem.txt) | Os ajustes em blocos "antes → depois" |
| `teste.html`, `v3.html` a `v8.html` (26/10) | As iterações da escala, dia a dia. A `v8.html` é a escala final antes dos ajustes do cashback v2 |
| `cb2.html` a `cb8.html` (27/10) | As iterações do cashback v2: animação, linhas e origem. A `cb8.html` é igual ao output |
| `comprovante0.html` | Um comprovante desenhado à parte, em 390 px de largura, do estudo do recibo |
| `dados.json`, `dados-teste.json`, `dados-v2.json`, `gz-cb.json` | As telas compactadas de cada versão, abertas em JSON, para medir |
| [`scripts/`](_fontes/faturas-v2-ao-negociar-e-carteira/scripts/) | Os scripts que leram a documentação baixada (Apple, Material 3) para o benchmark |

A pasta se chama `faturas-v2-ao-negociar-e-carteira` porque é a cópia de trabalho da sessão, feita quando as faturas estavam em andamento. Daquela pasta, veio só o que é da tipografia: os arquivos de 26 e 27/10 que tratam do cashback e da escala.

## O que ficou de fora

- **O material baixado para o benchmark.** São páginas, CSS e documentação de terceiros: Apple HIG e UIKit (`dl/`, `apple/`), Material 3 (`m3/`, 14 MB), Nubank, Inter, PicPay, C6, Mercado Pago, Méliuz, iFood, bancos (`banks/`), Mercado Livre (`mlcss/`, `ml_home.html`, `andes_tree.json`), Wise, Polaris e Primer. O hub é público, e esse conteúdo não é nosso. Ele continua na pasta local `Nova pasta/_fontes/faturas-v2-ao-negociar-e-carteira`, e as fontes de cada referência estão na seção 11 do benchmark.
- **`world0.ksd`**, da pasta Tipografia (31/10/2026). É um arquivo binário de formato desconhecido, criado depois do estudo. Não sei o que é, e ele ficou só na pasta local.
- **Os arquivos das faturas** que estão na mesma pasta de trabalho (`fat1` a `fat4`, `base.html`, `ajustes-faturas.txt`, `ajustar-figma.js`, `figma-ticket/` e tudo de 27/10 à tarde em diante). Eles são das tarefas de faturas, que já estão no hub em `super-app/faturas-energia` e `super-app/pagar-negociar`.

## Pendências e perguntas em aberto

- **Ainda não existe uma página-espécime,** com a escala desenhada token a token. Hoje a referência é o protótipo, com a escala aplicada.
- **O app tem duas tipografias.** A escala Manrope daqui está no cashback v2 e nas faturas v2. O padrão do app em produção (Figma V1, com Outfit e Montserrat nos selos) está nas faturas no padrão do app, no pagar e negociar e na carteira. Não está decidido qual das duas segue nas próximas telas, nem se uma substitui a outra.
- **15/13 contra 16/14 nas linhas de lista** era o maior risco do benchmark (seção 1). A v2 ficou com 15/13 depois dos testes do Sergio no celular, e 16/14 ficou como alternativa para lista de largura total. Não houve teste com clientes.

## Visto no original

- As iterações `v3.html` a `v7.html` e `cb2.html` a `cb7.html` são o registro do dia a dia. Só a `v8.html` e a `cb8.html` saem de novo, idênticas, pela receita acima.
- O protótipo carrega a Manrope do Google Fonts, com os pesos de 300 a 800, mas usa só 500, 600 e 700.

## Para continuar num outro chat

"Continua o projeto `design-system/tipografia-super-app` do iGreen Hub. Leia antes o ORQUESTRADOR.md e o `builder/README.md` dele."
