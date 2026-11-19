import { useEffect, useRef, useState } from "react";
import type { Formulario } from "../lib/formularios";
import { textoConfirmacao } from "../lib/mensagens";
import { infoEvento, inicioDoEvento } from "../lib/meta";
import { metaDe } from "../lib/painel";
import type { PageRecord } from "../lib/pages";
import { qrSvg } from "../lib/qr";
import { safeUrl } from "../puck/ui";
import type { Submission } from "../lib/submissions";
import { gerarIcs, googleAgendaUrl, lerLocal } from "../lib/tempo";
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

/** O compromisso na agenda (5.3): para o Google Agenda e o arquivo .ics (Apple, Outlook). */
function compromissoDe(page: PageRecord, codigo?: string) {
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
  return { google: googleAgendaUrl(compromisso), baixarIcs };
}

/** Adicionar à agenda, em botões (página do ingresso). */
export function Agenda({ page, codigo }: { page: PageRecord; codigo?: string }) {
  const c = compromissoDe(page, codigo);
  if (!c) return null;
  return (
    <div className="fm-agenda">
      <a className="fm-bt fm-bt-sec" href={c.google} target="_blank" rel="noopener noreferrer">
        Google Agenda
      </a>
      <button type="button" className="fm-bt fm-bt-sec" onClick={c.baixarIcs}>
        Apple ou Outlook (.ics)
      </button>
    </div>
  );
}

/** "Sáb, 12 dez" e "19h" para o ingresso e a confirmação. */
function quando(inicio: string | undefined) {
  const d = lerLocal(inicio);
  if (!d) return { dia: "", hora: "" };
  const dia = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "numeric", month: "short" }).format(d).replace(/\./g, "").replace(" de ", " ");
  return { dia: dia.charAt(0).toUpperCase() + dia.slice(1), hora: `${d.getHours()}h${d.getMinutes() ? String(d.getMinutes()).padStart(2, "0") : ""}` };
}

/** O tipo de entrada, como aparece no ingresso. */
function tipoDe(sub: Submission, espera: boolean) {
  if (espera) return "Lista de espera";
  if (!sub.pagamento) return "Gratuito";
  return sub.pagamento.meia ? "Meia-entrada" : "Inteira";
}

/**
 * O ingresso impresso (5.4): marca no topo com o furo da alça, data e local, a arte do evento,
 * tipo, código e participante, e o QR code da entrada. Picotes entre as partes, como papel.
 */
export function CartaoIngresso({ sub, page, espera = false, previa = false }: { sub: Submission; page: PageRecord | undefined; espera?: boolean; previa?: boolean }) {
  const ev = page ? infoEvento(page.data) : {};
  const pendente = sub.pagamento?.status === "pendente";
  const carimbo = espera ? "Lista de espera" : pendente ? "Pagamento pendente" : previa ? "Prévia" : "";
  const { dia, hora } = quando(ev.inicio);
  const ano = lerLocal(ev.inicio)?.getFullYear() ?? new Date().getFullYear();
  const cidade = [ev.cidade, ev.uf].filter(Boolean).join("/");
  return (
    <article className="tk" data-estado={espera ? "espera" : pendente ? "pendente" : "ok"} aria-label={`Ingresso de ${sub.nome} para ${page?.title ?? "o evento"}`}>
      <span className="tk-furo" aria-hidden="true" />
      <header className="tk-cab">
        <span className="tk-marca">
          <b>iGreen</b>
          <span className="tk-selo">Ingresso</span>
        </span>
        <span className="tk-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15zM5 19l7-7" />
          </svg>
        </span>
      </header>
      <div className="tk-corte" aria-hidden="true" />
      <div className="tk-info">
        <div>
          <span className="tk-rot">Data</span>
          <span>{dia || "A confirmar"}</span>
          {hora && <span>{hora}</span>}
        </div>
        <div>
          <span className="tk-rot">Local</span>
          <span>{ev.local || "A confirmar"}</span>
          {cidade && <span>{cidade}</span>}
        </div>
      </div>
      <div className="tk-arte" aria-hidden="true">
        <i className="tk-f1" />
        <i className="tk-f2" />
        <i className="tk-f3" />
        <i className="tk-f4" />
        <strong>{page?.title ?? sub.pageSlug}</strong>
        <span className="tk-arte-pe">
          iGreen
          <br />
          {ano}
        </span>
      </div>
      <div className="tk-corte" aria-hidden="true" />
      <dl className="tk-dados">
        <div>
          <dt>Tipo</dt>
          <dd>{tipoDe(sub, espera)}</dd>
        </div>
        <div>
          <dt>Código</dt>
          <dd className="tk-codigo">{sub.codigo}</dd>
        </div>
        <div>
          <dt>Participante</dt>
          <dd>{sub.nome || "Participante"}</dd>
        </div>
      </dl>
      <div className="tk-corte" aria-hidden="true" />
      <footer className="tk-pe">
        <span className="tk-qr">
          <Qr texto={linkIngresso(sub.codigo)} tamanho={60} rotulo={`QR code do ingresso ${sub.codigo}`} />
        </span>
        <span className="tk-pe-txt">
          <span className="tk-rot">Apresente na entrada</span>
          <span className="tk-url">igreen.com.br</span>
        </span>
        <svg className="tk-seta" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7l10 10M17 8v9H8" />
        </svg>
      </footer>
      {carimbo && <span className="tk-carimbo">{carimbo}</span>}
    </article>
  );
}

