---
type: doc
title: "Pauta — regras do pagamento universal e dos benefícios no app iGreen"
created: 2026-10-16
updated: 2026-10-16
status: active
source: workspace
tags: [growth, investigacao, pauta, pagamento, beneficios, igreen-pay]
---

# Pauta — regras do pagamento universal e dos benefícios no app iGreen

> **Versão 2, de 16/10/2026.** A base interna da iGreen (OS) respondeu boa parte da versão 1, e o Sergio tirou o iGreen Prime e o iGreen+ do escopo. Sobrou o que só jurídico, financeiro e o time do Pay decidem.

## Resumo

- **Objetivo:** sair com as regras escritas que faltam para desenhar o pagamento único e os benefícios. Não é para decidir layout: as telas do protótipo são ilustrativas.
- **Quem:** Sergio; alguém de produto e de growth; financeiro; jurídico; time do iGreen Pay.
- **Duração:** cerca de 30 minutos.
- **Antes da reunião:** as seções 2 e 3 vão por mensagem para Telecom, Seguros e energia. Eles respondem por escrito e não precisam estar na reunião.
- **Material:**
  - o protótipo "iGreen — fluxo da Carteira" v5.1, telas 1 a 7 (na tela 7, só a parte do Club);
  - o blueprint dos três pagamentos;
  - o benchmark v2, em especial a tabela de mecanismos (item 1) e o que muda na recomendação (item 4).

---

## 1. Para decidir na reunião

### Decisão 1 · Saldo do cliente no Pay

**Quando o iGreen Pay entrar no app do cliente, com Pix e carteira, sob qual autorização ou parceiro financeiro o cliente guarda saldo?**

- **Tela do protótipo:** 3. Carteira e 4. Ativação e verificação.
- **Por que importa:** a base interna não registra parceiro para conta de pagamento de cliente final. Guardar saldo de cliente pode exigir autorização do Banco Central (Lei 12.865/2013, a confirmar com o jurídico). O crédito ao cliente depende disto.

### Decisão 2 · Benefício por pagar com o Pay

**Pagar com o Pay vai render algo ao cliente? Se render, com que nome?**

- **Tela do protótipo:** 6. Pagamento da fatura ("+ R$ 2,00 de cashback futuro").
- **Por que importa:** regra da base interna: no contexto do iGreen Pay, a palavra "cashback" é proibida, porque o Pay não tem cashback. Benefício por pagar com o Pay seria regra nova.

### Decisão 3 · Uso do cashback de indicação

**O saldo de cashback de indicação pode pagar uma fatura no app? Tem validade?**

- **Tela do protótipo:** 3. Carteira e 6. Pagamento ("Usar cashback").
- **Por que importa:** hoje o saldo pode ser gasto ou resgatado, mas a base interna diz que ele é separado do abatimento da fatura. É a pendência 3 do Telecom.

### Decisão 4 · Mensalidade do Club

**A mensalidade de R$ 29,90 do Club vale para quem? Se o cliente paga, a economia mostrada desconta a mensalidade?**

- **Tela do protótipo:** 7. Club.
- **Por que importa:** a base interna diz que o Club foi reativado em 21/09/2026 com essa mensalidade. A FTC processou a Uber por mostrar economia sem descontar a assinatura.

### Decisão 5 · Aprovação dos textos

**Quem aprova os textos de benefício e de oferta?**

- **Tela do protótipo:** todas.
- **Por que importa:** a base interna não tem fluxo documentado. A oferta feita obriga a empresa (CDC). Não é parecer jurídico.

---

## 2. Perguntas por produto (por mensagem)

### Telecom

1. Qual prazo vai no `expira_em` do pedido não pago? A base interna diz que o campo existe, mas não diz o prazo. É a pendência 6 do Context.
2. O gateway que recebe o Pix e o cartão do Telecom é o mesmo iGreen Pay da energia?

### Seguros (com a BBone)

1. As mensalidades por Pix e cartão já são pagas dentro do app, ou todas saem para a BBone e a Cielo?
2. O status do pagamento pode chegar ao app na hora? Hoje a apólice espera um processo que roda a cada 30 minutos.
3. O seguro pode dar cashback por pagamento, e não só por indicação? Há regra da BP Seguradora ou da SUSEP sobre isso? A base interna não tem registro.

### Energia (financeiro e operações)

