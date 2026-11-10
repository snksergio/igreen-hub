---
type: doc
title: "Benchmark — fluxo de pagamento com saldo e cashback"
created: 2026-10-16
updated: 2026-10-16
status: active
source: workspace
tags: [growth, investigacao, pagamento, cashback, benchmark]
---

# Benchmark — fluxo de pagamento com saldo e cashback

- **Data:** 16/10/2026 · **Modo:** rápido, nada gravado no workspace
- **Players:** iFood, Nubank, Inter, Mercado Pago, PicPay
- **Para quê:** desenhar do zero o fluxo único de pagamento do app do cliente iGreen (Telecom, Seguros e energia) e escrever as regras de carteira e cashback
- **Legenda de evidência:** **F** fato (fonte oficial) · **O** observação (tela ou relato datado) · **I** interpretação · **H** hipótese · **NV** não verificado
- **Referências:** prefixo por player: IF (iFood), NU (Nubank), IN (Inter), MP (Mercado Pago), PP (PicPay). Lista no fim.

> ### Correção de 16/10/2026, a partir dos prints que o Sergio enviou
>
> Esta rodada olhou só o cashback em sentido estrito e deixou passar benefícios parecidos. Quatro afirmações abaixo estavam erradas ou incompletas:
>
> 1. **O Mercado Livre mostra o ganho antes de confirmar.** Na tela "Revise e confirme", aparece "R$ 5,00 de cashback em Meli Dólar" logo abaixo do total, antes do botão (O, print fornecido, sem data). O que ninguém mostrou foi a **comparação entre formas de pagamento**.
> 2. **O Meli Dólar aparece na home do Mercado Pago**, no card de saldo, e não só na seção Cripto (O, print fornecido).
> 3. **O iFood já mostrou um selo "% de volta no seu saldo"** nas ofertas, que é cashback com outro nome (O, print fornecido de divulgação; o número, 1% ou 7%, não dá para ler com segurança). As Moedas iFood existem, com check-in diário e missões, e o próprio iFood chama as missões de "cashback" numa resposta pública (O e F).
> 4. **O Clube 99 mostra "Economize R$ 2,85 na corrida"** para quem não assina, no meio da corrida (O, print fornecido). É o mais perto de "o que você deixaria de ganhar", em tom de oferta.
>
> Uma segunda rodada, por "benefícios" (clube, cupom, moeda, ponto, cashback), fica proposta à parte.

## 1. Resumo

1. **Nenhum dos cinco dá cashback por pagar conta ou boleto.** Nubank, Inter, Mercado Pago e PicPay excluem boleto nos próprios regulamentos (F, conferido em 16/10). O iFood nem tem "conta a pagar": o carrinho é o pagamento.
2. **Ninguém mostra "o que você deixou de ganhar".** O mais perto é "quanto você vai economizar" ao antecipar parcelas, no PicPay e no Nubank (F).
3. **O ganho mora longe do pagamento.** O cashback fica em outro saldo, outro extrato ou outra moeda (Meli Dólar, Caixinha, Central de Cashback, três extratos no Inter). Nenhum junta, numa tela só, o que a pessoa pagou, como pagou e o que ganhou (I).
4. **As reclamações se concentram onde a condição que anula o ganho fica só no regulamento:** pontos não creditados no Inter, desconto não aplicado no Mercado Pago, cashback negado no Shopping do Nubank (O).
5. **O consolidado é mostrar o custo total antes de confirmar** e separar "agendado" de "pago" (F).

## 2. Escopo e premissas

- Entram jornada e tela, regras de cashback e saldo, e reclamações e riscos.
- Ficam de fora lei, integração técnica e números de mercado. Onde uma diferença vem de regra do Banco Central ou do sistema de boletos, isso aparece em uma linha.
- Fontes públicas, sem login. Nenhuma tela foi vista diretamente; a jornada vem de central de ajuda, regulamentos e relatos.

## 3. Por que esses players

