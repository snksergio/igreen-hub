import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/damion/latin-400.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import './style.css';
import './video.css';
import VoyageRoute from './VoyageRoute.jsx';

function HeroFilm({paused}) {
  const video=useRef(null);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const sync=()=>{
      if(!video.current)return;
      if(paused||document.hidden)video.current.pause();
      else video.current.play().catch(()=>{});
    };
    sync();document.addEventListener('visibilitychange',sync);
    return ()=>document.removeEventListener('visibilitychange',sync);
  },[paused]);
  return <div className="hero-image hero-film">{failed?<img src="/images/voyage-video-poster.jpg" alt="Navio em um mar azul sob o sol de meio-dia"/>:<video ref={video} muted loop playsInline preload="metadata" poster="/images/voyage-video-poster.jpg" onError={()=>setFailed(true)} aria-label="Viagem pelo navio: piscina, restaurante, evento e festa"><source src="/videos/voyage-complete-v3.mp4" type="video/mp4"/></video>}</div>;
}

function FilmViewer(){
  const dialog=useRef(null), player=useRef(null), trigger=useRef(null);
  const close=()=>{player.current?.pause();dialog.current?.close();trigger.current?.focus();};
  return <><button className="film-open" ref={trigger} onClick={()=>{dialog.current.showModal();player.current?.play().catch(()=>{});}}>▷ Assistir à viagem completa</button><dialog className="film-dialog" ref={dialog} aria-label="Filme da viagem" onCancel={()=>{player.current?.pause();trigger.current?.focus();}}><button onClick={close} aria-label="Fechar filme">Fechar ✕</button><video ref={player} controls playsInline preload="none" poster="/images/voyage-video-poster.jpg" src="/videos/voyage-complete-v3.mp4"/></dialog></>;
}

const experiences = [
  {id:'pool', label:'Sol & mar', tag:'UM MERGULHO FORA DA ROTINA', title:'SEM PRESSA.\nSEM HORÁRIO.', script:'Só mais um mergulho.', text:'O sol na pele. O azul até onde a vista alcança. E aquela sensação de estar exatamente onde você queria.', image:'/images/voyage-pool.jpg', alt:'Piscina e espreguiçadeiras em um convés ensolarado com vista para o mar', map:'Piscina & solário', number:'01'},
  {id:'cabin', label:'Seu refúgio', tag:'ACORDE COM OUTRO HORIZONTE', title:'BOM DIA,\nVIDA BOA.', script:'A vista é toda sua.', text:'Abra as cortinas, respire o mar e deixe o mundo lá fora esperar um pouquinho. Aqui, descansar também faz parte da conquista.', image:'/images/voyage-cabin.jpg', alt:'Cabine iluminada pelo sol, com cama de linho e varanda de frente para o oceano', map:'Cabines & descanso', number:'02'},
  {id:'dining', label:'À mesa', tag:'NOVOS SABORES. BOAS COMPANHIAS.', title:'UM BRINDE\nA TUDO ISSO.', script:'Saboreie cada instante.', text:'Conversas que se estendem, sabores que surpreendem e o pôr do sol como convidado. Tem momentos que merecem ser celebrados.', image:'/images/voyage-dining.jpg', alt:'Mesa com pratos de frutos do mar e vista para o oceano ao pôr do sol', map:'Gastronomia', number:'03'},
  {id:'night', label:'Celebre', tag:'QUANDO O SOL SE PÕE, A HISTÓRIA CONTINUA', title:'ESSA NOITE\nÉ NOSSA.', script:'Memórias no volume máximo.', text:'Gente que faz parte da sua jornada. Música, sorrisos e muitos motivos para brindar. A melhor lembrança ainda está por vir.', image:'/images/voyage-night-casual.jpg', alt:'Amigos celebrando em uma festa ao ar livre no convés de um cruzeiro', map:'Festas & encontros', number:'04'},
];

