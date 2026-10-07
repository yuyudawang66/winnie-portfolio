import * as THREE from 'three';
import {softMaterial,softMesh,softOval,softBox,softPlate,softCord,softText} from './soft-props';

export function createProjectBag(){
 const group=new THREE.Group();group.name='樱花粉作品包';const textures:THREE.Texture[]=[];
 const pink=softMaterial('#e3a3bc',.83),piping=softMaterial('#f3c6d5',.8),lining=softMaterial('#b87893',.9),cream=softMaterial('#fff0de',.78),gold=softMaterial('#d5bf98',.42,.32);
 // A continuous padded shell with an actual open mouth and a darker lining.
 const profile=new THREE.CatmullRomCurve3([new THREE.Vector3(.35,.018,.13),new THREE.Vector3(.48,.058,.20),new THREE.Vector3(.535,.18,.238),new THREE.Vector3(.53,.29,.219),new THREE.Vector3(.477,.408,.144)]);
 function shell(inner:boolean){
  const positions:number[]=[],uvs:number[]=[],indices:number[]=[],rings=32,segments=80;
  for(let j=0;j<=rings;j++){
   const p=profile.getPoint(j/rings);
   for(let i=0;i<=segments;i++){
    const a=i/segments*Math.PI*2,shrink=inner?.024:0;
    positions.push((p.x-shrink)*Math.cos(a),p.y+(inner?.012:0)-Math.pow(Math.sin(a),2)*.032*j/rings,(p.z-shrink)*Math.sin(a));uvs.push(i/segments,j/rings);
   }
  }
  for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){const k=j*(segments+1)+i;indices.push(k,k+segments+1,k+1,k+1,k+segments+1,k+segments+2);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
  const m=inner?lining:pink;m.side=THREE.DoubleSide;return softMesh(group,geometry,m);
 }
 shell(false);shell(true);softBox(group,.76,.035,.30,0,.018,0,pink,.017);
 softOval(group,0,.066,0,.40,.026,.15,lining);
 // Rolled zipper edges, tiny cream stitches and gold slider follow the opening.
 for(const side of [-1,1]){
  const points=[];for(let i=0;i<=32;i++){const a=i/32*Math.PI;points.push(new THREE.Vector3(.477*Math.cos(a),.408-.032*Math.sin(a)**2,side*.144*Math.sin(a)));}
  softCord(group,points,.010,piping);
  for(let i=2;i<31;i++){
   const a=i/32*Math.PI;const tooth=softBox(group,.009,.007,.014,.477*Math.cos(a),.411-.032*Math.sin(a)**2,side*.144*Math.sin(a),cream,.003);tooth.rotation.y=a;
  }
 }
 const slider=softBox(group,.044,.014,.033,.39,.406,.078,gold,.006);slider.rotation.y=-.5;
 const pull=softMesh(group,new THREE.TorusGeometry(.023,.005,8,24),gold);pull.position.set(.408,.385,.096);pull.rotation.y=-.5;
 // A softly arched, flat shoulder strap, attached to the ends of the barrel bag.
 const strapPath=new THREE.CatmullRomCurve3([new THREE.Vector3(-.475,.33,-.02),new THREE.Vector3(-.38,.62,-.07),new THREE.Vector3(-.12,.77,-.10),new THREE.Vector3(.16,.73,-.09),new THREE.Vector3(.47,.33,-.02)]);
 const strapSection=new THREE.Shape();strapSection.moveTo(-.028,-.007);strapSection.lineTo(.028,-.007);strapSection.quadraticCurveTo(.034,0,.028,.007);strapSection.lineTo(-.028,.007);strapSection.quadraticCurveTo(-.034,0,-.028,-.007);
 softMesh(group,new THREE.ExtrudeGeometry(strapSection,{steps:60,bevelEnabled:false,extrudePath:strapPath}),pink);
 for(const side of [-1,1]){
  const ring=softMesh(group,new THREE.TorusGeometry(.032,.006,8,28),gold);ring.position.set(side*.478,.332,.023);
  softBox(group,.053,.089,.025,side*.483,.287,.034,piping,.012);
  const seam=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI*2;seam.push(new THREE.Vector3(side*(.43+.056*Math.cos(a)),.217+.153*Math.cos(a),.19*Math.sin(a)));}softCord(group,seam,.004,piping);
 }
 // Quiet polka dots and a small sewn label echo the fabric reference without a large logo.
 for(let row=0;row<3;row++)for(let col=0;col<7;col++){
  const x=-.36+col*.12+(row%2?.04:0),y=.11+row*.075;if(Math.abs(x)<.20&&row===1)continue;
  const z=.238*Math.sqrt(Math.max(0,1-(x/.56)**2))-.003;
  softOval(group,x,y,z,.009,.009,.002,cream);
 }
 softBox(group,.26,.083,.013,0,.207,.235,cream,.006);
 const label=softText(group,'SELECTED WORK',.243,.061,'#a57888',textures,'500 59px Georgia, serif');label.position.set(0,.207,.243);
 // A tiny heart charm hangs from one metal ring.
 const heart=new THREE.Shape();heart.moveTo(0,-.055);heart.bezierCurveTo(-.09,0,-.075,.084,0,.042);heart.bezierCurveTo(.075,.084,.09,0,0,-.055);heart.closePath();
 softCord(group,[new THREE.Vector3(-.476,.315,.06),new THREE.Vector3(-.47,.263,.14),new THREE.Vector3(-.449,.211,.171)],.004,gold);
 const charm=softPlate(group,heart,piping,.027,.007);charm.position.set(-.449,.172,.173);charm.rotation.z=.16;
 // Ground the padded base on the shelf.
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d')!,gradient=ctx.createRadialGradient(64,64,8,64,64,64);gradient.addColorStop(0,'rgba(36,40,56,.25)');gradient.addColorStop(1,'rgba(36,40,56,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
 const map=new THREE.CanvasTexture(canvas);textures.push(map);const shadow=softMesh(group,new THREE.PlaneGeometry(1.13,.53),new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.001;shadow.castShadow=false;shadow.raycast=()=>{};
 return {group,textures,label};
}

export function createIceCreamClock(){
 const group=new THREE.Group();group.name='奶油冰淇淋挂钟';const textures:THREE.Texture[]=[];
 const cream=softMaterial('#f6ebd1'),cone=softMaterial('#ab8068'),waffle=softMaterial('#8c6856'),berry=softMaterial('#b76478'),yellow=softMaterial('#e6bc75'),ink=softMaterial('#63525a');
 const coneShape=new THREE.Shape();coneShape.moveTo(-.184,-.12);coneShape.lineTo(.176,-.12);coneShape.quadraticCurveTo(.085,-.35,.021,-.463);coneShape.quadraticCurveTo(0,-.496,-.022,-.465);coneShape.lineTo(-.184,-.12);
 softPlate(group,coneShape,cone,.043,.010);
 for(const points of [[[-.11,-.21],[.056,-.38]],[[-.026,-.18],[.105,-.30]],[[-.108,-.27],[.087,-.25]],[[-.061,-.36],[.049,-.345]]])softCord(group,points.map(([x,y])=>new THREE.Vector3(x,y,.050)),.006,waffle);
 const scoop=new THREE.Shape();scoop.moveTo(-.253,-.12);scoop.bezierCurveTo(-.344,-.08,-.29,.10,-.227,.17);scoop.bezierCurveTo(-.222,.35,-.075,.386,.023,.329);scoop.bezierCurveTo(.175,.35,.239,.263,.241,.154);scoop.bezierCurveTo(.322,.071,.319,-.105,.235,-.13);scoop.quadraticCurveTo(.17,-.141,.147,-.13);scoop.bezierCurveTo(.147,-.281,.088,-.285,.072,-.195);scoop.bezierCurveTo(.05,-.15,.016,-.163,.003,-.21);scoop.bezierCurveTo(-.045,-.266,-.061,-.143,-.10,-.143);scoop.quadraticCurveTo(-.19,-.14,-.253,-.12);scoop.closePath();
 softPlate(group,scoop,cream,.068,.018);
 softOval(group,.081,.356,.048,.044,.047,.033,berry);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=768;const ctx=canvas.getContext('2d')!;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 72px "Arial Rounded MT Bold", sans-serif';
 for(let n=1;n<=12;n++){if(n===3||n===9)continue;const a=n/12*Math.PI*2;ctx.fillStyle=n===12||n===6?'#ac6172':'#746355';ctx.fillText(String(n),384+Math.sin(a)*263,384-Math.cos(a)*263);}
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;textures.push(map);
 const face=softMesh(group,new THREE.PlaneGeometry(.48,.48),new THREE.MeshStandardMaterial({map,transparent:true,depthWrite:false,roughness:.8}));face.position.set(0,.095,.087);face.castShadow=false;
 for(const side of [-1,1])softOval(group,side*.165,.095,.085,.017,.017,.009,yellow);
 const hands=new THREE.Group();hands.position.set(0,.095,.093);group.add(hands);
 const hour=softBox(hands,.017,.120,.010,0,.045,0,waffle,.005);hour.rotation.z=-.76;hour.position.set(.038,.041,0);
 const minute=softBox(hands,.012,.171,.010,-.069,.025,.010,ink,.004);minute.rotation.z=1.21;
 softOval(hands,0,0,.019,.019,.019,.009,ink);
 return {group,textures};
}
