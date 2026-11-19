import { useState, type ReactNode } from "react";
import { ROTULO_STATUS, type StatusVisivel } from "../lib/meta";
import { qrSvg } from "../lib/qr";
import { ROTULO_INSCRICAO, ROTULO_PAGAMENTO, type StatusInscricao, type StatusPagamento } from "../lib/submissions";
import { Icone } from "../ui/Icone";

/* Pedaços pequenos que o painel, o espaço da página e o check-in repetem. */

/** Avatar pequeno com uma inicial só (régua do cartão do Kanban). */
export function Avatar({ nome, grande = false }: { nome: string; grande?: boolean }) {
  return (
    <span className={`av${grande ? " av-g" : ""}`} aria-hidden="true">
      {(nome.trim()[0] ?? "?").toUpperCase()}
    </span>
  );
}

export function ChipStatus({ status }: { status: StatusVisivel }) {
  return (
    <span className="ch" data-tom={status}>
      <i />
      {ROTULO_STATUS[status]}
    </span>
  );
}

export function ChipInscricao({ status }: { status: StatusInscricao }) {
  return (
    <span className="ch" data-tom={`i-${status}`}>
      <i />
      {ROTULO_INSCRICAO[status]}
    </span>
  );
}

export function ChipPagamento({ status }: { status: StatusPagamento }) {
  return (
    <span className="ch" data-tom={`p-${status}`}>
      <i />
      {ROTULO_PAGAMENTO[status]}
    </span>
  );
}

/** "186 de 250 vagas" com a barra; sem limite, só o número. */
export function Vagas({ inscritos, vagas, compacto = false }: { inscritos: number; vagas: number | null; compacto?: boolean }) {
  const pct = vagas ? Math.min(100, Math.round((inscritos / vagas) * 100)) : 0;
  return (
    <span className={`vg${compacto ? " vg-c" : ""}`}>
      <span className="vg-txt">
        <Icone nome="pessoas" tamanho={14} />
        <b>{inscritos.toLocaleString("pt-BR")}</b>
        {vagas ? (
          <>
            {" "}
            de {vagas.toLocaleString("pt-BR")} {compacto ? "" : "vagas"}
            <span className="vg-pct">{pct}%</span>
          </>
        ) : (
          <> {inscritos === 1 ? "inscrito" : "inscritos"}</>
        )}
      </span>
      {vagas ? (
        <span className="vg-barra" aria-hidden="true">
          <i style={{ width: `${pct}%` }} data-cheio={pct >= 100 || undefined} />
        </span>
      ) : null}
    </span>
  );
}

/** Botão que copia o texto e diz "Copiado". */
export function Copiar({ texto, rotulo = "Copiar", className = "bt bt-p" }: { texto: string; rotulo?: string; className?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
        } catch {
          window.prompt("Copie o texto:", texto);
        }
        setOk(true);
        setTimeout(() => setOk(false), 1600);
      }}
    >
      <Icone nome={ok ? "check" : "copiar"} tamanho={15} />
      {ok ? "Copiado" : rotulo}
    </button>
  );
}

/** QR code em SVG (escala sem perder nitidez). */
export function QrCode({ texto, tamanho = 160, rotulo }: { texto: string; tamanho?: number; rotulo?: string }) {
  const { lado, d } = qrSvg(texto);
  return (
    <svg className="qr" viewBox={`0 0 ${lado} ${lado}`} width={tamanho} height={tamanho} role="img" aria-label={rotulo ?? `QR code de ${texto}`} shapeRendering="crispEdges">
      <rect width={lado} height={lado} fill="#fff" />
      <path d={d} fill="#111" />
    </svg>
  );
}

/** Baixa o QR code como imagem SVG. */
export function baixarQr(texto: string, nome: string) {
  const { lado, d } = qrSvg(texto);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" width="${lado * 10}" height="${lado * 10}" shape-rendering="crispEdges"><rect width="${lado}" height="${lado}" fill="#fff"/><path d="${d}" fill="#111"/></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nome}.svg`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Número grande com rótulo (Visão geral e Resultados). */
export function Numero({ rotulo, valor, apoio }: { rotulo: string; valor: ReactNode; apoio?: ReactNode }) {
  return (
    <div className="nm">
      <span className="nm-rot">{rotulo}</span>
      <strong className="nm-val">{valor}</strong>
      {apoio && <span className="nm-apoio">{apoio}</span>}
    </div>
  );
}

/** Caixa com título, para agrupar um assunto dentro das abas. */
export function Bloco({
  titulo,
  descricao,
  acao,
  children,
  className = "",
}: {
  titulo?: ReactNode;
  /** Para que serve a seção, numa frase, embaixo do título. */
  descricao?: ReactNode;
  acao?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bl ${className}`}>
      {(titulo || acao) && (
        <header className="bl-topo">
          {titulo && <h2 className="bl-tit">{titulo}</h2>}
          {acao}
        </header>
      )}
      {descricao && <p className="bl-desc">{descricao}</p>}
      {children}
    </section>
  );
}
