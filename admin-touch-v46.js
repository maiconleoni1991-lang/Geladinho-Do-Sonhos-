(()=>{
  if(window.__gdsAdminTouchV46)return;window.__gdsAdminTouchV46=true;
  function parentFix(){
    let s=document.getElementById('gdsAdminTouchStyleV46');
    if(!s){s=document.createElement('style');s.id='gdsAdminTouchStyleV46';document.head.appendChild(s)}
    s.textContent=`html,body{touch-action:manipulation}.bar,.top,.tabs,.tabs button,.stage,.view{pointer-events:auto!important}.tabs button{position:relative;z-index:30;min-height:44px}.bar{z-index:100}.stage{z-index:1}iframe.view{touch-action:manipulation!important}`;
    document.querySelectorAll('iframe.view').forEach(f=>{f.style.pointerEvents='auto';f.style.touchAction='manipulation'});
  }
  function frameFix(f){
    try{
      const d=f.contentDocument;if(!d||!d.head||!d.body)return;
      let s=d.getElementById('gdsFrameTouchStyleV46');
      if(!s){s=d.createElement('style');s.id='gdsFrameTouchStyleV46';d.head.appendChild(s)}
      s.textContent=`button,a,input,select,textarea,label{touch-action:manipulation!important}button:not(:disabled),a,input,select,textarea,label{pointer-events:auto!important}.overlay:not(.show){pointer-events:none!important}`;
    }catch(_){ }
  }
  function run(){parentFix();document.querySelectorAll('iframe.view').forEach(frameFix)}
  document.querySelectorAll('iframe.view').forEach(f=>f.addEventListener('load',()=>setTimeout(()=>frameFix(f),60)));
  run();setTimeout(run,300);setTimeout(run,1000);setInterval(run,3000);
})();