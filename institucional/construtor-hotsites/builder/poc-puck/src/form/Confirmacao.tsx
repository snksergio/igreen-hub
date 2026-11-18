import { useEffect, useState } from "react";
import type { Formulario } from "../lib/formularios";
import { textoConfirmacao } from "../lib/mensagens";
import { infoEvento, inicioDoEvento, lugarCurto } from "../lib/meta";
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

/** Depois de se inscrever (5.1, 5.3, 5.4): mensagem, ingresso com QR e agenda. */
export function Confirmacao({ sub, page, form, espera, previa }: Props) {
  const destino = form?.regras.sucesso === "redirecionar" ? safeUrl(form.regras.redirecionarPara) : undefined;
  const [falta, setFalta] = useState(destino && !previa ? 5 : 0);
  useEffect(() => {
    if (!falta || !destino) return;
    const t = setTimeout(() => (falta <= 1 ? window.location.assign(destino) : setFalta(falta - 1)), 1000);
    return () => clearTimeout(t);
  }, [falta, destino]);

  const pendente = sub.pagamento?.status === "pendente";
  const ev = page ? infoEvento(page.data) : {};
  const titulo = espera ? "Você está na lista de espera" : pendente ? "Inscrição feita, pagamento pendente" : "Inscrição confirmada!";
  const texto = espera
    ? "As vagas acabaram. Se alguém desistir, avisamos pelo WhatsApp na ordem da lista."
    : pendente
      ? "Sua vaga só fica garantida depois do pagamento. O link do ingresso, que também chega no WhatsApp, abre o pagamento de novo."
      : form?.regras.mensagemSucesso || "A confirmação chega no seu WhatsApp.";

  return (
    <div className="fm-fim">
      <div className="fm-fim-topo">
        <span className="fm-selo" data-tom={espera || pendente ? "aviso" : "ok"} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            {espera || pendente ? <path d="M12 7v6M12 16.5h.01" /> : <path d="M5 12.5l4.5 4.5L19 7.5" />}
          </svg>
        </span>
        <h2 className="fm-titulo">{titulo}</h2>
        <p className="fm-texto">{texto}</p>
        {destino && (
          <p className="fm-ajuda">
            {previa ? (
              <>Na página publicada, a pessoa iria para {destino}.</>
            ) : (
              <>
                Indo para a próxima página em {falta}s… <a href={destino}>Ir agora</a>
              </>
            )}
          </p>
        )}
      </div>

      {!espera && !pendente && sub.codigo && (
        <div className="fm-ingresso">
          <Qr texto={linkIngresso(sub.codigo)} tamanho={128} rotulo={`QR code do ingresso ${sub.codigo}`} />
          <div className="fm-ingresso-txt">
            <span className="fm-rot">Seu código de entrada</span>
            <strong className="fm-codigo">{sub.codigo}</strong>
            <span className="fm-ajuda">Mostre o QR code na chegada. {lugarCurto(ev) && `Local: ${lugarCurto(ev)}.`}</span>
            {!previa && (
              <a className="fm-link" href={`#/ingresso/${sub.codigo}`} target="_blank" rel="noopener noreferrer">
                Abrir meu ingresso
              </a>
            )}
          </div>
        </div>
      )}

      {pendente && !previa && sub.codigo && (
        <p className="fm-texto fm-centro">
          Para pagar depois, use o link do ingresso: <a className="fm-link" href={`#/ingresso/${sub.codigo}`}>{`ingresso ${sub.codigo}`}</a>
        </p>
      )}

      {page && !espera && <Agenda page={page} codigo={sub.codigo} />}

      {page && !espera && (
        <BolhaWhats
          texto={textoConfirmacao(page, metaDe(page), { nome: sub.nome, codigo: sub.codigo }, linkIngresso(sub.codigo))}
          rotulo="Mensagem que chega no WhatsApp (simulação, nada é enviado)"
        />
      )}
      {previa && <p className="fm-previa">Prévia: nada foi gravado.</p>}
    </div>
  );
}
