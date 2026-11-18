import { useEffect, useMemo, useState } from "react";
import { Agenda, CartaoIngresso } from "../form/Confirmacao";
import { Pagamento } from "../form/Fluxo";
import "../form/form.css";
import "./publicas.css";
import { reais } from "../lib/ingresso";
import { dataPorExtenso, infoEvento, lugarCurto } from "../lib/meta";
import { getPage } from "../lib/pages";
import { getPorCodigo, statusDe } from "../lib/submissions";
import { temaDa } from "./FormAvulso";

/** Ingresso do participante (5.4): QR code e código para a entrada. */
export function Ingresso({ codigo }: { codigo: string }) {
  const [versao, setVersao] = useState(0);
  const [pagando, setPagando] = useState(false);
  const sub = useMemo(() => getPorCodigo(codigo), [codigo, versao]);
  const page = sub ? getPage(sub.pageId) : undefined;
  const ev = page ? infoEvento(page.data) : {};
  useEffect(() => {
    document.title = page ? `Ingresso · ${page.title}` : "Ingresso";
  }, [page]);

  if (!sub)
    return (
      <div className="fm-pagina fa">
        <main className="fa-caixa">
          <h1 className="fm-titulo">Ingresso não encontrado</h1>
          <p className="fm-texto">Confira o código. Na POC, o ingresso só existe no navegador onde a inscrição foi feita.</p>
        </main>
      </div>
    );

  const pendente = sub.pagamento?.status === "pendente" || sub.pagamento?.status === "cancelado" || sub.pagamento?.status === "estornado";
  const status = statusDe(sub);
  // Pagamento pendente: o link do ingresso é por onde a pessoa paga depois (5.1, 4.2).
  if (pagando && sub.pagamento?.status === "pendente")
    return (
      <div className="fm-pagina fa" data-tema={temaDa(page)}>
        <main className="fa-caixa">
          <Pagamento
            sub={sub}
            previa={false}
            resolver={(_s, aprovado) => {
              if (!aprovado) return;
              setPagando(false);
              setVersao((v) => v + 1);
            }}
            desistir={() => setPagando(false)}
          />
        </main>
      </div>
    );
  return (
    <div className="fm-pagina fa" data-tema={temaDa(page)}>
      <main className="fa-caixa ig">
        <header className="fa-topo">
          <span className="fa-marca">iGreen · ingresso</span>
          <h1 className="fm-titulo">{page?.title ?? sub.pageSlug}</h1>
          <p className="fa-quando">{[dataPorExtenso(ev.inicio), lugarCurto(ev)].filter(Boolean).join(" · ")}</p>
        </header>
        <div className="ig-cracha">
          <CartaoIngresso sub={sub} page={page} espera={status === "espera"} />
        </div>
        <div className="ig-dados">
          {status === "presente" && <span className="ig-selo" data-tom="ok">Entrada já registrada</span>}
          {status === "espera" && <span className="ig-selo" data-tom="aviso">Lista de espera: ainda sem vaga</span>}
          {pendente && <span className="ig-selo" data-tom="aviso">Pagamento {sub.pagamento?.status}{sub.pagamento ? ` · ${reais(sub.pagamento.valor)}` : ""}</span>}
        </div>
        {sub.pagamento?.status === "pendente" && (
          <button type="button" className="fm-bt fm-bt-pri" onClick={() => setPagando(true)}>
            Pagar agora ({reais(sub.pagamento.valor)})
          </button>
        )}
        {page && <Agenda page={page} codigo={sub.codigo} />}
        <p className="fm-ajuda ig-nota">Mostre este QR code na entrada. Se a tela estiver sem sinal, o código de 6 letras também serve.</p>
      </main>
    </div>
  );
}
