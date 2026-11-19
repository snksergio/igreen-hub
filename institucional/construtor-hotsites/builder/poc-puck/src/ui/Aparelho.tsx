import { appBaseUrl } from "../router";
import "./aparelho.css";

export type IdAparelho = "computador" | "notebook" | "tablet" | "celular";

/** Tamanhos de tela da prévia (largura × altura da área visível, em px). */
export const APARELHOS: Record<IdAparelho, { nome: string; largura: number; altura: number; icone: "monitor" | "tablet" | "celular" }> = {
  computador: { nome: "Computador", largura: 1440, altura: 900, icone: "monitor" },
  notebook: { nome: "Notebook", largura: 1280, altura: 800, icone: "monitor" },
  tablet: { nome: "Tablet", largura: 768, altura: 1024, icone: "tablet" },
  celular: { nome: "Celular", largura: 390, altura: 844, icone: "celular" },
};

/**
 * Endereço da página no modo prévia (nada é gravado e ela se atualiza quando o construtor salva).
 * `extra`: parâmetros a mais, como os do licenciado ou `bloco` para mostrar só uma seção.
 */
export function enderecoPrevia(slug: string, extra?: URLSearchParams | Record<string, string>) {
  const q = new URLSearchParams(extra instanceof URLSearchParams ? extra : (extra ?? {}));
  q.set("previa", "1");
  return `${appBaseUrl()}#/p/${encodeURIComponent(slug)}?${q.toString()}`;
}

/**
 * A página dentro de uma tela do tamanho de um aparelho, reduzida para caber. A página roda de
 * verdade lá dentro (num iframe), então as regras de celular e tablet valem como no aparelho.
 */
export function Aparelho({
  id,
  src,
  escala,
  rotulo,
  recarga = 0,
}: {
  id: IdAparelho;
  src: string;
  escala: number;
  /** Texto embaixo da tela; sem ele, nada embaixo. */
  rotulo?: string;
  /** Mude o número para recarregar a página lá dentro. */
  recarga?: number;
}) {
  const a = APARELHOS[id];
  return (
    <figure className="ap" data-aparelho={id} style={{ width: a.largura * escala }}>
      <div className="ap-tela" style={{ width: a.largura * escala, height: a.altura * escala }}>
        <iframe
          key={recarga}
          src={src}
          title={`Prévia no ${a.nome.toLowerCase()} (${a.largura} × ${a.altura})`}
          style={{ width: a.largura, height: a.altura, transform: `scale(${escala})` }}
        />
      </div>
      {rotulo && <figcaption className="ap-rot">{rotulo}</figcaption>}
    </figure>
  );
}
