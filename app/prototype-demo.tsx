import {useState} from 'react';
export default function PrototypeDemo({url}:{url:string}){
 const[visible,setVisible]=useState(true);const[revision,setRevision]=useState(0);
 const embed=new URL(url);embed.hostname='embed.figma.com';
 ['t','m','p'].forEach(key=>embed.searchParams.delete(key));
 Object.entries({'embed-host':'winnie-portfolio','footer':'false','show-proto-sidebar':'false','device-frame':'false','scaling':'contain','hotspot-hints':'true'}).forEach(([key,value])=>embed.searchParams.set(key,value));
 return <aside className="prototype-demo" aria-label="闲置无忧交互演示"><h2>亲手体验 · 闲置无忧</h2><div className="prototype-phone" id="ui-prototype" hidden={!visible}><iframe key={revision} src={embed.toString()} title="闲置无忧 App 可交互原型" allowFullScreen loading="eager"/></div><p>{visible?'点击手机里的页面，直接体验完整交互':'交互演示已收起'}</p><div className="prototype-actions"><button aria-expanded={visible} aria-controls="ui-prototype" onClick={()=>setVisible(v=>!v)}>{visible?'隐藏演示':'显示演示'}</button>{visible&&<button onClick={()=>setRevision(v=>v+1)}>重新开始</button>}</div></aside>
}
