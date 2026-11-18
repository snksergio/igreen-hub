import type { ComponentConfig } from "@puckeditor/core";
import { formatarQuando } from "../../lib/tempo";
import { dataHoraField, daquiUmaSemana } from "../fields/DataHoraField";
import { fundoField, r, safeUrl, Section, travaPermissions, type Fundo } from "../ui";

/**
 * Data e endereço em campos separados: é isso que permite marcar o evento
 * para o Google (Event com startDate e PostalAddress) e mostrar a data por extenso sem erro.
 */
export type LocalProps = {
  titulo: string;
  inicio: string;
  duracaoMin: number;
  nomeLocal: string;
  endereco: string;
  cidade: string;
  uf: string;
  mapaUrl: string;
  fundo: Fundo;
  travado?: boolean;
};

export const Local: ComponentConfig<LocalProps> = {
  label: "Data e local",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    inicio: dataHoraField("Começa em (horário de Brasília)"),
    duracaoMin: { type: "number", label: "Duração em minutos", min: 15 },
    nomeLocal: { type: "text", label: "Nome do lugar" },
    endereco: { type: "text", label: "Rua e número (e bairro)" },
    cidade: { type: "text", label: "Cidade" },
    uf: { type: "text", label: "UF (ex.: MG)" },
    mapaUrl: { type: "text", label: "Link do mapa (vazio = busca o endereço)" },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Quando e onde",
    inicio: daquiUmaSemana(),
    duracaoMin: 120,
    nomeLocal: "Nome do lugar",
    endereco: "Rua, número, bairro",
    cidade: "Cidade",
    uf: "UF",
    mapaUrl: "",
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => {
    const quando = formatarQuando(p.inicio, p.duracaoMin);
    const enderecoCompleto = [p.endereco, [p.cidade, p.uf].filter(Boolean).join(", ")].filter(Boolean).join(" · ");
    const mapa =
      safeUrl(p.mapaUrl) ??
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.nomeLocal, enderecoCompleto].filter(Boolean).join(", "))}`;
    return (
      <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
        <div className="hs-local">
          <div {...r(1)}>
            <p className="hs-local__big">{quando.data || "Escolha a data"}</p>
            <p>{quando.hora}</p>
          </div>
          <address {...r(2)}>
            <p className="hs-local__big">{p.nomeLocal}</p>
            <p>{enderecoCompleto}</p>
            <a className="hs-link" href={mapa} target="_blank" rel="noopener noreferrer">
              Ver no mapa
            </a>
          </address>
        </div>
      </Section>
    );
  },
};
