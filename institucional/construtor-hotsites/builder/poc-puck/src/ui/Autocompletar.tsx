import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icone } from "./Icone";
import "./autocompletar.css";

export type OpcaoAuto = {
  id: string;
  titulo: string;
  detalhe?: string;
  /** Iniciais no círculo à esquerda. */
  sigla?: string;
  /** Opção que aparece, mas não dá para escolher (ex.: "Já tem link"). */
  bloqueio?: string;
};

/**
 * Campo com lista de opções (autocomplete). Ao clicar, já mostra todas as opções; digitar filtra
 * (o filtro é de quem usa: `opcoes` chega pronta). Setas navegam, Enter escolhe a opção marcada,
 * Esc fecha. Sem opção marcada, o Enter segue para o formulário (ex.: adicionar um nome novo).
 */
export function Autocompletar({
  rotulo,
  valor,
  muda,
  opcoes,
  escolher,
  placeholder,
  dica,
  vazio,
  required,
  maxLength,
}: {
  rotulo: string;
  valor: string;
  muda: (v: string) => void;
  opcoes: OpcaoAuto[];
  escolher: (o: OpcaoAuto) => void;
  placeholder?: string;
  dica?: string;
  /** Texto quando nada combina com o que foi digitado. */
  vazio?: string;
  required?: boolean;
  maxLength?: number;
}) {
  const id = useId();
  const campo = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);
  const semNada = opcoes.length === 0 && Boolean(vazio && valor.trim());
  const mostra = aberto && (opcoes.length > 0 || semNada);

  // A opção marcada fica sempre visível dentro da lista.
  useEffect(() => {
    lista.current?.querySelector(`[data-i="${ativo}"]`)?.scrollIntoView({ block: "nearest" });
  }, [ativo]);

  const pegar = (o: OpcaoAuto) => {
    if (o.bloqueio) return;
    escolher(o);
    setAberto(false);
    setAtivo(-1);
  };
  const andar = (passo: 1 | -1) =>
    setAtivo((a) => {
      let n = a;
      for (let k = 0; k < opcoes.length; k++) {
        n = (n + passo + opcoes.length) % opcoes.length;
        if (!opcoes[n].bloqueio) return n;
      }
      return a;
    });
  const tecla = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!aberto) return setAberto(true);
      if (opcoes.length) andar(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Enter" && mostra && ativo >= 0 && opcoes[ativo]) {
      e.preventDefault();
      pegar(opcoes[ativo]);
    } else if (e.key === "Escape" && aberto) {
      e.stopPropagation();
      setAberto(false);
    }
  };

  return (
    <div className="ac">
      <label className="ac-rot" htmlFor={`${id}-in`}>
        {rotulo}
      </label>
      <div className="ac-caixa" data-aberto={mostra || undefined}>
        <Icone nome="busca" tamanho={16} className="ac-ic" />
        <input
          ref={campo}
          id={`${id}-in`}
          role="combobox"
          aria-expanded={mostra}
          aria-controls={`${id}-lista`}
          aria-autocomplete="list"
          aria-activedescendant={mostra && ativo >= 0 ? `${id}-op-${ativo}` : undefined}
          autoComplete="off"
          value={valor}
          onChange={(e) => {
            muda(e.target.value);
            setAtivo(-1);
            setAberto(true);
          }}
          onFocus={() => setAberto(true)}
          onClick={() => setAberto(true)}
          onBlur={() => setAberto(false)}
          onKeyDown={tecla}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
        />
        <button
          type="button"
          className="ac-seta"
          tabIndex={-1}
          aria-label={mostra ? "Fechar a lista" : "Mostrar a lista"}
          onMouseDown={(e) => {
            e.preventDefault();
            setAberto((a) => !a);
            campo.current?.focus();
          }}
        >
          <Icone nome={mostra ? "chevCima" : "chev"} tamanho={16} />
        </button>
        {mostra && (
          <ul className="ac-lista" id={`${id}-lista`} role="listbox" aria-label={rotulo} ref={lista}>
            {semNada ? (
              <li className="ac-vazio" role="presentation">
                {vazio}
              </li>
            ) : (
              opcoes.map((o, i) => (
                <li
                  key={o.id}
                  id={`${id}-op-${i}`}
                  data-i={i}
                  role="option"
                  aria-selected={i === ativo}
                  aria-disabled={o.bloqueio ? true : undefined}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pegar(o);
                  }}
                  onMouseEnter={() => !o.bloqueio && setAtivo(i)}
                >
                  {o.sigla && (
                    <span className="ac-sigla" aria-hidden="true">
                      {o.sigla}
                    </span>
                  )}
                  <span className="ac-txt">
                    <b>{o.titulo}</b>
                    {o.detalhe && <small>{o.detalhe}</small>}
                  </span>
                  {o.bloqueio && <em>{o.bloqueio}</em>}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {dica && <small className="ac-dica">{dica}</small>}
    </div>
  );
}

/** "Ana Paula Dias" → "AP". */
export const siglaDe = (nome: string) =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
