import { describe, expect, it } from "vitest";
import { gerarIcs, googleAgendaUrl, partesNumero, formatarNumero, tempoRestante } from "./tempo";

describe("tempoRestante", () => {
  it("separa dias, horas, minutos e segundos", () => {
    const agora = new Date("2026-12-10T10:00:00");
    const alvo = new Date("2026-12-11T12:03:04");
    expect(tempoRestante(alvo, agora)).toEqual({ acabou: false, dias: 1, horas: 2, minutos: 3, segundos: 4 });
  });
  it("data passada ou inválida conta como acabou", () => {
    expect(tempoRestante(new Date("2020-01-01"), new Date("2026-01-01")).acabou).toBe(true);
    expect(tempoRestante(new Date("nada"), new Date()).acabou).toBe(true);
  });
});

describe("gerarIcs", () => {
  const ics = gerarIcs({
    titulo: "Live, MOB; lançamento",
    inicio: new Date(Date.UTC(2026, 9, 20, 22, 0, 0)),
    duracaoMin: 90,
    local: "YouTube",
    uid: "abc",
  });
  it("monta um evento de calendário válido, com fim = início + duração", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("DTSTART:20261020T220000Z");
    expect(ics).toContain("DTEND:20261020T233000Z");
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
  });
  it("escapa vírgula e ponto e vírgula no título", () => {
    expect(ics).toContain("SUMMARY:Live\\, MOB\\; lançamento");
  });
  it("link do Google Agenda leva as mesmas datas", () => {
    const url = googleAgendaUrl({ titulo: "Live", inicio: new Date(Date.UTC(2026, 9, 20, 22)), duracaoMin: 60 });
    expect(url).toContain("dates=20261020T220000Z%2F20261020T230000Z");
  });
});

describe("números que contam", () => {
  it("separa prefixo, valor e sufixo, com milhar brasileiro", () => {
    expect(partesNumero("+500")).toEqual({ prefixo: "+", valor: 500, sufixo: "", decimais: 0 });
    expect(partesNumero("R$ 1.500")).toEqual({ prefixo: "R$ ", valor: 1500, sufixo: "", decimais: 0 });
    expect(partesNumero("4%")).toEqual({ prefixo: "", valor: 4, sufixo: "%", decimais: 0 });
    expect(partesNumero("2,5 mil")).toEqual({ prefixo: "", valor: 2.5, sufixo: " mil", decimais: 1 });
  });
  it("texto sem número não anima", () => {
    expect(partesNumero("muitos")).toBeNull();
  });
  it("formata de volta no padrão brasileiro", () => {
    expect(formatarNumero({ prefixo: "R$ ", valor: 1500, sufixo: "", decimais: 0 }, 1500)).toBe("R$ 1.500");
    expect(formatarNumero({ prefixo: "", valor: 2.5, sufixo: " mil", decimais: 1 }, 1.25)).toBe("1,3 mil");
  });
});
