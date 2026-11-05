# Builder — Let's Go Cruzeiro 2026

Código-fonte dos dois projetos que geram o output da pasta acima. Não aparece na vitrine. Os originais continuam nas pastas locais citadas; esta é a cópia versionada para revisitar o projeto.

| Pasta | O que é | Origem local | Gera |
|---|---|---|---|
| [`site-codex/`](site-codex/) | O site (React 19 + Vite 7 + Three.js), feito no Codex | `Área de Trabalho/teste` | `../index.html` (de `index-video.html`), `../imagens.html` (de `index.html`), `../assets/*` |
| [`prototipo/`](prototipo/) | O protótipo do filme por scroll (Vite + Lenis), feito no Claude Code | `Cuzeiro/site` | `../prototipo.html`, `../assets/index-*.{js,css}` |

## site-codex

- `src/video-main.jsx` + `src/VoyageRoute.jsx` — a página com filme e roteiro (o `index.html` do hub).
- `src/main.jsx` — a variação só com imagens (`imagens.html`). `src/scene.js` é a maquete 3D; `src/style.css`, `video.css` e `voyage-route.css` a identidade.
- `ASSETS.md` — procedência e prompts das imagens; `README.md` — o README original.
- Assets usados pelo site já estão em `../images/` e `../videos/` (só os referenciados). No original há ainda os PNGs de origem e os cortes v1/v2 do filme.

Para gerar de novo (Node 22+):

```sh
cd site-codex
npm install
npx vite build --configLoader native --base=./ --outDir ../../dist-tmp
# copiar index-video.html → ../index.html, index.html → ../imagens.html, assets/ → ../assets/
# e trocar "/images/" "/videos/" por "images/" "videos/" no JS (e url(/images/) por url(../images/) no CSS)
```

## prototipo

- `index.html` + `src/hero/main.js` + `src/hero/hero.css` — a página; `src/audio.js` — o som sintetizado.
- `scripts/encode-film.sh` — codifica o filme para scrub por scroll (keyframe a cada 6 quadros); `scripts/build-hero-film.sh` — a montagem antiga por trechos.
- `storyboard-secao1.md` — o storyboard e os prompts dos keyframes.
- O filme final (`../hero/film.mp4`) é um take de 30 s do Seedance 2.5 mais uma extensão de 24 s do mesmo plano. Os takes brutos, os keyframes aprovados e as tentativas anteriores (≈ 800 MB) ficaram só no original: `Cuzeiro/site/public/hero/raw/` (`sd30.mp4`, `sd24.mp4`, `film-master.mp4`), `Cuzeiro/material/keyframes/` e `Cuzeiro/imagens/`.

Para gerar de novo:

```sh
cd prototipo
npm install
npx vite build --base=./
# copiar dist/index.html → ../prototipo.html e dist/assets/ → ../assets/; o poster e o filme já estão em ../hero/
# no JS gerado, trocar o seletor de /hero/film-1920|1280.mp4 por "hero/film.mp4"
```

## Pendências anotadas para quando o projeto for revisitado

- Verde oficial da iGreen no protótipo (placeholder `#1fae5a` / lima `#b7f04a` em `src/hero/hero.css`).
- Pasta do hub com 41 MB por causa dos dois vídeos; `videos/voyage-complete-v3.mp4` (21,7 MB) aceita re-encode para ~10 MB.
- No filme do protótipo, ~3 s da festa com pessoas dentro da piscina; refazer a extensão custa 168 créditos no Higgsfield.
