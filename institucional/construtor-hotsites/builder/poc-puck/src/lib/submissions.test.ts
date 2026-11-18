import { beforeEach, describe, expect, it } from "vitest";
import { addSubmission, clearSubmissions, listSubmissions, toCSV } from "./submissions";

beforeEach(() => localStorage.clear());

describe("inscrições", () => {
  it("grava e filtra por página", () => {
    addSubmission({ pageId: "pa", pageSlug: "a", nome: "Ana", whats: "31999999999", email: "a@a.com" });
    addSubmission({ pageId: "pb", pageSlug: "b", nome: "Bia", whats: "31988888888", email: "b@b.com", ref: "LIC1" });
    expect(listSubmissions()).toHaveLength(2);
    expect(listSubmissions({ pageId: "pb" })).toEqual([expect.objectContaining({ nome: "Bia", ref: "LIC1" })]);
    clearSubmissions();
    expect(listSubmissions()).toHaveLength(0);
  });
  it("sobrevive a dado corrompido", () => {
    localStorage.setItem("poc-hotsite:subs", "{quebrado");
    expect(listSubmissions()).toEqual([]);
  });
});

describe("toCSV", () => {
  it("começa com BOM, usa ponto e vírgula e escapa aspas, ; e quebra de linha", () => {
    const csv = toCSV([
      { id: "1", pageId: "p", pageSlug: "x", createdAt: 0, nome: 'a;"b"', whats: "1", email: "e", cidade: "linha1\nlinha2" },
    ]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv.split("\n")[0]).toContain("Nome;WhatsApp;E-mail");
    expect(csv).toContain('"a;""b"""');
    expect(csv).toContain('"linha1\nlinha2"');
  });
});

describe("inscrições presas à página, não ao endereço", () => {
  it("filtra pelo id da página", () => {
    addSubmission({ pageId: "p1", pageSlug: "evento", nome: "Ana", whats: "1", email: "a@a.com" });
    addSubmission({ pageId: "p2", pageSlug: "evento", nome: "Bia", whats: "1", email: "b@b.com" });
    expect(listSubmissions({ pageId: "p1" }).map((s) => s.nome)).toEqual(["Ana"]);
  });
});

describe("CSV para o Excel", () => {
  it("WhatsApp sai como texto legível e célula com fórmula é neutralizada", () => {
    const csv = toCSV([{ id: "1", pageId: "p", pageSlug: "x", createdAt: 0, nome: "=1+1", whats: "5531999990000", email: "e" }]);
    expect(csv).toContain("55 (31) 99999-0000");
    expect(csv).toContain("'=1+1");
  });
});
