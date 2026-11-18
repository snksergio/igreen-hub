/**
 * Como cada peça aparece para quem não é técnico.
 * No card da gaveta: nome + subtítulo (o termo que o time de design usa).
 * No pop-over: o que é e como funciona.
 */
export type PecaId =
  | "Abertura"
  | "ItensNumerados"
  | "Cards"
  | "Numeros"
  | "Video"
  | "Pessoas"
  | "Agenda"
  | "Local"
  | "PerguntasFrequentes"
  | "ChamadaFinal"
  | "Inscricao"
  | "ContatoConsultor"
  | "Simulador"
  | "Depoimentos"
  | "Galeria"
  | "LogosParceiros"
  | "ContagemRegressiva"
  | "LinhaDoTempo"
  | "Planos"
  | "FaixaAnimada"
  | "SecaoLivre"
  | "LiveAbertura"
  | "LiveFaixa"
  | "LiveSobre"
  | "LiveBeneficios"
  | "LivePalestrantes"
  | "LiveAgenda"
  | "LiveNumeros"
  | "LiveLocal"
  | "LiveVideo"
  | "LivePerguntas"
  | "LiveInscricao"
  | "LiveRodape";

type Ficha = { nome: string; tecnico: string; descricao: string; comoFunciona: string };

export const CATALOGO: Record<PecaId, Ficha> = {
  Abertura: {
    nome: "Abertura",
    tecnico: "Hero section",
    descricao: "A primeira coisa que o visitante vê: título grande, imagem e um botão.",
    comoFunciona: "Vai no topo. O botão pode levar ao formulário, ao WhatsApp ou a outro link.",
  },
  ItensNumerados: {
    nome: "Passo a passo",
    tecnico: "Steps",
    descricao: "Lista numerada 01, 02, 03 para explicar etapas ou os tópicos de uma live.",
    comoFunciona: "Até 6 itens. A numeração é automática: é só escrever título e texto.",
  },
  Cards: {
    nome: "Cards",
    tecnico: "Cards grid",
    descricao: "Produtos, serviços ou frentes de negócio lado a lado, cada um com imagem.",
    comoFunciona: "Até 8 cards. No celular eles ficam um embaixo do outro.",
  },
  Numeros: {
    nome: "Números",
    tecnico: "Stats",
    descricao: "Até 4 números grandes com uma legenda curta.",
    comoFunciona: "Use número que a empresa já divulga oficialmente.",
  },
  Video: {
    nome: "Vídeo",
    tecnico: "Video embed",
    descricao: "Vídeo do YouTube ou um arquivo .mp4.",
    comoFunciona: "Cole o link do YouTube; o player aparece sozinho.",
  },
  Local: {
    nome: "Data e local",
    tecnico: "Event info",
    descricao: "Quando e onde acontece o evento, com link para o mapa.",
    comoFunciona: "Sem link de mapa, a página busca o endereço no Google Maps.",
  },
  Agenda: {
    nome: "Agenda",
    tecnico: "Schedule",
    descricao: "Programação do dia ou a lista de cidades e datas de uma turnê.",
    comoFunciona: "Até 12 linhas, cada uma com data, hora, local e o que acontece.",
  },
  Pessoas: {
    nome: "Pessoas",
    tecnico: "Speakers",
    descricao: "Foto, nome e papel de palestrantes ou da equipe.",
    comoFunciona: "Até 12 pessoas. Sem foto, aparecem as iniciais.",
  },
  Inscricao: {
    nome: "Inscrição",
    tecnico: "Form",
    descricao: "Formulário com nome, WhatsApp, e-mail e consentimento.",
    comoFunciona: "As inscrições ficam na tela Inscrições, com o código do licenciado que convidou.",
  },
  ContatoConsultor: {
    nome: "Contato",
    tecnico: "WhatsApp do licenciado",
    descricao: "Foto, nome e botão de WhatsApp de quem enviou o link.",
    comoFunciona: "Os dados vêm do link do licenciado. Sem eles, mostra o contato da iGreen.",
  },
  PerguntasFrequentes: {
    nome: "Perguntas",
    tecnico: "FAQ",
    descricao: "Perguntas que abrem e fecham ao clicar.",
    comoFunciona: "Até 15 perguntas. Responda o que mais chega no WhatsApp.",
  },
  ChamadaFinal: {
    nome: "Chamada final",
    tecnico: "CTA",
    descricao: "Fechamento da página com uma frase e um botão.",
    comoFunciona: "Costuma repetir o botão da abertura, para quem rolou até o fim.",
  },
  Simulador: {
    nome: "Simulador",
    tecnico: "Peça especial",
    descricao: "Calculadora com slider que mostra o resultado por mês e por ano.",
    comoFunciona: "A conta é feita pelo dev. Você ajusta título, valor por item e o máximo.",
  },
  Depoimentos: {
    nome: "Depoimentos",
    tecnico: "Testimonials",
    descricao: "Frases de quem já participou, com foto, nome e quem é.",
    comoFunciona: "Até 6. Use frases curtas e reais, com autorização de quem falou.",
  },
  Galeria: {
    nome: "Galeria",
    tecnico: "Gallery",
    descricao: "Grade de fotos de edições passadas ou do lugar do evento.",
    comoFunciona: "Até 12 fotos, cada uma com legenda opcional.",
  },
  LogosParceiros: {
    nome: "Parceiros",
    tecnico: "Logo cloud",
    descricao: "Logos de parceiros e marcas do clube de benefícios.",
    comoFunciona: "Mostra em grade parada ou numa faixa correndo. Sem logo, aparece o nome.",
  },
  ContagemRegressiva: {
    nome: "Contagem",
    tecnico: "Countdown",
    descricao: "Dias, horas, minutos e segundos até o evento, com botão de agenda.",
    comoFunciona: "Quando o horário passa, troca pelo texto que você escrever. O botão gera o convite de calendário.",
  },
  LinhaDoTempo: {
    nome: "Linha do tempo",
    tecnico: "Timeline",
    descricao: "Marcos em sequência: a história da empresa ou as etapas de um programa.",
    comoFunciona: "Até 10 marcos, cada um com quando, o que aconteceu e um detalhe.",
  },
  Planos: {
    nome: "Planos",
    tecnico: "Pricing",
    descricao: "Até 3 planos lado a lado, com preço, o que inclui e um botão.",
    comoFunciona: "Marque um como destaque. Os botões vão para o mesmo destino.",
  },
  FaixaAnimada: {
    nome: "Faixa em movimento",
    tecnico: "Marquee",
    descricao: "Frases curtas correndo pela tela, para dar ritmo entre seções.",
    comoFunciona: "Uma frase por linha. Quem pede menos movimento no celular vê a faixa parada.",
  },
  SecaoLivre: {
    nome: "Seção livre",
    tecnico: "Código próprio",
    descricao: "HTML, CSS e JavaScript próprios, dentro do container e do fundo do padrão.",
    comoFunciona: "Comece por um modelo ou use Copiar guia para IA. O CSS vale só nesta seção e o JavaScript roda só na página publicada.",
  },
  LiveAbertura: {
    nome: "Abertura Live",
    tecnico: "Hero premium",
    descricao: "Primeira tela inteira: pessoa recortada, palavra grande atrás, título com linha verde, números e contagem regressiva.",
    comoFunciona: "Ocupa a tela toda junto com a Faixa Live. A foto precisa ser um recorte sem fundo (PNG). Use com o cabeçalho padrão escondido.",
  },
  LiveFaixa: {
    nome: "Faixa Live",
    tecnico: "Marquee com ícones",
    descricao: "Nomes das soluções correndo sem parar, cada um seguido do seu ícone.",
    comoFunciona: "Vai logo abaixo da Abertura Live. Escolha o ícone de cada nome; quem pede menos movimento vê a faixa parada.",
  },
  LiveSobre: {
    nome: "Sobre Live",
    tecnico: "About + stats",
    descricao: "Título grande, foto recortada, texto, um cartão de número e o mapa do Brasil com Minas acesa.",
    comoFunciona: "No título, *asteriscos* deixam verde e _sublinhados_ deixam cinza. Clicar no mapa aproxima a cidade do evento.",
  },
  LiveBeneficios: {
    nome: "Benefícios Live",
    tecnico: "Bento grid",
    descricao: "Mosaico de cartões (escuro, verde ou com foto) com uma frase solta e um texto com botão.",
    comoFunciona: "Até 8 cartões. A frase e o texto lateral entram sozinhos entre eles.",
  },
  LivePalestrantes: {
    nome: "Palestrantes Live",
    tecnico: "Speakers carousel",
    descricao: "O carrossel do iGreen Live: fotos recortadas na frente de um painel verde, correndo sem parar.",
    comoFunciona: "Na página publicada para no mouse e aceita arrastar. O selo conta as pessoas sozinho.",
  },
  LiveAgenda: {
    nome: "Programação Live",
    tecnico: "Agenda",
    descricao: "Horários da noite com título, texto, etiquetas e uma foto de cada momento.",
    comoFunciona: "O primeiro horário fica em destaque. Fotos horizontais ficam melhores.",
  },
  LiveNumeros: {
    nome: "Números Live",
    tecnico: "Big stats",
    descricao: "Linhas com números grandes que contam ao aparecer.",
    comoFunciona: "Escreva o número como deve aparecer (+500 mil, 15%). Use só número que a empresa já divulga.",
  },
  LiveLocal: {
    nome: "Local Live",
    tecnico: "Venue + map",
    descricao: "Mapa ilustrado do entorno, data, horário, endereço e facilidades.",
    comoFunciona: "O mapa é um desenho fixo; os nomes no mapa e o endereço são editáveis. Abrir no mapa busca o endereço no Google Maps.",
  },
  LiveVideo: {
    nome: "Vídeo Live",
    tecnico: "Video + testimonials",
    descricao: "Vídeo na linha inteira com brilho ambiente atrás e depoimentos embaixo.",
    comoFunciona: "A prévia roda muda em loop; o clique toca o vídeo completo (.mp4).",
  },
  LivePerguntas: {
    nome: "Perguntas Live",
    tecnico: "FAQ",
    descricao: "Perguntas em cartões abríveis e um bloco de ajuda com WhatsApp.",
    comoFunciona: "A primeira pergunta já vem aberta. O WhatsApp é o do licenciado, se vier no link.",
  },
  LiveInscricao: {
    nome: "Inscrição Live",
    tecnico: "Signup card",
    descricao: "Cartão grande com a proposta, o formulário em destaque e o letreiro na base.",
    comoFunciona: "Grava a inscrição como o formulário padrão (nome, WhatsApp, e-mail e cidade, com aceite).",
  },
  LiveRodape: {
    nome: "Rodapé Live",
    tecnico: "Footer premium",
    descricao: "Frase de despedida, menu, data e local, contato e botões, sobre a névoa verde.",
    comoFunciona: "Use no fim da página, com o rodapé padrão escondido.",
  },
};

