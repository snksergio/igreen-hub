import { formularioDaPagina, getFormulario, type Formulario } from "./formularios";
import { metaDe } from "./painel";
import type { PageRecord } from "./pages";
import { listSubmissions, ocupaVaga } from "./submissions";

/* Junta o que várias telas perguntam sobre uma página: formulário, vagas e inscritos. */

export const formularioDe = (p: PageRecord): Formulario | undefined => getFormulario(formularioDaPagina(p.data));

/** Vagas da página: as da configuração da página; sem elas, as do formulário; sem nenhuma, sem limite. */
export function vagasDaPagina(p: PageRecord): number | null {
  const daPagina = Number(metaDe(p).vagas) || 0;
  if (daPagina > 0) return daPagina;
  const doForm = Number(formularioDe(p)?.regras.vagas) || 0;
  return doForm > 0 ? doForm : null;
}

/** Inscritos que ocupam vaga, por página (uma leitura só para o painel inteiro). */
export function contarInscritos(): Map<string, number> {
  const m = new Map<string, number>();
  for (const s of listSubmissions()) if (ocupaVaga(s)) m.set(s.pageId, (m.get(s.pageId) ?? 0) + 1);
  return m;
}
