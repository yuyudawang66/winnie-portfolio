import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// A compact open suitcase player. The rubber feet define y = 0 for shelf placement.
export function createSuitcaseTurntable(){
 const group=new THREE.Group();group.name='Pink suitcase record player';
 const textures:THREE.Texture[]=[];
 const material=(color:string,roughness=.6,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const pink=material('#f52e8b',.70),lining=material('#f54493',.80),piping=material('#ff79b4',.64);
 // A little colour fill keeps the reference's vivid rose pink inside the shaded shelf.
 for(const m of [pink,lining,piping]){m.emissive.copy(m.color);m.emissiveIntensity=.14;}
 const chrome=material('#c8cece',.25,.7),darkChrome=material('#727d85',.32,.62);
 const rubber=material('#191a1c',.92),deck=material('#222226',.75),vinyl=material('#111218',.36);
 function mesh(parent:THREE.Object3D,geometry:THREE.BufferGeometry,m:THREE.Material){
  const result=new THREE.Mesh(geometry,m);result.castShadow=true;result.receiveShadow=true;parent.add(result);return result;
 }
 function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material,r=.008){
  const result=mesh(parent,new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)),m);result.position.set(x,y,z);return result;
 }
 function cylinder(parent:THREE.Object3D,r:number,h:number,x:number,y:number,z:number,m:THREE.Material,segments=32){
  const result=mesh(parent,new THREE.CylinderGeometry(r,r,h,segments),m);result.position.set(x,y,z);return result;
 }
 function tube(parent:THREE.Object3D,points:THREE.Vector3[],radius:number,m:THREE.Material){
  return mesh(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,radius,8,false),m);
 }
 // A fine monochrome grain changes only the leather normals, keeping the pink clean.
 const grainCanvas=document.createElement('canvas');grainCanvas.width=grainCanvas.height=128;
 const grainCtx=grainCanvas.getContext('2d')!;let seed=73;
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const shade=112+(seed%30);
  grainCtx.fillStyle=`rgb(${shade},${shade},${shade})`;grainCtx.fillRect(x,y,1,1);
 }
 const grain=new THREE.CanvasTexture(grainCanvas);grain.wrapS=grain.wrapT=THREE.RepeatWrapping;grain.repeat.set(3,3);textures.push(grain);
 for(const m of [pink,lining]){m.bumpMap=grain;m.bumpScale=.00065;}

 // Rounded pink case, raised black deck and four small feet.
 for(const x of [-.335,.335])for(const z of [-.19,.19])cylinder(group,.023,.024,x,.012,z,rubber,20);
 box(group,.82,.158,.52,0,.103,0,pink,.023);
 box(group,.785,.012,.486,0,.184,0,deck,.012);
 box(group,.808,.010,.512,0,.177,0,piping,.006);
 box(group,.776,.010,.475,0,.191,0,deck,.009);
 for(const side of [-1,1])for(const front of [-1,1]){
  box(group,.059,.058,.014,side*.374,.057,front*.258,chrome,.005);
  box(group,.014,.058,.063,side*.406,.057,front*.229,chrome,.005);
  const rivet=cylinder(group,.004,.003,side*.374,.062,front*.267,darkChrome,12);rivet.rotation.x=Math.PI/2;
 }

 // The lid is built around its real rear hinge and leans back within the shelf depth.
 const lid=new THREE.Group();lid.name='Open padded pink lid';lid.position.set(0,.183,-.246);lid.rotation.x=-.14;group.add(lid);
 box(lid,.82,.468,.043,0,.234,0,pink,.021);
 box(lid,.758,.404,.012,0,.235,.026,lining,.012);
 box(lid,.758,.010,.008,0,.440,.034,piping,.003);
 box(lid,.758,.010,.008,0,.030,.034,piping,.003);
 for(const side of [-1,1]){
  box(lid,.010,.413,.008,side*.384,.235,.033,piping,.003);
  box(lid,.063,.014,.052,side*.373,.465,0,chrome,.005);
  box(lid,.016,.048,.052,side*.403,.444,0,chrome,.005);
  const hinge=cylinder(group,.012,.084,side*.273,.183,-.249,chrome);hinge.rotation.z=Math.PI/2;
 }
 box(lid,.047,.042,.009,0,.452,.027,chrome,.004);
 box(lid,.024,.026,.011,0,.452,.033,rubber,.003);
 box(lid,.034,.013,.013,0,.470,.033,darkChrome,.003);
 const wordCanvas=document.createElement('canvas');wordCanvas.width=768;wordCanvas.height=112;
 const wordCtx=wordCanvas.getContext('2d')!;wordCtx.fillStyle='#342e32';wordCtx.textAlign='center';wordCtx.textBaseline='middle';wordCtx.font='600 47px Georgia, serif';wordCtx.fillText('OFF THE CLOCK',384,56);
 const wordMap=new THREE.CanvasTexture(wordCanvas);wordMap.colorSpace=THREE.SRGBColorSpace;textures.push(wordMap);
 const wordmark=mesh(lid,new THREE.PlaneGeometry(.36,.0525),new THREE.MeshBasicMaterial({map:wordMap,transparent:true,depthWrite:false,toneMapped:false}));wordmark.position.set(0,.238,.033);wordmark.castShadow=false;

 // A real stacked platter, vinyl grooves, paper centre and polished spindle.
 cylinder(group,.219,.022,-.132,.210,.005,rubber,96);
 cylinder(group,.213,.009,-.132,.225,.005,vinyl,96);
 const grooves=material('#303039',.46);
 for(const radius of [.075,.094,.111,.127,.143,.158,.172,.184,.195,.204]){
  const ring=mesh(group,new THREE.TorusGeometry(radius,.0007,4,96),grooves);ring.rotation.x=Math.PI/2;ring.position.set(-.132,.230,.005);ring.castShadow=false;
 }
 cylinder(group,.054,.0018,-.132,.231,.005,material('#ead6c6',.89),64);
 cylinder(group,.019,.002,-.132,.232,.005,material('#f54493',.82),40);
 cylinder(group,.005,.028,-.132,.246,.005,chrome,20);
 const spindleTip=mesh(group,new THREE.SphereGeometry(.005,12,8),chrome);spindleTip.position.set(-.132,.260,.005);

 // Tonearm pedestal, metal arm, black cartridge and a small red stylus.
 cylinder(group,.046,.014,.252,.205,-.151,rubber);
 box(group,.060,.050,.069,.252,.232,-.151,deck,.006);
 cylinder(group,.019,.030,.252,.265,-.151,darkChrome,24);
 tube(group,[new THREE.Vector3(.252,.275,-.151),new THREE.Vector3(.249,.273,-.040),new THREE.Vector3(.225,.266,.075),new THREE.Vector3(.187,.246,.137)],.0052,chrome);
 box(group,.030,.013,.044,.252,.275,-.148,rubber,.004);
 const cartridge=box(group,.037,.020,.060,.184,.245,.142,rubber,.004);cartridge.rotation.y=-.44;
 const stylus=box(group,.022,.008,.022,.174,.231,.164,material('#d72354',.43),.002);stylus.rotation.y=-.44;
 const fingerLift=tube(group,[new THREE.Vector3(.197,.250,.144),new THREE.Vector3(.215,.258,.151),new THREE.Vector3(.219,.272,.155)],.0028,darkChrome);fingerLift.castShadow=false;
 // Rest and two controls remain separate shapes so the deck reads in a small cabinet.
 cylinder(group,.005,.036,.262,.217,.030,chrome,16);
 box(group,.029,.009,.014,.262,.238,.030,rubber,.003);
 for(const [z,r] of [[.090,.020],[.173,.026]]){
  cylinder(group,r+.003,.003,.340,.199,z,chrome,32);
  cylinder(group,r,.028,.340,.214,z,rubber,32);
  box(group,.002,.001,.010,.340,.229,z-.009,chrome,.0003);
 }
 for(const x of [-.365,.365])for(const z of [-.213,.213])cylinder(group,.004,.002,x,.197,z,darkChrome,12);

 // Silver speaker grilles on the front, with a shared perforation texture.
 const grilleCanvas=document.createElement('canvas');grilleCanvas.width=384;grilleCanvas.height=192;
 const grilleCtx=grilleCanvas.getContext('2d')!;grilleCtx.beginPath();grilleCtx.roundRect(0,0,384,192,22);grilleCtx.clip();grilleCtx.fillStyle='#cdd0cf';grilleCtx.fillRect(0,0,384,192);grilleCtx.fillStyle='#202427';
 for(let row=0;row<20;row++)for(let col=0;col<40;col++){
  grilleCtx.beginPath();grilleCtx.arc(col*10+(row%2)*5, row*10,3.3,0,Math.PI*2);grilleCtx.fill();
 }
 const grilleMap=new THREE.CanvasTexture(grilleCanvas);grilleMap.colorSpace=THREE.SRGBColorSpace;grilleMap.anisotropy=4;textures.push(grilleMap);
 for(const x of [-.282,.282]){
  box(group,.185,.093,.010,x,.102,.261,chrome,.009);
  const speaker=mesh(group,new THREE.PlaneGeometry(.172,.082),new THREE.MeshStandardMaterial({map:grilleMap,transparent:true,alphaTest:.05,roughness:.53,metalness:.16}));speaker.position.set(x,.102,.267);speaker.castShadow=false;
 }

 // Front clasp and a pink grip hanging from curved silver handle brackets.
 for(const x of [-.122,.122]){
  box(group,.077,.051,.012,x,.122,.264,chrome,.005);
  for(const dx of [-.022,.022]){const screw=cylinder(group,.0035,.003,x+dx,.122,.272,darkChrome,12);screw.rotation.x=Math.PI/2;}
  tube(group,[new THREE.Vector3(x,.135,.276),new THREE.Vector3(x,.093,.289),new THREE.Vector3(x,.038,.325),new THREE.Vector3(x*.78,.026,.327)],.005,chrome);
 }
 box(group,.208,.044,.034,0,.030,.328,pink,.010);
 box(group,.052,.054,.010,0,.135,.264,chrome,.005);
 box(group,.030,.034,.012,0,.137,.271,lining,.003);
 box(group,.034,.013,.013,0,.161,.275,darkChrome,.003);
 box(group,.040,.008,.013,0,.118,.275,chrome,.002);

 // A soft local shadow keeps the small feet visually connected to the shelf.
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;
 const shadowCtx=shadowCanvas.getContext('2d')!,gradient=shadowCtx.createRadialGradient(64,64,12,64,64,64);gradient.addColorStop(0,'rgba(27,43,52,.25)');gradient.addColorStop(1,'rgba(27,43,52,0)');shadowCtx.fillStyle=gradient;shadowCtx.fillRect(0,0,128,128);
 const shadowMap=new THREE.CanvasTexture(shadowCanvas);textures.push(shadowMap);
 const shadow=mesh(group,new THREE.PlaneGeometry(.85,.58),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.001;shadow.castShadow=false;shadow.receiveShadow=false;shadow.raycast=()=>{};
 return {group,textures};
}