| Player | Por quê |
|---|---|
| iFood | Referência do Sergio de pagamento simples; tem clube de assinatura (Clube iFood) |
| Nubank | Referência do Sergio; paga boletos com saldo ou cartão; tem planos com cashback (Ultravioleta, Nubank+) |
| Inter | Referência do Sergio; paga contas e tem pontos (Loop) e cashback (Shopping) |
| Mercado Pago | Referência do Sergio; paga contas de serviço e tem assinatura com cashback (Meli+) |
| PicPay | Acrescentado: paga contas de vários serviços (TIM, Claro, CEMIG) com saldo, cartão e cashback |

## 4. Matriz comparativa

| Critério | iFood | Nubank | Inter | Mercado Pago | PicPay | Maturidade |
|---|---|---|---|---|---|---|
| 1. Como a cobrança aparece | Não há cobrança: o carrinho é o pagamento [IF8] F | Código, busca de boletos no CPF, Pix copia e cola [NU1][NU4] F | Leitor, código, Radar de Boletos, débito automático [IN1][IN3] F | Código, "Boletos em seu nome", lembrete 1 dia antes [MP1][MP2] F | Busca no CPF, contas de parceiras, PDF ou imagem; várias de uma vez [PP1][PP5] F | Lista de contas do CPF: consolidado |
| 2. O que mostra antes de pagar | Resumo, cupom com "ver regras" [IF5][IF6] F | Beneficiário, valor, vencimento; no crédito, juros, IOF, parcelas e total [NU1][NU3] F | Dados do boleto; no crédito, parcelas e IOF [IN1][IN2] F | Dados, desconto do emissor, taxa de cada meio [MP4][MP5] F | Total com a taxa num demonstrativo [PP2][PP3] F | Custo total antes de confirmar: consolidado |
| 3. Formas e combinação | Saldo só com Pix ou benefício; dois meios em teste [IF1] F [IF9] O | Saldo ou cartão; combinar no mesmo boleto NV [NU2] F | Saldo ou crédito até 4x; combinar NV [IN2] F | Saldo grátis, crédito com taxa; completa com cartão quando o saldo não cobre [MP5] F [MP16] O | Saldo + cartão combinados, taxa só na parte do cartão [PP2][PP4] F | Saldo + cartão: emergente |
| 4. Cashback na conta paga | Não se aplica | Não: boleto e Pix excluídos [NU5][NU6] F | Não: boletos não pontuam [IN5][IN9] F | Não: boletos e tributos excluídos [MP13] F | Não: boleto não gera cashback do cartão [PP10] F | Sem cashback em conta: consolidado |
| 5. Benefício de plano na hora de pagar | Cupom do Clube entra sozinho, o de maior valor [IF6][IF7] F | Exclusões só no contrato; aviso na tela NV [NU5] F | Pontos por nível; na tela NV [IN6] F | Percentual e quanto falta para o teto, só na tela da assinatura [MP15] F | Por nível; na tela NV [PP10][PP12] F | Aplicação automática: emergente |
| 6. Confirmação e comprovante | Push de preparo; comprovante de pagamento NV [IF8] F | Comprovante na hora; separado do de agendamento [NU3][NU11] F | No extrato, por transação [IN3] F | Em "Últimas atividades", compartilhável [MP7] F | No assistente e no extrato, com autenticação e taxa [PP3][PP5] F | Agendado × pago: consolidado |
| 7. Histórico de pago, como e ganho | Clube mostra "Economia total" [IF7] F | Contas pagas e em aberto; ganho na mesma linha NV [NU4] F | Três extratos separados [IN3][IN8] F [IN14] O | Ganho em Meli Dólar, na seção Cripto [MP13] F | Extrato de 18 meses; Central de Cashback de 12 meses com link para a compra [PP9][PP17] F | Tela única: não visto |
| 8. "Deixou de ganhar" | Não; só o ganho realizado (I) | Não; "desconto ao antecipar" [NU14] F | Não; perda não avisada (I) [IN15] | Não; motivo só depois, no chat [MP16] O | Não; "quanto vai economizar" ao antecipar [PP14] F | Não visto |
| 9. Erro e estorno | Diz para onde e quando volta, por meio; saldo como opção mais rápida [IF2][IF3] F | Cashback estornado junto; se resgatado, sai dos meses seguintes [NU5] F | Estorno na moeda do ganho; cancelamento anula cashback [IN10] F | Cashback estornado do Meli Dólar ou da fatura [MP14] F | Saldo volta na hora, cartão na fatura; sai só o cashback afetado [PP9][PP13] F | Estorno simétrico: consolidado |
| 10. Reclamações que se repetem | NV (bloqueio); política de cancelamento sob apuração do Procon-SC [IF17] | Boleto pago e não compensado; cashback do Shopping negado [NU15] O | Cashback que não caiu; pontos não creditados; agendamento não efetivado [IN15] O | Desconto não aplicado; cashback de parceiro na taxa base; débito automático falho [MP17]–[MP20] O | Por tema NV; liderou o ranking de reclamações do BC no 4º tri/2025 [PP18] F | — |

