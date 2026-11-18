import { beforeEach, describe, expect, it, vi } from "vitest";
import { addImagem, AMOSTRAS, listImagens, removeImagem, safeImg } from "./imagens";
import { _limparMemoria } from "./store";

beforeEach(() => {
  localStorage.clear();
  _limparMemoria();
  vi.restoreAllMocks();
});

const PNG = "data:image/png;base64,iVBORw0KGgo=";

describe("safeImg", () => {
  it("aceita https e imagem embutida (data:image)", () => {
    expect(safeImg("https://a.com/x.jpg")).toBe("https://a.com/x.jpg");
    expect(safeImg(PNG)).toBe(PNG);
    expect(safeImg("data:image/webp;base64,UklGR")).toBe("data:image/webp;base64,UklGR");
  });
  it("recusa javascript:, html embutido e vazio", () => {
    expect(safeImg("javascript:alert(1)")).toBeUndefined();
    expect(safeImg("data:text/html;base64,PHNjcmlwdD4=")).toBeUndefined();
    expect(safeImg("")).toBeUndefined();
  });
});

describe("biblioteca de imagens", () => {
  it("guarda a imagem enviada e não repete a mesma", () => {
    const a = addImagem("foto.png", PNG);
    const b = addImagem("foto-de-novo.png", PNG);
    expect(a?.id).toBeTruthy();
    expect(b?.id).toBe(a?.id);
    expect(listImagens()).toHaveLength(1);
  });
  it("remove", () => {
    const a = addImagem("foto.png", PNG)!;
    removeImagem(a.id);
    expect(listImagens()).toHaveLength(0);
  });
  it("sem espaço no navegador, avisa devolvendo null", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("cheio", "QuotaExceededError");
    });
    expect(addImagem("grande.png", PNG)).toBeNull();
  });
  it("traz imagens de exemplo da iGreen", () => {
    expect(AMOSTRAS.length).toBeGreaterThan(0);
    expect(AMOSTRAS.every((i) => safeImg(i.src))).toBe(true);
  });
});
