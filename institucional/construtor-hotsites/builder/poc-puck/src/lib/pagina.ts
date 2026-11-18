import { formularioDaPagina, getFormulario, type Formulario } from "./formularios";
import { motivoFechada, statusVisivel, type StatusVisivel } from "./meta";
import { metaDe } from "./painel";
import { deBrasilia } from "./tempo";
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

export type Estado = {
  status: StatusVisivel;
  inscricoes: { fechada?: "rascunho" | "agendada" | "encerrada" | "esgotada"; inscritos: number; vagas: number | null };
};

/**
 * Se a página aceita inscrição agora (2.7): status, datas da página e do formulário e vagas.
 * Com lista de espera, vaga cheia continua aberta ("esgotada", mas a pessoa entra na fila).
 */
export function estadoInscricoes(p: PageRecord, agora = new Date()): Estado {
  const status = statusVisivel(metaDe(p), agora);
  const form = formularioDe(p);
  const inscritos = listSubmissions({ pageId: p.id }).filter(ocupaVaga).length;
  const vagas = vagasDaPagina(p);
  let fechada = motivoFechada(status, inscritos, vagas, Boolean(form?.regras.listaEspera));
  const fimDoForm = deBrasilia(form?.regras.encerraEm);
  if (!fechada && fimDoForm && fimDoForm <= agora) fechada = "encerrada";
  if (!fechada && vagas && inscritos >= vagas) fechada = "esgotada";
  return { status, inscricoes: { fechada, inscritos, vagas } };
}

/** Inscritos que ocupam vaga, por página (uma leitura só para o painel inteiro). */
export function contarInscritos(): Map<string, number> {
  const m = new Map<string, number>();
  for (const s of listSubmissions()) if (ocupaVaga(s)) m.set(s.pageId, (m.get(s.pageId) ?? 0) + 1);
  return m;
}
