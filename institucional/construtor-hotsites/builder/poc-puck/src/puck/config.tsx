import type { Config } from "@puckeditor/core";
import { Abertura, type AberturaProps } from "./blocks/Abertura";
import { Agenda, type AgendaProps } from "./blocks/Agenda";
import { Cards, type CardsProps } from "./blocks/Cards";
import { ChamadaFinal, type ChamadaFinalProps } from "./blocks/ChamadaFinal";
import { ContagemRegressiva, type ContagemRegressivaProps } from "./blocks/ContagemRegressiva";
import { ContatoConsultor, type ContatoConsultorProps } from "./blocks/ContatoConsultor";
import { Depoimentos, type DepoimentosProps } from "./blocks/Depoimentos";
import { FaixaAnimada, type FaixaAnimadaProps } from "./blocks/FaixaAnimada";
import { Galeria, type GaleriaProps } from "./blocks/Galeria";
import { Inscricao, type InscricaoProps } from "./blocks/Inscricao";
import { ItensNumerados, type ItensNumeradosProps } from "./blocks/ItensNumerados";
import { LinhaDoTempo, type LinhaDoTempoProps } from "./blocks/LinhaDoTempo";
import { Local, type LocalProps } from "./blocks/Local";
import { LogosParceiros, type LogosParceirosProps } from "./blocks/LogosParceiros";
import { Numeros, type NumerosProps } from "./blocks/Numeros";
import { Pessoas, type PessoasProps } from "./blocks/Pessoas";
import { PerguntasFrequentes, type PerguntasFrequentesProps } from "./blocks/PerguntasFrequentes";
import { Planos, type PlanosProps } from "./blocks/Planos";
import { SecaoLivre, type SecaoLivreProps } from "./blocks/SecaoLivre";
import { Simulador, type SimuladorProps } from "./blocks/Simulador";
import { Video, type VideoProps } from "./blocks/Video";
import { LiveAbertura, type LiveAberturaProps } from "./blocks/live/LiveAbertura";
import { LiveFaixa, type LiveFaixaProps } from "./blocks/live/LiveFaixa";
import { LiveSobre, type LiveSobreProps } from "./blocks/live/LiveSobre";
import { LiveBeneficios, type LiveBeneficiosProps } from "./blocks/live/LiveBeneficios";
import { LivePalestrantes, type LivePalestrantesProps } from "./blocks/live/LivePalestrantes";
import { LiveAgenda, type LiveAgendaProps } from "./blocks/live/LiveAgenda";
import { LiveNumeros, type LiveNumerosProps } from "./blocks/live/LiveNumeros";
import { LiveLocal, type LiveLocalProps } from "./blocks/live/LiveLocal";
import { LiveVideo, type LiveVideoProps } from "./blocks/live/LiveVideo";
import { LivePerguntas, type LivePerguntasProps } from "./blocks/live/LivePerguntas";
import { LiveInscricao, type LiveInscricaoProps } from "./blocks/live/LiveInscricao";
import { LiveRodape, type LiveRodapeProps } from "./blocks/live/LiveRodape";
import { GRUPOS, rotulo } from "./catalogo";
import { imagemField } from "./fields/ImagemField";

export type Blocks = {
  Abertura: AberturaProps;
  ItensNumerados: ItensNumeradosProps;
  Cards: CardsProps;
  Numeros: NumerosProps;
  Video: VideoProps;
  Pessoas: PessoasProps;
  Agenda: AgendaProps;
  Local: LocalProps;
  PerguntasFrequentes: PerguntasFrequentesProps;
  ChamadaFinal: ChamadaFinalProps;
  Inscricao: InscricaoProps;
  ContatoConsultor: ContatoConsultorProps;
  Simulador: SimuladorProps;
  Depoimentos: DepoimentosProps;
  Galeria: GaleriaProps;
  LogosParceiros: LogosParceirosProps;
  ContagemRegressiva: ContagemRegressivaProps;
  LinhaDoTempo: LinhaDoTempoProps;
  Planos: PlanosProps;
  FaixaAnimada: FaixaAnimadaProps;
  SecaoLivre: SecaoLivreProps;
  LiveAbertura: LiveAberturaProps;
  LiveFaixa: LiveFaixaProps;
  LiveSobre: LiveSobreProps;
  LiveBeneficios: LiveBeneficiosProps;
  LivePalestrantes: LivePalestrantesProps;
  LiveAgenda: LiveAgendaProps;
  LiveNumeros: LiveNumerosProps;
  LiveLocal: LiveLocalProps;
  LiveVideo: LiveVideoProps;
  LivePerguntas: LivePerguntasProps;
  LiveInscricao: LiveInscricaoProps;
  LiveRodape: LiveRodapeProps;
};

/** `animacoes` vazio (páginas antigas) conta como ligado; `indexar` vazio conta como sim. */
type RootProps = {
  titulo: string;
  descricao: string;
  imagemCompartilhamento: string;
  indexar: boolean;
  animacoes: "on" | "off";
  /** "sem": a página traz o próprio topo e rodapé (kit iGreen Live). Vazio conta como "padrao". */
  moldura?: "padrao" | "sem";
};

