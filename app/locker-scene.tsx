import {useState} from 'react';
import {ArrowUpRight,RotateCcw} from 'lucide-react';
import LockerThree from './locker-three';
import {projects} from '@/lib/projects';
export default function LockerScene({onExplore}:{onExplore:(id:string)=>void}){
 const[open,setOpen]=useState(false);
 function explore(id:string){setOpen(true);onExplore(id)}
 return <div className="locker-page">
  <header className="cabinet-header"><a href="./" className="cabinet-wordmark">Winnie<span>DESIGN PORTFOLIO / 2026</span></a><nav aria-label="作品集导航"><button onClick={()=>explore('about')}>关于我 <span>ABOUT</span></button><button onClick={()=>explore('works')}>作品 <span>WORK</span></button><button onClick={()=>explore('life')}>日常 <span>LIFE</span></button><button onClick={()=>explore('message')}>留言 <span>CONTACT</span></button></nav><span className="cabinet-status"><i/>欢迎来访</span></header>
  <section className="cabinet-intro"><p>杨雯茹的灵感储物柜 · A CABINET OF CURIOSITIES</p><h1>A little space for <em>big ideas.</em><span className="intro-spark" aria-hidden="true">✳</span></h1><span>用视觉串联想法，让好设计被看见、被记住。</span></section>
  <LockerThree open={open} onOpen={()=>setOpen(v=>!v)} onExplore={explore}/>
  {open&&<div className="locker-project-access" aria-label="柜内项目快捷入口">{projects.map(p=><a key={p.id} href={`./#project/${p.id}`}>{p.category} <ArrowUpRight size={13}/></a>)}</div>}
  <div className="cabinet-instruction" aria-live="polite">{open?<><span>柜门已打开，点击里面的小物件探索</span><button onClick={()=>setOpen(false)}><RotateCcw size={13}/>关上柜门</button></>:<button onClick={()=>setOpen(true)}>点击柜门，打开我的灵感收藏 <ArrowUpRight size={15}/></button>}</div>
  <footer className="cabinet-footer"><span>© 2026 WINNIE <i>用设计，记录每一个想法。</i></span><span>IP · UI · BRAND · CAMPAIGN</span><a href="https://winnie-design-studio.yangwenru31.chatgpt.site/admin/messages">我的收件箱 ↗</a></footer>
 </div>
}
