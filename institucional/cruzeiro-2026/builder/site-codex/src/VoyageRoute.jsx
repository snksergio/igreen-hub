import React, {useEffect, useRef, useState} from 'react';
import './voyage-route.css';

const stops = [
  {day:'01', date:'29 NOV', title:'Santos', subtitle:'O horizonte chama.', text:'As malas estão prontas. A rotina fica em terra e uma nova história começa no porto.', note:'Embarque · Porto de Santos', progress:0, stamp:'PARTIDA'},
  {day:'02', date:'30 NOV', title:'Búzios', subtitle:'Um encontro com o azul.', text:'Praias, ruas cheias de charme e aquele tempo bom de descobrir um lugar sem pressa.', note:'Escala · Armação dos Búzios', progress:.47, stamp:'TERRA À VISTA'},
  {day:'03', date:'01 DEZ', title:'Em alto-mar', subtitle:'Hoje, o destino é a bordo.', text:'Um mergulho, um brinde, mais uma música. Entre o céu e o mar, o dia é todo seu.', note:'Navegação · Oceano Atlântico', progress:.74, stamp:'MODO FÉRIAS'},
  {day:'04', date:'02 DEZ', title:'Santos', subtitle:'Na bagagem, histórias.', text:'De volta ao porto de partida. Com novos encontros, boas lembranças e vontade de viver tudo outra vez.', note:'Desembarque · Porto de Santos', progress:1, stamp:'ATÉ A PRÓXIMA'},
];
const photos = [
 {src:'/images/route-santos.jpg',caption:'Santos, onde tudo começa.',alt:'Vista panorâmica da baía e da orla de Santos',credit:'Diego Torres Silvestre',source:'https://commons.wikimedia.org/wiki/File:Panoramica_Santos.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/'},
 {src:'/images/route-buzios.jpg',caption:'Um postal de Búzios.',alt:'Orla Bardot e barcos na Praia da Armação, em Búzios',credit:'Fulviusbsas',source:'https://commons.wikimedia.org/wiki/File:Buzios-OrlaBardot1.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/'},
 {src:'/images/voyage-pool.jpg',caption:'Dias leves, em alto-mar.',alt:'Imagem conceitual de piscina e convés de cruzeiro',credit:'Ilustração gerada para iGreen Voyage'},
];
function coordinateLabel(x,y){
 const latitude=23.96+(y-410)*.00657,longitude=46.30-(x-220)*.00698;
 const format=(v)=>{const minutes=Math.round(v*60);return Math.floor(minutes/60)+'°'+String(minutes%60).padStart(2,'0')+'′';};
 return format(latitude)+' S · '+format(longitude)+' W';
}
function MarineLife(){return <g className="marine-engraving" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
 <g className="engraved-dolphin" transform="translate(-66 0)"><path fill="#e9d6a6" d="M-49 16C-36-14-12-31 14-21L26-31 26-15Q40-6 52-5L55 0 39 3Q21 3 7 9L-2 28-9 11Q-27 13-40 24L-50 38-53 24-65 21Z"/><path d="M-41 17Q-10-6 39 0M-31 9l4 6m3-12 4 8m4-14 3 10m5-14 2 11m6-13 1 10M-45 25l-4 8"/><circle cx="34" cy="-4" r="1.8" fill="currentColor"/></g>
 <g className="engraved-whale" transform="translate(70 21)"><path fill="#e9d6a6" d="M-59-3C-60-27-23-32 4-18Q24-10 39-15L47-29Q53-34 65-30L56-19 70-17Q62-6 45-5C29 22-10 31-42 16Q-58 10-59-3Z"/><path d="M-57 2Q-37 10-17 1M-49 10Q-35 18-14 11M-39 16Q-22 24-4 16M-13 1Q2 5 9 20Q-5 16-13 1M16-13l7-7 1 13M-31-27v-13m0 0q-9-20-18-12m18 12q7-20 18-15"/><circle cx="-42" cy="-6" r="1.8" fill="currentColor"/>{Array.from({length:7},(_,i)=><path key={i} d={'M'+(-26+i*7)+' -17l-4 7'}/>)}</g>
 <path d="M-137 42q14-7 28 0t28 0m27 17q14-7 28 0t28 0m30-5q14-7 28 0t28 0M-96 50h37m91 13h49" opacity=".6"/>
 <text y="94" textAnchor="middle" stroke="none">Encontros em alto-mar</text>
 </g>}
