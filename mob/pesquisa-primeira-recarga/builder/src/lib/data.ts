/**
 * Todo o conteúdo do deck em um arquivo só.
 *
 * REGRA 1: nada aqui é regra da iGreen. Quase tudo é pesquisa — o que outras
 * empresas fazem ou o que usuários relatam. O campo `marker` de cada bloco
 * carrega essa distinção até a tela.
 *
 * REGRA 2: os números vetados pelo briefing (seção 2.2) não existem neste
 * arquivo e não devem ser adicionados.
 */

export type Marker = "pesquisa" | "regulacao" | "hipotese" | "fragil" | "gap";

export const brand = {
  product: "Conexão MOB",
  deck: "A primeira recarga",
  kind: "Pesquisa de mercado",
  date: "07/09/2026",
  author: "Sérgio Vieira",
};

/** Rodapé: coluna esquerda e direita são fixas; a central é a fonte da página. */
export const footer = {
  left: `${brand.product} · ${brand.deck}`,
  right: `${brand.kind} · ${brand.date}`,
};

export const cover = {
  eyebrow: "Pesquisa de mercado · Conexão MOB",
  line1: "A primeira recarga",
  line2: "quebra no pagamento",
  subtitle:
    "O que o motorista brasileiro enfrenta ao carregar um carro elétrico pela primeira vez — e por que o ponto de falha é dinheiro, não tomada.",
  stat: 39,
  statCaption:
    "das reclamações formais da maior operadora do país são sobre dinheiro",
  rail: [
    ["Escopo", "6 frentes de investigação, ~170 buscas"],
    ["Base", "~85 avaliações de loja, 37 reclamações"],
    ["Data", "07/09/2026"],
    ["Autor", "Sérgio Vieira"],
  ] as [string, string][],
};

export const agenda = {
  subtitle:
    "Nove momentos, uma tese: o que trava a primeira recarga não é a tomada, é o dinheiro.",
  items: [
    "O mercado real",
    "Quem manda na plataforma",
    "As dores, por peso",
    "Nove momentos",
    "O funil do pagamento",
    "O teto do SMS",
    "O que o mundo provou",
    "O que o Brasil tem",
    "A tensão do modelo",
  ],
};

export const market = {
  title: ["O mercado é grande e", "mal medido"],
  marker: "pesquisa" as Marker,
  source: "ABVE · Anatel · mai–ago/2026",
  note: "A primeira recarga da maioria não é num DC de rodovia. É num AC lento de shopping. São dois serviços com física diferente, e um fluxo único desenhado para o DC erra o caso mais comum.",
  cards: [
    {
      label: "Frota eletrificada",
      value: 950183,
      display: "950.183",
      pill: "+1 milhão em set/2026",
      note: "Leves eletrificados, ago/2026",
    },
    {
      label: "Pontos públicos",
      value: 25429,
      display: "25.429",
      pill: "8.601 DC · 16.828 AC",
      note: "mai/2026, 69% AC na leitura anterior",
    },
    {
      label: "Veículos por ponto",
      value: 37,
      display: "~37",
      pill: "cálculo próprio",
      note: "Datas distintas, ordem de grandeza",
    },
    {
      label: "Rodovia sem dados",
      value: 31.2,
      display: "31,2%",
      pill: "5G em 6,3%",
      note: "37.991 de 121.837 km",
    },
  ],
};

export const platforms = {
  title: ["Não são 40 redes. São", "quatro plataformas"],
  marker: "pesquisa" as Marker,
  source: "assinaturas de pacote Android · 2026",
  rows: [
    { name: "VoltBras", count: 27, display: "27+", examples: "NeoCharge, Ipiranga, Electra, WeCharge, Moby" },
    { name: "Tupi Mob", count: 7, display: "7", examples: "Tupi, BYD Recharge, 99 Recarga Elétrica, Plugo" },
    { name: "EZVolt / myCharge", count: 6, display: "6", examples: "Easy Volt, Volvo Car Eletropostos, Audi e-tron" },
    { name: "movE", count: 3, display: "3", examples: "movE driver, G Cargas, HertzGo" },
  ],
  consequences: [
    'A dor "um app pra cada rede" é comercial, não técnica.',
    "O motorista refaz o mesmo cadastro cinco vezes para falar com três backends.",
    "A iGreen entra como a marca nº 41 sobre a plataforma nº 5. Essa é a posição de partida honesta, e é ruim.",
  ],
};

