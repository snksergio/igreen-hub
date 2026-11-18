import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { etapasDoModal, validarCampos, visivel, type Formulario } from "../lib/formularios";
import { reais } from "../lib/ingresso";
import { inscrever, pagar, type Resultado } from "../lib/inscrever";
import type { PageRecord } from "../lib/pages";
import type { Respostas, Submission } from "../lib/submissions";
import { Campo } from "./Campo";
import { Confirmacao, Qr } from "./Confirmacao";
import "./form.css";

export type Contexto = {
  page: PageRecord | undefined;
  pageId: string;
  pageSlug: string;
  ref?: string;
  origem: string;
  /** Prévia do construtor ou página não publicada: nada é gravado. */
  previa: boolean;
};

type Fase = { tipo: "form" } | { tipo: "pagamento"; sub: Submission } | { tipo: "fim"; sub: Submission; espera: boolean };

/**
 * O formulário em etapas, o pagamento simulado e a confirmação. Mostra só o que falta
 * (a versão curta já veio da página) ou tudo (modal direto e endereço próprio).
 */
export function Fluxo({ form, ctx, iniciais = {}, completo }: { form: Formulario; ctx: Contexto; iniciais?: Respostas; completo: boolean }) {
  const etapas = useMemo(() => etapasDoModal(form, completo), [form, completo]);
  const [passo, setPasso] = useState(0);
  const [r, setR] = useState<Respostas>(iniciais);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [motivo, setMotivo] = useState("");
  const [fase, setFase] = useState<Fase>({ tipo: "form" });
  const topo = useRef<HTMLDivElement>(null);
  const enviouSozinho = useRef(false);

  const muda = (id: string, v: string | string[] | undefined) => {
    setR((x) => {
      const n = { ...x };
      if (v === undefined || (Array.isArray(v) && !v.length)) delete n[id];
      else n[id] = v;
      return n;
    });
    setErros((e) => {
      if (!e[id]) return e;
      const n = { ...e };
      delete n[id];
      return n;
    });
  };

  function concluir(res: Resultado) {
    if (!res.ok) {
      setMotivo(res.motivo);
      return;
    }
    setMotivo("");
    setFase(res.aPagar ? { tipo: "pagamento", sub: res.sub } : { tipo: "fim", sub: res.sub, espera: res.espera });
  }

  const enviar = (respostas: Respostas) => concluir(inscrever(form, respostas, ctx));

  // Tudo já foi preenchido na página (ex.: pré-cadastro): envia direto e mostra a confirmação.
  useEffect(() => {
    if (etapas.length === 0 && !enviouSozinho.current) {
      enviouSozinho.current = true;
      const e = validarCampos(form.campos, iniciais);
      if (Object.keys(e).length) setMotivo("Confira os campos do formulário.");
      else enviar(iniciais);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    topo.current?.scrollIntoView({ block: "nearest" });
    const primeiro = topo.current?.parentElement?.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea");
    primeiro?.focus({ preventScroll: true });
  }, [passo, fase.tipo]);

  if (fase.tipo === "pagamento")
    return (
      <Pagamento
        sub={fase.sub}
        previa={ctx.previa}
        resolver={(sub, aprovado) => aprovado && setFase({ tipo: "fim", sub, espera: false })}
        desistir={() => setFase({ tipo: "fim", sub: fase.sub, espera: false })}
      />
    );
  if (fase.tipo === "fim") return <Confirmacao sub={fase.sub} page={ctx.page} form={form} espera={fase.espera} previa={ctx.previa} />;
  if (etapas.length === 0)
    return (
      <div className="fm-fim" ref={topo}>
        {motivo ? <p className="fm-alerta">{motivo}</p> : <p className="fm-texto">Enviando…</p>}
      </div>
    );

  const etapa = etapas[Math.min(passo, etapas.length - 1)];
  const ultima = passo >= etapas.length - 1;

  function avancar(ev: FormEvent) {
    ev.preventDefault();
    const e = validarCampos(etapa.campos, r);
    setErros(e);
    if (Object.keys(e).length) {
      const primeiro = Object.keys(e)[0];
      topo.current?.parentElement?.querySelector<HTMLElement>(`[aria-describedby="${primeiro}-erro"]`)?.focus();
      return;
    }
    if (!ultima) {
      setPasso(passo + 1);
      return;
    }
    // No fim, confere tudo de novo (inclusive a parte que veio da página).
    const tudo = validarCampos(form.campos, r);
    if (Object.keys(tudo).length) {
      setErros(tudo);
      setMotivo("Faltou algum dado obrigatório. Confira os campos.");
      return;
    }
    enviar(r);
  }

  return (
    <form className="fm-fluxo" onSubmit={avancar} noValidate>
      <div ref={topo} />
      {etapas.length > 1 && (
        <div className="fm-passos" aria-label={`Etapa ${passo + 1} de ${etapas.length}`}>
          <span>
            Etapa {passo + 1} de {etapas.length} · <b>{etapa.titulo}</b>
          </span>
          <span className="fm-passos-barra" aria-hidden="true">
            <i style={{ width: `${((passo + 1) / etapas.length) * 100}%` }} />
          </span>
        </div>
      )}
      {!completo && passo === 0 && Object.keys(iniciais).length > 0 && (
        <p className="fm-texto">
          Quase lá{iniciais.nome ? `, ${String(iniciais.nome).split(" ")[0]}` : ""}! {perguntasQueFaltam(etapas, r)}
        </p>
      )}
      <div className="fm-linhas">
        {etapa.campos.map((c) => (
          <Campo key={c.id} campo={c} r={r} erros={erros} muda={muda} pele="fm" form={form} pageId={ctx.pageId} />
        ))}
      </div>
      {motivo && (
        <p className="fm-alerta" role="alert">
          {motivo}
        </p>
      )}
      <div className="fm-acoes">
        {passo > 0 && (
          <button type="button" className="fm-bt fm-bt-sec" onClick={() => setPasso(passo - 1)}>
            Voltar
          </button>
        )}
        <button type="submit" className="fm-bt fm-bt-pri">
          {ultima ? form.botaoFinal || "Enviar" : "Continuar"}
        </button>
      </div>
      {ctx.previa && <p className="fm-previa">Prévia: a inscrição não é gravada.</p>}
    </form>
  );
}

/** "Só mais 3 perguntas." — conta o que aparece agora, sem aviso, aceite e campo oculto. */
function perguntasQueFaltam(etapas: ReturnType<typeof etapasDoModal>, r: Respostas): string {
  const n = etapas.reduce((t, e) => t + e.campos.filter((c) => !["info", "oculto", "lgpd", "etapa"].includes(c.tipo) && visivel(c, r)).length, 0);
  return n === 0 ? "Falta só confirmar." : n === 1 ? "Só mais uma pergunta." : `Só mais ${n} perguntas.`;
}

/** Tela de pagamento simulada (4.2): imita o meio de pagamento, com aprovar e recusar. */
export function Pagamento({ sub, previa, resolver, desistir }: { sub: Submission; previa: boolean; resolver: (s: Submission, aprovado: boolean) => void; desistir: () => void }) {
  const [metodo, setMetodo] = useState<"pix" | "cartao">("pix");
  const [recusado, setRecusado] = useState(false);
  const p = sub.pagamento!;
  const decidir = (aprovado: boolean) => {
    const novo = pagar(sub, aprovado, metodo, previa);
    setRecusado(!aprovado);
    resolver(novo, aprovado);
  };
  return (
    <div className="fm-pag">
      <div className="fm-pag-topo">
        <span className="fm-pag-selo">Ambiente de pagamento · simulação</span>
        <h2 className="fm-titulo">Pagamento</h2>
        <p className="fm-texto">Nenhum valor é cobrado na POC. Use os botões abaixo para simular o que o banco responderia.</p>
      </div>
      <dl className="fm-total">
        <div>
          <dt>{p.lote ?? "Ingresso"}{p.meia ? " · meia-entrada" : ""}</dt>
          <dd>{p.cupom ? `cupom ${p.cupom}` : ""}</dd>
        </div>
        <div className="fm-total-final">
          <dt>Total</dt>
          <dd>{reais(p.valor)}</dd>
        </div>
      </dl>
      <div className="fm-abas" role="tablist" aria-label="Forma de pagamento">
        {(
          [
            ["pix", "Pix"],
            ["cartao", "Cartão de crédito"],
          ] as const
        ).map(([id, rot]) => (
          <button key={id} type="button" role="tab" aria-selected={metodo === id} onClick={() => setMetodo(id)}>
            {rot}
          </button>
        ))}
      </div>
      {metodo === "pix" ? (
        <div className="fm-pix">
          <Qr texto={`SIMULACAO-PIX-${sub.codigo}-${p.valor.toFixed(2)}`} tamanho={140} rotulo="QR code de Pix simulado" />
          <p className="fm-ajuda">QR code de mentira: não abre pagamento em nenhum banco. Na versão real, viria do meio de pagamento escolhido (7.6).</p>
        </div>
      ) : (
        <p className="fm-ajuda fm-pix">Na versão real, os dados do cartão seriam digitados na tela do meio de pagamento, nunca na página do evento.</p>
      )}
      {recusado && (
        <p className="fm-alerta" role="alert">
          Pagamento recusado (simulação). A inscrição ficou pendente: tente de novo ou troque a forma de pagamento.
        </p>
      )}
      <div className="fm-acoes">
        <button type="button" className="fm-bt fm-bt-sec" onClick={() => decidir(false)}>
          Simular recusa
        </button>
        <button type="button" className="fm-bt fm-bt-pri" onClick={() => decidir(true)}>
          Simular pagamento aprovado
        </button>
      </div>
      <button type="button" className="fm-link fm-depois" onClick={desistir}>
        Pagar depois
      </button>
    </div>
  );
}
