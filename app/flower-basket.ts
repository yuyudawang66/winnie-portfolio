import * as THREE from 'three';
import {softMaterial,softMesh,softOval,softCord} from './soft-props';
import {createPaletteFlowers} from './palette-flowers';

// The palette’s rounded flowers in lavender, blue and ivory; local basket floor is y = 0.
export function createFlowerBasket(){
 const group=new THREE.Group();group.name='奶黄色花篮 · 浅紫花朵';const textures:THREE.Texture[]=[];
 const wicker=softMaterial('#ffffff',.94),rim=softMaterial('#eddbad',.88),leafMaterial=softMaterial('#94a27b',.85),stemMaterial=softMaterial('#83936c',.86),ribbon=softMaterial('#fff5da',.76);
 // Fine woven threads are part of the material, so the basket stays softly shaded at small sizes.
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#ead7a7';ctx.fillRect(0,0,512,256);
 for(let row=-1;row<17;row++)for(let col=-1;col<33;col++){
  const x=col*16+(row%2)*8,y=row*16;
  ctx.strokeStyle=row%2?'#d5c08e':'#f8e9c1';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-5,y+8);ctx.quadraticCurveTo(x+2,y+1,x+10,y+8);ctx.stroke();
  ctx.strokeStyle='rgba(255,242,218,.28)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-4,y+6);ctx.quadraticCurveTo(x+2,y,x+9,y+6);ctx.stroke();
 }
 const weave=new THREE.CanvasTexture(canvas);weave.colorSpace=THREE.SRGBColorSpace;textures.push(weave);wicker.map=weave;wicker.bumpMap=weave;wicker.bumpScale=.0015;
 const profile=[[0,0],[.127,0],[.143,.008],[.151,.024],[.167,.188],[.172,.227],[.163,.243],[.149,.236],[.145,.216],[0,.214]].map(([r,y])=>new THREE.Vector2(r,y));
 softMesh(group,new THREE.LatheGeometry(profile,64),wicker);
 for(const y of [.022,.224,.237]){
  const roll=softMesh(group,new THREE.TorusGeometry(y<.1?.147:.166,.006,8,64),rim);roll.rotation.x=Math.PI/2;roll.position.y=y;
 }
 softOval(group,0,.232,0,.154,.028,.143,leafMaterial);

 // Reuse the complete palette flower model, including the broad petals and clustered small blooms.
 const blooms=createPaletteFlowers({layout:'basket',large:['#c2a9dc','#eee5f5','#b9a0d5','#fff1df','#c5b0df'],small:['#bba5dc','#b6cee6','#d6c4e9']});
 blooms.name='Palette flowers in lavender';group.add(blooms);
 // Short stems connect the rounded flower mound to the basket behind the petals.
 for(const [x,y]of [[-.15,.52],[-.09,.68],[.0,.78],[.10,.69],[.16,.53],[.08,.42]]){
  softCord(group,[new THREE.Vector3(x*.4,.226,.008),new THREE.Vector3(x*.7,.31,.030),new THREE.Vector3(x,y,.070)],.006,stemMaterial);
 }

 // A soft satin bow on the front-left of the basket, with gently curling ribbon tails.
 const bow=new THREE.Group();bow.position.set(-.063,.200,.153);bow.rotation.z=.20;group.add(bow);
 for(const side of [-1,1]){const loop=softOval(bow,side*.041,.003,0,.048,.024,.011,ribbon);loop.rotation.z=side*.35;}
 softOval(bow,0,0,.012,.015,.018,.016,ribbon);
 for(const side of [-1,1]){
  const positions:number[]=[],indices:number[]=[];
  for(let i=0;i<=16;i++){const t=i/16,y=-t*.147,x=side*(.010+t*.038+Math.sin(t*4)*.012),z=.006+Math.sin(t*Math.PI)*.016;positions.push(x-.014,y,z,x+.014,y,z);if(i<16){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();const material=ribbon.clone();material.side=THREE.DoubleSide;softMesh(bow,geo,material);
 }
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const sx=shadowCanvas.getContext('2d')!,gradient=sx.createRadialGradient(64,64,12,64,64,62);gradient.addColorStop(0,'rgba(45,53,55,.27)');gradient.addColorStop(1,'rgba(45,53,55,0)');sx.fillStyle=gradient;sx.fillRect(0,0,128,128);const shadowMap=new THREE.CanvasTexture(shadowCanvas);textures.push(shadowMap);const shadow=softMesh(group,new THREE.PlaneGeometry(.48,.41),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.001;shadow.castShadow=false;shadow.raycast=()=>{};
 return {group,textures};
}
