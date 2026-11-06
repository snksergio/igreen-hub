import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {C, SANS, SERIF, MONO} from '../theme';
import {Frame, T, Kicker, Rise, Chip, Ast, ArrowCircle} from '../ui';
import {REN, JOR, MOMENTS} from '../data';

export const Curve: React.FC = () => {
  const f = useCurrentFrame();
  const w = 1560, h = 400, pad = 26;
  const X = (i: number) => pad + i * ((w - pad * 2) / 12);
  const Y = (v: number) => 30 + (v - 40) * (h - 90) / 135;
  const line = (a: number[]) => a.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  const draw = interpolate(f, [8, 74], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const L = 3200;
  return (
    <Frame bg={C.paper} num="18" foot="curva emocional das duas trilhas">
      <Rise d={0}><Kicker>as duas curvas, juntas</Kicker></Rise>
      <Rise d={4} style={{marginTop: 26}}><T size={82}>{'Elas afundam em <i>lugares diferentes</i>'}</T></Rise>
      <div style={{marginTop: 40, background: C.white, borderRadius: 28, padding: '34px 30px 22px', border: '1px solid #DCE0D0'}}>
        <svg viewBox={`0 0 ${w} ${h}`} style={{width: '100%', height: 'auto'}}>
          <defs>
            <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.brick} stopOpacity="0.20" />
              <stop offset="100%" stopColor={C.brick} stopOpacity="0" />
            </linearGradient>
          </defs>
          {MOMENTS.map((m, i) => (
            <g key={i} opacity={interpolate(f, [10 + i * 3, 26 + i * 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
              <line x1={X(i)} y1={18} x2={X(i)} y2={h - 44} stroke="#D8DDC9" strokeWidth="1" strokeDasharray="3 6" />
              <text x={X(i)} y={h - 18} textAnchor="middle" fontFamily="DM Mono" fontSize="17" fill={C.ink2}>{m.m}</text>
            </g>
          ))}
          <polyline points={`${line(REN)} ${X(12)},${h - 44} ${X(0)},${h - 44}`} fill="url(#ar)" stroke="none" opacity={draw} />
          <polyline points={line(JOR)} fill="none" stroke={C.olive2} strokeWidth="4" strokeLinejoin="round"
            strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
          <polyline points={line(REN)} fill="none" stroke={C.brick} strokeWidth="5" strokeLinejoin="round"
            strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
          {draw > 0.96 && <>
            <circle cx={X(9)} cy={Y(REN[9])} r="11" fill={C.brick} />
            <text x={X(9)} y={Y(REN[9]) - 24} textAnchor="middle" fontFamily="DM Mono" fontSize="19" fill={C.brick}>o handshake</text>
            <circle cx={X(3)} cy={Y(JOR[3])} r="10" fill={C.olive2} />
            <text x={X(3)} y={Y(JOR[3]) + 34} textAnchor="middle" fontFamily="DM Mono" fontSize="19" fill={C.olive2}>a fila</text>
          </>}
        </svg>
      </div>
      <Rise d={70} style={{marginTop: 34, display: 'flex', gap: 54, fontSize: 23, color: C.ink2}}>
        <span><i style={{display: 'inline-block', width: 28, height: 4, background: C.brick, marginRight: 12, verticalAlign: 'middle'}} />Renata — o fundo é o handshake, já tendo pago</span>
        <span><i style={{display: 'inline-block', width: 28, height: 4, background: C.olive2, marginRight: 12, verticalAlign: 'middle'}} />Jorge — o fundo é a fila, onde o tempo é roubado</span>
      </Rise>
    </Frame>
  );
};

export const TwoProblems: React.FC = () => (
  <Frame bg={C.deep} dark num="19" foot="dois problemas, um ponto em comum">
    <Rise d={0}><Kicker color={C.lime}>o que as duas trilhas ensinam</Kicker></Rise>
    <Rise d={4} style={{marginTop: 26}}><T size={88} color={C.paper}>{'Dois problemas, um <i>ponto em comum</i>'}</T></Rise>
    <div style={{display: 'flex', gap: 44, marginTop: 66, flex: 1}}>
      {[
        {d: 14, ac: C.brick, h: 'Renata precisa entrar', p: 'A curva dela despenca no pagamento e nunca se recupera. Cada campo a mais é uma chance de ir embora — e é ela quem decide se o carro elétrico vale a pena pra família.'},
        {d: 22, ac: C.lime, h: 'Jorge precisa sair rápido', p: 'Ele já sabe tudo. A curva dele cai onde o tempo é roubado: fila sem previsão, 35 minutos parados, ociosidade cobrada por engano.'},
        {d: 30, ac: C.lime, h: 'O ponto em comum é o dinheiro', p: 'Ela perde a confiança porque bloquearam R$150 e sobrou saldo preso. Ele porque foi cobrado duas vezes e não tem a nota fiscal. Mesma camada, dois clientes.'},
      ].map((c) => (
        <Rise key={c.h} d={c.d} style={{flex: 1, borderLeft: `3px solid ${c.ac}`, paddingLeft: 34}}>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: '-0.03em', color: c.ac, lineHeight: 1.1}}>{c.h}</div>
          <p style={{margin: '24px 0 0', fontSize: 24, lineHeight: 1.45, color: C.muteD}}>{c.p}</p>
        </Rise>
      ))}
    </div>
  </Frame>
);

export const World: React.FC = () => {
  const rows = [
    {who: 'Fastned', a: 'contactless', b: 'app −10% · assinatura −30%'},
    {who: 'bp pulse', a: '65p/kWh', b: '52p/kWh assinante'},
    {who: 'EVgo', a: 'US$2,99 por sessão', b: 'sem taxa'},
  ];
  return (
    <Frame bg={C.paper} num="20" foot="o que o mundo já resolveu">
      <div style={{display: 'flex', gap: 70}}>
        <div style={{flex: '0 0 700px'}}>
          <Rise d={0}><Kicker>regulação madura</Kicker></Rise>
          <Rise d={4} style={{marginTop: 26}}><T size={76}>{'Três reguladores proibiram exigir <i>app</i>'}</T></Rise>
          <Rise d={16} style={{marginTop: 32}}>
            <p style={{margin: 0, fontSize: 25, lineHeight: 1.45, color: C.ink2}}>
              AFIR art. 5º na União Europeia, SI 2023/1168 no Reino Unido, 23 CFR §680.106 nos Estados Unidos.
              Quando a Fastned instalou terminais de cartão, <b style={{color: C.ink}}>25% das sessões no Reino Unido e 35% na Suíça migraram</b> — um terço da demanda estava sendo perdida.
            </p>
          </Rise>
          <Rise d={30} style={{marginTop: 40, display: 'flex', gap: 14, flexWrap: 'wrap'}}>
            <Chip color={C.ink} bd="#C3CBB2">sem contrato prévio</Chip>
            <Chip color={C.ink} bd="#C3CBB2">contactless acima de 8 kW</Chip>
            <Chip color={C.ink} bd="#C3CBB2">QR → página de pagamento</Chip>
          </Rise>
        </div>
        <div style={{flex: 1}}>
          <Rise d={10} style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.ink2}}>
            e nenhum deles matou o cadastro
          </Rise>
          <div style={{marginTop: 28, display: 'flex', flexDirection: 'column'}}>
            {rows.map((r, i) => (
              <Rise key={r.who} d={16 + i * 6} style={{display: 'grid', gridTemplateColumns: '200px 1fr 1fr',
                gap: 20, padding: '28px 0', borderBottom: '1px solid #CFD5C1', alignItems: 'baseline'}}>
                <div style={{fontSize: 27, fontWeight: 500, color: C.ink}}>{r.who}</div>
                <div style={{fontFamily: MONO, fontSize: 20, color: C.brick}}>{r.a}</div>
                <div style={{fontFamily: MONO, fontSize: 20, color: C.olive2}}>{r.b}</div>
              </Rise>
            ))}
          </div>
          <Rise d={40} style={{marginTop: 44, background: C.lime, borderRadius: 24, padding: '34px 38px'}}>
            <p style={{margin: 0, fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, lineHeight: 1.16,
              color: C.deep, letterSpacing: '-0.012em'}}>
              A regra garante o acesso. O preço faz a conversão.
            </p>
          </Rise>
        </div>
      </div>
    </Frame>
  );
};

