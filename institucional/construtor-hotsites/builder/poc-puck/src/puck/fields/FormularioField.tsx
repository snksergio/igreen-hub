import type { CustomField } from "@puckeditor/core";
import { camposNaPagina, cobra, listarFormularios } from "../../lib/formularios";
import { usePageCtx } from "../context";
import "./formulario.css";

/** Escolher o formulário da biblioteca (3.1) e abrir o construtor dele (3.2). */
function Escolher({ label, value, onChange }: { label: string; value: string | undefined; onChange: (v: string | undefined) => void }) {
  const { pageId } = usePageCtx();
  const forms = listarFormularios();
  const f = forms.find((x) => x.id === value);
  return (
    <div className="ff">
      <span className="fi-rotulo">{label}</span>
      <select className="ff-sel" value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)} aria-label="Formulário">
        <option value="">Formulário fixo da peça (nome, WhatsApp, e-mail)</option>
        {forms.map((x) => (
          <option key={x.id} value={x.id}>
            {x.nome}
          </option>
        ))}
      </select>
      {f ? (
        <>
          <p className="ff-resumo">
            {camposNaPagina(f).length} campos na página, o resto abre em janela ao enviar. {cobra(f) ? "Com ingresso pago." : "Gratuito."}
          </p>
          <a className="ff-bt" href={`#/formulario/${f.id}?pagina=${pageId}&voltar=editor`}>
            Editar formulário
          </a>
        </>
      ) : (
        <p className="ff-resumo">
          Para ter etapas, regras, ingresso e escolher os campos, use um formulário da biblioteca.{" "}
          <a href="#/formularios">Criar formulário</a>
        </p>
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
