import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Formulario } from "../lib/formularios";
import { textoConfirmacao } from "../lib/mensagens";
import { infoEvento, inicioDoEvento, type InfoEvento } from "../lib/meta";
import { metaDe } from "../lib/painel";
import type { PageRecord } from "../lib/pages";
import { qrSvg } from "../lib/qr";
import { safeUrl } from "../puck/ui";
import { formatarWhats, type Submission } from "../lib/submissions";
import { gerarIcs, googleAgendaUrl, lerLocal } from "../lib/tempo";
import { appBaseUrl } from "../router";
import { LogoIGreen } from "../ui/LogoIGreen";
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
export function compromissoDe(page: PageRecord, codigo?: string) {
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

/** Adicionar à agenda, em botões. */
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
export function quando(inicio: string | undefined) {
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

/** Estrela de quatro pontas, a mesma do selo do crachá do kit Live. */
const Brilho = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 0C8.6 4.4 11.6 7.4 16 8C11.6 8.6 8.6 11.6 8 16C7.4 11.6 4.4 8.6 0 8C4.4 7.4 7.4 4.4 8 0Z" />
  </svg>
);

/**
 * O ingresso impresso (5.4), com canhoto: no corpo a marca, data e local, a arte do evento e quem
 * vai; no canhoto, o QR code da entrada. O papel tem furo com ilhós para a alça, recortes nos
 * picotes e borda serrilhada (tudo recortado de verdade, deixa ver o fundo).
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
      <span className="tk-ilhos" aria-hidden="true" />
      <header className="tk-cab">
        <LogoIGreen className="tk-logo" />
        <span className="tk-num">
          <span className="tk-rot">Ingresso</span>
          <span>Nº {sub.codigo}</span>
        </span>
      </header>
      <i className="tk-picote" aria-hidden="true" />
      <div className="tk-info">
        <div>
          <span className="tk-rot">Quando</span>
          <span>{dia || "A confirmar"}</span>
          {hora && <span>{hora}</span>}
        </div>
        <div>
          <span className="tk-rot">Onde</span>
          <span className="tk-corta">{ev.local || "A confirmar"}</span>
          {cidade && <span className="tk-corta">{cidade}</span>}
        </div>
      </div>
      <div className="tk-arte" aria-hidden="true">
        <span className="tk-arte-luz" />
        <Brilho className="tk-arte-brilho" />
        <strong>{page?.title ?? sub.pageSlug}</strong>
        <LogoIGreen className="tk-arte-logo" titulo="" />
        <span className="tk-arte-ano">{ano}</span>
      </div>
      <dl className="tk-dados">
        <div>
          <dt>Tipo</dt>
          <dd>{tipoDe(sub, espera)}</dd>
        </div>
        <div>
          <dt>Participante</dt>
          <dd>{sub.nome || "Participante"}</dd>
        </div>
      </dl>
      <i className="tk-picote" aria-hidden="true" />
      <footer className="tk-canhoto">
        <span className="tk-qr">
          <Qr texto={linkIngresso(sub.codigo)} tamanho={62} rotulo={`QR code do ingresso ${sub.codigo}`} />
        </span>
        <span className="tk-canhoto-txt">
          <span className="tk-rot">Apresente na entrada</span>
          <b className="tk-codigo">{sub.codigo}</b>
          <span className="tk-url">igreenenergy.com.br</span>
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
 * O ingresso pendurado pela alça. Ao aparecer, cai do alto, a alça estica feito elástico, quica e
 * balança até parar (como o crachá do rodapé do kit Live). Não reage a clique.
 * Se o navegador não animar (aba escondida, movimento reduzido), ele já aparece no lugar.
 */
export function IngressoPendurado(props: Parameters<typeof CartaoIngresso>[0]) {
  const balanco = useRef<HTMLDivElement>(null);
  const alca = useRef<HTMLDivElement>(null);
  const papel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = balanco.current;
    const corda = alca.current;
    const tk = papel.current;
    const win = el?.ownerDocument.defaultView ?? window;
    if (!el || !corda || !tk || win.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const base = corda.offsetHeight;
    let y: number | null = null; // quanto a alça está esticada (negativo: o ingresso ainda caindo)
    let vy = 0;
    let ang = 0; // balanço, em graus
    let va = 0;
    let esticou = false;
    let ultimo = 0;
    let raf = 0;
    const limpar = () => {
      corda.style.height = "";
      tk.style.transform = "";
      el.style.transform = "";
    };
    const passo = (t: number) => {
      const dt = ultimo ? Math.min(0.033, (t - ultimo) / 1000) : 1 / 60;
      ultimo = t;
      // Só começa no primeiro quadro: se a aba não desenhar, o ingresso fica parado no lugar.
      if (y === null) y = -(tk.offsetHeight + base + 40);
      if (!esticou) {
        // queda livre até a alça esticar
        vy = Math.min(vy + 3400 * dt, 1050);
        y += vy * dt;
        if (y >= 0) {
          esticou = true;
          va = 44; // o tranco da alça dá o balanço
        }
      } else {
        // a alça é um elástico: mola pouco amortecida, quica algumas vezes
        vy += (-300 * y - 9 * vy) * dt;
        y += vy * dt;
        va += (-36 * ang - 2.2 * va) * dt;
        ang += va * dt;
      }
      const comprimento = base + y;
      corda.style.height = `${Math.max(0, comprimento)}px`;
      tk.style.transform = comprimento < 0 ? `translateY(${comprimento}px)` : "";
      el.style.transform = Math.abs(ang) > 0.01 ? `rotate(${ang.toFixed(2)}deg)` : "";
      if (esticou && Math.abs(y) < 0.25 && Math.abs(vy) < 3 && Math.abs(ang) < 0.04 && Math.abs(va) < 0.1) {
        limpar();
        return;
      }
      raf = win.requestAnimationFrame(passo);
    };
    raf = win.requestAnimationFrame(passo);
    return () => {
      win.cancelAnimationFrame(raf);
      limpar();
    };
  }, []);
  return (
    <div className="tk-balanco" ref={balanco}>
      <div className="tk-alca" ref={alca} aria-hidden="true">
        <svg className="tk-alca-cordas" viewBox="0 0 60 100" preserveAspectRatio="none">
          <path className="tk-corda" d="M8 0 L30 100 M52 0 L30 100" />
          <path className="tk-corda-brilho" d="M8 0 L30 100 M52 0 L30 100" />
        </svg>
        <span className="tk-presilha" />
        <span className="tk-alca-ponta" />
      </div>
      <div className="tk-papel" ref={papel}>
        <CartaoIngresso {...props} />
      </div>
    </div>
  );
}

