import { useState, type ReactNode } from "react";
import { mascaraCpf, mascaraWhats, UFS, visivel, type Campo as TCampo } from "../lib/formularios";
import { checarCupom, precoAgora, reais } from "../lib/ingresso";
import { totalDoIngresso, usosDoCupom } from "../lib/inscrever";
import { dataCurta } from "../lib/meta";
import type { Respostas } from "../lib/submissions";
import type { Formulario } from "../lib/formularios";

/* Um campo do formulário, em três peles: "fm" (modal, endereço próprio e prévia do construtor),
   "live" (cartão do kit iGreen Live) e "hs" (peça Inscrição clássica). A pele só troca as classes. */

export type Pele = "fm" | "live" | "hs";

const PELES = {
  fm: { campo: "fm-campo", rot: "fm-rot", erro: "fm-erro", ajuda: "fm-ajuda" },
  live: { campo: "campo", rot: "fm-rot-live", erro: "erro", ajuda: "fm-ajuda fm-ajuda-live" },
  hs: { campo: "fm-campo-hs", rot: "", erro: "hs-err", ajuda: "hs-note" },
} as const;

const AUTO: Record<string, string> = { nome: "name", whats: "tel", email: "email", cidade: "address-level2" };

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/** Negrito com **asteriscos** no texto do aceite. */
function rico(t: string): ReactNode[] {
  return t.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p));
}

type Props = {
  campo: TCampo;
  r: Respostas;
  erros: Record<string, string>;
  muda: (id: string, v: string | string[] | undefined) => void;
  pele: Pele;
  form: Formulario;
  pageId: string;
};