function Sun({className=''}) {return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.8"/>{Array.from({length:12},(_,i)=><path key={i} d="M24 3V10" stroke="currentColor" strokeWidth="1.8" transform={`rotate(${i*30} 24 24)`}/>)}</svg>;}
function Arrow({down=false}) {return <span aria-hidden="true">{down?'↓':'↗'}</span>;}

function ShipMap({active,onSelect,paused}) {
  const canvas=useRef(null), scene=useRef(null), markers=useRef([]), activeRef=useRef(active), pausedRef=useRef(paused);
  const [failed,setFailed]=useState(false);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{activeRef.current=active;},[active]);
  useEffect(()=>{pausedRef.current=paused;},[paused]);
  useEffect(()=>{
    let disposed=false;
    const observer=new IntersectionObserver(async ([entry])=>{
      if(!entry.isIntersecting || scene.current) return;
      observer.disconnect();
      try {
        const {createShipMap}=await import('./scene.js');
        if(disposed)return;
        scene.current=createShipMap(canvas.current,markers.current,activeRef,pausedRef,()=>setFailed(true));
        setLoaded(true);
      } catch(error) {console.error('Mapa 3D indisponível',error);setFailed(true);}
    },{rootMargin:'250px'});
    observer.observe(canvas.current);
    return ()=>{disposed=true;observer.disconnect();scene.current?.dispose();};
  },[]);
  return <div className="ship-map">
    <div className="map-stamp"><Sun/><span>ESCOLHA SEU<br/>PRÓXIMO MOMENTO</span></div>
    <canvas ref={canvas} aria-label="Maquete interativa do navio. Arraste para girar; escolha os ambientes pelos botões."/>
    {!loaded&&!failed&&<span className="map-loading">Preparando seu mapa…</span>}
    {!failed&&experiences.map((item,i)=><button key={item.id} ref={el=>markers.current[i]=el} className={`map-pin ${active===i?'selected':''}`} aria-label={`Explorar ${item.map}`} onClick={()=>onSelect(i)} style={{visibility:loaded?'visible':'hidden'}}><span>{item.number}</span><small>{item.map}</small></button>)}
    {failed&&<div className="map-fallback"><Sun/><p>Escolha um ambiente na lista ao lado<br/>para continuar sua viagem.</p></div>}
    <div className="map-tools"><span>{failed?'SUA VIAGEM, DO SEU JEITO':'↔ ARRASTE PARA GIRAR'}</span><button onClick={()=>scene.current?.reset()} disabled={!loaded||failed}>Restaurar vista ↺</button></div>
  </div>;
}

