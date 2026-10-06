import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createXuegaoBird} from './xuegao-bird';
import {createArtistPalette} from './artist-palette';
import {createSuitcaseTurntable} from './suitcase-turntable';
import {createAboutCharm} from './about-charm';

// Real, independently modelled surfaces: the shelves, door hinge and objects share world space.
export default function LockerThree({open,onOpen,onExplore,entrance,onProgress,onReady,onEntered}:{open:boolean;onOpen:()=>void;onExplore:(id:string)=>void;entrance:'loading'|'entering'|'ready';onProgress:(value:number)=>void;onReady:()=>void;onEntered:()=>void}){
 const host=useRef<HTMLDivElement>(null), state=useRef({open,onOpen,onExplore,entrance,onProgress,onReady,onEntered});
 const[failed,setFailed]=useState(false); state.current={open,onOpen,onExplore,entrance,onProgress,onReady,onEntered};
 const[birdGreeting,setBirdGreeting]=useState(false);
 const[birdAnchor,setBirdAnchor]=useState<{x:number;y:number;width:number;height:number}|null>(null);
 const[aboutAnchor,setAboutAnchor]=useState<{x:number;y:number;width:number;height:number}|null>(null);
 useEffect(()=>{
  const el=host.current!; let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setFailed(true);state.current.onProgress(100);state.current.onReady();state.current.onEntered();return;}
  let disposed=false,assetsLoaded=false,firstFrame=false,readySent=false;const textures:THREE.Texture[]=[];
  const finishLoading=()=>{if(!disposed&&!readySent&&assetsLoaded&&firstFrame){readySent=true;state.current.onProgress(100);state.current.onReady();}};
  // Late textures must not lower 100% after the loading deadline has released the scene.
  const manager=new THREE.LoadingManager();manager.onProgress=(_,loaded,total)=>{if(!disposed&&!readySent)state.current.onProgress(60+Math.round(loaded/total*25));};manager.onLoad=()=>{assetsLoaded=true;finishLoading();};
  // A failed image must not leave the visitor trapped on the welcome screen.
  const loadingDeadline=window.setTimeout(()=>{assetsLoaded=true;finishLoading();},8000);
  state.current.onProgress(12);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  el.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','可旋转的三维储物柜，点击柜门打开');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(-4,2.7,10);const controls=new OrbitControls(camera,renderer.domElement);
  controls.target.set(.24,-.24,0);controls.enableDamping=true;controls.enablePan=false;controls.enableZoom=false;
  controls.minAzimuthAngle=-.75;controls.maxAzimuthAngle=.55;controls.minPolarAngle=1.08;controls.maxPolarAngle=1.65;
  scene.add(new THREE.HemisphereLight(0xffffff,0xbfe2f0,1.75));
  const sun=new THREE.DirectionalLight(0xffffff,3.15);sun.position.set(-3,7,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.1,far:20});sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;sun.shadow.radius=4;scene.add(sun);
  const rim=new THREE.DirectionalLight(0xd9f7ff,1.8);rim.position.set(4,2,-3);scene.add(rim);
  const cabinet=new THREE.Group();scene.add(cabinet);
  const mat=(color:string,metalness=.02,roughness=.38,glow=.045)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive:color,emissiveIntensity:glow});
  const blue=mat('#a9d9f0',0,.36,.07),edge=mat('#539bc4',0,.4,.055),inside=mat('#4f94c0',0,.46,.04),doorMat=mat('#cfe8f6',0,.34,.075),silver=mat('#8fa8b4',.48,.32,0),cream=mat('#fff5dc',0,.85,.03);
  function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material,r=.025){const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  function label(parent:THREE.Object3D,text:string,w:number,h:number,x:number,y:number,z:number,bg='#fff9e9',color='#356b83',size=60){
   const c=document.createElement('canvas');c.width=768;c.height=Math.round(768*h/w);const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${size}px Georgia, "PingFang SC", sans-serif`;const lines=text.split('\n');lines.forEach((s,i)=>ctx.fillText(s,c.width/2,c.height/2+(i-(lines.length-1)/2)*size*1.45,c.width-55));const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,roughness:.92}));plane.position.set(x,y,z);parent.add(plane);return plane;
  }
  function picture(parent:THREE.Object3D,path:string,w:number,h:number,x:number,y:number,z:number){
   const tex=new THREE.TextureLoader(manager).load(path,()=>{if(disposed)tex.dispose();});tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,transparent:true,roughness:.8}));m.position.set(x,y,z);parent.add(m);return m;
  }
  function sticker(parent:THREE.Object3D,path:string,w:number,h:number,x:number,y:number,z:number,rz=0){
   const tex=new THREE.TextureLoader(manager).load(path,()=>{if(disposed)tex.dispose();});tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);
   tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
   const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,transparent:true,roughness:.74,alphaTest:.02}));
   mesh.position.set(x,y,z);mesh.rotation.z=rz;mesh.castShadow=true;parent.add(mesh);return mesh;
  }
  function action(obj:THREE.Object3D,id:string){obj.userData.action=id;return obj;}
  const photoPaper=mat('#fffaf2',0,.94,0);
  const cornerTextures:THREE.Texture[]=[];
  const cornerAtlas=new THREE.TextureLoader(manager).load('./assets/stickers/blue-photo-corners.png',()=>{
   if(disposed){cornerAtlas.dispose();return;}cornerTextures.forEach(texture=>{texture.needsUpdate=true;});
  });
  cornerAtlas.colorSpace=THREE.SRGBColorSpace;cornerAtlas.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(cornerAtlas);
  // One different motif per print, overlapping the white rim instead of the subject.
  const photoCorners:Record<string,{tile:number;side:[number,number];size:number;angle:number}>={
   cat:{tile:0,side:[-1,1],size:.155,angle:.18},
   duck:{tile:2,side:[1,-1],size:.120,angle:-.12},
   'egg-flowers':{tile:1,side:[1,1],size:.125,angle:.14},
   sunset:{tile:5,side:[-1,1],size:.145,angle:.12},
   'starry-night':{tile:4,side:[1,-1],size:.140,angle:-.20},
   blossoms:{tile:3,side:[-1,-1],size:.150,angle:.20},
  };
  function polaroid(file:string,aspect:number,width:number,x:number,y:number,angle:number,z=.520){
   const frame=new THREE.Group();frame.name=`Polaroid: ${file}`;frame.position.set(x,y,z);frame.rotation.z=angle;cabinet.add(frame);
   // Wider white borders and a rounded paper edge, keeping the complete image.
   const rim=.027,bottom=.080,depth=.022,photoWidth=width-rim*2,photoHeight=photoWidth/aspect;
   const height=photoHeight+rim+bottom;
   box(frame,width,height,depth,0,0,0,photoPaper,.004);
   // Thin paper is below the scene shadow bias, so add a soft local contact shadow.
   // The lower-right offset matches the light above and to the left of the cabinet.
   const padding=.060,shadowWidth=width+padding*2,shadowHeight=height+padding*2;
   const canvas=document.createElement('canvas');canvas.width=256;canvas.height=Math.ceil(256*shadowHeight/shadowWidth);
   const ctx=canvas.getContext('2d')!,pixels=canvas.width/shadowWidth;
   const drawShadow=(blur:number,offsetX:number,offsetY:number,opacity:number)=>{
    ctx.filter=`blur(${blur*pixels}px)`;ctx.fillStyle=`rgba(35,57,68,${opacity})`;
    ctx.beginPath();ctx.roundRect((padding+offsetX)*pixels,(padding+offsetY)*pixels,width*pixels,height*pixels,.004*pixels);ctx.fill();
   };
   drawShadow(.014,.012,.018,.26);drawShadow(.005,.003,.005,.13);
   const shadowTexture=new THREE.CanvasTexture(canvas);shadowTexture.colorSpace=THREE.SRGBColorSpace;textures.push(shadowTexture);
   const shadow=new THREE.Mesh(new THREE.PlaneGeometry(shadowWidth,shadowHeight),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,toneMapped:false}));
   shadow.position.z=-.017;shadow.raycast=()=>{};frame.add(shadow);
   const texture=new THREE.TextureLoader(manager).load(`./assets/polaroids/${file}.png`,()=>{if(disposed)texture.dispose();});
   texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(texture);
   const photo=new THREE.Mesh(new THREE.PlaneGeometry(photoWidth,photoHeight),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));
   photo.position.set(0,(bottom-rim)/2,depth/2+.0006);frame.add(photo);
   const decoration=photoCorners[file];
   if(decoration){
    const map=cornerAtlas.clone();map.repeat.set(1/3,1/2);map.offset.set((decoration.tile%3)/3,(1-Math.floor(decoration.tile/3))/2);cornerTextures.push(map);textures.push(map);
    const corner=new THREE.Mesh(new THREE.PlaneGeometry(decoration.size,decoration.size),new THREE.MeshBasicMaterial({map,transparent:true,alphaTest:.04,depthWrite:false,toneMapped:false}));
    corner.name=`Photo corner sticker: ${file}`;corner.position.set(decoration.side[0]*(width/2-.008),decoration.side[1]*(height/2-.020),depth/2+.004);corner.rotation.z=decoration.angle;corner.raycast=()=>{};frame.add(corner);
   }
  }
  // Sheet metal shell, recessed back, dividers, top lip and individual feet.
  box(cabinet,4.65,3.65,.10,0,0,-.43,inside);
  [-2.32,-.95,.95,2.32].forEach(x=>box(cabinet,.075,3.8,.93,x,0,0,blue));
  [-1.9,1.9].forEach(y=>box(cabinet,4.72,.095,.99,0,y,0,blue));
  [-2.05,2.05].forEach(x=>[-.3,.3].forEach(z=>box(cabinet,.13,.18,.13,x,-2.02,z,edge)));
  const xuegao=createXuegaoBird();xuegao.bird.position.set(.38,1.9475,.20);cabinet.add(xuegao.bird);
  // Project a small accessible hover/tap target from the real bird's bounds.
  // Its location follows cabinet scale, viewport changes and camera rotation.
  const birdCorners:THREE.Vector3[]=[];
  for(const x of [-.28,.28])for(const y of [0,.55])for(const z of [-.35,.27])birdCorners.push(new THREE.Vector3(x,y,z));
  const projected=new THREE.Vector3();let previousAnchor='';
  // Two shelves make three compartments; the shallow front clearance holds the door charm.
  [.65,-.62].forEach(y=>{const shelf=box(cabinet,1.82,.055,.70,0,y,-.045,doorMat);shelf.name='Interior shelf';});
  const bookColors=['#cabee4','#fcdfb4','#fff8e4','#dfad99','#acd4cc','#e7bfcb'];
  bookColors.forEach((c,i)=>{const h=.67+(i%3)*.085,y=.685+h/2;const b=box(cabinet,.16,h,.38,-.7+i*.2,y,-.07,mat(c,0,.8),.008);b.rotation.z=i===0?.10:0;label(cabinet,['IDEAS','UI','VISUAL','IP','TYPE','2026'][i],.115,.42,-.7+i*.2,y,.125,c,'#526c79',90)});
  const orb=new THREE.Mesh(new THREE.SphereGeometry(.17,32,24),mat('#f4cd8f',.18,.3));orb.position.set(.68,.848,.08);orb.castShadow=true;cabinet.add(orb);
  const projects=[['ip','IP DESIGN','#94e3e5'],['ui','UI / UX','#a9beef'],['brand','BRAND','#ffe2a0'],['campaign','CAMPAIGN','#f4b1d0']];
  projects.forEach(([id,name,color],i)=>{const g=action(new THREE.Group(),'project/'+id);g.position.set(-.46+(i%2)*.92,.18-Math.floor(i/2)*.59,.18);cabinet.add(g);box(g,.77,.34,.12,0,0,0,mat(color,0,.65),.028);box(g,.28,.08,.08,-.19,.19,-.01,mat(color,0,.65),.02);label(g,name,.68,.23,0,0,.065,color,'#375165',72);});
  const recordPlayer=createSuitcaseTurntable();const turntable=action(recordPlayer.group,'life');turntable.position.set(-.32,-1.8525,.085);cabinet.add(turntable);textures.push(...recordPlayer.textures);
  const note=action(new THREE.Group(),'message');note.position.set(.48,-1.45,.2);note.rotation.z=-.09;cabinet.add(note);box(note,.58,.52,.025,0,0,0,mat('#fff0a9',0,.9));label(note,'留一张\n小纸条 ↗',.52,.43,0,0,.016,'#fff0a9','#746445',92);
  function vent(parent:THREE.Object3D,x:number,y:number,z:number){for(let j=0;j<4;j++){box(parent,.43,.052,.033,x,y-j*.085,z,edge,.023);box(parent,.42,.026,.04,x,y-j*.085+.014,z+.009,doorMat,.01);}}
  function handle(parent:THREE.Object3D,x:number,z:number){box(parent,.16,.48,.045,x,-.13,z,silver,.045);box(parent,.055,.28,.10,x,-.12,z+.053,edge,.024);}
  [-1.64,1.64].forEach((x,i)=>{box(cabinet,1.28,3.62,.08,x,0,.46,doorMat,.04);vent(cabinet,x,1.51,.52);vent(cabinet,x,-1.35,.52);handle(cabinet,x-.45,.52);label(cabinet,`0${i===0?1:3} / WINNIE`,.77,.08,x,1.71,.511,'#d1e4ec','#567f93',45);});
  // A single small portfolio sticker sits above the right-hand door handle.
  action(sticker(cabinet,'./assets/stickers/portfolio-cover-full.webp',.60,.60*1080/1920,1.64,.26,.521),'open');
  // Six small paper prints follow the marked layout; only the top-left pair overlap.
  polaroid('cat',1200/783,.31,-1.99,.79,.07);
  polaroid('duck',1,.28,-1.79,.62,-.085,.550);
  polaroid('egg-flowers',1200/1736,.27,-1.43,-.23,.055);
  polaroid('sunset',928/1232,.28,1.56,.84,-.055);
  polaroid('starry-night',1200/750,.32,1.99,-.32,.085);
  polaroid('blossoms',279/445,.25,1.31,-.79,-.045);
  // Door uses its actual edge as the pivot, including thickness and metal hinges.
  const hinge=action(new THREE.Group(),'open');hinge.position.set(.92,0,.5);cabinet.add(hinge);
  box(hinge,1.8,3.61,.085,-.9,0,0,doorMat,.04);vent(hinge,-.9,1.5,.06);vent(hinge,-.9,-1.35,.06);handle(hinge,-1.58,.06);
  const aboutCharm=createAboutCharm();action(aboutCharm.group,'about');aboutCharm.group.position.set(-.9,1.14,-.058);aboutCharm.group.rotation.y=Math.PI;aboutCharm.group.scale.z=.55;hinge.add(aboutCharm.group);textures.push(...aboutCharm.textures);
  const aboutCorners=[new THREE.Vector3(-.37,-.12,0),new THREE.Vector3(.37,-.12,0),new THREE.Vector3(-.37,.12,0),new THREE.Vector3(.37,.12,0)];let previousAboutAnchor='';
  [-1.28,1.28].forEach(y=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.036,.036,.22,20),silver);c.position.set(.93,y,.5);c.castShadow=true;cabinet.add(c);});
  const artProps=createArtistPalette();artProps.group.position.set(2.23,-2.12,.91);cabinet.add(artProps.group);textures.push(...artProps.textures);
  // A soft contact texture supplements the directional shadow without a background image.
  const sc=document.createElement('canvas');sc.width=sc.height=128;const sx=sc.getContext('2d')!;const grad=sx.createRadialGradient(64,64,4,64,64,64);grad.addColorStop(0,'rgba(38,69,82,.24)');grad.addColorStop(1,'rgba(38,69,82,0)');sx.fillStyle=grad;sx.fillRect(0,0,128,128);const st=new THREE.CanvasTexture(sc);textures.push(st);const contact=new THREE.Mesh(new THREE.PlaneGeometry(7,3.5),new THREE.MeshBasicMaterial({map:st,transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.y=-2.115;scene.add(contact);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.14}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.12;floor.receiveShadow=true;scene.add(floor);
  const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
  function hit(e:PointerEvent){const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);const nearest=ray.intersectObject(cabinet,true)[0];let obj:THREE.Object3D| null=nearest?.object??null;while(obj&&!obj.userData.action)obj=obj.parent;return obj?.userData.action as string|undefined;}
  let down=[0,0];const onDown=(e:PointerEvent)=>{down=[e.clientX,e.clientY];setBirdGreeting(false);};const onUp=(e:PointerEvent)=>{if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>7)return;if(state.current.entrance!=='ready')return;const id=hit(e);if(id==='open')state.current.onOpen();else if(id?.startsWith('project/'))location.hash=id;else if(id)state.current.onExplore(id);};
  const onMove=(e:PointerEvent)=>{renderer.domElement.style.cursor=hit(e)?'pointer':'grab'};
  renderer.domElement.addEventListener('pointerdown',onDown);renderer.domElement.addEventListener('pointerup',onUp);renderer.domElement.addEventListener('pointermove',onMove);
  state.current.onProgress(60);
  let mobile=false,viewDistance=10.3,entranceTime:number|null=null,entranceFinished=state.current.entrance==='ready';
  const direction=new THREE.Vector3(-4,2.65,10).normalize();
  const resize=()=>{const {width,height}=el.getBoundingClientRect();if(!width||!height)return;const viewDirection=camera.position.clone().sub(controls.target).normalize();mobile=width<650;renderer.setSize(width,height);controls.target.set(mobile?.20:.24,mobile?-.40:-.24,0);
   camera.aspect=width/height;camera.fov=mobile?44:35;
   // Keep the floor props in frame, including narrow screens and the opposite viewing angle.
   viewDistance=Math.max(mobile?6.9:10.3,(mobile?2.55:3.05)/(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));
   if(entranceFinished)camera.position.copy(viewDirection).multiplyScalar(viewDistance).add(controls.target);
   camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let last=performance.now();
  controls.enabled=entranceFinished;
  renderer.setAnimationLoop((now)=>{
   const dt=Math.min((now-last)/1000,.05);last=now;
   if(!entranceFinished){
    if(state.current.entrance==='entering'&&entranceTime===null)entranceTime=now;
    const t=state.current.entrance==='ready'||reduced?1:entranceTime===null?0:Math.min(1,Math.max(0,(now-entranceTime-180)/1900));
    // Quintic easing brings a genuine perspective-camera dolly to a soft stop.
    const ease=t*t*t*(t*(t*6-15)+10),distance=viewDistance*(2.6-1.6*ease);
    camera.position.copy(direction).multiplyScalar(distance).add(controls.target);camera.lookAt(controls.target);
    if(t===1&&state.current.entrance!=='loading'){entranceFinished=true;controls.enabled=true;state.current.onEntered();}
   }
   xuegao.animate(now/1000,reduced);
   const target=state.current.open?2.05:0;hinge.rotation.y=THREE.MathUtils.damp(hinge.rotation.y,target,reduced?100:5,dt);const scale=mobile?.84:1;cabinet.scale.setScalar(scale);cabinet.position.y=mobile?-.3:0;
   // The cabinet scales on phones; its freestanding props still rest on the world floor.
   artProps.group.position.y=(floor.position.y-cabinet.position.y)/scale;
   controls.update();renderer.render(scene,camera);
   if(entranceFinished){
    const width=el.clientWidth,height=el.clientHeight;let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
    for(const corner of birdCorners){projected.copy(corner).applyMatrix4(xuegao.bird.matrixWorld).project(camera);const x=(projected.x+1)*width/2,y=(1-projected.y)*height/2;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
    const w=Math.round(Math.max(44,right-left)),h=Math.round(Math.max(44,bottom-top));
    const anchor={x:Math.round((left+right-w)/2),y:Math.round((top+bottom-h)/2),width:w,height:h},key=`${anchor.x},${anchor.y},${w},${h}`;
    if(key!==previousAnchor){previousAnchor=key;setBirdAnchor(anchor);}
    if(state.current.open&&hinge.rotation.y>1.6){
     let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
     for(const corner of aboutCorners){projected.copy(corner).applyMatrix4(aboutCharm.label.matrixWorld).project(camera);const x=(projected.x+1)*width/2,y=(1-projected.y)*height/2;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
     const w=Math.round(Math.max(44,right-left)),h=Math.round(Math.max(44,bottom-top));
     const anchor={x:Math.round((left+right-w)/2),y:Math.round((top+bottom-h)/2),width:w,height:h},key=`${anchor.x},${anchor.y},${w},${h}`;
     if(key!==previousAboutAnchor){previousAboutAnchor=key;setAboutAnchor(anchor);}
    }else if(previousAboutAnchor){previousAboutAnchor='';setAboutAnchor(null);}
   }
   if(!firstFrame){firstFrame=true;finishLoading();}
  });
  const loss=(e:Event)=>{e.preventDefault();setFailed(true);state.current.onEntered();};renderer.domElement.addEventListener('webglcontextlost',loss);
  return()=>{disposed=true;clearTimeout(loadingDeadline);ro.disconnect();renderer.setAnimationLoop(null);controls.dispose();renderer.domElement.removeEventListener('pointerdown',onDown);renderer.domElement.removeEventListener('pointerup',onUp);renderer.domElement.removeEventListener('pointermove',onMove);renderer.domElement.removeEventListener('webglcontextlost',loss);scene.traverse(o=>{if(o instanceof THREE.InstancedMesh)o.dispose();if(o instanceof THREE.Mesh){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="locker-webgl-wrap"><div className="locker-webgl" ref={host}/>{!failed&&entrance==='ready'&&birdAnchor&&<button type="button" className="xuegao-trigger" style={{left:birdAnchor.x,top:birdAnchor.y,width:birdAnchor.width,height:birdAnchor.height}} aria-label="雪糕，紫伊莎牡丹鹦鹉" aria-describedby={birdGreeting?'xuegao-greeting':undefined} onPointerEnter={e=>{if(e.pointerType!=='touch')setBirdGreeting(true);}} onPointerLeave={e=>{if(e.pointerType!=='touch')setBirdGreeting(false);}} onFocus={()=>setBirdGreeting(true)} onBlur={()=>setBirdGreeting(false)} onClick={()=>setBirdGreeting(true)} onKeyDown={e=>{if(e.key==='Escape')setBirdGreeting(false);}}>{birdGreeting&&<span id="xuegao-greeting" className="xuegao-greeting" role="tooltip">你好我叫雪糕</span>}</button>}{!failed&&entrance==='ready'&&open&&aboutAnchor&&<button type="button" className="about-charm-trigger" style={{left:aboutAnchor.x,top:aboutAnchor.y,width:aboutAnchor.width,height:aboutAnchor.height}} aria-label="关于我，打开个人介绍" onClick={()=>state.current.onExplore('about')}/>}{failed&&<div className="locker-webgl-fallback">当前浏览器暂不支持 3D 场景，请使用下方按钮浏览作品。</div>}</div>;
}
