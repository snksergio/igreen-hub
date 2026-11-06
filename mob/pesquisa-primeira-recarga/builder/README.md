# Builder — Pesquisa da primeira recarga

**O que é.** "A primeira recarga quebra no pagamento": a pesquisa de UX da Conexão MOB sobre o que o motorista enfrenta ao carregar um carro elétrico pela primeira vez no Brasil. São 23 páginas em vídeo narrado de 7min23, feito em código com Remotion. A versão final está no YouTube: https://www.youtube.com/watch?v=n5mgEOPm7WI

**Origem.** O código e os roteiros vieram da pasta local `Área de Trabalho/Relume Demo/conexao-mobi` (sem git, 10 a 12/09/2026), em 2026-11-06. O vídeo fica no YouTube, e a ficha só aponta para lá, porque vídeo pesado não entra no hub (ORQUESTRADOR.md, seções 1 e 7). Este builder guarda só o que é leve: o código, os roteiros e as notas. O original fica intocado, só como registro.

## Estado atual

- A versão narrada (v2) está pronta e publicada no YouTube. Existe também uma versão muda de 2min04 (`out/VERSAO-FINAL-SEM-AUDIO.mp4`, na pasta local).
- Antes desta, houve um protótipo do mesmo assunto, "Da vaga à energia" (`Área de Trabalho/projeto-remotion-primeira-recarga`, 08/09/2026), que não está no hub.
- Para renderizar de novo, faltam aqui as imagens e os áudios da narração, que ficaram na pasta local (veja "O que ficou de fora").

## Decisões tomadas

Pelo roteiro e pelas notas:

- **A voz manda no tempo** (`output/ROTEIRO-NARRADO-V2.md`): o roteiro foi escrito primeiro, gravado e medido, e cada cena dura a fala inteira mais 1,5 s de silêncio (`TAIL` em `src/lib/narration2.ts`). A v1 fez o inverso, escreveu para caber num vídeo pronto, e soou mecânica.
- **Voz pela ElevenLabs, em pt-BR.** A v1 usou a voz Tiago Fonseca; na v2, a voz é a do Onildo, escolhida depois de testar 5 vozes.
- **Regras das cenas** (`SCENE-SPEC.md`): nada anima sozinho; toda animação sai de `interpolate()` sobre o quadro atual, e as cenas só são escritas em `src/scenes/`.

## Pendências e perguntas em aberto

- Nenhuma registrada nos arquivos. Pergunte ao usuário se o vídeo ainda vai mudar.

## Como gerar o resultado

```sh
cd builder
npm install
npm run dev     # Remotion Studio
npx remotion render src/index.ts ConexaoMOB-Narrado out/ConexaoMOB-NARRADO-v2.mp4   # versão narrada
npx remotion render src/index.ts ConexaoMOB out/VERSAO-FINAL-SEM-AUDIO.mp4          # versão muda
```

Antes, copie da pasta local `public/` (imagens em `assets/` e narração em `vo2/`) para `builder/public/`. Sem isso o render falha. Depois de renderizar, publique o vídeo no YouTube e atualize o `link` do `projeto.json`, se o endereço mudar.

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com `mob/pesquisa-primeira-recarga`, edite, refaça os prints se o vídeo mudou, atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/pesquisa-primeira-recarga: <o que mudou>`.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`output/ROTEIRO-NARRADO-V2.md`](output/ROTEIRO-NARRADO-V2.md) | O roteiro da narração final, com a medição de cada fala |
| [`output/ROTEIRO-NARRACAO.md`](output/ROTEIRO-NARRACAO.md) | O roteiro da primeira tentativa (v1) |
| [`output/APRESENTACAO-MOBI.md`](output/APRESENTACAO-MOBI.md) | O que foi construído, página por página |
| [`SCENE-SPEC.md`](SCENE-SPEC.md) | As regras para escrever as cenas |
| [`src/Root.tsx`](src/Root.tsx) | As composições: `ConexaoMOB` (muda), `ConexaoMOB-Narrado` e uma por página |
| [`src/DeckNarradoV2.tsx`](src/DeckNarradoV2.tsx), [`src/lib/narration2.ts`](src/lib/narration2.ts) | A montagem narrada e os tempos de cada fala |
| [`src/scenes/`](src/scenes/) | As 23 páginas (`S01Cover` a `S23ClosingV2`) |
| [`src/lib/`](src/lib/), [`src/components/`](src/components/), [`src/transitions/`](src/transitions/) | Dados, tema, fontes, mapas, componentes e transições |
| [`package.json`](package.json), [`package-lock.json`](package-lock.json), [`remotion.config.ts`](remotion.config.ts) | Dependências e configuração |

## O que ficou de fora

Tudo continua em `Área de Trabalho/Relume Demo/conexao-mobi`:

- os vídeos renderizados em `out/` (o narrado, de 46 MB, e o mudo, de 23 MB). O narrado está no YouTube;
- `public/assets/` (17 MB, imagens do deck) e `public/vo2/` (6,6 MB, os 23 áudios da narração);
- `output/audicao/` (os testes das 5 vozes), `output/slides/` e `output/slides-v1/` (prints das páginas);
- `node_modules/`.
- O briefing que o `APRESENTACAO-MOBI.md` cita fica fora da pasta do projeto, em `Área de Trabalho/Relume Demo/Mobi/BRIEFING-DECK-MOBI.md`.

## Visto no original

- Cópias dos dois vídeos também estão em `Área de Trabalho/Organizado/Imagens/Videos - Ideias Motion para WEB/Meu/` (a versão muda com o nome `ConexaoMOB-PrimeiraRecarga.mp4`).
