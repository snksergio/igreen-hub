import type { ComponentConfig } from "@puckeditor/core";
import { whatsHref } from "../../lib/persona";
import { usePageCtx, useTokens } from "../context";
import { Avatar, fundoField, r, Section, travaPermissions, type Fundo } from "../ui";

export type ContatoConsultorProps = {
  titulo: string;
  textoComLicenciado: string;
  textoSemLicenciado: string;
  botaoTexto: string;
  mensagemWhats: string;
  fundo: Fundo;
  travado?: boolean;
};

function View(p: ContatoConsultorProps) {
  const t = useTokens();
  const { persona } = usePageCtx();
  const temLicenciado = Boolean(persona.nome || persona.whats);
  return (
    <Section fundo={p.fundo} travado={p.travado}>
      <div className="hs-contact" {...r(0, "left")}>
        <Avatar src={persona.foto} nome={persona.nome ?? "iGreen"} />
        <div>
          <h2 className="hs-h2">{t(p.titulo)}</h2>
          {persona.cidade && <p className="hs-muted">{persona.cidade}</p>}
          <p>{t(temLicenciado ? p.textoComLicenciado : p.textoSemLicenciado)}</p>
          <a className="hs-btn" href={whatsHref(persona, t(p.mensagemWhats))} target="_blank" rel="noopener noreferrer">
            {p.botaoTexto || "Chamar no WhatsApp"}
          </a>
        </div>
      </div>
    </Section>
  );
}

export const ContatoConsultor: ComponentConfig<ContatoConsultorProps> = {
  label: "Contato do consultor",
  fields: {
    titulo: { type: "text", label: "Título (aceita {nome} e {cidade})" },
    textoComLicenciado: { type: "textarea", label: "Texto quando o link traz um licenciado" },
    textoSemLicenciado: { type: "textarea", label: "Texto sem licenciado no link" },
    botaoTexto: { type: "text", label: "Texto do botão" },
    mensagemWhats: { type: "text", label: "Mensagem que já abre no WhatsApp" },
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Fale com {nome}",
    textoComLicenciado: "Tire suas dúvidas direto comigo pelo WhatsApp.",
    textoSemLicenciado: "Fale com a equipe iGreen pelo WhatsApp.",
    botaoTexto: "Chamar no WhatsApp",
    mensagemWhats: "Olá, {nome}! Vi a página e quero saber mais.",
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => <View {...p} />,
};
