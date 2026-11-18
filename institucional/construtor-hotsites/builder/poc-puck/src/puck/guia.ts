/*
 * Guia de padrões da Seção livre: o mesmo conteúdo aparece para quem edita (no campo)
 * e vira o texto "mini skill" que se cola numa IA para ela gerar uma seção no padrão.
 * O teste guia.test.ts garante que toda classe e todo token daqui existem no hotsite.css.
 */

export const TOKENS: { token: string; uso: string }[] = [
  { token: "--verde", uso: "destaque, botão principal, números" },
  { token: "--verde-escuro", uso: "destaque sobre fundo claro (contraste)" },
  { token: "--escuro", uso: "preto da marca" },
  { token: "--escuro-2", uso: "fundo escuro de seção" },
  { token: "--claro", uso: "fundo claro de seção" },
  { token: "--branco", uso: "fundo de card" },
  { token: "--texto", uso: "texto principal" },
  { token: "--muted", uso: "texto de apoio" },
  { token: "--linha", uso: "bordas e divisórias" },
  { token: "--raio", uso: "canto arredondado (14px)" },
];

export const CLASSES: { classe: string; uso: string }[] = [
  { classe: "hs-wrap", uso: "container: já aplicado, largura máxima 1040px e centralizado" },
  { classe: "hs-eyebrow", uso: "chamada curta acima do título" },
  { classe: "hs-h2", uso: "título da seção" },
  { classe: "hs-h3", uso: "subtítulo, título de card" },
  { classe: "hs-lead", uso: "parágrafo de destaque" },
  { classe: "hs-muted", uso: "texto de apoio" },
  { classe: "hs-btn", uso: "botão principal (use em <a> ou <button>)" },
  { classe: "hs-link", uso: "link de texto" },
  { classe: "hs-grid", uso: "grade responsiva (cards lado a lado, um embaixo do outro no celular)" },
  { classe: "hs-card", uso: "card com borda, fundo e respiro" },
];

export const MOVIMENTO: { codigo: string; uso: string }[] = [
  { codigo: 'data-r="up" style="--i:0"', uso: "sobe ao entrar na tela; --i é a ordem (0, 1, 2…)" },
  { codigo: 'data-r="left"', uso: "vem da esquerda (listas, linha do tempo)" },
  { codigo: 'data-r="zoom"', uso: "cresce um pouco (imagens, botões, destaques)" },
  { codigo: 'data-r="fade"', uso: "só aparece (logos, faixas)" },
  { codigo: 'data-conta="+500"', uso: "número que conta de 0 até o valor (escreva o mesmo valor dentro)" },
];

type Modelo = { nome: string; html: string; css: string; js: string };

/** Pontos de partida: mostram o padrão na prática. Quem edita pode apagar tudo e escrever do zero. */
export const MODELOS_LIVRE: Record<string, Modelo> = {
  "titulo-texto": {
    nome: "Título, texto e botão",
    html: `<p class="hs-eyebrow" data-r="up" style="--i:0">Chamada curta</p>
<h2 class="hs-h2" data-r="up" style="--i:1">Título da seção</h2>
<p class="hs-lead" data-r="up" style="--i:2">Um parágrafo que explica a ideia em duas linhas.</p>
<a class="hs-btn" href="#inscricao" data-r="zoom" style="--i:3">Quero participar</a>`,
    css: "",
    js: "",
  },
  grade: {
    nome: "Grade de cards",
    html: `<h2 class="hs-h2" data-r="up" style="--i:0">Três motivos para estar lá</h2>
<div class="hs-grid">
  <article class="hs-card" data-r="up" style="--i:1">
    <h3 class="hs-h3">Motivo 1</h3>
    <p>Uma frase curta.</p>
  </article>
  <article class="hs-card" data-r="up" style="--i:2">
    <h3 class="hs-h3">Motivo 2</h3>
    <p>Uma frase curta.</p>
  </article>
  <article class="hs-card" data-r="up" style="--i:3">
    <h3 class="hs-h3">Motivo 3</h3>
    <p>Uma frase curta.</p>
  </article>
</div>`,
    css: "",
    js: "",
  },
  destaque: {
    nome: "Número em destaque (com CSS próprio)",
    html: `<div class="destaque" data-r="zoom" style="--i:0">
  <span class="destaque__numero" data-conta="+500">+500</span>
  <p class="hs-lead">frase que explica o número</p>
</div>`,
    css: `.destaque {
  display: grid;
  gap: 8px;
  justify-items: center;
  padding: 40px 24px;
  border-radius: var(--raio);
  background: var(--escuro-2);
  color: var(--claro);
  text-align: center;
}
.destaque__numero {
  font-size: clamp(48px, 10vw, 96px);
  font-weight: 800;
  color: var(--verde);
}`,
    js: "",
  },
  abas: {
    nome: "Abas (com JavaScript)",
    html: `<h2 class="hs-h2" data-r="up" style="--i:0">Escolha seu modelo</h2>
<div class="abas" role="tablist" aria-label="Modelos">
  <button class="aba" role="tab" aria-selected="true" data-aba="1">Mobi</button>
  <button class="aba" role="tab" aria-selected="false" data-aba="2">Mobi Fast</button>
</div>
<div class="painel" role="tabpanel" data-painel="1">
  <p class="hs-lead">7 kW AC. Até 5 carros por dia.</p>
</div>
<div class="painel" role="tabpanel" data-painel="2" hidden>
  <p class="hs-lead">7 + 40 kW AC + DC. Até 30 carros por dia.</p>
</div>`,
    css: `.abas {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.aba {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid var(--linha);
  background: var(--branco);
  font: inherit;
  cursor: pointer;
}
.aba[aria-selected="true"] {
  background: var(--verde);
  border-color: var(--verde);
  color: var(--escuro);
  font-weight: 700;
}`,
    js: `// "secao" é o <section> desta peça. Procure só dentro dela.
secao.querySelectorAll(".aba").forEach((botao) => {
  botao.addEventListener("click", () => {
    secao.querySelectorAll(".aba").forEach((b) => b.setAttribute("aria-selected", String(b === botao)));
    secao.querySelectorAll(".painel").forEach((p) => (p.hidden = p.dataset.painel !== botao.dataset.aba));
  });
});`,
  },
  branco: { nome: "Em branco", html: "", css: "", js: "" },
};