export const painRanking = {
  title: ["As dores, ordenadas por", "peso de evidência"],
  marker: "pesquisa" as Marker,
  source: "avaliações de usuários e Reclame Aqui · 2024–2026",
  disclaimer:
    "Contagem qualitativa sobre o material analisado. Não é amostra estatística.",
  rows: [
    { name: "Cadastro / onboarding", count: 18, money: false },
    { name: "Mapa e disponibilidade", count: 17, money: false },
    { name: "Pagamento", count: 12, money: true },
    { name: "Saldo pré-pago preso", count: 12, money: true },
    { name: "App trava, sessão não abre", count: 12, money: false },
    { name: "Suporte", count: 9, money: false },
    { name: "Durante a carga", count: 8, money: false },
    { name: "Login / recadastro", count: 6, money: false },
    { name: "Preço opaco", count: 5, money: false },
    { name: "Um app por rede", count: 4, money: false },
    { name: "Ociosidade e fila", count: 2, money: false },
  ],
};

export const moneyDonut = {
  title: ["O problema nº 1 não é", "tomada"],
  marker: "pesquisa" as Marker,
  source: "Reclame Aqui, Tupi · 2026",
  money: 114,
  total: 292,
  percent: 39,
  centerCaption: "das reclamações formais",
  breakdown: "cobrança indevida, cobrança duplicada ou estorno",
  quote: {
    text: "PRECISO DO DINHEIRO",
    credit: "usuário sobre saldo pré-pago preso · Reclame Aqui · 2026",
  },
  closing:
    "O que o motorista reclama formalmente é do dinheiro, não do plugue.",
};

export const appRatings = {
  title: ["Quem resolve descoberta é amado.", "Quem resolve transação é odiado."],
  marker: "fragil" as Marker,
  source: "App Store BR e Google Play BR · 2026",
  discovery: [
    { name: "PlugShare", role: "mapa comunitário", rating: 4.9, volume: "~19 mil" },
    { name: "BYD Recharge", role: "agregador", rating: 4.9, volume: "~934" },
    { name: "WEMOB", role: "app de rede", rating: 4.8, volume: "" },
  ],
  transaction: [
    { name: "Zletric", role: "operadora", rating: 1.7, volume: "" },
    { name: "Ipiranga Recarga", role: "operadora", rating: 1.3, volume: "" },
    { name: "Easy Volt / EZVolt", role: "operadora", rating: 2.0, volume: "" },
    { name: "Volvo Car Eletropostos", role: "montadora", rating: 2.2, volume: "" },
  ],
  caveat:
    "Notas contaminadas por prompt de review ao fim de cada carga, e divergentes entre lojas. Ler o conteúdo das avaliações de 1 estrela, nunca a média.",
};

export const journey = {
  title: ["A jornada em", "nove momentos"],
  marker: "pesquisa" as Marker,
  source: "mapeamento da jornada · 07/09/2026",
  nodes: [
    { id: "M1", label: ["Descobrir que", "existe um ponto"], pain: "disponibilidade errada" },
    { id: "M2", label: ["Chegar", "até lá"], pain: "32 km de desvio" },
    { id: "M3", label: ["Achar o", "carregador"], pain: "sem sinalização de uso" },
    { id: "M4", label: ["A", "vaga"], pain: "livre em <20%" },
    { id: "M5", label: ["Entender o", "equipamento"], pain: "visor ao sol, QR ilegível" },
    { id: "M6", label: ["Identificar-se", "e pagar"], pain: "o funil de morte" },
    { id: "M7", label: ["A", "espera"], pain: "potência abaixo" },
    { id: "M8", label: ["Encerrar", "e sair"], pain: "ociosidade surpresa" },
    { id: "M9", label: ["O dinheiro", "depois"], pain: "estorno e saldo preso" },
  ],
  failurePoints: [4, 5, 7],
  focusIndex: 5,
  note: "O ponto de não-retorno é antes de chegar. Se a pessoa desviou 32 km, o custo do fracasso já foi pago. Um fluxo que só falha no totem falha tarde demais.",
};

