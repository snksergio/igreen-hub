/**
 * Contorno simplificado do Brasil, no mesmo padrão de `geo.ts`: um anel
 * `[lon, lat]` desenhado à mão, sem GeoJSON. Serve para pintar o território
 * por cima da malha mundial na cena do globo.
 *
 * Precisão: silhueta reconhecível a ~2° por ponto. Não use para nada que
 * dependa de fronteira exata.
 */
export type Ring = [number, number][];

export const BR_RING: Ring = [
  [-60.2, 5.2], [-59.8, 3.9], [-56.5, 2.0], [-54.6, 2.3], [-51.6, 4.1],
  [-50.0, 0.0], [-44.3, -2.5], [-41.8, -2.8], [-38.5, -3.7], [-35.2, -5.8],
  [-34.8, -7.1], [-35.7, -9.7], [-37.0, -11.0], [-38.5, -13.0], [-39.0, -17.0],
  [-40.8, -20.3], [-43.1, -22.9], [-46.5, -24.0], [-48.5, -25.5],
  [-48.6, -28.5], [-50.0, -30.2], [-52.2, -32.2], [-53.4, -33.7],
  [-55.6, -30.9], [-57.6, -30.2], [-56.0, -27.4], [-54.6, -25.6],
  [-54.3, -24.0], [-57.9, -22.1], [-58.2, -19.8], [-60.4, -16.3],
  [-60.2, -13.5], [-62.8, -11.0], [-65.4, -9.8], [-68.0, -10.9],
  [-72.9, -9.5], [-73.5, -7.3], [-70.0, -4.2], [-69.4, -1.1], [-69.8, 1.1],
  [-67.3, 2.0], [-66.9, 1.2], [-64.5, 3.8], [-63.4, 3.9], [-61.0, 4.5],
];

const pointInRing = (lon: number, lat: number, ring: Ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

export const isBrazil = (lon: number, lat: number) => pointInRing(lon, lat, BR_RING);

export type Dot = { lon: number; lat: number };

export const brazilLattice = (step: number): Dot[] => {
  const dots: Dot[] = [];
  for (let lat = 6; lat >= -34; lat -= step) {
    for (let lon = -74; lon <= -34; lon += step) {
      if (isBrazil(lon, lat)) dots.push({ lon, lat });
    }
  }
  return dots;
};

export const BR_CAPITALS: { city: string; lon: number; lat: number; major?: boolean }[] = [
  { city: "Manaus", lon: -60.0, lat: -3.1 },
  { city: "Belém", lon: -48.5, lat: -1.5 },
  { city: "Fortaleza", lon: -38.5, lat: -3.7 },
  { city: "Recife", lon: -34.9, lat: -8.05 },
  { city: "Salvador", lon: -38.5, lat: -12.97 },
  { city: "Brasília", lon: -47.9, lat: -15.8, major: true },
  { city: "Goiânia", lon: -49.3, lat: -16.7 },
  { city: "Belo Horizonte", lon: -43.9, lat: -19.9 },
  { city: "Rio de Janeiro", lon: -43.2, lat: -22.9, major: true },
  { city: "São Paulo", lon: -46.6, lat: -23.5, major: true },
  { city: "Curitiba", lon: -49.3, lat: -25.4 },
  { city: "Porto Alegre", lon: -51.2, lat: -30.0 },
];

/**
 * Corredores rodoviários. `covered: false` marca o trecho sem cobertura de
 * dados — desenhado em traço interrompido na cena 09.
 */
export const BR_CORRIDORS: {
  from: string;
  to: string;
  covered: boolean;
  /** Recebe marcador de satisfação na tela. */
  mark?: boolean;
}[] = [
  { from: "São Paulo", to: "Brasília", covered: true, mark: true },
  { from: "São Paulo", to: "Rio de Janeiro", covered: true },
  { from: "São Paulo", to: "Belo Horizonte", covered: true, mark: true },
  { from: "São Paulo", to: "Curitiba", covered: true },
  { from: "Curitiba", to: "Porto Alegre", covered: true, mark: true },
  { from: "Brasília", to: "Belo Horizonte", covered: true },
  { from: "Brasília", to: "Goiânia", covered: true },
  { from: "Brasília", to: "Salvador", covered: false },
  { from: "Belo Horizonte", to: "Salvador", covered: false, mark: true },
  { from: "Salvador", to: "Recife", covered: false },
  { from: "Recife", to: "Fortaleza", covered: false, mark: true },
  { from: "Brasília", to: "Belém", covered: false, mark: true },
  { from: "Brasília", to: "Manaus", covered: false },
  { from: "Manaus", to: "Belém", covered: false, mark: true },
];

export const capitalByName = (name: string) =>
  BR_CAPITALS.find((c) => c.city === name)!;
