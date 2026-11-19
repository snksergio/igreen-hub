import type { CustomField } from "@puckeditor/core";
import { useId, useState } from "react";
import {
  camposNaPagina,
  cobra,
  dividirEtapas,
  getFormulario,
  listarFormularios,
  podeFicarNaPagina,
  ROTULO_TIPO,
  type AjusteSecao,
  type Campo,
  type Formulario,
} from "../../lib/formularios";
import { RotuloComAjuda } from "../../ui/Ajuda";
import { Icone } from "../../ui/Icone";
import { usePageCtx } from "../context";
import "./formulario.css";

const ESTILO = { conversa: "Conversa", formulario: "Etapas" } as const;
const naoPergunta = (c: Campo) => c.tipo === "etapa" || c.tipo === "oculto" || c.tipo === "info";

/** "6 perguntas · Conversa · gratuito" */
function resumo(f: Formulario) {
  const n = f.campos.filter((c) => !naoPergunta(c)).length;
  return [`${n} ${n === 1 ? "pergunta" : "perguntas"}`, ESTILO[f.estilo ?? "conversa"], cobra(f) ? "ingresso pago" : "gratuito"].join(" · ");
}

const simples = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Escolher o formulário da biblioteca (3.1) e abrir o construtor dele (3.2). */
function Escolher({ label, value, onChange }: { label: string; value: string | undefined; onChange: (v: string | undefined) => void }) {
  const { pageId } = usePageCtx();
  const nome = useId();
  const forms = listarFormularios();
  const f = forms.find((x) => x.id === value);
  const [trocando, setTrocando] = useState(false);
  const [busca, setBusca] = useState("");
  const achados = forms.filter((x) => simples(x.nome).includes(simples(busca.trim())));
  const pegar = (id: string | undefined) => {
    onChange(id);
    setTrocando(false);
    setBusca("");
  };

  return (
    <div className="ff">
      <RotuloComAjuda rotulo={label} />
      {f && !trocando ? (
        <div className="ff-ligado">
          <div className="ff-ligado-topo">
            <span className="ff-ic" aria-hidden="true">
              <Icone nome="formulario" tamanho={18} />
            </span>
            <span className="ff-ligado-txt">
              <small>
                <Icone nome="link" tamanho={12} /> Integrado a esta seção
              </small>
              <b>{f.nome}</b>
              <span>{resumo(f)}</span>
            </span>
          </div>
          <div className="ff-acoes">
            <a className="ff-bt" href={`#/formulario/${f.id}?pagina=${pageId}&voltar=editor`}>
              <Icone nome="lapis" tamanho={14} />
              Editar formulário
            </a>
            <button type="button" className="ff-bt-sec" onClick={() => setTrocando(true)}>
              <Icone nome="alternar" tamanho={14} />
              Trocar
            </button>
          </div>
        </div>
      ) : (
        <div className="ff-escolha">
          <p className="ff-resumo">{trocando ? "Escolha outro formulário para esta seção." : "Escolha qual formulário da biblioteca esta seção mostra."}</p>
          {forms.length > 5 && (
            <span className="ff-busca">
              <Icone nome="busca" tamanho={14} />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar formulário" aria-label="Buscar formulário" />
            </span>
          )}
          <div className="ff-opcoes" role="radiogroup" aria-label={label}>
            <label className="ff-op">
              <input type="radio" name={nome} checked={!value} onChange={() => pegar(undefined)} />
              <span>
                <b>Campos fixos da peça</b>
                <small>Nome, WhatsApp e e-mail, sem etapas nem regras</small>
              </span>
            </label>
            {achados.map((x) => (
              <label key={x.id} className="ff-op">
                <input type="radio" name={nome} checked={x.id === value} onChange={() => pegar(x.id)} />
                <span>
                  <b>{x.nome}</b>
                  <small>{resumo(x)}</small>
                </span>
              </label>
            ))}
            {busca && !achados.length && <p className="ff-resumo">Nenhum formulário com esse nome.</p>}
          </div>
          <div className="ff-rodape">
            {trocando && (
              <button type="button" className="ff-link" onClick={() => setTrocando(false)}>
                Cancelar
              </button>
            )}
            <a className="ff-link" href="#/formularios">
              <Icone nome="mais" tamanho={13} />
              Criar formulário
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function formularioField(label: string): CustomField<string | undefined> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange }) => <Escolher label={label} value={value} onChange={onChange} />,
  };
}

