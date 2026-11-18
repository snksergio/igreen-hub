import { useEffect, type ReactNode } from "react";
import "../app.css";
import { Icone } from "../ui/Icone";
import { BotaoTema } from "../ui/tema";

export const TITULO_POC = "POC · Construtor de hotsites iGreen";

/** Moldura das telas internas da POC (painel, convite, inscrições). */
export function Shell({ ativo, children }: { ativo: "paginas" | "inscricoes" | "convite"; children: ReactNode }) {
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
        <nav className="seg app-nav" aria-label="Seções">
          <a href="#/" aria-current={ativo === "paginas" || ativo === "convite" ? "page" : undefined}>
            <Icone nome="pagina" tamanho={16} />
            Páginas
          </a>
          <a href="#/inscricoes" aria-current={ativo === "inscricoes" ? "page" : undefined}>
            <Icone nome="pessoas" tamanho={16} />
            Inscrições
          </a>
        </nav>
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
