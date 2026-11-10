# Nubank — relatório do agente (2026-10-16)

Limites: sem tela real datada; Page Flows sem Nubank; Mobbin nada público; Reclame Aqui e Tecnoblog 403. Jornada a partir de textos oficiais.

## Jornada de um boleto
- Entrada: Pagar > Pagar boletos (código); Buscador de Boletos (DDA, ativar); QR/copia e cola na área Pix [1][4][12]. Mostra boletos do CPF. Pagar agora ou agendar. Notificação de boleto novo [4].
- Conferência: beneficiário, valor, vencimento; vencido com juros e multa calculados [1].
- Forma: "Escolher forma de pagamento": saldo ou cartão [2]; cartão 1 a 12x, juros, IOF, parcela e total [3]; adiar até 2 faturas [2].
- Confirmação: senha de 4 dígitos [2]; resumo.
- Depois: comprovante na hora; agendado recebe "Comprovante de agendamento" [3][11]; cancelar agendado até horário-limite [10]; falha avisada por e-mail [3].

## Critérios
1. Entrada: código, DDA opcional, QR/copia e cola Pix, Pix Automático. Fato [1][4][12]
2. Antes: beneficiário, valor, vencimento; no crédito juros, IOF, parcelas, total. Fato [1][3]. Vantagens: não verificado.
3. Formas: saldo ou cartão, Limite Adicional temporário. Fato [2]. Saldo + cartão no mesmo boleto: não verificado; caminho oficial "Converter limite" em saldo (Interpretação) [2]. Parcial: não verificado.
4. Cashback: boleto, Pix, seguros, NuCel, assinaturas e recargas NÃO geram cashback. Fato [5][6]. Cashback vira saldo, abate fatura ou vai para a Caixinha [5]. Usar no fluxo do boleto: não verificado.
5. Plano: contratos Ultravioleta e Nubank+ excluem boleto e Pix do cashback e da isenção da mensalidade. Fato [5][6]. Aviso na tela: não verificado. Shopping: Ultravioleta +1% em campanha. Fato [9]
6. Comprovante: logo após a senha; separa agendamento de pagamento. Fato [3][11]. Prazos divergem: até 3 dias úteis [3] × até 1 dia útil [1].
7. Histórico: Assistente mostra contas pagas e em aberto, meses anteriores e futuros. Fato [4]. Feed "Meu Cashback" no Shopping: Hipótese. Pagamento e ganho na mesma linha: não verificado.
8. "Deixou de ganhar": não verificado. Mais próximo: ao antecipar parcelas mostra o desconto antes de confirmar. Fato [14]
9. Erro/estorno: agendado cancela em Saldo em conta > Próximos pagamentos > Programados; boleto compensado não cancela, quem devolve é o beneficiário. Fato [10]. Débito automático sem saldo não acontece. Fato [13]. Compra estornada estorna cashback; se resgatado, desconta dos meses seguintes. Fato [5][6][8]. Estorno de boleto no crédito: não verificado.
10. Reclamações: boleto pago e não compensado (7+ títulos); cashback do Shopping negado por regra de sessão/elegibilidade (8+ títulos). Observação [15]. Falha de boletos em dias de pico (10/02/2025, 06/10/2025). Observação [16]
Bacen/Febraban: compensação até 1 dia útil, limite noturno R$ 1 mil, MED [1].

## Saldo e cashback
- Quanto: Ultravioleta 1,25%, Nubank+ 0,5%; Shopping varia por loja (Shopee 3%, teto R$ 50/compra, sem frete) [5][6][8].
- Quando: Ultravioleta "instantaneamente" [7]; Nubank+ quando a compra aparece [6]; Shopping avisa em até 72 h, credita em até 90 dias [8].
- Validade: "não expira" [7], só com cartão ativo [5].
- Combinação: Shopping soma com cartão [9]; boleto e Pix não geram.
- Resgate: irreversível, até R$ 7.500/mês por modalidade [5][6].
- Saldo: boleto no saldo compensa no mesmo dia (até 13h30) ou dia útil seguinte; agendado sai na data [1][11].

## Princípios (Interpretação)
1. Separar "registrado" de "quitado".
2. Custo e ganho antes da senha.
3. Exclusão no fluxo, não só no contrato.

## Fontes (acessadas 2026-10-16)
[1] https://blog.nubank.com.br/como-pagar-boleto/ (16/04/2020, atual. 06/10/2026) — Fato
[2] https://nubank.com.br/nu/cartao/passa-tudo-no-credito — Fato
[3] https://comunidade.nubank.com.br/novidades/post/pague-seus-boletos-no-cartao-de-credito-oAQ47qGkAxx4a03 — Fato (sem data)
[4] https://nubank.com.br/nu/conta/assistente-de-pagamentos — Fato
[5] https://nubank.com.br/contratos/contrato-e-regulamento-nubank-ultravioleta (vig. 26/12/2025) — Fato
[6] https://nubank.com.br/contratos/termos-e-condicoes-nubankmais (vig. 26/12/2025) — Fato
[7] https://nubank.com.br/ultravioleta — Fato
[8] https://comunidade.nubank.com.br/novidades/post/shopee-nu-cashback-3-0QweirhGjZLtsfg — Fato (sem data)
[9] https://nu.com/pt/sala-de-imprensa/consumidores/shopping-do-nu-oferece-ate-10-de-cashback-durante-amazon-prime-day (15/07/2024) — Fato
[10] https://blog.nubank.com.br/paguei-o-boleto-errado-e-agora/ (atual. 06/10/2026) — Fato
[11] https://blog.nubank.com.br/pagamento-e-agendamento-qual-a-diferenca/ (atual. 22/09/2026) — Fato
[12] https://blog.nubank.com.br/pix-cobranca-para-pagamentos-com-vencimento-como-pagar/ (atual. 23/09/2026) — Fato
[13] https://nubank.com.br/contratos/termos-e-condicoes-conta-nubank (vig. 24/06/2026) — Fato
[14] https://blog.nubank.com.br/antecipar-compras-parceladas-no-cartao-nubank/ (atual. 21/07/2026) — Fato
[15] https://www.reclameaqui.com.br/nubank/boleto-nao-compensa_U7x21EWu7-P4DfwF/ e https://www.reclameaqui.com.br/nubank/nao-recebi-o-cashback-da-compra-realizada-pelo-shopping-nu_uG57--NPE2cVBFOM/ — Observação (via busca)
[16] https://olhardigital.com.br/2025/02/10/pro/nubank-fora-do-ar-clientes-relatam-impossibilidade-de-pagar-boletos/ e https://www.moneytimes.com.br/clientes-do-itau-nubank-bradesco-e-santander-relatam-instabilidade-no-pagamento-de-boletos-bancos-se-posicionam-otrp/ — Observação
