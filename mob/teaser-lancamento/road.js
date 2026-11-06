(() => {
  'use strict';
  const canvas=document.querySelector('#road-light');if(!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  let w=0,h=0,frameId=null,last=0,elapsed=0;const motion=window.launchMotion;
  function resize(){const dpr=Math.min(devicePixelRatio,1.5);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);paint();}
  function paint(){ctx.clearRect(0,0,w,h);const horizon=h*.554;const spread=w<760?w*1.02:w*.52;for(const side of [-1,1]){for(let i=0;i<13;i++){const p=((i/13+elapsed*.00007)%1),end=Math.min(1,p+.028);const x1=w*.5+side*spread*p,y1=horizon+(h-horizon)*p*p;const x2=w*.5+side*spread*end,y2=horizon+(h-horizon)*end*end;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=`rgba(171,255,128,${p*.38})`;ctx.lineWidth=.5+p*1.4;ctx.shadowColor='#86ff51';ctx.shadowBlur=p*8;ctx.stroke();}}ctx.shadowBlur=0;}
  function frame(t){frameId=null;if(motion.paused||document.hidden){last=0;return;}if(t-last>=33){elapsed+=last?Math.min(t-last,70):0;last=t;paint();}frameId=requestAnimationFrame(frame);}
  function run(){if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;last=0;if(!motion.paused&&!document.hidden)frameId=requestAnimationFrame(frame);}
  new ResizeObserver(resize).observe(canvas);window.addEventListener('launchmotionchange',run);document.addEventListener('visibilitychange',run);resize();run();
})();
