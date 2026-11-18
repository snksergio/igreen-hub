import { partesWhats } from "../lib/mensagens";
import "./form.css";

/** Mensagem como chegaria no WhatsApp (simulação, nada é enviado). */
export function BolhaWhats({ texto, rotulo }: { texto: string; rotulo?: string }) {
  return (
    <figure className="bw">
      {rotulo && <figcaption>{rotulo}</figcaption>}
      <div className="bw-tela">
        <p className="bw-bolha">
          {texto.split("\n").map((linha, i) => (
            <span key={i} className="bw-linha">
              {partesWhats(linha).map((p, j) => (p.negrito ? <b key={j}>{p.t}</b> : <span key={j}>{p.t}</span>))}
              {"\n"}
            </span>
          ))}
          <time>agora ✓✓</time>
        </p>
      </div>
    </figure>
  );
}
