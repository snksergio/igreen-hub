import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { rico, useLive, Valor } from "../../../live/ui";
import { useTokens } from "../../context";
import { travaPermissions } from "../../ui";

type Item = { valor: string; texto: string };
export type LiveNumerosProps = { titulo1: string; titulo2: string; itens: Item[]; travado?: boolean };

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });

/* Linhas grandes de número: contam ao aparecer e um filete verde corre pela linha. */
function View(p: LiveNumerosProps) {
  const t = useTokens();
  const ref = useLive<HTMLElement>("revelar contar");
  return (
    <div className="lv">
      <section className="secao" ref={ref} data-lv="revelar contar">
        <div className="wrap">
          <h2 className="h-grande revela" style={{ marginBottom: 30 }}>
            {t(p.titulo1)}
            {p.titulo2 && (
              <>
                <br />
                <span className="apagado">{t(p.titulo2)}</span>
              </>
            )}
          </h2>
          {p.itens.map((it, k) => (
            <div key={k} className="num-linha revela" {...i(k)}>
              <small>{String(k + 1).padStart(2, "0")}</small>
              <b>
                <Valor valor={it.valor} />
              </b>
              <p>{rico(it.texto)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export const LiveNumeros: ComponentConfig<LiveNumerosProps> = {
  label: "Números Live",
  fields: {
    titulo1: { type: "text", label: "Título, primeira linha" },
    titulo2: { type: "text", label: "Título, segunda linha (cinza)" },
    itens: {
      type: "array",
      label: "Números (use só os que a empresa já divulga)",
      arrayFields: {
        valor: { type: "text", label: "Número (+500 mil, 15%)" },
        texto: { type: "textarea", label: "Legenda (**negrito**)" },
      },
      defaultItemProps: { valor: "+100", texto: "legenda" },
      getItemSummary: (it) => it.valor || "Número",
      max: 5,
    },
  },
  defaultProps: {
    titulo1: "A iGreen",
    titulo2: "em números",
    itens: [
      { valor: "+500 mil", texto: "clientes com **energia limpa por assinatura**, sem obra e sem instalação." },
      { valor: "15%", texto: "de **economia média** na conta de luz, todo mês." },
      { valor: "+30 mil", texto: "**licenciados** levando a iGreen para todos os estados." },
    ],
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
