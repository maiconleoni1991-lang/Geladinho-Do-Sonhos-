(()=>{
  if(window.__gdsAdminTouchFixV45)return;window.__gdsAdminTouchFixV45=true;
  function fixParent(){
    let s=document.getElementById('gdsTouchFixStyleV45');
    if(!s){s=document.createElement('style');s.id='gdsTouchFixStyleV45';document.head.appendChild(s)}
    s.textContent=`html,body{touch-action:manipulation}.bar,.top,.tabs,.tabs button,.stage,.view{pointer-events:auto!important}.tabs button{position:relative!important;z-index:30!important;min-height:44px}.stage{z-index:1!important}.bar{z-index:100!important}`;
    document.querySelectorAll('iframe.view').forEach(f=>{f.style.pointerEvents='auto';f.style.touchAction='manipulation'});
  }
  function fixManage(){
    const f=document.getElementById('adminFrame');if(!f)return;
    try{
      const d=f.contentDocument;if(!d||!d.body)return;
      let s=d.getElementById('gdsTouchFixInnerV45');
      if(!s){s=d.createElement('style');s.id='gdsTouchFixInnerV45';s.textContent=`html,body,main,#authView,#waitingView,#appView{pointer-events:auto!important}input,button,select,textarea,a,label{pointer-events:auto!important;touch-action:manipulation!important}#authView{position:relative!important;z-index:5!important}.overlay:not(.show){display:none!important;pointer-events:none!important}.gdsSecOverlay{pointer-events:auto!important}`;d.head.appendChild(s)}
      const auth=d.getElementById('authView');
      if(auth&&!auth.classList.contains('hidden')){
        const sec=d.getElementById('gdsSecOverlay');if(sec)sec.remove();
        ['email','password','login'].forEach(id=>{const el=d.getElementById(id);if(el){el.style.pointerEvents='auto';el.style.touchAction='manipulation';el.style.position='relative';el.style.zIndex='10'}});
      }
      const base=d.getElementById('overlay');
      if(base&&!base.classList.contains('show')){base.style.display='none';base.style.pointerEvents='none'}
      else if(base?.classList.contains('show')){base.style.display='grid';base.style.pointerEvents='auto'}
    }catch(e){console.warn('GDS touch recovery v45',e)}
  }
  function run(){fixParent();fixManage()}
  const frame=document.getElementById('adminFrame');if(frame)frame.addEventListener('load',()=>{setTimeout(run,50);setTimeout(run,400)});
  run();setTimeout(run,250);setTimeout(run,900);setInterval(run,2500);
})();
