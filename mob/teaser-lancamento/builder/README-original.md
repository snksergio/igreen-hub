# iGreen MOB · Lançamento

Duas propostas independentes do hotsite existente, em uma seção:

- `dist/index.html`: painel de navegação, estrada com efeitos de movimento e contador integrado.
- `dist/revelacao.html`: carro e eletroposto alternados em uma composição de estúdio escuro.

Lançamento configurado para **1 de novembro de 2026, às 20h de Brasília**, em `dist/config.js` (`2026-11-01T20:00:00-03:00`). O contador utiliza o relógio do visitante e não reinicia ao recarregar. Após a data, zera e mostra a mensagem de lançamento. O destino opcional permanece vazio até definir o endereço final do site.

O botão Salvar a data baixa um arquivo de calendário. A pausa controla os efeitos visuais; a contagem continua. A preferência por movimento reduzido é respeitada. As duas propostas incluem navegação para comparação.

As imagens são originais geradas por IA; os movimentos são efeitos da página, não vídeos. Arquivos originais em `visuals/`, versões otimizadas em `dist/assets/` e prompts em `VISUAIS.md`.

Prévia local: `node preview.cjs`, porta 4182. Publicação estática usa `dist/`.
