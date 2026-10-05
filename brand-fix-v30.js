(()=>{
  const path=location.pathname;
  const sub=/\/(admin|acompanhar)\//.test(path);
  const BASE=sub?new URL('../',location.href):new URL('./',location.href);
  const logo=new URL('assets/logo-oficial.webp?v=30',BASE).href;
  const fav=new URL('assets/favicon-32.png?v=30',BASE).href;
  const touch=new URL('assets/apple-touch-icon.png?v=30',BASE).href;
  function link(doc,rel,href,sizes){let x=doc.querySelector(`link[rel="${rel}"]`);if(!x){x=doc.createElement('link');x.rel=rel;doc.head.appendChild(x)}x.href=href;if(sizes)x.sizes=sizes}
  function apply(doc){if(!doc||!doc.head)return;link(doc,'icon',fav,'32x32');link(doc,'apple-touch-icon',touch,'180x180');doc.querySelectorAll('img.logo,img.logoSmall,img.heroLogo,img.footerLogo').forEach(img=>{img.src=logo;img.removeAttribute('srcset');img.alt='Geladinho dos Sonhos';img.style.objectFit='contain';img.style.objectPosition='center';img.style.visibility='visible';img.style.opacity='1';img.style.maxWidth='100%'})}
  function wire(frame){if(!frame)return;const fix=()=>{try{apply(frame.contentDocument)}catch(_){}};frame.addEventListener('load',fix);setTimeout(fix,180);setTimeout(fix,900)}
  apply(document);
  document.querySelectorAll('iframe').forEach(wire);
  const mo=new MutationObserver(()=>document.querySelectorAll('iframe').forEach(f=>{if(!f.dataset.gdsBrand){f.dataset.gdsBrand='1';wire(f)}}));
  mo.observe(document.documentElement,{childList:true,subtree:true});
})();