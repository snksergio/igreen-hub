# Builder — Simulador do investidor

**O que é.** O simulador de investimento em eletroposto guiado pelo DRE (o "fluxo Gerador"). A v2, em `#investir`, é um formulário linear; a v1, em `#gerador`, tem as premissas em abas, com retorno e ROI. As duas seguem para dados, eletroposto, resumo e proposta.

**Origem:** Migrado de [snksergio/igreen-mob-link](https://github.com/snksergio/igreen-mob-link) (commit `5af67d1`) em 2026-11-06. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

> **O mesmo app em 4 pastas.** Este código é um app React + Vite só, com quatro assuntos em rotas por hash. No hub ele virou quatro projetos, cada um com uma cópia completa do código: `mob/cadastro-investidor`, `mob/simulador-investidor`, `mob/proposta-investidor` e `mob/oferta-live`. Esta pasta é a de o simulador do investidor (fluxo Gerador, v2 em `#investir` e v1 em `#gerador`). Partes são compartilhadas (design system em `src/components` e `src/styles`, `src/Root.tsx`, os cards dos modelos): uma mudança nelas precisa ir para as outras pastas também, ou antes é preciso decidir qual pasta passa a ser a fonte única (veja Pendências).

## Estado atual

- A v2 (`#investir`) é a versão avaliada pelos stakeholders e foi publicada com todos os ajustes pedidos.
- A v1 (`#gerador`) ficou congelada como referência.
- As telas Eletroposto, Resumo e Proposta das duas versões só abrem passando pelo fluxo: sem os dados, elas voltam para Dados.

## Decisões tomadas

- Pedidos dos stakeholders só na v2: a v1 e o fluxo atual (rota raiz) ficaram congelados.
- Na v2, nomes dos modelos: Carga lenta (7 kW, 2 carros, 1 cliente/dia), Carga rápida (7 + 40 kW, 7 carros, 2 clientes/dia) e Carga ultra rápida (80 kW, 15 carros, 3 clientes/dia), com as conexões de Green Telecom e seguros ligadas.
- Clientes por dia, não por mês, num slider de 0 a 20, com a sugestão por modelo.
- Na v2 não aparecem o valor do investimento, o ROI nem o payback; no lugar, quadrinhos de Recargas e Energia e o gráfico do valor recebido.
- Taxa do sistema de 14% e sem a perda de 5% no custo de energia (fixos na v2).
- Os campos de tributos (adições fiscais, provisão sobre comissões) ficaram abertos: virar slider só depois de avaliar cada um.

## Pendências e perguntas em aberto

- Decidir se a v1 continua visível ou sai para o histórico.
- Decidir se o app continua em 4 cópias (uma por assunto) ou se uma pasta vira a fonte única e as outras passam a apontar para ela.

## Como gerar o resultado

Node 22 ou mais novo.

```sh
cd mob/simulador-investidor/builder
npm ci
node gerar-output-hub.mjs   # build + ajuste de caminhos; troca index.html, favicon.png e assets/ da pasta acima
```

Para trabalhar localmente: `npm run dev` (abre em `http://localhost:5173/`, com as mesmas rotas por hash da tabela abaixo). Testes: `npm test` (Vitest). Lint: `npm run lint` (oxlint). `npm run build` também roda o `tsc -b` antes do build.

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com a pasta `mob/simulador-investidor`, edite em `builder/`, rode `node gerar-output-hub.mjs`, refaça os prints se a tela mudou (`node scripts/capturar-telas.mjs mob/simulador-investidor ...`), atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/simulador-investidor: <o que mudou>`.

## Rotas

| Tela | Rota (hash) | Abre direto pelo link |
|---|---|---|
| v2 · Início | `#investir` | sim |
| v2 · Simulador | `#investir/simulador` | sim |
| v2 · Dados do investidor | `#investir/dados` | sim |
| v2 · Eletroposto, Resumo, Proposta | `#investir/eletroposto, /resumo, /proposta` | só pelo fluxo |
| v1 · Início | `#gerador` | sim |
| v1 · Simulador | `#gerador/simulador` | sim |
| v1 · Dados do investidor | `#gerador/dados` | sim |
| v1 · Eletroposto, Resumo, Proposta | `#gerador/eletroposto, /resumo, /proposta` | só pelo fluxo |

O app inteiro está nesta pasta: as rotas dos outros assuntos (tabela em [README-original.md](README-original.md)) também abrem aqui.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../index.html`, `../assets/`](../) | O resultado que a vitrine abre (gerado; não editar à mão) |
| [`gerar-output-hub.mjs`](gerar-output-hub.mjs) | Gera o resultado: build com caminho relativo e ajuste dos caminhos de assets |
| [`src/gerador/`](src/gerador/) | O fluxo Gerador inteiro (v1 e v2) |
| [`src/gerador/model.ts`](src/gerador/model.ts) | O modelo do DRE (cálculo do recebimento) |
| [`src/gerador/guided.ts`](src/gerador/guided.ts) | Regras da v2: nomes, clientes por dia, fixos (taxa 14%, sem perda) |
| [`src/gerador/screens/`](src/gerador/screens/) | As telas (Simulador, SimuladorV2, Dados, Eletroposto, Resumo, Proposta) |
| [`src/gerador/components/`](src/gerador/components/) | Painel de resultado, gráficos, DRE, carrossel dos modelos |
| [`src/gerador/model.test.ts`](src/gerador/model.test.ts) | Testes do modelo |
| [`docs/superpowers/`](docs/superpowers/) | O plano e o desenho do fluxo Gerador (2026-09-28) |
| [`src/Root.tsx`](src/Root.tsx) | Escolhe o fluxo pela rota (fluxo atual, simulador, propostas, oferta da live) |
| [`src/styles/tokens.css`](src/styles/tokens.css) | Tokens do design system (claro e escuro) |
| [`public/assets/`](public/assets/) | Ícones, imagens e vídeos |
| [`scripts/`](scripts/) | Otimização de imagens e compressão de vídeos |
| [`README-original.md`](README-original.md) | O README do original, com o texto como está |

## O que ficou de fora

- `node_modules/` e `dist/` (gerados), `.git` e `vercel.json` (deploy do original).
- Pastas locais de ferramentas, que já ficavam fora do git no original: `.claude/`, `.impeccable/` e `.playwright-mcp/` (capturas de verificação). Estão na pasta local do original (`Área de Trabalho/Mob`).
- Uma mudança local não commitada no original: `vite.config.ts` com `server: { port: Number(process.env.PORT) || 5173 }` (só a porta do servidor de desenvolvimento; não muda o build).

## Visto no original

- Algumas telas não abrem direto pelo link: sem os dados preenchidos, voltam para uma tela anterior (marcadas como "só pelo fluxo" na tabela de rotas).
- O app monta os caminhos de ícones, imagens e vídeos a partir da raiz (`/assets/...`, em `src/assets.ts`). No hub ele mora numa subpasta, por isso o `gerar-output-hub.mjs` ajusta esses 3 caminhos no JS gerado; o código-fonte veio como está.
- O build avisa que o JS principal passa de 500 kB (aviso do Vite, sem efeito no funcionamento).
- O `README-original.md` fala do deploy no Vercel; veio com o texto como está.