export function Campo({ campo: c, r, erros, muda, pele, form, pageId }: Props) {
  const k = PELES[pele];
  const v = r[c.id];
  const texto = Array.isArray(v) ? "" : v ?? "";
  const erro = erros[c.id];
  const idErro = `${c.id}-erro`;
  if (!visivel(c, r) || c.tipo === "oculto" || c.tipo === "etapa") return null;

  const rotulo = (
    <span className={k.rot}>
      {c.rotulo}
      {!c.obrigatorio && c.tipo !== "info" && <span className="fm-opc"> (opcional)</span>}
    </span>
  );
  const rodape = (
    <>
      {c.ajuda && <span className={k.ajuda}>{c.ajuda}</span>}
      {erro && (
        <span className={k.erro} id={idErro} role="alert">
          {erro}
        </span>
      )}
    </>
  );
  const aria = { "aria-invalid": erro ? true : undefined, "aria-describedby": erro ? idErro : undefined };
  const meia = c.meia ? { "data-meia": "" } : {};

  switch (c.tipo) {
    case "info":
      return (
        <p className="fm-info" {...meia}>
          {c.rotulo}
        </p>
      );

    case "lgpd": {
      const marcado = texto === "sim";
      const troca = (sim: boolean) => muda(c.id, sim ? "sim" : undefined);
      if (pele === "live")
        return (
          <div className="fm-bloco">
            <label className="aceite">
              <input className="aceite-input" type="checkbox" checked={marcado} onChange={(e) => troca(e.target.checked)} {...aria} />
              <span className="aceite-caixa" aria-hidden="true">
                <Check />
              </span>
              <span className="aceite-txt">{rico(c.rotulo)}</span>
            </label>
            {rodape}
          </div>
        );
      if (pele === "hs")
        return (
          <div className="fm-bloco">
            <label className="hs-check">
              <input type="checkbox" checked={marcado} onChange={(e) => troca(e.target.checked)} {...aria} />
              <span>{rico(c.rotulo)}</span>
            </label>
            {rodape}
          </div>
        );
      return (
        <div className="fm-bloco">
          <label className="fm-aceite">
            <input type="checkbox" checked={marcado} onChange={(e) => troca(e.target.checked)} {...aria} />
            <span className="fm-caixa" aria-hidden="true">
              <Check />
            </span>
            <span>{rico(c.rotulo)}</span>
          </label>
          {rodape}
        </div>
      );
    }

    case "unica":
    case "multipla": {
      const lista = Array.isArray(v) ? v : [];
      return (
        <fieldset className={`fm-grupo ${k.campo}`} {...meia} {...aria}>
          <legend>{rotulo}</legend>
          <div className="fm-opcoes">
            {(c.opcoes ?? []).map((o) => {
              const marcado = c.tipo === "unica" ? texto === o : lista.includes(o);
              return (
                <label key={o} className="fm-opcao" data-marcado={marcado || undefined}>
                  <input
                    type={c.tipo === "unica" ? "radio" : "checkbox"}
                    name={c.id}
                    checked={marcado}
                    onChange={(e) =>
                      c.tipo === "unica" ? muda(c.id, o) : muda(c.id, e.target.checked ? [...lista, o] : lista.filter((x) => x !== o))
                    }
                  />
                  <span className="fm-marca" aria-hidden="true">
                    {c.tipo === "multipla" && <Check />}
                  </span>
                  <span>{o}</span>
                </label>
              );
            })}
          </div>
          {rodape}
        </fieldset>
      );
    }

    case "lista":
      return (
        <label className={k.campo} {...meia}>
          {rotulo}
          <select className="fm-input" value={texto} onChange={(e) => muda(c.id, e.target.value || undefined)} {...aria}>
            <option value="">Escolha</option>
            {(c.opcoes ?? []).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {rodape}
        </label>
      );

    case "cidade": {
      const [cidade, uf = ""] = texto.includes("/") ? [texto.slice(0, texto.lastIndexOf("/")), texto.slice(texto.lastIndexOf("/") + 1)] : [texto, ""];
      const junta = (ci: string, u: string) => muda(c.id, ci || u ? `${ci}/${u}` : undefined);
      return (
        <div className={k.campo} {...meia} role="group" aria-label={c.rotulo}>
          <label htmlFor={`${c.id}-cidade`}>{rotulo}</label>
          <div className="fm-cidade">
            <input id={`${c.id}-cidade`} className="fm-input" value={cidade} onChange={(e) => junta(e.target.value, uf)} autoComplete="address-level2" maxLength={80} placeholder={c.exemplo ?? "Sua cidade"} {...aria} />
            <select className="fm-input" value={uf} onChange={(e) => junta(cidade, e.target.value)} aria-label="UF" {...aria}>
              <option value="">UF</option>
              {UFS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          {rodape}
        </div>
      );
    }

    case "ingresso":
      return <Ingresso c={c} r={r} erros={erros} muda={muda} form={form} pageId={pageId} />;

    default: {
      const tipoInput = { email: "email", whats: "tel", cpf: "text", data: "date", numero: "number" }[c.tipo as string] ?? "text";
      const mascara = c.tipo === "whats" ? mascaraWhats : c.tipo === "cpf" ? mascaraCpf : (s: string) => s;
      const props = {
        className: "fm-input",
        value: texto,
        placeholder: c.exemplo,
        maxLength: c.max ?? (c.tipo === "email" ? 180 : c.tipo === "whats" ? 20 : undefined),
        autoComplete: c.base ? AUTO[c.base] : undefined,
        ...aria,
      };
      return (
        <label className={k.campo} {...meia}>
          {rotulo}
          {c.tipo === "paragrafo" ? (
            <textarea {...props} rows={4} onChange={(e) => muda(c.id, e.target.value || undefined)} />
          ) : (
            <input
              {...props}
              type={tipoInput}
              inputMode={c.tipo === "whats" ? "tel" : c.tipo === "cpf" || c.tipo === "numero" ? "numeric" : undefined}
              min={c.tipo === "numero" ? c.minimo : undefined}
              max={c.tipo === "numero" ? c.maximo : undefined}
              onChange={(e) => muda(c.id, mascara(e.target.value) || undefined)}
            />
          )}
          {rodape}
        </label>
      );
    }
  }
}

/** Ingresso (Etapa 4.1): lote do momento, inteira ou meia, cupom e total. */
function Ingresso({ c, r, erros, muda, form, pageId }: { c: TCampo; r: Respostas; erros: Record<string, string>; muda: Props["muda"]; form: Formulario; pageId: string }) {
  const cfg = c.ingresso!;
  const [digitado, setDigitado] = useState(String(r[`${c.id}-cupom`] ?? ""));
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const p = precoAgora(cfg);
  const escolha = r[c.id] === "meia" ? "meia" : "inteira";
  const total = totalDoIngresso(form, r, pageId);

  function aplicar() {
    const res = checarCupom(cfg, digitado, usosDoCupom(pageId, digitado));
    if (res.ok) {
      muda(`${c.id}-cupom`, res.cupom.codigo);
      setMsg({ ok: true, t: `Cupom ${res.cupom.codigo} aplicado.` });
    } else {
      muda(`${c.id}-cupom`, undefined);
      setMsg({ ok: false, t: res.erro });
    }
  }

  return (
    <div className="fm-ing">
      <div className="fm-ing-topo">
        <span className="fm-rot">{c.rotulo}</span>
        <span className="fm-ing-lote">
          {p.nome}
          {p.ate && ` · até ${dataCurta(p.ate).split(" · ")[0]}`}
        </span>
      </div>
      {cfg.meia ? (
        <div className="fm-ing-opcoes" role="radiogroup" aria-label="Tipo de ingresso">
          {(
            [
              ["inteira", "Inteira", p.preco],
              ["meia", "Meia-entrada", p.preco / 2],
            ] as const
          ).map(([id, rot, preco]) => (
            <label key={id} className="fm-ing-op" data-marcado={escolha === id || undefined}>
              <input type="radio" name={c.id} checked={escolha === id} onChange={() => muda(c.id, id)} />
              <span>{rot}</span>
              <b>{reais(preco)}</b>
            </label>
          ))}
        </div>
      ) : (
        <p className="fm-ing-unico">
          <span>{cfg.nomeIngresso}</span>
          <b>{reais(p.preco)}</b>
        </p>
      )}
      {p.depois && p.depois.preco !== p.preco && (
        <p className="fm-ajuda">
          Depois deste lote: {p.depois.nome}, {reais(p.depois.preco)}.
        </p>
      )}
      {cfg.meia && escolha === "meia" && (
        <div className="fm-bloco">
          <label className="fm-aceite">
            <input type="checkbox" checked={r[`${c.id}-declaro`] === "sim"} onChange={(e) => muda(`${c.id}-declaro`, e.target.checked ? "sim" : undefined)} />
            <span className="fm-caixa" aria-hidden="true">
              <Check />
            </span>
            <span>{cfg.textoMeia}</span>
          </label>
          {erros[`${c.id}-declaro`] && (
            <span className="fm-erro" role="alert">
              {erros[`${c.id}-declaro`]}
            </span>
          )}
        </div>
      )}
      {cfg.cupons.length > 0 && (
        <div className="fm-cupom">
          <input
            className="fm-input"
            value={digitado}
            onChange={(e) => setDigitado(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                aplicar();
              }
            }}
            placeholder="Cupom de desconto"
            aria-label="Cupom de desconto"
            maxLength={30}
          />
          <button type="button" className="fm-bt fm-bt-sec" onClick={aplicar}>
            Aplicar
          </button>
        </div>
      )}
      {msg && <span className={msg.ok ? "fm-ok" : "fm-erro"}>{msg.t}</span>}
      {total && (
        <dl className="fm-total">
          <div>
            <dt>{total.lote}</dt>
            <dd>{reais(total.base)}</dd>
          </div>
          {total.descontoMeia > 0 && (
            <div>
              <dt>Meia-entrada</dt>
              <dd>−{reais(total.descontoMeia)}</dd>
            </div>
          )}
          {total.descontoCupom > 0 && (
            <div>
              <dt>Cupom</dt>
              <dd>−{reais(total.descontoCupom)}</dd>
            </div>
          )}
          <div className="fm-total-final">
            <dt>Total</dt>
            <dd>{total.total > 0 ? reais(total.total) : "Grátis"}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
