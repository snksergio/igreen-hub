# Builder — Cadastro de investidor

**O que é.** O fluxo atual de cadastro do investidor Green Mob, na rota raiz do app: início, simulador por CPF, dados do investidor, modelo do eletroposto, endereço (CEP, mapa) e resumo, até a proposta final. Feito em React a partir do Figma e do design system Novo Link Cadastro.

**Origem:** Migrado de [snksergio/igreen-mob-link](https://github.com/snksergio/igreen-mob-link) (commit `5af67d1`) em 2026-11-06. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

> **O mesmo app em 4 pastas.** Este código é um app React + Vite só, com quatro assuntos em rotas por hash. No hub ele virou quatro projetos, cada um com uma cópia completa do código: `mob/cadastro-investidor`, `mob/simulador-investidor`, `mob/proposta-investidor` e `mob/oferta-live`. Esta pasta é a de o fluxo atual de cadastro do investidor (a rota raiz do app). Partes são compartilhadas (design system em `src/components` e `src/styles`, `src/Root.tsx`, os cards dos modelos): uma mudança nelas precisa ir para as outras pastas também, ou antes é preciso decidir qual pasta passa a ser a fonte única (veja Pendências).

## Estado atual

- Pronto e estável. Durante o trabalho no simulador v2 e na proposta, este fluxo ficou congelado de propósito, como referência.
- A tela de proposta final (`#proposta`) existe, mas só abre passando pelo fluxo: sem os dados preenchidos, ela volta para o resumo.

## Decisões tomadas

- Fluxo congelado enquanto as outras frentes evoluíam: os pedidos dos stakeholders foram aplicados só no simulador v2 (`#investir`), para não mexer no que já estava validado.
- Endereço preenchido pelo CEP (ViaCEP), com geocodificação e mapa; a consulta de endereço por CPF/CNPJ está desligada porque o mock devolvia sempre o mesmo endereço (detalhes no README original, seção "O que é mock").

## Pendências e perguntas em aberto

- Os mocks listados no README original ("O que é mock"): criação da proposta, nome do responsável pelo `?responsavel=`, números fixos da tela inicial, links de termos sem destino.
- Visto durante a proposta v3, sem correção: na caixa de marcar compartilhada (`src/components/ui/Controls.tsx`, `Checkbox`), o ✓ fica por cima do campo invisível; tocar bem no ✓ de uma caixa marcada não desmarca (tocar no texto funciona).
- Decidir se o app continua em 4 cópias (uma por assunto) ou se uma pasta vira a fonte única e as outras passam a apontar para ela.

## Como gerar o resultado

Node 22 ou mais novo.

```sh
cd mob/cadastro-investidor/builder
npm ci
node gerar-output-hub.mjs   # build + ajuste de caminhos; troca index.html, favicon.png e assets/ da pasta acima
```

Para trabalhar localmente: `npm run dev` (abre em `http://localhost:5173/`, com as mesmas rotas por hash da tabela abaixo). Testes: `npm test` (Vitest). Lint: `npm run lint` (oxlint). `npm run build` também roda o `tsc -b` antes do build.

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com a pasta `mob/cadastro-investidor`, edite em `builder/`, rode `node gerar-output-hub.mjs`, refaça os prints se a tela mudou (`node scripts/capturar-telas.mjs mob/cadastro-investidor ...`), atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/cadastro-investidor: <o que mudou>`.

## Rotas

| Tela | Rota (hash) | Abre direto pelo link |
|---|---|---|
| Início | `(raiz)` | sim |
| Simulador por CPF | `#simulador` | sim |
| Dados do investidor | `#step1` | sim |
| Modelo do eletroposto | `#step2` | sim |
| Endereço do eletroposto | `#step3` | sim |
| Resumo | `#step4` | sim |
| Proposta final | `#proposta` | só pelo fluxo |

O app inteiro está nesta pasta: as rotas dos outros assuntos (tabela em [README-original.md](README-original.md)) também abrem aqui.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../index.html`, `../assets/`](../) | O resultado que a vitrine abre (gerado; não editar à mão) |
| [`gerar-output-hub.mjs`](gerar-output-hub.mjs) | Gera o resultado: build com caminho relativo e ajuste dos caminhos de assets |
| [`src/App.tsx`](src/App.tsx) | O fluxo atual: escolhe a tela pelo hash |
| [`src/screens/`](src/screens/) | As telas: Inicio, Simulador, Step1Dados, Step2Modelo, Step3Endereco, Step4Resumo, Proposta |
| [`src/state/cadastro.tsx`](src/state/cadastro.tsx) | Estado do cadastro e rotas por hash |
| [`src/components/`](src/components/) | Componentes do design system (ui/, layout/, address/ com CEP e mapa) |
| [`src/services/`](src/services/) | CEP, geocodificação e os mocks (proposta, responsável, documento) |
| [`src/data/investment.ts`](src/data/investment.ts) | Regras de investimento do fluxo atual |
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
