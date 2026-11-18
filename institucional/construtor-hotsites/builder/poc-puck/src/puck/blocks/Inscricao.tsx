import type { ComponentConfig } from "@puckeditor/core";
import { useState, type FormEvent } from "react";
import { FormCurto } from "../../form/FormCurto";
import { getFormulario } from "../../lib/formularios";
import { addSubmission } from "../../lib/submissions";
import { formularioField } from "../fields/FormularioField";
import { usePageCtx, useTokens } from "../context";
import { fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

export type InscricaoProps = {
  titulo: string;
  texto: string;
  pedirCidade: boolean;
  rotuloInteresse: string;
  opcoesInteresse: string;
  textoConsentimento: string;
  botaoTexto: string;
  mensagemSucesso: string;
  fundo: Fundo;
  /** Formulário da biblioteca (Etapa 3). Vazio: os campos fixos de antes. */
  formularioId?: string;
  travado?: boolean;
};

type Erros = Partial<Record<"nome" | "whats" | "email" | "consent", string>>;

/** Regras mínimas: nome, WhatsApp e e-mail obrigatórios; consentimento obrigatório. */
export function validarInscricao(v: { nome: string; whats: string; email: string; consent: boolean }): Erros {
  const e: Erros = {};
  if (!v.nome.trim()) e.nome = "Diga como podemos chamar você.";
  const digits = v.whats.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) e.whats = "WhatsApp com DDD, só números.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Confira o e-mail.";
  if (!v.consent) e.consent = "Precisamos do seu consentimento para enviar a inscrição.";
  return e;
}

