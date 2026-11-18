import { useEffect, useMemo, useState } from "react";
import "../app.css";
import "./publicas.css";
import { reais } from "../lib/ingresso";
import { dataCurta, infoEvento } from "../lib/meta";
import { getPage, getPageBySlug } from "../lib/pages";
import { formatarWhats, listSubmissions, ocupaVaga, statusDe, updateSubmissions, type Submission } from "../lib/submissions";
import { Icone } from "../ui/Icone";

const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const hora = (t: number) => new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

/** Quando a entrada foi registrada (o último "Check-in feito" do histórico). */
const chegouEm = (s: Submission) => [...(s.historico ?? [])].reverse().find((h) => h.texto === "Check-in feito")?.em;

/** Check-in no dia (5.5): tela de celular com busca grande e o botão "Chegou". */
export function Checkin({ id }: { id: string }) {
  const page = useMemo(() => getPage(id) ?? getPageBySlug(id), [id]);
  const [versao, setVersao] = useState(0);
  const [busca, setBusca] = useState("");
  const [ultimo, setUltimo] = useState<string | null>(null);
  const subs = useMemo(() => (page ? listSubmissions({ pageId: page.id }).filter((s) => statusDe(s) !== "espera") : []), [page, versao]);
  const validas = subs.filter(ocupaVaga);
  const presentes = validas.filter((s) => statusDe(s) === "presente").length;

  useEffect(() => {
    document.title = `Check-in · ${page?.title ?? ""}`;
  }, [page]);

  const lista = useMemo(() => {
    const q = semAcento(busca.trim());
    const digitos = busca.replace(/\D/g, "");
    if (!q) return [];
    return subs
      .filter(
        (s) =>
          semAcento(s.nome).includes(q) ||
          (s.codigo ?? "").toLowerCase() === q ||
          (digitos.length >= 4 && s.whats.endsWith(digitos))
      )
      .slice(0, 30);
  }, [busca, subs]);

  function chegou(s: Submission) {
    const p = s.pagamento?.status;
    if (p && p !== "pago" && !confirm(`O pagamento de ${s.nome} está ${p}. Registrar a entrada mesmo assim?`)) return;
    updateSubmissions([s.id], { status: "presente" }, "Check-in feito");
    setUltimo(s.nome);
    setBusca("");
    setVersao((v) => v + 1);
  }
  function desfazer(s: Submission) {
    updateSubmissions([s.id], { status: "confirmado" }, "Check-in desfeito");
    setVersao((v) => v + 1);
  }

  if (!page)
    return (
      <div className="app ck">
        <p className="ck-vazio">Página não encontrada.</p>
      </div>
    );

  const pct = validas.length ? Math.round((presentes / validas.length) * 100) : 0;
  return (
    <div className="app ck">
      <header className="ck-topo">
        <a href={`#/pagina/${page.id}`} className="ck-voltar" aria-label="Voltar ao espaço da página">
          <Icone nome="voltar" tamanho={20} />
        </a>
        <div className="ck-titulo">
          <strong>{page.title}</strong>
          <span>Check-in · {dataCurta(infoEvento(page.data).inicio) || "sem data"}</span>
        </div>
      </header>

      <section className="ck-placar" aria-live="polite">
        <div>
          <b>{presentes}</b> de {validas.length} chegaram
        </div>
        <span className="ck-barra" aria-hidden="true">
          <i style={{ width: `${pct}%` }} />
        </span>
      </section>

      <label className="ck-busca">
        <Icone nome="busca" tamanho={22} />
        <input
          autoFocus
          type="search"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setUltimo(null);
          }}
          placeholder="Nome, código ou final do WhatsApp"
          aria-label="Buscar participante"
          enterKeyHint="search"
        />
      </label>

      {ultimo && (
        <p className="ck-ok" role="status">
          <Icone nome="check" tamanho={20} />
          {ultimo} entrou.
        </p>
      )}

      {!busca.trim() ? (
        <p className="ck-dica">Digite o nome, o código do ingresso (6 letras) ou os 4 últimos números do WhatsApp.</p>
      ) : lista.length === 0 ? (
        <p className="ck-dica">Ninguém encontrado. Confira o que foi digitado ou procure pelo código do ingresso.</p>
      ) : (
        <ul className="ck-lista">
          {lista.map((s) => {
            const st = statusDe(s);
            const pag = s.pagamento?.status;
            const quando = chegouEm(s);
            return (
              <li key={s.id} className="ck-item" data-presente={st === "presente" || undefined}>
                <div className="ck-pessoa">
                  <strong>{s.nome}</strong>
                  <span>
                    {s.codigo} · {formatarWhats(s.whats)}
                  </span>
                  {pag && pag !== "pago" && (
                    <span className="ck-alerta">
                      <Icone nome="alerta" tamanho={14} />
                      Pagamento {pag} · {reais(s.pagamento!.valor)}
                    </span>
                  )}
                </div>
                {st === "presente" ? (
                  <div className="ck-feito">
                    <span>
                      <Icone nome="check" tamanho={16} />
                      {quando ? `Chegou às ${hora(quando)}` : "Presente"}
                    </span>
                    <button className="app-linkbtn" onClick={() => desfazer(s)}>
                      Desfazer
                    </button>
                  </div>
                ) : (
                  <button className="ck-chegou" onClick={() => chegou(s)}>
                    Chegou
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
