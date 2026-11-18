import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { BotaoLima, Icone, listaDeTexto, useLive } from "../../../live/ui";
import { useTokens } from "../../context";
import { dataHoraField } from "../../fields/DataHoraField";
import { ctaFields, safeUrl, travaPermissions, type CtaProps } from "../../ui";
import { isoBrasilia, partesData } from "./comum";

export type LiveLocalProps = CtaProps & {
  etiqueta: string;
  titulo: string;
  inicio: string;
  duracaoMin: number;
  dataTexto: string;
  horario: string;
  horarioDetalhe: string;
  nomeLocal: string;
  endereco: string;
  cidade: string;
  uf: string;
  chips: string;
  linkMapa: string;
  pinoTitulo: string;
  pinoDetalhe: string;
  avenida: string;
  estacao: string;
  estacaoDetalhe: string;
  travado?: boolean;
};

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });
const ICONES_CHIP = ["carro", "acesso", "ok"];

/*
 * Mapa ilustrado do entorno (desenho fixo, só os nomes mudam): ruas em dois ângulos, avenida e
 * anel com nome, córrego, parque, o pavilhão aceso e a rota a pé desde a estação. O local fica no
 * centro exato do desenho, então o pino (HTML) e o SVG coincidem em qualquer proporção.
 */
function MapaIlustrado({ avenida, estacao, estacaoDetalhe }: { avenida: string; estacao: string; estacaoDetalhe: string }) {
  return (
    <svg className="mapa-svg" viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="lv-ruas-a" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)"><path d="M0 0H42M0 0V42" fill="none" stroke="rgba(243,246,236,0.06)" strokeWidth="1.5" /></pattern>
        <pattern id="lv-ruas-b" width="34" height="58" patternUnits="userSpaceOnUse" patternTransform="rotate(16)"><path d="M0 0H34M0 0V58" fill="none" stroke="rgba(243,246,236,0.055)" strokeWidth="1.4" /></pattern>
        <pattern id="lv-arvores" width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="6.5" cy="6.5" r="1.7" fill="rgba(168,255,53,0.28)" /></pattern>
        <radialGradient id="lv-mapa-luz"><stop offset="0" stopColor="#a8ff35" stopOpacity="0.2" /><stop offset="1" stopColor="#a8ff35" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="800" height="560" fill="url(#lv-ruas-a)" />
      <path d="M486 300C470 200 480 120 500-40H840V168C650 236 560 280 486 300Z" fill="#06110a" />
      <path d="M486 300C470 200 480 120 500-40H840V168C650 236 560 280 486 300Z" fill="url(#lv-ruas-b)" />
      <path d="M96 420C130 372 230 372 262 420C290 462 236 520 168 512C110 506 70 462 96 420Z" fill="rgba(168,255,53,0.06)" stroke="rgba(168,255,53,0.2)" strokeWidth="1.2" />
      <path d="M96 420C130 372 230 372 262 420C290 462 236 520 168 512C110 506 70 462 96 420Z" fill="url(#lv-arvores)" />
      <text x="178" y="450" textAnchor="middle" className="lugar">Parque</text>
      <path d="M-40 352C120 340 230 300 330 340S520 420 840 380" fill="none" stroke="rgba(0,168,89,0.32)" strokeWidth="5" strokeLinecap="round" />
      <path d="M-40 190C200 200 420 170 840 250" fill="none" stroke="rgba(243,246,236,0.08)" strokeWidth="8" />
      <path d="M230-40C250 150 270 300 330 600" fill="none" stroke="rgba(243,246,236,0.07)" strokeWidth="7" />
      <path d="M500-40C480 120 470 200 486 300" fill="none" stroke="rgba(243,246,236,0.08)" strokeWidth="7" />
      <path id="lv-av" d="M-40 520C140 450 290 362 404 326S650 236 840 168" fill="none" stroke="rgba(243,246,236,0.14)" strokeWidth="14" strokeLinecap="round" />
      <path d="M-40 520C140 450 290 362 404 326S650 236 840 168" fill="none" stroke="rgba(6,17,10,0.7)" strokeWidth="1" strokeDasharray="8 8" />
      <path id="lv-anel" d="M600 600C560 480 548 380 600 290S720 120 700-40" fill="none" stroke="rgba(243,246,236,0.17)" strokeWidth="18" />
      <path d="M600 600C560 480 548 380 600 290S720 120 700-40" fill="none" stroke="rgba(6,17,10,0.85)" strokeWidth="1.2" strokeDasharray="12 10" />
      {avenida && (
        <text className="rua-nome" dy="3.5">
          <textPath href="#lv-av" startOffset="58%">{avenida.toUpperCase()}</textPath>
        </text>
      )}
      <text className="rua-nome" dy="3.5">
        <textPath href="#lv-anel" startOffset="20%">ANEL RODOVIÁRIO</textPath>
      </text>
      <circle cx="400" cy="280" r="200" fill="url(#lv-mapa-luz)" />
      <rect x="340" y="233" width="120" height="70" rx="10" transform="rotate(-18 400 268)" fill="rgba(168,255,53,0.13)" stroke="rgba(168,255,53,0.6)" strokeWidth="1.5" />
      {estacao && (
        <>
          <path className="rota" d="M300 392C330 370 352 352 372 330S392 304 398 292" fill="none" stroke="#a8ff35" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="1 8" />
          <circle cx="300" cy="392" r="12" fill="#06110a" stroke="rgba(243,246,236,0.55)" strokeWidth="1.4" />
          <text x="300" y="396.5" textAnchor="middle" className="lugar" style={{ fontWeight: 600 }}>M</text>
          <text x="300" y="424" textAnchor="middle" className="lugar">{estacao}</text>
          {estacaoDetalhe && <text x="300" y="441" textAnchor="middle" className="lugar-lima">{estacaoDetalhe.toUpperCase()}</text>}
        </>
      )}
    </svg>
  );
}

