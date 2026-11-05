# Let's Go Cruzeiro 2026

Site da viagem de premiação Let's Go Cruzeiro iGreen 2026 (29/11 a 02/12/2026). A versão atual abre com um filme (viagem pelo navio: piscina, restaurante, evento e festa), tem as quatro experiências a bordo (Sol & mar, Seu refúgio, À mesa, Celebre), o navio em 3D usado como mapa dos ambientes e o roteiro Santos–Búzios dia a dia, com diário de bordo e carta ilustrada. A página "Variação só com imagens" é a mesma estrutura com a abertura em fotografia, sem o roteiro.

Como versão anterior fica o protótipo do filme por scroll: um dia a bordo em um único plano contínuo de 54 s, da chegada ao navio até a festa noturna, com relógio de bordo e capítulos.

Cópias de dois projetos locais, sem repositório: `Área de Trabalho/teste` (site, feito no Codex; `index-video.html` do original é o `index.html` daqui; build do Vite com base relativa em 2026-11-05) e `Cuzeiro/site` (protótipo; build do Vite com base relativa). Os originais continuam lá e são a fonte: ajustes são feitos neles e copiados de novo para esta pasta.

| Página | Endereço no hub |
|---|---|
| Site | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/ |
| Explore o navio (3D) | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/#navio |
| O roteiro | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/#roteiro |
| Variação só com imagens | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/imagens.html |
| Protótipo: filme por scroll | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/prototipo.html |
| Protótipo: datas e regras | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/prototipo.html#trip |

## Estrutura

- `builder/` — o código-fonte dos dois projetos e as pendências anotadas, para revisitar o projeto ([README do builder](builder/README.md)). Não aparece na vitrine.

- `index.html` — o site (React + Three.js), com a abertura em filme (`videos/voyage-complete-v3.mp4`, 37 s, 720p), o modal "Assistir à viagem completa" e o roteiro. O 3D carrega quando o mapa se aproxima da tela; em dispositivos sem WebGL a lista de ambientes mantém a navegação.
- `imagens.html` — a variação com abertura em fotografia (era o `index.html` do original).
- `prototipo.html` — o protótipo do filme por scroll (`hero/film.mp4`, 54 s, 720p, keyframe a cada 6 quadros para o scrub).
- `assets/` — JS, CSS e fontes (Barlow Condensed, Damion e DM Sans via Fontsource) dos dois builds.
- `images/` — as cenas conceituais do site (JPEG) e as fotos do roteiro (Santos e Búzios, Wikimedia Commons, CC BY / CC BY-SA, créditos no código).

## Interação do site

- Role ou use a navegação para visitar a abertura, as experiências, o mapa e o roteiro. As abas das experiências aceitam setas, Home e End.
- "Assistir à viagem completa" abre o filme em um modal; "Pausar" congela o filme e o movimento das imagens.
- Arraste o navio no mapa para girá-lo; escolha um ponto ou um item da lista para destacar um ambiente. "Viver esse momento" abre a cena.
- No roteiro, escolha o dia no diário de bordo; a carta acompanha o scroll. "Ampliar foto" abre a fotografia.
- O som (base ambiente sintetizada) começa desligado; a preferência de movimento reduzido do sistema é respeitada.

## O que mudou nas cópias

- Caminhos absolutos (`/images/…`, `/videos/…`, `/hero/…`) trocados por relativos.
- `index-video.html` do original virou `index.html`; o `index.html` do original virou `imagens.html`.
- Só os arquivos referenciados foram copiados: os PNGs de origem das cenas, os cortes v1 e v2 do filme e o build anterior ficaram no original. A foto de Búzios foi reduzida de 6,5 MB para 0,7 MB.
- O protótipo usa só o filme em 720p (o 1080p do original era o mesmo take ampliado).

Imagens e filmes são conceituais, gerados por IA; não representam a embarcação, o itinerário ou a programação confirmados. Dados fictícios.