function View(p: InscricaoProps) {
  const t = useTokens();
  const { mode, pageId, pageSlug, persona, origem, inscricoes, estatico } = usePageCtx();
  const form = estatico ? undefined : getFormulario(p.formularioId);
  const fechada = inscricoes?.fechada;
  const bloqueada = fechada === "encerrada" || (fechada === "esgotada" && !form?.regras.listaEspera);
  const naoPublicada = fechada === "rascunho" || fechada === "agendada";
  const [v, setV] = useState({ nome: "", whats: "", email: "", cidade: "", interesse: "", consent: false });
  const [erros, setErros] = useState<Erros>({});
  const [status, setStatus] = useState<"idle" | "ok" | "previa">("idle");
  const opcoes = (p.opcoesInteresse ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e = validarInscricao(v);
    setErros(e);
    if (Object.keys(e).length) return;
    if (mode !== "publico" || naoPublicada) {
      setStatus("previa");
      return;
    }
    addSubmission({
      pageId,
      pageSlug,
      ref: persona.ref,
      origem,
      consentimentoEm: Date.now(),
      nome: v.nome.trim(),
      whats: v.whats.replace(/\D/g, ""),
      email: v.email.trim(),
      cidade: p.pedirCidade ? v.cidade.trim() || undefined : undefined,
      interesse: v.interesse || undefined,
    });
    setStatus("ok");
  }

  if (bloqueada) {
    return (
      <Section id="inscricao" fundo={p.fundo} travado={p.travado}>
        <div className="hs-form hs-form--ok" role="status">
          <h2 className="hs-h2">{fechada === "esgotada" ? "Vagas esgotadas" : "Inscrições encerradas"}</h2>
          <p>{fechada === "esgotada" ? "Todas as vagas foram preenchidas. Obrigado pelo interesse!" : "Este evento não está recebendo inscrições agora."}</p>
        </div>
      </Section>
    );
  }

  if (form) {
    return (
      <Section id="inscricao" fundo={p.fundo} travado={p.travado}>
        <FormCurto
          form={form}
          pele="hs"
          className="hs-form"
          topo={
            <>
              <h2 className="hs-h2">{t(p.titulo)}</h2>
              {p.texto && <p>{t(p.texto)}</p>}
              {persona.ref && (
                <p className="hs-note">
                  Convite de <strong>{persona.nome ?? persona.ref}</strong> (código {persona.ref})
                </p>
              )}
            </>
          }
          botao={
            <button className="hs-btn" type="submit">
              {p.botaoTexto || form.botaoPagina || "Continuar"}
            </button>
          }
          rodape={naoPublicada && <p className="hs-note">Página ainda não publicada: a inscrição não é gravada.</p>}
        />
      </Section>
    );
  }

  if (status === "ok") {
    return (
      <Section id="inscricao" fundo={p.fundo} travado={p.travado}>
        <div className="hs-form hs-form--ok" role="status">
          <h2 className="hs-h2">{t(p.mensagemSucesso)}</h2>
        </div>
      </Section>
    );
  }

  return (
    <Section id="inscricao" fundo={p.fundo} travado={p.travado}>
      <form className="hs-form" onSubmit={enviar} noValidate method="post" data-form-inscricao {...r(0)}>
        <h2 className="hs-h2">{t(p.titulo)}</h2>
        {p.texto && <p>{t(p.texto)}</p>}
        {persona.ref && (
          <p className="hs-note">
            Convite de <strong>{persona.nome ?? persona.ref}</strong> (código {persona.ref})
          </p>
        )}
        <label>
          Seu nome
          <input name="nome" value={v.nome} onChange={(e) => setV({ ...v, nome: e.target.value })} autoComplete="name" maxLength={100} />
          {erros.nome && <span className="hs-err">{erros.nome}</span>}
        </label>
        <label>
          WhatsApp com DDD
          <input name="whatsapp" value={v.whats} onChange={(e) => setV({ ...v, whats: e.target.value })} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} />
          {erros.whats && <span className="hs-err">{erros.whats}</span>}
        </label>
        <label>
          E-mail
          <input name="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} type="email" autoComplete="email" maxLength={180} />
          {erros.email && <span className="hs-err">{erros.email}</span>}
        </label>
        {p.pedirCidade && (
          <label>
            Cidade / UF
            <input name="cidade" value={v.cidade} onChange={(e) => setV({ ...v, cidade: e.target.value })} autoComplete="address-level2" maxLength={100} />
          </label>
        )}
        {opcoes.length > 0 && (
          <label>
            {p.rotuloInteresse || "O que despertou seu interesse?"}
            <select name="interesse" value={v.interesse} onChange={(e) => setV({ ...v, interesse: e.target.value })}>
              <option value="">Selecione uma opção</option>
              {opcoes.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="hs-check">
          <input type="checkbox" name="consentimento" checked={v.consent} onChange={(e) => setV({ ...v, consent: e.target.checked })} />
          <span>{p.textoConsentimento}</span>
        </label>
        {erros.consent && <span className="hs-err">{erros.consent}</span>}
        <button className="hs-btn" type="submit">
          {p.botaoTexto || "Enviar"}
        </button>
        {status === "previa" && <p className="hs-note">Prévia: a inscrição não foi gravada.</p>}
      </form>
    </Section>
  );
}

export const Inscricao: ComponentConfig<InscricaoProps> = {
  label: "Inscrição (formulário)",
  fields: {
    formularioId: formularioField("Formulário"),
    titulo: { type: "text", label: "Título (aceita {nome} e {cidade})" },
    texto: { type: "textarea", label: "Texto de apoio" },
    pedirCidade: {
      type: "radio",
      label: "Pedir cidade?",
      options: [
        { label: "Sim", value: true },
        { label: "Não", value: false },
      ],
    },
    rotuloInteresse: { type: "text", label: "Pergunta de interesse" },
    opcoesInteresse: { type: "textarea", label: "Opções de interesse (uma por linha; vazio = sem pergunta)" },
    textoConsentimento: { type: "textarea", label: "Texto do consentimento (obrigatório marcar)" },
    botaoTexto: { type: "text", label: "Texto do botão" },
    mensagemSucesso: { type: "text", label: "Mensagem depois de enviar" },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Garanta sua vaga",
    texto: "Leva menos de um minuto.",
    pedirCidade: true,
    rotuloInteresse: "O que despertou seu interesse?",
    opcoesInteresse: "",
    textoConsentimento:
      "Quero receber informações sobre este evento por WhatsApp e e-mail. Posso cancelar quando quiser. Os dados seguem a Política de Privacidade da iGreen.",
    botaoTexto: "Quero participar",
    mensagemSucesso: "Inscrição recebida. Te esperamos lá!",
    fundo: "claro",
  },
  // Com formulário da biblioteca, os campos fixos antigos (cidade, interesse, consentimento) não valem: saem do painel.
  resolveFields: (data, { fields }) => {
    if (!data.props.formularioId) return fields;
    const { pedirCidade: _a, rotuloInteresse: _b, opcoesInteresse: _c, textoConsentimento: _d, ...resto } = fields;
    return resto as typeof fields;
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
