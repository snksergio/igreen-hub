import type { Config } from "@puckeditor/core";
import { Render } from "@puckeditor/core/rsc";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { gerarHtmlEstatico } from "../../../lib/estatico";
import { montarSeo } from "../../../lib/seo";
import { numeroParaContar, partesValor, rico } from "../../../live/ui";
import { TEMPLATES } from "../../../templates";
import { config } from "../../config";
import { PageContext } from "../../context";
import { isoBrasilia, partesData } from "./comum";

const modelo = TEMPLATES.find((t) => t.id === "premium")!;

function renderiza(mode: "publico" | "editor" = "publico") {
  return renderToStaticMarkup(
    <PageContext.Provider value={{ persona: {}, mode, pageId: "p", pageSlug: "igreen-live-bh" }}>
      <Render config={config as unknown as Config} data={modelo.data} />
    </PageContext.Provider>
  );
}

describe("kit iGreen Live: utilitários", () => {
  it("texto com destaque: *verde*, _cinza_ e **negrito**, sem aceitar HTML", () => {
    const html = renderToStaticMarkup(<p>{rico("Mais que *uma noite* para _todos_ com **você** <b>x</b>")}</p>);
    expect(html).toContain('<span class="lima">uma noite</span>');
    expect(html).toContain('<span class="apagado">todos</span>');
    expect(html).toContain("<strong>você</strong>");
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
  });

  it("separa o número para contar e pinta só o sinal de verde", () => {
    expect(partesValor("+500 mil")).toEqual({ antes: "+", numero: "500", depois: " mil", depoisVerde: false });
    expect(partesValor("15%")).toMatchObject({ numero: "15", depois: "%", depoisVerde: true });
    expect(partesValor("3.000+")).toMatchObject({ numero: "3.000", depoisVerde: true });
    expect(numeroParaContar("3.000")).toBe(3000);
    expect(numeroParaContar("2,5")).toBeUndefined();
  });

  it("data do campo vira ISO de Brasília e dia/mês curtos", () => {
    expect(isoBrasilia("2026-12-12T19:00")).toBe("2026-12-12T19:00:00-03:00");
    expect(isoBrasilia("")).toBeUndefined();
    expect(partesData("2026-12-12T19:00")).toMatchObject({ dia: "12", mes: "dez" });
  });
});

describe("kit iGreen Live: modelo Evento iGreen Live", () => {
  it("usa as 12 peças do kit e esconde o cabeçalho e o rodapé padrão", () => {
    expect(modelo.data.content.map((b) => b.type)).toEqual([
      "LiveAbertura", "LiveFaixa", "LiveSobre", "LiveBeneficios", "LivePalestrantes", "LiveAgenda",
      "LiveNumeros", "LiveLocal", "LiveVideo", "LivePerguntas", "LiveInscricao", "LiveRodape",
    ]);
    const html = renderiza();
    expect(html).not.toContain("hs-top");
    expect(html).not.toContain("hs-foot");
  });

  it("tem as âncoras do menu e o formulário de inscrição", () => {
    const html = renderiza();
    for (const id of ["programacao", "palestrantes", "local", "perguntas", "inscricao"]) expect(html).toContain(`id="${id}"`);
    expect(html).toContain("data-form-inscricao");
  });

  it("carrossel desenha a lista 3 vezes e só a primeira é lida por leitores de tela", () => {
    const html = renderiza();
    expect(html.match(/<article class="pessoa"/g)).toHaveLength(24);
    expect(html.match(/<article class="pessoa" aria-hidden="true"/g)).toHaveLength(16);
  });

  it("marca os comportamentos para o script do kit e os números para contar", () => {
    const html = renderiza();
    for (const nome of ["carrossel", "particulas", "mapa", "video", "rodape", "revelar contar relogio"]) expect(html).toContain(`data-lv="${nome}"`);
    expect(html).toContain('data-lv-conta="3000"');
    expect(html).toContain('data-alvo="2026-12-12T19:00:00-03:00"');
  });

  it("o SEO lê o evento, o local e as perguntas das peças Live", () => {
    const seo = montarSeo({ data: modelo.data, url: "https://exemplo.com/igreen-live-bh", nomePagina: "iGreen Live BH" });
    const tipos = seo.jsonLd.map((j) => j["@type"]);
    expect(tipos).toContain("Event");
    expect(tipos).toContain("FAQPage");
    const evento = seo.jsonLd.find((j) => j["@type"] === "Event") as { location: { name: string; address: { addressLocality: string } } };
    expect(evento.location.name).toBe("Expominas · Auditório 2");
    expect(evento.location.address.addressLocality).toBe("Belo Horizonte");
  });

  // O CSS (?inline) chega vazio no Vitest; a conferência dele é no npm run build:estatico.
  it("o HTML estático leva a fonte e o script do kit", () => {
    const { html } = gerarHtmlEstatico(
      { id: "p", slug: "igreen-live-bh", title: "iGreen Live BH", templateId: "premium", data: modelo.data, updatedAt: 0 },
      "https://exemplo.com/igreen-live-bh"
    );
    expect(html).toContain("Instrument+Sans");
    expect(html).toContain("window.igreenLive");
  });
});
