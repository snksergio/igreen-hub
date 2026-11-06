// Liga a página de referência: carrega os moldes, monta as duas telas e simula os estados.
// No app, o "state" abaixo vem da sessão real (ver sessao.js e IMPLEMENTACAO.md).
import { createChargeScene } from './cena-recarga.js';
import { createConnectScene } from './cena-conectar.js';
import { rgb } from './geometria.js';
import { SESSION_EXAMPLE as S, computeMetrics, fmt1, brl, duration, clock } from './sessao.js';

const $ = s => document.querySelector(s);
const MOLDS_BASE = 'assets/moldes', CONNECT_BASE = 'assets/conectar';

const [moldsData, connectData] = await Promise.all([
  fetch(`${MOLDS_BASE}/moldes.json`).then(r => r.json()),
  fetch(`${CONNECT_BASE}/cenas.json`).then(r => r.json()),
]);
const MOLDS = moldsData.moldes;

const state = {
  mold: moldsData.padrao,
  mode: 'dc',      // 'dc' (carro informa a %) | 'ac' (sem %)
  soc: 68,         // % no DC; no AC, progresso da simulação (vira kWh)
  limit: 80,       // % de limite da sessão
  connect: 'awaiting', // tela 1: 'awaiting' | 'moving' | 'connected'
};
let chargeScene, connectScene;
const connectTimers = [];

/* ---------- cenas ---------- */
function buildScenes() {
  const mold = MOLDS[state.mold];
  chargeScene = createChargeScene($('#scene2'), mold, { id: 's2', assetsBase: MOLDS_BASE });
  // moldes "foto" usam a cena de conectar fotorrealista; "mini" usam a minimalista
  connectScene = createConnectScene($('#scene1'), connectData.cenas[mold.tipo], { id: 's1', assetsBase: CONNECT_BASE });
  document.querySelectorAll('.screen').forEach(s => s.style.setProperty('--fundo-tela', rgb(mold.fundo)));
}

/* ---------- tela 2 ---------- */
function renderScreen2(socShown) {
  const dc = state.mode === 'dc';
  const m = computeMetrics({ mode: state.mode, soc: socShown, progress: state.soc, limit: state.limit });
  const screen = $('#screen2');
  screen.classList.toggle('ac', !dc);
  screen.classList.toggle('complete', m.complete);
  chargeScene.setState(m.complete ? 'complete' : dc ? 'charging' : 'scan');

  $('#s2title').textContent = m.complete ? 'Recarga concluída' : 'Carregando';
  $('#s2plug').textContent = dc ? S.connector.type : S.acConnector.type;
  if (dc) {
    $('#s2big').textContent = Math.floor(socShown);
    $('#s2unit').textContent = '%';
    $('#s2sub').innerHTML = m.complete
      ? `Limite de ${state.limit}% atingido`
      : `<b>~${Math.max(1, Math.round(m.minutesToLimit))} min</b> para ${state.limit === 100 ? 'completar' : `chegar em ${state.limit}%`}`;
    $('#m2').innerHTML = `${fmt1(m.kwh)} <small>kWh</small>`;
    $('#m2l').textContent = 'Energia';
    $('#costFoot').textContent = `Encerra sozinha em ${state.limit}% ou ${brl(S.reservedBalance)}`;
    $('#notifyLabel').textContent = `Avisar quando chegar em ${state.limit}%`;
  } else {
    $('#s2big').textContent = fmt1(m.kwh);
    $('#s2unit').textContent = 'kWh';
    $('#s2sub').textContent = `entregues em ${duration(m.elapsedMin)}`;
    $('#m2').innerHTML = `<small>R$</small> ${m.tariff.toFixed(2).replace('.', ',')}`;
    $('#m2l').textContent = 'Tarifa/kWh';
    $('#costFoot').textContent = `Encerra sozinha ao atingir ${brl(S.reservedBalance)}`;
    $('#notifyLabel').textContent = 'Avisar quando encerrar';
  }
  const power = m.powerKw % 1 ? fmt1(m.powerKw) : Math.round(m.powerKw);
  $('#m1').innerHTML = `${power} <small>kW</small>`;
  $('#m3').innerHTML = `+${Math.round(m.km)} <small>km</small>`;
  $('#m4').innerHTML = m.elapsedMin < 60 ? `${Math.max(1, Math.round(m.elapsedMin))} <small>min</small>` : duration(m.elapsedMin);
  $('#tariff').textContent = `${brl(m.tariff)}/kWh`;
  $('#costVal').textContent = brl(m.cost);
  $('#costBar').style.transform = `scaleX(${Math.min(1, m.cost / S.reservedBalance)})`;
}

