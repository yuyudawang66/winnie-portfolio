import * as THREE from 'three';

// One continuous pear-shaped body follows the reference's squat silhouette.
// There is no separate head sphere or neck seam.
export function createXuegaoBird(){
 const bird=new THREE.Group();bird.name='Xuegao';
 const plumage=new THREE.Group();bird.add(plumage);
 const material=(color:string,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
 const lavender=material('#b6a0d2'),wingMaterial=material('#b2a0cf');
 const peach=material('#dfaa93',.65),feet=material('#c99fa1');
 const eyeMaterial=material('#30282b',.3),white=material('#fffdf5',.4);
 const sphereGeometry=new THREE.SphereGeometry(1,40,32);
 function oval(parent:THREE.Object3D,m:THREE.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number){
  const mesh=new THREE.Mesh(sphereGeometry,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 }
 const bodyGeometry=new THREE.SphereGeometry(1,64,48),positions=bodyGeometry.attributes.position;
 const colors=new Float32Array(positions.count*3),ivory=new THREE.Color('#f9f3e5'),violet=new THREE.Color('#b19bce'),color=new THREE.Color();
 for(let i=0;i<positions.count;i++){
  const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
  positions.setXYZ(i,x*.266*(1-.17*y),.256+y*.246,z*.224*(1-.1*y)+.018*(1-y*y));
  // White forehead and breast flow into a lavender back on the same surface.
  const back=1-THREE.MathUtils.smoothstep(z,-.38,.18);
  const belowHead=1-THREE.MathUtils.smoothstep(y,.30,.68);
  color.copy(ivory).lerp(violet,back*belowHead);color.toArray(colors,i*3);
 }
 bodyGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3));bodyGeometry.computeVertexNormals();
 const body=new THREE.Mesh(bodyGeometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88,metalness:0}));body.castShadow=true;body.receiveShadow=true;plumage.add(body);
 // Shallow folded wings hug the sides; a tiny tail points backwards.
 for(const side of [-1,1]){
  const wing=oval(plumage,wingMaterial,side*.235,.233,-.039,.029,.086,.125);
  wing.rotation.x=-.40;wing.rotation.z=side*.12;
 }
 const tail=oval(plumage,lavender,0,.097,-.231,.048,.024,.102);tail.rotation.x=.19;
 const eyes:THREE.Group[]=[];
 for(const side of [-1,1]){
  const eye=new THREE.Group();eye.position.set(side*.100,.342,.200);eye.rotation.y=side*.39;eye.rotation.x=-.22;plumage.add(eye);eyes.push(eye);
  oval(eye,eyeMaterial,0,0,0,.019,.023,.008);
  oval(eye,white,-.004,.007,.007,.004,.0045,.002);
 }
 // A small rounded peach triangle, nestled between the two dot eyes.
 const beakGeometry=new THREE.SphereGeometry(1,32,24),beakPositions=beakGeometry.attributes.position;
 for(let i=0;i<beakPositions.count;i++){
  const y=beakPositions.getY(i);
  beakPositions.setXYZ(i,beakPositions.getX(i)*.029*(.76+.24*y),y*.023,beakPositions.getZ(i)*.018);
 }
 beakGeometry.computeVertexNormals();
 const beak=new THREE.Mesh(beakGeometry,peach);beak.position.set(0,.316,.233);beak.rotation.x=.2;beak.castShadow=true;plumage.add(beak);
 // The belly covers the legs, leaving just two tiny pairs of toes visible.
 for(const side of [-1,1]){
  oval(bird,feet,side*.082,.023,.065,.018,.023,.026);
  for(const toe of [-1,1])oval(bird,feet,side*.082+toe*.010,.016,.083,.009,.010,.022);
 }
 bird.scale.setScalar(.80);bird.rotation.y=-.28;
 return {bird,animate(time:number,reduced:boolean){
  if(reduced)return;
  const breath=Math.sin(time*1.8);plumage.scale.set(1+breath*.002,1+breath*.003,1);
  const cycle=time%5.6,blink=cycle>5.35?Math.max(.08,Math.abs((cycle-5.475)/.125)):1;
  eyes.forEach(eye=>{eye.scale.y=blink;});
 }};
}
