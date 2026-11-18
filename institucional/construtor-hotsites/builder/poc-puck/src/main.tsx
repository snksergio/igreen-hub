import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./hotsite.css";
import { iniciarTema } from "./ui/tema";

iniciarTema();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
