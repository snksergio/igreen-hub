import { describe, expect, it } from "vitest";
import { manterTopoTravado } from "./locks";

const b = (id: string, travado = false) => ({ type: "X", props: { id, ...(travado ? { travado: true } : {}) } });
const ids = (c: { props: { id: string } }[] | null) => c?.map((x) => x.props.id) ?? null;

describe("manterTopoTravado", () => {
  const prev = [b("abertura", true), b("local", true), b("agenda")];
  it("peça solta acima da abertura travada desce para depois das travadas do topo", () => {
    expect(ids(manterTopoTravado(prev, [b("cards"), b("abertura", true), b("local", true), b("agenda")]))).toEqual([
      "abertura",
      "local",
      "cards",
      "agenda",
    ]);
  });
  it("ordem válida não muda nada", () => {
    expect(manterTopoTravado(prev, [b("abertura", true), b("local", true), b("cards"), b("agenda")])).toBeNull();
  });
  it("travadas do topo voltam à ordem original", () => {
    expect(ids(manterTopoTravado(prev, [b("local", true), b("abertura", true), b("agenda")]))).toEqual([
      "abertura",
      "local",
      "agenda",
    ]);
  });
});
