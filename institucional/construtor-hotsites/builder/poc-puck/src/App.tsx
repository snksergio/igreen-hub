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
const Espaco = lazy(() => import("./screens/pagina/Espaco").then((m) => ({ default: m.Espaco })));
const Formularios = lazy(() => import("./screens/formulario/Formularios").then((m) => ({ default: m.Formularios })));
const Construtor = lazy(() => import("./screens/formulario/Construtor").then((m) => ({ default: m.Construtor })));
const FormAvulso = lazy(() => import("./screens/FormAvulso").then((m) => ({ default: m.FormAvulso })));
const Checkin = lazy(() => import("./screens/Checkin").then((m) => ({ default: m.Checkin })));
const Ingresso = lazy(() => import("./screens/Ingresso").then((m) => ({ default: m.Ingresso })));
const Numeros = lazy(() => import("./screens/Numeros").then((m) => ({ default: m.Numeros })));

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
    case "pagina":
      return <Espaco key={r.id} id={r.id} aba={r.aba} />;
    case "formularios":
      return <Formularios />;
    case "formulario":
      return <Construtor key={r.id} id={r.id} query={r.query} />;
    case "form":
      return <FormAvulso key={r.id} id={r.id} query={r.query} />;
    case "checkin":
      return <Checkin key={r.id} id={r.id} />;
    case "ingresso":
      return <Ingresso key={r.codigo} codigo={r.codigo} />;
    case "numeros":
      return <Numeros key={`${r.slug}-${r.ref}`} slug={r.slug} ref_={r.ref} />;
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