function View(p: LiveLocalProps) {
  const t = useTokens();
  const ref = useLive<HTMLElement>("revelar relogio");
  const data = partesData(p.inicio);
  const enderecoCompleto = [p.endereco, [p.cidade, p.uf].filter(Boolean).join(", ")].filter(Boolean).join(" · ");
  const mapa = safeUrl(p.linkMapa) ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.nomeLocal, p.endereco, p.cidade, p.uf].filter(Boolean).join(", "))}`;
  return (
    <div className="lv">
      <section className="secao" id="local" ref={ref} data-lv="revelar relogio">
        <div className="wrap">
          <div className="cabeca">
            {p.etiqueta && (
              <span className="etiqueta">
                <i />
                {p.etiqueta}
              </span>
            )}
            <h2 className="h-grande revela">{t(p.titulo)}</h2>
          </div>
          <div className="local">
            <div className="mapa revela" role="img" aria-label={`Mapa ilustrativo do entorno de ${p.pinoTitulo || p.nomeLocal}`}>
              <MapaIlustrado avenida={p.avenida} estacao={p.estacao} estacaoDetalhe={p.estacaoDetalhe} />
              <span className="pontos-base" />
              <span className="pontos" />
              <div className="pino">
                <span className="rotulo vidro">
                  <b>{p.pinoTitulo}</b>
                  {p.pinoDetalhe && <span>{p.pinoDetalhe}</span>}
                </span>
                <span className="ponto" />
              </div>
              <div className="zoom vidro" aria-hidden="true">
                <span><Icone nome="mais" /></span>
                <span><Icone nome="menos" /></span>
              </div>
            </div>
            <div className="info card revela" {...i(1)}>
              <div className="info-data">
                {data && (
                  <span className="dia">
                    <b>{data.dia}</b>
                    <small>{data.mes}</small>
                  </span>
                )}
                <p>
                  <b>{p.dataTexto}</b>
                  {data && (
                    <span>
                      Faltam <strong data-alvo={isoBrasilia(p.inicio)} data-u="dias">{data.faltam}</strong> dias
                    </span>
                  )}
                </p>
              </div>
              <ul className="info-linhas">
                <li>
                  <span className="circ"><Icone nome="relogio" /></span>
                  <div>
                    <small>Horário</small>
                    <b>{p.horario}</b>
                    {p.horarioDetalhe && <span>{p.horarioDetalhe}</span>}
                  </div>
                </li>
                <li>
                  <span className="circ"><Icone nome="pin" /></span>
                  <div>
                    <small>Endereço</small>
                    <b>{p.nomeLocal}</b>
                    <span>{enderecoCompleto}</span>
                  </div>
                </li>
              </ul>
              {listaDeTexto(p.chips).length > 0 && (
                <div className="info-chips">
                  {listaDeTexto(p.chips).map((c, k) => (
                    <span key={c}>
                      <Icone nome={ICONES_CHIP[k % ICONES_CHIP.length]} />
                      {c}
                    </span>
                  ))}
                </div>
              )}
              <div className="acoes">
                <BotaoLima {...p} />
                <a className="btn-fantasma" href={mapa} target="_blank" rel="noopener noreferrer">
                  Abrir no mapa
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const LiveLocal: ComponentConfig<LiveLocalProps> = {
  label: "Local Live",
  fields: {
    etiqueta: { type: "text", label: "Selo" },
    titulo: { type: "text", label: "Título" },
    inicio: dataHoraField("Começa em (horário de Brasília)"),
    duracaoMin: { type: "number", label: "Duração em minutos (para o Google)" },
    dataTexto: { type: "text", label: "Data por extenso" },
    horario: { type: "text", label: "Horário (19h às 22h)" },
    horarioDetalhe: { type: "text", label: "Detalhe do horário" },
    nomeLocal: { type: "text", label: "Nome do local" },
    endereco: { type: "text", label: "Endereço (rua, número e bairro)" },
    cidade: { type: "text", label: "Cidade" },
    uf: { type: "text", label: "UF" },
    chips: { type: "text", label: "Facilidades, separadas por vírgula" },
    ...ctaFields,
    linkMapa: { type: "text", label: "Link do mapa (vazio = busca o endereço no Google Maps)" },
    pinoTitulo: { type: "text", label: "Mapa: nome no pino" },
    pinoDetalhe: { type: "text", label: "Mapa: detalhe no pino" },
    avenida: { type: "text", label: "Mapa: nome da avenida desenhada" },
    estacao: { type: "text", label: "Mapa: estação ou ponto de referência (vazio = sem rota)" },
    estacaoDetalhe: { type: "text", label: "Mapa: tempo a pé" },
  },
  defaultProps: {
    etiqueta: "Entrada gratuita",
    titulo: "Onde e quando",
    inicio: "2026-12-12T19:00",
    duracaoMin: 180,
    dataTexto: "Sábado, 12 de dezembro",
    horario: "19h às 22h",
    horarioDetalhe: "Credenciamento a partir das 18h30",
    nomeLocal: "Expominas · Auditório 2",
    endereco: "Av. Amazonas, 6200 · Gameleira",
    cidade: "Belo Horizonte",
    uf: "MG",
    chips: "Estacionamento no local, Acessível",
    botaoTexto: "Garantir vaga",
    destino: "inscricao",
    link: "",
    mensagemWhats: "",
    linkMapa: "",
    pinoTitulo: "Expominas",
    pinoDetalhe: "Auditório 2",
    avenida: "Av. Amazonas",
    estacao: "Metrô Gameleira",
    estacaoDetalhe: "6 min a pé",
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
