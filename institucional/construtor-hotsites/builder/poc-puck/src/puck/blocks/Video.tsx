import type { ComponentConfig } from "@puckeditor/core";
import { useState } from "react";
import { fundoField, r, safeUrl, Section, travaPermissions, type Fundo } from "../ui";

export type VideoProps = { titulo: string; url: string; fundo: Fundo; travado?: boolean };

/** Link do YouTube vira embed; qualquer outro link é tratado como arquivo de vídeo. */
export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

/**
 * Capa leve no lugar do player: o player do YouTube pesa centenas de KB e derruba a nota
 * de desempenho. Ele só carrega quando o visitante clica.
 */
function YouTube({ id, titulo }: { id: string; titulo: string }) {
  const [tocar, setTocar] = useState(false);
  if (tocar)
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={titulo || "Vídeo"}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  return (
    <button type="button" className="hs-video__capa" onClick={() => setTocar(true)} aria-label={`Assistir: ${titulo || "vídeo"}`}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" />
      <span className="hs-video__play" aria-hidden="true" />
    </button>
  );
}

export const Video: ComponentConfig<VideoProps> = {
  label: "Vídeo",
  fields: {
    titulo: { type: "text", label: "Título (opcional)" },
    url: { type: "text", label: "Link do vídeo (YouTube ou .mp4)" },
    fundo: fundoField,
  },
  defaultProps: { titulo: "", url: "", fundo: "escuro" },
  resolvePermissions: travaPermissions,
  render: (p) => {
    const yt = youtubeId(p.url ?? "");
    const src = safeUrl(p.url);
    return (
      <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
        <div className="hs-video" {...r(1, "zoom")} data-yt={yt ?? undefined}>
          {yt ? (
            <YouTube id={yt} titulo={p.titulo} />
          ) : src ? (
            <video src={src} controls playsInline preload="metadata" />
          ) : (
            <div className="hs-ph">Cole o link do vídeo</div>
          )}
        </div>
      </Section>
    );
  },
};
