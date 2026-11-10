---
type: doc
title: "Benchmark v2 — como os apps mostram o valor que devolvem ao cliente"
created: 2026-10-16
updated: 2026-10-16
status: active
source: workspace
tags: [growth, investigacao, beneficios, cashback, clube, benchmark]
---

# Benchmark v2 — como os apps mostram o valor que devolvem ao cliente

- **Data:** 16/10/2026 · **Modo:** rápido, nada gravado no workspace
- **Complementa** o `2026-10-16-benchmark-pagamento-universal.md` (rodada 1, só cashback), que ganhou um bloco de correção no topo.
- **Apps:** Clube iFood, Clube 99, Meli+, Uber One, Vivo Valoriza, Livelo, Méliuz e, como adjacente, um app de negociação de contas (o do print 1, não identificado; Rocket Money como referência de função). Maya em uma linha.
- **Legenda:** **F** fonte oficial · **F\*** imprensa ou blog · **O** tela, print ou relato · **I** interpretação · **H** hipótese · **NV** não verificado
- **Referências:** prefixos IF (iFood), 99, ML (Meli+), UB (Uber One), VV (Vivo), LV (Livelo), MZ (Méliuz), RM (Rocket Money), MY (Maya), PR (prints do Sergio). Lista no fim.

## 1. A pergunta do Sergio: clube, cupom, ponto e cashback são a mesma coisa?

**São da mesma família, mas não são a mesma coisa.** Para quem usa, todos dizem "o app me devolve valor por eu estar aqui", e as telas que funcionam são parecidas. A diferença está em **quando** o valor chega, **em que unidade** e **quanto custa** para a pessoa, e é aí que nascem as reclamações.

| Mecanismo | Exemplo | Quando vira valor | Unidade | Custo para a pessoa | O que a tela precisa dizer |
|---|---|---|---|---|---|
| Desconto ou cupom aplicado | Cupom do Clube iFood no total [IF11]; cupom do Meli+ já aplicado [PR3] | Na hora, certo | R$ | Nenhum, se não depende de assinatura | Quanto baixou, nesta compra |
| Crédito ou saldo | Créditos Uber One, vencem em 60 dias [UB9]; saldo do iFood, só em pedidos novos [IF12] | Depois, com validade e uso restrito | R$, mas só vale dentro do app | Nenhum direto | Onde e até quando vale |
| Cashback | Meli Dólar, em até 24 h úteis [ML4]; Méliuz, pendente e depois confirmado [MZ3] | Depois e com condição | %, convertido em R$ ou em moeda própria | Nenhum direto, mas pode exigir cartão próprio | Quanto, quando cai e o que anula |
| Moeda ou ponto | Moedas iFood, sem valor em R$ [PR7]; Livelo, de R$ 18 a R$ 70 por 1.000 pontos, conforme a troca [LV15][LV17] | Depois, e o valor muda conforme a troca | Contagem | Nenhum direto, mas vence | Quanto vale em reais, e até quando |
| Clube ou assinatura | Clube iFood, Meli+, Uber One, Clube 99 | Recorrente, com mensalidade | R$ por mês | **Tem custo** | Economia já descontada a mensalidade |
| Benefício por hábito | +3 GB por débito automático no Vivo Controle (F, não reconferido) [VV6]; pontos por fatura paga no Claro clube [VV19] | Enquanto o hábito durar | GB, pontos | Manter o meio de pagamento | O que a pessoa ganha ao ativar e o que perde ao desligar |

**Para a iGreen, a diferença muda a regra, não só a tela:**
- Desconto e cupom baixam o preço na hora e **não guardam dinheiro do cliente**.
- Cashback em carteira e crédito guardam, e é aí que entra a pergunta sobre o Banco Central, ainda em aberto (H, a confirmar com o jurídico).
- Um clube de descontos pode entregar o "ganho visível" sem a carteira (H).

## 2. Matriz comparativa

