import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {C, SANS, SERIF, MONO} from '../theme';
import {Frame, T, Kicker, Chip, ArrowCircle, Rise, BigNum, Count, StepBar, Disc, Ast} from '../ui';

export const Cover: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 200, stiffness: 90}});
  const shift = interpolate(f, [0, 140], [0, -18]);
  return (
    <div style={{position: 'absolute', inset: 0, background: C.deep, overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', right: -120, top: -60, opacity: 0.9}}><Disc size={860} /></div>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(100deg,${C.deep} 8%, rgba(23,33,14,0.86) 46%, rgba(23,33,14,0) 78%)`}} />
      <div style={{position: 'absolute', left: 120, top: 118, right: 120, transform: `translateY(${shift}px)`}}>
        <Rise d={0}><Kicker color={C.lime}>Conexão Mobi · Discovery · set 2026</Kicker></Rise>
        <div style={{marginTop: 44, opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
          <T size={150} color={C.paper} w={600}>{'Da vaga\nà <i>energia</i>'}</T>
        </div>
        <Rise d={16} style={{marginTop: 46, maxWidth: 780}}>
          <p style={{margin: 0, fontSize: 32, lineHeight: 1.34, color: C.muteD, fontWeight: 400}}>
            A primeira recarga de um carro elétrico no Brasil, contada por quem passa por ela.
          </p>
        </Rise>
        <Rise d={28} style={{marginTop: 58, display: 'flex', gap: 16, alignItems: 'center'}}>
          <Chip color={C.lime} bd={C.olive2}>6 frentes de pesquisa</Chip>
          <Chip color={C.muteD} bd={C.olive}>~250 fontes</Chip>
          <Chip color={C.muteD} bd={C.olive}>13 momentos</Chip>
          <div style={{marginLeft: 12}}><ArrowCircle color={C.lime} size={68} rot={-45} /></div>
        </Rise>
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, bottom: 74, borderTop: `1px solid #2E3D1D`, paddingTop: 22,
        display: 'flex', fontFamily: MONO, fontSize: 17, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.mute}}>
        <span>iGreen · nova vertical em recarga de veículos elétricos</span>
        <span style={{marginLeft: 'auto'}}>01</span>
      </div>
    </div>
  );
};

const NumCell: React.FC<{d: number; big: any; label: string; crit?: boolean}> = ({d, big, label, crit}) => (
  <Rise d={d} style={{flex: 1, borderTop: `2px solid ${crit ? C.brick : C.ink}`, paddingTop: 30}}>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 106, lineHeight: 0.9, letterSpacing: '-0.055em',
      color: crit ? C.brick : C.ink, fontVariantNumeric: 'tabular-nums'}}>{big}</div>
    <div style={{marginTop: 22, fontSize: 22, lineHeight: 1.38, color: C.ink2, maxWidth: 300}}>{label}</div>
  </Rise>
);

export const Numbers: React.FC = () => (
  <Frame bg={C.paper} num="02" foot="o mercado real">
    <Rise d={0}><Kicker>o que a pesquisa encontrou</Kicker></Rise>
    <Rise d={6} style={{marginTop: 34, maxWidth: 1300}}>
      <T size={92}>{'Não é problema de <i>tomada</i>.'}</T>
    </Rise>
    <div style={{display: 'flex', gap: 48, marginTop: 96}}>
      <NumCell d={18} big={<Count to={25429} delay={20} />} label="pontos públicos e semipúblicos em mai/2026 — dois terços deles AC lento" />
      <NumCell d={26} crit big={<><Count to={20} delay={28} />%</>} label="das visitas de campo encontraram um carregador livre" />
      <NumCell d={34} crit big={<><Count to={31.2} delay={36} fmt={(n) => n.toFixed(1).replace('.', ',')} />%</>} label="das rodovias brasileiras sem nenhum dado móvel" />
      <NumCell d={42} crit big={<><Count to={39} delay={44} />%</>} label="das reclamações da maior operadora são sobre dinheiro" />
    </div>
    <Rise d={56} style={{marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 22}}>
      <Ast size={34} color={C.lime2} />
      <p style={{margin: 0, fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, color: C.ink, letterSpacing: '-0.01em'}}>
        O problema número um da recarga pública brasileira é dinheiro.
      </p>
    </Rise>
  </Frame>
);

