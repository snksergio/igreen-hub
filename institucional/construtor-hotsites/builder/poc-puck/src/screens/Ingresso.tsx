import { useEffect, useMemo } from "react";
import { Agenda, linkIngresso, Qr } from "../form/Confirmacao";
import "../form/form.css";
import "./publicas.css";
import { reais } from "../lib/ingresso";
import { dataPorExtenso, infoEvento, lugarCurto } from "../lib/meta";
import { getPage } from "../lib/pages";
import { getPorCodigo, statusDe } from "../lib/submissions";
import { temaDa } from "./FormAvulso";

/** Ingresso do participante (5.4): QR code e código para a entrada. */
export function Ingresso({ codigo }: { codigo: string }) {
  const sub = useMemo(() => getPorCodigo(codigo), [codigo]);
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
  return (
    <div className="fm-pagina fa" data-tema={temaDa(page)}>
      <main className="fa-caixa ig">
        <header className="fa-topo">
          <span className="fa-marca">iGreen · ingresso</span>
          <h1 className="fm-titulo">{page?.title ?? sub.pageSlug}</h1>
          <p className="fa-quando">{[dataPorExtenso(ev.inicio), lugarCurto(ev)].filter(Boolean).join(" · ")}</p>
        </header>
        <div className="ig-qr">
          <Qr texto={linkIngresso(sub.codigo)} tamanho={220} rotulo={`QR code do ingresso ${sub.codigo}`} />
        </div>
        <div className="ig-dados">
          <strong className="fm-codigo">{sub.codigo}</strong>
          <span className="ig-nome">{sub.nome}</span>
          {status === "presente" && <span className="ig-selo" data-tom="ok">Entrada já registrada</span>}
          {status === "espera" && <span className="ig-selo" data-tom="aviso">Lista de espera: ainda sem vaga</span>}
          {pendente && <span className="ig-selo" data-tom="aviso">Pagamento {sub.pagamento?.status}{sub.pagamento ? ` · ${reais(sub.pagamento.valor)}` : ""}</span>}
        </div>
        {page && <Agenda page={page} codigo={sub.codigo} />}
        <p className="fm-ajuda ig-nota">Mostre este QR code na entrada. Se a tela estiver sem sinal, o código de 6 letras também serve.</p>
      </main>
    </div>
  );
}