/** Selo de confirmado (ou de atenção, para lista de espera e pagamento pendente). */
export function SeloConfirmacao({ tom }: { tom: "ok" | "aviso" }) {
  return (
    <span className="fm-sucesso-selo" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path
          className="fm-sucesso-selo-fundo"
          d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
        />
        {tom === "ok" ? <path className="fm-sucesso-selo-sinal" d="m8.6 12.2 2.3 2.3 4.6-4.8" /> : <path className="fm-sucesso-selo-sinal" d="M12 8v4.2l2.6 1.6" />}
      </svg>
    </span>
  );
}

/** Data, horário e cidade numa linha, e o tipo de entrada logo abaixo. */
export function QuandoETipo({ ev, tipo }: { ev: InfoEvento; tipo: string }) {
  const { dia, hora } = quando(ev.inicio);
  return (
    <>
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
    </>
  );
}

/** Cartão do WhatsApp: para onde a confirmação foi, com a prévia da mensagem. */
function CartaoWhats({ titulo, detalhe, children }: { titulo: string; detalhe: string; children?: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="fm-zap-bloco">
      <div className="fm-zap">
        <span className="fm-zap-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z" />
            <path className="fm-zap-fone" d="M9.2 8.2c.2-.4.4-.4.6-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.2-.1.3 0 .5.5.9 1.3 1.7 2.3 2.2.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5 0 .5-.2 1-.6 1.4-.5.4-1.3.6-2 .4-2.6-.8-4.6-2.8-5.4-5.4-.2-.8 0-1.6.4-2.3z" />
          </svg>
        </span>
        <span className="fm-zap-txt">
          <b>{titulo}</b>
          <small>{detalhe}</small>
        </span>
        {children && (
          <button type="button" className="fm-zap-ver" onClick={() => setAberto((v) => !v)} aria-expanded={aberto}>
            {aberto ? "Fechar" : "Ver"}
          </button>
        )}
      </div>
      {aberto && <div className="fm-sucesso-msg">{children}</div>}
    </div>
  );
}

