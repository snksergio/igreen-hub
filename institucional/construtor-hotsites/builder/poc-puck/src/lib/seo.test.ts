import { describe, expect, it } from "vitest";
import { formatarQuando } from "./tempo";
import { montarSeo, resumir } from "./seo";

const URL_PAG = "https://eventos.exemplo.com.br/encontro-bh";

const pagina = (root: Record<string, unknown>, content: { type: string; props: Record<string, unknown> }[]) =>
  ({ root: { props: root }, content: content.map((c, i) => ({ ...c, props: { id: `x${i}`, ...c.props } })) }) as never;

const evento = pagina({ titulo: "Encontro iGreen BH", descricao: "Uma noite para conhecer o ecossistema." }, [
  { type: "Abertura", props: { titulo: "Uma noite", subtitulo: "Sub", imagemUrl: "https://x.com/h.jpg", imagemAlt: "Palco" } },
  {
    type: "Local",
    props: { inicio: "2026-12-12T19:00", duracaoMin: 180, nomeLocal: "Espaço X", endereco: "Av. A, 10", cidade: "Belo Horizonte", uf: "MG" },
  },
  { type: "Pessoas", props: { pessoas: [{ nome: "Thiago" }, { nome: "Ana" }] } },
  { type: "Inscricao", props: {} },
  { type: "PerguntasFrequentes", props: { itens: [{ pergunta: "É grátis?", resposta: "Sim." }] } },
]);

describe("montarSeo", () => {
  const seo = montarSeo({ data: evento, url: URL_PAG, nomePagina: "Encontro" });
  const tipo = (t: string) => seo.jsonLd.find((j) => j["@type"] === t) as Record<string, any>;

  it("título, descrição, canônico e indexação", () => {
    expect(seo.title).toBe("Encontro iGreen BH");
    expect(seo.description).toBe("Uma noite para conhecer o ecossistema.");
    expect(seo.canonical).toBe(URL_PAG);
    expect(seo.robots).toBe("index, follow");
    expect(seo.image).toBe("https://x.com/h.jpg");
  });

  it("evento presencial com o que o Google exige: nome, início, local com endereço", () => {
    const ev = tipo("Event");
    expect(ev.name).toBe("Encontro iGreen BH");
    expect(ev.startDate).toBe("2026-12-12T19:00:00-03:00");
    expect(ev.endDate).toBe("2026-12-12T22:00:00-03:00");
    expect(ev.eventAttendanceMode).toBe("https://schema.org/OfflineEventAttendanceMode");
    expect(ev.location).toMatchObject({
      "@type": "Place",
      name: "Espaço X",
      address: { "@type": "PostalAddress", streetAddress: "Av. A, 10", addressLocality: "Belo Horizonte", addressRegion: "MG", addressCountry: "BR" },
    });
    expect(ev.performer).toEqual([{ "@type": "Person", name: "Thiago" }, { "@type": "Person", name: "Ana" }]);
    expect(ev.offers).toMatchObject({ price: 0, priceCurrency: "BRL", url: `${URL_PAG}#inscricao` });
    expect(ev.organizer.name).toBe("iGreen Energy");
  });

  it("perguntas viram FAQPage", () => {
    expect(tipo("FAQPage").mainEntity[0]).toMatchObject({ name: "É grátis?", acceptedAnswer: { text: "Sim." } });
  });

  it("sem descrição usa o subtítulo da Abertura; noindex quando pedido", () => {
    const s = montarSeo({ data: pagina({ titulo: "T", indexar: false }, [{ type: "Abertura", props: { subtitulo: "Do hero" } }]), url: URL_PAG, nomePagina: "T" });
    expect(s.description).toBe("Do hero");
    expect(s.robots).toBe("noindex, nofollow");
  });

  it("imagem enviada (data:) não vira imagem de compartilhamento e gera aviso", () => {
    const s = montarSeo({
      data: pagina({ titulo: "T" }, [{ type: "Abertura", props: { imagemUrl: "data:image/webp;base64,AAAA" } }]),
      url: URL_PAG,
      nomePagina: "T",
    });
    expect(s.image).toBeUndefined();
    expect(s.avisos.some((a) => a.nivel === "atencao" && /hospedada/.test(a.texto))).toBe(true);
  });

  it("sem Abertura ou com duas, avisa sobre o título principal (h1)", () => {
    const sem = montarSeo({ data: pagina({ titulo: "T" }, []), url: URL_PAG, nomePagina: "T" });
    const duas = montarSeo({ data: pagina({ titulo: "T" }, [{ type: "Abertura", props: {} }, { type: "Abertura", props: {} }]), url: URL_PAG, nomePagina: "T" });
    expect(sem.avisos.some((a) => /h1/.test(a.texto) && a.nivel === "atencao")).toBe(true);
    expect(duas.avisos.some((a) => /só uma/.test(a.texto))).toBe(true);
  });

  it("live só online vira evento online, com aviso de que o Google não destaca", () => {
    const s = montarSeo({
      data: pagina({ titulo: "Live" }, [{ type: "ContagemRegressiva", props: { quando: "2026-12-04T20:00", duracaoMin: 90, local: "https://youtube.com/live/x" } }]),
      url: URL_PAG,
      nomePagina: "Live",
    });
    const ev = s.jsonLd.find((j) => j["@type"] === "Event") as Record<string, any>;
    expect(ev.eventAttendanceMode).toBe("https://schema.org/OnlineEventAttendanceMode");
    expect(ev.location).toEqual({ "@type": "VirtualLocation", url: "https://youtube.com/live/x" });
    expect(s.avisos.some((a) => /só online/.test(a.texto))).toBe(true);
  });

  it("{nome} vira iGreen no título para o Google", () => {
    const s = montarSeo({ data: pagina({ titulo: "Convite de {nome}" }, []), url: URL_PAG, nomePagina: "T" });
    expect(s.title).toBe("Convite de iGreen");
  });
});

