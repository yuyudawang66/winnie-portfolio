import * as THREE from 'three';

// A little beaded door hanging, modelled with a real hook, chains and raised charms.
export function createAboutCharm(){
 const group=new THREE.Group();group.name='关于我 · 蝴蝶结串珠挂件';
 const textures:THREE.Texture[]=[];
 const material=(color:string,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const edge=material('#a85775'),rose=material('#e4a5bb'),blush=material('#f3ced9'),ivory=material('#fff2db');
 const chainMaterial=material('#c6b6a1',.38,.48),lavender=material('#c5b8df'),gold=material('#dbbc7d',.42,.25);
 const beadGeometry=new THREE.SphereGeometry(1,10,7);
 function mesh(parent:THREE.Object3D,geometry:THREE.BufferGeometry,m:THREE.Material){
  const result=new THREE.Mesh(geometry,m);result.castShadow=true;result.receiveShadow=true;parent.add(result);return result;
 }
 function oval(parent:THREE.Object3D,x:number,y:number,z:number,rx:number,ry:number,rz:number,m:THREE.Material){
  const result=mesh(parent,new THREE.SphereGeometry(1,20,14),m);result.position.set(x,y,z);result.scale.set(rx,ry,rz);return result;
 }
 function plate(parent:THREE.Object3D,shape:THREE.Shape,m:THREE.Material,z=0,depth=.018,bevel=.006){
  const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,curveSegments:18,steps:1});
  geometry.translate(0,0,z);return mesh(parent,geometry,m);
 }
 function beads(parent:THREE.Object3D,shape:THREE.Shape,size=.0085,z=.033){
  const samples=shape.getPoints(80);let perimeter=0;for(let i=1;i<samples.length;i++)perimeter+=samples[i].distanceTo(samples[i-1]);
  const points=shape.getSpacedPoints(Math.ceil(perimeter/(size*2.25)));
  const border=new THREE.InstancedMesh(beadGeometry,ivory,points.length),matrix=new THREE.Matrix4();
  points.forEach((p,i)=>{matrix.makeScale(size,size,size*.68);matrix.setPosition(p.x,p.y,z);border.setMatrixAt(i,matrix);});
  border.castShadow=true;border.receiveShadow=true;parent.add(border);
 }
 function pendant(parent:THREE.Object3D,shape:THREE.Shape,m:THREE.Material,x:number,y:number,scale=1){
  const charm=new THREE.Group();charm.position.set(x,y,.045);charm.scale.setScalar(scale);parent.add(charm);
  plate(charm,shape,edge,0,.018,.009);
  const face=plate(charm,shape,m,.022,.007,.004);face.scale.set(.91,.91,1);beads(charm,shape);return charm;
 }
 function chain(parent:THREE.Object3D,from:THREE.Vector3,to:THREE.Vector3){
  const length=from.distanceTo(to),count=Math.ceil(length/.035),matrix=new THREE.Matrix4(),quaternion=new THREE.Quaternion();
  const links=new THREE.InstancedMesh(new THREE.TorusGeometry(.0105,.0024,5,10),chainMaterial,count);
  for(let i=0;i<count;i++){
   const p=from.clone().lerp(to,(i+.5)/count);p.z+=Math.sin(i/count*Math.PI)*.008;
   quaternion.setFromEuler(new THREE.Euler(0,i%2?.85:0,Math.atan2(-(to.x-from.x),to.y-from.y)));
   matrix.compose(p,quaternion,new THREE.Vector3(1,1.45,1));links.setMatrixAt(i,matrix);
  }
  links.castShadow=true;parent.add(links);
 }
 const heart=new THREE.Shape();heart.moveTo(0,-.13);heart.bezierCurveTo(-.06,-.08,-.15,.005,-.125,.075);heart.bezierCurveTo(-.095,.15,-.025,.14,0,.075);heart.bezierCurveTo(.035,.14,.115,.14,.135,.067);heart.bezierCurveTo(.16,-.008,.065,-.09,0,-.13);heart.closePath();
 function star(radius:number){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?radius*.49:radius;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?s.lineTo(x,y):s.moveTo(x,y);}s.closePath();return s;}

 // Woven pink gingham is confined to the bow; the name plaque stays quiet and readable.
 const ginghamCanvas=document.createElement('canvas');ginghamCanvas.width=ginghamCanvas.height=128;
 const ctx=ginghamCanvas.getContext('2d')!;ctx.fillStyle='#fff0e7';ctx.fillRect(0,0,128,128);ctx.fillStyle='rgba(217,125,163,.40)';
 for(let i=0;i<8;i+=2){ctx.fillRect(i*16,0,16,128);ctx.fillRect(0,i*16,128,16);}
 const gingham=new THREE.CanvasTexture(ginghamCanvas);gingham.colorSpace=THREE.SRGBColorSpace;gingham.wrapS=gingham.wrapT=THREE.RepeatWrapping;gingham.repeat.set(3,3);textures.push(gingham);
 const bowMaterial=new THREE.MeshStandardMaterial({map:gingham,roughness:.82});
 function bow(parent:THREE.Object3D,x:number,y:number,scale:number){
  const bowGroup=new THREE.Group();bowGroup.position.set(x,y,.080);bowGroup.scale.setScalar(scale);parent.add(bowGroup);
  for(const side of [-1,1]){
   const loop=new THREE.Shape();loop.moveTo(side*.022,0);loop.bezierCurveTo(side*.13,.10,side*.26,.15,side*.275,.112);loop.bezierCurveTo(side*.302,.064,side*.29,-.075,side*.25,-.086);loop.bezierCurveTo(side*.19,-.10,side*.073,-.016,side*.022,0);loop.closePath();
   const tail=new THREE.Shape();tail.moveTo(side*.047,-.010);tail.quadraticCurveTo(side*.13,-.06,side*.18,-.175);tail.lineTo(side*.108,-.151);tail.lineTo(side*.070,-.208);tail.quadraticCurveTo(side*.028,-.10,side*.018,-.025);tail.closePath();
   plate(bowGroup,tail,edge,0,.018);const ribbon=plate(bowGroup,tail,rose,.020,.008,.003);ribbon.scale.set(.91,.92,1);
   plate(bowGroup,loop,edge,.018,.020);const fabric=plate(bowGroup,loop,bowMaterial,.041,.010,.004);fabric.scale.set(.92,.92,1);beads(bowGroup,loop,.0075,.058);
  }
  oval(bowGroup,0,0,.079,.042,.046,.025,blush);
 }

 // The hook and two sloping chains make the whole piece read as hanging from the door.
 oval(group,0,0,.012,.028,.028,.014,ivory);
 const hook=mesh(group,new THREE.TorusGeometry(.025,.006,8,24),chainMaterial);hook.position.set(0,-.037,.030);
 chain(group,new THREE.Vector3(-.009,-.064,.045),new THREE.Vector3(-.31,-.42,.045));
 chain(group,new THREE.Vector3(.009,-.064,.045),new THREE.Vector3(.31,-.42,.045));
 const plaque=new THREE.Shape();plaque.moveTo(-.48,-.84);
 plaque.bezierCurveTo(-.45,-.65,-.22,-.47,0,-.47);plaque.bezierCurveTo(.22,-.47,.45,-.65,.48,-.84);
 for(let i=0;i<6;i++){const x=.48-i*.16;plaque.quadraticCurveTo(x-.04,-.91,x-.08,-.86);plaque.quadraticCurveTo(x-.12,-.92,x-.16,-.84);}
 plaque.closePath();pendant(group,plaque,blush,0,0);
 bow(group,0,-.445,1.16);

 // The exact Chinese label is rendered separately, never baked into generated artwork.
 const textCanvas=document.createElement('canvas');textCanvas.width=768;textCanvas.height=220;
 const textCtx=textCanvas.getContext('2d')!;textCtx.fillStyle='#874961';textCtx.textAlign='center';textCtx.textBaseline='middle';
 textCtx.font='700 186px "PingFang SC", "Microsoft YaHei", sans-serif';textCtx.fillText('关于我',384,110);
 const textMap=new THREE.CanvasTexture(textCanvas);textMap.colorSpace=THREE.SRGBColorSpace;textures.push(textMap);
 const label=mesh(group,new THREE.PlaneGeometry(.69,.198),new THREE.MeshBasicMaterial({map:textMap,transparent:true,depthWrite:false,toneMapped:false}));
 label.name='关于我';label.position.set(0,-.738,.086);label.castShadow=false;
 for(const side of [-1,1]){const sparkle=plate(group,star(.031),ivory,.071,.007,.002);sparkle.position.set(side*.369,-.765,0);}

 // Three different strands: bows and a heart, Snowball and a star, a moon and a flower.
 chain(group,new THREE.Vector3(-.36,-.88,.050),new THREE.Vector3(-.36,-1.58,.050));
 bow(group,-.36,-1.075,.44);
 const leftHeart=pendant(group,heart,rose,-.36,-1.415,.90);const inset=plate(leftHeart,heart,blush,.034,.004,.002);inset.scale.set(.61,.61,1);
 const tip=pendant(group,star(.045),gold,-.36,-1.62);tip.rotation.z=.18;
 chain(group,new THREE.Vector3(0,-.89,.050),new THREE.Vector3(0,-1.73,.050));
 const smallStar=pendant(group,star(.091),ivory,0,-1.115);smallStar.rotation.z=.16;
 // A tiny ivory bird keeps the charm personal to Winnie's cabinet.
 const bird=new THREE.Shape();bird.moveTo(0,-.135);bird.bezierCurveTo(-.18,-.14,-.17,.01,-.11,.10);bird.bezierCurveTo(-.06,.18,.07,.18,.12,.085);bird.bezierCurveTo(.18,-.045,.16,-.14,0,-.135);bird.closePath();
 const birdCharm=pendant(group,bird,ivory,0,-1.435);
 oval(birdCharm,-.116,-.028,.052,.032,.061,.010,lavender);oval(birdCharm,.116,-.028,.052,.032,.061,.010,lavender);
 for(const side of [-1,1]){oval(birdCharm,side*.048,.041,.059,.009,.011,.008,edge);oval(birdCharm,side*.075,.008,.057,.021,.012,.006,blush);}
 const beak=plate(birdCharm,star(.018),gold,.057,.005,.002);beak.scale.y=.7;beak.position.y=.019;
 oval(group,0,-1.76,.060,.026,.032,.019,gold);
 chain(group,new THREE.Vector3(.36,-.88,.050),new THREE.Vector3(.36,-1.58,.050));
 const moon=new THREE.Shape();moon.moveTo(.068,.123);moon.bezierCurveTo(-.14,.14,-.18,-.085,-.021,-.128);moon.bezierCurveTo(.053,-.145,.121,-.102,.14,-.047);moon.bezierCurveTo(-.036,-.11,-.077,.073,.068,.123);moon.closePath();pendant(group,moon,ivory,.36,-1.095,.86);
 const flowerGroup=new THREE.Group();flowerGroup.position.set(.36,-1.43,.060);group.add(flowerGroup);
 for(let i=0;i<5;i++){const a=i/5*Math.PI*2,p=oval(flowerGroup,Math.sin(a)*.064,Math.cos(a)*.064,.011,.045,.066,.016,rose);p.rotation.z=-a;}
 oval(flowerGroup,0,0,.034,.034,.034,.015,ivory);oval(group,.36,-1.605,.060,.023,.028,.017,gold);
 // Include the small gaps between chains in the click target, especially on phones.
 const hitArea=new THREE.Mesh(new THREE.PlaneGeometry(1.06,1.89),new THREE.MeshBasicMaterial({transparent:true,opacity:0,colorWrite:false,depthWrite:false,side:THREE.DoubleSide}));
 hitArea.name='About charm touch area';hitArea.position.set(0,-.88,.008);group.add(hitArea);
 return {group,textures,label};
}
