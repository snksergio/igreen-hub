import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { garantirDadosDeExemplo } from "./lib/exemplo";
import "./hotsite.css";
import { iniciarTema } from "./ui/tema";

iniciarTema();
// Inscrições, visitas, links e formulários fictícios para as páginas de exemplo (uma vez por navegador).
garantirDadosDeExemplo();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
