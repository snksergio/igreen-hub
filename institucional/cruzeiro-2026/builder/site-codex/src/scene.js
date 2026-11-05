import * as THREE from 'three';

export function createShipMap(canvas,markers,activeRef,pausedRef,onFailure){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x000000,0);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-24,24,17,-17,.1,180);
  camera.position.set(18,24,36);camera.lookAt(0,1,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0xa7b9a0,3));
  const sun=new THREE.DirectionalLight(0xfff4db,3.6);sun.position.set(-15,30,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-25,right:25,top:25,bottom:-25,near:1,far:90});sun.shadow.bias=-.0005;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xbadbe7,1.4);fill.position.set(20,10,-20);scene.add(fill);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.12}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-1.7;shadow.receiveShadow=true;scene.add(shadow);
  const ship=new THREE.Group();scene.add(ship);ship.rotation.y=.2;
  const white=new THREE.MeshStandardMaterial({color:0xf7f5e9,roughness:.6});
  const glass=new THREE.MeshStandardMaterial({color:0x41737c,roughness:.32,metalness:.15});
  const wood=new THREE.MeshStandardMaterial({color:0xc4a77b,roughness:.85});
  const green=new THREE.MeshStandardMaterial({color:0x236c5c,roughness:.5});
  const blue=new THREE.MeshStandardMaterial({color:0x48c9d6,roughness:.22,metalness:.08});
  const yellow=new THREE.MeshStandardMaterial({color:0xf3be41,roughness:.65});
  const railMaterial=new THREE.LineBasicMaterial({color:0xc7d0c6});
  const selectable=[];
  function ring(length,width,y,offset=0){const points=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2,c=Math.cos(a),s=Math.sin(a);points.push(new THREE.Vector3(offset+length*.5*c,y,Math.sign(s)*width*.5*Math.pow(Math.max(0,1-c*c),c>0?.35:.14)));}return points;}
  const rings=[ring(25.5,3.8,-1.4,-.7),ring(29.4,5.7,-.6,-.1),ring(31,6.7,.75),ring(31.4,6.8,1.3)];
  const points=[];for(let r=0;r<rings.length-1;r++)for(let i=0;i<64;i++){const n=(i+1)%64;for(const p of [rings[r][i],rings[r][n],rings[r+1][i],rings[r][n],rings[r+1][n],rings[r+1][i]])points.push(p.x,p.y,p.z);}
  const hull=new THREE.BufferGeometry();hull.setAttribute('position',new THREE.Float32BufferAttribute(points,3));hull.computeVertexNormals();
  const hullMesh=new THREE.Mesh(hull,white);hullMesh.castShadow=true;hullMesh.receiveShadow=true;ship.add(hullMesh);
  function deck(length,width,y,height,offset,material){
    const shape=new THREE.Shape(ring(length,width,0,offset).map(p=>new THREE.Vector2(p.x,p.z)));
    const geo=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:false,steps:1});geo.rotateX(-Math.PI/2);
    const mesh=new THREE.Mesh(geo,material);mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;ship.add(mesh);return mesh;
  }
  deck(31.4,6.8,1.3,.14,0,wood);
  for(let d=0;d<5;d++){
    const length=28.1-d*1.2,width=6.1-d*.23,y=1.45+d*.6,offset=-.6-d*.25;
    const cabinMat=white.clone();const layer=deck(length,width,y,.5,offset,cabinMat);selectable.push({material:cabinMat,index:1,base:0xf7f5e9});
    deck(length+.15,width+.15,y+.5,.08,offset,white);
    const outline=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ring(length+.12,width+.15,y+.62,offset)),railMaterial);ship.add(outline);
    const windowGeo=new THREE.BoxGeometry(.31,.24,.025),windowInstances=new THREE.InstancedMesh(windowGeo,glass,72);
    const matrix=new THREE.Matrix4();let count=0;
    for(const side of [-1,1])for(let x=-10;x<8.1;x+=.55){matrix.makeTranslation(x,y+.3,side*(width*.5+.013));windowInstances.setMatrixAt(count++,matrix);}
    windowInstances.count=count;ship.add(windowInstances);
  }
  deck(21,4.9,4.5,.15,-1.4,wood);
  function box(w,h,d,x,y,z,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;ship.add(mesh);return mesh;}
  const poolMat=blue.clone();box(4,.09,1.65,1.2,4.73,0,poolMat);selectable.push({material:poolMat,index:0,base:0x48c9d6});
  for(const z of [-.96,.96])box(4.3,.13,.15,1.2,4.72,z,white);
  for(const x of [-.95,3.35])box(.15,.13,2.05,x,4.72,0,white);
  for(const z of [-1.75,1.75])for(let x=-2;x<5;x+=1.1){box(.75,.12,.38,x,4.8,z,white);box(.22,.3,.38,x-.24,4.92,z,white);}
  box(4,.5,4.3,7.2,4.5,0,white);box(4.05,.28,4.34,7.2,4.55,0,glass);box(4.4,.16,4.6,7.2,4.84,0,white);
  box(3.2,.5,3.3,-5,4.9,0,white);box(1.55,1.1,1.75,-5.2,5.65,0,green);box(1.9,.16,2.1,-5.2,6.25,0,white);
  const partyMat=wood.clone();const partyDeck=deck(4.5,3.8,4.55,.13,-9,partyMat);selectable.push({material:partyMat,index:3,base:0xc4a77b});
  const diningMat=glass.clone();box(4.4,.35,.04,-6.5,1.7,3.26,diningMat);selectable.push({material:diningMat,index:2,base:0x41737c});
  for(const x of [-8,7]){
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(.36,16,12),white);sphere.position.set(x,5.3,0);ship.add(sphere);
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,1.7,8),white);pole.position.set(x,5.7,0);ship.add(pole);
  }
  for(const side of [-1,1])for(let x=-8.5;x<7;x+=2.5){const boat=new THREE.Mesh(new THREE.CapsuleGeometry(.25,1.05,4,8),yellow);boat.rotation.z=Math.PI/2;boat.position.set(x,1.62,side*3.43);ship.add(boat);}
  const stripe=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ring(31.1,6.77,.89)),new THREE.LineBasicMaterial({color:0x236c5c}));ship.add(stripe);
  const pinPoints=[new THREE.Vector3(1.2,5.35,0),new THREE.Vector3(8,3.2,3.3),new THREE.Vector3(-5.3,2.1,3.5),new THREE.Vector3(-10,5,0)];
  let frame=0,last=0,rotation=.2,targetRotation=.2,dragging=false,startX=0,startAngle=0,visible=true,previousActive=-1;
  let width=1,height=1;
  const resize=()=>{const rect=canvas.parentElement.getBoundingClientRect();width=rect.width;height=rect.height;renderer.setSize(width,height,false);const aspect=width/height;const horizontal=Math.max(20,15*aspect);camera.left=-horizontal;camera.right=horizontal;camera.top=horizontal/aspect;camera.bottom=-horizontal/aspect;camera.updateProjectionMatrix();};
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas.parentElement);resize();
  const visibilityObserver=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});visibilityObserver.observe(canvas);
  const down=e=>{dragging=true;startX=e.clientX;startAngle=targetRotation;canvas.setPointerCapture(e.pointerId);};
  const move=e=>{if(dragging)targetRotation=startAngle+(e.clientX-startX)*.008;};
  const up=()=>{dragging=false;};
  const lost=e=>{e.preventDefault();cancelAnimationFrame(frame);onFailure();};
  canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('webglcontextlost',lost);
  function render(now){
    const dt=Math.min((now-(last||now))/1000,.05);last=now;
    if(visible&&!document.hidden){
      rotation=pausedRef.current?targetRotation:THREE.MathUtils.lerp(rotation,targetRotation,1-Math.exp(-dt*8));ship.rotation.y=rotation;
      if(previousActive!==activeRef.current){previousActive=activeRef.current;for(const item of selectable)item.material.color.setHex(item.index===previousActive?0xe8c461:item.base);}
      ship.updateMatrixWorld(true);
      for(let i=0;i<markers.length;i++){const marker=markers[i];if(!marker)continue;const p=pinPoints[i].clone().applyMatrix4(ship.matrixWorld).project(camera);marker.style.left=`${(p.x*.5+.5)*width}px`;marker.style.top=`${(-p.y*.5+.5)*height}px`;}
      renderer.render(scene,camera);
    }
    frame=requestAnimationFrame(render);
  }
  frame=requestAnimationFrame(render);
  return {reset(){targetRotation=.2;},dispose(){cancelAnimationFrame(frame);resizeObserver.disconnect();visibilityObserver.disconnect();canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('webglcontextlost',lost);const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();}};
}
