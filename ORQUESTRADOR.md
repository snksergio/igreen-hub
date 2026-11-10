# Orquestrador do iGreen Hub

Regras para subir ou alterar um projeto neste repositório. Valem para qualquer IA e para quem mexer à mão. Leia inteiro antes de começar: é curto de propósito.

- Repositório: https://github.com/snksergio/igreen-hub
- Vitrine: https://igreen-hub.pages.dev/
- Endereço de um projeto: `https://igreen-hub.pages.dev/<categoria>/<slug>/`
- Endereço antigo, que continua no ar para os links já compartilhados: https://snksergio.github.io/igreen-hub/ (os mesmos caminhos depois de `/igreen-hub/`)

## 1. O que entra aqui

Projetos simples e estáticos, que abrem no navegador sem servidor: protótipos navegáveis, POCs, hotsites, landing pages, propostas, apresentações e documentações de jornada.

Não entra. O projeto fica onde está e aqui vai só a ficha com o link (seção 6):

- precisa de servidor, banco, API própria ou chave secreta;
- passa de 50 MB ou tem vídeo pesado;
- é um app que continua sendo desenvolvido em outro repositório (no Vercel, por exemplo).

## 2. Estrutura

```
<categoria>/<slug>/
├── projeto.json   obrigatório: a ficha que a vitrine lê
├── _vitrine/      os prints da vitrine: capa.webp, 01.webp, 02.webp... (e uma subpasta por grupo do acervo)
├── index.html     a entrada principal
└── ...            o resto do projeto, organizado como ele quiser
```

- **Categoria**: uma das listadas em `categorias.json`. A categoria é o produto ou a frente (Mob, Green Telecom); o formato vai em `tipo`. Se nenhuma servir ou houver dúvida, pergunte ao usuário. Não crie categoria por conta própria.
- **Slug**: o nome da pasta. Minúsculas, sem acento, palavras separadas por hífen, curto e descritivo: `pagar-fatura`, `hotsite-eletroposto`. Não comece com `igreen-`, o repositório inteiro já é iGreen.
- **Um projeto, uma pasta.** Várias telas do mesmo assunto ficam na mesma pasta, listadas em `paginas`. Versões do mesmo assunto (`faturas-v1.html`, `faturas-v2.html`) também, listadas em `versoes`.
- **Variações vão no acervo, não em projetos novos.** Opções de design de partes do mesmo projeto (heros, rodapés, selos, explorações de um componente) entram no `acervo` da mesma ficha, em grupos (seção 3). Assim a vitrine mostra um card só, e as variações ficam numa aba da ficha.
- **Caminhos sempre relativos** (`assets/logo.svg`, nunca `/assets/logo.svg`): o hub abre em dois endereços, e no antigo o site mora numa subpasta.
- **Não mexa** em pasta de outro projeto, no `index.html` e no `404.html` da raiz (a vitrine e a página de "não encontrado") nem no `catalogo.js` e no `busca.js` (são gerados na publicação). No `_redirects` da raiz, só acrescente linhas, ao mudar um projeto de nome ou de categoria (seção 5).

### Builder e output

Quando o projeto tem estudo por trás (pesquisa, benchmark, matriz de regras, pendências, anotações, versões antigas), separe na mesma pasta o que a pessoa precisa ver do que é bastidor:

```
<categoria>/<slug>/
├── projeto.json          aponta só para o output
├── _vitrine/             prints do output
├── index.html            o output: só as telas finais, é o link que vai para as pessoas
└── builder/              o construtor e o backup do estudo
    ├── README.md         o que tem aqui, onde está cada coisa e como gerar o output
    ├── index.html        o estudo completo
    ├── gerar-output.mjs  gera o ../index.html a partir do estudo
    ├── assets/           arquivos de origem
    └── historico/        versões anteriores, como AAAA-MM-DD-nome.html
```

- **O output é o que se compartilha.** Só as telas finais: sem pesquisa, benchmark, matriz, regras, pendências, anotações nem botões de estudo.
- **O builder não aparece na vitrine.** Ele não entra em `paginas` nem em `versoes`, e os prints de `_vitrine/` são do output.
- **Uma fonte só.** O output é gerado a partir do estudo, nunca editado à mão. No estudo, o que é só de bastidor fica entre os marcadores `estudo:inicio` e `estudo:fim` (no HTML e no CSS) ou atrás de uma flag de modo no JS. O gerador tira os blocos marcados e liga o modo output.
- **Versões antigas que só servem de registro** vão para `builder/historico/`. Ao mover, ajuste os caminhos relativos (`assets/` vira `../assets/`). Se alguém ainda precisa abrir a versão antiga pela vitrine, ela fica na raiz do projeto e entra em `versoes`, como no resto do hub.
- **O README do builder diz onde está cada coisa**, com o link de cada item (estudo, benchmark, histórico). Quem navega pelo GitHub não vê o que está dentro de um HTML.
- **Público mesmo assim.** O builder não aparece na vitrine, mas o repositório é público: quem tiver o endereço abre. Nada de dado real de cliente ou interno sensível no builder.

