---
type: doc
title: "Service blueprint — pagar uma cobrança no app do cliente iGreen"
created: 2026-10-16
updated: 2026-10-16
status: active
source: workspace
tags: [growth, investigacao, pagamento, service-blueprint, telecom, seguros, conexao-green]
---

# Service blueprint — pagar uma cobrança no app do cliente iGreen

**Rascunho de 16/10/2026, montado só com documentos.** As fontes são os Contexts do Conexão Green, do Telecom e do Seguros, lidos com autorização. Ainda não houve pesquisa com cliente nem sessão com as áreas que fazem o bastidor. Por isso as ações do cliente abaixo são **o que o produto espera que ele faça**, não o que se observou.

- **Jornada:** pagar a cobrança de um produto no app. É uma jornada só, com uma faixa por produto, porque hoje cada produto a resolve de um jeito.
- **Objetivo de negócio:** ter um fluxo de pagamento único, em que o cliente veja o que pagou, como pagou, o que ganhou e o que deixou de ganhar.
- **Legenda:** ✅ está no Context · 🔵 inferência ou achado de discovery a confirmar · ❓ lacuna (o Context não diz)

## As seis etapas da jornada

1. Saber que há algo a pagar
2. Ver o que vai pagar
3. Escolher como pagar
4. Pagar
5. Receber a confirmação
6. Depois: histórico, comprovante, benefício

---

## Faixa 1 — Telecom

O único pagamento documentado é o **da nova linha**, contratada no app por quem já tem uma linha.

| Etapa | O cliente faz | O cliente vê | Por trás (bastidor e sistemas) | Estado |
|---|---|---|---|---|
| 1. Saber | Entra em "Nova solicitação" no hub Telecom ou em "Ativação de chip" na Central de Ajuda | Wizard de nova linha | Herda titular, documento, endereço e meios de pagamento salvos | ✅ |
| 1. Saber (mensalidade) | — | — | Como a mensalidade recorrente é cobrada | ❓ |
| 1. Saber (recarga) | Toca em "Adicionar Recarga" no card do plano | CTA com ênfase a partir de 85% de consumo | Como a recarga é paga | ✅ a CTA · ❓ o pagamento |
| 2. Ver | Escolhe o plano depois da portabilidade e revisa | Card do plano já com a franquia composta; "Resumo da sua ativação", com Editar | Preços são placeholders, não fonte comercial | ✅ |
| 3. Escolher | Escolhe a forma de pagamento | Cartão salvo, cartão novo, Pix ou voucher | — | ✅ |
| 3. Escolher (cashback) | — | — | O cashback pode abater a primeira cobrança? (pendência 3 do Context) | ❓ |
| 4. Pagar | Paga dentro do app | — | Quem processa (gateway) | ❓ |
| 4. Pagar (abandono) | Sai antes de pagar | — | Quanto tempo o pedido criado e não pago vive (pendência 6) | ❓ |
| 5. Confirmação | Instala o eSIM logo depois de pagar | Fluxo de instalação; em "Tive um problema", a garantia de que o plano está ativo e o pagamento garantido | Backend consulta o status do perfil na operadora | ✅ |
| 6. Depois | Acompanha o pedido | "Ativar Chip · Pendente", quando sai sem responder | Histórico de pagamento e comprovante | ✅ o acompanhamento · ❓ o histórico |

**Benefícios que existem no Telecom:** todo plano inclui acesso ao iGreen Club, e portabilidade ativa rende 200 kWh (✅). Se aparecem na hora de pagar: ❓.

**Linha de visibilidade:** tudo acontece dentro do app (✅). Se web e app usam o mesmo backend de pedido, ainda não se sabe (pendência 7, ❓).

---

## Faixa 2 — Seguros

| Etapa | O cliente faz | O cliente vê | Por trás (bastidor e sistemas) | Estado |
|---|---|---|---|---|
| 1. Saber | Recebe do consultor, por WhatsApp, o link da proposta | Proposta pública, sem login | Cotação na BBone (Multi-Calc); seguradora real é a BP | ✅ |
| 1. Saber (no app) | Abre a tela de seguros do app | Lista dos seguros ativos | App do cliente busca no backend de seguros | ✅ |
| 1. Saber (mensalidade) | Escolhe vencimento dia 20 ou 25 | — | Como cada mensalidade é cobrada mês a mês, e se há renovação | ✅ o dia · ❓ a cobrança (gap 6.11 do Context) |
| 2. Ver | Lê a proposta | Status, prêmio, coberturas e parcelas | Parcelas definidas pela BBone | ✅ |
| 3. Escolher | Escolhe a forma | Pix recomendado, com destaque e QR com tempo; cartão; boleto, quando disponível; "Pagamento 100% seguro e criptografado" | — | ✅ |
| 3. Escolher (cashback, saldo) | — | — | — | ❓ |
| 4. Pagar | Paga no checkout | Pix na tela; **cartão redireciona para a Cielo**; boleto abre em outra aba | Checkout da BBone, não do app | ✅ |
| 4. Pagar (fora) | Pode aceitar e pagar pelo link direto da BP, fora do fluxo iGreen | Painel da BP | Um robô a cada 30 minutos traz de volta pagamentos feitos fora | ✅ |
| 5. Confirmação | Espera | Status consultado a cada poucos segundos | A fonte da verdade é a BBone; apólice só nasce depois de pagamento e vistoria | ✅ |
| 6. Depois | Pode desistir em 7 dias | — | Arrependimento com restituição em 7 dias; reembolso ou estorno não existe no código | ✅ a regra · ❓ o fluxo (gap 6.12) |

