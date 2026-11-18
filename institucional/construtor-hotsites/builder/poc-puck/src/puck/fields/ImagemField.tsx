import type { CustomField } from "@puckeditor/core";
import { useRef, useState, type ChangeEvent } from "react";
import { addImagem, AMOSTRAS, listImagens, safeImg, type Imagem } from "../../lib/imagens";

const LIMITE_MB = 15;

/** Reduz para no máximo 1600 px no maior lado e converte para WebP (ou JPEG), para caber no navegador. */
export async function comprimir(file: File, maxLado = 1600, qualidade = 0.82): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, falha) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = () => falha(new Error("Não consegui abrir essa imagem."));
      i.src = url;
    });
    const escala = Math.min(1, maxLado / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round((img.naturalWidth || maxLado) * escala));
    c.height = Math.max(1, Math.round((img.naturalHeight || maxLado) * escala));
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    const webp = c.toDataURL("image/webp", qualidade);
    return webp.startsWith("data:image/webp") ? webp : c.toDataURL("image/jpeg", qualidade);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function Seletor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [aberto, setAberto] = useState(false);
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [biblioteca, setBiblioteca] = useState<Imagem[]>(() => listImagens());
  const atual = safeImg(value);

  async function enviar(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setMsg("Escolha um arquivo de imagem (JPG, PNG, WebP).");
    if (f.size > LIMITE_MB * 1024 * 1024) return setMsg(`A imagem passa de ${LIMITE_MB} MB.`);
    setEnviando(true);
    setMsg("");
    try {
      const src = await comprimir(f);
      const salva = addImagem(f.name, src);
      if (!salva) setMsg("Usei a imagem, mas o navegador está sem espaço para guardá-la na biblioteca.");
      setBiblioteca(listImagens());
      onChange(src);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Não consegui usar essa imagem.");
    } finally {
      setEnviando(false);
    }
  }

  function usarLink() {
    const ok = safeImg(link.trim());
    if (!ok) return setMsg("O link precisa começar com https://");
    setMsg("");
    onChange(ok);
    setLink("");
  }

  const grade = (titulo: string, itens: Imagem[]) =>
    itens.length > 0 && (
      <div className="fi-grupo">
        <span className="fi-sub">{titulo}</span>
        <div className="fi-grade">
          {itens.map((i) => (
            <button
              key={i.id}
              type="button"
              className="fi-op"
              data-on={i.src === value}
              title={i.nome}
              onClick={() => {
                onChange(i.src);
                setAberto(false);
              }}
            >
              <img src={i.src} alt={i.nome} />
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div className="fi-campo">
      <span className="fi-rotulo">{label}</span>
      <div className="fi">
        <div className="fi-prev">{atual ? <img src={atual} alt="" /> : <span>Sem imagem</span>}</div>
        <div className="fi-acoes">
          <button type="button" className="fi-btn fi-btn--pri" onClick={() => fileRef.current?.click()} disabled={enviando}>
            {enviando ? "Preparando…" : "Enviar do computador"}
          </button>
          <button type="button" className="fi-btn" onClick={() => setAberto((a) => !a)} aria-expanded={aberto}>
            Biblioteca
          </button>
          {atual && (
            <button type="button" className="fi-btn fi-btn--x" onClick={() => onChange("")}>
              Remover
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={enviar} />
        {aberto && (
          <div className="fi-bib">
            {grade("Suas imagens", biblioteca)}
            {grade("Imagens iGreen", AMOSTRAS)}
          </div>
        )}
        <details className="fi-link">
          <summary>Usar um link</summary>
          <div className="fi-linha">
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" />
            <button type="button" className="fi-btn" onClick={usarLink}>
              Usar
            </button>
          </div>
        </details>
        {msg && <p className="fi-msg">{msg}</p>}
      </div>
    </div>
  );
}

/** Campos de imagem criados aqui: a aba Imagens do editor aplica a imagem escolhida neles. */
export const CAMPOS_IMAGEM = new WeakSet<object>();

/** Campo de imagem: enviar do computador, escolher da biblioteca ou colar link. */
export function imagemField(label: string): CustomField<string> {
  const campo: CustomField<string> = {
    type: "custom",
    label,
    render: ({ value, onChange }) => <Seletor label={label} value={value ?? ""} onChange={onChange} />,
  };
  CAMPOS_IMAGEM.add(campo);
  return campo;
}
