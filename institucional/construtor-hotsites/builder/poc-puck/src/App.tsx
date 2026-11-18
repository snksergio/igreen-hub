import { lazy, Suspense } from "react";
import { useRoute } from "./router";
import { Publica } from "./screens/Publica";

// Cada tela interna é carregada só quando é aberta: quem visita a página pública
// não baixa o editor (o Puck completo), o painel nem o CSS deles.
const Painel = lazy(() => import("./screens/Painel").then((m) => ({ default: m.Painel })));
const NovaPagina = lazy(() => import("./screens/NovaPagina").then((m) => ({ default: m.NovaPagina })));
const Editor = lazy(() => import("./screens/Editor").then((m) => ({ default: m.Editor })));
const Convite = lazy(() => import("./screens/Convite").then((m) => ({ default: m.Convite })));
const Inscricoes = lazy(() => import("./screens/Inscricoes").then((m) => ({ default: m.Inscricoes })));
const NaoEncontrada = lazy(() => import("./screens/Shell").then((m) => ({ default: m.NaoEncontrada })));

function Tela() {
  const r = useRoute();
  switch (r.name) {
    case "painel":
      return <Painel />;
    case "nova":
      return <NovaPagina />;
    case "editar":
      return <Editor key={r.id} id={r.id} />;
    case "publica":
      return <Publica key={r.slug} slug={r.slug} query={r.query} />;
    case "convite":
      return <Convite key={r.slug} slug={r.slug} />;
    case "inscricoes":
      return <Inscricoes />;
    default:
      return <NaoEncontrada oQue="Tela" />;
  }
}

export function App() {
  return (
    <Suspense fallback={<p className="carregando">Carregando…</p>}>
      <Tela />
    </Suspense>
  );
}
