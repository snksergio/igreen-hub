# Builder — Site Mob premium

> **Na vitrine:** desde 2026-11-06 este projeto fica arquivado (fora da lista principal) e aparece como POC na ficha do hotsite [`mob/hotsite-migre-bandeira`](../../hotsite-migre-bandeira/), aba "POCs". Os arquivos e os endereços continuam os mesmos.

**O que é.** O site para donos de eletroposto migrarem para a iGreen, em três versões independentes, todas com o simulador de receita das conexões (energia, seguro, telefonia e recarga na rede):

| Versão | Pasta | Título |
|---|---|---|
| v1 | [`../v1/`](../v1/) | Seu ponto. Novas conexões. |
| v2 · Urbana | [`../v2/`](../v2/) | Conecte-se ao novo |
| v3 | [`../v3/`](../v3/) | Além da recarga |

**Origem.** Migrado em 2026-11-06 da pasta local `Área de Trabalho/carro simulador`, de três repositórios git locais, sem remoto, todos de 05/10/2026: `igreen-premium` (commit `c62ec49`), `igreen-premium-v2` (`f989680`) e `igreen-premium-v3` (`40813ad`, com mudanças não commitadas, que vieram como estavam na pasta). Os scripts e as referências vieram de `carro simulador/.research`. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

## Estado atual

- As três versões abrem e funcionam como estão. A v3 é a mais recente e é a página principal da ficha; o `../index.html` leva para ela.
- A v3 tem duas galerias das conexões para comparar: maquetes isométricas e "Variação 02 — Fotografia" (`igreen-premium-v3/NOTAS.md`).
- O que não sei pelos arquivos: qual versão foi escolhida e se alguma foi ao ar. Pergunte ao usuário antes de continuar.

## Decisões tomadas

Pelas notas de cada versão (`igreen-premium*/NOTAS.md`):

- Conteúdo e cálculos transcritos do hotsite de migração de bandeira de referência, consultado em 05/10/2026, sem validação comercial independente: energia 4% da conta, seguro 5% da mensalidade, telefonia R$ 7 por linha ao mês, recarga na rede 2% do valor bruto, administração de 14% sobre o faturamento de recargas, recebimento D0.
- Simulador: 30 dias por mês, contas-base de R$ 500 para energia e seguro, mesma adesão para todos os novos clientes, sem cancelamentos. Testes em `verify-calculator.cjs` de cada versão.
- Cada versão nova foi feita sem alterar a anterior (a v2 confere isso com SHA-256 em `.research/v2/original-hashes.json`).
- v2: fundo quase preto, Instrument Sans, verde `#03FF1F` e fotografia urbana. v3: paleta grafite, verde só em pontos de destaque, maquetes isométricas geradas por IA.

## Pendências e perguntas em aberto

- Confirmar com o usuário qual versão vale e se o site continua.
- As condições comerciais foram transcritas da referência e precisam de validação antes de uso real (as notas dizem isso).

## Como gerar o resultado

As pastas `../v1/`, `../v2/` e `../v3/` são o resultado (o `dist/` de cada repositório original). A v2 e a v3 foram geradas a partir da versão anterior por scripts Python, depois ajustadas:

```sh
# os scripts esperam a estrutura de "carro simulador": igreen-premium/dist, igreen-premium-v2/dist...
python .research/v2-build.py      # v2 a partir da v1
python .research/v3/build.py      # v3 a partir da v2
python .research/v3/refine.py     # ajustes da v3
node igreen-premium/verify-calculator.cjs   # testes do simulador (idem para -v2 e -v3)
```

No hub as versões ficam em `v1/`, `v2/` e `v3/`, não em `igreen-premium*/dist`. Para rodar os scripts, monte a estrutura original numa pasta de trabalho ou ajuste os caminhos.

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com `mob/site-premium`, edite, refaça os prints se a tela mudou, atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/site-premium: <o que mudou>`.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`igreen-premium/NOTAS.md`](igreen-premium/NOTAS.md) | Notas da v1: conteúdo, cálculos e referências |
| [`igreen-premium-v2/NOTAS.md`](igreen-premium-v2/NOTAS.md) | Notas da v2 (Urbana) |
| [`igreen-premium-v3/NOTAS.md`](igreen-premium-v3/NOTAS.md), [`FOTOGRAFIAS.md`](igreen-premium-v3/FOTOGRAFIAS.md), [`MAQUETES.md`](igreen-premium-v3/MAQUETES.md) | Notas da v3, das fotografias e das maquetes |
| `igreen-premium*/verify-calculator.cjs` | Testes do simulador de cada versão |
| [`.research/`](.research/) | Scripts de montagem (`v2-build.py`, `v3/build.py`, `v3/refine.py`, `maquetes/*.py` e outros) e as referências leves (quadros de vídeo, contact sheets, prévias) |

## O que ficou de fora

- `.research/python-packages/` (84 MB, bibliotecas Python instaladas localmente) e os backups `.research/igreen-premium.tar.gz`, `v2/site-v2.tar.gz` e `v3/site-v3.tar.gz`.
- As imagens-fonte grandes: `.research/maquetes/*.png` (17 MB), `hero-generated.png`, `v2/hero-urban.png` e `v3/hero-final.png`. As versões usadas estão nos `assets/` de cada versão.
- `.git` e `.openai/` (configuração de hospedagem do original).
- As demais pastas de `carro simulador` são outros projetos: o teaser e o estúdio de simulação viraram `mob/teaser-lancamento` e `mob/estudio-simulacao`; o hotsite, o painel do eletroposto e o iGreen Live já estavam no hub.

## Visto no original

- O mesmo vídeo `assets/migracao.mp4` (7,9 MB) está repetido nas três versões, e a v1 traz as imagens em PNG e em WebP. Por isso o projeto tem 46 MB, acima dos 20 MB recomendados e abaixo do limite de 50 MB.