export const connectivity = {
  title: ["Um terço das rodovias", "não tem sinal"],
  marker: "pesquisa" as Marker,
  source: "Anatel · 2026",
  stats: [
    { value: "31,2%", label: "rodovias sem cobertura" },
    { value: "6,3%", label: "com 5G" },
    { value: "37.991 km", label: "sem sinal" },
    { value: "69%", label: "da rede pública é AC" },
  ],
  quote: {
    text: "Sem sinal para receber o SMS, pegou um ônibus até a cidade vizinha e voltou de Uber. Seis horas.",
    credit: "relato parafraseado · Google Play · 03/01/2025",
  },
  closing:
    "Qualquer fluxo que exija cadastro online, código por SMS ou QR que abre página web não termina numa fatia grande do território.",
};

export const physical = {
  title: ["Antes do app existe um", "totem ao sol"],
  marker: "pesquisa" as Marker,
  source: "Motor Show · CONTRAN 965/2022 · IT-41 CBSP",
  cards: [
    {
      label: "A vaga",
      body: "Livre em menos de 20% das tentativas em campo. A vaga é do veículo em recarga (CONTRAN 965/2022, art. 3º, IX).",
      foot: "PL 801/26 propõe infração grave, R$ 195,23 e remoção.",
    },
    {
      label: "O visor",
      body: "“Não se enxerga o visor. Código de barras inexiste.” A WCAG não cobre sol direto.",
      foot: "4,5:1 é piso legal, não meta para totem ao meio-dia.",
    },
    {
      label: "O QR",
      body: "É o ponto de falha físico — gasto, riscado, sem sinal para abrir — e o vetor de golpe.",
      foot: "Adesivo falso sobreposto ao original.",
    },
    {
      label: "A ajuda",
      body: "“Nunca temos para quem pedir ajuda.” Nenhuma evidência publicada de frentista treinado no Brasil.",
      foot: "Nada normatiza sinalização de uso.",
    },
  ],
  connectors: ["CCS2", "Type 2", "GB/T", "CHAdeMO"],
  connectorCaption: "quatro padrões, nenhuma explicação no totem",
};

export const divider = {
  line1: "M6 — identificar-se e pagar",
  line2: "o funil de morte",
  sentence: "Este é o momento que o projeto existe para resolver.",
  stats: [
    { value: "12", label: "ocorrências de pagamento" },
    { value: "12", label: "de saldo preso" },
    { value: "10×", label: "entre o melhor e o pior fluxo" },
  ],
};

export const frictionRuler = {
  title: ["Do mesmo mercado:", "2 ou 20 ações"],
  marker: "pesquisa" as Marker,
  source: "fluxos documentados por rede · 2026",
  rows: [
    { name: "Volvo (2ª recarga+, autocharge)", min: 1, max: 1, display: "1", tone: "plain" },
    { name: "Rota Verde Plug&Play", min: 1, max: 2, display: "1–2", tone: "plain" },
    { name: "Incharge (contactless)", min: 2, max: 2, display: "2", tone: "accent" },
    { name: "Incharge (QR)", min: 4, max: 5, display: "4–5", tone: "plain" },
    { name: "WEMOB modo livre", min: 5, max: 5, display: "5", tone: "plain" },
    { name: "Evowatt", min: 6, max: 9, display: "6–9", tone: "plain" },
    { name: "Zletric", min: 8, max: 12, display: "8–12", tone: "plain" },
    { name: "VoltBras e white-labels", min: 10, max: 14, display: "10–14", tone: "plain" },
    { name: "EZVolt", min: 12, max: 16, display: "12–16", tone: "dark" },
    { name: "Tupi / Tupinambá", min: 14, max: 18, display: "14–18", tone: "dark" },
    { name: "BYD Recharge", min: 16, max: 20, display: "16–20", tone: "dark" },
  ],
  multiple: "10×",
  multipleCaption: "de diferença, mesmo mercado, mesmo serviço",
  note: "Nada disso é necessário para vender energia. A Incharge cobra com zero cadastro, no Brasil, desde jan/2025.",
};

