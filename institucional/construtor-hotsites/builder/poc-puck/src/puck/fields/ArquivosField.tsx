import type { CustomField } from "@puckeditor/core";
import { useRef, useState, type ChangeEvent } from "react";
import { nomeDeArquivo, type Arquivo } from "../../lib/arquivos";
import { addImagem, AMOSTRAS, listImagens, type Imagem } from "../../lib/imagens";
import { comprimir } from "./ImagemField";

const LIMITE_IMAGEM_MB = 15;
const LIMITE_PDF_MB = 1;

const ehImagem = (a: Arquivo) => a.src.startsWith("data:image/") || /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(a.src);

/** Código pronto para colar no HTML da seção. */
const trecho = (a: Arquivo) =>
  ehImagem(a)
    ? `<img src="arquivo:${a.nome}" alt="descreva a imagem" loading="lazy" style="aspect-ratio: 4 / 3; width: 100%; object-fit: cover;">`
    : `<a class="hs-link" href="arquivo:${a.nome}" download>Baixar ${a.nome}</a>`;

function extensaoDe(src: string): string {
  const m = src.match(/^data:image\/(\w+)/) ?? src.match(/\.(\w{3,4})(?:\?|$)/);
  return (m?.[1] ?? "img").replace("jpeg", "jpg").toLowerCase();
}

/**
 * Prepara um arquivo enviado para a seção: imagem é reduzida (e vai para a biblioteca),
 * PDF entra como está, até o limite. `usados` evita repetir nome.
 */
export async function prepararArquivo(f: File, usados: string[]): Promise<Arquivo | { erro: string }> {
  if (f.type.startsWith("image/")) {
    if (f.size > LIMITE_IMAGEM_MB * 1024 * 1024) return { erro: `${f.name} passa de ${LIMITE_IMAGEM_MB} MB.` };
    const src = await comprimir(f);
    addImagem(f.name, src); // também fica na biblioteca, para outras peças
    return { nome: nomeDeArquivo(f.name, extensaoDe(src), usados), src };
  }
  if (f.type === "application/pdf") {
    if (f.size > LIMITE_PDF_MB * 1024 * 1024)
      return { erro: `${f.name}: PDF até ${LIMITE_PDF_MB} MB na POC (o navegador guarda pouco).` };
    const src = await new Promise<string>((ok, falha) => {
      const r = new FileReader();
      r.onload = () => ok(String(r.result));
      r.onerror = () => falha(new Error("Não consegui ler o PDF."));
      r.readAsDataURL(f);
    });
    return { nome: nomeDeArquivo(f.name, "pdf", usados), src };
  }
  return { erro: `${f.name}: envie imagem (JPG, PNG, WebP) ou PDF.` };
}

function Copiar({ texto, rotulo }: { texto: string; rotulo: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="gl-copiar"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          setOk(false);
        }
      }}
    >
      {ok ? "copiado" : rotulo}
    </button>
  );
}

function Arquivos({ lista, onChange }: { lista: Arquivo[]; onChange: (v: Arquivo[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [bib, setBib] = useState(false);
  const nomes = lista.map((a) => a.nome);

  async function enviar(e: ChangeEvent<HTMLInputElement>) {
    const arquivos = [...(e.target.files ?? [])];
    e.target.value = "";
    if (!arquivos.length) return;
    setEnviando(true);
    setMsg("");
    const novos: Arquivo[] = [];
    try {
      for (const f of arquivos) {
        const r = await prepararArquivo(f, [...nomes, ...novos.map((n) => n.nome)]);
        if ("erro" in r) setMsg(r.erro);
        else novos.push(r);
      }
      if (novos.length) onChange([...lista, ...novos]);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Não consegui usar esse arquivo.");
    } finally {
      setEnviando(false);
    }
  }

  function daBiblioteca(img: Imagem) {
    onChange([...lista, { nome: nomeDeArquivo(img.nome, extensaoDe(img.src), nomes), src: img.src }]);
    setBib(false);
  }

  const listaParaIA = lista.length
    ? `Arquivos disponíveis nesta seção (use exatamente estes nomes):\n${lista
        .map((a) => `- arquivo:${a.nome} (${ehImagem(a) ? "imagem" : "PDF para download"})`)
        .join("\n")}`
    : "";

  return (
    <div className="fi-campo">
      <span className="fi-rotulo">Arquivos da seção (imagens e PDF)</span>
      <p className="gl-nota">
        Envie e use no código pelo nome: <code>src="arquivo:nome.webp"</code>. Imagens são reduzidas sozinhas.
      </p>
      <div className="fi-acoes">
        <button type="button" className="fi-btn fi-btn--pri" onClick={() => input.current?.click()} disabled={enviando}>
          {enviando ? "Preparando…" : "Enviar arquivos"}
        </button>
        <button type="button" className="fi-btn" onClick={() => setBib((b) => !b)} aria-expanded={bib}>
          Da biblioteca
        </button>
      </div>
      <input ref={input} type="file" accept="image/*,application/pdf" multiple hidden onChange={enviar} />
      {bib && (
        <div className="fi-bib">
          <div className="fi-grade">
            {[...listImagens(), ...AMOSTRAS].map((i) => (
              <button key={i.id} type="button" className="fi-op" title={i.nome} onClick={() => daBiblioteca(i)}>
                <img src={i.src} alt={i.nome} />
              </button>
            ))}
          </div>
        </div>
      )}
      {msg && <p className="fi-msg">{msg}</p>}
      {lista.length > 0 && (
        <ul className="arq-lista">
          {lista.map((a) => (
            <li key={a.nome}>
              {ehImagem(a) ? <img src={a.src} alt="" /> : <span className="arq-pdf">PDF</span>}
              <code>arquivo:{a.nome}</code>
              <span className="arq-acoes">
                <Copiar texto={trecho(a)} rotulo={ehImagem(a) ? "copiar <img>" : "copiar link"} />
                <button type="button" className="gl-copiar arq-x" onClick={() => onChange(lista.filter((x) => x.nome !== a.nome))}>
                  remover
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {listaParaIA && <Copiar texto={listaParaIA} rotulo="copiar lista para a IA" />}
    </div>
  );
}

export const arquivosField: CustomField<Arquivo[]> = {
  type: "custom",
  label: "Arquivos da seção",
  render: ({ value, onChange }) => <Arquivos lista={Array.isArray(value) ? value : []} onChange={onChange} />,
};
