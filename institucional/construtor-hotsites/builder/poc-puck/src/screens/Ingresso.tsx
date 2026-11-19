import { useEffect, useMemo, useState } from "react";
import { compromissoDe, IngressoPendurado, QuandoETipo, SeloConfirmacao } from "../form/Confirmacao";
import { Pagamento } from "../form/Fluxo";
import "../form/form.css";
import "../form/conversa.css";
import "./publicas.css";
import { reais } from "../lib/ingresso";
import { infoEvento } from "../lib/meta";
import { getPage } from "../lib/pages";
import { getPorCodigo, statusDe } from "../lib/submissions";
import { temaDa } from "./FormAvulso";

/**
 * Ingresso do participante (5.4), no mesmo desenho da confirmação: o ingresso pendurado à esquerda
 * e, à direita, a situação, o evento, a data e o que fazer (pagar, pôr na agenda, mostrar na entrada).
 * Cores neutras, as mesmas da conversa e da confirmação; o verde fica no botão principal.
 */
export function Ingresso({ codigo }: { codigo: string }) {
  const [versao, setVersao] = useState(0);
  const [pagando, setPagando] = useState(false);
  const sub = useMemo(() => getPorCodigo(codigo), [codigo, versao]);
  const page = sub ? getPage(sub.pageId) : undefined;
  const ev = page ? infoEvento(page.data) : {};
  useEffect(() => {
    document.title = page ? `Ingresso · ${page.title}` : "Ingresso";
  }, [page]);

  if (!sub)
    return (
      <div className="fm-pagina ig2">
        <main className="ig2-cartao ig2-vazio">
          <h1 className="fm-sucesso-tit">Ingresso não encontrado</h1>
          <p className="fm-sucesso-sub">Confira o código. Na POC, o ingresso só existe no navegador onde a inscrição foi feita.</p>
        </main>
      </div>
    );

  const status = statusDe(sub);
  const espera = status === "espera";
  const pagamento = sub.pagamento?.status;
  const pendente = pagamento === "pendente" || pagamento === "cancelado" || pagamento === "estornado";
  const agenda = page && !espera ? compromissoDe(page, sub.codigo) : null;
  const tipo = espera ? "Lista de espera" : !sub.pagamento ? "Entrada gratuita" : sub.pagamento.meia ? "Meia-entrada" : "Ingresso inteira";
  const nome = sub.nome.trim().split(/\s+/)[0];
  const tom = espera || pendente ? "aviso" : "ok";
  const titulo =
    status === "presente"
      ? "Entrada registrada."
      : espera
        ? "Você está na lista de espera."
        : pendente
          ? pagamento === "pendente"
            ? "Falta o pagamento."
            : `Pagamento ${pagamento}.`
          : `Seu ingresso${nome ? `, ${nome}` : ""}.`;

  // Pagamento pendente: o link do ingresso é por onde a pessoa paga depois (5.1, 4.2).
  if (pagando && pagamento === "pendente")
    return (
      <div className="fm-pagina ig2" data-tema={temaDa(page)}>
        <main className="ig2-cartao ig2-pagar">
          <Pagamento
            sub={sub}
            previa={false}
            resolver={(_s, aprovado) => {
              if (!aprovado) return;
              setPagando(false);
              setVersao((v) => v + 1);
            }}
            desistir={() => setPagando(false)}
          />
        </main>
      </div>
    );

  return (
    <div className="fm-pagina ig2" data-tema={temaDa(page)}>
      <main className="ig2-cartao fm-sucesso" data-tom={tom}>
        <div className="fm-sucesso-ingresso">
          <IngressoPendurado sub={sub} page={page} espera={espera} />
        </div>
        <div className="fm-sucesso-txt">
          <SeloConfirmacao tom={tom} />
          <h1 className="fm-sucesso-tit">{titulo}</h1>
          <p className="fm-sucesso-sub">
            {espera ? (
              <>
                As vagas do <b>{page?.title ?? "evento"}</b> acabaram por enquanto. Se abrir uma, avisamos pelo WhatsApp.
              </>
            ) : pendente ? (
              <>
                Sua vaga no <b>{page?.title ?? "evento"}</b> fica garantida assim que o pagamento for aprovado.
              </>
            ) : (
              <>
                Você vai ao <b>{page?.title ?? "evento"}</b>.
              </>
            )}
          </p>

          <hr className="fm-sucesso-linha" />
          <QuandoETipo ev={ev} tipo={tipo} />

          <div className="fm-sucesso-acoes">
            {pagamento === "pendente" ? (
              <button type="button" className="fm-sucesso-bt" onClick={() => setPagando(true)}>
                Pagar agora · {reais(sub.pagamento!.valor)}
              </button>
            ) : (
              agenda && (
                <a className="fm-sucesso-bt" href={agenda.google} target="_blank" rel="noopener noreferrer">
                  Adicionar à agenda
                </a>
              )
            )}
            {agenda && (
              <p className="fm-sucesso-agenda">
                {pagamento === "pendente" ? "Adicionar à agenda: " : "Ou baixe para "}
                {pagamento === "pendente" && (
                  <>
                    <a href={agenda.google} target="_blank" rel="noopener noreferrer">
                      Google
                    </a>
                    <span aria-hidden="true"> · </span>
                  </>
                )}
                <button type="button" onClick={agenda.baixarIcs}>
                  Apple ou Outlook
                </button>
              </p>
            )}
            {!espera && (
              <div className="fm-zap ig2-entrada">
                <span className="fm-zap-ic ig2-entrada-ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />
                  </svg>
                </span>
                <span className="fm-zap-txt">
                  <b>Mostre o QR code na entrada</b>
                  <small>Sem sinal? O código {sub.codigo} também serve.</small>
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