| Critério | Clube iFood | Clube 99 | Meli+ | Uber One | Vivo Valoriza | Livelo | Méliuz | Negociação de contas |
|---|---|---|---|---|---|---|---|---|
| 1. Onde aparece | Oferta, pagamento, pedido, painel do Clube [IF9][IF10][PR11] O | Opção de preço "+Clube99" na corrida e no recibo [99-21][99-24] | Página do produto, revisão antes de pagar, home [PR3][PR5][PR4] O | Seção Uber One e créditos [UB9] F; checkout na França [UB13] | Aba Benefícios, separada da fatura [VV5] F | Saldo no topo; R$ junto da ação de pagar [LV11] | Card da loja, extensão, extrato [MZ5][MZ6][MZ3] | Painel "Ways to Save" [RM15]; card de oferta [PR1] O |
| 2. Unidade | R$ e % com teto; moedas sem R$ [IF9][PR7] | R$ em verde [PR8] O | R$, mas é Meli Dólar, atrelado ao dólar [ML4][ML7] | % em crédito [UB9] | %, cota, sem R$ [VV1][VV2] | Pontos em R$ "válido para agora" [LV11] O | % e R$ [MZ5] | US$ [PR1] |
| 3. Certo × condicional | Cupom na hora; missão em até 48 h [IF11][IF18] | Pacote cobrado na mesma corrida [99-24] O | Cupom certo; cashback com teto e condições [ML4] | Crédito depois, vence em 60 dias [UB9] | Automático pela categoria [VV2] | Crédito de 5 a 60 dias; vence em 24 meses [LV10] | Pendente e depois confirmado; resgate a partir de R$ 20 [MZ3][MZ4] | Desconto em 1 a 2 faturas [RM16] |
| 4. Acumulado | "Economia total" por mês, aparentemente bruta [PR11][IF15] F\* | Só o total da empresa [99-27] | "Rendeu R$ X no último ano" [PR4]; total de cashback NV | "Média de R$ 40 por mês", sem dizer se desconta a mensalidade [UB10] | Não existe saldo [VV3] | Saldo e saldo a expirar [LV10] | Pendente e confirmado [MZ3] | Total e mês; se desconta a taxa, NV [PR1] |
| 5. Oferta na hora, com valor | No checkout; relato de assinatura feita sem querer [IF17] O | "Economize R$ 2,85" [PR8] O; ganho real de R$ 0,41 num recibo [99-24] | Banner sem valor [PR3] | NV no Brasil | GB por débito automático [VV6] | Pix com pontos para contas de luz e telefone [LV12] F | Extensão no site da loja [MZ6] | "Reduzimos sua conta em $45" [PR1] |
| 6. "Poderia ganhar" | Cupons usados e sequência de check-in, em urgência suave [PR9][PR7] | Oferta, sem culpa [PR8] | Convites [PR3][PR4] | Perda dos créditos na tela de cancelamento (relato) [UB16] | Escada de categorias, aspiracional [VV1] | "Seus pontos vão expirar", urgência [LV13] | "Era 3%"; Prime em dobro [MZ5][MZ7] | O card inteiro é o "poderia ganhar" [PR1] |
| 7. Jogos e parceiros | Check-in, missões, Uber, Decolar [PR7][IF9] | Cupons do 99Food [PR8] | Planos e parceiros (McDonald's, Google Play) [ML4] | Combo com o Clube iFood; pontos Livelo [UB15][UB9] | 300 a 400 parceiros; sorteios [VV1][VV3] | Clube Livelo em 3 níveis [LV14] | Prime, cartão, nota fiscal [MZ7][MZ8] | Premium+ a partir de 02/11/2026 [RM17] |
| 8. Reclamações | Cobrança do Clube; moedas não creditadas [IF20] O | 48 de 105 por cobrança indevida [99-25] O | Cashback não recebido; "o app informava o contrário" [ML8] O | Cobrança após cancelar; FTC nos EUA [UB16][UB14] | Cupom não reconhecido no parceiro [VV9] O | 38% sobre pontos [LV18] O | 9.500 em 6 meses; cashback não rastreado [MZ10] O | Taxa sobre 12 meses para crédito de 1 [RM19] O |

## 3. Padrões que se repetem

| Padrão | Quem faz | Ajuda | Atrapalha | Maturidade |
|---|---|---|---|---|
| O benefício aparece junto do preço, antes do botão | Meli+ [PR5], Clube 99 [99-21], Clube iFood [IF10] | A pessoa vê antes de decidir | O frete "Grátis" não diz quanto custaria; o ganho da compra não é somado (I) | Consolidado |
| Painel de economia em R$, por mês | Clube iFood [PR11], negociação de contas [PR1] | É concreto e lembra por que vale | Quase nunca desconta a mensalidade ou a taxa [IF15][UB14] | Consolidado |
| Moeda própria mostrada em R$ | Meli Dólar [PR4], Créditos Uber One [UB9], Livelo [LV11] | Fica fácil de ler | Esconde câmbio, validade e uso restrito (I) | Emergente |
| Ganho em etapas (pendente, confirmado, disponível) | Méliuz [MZ3], Livelo [LV10], negociação [RM16] | É honesto sobre o tempo | Sem data por etapa, vira "o cashback não caiu" [MZ10] | Consolidado |
| Comprar o benefício dentro da compra | Clube 99 [99-24], Clube iFood [IF17] | Mostra o valor na hora | Mistura assinar com receber desconto; a origem das reclamações de cobrança | Emergente, arriscado |
| "Poderia ganhar" em tom de oferta | Clube 99 [PR8], Méliuz [MZ5], negociação [PR1] | Motiva sem culpa | — | Emergente |
| Perda como alavanca (vencimento, cancelamento, sequência) | Livelo [LV13], Uber One [UB16], Moedas iFood [IF16] | Retém | Pressiona; perto de padrão enganoso (I) | Evitar |
| Média de economia sem base declarada | iFood ("R$ 50" ou "R$ 70") [IF9][IF14], Uber One ("R$ 40") [UB10] | Chama atenção | Enfraquece a confiança. Nos EUA, a FTC processou a Uber por anunciar US$ 25 por mês sem descontar a mensalidade de US$ 9,99 [UB14b] | Evitar |

## 4. O que muda na recomendação para a iGreen

A rodada 1 recomendava a lista de contas, a confirmação com custo e ganho, e o comprovante único. A rodada 2 confirma e afina:

1. **Um único número líquido, em reais, nos três momentos.** Na decisão, "este pagamento rende R$ X". No comprovante, "você pagou R$ Y, com Pix, e ganhou R$ X". No painel, "economia em outubro: R$ Z, já descontado o plano". Se for bruto, a tela diz "bruto".
2. **Separar o certo do prometido.** Desconto aplicado é certo. Cashback e crédito vêm com "cai em [data]" e "vale até [data]", e com o que pode anulá-lo.
3. **Toda unidade convertida em reais.** Se houver ponto ou moeda, ao lado vai quanto vale. Se o valor muda conforme a troca, diga isso.
4. **Assinar um plano e usar um benefício são dois atos,** cada um com o seu sim. Não esconder a assinatura dentro de um pagamento.
5. **"Poderia ganhar" ancorado numa ação concreta e reversível.** Por exemplo: "Ative o débito automático e ganhe X", como o +3 GB da Vivo; ou "Com o plano Y, este pagamento renderia R$ X", como o Clube 99. Sempre em tom de oferta, antes da decisão, nunca como culpa depois.
6. **Média de economia, só com base declarada,** com o período e se desconta a mensalidade.
7. **Benefício por hábito combina com o produto da iGreen.** As contas da iGreen são recorrentes, e manter um meio de pagamento (débito automático, Pix Automático) é um bom gatilho de recompensa. Essa ideia vem da Vivo e da Claro (H, a validar com produto e financeiro).

**Minha escolha para o primeiro desenho:** o painel "o que você ganhou" com um número líquido, a confirmação com "este pagamento rende R$ X" e o comprovante único. Os planos de benefício entram depois, com a regra de dois atos separados.

## 5. CSD (atualização da rodada 1)

**Certezas novas**
- Sabemos que os clubes mostram a economia em R$ por mês, e que pelo menos um relato público indica que o Clube iFood mostra o valor bruto. Fonte: [PR11][IF15].
- Sabemos que a FTC processou a Uber, em abril de 2025, por anunciar economia sem descontar a mensalidade. Fonte: [UB14b], conferida.
- Sabemos que a Livelo permite pagar contas de luz e telefone com pontos via Pix. Fonte: [LV12], conferida.
- Sabemos que o Meli+ mostra o cashback na revisão antes de pagar, em R$, mesmo sendo creditado em Meli Dólar. Fonte: [PR5][ML4].

**Suposições**
- Acreditamos que mostrar a economia já descontada do plano aumenta a confiança e reduz o cancelamento por "não vale a pena". Porque as reclamações e a ação da FTC atacam exatamente o bruto. Validamos com um teste de usabilidade, comparando bruto com líquido. **P1.**
- Acreditamos que um benefício por hábito (débito automático ou Pix Automático) aumenta o pagamento em dia nas contas da iGreen. Porque Vivo e Claro usam esse gatilho. Validamos com um experimento, depois de ter a regra. **P2.**
- Acreditamos que um clube de descontos entrega o ganho visível sem a complexidade da carteira. Validamos com o jurídico e o financeiro. **P0 para decidir.**

**Dúvidas**
- O que a iGreen pode dar como benefício (desconto, crédito, cashback, kWh, GB) e quem paga? → Produto e financeiro.
- O iGreen Club já tem benefício de parceiro, como o Vivo Valoriza? → Produto. Nenhum Context descreve o iGreen Club por dentro.

## 6. Limites

- Nenhuma tela de app foi vista ao vivo, sem login. Os prints do Sergio são a principal evidência de tela. Três deles são mockups de divulgação, sem números reais, e o print 2 é da área de RH do iFood Benefícios, não do cliente.
- O app do print 1 não foi identificado.
- O bônus de 3 GB por débito automático da Vivo foi lido pelo agente e não apareceu na minha reconferência.
- Reclame Aqui com acesso parcial: títulos e trechos, e contagens por busca ampla.
- Percentuais, tetos e preços mudam com frequência. Valem para outubro de 2026.

## 7. Próximos passos

1. Levar às áreas a decisão P0 (que benefício a iGreen dá, quem paga, se precisa de carteira) junto com as perguntas do blueprint.
2. Com a regra, desenhar com o `personal-design` as três telas: confirmação, comprovante e painel.
3. Testar com cerca de 5 clientes, no celular deles, a economia bruta contra a líquida.

## 8. Fontes (todas acessadas em 16/10/2026)

**Prints do Sergio (O, sem data; nomes e fotos de pessoas omitidos)**
- [PR1] app de negociação de contas: "Total savings" e redução de conta de internet
- [PR3] Mercado Livre: banner do Meli+ e cupom já aplicado
- [PR4] Mercado Pago: home com Meli+, rendimento, Meli Dólar e lembrete de boleto
- [PR5] Mercado Livre: "Revise e confirme" com cashback antes do botão
- [PR6] Clube iFood: página de assinatura (mockup de divulgação)
- [PR7] Moedas iFood: check-in e missões
- [PR8] Clube 99 oferecido durante a corrida
- [PR9] iFood: ofertas com "% de volta" e "Você no Clube" (mockup, versão antiga)
- [PR10] Maya: poupança com "boost"
- [PR11] Clube iFood: "Economia total" por mês (mockup)
- [PR12] e [PR13] iFood: pedido com Clube e pontos de parceiro
- [PR2] iFood Benefícios, área de RH (não é do cliente)

**Clube iFood**
- [IF9] https://institucional.ifood.com.br/clientes/beneficios-do-clube-ifood/ (26/08/2026) — F
- [IF10] https://institucional.ifood.com.br/clientes/passo-a-passo-como-usar-o-cupom-do-ifood/ (16/06/2026) — F
- [IF11] https://institucional.ifood.com.br/ajuda/cupons-e-descontos-do-ifood/ (01/04/2026) — F
- [IF12] https://institucional.ifood.com.br/ajuda/pagamentos-e-carteira-ifood/ (01/04/2026) — F
- [IF14] https://centraldovarejo.com.br/?p=45998 — F\*
- [IF15] https://www.techtudo.com.br/noticias/2026/02/usei-o-clube-ifood-por-1-ano-e-te-digo-se-vale-a-pena-edapps.ghtml (26/02/2026) — F\*
- [IF16] https://www.melhorescartoes.com.br/moedas-ifood.html (29/09/2024) — F\*
- [IF17] https://www.reclameaqui.com.br/ifood/fui-cobrado-indevidamente-pelo-clube-ifood-e-nao-consigo-cancelar_NRvvJwt5Cn0I3-Tu/ — O
- [IF18] https://www.reclameaqui.com.br/ifood/minha-missao-de-cashback-no-app-do-ifood-nao-esta-sendo-contabilizada_DleDtY-Zl3hAVD4S/ — resposta da empresa
- [IF20] https://www.reclameaqui.com.br/empresa/ifood/lista-reclamacoes/?busca=moedas — O

**Clube 99**
- [99-21] https://99app.com/passageiro/clube-99/ — F
- [99-24] https://www.reclameaqui.com.br/99taxis/cobranca-indevida-e-propaganda-enganosa-com-adesao-automatica-ao-clube-99-disfarcada-de-cupom_HB2c8ywYCsbZj6yj/ (09/08/2026) — O, com resposta da empresa
- [99-25] https://www.reclameaqui.com.br/empresa/99taxis/lista-reclamacoes/?busca=clube99 — O
- [99-27] https://99app.com/99pay/ — F

**Meli+**
- [ML4] https://www.mercadolivre.com.br/ajuda/Termos-e-condicoes-do-Meli-mais_30487 (alterado em 30/09/2026) — F, reconferido no navegador
- [ML7] https://latamlist.com/mercado-pago-launches-a-stablecoin-with-ripio-in-brazil/ (28/08/2024) — F\*
- [ML8] https://www.reclameaqui.com.br/mercado-livre/nao-recebi-meli-dolar-e-fui-informado-que-o-parcelamento-impede-o-cashback_WuCtipa3THElwlZ9/ — O

**Uber One**
- [UB9] https://www.uber.com/br/pt-br/u/uber-one/ — F
- [UB10] https://www.uber.com/br/pt-br/uber-one/student/ — F
- [UB13] https://www.uber.com/fr/en/uber-one/ — F
- [UB14] https://fortune.com/2025/04/22/ftc-uber-one-deceptive-subscription-service-lawsuit (22/04/2025) — F\*
- [UB14b] https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-takes-action-against-uber-deceptive-billing-cancellation-practices (21/04/2025) — F, conferido
- [UB15] https://canaltech.com.br/apps/viagens-e-delivery-com-desconto-ifood-e-uber-liberam-combo-de-assinaturas/ (26/02/2026) — F\*
- [UB16] https://www.reclameaqui.com.br/uber/impossivel-cancelar-o-uber-one-e-continuam-cobrando-ja-e-o-segundo-mes_hypphT3z4-Oo_Smx/ — O

**Vivo Valoriza e Claro**
- [VV1] https://vivo.com.br/para-voce/por-que-vivo/vivo-valoriza — F
- [VV2] https://vivo.com.br/para-voce/por-que-vivo/beneficios/categorias-vivo — F
- [VV3] https://vivo.com.br/para-voce/por-que-vivo/vivo-valoriza/duvidas — F
- [VV5] https://vivo.com.br/para-voce/app-vivo — F
- [VV6] https://vivo.com.br/para-voce/produtos-e-servicos/para-o-celular/planos-controle/outros-planos — F, lido pelo agente; não achado na minha reconferência
- [VV9] https://www.reclameaqui.com.br/busca/?q=vivo%20valoriza — O
- [VV19] https://www.claro.com.br/claro-clube — F

**Livelo**
- [LV10] https://www.livelo.com.br/regulamentos/programa-pontos-livelo (desde 01/08/2018) — F
- [LV11] https://www.livelo.com.br/carteira/pontos-viram-dinheiro — O/F
- [LV12] https://www.livelo.com.br/carteira/pagar-com-pix — F, reconferido no navegador
- [LV13] https://www.livelo.com.br/use-seus-pontos-a-expirar — F
- [LV14] https://www.livelo.com.br/clube — F
- [LV15] https://passageirodeprimeira.com/como-usar-pontos-livelo-como-dinheiro (16/01/2025) — F\*
- [LV17] https://www.melhoresdestinos.com.br/milhas/valor-milheiro-livelo (11/07/2026) — F\*
- [LV18] https://www.reclameaqui.com.br/empresa/livelo/ — O

**Méliuz**
- [MZ3] https://www.meliuz.com.br/blog/prazos-do-meliuz/ (17/07/2024) — F
- [MZ4] https://www.meliuz.com.br/blog/resgate-cashback (14/02/2023) — F
- [MZ5] https://www.meliuz.com.br/ — O
- [MZ6] https://www.meliuz.com.br/extensao — F
- [MZ7] https://www.meliuz.com.br/prime — F
- [MZ8] https://www.meliuz.com.br/cartao — F
- [MZ10] https://www.reclameaqui.com.br/empresa/meliuz/ (dados de 01/04 a 30/09/2026) — O

**Negociação de contas (Rocket Money como referência) e Maya**
- [RM15] https://help.rocketmoney.com/en/articles/9744564-how-to-submit-a-bill-negotiation — F
- [RM16] https://help.rocketmoney.com/en/articles/9744544-when-will-the-negotiated-savings-take-effect — F
- [RM17] https://www.rocketmoney.com/terms (desde 02/10/2026) — F
- [RM19] https://www.trustpilot.com/review/rocketmoney.com (10 e 11/10/2026) — O
- [MY21] https://www.mayabank.ph/highinterestsavings/ — F

Observação de segurança: uma página pública do Méliuz trazia um texto escondido com instruções para leitores automáticos. O agente ignorou, e nada dela foi usado.
