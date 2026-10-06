(()=>{
  if(window.__gdsBrandV42)return;window.__gdsBrandV42=true;
  const src=document.currentScript?.src||location.href,ROOT=new URL('./',src);
  const fileLogo=new URL('assets/logo-oficial.webp?v=42',ROOT).href;
  const fav=new URL('assets/favicon-32.png?v=42',ROOT).href,touch=new URL('assets/apple-touch-icon.png?v=42',ROOT).href;
  let logoData='';
  async function loadLogo(){
    if(logoData)return logoData;
    try{
      const parts=await Promise.all([1,2,3,4].map(n=>fetch(new URL(`assets/logo-v13-${n}.txt?v=42`,ROOT),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.text()})));
      const b64=parts.join('').replace(/\s+/g,'');
      if(!b64.startsWith('UklG'))throw new Error();
      logoData='data:image/webp;base64,'+b64;
    }catch(_){logoData=fileLogo}
    return logoData;
  }
  function ensureLink(doc,rel,href,sizes){if(!doc?.head)return;let x=doc.querySelector(`link[rel="${rel}"]`);if(!x){x=doc.createElement('link');x.rel=rel;doc.head.appendChild(x)}x.href=href;if(sizes)x.sizes=sizes}
  async function apply(doc){
    if(!doc)return;ensureLink(doc,'icon',fav,'32x32');ensureLink(doc,'apple-touch-icon',touch,'180x180');
    const data=await loadLogo();
    doc.querySelectorAll('img.logo,img.logoSmall,img.heroLogo,img.footerLogo,.brand img').forEach(img=>{
      img.removeAttribute('srcset');img.alt='Geladinho dos Sonhos';img.style.objectFit='contain';img.style.objectPosition='center';img.style.visibility='visible';img.style.opacity='1';img.style.maxWidth='100%';
      if(img.src!==data)img.src=data;
      if(!img.dataset.gdsLogoFallback42){img.dataset.gdsLogoFallback42='1';img.addEventListener('error',()=>{img.style.visibility='visible';img.style.opacity='1';if(img.src!==fileLogo)img.src=fileLogo},{passive:true})}
    });
  }
  function wire(frame){if(!frame||frame.dataset.gdsBrand42)return;frame.dataset.gdsBrand42='1';const fix=()=>{try{apply(frame.contentDocument)}catch(_){}};frame.addEventListener('load',fix);setTimeout(fix,80);setTimeout(fix,500);setTimeout(fix,1600)}
  function run(){apply(document);document.querySelectorAll('iframe').forEach(wire);document.querySelectorAll('iframe').forEach(f=>{try{apply(f.contentDocument)}catch(_){}})}
  run();new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();
