# Teste do fluxo completo das skills de UX · pagamento universal

> ⚠ **Simulação.** Regras, sessões e "usuários" são inventados. Este documento avalia as skills, não o produto. Rascunho no scratchpad, 19/10/2026. Nada foi gravado no workspace, exceto a correção da `ws-ux-ops` que você aprovou.

---

## 1. O caminho, do início ao fim

1. **Pergunta, método e base:** `ws-ux-advisor`, `ws-ux-method` (service blueprint) e `ws-benchmark`. Foi feito antes, nesta sessão.
2. **Telas v1:** `personal-design`, com as regras fictícias.
3. **Roteiro do teste:** `ws-ux-research`, corrigido depois em 7 pontos.
4. **Rodada 1:** 3 sessões fictícias, escritas por mim, com erros plantados de propósito e um gabarito separado.
5. **Síntese:** `ws-ux-research`, por um agente que não viu a conversa.
6. **Revisão da síntese:** `ws-ux-evidence`, em duas etapas, com dois agentes.
7. **Registro:** `/ux-decision` (`ws-ux-ops`). Primeiro rodei eu; depois, dois agentes testaram a regra nova.
8. **Correção de skill:** regra de dado simulado na `ws-ux-ops`, aprovada e gravada.
9. **Avaliação do protótipo v1** e desenho da **v2**, com 6 correções.
10. **Revisão da v2:** `ws-ux-flow`, por um agente.
11. **Rodada 2:** usuários sintéticos, pela regra da `ws-ux-research`, por um agente.
12. **Medição:** `ws-ux-data`, por um agente.
13. **Aprendizado:** `/ux-learn`, por um agente.

**Não testados:** `/ux-council`, `/ux-intake`, `/ux-ask`, `/ux-lint` e o comando `/ux-plan`. As skills foram usadas direto, sem passar por esses comandos.

---

## 2. Resultado por skill

**`ws-ux-research`, síntese**
- Funcionou: pegou as 10 armadilhas e foi mais rigorosa que o meu gabarito em dois pontos.
- Não funcionou tão bem: exagerou em 4 afirmações e saiu com 500 linhas, quando o pedido é uma leitura de uma página.

**`ws-ux-evidence`**
- Funcionou: pegou os exageros da síntese e achou a falha da T5 do roteiro.
- Não funcionou tão bem: tirou 111 afirmações, a maioria trivial.

**`/ux-decision` (`ws-ux-ops`)**
- **Antes da correção:** recusou o registro, mas porque eu sabia que era simulação. A skill não tinha regra para isso.
- **Depois da correção:** as duas variantes passaram.
  - **Variante A:** o aviso de simulação estava escondido nos limites do arquivo. O agente achou o aviso e não registrou.
  - **Variante B:** o arquivo não tinha aviso nenhum. O agente desconfiou pelo lugar do arquivo (pasta temporária) e pelas respostas fictícias que já existiam na investigação, e perguntou antes de seguir.
- **Ressalva:** sem essas pistas de contexto, a regra depende de o arquivo trazer o rótulo.

**`ws-ux-flow`**
- Funcionou: comparou v1 e v2, mostrou o que resolveu e o que não resolveu, e achou 4 problemas de severidade 3.
- **Limite:** leu o código, não viu a tela. O Playwright grava arquivos no workspace e foi proibido. Por isso os cortes de texto que ele aponta são cálculo dele, não observação.

**`ws-ux-research`, usuários sintéticos**
- Seguiu a regra à risca: rótulo de simulação em tudo, nenhum "n de N" e cada saída virou hipótese com o teste que a validaria.
- Achou 10 hipóteses e 14 problemas no roteiro. Vários são reais, e alguns são erro meu (ver seção 4).

**`ws-ux-data`**
- Recusou o A/B entre a v1 e a v2. O critério de liberação falhou em 6 itens: a hipótese vem de simulação, não há métrica principal nem números de partida, não há tráfego e o hub não existe.
- Montou os eventos, os funis e as métricas, sem inventar nenhum número.

**`/ux-learn`**
- Não criou ficha a partir de simulação.
- Classificou a fonte como opinião com conflito de interesse.
- Pegou uma afirmação do meu pedido que não estava na fonte.

---

## 3. A v2 resolveu?

**Resolveu**
- **O comprovante destaca o valor pago.**
- **O boleto mostra "Boleto gerado · aguardando pagamento"**, com o código.