/** Texto para colar numa IA ("mini skill"): ela passa a entender estrutura, padrões e movimento. */
export function guiaParaIA(pedido = ""): string {
  const exemplo = MODELOS_LIVRE.grade.html;
  return `# Seção livre — hotsite de evento iGreen (guia para IA)

Você vai escrever UMA seção de um hotsite de evento da iGreen Energy, em português do Brasil.
Entregue UM arquivo .html completo, com o CSS num <style> e o JavaScript num <script> dentro dele: quem edita importa esse arquivo direto na seção. (Se preferir, responda com três blocos de código: HTML, CSS e JavaScript.)
${pedido ? `\nPedido: ${pedido}\n` : ""}
## Onde o seu código entra
O sistema separa o arquivo sozinho: o conteúdo do <body> vira o HTML da seção, o <style> vira o CSS e o <script> vira o JavaScript. Depois envolve o HTML assim:

\`\`\`html
<section id="livre-ID" class="hs-sec hs-livre" data-fundo="claro|escuro">
  <div class="hs-wrap"> …SEU HTML… </div>
</section>
\`\`\`

- No <body>, comece direto pelo conteúdo: sem outra <section> envolvendo tudo e sem container próprio (o .hs-wrap já existe).
- O CSS vale só dentro desta seção (o sistema prefixa com #livre-ID). :root, html e body passam a valer só para a seção. Use classes próprias simples, como .destaque. @keyframes funcionam normalmente.
- O fundo (claro ou escuro) é escolhido num campo. Não pinte o fundo da seção inteira no CSS e não use height: 100vh.
- O JavaScript roda na página publicada (e numa prévia do editor) e recebe a variável \`secao\` (o <section>). Procure elementos com secao.querySelector(...). DOMContentLoaded e window.onload funcionam. Prefira addEventListener a onclick="…" no HTML.
- Sem document.write e sem import/módulos. Evite bibliotecas externas; se for indispensável (ex.: GSAP), use https de CDN com versão fixa, como https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js. Tailwind pelo CDN não é aceito: escreva CSS.

## SEO e acessibilidade (obrigatório)
- Nunca use <h1>: a página já tem um, na Abertura. Título da seção em <h2 class="hs-h2">, subtítulos em <h3 class="hs-h3">.
- Toda <img> com alt descrevendo a imagem, loading="lazy" e proporção definida (width/height ou aspect-ratio).
- Botões e links com texto que diz o que fazem. Alvo de toque com pelo menos 44px de altura.
- Texto de verdade no HTML (nada de texto dentro de imagem): é o que o Google e as IAs leem.
- Evite fontes externas e scripts de terceiros: a página precisa continuar leve e já usa a fonte da marca.

## Imagens e arquivos enviados
- Quem edita envia imagens e PDFs para a seção. Cada um ganha um nome curto e é usado assim:
  - imagem: <img src="arquivo:palco.webp" alt="descreva a imagem" loading="lazy">
  - fundo no CSS: background-image: url(arquivo:fundo.webp);
  - PDF para baixar: <a class="hs-link" href="arquivo:regulamento.pdf" download>Baixar o regulamento</a>
- Use só nomes da lista de arquivos que vier junto com o pedido. Se faltar uma imagem, use arquivo:imagem-1.webp e diga qual imagem a pessoa precisa enviar com esse nome.
- Se você entregar o .html com imagens próprias, use caminhos simples (img/palco.jpg) e liste os arquivos: a pessoa envia todos junto com o .html e o sistema troca cada caminho pelo arquivo enviado.
- Não use link de imagem de outros sites: imagem enviada é comprimida, link de fora não.

## Cores e medidas: use os tokens, não valores soltos
${TOKENS.map((t) => `- var(${t.token}): ${t.uso}`).join("\n")}

## Classes prontas
${CLASSES.map((c) => `- .${c.classe}: ${c.uso}`).join("\n")}

## Movimento (entrada ao rolar a página)
${MOVIMENTO.map((m) => `- ${m.codigo}: ${m.uso}`).join("\n")}
- O sistema desliga tudo para quem pede movimento reduzido. Se criar animação própria em CSS, coloque-a dentro de @media (prefers-reduced-motion: no-preference) e evite animação infinita chamativa.

## Exemplo no padrão
\`\`\`html
${exemplo}
\`\`\`
`;
}
