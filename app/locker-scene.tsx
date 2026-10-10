import {useEffect,useState} from 'react';
import {ArrowUpRight,RotateCcw} from 'lucide-react';
import LockerThree from './locker-three';
let entranceSeen = false;
export default function LockerScene({onExplore}:{onExplore:(id:string)=>void}){
 const[open,setOpen]=useState(false);
 const[phase,setPhase]=useState<'loading'|'entering'|'ready'>(()=>entranceSeen?'ready':'loading');
 const[loadProgress,setLoadProgress]=useState(0),[progress,setProgress]=useState(0);
 const[assetsReady,setAssetsReady]=useState(false);
 useEffect(()=>{
  if(phase!=='loading')return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=previous;};
 },[phase]);
 useEffect(()=>{
  if(phase!=='loading')return;
  // Resource completion controls the target; the count simply eases towards it.
  let frame=0;const from=progress,start=performance.now();
  const tick=(now:number)=>{const t=Math.min(1,(now-start)/700),value=from+(loadProgress-from)*(1-Math.pow(1-t,3));setProgress(Math.floor(value));
   if(assetsReady&&value>=99.5&&now-start>650){setProgress(100);setPhase('entering');return;}frame=requestAnimationFrame(tick);};
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[phase,loadProgress,assetsReady]);
 function entered(){entranceSeen=true;setPhase('ready');}

 function explore(id:string){setOpen(true);onExplore(id)}
 return <>
  {phase!=='ready'&&<div className={`welcome-loader ${phase==='entering'?'is-leaving':''}`} role="status" aria-label="正在载入 Winnie 的作品集">
   <div className="welcome-frame"><span className="welcome-kicker">A LITTLE SPACE FOR BIG IDEAS</span><strong className="welcome-title">WELCOME</strong><span className="welcome-signature">WINNIE — PORTFOLIO ’26</span><span className="welcome-percentage" aria-hidden="true">{progress}<small>%</small></span><span className="sr-only">{assetsReady?'加载完成':'正在加载三维场景'}</span><div className="welcome-track" style={{transform:`scaleX(${progress/100})`}}/></div>
  </div>}
  <div className={`locker-page entrance-${phase}`} inert={phase!=='ready'}>
  <header className="cabinet-header"><a href="./" className="cabinet-wordmark">Winnie <b className="cabinet-owner-name">杨雯茹</b><span>DESIGN PORTFOLIO / 2026</span></a><nav aria-label="作品集导航"><button onClick={()=>explore('about')}>关于我 <span>ABOUT</span></button><button onClick={()=>explore('works')}>作品 <span>WORK</span></button><button onClick={()=>explore('life')}>日常 <span>LIFE</span></button><button onClick={()=>explore('message')}>留言 <span>CONTACT</span></button></nav><span className="cabinet-status"><i/>欢迎来访</span></header>
  <section className="cabinet-intro"><p>杨雯茹的灵感储物柜 · A CABINET OF CURIOSITIES</p><h1>A little space for <em>big ideas.</em><span className="intro-spark" aria-hidden="true">✳</span></h1><span>用视觉串联想法，让好设计被看见、被记住。</span></section>
  <LockerThree entrance={phase} onProgress={setLoadProgress} onReady={()=>setAssetsReady(true)} onEntered={entered} open={open} onOpen={()=>setOpen(v=>!v)} onExplore={explore}/>
  {open&&<div className="locker-project-access"><button onClick={()=>explore('works')}>查看个人项目 <ArrowUpRight size={13}/></button></div>}
  <div className="cabinet-instruction" aria-live="polite"><span className="cabinet-gesture">{open?'柜门已打开，点击里面的小物件探索':'拖动旋转视角 · 点击柜门开启'}</span>{open?<><button onClick={()=>setOpen(false)}><RotateCcw size={13}/>关上柜门</button></>:<button onClick={()=>setOpen(true)}>点击柜门，打开我的灵感收藏 <ArrowUpRight size={15}/></button>}</div>
  <footer className="cabinet-footer"><span>© 2026 WINNIE <i>用设计，记录每一个想法。</i></span><span>IP · UI · BRAND · CAMPAIGN</span><a href="https://winnie-design-studio.yangwenru31.chatgpt.site/admin/messages">我的收件箱 ↗</a></footer>
 </div></>
}
