import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Campo as CampoView } from "../../form/Campo";
import { AoEnviar, ListaNaPagina, NaPagina, NavPasso, Passos, ResumoConclusao, secaoDoFormulario, type Passo } from "./Passos";
import { useConfirmar } from "../../ui/Confirmar";
import "../../form/form.css";
import {
  ACEITA,
  camposNaPagina,
  ficaNaPagina,
  getFormulario,
  novoCampo,
  paginasQueUsam,
  ROTULO_TIPO,
  salvarFormulario,
  type Campo,
  type Formulario,
  type TipoCampo,
} from "../../lib/formularios";
import { INGRESSO_PADRAO, reais, type ConfigIngresso, type Cupom, type Lote } from "../../lib/ingresso";
import { getPage, listPages } from "../../lib/pages";
import { uid } from "../../lib/slug";
import type { Respostas } from "../../lib/submissions";
import { appBaseUrl } from "../../router";
import { Icone, type NomeIcone } from "../../ui/Icone";
import { BotaoTema } from "../../ui/tema";
import { Copiar } from "../comum";
import "../../app.css";
import "../espaco.css";
import "../telas.css";
import "./construtor.css";

const PALETA: { grupo: string; tipos: [TipoCampo, NomeIcone][] }[] = [
  {
    grupo: "Dados da pessoa",
    tipos: [
      ["texto", "texto"],
      ["paragrafo", "lista"],
      ["email", "mensagem"],
      ["whats", "celular"],
      ["cpf", "cartao"],
      ["data", "calendario"],
      ["numero", "grafico"],
      ["cidade", "pin"],
    ],
  },
  {
    grupo: "Escolhas",
    tipos: [
      ["unica", "check"],
      ["multipla", "lista"],
      ["lista", "chev"],
    ],
  },
  {
    grupo: "Outros",
    tipos: [
      ["info", "alerta"],
      ["lgpd", "cadeado"],
      ["ingresso", "ingresso"],
      ["anexo", "enviar"],
      ["oculto", "olho"],
      ["etapa", "camadas"],
    ],
  },
];

const UNICOS: TipoCampo[] = ["lgpd", "ingresso"];
const COM_OPCOES: TipoCampo[] = ["unica", "multipla", "lista"];
const DE_TEXTO: TipoCampo[] = ["texto", "paragrafo", "email", "whats", "cpf", "numero", "data"];
const SEM_PAGINA: TipoCampo[] = ["etapa", "oculto", "ingresso"];
const fixo = (c: Campo) => c.base === "nome" || c.base === "whats" || c.tipo === "lgpd";

