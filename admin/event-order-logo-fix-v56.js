(()=>{
  if(window.__gdsEventOrderLogoFixV56)return;
  window.__gdsEventOrderLogoFixV56=true;
  const parts=[1,2,3,4].map(n=>new URL(`../assets/logo-v13-${n}.txt?v=56`,location.href).href);
  let logoPromise=null;
  function embeddedLogo(){
    if(!logoPromise)logoPromise=Promise.all(parts.map(u=>fetch(u,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Falha ao carregar o logotipo');return r.text()})))
      .then(xs=>'data:image/webp;base64,'+xs.join('').replace(/\s+/g,''));
    return logoPromise;
  }
  function install(){
    if(typeof window.printE!=='function'){setTimeout(install,100);return}
    if(window.printE.__gdsLogo56)return;
    const original=window.printE;
    const wrapped=async function(id){
      let popup=null;
      const oldOpen=window.open;
      window.open=function(...args){popup=oldOpen.apply(this,args);return popup};
      try{
        const logo=await embeddedLogo();
        const result=original(id);
        if(result&&typeof result.then==='function')await result;
        if(!popup||popup.closed)return;
        for(let i=0;i<60;i++){
          try{
            const img=popup.document.querySelector('img.logo');
            if(img){
              img.src=logo;
              img.setAttribute('data-embedded-logo','v56');
              await new Promise(resolve=>{if(img.complete)resolve();else{img.onload=resolve;img.onerror=resolve}});
              const btn=popup.document.querySelector('.toolbar .print');
              if(btn){btn.textContent='Imprimir / Salvar em PDF';btn.disabled=false}
              return;
            }
          }catch(_){ }
          await new Promise(r=>setTimeout(r,80));
        }
      }catch(err){
        console.error('GDS logo v56:',err);
      }finally{
        window.open=oldOpen;
      }
    };
    wrapped.__gdsLogo56=true;
    window.printE=wrapped;
  }
  embeddedLogo().catch(()=>{});
  install();
})();
