import { useMemo, useState } from "react";
import { download } from "../lib/download";
import { listPages } from "../lib/pages";
import { clearSubmissions, listSubmissions, toCSV } from "../lib/submissions";
import { Shell } from "./Shell";

export function Inscricoes() {
  const [filtro, setFiltro] = useState("");
  const [versao, setVersao] = useState(0);
  const pages = useMemo(() => listPages(), [versao]);
  const subs = useMemo(() => listSubmissions({ pageId: filtro || undefined }), [filtro, versao]);
  const selecionada = pages.find((p) => p.id === filtro);
  const nomePagina = (pageId: string, slugNaHora: string) => {
    const p = pages.find((x) => x.id === pageId);
    return p ? p.slug : `${slugNaHora} (apagada)`;
  };

  return (
    <Shell ativo="inscricoes">
      <section className="app-card">
        <div className="app-row">
          <h1>Inscrições ({subs.length})</h1>
          <div className="app-actions">
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtrar por página">
              <option value="">Todas as páginas</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (/p/{p.slug})
                </option>
              ))}
            </select>
            <button
              className="app-btn"
              disabled={!subs.length}
              onClick={() =>
                download(`inscricoes${selecionada ? `-${selecionada.slug}` : ""}.csv`, toCSV(subs), "text/csv;charset=utf-8")
              }
            >
              Exportar planilha (CSV)
            </button>
            <button
              className="app-btn app-btn--danger"
              disabled={!listSubmissions().length}
              onClick={() => {
                if (confirm("Apagar todas as inscrições deste navegador? Não dá para desfazer.")) {
                  clearSubmissions();
                  setVersao((n) => n + 1);
                }
              }}
            >
              Apagar todas
            </button>
          </div>
        </div>
        <p className="app-muted">Na POC as inscrições ficam só neste navegador.</p>
        {subs.length === 0 ? (
          <p className="app-muted">Nenhuma inscrição ainda. Abra uma página pelo botão Ver e envie o formulário.</p>
        ) : (
          <div className="app-table-wrap">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Página</th>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>WhatsApp</th>
                  <th>E-mail</th>
                  <th>Cidade</th>
                  <th>Interesse</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id}>
                    <td>{new Date(s.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
                    <td>{nomePagina(s.pageId, s.pageSlug)}</td>
                    <td>{s.ref ?? "—"}</td>
                    <td>{s.nome}</td>
                    <td>{s.whats}</td>
                    <td>{s.email}</td>
                    <td>{s.cidade ?? "—"}</td>
                    <td>{s.interesse ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Shell>
  );
}
