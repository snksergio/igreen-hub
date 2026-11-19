import { useEffect, type ReactNode } from "react";
import "../app.css";
import "./telas.css";
import { Icone } from "../ui/Icone";
import { BotaoTema } from "../ui/tema";

export const TITULO_POC = "POC · Construtor de hotsites iGreen";

/** Moldura das telas internas da POC (painel, convite, inscrições). */
export function Shell({
  ativo,
  pagina,
  children,
}: {
  ativo: "paginas" | "formularios" | "inscricoes" | "convite";
  /** Dentro de uma página: o topo mostra o caminho (Páginas › nome), não as seções do app. */
  pagina?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = TITULO_POC;
  }, []);
  return (
    <div className="app">
      <header className="app-top">
        <a href="#/" className="app-marca">
          <span className="tp-logo">
            <Icone nome="folha" tamanho={16} />
          </span>
          Hotsites iGreen
          <span className="app-tag">POC</span>
        </a>
        {pagina ? (
          <nav className="app-migalha" aria-label="Você está em">
            <a href="#/">
              <Icone nome="pagina" tamanho={15} />
              Páginas
            </a>
            <Icone nome="chevDir" tamanho={14} className="app-migalha-sep" />
            <span aria-current="page" title={pagina}>
              {pagina}
            </span>
          </nav>
        ) : (
        <nav className="seg app-nav" aria-label="Seções">
          <a href="#/" aria-current={ativo === "paginas" || ativo === "convite" ? "page" : undefined}>
            <Icone nome="pagina" tamanho={16} />
            Páginas
          </a>
          <a href="#/formularios" aria-current={ativo === "formularios" ? "page" : undefined}>
            <Icone nome="formulario" tamanho={16} />
            Formulários
          </a>
        </nav>
        )}
        <div className="app-top-dir">
          <span>Os dados ficam neste navegador</span>
          <BotaoTema />
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

export function NaoEncontrada({ oQue = "Página" }: { oQue?: string }) {
  return (
    <div className="app">
      <main className="app-main app-empty">
        <h1 className="app-h1">{oQue} não encontrada</h1>
        <p className="app-muted">O endereço pode ter mudado ou a página foi apagada.</p>
        <a className="app-btn" href="#/">
          Voltar ao painel
        </a>
      </main>
    </div>
  );
}
