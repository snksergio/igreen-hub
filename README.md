# iGreen Hub

Os protótipos, POCs, hotsites, landing pages e propostas iGreen num lugar só, com uma vitrine para achar e abrir cada um.

**Vitrine:** https://igreen-hub.pages.dev/

O endereço antigo, https://snksergio.github.io/igreen-hub/, continua no ar e atualizado, para os links já compartilhados.

> **IA:** antes de subir ou alterar qualquer coisa aqui, leia o [ORQUESTRADOR.md](ORQUESTRADOR.md) e siga o pipeline dele.

## Como está organizado

Cada projeto mora em `<categoria>/<slug>/`, com uma ficha `projeto.json` e os prints em `_vitrine/`. O endereço publicado segue a pasta: `igreen-hub.pages.dev/mob/hotsite-migre-bandeira/`.

| Arquivo | Para que serve |
|---|---|
| `ORQUESTRADOR.md` | As regras e o pipeline de subir e alterar projetos |
| `MIGRACAO.md` | O passo a passo para trazer um projeto que já existe em outro repositório |
| `categorias.json` | As categorias e os tipos de projeto |
| `index.html` | A vitrine |
| `scripts/gerar-catalogo.mjs` | Junta as fichas em `catalogo.js`, que a vitrine lê (roda sozinho na publicação) |
| `scripts/capturar-telas.mjs` | Tira os prints da vitrine com o Chrome ou o Edge |
| `.github/workflows/cloudflare.yml` | Publica no Cloudflare Pages, o endereço principal, a cada push na `main`. Envia só os arquivos que mudaram |
| `.github/workflows/publicar.yml` | Publica no GitHub Pages, o endereço antigo, a cada push na `main` |

## Como subir um projeto

No Claude Code, dentro da pasta do projeto:

> Sobe esse projeto no igreen-hub. Antes, leia o ORQUESTRADOR.md de snksergio/igreen-hub.

Para não precisar repetir isso, cole no seu `~/.claude/CLAUDE.md`:

```markdown
## iGreen Hub
Quando eu pedir para subir ou alterar um projeto no hub (igreen-hub), leia antes as regras com
`gh api repos/snksergio/igreen-hub/contents/ORQUESTRADOR.md -H "Accept: application/vnd.github.raw"`
e siga o pipeline de lá. Nunca clone o repositório inteiro.
```

Daí em diante basta dizer "sobe isso no hub".

## Como migrar um projeto de outro repositório

No chat do projeto, no Claude Code:

> Migra este projeto para o iGreen Hub. É só organização: não altere o projeto. Antes, leia e siga o MIGRACAO.md: `gh api repos/snksergio/igreen-hub/contents/MIGRACAO.md -H "Accept: application/vnd.github.raw"`

Migrar é organizar, não revisar: os arquivos vão para a pasta certa e os links passam a funcionar no hub, mas o projeto em si não muda. O original continua no ar e intocado; a cópia no hub aponta para ele em `repo`. O chat lista o que o repositório tem e você escolhe, item por item: **só o resultado** (para mostrar) ou **completo** (com código-fonte, estudos e documentação no `builder/`, para continuar o trabalho num outro chat a partir do hub). Detalhes no [MIGRACAO.md](MIGRACAO.md).

## Ver a vitrine no computador

```bash
node scripts/gerar-catalogo.mjs
```

Depois abra o `index.html` no navegador.
