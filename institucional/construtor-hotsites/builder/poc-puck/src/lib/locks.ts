type Bloco = { props: { id: string; travado?: boolean } };

/**
 * O Puck impede arrastar uma peça travada, mas não impede soltar outra acima dela.
 * Esta regra mantém no topo, na ordem original, as peças travadas que começavam a página
 * (ex.: a Abertura). Devolve o conteúdo corrigido, ou null se já está certo.
 */
export function manterTopoTravado<T extends Bloco>(prev: T[], next: T[]): T[] | null {
  const topo: string[] = [];
  for (const b of prev) {
    if (!b.props.travado) break;
    topo.push(b.props.id);
  }
  const presentes = topo.filter((id) => next.some((b) => b.props.id === id));
  const ok = presentes.every((id, i) => next[i]?.props.id === id);
  if (ok) return null;
  const fixos = presentes.map((id) => next.find((b) => b.props.id === id)!);
  const resto = next.filter((b) => !presentes.includes(b.props.id));
  return [...fixos, ...resto];
}