function applyScreen2(animate) {
  const dc = state.mode === 'dc';
  chargeScene.setLimit(dc ? state.limit / 100 : null);
  const target = dc ? state.soc / 100 : 0;
  if (animate) chargeScene.animateCharge(target, 700, f => renderScreen2(dc ? f * 100 : state.soc));
  else { chargeScene.setCharge(target); renderScreen2(state.soc); }
  $('#socOut').textContent = dc ? `${Math.round(state.soc)}%` : `${fmt1(state.soc / 100 * 30)} kWh`;
}

/* ---------- tela 1 (fluxo de conexão) ---------- */
const detect = $('#s1detect'), status = $('#s1status');
function resetConnect() {
  connectTimers.splice(0).forEach(clearTimeout);
  state.connect = 'awaiting';
  connectScene.reset();
  detect.classList.remove('ok');
  status.textContent = 'Aguardando o carro ser conectado…';
}
function simulateConnect() {
  if (state.connect !== 'awaiting') return;
  state.connect = 'moving';
  connectScene.plugIn(() => {
    // no app: OCPP StatusNotification "Preparing" (cabo detectado)
    state.connect = 'connected';
    detect.classList.add('ok');
    status.textContent = 'Carro conectado · lendo a bateria…';
    // no app: primeiro MeterValues com SoC (DC) / status "Charging" → navegar para a tela 2
    connectTimers.push(setTimeout(() => { status.textContent = `Bateria em ${S.startSoc}% · iniciando a recarga`; }, 1150));
    connectTimers.push(setTimeout(resetConnect, 5600)); // só na referência: volta ao início
  });
}

let reservationLeft = S.reservationSeconds;
setInterval(() => {
  reservationLeft = reservationLeft <= 0 ? S.reservationSeconds : reservationLeft - 1;
  $('#s1timer').textContent = clock(reservationLeft);
  $('#s1bar').style.transform = `scaleX(${reservationLeft / S.reservationSeconds})`;
}, 1000);

/* ---------- loop de animação (pausa com a aba oculta, como no app ao perder o foco) ---------- */
const animating = () => !document.body.classList.contains('no-anim') && !document.hidden;
function loop(now) {
  if (animating()) {
    if (state.connect === 'awaiting') connectScene.tickGhost(now); else connectScene.hideGhost();
    chargeScene.tick(now);
  }
  requestAnimationFrame(loop);
}

/* ---------- controles ---------- */
const pick = $('#moldePick');
moldsData.ordem.forEach(id => {
  const m = MOLDS[id];
  pick.insertAdjacentHTML('beforeend', `<button data-m="${id}" aria-pressed="false" title="${m.descricao}"><i class="${m.tipo}"></i>${m.nome}</button>`);
});
function setMold(id) {
  state.mold = id;
  pick.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.m === id));
  buildScenes();
  resetConnect();
  applyScreen2(false);
}
pick.addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) setMold(b.dataset.m); });

const socInput = $('#soc');
let chargeSim = 0;
socInput.addEventListener('input', () => { clearInterval(chargeSim); state.soc = +socInput.value; applyScreen2(false); });
const segmented = (sel, fn) => $(sel).addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $(sel).querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
  fn(b.dataset.v);
});
segmented('#limitSeg', v => { state.limit = +v; if (state.soc > state.limit) socInput.value = state.soc = state.limit; applyScreen2(false); });
segmented('#modeSeg', v => { state.mode = v; applyScreen2(true); });
$('#optAnim').addEventListener('change', e => document.body.classList.toggle('no-anim', !e.target.checked));
$('#btnConnect').addEventListener('click', simulateConnect);
$('#btnCharge').addEventListener('click', () => {
  if (state.mode !== 'dc') $('#modeSeg [data-v=dc]').click();
  clearInterval(chargeSim);
  if (state.soc >= state.limit - 1) state.soc = Math.max(S.startSoc, state.limit - 16);
  applyScreen2(false);
  chargeSim = setInterval(() => {
    socInput.value = state.soc = Math.min(state.limit, state.soc + .25);
    applyScreen2(false);
    if (state.soc >= state.limit) clearInterval(chargeSim);
  }, 60);
});

setMold(state.mold);
requestAnimationFrame(loop);