/** Tela do construtor de formulário (3.2): tipos à esquerda, prévia no meio, ajustes à direita. */
export function Construtor({ id, query }: { id: string; query: URLSearchParams }) {
  const [f, setF] = useState<Formulario | undefined>(() => getFormulario(id));
  const [sel, setSel] = useState<string | null>(null);
  const [lado, setLado] = useState<"campo" | "form">("form");
  const [vista, setVista] = useState<Passo>("montagem");
  const meio = useRef<HTMLElement>(null);
  // Trocar de passo volta ao topo da coluna do meio.
  const irPara = (p: Passo) => {
    setVista(p);
    meio.current?.scrollTo({ top: 0 });
  };
  const [salvo, setSalvo] = useState(true);
  const ultimo = useRef(f);
  const usam = useMemo(() => (f ? paginasQueUsam(f.id, listPages()) : []), [f?.id]);
  const paginaId = query.get("pagina");
  const pagina = paginaId ? getPage(paginaId) : usam[0];
  // A página das prévias: a que veio no endereço, se mostra este formulário; senão, a primeira que mostra.
  const paginaDaPrevia = f ? [pagina, ...usam].find((p) => secaoDoFormulario(p, f.id)) : undefined;
  const voltar =
    query.get("voltar") === "editor" && paginaId
      ? { href: `#/editar/${paginaId}`, rotulo: "Voltar ao construtor da página", fim: "Concluir e voltar ao construtor" }
      : paginaId
        ? { href: `#/pagina/${paginaId}`, rotulo: "Voltar à página", fim: "Concluir e voltar à página" }
        : { href: "#/formularios", rotulo: "Formulários", fim: "Concluir e ver os formulários" };
  const { pedir, dialogo } = useConfirmar();

  // Salva sozinho, como o construtor de página. Ao sair da tela antes do intervalo, salva na hora.
  const pendente = useRef<Formulario | null>(null);
  useEffect(() => {
    // Só salva o que mudou de fato: abrir a tela não conta como alteração (nem no modo de
    // desenvolvimento, em que o React roda o efeito duas vezes).
    if (!f || f === ultimo.current) return;
    setSalvo(false);
    pendente.current = f;
    const t = setTimeout(() => {
      salvarFormulario(f);
      ultimo.current = f;
      pendente.current = null;
      setSalvo(true);
    }, 350);
    return () => clearTimeout(t);
  }, [f]);
  useEffect(
    () => () => {
      if (pendente.current) salvarFormulario(pendente.current);
    },
    []
  );

  useEffect(() => {
    document.title = `Formulário · ${f?.nome ?? ""}`;
  }, [f?.nome]);

  if (!f)
    return (
      <div className="app">
        <main className="app-main app-empty">
          <h1 className="app-h1">Formulário não encontrado</h1>
          <a className="bt" href="#/formularios">
            Ver formulários
          </a>
        </main>
      </div>
    );

  const campo = f.campos.find((c) => c.id === sel);
  const mudarForm = (p: Partial<Formulario>) => setF((x) => (x ? { ...x, ...p } : x));
  const mudarCampo = (cid: string, p: Partial<Campo>) => setF((x) => (x ? { ...x, campos: x.campos.map((c) => (c.id === cid ? { ...c, ...p } : c)) } : x));

  function adicionar(tipo: TipoCampo) {
    const c = novoCampo(tipo);
    setF((x) => {
      if (!x) return x;
      const campos = [...x.campos];
      const i = sel ? campos.findIndex((y) => y.id === sel) : -1;
      // Sem campo escolhido, entra antes dos campos ocultos (que ficam no fim).
      const fim = campos.findIndex((y) => y.tipo === "oculto");
      campos.splice(i >= 0 ? i + 1 : fim >= 0 ? fim : campos.length, 0, c);
      return { ...x, campos };
    });
    setSel(c.id);
    setLado("campo");
    setVista("montagem");
  }

  function mover(cid: string, d: -1 | 1) {
    setF((x) => {
      if (!x) return x;
      const campos = [...x.campos];
      const i = campos.findIndex((c) => c.id === cid);
      const j = i + d;
      if (i < 0 || j < 0 || j >= campos.length) return x;
      [campos[i], campos[j]] = [campos[j], campos[i]];
      return { ...x, campos };
    });
  }

  function duplicar(cid: string) {
    const c = f!.campos.find((x) => x.id === cid);
    if (!c || UNICOS.includes(c.tipo)) return;
    const copia: Campo = { ...JSON.parse(JSON.stringify(c)), id: `c-${uid().slice(0, 8)}`, base: undefined, rotulo: `${c.rotulo} (cópia)` };
    setF((x) => {
      if (!x) return x;
      const campos = [...x.campos];
      campos.splice(campos.findIndex((y) => y.id === cid) + 1, 0, copia);
      return { ...x, campos };
    });
    setSel(copia.id);
  }

  function apagar(cid: string) {
    setF((x) =>
      x
        ? {
            ...x,
            // Quem dependia deste campo perde a condição.
            campos: x.campos.filter((c) => c.id !== cid).map((c) => (c.condicao?.campo === cid ? { ...c, condicao: undefined } : c)),
          }
        : x
    );
    if (sel === cid) setSel(null);
  }

  const escolher = (cid: string) => {
    setSel(cid);
    setLado("campo");
  };

  return (
    <div className="app fc-app">
      <header className="fc-top">
        <a className="ep-voltar" href={voltar.href}>
          <Icone nome="voltar" tamanho={16} />
          {voltar.rotulo}
        </a>
        <input className="fc-nome" value={f.nome} onChange={(e) => mudarForm({ nome: e.target.value })} aria-label="Nome do formulário" maxLength={80} />
        <span className="fc-salvo" role="status">
          {salvo ? (
            <>
              <Icone nome="check" tamanho={15} />
              Salvo
            </>
          ) : (
            "Salvando…"
          )}
        </span>
        <div className="fc-top-dir">
          {pagina && (
            <a className="bt bt-p" href={`#/f/${f.id}?pagina=${pagina.slug}`} target="_blank" rel="noopener noreferrer">
              <Icone nome="externo" tamanho={15} />
              Endereço próprio
            </a>
          )}
          <BotaoTema />
        </div>
      </header>

      {usam.length > 0 && (
        <p className="fc-aviso" role="note">
          <Icone nome="alerta" tamanho={16} />
          <span>
            Usado em {usam.length} {usam.length === 1 ? "página" : "páginas"}: <b>{usam.map((p) => p.title).join(", ")}</b>. O que mudar aqui vale para todas. As respostas continuam separadas por página.
          </span>
        </p>
      )}

      <div className="fc">
        <aside className="fc-paleta" aria-label={vista === "pagina" ? "Perguntas na página" : "Tipos de campo"}>
          {vista === "pagina" ? (
            <ListaNaPagina f={f} pagina={paginaDaPrevia} muda={(id, v) => mudarCampo(id, { naPagina: v })} />
          ) : (
            <>
          {PALETA.map((g) => (
            <section key={g.grupo}>
              <h2>{g.grupo}</h2>
              <div className="fc-tipos">
                {g.tipos.map(([t, ic]) => {
                  const jaTem = UNICOS.includes(t) && f.campos.some((c) => c.tipo === t);
                  return (
                    <button key={t} className="fc-tipo" onClick={() => adicionar(t)} disabled={jaTem} title={jaTem ? "Só um por formulário" : `Adicionar ${ROTULO_TIPO[t]}`}>
                      <Icone nome={ic} tamanho={16} />
                      {ROTULO_TIPO[t]}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          <p className="fc-dica">O campo novo entra logo abaixo do campo escolhido.</p>
            </>
          )}
        </aside>

        <main className="fc-meio" ref={meio}>
          <Passos atual={vista} ir={irPara} naPagina={camposNaPagina(f).length} />
          {vista === "montagem" && <Montagem f={f} sel={sel} escolher={escolher} mover={mover} duplicar={duplicar} apagar={apagar} />}
          {vista === "pagina" && <NaPagina f={f} pagina={paginaDaPrevia} />}
          {vista === "enviar" && <AoEnviar f={f} pagina={paginaDaPrevia} />}
          <NavPasso
            atual={vista}
            ir={irPara}
            concluir={() =>
              pedir({
                titulo: "Concluir o formulário?",
                texto: <ResumoConclusao f={f} pagina={paginaDaPrevia} />,
                confirmar: voltar.fim,
                aoConfirmar: () => {
                  location.hash = voltar.href;
                },
              })
            }
          />
          {dialogo}
        </main>

        <aside className="fc-ajustes" aria-label="Ajustes">
          <div className="seg fc-lado" role="group">
            <button aria-pressed={lado === "campo"} onClick={() => setLado("campo")} disabled={!campo}>
              Campo
            </button>
            <button aria-pressed={lado === "form"} onClick={() => setLado("form")}>
              Regras do formulário
            </button>
          </div>
          {lado === "campo" && campo ? (
            <AjustesCampo c={campo} f={f} muda={(p) => mudarCampo(campo.id, p)} />
          ) : (
            <AjustesForm f={f} muda={mudarForm} pagina={pagina?.slug} />
          )}
        </aside>
      </div>
    </div>
  );
}

/* ---------- Prévia ---------- */

function Montagem(p: { f: Formulario; sel: string | null; escolher: (id: string) => void; mover: (id: string, d: -1 | 1) => void; duplicar: (id: string) => void; apagar: (id: string) => void }) {
  const { f } = p;
  const vazio: Respostas = {};
  let etapa = 1;
  return (
    <ol className="fc-lista">
      <li className="fc-etapa fc-etapa-1">Etapa 1 · Seus dados</li>
      {f.campos.map((c, i) => {
        const ativo = p.sel === c.id;
        const condicao = c.condicao ? f.campos.find((x) => x.id === c.condicao!.campo) : undefined;
        const ferramentas = (
          <div className="fc-ferr" onClick={(e) => e.stopPropagation()}>
            <button className="bt bt-ic bt-p" onClick={() => p.mover(c.id, -1)} disabled={i === 0} aria-label="Subir">
              <Icone nome="cima" tamanho={15} />
            </button>
            <button className="bt bt-ic bt-p" onClick={() => p.mover(c.id, 1)} disabled={i === f.campos.length - 1} aria-label="Descer">
              <Icone nome="chev" tamanho={15} />
            </button>
            {!UNICOS.includes(c.tipo) && (
              <button className="bt bt-ic bt-p" onClick={() => p.duplicar(c.id)} aria-label="Duplicar">
                <Icone nome="copiar" tamanho={15} />
              </button>
            )}
            <button
              className="bt bt-ic bt-p"
              onClick={() => p.apagar(c.id)}
              disabled={fixo(c)}
              aria-label="Apagar"
              title={fixo(c) ? "Nome, WhatsApp e o aceite de LGPD não saem do formulário" : "Apagar"}
            >
              <Icone nome="lixo" tamanho={15} />
            </button>
          </div>
        );
        if (c.tipo === "etapa") {
          etapa++;
          return (
            <li key={c.id} className="fc-etapa" data-sel={ativo || undefined} onClick={() => p.escolher(c.id)}>
              <span>
                Etapa {etapa} · {c.rotulo}
              </span>
              {ferramentas}
            </li>
          );
        }
        return (
          <li key={c.id} className="fc-item" data-sel={ativo || undefined} onClick={() => p.escolher(c.id)}>
            <div className="fc-item-topo">
              <span className="fc-tag">{ROTULO_TIPO[c.tipo]}</span>
              {c.naPagina && <span className="fc-tag fc-tag-pag">Na página</span>}
              {c.base && <span className="fc-tag">Vai para a lista</span>}
              {condicao && (
                <span className="fc-tag fc-tag-cond">
                  Só se “{condicao.rotulo.slice(0, 24)}” = {c.condicao!.valor}
                </span>
              )}
              {ferramentas}
            </div>
            {c.tipo === "oculto" ? (
              <p className="fc-oculto">
                <Icone nome="olho" tamanho={15} />
                {c.rotulo}: preenchido sozinho {c.fonte === "ref" ? "com o código do licenciado do link" : "com a origem do acesso"}
              </p>
            ) : (
              <div className="fc-previa fm-pagina" inert>
                <div className="fm-linhas">
                  <CampoView campo={{ ...c, condicao: undefined }} r={vazio} erros={{}} muda={() => {}} pele="fm" form={f} pageId="" />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Ajustes ---------- */

function Linha({ rotulo, children, ajuda }: { rotulo: string; children: ReactNode; ajuda?: string }) {
  return (
    <label className="fc-campo">
      <span>{rotulo}</span>
      {children}
      {ajuda && <small>{ajuda}</small>}
    </label>
  );
}

function Liga({ rotulo, marcado, muda, desligado, ajuda }: { rotulo: string; marcado: boolean; muda: (v: boolean) => void; desligado?: boolean; ajuda?: string }) {
  return (
    <label className="fc-liga" data-desligado={desligado || undefined}>
      <input type="checkbox" role="switch" checked={marcado} onChange={(e) => muda(e.target.checked)} disabled={desligado} />
      <span className="fc-trilho" aria-hidden="true" />
      <span className="fc-liga-txt">
        {rotulo}
        {ajuda && <small>{ajuda}</small>}
      </span>
    </label>
  );
}

function AjustesCampo({ c, f, muda }: { c: Campo; f: Formulario; muda: (p: Partial<Campo>) => void }) {
  const textoLongo = c.tipo === "lgpd" || c.tipo === "info";
  const escolhas = f.campos.filter((x) => x.id !== c.id && COM_OPCOES.includes(x.tipo));
  const pai = escolhas.find((x) => x.id === c.condicao?.campo);
  return (
    <div className="fc-form">
      <p className="fc-tipo-atual">
        {ROTULO_TIPO[c.tipo]}
        {c.base && <small>Vai para a lista de inscritos e para o check-in.</small>}
      </p>
      <Linha rotulo={c.tipo === "etapa" ? "Nome da etapa" : textoLongo ? "Texto" : "Pergunta"}>
        {textoLongo ? <textarea rows={4} value={c.rotulo} onChange={(e) => muda({ rotulo: e.target.value })} /> : <input value={c.rotulo} onChange={(e) => muda({ rotulo: e.target.value })} maxLength={140} />}
      </Linha>
      {!["etapa", "oculto", "info", "lgpd"].includes(c.tipo) && (
        <Linha rotulo="Texto de ajuda">
          <input value={c.ajuda ?? ""} onChange={(e) => muda({ ajuda: e.target.value || undefined })} maxLength={160} placeholder="Aparece embaixo do campo" />
        </Linha>
      )}
      {DE_TEXTO.includes(c.tipo) && c.tipo !== "data" && (
        <Linha rotulo="Exemplo dentro do campo">
          <input value={c.exemplo ?? ""} onChange={(e) => muda({ exemplo: e.target.value || undefined })} maxLength={60} />
        </Linha>
      )}
      {c.tipo === "lgpd" && <p className="fc-nota">Obrigatório em todo formulário. Use **asteriscos** para negrito.</p>}
      {!["etapa", "oculto", "info", "lgpd", "ingresso"].includes(c.tipo) && (
        <Liga rotulo="Obrigatório" marcado={Boolean(c.obrigatorio)} muda={(v) => muda({ obrigatorio: v })} desligado={c.base === "nome" || c.base === "whats"} />
      )}
      {!SEM_PAGINA.includes(c.tipo) && (
        <Liga
          rotulo="Mostrar na página"
          ajuda={
            c.naPagina && !ficaNaPagina(f, c)
              ? "Depende de uma resposta dada no modal, então aparece no modal."
              : "Fica na versão curta, na própria peça de inscrição."
          }
          marcado={Boolean(c.naPagina)}
          muda={(v) => muda({ naPagina: v })}
        />
      )}
      {[...DE_TEXTO, "lista", "cidade"].includes(c.tipo) && c.tipo !== "paragrafo" && (
        <Liga rotulo="Meia largura" ajuda="Dois campos lado a lado no computador." marcado={Boolean(c.meia)} muda={(v) => muda({ meia: v })} />
      )}
      {(c.tipo === "texto" || c.tipo === "paragrafo") && (
        <div className="fc-duas">
          <Linha rotulo="Limite de caracteres">
            <input type="number" min={1} value={c.max ?? ""} onChange={(e) => muda({ max: Number(e.target.value) || undefined })} />
          </Linha>
          {c.tipo === "texto" && (
            <Linha rotulo="Validação">
              <select className="sel" value={c.validacao ?? "nenhuma"} onChange={(e) => muda({ validacao: e.target.value as Campo["validacao"] })}>
                <option value="nenhuma">Nenhuma</option>
                <option value="nome-completo">Nome e sobrenome</option>
                <option value="so-letras">Só letras</option>
              </select>
            </Linha>
          )}
        </div>
      )}
      {c.tipo === "numero" && (
        <div className="fc-duas">
          <Linha rotulo="Mínimo">
            <input type="number" value={c.minimo ?? ""} onChange={(e) => muda({ minimo: e.target.value === "" ? undefined : Number(e.target.value) })} />
          </Linha>
          <Linha rotulo="Máximo">
            <input type="number" value={c.maximo ?? ""} onChange={(e) => muda({ maximo: e.target.value === "" ? undefined : Number(e.target.value) })} />
          </Linha>
        </div>
      )}
      {COM_OPCOES.includes(c.tipo) && (
        <Linha rotulo="Opções" ajuda="Uma por linha.">
          <textarea
            rows={5}
            value={(c.opcoes ?? []).join("\n")}
            onChange={(e) => muda({ opcoes: e.target.value.split("\n").map((s) => s.trimStart()).slice(0, 30) })}
            onBlur={(e) => muda({ opcoes: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
          />
        </Linha>
      )}
      {c.tipo === "anexo" && (
        <div className="fc-duas">
          <Linha rotulo="Arquivos aceitos">
            <select className="sel" value={c.aceita ?? "pdf-imagem"} onChange={(e) => muda({ aceita: e.target.value as Campo["aceita"] })}>
              {Object.entries(ACEITA).map(([v, a]) => (
                <option key={v} value={v}>
                  {a.rotulo}
                </option>
              ))}
            </select>
          </Linha>
          <Linha rotulo="Tamanho máximo (MB)">
            <input type="number" min={1} max={50} value={c.maxMb ?? 5} onChange={(e) => muda({ maxMb: Math.min(50, Math.max(1, Number(e.target.value) || 1)) })} />
          </Linha>
        </div>
      )}
      {c.tipo === "anexo" && <p className="fc-nota">Na POC fica guardado só o nome e o tamanho do arquivo. No projeto real, o arquivo vai para o servidor.</p>}
      {c.tipo === "oculto" && (
        <Linha rotulo="Preenchido com">
          <select className="sel" value={c.fonte ?? "ref"} onChange={(e) => muda({ fonte: e.target.value as Campo["fonte"] })}>
            <option value="ref">Código do licenciado (do link)</option>
            <option value="origem">Origem do acesso (Instagram, WhatsApp…)</option>
          </select>
        </Linha>
      )}
      {!["etapa", "oculto", "lgpd", "ingresso"].includes(c.tipo) && (
        <fieldset className="fc-cond">
          <legend>Lógica</legend>
          {escolhas.length === 0 ? (
            <p className="fc-nota">Para mostrar este campo só com certa resposta, adicione antes uma escolha única, múltipla ou lista.</p>
          ) : (
            <>
              <Linha rotulo="Mostrar só quando">
                <select
                  className="sel"
                  value={c.condicao?.campo ?? ""}
                  onChange={(e) => {
                    const alvo = escolhas.find((x) => x.id === e.target.value);
                    muda({ condicao: alvo ? { campo: alvo.id, valor: alvo.opcoes?.[0] ?? "" } : undefined });
                  }}
                >
                  <option value="">Sempre mostrar</option>
                  {escolhas.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.rotulo.slice(0, 50)}
                    </option>
                  ))}
                </select>
              </Linha>
              {pai && (
                <Linha rotulo="tiver a resposta">
                  <select className="sel" value={c.condicao?.valor ?? ""} onChange={(e) => muda({ condicao: { campo: pai.id, valor: e.target.value } })}>
                    {(pai.opcoes ?? []).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Linha>
              )}
            </>
          )}
        </fieldset>
      )}
      {c.tipo === "ingresso" && <AjustesIngresso cfg={c.ingresso ?? INGRESSO_PADRAO} muda={(ingresso) => muda({ ingresso })} />}
    </div>
  );
}

/** Preço único, lotes por data, cupons e meia-entrada (4.1). */
function AjustesIngresso({ cfg, muda }: { cfg: ConfigIngresso; muda: (c: ConfigIngresso) => void }) {
  const lote = (i: number, p: Partial<Lote>) => muda({ ...cfg, lotes: cfg.lotes.map((l, j) => (j === i ? { ...l, ...p } : l)) });
  const cupom = (i: number, p: Partial<Cupom>) => muda({ ...cfg, cupons: cfg.cupons.map((c, j) => (j === i ? { ...c, ...p } : c)) });
  return (
    <div className="fc-ing">
      <Linha rotulo="Nome do ingresso">
        <input value={cfg.nomeIngresso} onChange={(e) => muda({ ...cfg, nomeIngresso: e.target.value })} maxLength={40} />
      </Linha>
      <Linha rotulo={cfg.lotes.length ? "Preço depois dos lotes (R$)" : "Preço único (R$)"} ajuda="0 = gratuito: a inscrição pula o pagamento.">
        <input type="number" min={0} step="0.01" value={cfg.preco} onChange={(e) => muda({ ...cfg, preco: Math.max(0, Number(e.target.value)) })} />
      </Linha>

      <section className="fc-sub">
        <header>
          <h3>Lotes por data</h3>
          <button
            className="bt bt-p"
            onClick={() => muda({ ...cfg, lotes: [...cfg.lotes, { id: uid().slice(0, 6), nome: `${cfg.lotes.length + 1}º lote`, preco: cfg.preco, ate: "" }] })}
          >
            <Icone nome="mais" tamanho={14} />
            Lote
          </button>
        </header>
        {cfg.lotes.length === 0 && <p className="fc-nota">Sem lotes, vale o preço único. Com lotes, o preço muda sozinho na data.</p>}
        {cfg.lotes.map((l, i) => (
          <div key={l.id} className="fc-item-ing fc-lote">
            <Linha rotulo="Nome">
              <input value={l.nome} onChange={(e) => lote(i, { nome: e.target.value })} maxLength={30} />
            </Linha>
            <Linha rotulo="Preço (R$)">
              <input type="number" min={0} step="0.01" value={l.preco} onChange={(e) => lote(i, { preco: Math.max(0, Number(e.target.value)) })} />
            </Linha>
            <button className="bt bt-ic bt-p fc-tirar" onClick={() => muda({ ...cfg, lotes: cfg.lotes.filter((_, j) => j !== i) })} aria-label={`Tirar ${l.nome}`}>
              <Icone nome="fechar" tamanho={14} />
            </button>
            <Linha rotulo="Vale até (Brasília)">
              <input type="datetime-local" value={l.ate} onChange={(e) => lote(i, { ate: e.target.value })} />
            </Linha>
          </div>
        ))}
      </section>

      <section className="fc-sub">
        <header>
          <h3>Cupons</h3>
          <button className="bt bt-p" onClick={() => muda({ ...cfg, cupons: [...cfg.cupons, { codigo: `CUPOM${cfg.cupons.length + 1}`, tipo: "percentual", valor: 10 }] })}>
            <Icone nome="mais" tamanho={14} />
            Cupom
          </button>
        </header>
        {cfg.cupons.map((c, i) => (
          <div key={i} className="fc-item-ing fc-cupom">
            <Linha rotulo="Código">
              <input value={c.codigo} onChange={(e) => cupom(i, { codigo: e.target.value.toUpperCase().replace(/\s/g, "") })} maxLength={20} />
            </Linha>
            <Linha rotulo="Desconto">
              <span className="fc-desconto">
                <input type="number" min={0} value={c.valor} onChange={(e) => cupom(i, { valor: Math.max(0, Number(e.target.value)) })} aria-label="Valor do desconto" />
                <select className="sel" value={c.tipo} onChange={(e) => cupom(i, { tipo: e.target.value as Cupom["tipo"] })} aria-label="Tipo de desconto">
                  <option value="percentual">%</option>
                  <option value="valor">R$</option>
                </select>
              </span>
            </Linha>
            <button className="bt bt-ic bt-p fc-tirar" onClick={() => muda({ ...cfg, cupons: cfg.cupons.filter((_, j) => j !== i) })} aria-label={`Tirar o cupom ${c.codigo}`}>
              <Icone nome="fechar" tamanho={14} />
            </button>
            <Linha rotulo="Limite de usos">
              <input type="number" min={0} value={c.limite ?? ""} onChange={(e) => cupom(i, { limite: Number(e.target.value) || undefined })} placeholder="Sem limite" />
            </Linha>
            <Linha rotulo="Licenciado">
              <input value={c.licenciado ?? ""} onChange={(e) => cupom(i, { licenciado: e.target.value.toUpperCase() || undefined })} placeholder="Código" maxLength={20} />
            </Linha>
            <Linha rotulo="Válido até (Brasília)">
              <input type="datetime-local" value={c.validade ?? ""} onChange={(e) => cupom(i, { validade: e.target.value || undefined })} />
            </Linha>
          </div>
        ))}
        {cfg.cupons.length === 0 && <p className="fc-nota">Ex.: um cupom por licenciado, com limite de usos e validade.</p>}
      </section>

      <Liga rotulo="Meia-entrada" ajuda={cfg.meia ? `Metade do preço: ${reais(cfg.preco / 2)} no preço final.` : "Opção com preço reduzido e declaração do direito."} marcado={cfg.meia} muda={(v) => muda({ ...cfg, meia: v })} />
      {cfg.meia && (
        <Linha rotulo="Declaração da meia-entrada">
          <textarea rows={3} value={cfg.textoMeia} onChange={(e) => muda({ ...cfg, textoMeia: e.target.value })} />
        </Linha>
      )}
    </div>
  );
}

function AjustesForm({ f, muda, pagina }: { f: Formulario; muda: (p: Partial<Formulario>) => void; pagina?: string }) {
  const r = f.regras;
  const regra = (p: Partial<Formulario["regras"]>) => muda({ regras: { ...r, ...p } });
  const endereco = `${appBaseUrl()}#/f/${f.id}${pagina ? `?pagina=${pagina}` : ""}`;
  return (
    <div className="fc-form">
      <Linha rotulo="Como o modal pergunta">
        <div className="seg" role="group" aria-label="Como o modal pergunta">
          <button aria-pressed={f.estilo !== "formulario"} onClick={() => muda({ estilo: "conversa" })}>
            Conversa
          </button>
          <button aria-pressed={f.estilo === "formulario"} onClick={() => muda({ estilo: "formulario" })}>
            Formulário
          </button>
        </div>
      </Linha>
      <p className="fc-nota">Conversa: uma pergunta por vez, como um chat, já com o que a pessoa digitou na página. Formulário: os campos em etapas.</p>
      <div className="fc-duas">
        <Linha rotulo="Botão para continuar">
          <input value={f.botaoPagina} onChange={(e) => muda({ botaoPagina: e.target.value })} maxLength={40} />
        </Linha>
        <Linha rotulo="Botão final">
          <input value={f.botaoFinal} onChange={(e) => muda({ botaoFinal: e.target.value })} maxLength={40} />
        </Linha>
      </div>
      <fieldset className="fc-cond">
        <legend>Vagas e prazo</legend>
        <div className="fc-duas">
          <Linha rotulo="Vagas" ajuda="Vazio = sem limite. As vagas da página valem antes.">
            <input type="number" min={0} value={r.vagas ?? ""} onChange={(e) => regra({ vagas: Number(e.target.value) || undefined })} />
          </Linha>
          <Linha rotulo="Encerrar em (Brasília)">
            <input type="datetime-local" value={r.encerraEm ?? ""} onChange={(e) => regra({ encerraEm: e.target.value || undefined })} />
          </Linha>
        </div>
        <Liga rotulo="Lista de espera" ajuda="Com as vagas cheias, a pessoa entra na fila em vez de ver “esgotado”." marcado={r.listaEspera} muda={(v) => regra({ listaEspera: v })} />
      </fieldset>
      <Linha rotulo="Bloquear inscrição repetida">
        <select className="sel" value={r.bloquearRepetida} onChange={(e) => regra({ bloquearRepetida: e.target.value as Formulario["regras"]["bloquearRepetida"] })}>
          <option value="whats-ou-email">Mesmo WhatsApp ou e-mail</option>
          <option value="whats">Mesmo WhatsApp</option>
          <option value="email">Mesmo e-mail</option>
          <option value="nao">Não bloquear</option>
        </select>
      </Linha>
      <fieldset className="fc-cond">
        <legend>Depois de enviar</legend>
        <div className="seg" role="group">
          <button aria-pressed={r.sucesso === "mensagem"} onClick={() => regra({ sucesso: "mensagem" })}>
            Mensagem de sucesso
          </button>
          <button aria-pressed={r.sucesso === "redirecionar"} onClick={() => regra({ sucesso: "redirecionar" })}>
            Outra página
          </button>
        </div>
        {r.sucesso === "mensagem" ? (
          <Linha rotulo="Mensagem">
            <textarea rows={2} value={r.mensagemSucesso} onChange={(e) => regra({ mensagemSucesso: e.target.value })} maxLength={200} />
          </Linha>
        ) : (
          <Linha rotulo="Endereço da página" ajuda="A confirmação aparece por 5 segundos e a pessoa segue para lá.">
            <input value={r.redirecionarPara ?? ""} onChange={(e) => regra({ redirecionarPara: e.target.value.trim() || undefined })} placeholder="https://…" />
          </Linha>
        )}
      </fieldset>
      <fieldset className="fc-cond">
        <legend>Endereço próprio</legend>
        <p className="fc-nota">Para mandar só o formulário, sem a página. {pagina ? "As respostas vão para a página ligada." : "Ligue o formulário a uma página para receber respostas."}</p>
        <div className="ep-link">
          <code title={endereco}>{endereco.replace(/^https?:\/\//, "")}</code>
          <Copiar texto={endereco} />
        </div>
      </fieldset>
    </div>
  );
}
