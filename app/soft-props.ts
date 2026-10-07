import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// Shared satin materials and rolled edges keep the small handmade objects in one style.
export const softMaterial=(color:string,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
export function softMesh(parent:THREE.Object3D,geometry:THREE.BufferGeometry,material:THREE.Material){
 const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function softOval(parent:THREE.Object3D,x:number,y:number,z:number,rx:number,ry:number,rz:number,material:THREE.Material){
 const mesh=softMesh(parent,new THREE.SphereGeometry(1,28,20),material);mesh.position.set(x,y,z);mesh.scale.set(rx,ry,rz);return mesh;
}
export function softBox(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.Material,r=.03){
 const mesh=softMesh(parent,new RoundedBoxGeometry(w,h,d,5,Math.min(r,w/2,h/2,d/2)),material);mesh.position.set(x,y,z);return mesh;
}
export function softPlate(parent:THREE.Object3D,shape:THREE.Shape,material:THREE.Material,depth=.05,bevel=.012){
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:depth-2*bevel,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:5,curveSegments:24,steps:1});
 geometry.translate(0,0,bevel);return softMesh(parent,geometry,material);
}
export function softCord(parent:THREE.Object3D,points:THREE.Vector3[],radius:number,material:THREE.Material){
 return softMesh(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),48,radius,8,false),material);
}
export function softText(parent:THREE.Object3D,text:string,w:number,h:number,color:string,textures:THREE.Texture[],font='500 78px "PingFang SC", "Microsoft YaHei", sans-serif'){
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=192;const ctx=canvas.getContext('2d')!;
 ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=font;ctx.fillText(text,384,96,700);
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;textures.push(map);
 const mesh=softMesh(parent,new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map,transparent:true,depthWrite:false,roughness:.85}));mesh.castShadow=false;return mesh;
}
export function softBow(parent:THREE.Object3D,x:number,y:number,z:number,scale:number,material:THREE.Material){
 const bow=new THREE.Group();bow.position.set(x,y,z);bow.scale.setScalar(scale);parent.add(bow);
 for(const side of [-1,1]){
  const loop=softOval(bow,side*.112,.008,0,.13,.078,.038,material);loop.rotation.z=side*.25;
  const tail=softBox(bow,.066,.158,.025,side*.053,-.092,-.006,material,.018);tail.rotation.z=side*.3;
 }
 softOval(bow,0,0,.029,.040,.049,.037,material);return bow;
}
