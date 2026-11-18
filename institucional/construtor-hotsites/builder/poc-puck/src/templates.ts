import type { Data } from "@puckeditor/core";
import { config, type Blocks } from "./puck/config";
import { MODELOS_LIVRE } from "./puck/guia";

export type TemplateId = "branco" | "evento" | "live" | "campanha" | "premium";
export type Template = { id: TemplateId; nome: string; descricao: string; data: Data };
export type Example = { title: string; slug: string; templateId: TemplateId; data: Data };

/** Monta uma peça já com os valores padrão dela. `travado` vem do modelo e impede mover ou apagar. */
function peca<K extends keyof Blocks>(type: K, props: Partial<Blocks[K]> = {}, travado = false) {
  const base = config.components[type].defaultProps ?? {};
  return { type, props: { ...base, ...props, ...(travado ? { travado: true } : {}), id: "" } };
}

function pagina(titulo: string, content: ReturnType<typeof peca>[], descricao = "", moldura: "padrao" | "sem" = "padrao"): Data {
  return {
    root: { props: { titulo, descricao, imagemCompartilhamento: "", indexar: true, animacoes: "on", moldura } } as Data["root"],
    content: content as Data["content"],
    zones: {},
  };
}

const IMG = {
  mobi: "https://snksergio.github.io/igreen-hub/mob/live-lancamento/img/pre-cadastro/solto-mobi.webp",
  thiago: "https://snksergio.github.io/igreen-eventos-v2/speakers/thiago-cut.png",
  rafael: "https://snksergio.github.io/igreen-eventos-v2/speakers/rafael-cut.png",
  amanda: "https://snksergio.github.io/igreen-eventos-v2/speakers/amanda-cut.png",
};

/** O kit iGreen Live inteiro, na ordem da landing premium (mockups/landing-evento.html). */
const KIT_LIVE = () => [
  peca("LiveAbertura", {}, true),
  peca("LiveFaixa"),
  peca("LiveSobre"),
  peca("LiveBeneficios"),
  peca("LivePalestrantes"),
  peca("LiveAgenda"),
  peca("LiveNumeros"),
  peca("LiveLocal", {}, true),
  peca("LiveVideo"),
  peca("LivePerguntas"),
  peca("LiveInscricao", {}, true),
  peca("LiveRodape"),
];

export const TEMPLATES: Template[] = [
  {
    id: "branco",
    nome: "Começar do zero",
    descricao: "Página em branco. Você escolhe cada peça.",
    data: pagina("", []),
  },
  {
    id: "premium",
    nome: "Evento iGreen Live",
    descricao: "Visual premium do iGreen Live: primeira tela com a pessoa, carrossel de palestrantes, mapa, vídeo e inscrição em destaque.",
    data: pagina("", KIT_LIVE(), "", "sem"),
  },
  {
    id: "evento",
    nome: "Evento presencial",
    descricao: "Encontro num lugar e numa data: local, programação, quem fala e inscrição.",
    data: pagina("", [
      peca("Abertura", {}, true),
      peca("Local", {}, true),
      peca("Agenda"),
      peca("Pessoas"),
      peca("Inscricao"),
      peca("Depoimentos"),
      peca("PerguntasFrequentes"),
      peca("ChamadaFinal"),
    ]),
  },
  {
    id: "live",
    nome: "Live com pré-cadastro",
    descricao: "Transmissão online: o que vai ser mostrado, simulação e pré-cadastro.",
    data: pagina("", [
      peca("Abertura", { chamada: "Live iGreen", botaoTexto: "Quero participar da live" }, true),
      peca("ContagemRegressiva", { titulo: "A live começa em", local: "YouTube" }),
      peca("ItensNumerados", { titulo: "O que você vai ver na live" }),
      peca("Simulador"),
      peca("Inscricao", { titulo: "Faça seu pré-cadastro" }, true),
      peca("PerguntasFrequentes"),
      peca("ContatoConsultor"),
    ]),
  },
  {
    id: "campanha",
    nome: "Campanha",
    descricao: "Página de produto ou oportunidade, enviada pelo licenciado com o contato dele.",
    data: pagina("", [
      peca("Abertura", { chamada: "iGreen", botaoTexto: "Falar no WhatsApp", destino: "whatsapp" }, true),
      peca("Cards"),
      peca("Numeros"),
      peca("Simulador"),
      peca("Video"),
      peca("LogosParceiros"),
      peca("PerguntasFrequentes"),
      peca("ContatoConsultor", {}, true),
      peca("ChamadaFinal", { botaoTexto: "Falar no WhatsApp", destino: "whatsapp" }),
    ]),
  },
];

