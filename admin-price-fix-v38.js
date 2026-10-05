(()=>{
  const frame=document.getElementById('adminFrame');
  if(!frame)return;
  const PRICES={Tradicional:1.5,Cremoso:4,Gourmet:6,Trufado:7.5};
  function wire(){
    try{
      const d=frame.contentDocument;if(!d)return;
      const add=d.getElementById('addBtn'),cat=d.getElementById('fCat'),price=d.getElementById('fPrice'),title=d.getElementById('modalTitle');
      if(!cat||!price||!title)return;
      const apply=()=>{
        if(!/novo sabor/i.test(title.textContent||''))return;
        const v=PRICES[cat.value];if(v!=null)price.value=v.toFixed(2);
      };
      if(add&&!add.dataset.gdsPriceFix){add.dataset.gdsPriceFix='1';add.addEventListener('click',()=>setTimeout(apply,0));}
      if(!cat.dataset.gdsPriceFix){cat.dataset.gdsPriceFix='1';cat.addEventListener('change',apply);}
    }catch(e){console.error('Falha ao aplicar precos padrao do cadastro',e)}
  }
  frame.addEventListener('load',()=>{setTimeout(wire,120);setTimeout(wire,700)});
  setTimeout(wire,400);
  setInterval(wire,3000);
})();