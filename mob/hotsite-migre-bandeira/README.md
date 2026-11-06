# iGreen MOB · Migre sua bandeira

Hotsite que o licenciado iGreen envia a donos de eletroposto: proposta de migração de bandeira com simulador de receita e uma página com o eletroposto iGreen em 3D.

Cópia de [snksergio/mob-hotsite](https://github.com/snksergio/mob-hotsite) (commit f0827ba). O original continua lá e é a fonte: ajustes são feitos nele e copiados de novo para esta pasta.

| Página | Arquivo | No hub |
| --- | --- | --- |
| Proposta | `index.html` | https://snksergio.github.io/igreen-hub/mob/hotsite-migre-bandeira/ |
| Eletroposto em 3D | `eletroposto.html` | https://snksergio.github.io/igreen-hub/mob/hotsite-migre-bandeira/eletroposto.html |
| Contagem regressiva · Painel | `contador.html#painel` | https://snksergio.github.io/igreen-hub/mob/hotsite-migre-bandeira/contador.html#painel |
| Contagem regressiva · Revelação | `contador.html#revelacao` | https://snksergio.github.io/igreen-hub/mob/hotsite-migre-bandeira/contador.html#revelacao |

- `contador/`: css, js e imagens da contagem regressiva do lançamento oficial iGreen MOB (10/10/2026, 20h).
- `config.js`: dados do consultor (nome, cidade, WhatsApp, foto). Também dá para passar pelo link:
  `index.html?nome=Thiago%20Souza&cidade=Belo%20Horizonte%20%C2%B7%20MG&whats=5531999999999`

Site estático, sem build: abre direto no navegador.

## POCs (aba da ficha)

Em 2026-11-06, a pedido do usuário, a ficha ganhou uma aba com os POCs que deram origem a páginas deste hotsite. Os arquivos deles **não** estão nesta pasta nem vêm do `mob-hotsite`: cada um continua no seu projeto do hub, que sai da lista principal da vitrine (`"status": "arquivado"`) e aparece aqui. Juntos passariam do limite de 50 MB por pasta.

| POC | Projeto no hub | O que virou aqui |
| --- | --- | --- |
| Site premium v1, v2 e v3 (05/10) | [`mob/site-premium`](../site-premium/) | O hotsite (o simulador das conexões vem do mesmo conteúdo) |
| Estúdio de simulação (07/10) | [`mob/estudio-simulacao`](../estudio-simulacao/) | O simulador 3D da home ("Comece pelo seu posto", 08/10 no `mob-hotsite`) |
| Teaser do lançamento (09 a 11/10) | [`mob/teaser-lancamento`](../teaser-lancamento/) | `contador.html`: o Painel V2 e a Revelação V2, com a data de 10/10 |

Ao copiar o `mob-hotsite` de novo para esta pasta, mantenha o `acervo` do `projeto.json` e as subpastas `_vitrine/premium`, `_vitrine/simulador-3d` e `_vitrine/contagem`.