Use builder e output quando o estudo for grande ou não puder ir para quem vai ver as telas. Projeto simples continua só com o `index.html`. Exemplo: `super-app/fatura-variacoes`.

## 3. projeto.json

```json
{
  "nome": "Pagar fatura",
  "descricao": "Protótipo navegável do pagar fatura: Pix, cartão, boleto, saldo, cashback e comprovante.",
  "tipo": "prototipo",
  "atualizado": "2026-10-29",
  "paginas": [
    { "nome": "Fluxo completo", "arquivo": "index.html" },
    { "nome": "Faturas de energia", "arquivo": "faturas-energia.html" }
  ],
  "tags": ["fatura", "pix", "cartão", "boleto", "cashback", "comprovante"]
}
```

| Campo | Obrigatório | O que é |
|---|---|---|
| `nome` | sim | Nome curto, como aparece no card |
| `descricao` | sim | Uma ou duas frases, até uns 200 caracteres: o que é, para quem ou para que serve, e os assuntos principais. Sem nome de ferramenta ("como no Claude") nem instrução de navegação (zoom, arrastar) |
| `tipo` | sim | Um dos tipos de `categorias.json`: `prototipo`, `poc`, `hotsite`, `landing`, `proposta`, `apresentacao`, `dashboard`, `documentacao`, `tarefa` (telas feitas para atender um pedido, e não um protótipo próprio) |
| `atualizado` | sim | Data da última mudança no projeto, `AAAA-MM-DD`. Atualize a cada alteração do projeto. Mexer só na ficha (descrição, tags, nome de página) não muda a data: a vitrine ordena por ela |
| `paginas` | não | As entradas do projeto, cada uma vira um botão. Sem o campo, a entrada é `index.html` e se chama "Abrir". `arquivo` aceita `#ancora` e `?parametro`. O `nome` diz o que a página mostra: "Abrir", "Protótipo" ou "Início" sozinhos não dizem nada na busca |
| `acervo` | não | As variações do projeto em grupos, numa aba própria da ficha. Veja "Acervo" logo abaixo |
| `versoes` | não | O histórico de versões, da mais nova para a mais antiga: `{ "nome": "v2 · com cashback", "arquivo": "faturas-v2.html", "data": "2026-10-29" }`. A primeira aparece como atual. `arquivo` segue a mesma regra das páginas e também aceita uma URL completa |
| `link` | não | Só quando o projeto mora fora daqui: a URL dele. Aí o `arquivo` de cada página é relativo a esse link |
| `repo` | não | Onde está o código-fonte, se for outro repositório |
| `status` | não | `ativo` (padrão), `rascunho` ou `arquivado` (sai da lista principal e fica no filtro Arquivados) |
| `destaque` | não | `true` põe o projeto no destaque do topo da vitrine, no lugar do atualizado por último. Um projeto por vez: ao destacar outro, tire o `destaque` do anterior. Só com o pedido do usuário |
| `tags` | não | De 5 a 10 assuntos que alguém digitaria para achar o projeto e que não estão no nome: no singular, minúsculas, em português. Sem versão (`v3`) nem formato que o nome já diz (`canvas`). Projeto grande pode ter mais |

A categoria e o slug saem do caminho da pasta, não repita no arquivo.

**A busca da vitrine** lê o nome, a descrição e as tags do projeto, o nome de cada página, versão e item do acervo, e o texto das telas que são um arquivo só. Projeto que mora fora daqui (`link`) ou que é um app numa página só (telas por `#ancora`) não tem texto que a busca leia: nele, a ficha é tudo o que a busca lê, então capriche na descrição e nas tags.

A validação (`node scripts/gerar-catalogo.mjs --checar`, passo 6 da seção 5) avisa quando a descrição passa de 220 caracteres, quando a ficha tem menos de 3 tags e quando falta nome de página (sem `paginas`, a entrada aparece como "Abrir").

### Acervo: as variações em grupos

Use quando o projeto tem muitas variações que se dividem em grupos: as propostas de cada seção de um site, as explorações de um componente, as telas de cada fluxo. Regra prática: mais de 8 entradas, ou entradas que caem em grupos naturais. `paginas` continua com as entradas principais (o projeto em si); o acervo guarda as variações.

Na ficha, o acervo vira uma aba ao lado de "Projeto", com um índice de grupos colapsáveis, a contagem de cada um e um filtro por nome. Com um grupo aberto, a galeria mostra os prints daquele grupo.

