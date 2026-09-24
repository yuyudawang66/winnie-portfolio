"use client";
import {useState,useEffect,useRef} from 'react';
import MessageForm from './message-form';
import LockerScene from './locker-scene';
import {projects} from '@/lib/projects';
import {ArrowUpRight,ArrowLeft,X,Frame,Monitor,FolderOpen,StickyNote} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
const entries=[{id:'about',label:'关于我',en:'ABOUT ME',Icon:Frame},{id:'works',label:'设计作品',en:'SELECTED WORK',Icon:Monitor},{id:'life',label:'设计之外',en:'BEYOND DESIGN',Icon:FolderOpen},{id:'message',label:'给我留言',en:'LEAVE A NOTE',Icon:StickyNote}];
export default function Home(){const[panel,setPanel]=useState<string|null>(null);const active=entries.find(e=>e.id===panel);const opener=useRef<HTMLElement|null>(null);
function openPanel(id:string){opener.current=document.activeElement as HTMLElement;setPanel(id)}
useEffect(()=>{if(location.hash==='#works')setPanel('works')},[]);
return <main className="locker-home"><LockerScene onExplore={openPanel}/>
<Dialog open={!!panel} onOpenChange={v=>!v&&setPanel(null)}><DialogContent className={`studio-dialog panel-${panel}`} showCloseButton={false} onCloseAutoFocus={e=>{e.preventDefault();opener.current?.focus()}}><div className="panel-top"><span className="eyebrow">{active?.en}</span><button className="icon-button" aria-label="关闭，返回储物柜" onClick={()=>setPanel(null)}><X size={21}/></button></div><DialogTitle className="panel-title">{active?.label}</DialogTitle><DialogDescription className="sr-only">Winnie 的{active?.label}</DialogDescription>
{panel==='about'&&<div className="about-content"><span className="about-monogram about-photo"><img src="./assets/winnie-cherry-blossom.jpg" alt="Winnie 在樱花树下的照片" width={1080} height={1440}/></span><div><p className="eyebrow">HELLO, I’M WINNIE</p><h2>杨雯茹 <em>/ Winnie</em></h2><p className="about-line">用视觉串联想法，<br/>让好设计被看见、被记住。</p><div className="disciplines">IP 设计 · UI 设计 · 品牌设计 · 活动运营</div><a className="contact-link" href="mailto:2451433219@qq.com"><span className="contact-value"><span className="contact-icon contact-email" aria-hidden="true"/>2451433219@qq.com</span><ArrowUpRight size={18}/></a><a className="contact-link" href="tel:15279280887"><span className="contact-value"><span className="contact-icon contact-phone" aria-hidden="true"/>15279280887</span><ArrowUpRight size={18}/></a></div></div>}
{panel==='works'&&<div className="folder-grid">{projects.map((p,i)=><a className="folder-card" href={`./#project/${p.id}`} key={p.id}><img src={`./assets/folder-${p.id}.webp`} alt={`${p.category}：${p.title}`}/><div><span>0{i+1} / {p.category}</span><ArrowUpRight size={18}/></div><h3>{p.title}</h3></a>)}</div>}
{panel==='life'&&<div className="quiet-state"><FolderOpen size={38} strokeWidth={1}/><h2>在设计之外，收集灵感。</h2><p>生活中的小小发现，正在整理中。</p></div>}
{panel==='message'&&<MessageForm/>}
<button className="back-link" onClick={()=>setPanel(null)}><ArrowLeft size={15}/>返回储物柜</button></DialogContent></Dialog></main>}
