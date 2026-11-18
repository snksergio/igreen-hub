import type { Evento } from "../../lib/eventos";
import type { Formulario } from "../../lib/formularios";
import type { LinkLicenciado } from "../../lib/links";
import type { InfoEvento, MetaPagina, StatusVisivel } from "../../lib/meta";
import type { PageRecord } from "../../lib/pages";
import type { Submission } from "../../lib/submissions";

/** Tudo o que as abas do espaço da página usam, lido uma vez. */
export type Espaco = {
  page: PageRecord;
  meta: MetaPagina;
  status: StatusVisivel;
  evento: InfoEvento;
  form: Formulario | undefined;
  subs: Submission[];
  inscritos: number;
  vagas: number | null;
  eventos: Evento[];
  links: LinkLicenciado[];
  recarregar: () => void;
};