```json
"acervo": {
  "nome": "Opções de design",
  "grupos": [
    {
      "nome": "Hero",
      "arquivo": "opcoes/index.html#hero",
      "rotulo": "Todas lado a lado",
      "prints": "hero",
      "paginas": [
        { "nome": "C radial", "arquivo": "opcoes/hero-c-radial.html", "marca": "no site" },
        { "nome": "D · retrato", "arquivo": "opcoes/hero-d.html" }
      ]
    }
  ]
}
```

| Campo | Obrigatório | O que é |
|---|---|---|
| `acervo.nome` | não | O nome da aba: "Opções de design", "Variações", "Telas". Padrão: "Acervo" |
| `grupos[].nome` | sim | O nome do grupo, curto: "Hero", "Footer", "Pagar com Pix" |
| `grupos[].paginas` | sim | As variações do grupo, na mesma regra de `paginas` (`nome` e `arquivo`). A escolhida primeiro |
| `paginas[].marca` | não | Um selo curto ao lado do nome, para destacar uma variação: "no site", "escolhida", "nova" |
| `grupos[].arquivo` | não | Uma página que mostra o grupo inteiro (lado a lado, por exemplo). Vira a primeira linha do grupo |
| `grupos[].rotulo` | não | O texto dessa linha. Padrão: "Ver todas juntas" |
| `grupos[].prints` | não | A subpasta de `_vitrine/` com os prints do grupo (seção 4) |

Não repita a variação escolhida em `paginas` só para destacá-la: use `marca`.

## 4. Prints da vitrine (`_vitrine/`)

- `capa.webp`: a imagem do card, paisagem 1440×900.
- `01.webp`, `02.webp`...: a galeria do projeto, até 8 imagens, em qualquer proporção. Telas de celular em pé funcionam bem.
- Cada imagem com até uns 300 KB. Prefira `.webp`.
- Prints de um grupo do acervo: `_vitrine/<prints>/01.webp`, `02.webp`..., até 8 por grupo, sem capa. A galeria troca para eles quando o grupo está aberto na ficha.

Para tirar os prints, rode na raiz do clone:

```bash
node scripts/capturar-telas.mjs <categoria>/<slug>
```

```bash
node scripts/capturar-telas.mjs <categoria>/<slug> index.html "index.html#pix" "index.html#boleto" --celular
```

O primeiro alvo vira a capa e os outros viram a galeria. Sem alvo, usa a primeira página do projeto. `--celular` captura a galeria em 390×844. O script usa o Chrome ou o Edge instalados; sem nenhum dos dois, use a ferramenta de navegador que você tiver ou siga sem prints e avise o usuário (a vitrine mostra uma capa provisória).

Para os prints de um grupo do acervo, use `--grupo` com o nome da subpasta. Os prints vão para `_vitrine/<grupo>/`, sem capa. Sem alvo, ele captura as 8 primeiras páginas do grupo:

```bash
node scripts/capturar-telas.mjs <categoria>/<slug> --grupo=hero
```

Olhe a capa antes de subir. Se pegou tela de carregamento ou animação de entrada pela metade, rode de novo com `--espera=8`. Se pegou um modal aberto, capture outro alvo.

## 5. Pipeline

### Subir um projeto novo

1. **Decida categoria, slug, nome e tipo** olhando o projeto, e mostre ao usuário antes de subir, junto com a `descricao`, as `tags` e o nome de cada página (seção 3). Se a categoria ou o objetivo do projeto não forem óbvios, pergunte; não invente.
2. **Clone esparso** numa pasta temporária fora do projeto atual. Ele baixa só os arquivos da raiz, `scripts/` e a pasta do projeto, nunca o repositório inteiro:
   ```bash
   git clone --depth 1 --filter=blob:none --sparse https://github.com/snksergio/igreen-hub.git <tmp>/igreen-hub
   cd <tmp>/igreen-hub
   git sparse-checkout set scripts <categoria>/<slug>
   ```
   Se a pasta temporária já existir de outra vez, apague e clone de novo.
3. **Confira se o slug está livre**: `git ls-tree -d HEAD <categoria>/<slug>` não deve devolver nada. Se devolver, ou é o mesmo projeto (siga "Alterar") ou escolha outro slug.
4. **Copie o projeto** para `<categoria>/<slug>/`. Deixe de fora `node_modules`, `.git`, `.env`, `.claude`, zips, arquivos-fonte pesados (psd, fig, mp4 bruto) e qualquer dado real de cliente.
   - Projeto com build (Vite, React...): gere o build com caminho relativo (`npx vite build --base=./`) e copie só o conteúdo do `dist`. Use rotas com hash (`HashRouter`). Registre em `repo` onde está o código.
   - Projeto com estudo por trás: monte o `builder/` e gere o output (seção 2, "Builder e output").
