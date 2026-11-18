import { useState, type FormEvent } from "react";
import { createPage } from "../lib/pages";
import { slugify } from "../lib/slug";
import { go } from "../router";
import { TEMPLATES, type TemplateId } from "../templates";
import { Icone } from "../ui/Icone";
import { Miniatura } from "./Miniatura";
import { Shell } from "./Shell";

/** Criar página: nome, depois escolher um modelo pronto ou começar do zero, vendo a prévia. */
export function NovaPagina() {
  const [nome, setNome] = useState("");
  const [modelo, setModelo] = useState<TemplateId>("evento");
  const [erro, setErro] = useState("");
  const escolhido = TEMPLATES.find((t) => t.id === modelo) ?? TEMPLATES[0];

  function criar(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setErro("Dê um nome para a página.");
      return;
    }
    const p = createPage(modelo, nome.trim());
    go(`/editar/${p.id}`);
  }

  return (
    <Shell ativo="paginas">
      <form className="nv" onSubmit={criar}>
        <div className="app-row">
          <div>
            <h1 className="app-h1">Nova página</h1>
            <p className="app-muted">Dê um nome e escolha como começar. Dá para mudar tudo depois.</p>
          </div>
          <div className="app-actions">
            <a className="bt" href="#/">
              Cancelar
            </a>
            <button className="bt bt-pri" type="submit">
              Criar e abrir o editor
              <Icone nome="chevDir" tamanho={16} />
            </button>
          </div>
        </div>

        <div className="nv-grade">
          <section className="app-card nv-esq">
            <label className="cp-campo">
              <span>Nome da página</span>
              <input
                className="in"
                autoFocus
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setErro("");
                }}
                placeholder="Ex.: Encontro iGreen Recife com Ana"
              />
            </label>
            <p className="nv-endereco">
              Endereço: <code>/p/{nome.trim() ? slugify(nome) : "…"}</code>
            </p>
            {erro && <p className="app-err">{erro}</p>}

            <span className="cp-rotulo">Como quer começar?</span>
            <div className="nv-modelos" role="radiogroup" aria-label="Modelo da página">
              {TEMPLATES.map((t) => (
                <label key={t.id} className="nv-modelo" data-on={modelo === t.id}>
                  <input type="radio" name="modelo" value={t.id} checked={modelo === t.id} onChange={() => setModelo(t.id)} />
                  <span className="nv-tile">{t.id === "branco" ? <Icone nome="mais" tamanho={28} /> : <Miniatura data={t.data} />}</span>
                  <strong>{t.nome}</strong>
                </label>
              ))}
            </div>
          </section>

          <section className="app-card nv-dir" aria-live="polite">
            <div className="nv-dir-topo">
              <span className="cp-rotulo">Prévia: {escolhido.nome}</span>
              <span className="chip">{escolhido.data.content.length} seções</span>
            </div>
            <div className="nv-previa">
              {escolhido.id === "branco" ? (
                <div className="nv-previa-zero">
                  <Icone nome="pecas" tamanho={28} />
                  Página vazia: você monta arrastando as peças.
                </div>
              ) : (
                <Miniatura data={escolhido.data} />
              )}
            </div>
            <p className="app-muted">{escolhido.descricao}</p>
          </section>
        </div>
      </form>
    </Shell>
  );
}