const whatsLegivel = (w: string | undefined) => (w ? formatarWhats(w.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "")) : "");

type Props = { sub: Submission; page: PageRecord | undefined; form: Formulario | undefined; espera: boolean; previa: boolean };

/** Depois de se inscrever (5.1, 5.3, 5.4): o ingresso pendurado à esquerda e a confirmação à direita. */
export function Confirmacao({ sub, page, form, espera, previa }: Props) {
  const destino = form?.regras.sucesso === "redirecionar" ? safeUrl(form.regras.redirecionarPara) : undefined;
  const [falta, setFalta] = useState(destino && !previa ? 8 : 0);
  useEffect(() => {
    if (!falta || !destino) return;
    const t = setTimeout(() => (falta <= 1 ? window.location.assign(destino) : setFalta(falta - 1)), 1000);
    return () => clearTimeout(t);
  }, [falta, destino]);

  const ev = page ? infoEvento(page.data) : {};
  const pendente = sub.pagamento?.status === "pendente";
  const nome = sub.nome.trim().split(/\s+/)[0];
  const evento = page?.title ?? "evento";
  const tom = espera || pendente ? "aviso" : "ok";
  const titulo = espera ? "Você está na lista de espera." : pendente ? "Inscrição feita." : "Inscrição confirmada.";
  const agenda = page && !espera ? compromissoDe(page, sub.codigo) : null;
  const tipo = espera ? "Lista de espera" : !sub.pagamento ? "Entrada gratuita" : sub.pagamento.meia ? "Meia-entrada" : "Ingresso inteira";
  const numero = whatsLegivel(sub.whats);
  const zap = espera
    ? { titulo: "Aviso pelo WhatsApp", detalhe: "Se abrir uma vaga, avisamos na ordem da lista." }
    : pendente
      ? { titulo: "Link de pagamento no WhatsApp", detalhe: numero ? `Enviado para ${numero}` : "Abre o pagamento quando quiser." }
      : { titulo: "Confirmação no WhatsApp", detalhe: numero ? `Enviada para ${numero}` : "Chega no número que você informou." };

  return (
    <div className="fm-sucesso" data-tom={tom}>
      <div className="fm-sucesso-ingresso">
        <IngressoPendurado sub={sub} page={page} espera={espera} previa={previa} />
      </div>

      <div className="fm-sucesso-txt">
        <SeloConfirmacao tom={tom} />
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
        <QuandoETipo ev={ev} tipo={tipo} />

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
          <CartaoWhats titulo={zap.titulo} detalhe={zap.detalhe}>
            {page && !espera && (
              <BolhaWhats texto={textoConfirmacao(page, metaDe(page), { nome: sub.nome, codigo: sub.codigo }, linkIngresso(sub.codigo))} rotulo="Simulação: nada é enviado" />
            )}
          </CartaoWhats>
        </div>

        {form?.regras.mensagemSucesso && !espera && !pendente && <p className="fm-sucesso-extra">{form.regras.mensagemSucesso}</p>}
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
