import * as THREE from 'three';
import {createPaletteFlowers} from './palette-flowers';

// A small freestanding still life, in the same world space as the cabinet.
export function createArtistPalette(){
 const group=new THREE.Group();group.name='Floral artist palette and two brushes';
 const textures:THREE.Texture[]=[];
 const material=(color:string,roughness=.68,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const add=(parent:THREE.Object3D,geometry:THREE.BufferGeometry,m:THREE.Material|THREE.Material[])=>{
  const mesh=new THREE.Mesh(geometry,m);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 };
 let seed=42;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};

 // Subtle continuous wood grain, with a darker solid bevel around the real cutout.
 const woodCanvas=document.createElement('canvas');woodCanvas.width=512;woodCanvas.height=768;
 const woodCtx=woodCanvas.getContext('2d')!;woodCtx.fillStyle='#d6b68d';woodCtx.fillRect(0,0,512,768);
 for(let i=0;i<380;i++){
  const x=random()*540-14,phase=random()*Math.PI*2;
  woodCtx.beginPath();woodCtx.lineWidth=.25+random()*.9;woodCtx.strokeStyle=i%3===0?'rgba(255,240,205,.19)':'rgba(124,87,49,.10)';
  for(let y=0;y<=768;y+=12){const u=x+Math.sin(y*.008+phase)*3+Math.sin(y*.023+phase)*.6;y===0?woodCtx.moveTo(u,y):woodCtx.lineTo(u,y);}
  woodCtx.stroke();
 }
 const woodTexture=new THREE.CanvasTexture(woodCanvas);woodTexture.colorSpace=THREE.SRGBColorSpace;textures.push(woodTexture);
 const woodFace=new THREE.MeshStandardMaterial({map:woodTexture,roughness:.74,metalness:0});
 const palette=new THREE.Group();palette.name='Beveled wooden palette';group.add(palette);
 const outline=new THREE.Shape();outline.moveTo(.12,0);
 outline.bezierCurveTo(-.13,-.03,-.31,.10,-.30,.28);
 outline.bezierCurveTo(-.27,.40,-.10,.41,-.13,.51);
 outline.bezierCurveTo(-.18,.66,-.37,.51,-.47,.34);
 outline.bezierCurveTo(-.56,.22,-.64,.37,-.58,.63);
 outline.bezierCurveTo(-.53,.94,-.30,1.25,.02,1.30);
 outline.bezierCurveTo(.37,1.37,.56,1.10,.59,.81);
 outline.bezierCurveTo(.64,.45,.45,.06,.12,0);outline.closePath();
 const thumbHole=new THREE.Path();thumbHole.absellipse(.035,.34,.082,.108,0,Math.PI*2,true,-.22);outline.holes.push(thumbHole);
 const boardGeometry=new THREE.ExtrudeGeometry(outline,{depth:.044,bevelEnabled:true,bevelThickness:.008,bevelSize:.009,bevelSegments:3,curveSegments:32,steps:1});
 boardGeometry.translate(0,0,-.022);
 const uv=boardGeometry.attributes.uv,positions=boardGeometry.attributes.position;
 for(let i=0;i<uv.count;i++)uv.setXY(i,(positions.getX(i)+.65)/1.3,positions.getY(i)/1.35);
 const board=add(palette,boardGeometry,[woodFace,material('#b48b61',.8)]);

 // Low raised, irregular paint smears rather than a row of uniform paint buttons.
 const paintColors=['#76946a','#67a298','#526b9c','#9f8abd','#779fc0'];
 function paintSmear(x:number,y:number,rx:number,ry:number,color:string,rotation:number){
  const points:THREE.Vector2[]=[],phase=random()*6;
  for(let i=0;i<64;i++){
   const a=i/64*Math.PI*2,r=1+.06*Math.sin(a*5+phase)+.035*Math.cos(a*9-phase);
   points.push(new THREE.Vector2(Math.cos(a)*rx*r,Math.sin(a)*ry*r));
  }
  const geometry=new THREE.ExtrudeGeometry(new THREE.Shape(points),{depth:.007,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:2,steps:1});
  const smear=add(palette,geometry,material(color,.43));smear.position.set(x,y,.029);smear.rotation.z=rotation;
  // Fine ridges catch the key light like palette-knife marks in thick paint.
  for(let j=0;j<3;j++){
   const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-rx*.58,(j-1)*ry*.35,.011),new THREE.Vector3(0,(j-1)*ry*.35+ry*.14,.014),new THREE.Vector3(rx*.48,(j-1)*ry*.35-.01,.011));
   const ridge=add(smear,new THREE.TubeGeometry(curve,12,.0016,4,false),material(new THREE.Color(color).lerp(new THREE.Color('#eee9db'),.18).getStyle(),.48));ridge.castShadow=false;
  }
 }
 paintSmear(-.31,.64,.20,.19,paintColors[0],-.18);
 paintSmear(-.17,.75,.22,.16,paintColors[1],.23);
 paintSmear(.29,.65,.21,.22,paintColors[2],-.12);
 paintSmear(.24,.22,.23,.145,paintColors[3],.21);
 paintSmear(-.15,.23,.10,.14,paintColors[4],-.22);

 // Shared original flower cluster; its palette colors and layout stay unchanged.
 palette.add(createPaletteFlowers());

 // A tiny folded blue butterfly rests on the top edge, echoing the reference.
 const butterfly=new THREE.Group();butterfly.position.set(.22,1.29,.055);butterfly.rotation.z=-.27;palette.add(butterfly);
 const wingShape=new THREE.Shape();wingShape.moveTo(0,0);wingShape.bezierCurveTo(.04,.03,.11,.13,.15,.09);wingShape.bezierCurveTo(.18,.02,.11,-.02,.07,-.035);wingShape.bezierCurveTo(.14,-.12,.055,-.15,0,0);
 const wingGeometry=new THREE.ExtrudeGeometry(wingShape,{depth:.004,bevelEnabled:true,bevelThickness:.002,bevelSize:.002,bevelSegments:2,curveSegments:16,steps:1});
 for(const side of [-1,1]){const wing=add(butterfly,wingGeometry,material(side<0?'#718fc1':'#426ca5',.58));wing.scale.x=side;wing.rotation.y=-side*.36;}
 const butterflyBody=add(butterfly,new THREE.CapsuleGeometry(.008,.072,4,8),material('#364b6c'));butterflyBody.rotation.z=-.15;butterflyBody.position.z=.012;

 palette.rotation.set(-.27,-.18,.12);palette.updateMatrixWorld(true);
 // A rotated bounding box reaches below the curved wood; use its actual vertices.
 palette.position.y-=new THREE.Box3().setFromObject(board,true).min.y;
 palette.updateMatrixWorld(true);
 const paletteContact=new THREE.Vector3(),vertex=new THREE.Vector3();let contactCount=0;
 for(let i=0;i<positions.count;i++){
  vertex.fromBufferAttribute(positions,i).applyMatrix4(board.matrixWorld);
  if(vertex.y<.006){paletteContact.add(vertex);contactCount++;}
 }
 paletteContact.divideScalar(contactCount);
 const brushContacts:THREE.Vector3[]=[];

 function brush(name:string,x:number,z:number,length:number,tilt:number,color:string,flat:boolean){
  const brushGroup=new THREE.Group();brushGroup.name=name;group.add(brushGroup);
  const handleHeight=length-.28;
  const handle=add(brushGroup,new THREE.CylinderGeometry(.018,.009,handleHeight,16),material(color,.38));handle.position.y=handleHeight/2;
  const ferrule=add(brushGroup,new THREE.CylinderGeometry(.024,.019,.14,16),material('#c9c2af',.3,.68));ferrule.position.y=handleHeight+.07;if(flat)ferrule.scale.z=.58;
  for(const y of [handleHeight+.012,handleHeight+.117]){const band=add(brushGroup,new THREE.TorusGeometry(.024,.0025,5,16),material('#a6a392',.34,.6));band.rotation.x=Math.PI/2;band.position.y=y;if(flat)band.scale.y=.58;}
  if(flat){
   const bristles=add(brushGroup,new THREE.CylinderGeometry(.026,.023,.14,12),material('#8a6449',.92));bristles.position.y=handleHeight+.20;bristles.scale.z=.45;
   const paintTip=add(brushGroup,new THREE.CylinderGeometry(.026,.026,.022,12),material('#93b4d2',.62));paintTip.position.y=length-.011;paintTip.scale.z=.45;
  }else{
   const profile=[new THREE.Vector2(.019,0),new THREE.Vector2(.026,.035),new THREE.Vector2(.018,.09),new THREE.Vector2(0,.15)];
   const bristles=add(brushGroup,new THREE.LatheGeometry(profile,20),material('#77543d',.91));bristles.position.y=handleHeight+.14;
  }
  brushGroup.rotation.set(-.19,0,tilt);brushGroup.position.set(x,0,z);brushGroup.updateMatrixWorld(true);brushGroup.position.y-=new THREE.Box3().setFromObject(brushGroup,true).min.y;
  brushContacts.push(new THREE.Vector3(x,0,z));
 }
 brush('Round brush',.63,.02,1.53,.14,'#7d99b8',false);
 brush('Flat brush',.83,.08,1.32,.26,'#c5a57d',true);

 // Tight contact shadows sit directly beneath the real support points.
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;
 const ctx=shadowCanvas.getContext('2d')!;const gradient=ctx.createRadialGradient(64,64,0,64,64,64);
 gradient.addColorStop(0,'rgba(40,55,59,.65)');gradient.addColorStop(.25,'rgba(40,55,59,.38)');gradient.addColorStop(1,'rgba(40,55,59,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
 const shadowTexture=new THREE.CanvasTexture(shadowCanvas);textures.push(shadowTexture);
 function contactShadow(point:THREE.Vector3,width:number,depth:number){
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(width,depth),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));
  shadow.rotation.x=-Math.PI/2;shadow.position.set(point.x,.002,point.z);shadow.raycast=()=>{};group.add(shadow);
 }
 contactShadow(paletteContact,.42,.17);
 brushContacts.forEach(point=>contactShadow(point,.075,.075));
 return {group,textures};
}
