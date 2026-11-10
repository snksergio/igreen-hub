# Migração de projetos para o hub

Como trazer para cá um projeto que já existe em outro repositório. Complementa o [ORQUESTRADOR.md](ORQUESTRADOR.md): ele diz como o hub é organizado, este arquivo diz o que muda quando o projeto vem de fora. Vale para qualquer IA e para quem migrar à mão.

**Migrar é organizar, não revisar.** O objetivo é centralizar: pôr os arquivos na pasta certa do hub e fazer tudo funcionar aqui, com os links e as referências apontando para o lugar certo. O projeto chega como está. O código, o texto, o design, os dados e o comportamento não mudam. Corrigir ou ajustar o projeto é outro trabalho, feito depois, na fonte (seção 2).

Para pedir, no chat do projeto (Claude Code, com `git` e `gh` logados):

> Migra este projeto para o iGreen Hub. É só organização: não altere o projeto. Antes, leia e siga o MIGRACAO.md: `gh api repos/snksergio/igreen-hub/contents/MIGRACAO.md -H "Accept: application/vnd.github.raw"`

## 1. Leia o orquestrador primeiro

```bash
gh api repos/snksergio/igreen-hub/contents/ORQUESTRADOR.md -H "Accept: application/vnd.github.raw"
```

Siga o pipeline dele (clone esparso em pasta temporária, estrutura, `projeto.json`, prints, validação, publicação). Nunca clone o hub inteiro.

## 2. Liste o que tem e pergunte o modo de cada item

Antes de copiar qualquer coisa, liste para o usuário o que o repositório tem: cada página ou conjunto de páginas, de que assunto é, e do que depende (CSS, JS, imagens, código-fonte, scripts, estudos, documentação). Assuntos diferentes viram projetos diferentes no hub (seção 6).

Para cada item, o usuário escolhe um de dois modos. Se ele não disse, pergunte; não decida por ele.

| Modo | O que vai | Para quê | Onde fica a fonte depois |
|---|---|---|---|
| **Só o resultado** | O HTML final e o que ele carrega (CSS, JS, imagens, fontes) | Mostrar e compartilhar | No original. Ajustes são feitos lá e a cópia do hub é refeita |
| **Completo** | O resultado e tudo o que gera e explica ele: código-fonte, scripts, `package.json` e lockfile, estudos, versões antigas, referências, documentação, `CLAUDE.md` e notas do projeto | Continuar o trabalho depois, num outro chat, a partir do hub | No hub. O original fica intocado, só como registro |

Exemplo de resposta: "cashback só o resultado; faturas e os outros completos".

**No modo completo:**

- O resultado fica na raiz da pasta do projeto (o que a vitrine abre), como no modo só o resultado.
- O resto vai para `builder/`, **na mesma organização de pastas do original**. Não reorganize.
- Se o original gera o resultado com build ou script, eles vão junto e o README diz como rodar. Se o resultado é o próprio arquivo de trabalho, ele fica na raiz e o `builder/` leva o resto.
- O `builder/` não aparece na vitrine: não entra em `paginas` nem em `versoes` (seção 2 do orquestrador).
- O `builder/README.md` é a porta de entrada do próximo chat (seção 8). O README do original, se houver, vira `builder/README-original.md`, com o texto como está.

**Fica de fora, nos dois modos**, e é listado no README do `builder/` quando for o modo completo: `.git`, `node_modules`, cache e pastas de build intermediárias, `.env`, chave, token e senha, arquivo acima de 25 MB (seção 6) e fonte pesada (psd, fig, vídeo bruto). O hub é público, e o `builder/` também: dado real de cliente e documento interno sensível ficam de fora. Na dúvida, pergunte.

## 3. O que pode mudar na cópia, e o que não pode

**Pode mudar só o que é preciso para o projeto morar e funcionar no hub:**

- a pasta: os arquivos vão para `<categoria>/<slug>/` (e `<categoria>/<slug>/builder/`, no modo completo), com `projeto.json` e `_vitrine/`;
- caminhos: os absolutos (`/img/x.png`) viram relativos (`img/x.png`);
- rotas de deploy: as limpas (`/contador`) viram o arquivo de verdade (`contador.html`);
- links: entre as páginas do próprio projeto e para outros projetos que já estão no hub;
- referências ao endereço antigo (Vercel, o GitHub Pages do repositório de origem) em README e comentários (seção 7);
- arquivos de deploy ficam de fora (`vercel.json`, `netlify.toml`, `CNAME`, workflows), assim como o que a seção 2 manda deixar de fora;
- os READMEs (seção 8).

