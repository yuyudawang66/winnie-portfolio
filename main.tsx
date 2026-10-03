import {useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import Home from './app/page';
import Reader from './app/reader';
import {projects} from './lib/projects';
import './app/globals.css';
import './app/locker.css';
function useImageProtection(){
 useEffect(()=>{
  // Discourage casual saving only on images; leave text, links and input intact.
  // Document capture also covers images in dialogs and newly opened projects.
  const preventImageAction=(event:Event)=>{
   if(event.target instanceof Element&&event.target.closest('img, .locker-webgl canvas'))event.preventDefault();
  };
  document.addEventListener('contextmenu',preventImageAction,true);
  document.addEventListener('dragstart',preventImageAction,true);
  return()=>{
   document.removeEventListener('contextmenu',preventImageAction,true);
   document.removeEventListener('dragstart',preventImageAction,true);
  };
 },[]);
}
function App(){useImageProtection();const[hash,setHash]=useState(location.hash);useEffect(()=>{const update=()=>{setHash(location.hash);window.scrollTo(0,0)};addEventListener('hashchange',update);return()=>removeEventListener('hashchange',update)},[]);const id=hash.startsWith('#project/')?hash.slice(9):null;const index=projects.findIndex(p=>p.id===id);useEffect(()=>{document.title=index>=0?projects[index].title+' · Winnie 设计作品':'杨雯茹 Winnie · 个人设计作品集'},[index]);if(id&&index<0)return <main className="quiet-state"><h1>项目未找到</h1><a href="./#works">返回所有作品</a></main>;return index>=0?<Reader key={id} project={projects[index]} next={projects[(index+1)%projects.length]}/>:<Home key={hash}/>;}
createRoot(document.getElementById('root')!).render(<App/>);
