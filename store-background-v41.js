(()=>{
  if(window.__gdsStoreBackgroundV41)return;window.__gdsStoreBackgroundV41=true;
  const selfSrc=document.currentScript?.src||location.href;
  const ROOT=new URL('./',selfSrc);
  const BG=new URL('assets/store-background-final.jpg?v=41',ROOT).href;
  const PRICE={tradicional:'R$ 1,50',cremoso:'R$ 4,00',gourmet:'R$ 6,00',gourmets:'R$ 6,00',trufado:'R$ 7,50',trufados:'R$ 7,50'};
  const css=`
    html,body{background:transparent!important}
    body{position:relative!important;isolation:isolate!important;min-height:100vh!important}
    body:before{content:""!important;position:fixed!important;inset:0!important;z-index:-2!important;pointer-events:none!important;background-image:url("${BG}")!important;background-size:cover!important;background-position:center top!important;background-repeat:no-repeat!important;transform:translateZ(0)!important}
    body:after{content:""!important;position:fixed!important;inset:0!important;z-index:-1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(255,250,251,.64),rgba(255,255,255,.76) 45%,rgba(255,248,251,.72))!important}
    header{background:rgba(255,250,250,.91)!important;backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important}
    .hero{background:rgba(255,244,248,.73)!important;backdrop-filter:blur(2px)!important;-webkit-backdrop-filter:blur(2px)!important}
    .hero:before{background:linear-gradient(90deg,rgba(255,255,255,.78),rgba(255,255,255,.35))!important}
    .heroArt{display:none!important}
    .heroInner{grid-template-columns:minmax(230px,320px) minmax(0,1fr)!important;max-width:1080px!important;min-height:330px!important;padding-bottom:24px!important}
    .infoBox,.tab,.searchWrap,.card{background:rgba(255,255,255,.94)!important;backdrop-filter:blur(9px)!important;-webkit-backdrop-filter:blur(9px)!important}
    .shop{position:relative!important}
    .section{background:rgba(255,255,255,.72)!important;border:1px solid rgba(240,223,229,.88)!important;border-radius:24px!important;padding:16px!important;box-shadow:0 18px 45px rgba(106,25,54,.08)!important;backdrop-filter:blur(5px)!important;-webkit-backdrop-filter:blur(5px)!important}
    .how{background:linear-gradient(120deg,rgba(84,17,38,.94),rgba(124,23,59,.93))!important}
    footer{background:rgba(63,13,28,.95)!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important}
    @media(max-width:780px){.heroInner{grid-template-columns:1fr!important;min-height:0!important}.heroText{background:rgba(255,255,255,.58)!important;border-radius:22px!important;padding:16px!important}.section{padding:12px!important;border-radius:18px!important}body:before{background-position:center top!important}}
    @media(max-width:500px){body:after{background:linear-gradient(180deg,rgba(255,250,251,.58),rgba(255,255,255,.70) 50%,rgba(255,248,251,.68))!important}}
  `;
  function fixPrices(doc){
    doc.querySelectorAll('.infoBox,.tab').forEach(box=>{
      const label=(box.querySelector('strong')?.textContent||box.textContent||'').trim().toLowerCase();
      const hit=Object.keys(PRICE).find(k=>label.includes(k));
      const small=box.querySelector('small');
      if(hit&&small)small.textContent=PRICE[hit];
    });
  }
  function apply(){
    const frame=document.getElementById('store');if(!frame)return;
    try{
      const d=frame.contentDocument;if(!d||!d.head)return;
      let s=d.getElementById('gdsStoreBackgroundV41');
      if(!s){s=d.createElement('style');s.id='gdsStoreBackgroundV41';s.textContent=css;d.head.appendChild(s)}
      fixPrices(d);
      if(!d.documentElement.dataset.gdsBgObserver){
        d.documentElement.dataset.gdsBgObserver='1';
        new MutationObserver(()=>fixPrices(d)).observe(d.body||d.documentElement,{childList:true,subtree:true});
      }
    }catch(e){console.warn('Fundo oficial indisponível temporariamente',e)}
  }
  const frame=document.getElementById('store');if(frame)frame.addEventListener('load',apply);
  apply();setTimeout(apply,250);setTimeout(apply,1200);
})();