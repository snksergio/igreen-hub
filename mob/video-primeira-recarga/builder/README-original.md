# Primeira Recarga — vídeo (Remotion)

Apresentação da jornada de primeira recarga do Conexão Mobi, em 22 cenas.
1920×1080, 30fps, ~2min25.

## Rodar

```bash
npm install
npm run studio      # abre o Remotion Studio para ajustar textos, tempos e cores ao vivo
npm run render PrimeiraRecarga out/video.mp4
```

Neste container o Chromium precisa ser apontado à mão:
```bash
npx remotion render PrimeiraRecarga out/video.mp4 \
  --browser-executable=/caminho/do/chrome --concurrency=2
```
No Windows/macOS o Remotion baixa o próprio Chromium e o flag não é necessário.

## Estrutura

- `src/theme.ts` — tokens de cor, tipografia e grid
- `src/data.ts` — **todo o conteúdo**: os 13 momentos, falas, dores e as duas curvas emocionais
- `src/ui.tsx` — componentes (título com serifa itálica, chips, barras, contadores, disco 3D)
- `src/icons.tsx` — 13 pictogramas que se desenham na entrada
- `src/scenes/` — intro, momento, outro
- `src/Root.tsx` — a montagem e as transições
- `public/fonts/` — Instrument Sans, Instrument Serif e DM Mono locais (o render não depende de rede)

Para mudar um texto, edite `src/data.ts`. Para mudar o ritmo, o campo `dur` de cada
momento (em frames, 30 = 1 segundo).

## Licença do Remotion

O Remotion é gratuito para pessoas físicas, ONGs e empresas com **até 3 funcionários**.
Uso em produção na iGreen exige licença comercial (Remotion Pro).
