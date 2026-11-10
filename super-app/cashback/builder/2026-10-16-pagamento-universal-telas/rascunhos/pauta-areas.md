# Pauta — regras do pagamento universal e dos benefícios no app iGreen

- **Objetivo:** sair com as regras escritas que faltam para desenhar o pagamento único e os benefícios. Não é para decidir layout: as telas do protótipo são ilustrativas.
- **Quem:** Sergio; alguém de produto e de growth; financeiro; jurídico; Telecom; Seguros (com a BBone, se der); financeiro e operações de energia.
- **Duração:** cerca de 1 hora.
- **Material:**
  - o protótipo "iGreen — fluxo da Carteira" v5.1, com as telas 1 a 8;
  - o blueprint dos três pagamentos;
  - o benchmark v2, em especial a tabela de mecanismos (item 1) e o que muda na recomendação (item 4).

## Ordem sugerida

1. **Decisões de base (30 min):** produto, financeiro e jurídico. Sem elas, o resto não fecha.
2. **Perguntas por produto (10 min cada):** Telecom, Seguros e energia.
3. **Fechamento (5 min):** quem escreve cada regra e até quando.

## 1. Decisões de base

| # | Pergunta | Tela do protótipo | Por que importa |
|---|---|---|---|
| 1 | Que benefício a iGreen dá em cada produto: desconto na fatura, cashback para abater fatura, crédito, kWh, GB? | 6. Pagamento da fatura ("Usar cashback") | Define o mecanismo. Desconto é certo e na hora; cashback e crédito vêm depois e com condição |
| 2 | Quem paga o benefício, e qual o teto por mês? | 5. Análise da economia | Sai da margem do próprio produto |
| 3 | O cashback abate qualquer produto ou só o que o gerou? Tem validade? O que anula (cancelamento, atraso)? | 3. Carteira e 6. Pagamento | É a pendência 3 do Telecom. Sem validade e sem regra de anulação, vira "o cashback não caiu" |
| 4 | O iGreen Pay é uma conta de pagamento com parceiro financeiro? Quem é o parceiro? | 4. Ativação e verificação | Guardar saldo do cliente pode exigir autorização do Banco Central (Lei 12.865/2013, a confirmar com o jurídico) |
| 5 | O cashback é saldo do cliente ou desconto futuro na fatura? | 3. Carteira ("separado do saldo Pay") | Muda a regulação e a contabilidade |
| 6 | O Club passa a ter cashback e metas, ou isso fica num lugar à parte? | 7. Club + iGreen Prime | Hoje o Club é só cupom de parceiro, sem relação com os produtos |
| 7 | No Prime, quanto vale um ponto em reais? O multiplicador multiplica o quê? Um atraso quebra a meta? | 7. iGreen Prime ("4.200 pts", "2×", "Telecom foi paga com atraso") | Ponto sem valor em reais e condição escondida foram as maiores fontes de reclamação no mercado |
| 8 | O iGreen+ vai ter preço? Se tiver, a economia mostrada desconta a mensalidade? | 8. iGreen+ | A FTC processou a Uber por mostrar economia sem descontar a mensalidade |
| 9 | Quem aprova os textos de benefício e de oferta? | Todas | A oferta feita obriga a empresa (CDC). Não é parecer jurídico |
| 10 | As ofertas de crédito (empréstimo pessoal) ficam na Carteira, junto dos benefícios? | 3. Carteira | Misturar crédito com recompensa merece regra própria |

## 2. Perguntas por produto

**Telecom**
- Quem processa o pagamento hoje? Como são cobradas a mensalidade e a recarga?
- Pedido criado e não pago expira em quanto tempo? É a pendência 6 do Context.
- Os benefícios que já existem, como os 200 kWh da portabilidade e o acesso ao iGreen Club, devem aparecer na hora de pagar?

**Seguros (com a BBone)**
- Dá para pagar dentro do app, sem redirecionar para a BBone e a Cielo?
- O status do pagamento pode chegar ao app na hora, em vez da sincronização de até 30 minutos?
- Como é cobrada a mensalidade mês a mês? O Context registra que não existe fluxo de renovação.
- O seguro pode gerar ou receber cashback? Há regra da seguradora ou da SUSEP sobre isso?

**Energia (financeiro e operações)**
- Como o cliente paga a iGreen hoje, e o que é exatamente o "Boleto Único"? (tela 2. Energia)
- A cobrança pode ser paga no app, por Pix ou cartão? Quem emite: a iGreen ou a distribuidora?
- O desconto da energia entra na "economia realizada", junto do cashback? (tela 5)
- O app pode avisar antes de chegar a primeira fatura? O discovery do Conexão Green registra a percepção de golpe e o bloqueio de pagamento nesse momento.

## 3. O que precisa sair da reunião

- Uma página de regras por produto, mais uma das decisões de base, com dono e prazo.
- O que ficar em aberto vira pendência no Context do produto.
- Com as regras, o próximo passo é desenhar e testar com cerca de 5 clientes, no celular deles:
  - a confirmação com "este pagamento rende R$ X";
  - o comprovante único;
  - o painel de economia já descontado o plano.

## Para registrar depois

- Cada regra decidida vira uma decisão no `decisions/` do Context do produto, via `/ux-decision`.
- O app iGreen e o iGreen Club não têm Context próprio. Se as regras do Club crescerem, vale criar um.