## 5. Jornada passo a passo

**Nubank (boleto):** Pagar > Pagar boletos, ou busca no CPF → confere beneficiário, valor e vencimento, com juros se vencido → escolhe saldo ou cartão (no cartão, 1 a 12x com juros, IOF e total) → senha → comprovante na hora, ou comprovante de agendamento [NU1]–[NU3][NU11]. Ponto provável de abandono: o custo do crédito na simulação (I).

**PicPay (conta de luz ou telefone):** área de pagamentos lista os boletos do CPF e as contas de parceiras → escolhe uma ou várias → "Pagar ou Agendar" → escolhe saldo, cartão ou os dois, com o total e a taxa à vista → "Pagar" → comprovante no assistente; baixa em até 1 dia útil (boleto) ou 3 (convênio) [PP1]–[PP6].

**Mercado Pago (conta de serviço):** Pagamentos > Novo pagamento, ou "Próximos vencimentos" → confere, com o desconto do emissor no valor → escolhe o meio, vendo a taxa de cada um → agora ou agendado → confirma → comprovante; a empresa reconhece em até 3 dias úteis [MP1]–[MP8].

**Inter (boleto):** Pagamentos > leitor ou código, ou Radar de Boletos → confere → saldo ou crédito até 4x → agora ou agendado (no crédito, só agora) → comprovante no extrato [IN1]–[IN3].

**iFood (pedido):** sacola → pagamento, com cupom do Clube já aplicado e saldo ligado ou desligado → no Pix, código com tempo para pagar → a loja confirma → push de preparo; reembolso acompanhado na ajuda [IF1]–[IF8][IF10].

## 6. Regras de saldo e cashback

| Regra | iFood | Nubank | Inter | Mercado Pago | PicPay |
|---|---|---|---|---|---|
| Quanto | Sem programa próprio verificado; moedas por missão (H) [IF14] | Ultravioleta 1,25%; Nubank+ 0,5% [NU5][NU6] F | Pontos por nível (1 a cada R$ 10 até 1 a cada R$ 2); Shopping varia [IN6] F | Só para assinante Meli+ com o cartão Mercado Pago. No Mercado Livre, até 3% (0,5% com parcelas extras), até R$ 5 por compra e R$ 15 por mês; fora dele, 0,5%, até R$ 100 por mês [MP13] F | Cartão de 0,5% a 1,3% por nível [PP10] F |
| Quando cai | — | "Instantaneamente" no Ultravioleta; Shopping em até 90 dias [NU7][NU8] F | Pontos em até 3 dias úteis; Shopping de 1 a 120 dias, com divergência entre fontes [IN8][IN11] F | Em até 24 h úteis, em Meli Dólar [MP13] F | Até 5 dias úteis após pagar a fatura [PP10] F |
| Validade | Saldo do iFood Card 90 dias; moedas 21 dias (H) [IF13][IF14] | Não expira, com o cartão ativo [NU5][NU7] F | Pontos 6 meses, renovados a cada acúmulo [IN8] F | Expiração não achada (I) [MP14] | Dois regimes: não expira, ou 7 dias para o cashback que cai como saldo [PP9][PP11] F |
| Onde se usa | Só em pedidos novos; não vai para o banco [IF3] F | Vira saldo, abate fatura ou vai para a Caixinha [NU5] F | Fatura, conta, Shopping (até 75% da compra) [IN7] F | Paga total ou parte de compras [MP14] F | O que cai como saldo paga contas [PP11] F |
| Condição que anula | Saldo pode bloquear cupom (relato antigo) [IF15] | Boleto, Pix, seguro, recarga, assinatura [NU5] F | Pagar com pontos anula o cashback; pontos exigem fatura integral e débito automático [IN8][IN10] F | Boletos, tributos, Pix com cartão [MP13] F | Boleto, juros e tarifas [PP10] F |
| Estorno | Saldo, Pix e benefício no mesmo dia; crédito em até duas faturas [IF2] F | Estorna junto [NU5] F | Na moeda do ganho [IN10] F | Sai do Meli Dólar ou da fatura [MP14] F | Sai só o afetado, com rendimento [PP9] F |

