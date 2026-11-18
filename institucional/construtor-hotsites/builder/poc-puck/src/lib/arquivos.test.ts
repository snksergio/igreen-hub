import { describe, expect, it } from "vitest";
import { nomeDeArquivo, resolverArquivos } from "./arquivos";

const PNG = "data:image/webp;base64,UklGR";
const arquivos = [
  { nome: "palco.webp", src: PNG },
  { nome: "regulamento.pdf", src: "data:application/pdf;base64,JVBER" },
];

describe("resolverArquivos", () => {
  it("troca arquivo:NOME no HTML e no CSS pelo arquivo de verdade", () => {
    expect(resolverArquivos('<img src="arquivo:palco.webp" alt="Palco">', arquivos)).toBe(`<img src="${PNG}" alt="Palco">`);
    expect(resolverArquivos(".x{background:url(arquivo:palco.webp)}", arquivos)).toBe(`.x{background:url(${PNG})}`);
    expect(resolverArquivos('<a href="arquivo:regulamento.pdf" download>', arquivos)).toContain("data:application/pdf");
  });
  it("nome que não existe fica como está (aparece quebrado e dá para perceber)", () => {
    expect(resolverArquivos('<img src="arquivo:outro.webp">', arquivos)).toBe('<img src="arquivo:outro.webp">');
  });
});

describe("nomeDeArquivo", () => {
  it("vira nome curto, sem acento nem espaço, e não repete", () => {
    expect(nomeDeArquivo("Foto do Palco Principal.PNG", "webp", [])).toBe("foto-do-palco-principal.webp");
    expect(nomeDeArquivo("palco.jpg", "webp", ["palco.webp"])).toBe("palco-2.webp");
  });
});
