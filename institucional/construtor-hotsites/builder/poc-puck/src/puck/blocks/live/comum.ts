/** Imagens e vídeos do site iGreen Live, usados como conteúdo inicial das peças do kit. */
const BASE = "https://snksergio.github.io/igreen-eventos-v2/";

export const IMG_LIVE = {
  thiago: `${BASE}speakers/thiago-cut.png`,
  rafael: `${BASE}speakers/rafael-cut.png`,
  amanda: `${BASE}speakers/amanda-cut.png`,
  ana: `${BASE}speakers/ana-cut.png`,
  carla: `${BASE}speakers/carla-cut.png`,
  bruno: `${BASE}speakers/bruno-cut.png`,
  juliana: `${BASE}speakers/juliana-cut.png`,
  pedro: `${BASE}speakers/pedro-cut.png`,
  plateia: `${BASE}assets/video/past/arena-audience.jpg`,
  palco: `${BASE}assets/img/past/moment-11.jpg`,
  painel: `${BASE}assets/img/video-thumb.jpg`,
  festa: `${BASE}assets/img/past/moment-01.jpg`,
  aurora: `${BASE}assets/img/aurora-base.webp`,
  videoPrevia: `${BASE}assets/video/past/arena-audience.mp4`,
  videoCompleto: `${BASE}assets/video/experience.mp4`,
};

/** "2026-12-12T19:00" (horário de Brasília, como o campo guarda) → ISO com fuso, para a contagem. */
export function isoBrasilia(local: string | undefined): string | undefined {
  if (!local || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(local)) return undefined;
  return /[zZ]|[+-]\d{2}:\d{2}$/.test(local) ? local : `${local.slice(0, 16)}:00-03:00`;
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Dia e mês curto ("12", "dez") e dias que faltam, a partir do campo de data. */
export function partesData(local: string | undefined): { dia: string; mes: string; faltam: number } | undefined {
  const iso = isoBrasilia(local);
  if (!iso) return undefined;
  const [, m, d] = iso.slice(0, 10).split("-").map(Number);
  const faltam = Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 86400000));
  return { dia: String(d), mes: MESES[m - 1] ?? "", faltam };
}

/** Iniciais para o círculo do depoimento: "Carla M." → "CM". */
export const iniciais = (nome: string) =>
  (nome ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