Regra externa, não escolha dos apps: compensação de boleto, horário de corte e devolução do Pix seguem o sistema de pagamentos [NU1][IN3][PP6][MP12].

## 7. Porém e riscos

- **Condição escondida vira reclamação:** pontos perdidos por débito automático ou pagamento antecipado no Inter; desconto não aplicado por meio combinado no Mercado Pago; cashback negado no Shopping do Nubank [IN15][MP16][NU15] O.
- **Ganho pendente sem prazo visível:** de 30 a 120 dias no Inter, sem estado na tela, alimenta "cashback que não caiu" [IN11][IN15] (I).
- **"Paguei" contra "compensou":** boleto pago e não compensado é tema recorrente no Nubank [NU15] O. Agendamento sem saldo não efetiva no Inter [IN1][IN15].
- **Juros que anulam o cashback** em parcelamento, num relato de 2020 no PicPay [PP16] O.
- **Taxa para pagar conta com cartão:** Mercado Pago e PicPay cobram taxa no crédito, e o percentual oficial do PicPay só aparece no app [MP5][PP3] F.

## 8. Síntese

- **Convergências:** custo total antes de confirmar; "agendado" separado de "pago"; estorno que leva o cashback junto; nenhuma conta paga gera cashback.
- **Divergências:** combinar saldo com cartão (PicPay e Mercado Pago sim; iFood limitado; Nubank e Inter não verificado); onde o ganho fica (saldo, outra moeda, outro extrato); validade (de 7 dias a "não expira").
- **Lacunas do mercado:** "o que cada forma de pagamento rende" antes de confirmar; um histórico único de pago, como e ganho; "o que deixou de ganhar".
- **Anti-padrões:** condição que anula o ganho só no regulamento; ganho guardado em moeda ou seção difícil de achar (Meli Dólar na seção Cripto); motivo da perda só no chat, depois.

## 9. CSD

**Certezas**
- Sabemos que Nubank, Inter, Mercado Pago e PicPay não dão cashback por boleto ou conta paga. Fonte: [NU5][IN9][MP13][PP10], conferidas em 16/10.
- Sabemos que os apps mostram o custo total, com taxas e parcelas, antes de confirmar. Fonte: [NU3][MP5][PP2].
- Sabemos que comprovante de agendamento e de pagamento são separados no Nubank e no PicPay. Fonte: [NU11][PP5].
- Sabemos que o estorno leva o cashback junto em todos os que têm cashback. Fonte: [NU5][IN10][MP14][PP9].

**Suposições**
- Acreditamos que mostrar, antes de confirmar, o que cada forma de pagamento rende reduzirá reclamação de benefício perdido. Porque as reclamações dos três apps se concentram onde a condição fica só no regulamento. Validamos com teste de usabilidade com cerca de 5 pessoas e com o volume de contatos sobre cashback. **P1.**
- Acreditamos que um comprovante único, com valor, forma de pagamento e benefício, atende ao objetivo de "ver o que pagou, como pagou e o que ganhou". Porque nenhum dos cinco junta isso numa tela (I). Validamos no mesmo teste. **P1.**
- Acreditamos que dar cashback na conta da própria iGreen pode diferenciar, porque ninguém dá cashback em conta paga. Mas na iGreen o cashback sai da margem do próprio produto. Validamos com o financeiro antes de qualquer tela. **P0 para decidir, não para desenhar.**

