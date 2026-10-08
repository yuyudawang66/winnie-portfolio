import * as THREE from 'three';

export type PropId='bird'|'door'|'portfolio'|'about'|'works'|'life'|'message';
export type PropAnchor={id:PropId;x:number;y:number;width:number;height:number};
export type PropHint={id:PropId;x:number;y:number;below:boolean};
type InteractiveProp={id:PropId;object:THREE.Object3D;bounds:THREE.Box3;grow:number;offset?:THREE.Vector3};

// One controller keeps raycast hover, keyboard focus and the actual 3D models in sync.
export function createLockerHover({element,scene,camera,items,available,onActivate,onAnchors,onHint}:{
 element:HTMLCanvasElement;scene:THREE.Object3D;camera:THREE.Camera;items:InteractiveProp[];
 available:(id:PropId)=>boolean;onActivate:(id:PropId)=>void;
 onAnchors:(anchors:PropAnchor[])=>void;onHint:(hint:PropHint|null)=>void;
}){
 const props=items.map(item=>{
  item.object.userData.hoverId=item.id;
  const corners:THREE.Vector3[]=[];
  for(const x of [item.bounds.min.x,item.bounds.max.x])for(const y of [item.bounds.min.y,item.bounds.max.y])for(const z of [item.bounds.min.z,item.bounds.max.z])corners.push(new THREE.Vector3(x,y,z));
  return {...item,corners,position:item.object.position.clone(),scale:item.object.scale.clone(),amount:0,velocity:0};
 });
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2(),projected=new THREE.Vector3();
 let pointer:{x:number;y:number}|null=null,down:{x:number;y:number}|null=null,dragged=false,needsPick=false;
 let hovered:PropId|null=null,focused:PropId|null=null,latched:PropId|null=null,dismissed=false;
 let anchorKey='',hintKey='';
 const pick=(x:number,y:number)=>{
  const rect=element.getBoundingClientRect();mouse.set((x-rect.left)/rect.width*2-1,1-(y-rect.top)/rect.height*2);ray.setFromCamera(mouse,camera);
  // Only the frontmost surface counts: closed doors and other props still occlude targets.
  let object:THREE.Object3D|null=ray.intersectObject(scene,true)[0]?.object??null;
  while(object&&!object.userData.hoverId)object=object.parent;
  const id=object?.userData.hoverId as PropId|undefined;
  return id&&available(id)?id:null;
 };
 function clear(){pointer=null;hovered=null;focused=null;latched=null;dismissed=false;needsPick=false;element.style.cursor='grab';if(hintKey){hintKey='';onHint(null);}}
 function activate(id:PropId){
  if(!available(id))return;
  clear();if(id==='bird')latched=id;
  onActivate(id);
 }
 function focus(id:PropId|null){focused=id;hovered=null;pointer=null;latched=null;dismissed=false;}
 const onDown=(e:PointerEvent)=>{if(e.button!==0)return;down={x:e.clientX,y:e.clientY};dragged=false;clear();element.style.cursor='grabbing';};
 const onMove=(e:PointerEvent)=>{
  if(down){if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)dragged=true;return;}
  if(e.pointerType==='touch')return;
  pointer={x:e.clientX,y:e.clientY};needsPick=true;dismissed=false;latched=null;focused=null;
 };
 const onUp=(e:PointerEvent)=>{
  if(!down||e.button!==0)return;
  const wasDrag=dragged||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7;down=null;dragged=false;
  if(!wasDrag){const id=pick(e.clientX,e.clientY);if(id)activate(id);else clear();}
  else if(e.pointerType!=='touch'){pointer={x:e.clientX,y:e.clientY};needsPick=true;}
  element.style.cursor='grab';
 };
 const onLeave=()=>{pointer=null;hovered=null;latched=null;needsPick=false;element.style.cursor='grab';};
 const onCancel=()=>{down=null;dragged=false;clear();};
 const onLostCapture=()=>{if(down)onCancel();};
 const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){dismissed=true;hovered=null;latched=null;if(hintKey){hintKey='';onHint(null);}}};
 element.addEventListener('pointerdown',onDown);element.addEventListener('pointermove',onMove);element.addEventListener('pointerup',onUp);
 element.addEventListener('pointerleave',onLeave);element.addEventListener('pointercancel',onCancel);element.addEventListener('lostpointercapture',onLostCapture);
 window.addEventListener('blur',onCancel);window.addEventListener('keydown',onKey);
 return {
  focus,activate,clear,
  requestPick(){if(pointer)needsPick=true;},
  update(dt:number,reduced:boolean){
   if(needsPick&&pointer&&!down){hovered=pick(pointer.x,pointer.y);needsPick=false;element.style.cursor=hovered?'pointer':'grab';}
   const active=dismissed||down?null:focused??hovered??latched;
   const anchors:PropAnchor[]=[];let hint:PropHint|null=null;
   const width=element.clientWidth,height=element.clientHeight;
   for(const item of props){
    const enabled=available(item.id),target=enabled&&active===item.id?1:0;
    if(reduced){item.amount=0;item.velocity=0;}
    else{
     // Small time steps keep the single damped bounce stable on slow and fast displays.
     const steps=Math.max(1,Math.ceil(Math.min(dt,.05)/.008)),step=Math.min(dt,.05)/steps;
     for(let i=0;i<steps;i++){item.velocity+=((target-item.amount)*360-item.velocity*22)*step;item.amount+=item.velocity*step;}
     if(Math.abs(target-item.amount)<.0001&&Math.abs(item.velocity)<.001){item.amount=target;item.velocity=0;}
    }
    // Clamp the return undershoot so grounded objects never sink into their shelves.
    const amount=Math.max(0,item.amount);
    item.object.scale.copy(item.scale).multiplyScalar(1+item.grow*amount);
    item.object.position.copy(item.position);if(item.offset)item.object.position.addScaledVector(item.offset,amount);
    item.object.updateWorldMatrix(true,true);
    if(!enabled)continue;
    let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
    for(const corner of item.corners){projected.copy(corner).applyMatrix4(item.object.matrixWorld).project(camera);const x=(projected.x+1)*width/2,y=(1-projected.y)*height/2;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
    const w=Math.max(32,right-left),h=Math.max(32,bottom-top);
    anchors.push({id:item.id,x:Math.round((left+right-w)/2),y:Math.round((top+bottom-h)/2),width:Math.round(w),height:Math.round(h)});
    if(active===item.id){
     const below=top<52;
     hint={id:item.id,x:Math.round(THREE.MathUtils.clamp((left+right)/2,Math.min(120,width/2),Math.max(width-120,width/2))),y:Math.round(THREE.MathUtils.clamp(below?bottom+12:top-12,12,height-40)),below};
    }
   }
   const nextAnchors=JSON.stringify(anchors);if(nextAnchors!==anchorKey){anchorKey=nextAnchors;onAnchors(anchors);}
   const nextHint=hint?JSON.stringify(hint):'';if(nextHint!==hintKey){hintKey=nextHint;onHint(hint);}
  },
  dispose(){
   element.removeEventListener('pointerdown',onDown);element.removeEventListener('pointermove',onMove);element.removeEventListener('pointerup',onUp);
   element.removeEventListener('pointerleave',onLeave);element.removeEventListener('pointercancel',onCancel);element.removeEventListener('lostpointercapture',onLostCapture);
   window.removeEventListener('blur',onCancel);window.removeEventListener('keydown',onKey);
   props.forEach(item=>{item.object.position.copy(item.position);item.object.scale.copy(item.scale);delete item.object.userData.hoverId;});
  },
 };
}
