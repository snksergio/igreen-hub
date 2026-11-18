import { useId, type MouseEvent } from "react";
import "./ajuda.css";

/**
 * Rótulo com explicação: "Menu do topo (link: #programacao…)" vira "Menu do topo" e um ícone de
 * ajuda. A explicação abre num balão ao passar o mouse ou ao focar com o teclado.
 */
export function separarRotulo(rotulo: string): { titulo: string; ajuda?: string } {
  const m = rotulo.match(/^(.*?)\s*\(([^()]+)\)\s*$/);
  return m && m[1].trim() ? { titulo: m[1].trim(), ajuda: m[2].trim() } : { titulo: rotulo };
}

/** Explicação mais longa para alguns campos (o texto curto do rótulo continua igual). */
const MAIS: Record<string, string> = {
  "link: #programacao, #palestrantes, #local, #perguntas":
    "Cada item vira um link no topo. Use # e o nome da seção para rolar até ela (#programacao, #palestrantes, #local, #perguntas) ou um endereço completo para outro site.",
  "aceita {nome} e {cidade}": "Escreva {nome} ou {cidade} no texto: no link de um licenciado, troca pelo nome e pela cidade dele.",
};

export function Ajuda({ texto }: { texto: string }) {
  const id = useId();
  const longo = MAIS[texto] ?? texto;
  const parar = (e: MouseEvent) => e.preventDefault(); // dentro do <label>, o clique não deve ir para o campo
  return (
    <span className="aj">
      <span className="aj-ic" role="img" tabIndex={0} aria-label={`Ajuda: ${longo}`} aria-describedby={id} onClick={parar}>
        ?
      </span>
      <span className="aj-pop" role="tooltip" id={id}>
        {longo.charAt(0).toUpperCase() + longo.slice(1)}
      </span>
    </span>
  );
}

/** Para os campos próprios (imagem, data, formulário…), que desenham o rótulo eles mesmos. */
export function RotuloComAjuda({ rotulo, className = "fi-rotulo" }: { rotulo: string; className?: string }) {
  const { titulo, ajuda } = separarRotulo(rotulo);
  return (
    <span className={`${className} aj-linha`}>
      {titulo}
      {ajuda && <Ajuda texto={ajuda} />}
    </span>
  );
}
