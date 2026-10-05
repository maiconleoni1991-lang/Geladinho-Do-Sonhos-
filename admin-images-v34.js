(()=>{
  const frame=document.getElementById('adminFrame');
  if(!frame)return;
  const SB='https://qpqruhcspbdxjcnbhdhn.supabase.co';
  const KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let cache=[],busy=false,lastFetch=0;

  async function products(force=false){
    if(!force&&cache.length&&Date.now()-lastFetch<2500)return cache;
    const r=await fetch(`${SB}/rest/v1/products?select=id,name,category,image_url,stock,active,sort_order&order=sort_order.asc`,{headers:{apikey:KEY}});
    if(!r.ok)throw new Error('Não foi possível carregar as imagens dos produtos.');
    cache=await r.json();lastFetch=Date.now();return cache;
  }

  function style(d){
    if(d.getElementById('gdsImageManagerStyle'))return;
    const s=d.createElement('style');s.id='gdsImageManagerStyle';s.textContent=`
      .gdsThumb{width:54px;height:54px;border-radius:11px;object-fit:cover;border:1px solid #efdde4;background:#fff8fb;display:block}
      .gdsNoThumb{width:54px;height:54px;border-radius:11px;border:1px dashed #dcbfc9;background:#fff8fb;display:grid;place-items:center;font-size:10px;text-align:center;color:#8b6d77;font-weight:850;line-height:1.1}
      .gdsImageCell button{border:0;background:transparent;padding:0;cursor:pointer}
      .gdsImagesGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px;padding:16px}
      .gdsImageCard{border:1px solid #efdde4;background:#fff;border-radius:17px;overflow:hidden;box-shadow:0 10px 26px rgba(99,23,51,.06)}
      .gdsImageCard .pic{aspect-ratio:1/1;background:#fff8fb;display:grid;place-items:center;overflow:hidden}
      .gdsImageCard .pic img{width:100%;height:100%;object-fit:cover}
      .gdsImageCard .missing{padding:18px;text-align:center;color:#8b6d77;font-weight:850;font-size:12px}
      .gdsImageCard .body{padding:12px}.gdsImageCard h3{font-size:14px;margin:0;color:#4a101e}.gdsImageCard p{font-size:11px;color:#78616a;margin:5px 0 10px}
      .gdsImageCard button{width:100%;border:0;background:#ff0f68;color:#fff;border-radius:10px;padding:9px;font-weight:900;cursor:pointer}
      .gdsImageToolbar{padding:14px 16px;border-bottom:1px solid #f1e4e9;background:#fffafd;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
      .gdsImageToolbar input{flex:1;min-width:220px;border:1px solid #efdde4;border-radius:12px;padding:10px 12px;background:#fff}
      .gdsImageToolbar b{font-size:12px;color:#4a101e}
      .gdsImageHint{margin-top:8px;padding:10px 12px;border-radius:12px;background:#fff8ed;border:1px solid #f2d7a6;color:#705126;font-size:11px;line-height:1.4}
      .gdsImageStatus{margin-top:7px;font-size:11px;font-weight:850;color:#78616a}.gdsImageStatus.good{color:#128249}.gdsImageStatus.warn{color:#a56500}
      @media(max-width:950px){.gdsImagesGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:700px){.gdsImagesGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:460px){.gdsImagesGrid{grid-template-columns:1fr}}
    `;d.head.appendChild(s);
  }

  function ensureImagePanel(d){
    const app=d.getElementById('appView'),nav=app?.querySelector('.nav');if(!app||!nav)return;
    let btn=nav.querySelector('[data-panel="images"]');
    if(!btn){btn=d.createElement('button');btn.dataset.panel='images';btn.textContent='🖼️ Imagens';const p=nav.querySelector('[data-panel="products"]');p?.insertAdjacentElement('afterend',btn)}
    let panel=d.getElementById('images');
    if(!panel){panel=d.createElement('section');panel.className='panel';panel.id='images';panel.innerHTML='<div class="card"><div class="cardHead"><h2>Imagens dos produtos</h2></div><div class="gdsImageToolbar"><input id="gdsImageSearch" type="search" placeholder="Buscar sabor..."><b id="gdsImageSummary">Carregando...</b></div><div id="gdsImagesGrid" class="gdsImagesGrid"></div></div>';app.appendChild(panel)}
    if(!btn.dataset.gdsWired){btn.dataset.gdsWired='1';btn.addEventListener('click',()=>{nav.querySelectorAll('button').forEach(x=>x.classList.remove('on'));btn.classList.add('on');app.querySelectorAll('.panel').forEach(x=>x.classList.remove('on'));panel.classList.add('on');renderImagePanel(d,true)})}
    const search=d.getElementById('gdsImageSearch');if(search&&!search.dataset.gdsWired){search.dataset.gdsWired='1';search.addEventListener('input',()=>renderImagePanel(d,false))}
  }

  function openEditor(d,id){
    try{const productsBtn=d.querySelector('.nav [data-panel="products"]');productsBtn?.click();d.defaultView.editP(id);setTimeout(()=>enhanceModal(d),60)}catch(e){console.error('Falha ao abrir editor de imagem',e)}
  }

  async function renderImagePanel(d,force=false){
    try{
      const list=await products(force),q=(d.getElementById('gdsImageSearch')?.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      const visible=list.filter(p=>!q||(`${p.name} ${p.category}`).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q));
      const missing=list.filter(p=>!p.image_url).length,grid=d.getElementById('gdsImagesGrid');if(!grid)return;
      grid.innerHTML=visible.map(p=>`<article class="gdsImageCard"><div class="pic">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}">`:'<div class="missing">Sem imagem<br>1:1</div>'}</div><div class="body"><h3>${esc(p.name)}</h3><p>${esc(p.category)} · estoque ${Number(p.stock)||0}</p><button type="button" data-edit-image="${p.id}">${p.image_url?'Trocar imagem':'Adicionar imagem'}</button></div></article>`).join('')||'<div class="empty">Nenhum produto encontrado.</div>';
      grid.querySelectorAll('[data-edit-image]').forEach(b=>b.onclick=()=>openEditor(d,b.dataset.editImage));
      const sum=d.getElementById('gdsImageSummary');if(sum)sum.textContent=`${list.length-missing} com imagem · ${missing} sem imagem`;
      const stat=d.getElementById('sNoImage');if(stat)stat.textContent=missing;
    }catch(e){const grid=d.getElementById('gdsImagesGrid');if(grid)grid.innerHTML=`<div class="empty">${esc(e.message)}</div>`}
  }

  async function decorateTable(d){
    const table=d.querySelector('#products table'),tbody=d.getElementById('productRows');if(!table||!tbody)return;
    const head=table.querySelector('thead tr');if(head&&!head.querySelector('.gdsImageHead')){const th=d.createElement('th');th.className='gdsImageHead';th.textContent='Imagem';head.insertBefore(th,head.lastElementChild)}
    const list=await products(false),rows=[...tbody.querySelectorAll('tr')];
    rows.forEach((r,i)=>{
      const p=list[i];if(!p)return;let cell=r.querySelector('.gdsImageCell');if(!cell){cell=d.createElement('td');cell.className='gdsImageCell';r.insertBefore(cell,r.lastElementChild)}
      cell.innerHTML=`<button type="button" title="${p.image_url?'Trocar':'Adicionar'} imagem">${p.image_url?`<img class="gdsThumb" src="${esc(p.image_url)}" alt="${esc(p.name)}">`:'<span class="gdsNoThumb">Sem<br>imagem</span>'}</button>`;
      cell.querySelector('button').onclick=()=>openEditor(d,p.id);
    });
  }

  function ensureImageStat(d){
    const grid=d.querySelector('#dashboard .grid4');if(!grid||d.getElementById('sNoImage'))return;
    grid.style.gridTemplateColumns='repeat(auto-fit,minmax(170px,1fr))';const x=d.createElement('div');x.className='stat';x.innerHTML='<small>Produtos sem imagem</small><strong id="sNoImage">0</strong>';x.style.cursor='pointer';x.title='Abrir gestão de imagens';x.onclick=()=>d.querySelector('.nav [data-panel="images"]')?.click();grid.appendChild(x)
  }

  function enhanceModal(d){
    const f=d.getElementById('fImage'),preview=d.getElementById('preview');if(!f||!preview)return;
    const field=f.closest('.field');if(!field)return;
    let hint=d.getElementById('gdsImageHint');if(!hint){hint=d.createElement('div');hint.id='gdsImageHint';hint.className='gdsImageHint';hint.innerHTML='<b>Padrão recomendado:</b> imagem quadrada 1:1, preferencialmente 1000 × 1000 px. Use somente artes da marca Geladinho dos Sonhos. A imagem escolhida será enviada ao salvar o produto.<div id="gdsImageStatus" class="gdsImageStatus">Nenhuma nova imagem selecionada.</div>';field.appendChild(hint)}
    const cat=d.getElementById('fCat');if(cat&&!Array.from(cat.options).some(o=>o.value==='Trufado')){const o=d.createElement('option');o.value='Trufado';o.textContent='Trufado';cat.appendChild(o)}
    if(cat&&!cat.dataset.gdsPriceWired){cat.dataset.gdsPriceWired='1';cat.addEventListener('change',()=>{if(!String(d.getElementById('modalTitle')?.textContent||'').toLowerCase().includes('novo'))return;const map={Tradicional:1.5,Cremoso:4,Gourmet:6,Trufado:7.5};const price=d.getElementById('fPrice');if(price&&map[cat.value]!=null)price.value=map[cat.value].toFixed(2)})}
    if(!f.dataset.gdsImageWired){f.dataset.gdsImageWired='1';f.addEventListener('change',()=>{const file=f.files?.[0],s=d.getElementById('gdsImageStatus');if(!file){if(s){s.textContent='Nenhuma nova imagem selecionada.';s.className='gdsImageStatus'}return}const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{const square=Math.abs(img.width-img.height)<=Math.max(img.width,img.height)*.03;if(s){s.textContent=`${img.width} × ${img.height} px ${square?'✓ formato 1:1':'⚠ prefira formato quadrado 1:1'}`;s.className='gdsImageStatus '+(square?'good':'warn')}URL.revokeObjectURL(url)};img.src=url})}
  }

  async function enhance(force=false){
    if(busy)return;busy=true;
    try{const d=frame.contentDocument;if(!d||!d.body)return;style(d);ensureImagePanel(d);ensureImageStat(d);enhanceModal(d);if(force){cache=[];lastFetch=0}await products(force);await decorateTable(d);await renderImagePanel(d,false)}catch(e){console.error('Falha ao preparar gestão de imagens',e)}finally{busy=false}
  }

  frame.addEventListener('load',()=>{setTimeout(()=>enhance(true),250);setTimeout(()=>enhance(false),1200)});
  setTimeout(()=>enhance(true),700);
  setInterval(()=>enhance(true),5000);
})();
