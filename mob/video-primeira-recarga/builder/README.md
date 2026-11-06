# Builder — Vídeo da primeira recarga

**O que é.** "Da vaga à energia": a pesquisa de discovery da Conexão Mobi sobre a primeira recarga de carro elétrico no Brasil, em vídeo. São 22 cenas, em 1920×1080, 30 fps e cerca de 2min25: os números do mercado, as duas personas (quem chega pela primeira vez e quem já é cliente), os 13 momentos da jornada e o fechamento. O vídeo é feito em código, com Remotion.

**Origem.** Migrado em 2026-11-06 da pasta local `Área de Trabalho/projeto-remotion-primeira-recarga` (sem git, de 08/09/2026). Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro. O README do original está em [`README-original.md`](README-original.md).

## Estado atual

- O projeto Remotion está completo. O original não tinha nenhum vídeo renderizado: o `../primeira-recarga.mp4` foi renderizado na migração, a partir deste código e sem mudar nada nele, e o `../poster.webp` é o quadro 75 da abertura.
- `../index.html` é a página do hub que toca o vídeo. É o único arquivo novo da migração, junto com o MP4 e o pôster.
- O que não sei pelos arquivos: para quem o vídeo foi apresentado e se ainda vai mudar. Pergunte ao usuário antes de continuar.

## Decisões tomadas

Pelo README do original:

- Todo o conteúdo (os 13 momentos, falas, dores e as duas curvas emocionais) fica em `src/data.ts`; para mudar o ritmo, o campo `dur` de cada momento, em frames (30 = 1 segundo).
- As fontes (Instrument Sans, Instrument Serif e DM Mono) ficam locais em `public/fonts/`, para o render não depender de rede.
- **Licença:** o Remotion é gratuito para pessoas físicas, ONGs e empresas com até 3 funcionários. Uso em produção na iGreen exige a licença comercial (Remotion Pro).

## Pendências e perguntas em aberto

- Confirmar a licença do Remotion antes de qualquer uso em produção.

## Como gerar o resultado

```sh
cd builder
npm install
npm run studio                                   # abre o Remotion Studio para ajustar textos, tempos e cores
npx remotion render src/index.ts PrimeiraRecarga ../primeira-recarga.mp4
```

Na migração, o render foi feito com o Chrome instalado (`--browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe"`) e `--bundle-cache=false`, e saiu com 30 MB. Para o hub, o MP4 foi comprimido de novo, sem mudar resolução nem duração (1920×1080, 2min25), e ficou com 11 MB:

```sh
ffmpeg -i video-renderizado.mp4 -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k ../primeira-recarga.mp4
```

O pôster é o quadro 75 (`npx remotion still src/index.ts PrimeiraRecarga poster.png --frame=75`), em WebP de 1280 px. O vídeo tem que continuar comprimido e curto (ORQUESTRADOR.md, seção 7: arquivo até 50 MB, site inteiro até 1 GB).

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com `mob/video-primeira-recarga`, edite em `builder/src/`, renderize o MP4 de novo, refaça os prints, atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/video-primeira-recarga: <o que mudou>`.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../index.html`](../index.html) | A página que toca o vídeo |
| `../primeira-recarga.mp4` | O vídeo renderizado |
| [`src/data.ts`](src/data.ts) | Todo o conteúdo: momentos, falas, dores e curvas |
| [`src/Root.tsx`](src/Root.tsx) | A montagem das cenas e as transições |
| [`src/scenes/`](src/scenes/) | Cenas de abertura, momento e fechamento |
| [`src/ui.tsx`](src/ui.tsx), [`src/icons.tsx`](src/icons.tsx), [`src/theme.ts`](src/theme.ts) | Componentes, os 13 pictogramas e os tokens de cor, tipo e grid |
| [`public/fonts/`](public/fonts/) | As fontes locais |
| [`package.json`](package.json), [`package-lock.json`](package-lock.json), [`remotion.config.mjs`](remotion.config.mjs) | Dependências e configuração |

## O que ficou de fora

- `node_modules/` (instale com `npm install`).

## Visto no original

- Não havia vídeo renderizado na pasta.
