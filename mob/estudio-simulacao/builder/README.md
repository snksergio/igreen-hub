# Builder — Estúdio de simulação

> **Na vitrine:** desde 2026-11-06 este projeto fica arquivado (fora da lista principal) e aparece como POC em duas fichas: o simulador, no hotsite [`mob/hotsite-migre-bandeira`](../../hotsite-migre-bandeira/) (virou o simulador 3D da home); o construtor, no painel [`mob/painel-eletroposto-final`](../../painel-eletroposto-final/) (protótipo do "Construtor do posto"). Os arquivos e os endereços continuam os mesmos.

**O que é.** Protótipo independente do simulador do investidor do iGreen MOB, com uma cena 3D do posto que muda conforme as escolhas (`../index.html`), e o construtor isométrico para montar o posto em vista isométrica e planta (`../construtor/`).

**Origem.** Migrado em 2026-11-06 da pasta local `Área de Trabalho/carro simulador/igreen-simulador-studio` (repositório git local, sem remoto, commit `36ab08c` de 07/10/2026; a pasta `construtor/`, de 23/10, não estava commitada e veio como estava). Daqui em diante a fonte é esta pasta; o original fica intocado, só como registro. O README do original está em [`README-original.md`](README-original.md).

## Estado atual

- O simulador funciona em quatro etapas: equipamento, quantidade e investimento; movimento, tarifas, custos e capacidade; carteira de energia, seguros e telefonia; projeção, comparação com e sem carteira, demonstrativo, tabela mensal e download do resumo. Não coleta contatos nem envia dados.
- O construtor é um editor leve em HTML, CSS, JS e SVG, sem 3D nem bibliotecas, com testes de regras (`../construtor/montagem.test.cjs`) e o guia `../construtor/LEIA-ME-REGRAS.md`.
- O que não sei pelos arquivos: se o simulador vai substituir o do `mob/simulador-investidor` e se o construtor foi integrado em algum lugar. Pergunte ao usuário antes de continuar.

## Decisões tomadas

Pelo README do original:

- O motor financeiro foi reconstruído a partir das regras visíveis do simulador do Green Mob (hoje em https://snksergio.github.io/igreen-hub/mob/simulador-investidor/#investir/simulador). Não é cópia auditada do motor original: uso comercial exige conferir a matriz de cenários, as regras fiscais e as condições contratuais.
- Cenário inicial: Duo 7+40 kW, 7 carros por dia, 30 dias, 25 kWh, compra a R$ 0,80 e venda a R$ 2,20.
- Administração de 14%, como no DRE da referência (que cita 15% num texto, divergência registrada).
- As fórmulas ficam isoladas em `../finance.js`, para trocar depois pelo motor validado.
- A cena é geometria em tempo real com Three.js, sem vídeo nem imagens geradas.

## Pendências e perguntas em aberto

- Conferir o motor financeiro com o motor validado antes de uso comercial.
- Tributo local e tributos sobre comissões começam sem definição (a interface avisa).

## Como gerar o resultado

Não há build: a raiz e `../construtor/` são os próprios arquivos de trabalho.

```sh
node builder/preview.cjs            # prévia local do original, em http://127.0.0.1:4180/ (serve dist/)
node construtor/montagem.test.cjs   # testes das regras do construtor
```

No hub não há `dist/`: o resultado está direto na raiz. O `preview.cjs` espera a estrutura do original (`dist/` ao lado); para ver no hub, sirva a pasta do projeto com qualquer servidor estático.

**Publicar uma mudança** (ORQUESTRADOR.md, seção 5, "Alterar"): clone esparso com `mob/estudio-simulacao`, edite, refaça os prints se a tela mudou, atualize `atualizado` no `projeto.json`, rode `node scripts/gerar-catalogo.mjs --checar` e publique com `mob/estudio-simulacao: <o que mudou>`.

## Onde está cada coisa

| Arquivo ou pasta | O que é |
|---|---|
| [`../index.html`](../index.html) | O simulador (só a seção e a moldura de apresentação) |
| [`../app.js`](../app.js) | Etapas, formulários, relatório e exportação |
| [`../finance.js`](../finance.js) | As fórmulas, isoladas |
| [`../scene.js`](../scene.js) | A cena 3D e as mudanças de câmera e equipamentos |
| [`../styles.css`](../styles.css), [`../fonts.css`](../fonts.css) | Visual e fontes |
| [`../assets/`](../assets/) | Fontes, Three.js (com a licença preservada) e o kit 3D |
| [`../construtor/montagem.html`](../construtor/montagem.html) | O construtor, versão modular |
| [`../construtor/montagem-unico.html`](../construtor/montagem-unico.html) | O construtor num arquivo só, com dados de exemplo |
| [`prototipo.jpg`](prototipo.jpg) | Captura do protótipo |
| [`preview.cjs`](preview.cjs) | Servidor da prévia local do original |

## O que ficou de fora

- `.git` e `.openai/` (configuração de hospedagem do original).
- `carro simulador/entrega-construtor-isometrico/` e `construtor-isometrico-entrega.zip`: cópias idênticas de `construtor/` (conferido arquivo por arquivo).

## Visto no original

- No `../app.js`, o link "Referência funcional" apontava para o simulador na Vercel; na cópia ele aponta para o mesmo simulador no hub.
