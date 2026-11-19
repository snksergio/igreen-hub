import type { ComponentConfig } from "@puckeditor/core";
import { useState, type CSSProperties, type FormEvent } from "react";
import { FormCurto } from "../../../form/FormCurto";
import { getFormulario, type AjusteSecao } from "../../../lib/formularios";
import { BotaoLima, Icone, rico, Seta, useHref, useLive } from "../../../live/ui";
import { addSubmission } from "../../../lib/submissions";
import { camposSecaoField, formularioField } from "../../fields/FormularioField";
import { usePageCtx, useTokens } from "../../context";
import { validarInscricao } from "../Inscricao";
import { ctaFields, travaPermissions, type CtaProps } from "../../ui";

export type LiveInscricaoProps = CtaProps & {
  titulo1: string;
  titulo2: string;
  texto: string;
  whatsTexto: string;
  info1: string;
  info2: string;
  info3: string;
  formTitulo: string;
  formTexto: string;
  gratisTexto: string;
  vagas: number;
  pedirCidade: boolean;
  textoConsentimento: string;
  enviarTexto: string;
  mensagemSucesso: string;
  nota: string;
  letreiro: string;
  /** Formulário da biblioteca (Etapa 3). Vazio: os campos fixos de antes. */
  formularioId?: string;
  /** Campos escondidos ou trazidos só nesta seção (o formulário não muda). */
  camposSecao?: AjusteSecao;
  travado?: boolean;
};

const i = (n: number) => ({ style: { "--i": n } as CSSProperties });