export const rotulo = (id: PecaId) => `${CATALOGO[id].nome} · ${CATALOGO[id].tecnico}`;

/** Grupos da gaveta de peças, na ordem em que uma página costuma ser montada. */
export const GRUPOS: Record<string, { title: string; components: PecaId[] }> = {
  live: {
    title: "Kit iGreen Live (visual premium)",
    components: ["LiveAbertura", "LiveFaixa", "LiveSobre", "LiveBeneficios", "LivePalestrantes", "LiveAgenda", "LiveNumeros", "LiveLocal", "LiveVideo", "LivePerguntas", "LiveInscricao", "LiveRodape"],
  },
  topo: { title: "Topo da página", components: ["Abertura"] },
  explicar: { title: "Explicar e mostrar", components: ["ItensNumerados", "Cards", "Numeros", "Video", "LinhaDoTempo"] },
  evento: { title: "Sobre o evento", components: ["Local", "ContagemRegressiva", "Agenda", "Pessoas"] },
  confianca: { title: "Prova e confiança", components: ["Depoimentos", "Galeria", "LogosParceiros"] },
  conversao: { title: "Contato e inscrição", components: ["Inscricao", "ContatoConsultor", "Planos"] },
  fechamento: { title: "Fechamento", components: ["PerguntasFrequentes", "ChamadaFinal"] },
  movimento: { title: "Movimento", components: ["FaixaAnimada"] },
  especiais: { title: "Especiais e código livre", components: ["Simulador", "SecaoLivre"] },
};

/** Acha a peça pelo nome técnico ou pelo rótulo exibido na gaveta. */
export function pecaPorNome(name: string): PecaId | undefined {
  if (name in CATALOGO) return name as PecaId;
  return (Object.keys(CATALOGO) as PecaId[]).find((id) => rotulo(id) === name);
}
