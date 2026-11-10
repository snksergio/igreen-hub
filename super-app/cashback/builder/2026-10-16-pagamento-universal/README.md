---
type: doc
title: "Fluxo de pagamento universal no app do cliente iGreen"
created: 2026-10-16
updated: 2026-10-26
status: active
source: workspace
tags: [growth, investigacao, pagamento, cashback, beneficios, telecom, seguros, conexao-green]
---

# Fluxo de pagamento universal no app do cliente iGreen

Investigação para desenhar um fluxo único de pagamento no app do cliente, cobrindo Telecom, Seguros e energia, em que a pessoa veja o que pagou, como pagou, o que ganhou e o que poderia ganhar. Até aqui, ela juntou um service blueprint dos três pagamentos de hoje, dois benchmarks de mercado e as respostas da base interna da iGreen à pauta. O desenho espera as regras de benefício e de carteira.

## Pergunta real e fase

- **Pedido original:** "criar um fluxo de pagamento universal, com Pix ou cartão, saldo da carteira e cashback, mostrando o que o cliente pagou, como pagou, o que ganhou e o que deixou de ganhar".
- **Pergunta real:** como o cliente paga qualquer produto do app num fluxo só e entende o que paga, como paga e o que ganha.
- **Fase:** definição. O fluxo único não existe, e as regras de saldo, cashback e benefício não estão escritas em nenhum Context.
- **Decisão que depende da resposta:** que benefício a iGreen dá (desconto, crédito, cashback, kWh, GB) e quem paga por ele; se precisa de carteira com saldo; e, depois disso, o desenho do fluxo.

## O que sabemos, supomos e não sabemos

| Tipo | Item | Certeza ou como descobrir |
|---|---|---|
| Certeza | Cada produto cobra de um jeito: Telecom no app (cartão salvo, cartão novo, Pix, voucher); Seguros no checkout da BBone, com cartão pela Cielo; energia em boleto único, pela regra da distribuidora | Lido nos Contexts (`blueprint.md`). A base interna acrescenta, na energia, a modalidade de dois boletos, um da distribuidora e um da iGreen (a confirmar) |
| Certeza | O pagamento do Seguros sai do app, e a confirmação volta por sincronização de até 30 minutos | Context do Seguros |
| Certeza | Nubank, Inter, Mercado Pago e PicPay não dão cashback por conta ou boleto pago | Regulamentos conferidos em 16/10/2026 (benchmark v1) |
| Certeza | Mostrar economia sem descontar a mensalidade é o ponto mais atacado; a FTC processou a Uber por isso em abril de 2025 | Comunicado da FTC conferido (benchmark v2) |
| Suposição | Um único número de ganho, em reais e já descontado o plano, igual na decisão, no comprovante e no painel, aumenta a confiança | Teste de usabilidade com cerca de 5 clientes, bruto contra líquido |
| Suposição | Um clube de descontos entrega o ganho visível sem a complexidade de uma carteira | Jurídico e financeiro |
| Suposição | Benefício por hábito (débito automático, Pix Automático) aumenta o pagamento em dia nas contas recorrentes | Experimento, depois de existir a regra |
| Dúvida | Guardar saldo do cliente exige autorização do Banco Central (Lei 12.865/2013)? | Jurídico. A lei não está no cérebro nem nos Contexts: veio de conhecimento geral e precisa ser conferida. A base interna não registra parceiro para conta de cliente final, e a dúvida pesa mais agora que o iGreen Pay vai entrar no app, com Pix e carteira (Sergio, 16/10/2026) |
| Dúvida | Quem processa o pagamento do Telecom, e como são cobradas a mensalidade e a recarga? | Respondida pela base interna, a confirmar com o time do Telecom: pedido integrado à operadora parceira Contel, ativação cobrada à parte da recarga mensal, Pix ou cartão |
| Dúvida | Como o cliente de energia paga a iGreen hoje, e o que é o "Boleto Único"? | Respondida pela base interna, a confirmar com o financeiro de energia: dois boletos ou Boleto Único, com repasse automático à distribuidora. No app, paga pelo gateway do Pay, com Pix ou cartão |
| Dúvida | Dá para pagar o seguro dentro do app, sem sair para a BBone e a Cielo? | Time de Seguros, com a BBone. A base interna diz que as mensalidades aceitam boleto, Pix, cartão e link da Cielo, mas não diz se o Pix e o cartão são pagos dentro do app |
| Dúvida | O app do cliente, hoje chamado iGreen, não tem Context próprio. O iGreen Club é o clube de descontos dentro dele. Onde vive a regra do app e do Club? | Produto. A base interna diz que o Club foi reativado em 21/09/2026, com mensalidade de R$ 29,90, e junta cupons, carteira de cashback e contratação (a confirmar; pauta, decisão 4) |
| Dúvida | Pagar com o Pay pode render algo ao cliente, se a palavra "cashback" é proibida no Pay? | Produto e time do Pay (pauta, decisão 2) |

## Métodos

| Método | Por que este | Por que não o vizinho | Pré-requisitos |
|---|---|---|---|
| Service blueprint dos três pagamentos | "Universal" depende do bastidor de cada produto, e o bastidor é diferente nos três | Não o journey map agora: falta pesquisa com cliente. Ele serve depois, para a camada do cliente | Sessão com alguém de cada área para confirmar o bastidor (ainda não feita) |
| Benchmark de mercado, em duas rodadas | O Sergio trouxe referências (iFood, Nubank, Inter, Mercado Pago) e a regra de benefício ainda não existe | Não desenhar direto a tela: as regras de saldo e cashback não existem | Só fontes públicas, sem login |

