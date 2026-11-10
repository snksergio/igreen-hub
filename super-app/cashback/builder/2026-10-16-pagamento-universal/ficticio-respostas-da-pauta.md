---
type: doc
title: "FICTÍCIO — respostas simuladas da pauta"
created: 2026-10-16
updated: 2026-10-16
status: draft
source: workspace
tags: [growth, investigacao, pauta, ficticio, teste]
---

# FICTÍCIO — respostas simuladas da pauta

> **⚠ Tudo neste arquivo é inventado.** As respostas foram geradas pelo Claude em 16/10/2026, a pedido do Sergio, para seguir com o teste das skills de UX sem esperar a reunião. **Não são regra da iGreen, não vieram de nenhuma área e não valem como fonte.** Nada daqui foi para um Context. Quando as respostas reais chegarem, elas substituem este arquivo inteiro.

- **O que é real:** a pauta (`pauta-areas.md`) e a resposta da base interna (`respostas-base-interna.md`).
- **O que é fictício:** cada resposta abaixo. As respostas preenchem só o que a base interna não respondeu e não contradizem o que ela disse.
- **Parceiro financeiro:** o nome "Parceiro Exemplo" é inventado. Não é nenhuma empresa real.

---

## Em resumo, o mundo fictício do teste

- O cliente tem **dois saldos separados** no app: o **saldo Pay**, guardado por um parceiro financeiro, e o **saldo de benefícios**, com o cashback de indicação e o Bônus iGreen.
- **Pagar com o Pay rende 1% em Bônus iGreen**, até R$ 5,00 por fatura. Cartão de crédito não rende, e seguro não rende.
- O **saldo de benefícios abate qualquer fatura** paga no app e vale por 12 meses.
- O **Club é incluso** para quem tem um serviço ativo e custa R$ 29,90 para quem não tem.
- Na energia, **o atraso tira o desconto só daquela fatura.**

---

## 1. Decisões (FICTÍCIO)

### Decisão 1 · Saldo do cliente no Pay — FICTÍCIO

O saldo do Pay fica numa conta de pagamento de uma instituição parceira autorizada pelo Banco Central (o "Parceiro Exemplo", inventado). A iGreen aparece como marca. O nome do parceiro aparece no termo de ativação e no comprovante. A ativação pede verificação de identidade (tela 4). Não é parecer jurídico.

### Decisão 2 · Benefício por pagar com o Pay — FICTÍCIO

Sim, e o nome é **Bônus iGreen**, porque "cashback" continua proibido no Pay.

- Rende 1% do valor pago pelo Pay, com Pix pelo Pay ou com saldo Pay.
- O teto é R$ 5,00 por fatura.
- Cartão de crédito não rende.
- O bônus vai para o saldo de benefícios, nunca para o saldo Pay.
- Cai em até 2 dias úteis depois da confirmação do pagamento.

### Decisão 3 · Uso do cashback de indicação — FICTÍCIO

- O saldo de benefícios (cashback de indicação mais Bônus iGreen) abate qualquer fatura paga no app: energia, Telecom e Seguros.
- Pode cobrir até 100% da fatura. O que faltar vai por Pix ou cartão.
- Cada crédito vale 12 meses a partir da data em que caiu.
- A regra de cancelamento da base interna continua: se o indicado for desvalidado ou cancelar, o cashback dele é cancelado.
- Pendência 3 do Telecom: sim, o saldo abate a primeira cobrança da nova linha.

### Decisão 4 · Mensalidade do Club — FICTÍCIO

- Quem tem pelo menos um serviço ativo da iGreen tem o Club incluso, sem mensalidade.
- Quem não tem nenhum serviço paga R$ 29,90 por mês.
- Para quem paga, a economia mostrada no app já desconta a mensalidade.

### Decisão 5 · Aprovação dos textos — FICTÍCIO

- Growth escreve, produto revisa e o jurídico aprova o texto-modelo de cada benefício uma vez.
- Mudança de valor ou de condição volta para o jurídico.
- O prazo do jurídico é de 5 dias úteis.

---

## 2. Respostas por produto (FICTÍCIO)

### Telecom — FICTÍCIO

1. **Prazo do pedido não pago:** 48 horas. O Pix gerado expira em 30 minutos e pode ser gerado de novo dentro das 48 horas.
2. **Gateway:** é o mesmo iGreen Pay da energia.

### Seguros — FICTÍCIO

1. **Mensalidade no app:** Pix e cartão passam a ser pagos dentro do app, pelo gateway do Pay. Boleto e link da Cielo continuam fora do app.
2. **Status:** o pagamento aparece na hora como "pago, apólice em ativação". A apólice ativa continua chegando em até 30 minutos.
3. **Cashback por pagamento:** não. A seguradora não permite benefício ligado ao pagamento do prêmio. O seguro só gera cashback por indicação, como hoje, e não rende Bônus iGreen. Não é análise da SUSEP.

### Energia — FICTÍCIO

1. **Atraso:** quem tem desconto acima de 10% e paga com atraso fica com 10% só naquela fatura. A próxima fatura paga em dia volta ao desconto contratado. Vale para todas as fornecedoras.
2. **Modalidades no app:** dá para pagar o Boleto Único e o boleto da iGreen da modalidade de dois boletos. A fatura da distribuidora continua fora do app.

---

## 3. Confirmação da base interna (FICTÍCIO)

Na ficção, todos os donos confirmaram as linhas da seção 3 da pauta como estão, sem correção. A mensalidade do Club fica explicada pela decisão 4 acima.

---

> **⚠ Fim do conteúdo fictício.** Para desfazer: apagar ou substituir este arquivo quando as respostas reais chegarem. Nenhum outro arquivo depende dele, a não ser a linha dele na tabela de arquivos do README.
