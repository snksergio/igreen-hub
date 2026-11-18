import { useEffect, useState } from "react";
import type { Formulario } from "../lib/formularios";
import { textoConfirmacao } from "../lib/mensagens";
import { dataPorExtenso, infoEvento, inicioDoEvento, lugarCurto } from "../lib/meta";
import { metaDe } from "../lib/painel";
import type { PageRecord } from "../lib/pages";
import { qrSvg } from "../lib/qr";
import { safeUrl } from "../puck/ui";
import type { Submission } from "../lib/submissions";
import { gerarIcs, googleAgendaUrl } from "../lib/tempo";
import { appBaseUrl } from "../router";
import { BolhaWhats } from "./Bolha";

export const linkIngresso = (codigo: string | undefined) => `${appBaseUrl()}#/ingresso/${codigo ?? ""}`;

/** QR code em SVG para as telas públicas (ingresso e Pix simulado). */
export function Qr({ texto, tamanho = 168, rotulo }: { texto: string; tamanho?: number; rotulo: string }) {
  const { lado, d } = qrSvg(texto);
  return (
    <svg className="fm-qr" viewBox={`0 0 ${lado} ${lado}`} width={tamanho} height={tamanho} role="img" aria-label={rotulo} shapeRendering="crispEdges">
      <rect width={lado} height={lado} fill="#fff" />
      <path d={d} fill="#111" />
    </svg>
  );
}

