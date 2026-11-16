import images from './project-images.json';
export type Project={id:string;category:string;title:string;en:string;summary:string;color:string;prototypeUrl?:string;images:{src:string;width:number;height:number}[]};
export const projects:Project[]=[
 {id:'sanliang',category:'UI / UX 设计',title:'三良中古 App 改版',en:'SANLIANG APP REDESIGN',summary:'围绕中古交易流程与视觉体验，完成信息架构、核心页面与交互体验的系统改版。',color:'#86aaf5',images:images.sanliang},
 {id:'mafengwo',category:'运营设计',title:'马蜂窝四季运营活动',en:'MAFENGWO FOUR SEASONS',summary:'以春夏秋冬四季为线索，完成马蜂窝全年活动运营视觉与延展设计。',color:'#73e5ec',images:images.mafengwo},
];
