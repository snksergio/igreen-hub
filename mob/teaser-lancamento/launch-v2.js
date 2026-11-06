(() => {
  'use strict';
  const config=window.LAUNCH_CONFIG, deadline=Date.parse(config.date), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const countdown=document.querySelector('.countdown'),status=document.querySelector('[data-status]');
  const last={};let toastTimer, ended=false;
  const motion={paused:reduced.matches};window.launchMotion=motion;
  function showToast(message){const el=document.querySelector('.toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4500);}
  function tick(){
    const diff=deadline-Date.now(),total=Math.max(0,Math.ceil(diff/1000));
    const values={days:Math.floor(total/86400),hours:Math.floor(total%86400/3600),minutes:Math.floor(total%3600/60),seconds:total%60};
    for(const [unit,value] of Object.entries(values)){const text=String(value).padStart(2,'0'),el=document.querySelector(`[data-unit="${unit}"]`);if(last[unit]!==text){el.textContent=text;el.classList.remove('changed');if(!motion.paused){void el.offsetWidth;el.classList.add('changed');}last[unit]=text;}}
    if(diff>0)countdown.setAttribute('aria-label',`${values.days} dias, ${values.hours} horas, ${values.minutes} minutos e ${values.seconds} segundos para o lançamento.`);
    if(diff<=0&&!ended){ended=true;document.body.classList.add('is-live');status.textContent='CHEGOU A HORA DE UMA NOVA CONEXÃO';countdown.setAttribute('aria-label','Contagem concluída. Chegou a data de lançamento.');const title=document.querySelector('h1');title.innerHTML=document.body.classList.contains('cockpit')?'O futuro<br><span>começa agora.</span>':'É hora de<br>uma nova <em>conexão.</em>';if(config.destination){const a=document.createElement('a');a.className='calendar-button launch-destination';a.textContent='Conhecer o site ↗';a.href=config.destination;document.querySelector('.bottom-actions').append(a);}}
  }
  tick();setInterval(tick,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
  const motionButton=document.querySelector('.motion-button');
  function applyMotion(){document.body.classList.toggle('motion-paused',motion.paused);motionButton.setAttribute('aria-pressed',String(motion.paused));motionButton.setAttribute('aria-label',motion.paused?'Retomar animações':'Pausar animações');window.dispatchEvent(new CustomEvent('launchmotionchange'));}
  motionButton.addEventListener('click',()=>{motion.paused=!motion.paused;applyMotion();});reduced.addEventListener('change',e=>{motion.paused=e.matches;applyMotion();});applyMotion();
  document.querySelector('.calendar-button').addEventListener('click',()=>{
    const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const content=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//iGreen MOB//Lancamento//PT-BR','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT','UID:igreen-mob-20261101@launch.local','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(new Date(deadline)),'SUMMARY:Lançamento do site iGreen MOB','DESCRIPTION:Estreia do site iGreen MOB. 1 de novembro de 2026 às 20h no horário de Brasília.','STATUS:CONFIRMED','TRANSP:TRANSPARENT','END:VEVENT','END:VCALENDAR'].join('\r\n')+'\r\n';
    const url=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='igreen-mob-lancamento.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);showToast('Data salva. Abra o arquivo para adicionar ao seu calendário.');
  });
  const ticks=document.querySelector('#gauge-ticks');
  if(ticks){for(let i=0;i<=64;i++){const a=Math.PI+i/64*Math.PI,major=i%8===0;const line=document.createElementNS('http://www.w3.org/2000/svg','line');const len=major?14:6;line.setAttribute('x1',500+440*Math.cos(a));line.setAttribute('y1',310+260*Math.sin(a));line.setAttribute('x2',500+(440-len)*Math.cos(a));line.setAttribute('y2',310+(260-len)*Math.sin(a));line.setAttribute('stroke','#9cd58e');line.setAttribute('stroke-opacity',major?'.4':'.16');line.setAttribute('stroke-width',major?'1':'.7');ticks.append(line);}}
  const scenes=[...document.querySelectorAll('[data-scene]')],selectors=[...document.querySelectorAll('[data-select-scene]')];
  if(scenes.length){let selected=0,elapsed=0,lastTime=0,raf=null;const duration=13000;
    const setScene=i=>{selected=i;elapsed=0;scenes.forEach((el,index)=>el.classList.toggle('active',index===i));selectors.forEach((el,index)=>{el.setAttribute('aria-pressed',String(index===i));el.querySelector('em').style.transform='scaleX(0)';});document.querySelector('.caption-index').textContent=i?'02 / 02':'01 / 02';document.querySelector('.caption-title').textContent=i?'A conexão.':'O movimento.';};
    function frame(t){raf=null;if(motion.paused||document.hidden){lastTime=0;return;}if(lastTime)elapsed+=Math.min(t-lastTime,100);lastTime=t;if(elapsed>=duration)setScene((selected+1)%2);selectors[selected].querySelector('em').style.transform=`scaleX(${elapsed/duration})`;raf=requestAnimationFrame(frame);}
    const run=()=>{if(raf!==null)cancelAnimationFrame(raf);raf=null;lastTime=0;if(!motion.paused&&!document.hidden)raf=requestAnimationFrame(frame);};
    selectors.forEach(b=>b.addEventListener('click',()=>{setScene(+b.dataset.selectScene);run();}));window.addEventListener('launchmotionchange',run);document.addEventListener('visibilitychange',run);run();
  }
})();
