import { useMemo, useState } from "react";
import { formularioDaPagina, listarFormularios } from "../../lib/formularios";
import { quandoLembrete, textoConfirmacao, textoLembrete } from "../../lib/mensagens";
import { comunicacaoDe, type Comunicacao, type MetaPagina, type StatusPagina } from "../../lib/meta";
import { metaDe } from "../../lib/painel";
import { atualizarPagina, atualizarPecas, deletePage, listPages, setMeta, setSlug } from "../../lib/pages";
import { slugify } from "../../lib/slug";
import { appBaseUrl, go } from "../../router";
import { Icone } from "../../ui/Icone";
import { Bloco } from "../comum";
import { BolhaWhats } from "../../form/Bolha";
import type { Espaco } from "./tipos";

type Root = { titulo?: string; descricao?: string; imagemCompartilhamento?: string; indexar?: boolean };
type Rascunho = { title: string; slug: string; root: Root; meta: MetaPagina; com: Comunicacao; formularioId: string };

const PECAS_INSCRICAO = new Set(["Inscricao", "LiveInscricao"]);

function inicial(d: Espaco): Rascunho {
  const root = ((d.page.data.root as { props?: Root })?.props ?? {}) as Root;
  return {
    title: d.page.title,
    slug: d.page.slug,
    root: { titulo: root.titulo ?? "", descricao: root.descricao ?? "", imagemCompartilhamento: root.imagemCompartilhamento ?? "", indexar: root.indexar !== false },
    meta: metaDe(d.page),
    com: comunicacaoDe(metaDe(d.page)),
    formularioId: formularioDaPagina(d.page.data) ?? "",
  };
}

