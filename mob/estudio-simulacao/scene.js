(function(){
'use strict';
const host=document.querySelector('#scene'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let pending=null, view=null;
window.updateScene=(state,step)=>{pending={state:{...state},step};if(view)view.update(pending);};
const T=window.THREE;
async function init(){
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.06;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  host.replaceChildren(renderer.domElement);
  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(33,1,.1,100);
  const kit=await IGKit.build(T,{logoSvg:window.IG_LOGO_SVG,font:'Arial, sans-serif'});
  scene.environment=IGKit.studioEnv(T,renderer);
  scene.add(new T.HemisphereLight(0xdcebd7,0x222629,1.25));
  const key=new T.DirectionalLight(0xf4f6ff,2.6);key.position.set(-4,9,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-10;key.shadow.camera.right=10;key.shadow.camera.top=10;key.shadow.camera.bottom=-10;key.shadow.bias=-.001;key.shadow.normalBias=.035;scene.add(key);
  const rim=new T.DirectionalLight(0xb6e89e,1.1);rim.position.set(5,4,-4);scene.add(rim);
  const fill=new T.DirectionalLight(0x9cbaed,1.2);fill.position.set(-7,3,-2);scene.add(fill);
  const root=new T.Group();scene.add(root);
  const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.6,...extra});
  const graphite=mat(0x151919), pale=mat(0x9faa9f), dark=mat(0x101613), lime=mat(0x8bdc41,{emissive:0x284c0c,emissiveIntensity:.6}), rubber=mat(0x070b09), glass=mat(0x142c2b,{metalness:.7,roughness:.19});
  function rounded(w,h,d,r,material){const sh=new T.Shape();const x=-w/2,y=-h/2;sh.moveTo(x+r,y);sh.lineTo(x+w-r,y);sh.quadraticCurveTo(x+w,y,x+w,y+r);sh.lineTo(x+w,y+h-r);sh.quadraticCurveTo(x+w,y+h,x+w-r,y+h);sh.lineTo(x+r,y+h);sh.quadraticCurveTo(x,y+h,x,y+h-r);sh.lineTo(x,y+r);sh.quadraticCurveTo(x,y,x+r,y);const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:2,steps:1,curveSegments:5});g.translate(0,0,-d/2);const m=new T.Mesh(g,material);m.castShadow=true;m.receiveShadow=true;return m;}
  function box(w,h,d,material,parent,x,y,z){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function label(text,width,height,color='#d2e1c5',bg=null){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,1024,256);}ctx.fillStyle=color;ctx.font='500 110px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,134);const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:tx,transparent:true,side:T.DoubleSide,depthWrite:false}));return m;}
  const deck=rounded(8,5.8,.23,.19,graphite);deck.rotation.x=-Math.PI/2;deck.position.y=-.14;root.add(deck);
  const under=rounded(8.02,5.82,.07,.18,lime);under.rotation.x=-Math.PI/2;under.position.y=-.265;root.add(under);
  const rear=box(8,.18,.75,mat(0x252e2a),root,0,.01,-2.4);
  const edge=box(8,.028,.028,lime,root,0,.13,-2.79);
  const floorLabel=label('iGreen   /   MOB',2.2,.55,'#99ae83');floorLabel.rotation.x=-Math.PI/2;floorLabel.position.set(0,.006,2.52);root.add(floorLabel);
  const post=new T.Group();root.add(post);box(.48,2.55,.24,dark,post,0,1.28,0);box(.04,2.4,.035,lime,post,-.25,1.28,.15);const postLabel=label('MOB',.4,.14,'#c2ff90');postLabel.position.set(0,2.24,.125);post.add(postLabel);const vertical=label('iGreen',.49,.15,'#eef9e8');vertical.position.set(0,1.94,.125);post.add(vertical);const lightning=label('ϟ',.25,.24,'#acfa55');lightning.position.set(0,1.43,.126);post.add(lightning);
  const bays=[],chargers=[],cars=[];
  function makeCar(){const g=new T.Group();const paint=new T.MeshPhysicalMaterial({color:0x3a743a,metalness:.45,roughness:.23,clearcoat:1});const body=rounded(1.28,.43,2.45,.16,paint);body.position.y=.48;g.add(body);const profile=new T.Shape();profile.moveTo(-.85,0);profile.lineTo(-.45,.39);profile.quadraticCurveTo(-.4,.43,-.32,.43);profile.lineTo(.34,.43);profile.quadraticCurveTo(.41,.43,.45,.37);profile.lineTo(.82,0);profile.closePath();const cabinG=new T.ExtrudeGeometry(profile,{depth:1.02,bevelEnabled:true,bevelThickness:.03,bevelSize:.03,bevelSegments:3,steps:1});cabinG.translate(0,0,-.51);const cabin=new T.Mesh(cabinG,glass);cabin.rotation.y=Math.PI/2;cabin.position.set(0,.69,-.1);g.add(cabin);const roof=rounded(.98,.025,.7,.04,paint);roof.position.set(0,1.14,-.1);g.add(roof);for(const x of [-.66,.66])for(const z of [-.77,.76]){const wheel=new T.Mesh(new T.CylinderGeometry(.235,.235,.17,24),rubber);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.28,z);g.add(wheel);const hub=new T.Mesh(new T.CylinderGeometry(.12,.12,.18,12),pale);hub.rotation.z=Math.PI/2;hub.position.copy(wheel.position);g.add(hub);}const light=new T.MeshBasicMaterial({color:0xd9ffed});box(.98,.032,.015,light,g,0,.58,1.25);box(.98,.026,.015,new T.MeshBasicMaterial({color:0xb32b24}),g,0,.56,-1.25);box(.7,.09,.015,dark,g,0,.37,1.255);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;}
  for(let i=0;i<3;i++){
    const unit=new T.Group();root.add(unit);const charger=kit.charger.clone(true);charger.position.set(0,0,-1.85);charger.traverse(o=>{if(o.isMesh)o.castShadow=true;});unit.add(charger);chargers.push(charger);
    const bay=box(2,.012,3.7,mat(0x223426),unit,0,-.005,.26);
    for(const x of [-1.01,1.01])box(.026,.016,3.7,pale,unit,x,.01,.26);
    box(2.04,.016,.03,pale,unit,0,.01,2.1);
    const num=label('0'+(i+1),.43,.14,'#d0dfa8');num.rotation.x=-Math.PI/2;num.position.set(.72,.026,1.77);unit.add(num);
    const symbol=label('ϟ',.48,.6,'#95c763');symbol.rotation.x=-Math.PI/2;symbol.position.set(0,.019,.4);unit.add(symbol);
    for(const x of [-.66,.66]){box(.07,.48,.07,dark,unit,x,.24,-1.58);box(.075,.11,.075,lime,unit,x,.4,-1.58);}
    const car=makeCar();car.position.set(0,.01,.62);unit.add(car);cars.push(car);bays.push(unit);
  }
  const planters=[];for(let i=0;i<2;i++){const g=new T.Group();const pot=rounded(.65,.34,.65,.06,dark);pot.position.y=.17;g.add(pot);for(let j=0;j<6;j++){const leaf=new T.Mesh(new T.ConeGeometry(.16,.55,6),mat(0x425b32));leaf.position.set(Math.sin(j*2.4)*.19,.59,Math.cos(j*2.4)*.19);g.add(leaf);}root.add(g);planters.push(g);}
  const state={units:1,step:0,model:'duo',cars:7}, targets=[0,0,0];let angle=-.46,targetAngle=-.46,frames=0,frame=null,distance=14,targetDistance=14;
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();draw(1);}
  function draw(n=45){frames=Math.max(frames,reduced?1:n);if(frame===null)frame=requestAnimationFrame(tick);}
  function tick(){frame=null;const f=reduced?1:.13;angle+=(targetAngle-angle)*f;distance+=(targetDistance-distance)*f;camera.position.set(Math.sin(angle)*distance,distance*.7,Math.cos(angle)*distance);camera.lookAt(0,.28,0);for(let i=0;i<3;i++){bays[i].position.x+=(targets[i]-bays[i].position.x)*f;const target=i<state.units?1:0;bays[i].scale.y+=(target-bays[i].scale.y)*f;bays[i].visible=bays[i].scale.y>.01;cars[i].scale.setScalar(state.step>=1&&state.cars>i?1:0);}renderer.render(scene,camera);if(--frames>0)frame=requestAnimationFrame(tick);}
  view={update({state:s,step}){state.units=s.units;state.step=step;state.model=s.model;state.cars=s.cars;const width=3+s.units*2.3;deck.scale.x=width/8;under.scale.x=width/8;rear.scale.x=width/8;edge.scale.x=width/8;post.position.set(-width/2+.55,0,-2.37);planters[0].position.set(width/2-.45,0,-2.32);planters[1].position.set(width/2-.45,0,2.37);for(let i=0;i<3;i++){targets[i]=(i-(s.units-1)/2)*2.28;const scale=s.model==='slow'?.72:s.model==='ultra'?1.13:1;chargers[i].scale.set(scale,1,1);if(i>=s.units)bays[i].scale.y=Math.min(1,bays[i].scale.y);}targetDistance=(10.1+s.units*1.85)*(host.clientWidth<450?1.08:1);draw();}};
  document.querySelector('#view-rotate').onclick=()=>{targetAngle=targetAngle>0?-.46:.55;draw();};
  document.querySelector('#view-reset').onclick=()=>{targetAngle=-.46;draw();};
  let pointer=null;renderer.domElement.addEventListener('pointerdown',e=>{pointer={x:e.clientX,angle:targetAngle};});window.addEventListener('pointerup',()=>pointer=null);renderer.domElement.addEventListener('pointermove',e=>{if(!pointer||e.pointerType==='touch')return;targetAngle=Math.max(-1.1,Math.min(1.1,pointer.angle+(e.clientX-pointer.x)*.006));draw(15);});
  new ResizeObserver(resize).observe(host);if(pending)view.update(pending);resize();
}
init().catch(()=>{host.innerHTML='<div class="fallback-visual" aria-label="Visualização simplificada do eletroposto">ϟ</div>';document.querySelector('.scene-tag').textContent='Visualização simplificada';});
})();
