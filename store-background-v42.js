(()=>{
  if(window.__gdsStoreBackgroundV42)return;window.__gdsStoreBackgroundV42=true;
  const src=document.currentScript?.src||location.href,ROOT=new URL('./',src);
  const PRICE={tradicional:'R$ 1,50',cremoso:'R$ 4,00',gourmet:'R$ 6,00',gourmets:'R$ 6,00',trufado:'R$ 7,50',trufados:'R$ 7,50'};
  let bgData='';
  async function loadBg(){
    if(bgData)return bgData;
    const parts=await Promise.all(Array.from({length:7},(_,i)=>fetch(new URL(`assets/store-bg-v42-${i+1}.txt?v=42`,ROOT),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Parte do fundo indisponível');return r.text()})));
    const b64=parts.join('').replace(/\s+/g,'');
    if(!b64.startsWith('/9j/'))throw new Error('Imagem de fundo inválida');
    bgData=`data:image/jpeg;base64,${b64}`;return bgData;
  }
  function fixPrices(doc){doc.querySelectorAll('.infoBox,.tab').forEach(box=>{const label=(box.querySelector('strong')?.textContent||box.textContent||'').trim().toLowerCase(),hit=Object.keys(PRICE).find(k=>label.includes(k)),small=box.querySelector('small');if(hit&&small)small.textContent=PRICE[hit]})}
  async function apply(){
    const frame=document.getElementById('store');if(!frame)return;
    try{
      const d=frame.contentDocument;if(!d||!d.head||!d.body)return;
      const bg=await loadBg();
      let s=d.getElementById('gdsStoreBackgroundV42');
      if(!s){s=d.createElement('style');s.id='gdsStoreBackgroundV42';d.head.appendChild(s)}
      s.textContent=`html{background:transparent!important}body{background-image:linear-gradient(180deg,rgba(255,250,251,.58),rgba(255,255,255,.72) 48%,rgba(255,248,251,.68)),url("${bg}")!important;background-size:cover!important;background-position:center top!important;background-repeat:no-repeat!important;background-attachment:fixed!important;background-color:#fff8fb!important}header{background:rgba(255,250,250,.90)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}.hero{background:rgba(255,244,248,.66)!important}.hero:before{background:linear-gradient(90deg,rgba(255,255,255,.72),rgba(255,255,255,.26))!important}.heroArt{display:none!important}.heroInner{grid-template-columns:minmax(230px,320px) minmax(0,1fr)!important;max-width:1080px!important;min-height:330px!important;padding-bottom:24px!important}.infoBox,.tab,.searchWrap,.card{background:rgba(255,255,255,.93)!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important}.section{background:rgba(255,255,255,.70)!important;border:1px solid rgba(240,223,229,.88)!important;border-radius:24px!important;padding:16px!important;box-shadow:0 18px 45px rgba(106,25,54,.08)!important;backdrop-filter:blur(4px)!important;-webkit-backdrop-filter:blur(4px)!important}.how{background:linear-gradient(120deg,rgba(84,17,38,.94),rgba(124,23,59,.93))!important}footer{background:rgba(63,13,28,.95)!important}@media(max-width:780px){body{background-position:center top!important}.heroInner{grid-template-columns:1fr!important;min-height:0!important}.heroText{background:rgba(255,255,255,.52)!important;border-radius:22px!important;padding:16px!important}.section{padding:12px!important;border-radius:18px!important}}`;
      fixPrices(d);
      if(!d.documentElement.dataset.gdsBg42){d.documentElement.dataset.gdsBg42='1';new MutationObserver(()=>fixPrices(d)).observe(d.body,{childList:true,subtree:true})}
    }catch(e){console.error('Falha ao aplicar fundo oficial v42',e)}
  }
  const f=document.getElementById('store');if(f)f.addEventListener('load',apply);apply();setTimeout(apply,250);setTimeout(apply,1000);setTimeout(apply,2500);
})();
