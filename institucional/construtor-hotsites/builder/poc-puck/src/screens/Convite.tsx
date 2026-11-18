import { useMemo, useState } from "react";
import { getPageBySlug } from "../lib/pages";
import { buildInviteLink, parsePersona } from "../lib/persona";
import { appBaseUrl } from "../router";
import { NaoEncontrada, Shell } from "./Shell";

/**
 * Tela do licenciado: gera o link personalizado de uma página sem editar nada nela.
 * No produto real, ficaria fora do editor.
 */
export function Convite({ slug }: { slug: string }) {
  const page = useMemo(() => getPageBySlug(slug), [slug]);
  const [v, setV] = useState({ nome: "", cidade: "", whats: "", foto: "", ref: "" });
  const [copiado, setCopiado] = useState(false);

  const entrada = { ...v, whats: v.whats.replace(/\D/g, "") };
  const persona = parsePersona(new URLSearchParams(entrada));
  const avisos = [
    entrada.whats && !persona.whats && "WhatsApp precisa ter DDD e o número (ex.: 31 99999-9999). O 55 entra sozinho.",
    v.foto && !persona.foto && "A foto precisa ser um link começando com https://.",
    v.ref && !persona.ref && "O código aceita só letras, números, hífen e sublinhado.",
  ].filter(Boolean) as string[];

  if (!page) return <NaoEncontrada />;

  const link = buildInviteLink(appBaseUrl(), page.slug, persona);
  const titulo = (page.data.root?.props as { titulo?: string } | undefined)?.titulo || page.title;
  const texto = `Olá! Quero te convidar para: ${titulo}.\n\nVeja os detalhes e faça sua inscrição: ${link}`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(false);
      alert("Não consegui copiar. Selecione o texto e copie manualmente.");
    }
  }

  const campo = (k: keyof typeof v, rotulo: string, ph: string) => (
    <label className="app-field">
      {rotulo}
      <input value={v[k]} placeholder={ph} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
    </label>
  );

  return (
    <Shell ativo="convite">
      <section className="app-card">
        <h1>Link de licenciado</h1>
        <p className="app-muted">
          Página: <strong>{page.title}</strong>. O licenciado preenche os próprios dados e recebe um link com o nome e o
          WhatsApp dele. Ninguém edita a página.
        </p>
        <div className="app-two">
          <div className="app-form">
            {campo("nome", "Seu nome", "Thiago Souza")}
            {campo("cidade", "Cidade / UF", "Belo Horizonte · MG")}
            {campo("whats", "WhatsApp com DDD", "31 99999-9999")}
            {campo("foto", "Foto (link https, opcional)", "https://…")}
            {campo("ref", "Código de licenciado", "LIC123")}
            {avisos.map((a) => (
              <p key={a} className="app-err">
                {a}
              </p>
            ))}
          </div>
          <div className="app-form">
            <label className="app-field">
              Link
              <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
            </label>
            <label className="app-field">
              Texto pronto para enviar
              <textarea readOnly rows={6} value={texto} />
            </label>
            <div className="app-actions">
              <button className="app-btn" onClick={copiar}>
                {copiado ? "Copiado" : "Copiar texto e link"}
              </button>
              <a className="app-btn app-btn--ghost" href={link} target="_blank" rel="noopener">
                Abrir prévia
              </a>
              <a
                className="app-btn app-btn--ghost"
                href={`https://wa.me/?text=${encodeURIComponent(texto)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Enviar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
