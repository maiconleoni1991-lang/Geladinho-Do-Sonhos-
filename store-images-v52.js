(()=>{
if(window.__gdsStoreImagesV52)return;window.__gdsStoreImagesV52=true;
const frame=document.getElementById('store');
function busted(src){try{const u=new URL(src,location.href);u.searchParams.set('gdsimg','52');return u.href}catch(_){return src}}
function install(d){
  if(!d?.body)return;
  if(!d.getElementById('gdsStoreImages52Style')){const s=d.createElement('style');s.id='gdsStoreImages52Style';s.textContent=`.photo.gdsPhoto52{position:relative;overflow:hidden;background-color:#fff0f5}.photo.gdsPhoto52>img.gdsProductImg52{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;z-index:1;opacity:0;transition:opacity .18s ease}.photo.gdsPhoto52.gdsImgReady52>img.gdsProductImg52{opacity:1}.photo.gdsPhoto52:after{z-index:2;pointer-events:none}`;d.head.appendChild(s)}
  const enhance=el=>{
    if(el.dataset.gdsImg52==='1')return;
    const raw=el.style.backgroundImage||'';
    const m=raw.match(/url\(["']?(.*?)["']?\)/i);
    if(!m||!m[1]||!m[1].includes('/storage/v1/object/public/product-images/'))return;
    const src=m[1];
    el.dataset.gdsImg52='1';el.classList.add('gdsPhoto52');
    const img=d.createElement('img');img.className='gdsProductImg52';img.alt=el.getAttribute('aria-label')||'Geladinho';img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
    img.onload=()=>{el.classList.add('gdsImgReady52')};
    img.onerror=()=>{el.classList.remove('gdsImgReady52');img.remove();el.dataset.gdsImg52='fallback'};
    img.src=busted(src);el.prepend(img);
  };
  const scan=()=>d.querySelectorAll('.photo').forEach(enhance);
  scan();
  if(!d.__gdsImgObs52){d.__gdsImgObs52=true;new MutationObserver(()=>scan()).observe(d.body,{childList:true,subtree:true})}
  setTimeout(scan,500);setTimeout(scan,1500);setTimeout(scan,3500);
}
function boot(){try{install(frame?.contentDocument)}catch(e){console.warn('GDS imagens v52',e)}}
if(frame){frame.addEventListener('load',boot);setTimeout(boot,250);setInterval(boot,5000)}
})();