function ArrivalVignette({stage,position}){return <g className="arrival-vignette" aria-hidden="true">
 {stage===2?<g transform={`translate(${position.x} ${position.y-65}) scale(.52)`}><MarineLife/></g>:stage===1?<g transform="translate(805 323)" className="beach-arrival"><g className="arrival-sailboat"><path d="M-30 9H32L20 20H-20ZM0 7V-40M-4-35L-27 3H-4ZM5-27L25 3H5Z"/><path d="M-41 27q10-5 20 0t20 0 20 0 20 0"/></g><path className="arrival-birds" d="M-52-30q7-8 14 0q7-8 14 0M31-40q6-7 12 0q6-7 12 0"/><text y="57">Terra à vista!</text></g>:stage===0?<g transform="translate(335 536)" className="departure-arrival"><path className="arrival-wash" d="M-110-76Q-126-15-108 33Q0 52 110 29Q130-31 107-78Z"/><path d="M-86-63Q0-23 86-63"/>{[-68,-42,-15,15,42,68].map((x,i)=><path key={i} className="arrival-pennant" d={`M${x-7} ${-46-Math.abs(x)*.17}h14l-7 17Z`}/>)}<Landmark type="ship" transform="translate(0 -4) scale(.75)"/><text y="50">Bon voyage!</text></g>:<g transform="translate(345 532)" className="return-arrival"><path className="arrival-wash" d="M-122-65Q-131-13-114 40Q0 57 116 36Q128-19 108-67Z"/><g className="return-anchor"><circle cx="0" cy="-43" r="7"/><path d="M0-35V19M-16-22H16M-37-8Q-35 19 0 25Q35 19 37-8M-37-8l-6 12m6-12 11 5M37-8l6 12m-6-12-11 5"/></g><path d="M-76 19q13-6 26 0m100 0q13-6 26 0"/><text y="57">De volta, com histórias.</text></g>}
 </g>}
const route = 'M220 410 C260 454 351 442 403 387 S514 310 616 286 S773 283 823 242 C853 217 856 218 863 242 C913 334 809 440 687 482 C518 553 285 515 220 410';
const coast = 'M0 0H1000V80L956 104 923 131 899 151 882 174 890 192 872 207 865 226 849 223 839 210 822 218 803 218 788 207 762 218 727 214 700 224 678 214 667 228 639 226 612 235 586 243 563 237 554 213 528 220 509 218 489 240 465 256 457 278 439 291 423 297 407 316 388 323 369 340 365 355 346 363 329 378 311 378 292 391 268 384 250 390 237 400 220 400 209 418 193 425 179 440 163 441 147 459 124 475 110 494 83 511 59 541 30 562 0 583Z';

function Landmark({type, ...props}) {
  return <g {...props} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {type==='port' ? <><path d="M-45 20H47M-38 20V-5H30V20M-44-5L-4-29 36-5M-6-29V-39H6M-22 20V6H-12V20M1 20V4H13V20M25-5V-26H34V20M-48 29q10-7 20 0t20 0 20 0 20 0"/><path d="M-28-7V-24M-34-19h12M40 20V-35M34-35h12M40-35l8-9"/></> : type==='beach' ? <><path d="M-48 25Q-9 7 45 24M-7 14Q-4-10-12-31M-12-31Q-42-42-45-17Q-30-29-12-31M-12-31Q2-57 23-35Q5-40-12-31M-12-31Q19-30 25-7Q10-22-12-31M-12-31Q-24-53-38-42M10 20L34-9 46 20M35-9V-16M-49 34q12-7 24 0t24 0 24 0 24 0"/><circle cx="39" cy="-34" r="9"/></> : <><path d="M-45 8H43L29 28H-27ZM-29 8V-6H28V8M-17-6V-18H13V-6M-3-18V-28H7V-18M-49 36q12-7 24 0t24 0 24 0 24 0"/><path d="M-21 0h4m8 0h4m8 0h4m8 0h4M-14 16h36"/><circle cx="33" cy="-29" r="10"/></>}
  </g>;
}

function Compass(){
  return <g transform="translate(853 493)" className="chart-compass" aria-hidden="true">
    <circle r="64"/><circle r="58"/><circle r="39"/>
    {Array.from({length:16},(_,i)=><g key={i} transform={`rotate(${i*22.5})`}><path d={`M0 ${i%4===0?-79:-52}L8 -9 0 0Z`} fill={i%2?'#8d7850':'#244b42'}/><path d={`M0 ${i%4===0?-79:-52}L-8 -9 0 0Z`} fill="#efdfb4"/><path d="M0-57V-64"/></g>)}
    <circle r="7" fill="#b6914f"/>
    <text y="-92">N</text><text y="110">S</text><text x="99" y="7">E</text><text x="-99" y="7">W</text>
    <path d="M-5-117L0-130 5-117 0-121Z" fill="#244b42"/>
  </g>;
}

