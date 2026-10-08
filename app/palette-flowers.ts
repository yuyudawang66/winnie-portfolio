import * as THREE from 'three';

type FlowerColors={large?:string[];small?:string[];layout?:'palette'|'basket'};

// The original palette flowers, shared with the basket so petal shape and finish stay identical.
export function createPaletteFlowers(colors:FlowerColors={}){
 const group=new THREE.Group();group.name='Palette flower cluster';
 const largeColors=colors.large??['#f8f3da','#fff0ca'];
 const smallColors=colors.small??['#a4c4e5','#86aed7','#bbd0e9'];
 const petalGeometry=new THREE.SphereGeometry(1,16,12),pp=petalGeometry.attributes.position;
 for(let i=0;i<pp.count;i++){
  const x=pp.getX(i),y=pp.getY(i),z=pp.getZ(i);
  pp.setXYZ(i,x*(.80+.20*y),y,z+.22*y*y);
 }
 petalGeometry.computeVertexNormals();
 type Oval={x:number;y:number;z:number;sx:number;sy:number;sz:number;rotation:number;color:string;orientation?:THREE.Quaternion};
 const petals:Oval[]=[],centers:Oval[]=[],leaves:Oval[]=[];
 function flower(x:number,y:number,z:number,radius:number,color:string,count:number,rotation:number,tiltX=0,tiltY=0){
  const orientation=new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltX,tiltY,0));
  function place(items:Oval[],item:Oval){
   if(tiltX||tiltY){
    const offset=new THREE.Vector3(item.x-x,item.y-y,item.z-z).applyQuaternion(orientation);item.x=x+offset.x;item.y=y+offset.y;item.z=z+offset.z;
    item.orientation=orientation.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),item.rotation));
   }
   items.push(item);
  }
  for(let i=0;i<count;i++){
   const a=rotation+i/count*Math.PI*2;
   place(petals,{x:x+Math.sin(a)*radius*.43,y:y+Math.cos(a)*radius*.43,z:z+.003*(i%2),sx:radius*(count===5?.43:.29),sy:radius*.64,sz:radius*.13,rotation:-a,color});
  }
  place(centers,{x,y,z:z+.019,sx:radius*.18,sy:radius*.18,sz:radius*.10,rotation:0,color:count===5?'#e3ba78':'#ecd694'});
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;place(centers,{x:x+Math.sin(a)*radius*.16,y:y+Math.cos(a)*radius*.16,z:z+.023,sx:radius*.038,sy:radius*.038,sz:radius*.04,rotation:0,color:'#f3ddb2'});}
 }
 const basket=colors.layout==='basket';
 // The basket arranges the same blooms in a rounded volume, with flowers facing up and sideways.
 const largeFlowers=basket?[
  [-.105,.700,-.050,.112,-.40,-.35],[.100,.720,-.050,.115,-.50,.40],[0,.810,-.025,.112,-.68,0],
  [-.20,.575,-.055,.096,-.20,-.90],[.205,.565,-.040,.096,-.22,.90],
  [-.13,.580,.055,.128,-.18,-.35],[.12,.605,.055,.133,-.25,.35],
  [-.095,.440,.150,.118,-.10,-.25],[.110,.435,.135,.115,-.10,.30],
  [.015,.565,.170,.130,-.20,.05],[-.025,.328,.170,.095,-.15,0],
 ]:[[-.29,.98,.065,.145],[-.08,1.15,.083,.15], [.09,.96,.065,.15],[-.39,.82,.083,.11],[.35,.93,.065,.115]];
 largeFlowers.forEach(([x,y,z,r,tiltX=0,tiltY=0],i)=>flower(x,y,z,r,largeColors[i%largeColors.length],5,.23+i*.67,tiltX,tiltY));
 const smallClusters=basket?[[-.20,.68,-.015,-.38,-.6],[.20,.71,-.005,-.45,.6],[-.22,.40,.09,-.15,-.4],[.22,.39,.065,-.1,.5],[0,.72,.08,-.6,0],[.03,.42,.18,-.1,0]]:[[-.36,1.13,.065],[-.04,.91,.065],[.22,1.16,.065],[.42,1.08,.065]];
 smallClusters.forEach(([x,y,z,tiltX=0,tiltY=0],cluster)=>{
  for(let i=0;i<5;i++){
   const a=i*2.4+cluster,r=i===0?0:basket?.040:.058;
   flower(x+Math.cos(a)*r,y+Math.sin(a)*r,z+i*.008,basket?.040:.055,smallColors[i%smallColors.length],5,a,tiltX,tiltY);
  }
 });
 const leafPositions=basket?[[-.19,.44,-.8],[-.09,.64,.5],[.18,.60,-.7],[.23,.42,-1.1],[.13,.30,.8],[-.18,.27,.65],[-.19,.81,-.45],[.16,.80,.6]]:[[-.43,1.04,-.8],[-.18,1.24,.5],[.34,1.19,-.7],[.47,.97,-1.1],[.20,.91,.8],[-.42,.74,.65]];
 for(const [x,y,r] of leafPositions){
  leaves.push({x,y,z:basket?.014:.042,sx:basket?.021:.031,sy:basket?.067:.099,sz:.008,rotation:r,color:'#9aa777'});
 }
 const matrix=new THREE.Matrix4(),quaternion=new THREE.Quaternion(),position=new THREE.Vector3(),scale=new THREE.Vector3();
 function instances(name:string,items:Oval[],geometry:THREE.BufferGeometry,roughness:number){
  const mesh=new THREE.InstancedMesh(geometry,new THREE.MeshStandardMaterial({color:'#ffffff',roughness,metalness:0}),items.length);mesh.name=name;
  items.forEach((item,i)=>{
   position.set(item.x,item.y,item.z);scale.set(item.sx,item.sy,item.sz);if(item.orientation)quaternion.copy(item.orientation);else quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1),item.rotation);matrix.compose(position,quaternion,scale);
   mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new THREE.Color(item.color));
  });
  mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
 }
 instances('Sage leaves',leaves,petalGeometry,.85);instances('Rounded five-petal flowers',petals,petalGeometry,.78);instances('Flower stamens',centers,new THREE.SphereGeometry(1,10,8),.72);
 return group;
}
