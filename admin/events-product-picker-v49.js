(()=>{
  if(window.__gdsEventProductPickerV49)return;window.__gdsEventProductPickerV49=true;
  const CATS=['Tradicional','Cremoso','Gourmet','Trufado'];
  const collator=new Intl.Collator('pt-BR',{sensitivity:'base',numeric:true});
  let products=[];
  const $=id=>document.getElementById(id);
  const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  function catOf(v){const n=norm(v);return CATS.find(c=>norm(c)===n)||String(v||'Outros')}
  function sorted(){return [...products].sort((a,b)=>{const ca=CATS.indexOf(catOf(a.category)),cb=CATS.indexOf(catOf(b.category));if(ca!==cb)return (ca<0?99:ca)-(cb<0?99:cb);return collator.compare(a.name,b.name)})}
  function buildSelect(select,selected=''){
    const current=selected||select?.value||'';
    select.innerHTML='';
    CATS.forEach(cat=>{
      const list=sorted().filter(p=>catOf(p.category)===cat);
      if(!list.length)return;
      const group=document.createElement('optgroup');group.label=cat;
      list.forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=`${p.name} · ${money(p.price)} · estoque ${p.stock}`;o.selected=p.id===current;group.appendChild(o)});
      select.appendChild(group);
    });
    const others=sorted().filter(p=>!CATS.includes(catOf(p.category)));
    if(others.length){const group=document.createElement('optgroup');group.label='Outros';others.forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=`${p.name} · ${money(p.price)} · estoque ${p.stock}`;o.selected=p.id===current;group.appendChild(o)});select.appendChild(group)}
    if(current)select.value=current;
  }
  function wireLine(line){
    if(!line||line.dataset.gds49==='1')return;line.dataset.gds49='1';
    const sel=line.querySelector('select');if(sel)buildSelect(sel,sel.value);
  }
  function existingLine(pid){return [...document.querySelectorAll('#lines .line')].find(l=>l.querySelector('select')?.value===pid)}
  function flash(line){line.animate?.([{background:'#fff1f6'},{background:'transparent'}],{duration:650});line.scrollIntoView?.({behavior:'smooth',block:'nearest'})}
  function addProduct(pid){
    const p=products.find(x=>x.id===pid);if(!p)return;
    let line=existingLine(pid);
    if(line){const q=line.querySelector('input[type="number"]');q.value=Math.max(1,Number(q.value)||1)+1;document.dispatchEvent(new Event('gds-event-calc'));flash(line);return}
    line=document.createElement('div');line.className='line';line.dataset.gds49='1';
    const sel=document.createElement('select');buildSelect(sel,pid);sel.value=pid;
    const qty=document.createElement('input');qty.type='number';qty.min='1';qty.step='1';qty.value='1';
    const del=document.createElement('button');del.type='button';del.textContent='×';del.onclick=()=>{line.remove();document.dispatchEvent(new Event('gds-event-calc'))};
    [sel,qty].forEach(x=>x.addEventListener('change',()=>document.dispatchEvent(new Event('gds-event-calc'))));
    line.append(sel,qty,del);$('lines')?.appendChild(line);
    document.dispatchEvent(new Event('gds-event-calc'));flash(line);
  }
  function renderPicker(){
    const host=document.querySelector('.lines');if(!host||$('gdsEventPicker49'))return;
    const style=document.createElement('style');style.id='gdsEventPicker49Style';style.textContent=`
      .gdsEventPicker49{margin:10px 0 12px;padding:10px;border:1px solid #f0dce4;border-radius:14px;background:#fffafc}
      .gdsEventPicker49 h3{margin:0 0 4px;color:#4a101e;font-size:15px}.gdsEventPicker49>p{margin:0 0 10px;color:#78616a;font-size:11px}
      .gdsCatGrid49{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.gdsCat49{border:1px solid #efdde4;border-radius:13px;background:#fff;overflow:hidden}
      .gdsCat49 h4{margin:0;padding:9px 10px;background:#fff1f6;color:#4a101e;font-size:12px}.gdsFlavorList49{display:grid;gap:5px;padding:7px}
      .gdsFlavor49{width:100%;border:1px solid #f0dfe6;background:#fff;border-radius:10px;padding:8px 9px;text-align:left;color:#29171d;display:grid;grid-template-columns:1fr auto;gap:3px 8px;align-items:center;font-size:12px}
      .gdsFlavor49 b{font-size:12px}.gdsFlavor49 small{color:#78616a;font-size:10px}.gdsFlavor49 .stock{grid-row:1/3;grid-column:2;font-size:10px;font-weight:900;color:#14753e}.gdsFlavor49.zero .stock{color:#b02a42}.gdsFlavor49:active{transform:scale(.99);background:#fff0f5}
      .gdsAdded49{margin:10px 0 4px;font-size:12px;font-weight:900;color:#4a101e}
      #addLine{font-size:11px!important;background:#fff!important;color:#78616a!important;border-style:dashed!important}
      @media(max-width:620px){.gdsCatGrid49{grid-template-columns:1fr}.gdsFlavor49{min-height:48px}}
    `;document.head.appendChild(style);
    const box=document.createElement('div');box.id='gdsEventPicker49';box.className='gdsEventPicker49';box.innerHTML='<h3>Adicionar sabores</h3><p>Toque no sabor para adicionar. Toques repetidos aumentam a quantidade.</p><div class="gdsCatGrid49"></div><div class="gdsAdded49">Sabores adicionados à encomenda</div>';
    const grid=box.querySelector('.gdsCatGrid49');
    CATS.forEach(cat=>{
      const list=sorted().filter(p=>catOf(p.category)===cat);
      const sec=document.createElement('section');sec.className='gdsCat49';
      const h=document.createElement('h4');h.textContent=`${cat} (${list.length})`;sec.appendChild(h);
      const flavors=document.createElement('div');flavors.className='gdsFlavorList49';
      if(!list.length){const empty=document.createElement('small');empty.style.padding='7px';empty.style.color='#78616a';empty.textContent='Nenhum sabor cadastrado.';flavors.appendChild(empty)}
      list.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='gdsFlavor49'+(Number(p.stock)<=0?' zero':'');const name=document.createElement('b');name.textContent=p.name;const meta=document.createElement('small');meta.textContent=money(p.price);const stock=document.createElement('span');stock.className='stock';stock.textContent=Number(p.stock)>0?`Estoque ${p.stock}`:'Sem estoque';b.append(name,meta,stock);b.onclick=()=>addProduct(p.id);flavors.appendChild(b)});
      sec.appendChild(flavors);grid.appendChild(sec);
    });
    const lines=$('lines');host.insertBefore(box,lines);
    const add=$('addLine');if(add)add.textContent='+ Adicionar linha manual';
  }
  function organizeLines(){document.querySelectorAll('#lines .line').forEach(wireLine)}
  async function loadProducts(){
    if(!window.GDS48?.sb)return;
    const {data,error}=await GDS48.sb.from('products').select('id,name,category,price,stock,active').order('name',{ascending:true});
    if(error){console.error('GDS picker eventos v49',error);return}
    products=data||[];renderPicker();organizeLines();
  }
  function boot(){
    loadProducts();
    const dlg=$('dlg');if(dlg)new MutationObserver(()=>{if(dlg.open){renderPicker();organizeLines()}}).observe(dlg,{attributes:true,attributeFilter:['open']});
    const lines=$('lines');if(lines)new MutationObserver(()=>organizeLines()).observe(lines,{childList:true,subtree:false});
    
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();