import type { CustomField } from "@puckeditor/core";
import { useState } from "react";
import { CLASSES, guiaParaIA, MOVIMENTO, TOKENS } from "../guia";
import { RotuloComAjuda } from "../../ui/Ajuda";

/** Caixa de código: fonte monoespaçada, sem corretor e com Tab inserindo espaços. */
export function codigoField(label: string, dica: string, linhas = 10): CustomField<string> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange }) => (
      <div className="fi-campo">
        <RotuloComAjuda rotulo={label} />
        <textarea
          className="fi-codigo"
          rows={linhas}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          value={value ?? ""}
          placeholder={dica}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Tab") return;
            e.preventDefault();
            const t = e.currentTarget;
            const ini = t.selectionStart;
            const novo = `${t.value.slice(0, ini)}  ${t.value.slice(t.selectionEnd)}`;
            onChange(novo);
            requestAnimationFrame(() => t.setSelectionRange(ini + 2, ini + 2));
          }}
        />
      </div>
    ),
  };
}

function Copiar({ texto, rotulo }: { texto: string; rotulo: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="gl-copiar"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          setOk(false);
        }
      }}
      aria-label={`Copiar ${rotulo}`}
    >
      {ok ? "copiado" : "copiar"}
    </button>
  );
}

function PainelGuia() {
  const [pedido, setPedido] = useState("");
  return (
    <div className="gl">
      <span className="fi-rotulo">Padrões da iGreen</span>
      <p className="gl-nota">Use como apoio, sem ficar preso. O container e o fundo já vêm prontos.</p>

      <details>
        <summary>Cores e medidas (tokens)</summary>
        <ul className="gl-lista">
          {TOKENS.map((t) => (
            <li key={t.token}>
              <span className="gl-cor" style={{ background: `var(${t.token})` }} aria-hidden="true" />
              <code>var({t.token})</code>
              <span className="gl-uso">{t.uso}</span>
              <Copiar texto={`var(${t.token})`} rotulo={t.token} />
            </li>
          ))}
        </ul>
      </details>

      <details>
        <summary>Classes prontas</summary>
        <ul className="gl-lista">
          {CLASSES.map((c) => (
            <li key={c.classe}>
              <code>.{c.classe}</code>
              <span className="gl-uso">{c.uso}</span>
              <Copiar texto={c.classe} rotulo={c.classe} />
            </li>
          ))}
        </ul>
      </details>

      <details>
        <summary>Movimento ao rolar</summary>
        <ul className="gl-lista">
          {MOVIMENTO.map((m) => (
            <li key={m.codigo}>
              <code>{m.codigo}</code>
              <span className="gl-uso">{m.uso}</span>
              <Copiar texto={m.codigo} rotulo={m.codigo} />
            </li>
          ))}
        </ul>
      </details>

      <div className="gl-ia">
        <label className="fi-campo">
          <span className="fi-rotulo">Pedido para a IA (opcional)</span>
          <textarea
            className="fi-codigo"
            rows={3}
            value={pedido}
            onChange={(e) => setPedido(e.target.value)}
            placeholder="Ex.: seção com os 3 modelos de eletroposto lado a lado e um botão para o WhatsApp"
          />
        </label>
        <Copiar texto={guiaParaIA(pedido)} rotulo="guia para IA" />
        <p className="gl-nota">
          <strong>Copiar guia para IA:</strong> cole numa IA (Claude, ChatGPT…). Ela devolve um arquivo .html no padrão:
          envie em “Importar código da IA”, junto com as imagens dele.
        </p>
      </div>
    </div>
  );
}

/** Campo só de leitura com o guia de padrões e o botão de copiar o texto para IA. */
export const guiaField: CustomField<string> = {
  type: "custom",
  label: "Padrões e guia para IA",
  render: () => <PainelGuia />,
};
