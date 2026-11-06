# Builder — Oferta da live

**O que é.** A tela única da live (`#cadastro-simplificado`): escolher o eletroposto nos cards do simulador (com o valor), ver especificações e formas de pagamento se quiser, informar os dados, aceitar o contrato e pagar a entrada de R$ 9.997 no cartão ou no Pix. O pagamento é simulado.

**Origem:** Migrado de [snksergio/igreen-mob-link](https://github.com/snksergio/igreen-mob-link) (commit `5af67d1`) em 2026-11-06. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

> **O mesmo app em 4 pastas.** Este código é um app React + Vite só, com quatro assuntos em rotas por hash. No hub ele virou quatro projetos, cada um com uma cópia completa do código: `mob/cadastro-investidor`, `mob/simulador-investidor`, `mob/proposta-investidor` e `mob/oferta-live`. Esta pasta é a de a oferta da live (`#cadastro-simplificado`). Partes são compartilhadas (design system em `src/components` e `src/styles`, `src/Root.tsx`, os cards dos modelos): uma mudança nelas precisa ir para as outras pastas também, ou antes é preciso decidir qual pasta passa a ser a fonte única (veja Pendências).

## Estado atual

- Pronta como prévia. O pagamento é simulado ("Prévia: nenhum valor é cobrado de verdade").
- O nome da licenciada vem do parâmetro `?responsavel=` do link; sem ele, aparece um nome de exemplo.

## Decisões tomadas

- Entrada fixa de R$ 9.997 em todos os modelos e o restante em 4 parcelas, que só aparecem no "+ Formas de pagamento" (tela o mais enxuta possível).
- Cartão de crédito e Pix; aceite do contrato por caixa de marcar, com o contrato abrindo só se a pessoa tocar no link.
- Dados essenciais, com o CPF primeiro; e-mail e WhatsApp lado a lado no desktop.
- Faixa "Ao vivo" no topo, com o nome da licenciada.
- Card do modelo escolhido no padrão do painel do simulador, compacto; na Carga lenta o selo diz "100% do faturamento".

## Pendências e perguntas em aberto

- Ligar ao gateway de pagamento, ao serviço de assinatura e ao registro do pedido.
- Confirmar com o time o selo "100% do faturamento" na Carga lenta, que pode soar contraditório com a "taxa do sistema: 14% do faturamento" das especificações.
- Decidir se o app continua em 4 cópias (uma por assunto) ou se uma pasta vira a fonte única e as outras passam a apontar para ela.

## Como gerar o resultado

Node 22 ou mais novo.

```sh
cd mob/oferta-live/builder
npm ci
node gerar-output-hub.mjs   # build + ajuste de caminhos; troca index.html, favicon.png e assets/ da pasta acima
```

Para trabalhar localmente: `npm run dev` (abre em `http://localhost:5173/`, com as mesmas rotas por hash da tabela abaixo). Testes: `npm test` (Vitest). Lint: `npm run lint` (oxlint). `npm run build` também roda o `tsc -b` antes do build.

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com a pasta `mob/oferta-live`, edite em `builder/`, rode `node gerar-output-hub.mjs`, refaça os prints se a tela mudou (`node scripts/capturar-telas.mjs mob/oferta-live ...`), atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/oferta-live: <o que mudou>`.

## Rotas

| Tela | Rota (hash) | Abre direto pelo link |
|---|---|---|
| Oferta da live | `?responsavel=Juliana%20Martins#cadastro-simplificado` | sim |

O app inteiro está nesta pasta: as rotas dos outros assuntos (tabela em [README-original.md](README-original.md)) também abrem aqui.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../index.html`, `../assets/`](../) | O resultado que a vitrine abre (gerado; não editar à mão) |
| [`gerar-output-hub.mjs`](gerar-output-hub.mjs) | Gera o resultado: build com caminho relativo e ajuste dos caminhos de assets |
| [`src/cadastroSimplificado/`](src/cadastroSimplificado/) | A tela: CadastroSimplificado.tsx, Partes.tsx (card do modelo, contrato, Pix, confirmação) |
| [`src/cadastroSimplificado/oferta.ts`](src/cadastroSimplificado/oferta.ts) | Regras: plano de pagamento, ficha do modelo, validação do cartão |
| [`src/cadastroSimplificado/oferta.test.ts`](src/cadastroSimplificado/oferta.test.ts) | Testes das regras |
| [`src/gerador/components/ChargerCarousel.tsx`](src/gerador/components/ChargerCarousel.tsx) | Os cards dos modelos (opção `showPrice`), compartilhados com o simulador |
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