export const paymentValves = {
  title: ["Quatro válvulas fecham o", "pagamento"],
  marker: "pesquisa" as Marker,
  source: "Twilio · termos de uso · Reclame Aqui",
  cards: [
    {
      label: "SMS / OTP",
      body: "Falha por três causas independentes: não chega, não há sinal, ou o código é rejeitado.",
      figure: "~86%",
      foot: "é o teto, não a média",
    },
    {
      label: "Pré-autorização",
      body: "Bloqueados por sessão, 1 a 7 dias úteis para voltar ao extrato. Um usuário encontrou R$ 204 de caução.",
      figure: "~R$ 70",
      foot: "quatro operadoras confirmam; nenhuma publica o valor",
    },
    {
      label: "Saldo preso",
      body: "Seis casos em cinco empresas. Uma declara em termos que créditos não são reembolsáveis.",
      figure: "6 casos",
      foot: "em cinco empresas",
    },
    {
      label: "Ociosidade",
      body: "R$ 0,50/min após a carga. R$ 60 de multa sobre R$ 15 de energia.",
      figure: "4×",
      foot: "a multa custou 4× o produto",
    },
  ],
  closing: {
    head: "A contradição central, dita pelo próprio setor",
    body: "A carteira pré-paga é recomendada para escapar da caução no cartão, e é exatamente a origem do saldo preso.",
    accent: "A solução de uma dor é a causa da outra.",
  },
};

export const otpDrop = {
  title: ["O SMS tem teto,", "e cauda catastrófica"],
  marker: "pesquisa" as Marker,
  source: "Twilio, dados internos · 14/11/2024",
  note: "Sucesso de verificação por SMS num incidente de operadora. O piso não é o pior caso — é um caso registrado.",
  series: [
    { label: "Normal", value: 86 },
    { label: "", value: 84 },
    { label: "Incidente", value: 78 },
    { label: "", value: 69 },
    { label: "", value: 62 },
    { label: "Piso", value: 56 },
  ],
  ceiling: 86,
  floor: 56,
  secondEvent: "−37%",
  secondEventLabel: "de conversão num segundo evento",
  passkey: {
    marker: "hipotese" as Marker,
    rows: [
      { label: "Sucesso", passkey: "93%", mfa: "63%" },
      { label: "Tempo", passkey: "8,5 s", mfa: "31,2 s" },
    ],
    caveat:
      "Vale para o segundo acesso. Na primeira recarga de um desconhecido, é inerte.",
  },
};

export const lockCards = {
  title: ["O app é uma fechadura,", "não um meio de pagamento"],
  marker: "pesquisa" as Marker,
  source: "reviews e Reclame Aqui · 2025–2026",
  cards: [
    {
      label: "O cabo não sai",
      body: "Quando o app trava, o conector não solta. Um usuário escreveu o requisito no lugar do PM.",
      quote: "opção de operar direto no carregador, sem precisar do aplicativo",
    },
    {
      label: "A potência mente",
      body: "50 kW nominais viram 30–40 kW efetivos, por limite do carro, da infra local e derating térmico.",
      quote: "",
    },
    {
      label: "O SAC real é público",
      body: "R$ 100 estornados em 16 minutos após reclamação pública, depois de dias de canal próprio falhando.",
      quote: "",
    },
    {
      label: "Resolvido não é retido",
      body: "Caso encerrado, nota 5/5, e o texto do próprio usuário logo abaixo.",
      quote: "Nunca mais.",
    },
  ],
  closing: {
    body: "A métrica de sucesso do primeiro acesso não é a conversão de cadastro.",
    accent: "É a segunda recarga.",
  },
};

