(()=>{
'use strict';
const SB='https://qpqruhcspbdxjcnbhdhn.supabase.co';
const KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
const WHATS='5516992542888';
const DELIVERY_FEE=6;
const $=id=>document.getElementById(id);
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
let products=[],cart=loadCart(),filter='Todos',term='',storeOpen=false,installPrompt=null;

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
function renderStatus(custom){const b=$('storeStatus');b.className='statusbar '+(custom?'closed':storeOpen?'open':'closed');b.textContent=custom|| (storeOpen?'● Vendas online abertas · Faça seu pedido pelo site.':'● Vendas online fechadas · Cardápio disponível somente para consulta.');const c=$('checkoutBtn');if(c){c.disabled=!storeOpen;c.textContent=storeOpen?'Confirmar pedido e abrir WhatsApp':'Loja fechada para pedidos online'}}
function renderFilters(){const base=['Tradicional','Cremoso','Gourmet','Trufado'];const extras=[...new Set(products.map(p=>p.category).filter(Boolean).filter(c=>!base.includes(c)))];const cats=['Todos',...base,...extras];$('filters').innerHTML=cats.map(c=>`<button class="filter ${filter===c?'on':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');$('filters').querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{filter=b.dataset.cat;renderFilters();renderProducts()})}
function renderProducts(){const q=term.trim().toLowerCase();const list=products.filter(p=>(filter==='Todos'||p.category===filter)&&(!q||`${p.name} ${p.category} ${p.description||''}`.toLowerCase().includes(q)));if(!list.length){$('products').innerHTML='<div class="emptyBox" style="grid-column:1/-1">Nenhum sabor encontrado.</div>';return}$('products').innerHTML=list.map(p=>`<article class="product"><div class="photo">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:''}${p.stock<=0?'<div class="sold">ESGOTADO</div>':''}</div><div class="body"><div class="cat">${esc(p.category)}</div><h3>${esc(p.name)}</h3><div class="desc">${esc(p.description||'Geladinho preparado com muito sabor e cremosidade.')}</div><div class="meta"><div class="price">${money(p.price)}</div><div class="stock ${p.stock<=5&&p.stock>0?'low':''}">${p.stock>0?`${p.stock} em estoque`:'Sem estoque'}</div></div><button class="add" data-add="${esc(p.slug)}" ${p.stock<=0||!storeOpen?'disabled':''}>${!storeOpen?'Loja fechada':p.stock<=0?'Esgotado':'Adicionar ao pedido'}</button></div></article>`).join('');$('products').querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>addToCart(b.dataset.add))}
function addToCart(slug){const p=products.find(x=>x.slug===slug);if(!p||p.stock<=0)return;const next=(cart[slug]||0)+1;if(next>p.stock)return alert(`Temos ${p.stock} unidade(s) de ${p.name} em estoque.`);cart[slug]=next;saveCart();renderCart();openCart()}
function changeQty(slug,d){const p=products.find(x=>x.slug===slug);if(!p)return;const n=(cart[slug]||0)+d;if(n<=0)delete cart[slug];else if(n<=p.stock)cart[slug]=n;else return alert(`Estoque disponível: ${p.stock}`);saveCart();renderCart()}
function renderCart(){const rows=Object.entries(cart).filter(([,q])=>q>0);$('cartRows').innerHTML=rows.length?rows.map(([slug,q])=>{const p=products.find(x=>x.slug===slug);if(!p)return'';return `<div class="cartRow"><div><b>${esc(p.name)}</b><small>${esc(p.category)} · ${q} unidade(s)</small><div class="qty"><button data-dec="${esc(slug)}">−</button><span>${q}</span><button data-inc="${esc(slug)}">+</button></div></div><div class="rowPrice">${money(p.price*q)}</div></div>`}).join(''):'<div class="emptyBox">Seu carrinho está vazio.</div>';$('cartRows').querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>changeQty(b.dataset.dec,-1));$('cartRows').querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>changeQty(b.dataset.inc,1));updateTotals();renderStatus()}
function updateTotals(){const sub=subtotal(),delivery=fulfillment()==='entrega';$('subtotal').textContent=money(sub);$('feeRow').hidden=!delivery;$('fee').textContent=money(delivery?DELIVERY_FEE:0);$('total').textContent=money(sub+(delivery?DELIVERY_FEE:0));$('addressFields').classList.toggle('show',delivery)}
function openCart(){setPresenceActivity(cartQty()>0?'visualizando carrinho':'visualizando carrinho');renderCart();$('cartOverlay').classList.add('show');document.body.style.overflow='hidden'}
function closeCart(){$('cartOverlay').classList.remove('show');document.body.style.overflow=''}
async function lookupCep(){const cep=($('cep').value||'').replace(/\D/g,'');if(cep.length!==8)return;try{const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`,{cache:'no-store'});const d=await r.json();if(d.erro)return alert('CEP não encontrado.');if((d.localidade||'').toLowerCase()!=='monte alto'||String(d.uf||'').toUpperCase()!=='SP')return alert('No momento, entregamos somente em Monte Alto/SP.');$('street').value=d.logradouro||'';$('district').value=d.bairro||'';$('number').focus()}catch(_){}}
function buildWhats(o,name,phone,address){const lines=['*PEDIDO - GELADINHO DOS SONHOS*','',`Pedido: #${o.public_code}`,`Cliente: ${name}`,`WhatsApp: ${phone}`,''];for(const [slug,q] of Object.entries(cart)){const p=products.find(x=>x.slug===slug);if(p)lines.push(`${q}x ${p.name} — ${money(p.price*q)}`)}lines.push('',`Subtotal: ${money(o.subtotal)}`);if(fulfillment()==='entrega'){lines.push(`Entrega: ${money(o.delivery_fee)}`,`Total: ${money(o.total)}`,'',`Endereço: ${address.street}, ${address.number}${address.complement?' - '+address.complement:''}`,`${address.district} - Monte Alto/SP · CEP ${address.cep}`);if(address.reference)lines.push(`Referência: ${address.reference}`)}else{lines.push(`Total: ${money(o.total)}`,'','Retirada: Rua Aparecida Marchetti Guzzo, 161 - Vale dos Sonhos - Monte Alto/SP')}const obs=$('notes').value.trim();if(obs)lines.push('',`Observação: ${obs}`);lines.push('',`Pagamento: ${paymentMethod()}`);if(paymentMethod()==='Pix')lines.push('O Pix será liberado após a loja aceitar o pedido.');lines.push('',`Acompanhe pelo código ${o.public_code}.`);return lines.join('\n')}
async function checkout(){setPresenceActivity('finalizando pedido');const items=Object.entries(cart).filter(([,q])=>q>0);if(!items.length)return alert('Adicione pelo menos um geladinho.');const name=$('customerName').value.trim(),phone=$('customerPhone').value.replace(/\D/g,'');if(name.length<2)return alert('Informe seu nome.');if(phone.length<10)return alert('Informe um WhatsApp com DDD.');const delivery=fulfillment()==='entrega';let address=null;if(delivery){const cep=$('cep').value.replace(/\D/g,''),street=$('street').value.trim(),number=$('number').value.trim(),district=$('district').value.trim(),complement=$('complement').value.trim(),reference=$('reference').value.trim();if(cep.length!==8||!street||!number||!district)return alert('Preencha CEP, rua, número e bairro.');address={cep,street,number,district,complement,reference,city:'Monte Alto',state:'SP'}}let wa=null;try{wa=window.open('about:blank','_blank');if(wa)wa.document.write('<div style="font-family:Arial;padding:30px;text-align:center">Registrando pedido…</div>')}catch(_){}const btn=$('checkoutBtn'),old=btn.textContent;btn.disabled=true;btn.textContent='Registrando pedido…';try{const o=await api('/rest/v1/rpc/create_store_order_v89',{method:'POST',body:JSON.stringify({p_customer_name:name,p_customer_phone:phone,p_fulfillment:delivery?'entrega':'retirada',p_address:address,p_notes:$('notes').value.trim()||null,p_items:items.map(([slug,quantity])=>({slug,quantity})),p_payment_method:paymentMethod()})});const saved={code:o.public_code,token:o.tracking_token,phone};localStorage.setItem('gds_last_order',JSON.stringify(saved));const msg=buildWhats(o,name,phone,address),url=`https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;cart={};saveCart();showSuccess(o);if(wa&&!wa.closed)wa.location.replace(url);else window.open(url,'_blank');loadStore().catch(()=>{})}catch(e){if(wa&&!wa.closed)wa.close();alert(e.message||'Não foi possível registrar o pedido.')}finally{btn.disabled=!storeOpen;btn.textContent=old}}
function showSuccess(o){$('cartForm').hidden=true;$('success').hidden=false;$('successCode').textContent='#'+o.public_code;$('trackLink').href='./acompanhar/?t='+encodeURIComponent(o.tracking_token)}
function resetCartModal(){$('cartForm').hidden=false;$('success').hidden=true;closeCart()}
function renderTestimonials(rows){if(!rows.length){$('testGrid').innerHTML='<div class="emptyBox" style="grid-column:1/-1">Ainda não há depoimentos publicados. Depois que os clientes avaliarem pedidos concluídos, eles aparecerão aqui.</div>';return}$('testGrid').innerHTML=rows.map(r=>`<article class="testCard"><div class="stars">${'★'.repeat(Math.max(1,Math.min(5,Number(r.rating)||5)))}</div><p>“${esc(r.comment||'')}”</p><small>Cliente verificado · ${new Date(r.created_at).toLocaleDateString('pt-BR')}</small></article>`).join('')}
function restoreLastOrder(){try{const o=JSON.parse(localStorage.getItem('gds_last_order')||'null');if(!o?.token)return;const a=$('lastOrder');a.hidden=false;a.href='./acompanhar/?t='+encodeURIComponent(o.token);a.textContent='📍 Acompanhar '+(o.code||'pedido')}catch(_){}}
function setupInstall(){window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('installBtn').hidden=false});$('installBtn').onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('installBtn').hidden=true}}
async function replaceOldServiceWorker(){if(!('serviceWorker'in navigator))return;try{const reg=await navigator.serviceWorker.register('./sw.js?v=63');reg.update().catch(()=>{})}catch(e){console.warn('PWA indisponível',e)}}
function bind(){$('search').oninput=e=>{term=e.target.value;renderProducts()};$('cartTop').onclick=$('floatCart').onclick=openCart;$('closeCart').onclick=resetCartModal;$('cartOverlay').onclick=e=>{if(e.target.id==='cartOverlay')resetCartModal()};document.querySelectorAll('input[name="fulfillment"]').forEach(r=>r.onchange=updateTotals);$('cep').onblur=lookupCep;$('checkoutBtn').onclick=checkout;$('continueBtn').onclick=resetCartModal;$('goCatalog').onclick=()=>document.getElementById('cardapio').scrollIntoView({behavior:'smooth'});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('cartOverlay').classList.contains('show'))resetCartModal()})}
bind();updateCartCount();restoreLastOrder();setupInstall();replaceOldServiceWorker();startPresence();loadStore();
})();