## Achados

Detalhe e fontes em cada arquivo desta pasta.

1. **Os três pagamentos de hoje não têm uma fonte única do que o cliente pagou.** O Telecom registra no app, o Seguros na BBone e a energia não está documentada. Inferido; `blueprint.md`.
2. **Carteira e cashback não têm dono nem regra em nenhum Context.** São produto novo, não ajuste de tela. Verificado nos três Contexts; `blueprint.md`.
3. **Nenhum dos cinco apps da primeira rodada dá cashback por conta paga.** Verificado; `2026-10-16-benchmark-pagamento-universal.md`.
4. **Ninguém mostra, lado a lado, o que cada forma de pagamento rende.** O Mercado Livre mostra o cashback da forma escolhida antes de confirmar. Verificado com print fornecido; benchmark v1 e v2.
5. **Clube, cupom, ponto e cashback são da mesma família, mas mudam a regra.** Desconto é certo e na hora; cashback, crédito e ponto vêm depois e com condição; clube tem custo. Interpretação a partir de 8 apps; `2026-10-16-benchmark-beneficios-v2.md`.
6. **A economia bruta e a assinatura embutida no pagamento são as maiores fontes de reclamação.** Verificado em reclamações públicas e na ação da FTC; benchmark v2.
7. **O "poderia ganhar" funciona como oferta concreta antes da decisão**, como no Clube 99 e na Vivo, e não como culpa depois. Interpretação; benchmark v2.
8. **Hoje o benefício é o desconto na energia, e o cashback vem só por indicação.** Não há cashback por pagamento em nenhum produto. Na energia, quem tem desconto acima de 10% e paga com atraso cai para 10%. Base interna, a confirmar; `respostas-base-interna.md`.

## Próximo passo e registro

- **Próximo passo:** uma reunião de cerca de 30 minutos com produto, financeiro, jurídico e o time do iGreen Pay, pela pauta v2. Antes dela, as perguntas por produto vão por mensagem para Telecom, Seguros e energia. Entregável: as regras de benefício e de carteira, escritas. Dono: Sergio.
- **Depois:** desenhar com o `personal-design` três telas (confirmação com "este pagamento rende R$ X", comprovante único e painel de economia líquida) e testar com cerca de 5 clientes, no celular deles. Se a perda do desconto por atraso for confirmada, entra também o aviso antes do vencimento da energia.
- **Registrar em:** quando as regras forem decididas, uma decisão no Context de cada produto afetado, via `/ux-decision`.

## Arquivos desta pasta

| Arquivo | O que é |
|---|---|
| `README.md` | Esta investigação |
| `blueprint.md` | Service blueprint dos três pagamentos, feito só com os Contexts. Rascunho: falta a sessão com as áreas |
| `2026-10-16-benchmark-pagamento-universal.md` | Benchmark v1: pagamento, saldo e cashback em iFood, Nubank, Inter, Mercado Pago e PicPay, com um bloco de correção no topo |
| `2026-10-16-benchmark-beneficios-v2.md` | Benchmark v2: benefícios (clube, cupom, ponto, cashback) em oito apps |
| `pauta-areas.md` | Pauta da reunião com produto, financeiro, jurídico e o time do iGreen Pay (versão 2). Cada pergunta aponta a tela do protótipo "iGreen — fluxo da Carteira" v5.1 onde a regra aparece. As perguntas por produto vão por mensagem |
| `respostas-base-interna.md` | Resposta da base interna da iGreen à versão 1 da pauta, como veio. Fonte da seção 3 da pauta, a confirmar com cada dono |
| `ficticio-respostas-da-pauta.md` | **FICTÍCIO.** Respostas inventadas para a pauta, para testar as skills sem esperar a reunião. Não são regra nem fonte |
| `telas/index.html` | Protótipo v1 das 3 telas (confirmação, comprovante e painel), com regras e valores **fictícios**. Abrir no navegador; se ficar em branco, usar o servidor local do sandbox |
| `telas/teste-v21.html` | Versão v2.1 preparada para o teste de usabilidade: uma tela por vez, fluxo ligado, sem notas de demonstração |
| `telas/header-propostas.html` | Propostas de header da home (A, B e C), versão final de 22/10/2026 |
| `roteiro-teste-usabilidade.md` | Roteiro do teste de usabilidade com cerca de 5 clientes, sobre a versão de teste |
| `passagem-design-v1.md` | Passagem para o design: redesenhar só o visual das 3 telas do v1, no padrão de design |
| `avaliacao-prototipo-v1.md` | O que funcionou e o que não funcionou no v1. **Hipóteses, não evidência:** vem de sessões simuladas |
| `simulacao/` | **SIMULAÇÃO, NÃO É EVIDÊNCIA.** As 3 sessões inventadas, o gabarito, a síntese e a avaliação do teste das skills. Serviram para testar o roteiro e o plugin ws-ux |

As versões intermediárias das telas, os scripts, os relatórios de cada app do benchmark e os protótipos que estavam no OneDrive ficaram no sandbox `06-sandbox/2026-10-16-pagamento-universal-telas/`.

Os prints que o Sergio enviou não ficam aqui, porque mostram nomes e fotos de pessoas. Os documentos os citam como "print fornecido N".
