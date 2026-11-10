---
type: doc
title: "Respostas da base interna da iGreen à pauta"
created: 2026-10-16
updated: 2026-10-16
status: active
source: workspace
tags: [growth, investigacao, pauta, fonte]
---

# Respostas da base interna da iGreen à pauta

Resposta da base interna da iGreen (OS) às perguntas da versão 1 de `pauta-areas.md`, consultada pelo Sergio em 16/10/2026 e colada na conversa. Está como veio, sem edição. É texto gerado a partir da base, citando regras e tabelas: serve de fonte para a seção 3 da pauta e precisa do "sim" do dono de cada assunto antes de virar regra num Context.

---

Onde há regra documentada, trago a fonte e o funcionamento; onde não há registro na base da casa, indico expressamente para que a decisão seja tomada na reunião sem suposições.
1. Decisões de base

* 1. Benefício dado em cada produto:
   * Energia (Conexão Green): O benefício principal é o desconto contratual na fatura (campo `CLIENTES.desconto_cliente`), calculado na fatura sobre a energia compensada (`valorseria - valorapagar` na `RCB_CLIENTES`). Não existe percentual universal fixo: quando zerado ou nulo, vale o percentual cadastrado na `TABELA_BONUS_CNXGREEN` para a combinação de concessionária e fornecedora (Regra `rule:SKILL_CLI_SEC5`). O cashback existe como programa de indicação de terceiros, e não como abatimento automático no fechamento.
   * Telecom: Desconto promocional de preço e bônus de 5 GB de internet nos planos comercializados via portabilidade (registrado na tabela `PLANOS`).
   * Seguros: Preço da apólice contratada. Campanhas de cashback são sazonais (como a campanha de seguro de out/2026 documentada na Academy).
* 2. Quem paga o benefício e teto mensal:
   * Cashback de indicação: É custeado pelo rateio da margem de expansão/comercialização. Pela regra oficial (`rule:SKILL_CLI_SEC5`), ao indicar um cliente nas verticais Green, Telecom ou Seguros, o cliente indicador recebe 50% do bônus extra promocional do mês na entrada e 50% da recorrência do licenciado a cada fatura paga pelo indicado. Não há teto financeiro mensal global registrado em banco para o cliente.
* 3. Validade do cashback e regras de anulação/perda:
   * Estrutura do cashback: Registrado na tabela `CASHBACK` com contrapartida na `CASHBACK_USADO`. Apenas lançamentos com `active = true` compõem o saldo disponível. Se o cliente indicado for desvalidado ou cancelado, o lançamento é cancelado (`active = false`). O saldo em tela possui piso em zero.
   * Perda de desconto em energia por atraso: Pela regra das fornecedoras (`rule:SKILL_CLI_SEC5` e `rule:SKILL_RCB_SEC2`), cliente com desconto contratado superior a 10% que paga a fatura após a data de vencimento perde a condição especial e tem o desconto rebaixado para o piso mínimo de 10%.
* 4. iGreen Pay e parceiro financeiro / regulação Bacen:
   * No banco de dados, o CNPJ pagador/liquidante padrão é a iGreen Comercial S/A (CNPJ `44.478.421/0001-06`).
   * O produto iGreen Pay opera internamente hoje como gateway de pagamentos de recebíveis (`TRANSACAO_PAGAMENTO_RCB`) e gestão de saldo/saques/empréstimos para licenciados (com planos Basic, Premium, Infinite).
   * A regra `rule:SKILL_CLI_SEC5` estabelece textualmente: "No contexto iGreen Pay a palavra 'cashback' é proibida (o produto Pay não tem cashback)".
   * Não há registro na base técnica de parceria de BaaS (Banking as a Service) homologada para abertura de contas de pagamento individuais para clientes finais sob a Lei 12.865/2013. Essa definição regulatória depende integralmente do jurídico e do financeiro.
* 5. Cashback: saldo do cliente ou desconto futuro:
   * Hoje o cashback é tratado sistemicamente como saldo em reais creditado na conta do cliente dentro do app do Club (onde ele pode gastar ou solicitar resgate via `CASHBACK_USADO`), desvinculado contabilmente do abatimento na emissão da fatura da distribuidora/fornecedora.
* 6. Papel do iGreen Club:
   * O iGreen Club foi oficialmente reativado em 21/09/2026 com mensalidade vigente de R$ 29,90 (`rule:SKILL_CLI_SEC2`). No ecossistema atual, o app do Club centraliza cupons de parceiros, carteira de cashback e acesso às contratações de telecom e seguros. A unificação com metas e gamificação de produtos ainda não existe nos schemas de banco.
