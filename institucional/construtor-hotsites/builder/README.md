# Construtor de hotsites de evento · builder

POC de um construtor em que o marketing da iGreen monta hotsites de evento encaixando peças prontas (feito com [Puck](https://puckeditor.com/), React e Vite), o licenciado gera o próprio link personalizado e as inscrições do formulário ficam numa lista. Inclui o kit premium **iGreen Live**: 12 peças tiradas de uma landing de evento desenhada na mesma POC.

**Origem:** migrado da pasta local `06-sandbox/2026-11-17-construtor-hotsites-eventos/` do workspace (sem git; arquivo mais novo de 2026-11-18) em 2026-11-18. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

O resultado publicado (o app compilado, as páginas estáticas e a landing) fica na raiz do projeto: https://igreen-hub.pages.dev/institucional/construtor-hotsites/

## Estado atual

**Pronto**

- Editor sobre o Puck com gaveta de peças, Estrutura (seções e campos), prévia por tamanho de tela, desfazer, código, imagens e conferência de SEO.
- 33 peças: as 21 padrão (abertura, passo a passo, local, agenda, inscrição, simulador, seção livre com código próprio etc.) e as 12 do kit iGreen Live.
- Modelos: começar do zero, Evento presencial, Live com pré-cadastro, Campanha e **Evento iGreen Live**.
- Quatro exemplos que aparecem sozinhos no painel: iGreen Live BH, Encontro iGreen BH com Thiago, Live Mobi e Migre a bandeira.
- Link do licenciado: `{nome}` e `{cidade}` nos textos e o código dele gravado na inscrição.
- Inscrições gravadas no navegador, com filtro por página e exportação em CSV.
- SEO a partir das peças: título, descrição, Open Graph e dados estruturados (Event, FAQPage, Organization).
- HTML estático de cada página (o que o MVP publicaria), com sitemap, robots.txt e llms.txt.
- Ao escolher um campo na Estrutura ou no painel da direita, a prévia contorna em rosa o elemento que mostra aquele valor.
- **Etapas 1 a 5 do roteiro de construção (2026-11-18):**
  - **Painel:** cards da mesma altura (título em até duas linhas, data do evento numa linha própria, endereço, botões no pé), status, inscritos sobre vagas, busca, filtros que combinam (status, modelo, data do evento, responsável), ordem e grade ou lista. O clique no card abre o espaço da página.
  - **Espaço da página** (`#/pagina/<id ou endereço>`): visão geral com link, QR code e atalhos; inscrições só da página, com filtros, status, detalhe, CSV e ações em lote; resultados com visitas, conversão, funil, origem e ranking de licenciados; links de licenciado com a tela de números que o licenciado vê; configurações (nome, endereço, compartilhamento, publicar, agendar, encerrar, aberto ou fechado, responsáveis, GA4 e Meta, mensagens). O status vale na página pública.
  - **Formulários** (`#/formularios`): biblioteca reaproveitável, construtor com tipos de campo, ajustes, etapas, lógica e regras, três modelos, versão curta na página e o resto em modal, modal direto por qualquer botão e endereço próprio (`#/f/<id>?pagina=<endereço>`). As inscrições mostram uma coluna por campo, também no CSV.
  - **Pagamento simulado:** preço único, lotes por data, cupom e meia-entrada; tela que imita o meio de pagamento, com aprovar e recusar; status pendente, pago, cancelado e estornado. Evento gratuito pula o pagamento.
  - **Comunicação simulada:** texto da confirmação e do lembrete (com quando sairia), adicionar à agenda, ingresso com QR code (`#/ingresso/<código>`) e check-in no celular (`#/checkin/<id ou endereço>`).
  - **Dados de exemplo:** inscrições, visitas e links fictícios (e-mails em `exemplo.com`) para as páginas de exemplo, semeados uma vez por navegador. "Restaurar exemplos" refaz tudo.

**Pela metade ou só ideia**

- Tudo fica no navegador (localStorage): sem login, sem servidor, sem publicação de verdade. Nada é enviado: mensagens e pagamento são simulação.
- A antiga aba geral Inscrições (`#/inscricoes`) saiu do menu (as inscrições agora ficam no espaço de cada página), mas o endereço ainda abre.

## Decisões tomadas

- **Kit Live separado das 21 peças.** A landing premium virou peças novas (`Live*`) em vez de reescrever as antigas, para os modelos e exemplos que já existiam não mudarem.
- **CSS do kit com escopo `.lv`.** O CSS da landing foi convertido para valer só dentro de `<div class="lv">`, para não vazar para a interface do builder nem para as outras peças.
- **Comportamentos em JavaScript puro, num arquivo só** (`src/live/comportamentos.js`). O mesmo arquivo serve ao editor (as peças chamam por efeito do React) e ao HTML estático (liga sozinho pelo `data-lv`).
- **Opção para esconder o cabeçalho e o rodapé padrão** nas configurações da página, porque o kit Live traz os seus.
- **A Inscrição Live pede e-mail**, além de nome, WhatsApp e cidade, porque usa a mesma validação do formulário padrão.
- **Mapa do Brasil só com Minas acesa** e **mapa do local como desenho fixo**: só os textos mudam.
- **Exemplo novo entra uma vez** para quem já tinha páginas salvas; apagado, não volta.
- **Destaque de campo em rosa**, para não confundir com o verde da seção selecionada no Puck.
- **Formulário separado da página (0.1).** A peça de inscrição só aponta para um formulário da biblioteca; as respostas ficam separadas por página. Nome, WhatsApp e o aceite de LGPD não saem do formulário, porque a lista, o check-in e o consentimento dependem deles.
- **Vagas e encerramento:** os da página valem antes dos do formulário, porque o mesmo formulário pode servir a eventos de tamanhos diferentes.
- **O licenciado vê só números (0.2):** visitas, inscrições, conversão e presentes do link dele, nunca nome ou contato.
- **Publicação sem aprovação (0.4):** quem tem acesso ao construtor publica, agenda e encerra direto.
- **Pagamento (0.3):** a meia-entrada é metade do preço do lote e o cupom vale depois da meia. Recusa deixa a inscrição pendente. Na POC não há campo de cartão: a tela só imita o meio de pagamento.
- **Visitas contam uma vez por aba** e só com a página no ar. Página rascunho ou agendada mostra um aviso no topo e o formulário funciona como prévia, sem gravar.
- **Escolhas de quem usa a POC:** a landing segue o visual do site iGreen Live (Instrument Sans, fundo #010702, limão #A8FF35, textura de pontos). Os pedidos e ajustes da conversa que gerou o kit não estão escritos em outro lugar além deste README e dos comentários no código.

## Pendências e perguntas em aberto

- Etapas 6 (ajustes do kit Live e qualidade) e 7 (o que o projeto real precisa) do roteiro de construção.
- O HTML estático continua com o formulário fixo antigo (nome, WhatsApp, e-mail, cidade): o formulário da biblioteca, o modal e o pagamento rodam só no app.
- O check-in é por busca (nome, código ou final do WhatsApp); ler o QR code pela câmera fica para o projeto real.
- No celular, o botão de menu do topo da Abertura Live não abre nada (igual à landing).
- O mapa do Brasil só sabe destacar Minas Gerais.
- O Vídeo Live aceita `.mp4`, não link do YouTube.
- Textos de exemplo inventados na demo: "82% das vagas preenchidas", os depoimentos e "Metrô Gameleira · 6 min a pé".
- Desempenho não medido: a página do kit Live é pesada (desfoques, vídeo, animações).

## Como gerar o resultado

```bash
cd institucional/construtor-hotsites/builder/poc-puck
npm install
npm test
BASE_URL="https://igreen-hub.pages.dev/institucional/construtor-hotsites/estatico" npm run build:estatico
```

O build sai em `builder/poc-puck/dist/`. Para atualizar o resultado publicado, troque o que está na raiz do projeto pelo conteúdo do `dist` (apague antes `assets/` e `estatico/` da raiz, porque os nomes dos arquivos mudam a cada build) e copie de novo `builder/poc-puck/mockups/landing-evento.html` para `mockups/` da raiz. Para rodar em desenvolvimento: `npm run dev` (abre em `http://localhost:5173`).

Para publicar uma mudança, siga a seção 5 do [ORQUESTRADOR.md](../../../ORQUESTRADOR.md), "Alterar": atualize `atualizado` no `projeto.json`, refaça os prints se a tela mudou, valide e faça o push.

## Onde está cada coisa

| Item | O que é |
|---|---|
| [`poc-puck/`](poc-puck/) | O app: Vite, React, Puck. O [`README.md`](poc-puck/README.md) dele tem a tabela de arquivos |
| [`poc-puck/src/puck/blocks/`](poc-puck/src/puck/blocks/) | As 21 peças padrão, uma por arquivo |
| [`poc-puck/src/puck/blocks/live/`](poc-puck/src/puck/blocks/live/) | As 12 peças do kit iGreen Live e os testes delas |
| [`poc-puck/src/live/`](poc-puck/src/live/) | O que o kit compartilha: CSS (`live.css`), comportamentos e utilitários |
| [`poc-puck/src/templates.ts`](poc-puck/src/templates.ts) | Modelos e exemplos |
| [`poc-puck/src/screens/editor/`](poc-puck/src/screens/editor/) | O editor por cima do Puck (topo, Estrutura, destaque de campo na prévia) |
| [`poc-puck/src/screens/pagina/`](poc-puck/src/screens/pagina/) | Espaço da página: visão geral, inscrições, resultados, links e configurações |
| [`poc-puck/src/screens/formulario/`](poc-puck/src/screens/formulario/) | Biblioteca e construtor de formulário |
| [`poc-puck/src/form/`](poc-puck/src/form/) | O formulário que roda na página: versão curta, modal, pagamento simulado e confirmação |
| [`poc-puck/src/lib/`](poc-puck/src/lib/) | Regras sem tela: páginas, status, formulários, ingresso, inscrições, visitas, links e os dados de exemplo (`exemplo.ts`) |
| [`poc-puck/mockups/landing-evento.html`](poc-puck/mockups/landing-evento.html) | A landing iGreen Live de um arquivo só, de onde saiu o kit. A cópia de segurança está ao lado |
| [`README-original.md`](README-original.md) | O README da pasta original, como estava |

## O que ficou de fora

- `node_modules` e `poc-puck/dist` (o `dist` é o resultado na raiz do projeto). Não havia `.env`, chave ou dado real de cliente.
- **Estudos e referências**, tirados do Hub em 2026-11-18, a pedido, por serem material de bastidor: o benchmark de construtores, o desenho e o plano da POC, o mockup que comparou as direções de cor do editor (`poc-puck/mockups/editor.html`) e a pasta `referencias/` com os prints de sites de terceiros. Estão na pasta local do workspace, `06-sandbox/2026-11-17-construtor-hotsites-eventos/`. O [`README-original.md`](README-original.md) e o [`poc-puck/README.md`](poc-puck/README.md) ainda citam esses arquivos, porque vieram como estavam.

## Visto no original

- O [`poc-puck/README.md`](poc-puck/README.md) ainda fala em 21 peças e não cita o kit Live nem as telas novas. Veio como estava.
- Algumas imagens dos exemplos (o eletroposto do Mobi) apontam para o endereço antigo do Hub (`snksergio.github.io/igreen-hub/...`), que continua no ar. As fotos e vídeos do kit vêm do site iGreen Live (`snksergio.github.io/igreen-eventos-v2/`).
- O `robots.txt`, o `llms.txt` e o `estatico/sitemap.xml` que o build gera ficam dentro da pasta do projeto, não na raiz do site, então não valem como robots e sitemap do domínio: são só a amostra do que o MVP publicaria.

Para continuar num outro chat: "Continua o projeto `institucional/construtor-hotsites` do iGreen Hub. Leia antes o ORQUESTRADOR.md e o `builder/README.md` dele."
