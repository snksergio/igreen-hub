import type { ComponentConfig } from "@puckeditor/core";
import { Fragment } from "react";
import { Icone, ICONES_FAIXA } from "../../../live/ui";
import { travaPermissions } from "../../ui";

type Item = { texto: string; icone: string };
export type LiveFaixaProps = { itens: Item[]; travado?: boolean };

/*
 * Dois grupos iguais andam juntos a largura de um grupo, então o loop nunca abre buraco.
 * Cada grupo repete a lista até ter uns 14 nomes, para ficar mais largo que qualquer tela.
 */
function View({ itens }: LiveFaixaProps) {
  const lista = itens.filter((it) => it.texto);
  if (!lista.length) return null;
  const voltas = Math.max(2, Math.ceil(14 / lista.length));
  const grupo = (oculto: boolean) => (
    <div className="faixa-grupo" aria-hidden={oculto || undefined}>
      {Array.from({ length: voltas }, (_, v) =>
        lista.map((it, k) => (
          <Fragment key={`${v}-${k}`}>
            <span aria-hidden={v > 0 || undefined}>{it.texto}</span>
            <Icone nome={it.icone} className="" />
          </Fragment>
        ))
      )}
    </div>
  );
  return (
    <div className="lv">
      <section className="faixa" aria-label="Soluções iGreen">
        <div className="faixa-trilho">
          {grupo(false)}
          {grupo(true)}
        </div>
      </section>
    </div>
  );
}

export const LiveFaixa: ComponentConfig<LiveFaixaProps> = {
  label: "Faixa Live",
  fields: {
    itens: {
      type: "array",
      label: "Nomes que correm (cada um com o seu ícone depois)",
      arrayFields: {
        texto: { type: "text", label: "Nome" },
        icone: { type: "select", label: "Ícone depois do nome", options: ICONES_FAIXA },
      },
      defaultItemProps: { texto: "Solução", icone: "raio" },
      getItemSummary: (it) => it.texto || "Nome",
      max: 12,
    },
  },
  defaultProps: {
    itens: [
      { texto: "Conexão Green", icone: "raio" },
      { texto: "iGreen Telecom", icone: "sinal" },
      { texto: "Conexão Mobi", icone: "carro" },
      { texto: "Solis", icone: "sol" },
      { texto: "iGreen Seguros", icone: "escudo" },
      { texto: "iGreen Club", icone: "estrela" },
      { texto: "Energia por assinatura", icone: "tomada" },
    ],
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
