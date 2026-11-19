import type { ReactNode } from "react";
import { dataPorExtenso, type MetaPagina, type StatusVisivel } from "../../lib/meta";
import { setMeta } from "../../lib/pages";
import { Icone, type NomeIcone } from "../../ui/Icone";
import { useConfirmar, type PedidoConfirmacao } from "../../ui/Confirmar";
import { appBaseUrl } from "../../router";
import type { Espaco } from "./tipos";

/* Publicação da página: em que estado ela está, o que isso significa para quem visita e o que dá
   para fazer. Toda mudança de estado pede confirmação e vale na hora (não espera o "Salvar"). */

const ETAPAS: { id: "rascunho" | "publicada" | "encerrada"; titulo: string; texto: string }[] = [
  { id: "rascunho", titulo: "Rascunho", texto: "Só quem tem acesso ao construtor vê. Ainda não recebe inscrições." },
  { id: "publicada", titulo: "Publicada", texto: "No ar, no endereço da página, recebendo inscrições." },
  { id: "encerrada", titulo: "Inscrições encerradas", texto: "Continua no ar, mas não aceita mais inscrições." },
];

const ICONE: Record<StatusVisivel, NomeIcone> = {
  rascunho: "lapis",
  agendada: "relogio",
  publicada: "check",
  encerrada: "cadeado",
  arquivada: "arquivar",
};

function resumo(status: StatusVisivel, meta: MetaPagina): { titulo: string; texto: string } {
  switch (status) {
    case "rascunho":
      return { titulo: "Rascunho", texto: "A página ainda não está no ar. Publique quando estiver pronta para receber inscrições." };
    case "agendada":
      return { titulo: "Agendada", texto: `Entra no ar sozinha ${dataPorExtenso(meta.publicarEm)}. Até lá, fica como rascunho.` };
    case "publicada":
      return {
        titulo: "Publicada",
        texto: meta.encerrarEm ? `No ar e recebendo inscrições até ${dataPorExtenso(meta.encerrarEm)}.` : "No ar e recebendo inscrições.",
      };
    case "encerrada":
      return { titulo: "Inscrições encerradas", texto: "A página continua no ar, mas o formulário não aceita mais inscrições." };
    case "arquivada":
      return { titulo: "Arquivada", texto: "Fora do painel principal e com as inscrições encerradas. Nada foi apagado." };
  }
}

/**
 * O estado da publicação, em destaque, com as ações de mudar. `compacto` (visão geral): sem a
 * linha das etapas.
 */
export function StatusPublicacao({ d, compacto = false, aoMudar }: { d: Espaco; compacto?: boolean; aoMudar?: (meta: Partial<MetaPagina>) => void }) {
  const { pedir, dialogo } = useConfirmar();
  const { status, meta, page } = d;
  const url = `${appBaseUrl()}#/p/${page.slug}`.replace(/^https?:\/\//, "");
  const r = resumo(status, meta);

  const mudar = (novo: Partial<MetaPagina>) => {
    setMeta(page.id, novo);
    aoMudar?.(novo);
    d.recarregar();
  };
  const acao = (rotulo: string, pedido: Omit<PedidoConfirmacao, "confirmar">, tom: "pri" | "sec" | "perigo" = "sec"): ReactNode => (
    <button
      key={rotulo}
      type="button"
      className={tom === "pri" ? "bt bt-pri bt-p" : tom === "perigo" ? "bt bt-p pb-tirar" : "bt bt-p"}
      onClick={() => pedir({ ...pedido, confirmar: rotulo, perigo: tom === "perigo" })}
    >
      {rotulo}
    </button>
  );

  const publicar = acao(
    "Publicar agora",
    {
      titulo: "Publicar a página?",
      texto: (
        <p>
          A página entra no ar em <b>{url}</b> e começa a receber inscrições. Quem tiver o link já consegue abrir.
        </p>
      ),
      aoConfirmar: () => mudar({ status: "publicada", publicarEm: undefined }),
    },
    "pri"
  );
  const tirar = acao(
    "Tirar do ar",
    {
      titulo: "Tirar a página do ar?",
      texto: (
        <>
          <p>A página volta para rascunho: o link deixa de abrir para o público e o formulário para de receber inscrições.</p>
          <p>As inscrições que já chegaram continuam guardadas.</p>
        </>
      ),
      aoConfirmar: () => mudar({ status: "rascunho", publicarEm: undefined }),
    },
    "perigo"
  );
  const acoes: ReactNode[] = [];
  if (status === "rascunho") acoes.push(publicar);
  if (status === "agendada")
    acoes.push(
      publicar,
      acao("Cancelar agendamento", {
        titulo: "Cancelar o agendamento?",
        texto: <p>A página volta para rascunho e não entra mais no ar sozinha.</p>,
        aoConfirmar: () => mudar({ status: "rascunho", publicarEm: undefined }),
      })
    );
  if (status === "publicada")
    acoes.push(
      acao("Encerrar inscrições", {
        titulo: "Encerrar as inscrições?",
        texto: (
          <>
            <p>A página continua no ar, mas o formulário para de aceitar inscrições.</p>
            <p>Quem já se inscreveu continua inscrito. Dá para reabrir depois.</p>
          </>
        ),
        aoConfirmar: () => mudar({ status: "encerrada" }),
      }),
      tirar
    );
  if (status === "encerrada")
    acoes.push(
      acao(
        "Reabrir inscrições",
        {
          titulo: "Reabrir as inscrições?",
          texto: <p>O formulário volta a aceitar inscrições, respeitando as vagas e a data de encerramento.</p>,
          aoConfirmar: () => mudar({ status: "publicada", encerrarEm: undefined }),
        },
        "pri"
      ),
      tirar
    );
  if (status === "arquivada")
    acoes.push(
      acao("Desarquivar", {
        titulo: "Desarquivar a página?",
        texto: <p>A página volta para o painel principal como rascunho. Para receber inscrições de novo, publique depois.</p>,
        aoConfirmar: () => mudar({ status: "rascunho" }),
      })
    );

  const atual = status === "agendada" ? 0 : ETAPAS.findIndex((e) => e.id === status);

  return (
    <div className="pb" data-compacto={compacto || undefined}>
      <div className="pb-atual" data-tom={status}>
        <span className="pb-ic" aria-hidden="true">
          <Icone nome={ICONE[status]} tamanho={18} />
        </span>
        <div className="pb-atual-txt">
          <span className="pb-rot">Situação da página</span>
          <strong>{r.titulo}</strong>
          <span>{r.texto}</span>
        </div>
        {acoes.length > 0 && <div className="pb-acoes">{acoes}</div>}
      </div>

      {!compacto && (
        <ol className="pb-etapas" aria-label="Estados da página">
          {ETAPAS.map((e, i) => (
            <li key={e.id} data-estado={i < atual ? "feito" : i === atual ? "agora" : "falta"} aria-current={i === atual ? "step" : undefined}>
              <span className="pb-ponto" aria-hidden="true" />
              <b>
                {e.titulo}
                {i === atual && status === "agendada" && <em> · agendada</em>}
              </b>
              <span>{e.texto}</span>
            </li>
          ))}
        </ol>
      )}
      {dialogo}
    </div>
  );
}
