# Builder — Teaser do lançamento

**O que é.** Duas propostas de teaser para o lançamento do iGreen MOB, com contagem regressiva para **01/11/2026 às 20h de Brasília**: o painel com a estrada em movimento (`../index.html`) e a revelação do carro e do eletroposto num estúdio escuro (`../revelacao.html`), mais as variações V2 e Dark 2.

**Origem.** Migrado em 2026-11-06 da pasta local `Área de Trabalho/carro simulador/igreen-launch-countdown` (repositório git local, sem remoto, commit `c6e078e`, de 09 a 11/10/2026). Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro. O README do original está em [`README-original.md`](README-original.md).

## Estado atual

- As duas propostas e as nove variações funcionam como estão.
- A data do lançamento já passou: o contador mostra zero e a mensagem de lançamento, como previsto no original.
- O que não sei pelos arquivos: qual proposta foi escolhida e se alguma foi ao ar. No hub já existe outra contagem, `mob/hotsite-migre-bandeira/contador.html` ("Em breve"), que é uma página diferente desta. Pergunte ao usuário antes de continuar.

## Decisões tomadas

Pelas notas do original:

- A data fica em `../config.js` (`2026-11-01T20:00:00-03:00`). O contador usa o relógio do visitante e não reinicia ao recarregar; depois da data, zera e mostra a mensagem de lançamento. O destino opcional ficou vazio até definir o endereço final do site.
- "Salvar a data" baixa um arquivo de calendário. A pausa para os efeitos; a contagem continua. A preferência por movimento reduzido é respeitada.
- As imagens são geradas por IA; os movimentos são efeitos da página, não vídeo. Painel V2 é uma animação 2,5D de imagens em camadas, não modelo 3D.
- Dark 2: uma imagem base só, renderizada em SVG nos dois estados (apagada e acesa), com alternância manual (`BASE-UNICA.md`, `DARK-2.md`).

## Pendências e perguntas em aberto

- Confirmar com o usuário qual proposta ficou e se este teaser deve continuar.

## Como gerar o resultado

As páginas da raiz são o resultado. Não achei script que gere `index.html` e `revelacao.html`; as variações V2 saem deles pelo script deste builder:

```sh
# o script lê e grava em dist/: rode numa pasta com a raiz deste projeto copiada para dist/
node build-v2.cjs        # gera painel-v2.html, revelacao-v2.html e revelacao-dark-v2.html
node preview.cjs         # prévia local do original, em http://127.0.0.1:4182/ (serve dist/)
```

No hub não há `dist/`: o resultado está direto na raiz. Os dois scripts esperam a estrutura do original (`dist/` ao lado), então ajuste o caminho ou monte essa estrutura antes de rodar.

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com `mob/teaser-lancamento`, edite, refaça os prints se a tela mudou, atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/teaser-lancamento: <o que mudou>`.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../index.html`](../index.html) | Painel com a estrada e o contador |
| [`../revelacao.html`](../revelacao.html) | Revelação: carro e eletroposto alternados |
| [`../painel-v2.html`](../painel-v2.html), [`../revelacao-v2.html`](../revelacao-v2.html), [`../revelacao-dark-v2.html`](../revelacao-dark-v2.html) | As variações V2 (e as versões "sem movimento" e "sem efeito") |
| [`../dark-2.html`](../dark-2.html) | Dark 2, com as três versões anteriores (`dark-2-*-anterior.html`) |
| [`../config.js`](../config.js) | Data do lançamento e destino |
| [`build-v2.cjs`](build-v2.cjs) | Gera as variações V2 a partir das páginas originais |
| [`VISUAIS.md`](VISUAIS.md), [`VISUAIS-V2.md`](VISUAIS-V2.md), [`DARK-2.md`](DARK-2.md), [`BASE-UNICA.md`](BASE-UNICA.md), [`EFEITOS-V2.md`](EFEITOS-V2.md), [`MONITOR-REVISADO.md`](MONITOR-REVISADO.md), [`NATURAL-DARK2.md`](NATURAL-DARK2.md), [`PHOTO-DARK2.md`](PHOTO-DARK2.md) | As notas de cada rodada, com os prompts das imagens |
| [`research/`](research/) | A imagem de referência de vídeo usada na pesquisa |
| [`screenshots/`](screenshots/) | Capturas das rodadas |
| [`master-scene.txt`](master-scene.txt) | Trecho de HTML da cena principal (SVG da Dark 2) |

## O que ficou de fora

- `visuals/` (13 PNG, 19 MB): os originais das imagens geradas por IA, fonte pesada. As versões usadas estão em `../assets/`. Continuam na pasta local de origem.
- `.git` e `.openai/` (configuração de hospedagem do original).

## Visto no original

- A data do lançamento já passou, então o contador aparece zerado.
