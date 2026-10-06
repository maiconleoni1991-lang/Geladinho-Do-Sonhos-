(()=>{
  if(window.__gdsStoreBackgroundV43)return;window.__gdsStoreBackgroundV43=true;
  const src=document.currentScript?.src||location.href,ROOT=new URL('./',src);
  const PRICE={tradicional:'R$ 1,50',tradicionais:'R$ 1,50',cremoso:'R$ 4,00',cremosos:'R$ 4,00',gourmet:'R$ 6,00',gourmets:'R$ 6,00',trufado:'R$ 7,50',trufados:'R$ 7,50'};
  let bgData='';
  async function loadBg(){
    if(bgData)return bgData;
    const parts=await Promise.all(Array.from({length:7},(_,i)=>fetch(new URL(`assets/store-bg-v42-${i+1}.txt?v=43`,ROOT),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Parte do fundo indisponível');return r.text()})));
    const b64=parts.join('').replace(/\s+/g,'');
    if(!b64.startsWith('/9j/'))throw new Error('Imagem de fundo inválida');
    bgData=`data:image/jpeg;base64,${b64}`;return bgData;
  }
  function fixPrices(doc){
    doc.querySelectorAll('.infoBox,.tab').forEach(box=>{
      const label=(box.querySelector('strong')?.textContent||box.textContent||'').trim().toLowerCase();
      const hit=Object.keys(PRICE).find(k=>label.includes(k));
      const small=box.querySelector('small');if(hit&&small)small.textContent=PRICE[hit];
    });
  }
  async function apply(){
    const frame=document.getElementById('store');if(!frame)return;
    try{
      const d=frame.contentDocument;if(!d||!d.head||!d.body)return;
      const bg=await loadBg();
      let layer=d.getElementById('gdsFixedBackgroundV43');
      if(!layer){layer=d.createElement('div');layer.id='gdsFixedBackgroundV43';d.body.insertBefore(layer,d.body.firstChild)}
      layer.style.cssText=`position:fixed;inset:0;z-index:0;pointer-events:none!important;background-image:linear-gradient(180deg,rgba(255,250,251,.56),rgba(255,255,255,.70) 48%,rgba(255,248,251,.66)),url("${bg}");background-size:cover;background-position:center top;background-repeat:no-repeat;background-color:#fff8fb;`;
      let s=d.getElementById('gdsStoreBackgroundV43');
      if(!s){s=d.createElement('style');s.id='gdsStoreBackgroundV43';d.head.appendChild(s)}
      s.textContent=`html,body{background:transparent!important;min-height:100%!important}body{position:relative!important}body> *:not(#gdsFixedBackgroundV43){position:relative;z-index:1}button,a,input,textarea,select,label{pointer-events:auto!important;touch-action:manipulation!important}#gdsFixedBackgroundV43{pointer-events:none!important}.overlay{z-index:150!important}.floatOrder{z-index:75!important}header{z-index:80!important;background:rgba(255,250,250,.90)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}.hero{background:rgba(255,244,248,.64)!important}.hero:before{background:linear-gradient(90deg,rgba(255,255,255,.70),rgba(255,255,255,.24))!important;pointer-events:none!important}.heroArt{display:none!important}.heroInner{grid-template-columns:minmax(230px,320px) minmax(0,1fr)!important;max-width:1080px!important;min-height:330px!important;padding-bottom:24px!important}.infoBox,.tab,.searchWrap,.card{background:rgba(255,255,255,.93)!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important}.section{background:rgba(255,255,255,.70)!important;border:1px solid rgba(240,223,229,.88)!important;border-radius:24px!important;padding:16px!important;box-shadow:0 18px 45px rgba(106,25,54,.08)!important;backdrop-filter:blur(4px)!important;-webkit-backdrop-filter:blur(4px)!important}.how{background:linear-gradient(120deg,rgba(84,17,38,.94),rgba(124,23,59,.93))!important}footer{background:rgba(63,13,28,.95)!important}@media(max-width:780px){.heroInner{grid-template-columns:1fr!important;min-height:0!important}.heroText{background:rgba(255,255,255,.52)!important;border-radius:22px!important;padding:16px!important}.section{padding:12px!important;border-radius:18px!important}}`;
      fixPrices(d);
      if(!d.documentElement.dataset.gdsBg43){d.documentElement.dataset.gdsBg43='1';new MutationObserver(()=>fixPrices(d)).observe(d.body,{childList:true,subtree:true})}
    }catch(e){console.error('Falha ao aplicar fundo oficial v43',e)}
  }
  const f=document.getElementById('store');if(f)f.addEventListener('load',apply);
  apply();setTimeout(apply,250);setTimeout(apply,1000);setTimeout(apply,2500);
})();
