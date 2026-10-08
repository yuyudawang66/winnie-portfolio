import * as THREE from 'three';
import {softMaterial,softMesh,softOval,softBox,softPlate,softCord} from './soft-props';

function contactShadow(parent:THREE.Group,textures:THREE.Texture[],width:number,depth:number){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d')!;
 const gradient=ctx.createRadialGradient(64,64,12,64,64,62);gradient.addColorStop(0,'rgba(43,57,66,.24)');gradient.addColorStop(1,'rgba(43,57,66,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
 const map=new THREE.CanvasTexture(canvas);textures.push(map);
 const shadow=softMesh(parent,new THREE.PlaneGeometry(width,depth),new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.001;shadow.castShadow=false;shadow.raycast=()=>{};
}

// All props use a local floor at y = 0, with rounded surfaces matching the CRT and turntable.
export function createKittyCup(){
 const group=new THREE.Group();group.name='奶白粉色 Kitty 水杯';const textures:THREE.Texture[]=[];
 const ivory=softMaterial('#fffaf0',.48),pink=softMaterial('#f1bdd0',.52),rose=softMaterial('#e77599',.52),ink=softMaterial('#574344',.76),yellow=softMaterial('#e8bf55',.55);
 const lathe=(points:number[][],material:THREE.Material)=>softMesh(group,new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),64),material);
 // A rolled base and a softly bulging ceramic body, rather than a straight sharp cylinder.
 lathe([[0,0],[.095,0],[.118,.006],[.136,.022],[.142,.047],[.145,.09],[.148,.27],[.144,.333],[.132,.351],[0,.351]],ivory);
 lathe([[0,.343],[.144,.343],[.159,.348],[.169,.359],[.171,.371],[.164,.385],[.143,.395],[.134,.418],[.113,.435],[.073,.440],[0,.440]],pink);
 const handle=softCord(group,[new THREE.Vector3(.128,.284,0),new THREE.Vector3(.220,.282,0),new THREE.Vector3(.259,.218,0),new THREE.Vector3(.244,.148,0),new THREE.Vector3(.193,.106,0),new THREE.Vector3(.129,.113,0)],.026,pink);handle.name='Rounded pink cup handle';
 softOval(group,.132,.285,0,.035,.037,.030,pink);softOval(group,.134,.114,0,.032,.035,.029,pink);

 // Kitty's continuous oval face and small rounded ears form the sculpted lid topper.
 const head=new THREE.Group();head.position.set(0,.506,.008);group.add(head);
 softOval(head,0,0,0,.139,.102,.104,ivory);
 for(const side of [-1,1]){
  const ear=new THREE.Shape();ear.moveTo(-.043,-.023);ear.quadraticCurveTo(-.047,.036,-.025,.061);ear.quadraticCurveTo(-.011,.072,.007,.047);ear.lineTo(.040,-.022);ear.closePath();
  const piece=softPlate(head,ear,ivory,.075,.012);piece.position.set(side*.089,.059,-.037);piece.rotation.z=-side*.14;
  softOval(head,side*.064,-.022,.091,.010,.014,.006,ink);
  for(let j=0;j<3;j++){
   const points=[.095,.112,.128].map((x,k)=>{
    const y=.005-j*.019+(k-1)*(1-j)*.008;
    return new THREE.Vector3(side*x,y,.104*Math.sqrt(Math.max(.02,1-(x/.139)**2-(y/.102)**2))+.002);
   });softCord(head,points,.0023,ink);
  }
 }
 softOval(head,0,-.041,.099,.014,.009,.006,yellow);
 const bow=new THREE.Group();bow.position.set(.085,.071,.077);bow.rotation.z=-.32;head.add(bow);
 for(const side of [-1,1]){const loop=softOval(bow,side*.034,0,0,.036,.042,.023,rose);loop.rotation.z=side*.33;}
 softOval(bow,0,0,.015,.024,.025,.022,rose);
 // The pale pink straw and its tether peek out behind the topper.
 softCord(group,[new THREE.Vector3(-.075,.411,-.061),new THREE.Vector3(-.095,.532,-.061),new THREE.Vector3(-.121,.656,-.061)],.012,pink);
 const cap=softBox(group,.043,.092,.040,-.121,.644,-.061,pink,.019);cap.rotation.z=.20;
 softCord(group,[new THREE.Vector3(-.120,.605,-.064),new THREE.Vector3(-.169,.557,-.061),new THREE.Vector3(-.148,.499,-.062),new THREE.Vector3(-.097,.508,-.061)],.005,pink);

 // Sparse small motifs wrap the actual ceramic, keeping the cup legible at cabinet scale.
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#fffaf0';ctx.fillRect(0,0,1024,512);
 function littleKitty(x:number,y:number,s:number){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle='#967b8b';ctx.fillStyle='#fffdf7';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(-37,-9);ctx.lineTo(-35,-34);ctx.quadraticCurveTo(-30,-44,-12,-26);ctx.quadraticCurveTo(0,-30,15,-25);ctx.quadraticCurveTo(34,-43,38,-28);ctx.lineTo(39,-6);ctx.bezierCurveTo(47,35,-44,37,-37,-9);ctx.fill();ctx.stroke();
  ctx.fillStyle='#685560';for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(side*18,6,3,4,0,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#e6bd63';ctx.beginPath();ctx.ellipse(0,13,4,3,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#e993b0';for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(22+side*8,-22,11,9,side*.4,0,Math.PI*2);ctx.fill();}ctx.beginPath();ctx.arc(22,-22,5,0,Math.PI*2);ctx.fill();ctx.restore();
 }
 for(const [x,y,s]of [[245,161,.85],[521,151,1.1],[780,179,.82],[109,317,.65],[373,332,.68],[677,340,.68],[927,315,.68]])littleKitty(x,y,s);
 ctx.fillStyle='#e9aac1';for(const [x,y]of [[139,124],[373,228],[671,98],[891,245],[505,347]]){for(let p=0;p<5;p++){const a=p/5*Math.PI*2;ctx.beginPath();ctx.arc(x+Math.cos(a)*7,y+Math.sin(a)*7,5,0,Math.PI*2);ctx.fill();}}
 ctx.textAlign='center';ctx.font='600 35px Georgia';ctx.fillStyle='#cd829e';ctx.fillText('Hello Kitty',512,454);
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;textures.push(map);
 const print=softMesh(group,new THREE.CylinderGeometry(.1483,.1465,.247,64,1,true),new THREE.MeshStandardMaterial({map,roughness:.6}));print.position.y=.195;print.rotation.y=Math.PI;print.castShadow=false;
 contactShadow(group,textures,.43,.36);
 return {group,textures};
}