**Linha de visibilidade:** o pagamento **sai do app**. A cobrança é da BBone, o cartão vai para a Cielo e o status volta por sincronização (✅). Mostrar no app "o que pagou" depende do que a BBone devolve, e pode atrasar até 30 minutos (🔵).

---

## Faixa 3 — Energia (cliente do Conexão Green)

O Context do Conexão Green descreve o **cadastro**, não o pagamento da conta. Quase toda a faixa é lacuna.

| Etapa | O cliente faz | O cliente vê | Por trás (bastidor e sistemas) | Estado |
|---|---|---|---|---|
| 1. Saber | — | Como a cobrança da iGreen chega ao cliente | — | ❓ |
| 2. Ver | No cadastro, vê a economia estimada | "10% de desconto · iGreen + CEMIG-D · sua economia estimada" e o simulador de economia | Regras de desconto por estado, distribuidora e consumo | ✅ no cadastro · ❓ na cobrança |
| 3. Escolher | No cadastro, aceita a forma de cobrança | Boleto Único, marcado por padrão; split e débito aparecem se a regra da distribuidora permitir | O que é exatamente o "Boleto Único" | ✅ a opção · ❓ o significado |
| 3. Escolher (Pix, cartão, saldo, cashback) | — | — | — | ❓ |
| 4. Pagar | — | — | Onde e por quem a conta é paga | ❓ |
| 5. Confirmação | — | — | — | ❓ |
| 6. Depois | — | — | Achado do discovery: primeira fatura inesperada, percepção de golpe e bloqueio de pagamento por desconfiança (pendência P20, sem número) | 🔵 |

**Atenção ao nome:** no código do cadastro, "bônus" (`getBonusRules`) é a **regra de desconto da energia** (✅). Se o fluxo novo usar "bônus" para outra coisa, como prêmio no pagamento, os dois sentidos vão se confundir (🔵).

---

## Camada comum: o que o fluxo universal precisaria e não existe

| Peça | O que os Contexts dizem | Estado |
|---|---|---|
| Carteira com saldo | Nada, em nenhum dos três | ❓ |
| Cashback | Só aparece como pergunta no Telecom (abate a primeira cobrança?) | ❓ |
| "O que deixou de ganhar" | Depende de uma regra de cashback que ainda não existe | ❓ |
| App que junta tudo | O app do cliente aparece como iGreen Club (app-club) no Seguros e no Telecom; não tem Context próprio | ✅ existe · ❓ o Context |
| Quem processa cada pagamento | Telecom: ❓ · Seguros: BBone e Cielo ✅ · Energia: ❓ | — |
| Histórico único | Três fontes de verdade diferentes: o app (Telecom), a BBone (Seguros) e uma que não se sabe (energia) | 🔵 |

## Onde o processo falha, espera ou fica sem dono

1. **Seguros paga fora do app.** O cartão vai para a Cielo, e o status volta por sincronização. Um fluxo universal precisa saber se a BBone aceita pagamento dentro do app (🔵).
2. **Não há uma fonte única do que o cliente pagou.** Um histórico com "o que pagou e como" precisa juntar três sistemas (🔵).
3. **Carteira e cashback não têm dono nem regra.** São produto novo, não ajuste de tela (🔵).
4. **O pagamento da energia não está documentado,** e é onde está a dor conhecida da primeira fatura (🔵).
5. **Pedido não pago no Telecom** não tem prazo de expiração definido (❓, pendência 6).

## Perguntas para levar às áreas

| Pergunta | Quem responde |
|---|---|
| Quem processa o pagamento do Telecom, e como é cobrada a mensalidade e a recarga? | Time do Telecom e backend |
| Como o cliente de energia paga a iGreen hoje, e o que é o "Boleto Único"? | Financeiro e operações de energia |
| A BBone permite pagar o seguro dentro do app, sem redirecionar? | Time de Seguros, com a BBone |
| A carteira com saldo existe ou é produto novo? Guardar saldo do cliente pode cair na regulação de instituição de pagamento do Banco Central (Lei 12.865/2013). Não é parecer jurídico: confirmar com o jurídico | Produto, financeiro e jurídico |
| Quais são as regras do cashback: quanto, onde se ganha, validade, quando fica disponível e se abate qualquer produto? | Produto e growth |
| Os benefícios (iGreen Club, kWh da portabilidade, desconto da energia) devem aparecer na hora de pagar? | Produto |

## Lei que já vale para qualquer versão

O que o cliente ganha, ou deixa de ganhar, precisa estar claro antes do pagamento, e a oferta feita obriga a empresa: CDC (arts. 6º, 30, 31, 35, 37, 39 e 49) e Decreto 7.962/2013, no comércio eletrônico. Não é parecer jurídico.

## Base

- Contexts: `conexao-green` (CONTEXT, `areas/fluxo-atual`, `areas/fluxo-cadastro`, `areas/insights`, `areas/gaps-pendencias`), `telecom` (CONTEXT, `decisions/2026-09-08-ativacao-inapp-esim`), `seguros` (CONTEXT, `areas/jornada-cotacao`, `areas/regras-negocio`, `areas/gaps-pendencias`).
- Cérebro: `service-blueprint` (certeza baixa), `brasil` (gatilho L2).
- A Lei 12.865/2013 não está no cérebro nem nos Contexts: vem do meu conhecimento geral e precisa ser conferida.
