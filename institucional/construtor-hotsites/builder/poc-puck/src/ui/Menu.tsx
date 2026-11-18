import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Menu que abre ao clicar no gatilho e fecha ao clicar fora ou apertar Esc.
 * `gatilho` recebe se está aberto; o conteúdo recebe uma função para fechar.
 */
export function Menu({
  gatilho,
  rotulo,
  className = "",
  classeGatilho = "",
  lado = "esq",
  children,
}: {
  gatilho: (aberto: boolean) => ReactNode;
  rotulo: string;
  className?: string;
  classeGatilho?: string;
  lado?: "esq" | "dir" | "centro";
  children: (fechar: () => void) => ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  return (
    <div ref={ref} className={`mn ${className}`}>
      <button type="button" className={classeGatilho} aria-expanded={aberto} aria-label={rotulo} onClick={() => setAberto((a) => !a)}>
        {gatilho(aberto)}
      </button>
      {aberto && (
        <div className="mn-caixa" data-lado={lado}>
          {children(() => setAberto(false))}
        </div>
      )}
    </div>
  );
}
