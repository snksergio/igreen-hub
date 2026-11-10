---
type: doc
title: "O que funcionou e o que não funcionou no protótipo v1"
created: 2026-10-19
updated: 2026-10-26
status: draft
source: workspace
tags: [growth, pagamento-universal, prototipo, ficticio]
---
# O que funcionou e o que não funcionou no protótipo v1

> Guardado no workspace em 26/10/2026, a partir da pasta temporária da sessão que fez o trabalho. Os caminhos temporários citados abaixo não valem mais: o protótipo está em `telas/` desta pasta.

> ⚠ **Hipóteses, não evidência.** Tudo vem de 3 sessões simuladas. Base: a síntese (`simulacao/sintese.md`), já corrigida pela revisão de evidência (`simulacao/avaliacao-teste-skills.md`).

---

## Tela 1 · Pagar fatura

**Funcionou**
- As 3 chegaram ao comprovante. P3 precisou da filha para ligar o cashback.
- Quem viu o cartão de cashback entendeu a conta: P1 ligou na hora e leu "falta pagar cento e vinte".
- O detalhe da fatura explica bem o prazo para quem abre. P1 abriu sozinha e respondeu certo.

**Não funcionou**
- **A faixa do prazo não diz o que se perde.** "Pague até 23/10 e mantenha os 15%" levou P2 a achar que perderia o desconto todo, e P3 perguntou "perde o quê?". 2 de 3 não abriram o detalhe sozinhas. Certeza moderada.
- **O Pay não se explica.** As 3 não sabiam o que é. P3 perguntou se era golpe, o que é grave mesmo sendo 1 de 3. Certeza moderada para "não sabem o que é" e baixa para "a desconfiança faz evitar".
- **O Pix já vem marcado como "último usado".** P2 foi direto nele, sem comparar com as outras formas. Isso não é erro, mas pode esconder a vantagem do Pay. É hipótese.

**Não deu para saber:** se as pessoas percebem o cashback sozinhas. P2 só falou disso depois de pergunta induzida, e no caso de P3 quem ligou foi a filha.

## Tela 2 · Comprovante

**Funcionou**
- P1 e P2 explicaram bem o pagamento: quanto pagaram, quanto economizaram e se ganharam algo.
- A faixa "Só o saldo Pay rende cashback" foi entendida por P2, que disse "não ganhei nada".

**Não funcionou**
- **O valor grande é o da fatura, não o que foi pago.** Com o cashback ligado, o topo mostra R$ 129,20 e o "Você pagou", R$ 120,00. P3 leu o topo como valor pago, e P1 hesitou antes de corrigir. Certeza baixa, porque no caso de P3 a filha tinha ligado o cashback.
- **Boleto aparece como "Fatura paga" na hora, sem código.** P3, que paga na lotérica, perguntou "Cadê o boleto pra eu imprimir?". É grave. Parte é limite do protótipo, que trata todo pagamento como imediato.
- **Desconto chamado de cashback.** P3 disse "ganhei vinte e dois reais de cashback" sobre o desconto. Certeza baixa.

## Tela 3 · Hub

**Funcionou**
- As 3 acharam o total. A pergunta usava palavras perto do rótulo, então isso pode estar inflado.
- Quem viu o "a receber" entendeu (P1, a única que teve esse valor).
- P1 separou desconto e cashback na origem dos ganhos.

**Não funcionou**
- **O total foi tomado como dinheiro disponível.** 2 de 3 (P2 e P3) responderam que podiam pegar o total, R$ 221,40. Parte disso pode vir da pergunta da T5 ("Desse dinheiro…"), que já corrigimos no roteiro. Certeza moderada para o problema existir e baixa para a causa.
- **Os valores competem.** O hub mostra o total (R$ 221,40), o saldo de cashback (R$ 0,00 ou R$ 9,20), a economia (R$ 174,90) e o cashback recebido (R$ 46,50). P1 e P2 hesitaram sobre qual era o delas.
- **Expectativa de sacar o total.** "Achei que ia poder tirar duzentos reais" (P2). Foi 1 de 3.

## Navegação

- P3 não achou sozinha o caminho de volta ao início. Como o protótipo não tem tela inicial, isso fica como limite do teste.

---

## O que vai para a v2

Só o que o teste apontou. O resto da tela não muda.

1. **Faixa do prazo com a consequência:** "Pague até 23/10. Depois, o desconto cai para 10%".
2. **Pay explicado onde aparece:** uma linha "Sua carteira no app" e um link "O que é o Pay?", que abre uma folha curta. A folha diz de onde vem o saldo e quem guarda o dinheiro, pelas regras fictícias.
3. **Comprovante com o valor pago em destaque.** O topo passa a mostrar "Você pagou R$ 120,00", e o valor da fatura vai para as linhas do cartão.
4. **Boleto que não paga sozinho.** Escolher boleto vira "Gerar boleto". O comprovante vira "Boleto gerado · aguardando pagamento", com o código para copiar e a opção de baixar. A economia só entra no hub depois do pagamento.
5. **Hub: primeiro o que dá para usar hoje.** O saldo de cashback sobe para o topo. O total desce, com um rótulo que não sugere dinheiro entregue: "Economia + cashback desde maio", com a nota "Não é saldo".
6. **Hub: menos valores competindo.** O cartão de R$ 46,50 passa a dizer "recebido desde maio", para não parecer saldo.

**Fica de fora da v2:** o nome "cashback", que você pediu para manter; a tela inicial do app; e o Pix pré-marcado, que é hipótese fraca e mexe na regra de "último usado".
