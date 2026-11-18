import { useMemo, useState } from "react";
import { apagarFormulario, camposNaPagina, cobra, criarFormulario, duplicarFormulario, listarFormularios, MODELOS_FORM, paginasQueUsam } from "../../lib/formularios";
import { listPages } from "../../lib/pages";
import { listSubmissions } from "../../lib/submissions";
import { go } from "../../router";
import { Icone } from "../../ui/Icone";
import { Menu } from "../../ui/Menu";
import { Shell } from "../Shell";
import "./construtor.css";

const quando = (t: number) => new Date(t).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

/** Biblioteca de formulários (3.1): cada um guardado à parte, usado por várias páginas. */
export function Formularios() {
  const [versao, setVersao] = useState(0);
  const [novo, setNovo] = useState(false);
  const forms = useMemo(() => listarFormularios(), [versao]);
  const pages = useMemo(() => listPages(), [versao]);
  const subs = useMemo(() => listSubmissions(), [versao]);

  function criar(modelo: string) {
    const f = criarFormulario(modelo);
    go(`/formulario/${f.id}`);
  }

  return (
    <Shell ativo="formularios">
      <div className="app-row">
        <div>
          <h1 className="app-h1">Formulários</h1>
          <p className="app-muted">Monte uma vez e use em quantas páginas quiser. As respostas ficam separadas por página.</p>
        </div>
        <button className="bt bt-pri" onClick={() => setNovo((n) => !n)} aria-expanded={novo}>
          <Icone nome="mais" />
          Novo formulário
        </button>
      </div>

      {novo && (
        <section className="fl-modelos" aria-label="Começar de um modelo">
          {MODELOS_FORM.map((m) => (
            <button key={m.id} className="fl-modelo" onClick={() => criar(m.id)}>
              <Icone nome="formulario" tamanho={20} />
              <strong>{m.nome}</strong>
              <span>{m.descricao}</span>
            </button>
          ))}
        </section>
      )}

      {forms.length === 0 ? (
        <section className="app-card app-empty pn-vazio">
          <h2 className="app-h2">Nenhum formulário ainda</h2>
          <p className="app-muted">Comece por um modelo: inscrição simples, com ingresso ou pré-cadastro de live.</p>
        </section>
      ) : (
        <ul className="fl-lista">
          {forms.map((f) => {
            const usam = paginasQueUsam(f.id, pages);
            const respostas = subs.filter((s) => s.formId === f.id).length;
            return (
              <li key={f.id} className="fl" onClick={() => go(`/formulario/${f.id}`)}>
                <div className="fl-topo">
                  <span className="fl-ic">
                    <Icone nome="formulario" tamanho={18} />
                  </span>
                  <span onClick={(e) => e.stopPropagation()}>
                    <Menu rotulo={`Mais ações de ${f.nome}`} classeGatilho="bt bt-ic bt-p pg-mais" lado="dir" gatilho={() => <Icone nome="pontos" />}>
                      {(fechar) => (
                        <div className="mn-lista" onClick={fechar}>
                          <button
                            onClick={() => {
                              duplicarFormulario(f.id);
                              setVersao((v) => v + 1);
                            }}
                          >
                            <Icone nome="copiar" />
                            Duplicar
                          </button>
                          <a href={`#/f/${f.id}${usam[0] ? `?pagina=${usam[0].slug}` : ""}`} target="_blank" rel="noopener noreferrer">
                            <Icone nome="externo" />
                            Abrir endereço próprio
                          </a>
                          <button
                            className="mn-perigo"
                            onClick={() => {
                              const aviso = usam.length
                                ? `"${f.nome}" está em ${usam.length} ${usam.length === 1 ? "página" : "páginas"} (${usam.map((p) => p.title).join(", ")}). Essas páginas voltam ao formulário fixo da peça. Apagar mesmo assim?`
                                : `Apagar "${f.nome}"? Não dá para desfazer.`;
                              if (!confirm(aviso)) return;
                              apagarFormulario(f.id);
                              setVersao((v) => v + 1);
                            }}
                          >
                            <Icone nome="lixo" />
                            Apagar
                          </button>
                        </div>
                      )}
                    </Menu>
                  </span>
                </div>
                <strong className="fl-nome">{f.nome}</strong>
                <span className="fl-resumo">
                  {f.campos.filter((c) => !["etapa", "oculto", "info"].includes(c.tipo)).length} campos · {camposNaPagina(f).length} na página ·{" "}
                  {f.campos.filter((c) => c.tipo === "etapa").length + 1} {f.campos.some((c) => c.tipo === "etapa") ? "etapas" : "etapa"}
                  {cobra(f) && " · ingresso pago"}
                </span>
                <div className="fl-pe">
                  <span className="fl-usam" title={usam.map((p) => p.title).join(", ")}>
                    {usam.length ? `Em ${usam.length} ${usam.length === 1 ? "página" : "páginas"}: ${usam.map((p) => p.title).join(", ")}` : "Ainda não usado em página"}
                  </span>
                  <span className="fl-meta">
                    {respostas.toLocaleString("pt-BR")} respostas · editado {quando(f.atualizadoEm)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Shell>
  );
}
