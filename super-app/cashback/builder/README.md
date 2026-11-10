# Cashback · builder

**O que é.** Uma proposta de UX para pagar com cashback no app do cliente iGreen, com duas partes:
- uma apresentação para os heads, do problema ao pedido de decisão;
- um protótipo navegável com 32 fluxos.

Esta pasta guarda a pesquisa e o bastidor que geraram os dois. As regras, os valores, os clientes e os telefones dos protótipos são fictícios.

**Origem.** Migrado de [snksergio/igreen-cashback-prototipo](https://github.com/snksergio/igreen-cashback-prototipo) (commit `5cfaf6c`) em 2026-11-10. Veio junto a pesquisa que estava no workspace local do Sergio:
- `03-areas/growth/investigacoes/2026-10-16-pagamento-universal/`;
- `06-sandbox/2026-10-16-pagamento-universal-telas/`;
- o README de `06-sandbox/2026-10-26-apresentacao-cashback/`.

Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

## Estado atual

**Pronto:**
- **Apresentação:** 21 slides e 3 de apêndice, com animação.
- **Protótipo:** 32 fluxos.
- **Pesquisa:**
  - benchmark de 13 apps, em duas rodadas;
  - service blueprint dos 3 produtos;
  - pauta das regras para as áreas;
  - respostas da base interna;
  - roteiro do teste de usabilidade.
- **Teste simulado:** 3 sessões fictícias, com síntese e revisão de evidência. Não é evidência sobre o cliente: serviu para testar o processo.
- **Medição:** um resumo do plano, em `rascunhos/fluxo-completo-skills.md`. O plano completo não foi guardado.

**Pela metade:**
- Nada foi testado com cliente real.
- As regras de cashback são fictícias e esperam decisão.
- O Sergio ia mandar um simulador para virar slide; não chegou.

## Decisões tomadas

- **Regras e valores fictícios, com selo em cada slide** (fato, fonte pública, fictício, simulado, sem dado): as regras reais não existem ainda, e a apresentação pede essa decisão.
- **Sem datas nas versões da apresentação:** é uma ideia de como podemos trabalhar, não um cronograma (pedido do Sergio).
- **A abertura mostra a motivação e a análise da base interna, e o pedido fica no fim** (pedido do Sergio).
- **"O UX conduz, os agentes ajudam":** a apresentação deixa claro que o humano avalia e decide, e que os agentes são construídos com o Claude e refinados a cada projeto (pedido do Sergio).
- **Telas sem moldura e sem sombra:** só a tela do protótipo, e a moldura do celular é desenhada em CSS na apresentação. As capturas com moldura saíam cortadas.
- **Animação sem biblioteca externa** (Web Animations API e CSS): abre sem internet, menos a fonte Manrope, e respeita "reduzir movimento".
- **Hub público com tudo, inclusive a resposta da base interna:** decisão do Sergio na migração.

## Pendências

- **As 5 decisões de regra:**
  1. o cliente pode guardar saldo no app?
  2. quanto o cashback rende, e quem paga?
  3. o cashback paga qualquer fatura, e tem validade?
  4. a mensalidade do Club entra no total mostrado?
  5. quem aprova os textos de oferta?
- **O aval para testar com 5 clientes reais.** O roteiro está em [roteiro-teste-usabilidade.md](2026-10-16-pagamento-universal/roteiro-teste-usabilidade.md).
- **O slide do simulador:** espera o arquivo.
- **O número que não fecha no protótipo:** ver "Visto no original".

## Como gerar o resultado e publicar uma mudança

Não tem build. Os arquivos da raiz do projeto são os próprios arquivos de trabalho:

- **`../index.html`, a apresentação, editada direto:**
  - cada slide é uma `<section class="slide">` de 1920×1080;
  - a animação vem do atributo `data-a` (`sobe`, `titulo`, `palavras`, `conta`, `traco`, `cresce`, `pop`) e o atraso, de `data-d`, em segundos;
  - as notas do apresentador ficam em `<aside class="notas">`.
- **`../prototipo/prototipo-cashback.html`, o protótipo, num arquivo só:** a lista da esquerda escolhe o fluxo e a da direita, o passo.
- **`../telas/`, as capturas do protótipo usadas na apresentação,** em 2x, só a área da tela (389×843 px). Para refazer:
  - Playwright com `deviceScaleFactor: 2`;
  - injetar `.celular{transform:none!important;box-shadow:none!important}.tela{border-radius:0!important}`;
  - clicar o fluxo (`.lateral.esq button.fluxo`) e o passo (`.lateral.dir button.passo`);
  - esperar 2,6 s e recortar a área de `.tela`.

  Se o protótipo mudar, refaça as capturas que a apresentação usa.
- **`../img/`:** as ilustrações 3D.

Para publicar, siga a seção 5 do ORQUESTRADOR.md, "Alterar um projeto que já está aqui":
1. clone esparso com `super-app/cashback`;
2. edite os arquivos;
3. atualize `atualizado` no `projeto.json`;
4. refaça os prints se a tela mudou;
5. valide e publique.

## Onde está cada coisa

| O quê | Onde |
|---|---|
| Apresentação | [../index.html](../index.html) · no hub: https://snksergio.github.io/igreen-hub/super-app/cashback/ |
| Protótipo | [../prototipo/prototipo-cashback.html](../prototipo/prototipo-cashback.html) · no hub: https://snksergio.github.io/igreen-hub/super-app/cashback/prototipo/prototipo-cashback.html |
| Investigação: pergunta real, certezas e dúvidas, métodos e achados | [2026-10-16-pagamento-universal/README.md](2026-10-16-pagamento-universal/README.md) |
| Benchmark de pagamento e cashback (rodada 1) | [2026-10-16-benchmark-pagamento-universal.md](2026-10-16-pagamento-universal/2026-10-16-benchmark-pagamento-universal.md) |
| Benchmark de benefícios e clubes (rodada 2) | [2026-10-16-benchmark-beneficios-v2.md](2026-10-16-pagamento-universal/2026-10-16-benchmark-beneficios-v2.md) |
| Service blueprint dos 3 produtos | [blueprint.md](2026-10-16-pagamento-universal/blueprint.md) |
| Pauta das regras para as áreas | [pauta-areas.md](2026-10-16-pagamento-universal/pauta-areas.md) |
| Respostas da base interna | [respostas-base-interna.md](2026-10-16-pagamento-universal/respostas-base-interna.md) |
| Respostas fictícias da pauta, usadas no protótipo | [ficticio-respostas-da-pauta.md](2026-10-16-pagamento-universal/ficticio-respostas-da-pauta.md) |
| Roteiro do teste de usabilidade | [roteiro-teste-usabilidade.md](2026-10-16-pagamento-universal/roteiro-teste-usabilidade.md) |
| Teste simulado: sessões, gabarito, síntese e revisão | [simulacao/](2026-10-16-pagamento-universal/simulacao/) |
| Avaliação do protótipo v1 | [avaliacao-prototipo-v1.md](2026-10-16-pagamento-universal/avaliacao-prototipo-v1.md) |
| Passagem para o design (v1) | [passagem-design-v1.md](2026-10-16-pagamento-universal/passagem-design-v1.md) |
| Primeira versão das telas, versão de teste e propostas de header | [telas/](2026-10-16-pagamento-universal/telas/) |
| Versões intermediárias do protótipo (v1 a v27) | [versoes/](2026-10-16-pagamento-universal-telas/versoes/) |
| Scripts e trechos que montaram as versões | [_blocos/](2026-10-16-pagamento-universal-telas/_blocos/) |
| Benchmark por app, um relatório por agente | [bench/](2026-10-16-pagamento-universal-telas/bench/) |
| Rascunhos: pautas, roteiros, registro do teste das skills e resumo do plano de medição | [rascunhos/](2026-10-16-pagamento-universal-telas/rascunhos/) |
| Protótipos que estavam no OneDrive | [onedrive/](2026-10-16-pagamento-universal-telas/onedrive/) |
| README da pasta das versões | [2026-10-16-pagamento-universal-telas/README.md](2026-10-16-pagamento-universal-telas/README.md) |
| README da pasta da apresentação no workspace | [2026-10-26-apresentacao-cashback/README.md](2026-10-26-apresentacao-cashback/README.md) |
| README do repositório original | [README-original.md](README-original.md) |

## O que ficou de fora

- **`.nojekyll`, do repositório original:** é arquivo de deploy.
- **No workspace local do Sergio:**
  - o registro do teste das skills de UX neste caso (`02-projects/2026-10-ws-ux/testes/2026-10-19-fluxo-completo-pagamento-universal.md`);
  - a pasta da apresentação (`06-sandbox/2026-10-26-apresentacao-cashback/`), que é igual à raiz deste projeto. Só o README dela veio.
- **Na Área de Trabalho do Sergio:**
  - as referências visuais da apresentação (pastas "Relume Demo" e "Motion teste");
  - as ilustrações 3D originais (`Nova pasta/ilustracoes-3d/` e `Relume Demo/igreen-plus/public/assets/`);
  - os originais do OneDrive (`Nova pasta/prototipo-cashback.html` e `fluxo-pagamento-igreen.html`).

## Visto no original

Veio como está:

- **Um número que não fecha no protótipo:** o Retorno mostra R$ 104,55 de cashback ganho, e o Meu cashback mostra R$ 364,55 recebido. A apresentação evita pôr os dois juntos.
- **Dois protótipos diferentes:** `onedrive/prototipo-cashback.html` (23/10) não é igual a `../prototipo/prototipo-cashback.html` (26/10). Vale o da raiz.
- **Um caminho que não existe mais:** `passagem-design-v1.md` cita uma pasta temporária local (`C:\Users\sergi\...`).
- **Caminhos do workspace local:** o apêndice B da apresentação e vários READMEs citam `03-areas/...` e `06-sandbox/...`, que não abrem daqui. Os equivalentes estão na tabela acima.
- **Instruções locais:** `servidor-local.js` serve uma pasta local, e o README original manda baixar o repositório para abrir. No hub, os links já abrem no navegador.

## Para continuar num outro chat

> Continua o projeto `super-app/cashback` do iGreen Hub. Leia antes o ORQUESTRADOR.md e o `builder/README.md` dele.
