import { useEffect, useMemo } from "react";
import "../form/form.css";
import "./publicas.css";
import { listarEventos, resumir } from "../lib/eventos";
import { linkPorRef } from "../lib/links";
import { dataPorExtenso, infoEvento } from "../lib/meta";
import { getPageBySlug } from "../lib/pages";
import { listSubmissions } from "../lib/submissions";
import { temaDa } from "./FormAvulso";

/**
 * O que o licenciado vê (2.5 e decisão 0.2): só os números do link dele.
 * Nenhum nome, telefone ou e-mail de quem se inscreveu aparece aqui.
 */
export function Numeros({ slug, ref_ }: { slug: string; ref_: string }) {
  const page = useMemo(() => getPageBySlug(slug), [slug]);
  const link = page ? linkPorRef(page.id, ref_) : undefined;
  const ref = ref_.toUpperCase();
  const r = useMemo(() => {
    if (!page) return null;
    const ev = listarEventos(page.id).filter((e) => e.ref?.toUpperCase() === ref);
    const subs = listSubmissions({ pageId: page.id }).filter((s) => s.ref?.toUpperCase() === ref);
    return resumir(ev, subs, 7);
  }, [page, ref]);
  useEffect(() => {
    document.title = "Seus números";
  }, []);

  if (!page || !r)
    return (
      <div className="fm-pagina fa">
        <main className="fa-caixa">
          <h1 className="fm-titulo">Link não encontrado</h1>
        </main>
      </div>
    );

  const max = Math.max(1, ...r.porDia.map((d) => d.inscricoes));
  return (
    <div className="fm-pagina fa" data-tema={temaDa(page)}>
      <main className="fa-caixa nu">
        <header className="fa-topo">
          <span className="fa-marca">iGreen · seus números</span>
          <h1 className="fm-titulo">{link ? `Olá, ${link.nome.split(" ")[0]}!` : `Código ${ref}`}</h1>
          <p className="fa-quando">
            {page.title}
            {infoEvento(page.data).inicio && ` · ${dataPorExtenso(infoEvento(page.data).inicio)}`}
          </p>
        </header>
        <dl className="nu-grade">
          <div>
            <dt>Visitas pelo seu link</dt>
            <dd>{r.visitas.toLocaleString("pt-BR")}</dd>
          </div>
          <div>
            <dt>Inscrições</dt>
            <dd>{r.inscricoes.toLocaleString("pt-BR")}</dd>
          </div>
          <div>
            <dt>Conversão</dt>
            <dd>{r.conversao.toLocaleString("pt-BR")}%</dd>
          </div>
          <div>
            <dt>Presentes no evento</dt>
            <dd>{r.presentes.toLocaleString("pt-BR")}</dd>
          </div>
        </dl>
        <section className="nu-dias" aria-label="Inscrições nos últimos 7 dias">
          <h2>Inscrições nos últimos 7 dias</h2>
          <ol>
            {r.porDia.map((d) => (
              <li key={d.dia}>
                <span>{new Date(`${d.dia}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" })}</span>
                <i style={{ width: `${(d.inscricoes / max) * 100}%` }} />
                <b>{d.inscricoes}</b>
              </li>
            ))}
          </ol>
        </section>
        <p className="fm-ajuda">Você vê só os números do seu link. Nomes e contatos de quem se inscreveu ficam com a equipe de marketing.</p>
      </main>
    </div>
  );
}