**Não pode mudar:**

- bug, texto, layout, cor, componente, animação ou comportamento;
- dados, mesmo os de exemplo, e imagens;
- nomes de arquivo e estrutura de pastas do projeto, além do necessário para os caminhos funcionarem;
- código: nada de refatorar, minificar, otimizar imagem, atualizar biblioteca ou apagar o que parece sem uso.

**Viu algo quebrado ou estranho no original?** Não conserte. Copie como está e liste no passo 9, em "visto no original". O mesmo vale para o que o orquestrador pediria num projeto novo e que mexeria no projeto, como separar estudo e telas finais num gerador de output: chega como está, e fica para quando o trabalho continuar.

**Única parada obrigatória:** chave, token, senha ou `.env`. Isso não vem para o hub. Pare e avise.

## 4. Nada é apagado nem tirado do ar

- O repositório original, os arquivos dele e o link publicado ficam como estão. Não edite, não arquive, não apague. O que precisar mudar (seção 3), mude só na cópia do hub.
- No hub, não mexa em pasta de outro projeto.
- Ficar duplicado (original + cópia no hub) é o esperado.

## 5. Veja se o projeto já está no hub

Procure o nome do repositório e a URL publicada em https://igreen-hub.pages.dev/catalogo.js

- **Ficha só com `link` apontando para o original:** use aquela pasta. Copie os arquivos para dentro e tire o `link` da ficha (senão a vitrine continua abrindo o original).
- **Pasta que já tem os arquivos, migrada no modo só o resultado:** é uma atualização. Substitua a cópia pela versão atual do original.
- **Pasta migrada no modo completo** (tem `builder/README.md` dizendo que a fonte é o hub): **não substitua.** O trabalho pode ter continuado aqui depois da migração. Mostre ao usuário o que mudou no original e no hub desde a migração e pergunte o que fazer.
- **Não achou:** projeto novo.

Em todos os casos, `repo` fica apontando para o repositório original. `atualizado` leva a data da última mudança no original, não a de hoje: o último commit (`git log -1 --format=%cs`) ou, sem git, a data do arquivo mais novo. Migrar não é mexer no projeto, e a vitrine ordena por essa data.

## 6. Decida como cada item vai

- **Estático** (HTML, CSS, JS, imagens): copia os arquivos.
- **Com build:** build com caminho relativo, copia o `dist` para a raiz da pasta. O build não muda o projeto, só gera os arquivos. No modo completo, o código-fonte vai para o `builder/`.
- **Não cabe no hub** (servidor, API própria, chave, projeto com mais de 50 MB, app que segue sendo desenvolvido fora): não copia, só a ficha com `link` (seção 6 do orquestrador). Aí a busca da vitrine não lê o texto do projeto, só a ficha: capriche na `descricao` e nas `tags`.
- **Arquivo acima de 25 MB** (em geral, vídeo): não copie. O Cloudflare recusa e a publicação do hub inteiro falha, não só a deste projeto. Mostre no passo 9 e pergunte: comprimir muda o projeto, então só com o ok do usuário.
- **Repositório com mais de um assunto:** um projeto do hub por assunto, cada um na sua pasta e com o seu modo. As páginas vão como estão; só a separação em pastas é nova. Variações do mesmo assunto vão no `acervo`.
- **Navegação por hash** (`#fluxo/tela`): o link antigo `.../#x/y` tem que abrir igual em `https://igreen-hub.pages.dev/<categoria>/<slug>/#x/y`. Use esses hashes nas `paginas`. A busca não separa o texto de cada tela de um app numa página só, então cada página precisa do nome do que a tela mostra.

## 7. Nada de Vercel na cópia

- Não copie `vercel.json` nem arquivos de deploy.
- Rotas limpas da Vercel (`/contador`, `/eletroposto`) viram o arquivo de verdade (`contador.html`), nos links e nos READMEs.
- Tire endereços `*.vercel.app` de READMEs e comentários. Se um link funcional aponta para outro projeto que já está no hub, troque pelo endereço do hub. Se não está, mantenha e avise no passo 9.

## 8. READMEs

**Modo só o resultado.** Se o original tem README, reescreva para o hub, sem instrução de deploy:

- uma ou duas frases do que é;
- `Cópia de <repo> (commit <hash>). O original continua lá e é a fonte: ajustes são feitos nele e copiados de novo para esta pasta.`;
- tabela das páginas com o endereço no hub (`https://igreen-hub.pages.dev/<categoria>/<slug>/...`);
- o que mais for útil do README original (estrutura, parâmetros de URL, pontos de integração).