export const regulators = {
  title: ["Três reguladores proibiram", "exigir app"],
  marker: "regulacao" as Marker,
  source: "AFIR art. 5º · SI 2023/1168 · 23 CFR §680.106(f)",
  pins: [
    { city: "Bruxelas", lon: 4.35, lat: 50.85 },
    { city: "Londres", lon: -0.13, lat: 51.5 },
    { city: "Washington", lon: -77.04, lat: 38.9 },
  ],
  cards: [
    {
      place: "União Europeia",
      norm: "Reg. (UE) 2023/1804, art. 5º · em vigor 13/04/2024",
      body: "Pagamento ad hoc sem contrato prévio. Abaixo de 50 kW vale QR levando a página de pagamento.",
      foot: "Retrofit até 01/01/2027 para ≥50 kW na TEN-T.",
    },
    {
      place: "Reino Unido",
      norm: "SI 2023/1168, reg. 5(4)(a)",
      body: "Contactless obrigatório acima de 8 kW. Preço em pence/kWh, uptime de 99%, helpline 24/7, roaming.",
      foot: "Multa de £10.000 por ponto.",
    },
    {
      place: "Estados Unidos",
      norm: "23 CFR §680.106(f) (NEVI)",
      body: "Não pode exigir filiação, nem limitar potência por meio de pagamento.",
      foot: "Canal por telefone/SMS obrigatório.",
    },
  ],
  headline: "25% no Reino Unido · 35% na Suíça",
  headlineCaption:
    "das sessões migraram para cartão quando a Fastned instalou terminais (Mastercard, jun/2023)",
  closing: "Um terço da demanda estava sendo perdida pela exigência de app.",
};

export const priceLadder = {
  title: ["Não se trava o acesso.", "Se recompensa o cadastro."],
  marker: "pesquisa" as Marker,
  source: "páginas de preço dos operadores · 2026",
  columns: [
    {
      operator: "Fastned",
      steps: [
        { tier: "Assinatura", value: "−30%", best: true },
        { tier: "Com app", value: "−10%", best: false },
        { tier: "Sem cadastro", value: "0%", best: false },
      ],
    },
    {
      operator: "bp pulse",
      steps: [
        { tier: "Assinatura", value: "52p/kWh", best: true },
        { tier: "Sem cadastro", value: "65p/kWh", best: false },
      ],
    },
    {
      operator: "EVgo",
      steps: [
        { tier: "Com app", value: "sem taxa", best: true },
        { tier: "Sem cadastro", value: "US$ 2,99", best: false },
      ],
    },
  ],
  closing: {
    plain: "A regra garante o acesso.",
    accent: "O preço faz a conversão para o cadastro.",
  },
  hypothesis:
    "Traduzido para a nossa mecânica: o vínculo licenciado ↔ motorista pode ser criado no primeiro pagamento, com o dado mínimo que o pagamento já entrega, e consolidado depois da carga — com desconto ou cashback como razão para completar o perfil.",
};

export const brazilRails = {
  title: ["O Brasil tem duas peças que os", "EUA não têm"],
  marker: "pesquisa" as Marker,
  source: "BCB · Datafolha/Abecs · 2025–2026",
  gauges: [
    { value: 86, label: "Pix", caption: "dos adultos — 148 milhões de pessoas físicas" },
    { value: 76, label: "Aproximação", caption: "das compras presenciais; era 8% há cinco anos" },
    { value: 26, label: "Carteira digital", caption: "de uso real — o corte demográfico é brutal" },
  ],
  cut: [
    ["25–34 anos", "47%"],
    ["60+", "3%"],
    ["A/B", "41%"],
    ["D/E", "12%"],
    ["Superior", "43%"],
    ["Fundamental", "9%"],
  ] as [string, string][],
  notes: [
    "71% das transações Pix são de até R$ 100 — exatamente a faixa de uma recarga. Liquidação em segundos, sem MDR de bandeira, sem chargeback.",
    "Um fluxo “só Apple/Google Pay” atende a minoria certa, não a maioria. Frota, táxi e motorista de aplicativo precisam de um caminho que não passe pelo celular do motorista.",
  ],
  warning:
    "Números do Pix lidos em fontes secundárias; conferir a publicação do Banco Central antes de uso externo.",
};

export const tollAnalogy = {
  title: ["O melhor análogo não é um app de recarga.", "É a tag do pedágio"],
  marker: "regulacao" as Marker,
  source: "Lei 14.157/2021",
  rows: [
    {
      toll: "Credencial física offline no carro",
      ev: "RFID ou plug & charge — a tag é o carro",
    },
    {
      toll: "Cadastro feito longe do momento de uso",
      ev: "Hoje o cadastro é exigido em pé, no totem",
    },
    {
      toll: "Sem app, sem QR, sem senha, sem sinal",
      ev: "Tudo depende de app, QR, senha e sinal",
    },
    {
      toll: "Sem tag: identificado pela placa, 30 dias para pagar",
      ev: "Sem conta: não carrega",
    },
  ],
  highlight: {
    head: "Free Flow, Lei 14.157/2021",
    body: "Consumo com zero cadastro, identidade inferida, pagamento diferido. E o cadastro é premiado com desconto de 5% a 96%, não exigido.",
    accent: "Existe precedente legal brasileiro para “carrega primeiro, resolve depois”.",
  },
  note: "A barra pública de “pagar rápido, em pé, na rua” no Brasil já existe: Zul+, nota 4,9 com 152 mil avaliações, Pix e carteira aceitos. Um app de recarga com nota 2,0 compete com essa memória.",
};