/**
 * O ingresso pendurado pela alça: cai do alto do modal, estica a alça, balança e para (como o crachá
 * do rodapé do kit Live). Dá para puxar de lado e soltar. Com movimento reduzido, fica parado.
 */
function IngressoPendurado(props: Parameters<typeof CartaoIngresso>[0]) {
  const balanco = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = balanco.current;
    const win = el?.ownerDocument.defaultView ?? window;
    if (!el || win.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    // Pêndulo com mola: ângulo em graus, rigidez e amortecimento escolhidos para parar em ~3 s.
    const K = 38;
    const C = 2.1;
    let ang = 0;
    let vel = 0;
    let raf = 0;
    let ultimo = 0;
    let arrasto: { x: number; ang: number; px: number; t: number } | null = null;
    const desenhar = () => (el.style.transform = Math.abs(ang) < 0.01 ? "" : `rotate(${ang.toFixed(2)}deg)`);
    const passo = (t: number) => {
      const dt = ultimo ? Math.min(0.034, (t - ultimo) / 1000) : 1 / 60;
      ultimo = t;
      if (!arrasto) {
        vel += (-K * ang - C * vel) * dt;
        ang += vel * dt;
      }
      desenhar();
      if (!arrasto && Math.abs(ang) < 0.03 && Math.abs(vel) < 0.05) {
        ang = 0;
        desenhar();
        raf = 0;
        ultimo = 0;
        return;
      }
      raf = win.requestAnimationFrame(passo);
    };
    const mexer = () => {
      if (!raf) raf = win.requestAnimationFrame(passo);
    };
    // Depois da queda, o tranco da alça dá o primeiro balanço.
    const queda = win.setTimeout(() => {
      vel = 46;
      mexer();
    }, 620);
    const baixo = (e: PointerEvent) => {
      if (e.button !== 0) return;
      el.setPointerCapture(e.pointerId);
      arrasto = { x: e.clientX, ang, px: e.clientX, t: performance.now() };
      vel = 0;
      el.dataset.arrastando = "";
      mexer();
    };
    const move = (e: PointerEvent) => {
      if (!arrasto) return;
      const agora = performance.now();
      const novo = Math.max(-28, Math.min(28, arrasto.ang + (e.clientX - arrasto.x) * 0.16));
      const dt = Math.max(0.008, (agora - arrasto.t) / 1000);
      vel = (novo - ang) / dt;
      ang = novo;
      arrasto.px = e.clientX;
      arrasto.t = agora;
    };
    const solta = () => {
      if (!arrasto) return;
      arrasto = null;
      vel = Math.max(-160, Math.min(160, vel));
      delete el.dataset.arrastando;
      mexer();
    };
    el.addEventListener("pointerdown", baixo);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", solta);
    el.addEventListener("pointercancel", solta);
    return () => {
      win.clearTimeout(queda);
      win.cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", baixo);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", solta);
      el.removeEventListener("pointercancel", solta);
    };
  }, []);
  return (
    <div className="tk-pendurado">
      <div className="tk-balanco" ref={balanco}>
        <svg className="tk-alca" viewBox="0 0 64 96" aria-hidden="true">
          <path d="M14 0 L32 84 M50 0 L32 84" />
        </svg>
        <CartaoIngresso {...props} />
      </div>
    </div>
  );
}

type Props = { sub: Submission; page: PageRecord | undefined; form: Formulario | undefined; espera: boolean; previa: boolean };

