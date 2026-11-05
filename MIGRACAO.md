# Migração de projetos para o hub

Como trazer para cá um projeto que já existe em outro repositório. Complementa o [ORQUESTRADOR.md](ORQUESTRADOR.md): ele diz como o hub é organizado, este arquivo diz o que muda quando o projeto vem de fora. Vale para qualquer IA e para quem migrar à mão.

**Migrar é organizar, não revisar.** O objetivo é centralizar: pôr os arquivos na pasta certa do hub e fazer tudo funcionar aqui, com os links e as referências apontando para o lugar certo. O projeto chega como está. O código, o texto, o design, os dados e o comportamento não mudam. Corrigir ou ajustar o projeto é outro trabalho: faz-se no original, e depois a cópia daqui é refeita.

Para pedir, no chat do projeto (Claude Code, com `git` e `gh` logados):

> Migra este projeto para o iGreen Hub. É só organização: não altere o projeto. Antes, leia e siga o MIGRACAO.md: `gh api repos/snksergio/igreen-hub/contents/MIGRACAO.md -H "Accept: application/vnd.github.raw"`

## 1. Leia o orquestrador primeiro

```bash
gh api repos/snksergio/igreen-hub/contents/ORQUESTRADOR.md -H "Accept: application/vnd.github.raw"
```

Siga o pipeline dele (clone esparso em pasta temporária, estrutura, `projeto.json`, prints, validação, publicação). Nunca clone o hub inteiro.

## 2. O que pode mudar na cópia, e o que não pode

**Pode mudar só o que é preciso para o projeto morar e funcionar no hub:**

- a pasta: os arquivos vão para `<categoria>/<slug>/`, com `projeto.json` e `_vitrine/`;
- caminhos: os absolutos (`/img/x.png`) viram relativos (`img/x.png`);
- rotas de deploy: as limpas (`/contador`) viram o arquivo de verdade (`contador.html`);
- links: entre as páginas do próprio projeto e para outros projetos que já estão no hub;
- referências ao endereço antigo (Vercel, o GitHub Pages do repositório de origem) em README e comentários (seção 6);
- arquivos de deploy ficam de fora (`vercel.json`, `netlify.toml`, `CNAME`, workflows), assim como o que o orquestrador manda deixar de fora (`node_modules`, `.git`, `.env`...);
- o README, reescrito para o hub (seção 7).

**Não pode mudar:**

- bug, texto, layout, cor, componente, animação ou comportamento;
- dados, mesmo os de exemplo, e imagens;
- nomes de arquivo e estrutura de pastas do projeto, além do necessário para os caminhos funcionarem;
- código: nada de refatorar, minificar, otimizar imagem, atualizar biblioteca ou apagar o que parece sem uso.

**Viu algo quebrado ou estranho no original?** Não conserte. Copie como está e liste no passo 8, em "visto no original". O mesmo vale para o que o orquestrador pediria num projeto novo e que mexeria no projeto: estudo e telas finais misturados (builder e output, seção 2 do orquestrador) chegam como estão, e separar fica para outro trabalho.

**Única parada obrigatória:** chave, token, senha ou `.env`. Isso não vem para o hub. Pare e avise.

## 3. Nada é apagado nem tirado do ar

- O repositório original, os arquivos dele e o link publicado ficam como estão. Não edite, não arquive, não apague. O que precisar mudar (seção 2), mude só na cópia do hub.
- No hub, não mexa em pasta de outro projeto.
- Ficar duplicado (original + cópia no hub) é o esperado.

## 4. Veja se o projeto já está no hub

Procure o nome do repositório e a URL publicada em https://snksergio.github.io/igreen-hub/catalogo.js

- **Ficha só com `link` apontando para o original:** use aquela pasta. Copie os arquivos para dentro e tire o `link` da ficha (senão a vitrine continua abrindo o original).
- **Pasta que já tem os arquivos (migrada antes):** é uma atualização. Substitua a cópia pela versão atual do original.
- **Não achou:** projeto novo.

Em todos os casos, `repo` fica apontando para o repositório original e `atualizado` leva a data de hoje.

## 5. Decida o que vai

- **Estático** (HTML, CSS, JS, imagens): copia os arquivos.
- **Com build:** build com caminho relativo, copia só o `dist`. O build não muda o projeto, só gera os arquivos.
- **Não cabe no hub** (servidor, API própria, chave, mais de 50 MB, app que segue sendo desenvolvido fora): não copia, só a ficha com `link` (seção 6 do orquestrador).
- **Repositório com mais de um assunto:** um projeto do hub por assunto, cada um com a sua pasta. As páginas vão como estão; só a separação em pastas é nova. Variações do mesmo assunto vão no `acervo`.
- **Navegação por hash** (`#fluxo/tela`): o link antigo `.../#x/y` tem que abrir igual em `https://snksergio.github.io/igreen-hub/<categoria>/<slug>/#x/y`. Use esses hashes nas `paginas`.

## 6. Nada de Vercel na cópia

- Não copie `vercel.json` nem arquivos de deploy.
- Rotas limpas da Vercel (`/contador`, `/eletroposto`) viram o arquivo de verdade (`contador.html`), nos links e no README.
- Tire endereços `*.vercel.app` de README e comentários. Se um link funcional aponta para outro projeto que já está no hub, troque pelo endereço do hub. Se não está, mantenha e avise no passo 8.

## 7. README da cópia

Se o original tem README, reescreva para o hub, sem instrução de deploy:

- uma ou duas frases do que é;
- `Cópia de <repo> (commit <hash>). O original continua lá e é a fonte: ajustes são feitos nele e copiados de novo para esta pasta.`;
- tabela das páginas com o endereço no hub;
- o que mais for útil do README original (estrutura, parâmetros de URL, pontos de integração).

Exemplos: `mob/hotsite-migre-bandeira`, `mob/live-lancamento`.

## 8. Antes de publicar, mostre e espere o ok

Numa mensagem só:

- categoria, slug, nome e tipo (se a categoria não for óbvia, pergunte);
- se é projeto novo, ficha que já existia ou atualização;
- o que vai ser copiado e o tamanho;
- as `paginas` que viram botão na vitrine;
- o que mudou na cópia em relação ao original. Deve caber na lista da seção 2: caminhos, rotas, links, referências, README;
- visto no original: o que parece quebrado ou estranho e foi copiado como está.

Os dados dos protótipos são fictícios e podem ir.

## 9. Publique

Prints (`--celular` se for app; olhe a capa antes), `node scripts/gerar-catalogo.mjs --checar` sem aviso, um commit por projeto citando o repo e o commit de origem, push.

Se o git pedir identidade, configure só no clone, com o autor dos commits do hub: `git log -1 --format='%an <%ae>'`.

## 10. Confira publicado

Espere a publicação (`gh run watch` no `snksergio/igreen-hub`) e abra cada página no hub e no original:

- carrega sem imagem, CSS ou JS quebrado;
- mostra e funciona igual ao original. Diferença que não seja de endereço é erro da migração: volte e corrija a cópia;
- o link original continua respondendo.

Responda com o link do projeto, o link na vitrine e o link antigo equivalente. Apague a pasta temporária.
