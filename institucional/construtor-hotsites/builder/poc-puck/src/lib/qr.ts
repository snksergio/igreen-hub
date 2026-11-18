import qrcode from "qrcode-generator";

/** QR code como caminho de SVG (um quadrado por módulo), com 4 módulos de margem. */
export function qrSvg(texto: string): { lado: number; d: string } {
  const qr = qrcode(0, "M");
  qr.addData(texto);
  qr.make();
  const n = qr.getModuleCount();
  const m = 4;
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + m},${r + m}h1v1h-1z`;
  }
  return { lado: n + m * 2, d };
}
