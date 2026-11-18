import type { PageRecord } from "./pages";
import { readJSON } from "./store";

/**
 * Lê uma página já salva sem passar por pages.ts. O formulário roda dentro das peças, e as peças
 * são importadas pelos modelos de página (templates → config → peças): importar pages.ts daqui
 * fecharia um ciclo e quebraria a ordem de carregamento.
 */
export function paginaSalva(id: string): PageRecord | undefined {
  const v = readJSON<PageRecord[]>("poc-hotsite:pages");
  return Array.isArray(v) ? v.find((p) => p && p.id === id) : undefined;
}