Exemplos: `mob/hotsite-migre-bandeira`, `mob/live-lancamento`.

**Modo completo.** O `builder/README.md` é escrito para quem vai continuar o projeto num outro chat, sem a conversa de hoje. Escreva com o que você sabe pelos arquivos e pela conversa com o usuário. O que você não sabe, diga que não sabe; não invente.

- **O que é**, em uma ou duas frases.
- **Origem:** `Migrado de <repo> (commit <hash>) em <data>. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.`
- **Estado atual:** o que está pronto, o que está pela metade.
- **Decisões tomadas**, cada uma com o porquê, curto.
- **Pendências** e perguntas em aberto.
- **Como gerar o resultado** (os comandos) e como publicar uma mudança (seção 5 do orquestrador, "Alterar").
- **Onde está cada coisa:** tabela com o link de cada pasta ou arquivo importante.
- **O que ficou de fora** e onde está (no original, numa pasta local).
- **Visto no original:** o que parecia quebrado ou estranho e veio como está.
- Se veio um `CLAUDE.md` do original: `O CLAUDE.md desta pasta é do original. Onde ele divergir deste README (deploy, caminhos), vale este README.`

Exemplo de builder com código-fonte, comandos e pendências: `institucional/cruzeiro-2026/builder/README.md`.

Para continuar depois, num outro chat: "Continua o projeto `<categoria>/<slug>` do iGreen Hub. Leia antes o ORQUESTRADOR.md e o `builder/README.md` dele."

## 9. Antes de publicar, mostre e espere o ok

**A ficha** (`projeto.json`) segue a seção 3 do orquestrador. Numa migração:

- a `descricao` diz o que é, para quem ou para que serve e os assuntos principais. Tire do README e da conversa com o usuário. Se o objetivo não está claro pelos arquivos, pergunte; não invente;
- as `tags` são os assuntos das telas principais (os títulos, os botões, o que a tela resolve), não o que aparece só no menu;
- cada página tem o nome do que mostra, nunca "Abrir": projeto de uma entrada só também ganha `paginas`, com um nome.

Numa mensagem só:

- os itens e o modo de cada um, com categoria, slug, nome e tipo (se a categoria não for óbvia, pergunte);
- para cada item, se é projeto novo, ficha que já existia ou atualização;
- o que vai ser copiado e o tamanho; no modo completo, o que vai para o `builder/` e o que fica de fora;
- a ficha de cada item: a `descricao`, as `tags` e as `paginas` que viram botão na vitrine, com o nome de cada uma. É a parte que o usuário mais corrige: você conhece os arquivos, ele conhece o objetivo;
- o que mudou na cópia em relação ao original. Deve caber na lista da seção 3: caminhos, rotas, links, referências, READMEs;
- visto no original: o que parece quebrado ou estranho e foi copiado como está.

Os dados dos protótipos são fictícios e podem ir.

## 10. Publique

Prints (`--celular` se for app; olhe a capa antes), `node scripts/gerar-catalogo.mjs --checar` sem aviso, nenhum arquivo acima de 25 MB (`find <categoria>/<slug> -type f -size +25M` não devolve nada), um commit por projeto citando o repo, o commit de origem e o modo, push.

Se o git pedir identidade, configure só no clone, com o autor dos commits do hub: `git log -1 --format='%an <%ae>'`.

## 11. Confira publicado

Uns segundos depois do push, espere a publicação no Cloudflare, que é o endereço principal:

```bash
gh run watch $(gh run list -R snksergio/igreen-hub -w cloudflare.yml -L 1 --json databaseId -q '.[0].databaseId') -R snksergio/igreen-hub --exit-status
```

O push também publica no GitHub Pages, o endereço antigo (workflow `Publicar`). Se só essa falhar, não é erro da migração e não bloqueia: siga. Não use "Re-run" nela, que falha com `Multiple artifacts named "github-pages"`; para tentar de novo, `gh workflow run publicar.yml -R snksergio/igreen-hub`.

Abra cada página em `https://igreen-hub.pages.dev/<categoria>/<slug>/` e no original:

- carrega sem imagem, CSS ou JS quebrado;
- mostra e funciona igual ao original. Diferença que não seja de endereço é erro da migração: volte e corrija a cópia;
- o link original continua respondendo.

No modo completo, confira também que o `builder/README.md` abre no GitHub e que os links da tabela "Onde está cada coisa" levam aos arquivos certos.

Responda com o link do projeto, o link na vitrine e o link antigo equivalente; no modo completo, também o link do `builder/README.md` e a frase para continuar num outro chat. Apague a pasta temporária.
