(()=>{
  if(window.__gdsPriceFixV56)return;
  window.__gdsPriceFixV56=true;
  const fixed={Tradicional:'R$ 1,50',Cremoso:'R$ 4,00',Gourmet:'R$ 6,00',Trufado:'R$ 7,50'};
  function apply(){
    document.querySelectorAll('.tab[data-filter]').forEach(tab=>{
      const value=fixed[tab.dataset.filter];
      const small=tab.querySelector('small');
      if(value&&small)small.textContent=value;
    });
    document.querySelectorAll('.section').forEach(sec=>{
      const title=(sec.querySelector('.sectionTitle h2')?.textContent||'').toUpperCase();
      let value='';
      if(title.includes('TRADICIONAL'))value=fixed.Tradicional;
      else if(title.includes('CREMOSO'))value=fixed.Cremoso;
      else if(title.includes('GOURMET'))value=fixed.Gourmet;
      else if(title.includes('TRUFADO'))value=fixed.Trufado;
      const badge=sec.querySelector('.sectionPrice');
      if(value&&badge)badge.textContent=value+' cada';
    });
  }
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  setTimeout(apply,150);setTimeout(apply,700);setTimeout(apply,1800);
})();
