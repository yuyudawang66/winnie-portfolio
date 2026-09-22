import images from './project-images.json';
export const projects=[
 {id:'ip',category:'IP 设计',title:'怪兽轻断食',en:'MONSTER FASTING',summary:'围绕轻断食生活方式，探索角色形象、视觉表达与应用延展。',color:'#8cecf2',images:images.ip},
 {id:'ui',category:'UI 改版设计',title:'闲置无忧 App',en:'SECONDHAND MARKET',summary:'让闲置各得其所，让交易安心有托。',color:'#98b7ff',images:images.ui},
 {id:'brand',category:'品牌设计',title:'前行者品牌升级',en:'BRAND IDENTITY',summary:'从基础识别到应用规范，构建一致的品牌视觉语言。',color:'#ffdb91',images:images.brand},
 {id:'campaign',category:'活动运营',title:'马蜂窝四季',en:'FOUR SEASONS JOURNEY',summary:'以四季旅行为线索，串联活动视觉与地图打卡体验。',color:'#ffa7cf',images:images.campaign},
];
export type Project=typeof projects[number];