/* O cartão do rodapé F do iGreen Live: proposta à esquerda, formulário em destaque à direita e o letreiro na base. */
function View(p: LiveInscricaoProps) {
  const t = useTokens();
  const href = useHref();
  const { mode, pageId, pageSlug, persona, origem, inscricoes, estatico } = usePageCtx();
  const form = estatico ? undefined : getFormulario(p.formularioId);
  const fechada = inscricoes?.fechada;
  const bloqueada = fechada === "encerrada" || (fechada === "esgotada" && !form?.regras.listaEspera);
  const ref = useLive<HTMLElement>("revelar");
  const [v, setV] = useState({ nome: "", whats: "", email: "", cidade: "", consent: false });
  const [erros, setErros] = useState<ReturnType<typeof validarInscricao>>({});
  const [status, setStatus] = useState<"idle" | "ok" | "previa">("idle");

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e = validarInscricao(v);
    setErros(e);
    if (Object.keys(e).length) return;
    if (mode !== "publico" || fechada === "rascunho" || fechada === "agendada") {
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
    });
    setStatus("ok");
  }

  const infos: [string, string][] = [
    ["cal", p.info1],
    ["pin", p.info2],
    ["ok", p.info3],
  ];
  // Com vagas definidas na página, a barra mostra o preenchimento de verdade.
  const real = inscricoes?.vagas ? Math.round((inscricoes.inscritos / inscricoes.vagas) * 100) : null;
  const vagas = Math.max(0, Math.min(100, real ?? (Number(p.vagas) || 0)));
  const cabeca = (
    <>
      <div className="form-topo">
        <span className="etiqueta">
          <i />
          Inscrição
        </span>
        {p.gratisTexto && <span className="gratis">{p.gratisTexto}</span>}
      </div>
      <h3>{t(p.formTitulo)}</h3>
      {p.formTexto && <p>{p.formTexto}</p>}
      {persona.ref && (
        <p>
          Convite de <strong>{persona.nome ?? persona.ref}</strong> (código {persona.ref})
        </p>
      )}
      {vagas > 0 && (
        <div className="vagas">
          <div className="vagas-topo">
            <span>Vagas preenchidas</span>
            <b>{vagas}%</b>
          </div>
          <span className="vagas-barra">
            <i style={{ "--p": `${vagas}%` } as CSSProperties} />
          </span>
        </div>
      )}
    </>
  );

  return (
    <div className="lv">
      <section className="cta" id="inscricao" ref={ref} data-lv="revelar">
        <div className="cta-cartao">
          <div className="cta-grade">
            <div className="cta-pitch">
              <h2 className="cta-titulo revela">
                {t(p.titulo1)}
                {p.titulo2 && <span>{t(p.titulo2)}</span>}
              </h2>
              {p.texto && (
                <p className="cta-sub revela" {...i(1)}>
                  {p.texto}
                </p>
              )}
              <div className="cta-acoes revela" {...i(2)}>
                <BotaoLima {...p} />
                {p.whatsTexto && (
                  <a className="btn-fantasma btn-whats" {...href({ destino: "whatsapp", link: "", mensagemWhats: p.mensagemWhats })}>
                    <Icone nome="whats" className="" />
                    {p.whatsTexto}
                  </a>
                )}
              </div>
              {infos.some(([, x]) => x) && (
                <ul className="cta-info revela" {...i(3)}>
                  {infos
                    .filter(([, x]) => x)
                    .map(([ic, x]) => (
                      <li key={ic}>
                        <Icone nome={ic} />
                        {x}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {bloqueada ? (
              <div className="form revela" {...i(2)} role="status">
                <div className="form-topo">
                  <span className="etiqueta">
                    <i />
                    Inscrição
                  </span>
                </div>
                <h3>{fechada === "esgotada" ? "Vagas esgotadas" : "Inscrições encerradas"}</h3>
                <p>{fechada === "esgotada" ? "Todas as vagas foram preenchidas. Obrigado pelo interesse!" : "Este evento não está recebendo inscrições agora."}</p>
              </div>
            ) : form ? (
              <FormCurto
                form={form}
                ajuste={p.camposSecao}
                pele="live"
                className="form revela"
                {...i(2)}
                topo={cabeca}
                botao={
                  <button className="btn enviar" type="submit">
                    <span>{p.enviarTexto || form.botaoPagina || "Continuar"}</span> <Seta />
                  </button>
                }
                rodape={
                  fechada === "rascunho" || fechada === "agendada" ? (
                    <p className="nota">Página ainda não publicada: a inscrição não é gravada.</p>
                  ) : (
                    p.nota && <p className="nota">{p.nota}</p>
                  )
                }
              />
            ) : status === "ok" ? (
              <div className="form revela" {...i(2)} role="status">
                <div className="form-topo">
                  <span className="etiqueta">
                    <i />
                    Inscrição recebida
                  </span>
                </div>
                <h3>{t(p.mensagemSucesso)}</h3>
              </div>
            ) : (
              <form className="form revela" {...i(2)} onSubmit={enviar} noValidate method="post" data-form-inscricao>
                {cabeca}
                <div className="form-linha">
                  <label className="campo">
                    Nome
                    <input name="nome" value={v.nome} onChange={(e) => setV({ ...v, nome: e.target.value })} autoComplete="name" maxLength={100} placeholder="Como quer ser chamado" />
                    {erros.nome && <span className="erro">{erros.nome}</span>}
                  </label>
                  <label className="campo">
                    WhatsApp
                    <input name="whatsapp" value={v.whats} onChange={(e) => setV({ ...v, whats: e.target.value })} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} placeholder="(31) 9 9999-9999" />
                    {erros.whats && <span className="erro">{erros.whats}</span>}
                  </label>
                </div>
                <div className="form-linha form-linha-2">
                  <label className="campo">
                    E-mail
                    <input name="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} type="email" autoComplete="email" maxLength={180} placeholder="seu@email.com" />
                    {erros.email && <span className="erro">{erros.email}</span>}
                  </label>
                  {p.pedirCidade && (
                    <label className="campo">
                      Cidade
                      <input name="cidade" value={v.cidade} onChange={(e) => setV({ ...v, cidade: e.target.value })} autoComplete="address-level2" maxLength={100} placeholder="Onde você mora" />
                    </label>
                  )}
                </div>
                <label className="aceite">
                  <input className="aceite-input" type="checkbox" name="consentimento" checked={v.consent} onChange={(e) => setV({ ...v, consent: e.target.checked })} />
                  <span className="aceite-caixa" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <span className="aceite-txt">{rico(p.textoConsentimento)}</span>
                </label>
                {erros.consent && <span className="erro">{erros.consent}</span>}
                <button className="btn enviar" type="submit">
                  <span>{p.enviarTexto || "Enviar"}</span> <Seta />
                </button>
                {status === "previa" ? <p className="nota">Prévia: a inscrição não foi gravada.</p> : p.nota && <p className="nota">{p.nota}</p>}
              </form>
            )}
          </div>
          {p.letreiro && (
            <a className="letreiro" href="#inscricao" aria-label={`${p.letreiro}: ir para o formulário`}>
              <span className="letreiro-trilho" aria-hidden="true">
                {[0, 1].map((g) => (
                  <span key={g} className="letreiro-grupo">
                    {[0, 1].map((k) => (
                      <span key={k} style={{ display: "contents" }}>
                        <span>{p.letreiro}</span>
                        <svg viewBox="0 0 24 24">
                          <path d="M7 17L17 7M9 7h8v8" />
                        </svg>
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

export const LiveInscricao: ComponentConfig<LiveInscricaoProps> = {
  label: "Inscrição Live",
  fields: {
    formularioId: formularioField("Formulário"),
    titulo1: { type: "text", label: "Título, primeira linha" },
    titulo2: { type: "text", label: "Título, segunda linha (cinza)" },
    texto: { type: "textarea", label: "Texto de apoio" },
    ...ctaFields,
    whatsTexto: { type: "text", label: "Botão do WhatsApp ao lado (vazio = sem botão)" },
    info1: { type: "text", label: "Linha com calendário" },
    info2: { type: "text", label: "Linha com local" },
    info3: { type: "text", label: "Linha com visto" },
    formTitulo: { type: "text", label: "Formulário: título" },
    formTexto: { type: "textarea", label: "Formulário: texto" },
    gratisTexto: { type: "text", label: "Formulário: aviso verde no topo" },
    vagas: { type: "number", label: "Vagas preenchidas em % (0 = esconde; com vagas nas configurações da página, vale o número real)" },
    pedirCidade: {
      type: "radio",
      label: "Pedir cidade?",
      options: [
        { label: "Sim", value: true },
        { label: "Não", value: false },
      ],
    },
    textoConsentimento: { type: "textarea", label: "Texto do aceite (**negrito**)" },
    enviarTexto: { type: "text", label: "Botão de enviar" },
    mensagemSucesso: { type: "text", label: "Mensagem depois de enviar" },
    nota: { type: "text", label: "Nota embaixo do botão" },
    letreiro: { type: "text", label: "Letreiro que corre na base (vazio = sem letreiro)" },
  },
  defaultProps: {
    titulo1: "Vem viver isso",
    titulo2: "ao vivo, em BH.",
    texto: "Uma noite de palco, histórias reais e gente que vive de energia limpa. Entrada gratuita, com vagas limitadas.",
    botaoTexto: "Garantir minha vaga",
    destino: "inscricao",
    link: "",
    mensagemWhats: "Olá! Quero saber mais sobre o iGreen Live BH.",
    whatsTexto: "Falar no WhatsApp",
    info1: "Sábado, 12 de dezembro · 19h às 22h",
    info2: "Expominas · Auditório 2 · Belo Horizonte, MG",
    info3: "Confirmação pelo WhatsApp, lugar garantido até 19h15",
    formTitulo: "Garanta sua vaga",
    formTexto: "Leva menos de um minuto. A confirmação chega no seu WhatsApp.",
    gratisTexto: "Entrada gratuita",
    vagas: 82,
    pedirCidade: true,
    textoConsentimento: "Aceito receber **avisos sobre este evento pelo WhatsApp**. Posso cancelar quando quiser.",
    enviarTexto: "Quero participar",
    mensagemSucesso: "Pronto! A confirmação chega no seu WhatsApp.",
    nota: "Seus dados só servem para avisos deste evento.",
    letreiro: "Garanta seu lugar",
  },
  // Com formulário da biblioteca, "pedir cidade" e o texto do aceite vêm do formulário: saem do painel.
  resolveFields: (data, { fields }) => {
    if (!data.props.formularioId) return fields;
    const { pedirCidade: _a, textoConsentimento: _b, ...resto } = fields;
    return { formularioId: resto.formularioId, camposSecao: camposSecaoField(data.props.formularioId), ...resto } as typeof fields;
  },
  // Trocou de formulário: o ajuste de campos era do outro (ids diferentes), então volta ao padrão.
  resolveData: (data, { lastData, trigger }) => {
    const antes = lastData?.props.formularioId;
    if (trigger === "load" || !lastData || antes === data.props.formularioId || !data.props.camposSecao) return data;
    return { ...data, props: { ...data.props, camposSecao: undefined } };
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
