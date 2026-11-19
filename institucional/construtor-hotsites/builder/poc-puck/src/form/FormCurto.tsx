import { useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { registrarUmaVez } from "../lib/eventos";
import { camposNaPagina, validarCampos, visivel, type AjusteSecao, type Formulario } from "../lib/formularios";
import type { Respostas } from "../lib/submissions";
import { usePageCtx } from "../puck/context";
import { abrirFormulario } from "./abrir";
import { Campo, type Pele } from "./Campo";
import "./form.css";

/**
 * Versão curta do formulário, dentro da peça de inscrição (3.8): só os campos marcados
 * "na página". Ao enviar, abre o modal com o resto, já com o que foi digitado.
 */
export function FormCurto({
  form,
  ajuste,
  pele,
  topo,
  botao,
  rodape,
  className,
  style,
}: {
  style?: CSSProperties;
  form: Formulario;
  /** Ajuste da seção: esconder ou trazer campos só aqui, sem mudar o formulário. */
  ajuste?: AjusteSecao;
  pele: Pele;
  topo?: ReactNode;
  botao: ReactNode;
  rodape?: ReactNode;
  className?: string;
}) {
  const ctx = usePageCtx();
  const [r, setR] = useState<Respostas>({});
  const [erros, setErros] = useState<Record<string, string>>({});
  const ref = useRef<HTMLFormElement>(null);
  const campos = camposNaPagina(form, ajuste);

  // Cada campo desenhado leva o id da pergunta (data-campo): a prévia do construtor usa para
  // saber em qual pergunta a pessoa clicou. Os escondidos pela lógica não são desenhados.
  useLayoutEffect(() => {
    const linhas = ref.current?.querySelector(".fm-linhas");
    if (!linhas) return;
    const desenhados = campos.filter((c) => visivel(c, r));
    [...linhas.children].forEach((el, i) => {
      const c = desenhados[i];
      if (c) (el as HTMLElement).dataset.campo = c.id;
    });
  });

  const muda = (id: string, v: string | string[] | undefined) => {
    setR((x) => {
      const n = { ...x };
      if (v === undefined) delete n[id];
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

  const comecou = () => {
    if (ctx.mode === "publico") registrarUmaVez({ pageId: ctx.pageId, tipo: "form-inicio", origem: ctx.origem ?? "direto", ref: ctx.persona.ref });
  };

  function enviar(ev: FormEvent) {
    ev.preventDefault();
    const e = validarCampos(campos, r);
    setErros(e);
    if (Object.keys(e).length) return;
    abrirFormulario(ref.current!.ownerDocument, { formId: form.id, iniciais: r, completo: false, ajuste });
  }

  return (
    <form ref={ref} className={className} style={style} onSubmit={enviar} onFocusCapture={comecou} noValidate data-form-inscricao>
      {topo}
      <div className="fm-linhas" data-pele={pele}>
        {campos.map((c) => (
          <Campo key={c.id} campo={c} r={r} erros={erros} muda={muda} pele={pele} form={form} pageId={ctx.pageId} />
        ))}
      </div>
      {botao}
      {rodape}
    </form>
  );
}