export default function VoyageRoute({paused=false}){
  const section=useRef(null),path=useRef(null),boat=useRef(null),ink=useRef(null),frame=useRef(0);
  const [active,setActive]=useState(0);
  const [arrived,setArrived]=useState(false);
  const previousStage=useRef(-1);
  const [scenePosition,setScenePosition]=useState({x:650,y:480});
  const coordinates=useRef(null),photoDialog=useRef(null),photoTrigger=useRef(null);
  const [openedPhoto,setOpenedPhoto]=useState(null);
  useEffect(()=>{if(!openedPhoto)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';photoDialog.current.showModal();return()=>{document.body.style.overflow=previous;};},[openedPhoto]);
  function closePhoto(){photoDialog.current.close();setOpenedPhoto(null);photoTrigger.current?.focus();}
  const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const still=paused||reduced;
  useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(query.matches);query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
  useEffect(()=>{
    if(still) return;
    const draw=()=>{
      frame.current=0;
      if(!section.current||!path.current)return;
      const box=section.current.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,-box.top/Math.max(1,box.height-innerHeight)));
      const length=path.current.getTotalLength(),distance=length*progress;
      const point=path.current.getPointAtLength(distance),before=path.current.getPointAtLength(Math.max(0,distance-2)),after=path.current.getPointAtLength(Math.min(length,distance+2));
      const angle=Math.atan2(after.y-before.y,after.x-before.x)*180/Math.PI;
      boat.current?.setAttribute('transform',`translate(${point.x} ${point.y}) rotate(${angle})`);
      setArrived(box.top<innerHeight*.3&&box.bottom>innerHeight*.5);
      if(coordinates.current)coordinates.current.textContent=coordinateLabel(point.x,point.y);
      ink.current.style.strokeDashoffset=1-progress;
      section.current.style.setProperty('--route-progress',progress);
      const stage=progress<.40?0:progress<.70?1:progress<.94?2:3;
      if(previousStage.current!==stage){previousStage.current=stage;setScenePosition({x:point.x,y:point.y});setActive(stage);}
    };
    const schedule=()=>{if(!frame.current)frame.current=requestAnimationFrame(draw);};
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);draw();
    return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(frame.current);frame.current=0;};
  },[still]);
  function visit(index){
    if(still){setActive(index);const p=path.current.getPointAtLength(path.current.getTotalLength()*stops[index].progress);if(coordinates.current)coordinates.current.textContent=coordinateLabel(p.x,p.y);setArrived(true);return;}
    const el=section.current;
    window.scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-innerHeight)*stops[index].progress,behavior:'smooth'});
  }
  const current=stops[active],photo=photos[active===3?0:active];
  return <section id="roteiro" className={`voyage-route ${still?'route-still':''}`} ref={section} aria-labelledby="route-title" data-stop={active}>
    <div className="route-sticky">
      <header className="route-heading"><div><span className="eyebrow">UM PEQUENO ATLAS DE GRANDES MOMENTOS</span><h2 id="route-title">O MAR NOS LEVA.<span className="script">A memória fica.</span></h2></div><p>Quatro dias. Um horizonte inteiro.<br/><span>Role para desenhar sua próxima história.</span></p></header>
      <div className="route-paper"><span className="atlas-tape atlas-tape-top" aria-hidden="true"/><span className="atlas-tape atlas-tape-bottom" aria-hidden="true"/><span className="atlas-folds" aria-hidden="true"/>
        <aside className="route-journal" aria-label="Diário de bordo">
          <div className="journal-label"><span>DIÁRIO DE BORDO</span><span>✳</span></div>
          <div className="journal-entry" key={active}><div className="journal-day">DIA {current.day}<span>{current.date}</span></div><h3>{current.title}</h3><p className="journal-script">{current.subtitle}</p><button className="journal-postcard" ref={photoTrigger} onClick={()=>setOpenedPhoto(photo)} aria-label={'Ampliar foto: '+current.title}><span className="postcard-tape" aria-hidden="true"/><img src={photo.src} alt={photo.alt} loading="lazy"/><span className="postcard-caption">{photo.caption}</span><span className="postcard-zoom" aria-hidden="true">↗</span></button><p className="journal-text">{current.text}</p><span className="journal-note">{current.note}</span><span className="journal-stamp">{current.stamp}</span></div>
          <nav className="route-steps" aria-label="Etapas do roteiro">{stops.map((stop,i)=><button key={i} type="button" onClick={()=>visit(i)} aria-label={`Dia ${stop.day}: ${stop.title}`} aria-current={active===i?'step':undefined}><span>{stop.day}</span><small>{i===2?'No mar':stop.title}</small></button>)}</nav>
        </aside>
        <div className="route-chart">
          <div className="chart-heading"><span>COSTA DO BRASIL</span><span>CARTA DE VIAGEM · Nº 001</span></div>
          <svg className="nautical-chart" viewBox="0 0 1000 650" role="img" aria-labelledby="chart-title chart-desc">
            <title id="chart-title">Carta ilustrada da viagem de Santos a Búzios</title><desc id="chart-desc">A rota parte de Santos, segue pela costa até Búzios e retorna pelo Oceano Atlântico, com um dia de navegação. Rosa dos ventos à direita. Ilustração sem finalidade de navegação.</desc>
            <defs><pattern id="chart-grid" width="125" height="125" patternUnits="userSpaceOnUse"><path d="M125 0H0V125" fill="none" stroke="#8b7755" strokeWidth=".65" opacity=".2"/></pattern><pattern id="chart-hatch" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7L7 0" stroke="#718568" strokeWidth=".6" opacity=".23"/></pattern><linearGradient id="chart-land" x2=".8" y2="1"><stop stopColor="#a6ad83" stopOpacity=".45"/><stop offset="1" stopColor="#c7bb8f" stopOpacity=".3"/></linearGradient><filter id="boat-shadow"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#6b5335" floodOpacity=".22"/></filter></defs>
            <rect width="1000" height="650" fill="url(#chart-grid)"/>
            <g stroke="#826e4e" strokeWidth=".85" opacity=".32">{Array.from({length:12},(_,i)=><path key={i} d={`M853 493l${Math.cos(i*Math.PI/6)*1400} ${Math.sin(i*Math.PI/6)*1400}`}/>)}</g>
            <path d={coast} fill="none" stroke="#927044" strokeWidth="22" opacity=".14"/><path d={coast} transform="translate(3 7)" fill="none" stroke="#927044" strokeWidth=".8" opacity=".5"/><path d={coast} transform="translate(5 14)" fill="none" stroke="#927044" strokeWidth=".6" opacity=".35"/><path d={coast} fill="url(#chart-land)" stroke="#6f7756" strokeWidth="1.8"/><path d={coast} fill="url(#chart-hatch)" opacity=".17"/>
            <path d="M365 369q-13 12 3 28l13-10-3-16ZM536 250l28-6 12 8-11 11-20-2Z" fill="#b4b28a" stroke="#6f7756"/>
            <g className="chart-mountains" stroke="#655032" fill="none" opacity=".8">{[ [120,310],[158,287],[188,310],[260,278],[293,254],[320,267],[380,215],[410,194],[444,190],[510,156],[548,150],[582,159],[635,126],[670,139],[710,118] ].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path d="M-24 16Q-14 5-8-3L0-19 7-8Q10 2 24 15M0-19L-3-2 4-5 7 4 16 15M-16 10l8-6m-5 11 9-7m-5 10 10-8m1-8 8 6m-6-1 10 9M-31 19q12-4 22-1m18 1q12-3 23 0"/></g>)}</g>
            <g className="chart-geography"><text x="260" y="153" className="chart-state" transform="rotate(-15 260 153)">S Ã O  P A U L O</text><text x="610" y="93" className="chart-state">R I O  D E  J A N E I R O</text><text x="358" y="425">Ilhabela</text><text x="445" y="282">Paraty</text><text x="639" y="257">Rio de Janeiro</text><text x="778" y="196">Cabo Frio</text><path d="M388 398l-15-11M474 276l-9-8M688 246l-9-17"/></g>
            <g transform="translate(91 179)" className="chart-cartouche"><path d="M-53-51Q0-70 53-51L61 32Q0 52-61 32Z"/><text y="-20">TERRA DE</text><text y="5" className="cartouche-large">bons ventos</text><path d="M-32 20H32M-8-39H8"/></g>
            <g className="chart-ocean"><text x="518" y="582">OCEANO ATLÂNTICO</text><text x="510" y="608">Entre um destino e outro, viva o caminho.</text></g>
            <g stroke="#867759" opacity=".4" fill="none">{[[453,470],[578,385],[715,345],[275,533],[917,363]].map(([x,y])=><path key={x} transform={`translate(${x} ${y})`} d="M-14 0q7-6 14 0t14 0M-7 8q7-6 14 0t14 0"/>)}</g>
            <g className="engraving-details" fill="none" stroke="#745431" strokeWidth="1" opacity=".62">{[[168,233],[235,222],[326,200],[472,145],[550,107],[714,169],[765,124]].map(([x,y])=><g key={x} transform={`translate(${x} ${y})`}><path d="M0 16V-8m-8 9 8-13 8 13-6-2 9 12H-11l9-12M-12 19q12-4 24 0M22 15V3m-5 6 5-10 5 10M17 18h10"/></g>)}{[[375,500],[516,536],[623,332],[751,310],[910,303],[484,401]].map(([x,y])=><path key={x} transform={`translate(${x} ${y})`} d="M-18 0q9-7 18 0t18 0M-11 7q8-5 16 0t16 0M-2 14h16"/>)}</g><Compass/>
            <path ref={path} d={route} className="chart-route-guide"/>
            <path ref={ink} d={route} className="chart-route-ink" pathLength="1" style={{strokeDasharray:1,strokeDashoffset:still?0:1}}/>
            <g className={`chart-port ${active===0||active===3?'is-arrived':''}`} transform="translate(220 410)"><circle className="arrival-ring" r="22"/><circle r="7"/><text x="-20" y="-23" className="chart-port-name">Santos</text><text x="-20" y="-6" className="chart-port-small">PARTIDA & RETORNO</text><Landmark type="port" transform="translate(-30 -73) scale(.65)"/></g>
            <g className={`chart-port ${active===1?'is-arrived':''}`} transform="translate(853 226)"><circle className="arrival-ring" r="23"/><circle r="7"/><text x="25" y="-4" className="chart-port-name">Búzios</text><text x="25" y="14" className="chart-port-small">PÉS NA AREIA</text><Landmark type="beach" transform="translate(-12 -56) scale(.7)"/></g>
            <g key={active+'-'+arrived} className={arrived?'arrival-scene scene-play':'arrival-scene'}><ArrivalVignette stage={active} position={scenePosition}/></g>
            <g ref={boat} transform="translate(220 410) rotate(30)" className="chart-boat" style={{display:still?'none':undefined}} aria-hidden="true"><path d="M-24-5L-43-11M-26 0H-49M-24 5L-43 11" stroke="#f8f0d7" strokeWidth="3"/><path d="M-22-8H9Q21-7 28 0Q21 7 9 8H-22Z" fill="#fdf5db" stroke="#244d43" strokeWidth="2"/><rect x="-13" y="-5" width="24" height="10" rx="3" fill="#c5ae77"/><path d="M-7-3H8V3H-7Z" fill="#244d43"/><path d="M-18-7V7M15-4V4" stroke="#244d43"/></g>
            <g className="chart-scale" transform="translate(48 605)"><path d="M0 0V7H120V0M60 7V1"/><text x="60" y="25">UMA VIAGEM PARA GUARDAR</text></g>
          </svg>
          <div className="chart-coordinates"><span>✧ POSIÇÃO NA CARTA <small>ILUSTRATIVA</small></span><strong ref={coordinates}>23°58′ S · 46°18′ W</strong></div><div className="chart-bottom"><span>✦ SANTOS — BÚZIOS — ALTO-MAR</span><span className="chart-scroll">{still?'Escolha uma etapa no diário':'↓ Continue rolando para navegar'}</span></div>
        </div>
      </div>
      <div className="route-footnote"><span>Roteiro ilustrativo, conforme a referência da viagem. Escalas, datas e horários sujeitos à confirmação.</span><a href="#inicio">De volta ao horizonte ↑</a></div>
    </div>
    <dialog ref={photoDialog} className="postcard-dialog" aria-labelledby="postcard-title" onCancel={e=>{e.preventDefault();closePhoto();}} onClick={e=>{if(e.target===e.currentTarget)closePhoto();}}>
      {openedPhoto&&<><button className="postcard-close" onClick={closePhoto} aria-label="Fechar fotografia">Fechar ✕</button><img src={openedPhoto.src} alt={openedPhoto.alt}/><div className="postcard-dialog-caption"><span>LEMBRANÇAS DA COSTA</span><h3 id="postcard-title">{openedPhoto.caption}</h3><p>{openedPhoto.source?<><a href={openedPhoto.source} target="_blank" rel="noreferrer">Foto: {openedPhoto.credit}</a> · <a href={openedPhoto.licenseUrl} target="_blank" rel="noreferrer">{openedPhoto.license}</a><small>No diário: recorte e tratamento sépia. Fotografia ampliada em cores.</small></>:openedPhoto.credit}</p></div></>}
    </dialog>
  </section>;
}