**Resolveu em parte**
- **Faixa do prazo:** diz "cai para 10%", mas não diz quanto isso custa em reais (R$ 7,60). Com fonte grande, o fim da frase some.
- **Pay:** a explicação existe, mas é opcional e não responde o que pesa para quem desconfia. Dá para tirar o dinheiro? Tem custo? Quem guarda o dinheiro?
- **Total do hub:** veio para baixo e ganhou "não é saldo", mas continua sendo o maior número da tela, ao lado das moedas.
- **Valores competindo:** a ordem melhorou, mas depois de pagar o hub ainda mostra cerca de 15 valores em reais.

**Problemas novos ou que ficaram, de severidade 3**
- **O Pix "se paga sozinho"**, sem QR nem copia-e-cola. É o mesmo defeito que o boleto tinha na v1. Como o Pix já vem marcado, a tarefa 2 pode medir um fluxo que não existe.
- **O boleto pendente some.** Não dá para achá-lo de novo nem trocar a forma de pagamento. E o cashback sai do saldo antes de o boleto ser pago.
- **Textos novos cortam com fonte grande:** "cai para 10%", "não é saldo" e "cai até 20/10". Isso pega a WCAG 2.2, critério 1.4.4, como recomendação.
- **Leitor de tela:** a faixa do prazo não é lida, o foco não vai para o comprovante e o andamento do pagamento não é anunciado.

**Uma ressalva honesta:** a revisão e a rodada sintética chegaram a quase os mesmos pontos (Pix, boleto, faixa e cortes). Mas as duas leram o mesmo código. Pela regra da própria `ws-ux-evidence`, isso conta como uma fonte só: é convergência, não confirmação.

---

## 4. Erros meus que o fluxo pegou

- **Não atualizei o roteiro depois da v2.**
  - O critério da T4 ainda fala em "Seu cashback" e em "total do topo", e a pergunta final aponta "o cartão branco logo abaixo do total". Na v2, esse cartão fica acima.
  - O roteiro também não tem critério para quem gera boleto: nesse caso nada saiu do bolso, e o total fica em R$ 198,60.
- **As datas do protótipo** (vencimento em 23/10, comprovante de 16/10) não batem com uma sessão feita depois de 23/10.
- **A abertura contradiz o bloco de quem ajuda.** Ela diz "como seria sem ninguém do lado", e o termo de consentimento não inclui quem ajuda.
- **O aquecimento novo ainda descreve o cashback.** O "depois de você pagar alguma coisa" já explica como funciona.

**Lacuna das skills que isso mostra:** nada lembra de revisar o roteiro quando o protótipo muda.

---

## 5. Plano de medição, em resumo

- **Métrica principal:** faturas pagas em dia pelo app, divididas pelas faturas abertas, contadas por mês de vencimento.
- **Eventos:** 18, sem dado pessoal. Dinheiro e status vêm do servidor. Todo evento do hub leva a versão (v1 ou v2).
- **Funis:**
  - pagamento, contado por fatura: aberta → viu → tentou → pagou em dia;
  - saldo, contado por pessoa: tem saldo → viu o hub → tentou → usou ou resgatou.
- **Guardrails** (limites que não podem piorar): chamados ao suporte sobre pagamento ou saldo, pagamento duplicado e falhas por tentativa. As margens ainda não estão definidas.
- **No lugar do A/B:** um teste de compreensão entre a v1 e a v2 com gente real, perguntando "quanto você pode usar hoje?".
- **Lei:** se a confusão do total se confirmar com gente real, é caso de corrigir, não de testar. É o dever de informação clara do CDC (art. 6º, III, e art. 31). Não é parecer jurídico.

---

## 6. Balanço

**O que funcionou**
- **As travas de segurança seguraram em todos os pontos:**
  - simulação não virou decisão nem ficha do cérebro;
  - o A/B foi barrado;
  - nenhum Context foi lido sem pergunta.
- **A revisão independente acha erro de quem fez o trabalho,** inclusive os meus.

**O que não funcionou**
- **As saídas são longas demais.** Síntese, revisão e plano de medição passam muito de uma página.
- **Revisão de tela sem renderização** é mais fraca. Sem um navegador que não grave no workspace, a `ws-ux-flow` lê o código e calcula, sem ver.
- **Nada lembra de revisar o roteiro** quando o protótipo muda.

**Custo:** 9 agentes, de pouco mais de 1 minuto a 15 minutos cada.

---

## 7. Próximo passo

1. **v2.1 das telas:**
   - Pix com QR e copia-e-cola, "aguardando pagamento";
   - boleto pendente fácil de achar de novo;
   - linhas que quebram em vez de cortar;
   - a perda em reais na faixa do prazo.
2. **Roteiro alinhado com a v2:** critérios das tarefas, pergunta final, datas, abertura e caminho do boleto.
3. **Teste com clientes reais.** Ele depende da reunião das regras, do link aprovado e do kit de recrutamento.
