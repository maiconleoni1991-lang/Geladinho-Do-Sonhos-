(()=>{
  if(window.__gdsStoreBackgroundV45)return;window.__gdsStoreBackgroundV45=true;
  const src=document.currentScript?.src||location.href,ROOT=new URL('./',src);
  const PRICE={tradicional:'R$ 1,50',tradicionais:'R$ 1,50',cremoso:'R$ 4,00',cremosos:'R$ 4,00',gourmet:'R$ 6,00',gourmets:'R$ 6,00',trufado:'R$ 7,50',trufados:'R$ 7,50'};
  let bgData='';
  async function loadBg(){
    if(bgData)return bgData;
    const parts=await Promise.all(Array.from({length:7},(_,i)=>fetch(new URL(`assets/store-bg-v42-${i+1}.txt?v=45`,ROOT),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Parte do fundo indisponível');return r.text()})));
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
  function visualMode(doc){
    const w=doc.defaultView;if(!w)return;
    const top=(w.scrollY||doc.documentElement.scrollTop||0)<90;
    doc.body.classList.toggle('gdsHomeClear',top);
    doc.body.classList.toggle('gdsContentBlur',!top);
  }
  async function apply(){
    const frame=document.getElementById('store');if(!frame)return;
    try{
      const d=frame.contentDocument;if(!d||!d.head||!d.body)return;
      const bg=await loadBg();
      let layer=d.getElementById('gdsFixedBackgroundV45');
      if(!layer){layer=d.createElement('div');layer.id='gdsFixedBackgroundV45';d.body.insertBefore(layer,d.body.firstChild)}
      layer.style.cssText=`position:fixed;inset:0;z-index:0;pointer-events:none!important;background-image:url("${bg}");background-size:cover;background-position:center top;background-repeat:no-repeat;background-color:#fff8fb;`;
      let mask=d.getElementById('gdsBackgroundMaskV45');
      if(!mask){mask=d.createElement('div');mask.id='gdsBackgroundMaskV45';d.body.insertBefore(mask,layer.nextSibling)}
      let s=d.getElementById('gdsStoreBackgroundV45');
      if(!s){s=d.createElement('style');s.id='gdsStoreBackgroundV45';d.head.appendChild(s)}
      s.textContent=`
        html,body{background:transparent!important;min-height:100%!important}
        body{position:relative!important}
        #gdsFixedBackgroundV45,#gdsBackgroundMaskV45{pointer-events:none!important}
        #gdsBackgroundMaskV45{position:fixed;inset:0;z-index:0;transition:background .28s ease,backdrop-filter .28s ease,-webkit-backdrop-filter .28s ease}
        body> *:not(#gdsFixedBackgroundV45):not(#gdsBackgroundMaskV45){position:relative;z-index:1}
        button,a,input,textarea,select,label{pointer-events:auto!important;touch-action:manipulation!important}
        .overlay{z-index:150!important}.floatOrder{z-index:75!important}header{z-index:80!important;transition:background .28s ease,backdrop-filter .28s ease,-webkit-backdrop-filter .28s ease}
        body.gdsHomeClear #gdsBackgroundMaskV45{background:rgba(255,248,251,.035)!important;backdrop-filter:blur(.4px)!important;-webkit-backdrop-filter:blur(.4px)!important}
        body.gdsHomeClear header{background:rgba(255,250,250,.34)!important;backdrop-filter:blur(2px)!important;-webkit-backdrop-filter:blur(2px)!important;border-bottom-color:rgba(255,255,255,.28)!important}
        body.gdsHomeClear .hero{background:rgba(255,244,248,.10)!important}
        body.gdsHomeClear .hero:before{background:linear-gradient(90deg,rgba(255,255,255,.24),rgba(255,255,255,.035))!important;pointer-events:none!important}
        body.gdsHomeClear .heroText{background:rgba(255,255,255,.12)!important;backdrop-filter:blur(1px)!important;-webkit-backdrop-filter:blur(1px)!important}
        body.gdsContentBlur #gdsBackgroundMaskV45{background:rgba(255,248,251,.18)!important;backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important}
        body.gdsContentBlur header{background:rgba(255,250,250,.91)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}
        body.gdsContentBlur .hero{background:rgba(255,244,248,.58)!important}
        body.gdsContentBlur .hero:before{background:linear-gradient(90deg,rgba(255,255,255,.68),rgba(255,255,255,.22))!important;pointer-events:none!important}
        .heroArt{display:none!important}.heroInner{grid-template-columns:minmax(230px,320px) minmax(0,1fr)!important;max-width:1080px!important;min-height:330px!important;padding-bottom:24px!important}
        .infoBox,.tab,.searchWrap,.card{background:rgba(255,255,255,.93)!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important}
        .section{background:rgba(255,255,255,.72)!important;border:1px solid rgba(240,223,229,.88)!important;border-radius:24px!important;padding:16px!important;box-shadow:0 18px 45px rgba(106,25,54,.08)!important;backdrop-filter:blur(5px)!important;-webkit-backdrop-filter:blur(5px)!important}
        .how{background:linear-gradient(120deg,rgba(84,17,38,.94),rgba(124,23,59,.93))!important}footer{background:rgba(63,13,28,.95)!important}
        @media(max-width:780px){.heroInner{grid-template-columns:1fr!important;min-height:0!important}.heroText{border-radius:22px!important;padding:16px!important}.section{padding:12px!important;border-radius:18px!important}body.gdsHomeClear .heroText{background:rgba(255,255,255,.15)!important}}
      `;
      fixPrices(d);visualMode(d);
      if(!d.documentElement.dataset.gdsBg45){
        d.documentElement.dataset.gdsBg45='1';
        const w=d.defaultView;
        w.addEventListener('scroll',()=>visualMode(d),{passive:true});
        d.addEventListener('click',e=>{if(e.target.closest('[data-filter],.tab,.infoBox,#openTrack,#floatOrder,#cartTop'))setTimeout(()=>visualMode(d),120)},{passive:true});
        new MutationObserver(()=>fixPrices(d)).observe(d.body,{childList:true,subtree:true});
      }
    }catch(e){console.error('Falha ao aplicar fundo oficial v45',e)}
  }
  const f=document.getElementById('store');if(f)f.addEventListener('load',apply);
  apply();setTimeout(apply,250);setTimeout(apply,1000);setTimeout(apply,2500);
})();
