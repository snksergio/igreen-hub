import { createUsePuck, type RadioField } from "@puckeditor/core";
import type { ReactNode } from "react";
import { CATALOGO, type PecaId } from "../../puck/catalogo";
import { Icone } from "../../ui/Icone";
import { RotuloComAjuda } from "../../ui/Ajuda";

const usePuck = createUsePuck();

/** Cabeçalho do painel da direita: onde estou (Página › peça), nome, termo técnico e trava. */
export function CamposComCabecalho({ children }: { children: ReactNode }) {
  const selecionada = usePuck((s) => s.selectedItem);
  const sel = usePuck((s) => s.appState.ui.itemSelector);
  const dispatch = usePuck((s) => s.dispatch);
  const ficha = selecionada ? CATALOGO[selecionada.type as PecaId] : null;
  const travado = Boolean((selecionada?.props as { travado?: boolean } | undefined)?.travado);

  /** Tira a trava do modelo: a peça passa a poder mudar de lugar, ser duplicada e apagada. */
  const destravar = () => {
    if (!selecionada || !sel) return;
    dispatch({
      type: "replace",
      destinationIndex: sel.index,
      destinationZone: sel.zone ?? "root:default-zone",
      data: { ...selecionada, props: { ...selecionada.props, travado: false } },
    });
  };

  return (
    <div className="cp">
      <div className="cp-cabeca">
        <div className="cp-trilha">
          {selecionada ? (
            <button onClick={() => dispatch({ type: "setUi", ui: { itemSelector: null } })}>Página</button>
          ) : (
            <span>Página</span>
          )}
          {ficha && (
            <>
              <Icone nome="chevDir" tamanho={13} />
              <span>{ficha.nome}</span>
            </>
          )}
        </div>
        <h2>{ficha ? ficha.nome : "Configurações da página"}</h2>
        <div className="cp-chips">
          <span className="chip">{ficha ? ficha.tecnico : "Google, compartilhar e animações"}</span>
          {travado && (
            <span className="chip chip-trava">
              <Icone nome="cadeado" tamanho={13} />
              Travada pelo modelo
              <button className="chip-acao" onClick={destravar} title="A peça poderá mudar de lugar, ser duplicada e apagada">
                Destravar
              </button>
            </span>
          )}
        </div>
      </div>
      <div className="cp-campos">{children}</div>
    </div>
  );
}

/** Opções de escolha única como botões lado a lado (no lugar das bolinhas de rádio). */
export function RadioSegmentado({
  field,
  name,
  value,
  onChange,
  readOnly,
}: {
  field: RadioField;
  name: string;
  value: unknown;
  onChange: (v: unknown) => void;
  readOnly?: boolean;
}) {
  const opcoes = field.options ?? [];
  const rotulo = field.label ?? name;
  // Explicação opcional: fica embaixo do título, não dentro da opção (opção longa estourava o painel).
  const ajuda = (field as RadioField & { ajuda?: string }).ajuda;
  return (
    <div className="cp-radio">
      <RotuloComAjuda rotulo={rotulo} className="cp-rotulo" />
      {ajuda && <span className="cp-ajuda">{ajuda}</span>}
      <div className="seg seg-quebra cp-seg" role="radiogroup" aria-label={rotulo}>
        {opcoes.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            aria-pressed={o.value === value}
            disabled={readOnly}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
