import type { ComponentConfig } from "@puckeditor/core";
import { useEffect, useMemo, useState } from "react";
import { deBrasilia, gerarIcs, googleAgendaUrl, tempoRestante, type Compromisso } from "../../lib/tempo";
import { dataHoraField, daquiUmaSemana } from "../fields/DataHoraField";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

export type ContagemRegressivaProps = {
  titulo: string;
  quando: string;
  duracaoMin: number;
  local: string;
  textoAcabou: string;
  mostrarAgenda: boolean;
  fundo: Fundo;
  travado?: boolean;
};

function View(p: ContagemRegressivaProps) {
  const alvo = useMemo(() => deBrasilia(p.quando) ?? new Date(NaN), [p.quando]);
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const resto = tempoRestante(alvo, agora);
  const valido = !Number.isNaN(alvo.getTime());
  const compromisso: Compromisso = {
    titulo: p.titulo,
    inicio: alvo,
    duracaoMin: Number(p.duracaoMin) || 60,
    local: p.local,
    uid: `contagem-${p.quando}`,
  };
  // Link direto para o arquivo .ics: funciona sem JavaScript (e no HTML estático).
  const icsHref = useMemo(
    () => (valido ? `data:text/calendar;charset=utf-8,${encodeURIComponent(gerarIcs(compromisso))}` : ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valido, p.titulo, p.quando, p.duracaoMin, p.local]
  );
  const blocos: [number, string, string][] = [
    [resto.dias, "dias", "d"],
    [resto.horas, "horas", "h"],
    [resto.minutos, "min", "m"],
    [resto.segundos, "seg", "s"],
  ];

  return (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado} className="hs-count-sec">
      {!valido ? (
        <div className="hs-ph">Escolha a data e a hora do evento</div>
      ) : resto.acabou ? (
        <p className="hs-lead" {...r(1)}>
          {p.textoAcabou}
        </p>
      ) : (
        <div className="hs-count" role="timer" aria-live="off" data-alvo={alvo.toISOString()} data-acabou={p.textoAcabou}>
          {blocos.map(([n, rot, u], i) => (
            <div key={rot} className="hs-count__b" {...r(i + 1, "zoom")}>
              <strong data-u={u}>{String(n).padStart(2, "0")}</strong>
              <span>{rot}</span>
            </div>
          ))}
        </div>
      )}
      {valido && !resto.acabou && p.mostrarAgenda && (
        <div className="hs-count__acoes" {...r(5)}>
          <a className="hs-btn" href={icsHref} download="evento-igreen.ics">
            Adicionar à agenda
          </a>
          <a className="hs-link" href={googleAgendaUrl(compromisso)} target="_blank" rel="noopener noreferrer">
            Google Agenda
          </a>
        </div>
      )}
    </Section>
  );
}

export const ContagemRegressiva: ComponentConfig<ContagemRegressivaProps> = {
  label: "Contagem regressiva",
  fields: {
    titulo: { type: "text", label: "Título (também vira o nome na agenda)" },
    quando: dataHoraField("Data e hora do evento"),
    duracaoMin: { type: "number", label: "Duração em minutos", min: 15 },
    local: { type: "text", label: "Local ou link da transmissão" },
    textoAcabou: { type: "text", label: "Texto quando o horário passar" },
    mostrarAgenda: {
      type: "radio",
      label: "Botão Adicionar à agenda",
      options: [
        { label: "Mostrar", value: true },
        { label: "Esconder", value: false },
      ],
    },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Falta pouco",
    quando: daquiUmaSemana(),
    duracaoMin: 90,
    local: "",
    textoAcabou: "Já começou! Entre agora.",
    mostrarAgenda: true,
    fundo: "escuro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