**Dúvidas**
- Quem paga o cashback e qual a validade dele? → Produto e financeiro.
- Dá para pagar o seguro dentro do app, sem sair para a BBone e a Cielo? → Time de Seguros, com a BBone (vem do blueprint).
- A iGreen vai cobrar taxa para pagar com cartão? → Financeiro.
- A carteira com saldo precisa de autorização do Banco Central? → Jurídico (ficou fora deste benchmark e segue em aberto desde o blueprint).

## 10. Oportunidades priorizadas

| Prioridade | Oportunidade | Impacto | Esforço | Confiança | Base |
|---|---|---|---|---|---|
| P0 | Definir as regras de cashback e carteira antes de desenhar | Bloqueia o fluxo | Médio (decisão de negócio) | Alta que é preciso; a regra não se sabe | Blueprint; [MP13][NU5] |
| P1 | Mostrar, antes de confirmar, o que cada forma de pagamento rende e custa | Alto | Médio | Média (I a partir das reclamações) | [IN15][MP16][NU15] |
| P1 | Comprovante único com valor, forma de pagamento e benefício, e estado agendado, pago ou compensado | Alto | Médio | Média | [NU11][PP5][PP9] |
| P1 | Uma lista única de contas a pagar de todos os produtos, com vencimento e lembrete | Alto | Médio | Média | [PP1][PP5][MP2] |
| P2 | Combinar saldo com cartão, com o custo só na parte do cartão | Médio | Alto | Média | [PP2][PP4][MP16] |
| P2 | Benefício do Club aplicado sozinho, com a economia acumulada | Médio | Baixo | Média | [IF6][IF7] |
| P2 | No estorno, dizer para onde e quando o dinheiro volta, por forma de pagamento | Médio | Baixo | Alta | [IF2][IF3] |
| P3 | Ganho pendente com estado e data máxima | Baixo a médio | Baixo | Média | [IN11][IN15] |

## 11. Recomendação para a iGreen

- **Adotar (consolidado):** custo total antes de confirmar; comprovantes separados para agendado e pago; estorno que diz para onde e quando volta, levando o cashback junto; lista de contas a pagar com vencimento.
- **Considerar (emergente, com risco):** combinar saldo com cartão, que depende de a carteira existir; benefício do Club aplicado sozinho, com a economia acumulada.
- **Considerar com teste antes (ninguém faz):** "o que cada forma rende", lado a lado, antes de confirmar. Para o "deixou de ganhar", minha leitura é mostrar a diferença **antes** da escolha, como informação. Depois do pagamento, em tom de culpa ou urgência, vira pressão e pode cair em padrão enganoso (I).
- **Evitar:** condição que anula o ganho escondida no regulamento; benefício guardado em seção difícil de achar; motivo da perda só no atendimento.

Minha escolha para começar: a lista única de contas a pagar, mais a tela de confirmação com custo total e "o que essa forma rende", mais o comprovante único. Isso cobre o objetivo do Sergio sem depender da carteira. A carteira e o cashback entram quando as regras existirem.

## 12. Limitações

- Nenhuma tela foi vista diretamente. Galerias de telas e vídeos não estavam acessíveis, e Reclame Aqui, Tecnoblog e parte dos sites bloquearam a leitura. Das reclamações, foram lidos títulos e trechos indexados.
- Por isso, acessibilidade aparente e microcopy não foram avaliados.
- Percentuais e prazos de cashback mudam com frequência. Valem para outubro de 2026.
- O Inter tem divergência entre fontes no prazo do cashback do Shopping.
- Lei ficou fora por escolha do Sergio. A pergunta sobre a carteira e o Banco Central continua aberta.

## 13. Próximos passos

