import * as THREE from 'three';
import {softMaterial,softMesh,softOval,softBox,softPlate,softCord} from './soft-props';

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