export const tension = {
  title: ["A tensão que não some com boa", "interface"],
  marker: "hipotese" as Marker,
  source: "análise do modelo de negócio",
  left: {
    head: "O licenciado é pago pelo motorista que ele cadastra.",
    body: "A receita dele depende de existir cadastro.",
  },
  right: {
    head: "Exigir cadastro na primeira recarga quebra o produto.",
    body: "Toda a evidência desta pesquisa diz isso.",
  },
  center:
    "O vínculo nasce no pagamento, não no formulário. Criado com o dado mínimo da transação, consolidado depois da carga, com o benefício como razão.",
  question:
    "Se o licenciado ganha por motorista cadastrado, como atribuir um motorista que carregou sem se cadastrar?",
  questionFoot: "Tensão de modelo de negócio, não de UX.",
};

export const proposedFlow = {
  title: ["O fluxo que a", "evidência sustenta"],
  marker: "hipotese" as Marker,
  source: "síntese da pesquisa",
  phases: [
    {
      stage: "Chegar",
      body: "Preço e status públicos, legíveis sem login.",
      points: ["Número curto digitável", "RFID", "Aproximação"],
    },
    {
      stage: "Pagar",
      body: "Contactless ou Pix por QR dinâmico, sem cadastro obrigatório.",
      points: ["Pré-autorização em tela", "Valor declarado", "Energia flui"],
    },
    {
      stage: "Carregar",
      body: "Sessão que não depende do app para liberar o cabo.",
      points: ["Progresso visível", "Aviso de ociosidade", "Antes da cobrança"],
    },
    {
      stage: "Voltar",
      body: "Cashback ou desconto como razão para completar o perfil.",
      points: ["Oferecido depois", "Resgate por Pix", "Mesma velocidade"],
    },
  ],
  lgpd:
    "Operar a recarga e cobrar já está coberto por contrato (art. 7º, V) — não precisa de consentimento. O opt-in de marketing é cláusula destacada, depois da carga. Biometria facial é dado sensível e exige alternativa não-biométrica.",
};

export const openQuestions = {
  title: ["Antes de desenhar,", "quatro respostas"],
  marker: "gap" as Marker,
  source: "questões em aberto · 07/09/2026",
  chips: [
    { n: "01", text: "A nota fiscal exige CPF antes da sessão?", foot: "bloqueia todo o resto" },
    { n: "02", text: "A Go Nansen aceita sessão sem cadastro completo?", foot: "qual o mínimo de campos" },
    { n: "03", text: "Pré-autorização, Pix e contactless no totem?", foot: "confirmar com a Go Nansen" },
    { n: "04", text: "Existe caminho de operação sem rede?", foot: "RFID offline, número curto" },
  ],
  field: [
    "uptime real (não existe fonte)",
    "sinal de celular nos futuros pontos",
    "cobertura contra sol e chuva no comodatário",
    "atendimento 24/7 no travamento das 22h",
    "acompanhar 5 primeiras recargas do estacionamento à saída",
  ],
  note: "A investigação em fontes públicas chegou ao limite: o constrangimento de estar em pé, sozinho, sem conseguir carregar, não aparece em avaliação de app.",
};

export const closing = {
  line1: "Carrega primeiro",
  line2: "resolve depois",
  subtitle:
    "Um levantamento amplo e analítico do mercado de recarga no Brasil e no exterior. O material completo, com fonte e data de cada número, acompanha esta apresentação.",
  rail: [
    ["Pesquisa", "A primeira recarga"],
    ["Base", "~460 fontes analisadas"],
    ["Data", "07/09/2026"],
    ["Autor", "Sérgio Vieira"],
  ] as [string, string][],
};