export const Ruler: React.FC = () => {
  const rows = [
    {who: 'Volvo · 2ª carga', w: 7, lab: 'autocharge', val: '1 ação'},
    {who: 'Incharge', w: 12, lab: 'pluga e encosta o cartão', val: '2 ações'},
    {who: 'EZVolt', w: 68, lab: 'CPF + biometria facial', val: '12–16', bad: true},
    {who: 'Tupi', w: 84, lab: 'CPF, nascimento, endereço, placa', val: '14–18', bad: true},
    {who: 'BYD Recharge', w: 100, lab: 'tudo acima + chassi do veículo', val: '16–20', bad: true},
  ];
  return (
    <Frame bg={C.paper} num="03" foot="a régua de fricção">
      <div style={{display: 'flex', alignItems: 'flex-start', gap: 60}}>
        <div style={{flex: '0 0 520px'}}>
          <Rise d={0}><Kicker>ações até a energia fluir</Kicker></Rise>
          <Rise d={6} style={{marginTop: 30}}><T size={80}>{'Fator <i>10×</i> no mesmo mercado'}</T></Rise>
          <Rise d={20} style={{marginTop: 34}}>
            <p style={{margin: 0, fontSize: 23, lineHeight: 1.45, color: C.ink2, maxWidth: 430}}>
              A mesma tarefa — sair do carro e colocar energia — custa entre duas e vinte ações no Brasil.
              Não é diferença de tecnologia. É decisão de produto.
            </p>
          </Rise>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 18, marginTop: 14}}>
          {rows.map((r, i) => (
            <div key={r.who} style={{display: 'flex', alignItems: 'center', gap: 26}}>
              <Rise d={10 + i * 4} style={{flex: '0 0 250px', textAlign: 'right'}}>
                <div style={{fontSize: 25, color: C.ink, fontWeight: 500}}>{r.who}</div>
                <div style={{fontFamily: MONO, fontSize: 15, color: C.ink2, letterSpacing: '0.08em', marginTop: 4}}>{r.bad ? 'caminho longo' : 'caminho curto'}</div>
              </Rise>
              <div style={{flex: 1}}><StepBar w={r.w} delay={16 + i * 7} label={r.lab} value={r.val} bad={r.bad} h={104} /></div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
};

const PCard: React.FC<{d: number; tag: string; name: string; meta: string; body: any; accent: string; dark?: boolean}> = ({d, tag, name, meta, body, accent, dark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - d, fps, config: {damping: 200, stiffness: 80}});
  return (
    <div style={{flex: 1, background: dark ? C.deep2 : C.white, borderRadius: 30, padding: '44px 46px',
      opacity: s, transform: `perspective(1600px) rotateY(${(1 - s) * (dark ? -6 : 6)}deg) translateY(${(1 - s) * 30}px)`,
      borderTop: `4px solid ${accent}`, display: 'flex', flexDirection: 'column'}}>
      <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent}}>{tag}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 62, letterSpacing: '-0.04em', marginTop: 12,
        color: dark ? C.paper : C.ink}}>{name}</div>
      <div style={{fontSize: 21, color: dark ? C.mute : C.ink2, marginTop: 10}}>{meta}</div>
      <p style={{margin: '32px 0 0', fontSize: 25, lineHeight: 1.44, color: dark ? C.muteD : C.ink2}}>{body}</p>
    </div>
  );
};

export const Personas: React.FC = () => (
  <Frame bg={C.paper2} num="04" foot="duas pessoas, o mesmo eletroposto">
    <Rise d={0}><Kicker>as duas trilhas</Kicker></Rise>
    <Rise d={5} style={{marginTop: 28}}><T size={84}>{'Quem chega pela <i>primeira vez</i> e quem chega toda semana'}</T></Rise>
    <div style={{display: 'flex', gap: 34, marginTop: 62, flex: 1}}>
      <PCard d={14} accent={C.brick} tag="trilha A · primeira vez" name="Renata, 41"
        meta="Gerente comercial · Uberlândia · BYD Dolphin há 5 semanas"
        body={<>Sempre carregou em casa, na tomada da garagem. Hoje é a primeira viagem longa, com a filha no carro. Nunca usou um app de recarga e não sabe o que é CCS2.</>} />
      <PCard d={24} dark accent={C.lime} tag="trilha B · já é cliente" name="Jorge, 34"
        meta="Motorista de aplicativo · São Paulo · aluga um elétrico por semana"
        body={<>Recarrega cinco vezes por semana. Tem sete apps de recarga no celular e saldo espalhado em quatro carteiras. Carro parado é dinheiro parado.</>} />
    </div>
    <Rise d={44} style={{marginTop: 30, fontFamily: MONO, fontSize: 17, color: C.ink2, letterSpacing: '0.06em'}}>
      Personas compostas, montadas a partir de falas reais lidas na pesquisa. Não são entrevistas.
    </Rise>
  </Frame>
);
