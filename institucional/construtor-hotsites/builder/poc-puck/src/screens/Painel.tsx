import { useRef, useState, type ChangeEvent } from "react";
import { download } from "../lib/download";
import {
  deletePage,
  duplicatePage,
  exportPage,
  importPage,
  listPages,
  resetToExamples,
  type PageRecord,
} from "../lib/pages";
import { listSubmissions } from "../lib/submissions";
import { go } from "../router";
import { TEMPLATES } from "../templates";
import { Icone } from "../ui/Icone";
import { Menu } from "../ui/Menu";
import { Miniatura } from "./Miniatura";
import { Shell } from "./Shell";

const nomeModelo = (id: string) => TEMPLATES.find((t) => t.id === id)?.nome ?? id;
const quando = (ts: number) => new Date(ts).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

/** Primeira tela: as páginas que já existem, com prévia, e o botão para criar uma nova. */
export function Painel() {
  const [pages, setPages] = useState<PageRecord[]>(() => listPages());
  const [erro, setErro] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const refresh = () => setPages(listPages());

  async function importar(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      importPage(await f.text());
      setErro("");
      refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Arquivo inválido");
    }
  }

  return (
    <Shell ativo="paginas">
      <div className="app-row">
        <div>
          <h1 className="app-h1">Páginas</h1>
          <p className="app-muted">
            {pages.length} {pages.length === 1 ? "página" : "páginas"} de evento e campanha
          </p>
        </div>
        <div className="app-actions">
          <button className="bt" onClick={() => fileRef.current?.click()}>
            <Icone nome="enviar" />
            Importar arquivo
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={importar} />
          <a className="bt bt-pri" href="#/nova">
            <Icone nome="mais" />
            Nova página
          </a>
        </div>
      </div>
      {erro && <p className="app-err">{erro}</p>}

      {pages.length === 0 ? (
        <section className="app-card app-empty">
          <h2 className="app-h2">Nenhuma página ainda</h2>
          <p className="app-muted">Crie a primeira a partir de um modelo ou do zero.</p>
          <div className="app-actions">
            <a className="bt bt-pri" href="#/nova">
              <Icone nome="mais" />
              Nova página
            </a>
            <button
              className="bt"
              onClick={() => {
                resetToExamples();
                refresh();
              }}
            >
              Trazer os exemplos de volta
            </button>
          </div>
        </section>
      ) : (
        <ul className="pg-lista">
          {pages.map((p) => {
            const inscritos = listSubmissions({ pageId: p.id }).length;
            return (
              <li key={p.id} className="pg">
                {/* Atalho de mouse; o botão Editar abaixo é o caminho por teclado. */}
                <div className="pg-thumb" title={`Editar ${p.title}`} onClick={() => go(`/editar/${p.id}`)}>
                  <Miniatura data={p.data} />
                </div>
                <div className="pg-corpo">
                  <div className="pg-titulo">
                    <strong>{p.title}</strong>
                    <Menu
                      rotulo={`Mais ações de ${p.title}`}
                      classeGatilho="bt bt-ic bt-p"
                      lado="dir"
                      gatilho={() => <Icone nome="pontos" />}
                    >
                      {(fechar) => (
                        <div className="mn-lista" onClick={fechar}>
                          <button
                            onClick={() => {
                              duplicatePage(p.id);
                              refresh();
                            }}
                          >
                            <Icone nome="copiar" />
                            Duplicar
                          </button>
                          <button onClick={() => download(`${p.slug}.json`, exportPage(p.id), "application/json")}>
                            <Icone nome="baixar" />
                            Exportar arquivo
                          </button>
                          <button
                            className="mn-perigo"
                            onClick={() => {
                              if (confirm(`Apagar "${p.title}"? Não dá para desfazer.`)) {
                                deletePage(p.id);
                                refresh();
                              }
                            }}
                          >
                            <Icone nome="lixo" />
                            Apagar
                          </button>
                        </div>
                      )}
                    </Menu>
                  </div>
                  <span className="pg-slug">/p/{p.slug}</span>
                  <div className="pg-meta">
                    <span className="chip">{nomeModelo(p.templateId)}</span>
                    <span className="chip">
                      <Icone nome="pessoas" tamanho={13} />
                      {inscritos} {inscritos === 1 ? "inscrição" : "inscrições"}
                    </span>
                    <span className="pg-quando">{quando(p.updatedAt)}</span>
                  </div>
                </div>
                <div className="pg-acoes">
                  <a className="bt bt-pri bt-p" href={`#/editar/${p.id}`}>
                    Editar
                  </a>
                  <a className="bt bt-p" href={`#/p/${p.slug}`}>
                    Ver
                    <Icone nome="externo" tamanho={14} />
                  </a>
                  <a className="bt bt-p" href={`#/convite/${p.slug}`} title="Link de licenciado">
                    <Icone nome="link" tamanho={15} />
                    Link
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pages.length > 0 && (
        <p className="app-muted app-rodape">
          POC: as páginas ficam neste navegador.{" "}
          <button
            className="app-linkbtn"
            onClick={() => {
              if (confirm("Apagar todas as páginas e voltar para os exemplos?")) {
                resetToExamples();
                refresh();
              }
            }}
          >
            Restaurar exemplos
          </button>
        </p>
      )}
    </Shell>
  );
}
