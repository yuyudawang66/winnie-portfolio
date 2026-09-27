import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// Real, independently modelled surfaces: the shelves, door hinge and objects share world space.
export default function LockerThree({open,onOpen,onExplore,entrance,onProgress,onReady,onEntered}:{open:boolean;onOpen:()=>void;onExplore:(id:string)=>void;entrance:'loading'|'entering'|'ready';onProgress:(value:number)=>void;onReady:()=>void;onEntered:()=>void}){
 const host=useRef<HTMLDivElement>(null), state=useRef({open,onOpen,onExplore,entrance,onProgress,onReady,onEntered});
 const[failed,setFailed]=useState(false); state.current={open,onOpen,onExplore,entrance,onProgress,onReady,onEntered};
 useEffect(()=>{
  const el=host.current!; let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setFailed(true);state.current.onProgress(100);state.current.onReady();state.current.onEntered();return;}
  let disposed=false,assetsLoaded=false,firstFrame=false,readySent=false;const textures:THREE.Texture[]=[];
  const finishLoading=()=>{if(!disposed&&!readySent&&assetsLoaded&&firstFrame){readySent=true;state.current.onProgress(100);state.current.onReady();}};
  const manager=new THREE.LoadingManager();manager.onProgress=(_,loaded,total)=>{if(!disposed)state.current.onProgress(60+Math.round(loaded/total*25));};manager.onLoad=()=>{assetsLoaded=true;finishLoading();};
  // A failed image must not leave the visitor trapped on the welcome screen.
  const loadingDeadline=window.setTimeout(()=>{assetsLoaded=true;finishLoading();},8000);
  state.current.onProgress(12);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  el.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','可旋转的三维储物柜，点击柜门打开');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(-4,2.7,10);const controls=new OrbitControls(camera,renderer.domElement);
  controls.target.set(0,.05,0);controls.enableDamping=true;controls.enablePan=false;controls.enableZoom=false;
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
   const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tex,transparent:true,roughness:.74,alphaTest:.02}));
   mesh.position.set(x,y,z);mesh.rotation.z=rz;mesh.castShadow=true;parent.add(mesh);return mesh;
  }
  function action(obj:THREE.Object3D,id:string){obj.userData.action=id;return obj;}
  // Sheet metal shell, recessed back, dividers, top lip and individual feet.
  box(cabinet,4.65,3.65,.10,0,0,-.43,inside);
  [-2.32,-.95,.95,2.32].forEach(x=>box(cabinet,.075,3.8,.93,x,0,0,blue));
  [-1.9,1.9].forEach(y=>box(cabinet,4.72,.095,.99,0,y,0,blue));
  [-2.05,2.05].forEach(x=>[-.3,.3].forEach(z=>box(cabinet,.13,.18,.13,x,-2.02,z,edge)));
  // Shelf depth is visible when the door swings out.
  [1.03,-.2,-1.1].forEach(y=>box(cabinet,1.82,.055,.84,0,y,-.015,doorMat));
  const bookColors=['#cabee4','#fcdfb4','#fff8e4','#dfad99','#acd4cc','#e7bfcb'];
  bookColors.forEach((c,i)=>{const b=box(cabinet,.16,.5+(i%3)*.07,.38,-.7+i*.2,1.32+(i%3)*.035,-.07,mat(c,0,.8),.008);b.rotation.z=i===0?.12:0;label(cabinet,['IDEAS','UI','VISUAL','IP','TYPE','2026'][i],.115,.34,-.7+i*.2,1.35,.125,c,'#526c79',90)});
  const orb=new THREE.Mesh(new THREE.SphereGeometry(.14,32,24),mat('#f4cd8f',.18,.3));orb.position.set(.68,1.2,.08);orb.castShadow=true;cabinet.add(orb);
  const card=action(new THREE.Group(),'about');card.position.set(0,.58,.15);card.rotation.z=.04;cabinet.add(card);box(card,1.52,.57,.035,0,0,0,cream);label(card,'杨雯茹 / Winnie\nABOUT ME  ↗',1.42,.47,0,0,.025,'#fff9e9','#367c8d',60);
  const projects=[['ip','IP DESIGN','#94e3e5'],['ui','UI / UX','#a9beef'],['brand','BRAND','#ffe2a0'],['campaign','CAMPAIGN','#f4b1d0']];
  projects.forEach(([id,name,color],i)=>{const g=action(new THREE.Group(),'project/'+id);g.position.set(-.46+(i%2)*.92,-.43-Math.floor(i/2)*.35,.29);cabinet.add(g);box(g,.77,.27,.095,0,0,0,mat(color,0,.65),.028);box(g,.28,.08,.07,-.19,.15,-.01,mat(color,0,.65),.02);label(g,name,.68,.2,0,0,.05,color,'#375165',72);});
  const turntable=action(new THREE.Group(),'life');turntable.position.set(-.45,-1.49,.03);cabinet.add(turntable);box(turntable,.77,.15,.54,0,0,0,cream);const disc=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.022,64),mat('#243941',.35,.25));disc.position.y=.09;turntable.add(disc);const center=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.025,32),cream);center.position.y=.105;turntable.add(center);box(turntable,.025,.025,.3,.26,.13,-.035,silver);label(turntable,'OFF THE CLOCK',.67,.09,0,-.015,.28,'#fff9e9','#456d7c',64);
  const note=action(new THREE.Group(),'message');note.position.set(.48,-1.45,.2);note.rotation.z=-.09;cabinet.add(note);box(note,.58,.52,.025,0,0,0,mat('#fff0a9',0,.9));label(note,'留一张\n小纸条 ↗',.52,.43,0,0,.016,'#fff0a9','#746445',92);
  function vent(parent:THREE.Object3D,x:number,y:number,z:number){for(let j=0;j<4;j++){box(parent,.43,.052,.033,x,y-j*.085,z,edge,.023);box(parent,.42,.026,.04,x,y-j*.085+.014,z+.009,doorMat,.01);}}
  function handle(parent:THREE.Object3D,x:number,z:number){box(parent,.16,.48,.045,x,-.13,z,silver,.045);box(parent,.055,.28,.10,x,-.12,z+.053,edge,.024);}
  [-1.64,1.64].forEach((x,i)=>{box(cabinet,1.28,3.62,.08,x,0,.46,doorMat,.04);vent(cabinet,x,1.51,.52);vent(cabinet,x,-1.35,.52);handle(cabinet,x-.45,.52);label(cabinet,`0${i===0?1:3} / WINNIE`,.77,.08,x,1.71,.511,'#d1e4ec','#567f93',45);});
  const photo=action(new THREE.Group(),'about');photo.position.set(-1.57,.42,.54);photo.rotation.z=-.08;cabinet.add(photo);sticker(photo,'./assets/stickers/name-note.png',.9,.67,0,0,.02,0);
  sticker(cabinet,'./assets/stickers/cat-shark-baby.png',.44,.53,-1.92,-.47,.55,.12);
  sticker(cabinet,'./assets/stickers/tomato.png',.5,.44,-1.31,-.78,.55,-.12);
  sticker(cabinet,'./assets/stickers/cat-matcha.png',.4,.36,-1.38,-.04,.55,.1);
  const worksSticker=action(new THREE.Group(),'works');worksSticker.position.set(1.59,.68,.54);worksSticker.rotation.z=.08;cabinet.add(worksSticker);sticker(worksSticker,'./assets/stickers/camera.png',.74,.65,0,0,.02,0);
  sticker(cabinet,'./assets/stickers/bulb.png',.48,.5,1.94,.12,.55,-.1);
  sticker(cabinet,'./assets/stickers/bird.png',.42,.47,1.33,-.38,.55,.08);
  const envelope=action(new THREE.Group(),'message');envelope.position.set(1.78,-.67,.55);envelope.rotation.z=-.08;cabinet.add(envelope);sticker(envelope,'./assets/stickers/cat-flower-wink.png',.48,.52,0,0,.015,0);
  // Door uses its actual edge as the pivot, including thickness and metal hinges.
  const hinge=action(new THREE.Group(),'open');hinge.position.set(.92,0,.5);cabinet.add(hinge);
  box(hinge,1.8,3.61,.085,-.9,0,0,doorMat,.04);vent(hinge,-.9,1.5,.06);vent(hinge,-.9,-1.35,.06);handle(hinge,-1.58,.06);
  sticker(hinge,'./assets/stickers/portfolio-type.png',1.46,.64,-.88,.62,.065,-.035);
  sticker(hinge,'./assets/stickers/hi.png',.82,.55,-1.08,-.12,.068,.1);
  sticker(hinge,'./assets/stickers/cat-whiskers.png',.5,.45,-.45,-.46,.071,-.08);
  sticker(hinge,'./assets/stickers/cat-glasses-flower.png',.5,.49,-1.16,-1.02,.069,.05);
  const back=label(hinge,'ideas\nlive here.',1.17,1.1,-.9,.4,-.05,'#fff0c9','#5096a5',115);back.rotation.y=Math.PI;
  [-1.28,1.28].forEach(y=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.036,.036,.22,20),silver);c.position.set(.93,y,.5);c.castShadow=true;cabinet.add(c);});
  // A soft contact texture supplements the directional shadow without a background image.
  const sc=document.createElement('canvas');sc.width=sc.height=128;const sx=sc.getContext('2d')!;const grad=sx.createRadialGradient(64,64,4,64,64,64);grad.addColorStop(0,'rgba(38,69,82,.24)');grad.addColorStop(1,'rgba(38,69,82,0)');sx.fillStyle=grad;sx.fillRect(0,0,128,128);const st=new THREE.CanvasTexture(sc);textures.push(st);const contact=new THREE.Mesh(new THREE.PlaneGeometry(7,3.5),new THREE.MeshBasicMaterial({map:st,transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.y=-2.115;scene.add(contact);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.14}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.12;floor.receiveShadow=true;scene.add(floor);
  const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
  function hit(e:PointerEvent){const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);const nearest=ray.intersectObject(cabinet,true)[0];let obj:THREE.Object3D| null=nearest?.object??null;while(obj&&!obj.userData.action)obj=obj.parent;return obj?.userData.action as string|undefined;}
  let down=[0,0];const onDown=(e:PointerEvent)=>{down=[e.clientX,e.clientY]};const onUp=(e:PointerEvent)=>{if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>7)return;if(state.current.entrance!=='ready')return;const id=hit(e);if(id==='open')state.current.onOpen();else if(id?.startsWith('project/'))location.hash=id;else if(id)state.current.onExplore(id);};
  const onMove=(e:PointerEvent)=>{renderer.domElement.style.cursor=hit(e)?'pointer':'grab'};
  renderer.domElement.addEventListener('pointerdown',onDown);renderer.domElement.addEventListener('pointerup',onUp);renderer.domElement.addEventListener('pointermove',onMove);
  state.current.onProgress(60);
  let mobile=false,entranceTime:number|null=null,entranceFinished=state.current.entrance==='ready';
  const direction=new THREE.Vector3(-4,2.65,10).normalize();
  const resize=()=>{const {width,height}=el.getBoundingClientRect();if(!width||!height)return;mobile=width<650;renderer.setSize(width,height);
   if(entranceFinished)camera.position.sub(controls.target).normalize().multiplyScalar(mobile?6.35:7.9).add(controls.target);
   camera.aspect=width/height;camera.fov=mobile?44:35;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let last=performance.now();
  controls.enabled=entranceFinished;
  renderer.setAnimationLoop((now)=>{
   const dt=Math.min((now-last)/1000,.05);last=now;
   if(!entranceFinished){
    if(state.current.entrance==='entering'&&entranceTime===null)entranceTime=now;
    const t=state.current.entrance==='ready'||reduced?1:entranceTime===null?0:Math.min(1,Math.max(0,(now-entranceTime-180)/1900));
    // Quintic easing brings a genuine perspective-camera dolly to a soft stop.
    const ease=t*t*t*(t*(t*6-15)+10),distance=(mobile?6.35:7.9)*(2.6-1.6*ease);
    camera.position.copy(direction).multiplyScalar(distance).add(controls.target);camera.lookAt(controls.target);
    if(t===1&&state.current.entrance!=='loading'){entranceFinished=true;controls.enabled=true;state.current.onEntered();}
   }
   const target=state.current.open?2.05:0;hinge.rotation.y=THREE.MathUtils.damp(hinge.rotation.y,target,reduced?100:5,dt);const scale=mobile?.84:1;cabinet.scale.setScalar(scale);cabinet.position.y=mobile?-.3:0;controls.update();renderer.render(scene,camera);
   if(!firstFrame){firstFrame=true;finishLoading();}
  });
  const loss=(e:Event)=>{e.preventDefault();setFailed(true);state.current.onEntered();};renderer.domElement.addEventListener('webglcontextlost',loss);
  return()=>{disposed=true;clearTimeout(loadingDeadline);ro.disconnect();renderer.setAnimationLoop(null);controls.dispose();renderer.domElement.removeEventListener('pointerdown',onDown);renderer.domElement.removeEventListener('pointerup',onUp);renderer.domElement.removeEventListener('pointermove',onMove);renderer.domElement.removeEventListener('webglcontextlost',loss);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="locker-webgl-wrap"><div className="locker-webgl" ref={host}/>{failed&&<div className="locker-webgl-fallback">当前浏览器暂不支持 3D 场景，请使用下方按钮浏览作品。</div>}<span className="locker-3d-caption">拖动旋转视角 · 点击柜门开启</span></div>;
}
