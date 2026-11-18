import type { Config, Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core/rsc";
import { useEffect, useRef, useState } from "react";
import { PageContext } from "../puck/context";
import { config } from "../puck/config";

const LARGURA = 1280;

/** Prévia pequena e sem interação de uma página, desenhada a 1280 px e reduzida. */
export function Miniatura({ data }: { data: Data }) {
  const caixa = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(0.25);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const medir = () => setEscala(el.clientWidth / LARGURA);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const vazia = !data.content?.length;

  return (
    <div className="mini" ref={caixa} aria-hidden="true">
      {vazia ? (
        <div className="mini-vazia">Página em branco</div>
      ) : (
        <div className="mini-inner" style={{ width: LARGURA, transform: `scale(${escala})` }}>
          <PageContext.Provider value={{ persona: {}, mode: "miniatura", pageId: "", pageSlug: "" }}>
            <Render config={config as unknown as Config} data={data} />
          </PageContext.Provider>
        </div>
      )}
    </div>
  );
}
