import * as THREE from 'three';
import {softMaterial,softMesh,softOval,softBox,softPlate,softCord} from './soft-props';

// A small sculpted CRT desktop: rounded ivory shell, curved glass and separate keyboard.
// y = 0 is the underside of the stand and keyboard, for direct shelf placement.
export function createProjectComputer(){
 const group=new THREE.Group();group.name='奶白色复古电脑 · 个人项目';const textures:THREE.Texture[]=[];
 const ivory=softMaterial('#fffaf2',.58),rim=softMaterial('#ede9e0',.69),keys=softMaterial('#fffdf7',.7),recess=softMaterial('#c7c6c1',.79),dark=softMaterial('#70757d',.7);
 function roundedRect(w:number,h:number,r:number){
  const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);s.closePath();return s;
 }
 // Broad, softly rounded plinth and a short support, like the reference desktop.
 softBox(group,.57,.048,.31,0,.024,-.072,ivory,.023);
 softBox(group,.24,.115,.15,0,.099,-.09,rim,.045);
 const monitor=new THREE.Group();monitor.name='Rounded CRT monitor';monitor.position.set(0,.148,-.052);monitor.rotation.x=-.045;group.add(monitor);
 softBox(monitor,.93,.660,.416,0,.336,-.061,ivory,.108);
 // Slightly smaller rear housing provides the characteristic deep CRT silhouette.
 softBox(monitor,.71,.50,.15,0,.346,-.213,rim,.069);
 for(const side of [-1,1])for(let i=0;i<5;i++){
  softBox(monitor,.006,.058,.008,side*.453,.32+i*.034,-.085,dark,.003);
 }
 // A real opening in the bezel surrounds the inset curved screen.
 const bezelShape=roundedRect(.872,.593,.087),screenOpening=roundedRect(.753,.463,.068);bezelShape.holes.push(screenOpening);
 const bezel=softPlate(monitor,bezelShape,ivory,.060,.022);bezel.position.set(0,.357,.142);
 const screenBack=softPlate(monitor,roundedRect(.770,.480,.072),softMaterial('#777b80'),.020,.008);screenBack.position.set(0,.357,.150);

 // Text stays on the actual glass, with a restrained glow and a tiny desktop status bar.
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=640;const ctx=canvas.getContext('2d')!;
 const background=ctx.createLinearGradient(0,0,1024,640);background.addColorStop(0,'#3b414b');background.addColorStop(.6,'#272f3b');background.addColorStop(1,'#343344');ctx.fillStyle=background;ctx.fillRect(0,0,1024,640);
 ctx.fillStyle='rgba(234,231,240,.20)';ctx.fillRect(90,118,844,2);
 for(const [i,c]of ['#e6bccb','#e6d3ad','#b9d8d2'].entries()){ctx.fillStyle=c;ctx.beginPath();ctx.arc(105+i*32,82,7,0,Math.PI*2);ctx.fill();}
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='500 146px "PingFang SC", "Microsoft YaHei", sans-serif';ctx.fillStyle='#f8eaf2';ctx.shadowColor='rgba(222,175,211,.58)';ctx.shadowBlur=18;ctx.fillText('个人项目',512,312);ctx.shadowBlur=0;
 ctx.font='400 27px ui-monospace, monospace';ctx.fillStyle='#b8c5ce';ctx.fillText('SELECTED WORK  /  01—04',512,459);
 // The highlight and curvature give the glass volume without making the screen look glossy plastic.
 const sheen=ctx.createRadialGradient(260,20,10,260,20,580);sheen.addColorStop(0,'rgba(234,244,250,.09)');sheen.addColorStop(1,'rgba(234,244,250,0)');ctx.fillStyle=sheen;ctx.fillRect(0,0,1024,640);
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;textures.push(map);
 const width=.741,height=.451,radius=.063,positions:number[]=[],uvs:number[]=[],indices:number[]=[],nx=40,ny=28;
 for(let j=0;j<=ny;j++){
  const y=(j/ny-.5)*height,dy=Math.max(0,Math.abs(y)-(height/2-radius)),halfWidth=width/2-radius+Math.sqrt(Math.max(0,radius*radius-dy*dy));
  for(let i=0;i<=nx;i++){
   const x=(i/nx*2-1)*halfWidth,z=.174+.031*(1-(x/(width/2))**2)*(1-(y/(height/2))**2);
   positions.push(x,y+.357,z);uvs.push(x/width+.5,y/height+.5);
  }
 }
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const k=j*(nx+1)+i;indices.push(k,k+1,k+nx+1,k+1,k+nx+2,k+nx+1);}
 const glassGeometry=new THREE.BufferGeometry();glassGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));glassGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));glassGeometry.setIndex(indices);glassGeometry.computeVertexNormals();
 const screen=softMesh(monitor,glassGeometry,new THREE.MeshBasicMaterial({map,toneMapped:false}));screen.name='个人项目';screen.castShadow=false;
 softBox(monitor,.087,.005,.003,-.322,.057,.149,recess,.002);
 const power=softMesh(monitor,new THREE.CylinderGeometry(.015,.015,.008,24),rim);power.rotation.x=Math.PI/2;power.position.set(.334,.057,.151);
 softOval(monitor,.285,.056,.151,.005,.005,.003,softMaterial('#a8cbbb'));

 // White sculpted keycaps sit above a shallow gray well; the front edge rests on the shelf.
 const keyboard=new THREE.Group();keyboard.name='Ivory keyboard';keyboard.position.set(-.042,0,.174);group.add(keyboard);
 softBox(keyboard,.83,.043,.225,0,.0215,0,ivory,.019);
 softBox(keyboard,.768,.009,.167,0,.046,-.008,recess,.004);
 for(let row=0;row<3;row++)for(let col=0;col<12;col++){
  const key=softBox(keyboard,.049,.018,.032,-.343+col*.062,.057,-.061+row*.043,keys,.007);
  if(row===0&&col===0)key.material=rim;
 }
 for(const x of [-.326,-.264,.253,.316])softBox(keyboard,.050,.018,.027,x,.057,.068,keys,.006);
 softBox(keyboard,.378,.018,.028,-.005,.057,.068,keys,.008);
 // A small pill-shaped mouse and loose cable finish the desktop without crowding the clock.
 const mouse=new THREE.Group();mouse.name='Ivory mouse';mouse.position.set(.48,0,.19);mouse.rotation.y=-.12;group.add(mouse);
 softBox(mouse,.11,.037,.151,0,.0185,0,ivory,.018);
 softOval(mouse,0,.030,-.008,.054,.022,.069,ivory);
 softBox(mouse,.0015,.002,.042,0,.051,-.022,recess,.0006);
 softBox(mouse,.010,.008,.021,0,.050,-.030,rim,.004);
 softCord(group,[new THREE.Vector3(.48,.020,.115),new THREE.Vector3(.518,.032,.035),new THREE.Vector3(.455,.043,-.035),new THREE.Vector3(.33,.045,-.071)],.004,rim);
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const shadowCtx=shadowCanvas.getContext('2d')!,gradient=shadowCtx.createRadialGradient(64,64,8,64,64,64);gradient.addColorStop(0,'rgba(40,52,61,.23)');gradient.addColorStop(1,'rgba(40,52,61,0)');shadowCtx.fillStyle=gradient;shadowCtx.fillRect(0,0,128,128);
 const shadowMap=new THREE.CanvasTexture(shadowCanvas);textures.push(shadowMap);const shadow=softMesh(group,new THREE.PlaneGeometry(1.1,.63),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(.015,.001,-.005);shadow.castShadow=false;shadow.raycast=()=>{};
 return {group,textures,screen};
}
