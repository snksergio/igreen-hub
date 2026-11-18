import type { ComponentConfig } from "@puckeditor/core";
import { Cta, ctaFields, fundoField, r, Section, travaPermissions, type Destino, type Fundo } from "../ui";

type Plano = { nome: string; preco: string; periodo: string; descricao: string; itens: string; destaque: boolean; botaoTexto: string };
export type PlanosProps = { titulo: string; planos: Plano[]; destino: Destino; link: string; fundo: Fundo; travado?: boolean };

export const Planos: ComponentConfig<PlanosProps> = {
  label: "Planos",
  fields: {
    titulo: { type: "text", label: "Título da seção" },
    planos: {
      type: "array",
      label: "Planos (até 3)",
      max: 3,
      arrayFields: {
        nome: { type: "text", label: "Nome do plano" },
        preco: { type: "text", label: "Preço (ex.: R$ 1.990)" },
        periodo: { type: "text", label: "Período (ex.: à vista, /mês)" },
        descricao: { type: "text", label: "Frase curta" },
        itens: { type: "textarea", label: "O que inclui (um por linha)" },
        destaque: {
          type: "radio",
          label: "Destacar este plano?",
          options: [
            { label: "Sim", value: true },
            { label: "Não", value: false },
          ],
        },
        botaoTexto: { type: "text", label: "Texto do botão" },
      },
      defaultItemProps: { nome: "Plano", preco: "", periodo: "", descricao: "", itens: "", destaque: false, botaoTexto: "Quero este" },
      getItemSummary: (pl) => pl.nome || "Plano",
    },
    destino: ctaFields.destino,
    link: ctaFields.link,
    fundo: fundoField,
  },
  defaultProps: {
    titulo: "Escolha como começar",
    planos: [
      { nome: "Plano essencial", preco: "R$ 0.000", periodo: "à vista", descricao: "Para começar.", itens: "Item incluso\nItem incluso", destaque: false, botaoTexto: "Quero este" },
      { nome: "Plano completo", preco: "R$ 0.000", periodo: "à vista", descricao: "O mais escolhido.", itens: "Tudo do essencial\nItem a mais\nItem a mais", destaque: true, botaoTexto: "Quero este" },
    ],
    destino: "whatsapp",
    link: "",
    fundo: "claro",
  },
  resolvePermissions: travaPermissions,
  render: (p) => (
    <Section fundo={p.fundo} titulo={p.titulo} travado={p.travado}>
      <div className="hs-plans">
        {(p.planos ?? []).map((pl, i) => (
          <article key={i} className="hs-plan" data-destaque={pl.destaque} {...r(i + 1)}>
            {pl.destaque && <span className="hs-plan__tag">Mais escolhido</span>}
            <h3 className="hs-h3">{pl.nome}</h3>
            {pl.descricao && <p className="hs-muted">{pl.descricao}</p>}
            {pl.preco && (
              <p className="hs-plan__preco">
                {pl.preco} <span>{pl.periodo}</span>
              </p>
            )}
            <ul>
              {(pl.itens ?? "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((s) => (
                  <li key={s}>{s}</li>
                ))}
            </ul>
            <Cta botaoTexto={pl.botaoTexto} destino={p.destino} link={p.link} mensagemWhats={`Olá! Quero saber do ${pl.nome}.`} />
          </article>
        ))}
      </div>
    </Section>
  ),
};
