'use strict';
const $=id=>document.getElementById(id);
const money=(n,decimals=0)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:decimals,maximumFractionDigits:decimals}).format(n);
const integer=n=>new Intl.NumberFormat('pt-BR').format(n);
let months=12;
const labels={1:'Receita mensal no 1º mês',12:'Receita mensal ao final do 1º ano',60:'Receita mensal ao final do 5º ano',120:'Receita mensal ao final do 10º ano'};
function state(){return {clients:Number($('clients').value),months,energy:$('energy').checked,insurance:$('insurance').checked,phone:$('phone').checked};}
function render(){
  const r=IgreenCalculator.calculate(state());
  $('clients-output').textContent=r.clients;$('clients').style.setProperty('--range',r.clients*5+'%');
  $('monthly-clients').textContent=integer(r.monthlyClients);$('per-client').textContent=money(r.perClient,2);
  $('result-label').textContent=labels[months];$('revenue').textContent=money(r.revenue);$('portfolio').textContent=integer(r.portfolio);$('accumulated').textContent=money(r.accumulated);
  document.querySelectorAll('[data-months]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.months)===months)));
  $('chart-end').textContent='MÊS '+String(months).padStart(2,'0');$('chart').setAttribute('aria-label',`Receita mensal estimada de ${money(r.monthlyClients*r.perClient)} no primeiro mês a ${money(r.revenue)} no mês ${months}.`);
  const n=Math.min(12,months);$('bars').replaceChildren(...Array.from({length:n},(_,i)=>{const b=document.createElement('div');b.className='bar';b.style.height=(r.revenue?(i+1)/n*100:0)+'%';b.setAttribute('aria-hidden','true');return b;}));
  return r;
}
['clients','energy','insurance','phone'].forEach(id=>$(id).addEventListener('input',render));
document.querySelectorAll('[data-months]').forEach(b=>b.addEventListener('click',()=>{months=Number(b.dataset.months);render();}));
$('reset').addEventListener('click',()=>{$('clients').value=2;['energy','insurance','phone'].forEach(id=>$(id).checked=true);months=12;render();});
function renderNetwork(){const c=$('network-clients'),s=$('network-spend');if(c.value===''||s.value===''||!c.validity.valid||!s.validity.valid){$('network-result').textContent='Informe valores válidos';return;}const result=IgreenCalculator.network(Number(c.value),Number(s.value));$('network-result').textContent=money(result,2);const small=document.createElement('small');small.textContent='/mês';$('network-result').append(small);}
['network-clients','network-spend'].forEach(id=>$(id).addEventListener('input',renderNetwork));
const screens=[['app.webp','Tela inicial','Abra o iGreen MOB e encontre mapa, carteira e recargas em um só lugar.'],['mapa.webp','Abra o mapa','Encontre os eletropostos no mapa do aplicativo.'],['estacao.webp','Toque em carregar','Selecione a estação para iniciar sua recarga.'],['pagamento.webp','Escolha como pagar','Escolha a forma de pagamento no aplicativo.'],['conectar.webp','Conecte o veículo','Siga as orientações para conectar o veículo.'],['recarga.webp','Acompanhe ao vivo','Acompanhe a recarga diretamente no aplicativo.']];
let step=0;
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{step=Number(b.dataset.step);const s=screens[step];$('app-image').src='assets/'+s[0];$('app-image').alt=s[1]+' no aplicativo iGreen MOB';$('app-description').textContent=s[2];$('step-title').textContent=String(step+1).padStart(2,'0')+' / '+s[1];document.querySelectorAll('[data-step]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
const media=$('media-dialog');
function showImage(src,title){$('media-title').textContent=title;const img=document.createElement('img');img.src=src;img.alt=title;$('media-content').replaceChildren(img);if(!media.open)media.showModal();}
$('enlarge-app').addEventListener('click',()=>showImage('assets/'+screens[step][0],screens[step][1]+' · iGreen MOB'));
$('open-proof').addEventListener('click',()=>{
  $('media-title').textContent='Quem já migrou para iGreen';
  const video=document.createElement('video');video.src='assets/migracao.mp4';video.controls=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label','Vídeo de eletroposto que migrou para iGreen');
  const links=document.createElement('div');links.className='proof-links';
  [['eletroposto.webp','Identidade do eletroposto'],['campanha.webp','Campanha iGreen']].forEach(([file,title])=>{const b=document.createElement('button');b.type='button';b.textContent=title;b.addEventListener('click',()=>showImage('assets/'+file,title));links.append(b);});
  $('media-content').replaceChildren(video,links);media.showModal();
});
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close-dialog').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
media.addEventListener('close',()=>{$('media-content').querySelector('video')?.pause();});
$('contact-button').addEventListener('click',()=>{$('copy-status').textContent='';$('contact-dialog').showModal();});
$('copy-simulation').addEventListener('click',async()=>{const r=IgreenCalculator.calculate(state());const services=[['energy','Energia'],['insurance','Seguros'],['phone','Telefonia']].filter(([id])=>$(id).checked).map(([,name])=>name).join(', ')||'Nenhuma';const text=`Simulação iGreen MOB: ${r.clients} novos clientes/dia; ${services}; ${months} meses; ${integer(r.portfolio)} clientes; receita mensal estimada ${money(r.revenue,2)}; acumulado ${money(r.accumulated,2)}. Projeção bruta, sem cancelamentos ou inadimplência, sem garantia de retorno. Recargas na rede calculadas separadamente.`;try{await navigator.clipboard.writeText(text);$('copy-status').textContent='Simulação copiada. Nenhuma mensagem foi enviada.';}catch{$('copy-status').textContent=text;}});
render();renderNetwork();
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{if(!reducedMotion.matches)$('app-image').animate([{opacity:.25,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});}));
if(!reducedMotion.matches && 'IntersectionObserver' in window){
  const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveals.unobserve(entry.target);}}),{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el=>reveals.observe(el));
  document.documentElement.classList.add('motion-ready');
}
let scrollPending=false;
function paintScroll(){const span=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--progress',span?(Math.min(1,scrollY/span)*100)+'%':'0%');if(!reducedMotion.matches)document.documentElement.style.setProperty('--hero-y',Math.min(scrollY*.12,90)+'px');scrollPending=false;}
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(paintScroll);}},{passive:true});
paintScroll();
if(document.modelContext?.registerTool){
  const lifecycle=new AbortController();
  Promise.resolve(document.modelContext.registerTool({name:'configure_igreen_simulation',title:'Simular carteira iGreen',description:'Configura o simulador visível e retorna a projeção bruta. Não envia dados ou mensagens.',inputSchema:{type:'object',properties:{clients:{type:'integer',minimum:0,maximum:20},months:{type:'integer',enum:[1,12,60,120]},energy:{type:'boolean'},insurance:{type:'boolean'},phone:{type:'boolean'}},required:['clients','months','energy','insurance','phone'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){IgreenCalculator.calculate(input);$('clients').value=input.clients;months=input.months;['energy','insurance','phone'].forEach(k=>$(k).checked=input[k]);return render();}},{signal:lifecycle.signal})).catch(()=>{});
  window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}