/** Adicionar à agenda (5.3): Google Agenda e arquivo .ics (Apple, Outlook). */
export function Agenda({ page, codigo }: { page: PageRecord; codigo?: string }) {
  const ev = infoEvento(page.data);
  const inicio = inicioDoEvento(ev);
  if (!inicio) return null;
  const compromisso = {
    titulo: page.title,
    inicio,
    duracaoMin: ev.duracaoMin ?? 180,
    local: [ev.local, ev.endereco, [ev.cidade, ev.uf].filter(Boolean).join("/")].filter(Boolean).join(", "),
    descricao: codigo ? `Seu código de entrada: ${codigo}. Ingresso: ${linkIngresso(codigo)}` : undefined,
    uid: codigo ? `${page.id}-${codigo}` : undefined,
  };
  const baixarIcs = () => {
    const url = URL.createObjectURL(new Blob([gerarIcs(compromisso)], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.slug}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="fm-agenda">
      <a className="fm-bt fm-bt-sec" href={googleAgendaUrl(compromisso)} target="_blank" rel="noopener noreferrer">
        Google Agenda
      </a>
      <button type="button" className="fm-bt fm-bt-sec" onClick={baixarIcs}>
        Apple ou Outlook (.ics)
      </button>
    </div>
  );
}

type Props = { sub: Submission; page: PageRecord | undefined; form: Formulario | undefined; espera: boolean; previa: boolean };

/** O ingresso como um crachá: evento no topo, picote, participante e QR code (5.4). */
export function CartaoIngresso({ sub, page, espera = false, previa = false }: { sub: Submission; page: PageRecord | undefined; espera?: boolean; previa?: boolean }) {
  const ev = page ? infoEvento(page.data) : {};
  const pendente = sub.pagamento?.status === "pendente";
  const carimbo = espera ? "Lista de espera" : pendente ? "Pagamento pendente" : previa ? "Prévia" : "";
  return (
    <article className="tk" data-estado={espera ? "espera" : pendente ? "pendente" : "ok"} aria-label={`Ingresso de ${sub.nome}`}>
      <header className="tk-topo">
        <span className="tk-marca">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15zM5 19l7-7" />
          </svg>
          iGreen
        </span>
        <span className="tk-tipo">Ingresso</span>
        <strong className="tk-evento">{page?.title ?? sub.pageSlug}</strong>
        <span className="tk-quando">{dataPorExtenso(ev.inicio) || "Data a confirmar"}</span>
        {lugarCurto(ev) && <span className="tk-onde">{lugarCurto(ev)}</span>}
      </header>
      <div className="tk-picote" aria-hidden="true" />
      <div className="tk-corpo">
        <div className="tk-pessoa">
          <span className="tk-rot">Participante</span>
          <strong>{sub.nome || "Participante"}</strong>
          <span className="tk-rot">Código</span>
          <strong className="tk-codigo">{sub.codigo}</strong>
        </div>
        <div className="tk-qr">
          <Qr texto={linkIngresso(sub.codigo)} tamanho={104} rotulo={`QR code do ingresso ${sub.codigo}`} />
        </div>
      </div>
      {carimbo && <span className="tk-carimbo">{carimbo}</span>}
    </article>
  );
}

/** Depois de se inscrever (5.1, 5.3, 5.4): o ingresso à esquerda e o parabéns à direita. */
export function Confirmacao({ sub, page, form, espera, previa }: Props) {
  const destino = form?.regras.sucesso === "redirecionar" ? safeUrl(form.regras.redirecionarPara) : undefined;
  const [falta, setFalta] = useState(destino && !previa ? 8 : 0);
  useEffect(() => {
    if (!falta || !destino) return;
    const t = setTimeout(() => (falta <= 1 ? window.location.assign(destino) : setFalta(falta - 1)), 1000);
    return () => clearTimeout(t);
  }, [falta, destino]);

  const pendente = sub.pagamento?.status === "pendente";
  const nome = sub.nome.trim().split(/\s+/)[0];
  const titulo = espera ? "Você está na lista de espera" : pendente ? `Quase lá${nome ? `, ${nome}` : ""}!` : `Parabéns${nome ? `, ${nome}` : ""}! 🎉`;
  const subtitulo = espera
    ? "As vagas acabaram. Se alguém desistir, avisamos pelo WhatsApp, na ordem da lista."
    : pendente
      ? "Sua vaga fica garantida assim que o pagamento for aprovado."
      : "Você garantiu seu acesso.";
  const texto = espera
    ? ""
    : pendente
      ? "O link do ingresso, que também chega no WhatsApp, abre o pagamento de novo."
      : form?.regras.mensagemSucesso || "A confirmação chega no seu WhatsApp.";

  return (
    <div className="fm-sucesso">
      <CartaoIngresso sub={sub} page={page} espera={espera} previa={previa} />
      <div className="fm-sucesso-txt">
        <h2 className="fm-sucesso-tit">{titulo}</h2>
        <p className="fm-sucesso-sub">{subtitulo}</p>
        {texto && <p className="fm-texto">{texto}</p>}

        {!espera && (
          <ul className="fm-passos-ok">
            <li data-ok={!pendente || undefined}>{pendente ? "Pagamento pendente" : "Inscrição confirmada"}</li>
            <li data-ok>Confirmação no seu WhatsApp (simulação)</li>
            <li data-ok={!pendente || undefined}>QR code para a entrada</li>
          </ul>
        )}

        {destino && (
          <p className="fm-ajuda">
            {previa ? (
              <>Na página publicada, a pessoa seguiria para {destino}.</>
            ) : (
              <>
                Seguindo para a próxima página em {falta}s… <a href={destino}>Ir agora</a>
              </>
            )}
          </p>
        )}

        {page && !espera && <Agenda page={page} codigo={sub.codigo} />}

        {!previa && sub.codigo && (
          <a className="fm-link" href={`#/ingresso/${sub.codigo}`} target="_blank" rel="noopener noreferrer">
            {pendente ? "Pagar pelo link do ingresso" : "Abrir meu ingresso"}
          </a>
        )}

        {page && !espera && (
          <details className="fm-msg">
            <summary>Ver a mensagem que chega no WhatsApp</summary>
            <BolhaWhats texto={textoConfirmacao(page, metaDe(page), { nome: sub.nome, codigo: sub.codigo }, linkIngresso(sub.codigo))} rotulo="Simulação: nada é enviado" />
          </details>
        )}
        {previa && <p className="fm-previa">Prévia: nada foi gravado.</p>}
      </div>
    </div>
  );
}
