import type { CustomField } from "@puckeditor/core";
import { useRef, useState, type ChangeEvent } from "react";
import type { Arquivo } from "../../lib/arquivos";
import { importarHtml, textoColado, type Importado } from "../../lib/importarHtml";
import { prepararArquivo } from "./ArquivosField";

/**
 * Valor do campo: o pedido de importação (a peça aplica nos campos de código e limpa)
 * ou o resumo da última importação, para quem edita ver o que foi ajustado.
 */
export type Importacao =
  | { pendente: Importado & { arquivos: Arquivo[]; origem: string } }
  | { resumo: { origem: string; avisos: string[] } }
  | null;

const ehTexto = (f: File) => /\.(html?|css|m?js)$/i.test(f.name);

function Importar({ valor, onChange }: { valor: Importacao; onChange: (v: Importacao) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [colar, setColar] = useState(false);
  const [texto, setTexto] = useState("");
  const [msg, setMsg] = useState("");
  const [lendo, setLendo] = useState(false);
  const resumo = valor && "resumo" in valor ? valor.resumo : null;

  function aplicar(r: Importado, arquivos: Arquivo[], origem: string, extras: string[] = []) {
    onChange({ pendente: { ...r, avisos: [...extras, ...r.avisos], arquivos, origem } });
  }

  async function enviar(e: ChangeEvent<HTMLInputElement>) {
    const lista = [...(e.target.files ?? [])];
    e.target.value = "";
    if (!lista.length) return;
    setLendo(true);
    setMsg("");
    try {
      const htmls = lista.filter((f) => /\.html?$/i.test(f.name));
      const anexos: Record<string, string> = {};
      for (const f of lista.filter((f) => ehTexto(f) && !/\.html?$/i.test(f.name))) anexos[f.name] = await f.text();
      if (!htmls.length && !Object.keys(anexos).length) {
        setMsg("Envie o .html (ou .css/.js) junto com as imagens. Para só adicionar imagens, use “Arquivos da seção”.");
        return;
      }
      const extras: string[] = [];
      if (htmls.length > 1) extras.push(`Usei só ${htmls[0].name}: uma seção recebe um .html por vez.`);
      const arquivos: Arquivo[] = [];
      const renomear: Record<string, string> = {};
      for (const f of lista.filter((f) => !ehTexto(f))) {
        const r = await prepararArquivo(f, arquivos.map((a) => a.nome));
        if ("erro" in r) extras.push(r.erro);
        else {
          arquivos.push(r);
          renomear[f.name] = r.nome;
        }
      }
      const html = htmls[0] ? await htmls[0].text() : "";
      const origem = htmls[0]?.name ?? Object.keys(anexos).join(", ");
      aplicar(importarHtml(html, renomear, anexos), arquivos, origem, extras);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Não consegui ler esses arquivos.");
    } finally {
      setLendo(false);
    }
  }

  function importarColado() {
    aplicar(importarHtml(textoColado(texto)), [], "código colado");
    setTexto("");
    setColar(false);
  }

  return (
    <div className="fi-campo">
      <span className="fi-rotulo">Importar código da IA</span>
      <p className="gl-nota">
        Envie o <code>.html</code> que a IA gerou (com CSS e JavaScript dentro) e as imagens dele, tudo junto. Ou cole a
        resposta. Substitui o HTML, o CSS e o JavaScript abaixo.
      </p>
      <div className="fi-acoes">
        <button type="button" className="fi-btn fi-btn--pri" onClick={() => input.current?.click()} disabled={lendo}>
          {lendo ? "Lendo…" : "Enviar arquivos"}
        </button>
        <button type="button" className="fi-btn" onClick={() => setColar((c) => !c)} aria-expanded={colar}>
          Colar código
        </button>
      </div>
      <input
        ref={input}
        type="file"
        multiple
        hidden
        accept=".html,.htm,.css,.js,.mjs,text/html,text/css,text/javascript,image/*,application/pdf"
        onChange={enviar}
      />
      {colar && (
        <div className="imp-colar">
          <textarea
            className="fi-codigo"
            rows={6}
            spellCheck={false}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Cole aqui o .html inteiro ou a resposta da IA com os blocos de HTML, CSS e JavaScript"
          />
          <button type="button" className="fi-btn fi-btn--pri" onClick={importarColado} disabled={!texto.trim()}>
            Importar
          </button>
        </div>
      )}
      {msg && <p className="fi-msg">{msg}</p>}
      {resumo && (
        <div className="imp-resumo" role="status">
          <strong>Importado: {resumo.origem}</strong>
          {resumo.avisos.length ? (
            <ul>
              {resumo.avisos.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          ) : (
            <span>Sem ajustes: entrou do jeito que veio.</span>
          )}
        </div>
      )}
    </div>
  );
}

export const importarField: CustomField<Importacao> = {
  type: "custom",
  label: "Importar código da IA",
  render: ({ value, onChange }) => <Importar valor={value ?? null} onChange={onChange} />,
};
