import { config } from "../../puck/config";
import { separarRotulo } from "../../ui/Ajuda";

/** Zona principal da página no Puck. */
export const ZONA = "root:default-zone";

/** Rótulo do campo, que é o que aparece na tela (os rótulos são únicos dentro de cada peça). */
export function rotuloDoCampo(tipo: string | null, campo?: string): string | undefined {
  if (!campo) return undefined;
  const fields = (tipo ? (config.components as Record<string, { fields?: object }>)[tipo]?.fields : config.root?.fields) as
    | Record<string, { label?: string }>
    | undefined;
  return fields?.[campo]?.label;
}

/* Só um campo destacado por vez: o novo apaga o anterior na hora (sem esperar o tempo dele). */
let destacado: HTMLElement | null = null;
let timerDestaque: number | undefined;
let busca = 0;

/**
 * O título que o campo mostra no painel (só o texto do rótulo, sem o ícone de ajuda nem o balão).
 * O que estava entre parênteses no rótulo virou ajuda, então a busca é pelo título.
 */
export function tituloNoPainel(campo: Element): string {
  const rot = campo.querySelector('[class*="_Input-label_"], .fi-rotulo, .cp-rotulo');
  if (!rot) return (campo.textContent ?? "").trim();
  let t = "";
  rot.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) t += n.textContent ?? "";
  });
  return t.trim();
}

/** Acha o campo no painel da direita, rola até ele, destaca e põe o cursor nele. */
export function focarCampo(rotulo?: string) {
  if (!rotulo) return;
  const titulo = separarRotulo(rotulo).titulo;
  const minha = ++busca;
  let tentativas = 0;
  const tentar = () => {
    if (minha !== busca) return; // outro clique chegou depois: este desiste
    const visiveis = [...document.querySelectorAll<HTMLElement>('[class*="PuckFields-field"]')].filter((el) => el.offsetParent !== null);
    const campo =
      visiveis.find((el) => tituloNoPainel(el) === titulo) ?? visiveis.find((el) => (el.textContent ?? "").trim().startsWith(titulo));
    if (!campo) {
      if (tentativas++ < 30) setTimeout(tentar, 50);
      return;
    }
    window.clearTimeout(timerDestaque);
    destacado?.classList.remove("campo-alvo");
    destacado = campo;
    campo.scrollIntoView({ block: "center", behavior: "smooth" });
    campo.classList.add("campo-alvo");
    timerDestaque = window.setTimeout(() => campo.classList.remove("campo-alvo"), 2200);
    campo
      .querySelector<HTMLElement>('input:not([type="radio"]):not([type="file"]):not([type="hidden"]), textarea, select')
      ?.focus({ preventScroll: true });
  };
  setTimeout(tentar, 60);
}