describe("resumir e formatarQuando", () => {
  it("corta descrição longa no limite de palavra", () => {
    const r = resumir("palavra ".repeat(40), 30);
    expect(r.length).toBeLessThanOrEqual(31);
    expect(r.endsWith("…")).toBe(true);
  });
  it("mostra data e horário por extenso", () => {
    // 12/12/2026 é sábado (o exemplo antigo dizia "sexta-feira": a data calculada evita esse erro)
    expect(formatarQuando("2026-12-12T19:00", 180)).toEqual({ data: "sábado, 12 de dezembro", hora: "19h às 22h" });
    expect(formatarQuando("2026-12-12T19:30", 60).hora).toBe("19h30 às 20h30");
    expect(formatarQuando("", 60)).toEqual({ data: "", hora: "" });
  });
});

describe("seção livre na conferência", () => {
  it("avisa <h1>, imagem sem alt e JavaScript próprio", () => {
    const s = montarSeo({
      data: pagina({ titulo: "T" }, [
        { type: "Abertura", props: {} },
        { type: "SecaoLivre", props: { html: '<h1>Outro</h1><img src="x.jpg">', js: "console.log(1)" } },
      ]),
      url: URL_PAG,
      nomePagina: "T",
    });
    const textos = s.avisos.map((a) => a.texto).join(" | ");
    expect(textos).toMatch(/Seção livre com <h1>/);
    expect(textos).toMatch(/imagem sem alt/);
    expect(textos).toMatch(/JavaScript próprio/);
  });

  it("avisa biblioteca externa e leva ao campo dela", () => {
    const s = montarSeo({
      data: pagina({ titulo: "T" }, [
        { type: "Abertura", props: {} },
        { type: "SecaoLivre", props: { id: "L1", html: "<p>x</p>", externos: "https://a.com/x.js\nhttps://a.com/y.css" } },
      ]),
      url: URL_PAG,
      nomePagina: "T",
    });
    const a = s.avisos.find((x) => /carrega 2 arquivos de fora/.test(x.texto));
    expect(a?.alvo).toEqual({ tipo: "peca", id: "L1", campo: "externos" });
  });
});

describe("cada aviso leva ao lugar de ajustar", () => {
  const aviso = (s: ReturnType<typeof montarSeo>, re: RegExp) => s.avisos.find((a) => re.test(a.texto));

  it("sem descrição e sem título levam aos campos da Página", () => {
    const s = montarSeo({ data: pagina({}, [{ type: "Abertura", props: { titulo: "X" } }]), url: URL_PAG, nomePagina: "T" });
    expect(aviso(s, /Sem descrição/)).toMatchObject({ acao: "Adicionar", alvo: { tipo: "pagina", campo: "descricao" } });
    expect(aviso(s, /Sem título/)).toMatchObject({ acao: "Adicionar", alvo: { tipo: "pagina", campo: "titulo" } });
  });

  it("imagem sem alt leva ao campo da Abertura certa", () => {
    const s = montarSeo({
      data: pagina({ titulo: "T" }, [{ type: "Abertura", props: { imagemUrl: "https://x.com/a.jpg", imagemAlt: "" } }]),
      url: URL_PAG,
      nomePagina: "T",
    });
    expect(aviso(s, /sem descrição \(texto alternativo\)/)).toMatchObject({ alvo: { tipo: "peca", id: "x0", campo: "imagemAlt" } });
  });

  it("sem Abertura oferece adicionar uma no topo", () => {
    const s = montarSeo({ data: pagina({ titulo: "T" }, []), url: URL_PAG, nomePagina: "T" });
    expect(aviso(s, /h1/)).toMatchObject({ acao: "Adicionar Abertura", alvo: { tipo: "inserir", peca: "Abertura", posicao: 0 } });
  });

  it("aviso que já está certo não tem botão", () => {
    const s = montarSeo({ data: evento, url: URL_PAG, nomePagina: "Encontro" });
    expect(s.avisos.filter((a) => a.nivel === "ok").every((a) => !a.alvo)).toBe(true);
  });
});
