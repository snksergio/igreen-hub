/**
 * Leitura e escrita no localStorage que nunca derruba a tela.
 * Se o navegador bloquear o armazenamento ou ficar sem espaço, guarda em memória
 * (vale até fechar a aba) e avisa quem chamou devolvendo false.
 */
const memory = new Map<string, string>();

function rawGet(key: string): string | null {
  if (memory.has(key)) return memory.get(key)!;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function rawSet(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    memory.delete(key);
    return true;
  } catch {
    memory.set(key, value);
    return false;
  }
}

/** Devolve null quando a chave não existe ou o conteúdo está corrompido. */
export function readJSON<T>(key: string): T | null {
  const raw = rawGet(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** true = gravou no navegador; false = ficou só em memória até fechar a aba. */
export function writeJSON(key: string, value: unknown): boolean {
  return rawSet(key, JSON.stringify(value));
}

/** Para testes: esquece o que ficou em memória. */
export function _limparMemoria(): void {
  memory.clear();
}
