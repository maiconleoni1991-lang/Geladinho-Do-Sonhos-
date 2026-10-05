(()=>{
  if(window.__gdsCatalogV32)return; window.__gdsCatalogV32=true;
  const categories=['Tradicional','Cremoso','Gourmet','Trufado'];
  const meta={
    Tradicional:{icon:'🍓',subtitle:'Sabores clássicos e refrescantes!'},
    Cremoso:{icon:'🥛',subtitle:'Cremosos e com aquele sabor especial!'},
    Gourmet:{icon:'♕',subtitle:'Uma experiência mais recheada e especial!'},
    Trufado:{icon:'🍫',subtitle:'Geladinhos trufados, intensos e ainda mais especiais!'}
  };
  function priceLabel(arr){
    if(!arr.length)return'';
    const vals=[...new Set(arr.map(p=>Number(p.price||0)).filter(v=>Number.isFinite(v)))].sort((a,b)=>a-b);
    if(!vals.length)return'';
    if(vals.length===1)return money(vals[0])+' cada';
    return money(vals[0])+' a '+money(vals[vals.length-1]);
  }
  function ensureTab(){
    const tb=document.querySelector('.toolbar'); if(!tb)return;
    if(!document.querySelector('.tab[data-filter="Trufado"]')){
      const search=tb.querySelector('.searchWrap');
      const b=document.createElement('button');
      b.className='tab'; b.dataset.filter='Trufado';
      b.innerHTML='🍫 Trufados<small>Nova categoria</small>';
      b.addEventListener('click',()=>setFilter('Trufado'));
      tb.insertBefore(b,search||null);
    }
    let st=document.getElementById('gdsV32CatalogStyle');
    if(!st){st=document.createElement('style');st.id='gdsV32CatalogStyle';st.textContent='.toolbar{grid-template-columns:repeat(5,minmax(0,1fr)) minmax(220px,1.2fr)!important}.tab[data-filter="Trufado"]{border-color:#e7c7a0}.tab[data-filter="Trufado"].on{background:linear-gradient(120deg,#6b3219,#a95728)!important}.section[data-cat="Trufado"] .sectionPrice{background:#f7eadc;color:#7a3c1f}@media(max-width:1000px){.toolbar{grid-template-columns:repeat(3,minmax(0,1fr))!important}.searchWrap{grid-column:span 3!important}}@media(max-width:780px){.toolbar{grid-template-columns:repeat(2,minmax(0,1fr))!important}.searchWrap{grid-column:1/-1!important}}';document.head.appendChild(st)}
  }
  function updateTabPrices(){
    try{
      categories.forEach(cat=>{
        const b=document.querySelector(`.tab[data-filter="${cat}"]`); if(!b)return;
        const small=b.querySelector('small'); if(!small)return;
        const arr=(products||[]).filter(p=>p.cat===cat&&p.active);
        small.textContent=arr.length?priceLabel(arr):cat==='Trufado'?'Nova categoria':'Sem itens';
      });
    }catch(_){}
  }
  const renderV32=function(){
    const catalog=document.getElementById('catalog'); if(!catalog)return;
    let html='';
    categories.forEach(cat=>{
      if(filter!=='Todos'&&filter!==cat)return;
      const arr=visibleProducts(cat); if(!arr.length)return;
      const m=meta[cat]||{icon:'🍧',subtitle:'Sabores especiais!'};
      html+=`<section class="section" data-cat="${cat}"><div class="sectionTitle"><h2>${m.icon} ${cat.toUpperCase()}</h2><p>${m.subtitle}</p><span class="sectionPrice">${priceLabel(arr)}</span></div><div class="cards">${arr.map(cardHTML).join('')}</div></section>`;
    });
    if(!html)html='<p style="text-align:center;color:#705c63;padding:40px">Nenhum sabor encontrado.</p>';
    catalog.innerHTML=html; updateTabPrices();
  };
  try{render=renderV32}catch(e){console.error('Falha ao ativar catálogo v32',e)}
  ensureTab();
  setTimeout(()=>{ensureTab();try{renderV32()}catch(_){}},80);
  setTimeout(()=>{ensureTab();updateTabPrices();try{renderV32()}catch(_){}},900);
})();