/** Cabeçalho e rodapé fixos: fazem parte da página, não são peças. */
function Pagina({ children, animacoes, moldura }: { children?: React.ReactNode; animacoes?: "on" | "off"; moldura?: "padrao" | "sem" }) {
  if (moldura === "sem")
    return (
      <div className="hs hs--sem-moldura" data-anim={animacoes === "off" ? "off" : "on"}>
        <main>{children}</main>
      </div>
    );
  return (
    <div className="hs" data-anim={animacoes === "off" ? "off" : "on"}>
      <header className="hs-top">
        <span className="hs-logo">iGreen</span>
      </header>
      <main>{children}</main>
      <footer className="hs-foot">
        <span className="hs-logo">iGreen</span>
        <span>
          <a href="https://www.igreenenergy.com.br" target="_blank" rel="noopener noreferrer">
            igreenenergy.com.br
          </a>{" "}
          · Política de privacidade · Encarregado de dados (DPO): a definir
        </span>
      </footer>
    </div>
  );
}

export const config: Config<Blocks, RootProps> = {
  categories: GRUPOS,
  root: {
    fields: {
      titulo: { type: "text", label: "Título no Google e na aba (até 60 caracteres)" },
      descricao: { type: "textarea", label: "Descrição no Google e no WhatsApp (até 160 caracteres)" },
      imagemCompartilhamento: imagemField("Imagem ao compartilhar o link (vazio = imagem da Abertura)"),
      indexar: {
        type: "radio",
        label: "Aparecer no Google",
        options: [
          { label: "Sim", value: true },
          { label: "Não (evento fechado)", value: false },
        ],
      },
      animacoes: {
        type: "radio",
        label: "Animações ao rolar (aparecem na página publicada)",
        options: [
          { label: "Ligadas", value: "on" },
          { label: "Desligadas", value: "off" },
        ],
      },
      moldura: {
        type: "radio",
        label: "Cabeçalho e rodapé padrão da iGreen",
        options: [
          { label: "Mostrar", value: "padrao" },
          { label: "Esconder (a página usa a Abertura e o Rodapé do kit Live)", value: "sem" },
        ],
      },
    },
    defaultProps: { titulo: "", descricao: "", imagemCompartilhamento: "", indexar: true, animacoes: "on", moldura: "padrao" },
    render: ({ children, animacoes, moldura }) => <Pagina animacoes={animacoes} moldura={moldura}>{children}</Pagina>,
  },
  // O rótulo de cada peça vem do catálogo: "Abertura · Hero section", "Passo a passo · Steps"…
  components: {
    Abertura: { ...Abertura, label: rotulo("Abertura") },
    ItensNumerados: { ...ItensNumerados, label: rotulo("ItensNumerados") },
    Cards: { ...Cards, label: rotulo("Cards") },
    Numeros: { ...Numeros, label: rotulo("Numeros") },
    Video: { ...Video, label: rotulo("Video") },
    Pessoas: { ...Pessoas, label: rotulo("Pessoas") },
    Agenda: { ...Agenda, label: rotulo("Agenda") },
    Local: { ...Local, label: rotulo("Local") },
    PerguntasFrequentes: { ...PerguntasFrequentes, label: rotulo("PerguntasFrequentes") },
    ChamadaFinal: { ...ChamadaFinal, label: rotulo("ChamadaFinal") },
    Inscricao: { ...Inscricao, label: rotulo("Inscricao") },
    ContatoConsultor: { ...ContatoConsultor, label: rotulo("ContatoConsultor") },
    Simulador: { ...Simulador, label: rotulo("Simulador") },
    Depoimentos: { ...Depoimentos, label: rotulo("Depoimentos") },
    Galeria: { ...Galeria, label: rotulo("Galeria") },
    LogosParceiros: { ...LogosParceiros, label: rotulo("LogosParceiros") },
    ContagemRegressiva: { ...ContagemRegressiva, label: rotulo("ContagemRegressiva") },
    LinhaDoTempo: { ...LinhaDoTempo, label: rotulo("LinhaDoTempo") },
    Planos: { ...Planos, label: rotulo("Planos") },
    FaixaAnimada: { ...FaixaAnimada, label: rotulo("FaixaAnimada") },
    SecaoLivre: { ...SecaoLivre, label: rotulo("SecaoLivre") },
    LiveAbertura: { ...LiveAbertura, label: rotulo("LiveAbertura") },
    LiveFaixa: { ...LiveFaixa, label: rotulo("LiveFaixa") },
    LiveSobre: { ...LiveSobre, label: rotulo("LiveSobre") },
    LiveBeneficios: { ...LiveBeneficios, label: rotulo("LiveBeneficios") },
    LivePalestrantes: { ...LivePalestrantes, label: rotulo("LivePalestrantes") },
    LiveAgenda: { ...LiveAgenda, label: rotulo("LiveAgenda") },
    LiveNumeros: { ...LiveNumeros, label: rotulo("LiveNumeros") },
    LiveLocal: { ...LiveLocal, label: rotulo("LiveLocal") },
    LiveVideo: { ...LiveVideo, label: rotulo("LiveVideo") },
    LivePerguntas: { ...LivePerguntas, label: rotulo("LivePerguntas") },
    LiveInscricao: { ...LiveInscricao, label: rotulo("LiveInscricao") },
    LiveRodape: { ...LiveRodape, label: rotulo("LiveRodape") },
  },
};