1. Levar às áreas as perguntas do blueprint e a decisão P0: regras de cashback e carteira.
2. Depois das regras, desenhar com o `personal-design`, usando o blueprint e este documento como insumo. O protótipo deve começar pela lista de contas, pela confirmação e pelo comprovante.
3. Testar o protótipo com cerca de 5 clientes, no celular deles, olhando se entendem o que pagam, como pagam e o que ganham.

## 14. Fontes (todas acessadas em 16/10/2026)

**iFood**
- [IF1] meios, carteira, combinação — F — https://institucional.ifood.com.br/ajuda/pagamentos-e-carteira-ifood/ (01/04/2026)
- [IF2] prazos de estorno, Reembolso em Saldo — F — https://institucional.ifood.com.br/ajuda/reembolsos-e-estornos/ (05/08/2026)
- [IF3] prazos, saldo não sacável — F — https://institucional.ifood.com.br/clientes/prazos-e-regras-para-reembolso-ifood-ao-cliente/ (01/04/2026)
- [IF4] cancelamento — F — https://institucional.ifood.com.br/ajuda/como-cancelar-o-pedido-no-ifood/ (01/07/2026)
- [IF5] regras do cupom — F — https://institucional.ifood.com.br/ajuda/cupons-e-descontos-do-ifood/ (01/04/2026)
- [IF6] um cupom por pedido, vale o maior — F — https://institucional.ifood.com.br/clientes/passo-a-passo-como-usar-o-cupom-do-ifood/ (16/06/2026)
- [IF7] Clube: aplicação automática, economia — F — https://institucional.ifood.com.br/clientes/beneficios-do-clube-ifood/ (26/08/2026)
- [IF8] sacola como checkout — F — https://institucional.ifood.com.br/inovacao/como-funciona-um-pedido-do-ifood/ (11/07/2025)
- [IF9] teste de combinar pagamentos — O — https://canaltech.com.br/apps/ifood-permite-dividir-o-pagamento-de-pedidos-com-outra-pessoa/ (03/06/2026)
- [IF10] Pix com tempo — secundária — https://www.oficinadanet.com.br/tecnologia/36691-ifood-agora-permite-para-todos-pedidos-via-pix-em-seu-aplicativo (18/05/2021)
- [IF13] iFood Card, 90 dias — F — https://institucional.ifood.com.br/noticias/metodos-de-pagamento/ (16/11/2023)
- [IF14] Moedas iFood — secundária — https://www.melhorescartoes.com.br/moedas-ifood.html (29/09/2024)
- [IF15] saldo bloqueia cupom — relato — https://www.cartoesdecredito.me/geral/ifood-muda-as-regras-e-nao-permite-uso-de-cupons-usando-saldo (07/07/2023)
- [IF17] Procon-SC — secundária — https://www.correio24horas.com.br/brasil/ifood-e-autuado-apos-cliente-fazer-compra-de-r-560-nao-receber-pedido-e-ter-reembolso-negado-1026 (14/10/2026)

**Nubank**
- [NU1] pagar boleto, prazos, QR Pix — F — https://blog.nubank.com.br/como-pagar-boleto/ (atual. 06/10/2026)
- [NU2] boleto no crédito, converter limite — F — https://nubank.com.br/nu/cartao/passa-tudo-no-credito
- [NU3] revisão, comprovante, falha por e-mail — F — https://comunidade.nubank.com.br/novidades/post/pague-seus-boletos-no-cartao-de-credito-oAQ47qGkAxx4a03
- [NU4] assistente de pagamentos — F — https://nubank.com.br/nu/conta/assistente-de-pagamentos
- [NU5] regulamento Ultravioleta: exclusões, estorno — F, reconferido — https://nubank.com.br/contratos/contrato-e-regulamento-nubank-ultravioleta (vigência 26/12/2025)
- [NU6] Nubank+ — F — https://nubank.com.br/contratos/termos-e-condicoes-nubankmais (vigência 26/12/2025)
- [NU7] "instantaneamente", "não expira" — F — https://nubank.com.br/ultravioleta
- [NU8] Shopee: 72 h, 90 dias — F — https://comunidade.nubank.com.br/novidades/post/shopee-nu-cashback-3-0QweirhGjZLtsfg
- [NU11] pagamento × agendamento — F — https://blog.nubank.com.br/pagamento-e-agendamento-qual-a-diferenca/ (atual. 22/09/2026)
- [NU14] desconto ao antecipar — F — https://blog.nubank.com.br/antecipar-compras-parceladas-no-cartao-nubank/ (atual. 21/07/2026)
- [NU15] reclamações recorrentes — O — https://www.reclameaqui.com.br/nubank/boleto-nao-compensa_U7x21EWu7-P4DfwF/ ; https://www.reclameaqui.com.br/nubank/nao-recebi-o-cashback-da-compra-realizada-pelo-shopping-nu_uG57--NPE2cVBFOM/

