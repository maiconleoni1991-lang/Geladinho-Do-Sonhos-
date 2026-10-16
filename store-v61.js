(()=>{
'use strict';
const SB='https://qpqruhcspbdxjcnbhdhn.supabase.co';
const KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
const WHATS='5516992542888';
const DELIVERY_FEE=6;
const VAPID_PUBLIC_KEY='BOJ0jB7oR4VvBDiU0ejprYRayZeWHFEOdb8DliQNXpWf5TzXAo8CJbpy3879L1MioYEF393gc3ri1iauqD3vPmw';
const $=id=>document.getElementById(id);
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
let products=[],cart=loadCart(),filter='Todos',term='',storeOpen=false,installPrompt=null,stockRefreshBusy=false,checkoutBusy=false;

// Presença ao vivo da loja para o painel administrativo.
let presenceChannel=null,presenceActivity='navegando';
function setPresenceActivity(activity){presenceActivity=activity||'navegando';trackPresence()}
function trackPresence(){if(!presenceChannel)return;presenceChannel.track({role:'shopper',visible:!document.hidden,activity:presenceActivity,cart_qty:cartQty(),at:new Date().toISOString()}).catch(()=>{})}
function startPresence(){
  try{
    const client=window.supabase?.createClient?.(SB,KEY);
    if(!client)return;
    const visitorId=sessionStorage.getItem('gds_presence_id')||crypto.randomUUID();
    sessionStorage.setItem('gds_presence_id',visitorId);
    presenceChannel=client.channel('gds-store-presence',{config:{presence:{key:visitorId}}});
    presenceChannel.subscribe(status=>{if(status==='SUBSCRIBED')trackPresence()});
    document.addEventListener('visibilitychange',trackPresence);
    window.addEventListener('pagehide',()=>presenceChannel?.untrack().catch(()=>{}));
    setInterval(trackPresence,15000);
  }catch(e){console.warn('Presença da loja indisponível',e)}
}


async function api(path,opt={}){
  const r=await fetch(SB+path,{...opt,headers:{apikey:KEY,'Content-Type':'application/json',...(opt.headers||{})},cache:'no-store'});
  if(!r.ok){let e={};try{e=await r.json()}catch(_){}throw new Error(e.message||e.error_description||`Erro ${r.status}`)}
  return r.status===204?null:r.json();
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function loadCart(){try{return JSON.parse(localStorage.getItem('gds_cart_v63')||'{}')||{}}catch(_){return {}}}
function saveCart(){localStorage.setItem('gds_cart_v63',JSON.stringify(cart));updateCartCount();if(cartQty()>0)setPresenceActivity('carrinho com itens')}
function cartQty(){return Object.values(cart).reduce((a,b)=>a+Number(b||0),0)}
function updateCartCount(){const n=cartQty();document.querySelectorAll('[data-cart-count]').forEach(x=>x.textContent=n)}
function subtotal(){return Object.entries(cart).reduce((sum,[slug,q])=>{const p=products.find(x=>x.slug===slug);return sum+(p?Number(p.price)*q:0)},0)}
function fulfillment(){return document.querySelector('input[name="fulfillment"]:checked')?.value||'retirada'}
function paymentMethod(){return document.querySelector('input[name="paymentMethod"]:checked')?.value||'Pix'}

async function loadStore(){
  $('products').innerHTML='<div class="loadingBox" style="grid-column:1/-1">Carregando sabores disponíveis…</div>';
  try{
    const [p,s,t]=await Promise.all([
      api('/rest/v1/products?select=slug,name,category,description,price,stock,active,image_url,sort_order&active=eq.true&order=category.asc,name.asc'),
      api('/rest/v1/store_settings?id=eq.main&select=is_open'),
      api('/rest/v1/public_testimonials?select=rating,comment,created_at&order=created_at.desc&limit=6')
    ]);
    products=(Array.isArray(p)?p:[]).map(x=>({...x,price:Number(x.price),stock:Number(x.stock||0)}));
    const catOrder={Tradicional:0,Cremoso:1,Gourmet:2,Trufado:3};
    products.sort((a,b)=>(a.stock<=0?1:0)-(b.stock<=0?1:0)||(catOrder[a.category]??99)-(catOrder[b.category]??99)||(Number(a.sort_order)||999)-(Number(b.sort_order)||999)||String(a.name).localeCompare(String(b.name),'pt-BR'));
    storeOpen=!!s?.[0]?.is_open;
    renderStatus();renderFilters();renderProducts();renderTestimonials(Array.isArray(t)?t:[]);cleanCart();
  }catch(e){
    console.error(e);storeOpen=false;renderStatus('Não foi possível conectar à loja agora.');
    $('products').innerHTML=`<div class="errorBox" style="grid-column:1/-1"><b>Não conseguimos carregar o cardápio.</b><br>${esc(e.message)}<br><button class="secondary" style="margin-top:12px" onclick="location.reload()">Tentar novamente</button></div>`;
  }
}
function cleanCart(){let changed=false;for(const slug of Object.keys(cart)){const p=products.find(x=>x.slug===slug);if(!p||p.stock<=0){delete cart[slug];changed=true}else if(cart[slug]>p.stock){cart[slug]=p.stock;changed=true}}if(changed)saveCart();else updateCartCount()}
async function refreshStockOnly(){
  if(stockRefreshBusy||checkoutBusy)return;
  stockRefreshBusy=true;
  try{
    const p=await api('/rest/v1/products?select=slug,name,category,description,price,stock,active,image_url,sort_order&active=eq.true&order=category.asc,name.asc');
    products=(Array.isArray(p)?p:[]).map(x=>({...x,price:Number(x.price),stock:Number(x.stock||0)}));
    const catOrder={Tradicional:0,Cremoso:1,Gourmet:2,Trufado:3};
    products.sort((a,b)=>(a.stock<=0?1:0)-(b.stock<=0?1:0)||(catOrder[a.category]??99)-(catOrder[b.category]??99)||(Number(a.sort_order)||999)-(Number(b.sort_order)||999)||String(a.name).localeCompare(String(b.name),'pt-BR'));
    cleanCart();renderProducts();
    if($('cartOverlay')?.classList.contains('show'))renderCart();
  }finally{stockRefreshBusy=false}
}
async function verifyCartStock(){
  const requested=Object.entries(cart).filter(([,q])=>Number(q)>0);
  if(!requested.length)throw new Error('Seu carrinho está vazio.');
  const p=await api('/rest/v1/products?select=slug,name,category,description,price,stock,active,image_url,sort_order&active=eq.true&order=category.asc,name.asc');
  const fresh=(Array.isArray(p)?p:[]).map(x=>({...x,price:Number(x.price),stock:Number(x.stock||0)}));
  const problems=[];
  for(const [slug,qRaw] of requested){
    const q=Number(qRaw)||0,fp=fresh.find(x=>x.slug===slug);
    if(!fp||fp.stock<=0)problems.push((fp?.name||slug)+' está esgotado');
    else if(fp.stock<q)problems.push((fp?.name||slug)+': quantidade solicitada indisponível');
  }
  products=fresh;
  cleanCart();renderProducts();
  if($('cartOverlay')?.classList.contains('show'))renderCart();
  if(problems.length)throw new Error('O estoque mudou enquanto você fazia o pedido. '+problems.join(' · ')+'. Atualizamos seu carrinho.');
}
function renderStatus(custom){const b=$('storeStatus');b.className='statusbar '+(custom?'closed':storeOpen?'open':'closed');b.textContent=custom|| (storeOpen?'● Vendas online abertas · Faça seu pedido pelo site.':'● Vendas online fechadas · Cardápio disponível somente para consulta.');const c=$('checkoutBtn');if(c){c.disabled=checkoutBusy||!storeOpen;c.textContent=checkoutBusy?'Registrando pedido…':(storeOpen?'Confirmar pedido':'Loja fechada para pedidos online')}}
function renderFilters(){const base=['Tradicional','Cremoso','Gourmet','Trufado'];const extras=[...new Set(products.map(p=>p.category).filter(Boolean).filter(c=>!base.includes(c)))];const cats=['Todos',...base,...extras];$('filters').innerHTML=cats.map(c=>`<button class="filter ${filter===c?'on':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');$('filters').querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{filter=b.dataset.cat;renderFilters();renderProducts()})}
function renderProducts(){
  const q=term.trim().toLowerCase();
  const list=products.filter(p=>(filter==='Todos'||p.category===filter)&&(!q||`${p.name} ${p.category} ${p.description||''}`.toLowerCase().includes(q)));
  if(!list.length){$('products').innerHTML='<div class="emptyBox" style="grid-column:1/-1">Nenhum sabor encontrado.</div>';return}
  $('products').innerHTML=list.map(p=>{
    const selected=Number(cart[p.slug]||0);
    const blocked=p.stock<=0||!storeOpen;
    return `<article class="product">
      <div class="photo">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:''}${p.stock<=0?'<div class="sold">ESGOTADO</div>':''}</div>
      <div class="body">
        <div class="cat">${esc(p.category)}</div>
        <h3>${esc(p.name)}</h3>
        <div class="desc">${esc(p.description||'Geladinho preparado com muito sabor e cremosidade.')}</div>
        <div class="meta"><div class="price">${money(p.price)}</div><div class="stock">${p.stock>0?'Disponível':'Esgotado'}</div></div>
        <div class="pickLabel">${blocked?(!storeOpen?'Loja fechada':'Indisponível'):'Escolha a quantidade'}</div>
        <div class="pickQty ${selected>0?'selected':''}">
          <button type="button" data-card-dec="${esc(p.slug)}" aria-label="Diminuir ${esc(p.name)}" ${blocked||selected<=0?'disabled':''}>−</button>
          <div class="pickCount"><b>${selected}</b><small>${selected===1?'unidade':'unidades'}</small></div>
          <button type="button" data-card-inc="${esc(p.slug)}" aria-label="Adicionar ${esc(p.name)}" ${blocked||selected>=p.stock?'disabled':''}>+</button>
        </div>
      </div>
    </article>`
  }).join('');
  $('products').querySelectorAll('[data-card-dec]').forEach(b=>b.onclick=()=>cardAdjust(b.dataset.cardDec,-1));
  $('products').querySelectorAll('[data-card-inc]').forEach(b=>b.onclick=()=>cardAdjust(b.dataset.cardInc,1));
}
function cardAdjust(slug,d){
  const p=products.find(x=>x.slug===slug);
  if(!p||p.stock<=0||!storeOpen)return;
  const current=Number(cart[slug]||0),next=current+d;
  if(next<=0)delete cart[slug];
  else if(next<=p.stock)cart[slug]=next;
  else return alert('Quantidade solicitada indisponível para este sabor.');
  saveCart();
  renderProducts();
  if($('cartOverlay')?.classList.contains('show'))renderCart();
  const fc=$('floatCart');
  if(d>0&&fc&&fc.animate)fc.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});
}
function addToCart(slug){cardAdjust(slug,1)}
function changeQty(slug,d){
  const p=products.find(x=>x.slug===slug);
  if(!p)return;
  const n=(cart[slug]||0)+d;
  if(n<=0)delete cart[slug];
  else if(n<=p.stock)cart[slug]=n;
  else return alert('Quantidade solicitada indisponível para este sabor.');
  saveCart();renderProducts();renderCart();
}
function renderCart(){const rows=Object.entries(cart).filter(([,q])=>q>0);$('cartRows').innerHTML=rows.length?rows.map(([slug,q])=>{const p=products.find(x=>x.slug===slug);if(!p)return'';return `<div class="cartRow"><div><b>${esc(p.name)}</b><small>${esc(p.category)} · ${q} unidade(s)</small><div class="qty"><button data-dec="${esc(slug)}">−</button><span>${q}</span><button data-inc="${esc(slug)}">+</button></div></div><div class="rowPrice">${money(p.price*q)}</div></div>`}).join(''):'<div class="emptyBox">Seu carrinho está vazio.</div>';$('cartRows').querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>changeQty(b.dataset.dec,-1));$('cartRows').querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>changeQty(b.dataset.inc,1));updateTotals();renderStatus()}
function updateTotals(){const sub=subtotal(),delivery=fulfillment()==='entrega';$('subtotal').textContent=money(sub);$('feeRow').hidden=!delivery;$('fee').textContent=money(delivery?DELIVERY_FEE:0);$('total').textContent=money(sub+(delivery?DELIVERY_FEE:0));$('addressFields').classList.toggle('show',delivery)}
function openCart(){setPresenceActivity(cartQty()>0?'visualizando carrinho':'visualizando carrinho');renderCart();$('cartOverlay').classList.add('show');document.body.style.overflow='hidden'}
function closeCart(){$('cartOverlay').classList.remove('show');document.body.style.overflow=''}
async function lookupCep(){const cep=($('cep').value||'').replace(/\D/g,'');if(cep.length!==8)return;try{const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`,{cache:'no-store'});const d=await r.json();if(d.erro)return alert('CEP não encontrado.');if((d.localidade||'').toLowerCase()!=='monte alto'||String(d.uf||'').toUpperCase()!=='SP')return alert('No momento, entregamos somente em Monte Alto/SP.');$('street').value=d.logradouro||'';$('district').value=d.bairro||'';$('number').focus()}catch(_){}}
function buildWhats(o,name,phone,address){const lines=['*PEDIDO - GELADINHO DOS SONHOS*','',`Pedido: #${o.public_code}`,`Cliente: ${name}`,`WhatsApp: ${phone}`,''];for(const [slug,q] of Object.entries(cart)){const p=products.find(x=>x.slug===slug);if(p)lines.push(`${q}x ${p.name} — ${money(p.price*q)}`)}lines.push('',`Subtotal: ${money(o.subtotal)}`);if(fulfillment()==='entrega'){lines.push(`Entrega: ${money(o.delivery_fee)}`,`Total: ${money(o.total)}`,'',`Endereço: ${address.street}, ${address.number}${address.complement?' - '+address.complement:''}`,`${address.district} - Monte Alto/SP · CEP ${address.cep}`);if(address.reference)lines.push(`Referência: ${address.reference}`)}else{lines.push(`Total: ${money(o.total)}`,'','Retirada: Rua Aparecida Marchetti Guzzo, 161 - Vale dos Sonhos - Monte Alto/SP')}const obs=$('notes').value.trim();if(obs)lines.push('',`Observação: ${obs}`);lines.push('',`Pagamento: ${paymentMethod()}`);if(paymentMethod()==='Pix')lines.push('O Pix será liberado após a loja aceitar o pedido.');lines.push('',`Acompanhe pelo código ${o.public_code}.`);return lines.join('\n')}
async function checkout(){
  if(checkoutBusy)return;
  const errorBox=$('checkoutError');if(errorBox){errorBox.hidden=true;errorBox.textContent=''}
  const initialItems=Object.entries(cart).filter(([,q])=>Number(q)>0);
  if(!initialItems.length)return alert('Adicione pelo menos um geladinho.');
  const name=$('customerName').value.trim();
  const phone=$('customerPhone').value.replace(/\D/g,'');
  if(name.length<2)return alert('Informe seu nome.');
  if(phone.length<10||phone.length>13)return alert('Informe um WhatsApp válido com DDD.');
  const delivery=fulfillment();let address=null;
  if(delivery==='entrega'){
    const cep=$('cep').value.replace(/\D/g,'');
    const street=$('street').value.trim(),number=$('number').value.trim(),district=$('district').value.trim();
    const complement=$('complement').value.trim(),reference=$('reference').value.trim();
    if(cep.length!==8||!street||!number||!district)return alert('Preencha CEP, rua, número e bairro.');
    address={cep,street,number,district,complement,reference,city:'Monte Alto',state:'SP'};
  }
  checkoutBusy=true;
  setPresenceActivity('finalizando pedido');
  renderStatus();
  try {
    // Não abre janela vazia antes da confirmação: navegadores internos podem interromper a compra.
    await verifyCartStock();
    const items=Object.entries(cart).filter(([,q])=>Number(q)>0);
    if(!items.length)throw new Error('Os itens do carrinho ficaram sem estoque.');
    const o=await api('/rest/v1/rpc/create_store_order_v89',{
      method:'POST',
      body:JSON.stringify({
        p_customer_name:name,p_customer_phone:phone,p_fulfillment:delivery,
        p_address:address,p_notes:$('notes').value.trim()||null,
        p_items:items.map(([slug,quantity])=>({slug,quantity})),
        p_payment_method:paymentMethod()
      })
    });
    if(!o?.public_code||!o?.tracking_token){
      throw new Error('Não recebemos a confirmação completa. Consulte seus pedidos antes de tentar novamente.');
    }
    const msg=buildWhats(o,name,phone,address);
    const url=`https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;
    // Falhas de armazenamento do navegador não podem transformar um pedido salvo em erro.
    try{localStorage.setItem('gds_last_order',JSON.stringify({code:o.public_code,token:o.tracking_token,phone}))}catch(e){console.warn('Não foi possível salvar o acesso rápido ao pedido',e)}
    cart={};
    try{saveCart()}catch(e){console.warn('Carrinho não pôde ser gravado localmente',e);updateCartCount()}
    showSuccess(o,url);
    restoreLastOrder();
    loadStore().catch(e=>console.warn('Atualização do cardápio',e));
  }catch(e){
    console.error('Falha ao registrar pedido',e);
    const message=e?.message||'Não foi possível registrar o pedido.';
    if(errorBox){errorBox.textContent='Não foi possível finalizar: '+message;errorBox.hidden=false;errorBox.scrollIntoView({behavior:'smooth',block:'nearest'})}
    else alert(message);
  }finally{
    checkoutBusy=false;
    renderStatus();
  }
}
function showSuccess(o,whatsUrl){$('cartForm').hidden=true;$('success').hidden=false;$('successCode').textContent='#'+o.public_code;$('trackLink').href='./acompanhar/?t='+encodeURIComponent(o.tracking_token);const wa=$('whatsOrderLink');if(wa)wa.href=whatsUrl}
function resetCartModal(){$('cartForm').hidden=false;$('success').hidden=true;closeCart()}
function renderTestimonials(rows){if(!rows.length){$('testGrid').innerHTML='<div class="emptyBox" style="grid-column:1/-1">Ainda não há depoimentos publicados. Depois que os clientes avaliarem pedidos concluídos, eles aparecerão aqui.</div>';return}$('testGrid').innerHTML=rows.map(r=>`<article class="testCard"><div class="stars">${'★'.repeat(Math.max(1,Math.min(5,Number(r.rating)||5)))}</div><p>“${esc(r.comment||'')}”</p><small>Cliente verificado · ${new Date(r.created_at).toLocaleDateString('pt-BR')}</small></article>`).join('')}
function restoreLastOrder(){try{const o=JSON.parse(localStorage.getItem('gds_last_order')||'null');if(!o?.token)return;const a=$('lastOrder');a.hidden=false;a.href='./acompanhar/?t='+encodeURIComponent(o.token);a.textContent='📍 Acompanhar '+(o.code||'pedido')}catch(_){}}
function setupInstall(){window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('installBtn').hidden=false});$('installBtn').onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('installBtn').hidden=true}}
function urlBase64ToUint8Array(base64String){
  const padding='='.repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,'+').replace(/_/g,'/');
  const rawData=atob(base64);
  return Uint8Array.from([...rawData].map(ch=>ch.charCodeAt(0)));
}
function pushSupported(){return 'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window}
async function getPushSubscription(){
  if(!pushSupported())return null;
  const reg=await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}
async function syncPushUi(){
  const box=$('pushPrompt'),btn=$('pushBtn'),txt=$('pushText');
  if(!box||!btn||!txt)return;
  if(!pushSupported()){box.hidden=true;return}
  box.hidden=false;
  const sub=await getPushSubscription().catch(()=>null);
  if(sub){
    btn.textContent='🔔 Avisos ativados';
    btn.disabled=true;
    txt.textContent='Você será avisado no celular quando a loja abrir.';
  }else{
    btn.textContent='🔔 Avise-me quando abrir';
    btn.disabled=false;
    txt.textContent='Ative a notificação para receber um aviso quando abrirmos a loja.';
  }
}
async function enableStoreOpenPush(){
  if(!pushSupported())return alert('Este aparelho ou navegador não oferece notificações push.');
  const btn=$('pushBtn');
  const old=btn?.textContent;
  if(btn){btn.disabled=true;btn.textContent='Ativando…'}
  try{
    const permission=await Notification.requestPermission();
    if(permission!=='granted')throw new Error('Permissão de notificação não concedida.');
    const reg=await navigator.serviceWorker.ready;
    let sub=await reg.pushManager.getSubscription();
    if(!sub){
      sub=await reg.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    const json=sub.toJSON();
    await api('/rest/v1/rpc/subscribe_store_push_v107',{
      method:'POST',
      body:JSON.stringify({
        p_endpoint:sub.endpoint,
        p_p256dh:json.keys?.p256dh||'',
        p_auth:json.keys?.auth||'',
        p_user_agent:navigator.userAgent
      })
    });
    await syncPushUi();
    alert('Pronto! Você receberá uma notificação quando a loja abrir.');
  }catch(e){
    if(btn){btn.disabled=false;btn.textContent=old||'🔔 Avise-me quando abrir'}
    alert(e.message||'Não foi possível ativar as notificações.');
  }
}

async function replaceOldServiceWorker(){if(!('serviceWorker'in navigator))return;try{const reg=await navigator.serviceWorker.register('./sw.js?v=132');await reg.update().catch(()=>{});await syncPushUi().catch(()=>{})}catch(e){console.warn('PWA indisponível',e)}}
function bind(){if($('pushBtn'))$('pushBtn').onclick=enableStoreOpenPush;$('search').oninput=e=>{term=e.target.value;renderProducts()};$('cartTop').onclick=$('floatCart').onclick=openCart;$('closeCart').onclick=resetCartModal;$('cartOverlay').onclick=e=>{if(e.target.id==='cartOverlay')resetCartModal()};document.querySelectorAll('input[name="fulfillment"]').forEach(r=>r.onchange=updateTotals);$('cep').onblur=lookupCep;$('checkoutBtn').onclick=checkout;$('continueBtn').onclick=resetCartModal;$('goCatalog').onclick=()=>document.getElementById('cardapio').scrollIntoView({behavior:'smooth'});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('cartOverlay').classList.contains('show'))resetCartModal()})}
bind();updateCartCount();restoreLastOrder();setupInstall();replaceOldServiceWorker();startPresence();loadStore();setInterval(()=>{if(document.visibilityState==='visible')refreshStockOnly().catch(()=>{})},10000);window.addEventListener('focus',()=>refreshStockOnly().catch(()=>{}));document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshStockOnly().catch(()=>{})});
})();
