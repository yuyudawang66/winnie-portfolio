import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// A compact open suitcase player. The rubber feet define y = 0 for shelf placement.
export function createSuitcaseTurntable(){
 const group=new THREE.Group();group.name='Soft pink suitcase record player';
 const textures:THREE.Texture[]=[];
 const material=(color:string,roughness=.6,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const pink=material('#df95ae',.66),lining=material('#efb7c8',.78),piping=material('#f5ced7',.65);
 const cream=material('#f5ebd3',.72),chrome=material('#d1c4a0',.44,.32),darkChrome=material('#9a8b78',.57,.2);
 const rubber=material('#4c4148',.85),deck=material('#50454e',.73),vinyl=material('#272631',.43);
 function mesh(parent:THREE.Object3D,geometry:THREE.BufferGeometry,m:THREE.Material){
  const result=new THREE.Mesh(geometry,m);result.castShadow=true;result.receiveShadow=true;parent.add(result);return result;
 }
 function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material,r=.008){
  const result=mesh(parent,new RoundedBoxGeometry(w,h,d,5,Math.min(r,w/2,h/2,d/2)),m);result.position.set(x,y,z);return result;
 }
 // A broad rounded silhouette independent of thickness, with a softly rolled edge.
 function panel(parent:THREE.Object3D,w:number,h:number,d:number,r:number,x:number,y:number,z:number,m:THREE.Material){
  const bevel=Math.min(.013,d*.3),hw=w/2-bevel,hh=h/2-bevel,corner=r-bevel,shape=new THREE.Shape();
  shape.moveTo(-hw+corner,-hh);shape.lineTo(hw-corner,-hh);shape.quadraticCurveTo(hw,-hh,hw,-hh+corner);
  shape.lineTo(hw,hh-corner);shape.quadraticCurveTo(hw,hh,hw-corner,hh);
  shape.lineTo(-hw+corner,hh);shape.quadraticCurveTo(-hw,hh,-hw,hh-corner);
  shape.lineTo(-hw,-hh+corner);shape.quadraticCurveTo(-hw,-hh,-hw+corner,-hh);shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:d-2*bevel,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:6,curveSegments:16,steps:1});
  geometry.translate(0,0,-d/2+bevel);const result=mesh(parent,geometry,m);result.position.set(x,y,z);return result;
 }
 function cylinder(parent:THREE.Object3D,r:number,h:number,x:number,y:number,z:number,m:THREE.Material,segments=32){
  const result=mesh(parent,new THREE.CylinderGeometry(r,r,h,segments),m);result.position.set(x,y,z);return result;
 }
 function tube(parent:THREE.Object3D,points:THREE.Vector3[],radius:number,m:THREE.Material){
  return mesh(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,radius,8,false),m);
 }
 // Plump matte case and cream rolled rim, echoing the palette's soft sculpted petals.
 for(const x of [-.323,.323])for(const z of [-.177,.177])box(group,.062,.028,.059,x,.014,z,rubber,.013);
 box(group,.84,.196,.54,0,.124,0,pink,.065);
 const rim=panel(group,.790,.483,.039,.066,0,.220,0,piping);rim.rotation.x=-Math.PI/2;
 const deckInset=panel(group,.749,.445,.018,.052,0,.237,0,deck);deckInset.rotation.x=-Math.PI/2;

 // The lid is built around its real rear hinge and leans back within the shelf depth.
 const lid=new THREE.Group();lid.name='Open rounded cushion lid';lid.position.set(0,.216,-.241);lid.rotation.x=-.12;group.add(lid);
 panel(lid,.82,.446,.074,.098,0,.223,0,pink);
 panel(lid,.756,.382,.031,.083,0,.227,.033,piping);
 panel(lid,.715,.341,.034,.076,0,.230,.051,lining);
 for(const side of [-1,1]){
  const hinge=cylinder(group,.018,.080,side*.266,.221,-.243,chrome);hinge.rotation.z=Math.PI/2;
 }
 panel(lid,.054,.032,.016,.014,0,.428,.036,chrome);
 const wordCanvas=document.createElement('canvas');wordCanvas.width=768;wordCanvas.height=112;
 const wordCtx=wordCanvas.getContext('2d')!;wordCtx.fillStyle='#775266';wordCtx.textAlign='center';wordCtx.textBaseline='middle';wordCtx.font='600 47px Georgia, serif';wordCtx.fillText('OFF THE CLOCK',384,56);
 const wordMap=new THREE.CanvasTexture(wordCanvas);wordMap.colorSpace=THREE.SRGBColorSpace;textures.push(wordMap);
 const wordmark=mesh(lid,new THREE.PlaneGeometry(.36,.0525),new THREE.MeshBasicMaterial({map:wordMap,transparent:true,depthWrite:false,toneMapped:false}));wordmark.position.set(0,.230,.069);wordmark.castShadow=false;

 const mechanism=new THREE.Group();mechanism.name='Record and tonearm';mechanism.position.y=.048;group.add(mechanism);
 // A real stacked platter, vinyl grooves, paper centre and polished spindle.
 cylinder(mechanism,.219,.022,-.132,.210,.005,rubber,96);
 cylinder(mechanism,.213,.009,-.132,.225,.005,vinyl,96);
 const grooves=material('#303039',.46);
 for(const radius of [.075,.094,.111,.127,.143,.158,.172,.184,.195,.204]){
  const ring=mesh(mechanism,new THREE.TorusGeometry(radius,.0007,4,96),grooves);ring.rotation.x=Math.PI/2;ring.position.set(-.132,.230,.005);ring.castShadow=false;
 }
 cylinder(mechanism,.054,.0018,-.132,.231,.005,cream,64);
 cylinder(mechanism,.019,.002,-.132,.232,.005,lining,40);
 cylinder(mechanism,.005,.028,-.132,.246,.005,chrome,20);
 const spindleTip=mesh(mechanism,new THREE.SphereGeometry(.005,12,8),chrome);spindleTip.position.set(-.132,.260,.005);

 // Tonearm pedestal, metal arm, black cartridge and a small red stylus.
 cylinder(mechanism,.046,.014,.252,.205,-.151,rubber);
 box(mechanism,.060,.050,.069,.252,.232,-.151,deck,.006);
 cylinder(mechanism,.019,.030,.252,.265,-.151,darkChrome,24);
 tube(mechanism,[new THREE.Vector3(.252,.275,-.151),new THREE.Vector3(.249,.273,-.040),new THREE.Vector3(.225,.266,.075),new THREE.Vector3(.187,.246,.137)],.0052,chrome);
 box(mechanism,.030,.013,.044,.252,.275,-.148,rubber,.004);
 const cartridge=box(mechanism,.037,.020,.060,.184,.245,.142,rubber,.004);cartridge.rotation.y=-.44;
 const stylus=box(mechanism,.022,.008,.022,.174,.231,.164,material('#bc667e',.54),.002);stylus.rotation.y=-.44;
 const fingerLift=tube(mechanism,[new THREE.Vector3(.197,.250,.144),new THREE.Vector3(.215,.258,.151),new THREE.Vector3(.219,.272,.155)],.0028,darkChrome);fingerLift.castShadow=false;
 // Rest and two controls remain separate shapes so the deck reads in a small cabinet.
 cylinder(mechanism,.005,.036,.262,.217,.030,chrome,16);
 box(mechanism,.029,.009,.014,.262,.238,.030,rubber,.003);
 for(const [z,r] of [[.090,.020],[.173,.026]]){
  cylinder(mechanism,r+.003,.003,.340,.199,z,chrome,32);
  cylinder(mechanism,r,.028,.340,.214,z,rubber,32);
  box(mechanism,.002,.001,.010,.340,.229,z-.009,chrome,.0003);
 }
 for(const x of [-.365,.365])for(const z of [-.213,.213])cylinder(mechanism,.004,.002,x,.197,z,darkChrome,12);

 // Cream oval speaker surrounds and recessed rounded slots replace sharp metal grilles.
 const speakerInset=material('#b7a992',.82);
 for(const x of [-.282,.282]){
  panel(group,.177,.112,.018,.045,x,.126,.261,cream);
  panel(group,.148,.077,.008,.030,x,.126,.272,speakerInset);
  for(let i=-2;i<=2;i++){
   const height=i===-2||i===2?.041:.057;
   panel(group,.008,height,.005,.004,x+i*.022,.126,.278,cream);
  }
 }

 // A thick pill-shaped grip with small, smoothly curved satin-metal brackets.
 for(const x of [-.110,.110]){
  panel(group,.049,.047,.015,.019,x,.145,.267,chrome);
  tube(group,[new THREE.Vector3(x,.150,.277),new THREE.Vector3(x,.105,.303),new THREE.Vector3(x*.88,.058,.330)],.009,chrome);
 }
 box(group,.230,.063,.051,0,.047,.325,piping,.024);
 panel(group,.044,.058,.017,.017,0,.162,.270,chrome);
 panel(group,.025,.034,.010,.010,0,.164,.283,cream);

 // A soft local shadow keeps the small feet visually connected to the shelf.
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;
 const shadowCtx=shadowCanvas.getContext('2d')!,gradient=shadowCtx.createRadialGradient(64,64,12,64,64,64);gradient.addColorStop(0,'rgba(27,43,52,.25)');gradient.addColorStop(1,'rgba(27,43,52,0)');shadowCtx.fillStyle=gradient;shadowCtx.fillRect(0,0,128,128);
 const shadowMap=new THREE.CanvasTexture(shadowCanvas);textures.push(shadowMap);
 const shadow=mesh(group,new THREE.PlaneGeometry(.85,.58),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.001;shadow.castShadow=false;shadow.receiveShadow=false;shadow.raycast=()=>{};
 return {group,textures};
}
