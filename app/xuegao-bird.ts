import * as THREE from 'three';

// Xuegao is modelled in the same world as the locker, with an ivory face and
// chest, peach beak and lavender feathers across the back and folded wings.
export function createXuegaoBird(){
 const bird=new THREE.Group();bird.name='Xuegao';
 const plumage=new THREE.Group();bird.add(plumage);
 const material=(color:string,roughness=.72)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
 const ivory=material('#fff9ed'),face=material('#f7f5ef'),chest=material('#f2f0e5');
 const lavender=material('#b3a0d2'),purple=material('#9982bb'),lightLilac=material('#c9bcdf');
 const peach=material('#e6b2a4',.48),beakTip=material('#d09a84',.5),feet=material('#c9979d',.65);
 const eyeMaterial=material('#211b25',.12),white=material('#ffffff',.18);
 const sphereGeometry=new THREE.SphereGeometry(1,32,24);
 function oval(parent:THREE.Object3D,m:THREE.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number){
  const mesh=new THREE.Mesh(sphereGeometry,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 }
 oval(plumage,lavender,0,.31,-.075,.175,.235,.172);
 oval(plumage,chest,0,.32,.035,.164,.224,.159);
 oval(plumage,ivory,0,.41,.061,.156,.177,.147);
 // A short fan tail and overlapping wing feathers keep the lovebird silhouette.
 for(let i=-1;i<=1;i++){
  const tail=oval(plumage,i===0?purple:lightLilac,i*.038,.155,-.242,.031,.154,.032);
  tail.rotation.x=-.56;tail.rotation.z=i*.12;
 }
 for(const side of [-1,1]){
  const wing=new THREE.Group();wing.position.set(side*.157,.34,-.06);wing.rotation.z=side*.10;plumage.add(wing);
  oval(wing,lightLilac,0,.035,-.018,.058,.148,.123);
  for(let i=0;i<4;i++){
   const feather=oval(wing,i<2?lavender:purple,side*.012,-.013-i*.033,-.012-i*.015,.047,.108-i*.009,.075-i*.009);
   feather.rotation.x=-.17-i*.055;
  }
 }
 const head=new THREE.Group();head.position.set(0,.53,.045);plumage.add(head);
 oval(head,face,0,0,0,.175,.174,.163);
 oval(head,ivory,0,.068,.018,.160,.119,.146);
 // Soft pale cheeks match Xuegao's photo rather than a saturated facial mask.
 for(const side of [-1,1])oval(head,material('#ede3e8'),side*.13,-.045,.074,.043,.054,.072);
 const eyes:THREE.Group[]=[];
 for(const side of [-1,1]){
  const eye=new THREE.Group();eye.position.set(side*.121,.015,.122);eye.rotation.y=side*.44;head.add(eye);eyes.push(eye);
  oval(eye,ivory,0,0,0,.045,.048,.024);
  oval(eye,eyeMaterial,0,0,.011,.035,.039,.025);
  oval(eye,white,-.010,.014,.032,.008,.010,.004);
  oval(eye,white,.010,-.010,.034,.0035,.004,.002);
 }
 // Upper mandible has a rounded bridge and a downward hook, not a cone nose.
 oval(head,peach,0,-.044,.166,.057,.068,.055);
 const hookShape=new THREE.Shape();hookShape.moveTo(-.030,.025);hookShape.bezierCurveTo(.015,.05,.040,.005,.035,-.027);hookShape.bezierCurveTo(.030,-.063,.009,-.077,-.004,-.072);hookShape.bezierCurveTo(.012,-.031,-.026,-.035,-.030,.025);
 const hook=new THREE.Mesh(new THREE.ExtrudeGeometry(hookShape,{depth:.036,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:3,steps:1,curveSegments:20}),peach);
 hook.rotation.y=Math.PI/2;hook.position.set(-.018,-.045,.204);hook.castShadow=true;head.add(hook);
 oval(head,beakTip,0,-.084,.181,.029,.022,.025);
 // Two gripping feet sit directly on the metal top lip.
 for(const side of [-1,1]){
  const x=side*.080;oval(bird,feet,x,.055,.037,.021,.038,.023);
  for(let toe=0;toe<3;toe++){
   const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,.031,.041),new THREE.Vector3(x+(toe-1)*.024,.027,.073),new THREE.Vector3(x+(toe-1)*.032,.013,.115)]);
   const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,12,.009,8,false),feet);mesh.castShadow=true;bird.add(mesh);
  }
  oval(bird,feet,x,.018,-.002,.013,.010,.042);
 }
 bird.scale.setScalar(.80);bird.rotation.y=-.28;
 return {bird,animate(time:number,reduced:boolean){
  if(reduced)return;
  plumage.position.y=Math.sin(time*1.8)*.0025;
  head.rotation.z=Math.sin(time*.75)*.025;
  const cycle=time%5.6,blink=cycle>5.35?Math.max(.08,Math.abs((cycle-5.475)/.125)):1;
  eyes.forEach(eye=>{eye.scale.y=blink;});
 }};
}
