# Card de Reconhecimento · app do licenciado

Proposta do card de Reconhecimento na home do app do licenciado, levando para o app o que o escritório virtual já mostra: dias qualificados, prévia do mês, faixa de Green Points e PRO por vertical. São duas versões, e a Versão 2 foi a aprovada. Os números são de exemplo.

Cópia de [snksergio/app-licenciado-card](https://github.com/snksergio/app-licenciado-card) (commit 49f8931). O original continua lá e é a fonte: ajustes são feitos nele e copiados de novo para esta pasta.

| Página | Arquivo | No hub |
| --- | --- | --- |
| Documentação (V1 e V2) | `documentacao.html` | https://igreen-hub.pages.dev/app-licenciado/reconhecimento/documentacao.html |
| Protótipo da Versão 2 | `prototipo-v2.html` | https://igreen-hub.pages.dev/app-licenciado/reconhecimento/prototipo-v2.html |
| Protótipo da Versão 1 | `prototipo.html` | https://igreen-hub.pages.dev/app-licenciado/reconhecimento/prototipo.html |

- `index.html` só redireciona para a documentação.
- A documentação leva os dois protótipos dentro do próprio arquivo (base64, entre `PROTOS-INICIO` e `PROTOS-FIM`), gerados a partir de `prototipo.html` e `prototipo-v2.html`. Por isso ela abre sozinha.
- Cada fluxo da documentação tem um endereço próprio pelo `#`: `#v1-card`, `#v1-dias`, `#v1-mes`, `#v1-hist`, `#v2-card`, `#v2-jornada`, `#v2-mes`, e as considerações `#web`, `#decisoes`, `#validar`, `#compara`.
- O seletor no topo da documentação leva à da [Minha jornada](../minha-jornada/), que é outro projeto do hub.

Site estático, sem build: abre direto no navegador. Só carrega a fonte Outfit do Google Fonts.

## Fora desta pasta

- O pacote para o desenvolvedor converter a Versão 2 para React Native (telas, guia, tokens e tipos) está só no original, em zip: https://snksergio.github.io/app-licenciado-card/reconhecimento-v2-handoff.zip
- A Versão 2 no Figma: https://www.figma.com/design/g8XLwtmArweTbOrj9jcF58/App-iGreen-Energy?node-id=8276-221
