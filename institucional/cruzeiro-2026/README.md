# Let's Go Cruzeiro 2026

Site da viagem de premiação Let's Go Cruzeiro iGreen 2026 (29/11 a 02/12/2026). A versão atual tem a abertura solar, as quatro experiências a bordo (Sol & mar, Seu refúgio, À mesa, Celebre), o navio em 3D usado como mapa dos ambientes e o roteiro Santos–Búzios dia a dia. A página "Abertura em filme" troca a imagem de abertura por um filme e acrescenta o roteiro ilustrado.

Como versão anterior fica o protótipo do filme por scroll: um dia a bordo em um único plano contínuo de 54 s, da chegada ao navio até a festa noturna, com relógio de bordo e capítulos.

Cópias de dois projetos locais, sem repositório: `Área de Trabalho/teste` (site, feito no Codex; build do Vite com base relativa em 2026-11-05) e `Cuzeiro/site` (protótipo; build do Vite com base relativa). Os originais continuam lá e são a fonte: ajustes são feitos neles e copiados de novo para esta pasta.

| Página | Endereço no hub |
|---|---|
| Site | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/ |
| Abertura em filme + roteiro | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/filme.html |
| Protótipo: filme por scroll | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/prototipo.html |
| Protótipo: datas e regras | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/prototipo.html#trip |

## Estrutura

- `index.html` — o site (React + Three.js). O 3D carrega quando o mapa se aproxima da tela; em dispositivos sem WebGL a lista de ambientes mantém a navegação.
- `filme.html` — a mesma estrutura com a abertura em filme (`videos/voyage-complete-v3.mp4`, 37 s, 720p) e o roteiro Santos–Búzios.
- `prototipo.html` — o protótipo do filme por scroll (`hero/film.mp4`, 54 s, 720p, keyframe a cada 6 quadros para o scrub).
- `assets/` — JS, CSS e fontes (Barlow Condensed, Damion e DM Sans via Fontsource) dos dois builds.
- `images/` — as cenas conceituais do site (JPEG) e as fotos do roteiro (Santos e Búzios, Wikimedia Commons, CC BY / CC BY-SA, créditos no código).

## Interação do site

- Role ou use a navegação para visitar a abertura, as experiências e o mapa. As abas das experiências aceitam setas, Home e End.
- Arraste o navio no mapa para girá-lo; escolha um ponto ou um item da lista para destacar um ambiente. "Viver esse momento" abre a cena.
- O som (base ambiente sintetizada) começa desligado; o movimento das imagens pode ser pausado na abertura e respeita a preferência de movimento reduzido do sistema.

## O que mudou nas cópias

- Caminhos absolutos (`/images/…`, `/videos/…`, `/hero/…`) trocados por relativos.
- Só os arquivos referenciados foram copiados: os PNGs de origem das cenas, os cortes v1 e v2 do filme e o build anterior ficaram no original. A foto de Búzios foi reduzida de 6,5 MB para 0,7 MB.
- O protótipo usa só o filme em 720p (o 1080p do original era o mesmo take ampliado).

Imagens e filmes são conceituais, gerados por IA; não representam a embarcação, o itinerário ou a programação confirmados. Dados fictícios.
