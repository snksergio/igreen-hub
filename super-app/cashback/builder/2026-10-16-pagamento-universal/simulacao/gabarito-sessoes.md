---
type: doc
title: "Gabarito das sessões fictícias"
created: 2026-10-19
updated: 2026-10-26
status: draft
source: workspace
tags: [growth, pagamento-universal, ficticio, simulacao]
---
# Gabarito das sessões fictícias

> SIMULAÇÃO, NÃO É EVIDÊNCIA. Sessões, usuários e regras inventados para testar o roteiro e as skills do ws-ux. Nada daqui vale para o produto nem pode ir para Context.

> ⚠ **Não entregar este arquivo a quem for fazer a síntese.** Ele existe para conferir depois se as skills acharam o que estava plantado. Se o agente da síntese ler isto antes, o teste perde o valor.
>
> Tudo aqui é simulação, escrita pelo Claude em 19/10/2026.

---

## 1. Armadilhas plantadas

Uma boa síntese, seguindo o `ws-ux-research`, precisa pegar cada uma destas.

1. **Fala induzida, P2 [09:18].** M pergunta "Foi fácil pagar?" e P2 responde "Foi, foi fácil". A folha marca como espontânea [E]. Isso não pode virar evidência de que pagar é fácil.
2. **Fala induzida, P2 [09:30].** M usa a palavra "cashback" antes dela e pergunta com sim ou não. O "Não vi não" é induzido. A evidência de que ela não percebeu o cashback é a **ação** [08:20]: pagou com a chave desligada.
3. **Fala induzida, P3 [16:08].** M resume e pede confirmação. O "Isso" não conta. A folha marca [E].
4. **Fala induzida, P3 [19:55].** "Então ficou confuso pra senhora?" → "Isso, ficou." Não conta.
5. **Citação que não bate, folha de P1, T1.** A folha diz "o desconto cai pra 10% se eu atrasar". A transcrição [07:32] diz "Se pagar dia 25 o desconto cai pra dez por cento". A síntese tem que usar a transcrição.
6. **Interpretação na folha de P2, T5.** "P2 ficou perdida no hub, frustrada" é leitura do observador, não observação.
7. **Ação da ajudante contada como da participante, folha de P3, T2.** A folha marca "Ligou o cashback? sim", mas quem ligou foi A [10:30]. T2 deveria ser "concluiu com ajuda".
8. **Dado pessoal na transcrição, P3 [04:18].** O nome da filha aparece. Não pode ir para a síntese.
9. **Quem desenhou conduziu.** Precisa aparecer como limite.
10. **Amostra de 3, e simulada.** Sem porcentagem. Tudo leva o rótulo "simulação, não é evidência" e nada vai para Context.

---

## 2. Padrões que estavam lá

Contagem certa, por ação ou fala espontânea. As falas induzidas ficam à parte.

- **Ninguém sabe o que é o Pay: 3 de 3, espontâneo.**
  - P1 [09:41]: "Esse Pay é o quê, é do banco?"
  - P2 [10:30]: "não sei o que é esse Pay"
  - P3 [09:40]: achou que era golpe
  - É o padrão mais forte das três sessões.
- **Confunde o total devolvido com o que dá para usar hoje: 2 de 3.**
  - P2 [13:30] e P3 [15:50] responderam com o total.
  - **Caso contrário:** P1 [14:06] respondeu certo (zero). Mas se confundiu com os R$ 46,50 do mosaico [14:40], então o resultado é misto.
  - Ponto de atenção: P2 viu três valores diferentes (R$ 221,40, R$ 9,20 e R$ 174,90) e não soube qual era o dela.
- **Não percebe o cashback sozinho na hora de pagar: 2 de 3, por ação.**
  - P2 não ligou [08:20].
  - P3 não ligou; foi a filha [10:30].
  - P1 ligou na hora [08:40].
- **Não abre o detalhe da fatura para ver o prazo: 2 de 3.**
  - P2 [07:05] leu só a faixa e concluiu errado ("perco o desconto todo").
  - P3 não abriu; a filha abriu.
  - P1 abriu.
- **Lê o valor grande do comprovante como o valor pago: P3 [12:05] errou e P1 [10:18] hesitou antes de corrigir.**
  - P2 não entra na conta: pagou a fatura cheia, então o valor do topo era mesmo o que ela pagou.
- **Confunde economia com cashback no comprovante: 1 de 3 (P3 [13:10]).** É sinal, não padrão.

---

## 3. Casos isolados que não podem sumir

- **Medo de golpe com o Pay (P3 [09:40]).** Apareceu uma vez, mas é grave: afeta confiança e pode afetar quem tem mais idade.
- **Boleto aparece como pago na hora (P3 [11:20]).** É **limite do protótipo**, que trata todo pagamento como imediato. Mas aponta uma pergunta real de design: como mostrar o boleto gerado e ainda não pago?

---

## 4. O que procuramos e não achamos

- **O "a receber" foi visto por só 1 de 3** (P1 [14:06], que entendeu). P2 e P3 não pagaram com o Pay, então o valor não apareceu para eles. Conclusão certa: não se sabe se as pessoas entendem o "a receber".
- **A tarefa 6 (de onde veio) teve 2 respostas:** P1 separou desconto de cashback; P3 disse "da luz". P2 não fez. Não dá para concluir.
- **Nome do dinheiro:** "cashback" (P1), "desconto" (P2), "dinheirinho de volta, bônus" (P3). São 3 nomes diferentes em 3 pessoas. Isso não decide a palavra; só mostra que ela ainda está aberta.

---

## 5. O que uma boa síntese NÃO deveria concluir

- "67% não entendem…" ou qualquer outra porcentagem.
- "Pagar é fácil": vem de fala induzida.
- "Os clientes não querem o Pay." O que apareceu é que eles não sabem o que é o Pay, e uma pessoa desconfiou. Não querer é outra coisa, e ninguém foi perguntado.
- Mudar regra de produto a partir disto. As regras são fictícias e as sessões também.
- Qualquer registro em Context.

**Recomendação razoável:** tratar como hipóteses para uma rodada real, com estes pontos a observar:
- explicar o que é o Pay na própria tela de pagamento;
- separar visualmente o total devolvido do saldo que dá para usar;
- mostrar no comprovante o valor pago como destaque;
- deixar claro o prazo da fatura sem precisar abrir o detalhe.
