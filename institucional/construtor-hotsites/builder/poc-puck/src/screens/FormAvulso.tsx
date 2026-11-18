import { useEffect, useMemo } from "react";
import { Fluxo } from "../form/Fluxo";
import "../form/form.css";
import "./publicas.css";
import { origemDoAcesso, registrarUmaVez } from "../lib/eventos";
import { getFormulario } from "../lib/formularios";
import { dataPorExtenso, infoEvento, lugarCurto, motivoFechada, statusVisivel } from "../lib/meta";
import { metaDe } from "../lib/painel";
import { vagasDaPagina } from "../lib/pagina";
import { getPageBySlug, type PageRecord } from "../lib/pages";
import { parsePersona } from "../lib/persona";
import { listSubmissions, ocupaVaga } from "../lib/submissions";

/** A página usa o kit iGreen Live? Então o formulário avulso também fica escuro. */
export const temaDa = (p: PageRecord | undefined) => (p?.data.content?.some((c) => c.type.startsWith("Live")) ? "live" : "claro");

/** Endereço próprio do formulário (3.8): #/f/<id>?pagina=<endereço da página>. */
export function FormAvulso({ id, query }: { id: string; query: URLSearchParams }) {
  const form = useMemo(() => getFormulario(id), [id]);
  const page = useMemo(() => getPageBySlug(query.get("pagina") ?? ""), [query]);
  const persona = useMemo(() => parsePersona(query), [query]);
  const origem = origemDoAcesso(query, document.referrer, persona.ref);
  const ev = page ? infoEvento(page.data) : {};
  const status = page ? statusVisivel(metaDe(page)) : "publicada";
  const fechada = page
    ? motivoFechada(status, listSubmissions({ pageId: page.id }).filter(ocupaVaga).length, vagasDaPagina(page), form?.regras.listaEspera)
    : undefined;

  useEffect(() => {
    document.title = page ? `Inscrição · ${page.title}` : form?.nome ?? "Formulário";
    if (page && status === "publicada") {
      registrarUmaVez({ pageId: page.id, tipo: "visita", origem, ref: persona.ref });
      registrarUmaVez({ pageId: page.id, tipo: "form-inicio", origem, ref: persona.ref });
    }
  }, [page, form, status, origem, persona.ref]);

  return (
    <div className="fm-pagina fa" data-tema={temaDa(page)}>
      <main className="fa-caixa">
        <header className="fa-topo">
          <span className="fa-marca">iGreen</span>
          {page ? (
            <>
              <h1 className="fm-titulo">{page.title}</h1>
              <p className="fa-quando">{[dataPorExtenso(ev.inicio), lugarCurto(ev)].filter(Boolean).join(" · ")}</p>
            </>
          ) : (
            <h1 className="fm-titulo">{form?.nome ?? "Formulário"}</h1>
          )}
        </header>
        {!form ? (
          <p className="fm-texto">Formulário não encontrado. O endereço pode ter mudado.</p>
        ) : fechada === "encerrada" || fechada === "esgotada" ? (
          <p className="fm-alerta">{fechada === "esgotada" ? "As vagas acabaram." : "As inscrições estão encerradas."}</p>
        ) : (
          <Fluxo
            form={form}
            completo
            ctx={{
              page,
              pageId: page?.id ?? "",
              pageSlug: page?.slug ?? "",
              ref: persona.ref,
              origem,
              // Sem página ligada, ou página fora do ar: só prévia (não há onde guardar a inscrição).
              previa: !page || fechada === "rascunho" || fechada === "agendada",
            }}
          />
        )}
      </main>
      {page && (
        <a className="fa-voltar" href={`#/p/${page.slug}`}>
          Ver a página do evento
        </a>
      )}
    </div>
  );
}
