(()=>{
  const script=[...document.scripts].find(s=>/brand-fix-v31\.js/i.test(s.src));
  const ROOT=script?.src?new URL('./',script.src):new URL('./',location.href);
  const official=new URL('assets/logo-oficial.webp?v=40',ROOT).href;
  const fav=new URL('assets/favicon-32.png?v=40',ROOT).href;
  const touch=new URL('assets/apple-touch-icon.png?v=40',ROOT).href;
  let currentLogo=official;

  function ensureLink(doc,rel,href,sizes){
    if(!doc?.head)return;
    let x=doc.querySelector(`link[rel="${rel}"]`);
    if(!x){x=doc.createElement('link');x.rel=rel;doc.head.appendChild(x)}
    x.href=href;if(sizes)x.sizes=sizes;
  }

  function setImage(img){
    if(!img)return;
    img.removeAttribute('srcset');img.alt='Geladinho dos Sonhos';
    img.style.objectFit='contain';img.style.objectPosition='center';img.style.visibility='visible';img.style.opacity='1';img.style.maxWidth='100%';
    if(img.src!==currentLogo)img.src=currentLogo;
    if(!img.dataset.gdsOfficialLogo){
      img.dataset.gdsOfficialLogo='1';
      img.addEventListener('error',async()=>{
        try{
          const parts=await Promise.all([1,2,3,4].map(async n=>{
            const r=await fetch(new URL(`assets/logo-v13-${n}.txt?v=40`,ROOT),{cache:'no-store'});if(!r.ok)throw new Error();return (await r.text()).trim();
          }));
          const b64=parts.join('');
          if(!b64.startsWith('UklG'))throw new Error();
          currentLogo='data:image/webp;base64,'+b64;
          img.src=currentLogo;
        }catch(_){
          img.style.visibility='hidden';
          console.error('Logo oficial do Geladinho dos Sonhos indisponível.');
        }
      });
    }
  }

  function apply(doc){
    if(!doc)return;
    ensureLink(doc,'icon',fav,'32x32');ensureLink(doc,'apple-touch-icon',touch,'180x180');
    doc.querySelectorAll('img.logo,img.logoSmall,img.heroLogo,img.footerLogo,.brand img').forEach(setImage);
  }
  function wire(frame){
    if(!frame||frame.dataset.gdsBrand40)return;frame.dataset.gdsBrand40='1';
    const fix=()=>{try{apply(frame.contentDocument)}catch(_){}};frame.addEventListener('load',fix);setTimeout(fix,100);setTimeout(fix,700);
  }
  function run(){apply(document);document.querySelectorAll('iframe').forEach(wire);document.querySelectorAll('iframe').forEach(f=>{try{apply(f.contentDocument)}catch(_){}})}
  run();new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();