/** Depois de se inscrever (5.1, 5.3, 5.4): o ingresso pendurado à esquerda e a confirmação à direita. */
export function Confirmacao({ sub, page, form, espera, previa }: Props) {
  const destino = form?.regras.sucesso === "redirecionar" ? safeUrl(form.regras.redirecionarPara) : undefined;
  const [falta, setFalta] = useState(destino && !previa ? 8 : 0);
  const [verMsg, setVerMsg] = useState(false);
  useEffect(() => {
    if (!falta || !destino) return;
    const t = setTimeout(() => (falta <= 1 ? window.location.assign(destino) : setFalta(falta - 1)), 1000);
    return () => clearTimeout(t);
  }, [falta, destino]);

  const ev = page ? infoEvento(page.data) : {};
  const { dia, hora } = quando(ev.inicio);
  const pendente = sub.pagamento?.status === "pendente";
  const nome = sub.nome.trim().split(/\s+/)[0];
  const evento = page?.title ?? "evento";
  const tom = espera || pendente ? "aviso" : "ok";
  const titulo = espera ? "Você está na lista de espera." : pendente ? "Inscrição feita." : "Inscrição confirmada.";
  const agenda = page && !espera ? compromissoDe(page, sub.codigo) : null;
  const tipo = espera ? "Lista de espera" : !sub.pagamento ? "Entrada gratuita" : sub.pagamento.meia ? "Meia-entrada" : "Ingresso inteira";
  const nota = espera
    ? "Se alguém desistir, avisamos pelo WhatsApp, na ordem da lista."
    : pendente
      ? "O link do ingresso, que também chega no WhatsApp, abre o pagamento de novo."
      : form?.regras.mensagemSucesso || "A confirmação chega no seu WhatsApp.";

  return (
    <div className="fm-sucesso" data-tom={tom}>
      <div className="fm-sucesso-ingresso">
        <IngressoPendurado sub={sub} page={page} espera={espera} previa={previa} />
      </div>

      <div className="fm-sucesso-txt">
        <span className="fm-sucesso-selo" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              className="fm-sucesso-selo-fundo"
              d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
            />
            {tom === "ok" ? <path className="fm-sucesso-selo-sinal" d="m8.6 12.2 2.3 2.3 4.6-4.8" /> : <path className="fm-sucesso-selo-sinal" d="M12 8v4.2l2.6 1.6" />}
          </svg>
        </span>
        <h2 className="fm-sucesso-tit">{titulo}</h2>
        <p className="fm-sucesso-sub">
          {espera ? (
            <>
              As vagas do <b>{evento}</b> acabaram por enquanto.
            </>
          ) : pendente ? (
            <>
              Falta só o pagamento pra garantir a sua vaga no <b>{evento}</b>.
            </>
          ) : (
            <>
              {nome ? `Tudo certo, ${nome}! ` : ""}Você vai ao <b>{evento}</b>.
            </>
          )}
        </p>

        <hr className="fm-sucesso-linha" />

        {(dia || ev.cidade) && (
          <p className="fm-sucesso-quando">
            {[dia, hora].filter(Boolean).join(" · ")}
            {dia && ev.cidade && <i aria-hidden="true">•</i>}
            {ev.cidade}
          </p>
        )}
        <span className="fm-sucesso-tipo">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4zM14 6v12" />
          </svg>
          {tipo}
        </span>

        <div className="fm-sucesso-acoes">
          {!previa && sub.codigo ? (
            <a className="fm-sucesso-bt" href={`#/ingresso/${sub.codigo}`} target="_blank" rel="noopener noreferrer">
              {pendente ? "Pagar agora" : "Ver meu ingresso"}
            </a>
          ) : (
            agenda && (
              <a className="fm-sucesso-bt" href={agenda.google} target="_blank" rel="noopener noreferrer">
                Adicionar à agenda
              </a>
            )
          )}
          {agenda && !previa && (
            <p className="fm-sucesso-agenda">
              Adicionar à agenda:{" "}
              <a href={agenda.google} target="_blank" rel="noopener noreferrer">
                Google
              </a>
              <span aria-hidden="true"> · </span>
              <button type="button" onClick={agenda.baixarIcs}>
                Apple ou Outlook
              </button>
            </p>
          )}
        </div>

        <p className="fm-sucesso-nota">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
          <span>
            {nota}
            {page && !espera && (
              <>
                {" "}
                <button type="button" onClick={() => setVerMsg((v) => !v)} aria-expanded={verMsg}>
                  {verMsg ? "Esconder a mensagem" : "Ver a mensagem"}
                </button>
              </>
            )}
          </span>
        </p>
        {verMsg && page && (
          <div className="fm-sucesso-msg">
            <BolhaWhats texto={textoConfirmacao(page, metaDe(page), { nome: sub.nome, codigo: sub.codigo }, linkIngresso(sub.codigo))} rotulo="Simulação: nada é enviado" />
          </div>
        )}

        {destino && (
          <p className="fm-sucesso-extra">
            {previa ? (
              <>Na página publicada, a pessoa seguiria para {destino}.</>
            ) : (
              <>
                Seguindo para a próxima página em {falta}s… <a href={destino}>Ir agora</a>
              </>
            )}
          </p>
        )}
        {previa && <p className="fm-sucesso-extra">Prévia: nada foi gravado.</p>}
      </div>
    </div>
  );
}
