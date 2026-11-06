# Builder — Proposta do investidor

**O que é.** A página que o investidor recebe depois que a proposta é gerada, com dados de exemplo e um seletor de cenários no topo (`?cenario=`). A versão atual é `#proposta-v3/9E89C902`; o primeiro modelo, `#proposta-v2/9E89C902`, ficou para comparação.

**Origem:** Migrado de [snksergio/igreen-mob-link](https://github.com/snksergio/igreen-mob-link) (commit `5af67d1`) em 2026-11-06. Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro.

> **O mesmo app em 4 pastas.** Este código é um app React + Vite só, com quatro assuntos em rotas por hash. No hub ele virou quatro projetos, cada um com uma cópia completa do código: `mob/cadastro-investidor`, `mob/simulador-investidor`, `mob/proposta-investidor` e `mob/oferta-live`. Esta pasta é a de a página da proposta gerada (`#proposta-v3`, atual, e `#proposta-v2`, o primeiro modelo). Partes são compartilhadas (design system em `src/components` e `src/styles`, `src/Root.tsx`, os cards dos modelos): uma mudança nelas precisa ir para as outras pastas também, ou antes é preciso decidir qual pasta passa a ser a fonte única (veja Pendências).

## Estado atual

- A v2 da página (`#proposta-v3`) foi avaliada pelo time em várias rodadas e está completa: topo institucional sobre o carro, card da proposta, andamento em abas (Proposta, Contrato, Pagamento, Vistoria, Instalação, Entrega) e detalhes.
- A etapa Vistoria tem a distribuição dos carregadores em pontos (cenários `distribuir`, `muitos` com 10 carregadores e `pontos`).
- O primeiro modelo (`#proposta-v2`) ficou congelado, com os nomes antigos dos modelos.
- Pagamento, assinatura do contrato e do aditivo, e o agendamento da vistoria são simulados na prévia.

## Decisões tomadas

- Contrato antes do pagamento: o pagamento da entrada só é liberado com o contrato assinado.
- Entrada fixa de R$ 9.997 e o restante em 4 parcelas a cada 30 dias; cada cobrança é gerada 10 dias antes do vencimento.
- Compra de exemplo com um carregador de cada modelo, do maior para o menor: Mob Ultra Fast (80 kW DC), Mob Fast (7 + 40 kW AC + DC) e Mob (7 kW AC). Os nomes Mob valem só nesta versão.
- Recusar pede o CPF do investidor (tem que bater com o da proposta) e o motivo por escrito.
- Pontos: todos os carregadores começam no Ponto 1; um ponto só oferece os carregadores livres ou já dele; os de outros pontos aparecem em "Em outros pontos", com o selo "Em uso"; com mais de um do mesmo modelo, a escolha é por quantidade (− N +).
- Ícone dos modelos: 1, 2 e 3 raios (Mob, Fast, Ultra Fast); cada ponto tem um selo com a ilustração de um eletroposto.
- Aditivo depois da vistoria (por exemplo, cabeamento além dos 10 m previstos), assinado na própria página; no fim, o envelope de entrega com contrato, aditivo, laudos e termo.
- Conteúdo com até 620 px no desktop; no celular, 480 px.

## Pendências e perguntas em aberto

- Ligar o pagamento ao gateway e as assinaturas ao serviço de assinatura (hoje simulados).
- Vistoria por ponto: as datas de agendamento são de exemplo.
- Decidir se o app continua em 4 cópias (uma por assunto) ou se uma pasta vira a fonte única e as outras passam a apontar para ela.

## Como gerar o resultado

Node 22 ou mais novo.

```sh
cd mob/proposta-investidor/builder
npm ci
node gerar-output-hub.mjs   # build + ajuste de caminhos; troca index.html, favicon.png e assets/ da pasta acima
```

Para trabalhar localmente: `npm run dev` (abre em `http://localhost:5173/`, com as mesmas rotas por hash da tabela abaixo). Testes: `npm test` (Vitest). Lint: `npm run lint` (oxlint). `npm run build` também roda o `tsc -b` antes do build.

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com a pasta `mob/proposta-investidor`, edite em `builder/`, rode `node gerar-output-hub.mjs`, refaça os prints se a tela mudou (`node scripts/capturar-telas.mjs mob/proposta-investidor ...`), atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/proposta-investidor: <o que mudou>`.

## Rotas

| Tela | Rota (hash) | Abre direto pelo link |
|---|---|---|
| v2 · Proposta enviada | `#proposta-v3/9E89C902?cenario=nova` | sim |
| v2 · Contrato para assinar | `#proposta-v3/9E89C902?cenario=contrato` | sim |
| v2 · Entrada em aberto | `#proposta-v3/9E89C902?cenario=pagamento` | sim |
| v2 · Distribuir carregadores | `#proposta-v3/9E89C902?cenario=distribuir` | sim |
| v2 · 10 carregadores para distribuir | `#proposta-v3/9E89C902?cenario=muitos` | sim |
| v2 · Pontos enviados | `#proposta-v3/9E89C902?cenario=pontos` | sim |
| v2 · Vistoria com aditivo | `#proposta-v3/9E89C902?cenario=vistoria` | sim |
| v2 · Instalação, parcela vencida | `#proposta-v3/9E89C902?cenario=instalacao` | sim |
| v2 · Entrega para aceite | `#proposta-v3/9E89C902?cenario=entrega` | sim |
| v2 · Proposta recusada | `#proposta-v3/9E89C902?cenario=recusada` | sim |
| v1 · Proposta enviada | `#proposta-v2/9E89C902?cenario=nova` | sim |
| v1 · Contrato para assinar | `#proposta-v2/9E89C902?cenario=contrato` | sim |
| v1 · Entrada em aberto | `#proposta-v2/9E89C902?cenario=pagamento` | sim |
| v1 · Vistoria com aditivo | `#proposta-v2/9E89C902?cenario=vistoria` | sim |
| v1 · Instalação, parcela vencida | `#proposta-v2/9E89C902?cenario=instalacao` | sim |
| v1 · Entrega para aceite | `#proposta-v2/9E89C902?cenario=entrega` | sim |
| v1 · Proposta recusada | `#proposta-v2/9E89C902?cenario=recusada` | sim |

O app inteiro está nesta pasta: as rotas dos outros assuntos (tabela em [README-original.md](README-original.md)) também abrem aqui.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../index.html`, `../assets/`](../) | O resultado que a vitrine abre (gerado; não editar à mão) |
| [`gerar-output-hub.mjs`](gerar-output-hub.mjs) | Gera o resultado: build com caminho relativo e ajuste dos caminhos de assets |
| [`src/proposta/data.ts`](src/proposta/data.ts) | Regras e dados de exemplo das duas versões: cenários, etapas, próximo passo, ações, pontos |
| [`src/proposta/data.test.ts`](src/proposta/data.test.ts) | Testes das regras da proposta |
| [`src/proposta/pontos.test.ts`](src/proposta/pontos.test.ts) | Testes da distribuição em pontos |
| [`src/proposta/v3/`](src/proposta/v3/) | A v2 da página: PropostaV3, Folhas (etapas), Vistoria (pontos), Trilho, Blocos, ícones |
| [`src/proposta/PropostaV2.tsx`](src/proposta/PropostaV2.tsx) | O primeiro modelo (com Sheets.tsx e Timeline.tsx) |
| [`src/Root.tsx`](src/Root.tsx) | Escolhe o fluxo pela rota |
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
