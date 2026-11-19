import { useEffect, useState } from "react";

export type Route =
  | { name: "painel" }
  | { name: "nova" }
  | { name: "editar"; id: string }
  | { name: "publica"; slug: string; query: URLSearchParams }
  | { name: "ver"; slug: string; query: URLSearchParams }
  | { name: "convite"; slug: string }
  | { name: "inscricoes" }
  | { name: "pagina"; id: string; aba: AbaPagina }
  | { name: "formularios" }
  | { name: "formulario"; id: string; query: URLSearchParams }
  | { name: "form"; id: string; query: URLSearchParams }
  | { name: "checkin"; id: string }
  | { name: "ingresso"; codigo: string }
  | { name: "numeros"; slug: string; ref: string }
  | { name: "404" };

export const ABAS = ["visao", "inscricoes", "resultados", "links", "config"] as const;
export type AbaPagina = (typeof ABAS)[number];

/** Rotas por hash (#/…) para funcionar no GitHub Pages sem servidor. */
export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, "") || "/";
  const [path, qs = ""] = h.split("?");
  const parts = path.split("/").filter(Boolean).map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  });
  if (parts.length === 0) return { name: "painel" };
  if (parts[0] === "nova") return { name: "nova" };
  if (parts[0] === "editar" && parts[1]) return { name: "editar", id: parts[1] };
  if (parts[0] === "p" && parts[1]) return { name: "publica", slug: parts[1], query: new URLSearchParams(qs) };
  if (parts[0] === "ver" && parts[1]) return { name: "ver", slug: parts[1], query: new URLSearchParams(qs) };
  if (parts[0] === "convite" && parts[1]) return { name: "convite", slug: parts[1] };
  if (parts[0] === "inscricoes") return { name: "inscricoes" };
  if (parts[0] === "pagina" && parts[1]) {
    const aba = (ABAS as readonly string[]).includes(parts[2] ?? "") ? (parts[2] as AbaPagina) : "visao";
    return { name: "pagina", id: parts[1], aba };
  }
  if (parts[0] === "formularios") return { name: "formularios" };
  if (parts[0] === "formulario" && parts[1]) return { name: "formulario", id: parts[1], query: new URLSearchParams(qs) };
  if (parts[0] === "f" && parts[1]) return { name: "form", id: parts[1], query: new URLSearchParams(qs) };
  if (parts[0] === "checkin" && parts[1]) return { name: "checkin", id: parts[1] };
  if (parts[0] === "ingresso" && parts[1]) return { name: "ingresso", codigo: parts[1] };
  if (parts[0] === "numeros" && parts[1] && parts[2]) return { name: "numeros", slug: parts[1], ref: parts[2] };
  return { name: "404" };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export const go = (path: string) => {
  window.location.hash = path;
};

/** Endereço da POC sem o hash, usado para montar o link do convite. */
export const appBaseUrl = () => window.location.origin + window.location.pathname;