1. Quem tem desconto acima de 10% e paga com atraso perde o desconto só naquela fatura ou de vez? A regra vale para todas as fornecedoras?
2. No app, dá para pagar as duas modalidades (dois boletos e Boleto Único) ou só o Boleto Único?

---

## 3. O que a base interna já respondeu (confirmar com o dono)

> **Fonte:** base interna da iGreen (OS), consultada pelo Sergio em 16/10/2026. É uma resposta gerada a partir da base, citando regras e tabelas. Cada linha precisa do "sim" do dono antes de virar regra no Context. Texto completo em `respostas-base-interna.md`.

Cada bloco vai para o dono que está no título. Financeiro, produto e o time do Pay confirmam os deles na reunião.

### Telecom

- **Benefício:** desconto promocional e 5 GB a mais nos planos com portabilidade confirmada.
- **Pagamento:** pedido integrado à operadora parceira Contel. A ativação é cobrada à parte da recarga mensal. Pix ou cartão.
- **200 kWh da portabilidade:** benefício do licenciado, não do cliente. Sai com 30 dias ou mais de inadimplência da linha.

### Seguros

- **Benefício:** o preço da apólice. Cashback só em campanha sazonal (out/2026) e por indicação, com volume residual.
- **Pagamento:** a primeira parcela sai na proposta. As mensalidades são faturas avulsas, por boleto, Pix, cartão ou link da Cielo. A apólice fica ativa em até 30 minutos. Sem renovação automática.

### Energia (financeiro e operações)

- **Benefício:** desconto contratual na fatura, sobre a energia compensada. Não há percentual fixo: sem valor no cadastro, vale a tabela por distribuidora e fornecedora.
- **Atraso:** quem tem desconto acima de 10% e paga depois do vencimento cai para o piso de 10%.
- **Pagamento:** dois boletos (distribuidora e iGreen) ou Boleto Único, com repasse automático à distribuidora pelo Pay. No app, pelo gateway do Pay, com Pix ou cartão.
- **Economia realizada:** o que a pessoa pagaria menos o que pagou, só nas faturas já pagas.
- **Primeira fatura** (operações de energia): chega de 60 a 180 dias depois da assinatura. A iGreen não manda boleto por e-mail, e o boleto enviado pela fornecedora gera medo de golpe.

### Financeiro

- **Cashback hoje:** só por indicação, nos três produtos. Quem indica recebe 50% do bônus extra do mês na entrada e 50% da recorrência do licenciado a cada fatura paga pelo indicado. Sem teto mensal. É cancelado se o indicado for desvalidado ou cancelar.
- **Onde fica o cashback:** saldo em reais no app do Club, que pode ser gasto ou resgatado. Separado do abatimento da fatura.

### Produto

- **iGreen Club:** reativado em 21/09/2026, com mensalidade de R$ 29,90. Junta cupons de parceiros, carteira de cashback e acesso à contratação de Telecom e Seguros. Metas e gamificação não existem.

### Time do Pay

- **iGreen Pay hoje:** gateway de pagamentos e gestão de saldo, saque e empréstimo para licenciados. "Cashback" é palavra proibida no Pay. Sem parceiro registrado para conta de cliente final.
- **Crédito:** só a Antecipação de Bônus, para licenciados ativos.

---

## 4. Fica para depois

- **Crédito ao cliente:** vai existir quando o Pay entrar no app (Sergio, 16/10/2026). As regras e o lugar dele na Carteira vêm depois da decisão 1.
- **iGreen Prime e iGreen+:** conceito do Sergio para proposta, fora do escopo por agora (telas 7 e 8 do protótipo).
- **Metas no Club:** não existem nos sistemas. É o passo seguinte que o Sergio quer dar.

---

## 5. O que precisa sair da reunião

- As decisões 1 a 5, cada uma com dono e prazo.
- O "sim" ou a correção de cada dono na seção 3.
- O que ficar em aberto vira pendência no Context do produto.
- Com as regras, o próximo passo é desenhar e testar com cerca de 5 clientes, no celular deles:
  - a confirmação com o que o pagamento rende;
  - o comprovante único;
  - o painel de economia, já descontada a mensalidade do Club quando houver;
  - o aviso antes do vencimento da energia, se a perda do desconto por atraso for confirmada.

---

## Para registrar depois

- Cada regra decidida vira uma decisão no `decisions/` do Context do produto, via `/ux-decision`.
- O app iGreen e o iGreen Club não têm Context próprio. Com as regras do Club e do Pay crescendo, vale criar um.