/** Rola a prévia até a peça, para quem edita ver o que está ajustando. */
export function mostrarNaPrevia(id: string) {
  const doc = document.querySelector<HTMLIFrameElement>(".ed iframe")?.contentDocument;
  doc?.querySelector(`[data-puck-component="${id}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
}

/* ---------- Campo destacado na prévia ----------
   Ao escolher um campo (na Estrutura ou no painel da direita), a prévia ganha um contorno rosa com
   o nome do campo em volta do elemento que mostra aquele valor. Rosa para não confundir com o verde
   da seção selecionada. O elemento é achado pelo próprio valor: texto pelo texto, imagem pelo
   endereço, lista pelo grupo do primeiro ao último item. Sem achar, não desenha nada (a seção já
   está marcada pelo Puck). */

const semMarcacao = (s: string) => s.replace(/\*\*|\*|_/g, "").replace(/\{(nome|cidade)\}/g, "").replace(/\s+/g, "");
const ehMidia = (v: string) => /^(https?:|data:|blob:)/.test(v) || /\.(png|jpe?g|webp|gif|svg|mp4|webm)(\?|$)/i.test(v);

function porTexto(bloco: Element, valor: string): Element | null {
  const chave = semMarcacao(valor).toLowerCase().slice(0, 50);
  if (chave.length < 2) return null;
  // o menor elemento que contém o texto; entre cópias iguais (carrossel, faixa), a que está visível
  const sec = bloco.getBoundingClientRect();
  const visivel = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.right > sec.left && r.left < sec.right;
  };
  let melhor: Element | null = null;
  let menor = Infinity;
  for (const el of bloco.querySelectorAll("*")) {
    if (el.closest("svg") && el.tagName.toLowerCase() !== "text") continue;
    const t = (el.textContent ?? "").replace(/\s+/g, "").toLowerCase();
    if (!t.includes(chave)) continue;
    const empate = t.length === menor && melhor;
    // no empate: o mais interno (o botão, não a caixa em volta) ou a cópia visível
    if (t.length < menor || (empate && (melhor!.contains(el) || (!visivel(melhor!) && visivel(el))))) {
      melhor = el;
      menor = t.length;
    }
  }
  return melhor;
}

function porMidia(bloco: Element, valor: string): Element | null {
  for (const m of bloco.querySelectorAll("img, video")) {
    if (m.getAttribute("src") === valor || m.getAttribute("poster") === valor) {
      const dono = m.closest(".avatares > span, .prog-foto, .pessoa, .video, .sobre-foto, .foto-b");
      return dono ?? m;
    }
  }
  return null;
}

const textoDoItem = (item: unknown): string | undefined => {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return undefined;
  const strings = Object.values(item as Record<string, unknown>).filter((v): v is string => typeof v === "string" && v.trim() !== "");
  return strings.find((s) => !ehMidia(s)) ?? strings[0];
};

function ancestralComum(a: Element, b: Element): Element {
  let el: Element | null = a;
  while (el && !el.contains(b)) el = el.parentElement;
  return el ?? a;
}

/** Data do campo de data ("2026-12-12T19:00"): a contagem ou o "faltam N dias" que usam ela. */
function porData(bloco: Element, valor: string): Element | null {
  const el = bloco.querySelector(`[data-alvo^="${valor.slice(0, 16)}"]`);
  return el ? el.closest(".relogio, .info-data, .hs-count") ?? el : null;
}

/** Elementos que mostram o valor: um só, ou para listas os itens do primeiro ao último. */
function acharNoBloco(bloco: Element, valor: unknown): Element[] {
  if (typeof valor === "number") return [porTexto(bloco, String(valor))].filter(Boolean) as Element[];
  if (typeof valor === "string" && valor.trim()) {
    const v = valor.trim();
    const el = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v) ? porData(bloco, v) : ehMidia(v) ? porMidia(bloco, v) : porTexto(bloco, v);
    return el ? [el] : [];
  }
  if (Array.isArray(valor) && valor.length) {
    const p = textoDoItem(valor[0]);
    const u = textoDoItem(valor[valor.length - 1]);
    const a = p ? acharNoBloco(bloco, p)[0] : undefined;
    const b = u ? acharNoBloco(bloco, u)[0] : undefined;
    if (!a || !b) return [a ?? b].filter(Boolean) as Element[];
    if (a === b) return [a];
    // sobe até os itens: os filhos do ancestral comum que vão do primeiro ao último
    const pai = ancestralComum(a, b);
    const filhos = [...pai.children];
    const i = filhos.findIndex((f) => f.contains(a));
    const j = filhos.findIndex((f) => f.contains(b));
    return i >= 0 && j >= i ? filhos.slice(i, j + 1) : [pai];
  }
  return [];
}

/* ---------- Clique na prévia leva ao campo ----------
   Clicar num texto, botão ou imagem da prévia escolhe o campo que mostra aquele valor: o contorno
   rosa aparece nele e o painel da direita rola até o campo. Vale o menor elemento que contém o clique. */

/** Qual campo da peça mostra o que foi clicado (`clicados`: os elementos sob o ponteiro). */
export function campoPeloClique(bloco: Element, clicados: Element[], props: Record<string, unknown>, chaves: string[]): string | undefined {
  let melhor: { chave: string; area: number } | undefined;
  for (const chave of chaves) {
    for (const alvo of acharNoBloco(bloco, props[chave])) {
      if (!clicados.some((c) => alvo === c || alvo.contains(c))) continue;
      const r = alvo.getBoundingClientRect();
      const area = r.width * r.height;
      if (!melhor || area < melhor.area) melhor = { chave, area };
    }
  }
  return melhor?.chave;
}

export const EVENTO_CAMPO = "igreen:campo-clicado";
let campoPedido: string | null = null;

/** Pede à Estrutura que marque o campo ("idDaPeca:chave"). Fica guardado se ela ainda não abriu. */
export function pedirCampo(idChave: string) {
  campoPedido = idChave;
  window.dispatchEvent(new CustomEvent<string>(EVENTO_CAMPO, { detail: idChave }));
}

export function pegarCampoPedido(): string | null {
  const p = campoPedido;
  campoPedido = null;
  return p;
}

let marca: { caixa: HTMLElement; quadro: number; win: Window } | null = null;

export function limparDestaqueNaPrevia() {
  if (!marca) return;
  marca.win.cancelAnimationFrame(marca.quadro);
  marca.caixa.remove();
  marca = null;
}

/**
 * Desenha o contorno do campo na prévia. `valores` vem em ordem de preferência (o valor do campo e,
 * para destino ou link de botão, o texto do botão). `rolar`: leva a prévia até ele.
 */
export function destacarNaPrevia(id: string, valores: unknown[], nome: string, rolar: boolean) {
  limparDestaqueNaPrevia();
  const iframe = document.querySelector<HTMLIFrameElement>(".ed iframe");
  const doc = iframe?.contentDocument;
  const win = doc?.defaultView;
  const bloco = doc?.querySelector(`[data-puck-component="${id}"]`);
  if (!iframe || !doc || !win || !bloco) return;
  // a prévia costuma estar reduzida (zoom automático): contorno e etiqueta compensam a escala
  const escala = iframe.offsetWidth ? iframe.getBoundingClientRect().width / iframe.offsetWidth : 1;
  const px = (n: number) => `${(n / (escala || 1)).toFixed(2)}px`;
  let alvos: Element[] = [];
  for (const v of valores) if ((alvos = acharNoBloco(bloco, v)).length) break;
  if (!alvos.length) return;

  const caixa = doc.createElement("div");
  caixa.setAttribute("aria-hidden", "true");
  caixa.style.cssText =
    `position:absolute;z-index:2147483000;pointer-events:none;border:${px(2)} solid #ff4fbf;border-radius:${px(8)};` +
    `box-shadow:0 0 0 ${px(4)} rgba(255,79,191,.2),0 ${px(8)} ${px(24)} rgba(255,79,191,.18)`;
  const etiqueta = doc.createElement("span");
  etiqueta.textContent = nome;
  etiqueta.style.cssText =
    `position:absolute;left:${px(-2)};padding:${px(3)} ${px(8)};border-radius:${px(6)};background:#ff4fbf;color:#fff;` +
    `font:600 ${px(11)}/1.3 system-ui,sans-serif;white-space:nowrap;letter-spacing:0`;
  caixa.appendChild(etiqueta);
  doc.body.appendChild(caixa);

  const posiciona = () => {
    // a caixa cobre todos os alvos (vários itens de uma lista viram um contorno só)
    // e fica dentro da seção (o carrossel tem itens fora da tela)
    const rs = alvos.map((a) => a.getBoundingClientRect());
    const sec = bloco.getBoundingClientRect();
    const esq = Math.max(sec.left + 4, Math.min(...rs.map((r) => r.left)));
    const cima = Math.min(...rs.map((r) => r.top));
    const dir = Math.min(sec.right - 4, Math.max(...rs.map((r) => r.right)));
    const baixo = Math.max(...rs.map((r) => r.bottom));
    const topo = cima + win.scrollY - 4;
    caixa.style.left = `${esq + win.scrollX - 4}px`;
    caixa.style.top = `${topo}px`;
    caixa.style.width = `${dir - esq + 8}px`;
    caixa.style.height = `${baixo - cima + 8}px`;
    // etiqueta acima do contorno; colada no topo da página, vai para dentro
    const alturaEtiqueta = 24 / (escala || 1);
    etiqueta.style.top = topo < alturaEtiqueta + 2 ? px(4) : `${-alturaEtiqueta}px`;
    if (marca) marca.quadro = win.requestAnimationFrame(posiciona);
  };
  marca = { caixa, quadro: 0, win };
  posiciona();
  if (rolar) win.setTimeout(() => alvos[0].scrollIntoView({ block: "center", behavior: "smooth" }), 80);
}