/** Nome curto do campo na lista: o aceite e o texto informativo têm rótulos longos. */
function nomeDoCampo(c: Campo | undefined) {
  if (!c) return "outro campo";
  if (c.tipo === "lgpd") return "Aceite de privacidade";
  const r = (c.rotulo || ROTULO_TIPO[c.tipo]).trim();
  return r.length > 48 ? `${r.slice(0, 46).trimEnd()}…` : r;
}

/**
 * Campos que aparecem nesta seção (o resto vai para a janela que abre ao enviar). Começa com o que
 * o formulário define; desmarcar ou marcar aqui só vale para esta seção.
 */
function CamposSecao({ formId, value, onChange }: { formId?: string; value: AjusteSecao | undefined; onChange: (v: AjusteSecao | undefined) => void }) {
  const f = getFormulario(formId);
  if (!f) return null;
  const ajuste = value && Object.keys(value).length ? value : undefined;
  const ficam = new Set(camposNaPagina(f, ajuste).map((c) => c.id));
  const etapas = dividirEtapas(f.campos)
    .map((e) => ({ ...e, campos: e.campos.filter(podeFicarNaPagina) }))
    .filter((e) => e.campos.length);
  const aqui = f.campos.filter((c) => ficam.has(c.id) && !naoPergunta(c)).length;
  const naJanela = f.campos.filter((c) => !ficam.has(c.id) && !naoPergunta(c)).length;

  const muda = (c: Campo, marcar: boolean) => {
    const n: AjusteSecao = { ...(ajuste ?? {}) };
    if (marcar === Boolean(c.naPagina)) delete n[c.id];
    else n[c.id] = marcar;
    onChange(Object.keys(n).length ? n : undefined);
  };

  return (
    <div className="ff">
      <RotuloComAjuda rotulo="Campos nesta seção" />
      <p className="ff-resumo">Desmarque o que não quer mostrar aqui. O campo continua no formulário: passa a ser perguntado na janela que abre ao enviar.</p>
      <div className="ff-campos">
        {etapas.map((e, i) => (
          <div key={i} className="ff-grupo" role="group" aria-label={etapas.length > 1 ? e.titulo : "Campos"}>
            {etapas.length > 1 && <span className="ff-etapa">{e.titulo}</span>}
            {e.campos.map((c) => {
              const marcado = ajuste?.[c.id] ?? Boolean(c.naPagina);
              const fica = ficam.has(c.id);
              const pai = c.condicao?.campo ? f.campos.find((x) => x.id === c.condicao!.campo) : undefined;
              const estado = fica ? "Aparece aqui" : marcado ? `Na janela: depende de “${nomeDoCampo(pai)}”` : "Na janela";
              return (
                <label key={c.id} className="ff-campo" data-fora={!fica || undefined}>
                  <input type="checkbox" checked={marcado} onChange={(ev) => muda(c, ev.target.checked)} />
                  <span className="ff-caixa" aria-hidden="true">
                    <Icone nome="check" tamanho={12} />
                  </span>
                  <span className="ff-campo-txt">
                    <b>{nomeDoCampo(c)}</b>
                    <small>
                      {estado}
                      {ajuste?.[c.id] !== undefined && <em> · só nesta seção</em>}
                    </small>
                  </span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
      <p className="ff-conta">
        {aqui === 0
          ? "Nenhuma pergunta aqui: o botão abre o formulário inteiro na janela."
          : `${aqui} ${aqui === 1 ? "pergunta aqui" : "perguntas aqui"}, ${naJanela} na janela.`}
      </p>
      {ajuste && (
        <button type="button" className="ff-link" onClick={() => onChange(undefined)}>
          <Icone nome="desfazer" tamanho={13} />
          Voltar ao que o formulário define
        </button>
      )}
    </div>
  );
}

export function camposSecaoField(formId: string | undefined): CustomField<AjusteSecao | undefined> {
  return {
    type: "custom",
    label: "Campos nesta seção",
    render: ({ value, onChange }) => <CamposSecao formId={formId} value={value} onChange={onChange} />,
  };
}
