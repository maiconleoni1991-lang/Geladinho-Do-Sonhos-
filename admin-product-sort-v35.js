(()=>{
  const frame=document.getElementById('adminFrame');
  if(!frame)return;
  const SB='https://qpqruhcspbdxjcnbhdhn.supabase.co';
  const KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
  let sortMode='az',statusMode='all',busy=false,cache=[],lastFetch=0;
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

  async function getProducts(force=false){
    if(!force&&cache.length&&Date.now()-lastFetch<1500)return cache;
    const r=await fetch(`${SB}/rest/v1/products?select=id,name,category,active,sort_order&order=sort_order.asc`,{headers:{apikey:KEY}});
    if(!r.ok)throw new Error('Não foi possível carregar os produtos.');
    cache=await r.json();lastFetch=Date.now();return cache;
  }

  function addStyle(d){
    if(d.getElementById('gdsProductSortStyle'))return;
    const s=d.createElement('style');s.id='gdsProductSortStyle';s.textContent=`
      .gdsProductToolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid #f0e1e6;background:#fffafd}
      .gdsProductToolbar strong{font-size:12px;color:#4a101e;margin-right:3px}
      .gdsProductToolbar button{border:1px solid #efdde4;background:#fff;color:#4a101e;border-radius:10px;padding:8px 11px;font-size:12px;font-weight:900;cursor:pointer}
      .gdsProductToolbar button.on{background:#ff0f68;color:#fff;border-color:#ff0f68}
      .gdsProductToolbar .sep{width:1px;height:25px;background:#efdde4;margin:0 2px}
      .gdsStatusSelect{border:1px solid #efdde4;border-radius:9px;padding:7px 9px;font-weight:900;font-size:12px;background:#fff;min-width:98px}
      .gdsStatusSelect.is-active{color:#128249;background:#eefaf3;border-color:#bde7cc}
      .gdsStatusSelect.is-inactive{color:#b02a42;background:#fff1f4;border-color:#efc4ce}
      @media(max-width:650px){.gdsProductToolbar{align-items:stretch}.gdsProductToolbar strong{width:100%}.gdsProductToolbar button{flex:1}.gdsProductToolbar .sep{display:none}}
    `;d.head.appendChild(s);
  }

  function ensureToolbar(d){
    const panel=d.getElementById('products'),card=panel?.querySelector('.card'),tableWrap=panel?.querySelector('.tableWrap');if(!card||!tableWrap)return;
    let bar=d.getElementById('gdsProductToolbar');
    if(!bar){
      bar=d.createElement('div');bar.id='gdsProductToolbar';bar.className='gdsProductToolbar';
      bar.innerHTML='<strong>Organizar sabores:</strong><button type="button" data-sort="az">A → Z</button><button type="button" data-sort="za">Z → A</button><span class="sep"></span><strong>Status:</strong><button type="button" data-status="all">Todos</button><button type="button" data-status="active">Ativos</button><button type="button" data-status="inactive">Inativos</button>';
      card.insertBefore(bar,tableWrap);
      bar.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{sortMode=b.dataset.sort;apply(d)});
      bar.querySelectorAll('[data-status]').forEach(b=>b.onclick=()=>{statusMode=b.dataset.status;apply(d)});
    }
    bar.querySelectorAll('[data-sort]').forEach(b=>b.classList.toggle('on',b.dataset.sort===sortMode));
    bar.querySelectorAll('[data-status]').forEach(b=>b.classList.toggle('on',b.dataset.status===statusMode));
  }

  function setStatusCell(d,row,p){
    const cell=row.children[4];if(!cell)return;
    let sel=cell.querySelector('.gdsStatusSelect');
    if(!sel){sel=d.createElement('select');sel.className='gdsStatusSelect';sel.innerHTML='<option value="true">ATIVO</option><option value="false">INATIVO</option>';cell.innerHTML='';cell.appendChild(sel)}
    sel.value=String(!!p.active);sel.classList.toggle('is-active',!!p.active);sel.classList.toggle('is-inactive',!p.active);
    sel.onchange=async()=>{
      const want=sel.value==='true';if(want===!!p.active)return;
      sel.disabled=true;
      try{await d.defaultView.toggleP(p.id);cache=[];lastFetch=0;setTimeout(()=>apply(d,true),120)}catch(e){alert('Não foi possível alterar o status do produto.')}finally{setTimeout(()=>{sel.disabled=false},450)}
    };
  }

  async function apply(d,force=false){
    if(busy)return;busy=true;
    try{
      addStyle(d);ensureToolbar(d);
      const tbody=d.getElementById('productRows');if(!tbody)return;
      const list=await getProducts(force),byId=new Map(list.map(p=>[p.id,p]));
      let rows=[...tbody.querySelectorAll('tr')];
      rows.forEach((row,i)=>{if(!row.dataset.gdsProductId&&list[i])row.dataset.gdsProductId=list[i].id});
      rows=rows.map((row,i)=>({row,p:byId.get(row.dataset.gdsProductId)||list[i]})).filter(x=>x.p);
      rows.forEach(({row,p})=>{setStatusCell(d,row,p);const show=statusMode==='all'||(statusMode==='active'&&p.active)||(statusMode==='inactive'&&!p.active);row.style.display=show?'':'none'});
      rows.sort((a,b)=>{const c=a.p.name.localeCompare(b.p.name,'pt-BR',{sensitivity:'base'});return sortMode==='za'?-c:c});
      rows.forEach(x=>tbody.appendChild(x.row));
      ensureToolbar(d);
    }catch(e){console.error('Falha ao organizar produtos',e)}finally{busy=false}
  }

  function install(){
    try{const d=frame.contentDocument;if(!d||!d.body)return;addStyle(d);ensureToolbar(d);apply(d,true)}catch(e){console.error(e)}
  }
  frame.addEventListener('load',()=>{setTimeout(install,350);setTimeout(install,1100)});
  setTimeout(install,700);
  setInterval(()=>{try{const d=frame.contentDocument;if(d?.getElementById('productRows'))apply(d,true)}catch(_){}},3000);
})();
