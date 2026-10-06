(()=>{
  if(window.__gdsAdminTouchFixV44)return;window.__gdsAdminTouchFixV44=true;
  function fixParent(){
    const s=document.getElementById('gdsTouchFixStyle')||document.createElement('style');
    s.id='gdsTouchFixStyle';s.textContent=`html,body{touch-action:manipulation}.bar,.top,.tabs,.tabs button,.stage,.view{pointer-events:auto!important}.tabs button{position:relative!important;z-index:30!important;min-height:44px}.stage{z-index:1!important}.bar{z-index:100!important}`;if(!s.parentNode)document.head.appendChild(s);
    document.querySelectorAll('.gdsPrefOverlay').forEach(x=>x.remove());
    document.querySelectorAll('iframe.view').forEach(f=>{f.style.pointerEvents='auto';f.style.touchAction='manipulation'});
  }
  function fixManage(){
    const f=document.getElementById('adminFrame');if(!f)return;
    try{
      const d=f.contentDocument;if(!d||!d.body)return;
      let s=d.getElementById('gdsTouchFixInner');if(!s){s=d.createElement('style');s.id='gdsTouchFixInner';s.textContent=`html,body,main,#authView,#waitingView,#appView{pointer-events:auto!important}input,button,select,textarea,a{pointer-events:auto!important;touch-action:manipulation!important;position:relative}#authView{position:relative!important;z-index:5!important}.overlay:not(.show){display:none!important;pointer-events:none!important}.gdsSecOverlay{pointer-events:auto!important}`;d.head.appendChild(s)}
      const auth=d.getElementById('authView');
      if(auth&&!auth.classList.contains('hidden')){
        const sec=d.getElementById('gdsSecOverlay');if(sec)sec.remove();
        auth.style.pointerEvents='auto';
        ['email','password','login'].forEach(id=>{const el=d.getElementById(id);if(el){el.style.pointerEvents='auto';el.style.touchAction='manipulation'}});
      }
      const base=d.getElementById('overlay');if(base&&!base.classList.contains('show')){base.style.display='none';base.style.pointerEvents='none'}
    }catch(e){console.warn('GDS touch recovery',e)}
  }
  function run(){fixParent();fixManage()}
  const frame=document.getElementById('adminFrame');if(frame)frame.addEventListener('load',()=>{setTimeout(run,50);setTimeout(run,400)});
  run();setTimeout(run,250);setTimeout(run,900);setInterval(run,2500);
})();
