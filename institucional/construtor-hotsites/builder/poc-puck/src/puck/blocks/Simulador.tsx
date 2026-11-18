import type { ComponentConfig } from "@puckeditor/core";
import { useState } from "react";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

/**
 * Peça especial: a lógica é do dev. O marketing só ajusta título e valores.
 * Nos hotsites reais cada simulador é diferente; este é o exemplo do conceito.
 */
export type SimuladorProps = {
  titulo: string;
  rotuloItem: string;
  valorPorItem: number;
  maximo: number;
  aviso: string;
  fundo: Fundo;
  travado?: boolean;
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function View(p: SimuladorProps) {
  const max = Math.max(1, Math.round(Number(p.maximo) || 1));
  const [n, setN] = useState(Math.round(max / 4));
  const qtd = Math.min(n, max);
  const mes = qtd * (Number(p.valorPorItem) || 0);
  return (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      {/* data-sim: o HTML estático liga o slider sem React. */}
      <div className="hs-sim" {...r(1)} data-sim-valor={Number(p.valorPorItem) || 0}>
        <label>
          <span>
            <strong data-sim="qtd">{qtd}</strong> {p.rotuloItem}
          </span>
          <input type="range" min={0} max={max} value={qtd} onChange={(e) => setN(Number(e.target.value))} data-sim="range" />
        </label>
        <div className="hs-sim__out" aria-live="polite">
          <div>
            <span className="hs-muted">Por mês</span>
            <strong data-sim="mes">{brl.format(mes)}</strong>
          </div>
          <div>
            <span className="hs-muted">Em 12 meses</span>
            <strong data-sim="ano">{brl.format(mes * 12)}</strong>
          </div>
        </div>
        {p.aviso && <p className="hs-muted hs-small">{p.aviso}</p>}
      </div>
    </Section>
  );
}

export const Simulador: ComponentConfig<SimuladorProps> = {
  label: "Simulador (peça especial)",
  fields: {
    titulo: { type: "text", label: "Título" },
    rotuloItem: { type: "text", label: "O que o slider conta (ex.: clientes conectados)" },
    valorPorItem: { type: "number", label: "Valor por item, em R$ por mês", min: 0 },
    maximo: { type: "number", label: "Máximo do slider", min: 1 },
    aviso: { type: "text", label: "Aviso abaixo do resultado" },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Simule sua renda recorrente",
    rotuloItem: "clientes conectados",
    valorPorItem: 20,
    maximo: 200,
    aviso: "Valores ilustrativos, não são garantia de ganho.",
    fundo: "escuro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
