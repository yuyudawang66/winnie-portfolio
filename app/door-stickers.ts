import * as THREE from 'three';

// Positions are in the inside face's coordinates, facing the opened door.
// Crop only transparent margins through UVs; keep all six supplied PNGs unchanged.
const stickers = [
  {file:'friends',size:[400,300],ink:[18,55,385,248],width:.56,x:.46,y:1.23,outline:0},
  {file:'keep-healing',size:[186,186],ink:[7,12,179,166],width:.37,x:-.48,y:1.09,outline:0},
  {file:'girl-with-cat',size:[168,168],ink:[9,8,159,164],width:.31,x:.62,y:.60,outline:.009},
  {file:'sparkle-duck',size:[138,138],ink:[14,12,127,125],width:.24,x:.31,y:.13,outline:0},
  {file:'pink-girl',size:[233,233],ink:[44,23,189,215],width:.30,x:-.53,y:-.045,outline:.009},
  {file:'teddy',size:[248,248],ink:[24,21,216,227],width:.43,x:.365,y:-.38,outline:.010},
];

export function createDoorStickers(manager:THREE.LoadingManager,anisotropy:number,isDisposed:()=>boolean){
  const group=new THREE.Group();group.name='柜门内侧 · 六张收藏贴纸';
  const textures:THREE.Texture[]=[];
  for(const sticker of stickers){
    const [imageWidth,imageHeight]=sticker.size;
    const [left,top,right,bottom]=sticker.ink;
    const inkWidth=right-left,inkHeight=bottom-top;
    const height=sticker.width*inkHeight/inkWidth;
    const margin=sticker.outline+.004,padding=margin*inkWidth/sticker.width;
    const texture=new THREE.TextureLoader(manager).load(`./assets/stickers/door/${sticker.file}.png`,()=>{
      if(isDisposed())texture.dispose();
    });
    texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=anisotropy;
    texture.repeat.set((inkWidth+padding*2)/imageWidth,(inkHeight+padding*2)/imageHeight);
    texture.offset.set((left-padding)/imageWidth,1-(bottom+padding)/imageHeight);
    textures.push(texture);
    const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.04,depthWrite:false,toneMapped:false});
    if(sticker.outline){
      // A thin white paper edge follows the original alpha, including small loose details.
      // This is a material effect, so the original character artwork stays untouched.
      const radius=new THREE.Vector2(sticker.outline*inkWidth/sticker.width/imageWidth,sticker.outline*inkHeight/height/imageHeight);
      material.onBeforeCompile=shader=>{
        shader.uniforms.stickerOutlineUv={value:radius};
        shader.fragmentShader='uniform vec2 stickerOutlineUv;\n'+shader.fragmentShader;
        shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
          #include <map_fragment>
          float originalAlpha = diffuseColor.a;
          float paperAlpha = originalAlpha;
          for (int i = 0; i < 24; i++) {
            float angle = float(i) * 6.28318530718 / 24.0;
            vec2 offset = vec2(cos(angle), sin(angle)) * stickerOutlineUv;
            paperAlpha = max(paperAlpha, texture2D(map, vMapUv + offset).a);
            paperAlpha = max(paperAlpha, texture2D(map, vMapUv + offset * 0.5).a);
          }
          paperAlpha = max(originalAlpha, smoothstep(0.10, 0.70, paperAlpha));
          diffuseColor.rgb = mix(vec3(1.0), diffuseColor.rgb, originalAlpha / max(paperAlpha, 0.0001));
          diffuseColor.a = paperAlpha;
        `);
      };
      material.customProgramCacheKey=()=> 'door-sticker-white-edge-v1';
    }
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(sticker.width+margin*2,height+margin*2),material);
    mesh.name=`Door sticker: ${sticker.file}`;mesh.position.set(sticker.x,sticker.y,0);
    // Decoration follows the door's existing click target and never blocks the pendant.
    mesh.raycast=()=>{};group.add(mesh);
  }
  return {group,textures};
}
