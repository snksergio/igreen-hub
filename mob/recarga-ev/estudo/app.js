const $=s=>document.querySelector(s);
const dialog=$('#dialog');
let ended=false;
let connectionTimer;
function modal(html){$('#dialog-body').innerHTML=html;dialog.showModal()}
function closeDialog(){dialog.close()}
function setCharge(){
  const value=Number($('#charge-range').value),unknown=$('#no-soc').checked;
  $('#range-value').value=value+'%';
  $('#charging').classList.toggle('unknown',unknown);
  $('#soc-number').textContent=unknown?'—':value;
  $('#soc-unit').textContent=unknown?'':'%';
  $('#soc-caption').textContent=unknown?'Percentual não informado pelo veículo':'Bateria do veículo';
  $('#pack-fill').setAttribute('width',value);
  $('#pack-front').setAttribute('d',`M${value} 0v100`);
  $('#initial-soc').textContent=unknown?'—':'45%';
  $('#added-soc').textContent=unknown?'Energia fornecida: 18,4 kWh':`+${value-45} pontos de carga`;
  $('#estimate-copy').innerHTML=ended?'Sessão encerrada':unknown?'Tempo restante indisponível':value>=80?'<strong>80% atingidos</strong> · nível de aviso':`<strong>~${Math.ceil((80-value)*.9)} min</strong> para chegar a 80%`;
  $('#car-art').setAttribute('aria-label',unknown?'Carro translúcido, percentual de bateria indisponível':`Carro translúcido com bateria no assoalho, ${value}% carregada`);
  $('#alert-switch').disabled=unknown||ended;
  $('#charge-range').disabled=unknown||ended;
  $('#charge-state').innerHTML=`<i></i> ${ended?'RECARGA ENCERRADA':value===100&&!unknown?'CARGA COMPLETA':'CARREGANDO'}`;
  $('#power').innerHTML=ended||value===100&&!unknown?'0 <small>kW</small>':'42 <small>kW</small>';
}
$('#charge-range').addEventListener('input',setCharge);
$('#no-soc').addEventListener('change',setCharge);
$('#alert-switch').addEventListener('click',e=>{const b=e.currentTarget;b.setAttribute('aria-checked',b.getAttribute('aria-checked')!=='true')});
$('#connected-button').addEventListener('click',()=>{
  const button=$('#connected-button');button.disabled=true;button.textContent='Verificando conexão…';
  $('#connect-copy').innerHTML='Aguarde a confirmação do carregador.<br>Isso pode levar alguns instantes.';
  connectionTimer=setTimeout(()=>{
    $('#connect-title').innerHTML='Tudo conectado.<br>Recarga iniciada.';
    $('#connect-copy').innerHTML='Você já pode acompanhar a sessão.<br>O carregador confirmou a conexão.';
    $('#countdown').textContent='✓';button.textContent='Ver acompanhamento';button.disabled=false;
    button.onclick=()=>{$('#charging').scrollIntoView({block:'center',behavior:'smooth'});$('#charging').focus({preventScroll:true})};
    $('#charging').scrollIntoView({block:'center',behavior:'smooth'});$('#charging').focus({preventScroll:true});
  },1000);
},{once:true});
$('#stop-button').addEventListener('click',()=>modal('<h2>Encerrar a recarga?</h2><p>A sessão será finalizada com o valor registrado até agora. Aguarde a liberação do conector antes de retirar o cabo.</p><button class="primary" id="confirm-stop">Sim, encerrar recarga</button><button class="text-button" id="keep-charging">Continuar carregando</button>'));
document.addEventListener('click',e=>{
  if(e.target.id==='confirm-stop'){ended=true;$('#charging').classList.add('ended');$('#stop-button').disabled=true;$('#stop-button').textContent='Sessão encerrada';$('#budget-caption').textContent='Total da sessão: R$ 36,80.';setCharge();closeDialog()}
  if(e.target.id==='keep-charging'||e.target.id==='close-help')closeDialog();
  if(e.target.id==='confirm-cancel'){clearTimeout(connectionTimer);$('#connect-title').innerHTML='Reserva cancelada.';$('#connect-copy').innerHTML='A tomada está disponível novamente.<br>Selecione um conector para recomeçar.';$('#connected-button').disabled=true;$('#countdown').textContent='—';closeDialog()}
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='help')modal('<h2>Vamos conectar?</h2><p>Confira se você está no conector <strong>C-01 · CCS2</strong> da Shell Paulista.</p><ul><li>Abra a entrada de recarga do veículo.</li><li>Alinhe e encaixe o conector até ele travar, sem forçar.</li><li>Aguarde a confirmação do carregador.</li></ul><p>Se o encaixe não for compatível, volte e confira o conector selecionado.</p><button class="primary" id="close-help">Entendi</button>');
  if(action==='cancel')modal('<h2>Cancelar a conexão?</h2><p>A reserva deste conector será liberada.</p><button class="primary" id="confirm-cancel">Cancelar reserva</button><button class="text-button" id="close-help">Continuar conexão</button>');
  if(action==='back')$('#connection').scrollIntoView({block:'center',behavior:'smooth'});
  if(action==='details')modal('<h2>Detalhes da sessão</h2><dl><div><dt>Eletroposto</dt><dd>Shell Paulista</dd></div><div><dt>Conector</dt><dd>C-01 · CCS2</dd></div><div><dt>Tarifa ilustrativa</dt><dd>R$ 2,00 / kWh</dd></div><div><dt>Energia fornecida</dt><dd>18,4 kWh</dd></div><div><dt>Custo até agora</dt><dd>R$ 36,80</dd></div><div><dt>Limite de valor</dt><dd>R$ 50,00</dd></div></dl><p>Dados simulados para avaliação da interface.</p>');
});
$('#reset-button').addEventListener('click',()=>location.reload());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()}});
setCharge();
