'use strict';
// The graph follows the same monthly portfolio values as the calculator.
const chartHost=document.getElementById('chart');
const svgNS='http://www.w3.org/2000/svg';
const graph=document.createElementNS(svgNS,'svg');
graph.classList.add('revenue-curve');graph.setAttribute('viewBox','0 0 600 140');graph.setAttribute('preserveAspectRatio','none');graph.setAttribute('aria-hidden','true');
graph.innerHTML='<defs><linearGradient id="curve-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#03ff35" stop-opacity=".21"/><stop offset="100%" stop-color="#03ff35" stop-opacity="0"/></linearGradient></defs><path class="curve-area"/><path class="curve-line"/><circle class="curve-dot" r="5"/>';
chartHost.append(graph);
function updateCurve(){
 const value=IgreenCalculator.calculate(state());
 const low=value.revenue?120-110/months:130;
 const high=value.revenue?10:130;
 const path=months===1?`M 0 ${high} L 600 ${high}`:`M 0 ${low} L 600 ${high}`;
 graph.querySelector('.curve-line').setAttribute('d',path);
 graph.querySelector('.curve-area').setAttribute('d',path+' L 600 140 L 0 140 Z');
 graph.querySelector('.curve-dot').setAttribute('cx','600');graph.querySelector('.curve-dot').setAttribute('cy',String(high));
}
new MutationObserver(updateCurve).observe(document.getElementById('revenue'),{childList:true,subtree:true});updateCurve();
const connectionImages=[
 ['maquete-energia.webp','Energia','A conexão começa em casa.','Maquete de casa com painéis solares, bateria e carro elétrico verde','energia'],
 ['maquete-seguros.webp','Seguros','Proteção para seguir em frente.','Maquete de garagem com carro verde e símbolo de proteção','seguros'],
 ['maquete-telefonia.webp','Telefonia','Sempre perto. Em qualquer caminho.','Maquete de telefonia com edifícios, antena e celular','telefonia'],
 ['maquete-rede.webp','Rede iGreen','Sua conexão vai mais longe.','Maquete de uma rede de eletropostos conectados por trajetos verdes','rede'],
 ['hub-iso.webp','Eletropostos','O seu ponto é onde tudo começa.','Eletroposto com dois carregadores e carro verdes','eletropostos']
];
const photoConnections=[
 ['foto-energia.webp','Energia','A conexão começa em casa.','Imagem conceitual de casa urbana com painéis solares e carro verde','energia'],
 ['foto-seguros.webp','Seguros','Proteção para seguir em frente.','Imagem conceitual de carro verde protegido em uma garagem urbana','seguros'],
 ['foto-telefonia.webp','Telefonia','Sempre perto. Em qualquer caminho.','Imagem conceitual de celular no console de um carro com iluminação verde','telefonia'],
 ['foto-rede.webp','Rede iGreen','Sua conexão vai mais longe.','Imagem conceitual de uma avenida com pontos de recarga verdes','rede'],
 ['foto-eletropostos.webp','Eletropostos','O seu ponto é onde tudo começa.','Imagem conceitual de carregador verde e carro em um eletroposto urbano','eletropostos']
];
function connectGallery(sectionId,images){
 const section=document.getElementById(sectionId);
 if(!section)return;
 const visual=section.querySelector('.connection-visual');
 const visualImage=visual.querySelector('img');
 const preload=()=>images.forEach(([file])=>{const image=new Image();image.src='assets/'+file;});
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){preload();observer.disconnect();}},{rootMargin:'300px'});observer.observe(section);}else preload();
 section.querySelectorAll('.connection-item').forEach((item,index)=>item.addEventListener('toggle',()=>{
  if(!item.open)return;
  const [file,name,caption,alt,key]=images[index];
  visualImage.src='assets/'+file;visualImage.alt=alt;visual.dataset.visual=key;
  visual.querySelector('.visual-title strong').textContent=name;
  visual.querySelector('figcaption>span').textContent=caption;
  visual.querySelector('.visual-title>span').textContent=String(index+1).padStart(2,'0')+' / 05';
  if(!reducedMotion.matches)visualImage.animate([{opacity:.2,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:500,easing:'ease-out'});
 }));
}
connectGallery('conexoes',connectionImages);
connectGallery('conexoes-fotografia',photoConnections);
document.querySelectorAll('[data-adjust]').forEach(button=>button.addEventListener('click',()=>{const input=document.getElementById('clients');input.value=Math.max(0,Math.min(20,Number(input.value)+Number(button.dataset.adjust)));input.dispatchEvent(new Event('input',{bubbles:true}));}));