/** Configurações (2.4 e 5.1–5.2): tudo o que se muda sem abrir o construtor. */
export function Config({ d }: { d: Espaco }) {
  const [base, setBase] = useState(() => inicial(d));
  const [r, setR] = useState(base);
  const [salvo, setSalvo] = useState(false);
  const [novoResp, setNovoResp] = useState("");
  const forms = useMemo(() => listarFormularios(), []);
  const conhecidos = useMemo(() => [...new Set(listPages().flatMap((p) => metaDe(p).responsaveis ?? []))].sort(), []);
  const temPecaInscricao = (d.page.data.content ?? []).some((c) => PECAS_INSCRICAO.has(c.type));
  const sujo = JSON.stringify(r) !== JSON.stringify(base);

  const meta = (p: Partial<MetaPagina>) => setR((x) => ({ ...x, meta: { ...x.meta, ...p } }));
  const root = (p: Partial<Root>) => setR((x) => ({ ...x, root: { ...x.root, ...p } }));
  const com = (p: Partial<Comunicacao>) => setR((x) => ({ ...x, com: { ...x.com, ...p } }));
  const resp = r.meta.responsaveis ?? [];

  function salvar() {
    setMeta(d.page.id, { ...r.meta, comunicacao: r.com, publicarEm: r.meta.publicarEm || undefined, encerrarEm: r.meta.encerrarEm || undefined, vagas: Number(r.meta.vagas) || undefined });
    atualizarPagina(d.page.id, { title: r.title, root: { ...r.root } });
    if (r.slug !== d.page.slug) setSlug(d.page.id, r.slug);
    if (r.formularioId !== base.formularioId)
      atualizarPecas(d.page.id, (p) => (PECAS_INSCRICAO.has(p.type) ? { formularioId: r.formularioId || undefined } : undefined));
    setBase(r);
    d.recarregar();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  // Depois de salvar, a página relida vira o novo ponto de partida.
  const atual = inicial(d);
  if (!sujo && JSON.stringify(atual) !== JSON.stringify(base)) {
    setBase(atual);
    setR(atual);
  }

  const lembrete = quandoLembrete(d.page, { ...r.meta, comunicacao: r.com });
  const exemplo = { nome: d.subs[0]?.nome ?? "Ana Souza", codigo: d.subs[0]?.codigo ?? "K7P2QX" };
  const linkIngresso = `${appBaseUrl()}#/ingresso/${exemplo.codigo}`;
  const aReceber = d.subs.filter((s) => ["inscrito", "confirmado", undefined].includes(s.status)).length;
  const urlFinal = `eventos.igreenenergy.com.br/${slugify(r.slug || "pagina")}`;
  const titulo = r.root.titulo || r.title;

  return (
    <div className="cf">
      <Bloco titulo="Nome e endereço">
        <div className="cf-grade">
          <label className="app-field">
            <span>Nome da página (no painel)</span>
            <input value={r.title} onChange={(e) => setR({ ...r, title: e.target.value })} maxLength={120} />
          </label>
          <label className="app-field">
            <span>Endereço</span>
            <div className="cf-prefixo">
              <span>/p/</span>
              <input value={r.slug} onChange={(e) => setR({ ...r, slug: e.target.value })} onBlur={() => setR((x) => ({ ...x, slug: slugify(x.slug) }))} maxLength={60} />
            </div>
          </label>
        </div>
        <p className="cf-ajuda">Mudar o endereço quebra o link que já foi divulgado. Na POC, as inscrições continuam presas à página.</p>
      </Bloco>

      <Bloco titulo="Publicação">
        <div className="seg cf-seg" role="group" aria-label="Status">
          {(["rascunho", "publicada", "encerrada"] as StatusPagina[]).map((s) => (
            <button key={s} aria-pressed={r.meta.status === s || (s === "rascunho" && r.meta.status === "arquivada")} onClick={() => meta({ status: s })}>
              {s === "rascunho" ? "Rascunho" : s === "publicada" ? "Publicada" : "Inscrições encerradas"}
            </button>
          ))}
        </div>
        <div className="cf-grade">
          <label className="app-field">
            <span>Agendar: entra no ar em (Brasília)</span>
            <input type="datetime-local" value={r.meta.publicarEm ?? ""} onChange={(e) => meta({ publicarEm: e.target.value, status: e.target.value ? "publicada" : r.meta.status })} />
          </label>
          <label className="app-field">
            <span>Encerrar as inscrições sozinha em (Brasília)</span>
            <input type="datetime-local" value={r.meta.encerrarEm ?? ""} onChange={(e) => meta({ encerrarEm: e.target.value })} />
          </label>
        </div>
        <p className="cf-ajuda">Quem tem acesso ao construtor publica direto, sem aprovação (decisão 0.4). Com data de publicação, a página fica agendada até lá.</p>
      </Bloco>

      <Bloco titulo="Inscrições">
        <div className="cf-grade">
          <label className="app-field">
            <span>Formulário</span>
            <select className="sel" value={r.formularioId} onChange={(e) => setR({ ...r, formularioId: e.target.value })} disabled={!temPecaInscricao}>
              <option value="">Formulário fixo da peça (nome, WhatsApp, e-mail)</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="app-field">
            <span>Vagas do evento</span>
            <input
              type="number"
              min={0}
              value={r.meta.vagas ?? ""}
              onChange={(e) => meta({ vagas: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value)) })}
              placeholder={forms.find((f) => f.id === r.formularioId)?.regras.vagas ? `Do formulário: ${forms.find((f) => f.id === r.formularioId)?.regras.vagas}` : "Sem limite"}
            />
          </label>
        </div>
        <div className="app-actions">
          {r.formularioId && (
            <a className="bt bt-p" href={`#/formulario/${r.formularioId}?pagina=${d.page.id}`}>
              <Icone nome="lapis" tamanho={15} />
              Editar formulário
            </a>
          )}
          <a className="bt bt-p" href="#/formularios">
            <Icone nome="formulario" tamanho={15} />
            Biblioteca de formulários
          </a>
        </div>
        {!temPecaInscricao && <p className="cf-ajuda">A página não tem peça de inscrição. Coloque uma no construtor para escolher o formulário.</p>}
      </Bloco>

      <Bloco titulo="Aparência ao compartilhar">
        <div className="cf-compartilhar">
          <div className="cf-campos">
            <label className="app-field">
              <span>Título no Google e no WhatsApp ({(r.root.titulo ?? "").length}/60)</span>
              <input value={r.root.titulo} onChange={(e) => root({ titulo: e.target.value })} placeholder={r.title} maxLength={90} />
            </label>
            <label className="app-field">
              <span>Descrição ({(r.root.descricao ?? "").length}/160)</span>
              <textarea rows={3} value={r.root.descricao} onChange={(e) => root({ descricao: e.target.value })} maxLength={240} />
            </label>
            <label className="app-field">
              <span>Imagem (endereço da imagem; vazio = imagem da Abertura)</span>
              <input value={r.root.imagemCompartilhamento} onChange={(e) => root({ imagemCompartilhamento: e.target.value })} placeholder="https://…" />
            </label>
          </div>
          <div className="cf-cartao" aria-label="Como o link aparece no WhatsApp">
            <div className="cf-cartao-img">{r.root.imagemCompartilhamento && /^(https?:|data:image)/.test(r.root.imagemCompartilhamento) ? <img src={r.root.imagemCompartilhamento} alt="" /> : <Icone nome="imagem" tamanho={28} />}</div>
            <div className="cf-cartao-txt">
              <strong>{titulo}</strong>
              <span>{r.root.descricao || "Sem descrição: o WhatsApp mostra só o título."}</span>
              <small>{urlFinal}</small>
            </div>
          </div>
        </div>
        <fieldset className="cf-radio">
          <legend>Quem encontra o evento</legend>
          <label>
            <input type="radio" name="indexar" checked={r.root.indexar !== false} onChange={() => root({ indexar: true })} />
            <span>
              <b>Evento aberto</b> · aparece no Google
            </span>
          </label>
          <label>
            <input type="radio" name="indexar" checked={r.root.indexar === false} onChange={() => root({ indexar: false })} />
            <span>
              <b>Evento fechado</b> · fora do Google, só quem tem o link
            </span>
          </label>
        </fieldset>
      </Bloco>

      <Bloco titulo="Responsáveis">
        <div className="cf-resp">
          {resp.map((n) => (
            <span key={n} className="cf-chip">
              {n}
              <button aria-label={`Tirar ${n}`} onClick={() => meta({ responsaveis: resp.filter((x) => x !== n) })}>
                <Icone nome="fechar" tamanho={13} />
              </button>
            </span>
          ))}
          <form
            className="cf-resp-novo"
            onSubmit={(e) => {
              e.preventDefault();
              const n = novoResp.trim();
              if (n && !resp.includes(n)) meta({ responsaveis: [...resp, n] });
              setNovoResp("");
            }}
          >
            <input list="cf-conhecidos" value={novoResp} onChange={(e) => setNovoResp(e.target.value)} placeholder="Nome de quem cuida da página" maxLength={60} aria-label="Adicionar responsável" />
            <datalist id="cf-conhecidos">
              {conhecidos.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            <button className="bt bt-p" type="submit">
              <Icone nome="mais" tamanho={15} />
              Adicionar
            </button>
          </form>
        </div>
      </Bloco>

      <Bloco titulo="Comunicação com o participante (simulada)">
        <div className="seg cf-seg" role="group" aria-label="Canal">
          {(
            [
              ["whatsapp", "WhatsApp"],
              ["email", "E-mail"],
              ["ambos", "WhatsApp e e-mail"],
            ] as const
          ).map(([v, t]) => (
            <button key={v} aria-pressed={r.com.canal === v} onClick={() => com({ canal: v })}>
              {t}
            </button>
          ))}
        </div>
        <div className="cf-msg">
          <label className="app-field">
            <span>Confirmação, logo depois da inscrição</span>
            <textarea rows={7} value={r.com.confirmacao} onChange={(e) => com({ confirmacao: e.target.value })} />
          </label>
          <BolhaWhats texto={textoConfirmacao(d.page, r.meta, exemplo, linkIngresso)} rotulo={`Como ${exemplo.nome.split(" ")[0]} recebe`} />
        </div>
        <p className="cf-ajuda">
          Use {"{nome}"}, {"{evento}"}, {"{data}"}, {"{local}"}, {"{codigo}"} e {"{ingresso}"}. *Entre asteriscos* vira negrito no WhatsApp.
        </p>
        <label className="cf-liga">
          <input type="checkbox" checked={r.com.lembreteAtivo} onChange={(e) => com({ lembreteAtivo: e.target.checked })} />
          <span>Mandar lembrete antes do evento</span>
          <select className="sel" value={r.com.lembreteHoras} onChange={(e) => com({ lembreteHoras: Number(e.target.value) })} disabled={!r.com.lembreteAtivo} aria-label="Quanto tempo antes">
            <option value={2}>2 horas antes</option>
            <option value={24}>1 dia antes</option>
            <option value={48}>2 dias antes</option>
            <option value={168}>1 semana antes</option>
          </select>
        </label>
        {r.com.lembreteAtivo && (
          <div className="cf-msg">
            <label className="app-field">
              <span>Lembrete</span>
              <textarea rows={4} value={r.com.lembrete} onChange={(e) => com({ lembrete: e.target.value })} />
            </label>
            <div>
              <BolhaWhats texto={textoLembrete(d.page, r.meta, exemplo, linkIngresso)} rotulo="Lembrete" />
              <p className="cf-quando">
                <Icone nome="relogio" tamanho={15} />
                {lembrete
                  ? `Sairia ${lembrete.toLocaleString("pt-BR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} para ${aReceber} ${aReceber === 1 ? "pessoa" : "pessoas"}.`
                  : "Sem data do evento na página: o lembrete não tem quando sair."}
              </p>
            </div>
          </div>
        )}
      </Bloco>

      <Bloco titulo="Medição">
        <div className="cf-grade">
          <label className="app-field">
            <span>Google Analytics 4 (ID de medição)</span>
            <input value={r.meta.ga4 ?? ""} onChange={(e) => meta({ ga4: e.target.value.trim() })} placeholder="G-XXXXXXXXXX" maxLength={20} />
          </label>
          <label className="app-field">
            <span>Pixel da Meta (ID)</span>
            <input value={r.meta.metaPixel ?? ""} onChange={(e) => meta({ metaPixel: e.target.value.replace(/\D/g, "") })} placeholder="123456789012345" inputMode="numeric" maxLength={20} />
          </label>
        </div>
        {r.meta.ga4 && !/^G-[A-Z0-9]{6,12}$/.test(r.meta.ga4) && <p className="app-err">O ID do GA4 começa com G- (ex.: G-AB12CD34EF).</p>}
        <p className="cf-ajuda">Na POC os códigos só ficam guardados. No projeto real entram na página publicada.</p>
      </Bloco>

      <Bloco titulo="Apagar">
        <div className="cf-perigo">
          <p className="app-muted">Arquivar tira a página do painel e encerra as inscrições, sem perder nada. Apagar não tem volta.</p>
          <button
            className="bt mn-perigo-bt"
            onClick={() => {
              if (!confirm(`Apagar "${d.page.title}"? Não dá para desfazer.`)) return;
              deletePage(d.page.id);
              go("/");
            }}
          >
            <Icone nome="lixo" tamanho={16} />
            Apagar página
          </button>
        </div>
      </Bloco>

      <div className="cf-barra" data-visivel={sujo || salvo || undefined} role="status">
        {salvo && !sujo ? (
          <span className="cf-ok">
            <Icone nome="check" tamanho={16} />
            Alterações salvas
          </span>
        ) : (
          <>
            <span>Há alterações não salvas.</span>
            <button className="bt bt-p" onClick={() => setR(base)}>
              Descartar
            </button>
            <button className="bt bt-pri bt-p" onClick={salvar}>
              Salvar alterações
            </button>
          </>
        )}
      </div>
    </div>
  );
}
