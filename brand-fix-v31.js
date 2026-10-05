(()=>{
  const marker='/geladinhos/';
  const p=location.pathname;
  const i=p.indexOf(marker);
  const rootPath=i>=0?p.slice(0,i+marker.length):p.replace(/[^/]*$/,'');
  const ROOT=new URL(rootPath,location.origin);
  const fallback=new URL('assets/app-icon.svg?v=31',ROOT).href;
  const fav=new URL('assets/favicon-32.png?v=31',ROOT).href;
  const touch=new URL('assets/apple-touch-icon.png?v=31',ROOT).href;
  let currentLogo=fallback;

  function ensureLink(doc,rel,href,sizes){
    if(!doc||!doc.head)return;
    let x=doc.querySelector(`link[rel="${rel}"]`);
    if(!x){x=doc.createElement('link');x.rel=rel;doc.head.appendChild(x)}
    x.href=href;
    if(sizes)x.sizes=sizes;
  }

  function setImage(img){
    if(!img)return;
    img.src=currentLogo;
    img.removeAttribute('srcset');
    img.alt='Geladinho dos Sonhos';
    img.style.objectFit='contain';
    img.style.objectPosition='center';
    img.style.visibility='visible';
    img.style.opacity='1';
    img.style.maxWidth='100%';
    if(!img.dataset.gdsLogoFallback){
      img.dataset.gdsLogoFallback='1';
      img.addEventListener('error',()=>{
        if(img.src!==fallback)img.src=fallback;
        img.style.visibility='visible';
        img.style.opacity='1';
      });
    }
  }

  function apply(doc){
    if(!doc)return;
    ensureLink(doc,'icon',fav,'32x32');
    ensureLink(doc,'apple-touch-icon',touch,'180x180');
    doc.querySelectorAll('img.logo,img.logoSmall,img.heroLogo,img.footerLogo,.brand img').forEach(setImage);
  }

  function wire(frame){
    if(!frame||frame.dataset.gdsBrand31)return;
    frame.dataset.gdsBrand31='1';
    const fix=()=>{try{apply(frame.contentDocument)}catch(_){}};
    frame.addEventListener('load',fix);
    setTimeout(fix,120);
    setTimeout(fix,700);
  }

  function applyEverywhere(){
    apply(document);
    document.querySelectorAll('iframe').forEach(wire);
    document.querySelectorAll('iframe').forEach(f=>{try{apply(f.contentDocument)}catch(_){}});
  }

  async function loadOfficial(){
    try{
      const parts=await Promise.all([1,2,3,4].map(async n=>{
        const r=await fetch(new URL(`assets/logo-v13-${n}.txt?v=31`,ROOT),{cache:'no-store'});
        if(!r.ok)throw new Error('parte '+n+' indisponível');
        return (await r.text()).trim();
      }));
      const b64=parts.join('');
      if(b64.length<40000||!b64.startsWith('UklG'))throw new Error('logo incompleta');
      const src='data:image/webp;base64,'+b64;
      await new Promise((resolve,reject)=>{
        const test=new Image();
        test.onload=resolve;
        test.onerror=()=>reject(new Error('WebP inválido'));
        test.src=src;
      });
      currentLogo=src;
      applyEverywhere();
    }catch(e){
      console.warn('Logo oficial indisponível; usando fallback vetorial.',e);
      currentLogo=fallback;
      applyEverywhere();
    }
  }

  applyEverywhere();
  const mo=new MutationObserver(applyEverywhere);
  mo.observe(document.documentElement,{childList:true,subtree:true});
  loadOfficial();
})();
