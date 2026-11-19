import { useId, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { resumir } from "../../lib/eventos";
import { buscarLicenciados, type Licenciado } from "../../lib/licenciados";
import { criarLink, linkPorRef, removerLink, type LinkLicenciado } from "../../lib/links";
import { buildInviteLink } from "../../lib/persona";
import { appBaseUrl } from "../../router";
import { Icone } from "../../ui/Icone";
import { baixarQr, Bloco, Copiar } from "../comum";
import type { Espaco } from "./tipos";

export const linkDeDivulgacao = (slug: string, l: Pick<LinkLicenciado, "ref" | "nome" | "cidade" | "whats">) =>
  buildInviteLink(appBaseUrl(), slug, { ref: l.ref, nome: l.nome, cidade: l.cidade, whats: l.whats });
export const linkDeNumeros = (slug: string, ref: string) => `${appBaseUrl()}#/numeros/${slug}/${encodeURIComponent(ref)}`;

/** Links de licenciado (2.5): gerar, listar e ver o que cada link trouxe. */
export function Links({ d }: { d: Espaco }) {
  const [v, setV] = useState({ nome: "", ref: "", cidade: "", whats: "" });
  const [erro, setErro] = useState("");
  const [novo, setNovo] = useState<string | null>(null);
  const r = useMemo(() => resumir(d.eventos, d.subs, 1), [d.eventos, d.subs]);
  const porRef = useMemo(() => new Map(r.ranking.map((x) => [x.ref, x])), [r]);
  const linhas = useMemo(
    () =>
      d.links
        .map((l) => ({ l, n: porRef.get(l.ref) ?? { visitas: 0, inscricoes: 0, presentes: 0 } }))
        .sort((a, b) => b.n.inscricoes - a.n.inscricoes || b.l.criadoEm - a.l.criadoEm),
    [d.links, porRef]
  );

  function gerar(e: FormEvent) {
    e.preventDefault();
    try {
      const l = criarLink(d.page.id, v);
      setNovo(l.id);
      setV({ nome: "", ref: "", cidade: "", whats: "" });
      setErro("");
      d.recarregar();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não deu para gerar o link.");
    }
  }

  return (
    <div className="ep-grade">
      <div className="ep-col">
        <Bloco titulo={`Links gerados (${d.links.length})`}>
          {linhas.length === 0 ? (
            <p className="app-muted">Nenhum link ainda. Gere o primeiro ao lado.</p>
          ) : (
            <ul className="lk-lista">
              {linhas.map(({ l, n }) => {
                const conv = n.visitas ? Math.round((n.inscricoes / n.visitas) * 1000) / 10 : 0;
                return (
                  <li key={l.id} className="lk" data-novo={novo === l.id || undefined}>
                    <div className="lk-quem">
                      <strong>{l.nome}</strong>
                      <span>
                        {l.ref}
                        {l.cidade && ` · ${l.cidade}`}
                      </span>
                    </div>
                    <dl className="lk-nums">
                      <div>
                        <dt>Visitas</dt>
                        <dd>{n.visitas.toLocaleString("pt-BR")}</dd>
                      </div>
                      <div>
                        <dt>Inscrições</dt>
                        <dd>{n.inscricoes.toLocaleString("pt-BR")}</dd>
                      </div>
                      <div>
                        <dt>Conversão</dt>
                        <dd>{conv.toLocaleString("pt-BR")}%</dd>
                      </div>
                    </dl>
                    <div className="lk-acoes">
                      <Copiar texto={linkDeDivulgacao(d.page.slug, l)} rotulo="Link de divulgação" />
                      <Copiar texto={linkDeNumeros(d.page.slug, l.ref)} rotulo="Link dos números" />
                      <a className="bt bt-p bt-ic" href={`#/numeros/${d.page.slug}/${l.ref}`} title="Ver o que o licenciado vê" aria-label={`Ver os números de ${l.nome}`}>
                        <Icone nome="olho" tamanho={15} />
                      </a>
                      <button className="bt bt-p bt-ic" title="Baixar QR code do link" aria-label={`Baixar QR code de ${l.nome}`} onClick={() => baixarQr(linkDeDivulgacao(d.page.slug, l), `qr-${d.page.slug}-${l.ref}`)}>
                        <Icone nome="qr" tamanho={15} />
                      </button>
                      <button
                        className="bt bt-p bt-ic"
                        title="Remover link"
                        aria-label={`Remover o link de ${l.nome}`}
                        onClick={() => {
                          if (!confirm(`Remover o link de ${l.nome}? As inscrições que ele trouxe continuam.`)) return;
                          removerLink(l.id);
                          d.recarregar();
                        }}
                      >
                        <Icone nome="lixo" tamanho={15} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Bloco>
      </div>

      <aside className="ep-col ep-lado">
        <Bloco titulo="Gerar link">
          <form className="fm-app" onSubmit={gerar}>
            <BuscaLicenciado
              valor={v.nome}
              pageId={d.page.id}
              muda={(nome) => setV({ ...v, nome })}
              escolher={(l) => setV({ nome: l.nome, ref: l.ref, cidade: l.cidade, whats: l.whats ?? "" })}
            />
            <label className="app-field">
              <span>Código do licenciado</span>
              <input value={v.ref} onChange={(e) => setV({ ...v, ref: e.target.value.toUpperCase() })} maxLength={20} placeholder="Ex.: LIC123" required />
            </label>
            <label className="app-field">
              <span>Cidade (aparece na página)</span>
              <input value={v.cidade} onChange={(e) => setV({ ...v, cidade: e.target.value })} maxLength={80} placeholder="Belo Horizonte · MG" />
            </label>
            <label className="app-field">
              <span>WhatsApp (botões da página levam para ele)</span>
              <input value={v.whats} onChange={(e) => setV({ ...v, whats: e.target.value })} inputMode="tel" maxLength={20} placeholder="5531999999999" />
            </label>
            {erro && <p className="app-err">{erro}</p>}
            <button className="bt bt-pri" type="submit">
              <Icone nome="link" tamanho={16} />
              Gerar link
            </button>
          </form>
        </Bloco>
        <Bloco titulo="O que o licenciado recebe">
          <ul className="ep-lista-txt">
            <li>
              <b>Link de divulgação:</b> a página com o nome e o WhatsApp dele. Quem se inscreve por ele fica com o código dele.
            </li>
            <li>
              <b>Link dos números:</b> só quantas visitas e inscrições o link trouxe. Nunca nome ou contato de quem se inscreveu.
            </li>
          </ul>
        </Bloco>
      </aside>
    </div>
  );
}

const iniciais = (nome: string) =>
  nome
    .split(/s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

/**
 * Nome do licenciado com busca: digitando o nome, o código ou a cidade, aparece a lista de
 * licenciados; escolher um preenche código, cidade e WhatsApp. Dá para digitar um nome que não
 * está na lista. Teclado: setas, Enter escolhe, Esc fecha.
 */
function BuscaLicenciado({ valor, pageId, muda, escolher }: { valor: string; pageId: string; muda: (v: string) => void; escolher: (l: Licenciado) => void }) {
  const id = useId();
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const sugestoes = useMemo(() => buscarLicenciados(valor), [valor]);
  const temLink = (l: Licenciado) => Boolean(linkPorRef(pageId, l.ref));
  const mostra = aberto && sugestoes.length > 0;

  const pegar = (l: Licenciado) => {
    if (temLink(l)) return;
    escolher(l);
    setAberto(false);
  };
  const tecla = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setAberto(true);
      if (!sugestoes.length) return;
      setAtivo((a) => (a + (e.key === "ArrowDown" ? 1 : sugestoes.length - 1)) % sugestoes.length);
    } else if (e.key === "Enter" && mostra) {
      e.preventDefault();
      pegar(sugestoes[ativo]);
    } else if (e.key === "Escape") {
      setAberto(false);
    }
  };

  return (
    <div className="app-field lk-busca">
      <label htmlFor={`${id}-in`}>Licenciado</label>
      <div className="lk-busca-caixa">
        <Icone nome="busca" tamanho={16} className="lk-busca-ic" />
        <input
          id={`${id}-in`}
          role="combobox"
          aria-expanded={mostra}
          aria-controls={`${id}-lista`}
          aria-autocomplete="list"
          aria-activedescendant={mostra ? `${id}-op-${ativo}` : undefined}
          autoComplete="off"
          value={valor}
          onChange={(e) => {
            muda(e.target.value);
            setAtivo(0);
            setAberto(true);
          }}
          onFocus={() => setAberto(true)}
          onBlur={() => setAberto(false)}
          onKeyDown={tecla}
          placeholder="Busque pelo nome, código ou cidade"
          maxLength={80}
          required
        />
        {mostra && (
          <ul className="lk-sugestoes" id={`${id}-lista`} role="listbox" aria-label="Licenciados">
            {sugestoes.map((l, i) => {
              const ja = temLink(l);
              return (
                <li
                  key={l.ref}
                  id={`${id}-op-${i}`}
                  role="option"
                  aria-selected={i === ativo}
                  aria-disabled={ja || undefined}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pegar(l);
                  }}
                  onMouseEnter={() => setAtivo(i)}
                >
                  <span className="lk-av" aria-hidden="true">
                    {iniciais(l.nome)}
                  </span>
                  <span className="lk-sug-txt">
                    <b>{l.nome}</b>
                    <small>
                      {l.ref}
                      {l.cidade && ` · ${l.cidade}`}
                    </small>
                  </span>
                  {ja && <em>Já tem link</em>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <small className="lk-busca-dica">Ao escolher da lista, código, cidade e WhatsApp vêm preenchidos.</small>
    </div>
  );
}
