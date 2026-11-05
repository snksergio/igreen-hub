# Migração de projetos para o hub

Como trazer para cá um projeto que já existe em outro repositório. Complementa o [ORQUESTRADOR.md](ORQUESTRADOR.md): ele diz como o hub é organizado, este arquivo diz o que muda quando o projeto vem de fora. Vale para qualquer IA e para quem migrar à mão.

Para pedir, no chat do projeto (Claude Code, com `git` e `gh` logados):

> Migra este projeto para o iGreen Hub. Antes, leia e siga o MIGRACAO.md: `gh api repos/snksergio/igreen-hub/contents/MIGRACAO.md -H "Accept: application/vnd.github.raw"`

## 1. Leia o orquestrador primeiro

```bash
gh api repos/snksergio/igreen-hub/contents/ORQUESTRADOR.md -H "Accept: application/vnd.github.raw"
```

Siga o pipeline dele (clone esparso em pasta temporária, estrutura, `projeto.json`, prints, validação, publicação). Nunca clone o hub inteiro.

## 2. Nada é apagado nem tirado do ar

- O repositório original, os arquivos dele e o link publicado ficam como estão. Não edite, não arquive, não apague. Tudo o que for preciso mudar, mude só na cópia do hub.
- No hub, não mexa em pasta de outro projeto.
- Ficar duplicado (original + cópia no hub) é o esperado.

## 3. Veja se o projeto já está no hub

Procure o nome do repositório e a URL publicada em https://snksergio.github.io/igreen-hub/catalogo.js

- **Ficha só com `link` apontando para o original:** use aquela pasta. Copie os arquivos para dentro e tire o `link` da ficha (senão a vitrine continua abrindo o original).
- **Pasta que já tem os arquivos (migrada antes):** é uma atualização. Substitua a cópia pela versão atual do original.
- **Não achou:** projeto novo.

Em todos os casos, `repo` fica apontando para o repositório original e `atualizado` leva a data de hoje.

## 4. Decida o que vai

- **Estático** (HTML, CSS, JS, imagens): copia os arquivos.
- **Com build:** build com caminho relativo, copia só o `dist`.
- **Não cabe no hub** (servidor, API própria, chave, mais de 50 MB, app que segue sendo desenvolvido fora): não copia, só a ficha com `link` (seção 6 do orquestrador).
- **Repositório com mais de um assunto:** um projeto por assunto. Variações do mesmo assunto vão no `acervo`.
- **Caminhos sempre relativos.** Confira que não sobrou `src` ou `href` começando com `/`.
- **Navegação por hash** (`#fluxo/tela`): o link antigo `.../#x/y` tem que abrir igual em `https://snksergio.github.io/igreen-hub/<categoria>/<slug>/#x/y`. Use esses hashes nas `paginas`.

## 5. Nada de Vercel na cópia

- Não copie `vercel.json` nem arquivos de deploy.
- Rotas limpas da Vercel (`/contador`, `/eletroposto`) viram o arquivo de verdade (`contador.html`), nos links e no README.
- Tire endereços `*.vercel.app` de README e comentários. Se um link funcional aponta para outro projeto que já está no hub, troque pelo endereço do hub. Se não está, mantenha e avise no passo 7.

## 6. README da cópia

Se o original tem README, reescreva para o hub, sem instrução de deploy:

- uma ou duas frases do que é;
- `Cópia de <repo> (commit <hash>). O original continua lá e é a fonte: ajustes são feitos nele e copiados de novo para esta pasta.`;
- tabela das páginas com o endereço no hub;
- o que mais for útil do README original (estrutura, parâmetros de URL, pontos de integração).

Exemplos: `mob/hotsite-migre-bandeira`, `mob/live-lancamento`.

## 7. Antes de publicar, mostre e espere o ok

Numa mensagem só:

- categoria, slug, nome e tipo (se a categoria não for óbvia, pergunte);
- se é projeto novo, ficha que já existia ou atualização;
- o que vai ser copiado e o tamanho;
- as `paginas` que viram botão na vitrine;
- o que mudou na cópia em relação ao original (rotas, links, README).

Os dados dos protótipos são fictícios e podem ir. Só pare se achar chave, token, senha ou `.env`.

## 8. Publique

Prints (`--celular` se for app; olhe a capa antes), `node scripts/gerar-catalogo.mjs --checar` sem aviso, um commit por projeto citando o repo e o commit de origem, push.

Se o git pedir identidade, configure só no clone, com o autor dos commits do hub: `git log -1 --format='%an <%ae>'`.

## 9. Confira publicado

Espere a publicação (`gh run watch` no `snksergio/igreen-hub`), abra cada página e veja se carrega sem imagem, CSS ou JS quebrado. Confira também que o link original continua respondendo.

Responda com o link do projeto, o link na vitrine e o link antigo equivalente. Apague a pasta temporária.