function App(){
  const [active,setActive]=useState(0),[mapActive,setMapActive]=useState(0),[scrolled,setScrolled]=useState(false);
  const [paused,setPaused]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [sound,setSound]=useState(false),[audioError,setAudioError]=useState('');
  const menu=useRef(null),menuTrigger=useRef(null),audio=useRef(null);
  const current=experiences[active],selected=experiences[mapActive];
  useEffect(()=>{
    const onScroll=()=>setScrolled(scrollY>80);onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
    const onVisibility=()=>{if(document.hidden)audio.current?.context.suspend();else if(audio.current?.enabled)audio.current.context.resume().catch(()=>{});};
    document.addEventListener('visibilitychange',onVisibility);
    return ()=>{window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',onVisibility);audio.current?.context.close();};
  },[]);
  function go(id){document.getElementById(id)?.scrollIntoView({behavior:paused?'instant':'smooth'});}
  function visit(i){setActive(i);go('experiencias');}
  function closeMenu(){menu.current.close();menuTrigger.current?.focus();}
  async function toggleSound(){
    try{
      if(!audio.current){
        const context=new AudioContext(),gain=context.createGain(),filter=context.createBiquadFilter();
        const buffer=context.createBuffer(1,context.sampleRate*8,context.sampleRate),data=buffer.getChannelData(0);let last=0;
        for(let i=0;i<data.length;i++){last=(last+(Math.random()*2-1)*.025)/1.025;data[i]=last*3;}
        const source=context.createBufferSource();source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=850;gain.gain.value=0;source.connect(filter).connect(gain).connect(context.destination);source.start();
        audio.current={context,gain,enabled:false};
      }
      const state=audio.current;await state.context.resume();state.enabled=!sound;state.gain.gain.setTargetAtTime(sound?0:.2,state.context.currentTime,.4);setSound(!sound);setAudioError('');
    }catch{setAudioError('Não foi possível ativar o áudio neste navegador.');}
  }
  return <div className={paused?'site motion-paused':'site'}>
    <a className="skip-link" href="#experiencias">Pular para as experiências</a>
    <header className={scrolled?'site-header scrolled':'site-header'}>
      <a href="#inicio" onClick={e=>{e.preventDefault();go('inicio');}} className="brand" aria-label="iGreen Voyage — início"><strong>iGreen<sup>®</sup></strong><span>V O Y A G E</span></a>
      <nav className="desktop-nav" aria-label="Navegação principal"><a href="#experiencias" onClick={e=>{e.preventDefault();go('experiencias');}}>A vida a bordo</a><a href="#navio" onClick={e=>{e.preventDefault();go('navio');}}>Explore o navio</a><a href="#roteiro" onClick={e=>{e.preventDefault();go('roteiro');}}>O roteiro</a></nav>
      <div className="header-right"><button className={`sound-button ${sound?'playing':''}`} onClick={toggleSound} aria-label={sound?'Desativar som do mar':'Ativar som do mar'} aria-pressed={sound}><span className="sound-bars" aria-hidden="true"><i/><i/><i/><i/></span><span>SOM {sound?'ON':'OFF'}</span></button><button className="header-cta" onClick={()=>go('navio')}>Sua próxima conquista <Arrow/></button><button className="menu-trigger" ref={menuTrigger} onClick={()=>menu.current.showModal()} aria-label="Abrir menu"><span/><span/></button></div>
    </header>
    <main>
      <section id="inicio" className="hero" aria-labelledby="hero-title">
        <HeroFilm paused={paused}/>
        <FilmViewer/>
        <div className="hero-scrim"/>
        <div className="hero-copy"><div className="eyebrow light"><span className="mini-star">✳</span> EXISTEM DESTINOS QUE VOCÊ CONQUISTA.</div><h1 id="hero-title">VOCÊ FEZ<br/>POR MERECER<span className="title-dot">.</span></h1><span className="hero-script">Agora, viva.</span><p>Troque a rotina pelo horizonte.<br/>A sua próxima grande história começa a bordo.</p><button className="pill-button yellow" onClick={()=>go('experiencias')}>Sinta essa viagem <Arrow/></button></div>
        <div className="voyage-seal" aria-hidden="true"><Sun/><span>SOL. MAR.<br/>CONQUISTA.</span><small>iGREEN VOYAGE</small></div>
        <div className="hero-bottom"><button className="scroll-cue" onClick={()=>go('experiencias')}><span className="circle-arrow">↓</span><span>O EXTRAORDINÁRIO ESPERA POR VOCÊ<small>Role para sentir um pouco do que vem por aí.</small></span></button><button className="next-scene" onClick={()=>visit(0)}><img src="/images/voyage-pool.jpg" alt=""/><span>PRÓXIMA PARADA<strong>Modo férias: ativado.</strong></span><Arrow/></button></div>
        <button className="pause-button" onClick={()=>setPaused(!paused)} aria-pressed={paused} aria-label={paused?'Retomar vídeo e movimento das imagens':'Pausar vídeo e movimento das imagens'}>{paused?'▷':'Ⅱ'}<span>{paused?'RETOMAR':'PAUSAR'}</span></button>
        {audioError&&<p role="status" className="audio-error">{audioError}</p>}
      </section>
      <div className="ribbon" aria-hidden="true"><span>CONQUISTE.</span><Sun/><span>EMBARQUE.</span><Sun/><span>VIVA.</span><Sun/><span>REPITA.</span><Sun/><span>CONQUISTE.</span><Sun/></div>
      <section className="experience-section" id="experiencias" aria-labelledby="experience-heading">
        <div className="section-intro"><div><span className="eyebrow">A RECOMPENSA TEM OUTRO RITMO</span><h2 id="experience-heading">O MELHOR DA VIDA.<br/><span className="script">A bordo.</span></h2></div><p>Tem conquistas que você guarda.<br/>Outras, você vive.<br/><strong>Essa é para viver de corpo e alma.</strong></p></div>
        <div className="experience-cinema">
          {experiences.map((item,i)=><div key={item.id} className={`cinema-image ${i===active?'active':''}`} aria-hidden={i!==active}><img src={item.image} alt={item.alt} loading="lazy"/></div>)}
          <div className="cinema-scrim"/>
          <div className="experience-tabs" role="tablist" aria-label="Experiências a bordo">{experiences.map((item,i)=><button id={`tab-${item.id}`} role="tab" aria-selected={active===i} aria-controls="experience-panel" tabIndex={active===i?0:-1} key={item.id} className={active===i?'active':''} onClick={()=>setActive(i)} onKeyDown={e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowRight'?1:3))%4;setActive(next);document.getElementById(`tab-${experiences[next].id}`)?.focus();}}}><span>{item.number}</span>{item.label}</button>)}</div>
          <div className="cinema-copy" id="experience-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`} tabIndex="0"><span className="eyebrow light">{current.tag}</span><h3>{current.title.split('\n').map((line,i)=><React.Fragment key={line}>{i>0&&<br/>}{line}</React.Fragment>)}</h3><span className="script">{current.script}</span></div>
          <div className="cinema-caption"><span className="scene-number">{current.number}<small>/ 04</small></span><p>{current.text}</p><button onClick={()=>{setMapActive(active);go('navio');}} aria-label={`Ver ${current.map} no mapa do navio`}><Arrow/></button></div>
        </div>
      </section>
      <section id="navio" className="explore-section" aria-labelledby="map-heading">
        <div className="explore-heading"><div><span className="eyebrow">SEU GUIA PARA DIAS EXTRAORDINÁRIOS</span><h2 id="map-heading">UM NAVIO.<br/><span className="script">Infinitas histórias.</span></h2></div><p>Um mergulho, um brinde ou uma pausa?<br/>Toque em um ponto do navio<br/>e encontre o seu próximo momento.</p></div>
        <div className="explore-layout"><ShipMap active={mapActive} onSelect={setMapActive} paused={paused}/><div className="map-destinations"><span className="eyebrow">ONDE VOCÊ QUER ESTAR?</span><div className="destination-list">{experiences.map((item,i)=><button key={item.id} className={mapActive===i?'active':''} aria-pressed={mapActive===i} onClick={()=>setMapActive(i)}><span>{item.number}</span><strong>{item.map}</strong><Arrow/></button>)}</div><div className="destination-preview"><img src={selected.image} alt={selected.alt} loading="lazy"/><button className="preview-link" onClick={()=>visit(mapActive)}>Viver esse momento <Arrow/></button></div></div></div>
        <p className="concept-note">Uma prévia para imaginar sua próxima conquista. Imagens e mapa conceituais; ambientes e programação sujeitos à definição da viagem.</p>
      </section>
      <section className="closing"><span className="eyebrow">A CONEXÃO LEVA VOCÊ MAIS LONGE</span><h2>A PRÓXIMA LEMBRANÇA<br/><span className="script">pode ser sua.</span></h2><button className="pill-button cream" onClick={()=>go('roteiro')}>Descubra o roteiro <Arrow/></button><Sun/></section>
      <VoyageRoute paused={paused}/>
    </main>
    <footer className="site-footer"><a href="#inicio" className="footer-brand">iGreen <span>VOYAGE</span></a><span>Conquistas que viram histórias.</span><span>FEITO PARA IR ALÉM ↗</span></footer>
    <dialog ref={menu} className="navigation-dialog" aria-labelledby="menu-title" onCancel={()=>menuTrigger.current?.focus()}><div className="dialog-top"><span>iGREEN VOYAGE</span><button onClick={closeMenu} aria-label="Fechar menu">✕</button></div><Sun/><h2 id="menu-title">QUAL É A<br/><span className="script">próxima parada?</span></h2><nav aria-label="Menu da viagem">{[['inicio','O convite'],['experiencias','A vida a bordo'],['navio','Explore o navio'],['roteiro','O roteiro']].map(([id,label],i)=><button key={id} onClick={()=>{closeMenu();go(id);}}><span>0{i+1}</span>{label}<Arrow/></button>)}</nav></dialog>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);