5. **Crie o `projeto.json`** (seção 3) e **os prints** (seção 4).
6. **Valide**: `node scripts/gerar-catalogo.mjs --checar`. Corrija os avisos do seu projeto. Só pode sobrar o aviso de prints, e só se você não conseguiu capturar. Confira também que nenhum arquivo passa de 25 MB (seção 7): `find <categoria>/<slug> -type f -size +25M` não deve devolver nada.
7. **Publique**:
   ```bash
   git add <categoria>/<slug>
   git commit -m "<categoria>/<slug>: adiciona <nome>"
   git push
   ```
   Se o push for recusado, rode `git pull --rebase` e faça o push de novo.
8. **Responda ao usuário** com os dois links e avise que a publicação leva cerca de 1 minuto:
   - o projeto: `https://igreen-hub.pages.dev/<categoria>/<slug>/`
   - na vitrine: `https://igreen-hub.pages.dev/#<categoria>/<slug>`
9. Apague a pasta temporária.

### Alterar um projeto que já está aqui

Mesmo clone esparso do passo 2, com a pasta do projeto. Substitua ou edite os arquivos, atualize `atualizado` (e `descricao`, `tags` ou `paginas`, se mudaram), refaça os prints se a tela mudou, valide e publique com a mensagem `<categoria>/<slug>: <o que mudou>`.

Não crie pastas paralelas para versões. Se a versão anterior precisa continuar visível, ela fica na mesma pasta com o número no nome (`faturas-v1.html`), a nova assume a entrada principal e as duas entram em `versoes`, a mais nova primeiro, com a data. Se ninguém precisa ver a anterior, só substitua: o git guarda o histórico.

Projeto com `builder/`: edite o estudo em `builder/index.html`, gere o output de novo com o gerador do builder e só então refaça os prints, valide e publique. Nunca edite o output à mão. A versão que sai do output e só serve de registro vai para `builder/historico/` e entra na tabela do README do builder.

Um projeto é um assunto. Telas de assuntos diferentes, mesmo que nasçam no mesmo repositório, viram projetos separados, cada um com sua ficha. Já as variações de partes do mesmo projeto (as opções de hero, de rodapé, de um componente) ficam no `acervo` da mesma ficha: um card na vitrine, os grupos na aba da ficha.

### Mudar um projeto de categoria ou de nome

Inclua as duas pastas no `git sparse-checkout set`, rode `git mv <antiga> <nova>` e, para o link antigo continuar abrindo o projeto no endereço principal, acrescente no `_redirects` da raiz as duas linhas do modelo que está nele:

```
/mob/teaser    /mob/teaser-lancamento/         301
/mob/teaser/*  /mob/teaser-lancamento/:splat   301
```

Publique e abra o link antigo para conferir. No endereço antigo (GitHub Pages) não há redirecionamento: lá o link antigo cai na página de "não encontrado" (`404.html`), que sugere o projeto pelo nome. Um link antigo da vitrine (`#categoria/slug`) vira uma busca pelo nome do projeto. Avise o usuário disso.

## 6. Projeto que mora fora

Para o que não entra aqui (seção 1), a pasta leva só o `projeto.json` e a `_vitrine/`, com `link` apontando para onde o projeto está. Assim a vitrine lista tudo, até o que não mora aqui. Para trazer um desses para cá depois, copie os arquivos para a pasta e apague o `link`: o passo a passo está no [MIGRACAO.md](MIGRACAO.md).

## 7. Limites e cuidados

- O repositório é público: nada de `.env`, token, chave, senha ou dado real de cliente (CPF, telefone, fatura). Use dados fictícios. Vale também para o `builder/`, que fica fora da vitrine mas abre para quem tiver o endereço.
- Arquivo até 25 MB. O Cloudflare recusa acima disso, e aí a publicação do hub inteiro falha, não só a do seu projeto. Vídeo maior só comprimido, e só com o ok do usuário. Pasta de projeto, de preferência, até 20 MB.
- O site inteiro: até 1 GB (limite do GitHub Pages) e até 20 mil arquivos (limite do Cloudflare). Imagens otimizadas e vídeo só comprimido e curto.
- A publicação é automática a cada push na `main`, nos dois endereços: no Cloudflare (`.github/workflows/cloudflare.yml`), o principal, que recebe só os arquivos que mudaram, e no GitHub Pages (`.github/workflows/publicar.yml`), o antigo. Não precisa rodar nada além do push.
- Se só a publicação do GitHub Pages falhar, não bloqueia: o endereço principal já está atualizado. Não use "Re-run" nela, que falha com `Multiple artifacts named "github-pages"`; para tentar de novo, `gh workflow run publicar.yml -R snksergio/igreen-hub`.