**Inter**
- [IN1] guia de pagamento de contas — F — https://blog.inter.co/guia-pagamento-de-contas/ (08/09/2022)
- [IN2] boleto no crédito — F — https://blog.inter.co/como-pagar-boleto-com-cartao-de-credito (28/01/2025)
- [IN3] Radar de Boletos, horários, comprovante — F — https://ajuda.inter.co/conta-digital-pessoa-fisica-e-mei/o-que-e-o-radar-de-boletos-dda-na-conta-pf
- [IN5] Intercard e Pix Crédito não pontuam — F — https://ajuda.inter.co/cartao/o-que-e-o-intercard
- [IN6] pontos por nível — F — https://inter.co/pra-voce/cartoes/programa-de-pontos/
- [IN7] resgates, limite de 75% — F — https://blog.inter.co/inter-loop-programa-de-pontos/ (atual. 22/05/2025)
- [IN8] condições e validade dos pontos — F — https://ajuda.inter.co/inter-loop/como-evitar-que-meus-pontos-do-loop-expirem
- [IN9] o que não pontua — F — https://blog.inter.co/cartao-pontos-em-dobro-inter-multiplique-suas-recompensas/ (24/04/2026)
- [IN10] termos do Shopping (cashback, estorno, pontos) — F — https://marketplace.bancointer.com.br/termos/INTERSHOP!WEB!TERMOS-DE-USO!pt-BR!2025-05-21T16-36-25-03-00.pdf (16/05/2025)
- [IN11] prazos do cashback — F — https://ajuda.inter.co/cashback/o-que-preciso-fazer-para-receber-cashback-de-compras-feitas-no-shopping-do-inter
- [IN14] telas do cashback por terceiros — O — https://olhardigital.com.br/2023/08/06/dicas-e-tutoriais/cashback-do-banco-inter-como-funciona-e-como-resgatar-dinheiro-de-volta/
- [IN15] reclamações recorrentes — O — https://www.reclameaqui.com.br/inter/cashback-do-intershop-nao-caiu_wH5_3shxa1owRIre/ ; https://www.reclameaqui.com.br/inter/pontos-loop-nao-creditados-por-pagamento-antecipado_ksu32PWlyFq7OAm4/ ; https://www.reclameaqui.com.br/inter/pagamento-de-boleto-agendado-nao-efetuado_OezwR5rtoVdEOinO/