export const Tension: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flip = spring({frame: f - 30, fps, config: {damping: 200, stiffness: 60}});
  return (
    <Frame bg={C.deep} dark num="21" foot="a tensão do nosso modelo">
      <Rise d={0}><Kicker color={C.lime}>a tensão que o projeto tem que resolver</Kicker></Rise>
      <Rise d={4} style={{marginTop: 26, maxWidth: 1400}}>
        <T size={84} color={C.paper}>{'O licenciado é pago pelo motorista que ele <i>cadastra</i>'}</T>
      </Rise>
      <div style={{display: 'flex', gap: 40, marginTop: 56, alignItems: 'stretch'}}>
        <div style={{flex: 1, borderRadius: 26, padding: '38px 40px', background: 'rgba(221,90,44,0.10)',
          border: `1px solid rgba(221,90,44,0.42)`, opacity: interpolate(f, [14, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.brick}}>hoje · o padrão do mercado</div>
          <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap'}}>
            {['link', 'cadastro completo', 'carga', 'comissão'].map((s, i) => (
              <React.Fragment key={s}>
                <span style={{fontFamily: SANS, fontSize: 25, color: i === 1 ? C.brick : C.muteD,
                  border: `1px solid ${i === 1 ? C.brick : '#3A4A26'}`, borderRadius: 10, padding: '12px 18px'}}>{s}</span>
                {i < 3 && <span style={{color: '#4A5D2C'}}>→</span>}
              </React.Fragment>
            ))}
          </div>
          <p style={{margin: '28px 0 0', fontSize: 23, lineHeight: 1.45, color: C.muteD}}>
            O licenciado só recebe quando as quatro válvulas do pagamento abrem todas — sinal, SMS, formulário e caução.
            Se uma fecha, ninguém carrega e ninguém é pago.
          </p>
        </div>
        <div style={{flex: 1, borderRadius: 26, padding: '38px 40px', background: 'rgba(201,242,77,0.09)',
          border: `1px solid ${C.olive2}`, opacity: flip, transform: `perspective(1600px) rotateY(${(1 - flip) * 8}deg)`}}>
          <div style={{fontFamily: MONO, fontSize: 17, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.lime}}>hipótese · o que a evidência sustenta</div>
          <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap'}}>
            {['link', 'pagar identifica', 'carga', 'perfil com desconto'].map((s, i) => (
              <React.Fragment key={s}>
                <span style={{fontFamily: SANS, fontSize: 25, color: C.lime, border: `1px solid ${C.olive2}`,
                  borderRadius: 10, padding: '12px 18px'}}>{s}</span>
                {i < 3 && <span style={{color: C.olive2}}>→</span>}
              </React.Fragment>
            ))}
          </div>
          <p style={{margin: '28px 0 0', fontSize: 23, lineHeight: 1.45, color: C.muteD}}>
            A atribuição nasce no link e no pagamento, não no formulário. O perfil se completa depois da carga,
            quando a pessoa está satisfeita — e o desconto é o motivo.
          </p>
        </div>
      </div>
      <Rise d={58} style={{marginTop: 'auto', paddingTop: 34, display: 'flex', alignItems: 'center', gap: 24}}>
        <Ast size={32} color={C.lime} />
        <p style={{margin: 0, fontFamily: SERIF, fontStyle: 'italic', fontSize: 38, color: C.paper,
          letterSpacing: '-0.012em', lineHeight: 1.2}}>
          O que muda entre as duas linhas é só onde o cadastro acontece — a comissão do licenciado existe nas duas.
        </p>
      </Rise>
    </Frame>
  );
};

export const Close: React.FC = () => {
  const f = useCurrentFrame();
  const s = spring({frame: f, fps: 30, config: {damping: 200, stiffness: 80}});
  return (
    <div style={{position: 'absolute', inset: 0, background: C.lime, padding: '96px 120px 74px',
      display: 'flex', flexDirection: 'column', fontFamily: SANS, overflow: 'hidden'}}>
      <div style={{position: 'absolute', right: -180, bottom: -260, width: 900, height: 900, borderRadius: '50%',
        border: `1px solid rgba(23,33,14,0.16)`, transform: `scale(${0.9 + s * 0.1})`}} />
      <div style={{position: 'absolute', right: -60, bottom: -180, width: 620, height: 620, borderRadius: '50%',
        border: `1px solid rgba(23,33,14,0.14)`}} />
      <Rise d={0}><Kicker color={C.deep}>o que ainda falta</Kicker></Rise>
      <Rise d={6} style={{marginTop: 40, maxWidth: 1240}}>
        <T size={116} color={C.deep} w={600}>{'Ninguém no time recarregou <i>de verdade</i>'}</T>
      </Rise>
      <Rise d={22} style={{marginTop: 46, maxWidth: 900}}>
        <p style={{margin: 0, fontSize: 30, lineHeight: 1.4, color: '#2A3A17'}}>
          Renata e Jorge são compostos honestos, mas continuam sendo hipóteses.
          Acompanhar cinco pessoas que nunca recarregaram, do estacionamento à saída, é o que
          transforma estas duas trilhas em pesquisa.
        </p>
      </Rise>
      <Rise d={36} style={{marginTop: 44, display: 'flex', alignItems: 'center', gap: 26}}>
        <Ast size={38} color={C.deep} spin={f * 0.8} />
        <p style={{margin: 0, fontFamily: SERIF, fontStyle: 'italic', fontSize: 38, color: C.deep, letterSpacing: '-0.012em', maxWidth: 900}}>
          A cena mais reveladora — a pessoa em pé, sozinha, sem conseguir — não aparece em avaliação de loja.
        </p>
      </Rise>
      <div style={{marginTop: 'auto', paddingTop: 26, borderTop: '1px solid rgba(23,33,14,0.22)', display: 'flex',
        fontFamily: MONO, fontSize: 17, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#33451B'}}>
        <span>Conexão Mobi / discovery · nada aqui é regra da iGreen até ser decidido</span>
        <span style={{marginLeft: 'auto'}}>22</span>
      </div>
    </div>
  );
};
