import * as THREE from 'three';
import {softMaterial,softMesh,softOval,softPlate,softCord,softText,softBow} from './soft-props';

export function createAboutCharm(){
 const group=new THREE.Group();group.name='关于我 · 奶油蝴蝶结吊牌';const textures:THREE.Texture[]=[];
 const cream=softMaterial('#fcf0dc'),rose=softMaterial('#e5a9be',.8),palePink=softMaterial('#f5d5dd'),gold=softMaterial('#d0ba96',.45,.28),lavender=softMaterial('#c6c0e0');
 softOval(group,0,0,.017,.024,.024,.014,gold);
 // One loose cord and a padded bow replace the busy beaded outline and many chains.
 softCord(group,[new THREE.Vector3(-.15,-.34,.043),new THREE.Vector3(-.035,-.06,.032),new THREE.Vector3(0,-.035,.032),new THREE.Vector3(.035,-.06,.032),new THREE.Vector3(.15,-.34,.043)],.009,gold);
 const tagShape=new THREE.Shape();tagShape.moveTo(-.29,-.39);tagShape.quadraticCurveTo(-.29,-.32,-.21,-.32);tagShape.lineTo(.21,-.32);tagShape.quadraticCurveTo(.29,-.32,.29,-.39);tagShape.lineTo(.29,-.71);tagShape.quadraticCurveTo(.29,-.79,.20,-.79);tagShape.lineTo(-.20,-.79);tagShape.quadraticCurveTo(-.29,-.79,-.29,-.71);tagShape.closePath();
 softPlate(group,tagShape,cream,.070,.018);
 softBow(group,0,-.335,.079,1,rose);
 // Small, warm lettering sits within the ivory material instead of across the whole hanging.
 const label=softText(group,'关于我',.42,.105,'#9b7880',textures,'500 114px "PingFang SC", "Microsoft YaHei", sans-serif');label.name='关于我';label.position.set(0,-.565,.072);
 const signature=softText(group,'WINNIE',.30,.075,'#baa5a4',textures,'500 68px Georgia, serif');signature.position.set(0,-.671,.072);
 softCord(group,[new THREE.Vector3(0,-.785,.043),new THREE.Vector3(0,-.88,.055)],.006,gold);
 const ring=softMesh(group,new THREE.TorusGeometry(.018,.004,8,24),gold);ring.position.set(0,-.893,.057);
 // A single soft little bird makes the pendant personal and echoes Snowball above the cabinet.
 softOval(group,0,-1.030,.062,.104,.109,.047,cream);
 for(const side of [-1,1]){
  const wing=softOval(group,side*.089,-1.055,.065,.025,.047,.021,lavender);wing.rotation.z=side*.22;
  softOval(group,side*.031,-1.009,.107,.006,.007,.004,softMaterial('#68535b'));
  softOval(group,side*.059,-1.028,.104,.017,.009,.004,palePink);
 }
 softOval(group,0,-1.025,.114,.009,.009,.007,gold);
 const hitArea=new THREE.Mesh(new THREE.PlaneGeometry(.65,1.19),new THREE.MeshBasicMaterial({transparent:true,opacity:0,colorWrite:false,depthWrite:false,side:THREE.DoubleSide}));hitArea.position.set(0,-.56,.008);group.add(hitArea);
 return {group,textures,label};
}
