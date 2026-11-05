# Let's Go Cruzeiro 2026

Hotsite da viagem de premiação Let's Go Cruzeiro iGreen 2026 (29/11 a 02/12/2026). A página é um dia a bordo em um único plano contínuo de 54 s, gerado por IA e controlado pelo scroll: chegada ao navio, deck da piscina, promenade, restaurante, teatro da convenção, festa noturna e o navio iluminado, fechando com "Você fez por merecer. Agora, viva." e as datas e regras da campanha.

Cópia do projeto local `Cuzeiro/site` (sem repositório; build do Vite com base relativa, feito em 2026-11-05). A fonte continua lá: ajustes são feitos nela e copiados de novo para esta pasta.

| Página | Endereço no hub |
|---|---|
| Abrir a viagem | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/ |
| Datas e regras | https://snksergio.github.io/igreen-hub/institucional/cruzeiro-2026/#trip |

## Estrutura

- `index.html` — a página (portão de entrada com escolha de som, filme, relógio de bordo, capítulos e seção "Minha viagem").
- `assets/` — JS e CSS gerados pelo build (Lenis para o scroll suave; áudio sintetizado em WebAudio, só se a pessoa escolher "Embarcar com som").
- `hero/film.mp4` — o filme (720p, 54 s, codificado com keyframe a cada 6 quadros para o scrub por scroll) e `hero/poster-start.jpg`.

## Como foi feito

Filme: Seedance 2.5 via Higgsfield, um take de 30 s a partir de um keyframe do navio mais uma extensão de 24 s do mesmo plano, com o roteiro segundo a segundo no prompt. Keyframes dos ambientes gerados no ChatGPT e no Higgsfield a partir dos vídeos das edições anteriores. Fontes: Barlow Condensed, Damion e DM Sans (Google Fonts). Dados e pessoas são fictícios.
