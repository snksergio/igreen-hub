import type { Data } from "@puckeditor/core";
import { safeImg } from "./imagens";
import { applyTokens } from "./persona";

/*
 * SEO e dados estruturados gerados a partir das peças da página.
 * O marketing não precisa saber schema.org: a peça Data e local vira Event,
 * Pessoas vira performer, Inscrição vira oferta gratuita, Perguntas vira FAQPage.
 *
 * Regras do Google conferidas em 2026-11-17:
 * - Event: obrigatórios name, startDate e location (Place com address).
 *   Evento só online não ganha destaque na Pesquisa. Brasil/português atendido.
 * - FAQ: o destaque saiu da Pesquisa em maio de 2026. A marcação fica para
 *   outros leitores (interpretação: IAs e outros buscadores).
 */

type Bloco = { type: string; props: Record<string, any> };
/** Onde o aviso se resolve: um campo da Página, uma peça (e o campo dela) ou uma peça a inserir. */
export type Alvo =
  | { tipo: "pagina"; campo: string }
  | { tipo: "peca"; id: string; campo?: string }
  | { tipo: "inserir"; peca: string; posicao: number };
export type Aviso = { nivel: "ok" | "atencao" | "info"; texto: string; acao?: string; alvo?: Alvo };
export type Seo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  image?: string;
  jsonLd: Record<string, unknown>[];
  avisos: Aviso[];
};

export const ORGANIZACAO = { "@type": "Organization", name: "iGreen Energy", url: "https://www.igreenenergy.com.br" };
const FUSO = "-03:00"; // horário de Brasília (sem horário de verão desde 2019)
const LIMITE_TITULO = 60;
const LIMITE_DESCRICAO = 160;

