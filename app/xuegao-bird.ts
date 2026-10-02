import * as THREE from 'three';

// A compact, puffed-up lovebird: the head sinks into a round body, while the
// folded wings, short tail and tucked feet stay close to the silhouette.
export function createXuegaoBird(){
 const bird=new THREE.Group();bird.name='Xuegao';
 const plumage=new THREE.Group();bird.add(plumage);
 const material=(color:string,roughness=.72)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
 const ivory=material('#fff9ed'),face=material('#fffaf1');
 const lavender=material('#b7a1d3'),purple=material('#a18ac1'),lightLilac=material('#c4b3dc');
 const peach=material('#e9b4a0',.48),feet=material('#d4a5a8',.65);
 const eyeMaterial=material('#211b25',.12),white=material('#ffffff',.18);
 const sphereGeometry=new THREE.SphereGeometry(1,40,32);
 function oval(parent:THREE.Object3D,m:THREE.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number){
  const mesh=new THREE.Mesh(sphereGeometry,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 }
 // Broad, nearly spherical belly. The ivory breast wraps around the purple back.
 oval(plumage,lavender,0,.253,-.025,.239,.232,.217);
 oval(plumage,ivory,0,.250,.049,.230,.227,.200);
 for(let i=-1;i<=1;i++){
  const tail=oval(plumage,i===0?purple:lightLilac,i*.023,.125,-.211,.026,.067,.028);
  tail.rotation.x=-.72;tail.rotation.z=i*.11;
 }
 for(const side of [-1,1]){
  const wing=oval(plumage,lightLilac,side*.218,.262,-.024,.044,.133,.109);
  wing.rotation.z=side*.24;wing.rotation.x=-.16;
  // Small tips overlap the wing itself, rather than hanging below the body.
  for(let i=0;i<2;i++){
   const feather=oval(plumage,i===0?lavender:purple,side*(.229-i*.009),.195-i*.022,-.041-i*.018,.027,.063,.052);
   feather.rotation.z=side*.24;feather.rotation.x=-.25;
  }
 }
 const head=new THREE.Group();head.position.set(0,.432,.024);plumage.add(head);
 oval(head,face,0,0,0,.208,.188,.188);
 const eyes:THREE.Group[]=[];
 for(const side of [-1,1]){
  const eye=new THREE.Group();eye.position.set(side*.118,.027,.153);eye.rotation.y=side*.40;head.add(eye);eyes.push(eye);
  oval(eye,eyeMaterial,0,0,0,.028,.032,.020);
  oval(eye,white,-.007,.011,.018,.006,.007,.003);
  oval(eye,white,.007,-.009,.020,.0025,.003,.0015);
 }
 // A small peach mandible with a rounded, downward-curved tip.
 const upperBeak=oval(head,peach,0,-.032,.187,.038,.039,.032);upperBeak.rotation.x=.22;
 oval(head,peach,0,-.056,.201,.018,.025,.017);
 // Only little toes peek out from under the fluffy belly; no visible long legs.
 for(const side of [-1,1]){
  const x=side*.076;oval(bird,feet,x,.020,.071,.021,.013,.027);
  for(let toe=0;toe<3;toe++){
   const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,.021,.072),new THREE.Vector3(x+(toe-1)*.018,.016,.090),new THREE.Vector3(x+(toe-1)*.021,.011,.109)]);
   const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,10,.0065,8,false),feet);mesh.castShadow=true;bird.add(mesh);
  }
 }
 bird.scale.setScalar(.80);bird.rotation.y=-.28;
 return {bird,animate(time:number,reduced:boolean){
  if(reduced)return;
  plumage.scale.set(1+Math.sin(time*1.8)*.002,1+Math.sin(time*1.8)*.003,1);
  head.rotation.z=Math.sin(time*.75)*.016;
  const cycle=time%5.6,blink=cycle>5.35?Math.max(.08,Math.abs((cycle-5.475)/.125)):1;
  eyes.forEach(eye=>{eye.scale.y=blink;});
 }};
}
