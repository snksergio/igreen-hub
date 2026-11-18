import type { CustomField } from "@puckeditor/core";
import { RotuloComAjuda } from "../../ui/Ajuda";

/** Data e hora no fuso de quem edita, guardada como "2026-12-04T20:00". */
export function dataHoraField(label: string): CustomField<string> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange }) => (
      <div className="fi-campo">
        <RotuloComAjuda rotulo={label} />
        <input
          className="fi-data"
          type="datetime-local"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    ),
  };
}

/** Uma semana à frente, às 19h: valor inicial razoável para uma contagem nova. */
export function daquiUmaSemana(): string {
  const d = new Date(Date.now() + 7 * 86400000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T19:00`;
}