export function resumir(texto: string, max = LIMITE_DESCRICAO): string {
  const t = (texto ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const corte = t.slice(0, max);
  return `${corte.slice(0, corte.lastIndexOf(" ") > 0 ? corte.lastIndexOf(" ") : max).trim()}…`;
}

/** "2026-12-12T19:00" + minutos → ISO com fuso de Brasília. */
function iso(local: string | undefined, somarMin = 0): string | undefined {
  const m = (local ?? "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!m) return undefined;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) + somarMin * 60000);
  return `${d.toISOString().slice(0, 19)}${FUSO}`;
}

const limpo = (s: unknown) => applyTokens(typeof s === "string" ? s : "", {});

export function montarSeo({ data, url, nomePagina }: { data: Data; url: string; nomePagina: string }): Seo {
  const blocos = (data.content ?? []) as Bloco[];
  const root = ((data.root as { props?: Record<string, any> })?.props ?? {}) as Record<string, any>;
  const um = (t: string) => blocos.find((b) => b.type === t)?.props;
  const todos = (t: string) => blocos.filter((b) => b.type === t);

  // As peças do kit Live usam os mesmos nomes de campo das equivalentes.
  const abertura = um("Abertura") ?? um("LiveAbertura");
  const local = um("Local") ?? um("LiveLocal");
  const contagem = um("ContagemRegressiva");
  const pessoas = um("Pessoas") ?? um("LivePalestrantes");
  const inscricao = um("Inscricao") ?? um("LiveInscricao");
  const perguntas = um("PerguntasFrequentes") ?? um("LivePerguntas");
  const avisos: Aviso[] = [];

  const title = limpo(root.titulo) || limpo(abertura?.titulo) || nomePagina;
  const description = resumir(limpo(root.descricao) || limpo(abertura?.subtitulo));
  const robots = root.indexar === false ? "noindex, nofollow" : "index, follow";

  const imgCandidata = safeImg(root.imagemCompartilhamento) ?? safeImg(abertura?.imagemUrl);
  const image = imgCandidata && !imgCandidata.startsWith("data:") ? imgCandidata : undefined;

  // ---------- Dados estruturados ----------
  const jsonLd: Record<string, unknown>[] = [
    { "@context": "https://schema.org", ...ORGANIZACAO },
    { "@context": "https://schema.org", "@type": "WebPage", name: title, description: description || undefined, url, inLanguage: "pt-BR" },
  ];

  const inicioLocal: string | undefined = local?.inicio || contagem?.quando;
  const duracao = Number(local?.duracaoMin || contagem?.duracaoMin || 60);
  const startDate = iso(inicioLocal);
  if (startDate) {
    const presencial = Boolean(local);
    const linkOnline = typeof contagem?.local === "string" && /^https?:\/\//.test(contagem.local) ? contagem.local : url;
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "Event",
      name: title,
      description: description || undefined,
      startDate,
      endDate: iso(inicioLocal, duracao),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: presencial
        ? "https://schema.org/OfflineEventAttendanceMode"
        : "https://schema.org/OnlineEventAttendanceMode",
      location: presencial
        ? {
            "@type": "Place",
            name: local?.nomeLocal || undefined,
            address: {
              "@type": "PostalAddress",
              streetAddress: local?.endereco || undefined,
              addressLocality: local?.cidade || undefined,
              addressRegion: local?.uf || undefined,
              addressCountry: "BR",
            },
          }
        : { "@type": "VirtualLocation", url: linkOnline },
      image: image ? [image] : undefined,
      organizer: ORGANIZACAO,
      performer: (pessoas?.pessoas ?? [])
        .filter((p: { nome?: string }) => p?.nome)
        .map((p: { nome: string }) => ({ "@type": "Person", name: p.nome })),
      offers: inscricao
        ? { "@type": "Offer", price: 0, priceCurrency: "BRL", availability: "https://schema.org/InStock", url: `${url}#inscricao` }
        : undefined,
    });
  }

  const qas = (perguntas?.itens ?? []).filter((q: { pergunta?: string; resposta?: string }) => q?.pergunta && q?.resposta);
  if (qas.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: qas.map((q: { pergunta: string; resposta: string }) => ({
        "@type": "Question",
        name: q.pergunta,
        acceptedAnswer: { "@type": "Answer", text: q.resposta },
      })),
    });
  }

  // ---------- Checklist para quem edita ----------
  // Cada pendência diz onde se resolve (alvo) e o texto do botão (acao). O que já está certo não tem botão.
  const pg = (campo: string): Alvo => ({ tipo: "pagina", campo });
  const pc = (b: Record<string, any> | undefined, campo?: string): Alvo | undefined =>
    b?.id ? { tipo: "peca", id: b.id, campo } : undefined;

  if (!limpo(root.titulo))
    avisos.push({ nivel: "atencao", texto: "Sem título da página: o Google vai usar o título da Abertura.", acao: "Adicionar", alvo: pg("titulo") });
  else if (title.length > LIMITE_TITULO)
    avisos.push({
      nivel: "atencao",
      texto: `Título com ${title.length} caracteres: o Google corta perto de ${LIMITE_TITULO}.`,
      acao: "Ajustar",
      alvo: pg("titulo"),
    });
  else avisos.push({ nivel: "ok", texto: "Título da página no tamanho certo." });

  if (!limpo(root.descricao))
    avisos.push({
      nivel: "atencao",
      texto: "Sem descrição: o Google pode montar uma com qualquer trecho da página.",
      acao: "Adicionar",
      alvo: pg("descricao"),
    });
  else if (limpo(root.descricao).length > LIMITE_DESCRICAO)
    avisos.push({ nivel: "atencao", texto: `Descrição longa: será cortada em ${LIMITE_DESCRICAO} caracteres.`, acao: "Ajustar", alvo: pg("descricao") });
  else avisos.push({ nivel: "ok", texto: "Descrição no tamanho certo." });

  const qtdAbertura = todos("Abertura").length;
  if (qtdAbertura === 0)
    avisos.push({
      nivel: "atencao",
      texto: "Sem Abertura, a página fica sem título principal (h1).",
      acao: "Adicionar Abertura",
      alvo: { tipo: "inserir", peca: "Abertura", posicao: 0 },
    });
  else if (qtdAbertura > 1)
    avisos.push({
      nivel: "atencao",
      texto: "Mais de uma Abertura: use só uma por página (um h1).",
      acao: "Ver a segunda",
      alvo: pc(todos("Abertura")[1].props),
    });
  else avisos.push({ nivel: "ok", texto: "Um único título principal (h1)." });

  if (abertura?.imagemUrl && !limpo(abertura?.imagemAlt))
    avisos.push({
      nivel: "atencao",
      texto: "A imagem da Abertura está sem descrição (texto alternativo).",
      acao: "Adicionar",
      alvo: pc(abertura, "imagemAlt"),
    });

  if (imgCandidata?.startsWith("data:"))
    avisos.push({
      nivel: "atencao",
      texto: "Imagem de compartilhamento enviada do computador: no MVP ela precisa estar hospedada para aparecer no WhatsApp e nas redes.",
      acao: "Ajustar",
      alvo: pg("imagemCompartilhamento"),
    });
  else if (!image)
    avisos.push({ nivel: "atencao", texto: "Sem imagem para quando o link for compartilhado.", acao: "Adicionar", alvo: pg("imagemCompartilhamento") });
  else avisos.push({ nivel: "ok", texto: "Imagem de compartilhamento definida." });

  if (local && !iso(local.inicio))
    avisos.push({ nivel: "atencao", texto: "Data e local sem data e hora: o evento não vai para o Google.", acao: "Ajustar", alvo: pc(local, "inicio") });
  if (local && iso(local.inicio) && (!local.endereco || !local.cidade))
    avisos.push({
      nivel: "atencao",
      texto: "Endereço incompleto: o Google pede rua e cidade para mostrar o evento.",
      acao: "Ajustar",
      alvo: pc(local, local.endereco ? "cidade" : "endereco"),
    });
  if (startDate && local && local.endereco && local.cidade)
    avisos.push({ nivel: "ok", texto: "Evento marcado para o Google: nome, data, local e organizador." });
  if (startDate && !local)
    avisos.push({ nivel: "info", texto: "Evento só online: o Google não dá destaque de evento, mas o dado fica legível para outros buscadores e IAs." });

  if (qas.length)
    avisos.push({ nivel: "info", texto: "Perguntas marcadas como FAQ. O Google parou de mostrar o destaque de FAQ em maio de 2026; a marcação segue útil para IAs." });

  if (robots.startsWith("noindex"))
    avisos.push({ nivel: "atencao", texto: "Página escondida do Google (não indexar).", acao: "Ajustar", alvo: pg("indexar") });

  const abImg = safeImg(abertura?.imagemUrl);
  if (abImg && !abImg.startsWith("data:"))
    avisos.push({
      nivel: "info",
      texto: "A imagem da Abertura vem por link e não passa pela compressão automática. Ideal abaixo de 200 KB: uma foto de 3 MB leva o carregamento a 40 s no 4G lento.",
      acao: "Ver imagem",
      alvo: pc(abertura, "imagemUrl"),
    });

  // Seção livre: o código é de quem escreveu, então a conferência olha o básico.
  for (const livre of todos("SecaoLivre")) {
    const html = String(livre.props.html ?? "");
    if (/<h1[\s>]/i.test(html))
      avisos.push({
        nivel: "atencao",
        texto: "Seção livre com <h1>: a página deve ter um só título principal. Use <h2>.",
        acao: "Ajustar",
        alvo: pc(livre.props, "html"),
      });
    if (/<img(?![^>]*\balt=)[^>]*>/i.test(html))
      avisos.push({ nivel: "atencao", texto: "Seção livre com imagem sem alt (texto alternativo).", acao: "Ajustar", alvo: pc(livre.props, "html") });
    if (String(livre.props.js ?? "").trim())
      avisos.push({
        nivel: "info",
        texto: "Seção livre com JavaScript próprio: confira desempenho e erros no console antes de publicar.",
        acao: "Ver código",
        alvo: pc(livre.props, "js"),
      });
    const externos = String(livre.props.externos ?? "")
      .split("\n")
      .filter((l) => /^https:\/\/\S+$/i.test(l.trim())).length;
    if (externos)
      avisos.push({
        nivel: "info",
        texto: `Seção livre carrega ${externos === 1 ? "1 arquivo" : `${externos} arquivos`} de fora (biblioteca ou fonte): a página fica mais lenta. Mantenha só o que for indispensável.`,
        acao: "Ver bibliotecas",
        alvo: pc(livre.props, "externos"),
      });
  }

  return { title, description, canonical: url, robots, image, jsonLd: limparVazios(jsonLd), avisos };
}

/** Tira chaves undefined e listas vazias, para o JSON-LD sair limpo. */
function limparVazios<T>(v: T): T {
  return JSON.parse(JSON.stringify(v, (_k, val) => (Array.isArray(val) && val.length === 0 ? undefined : val)));
}
