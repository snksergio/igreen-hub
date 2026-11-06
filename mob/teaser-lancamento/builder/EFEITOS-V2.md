# Efeitos V2

Dark V2: luz intermitente suave em ciclo de 14 segundos, máscara luminosa pelo cursor e botão Acender para visualização completa por mouse, toque ou teclado. Pausa e movimento reduzido interrompem os pulsos. O contador continua independente.

Painel V2: cenário separado do carro. Terreno e asfalto avançam em camadas com perspectiva; carro tem oscilação leve de suspensão. É uma animação 2,5D de imagens, não um vídeo nem um modelo 3D. As montanhas ao longe permanecem praticamente fixas, reforçando a profundidade.

Cópias anteriores: `dist/revelacao-dark-v2-sem-efeito.html` e `dist/painel-v2-sem-movimento.html`. As páginas V1 permanecem intactas.

Imagens geradas pela ferramenta imagegen integrada, em modo de edição. Originais em `visuals/`, versões de publicação em `dist/assets/`.

## dark-v2-lit.png / dark-v2-lit.webp
Edit lighting only. Preserve EXACT pixel composition, camera, object shapes, car silhouette, wheels, cable and charging pedestal positions and sizes of reference. This is a second lighting pass to overlay on this same image for an interactive spotlight. Illuminate the emerald green car body and emerald green EV pedestal with a large soft overhead street lamp. Reveal beautiful vivid deep emerald metallic paint, realistic details, silver wheels, glass and green charger. Keep entire background pure black and unchanged. Do not move, resize, redesign or add anything. Preserve aspect ratio 1672 by 941. No text, no logos. Car and charger should be clearly visible with rich color, like light switched on in same dark studio.

## road-clean.png / road-clean.webp
Edit target image: remove ONLY the green car and its red reflection/shadow from this highway image, reconstruct empty road and center lane markings seamlessly in that area. Preserve exact camera, crop, horizon, road edge lines, perspective, scenery, colors and all other pixels as closely as possible. No new objects. Same 1672x941 composition. This is a clean background plate for animation.

## car-driving.png / car-driving.webp
Extract only the exact emerald green car seen from behind in this image onto a fully transparent background. Preserve this vehicle's exact rear view, shape, proportions, lights, wheels, paint, and original lighting. Remove every piece of road, sky, terrain and reflections. Tight crop around the complete car with small transparent padding. No new vehicle, do not rotate or redesign it. Transparent PNG cutout asset for compositing animation.

O recorte do carro possui canal alfa, preservado na conversão WebP. Não executar build-v2.cjs para recompilar os efeitos: esse arquivo registra a criação inicial das páginas V2. As páginas finais são arquivos estáticos editados diretamente.
