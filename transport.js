/* GitHub Pages → GAS iframe → google.script.run。
 * 不使用 no-cors 盲送，只有 GAS 回覆成功才顯示成功。
 */
(()=>{
 let connection=null;
 function random(){const data=new Uint8Array(24);crypto.getRandomValues(data);return Array.from(data,v=>v.toString(16).padStart(2,'0')).join('')}
 function googleOrigin(origin){return /^https:\/\/(?:[a-z0-9-]+-)?script\.googleusercontent\.com$/.test(origin)||origin==='https://script.google.com'}
 function connect(){
  if(connection)return connection;
  connection=new Promise((resolve,reject)=>{
   const configured=window.ORDERING_CONFIG&&window.ORDERING_CONFIG.gasUrl;
   let url;try{url=new URL(configured)}catch{reject(Error('請先在 config.js 填入 GAS 的正式 /exec 網址。'));return}
   if(url.origin!=='https://script.google.com'||!/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)){reject(Error('config.js 需要 GAS 正式 /exec 網址。'));return}
   const channel=random(),frame=document.createElement('iframe');
   frame.title='點餐資料連線';frame.style.cssText='position:absolute;width:1px;height:1px;left:-10000px;top:0;border:0';frame.setAttribute('aria-hidden','true');
   url.search='';url.searchParams.set('bridge','1');url.searchParams.set('channel',channel);frame.src=url.href;
   let remote=null,remoteOrigin=null,ready=false;
   const pending=new Map();
   const timeout=setTimeout(()=>{if(!ready){window.removeEventListener('message',listener);frame.remove();connection=null;reject(Error('無法連到 GAS。請確認已更新部署、存取設為所有人，FRONTEND_URL 與目前網站一致。'))}},30000);
   function listener(event){
    const p=event.data;if(!googleOrigin(event.origin)||!p||p.channel!==channel)return;
    if(p.type==='ORDERING_READY'&&!ready){
     remote=event.source;remoteOrigin=event.origin;ready=true;clearTimeout(timeout);
     remote.postMessage({type:'ORDERING_ACK',channel},remoteOrigin);
     resolve({call(method,args){return new Promise((done,fail)=>{const id=random();const timer=setTimeout(()=>{pending.delete(id);fail(Error('伺服器回覆逾時。若正在送單，請按「重試送出」查回結果。'))},65000);pending.set(id,{done,fail,timer});remote.postMessage({type:'ORDERING_CALL',channel,id,method,args},remoteOrigin)})}});
    }else if(p.type==='ORDERING_RESULT'&&event.source===remote&&event.origin===remoteOrigin){const task=pending.get(p.id);if(!task)return;pending.delete(p.id);clearTimeout(task.timer);if(p.error)task.fail(Error(p.error));else task.done(p.data)}
   }
   window.addEventListener('message',listener);document.body.append(frame);
  });
  return connection;
 }
 window.OrderingAPI={call:async(method,...args)=>(await connect()).call(method,args)};
})();
