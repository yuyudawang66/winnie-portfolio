import {useState} from 'react';
import {ArrowUpRight,MoveUpRight,Mail,Plus,RotateCcw} from 'lucide-react';
import {projects} from '@/lib/projects';
function Vents(){return <span className="locker-vents" aria-hidden="true">{[0,1,2,3].map(i=><i key={i}/>)}</span>}
export default function LockerScene({onExplore}:{onExplore:(id:string)=>void}){
 const[open,setOpen]=useState(false);
 function explore(id:string){setOpen(true);onExplore(id)}
 return <div className="locker-page">
  <header className="cabinet-header"><a href="./" className="cabinet-wordmark">Winnie<span>DESIGN PORTFOLIO / 2026</span></a><nav aria-label="作品集导航"><button onClick={()=>explore('about')}>关于我 <span>ABOUT</span></button><button onClick={()=>explore('works')}>作品 <span>WORK</span></button><button onClick={()=>explore('life')}>日常 <span>LIFE</span></button><button onClick={()=>explore('message')}>留言 <span>CONTACT</span></button></nav><span className="cabinet-status"><i/>欢迎来访</span></header>
  <section className="cabinet-intro"><p>杨雯茹的灵感储物柜 · A CABINET OF CURIOSITIES</p><h1>A little space for <em>big ideas.</em><span className="intro-spark" aria-hidden="true">✳</span></h1><span>用视觉串联想法，让好设计被看见、被记住。</span></section>
  <section className={`cabinet-stage ${open?'is-open':''}`} aria-label="Winnie 的交互储物柜">
   <div className="cabinet-shadow"/>
   <div className="cabinet-body">
    <div className="cabinet-side" aria-hidden="true"/>
    <div className="locker-panel locker-left"><span className="locker-number">01 / LITTLE THINGS</span><Vents/><button className="locker-polaroid" onClick={()=>explore('about')} aria-label="查看 Winnie 的个人介绍"><span className="photo-tape"/><img src="./assets/winnie-cherry-blossom.jpg" alt="樱花树下的 Winnie"/><span>hello, it’s me! <ArrowUpRight size={13}/></span></button><span className="daisy-sticker" aria-hidden="true">✿</span><span className="type-sticker" aria-hidden="true">made of<br/><b>curiosity.</b></span><span className="locker-handle" aria-hidden="true"/><div className="paper-pocket" aria-hidden="true"><i>collect<br/>little joys.</i><span/></div><div className="lower-vents"><Vents/></div></div>
    <div className="locker-center">
     <div className="locker-interior" id="cabinet-contents" inert={!open}>
      <div className="book-shelf" aria-hidden="true"><span className="book book-one">VISUAL</span><span className="book book-two">IDEAS</span><span className="book book-three">品牌设计</span><span className="book book-four">UI / UX</span><span className="book book-five">IP DESIGN</span><i className="little-orb"/></div>
      <button className="cabinet-id" onClick={()=>explore('about')}><span>WINNIE’S DESIGN CLUB</span><strong>杨雯茹 <em>Winnie</em></strong><small>关于我 / ABOUT ME <ArrowUpRight size={15}/></small></button>
      <div className="project-shelf"><span className="shelf-label">SELECTED WORK / 04</span><div className="mini-folders">{projects.map(p=><a href={`./#project/${p.id}`} key={p.id} aria-label={`查看${p.title}`}><img src={`./assets/folder-${p.id}.webp`} alt=""/><span>{p.category}<ArrowUpRight size={11}/></span></a>)}</div></div>
      <div className="bottom-shelf"><button className="vinyl-card" onClick={()=>explore('life')} aria-label="打开设计之外"><span className="vinyl-record"/><span>OFF THE CLOCK<small>设计之外 ↗</small></span></button><button className="cabinet-note" onClick={()=>explore('message')}><Mail size={20}/><span>留一张<br/>小纸条</span><small>JUST FOR ME ↗</small></button></div>
     </div>
     <button className="locker-door" onClick={()=>setOpen(true)} aria-label="打开储物柜，探索作品和个人介绍" aria-expanded={open} aria-controls="cabinet-contents" tabIndex={open?-1:0} aria-hidden={open}>
      <span className="door-front"><span className="locker-number">02 / OPEN FOR IDEAS</span><Vents/><span className="door-poster"><small>CREATIVE<br/>THINGS INSIDE</small><strong>W<span>↗</span></strong><span>WINNIE’S<br/>LITTLE CABINET</span><i>EST. 2026</i></span><span className="oval-sticker">GOOD DESIGN<br/>GOOD MOOD</span><span className="door-prompt">打开，发现我的小世界 <MoveUpRight size={17}/></span><span className="locker-handle"/><div className="lower-vents"><Vents/></div></span>
      <span className="door-back" aria-hidden="true"><span className="inside-postcard">ideas<br/>live<br/><em>here.</em></span><span className="inside-star">✳</span><span className="inside-label">MAKE SOMETHING<br/>WORTH REMEMBERING.</span></span>
     </button>
    </div>
    <div className="locker-panel locker-right"><span className="locker-number">03 / KEEP EXPLORING</span><Vents/><span className="club-sticker" aria-hidden="true">DESIGN<br/><b>IS A</b><br/>PLAYGROUND</span><button className="project-sticker" onClick={()=>explore('works')} aria-label="打开全部设计作品"><img src="./assets/folder-ip.webp" alt=""/><span>想法，装进作品里 ↗</span></button><span className="locker-handle" aria-hidden="true"/><button className="tiny-envelope" onClick={()=>explore('message')}><Mail size={24}/><span>TO: WINNIE<small>给我留言 ↗</small></span></button><span className="flower-sticker" aria-hidden="true">✳</span><div className="lower-vents"><Vents/></div></div>
   </div>
   <span className="scene-note scene-note-left" aria-hidden="true">a few things<br/><em>that make me, me.</em><svg viewBox="0 0 100 60"><path d="M5 4Q10 55 90 35M76 26L91 35L77 46"/></svg></span>
   <span className="scene-note scene-note-right" aria-hidden="true">请随意探索<br/><Plus size={18}/></span>
  </section>
  <div className="cabinet-instruction" aria-live="polite">{open?<><span>柜门已打开，点击里面的小物件探索</span><button onClick={()=>setOpen(false)}><RotateCcw size={13}/>关上柜门</button></>:<button onClick={()=>setOpen(true)}>点击柜门，打开我的灵感收藏 <ArrowUpRight size={15}/></button>}</div>
  <footer className="cabinet-footer"><span>© 2026 WINNIE <i>用设计，记录每一个想法。</i></span><span>IP · UI · BRAND · CAMPAIGN</span><a href="https://winnie-design-studio.yangwenru31.chatgpt.site/admin/messages">我的收件箱 ↗</a></footer>
 </div>
}
