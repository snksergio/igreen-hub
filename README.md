# iGreen Hub

Os protótipos, POCs, hotsites, landing pages e propostas iGreen num lugar só, com uma vitrine para achar e abrir cada um.

**Vitrine:** https://snksergio.github.io/igreen-hub/

> **IA:** antes de subir ou alterar qualquer coisa aqui, leia o [ORQUESTRADOR.md](ORQUESTRADOR.md) e siga o pipeline dele.

## Como está organizado

Cada projeto mora em `<categoria>/<slug>/`, com uma ficha `projeto.json` e os prints em `_vitrine/`. O endereço publicado segue a pasta: `snksergio.github.io/igreen-hub/mob/hotsite-migre-bandeira/`.

| Arquivo | Para que serve |
|---|---|
| `ORQUESTRADOR.md` | As regras e o pipeline de subir e alterar projetos |
| `categorias.json` | As categorias e os tipos de projeto |
| `index.html` | A vitrine |
| `scripts/gerar-catalogo.mjs` | Junta as fichas em `catalogo.js`, que a vitrine lê (roda sozinho na publicação) |
| `scripts/capturar-telas.mjs` | Tira os prints da vitrine com o Chrome ou o Edge |
| `.github/workflows/publicar.yml` | Publica no GitHub Pages a cada push na `main` |

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

## Ver a vitrine no computador

```bash
node scripts/gerar-catalogo.mjs
```

Depois abra o `index.html` no navegador.