export const EXAMPLES: Example[] = [
  {
    title: "iGreen Live BH",
    slug: "igreen-live-bh",
    templateId: "premium",
    data: pagina(
      "iGreen Live BH · 12 de dezembro no Expominas",
      KIT_LIVE(),
      "Uma noite com quem já transformou conta de luz em renda: palestras, conexões e o próximo passo na iGreen. Entrada gratuita, vagas limitadas.",
      "sem"
    ),
  },
  {
    title: "Encontro iGreen BH com Thiago",
    slug: "evento-thiago-bh",
    templateId: "evento",
    data: pagina("Encontro iGreen em Belo Horizonte", [
      peca(
        "Abertura",
        {
          chamada: "Encontro iGreen · Belo Horizonte",
          titulo: "Uma noite para conhecer o ecossistema iGreen",
          subtitulo: "Thiago Souza recebe convidados para apresentar os produtos da iGreen e tirar dúvidas ao vivo.",
          imagemUrl: IMG.thiago,
          imagemAlt: "Thiago Souza, anfitrião do encontro",
          botaoTexto: "Garantir meu lugar",
        },
        true
      ),
      peca(
        "Local",
        {
          inicio: "2026-12-12T19:00",
          duracaoMin: 180,
          nomeLocal: "Espaço de eventos (exemplo)",
          endereco: "Av. do Contorno, 0000 · Savassi",
          cidade: "Belo Horizonte",
          uf: "MG",
        },
        true
      ),
      peca("Agenda", {
        itens: [
          { data: "", hora: "19h00", local: "", descricao: "Recepção e café" },
          { data: "", hora: "19h30", local: "", descricao: "Apresentação do ecossistema iGreen" },
          { data: "", hora: "20h30", local: "", descricao: "Perguntas e respostas" },
          { data: "", hora: "21h00", local: "", descricao: "Conversa livre" },
        ],
      }),
      peca("Pessoas", {
        pessoas: [
          { fotoUrl: IMG.thiago, nome: "Thiago Souza", papel: "Anfitrião" },
          { fotoUrl: IMG.rafael, nome: "Rafael Costa", papel: "Convidado" },
          { fotoUrl: IMG.amanda, nome: "Amanda", papel: "Convidada" },
        ],
      }),
      peca("Inscricao", {
        titulo: "Garanta seu lugar",
        texto: "As vagas são limitadas pelo espaço.",
        opcoesInteresse: "Conhecer os produtos\nSer licenciado\nLevar a iGreen para minha empresa",
      }),
      peca("PerguntasFrequentes", {
        itens: [
          { pergunta: "O evento é gratuito?", resposta: "Sim. Só precisa fazer a inscrição." },
          { pergunta: "Posso levar alguém?", resposta: "Pode, desde que a pessoa também se inscreva." },
          {
            pergunta: "Fui convidado por um licenciado. E agora?",
            resposta: "Faça a inscrição pelo link que recebeu. Assim o convite fica registrado no nome de quem chamou você.",
          },
        ],
      }),
      peca("ChamadaFinal", { titulo: "Te esperamos em Belo Horizonte.", botaoTexto: "Garantir meu lugar" }),
    ], "Encontro gratuito em Belo Horizonte para conhecer os produtos da iGreen: energia, telecom, seguros e mobilidade. Vagas limitadas."),
  },
  {
    title: "Live Mobi · pré-cadastro",
    slug: "live-mobi",
    templateId: "live",
    data: pagina("Live de lançamento iGreen MOB", [
      peca(
        "Abertura",
        {
          chamada: "Live de lançamento · iGreen MOB",
          titulo: "O próximo movimento pode ser seu.",
          subtitulo: "Uma live para conhecer a oportunidade por trás da mobilidade elétrica.",
          imagemUrl: IMG.mobi,
          imagemAlt: "Eletroposto iGreen Mobi",
          botaoTexto: "Quero participar da live",
        },
        true
      ),
      peca("ContagemRegressiva", {
        titulo: "A live começa em",
        quando: "2026-12-04T20:00",
        duracaoMin: 90,
        local: "YouTube",
        textoAcabou: "A live já começou. Corre que ainda dá tempo!",
      }),
      peca("ItensNumerados", {
        titulo: "Uma live. Um novo horizonte.",
        itens: [
          { titulo: "A oportunidade", texto: "Como a recarga elétrica pode se conectar a novos negócios e espaços do dia a dia." },
          { titulo: "O universo iGreen MOB", texto: "Os modelos de eletropostos e a proposta da iGreen para mobilidade elétrica." },
          { titulo: "Os caminhos para participar", texto: "Como funciona a proposta, com tempo para tirar dúvidas antes do próximo passo." },
        ],
      }),
      // Seção livre com JavaScript próprio: abas dos três modelos (dados da página de pré-cadastro).
      peca("SecaoLivre", {
        modelo: "abas",
        html: `<h2 class="hs-h2" data-r="up" style="--i:0">Três eletropostos, um para cada ponto</h2>
<div class="abas" role="tablist" aria-label="Modelos de eletroposto">
  <button class="aba" role="tab" aria-selected="true" data-aba="1">Mobi</button>
  <button class="aba" role="tab" aria-selected="false" data-aba="2">Mobi Fast</button>
  <button class="aba" role="tab" aria-selected="false" data-aba="3">Mobi Ultra Fast</button>
</div>
<div class="painel" role="tabpanel" data-painel="1"><p class="hs-lead">7 kW AC, um conector. Até 5 carros por dia.</p></div>
<div class="painel" role="tabpanel" data-painel="2" hidden><p class="hs-lead">7 + 40 kW AC + DC, dois conectores. Até 30 carros por dia.</p></div>
<div class="painel" role="tabpanel" data-painel="3" hidden><p class="hs-lead">80 kW DC, potência total. Até 43 carros por dia.</p></div>`,
        css: MODELOS_LIVRE.abas.css,
        js: MODELOS_LIVRE.abas.js,
      }),
      peca("Simulador", {
        titulo: "E na sua operação, como seria?",
        rotuloItem: "carros recarregando por dia",
        valorPorItem: 150,
        maximo: 40,
      }),
      peca(
        "Inscricao",
        {
          titulo: "Quero estar por dentro.",
          texto: "Faça o pré-cadastro e receba o link da live.",
          opcoesInteresse: "Conhecer a oportunidade\nTenho um local para recarga\nQuero empreender com a iGreen",
          textoConsentimento:
            "Quero receber informações sobre a live e a oportunidade iGreen MOB por WhatsApp e e-mail. Posso cancelar quando quiser.",
          botaoTexto: "Quero participar da live",
          mensagemSucesso: "Pré-cadastro feito. O link da live chega no seu WhatsApp.",
        },
        true
      ),
      peca("PerguntasFrequentes", {
        titulo: "O que você precisa saber",
        itens: [
          { pergunta: "Preciso entender de mobilidade elétrica?", resposta: "Não. A live explica do zero." },
          { pergunta: "Onde e quando acontece?", resposta: "Ao vivo no YouTube, em 4 de dezembro, às 20h. O link chega por WhatsApp." },
          { pergunta: "O pré-cadastro gera algum compromisso?", resposta: "Não. Serve só para você receber o link e os avisos." },
          {
            pergunta: "Fui convidado por um licenciado. E agora?",
            resposta: "Faça o pré-cadastro pelo link que recebeu. O convite fica registrado no código de quem chamou você.",
          },
        ],
      }),
      peca("ContatoConsultor"),
    ], "Live de lançamento da iGreen MOB no YouTube: a oportunidade da mobilidade elétrica, os modelos de eletroposto e como participar."),
  },
  {
    // Remontagem do hotsite Migre a bandeira só com peças do catálogo, para provar cobertura.
    title: "Migre a bandeira · iGreen MOB",
    slug: "migre-a-bandeira",
    templateId: "campanha",
    data: pagina("Migre a bandeira do seu eletroposto", [
      peca(
        "Abertura",
        {
          chamada: "iGreen MOB · Eletropostos",
          titulo: "Transforme seu ponto em receita recorrente.",
          subtitulo: "Leve seu eletroposto para a rede iGreen e ganhe com cada recarga e com cada cliente que se conecta.",
          imagemUrl: IMG.mobi,
          imagemAlt: "Eletroposto iGreen Mobi",
          botaoTexto: "Falar no WhatsApp",
          destino: "whatsapp",
          mensagemWhats: "Olá, {nome}! Quero saber como migrar a bandeira do meu ponto.",
        },
        true
      ),
      peca("Cards", {
        titulo: "Uma recarga. Cinco caminhos.",
        itens: [
          { imagemUrl: "", titulo: "Energia", texto: "R$ 50 para recarregar." },
          { imagemUrl: "", titulo: "Seguros", texto: "Seguro que vira recarga." },
          { imagemUrl: "", titulo: "Telefonia", texto: "Cada linha, uma receita." },
          { imagemUrl: "", titulo: "Rede iGreen", texto: "O cliente viaja. A conexão fica." },
          { imagemUrl: "", titulo: "Eletropostos MOB", texto: "Seu ponto na rede iGreen." },
        ],
      }),
      peca("FaixaAnimada", { frases: "Energia\nSeguros\nTelefonia\nRede iGreen\nEletropostos MOB", velocidade: "normal" }),
      peca("Numeros", {
        titulo: "Uma bandeira completa. Em quatro números.",
        itens: [
          { valor: "4%", legenda: "sobre a conta de energia do cliente" },
          { valor: "5%", legenda: "sobre a mensalidade do seguro" },
          { valor: "R$ 7", legenda: "por linha de telefonia ativa" },
          { valor: "2%", legenda: "sobre a carteira na rede" },
        ],
      }),
      peca("Simulador", {
        titulo: "Um posto. Novas receitas. Uma carteira que cresce.",
        rotuloItem: "clientes conectados pelo seu ponto",
        valorPorItem: 52,
        maximo: 300,
      }),
      peca("ItensNumerados", {
        titulo: "Toda a experiência de recarga. Na palma da mão.",
        itens: [
          { titulo: "Tudo começa no app", texto: "O motorista abre o iGreen MOB e acha mapa, carteira e recargas num só lugar." },
          { titulo: "Encontre seu eletroposto", texto: "O mapa mostra onde fica, o preço por kWh e se o ponto está livre." },
          { titulo: "Escolha onde recarregar", texto: "Conectores, valores e horário do ponto, e o botão Carregar aqui." },
          { titulo: "Saldo ou pós-pago", texto: "Paga com o saldo da carteira ou no cartão." },
          { titulo: "Comece sua recarga", texto: "Encaixa o cabo e espera a confirmação do eletroposto." },
          { titulo: "Recarga em andamento", texto: "Bateria, energia, tempo e custo em tempo real." },
        ],
      }),
      peca("Video", { titulo: "Uma marca presente no seu ponto." }),
      peca("LogosParceiros", {
        titulo: "A recarga é só o começo. Os benefícios acompanham o cliente.",
        logos: [
          { imagemUrl: "", nome: "Drogasil" },
          { imagemUrl: "", nome: "Cinemark" },
          { imagemUrl: "", nome: "Domino's" },
          { imagemUrl: "", nome: "Coco Bambu" },
        ],
        exibicao: "faixa",
      }),
      peca("PerguntasFrequentes", {
        titulo: "Antes de migrar a bandeira.",
        itens: [
          { pergunta: "Preciso trocar meu carregador?", resposta: "Resposta a confirmar com o time iGreen MOB." },
          { pergunta: "Quando o dinheiro das recargas entra no caixa?", resposta: "Resposta a confirmar com o time iGreen MOB." },
          { pergunta: "Quem faz a manutenção?", resposta: "Resposta a confirmar com o time iGreen MOB." },
          { pergunta: "Os valores do simulador são garantidos?", resposta: "Não. São ilustrativos e dependem da operação do seu ponto." },
        ],
      }),
      peca("ContatoConsultor", {}, true),
      peca("ChamadaFinal", {
        titulo: "Seu ponto já conecta carros. Conecte novas receitas.",
        botaoTexto: "Falar no WhatsApp",
        destino: "whatsapp",
        mensagemWhats: "Olá, {nome}! Quero migrar a bandeira do meu ponto.",
      }),
    ], "Leve seu eletroposto para a rede iGreen MOB e ganhe com recargas, energia, seguros e telefonia dos clientes que se conectam."),
  },
];
