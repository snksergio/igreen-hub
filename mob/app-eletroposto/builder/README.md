# Builder — App Eletroposto

**O que é.** As telas do app Eletroposto (iGreen Mob), o app de recarga do motorista: 28 fluxos e 208 telas, do primeiro acesso ao recibo, com mapa, pagamento, recarga, carteira, veículos, conta e ajuda. Cada tela existe em HTML estático e em PNG, com o documento dos fluxos (`../FLUXOS.md`) e a mesma estrutura em JSON (`../dados/fluxos.json`). O pacote foi montado para servir de base a um vídeo de motion.

**Origem.** Migrado em 2026-11-06 da pasta local `Área de Trabalho/Nova pasta` (sem git): `eletroposto-fluxos/` (02/10/2026) e `Eletroposto - home.html` (01/10/2026). Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

O `CLAUDE.md` da raiz é do pacote original, escrito para quem vai montar o vídeo. Onde ele divergir deste README (caminhos, onde editar), vale este README.

## Estado atual

- O pacote está completo como foi entregue: a galeria (`../index.html`), as 208 telas em `../html/` e `../telas/`, as imagens em `../assets/` e os dados dos caminhos entre telas.
- `../Eletroposto - home.html` é uma página anterior, num arquivo só, com a home, a gestão de veículos e o pagamento da recarga lado a lado.
- O que não sei pelos arquivos: se o vídeo de motion foi feito e se estas telas viraram o app de verdade. Pergunte ao usuário antes de continuar.

## Decisões tomadas

O que dá para ler no `CLAUDE.md` e no `FLUXOS.md`:

- Cada tela é um HTML estático, sem JavaScript, com estilos inline, largura de 390 px e a raiz em `[data-tela="NN-MM-Nome"]`. O id `NN-MM-Nome` é o mesmo no HTML, no PNG e no JSON.
- Fonte Manrope, verde da marca `#338449` nos botões, tom sóbrio e claro, vermelho só para ações destrutivas e pendências.
- Os fluxos 12 (propostas de banner) e 28 (carro verde) são testes de design, não telas finais.

- **Na migração, os 208 PNGs de `../telas/` foram comprimidos** (paleta de cores, mesmos nomes e mesmas dimensões), com o ok do usuário em 2026-11-06: o pacote tinha 71 MB, acima do limite de 50 MB do hub, e caiu para 31 MB (as telas, de 59 para 20 MB). Na comparação lado a lado a imagem ficou praticamente igual. Os PNGs originais continuam na pasta local de origem. Os HTML, os assets e o resto do pacote vieram como estavam.

## Pendências e perguntas em aberto

Do próprio `FLUXOS.md`, seção "Pontos em aberto":

- A home base mostra o carro como BYD King; os outros fluxos usam o BYD Dolphin Mini.
- O cashback aparece como R$ 100 em umas telas e R$ 10 em outras. Falta o valor oficial.
- A tela "Primeiro acesso 3" ainda tem "Só quero dar uma olhada", mas o acesso de visitante foi descartado.

## Como gerar o resultado

Não há build: as páginas são os próprios arquivos. As telas foram geradas por um script (`gerar-entrega.js`) numa pasta temporária de outra conversa, que não existe mais. Não sei de onde ele lia as telas (o `index.html` cita a ordem do FigJam). Para mudar uma tela, edite o HTML em `../html/` e refaça o PNG correspondente em `../telas/` (780 px de largura, a 2x).

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com `mob/app-eletroposto`, edite, refaça os prints se a tela mudou, atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/app-eletroposto: <o que mudou>`.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../index.html`](../index.html) | Galeria de todos os fluxos; clicar numa tela abre o HTML dela |
| [`../Eletroposto - home.html`](<../Eletroposto - home.html>) | Home, veículos e pagamento, num arquivo só |
| [`../FLUXOS.md`](../FLUXOS.md) | O que cada fluxo faz, as regras do produto, cada tela e os caminhos |
| [`../dados/fluxos.json`](../dados/fluxos.json) | A mesma estrutura em JSON: telas (`id`, `titulo`, `altura`, `png`, `html`) e caminhos (`de`, `para`, `gatilho`) |
| [`../html/`](../html/) | As 208 telas em HTML estático |
| [`../telas/`](../telas/) | As mesmas telas em PNG, a 2x |
| [`../assets/`](../assets/) | Fotos e ilustrações usadas pelas telas |
| [`../CLAUDE.md`](../CLAUDE.md) | O contexto original, para quem vai animar as telas |

## O que ficou de fora

- Os PNGs originais das telas, sem compressão (59 MB), em `Área de Trabalho/Nova pasta/eletroposto-fluxos/telas/`.

- O script `gerar-entrega.js`, que gerou o pacote: ficava numa pasta temporária e não existe mais.
- O resto de `Área de Trabalho/Nova pasta` são outros assuntos (faturas, cashback, cadastro pay, Uber e iFood, login), que já estão em outros projetos do hub.

## Visto no original

- Os dados das telas são fictícios (CPF `000.000.000-00`, telefones de exemplo).
- As telas carregam a fonte Manrope do Google Fonts; sem internet, o navegador usa a fonte do sistema.