* 7, 8, 9 e 10. Prime, iGreen+, aprovação de copys e crédito ao cliente:
   * iGreen Prime / pontos: Não consta na base da casa nenhum produto ou programa chamado "iGreen Prime" nem conversão de pontos por faturas de cliente. (Os únicos pontos existentes são Green Points e pontos de graduação, ambos exclusivos de licenciados).
   * iGreen+: Não consta na base de dados ou na documentação da empresa.
   * Textos legais e ofertas: Não há fluxo documentado no repositório; regra a ser arbitrada com jurídico/compliance.
   * Ofertas de crédito: O único produto de empréstimo ativo é a Antecipação de Bônus (Empréstimo Pay), exclusivo para licenciados ativos com base no bônus recorrente dos últimos 90 dias (`rule:PAY_EMP_SCHEMA`). Não existe infraestrutura de empréstimo pessoal para clientes finais no banco.

2. Perguntas por produto
Telecom

* Processamento e cobrança:
   * As transações de telecom são registradas na tabela `TELECOM_PEDIDO` (integrada à operadora parceira Contel). O fluxo separa cobrança de `ATIVACAO` (primeira fatura / chip) de `RECARGA` (mensalidades subsequentes), associadas ao período de cobertura em `TELECOM_CICLO_PLANO`. O cliente paga via gateway por Pix ou cartão.
* Expiração de pedidos:
   * Na tabela `TELECOM_PEDIDO`, quando o pedido está no status `AGUARDANDO_PAGAMENTO`, a validade é controlada pelo campo nativo `expira_em`.
* Benefícios existentes:
   * 200 kWh da portabilidade: É um benefício para o licenciado na régua de graduação (`rule:KNW_TELECOM_GRADUACAO_REGUA`), concedido apenas enquanto a linha estiver ativa e adimplente (inadimplência igual ou superior a 30 dias retira os 200 kWh da PROC).
   * Bônus de 5 GB: Já é embutido no catálogo de planos (`PLANOS`) para quem contrata com portabilidade confirmada.

Seguros (com a BBone)

* Pagamento e gateways:
   * A primeira parcela / adesão é gerada na proposta (`CNX_SEGUROS_COTACOES`). As mensalidades recorrentes rodam na tabela `CNX_SEGUROS_FATURAS`, que suporta quatro formas: Boleto, Pix, Cartão de Crédito e Checkout (link Cielo).
* Tempo de sincronização:
   * O cliente paga e o campo `paid = true` é marcado na cotação. Porém, a criação da apólice definitiva na tabela `CNX_SEGUROS` depende de um cron assíncrono que roda a cada 30 minutos (`rule:SKILL_CLI_SEC2` e poule de vistorias). Por isso, pagamentos confirmados levam até meia hora para refletir como seguro ativo.
* Renovação mês a mês:
   * A cobrança é gerada em faturas avulsas (`CNX_SEGUROS_FATURAS`). A apólice não possui mecanismo automático de renovação contratual anual documentado nos schemas.
* Cashback e SUSEP:
   * Existe a coluna `CNX_SEGUROS_COTACOES.indcli` que permite ao cliente receber cashback por indicar seguros, mas o volume pago registrado é residual. Restrições da SUSEP sobre estorno ou condicionamento de prêmio não constam no cérebro da empresa e devem ser validadas com o parceiro BBone e jurídico.

Energia (Financeiro e Operações)

* Como o cliente paga e o que é o "Boleto Único":
   * Existem duas modalidades operacionais (`rule:SKILL_N2_SEC3`):
      1. Dois boletos: O cliente recebe a fatura da distribuidora (taxas mínimas, iluminação pública, impostos) e, separadamente, o boleto iGreen (consumo compensado com desconto).
      2. Boleto Único (Conta Única): O cliente paga um único documento emitido pelo ecossistema iGreen/billing-gateway. Quando esse pagamento entra, o sistema dispara um split automático via `IGREEN_BILLING.logs_split_unif` e `SOLIS.repasse_outbound`: o Sólis comanda a iGreen Pay a pagar a fatura original diretamente à concessionária, retendo a parte líquida da iGreen.
* Meios de pagamento no app:
   * Boletos de energia podem ser quitados dentro do app pelo gateway iGreen Pay (`TRANSACAO_PAGAMENTO_RCB`), com suporte a Pix (com expiração automática) e Cartão de Crédito.
* Economia realizada:
   * Na `RCB_CLIENTES`, a métrica oficial é `valorseria - valorapagar` (`rule:SKILL_RCB_SEC1`). Para a "economia realizada", somam-se apenas as faturas cujo pagamento já foi liquidado (`dtpagamento` preenchida). Faturas sem cálculo de valor base são excluídas da soma para não gerar distorções.
* Primeira fatura e percepção de fraude:
   * Da assinatura à primeira injeção de energia na distribuidora decorrem normalmente de 60 a 180 dias (`rule:SKILL_CLI_SEC4`). Durante esse intervalo, o cliente não recebe faturas da iGreen.
   * O material de atendimento (`rule:SKILL_GREEN_SEC1`) registra que a iGreen não envia boletos ou cobranças por e-mail. O envio de boletos diretamente por algumas fornecedoras gera frequente receio de golpe e contestação de clientes no primeiro ciclo, justificando a necessidade de comunicação prévia clara no app antes da chegada do primeiro título.
