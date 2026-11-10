# Builder · Minha jornada

Proposta da tela Minha jornada do app do licenciado, a tela de histórico de graduações do Figma. Ela mostra a trilha de Consultor a Acionista, a graduação em progresso com os requisitos, os dias qualificados, as próximas metas e as graduações concluídas. Os números são de exemplo.

Esta pasta não aparece na vitrine. O que se compartilha são as duas páginas da pasta de cima.

## Origem

Migrado de [snksergio/app-licenciado-card](https://github.com/snksergio/app-licenciado-card) (commit 49f8931) em 2026-11-10. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

O original também tinha o card de Reconhecimento, que virou outro projeto do hub: [`app-licenciado/reconhecimento`](../../reconhecimento/). Ele foi migrado só com o resultado e tem a fonte no original.

## Estado atual

- A proposta navegável e a documentação estão prontas. O Sergio informou na migração que a proposta foi aprovada.
- Ainda não foi desenhada no Figma nem tem pacote para o desenvolvedor. Isso só existe para a Versão 2 do Reconhecimento.
- As perguntas de regra de negócio da seção "Pendências" continuam em aberto. Onde a regra não está confirmada, o texto da tela avisa em vez de inventar.

## Decisões tomadas

- **A estrutura do Figma continua.** As abas Pré-qualificação e Qualificação e as seções Em progresso, Próximas metas e Concluídos ficam. O que entra é o que faltava para ler a jornada.
- **Uma trilha das seis graduações no topo.** Só a graduação atual fica maior e com anel, para mostrar onde ele está sem competir com as outras. Cada selo leva ao card daquela graduação.
- **Traços entre os selos:** verdes até onde ele chegou, tracejados até a próxima e cinza depois. Nenhum traço passa por trás dos selos, a pedido do Sergio na revisão.
- **Uma linha de contexto no topo** ("Você é Gestor desde Jun/2026 · rumo a Executivo"), para dar a situação sem precisar abrir os cards.
- **O resumo do progresso vem antes da lista.** "1 de 5 requisitos" aparece com barra segmentada, e cada requisito tem uma barra fina, para ver o todo antes do detalhe.
- **Os dias qualificados mostram a regra** ("62 de 90", "Dias seguidos · faltam 28"). O toque abre a meia-lua, igual às versões 1 e 2 do Reconhecimento, para as três telas falarem do mesmo jeito.
- **Os concluídos mostram quando** cada graduação foi conquistada e quanto tempo levou. As datas são de exemplo.
- **As próximas metas abrem**, mostrando o que vai ser pedido, ainda sem progresso. Acionista avisa que os requisitos aparecem depois.
- **O (i) do topo explica** qualificação, dias qualificados e pré-qualificação.
- **O exemplo é o mesmo das propostas do Reconhecimento** (Gestor, rumo a Executivo, 62 de 90 dias), para dar para comparar as telas lado a lado.
- **Só a versão clara**, a pedido do Sergio. As páginas não têm modo escuro.

## Pendências

Do "Para validar antes de enviar" e da "Ligação com as versões 1 e 2", na documentação:

- Meta dos dias qualificados: o Figma mostra "3 de 10", e o escritório virtual mostra meta de 90 dias. Qual vale? A meta muda por graduação?
- Os dias zeram se a qualificação cair?
- Pré-qualificação: o que é, e quem vê essa aba?
- Na aba Pré-qualificação, "Minha pré-qualificação" mostra E-Expansão, o mesmo nome do card em progresso. Na aba Qualificação, a "minha" é a graduação anterior. Qual é o certo?
- O app tem a data de cada graduação concluída? O frame do Figma se chama "Versão sem histórico".
- Nome repetido: na Versão 2 do Reconhecimento, o painel também se chama "Minha jornada". Um dos dois precisa de outro nome.
- "Ver toda jornada", na home, leva para esta tela ou para o Histórico de Green Points? O pedido original falava em "Consultar Histórico".
- Sugestão em aberto: o sheet de dias qualificados (Versão 1) e o "Rumo a Executivo" (Versão 2) repetem a lista de requisitos desta tela. Lá ficaria um link "Ver minha jornada", e esta tela viraria a fonte completa.

## Como gerar o resultado

- `../prototipo-jornada.html` é o próprio arquivo de trabalho: edite direto.
- `../documentacao-jornada.html` é gerado: nunca edite à mão. Ele junta o `<head>` (os estilos) da documentação do Reconhecimento, o corpo em `jornada-corpo.html` e o protótipo embutido em base64.

Na pasta `app-licenciado/minha-jornada` do clone (Node 18 ou mais novo, sem dependências):

```bash
tmp=$(mktemp -d)
cp ../reconhecimento/documentacao.html prototipo-jornada.html "$tmp"/
node builder/montar-jornada.mjs "$tmp" builder/jornada-corpo.html
node builder/embutir.mjs "$tmp" documentacao-jornada.html jornada=prototipo-jornada.html
cp "$tmp"/documentacao-jornada.html .
rm -rf "$tmp"
```

O `montar-jornada.mjs` grava o resultado na mesma pasta de onde lê a `documentacao.html`, por isso a pasta temporária. Os estilos vêm da documentação do Reconhecimento: se ela for atualizada a partir do original, gerar de novo leva os estilos novos.

Na migração, esses comandos geraram uma `documentacao-jornada.html` idêntica à publicada.

## Como publicar uma mudança

Siga "Alterar um projeto que já está aqui" no [ORQUESTRADOR.md](../../../ORQUESTRADOR.md). No clone esparso, inclua também a pasta do Reconhecimento, que o gerador usa:

```bash
git sparse-checkout set scripts app-licenciado/minha-jornada app-licenciado/reconhecimento
```

Edite, gere de novo, atualize `atualizado` no `../projeto.json`, refaça os prints se a tela mudou, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `app-licenciado/minha-jornada: <o que mudou>`.

Para continuar num outro chat: "Continua o projeto `app-licenciado/minha-jornada` do iGreen Hub. Leia antes o ORQUESTRADOR.md e o `builder/README.md` dele."

## Onde está cada coisa

| Arquivo | O que é |
| --- | --- |
| [`../prototipo-jornada.html`](../prototipo-jornada.html) | A proposta navegável. Aceita comandos por `postMessage` quando está dentro da documentação |
| [`../documentacao-jornada.html`](../documentacao-jornada.html) | A documentação: fluxos, celular com o protótipo, passos, notas e considerações. Gerada |
| [`../index.html`](../index.html) | Só redireciona para a documentação. Criado na migração, com o ok do Sergio, para o endereço da pasta abrir algo |
| [`jornada-corpo.html`](jornada-corpo.html) | O corpo da documentação: fluxos, textos das notas e considerações (`DOC_MUDA`, `DOC_VALIDAR_J`, `DOC_LIGA`) |
| [`montar-jornada.mjs`](montar-jornada.mjs) | Junta o `<head>` da documentação do Reconhecimento com o corpo |
| [`embutir.mjs`](embutir.mjs) | Coloca o protótipo dentro da documentação, entre `PROTOS-INICIO` e `PROTOS-FIM` |
| [`README-original.md`](README-original.md) | O README do repositório original, que fala dos dois projetos |

Cada fluxo da documentação tem endereço próprio pelo `#`: `#trilha`, `#progresso`, `#proximas`, `#concluidos`, `#pre`, `#como`, e as considerações `#muda`, `#validar`, `#ligacao`.

## O que ficou de fora

- O `serve.mjs`, um servidor local usado só para testar. Não faz falta: as páginas abrem direto no navegador.
- A pasta de trabalho local, `D:\Workspace\06-sandbox\2026-10-20-app-reconhecimento-previa`, que tem as mesmas páginas e o pacote de handoff do Reconhecimento.
- As telas de referência no Figma: [3832-6012](https://www.figma.com/design/g8XLwtmArweTbOrj9jcF58/App-iGreen-Energy?node-id=3832-6012) e [3797-6539](https://www.figma.com/design/g8XLwtmArweTbOrj9jcF58/App-iGreen-Energy?node-id=3797-6539).

## Visto no original

- Os três arquivos do gerador não estavam no repositório original: ficavam numa pasta temporária que já tinha sido apagada. Foram recuperados do histórico da conversa em que o projeto foi feito. A primeira cópia recuperada do `montar-jornada.mjs` tinha o título antigo da página ("Minha jornada · proposta"), e a que está aqui é a versão final. Com ela, os comandos acima geram o arquivo publicado sem nenhuma diferença.
- O `index.html` do original só levava à documentação do Reconhecimento. A Minha jornada não tinha entrada própria: o `../index.html` desta pasta é novo, no mesmo modelo.