**Mercado Pago**
- [MP1] pagar pelo app — F — https://www.mercadopago.com.br/ajuda/4877
- [MP2] boletos em seu nome — F — https://www.mercadopago.com.br/ajuda/18232
- [MP4] desconto na confirmação — F — https://www.mercadopago.com.br/ajuda/18237
- [MP5] taxas por meio — F — https://www.mercadopago.com.br/ajuda/30255
- [MP6] agendamento — F — https://www.mercadopago.com.br/ajuda/18669
- [MP7] comprovante — F — https://www.mercadopago.com.br/ajuda/4878
- [MP8] prazo de reconhecimento — F — https://www.mercadopago.com.br/ajuda/16845
- [MP12] correspondente Itaú — F — https://www.mercadopago.com.br/ajuda/4875
- [MP13] termos Meli+: percentuais, teto de R$ 100, exclusão de boletos e tributos, 24 h úteis — F, exclusões, teto de R$ 100 e prazo reconferidos no navegador; tetos do Mercado Livre lidos pelo agente — https://www.mercadolivre.com.br/ajuda/Termos-e-condicoes-do-Meli-mais_30487 (cláusula de cashback vigente desde 21/08/2026; termos alterados em 30/09/2026)
- [MP14] termos Meli Dólar — F — https://www.mercadolivre.com.br/ajuda/34874
- [MP15] tela de benefícios e teto — F — https://www.mercadopago.com.br/blog/cashback-grandes-marcas-meli-mais (28/09/2026)
- [MP16] saldo + cartão, auditoria, estorno — O — https://www.reclameaqui.com.br/mercado-pago/propaganda-enganosa-desconto-de-30-em-contas-nao-aplicado-no-mercado-pago-durante-promocao-do-bbb_AS4z7zd6xYKB80PD/ (30/01/2026)
- [MP17] desconto aplicado e pagamento recusado — O — https://www.reclameaqui.com.br/mercado-pago/titulo-mercado-pago-recusou-pagamento-mesmo-com-desconto-de-r-40-aplicado-e-impediu-utilizacao-da-promocao_L2P1mG8BPJlTOlZ5/ (14/08/2026)
- [MP18] cashback de parceiro na taxa base — O — https://www.reclameaqui.com.br/mercado-pago/nao-recebi-o-cashback-total-da-minha-compra-no-madero_skE9CzqNYj5-kogy/
- [MP19] desconto em conta não aplicado — O — https://www.reclameaqui.com.br/empresa/mercado-pago/lista-reclamacoes/?busca=desconto%20conta%20de%20luz
- [MP20] débito automático — O — https://www.reclameaqui.com.br/empresa/mercado-pago/lista-reclamacoes/?busca=d%C3%A9bito%20autom%C3%A1tico%20conta

**PicPay**
- [PP1] entrada, formas, sem cancelamento — F — https://meajuda.picpay.com/hc/pt-br/articles/360044239432 (atual. 04/09/2026)
- [PP2] saldo grátis, taxa parcial — F — https://meajuda.picpay.com/hc/pt-br/articles/360044240072 (30/09/2026)
- [PP3] taxa de aporte — F — https://meajuda.picpay.com/hc/pt-br/articles/48855576337939 (26/08/2026)
- [PP4] pagamento combinado — F, reconferido — https://meajuda.picpay.com/hc/pt-br/articles/38437875966099
- [PP5] assistente, busca de boletos, comprovante — F — https://meajuda.picpay.com/hc/pt-br/sections/6535395107603
- [PP6] horários e prazos — F — https://meajuda.picpay.com/hc/pt-br/articles/360044239712 (17/09/2026)
- [PP9] Central de Cashback — F — https://meajuda.picpay.com/hc/pt-br/sections/55407337910035 (24/09/2026)
- [PP10] boleto sem cashback do cartão — F, reconferido — https://meajuda.picpay.com/hc/pt-br/articles/43838801209619 (31/07/2026)
- [PP11] cashback de 7 dias — F — https://meajuda.picpay.com/hc/pt-br/articles/49553493887379 (31/07/2026)
- [PP12] PicPay Mais — F — https://meajuda.picpay.com/hc/pt-br/articles/19075356566163 (06/10/2026)
- [PP13] estorno — F — https://meajuda.picpay.com/hc/pt-br/articles/360049437512 (31/07/2026)
- [PP14] "quanto vai economizar" — F — https://meajuda.picpay.com/hc/pt-br/articles/11101442557075 (31/07/2026)
- [PP16] juros contra cashback — O — https://tecnoblog.net/comunidade/t/info-boleto-picpay-com-desconto-uma-cilada/23461 (01/12/2020)
- [PP17] extrato — F — https://meajuda.picpay.com/hc/pt-br/articles/360055117852 (10/08/2026)
- [PP18] ranking do BC — F via imprensa — https://timesbrasil.com.br/brasil/economia-brasileira/picpay-e-c6-lideram-ranking-de-reclamacoes-do-banco-central/ (22/01/2026)
