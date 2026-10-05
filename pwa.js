const GDS_URL='https://qpqruhcspbdxjcnbhdhn.supabase.co';
const GDS_KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
const GDS_WHATS='5516992542888';
let gdsPrompt=null;

if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();gdsPrompt=e});

function gdsAddTrackingShortcut(d,order){
  if(!d||!order||!order.token)return;
  const old=d.getElementById('gdsTrackShortcut');if(old)old.remove();
  const a=d.createElement('a');a.id='gdsTrackShortcut';a.target='_top';a.href='./acompanhar/?t='+encodeURIComponent(order.token);
  a.innerHTML='📍 <span>Acompanhar '+(order.code||'pedido')+'</span>';
  a.style.cssText='position:fixed;z-index:130;left:14px;bottom:14px;display:flex;align-items:center;gap:7px;text-decoration:none;background:#fff;color:#4a101e;border:1px solid #f0d6df;border-radius:999px;padding:12px 15px;font:900 12px Inter,system-ui,Arial;box-shadow:0 14px 35px rgba(77,16,32,.20)';
  d.body.appendChild(a);
}
window.gdsAddTrackingShortcut=gdsAddTrackingShortcut;

const f=document.getElementById('store');
f.addEventListener('load',()=>{
  const d=f.contentDocument;
  if(!d||d.getElementById('gdsEnhanced'))return;

  const m=d.createElement('meta');m.id='gdsEnhanced';d.head.appendChild(m);
  try{const last=JSON.parse(localStorage.getItem('gds_last_order')||'null');if(last&&last.token)gdsAddTrackingShortcut(d,last)}catch(_){ }

  const nav=d.querySelector('.nav'),cartTop=d.getElementById('cartTop');
  if(nav&&cartTop){
    const ib=d.createElement('button');
    ib.className='cartNav';ib.textContent='⬇';ib.title='Instalar aplicativo';ib.style.display=gdsPrompt?'grid':'none';
    ib.onclick=async()=>{if(!gdsPrompt)return;gdsPrompt.prompt();await gdsPrompt.userChoice;gdsPrompt=null;ib.style.display='none'};
    nav.insertBefore(ib,cartTop);
    window.addEventListener('beforeinstallprompt',()=>ib.style.display='grid');
  }

  const hero=d.querySelector('.heroText p');
  if(hero)hero.textContent='Cremosos, refrescantes e deliciosos. Escolha seus sabores, confirme seu pedido e acompanhe cada etapa pelo nosso aplicativo.';
  const st=[...d.querySelectorAll('.step')];
  if(st[2])st[2].innerHTML='<b>3. Confirme e acompanhe</b><span>Após confirmar, você recebe um código GDS e acompanha o pedido em tempo real.</span>';

  const ful=d.querySelector('.ful'),oldName=d.getElementById('customerName');
  if(ful&&!d.getElementById('customerPhone')){
    const box=d.createElement('div');box.className='formGrid';box.style.margin='10px 0';
    if(oldName){oldName.remove();box.appendChild(oldName)}
    const ph=d.createElement('input');ph.id='customerPhone';ph.placeholder='WhatsApp com DDD';ph.inputMode='tel';box.appendChild(ph);
    ful.parentNode.insertBefore(box,ful);
  }

  const b=d.getElementById('sendWhats');if(b)b.textContent='Confirmar pedido';

  const s=d.createElement('script');
  s.textContent=`
  function gdsBuildWhatsMessage(orderCode,name,phone,delivery,address){
    const ids=Object.keys(cart).filter(id=>cart[id]>0),lines=['*NOVO PEDIDO - GELADINHO DOS SONHOS*','','Pedido: #'+orderCode,'Cliente: '+name,'WhatsApp: '+phone,''];
    let subtotal=0;
    ids.forEach(id=>{const p=products.find(x=>x.id===id);if(!p)return;const q=cart[id],line=p.price*q;subtotal+=line;lines.push(q+'x '+p.name+' - '+money(line))});
    lines.push('','Subtotal: '+money(subtotal));
    if(delivery){
      lines.push('Entrega: R$ 6,00','Total: '+money(subtotal+6),'','Endereço: '+address.street+', '+address.number+(address.complement?' - '+address.complement:'')+' - '+address.district,'CEP: '+address.cep);
      if(address.reference)lines.push('Referência: '+address.reference)
    }else lines.push('Total: '+money(subtotal),'','Retirada no local');
    const obs=document.getElementById('obs').value.trim();if(obs)lines.push('','Observação: '+obs);
    lines.push('','Acompanhe o andamento pelo código '+orderCode+'.');
    return lines.join('\\n')
  }

  function gdsShowOrderSuccess(o){
    const old=document.getElementById('gdsOrderSuccess');if(old)old.remove();
    const wrap=document.createElement('div');wrap.id='gdsOrderSuccess';
    wrap.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(42,10,22,.72);backdrop-filter:blur(7px);display:grid;place-items:center;padding:16px';
    const card=document.createElement('div');card.style.cssText='width:min(520px,100%);background:#fff;border-radius:28px;padding:26px 22px;box-shadow:0 30px 90px rgba(45,10,25,.35);text-align:center;color:#35131f';
    card.innerHTML='<div style="font-size:46px">⏳</div><h2 style="margin:6px 0 4px;font-size:27px">Acompanhe seu pedido</h2><div style="font-size:30px;font-weight:950;color:#ff0f68;margin:8px 0">#'+o.public_code+'</div><p style="color:#735e66;line-height:1.5;margin:8px 0 18px">Pedido registrado. Agora estamos aguardando a loja aceitar. Acompanhe as etapas e ative os alertas para saber quando ele sair para entrega.</p>';
    const track=document.createElement('button');track.textContent='📍 Acompanhar meu pedido';track.style.cssText='width:100%;border:0;background:linear-gradient(120deg,#ff0f68,#ff337d);color:#fff;border-radius:14px;padding:15px;font-weight:950;font-size:16px';
    track.onclick=()=>{window.top.location.href='./acompanhar/?t='+encodeURIComponent(o.tracking_token)};
    const close=document.createElement('button');close.textContent='Continuar na loja';close.style.cssText='width:100%;border:0;background:#fff0f5;color:#6a1936;border-radius:14px;padding:13px;font-weight:900;margin-top:9px';close.onclick=()=>wrap.remove();
    const hint=document.createElement('div');hint.textContent='O botão “Acompanhar '+o.public_code+'” continuará disponível na loja.';hint.style.cssText='font-size:12px;color:#8b737c;margin-top:13px';
    card.append(track,close,hint);wrap.appendChild(card);document.body.appendChild(wrap)
  }

  sendWhats=async function(){
    const ids=Object.keys(cart).filter(id=>cart[id]>0);if(!ids.length)return alert('Adicione pelo menos um geladinho ao pedido.');
    const name=document.getElementById('customerName').value.trim(),phone=document.getElementById('customerPhone').value.replace(/\\D/g,'');
    if(name.length<2)return alert('Informe seu nome.');if(phone.length<10)return alert('Informe seu WhatsApp com DDD.');
    const delivery=fulfillment()==='entrega';let address=null;
    if(delivery){
      const cep=document.getElementById('cep').value.replace(/\\D/g,''),street=document.getElementById('street').value.trim(),number=document.getElementById('number').value.trim(),district=document.getElementById('bairro').value.trim(),complement=document.getElementById('complement').value.trim(),reference=document.getElementById('reference').value.trim();
      if(cep.length!==8||!street||!number||!district)return alert('Preencha CEP, rua, número e bairro para entrega.');
      address={cep,street,number,district,complement,reference,city:'Monte Alto',state:'SP'}
    }
    const btn=document.getElementById('sendWhats'),label=btn.textContent;let waWindow=null;
    try{waWindow=window.open('about:blank','_blank');if(waWindow)waWindow.document.write('<div style="font-family:Arial;padding:30px;text-align:center">Preparando seu pedido no WhatsApp...</div>')}catch(_){}
    btn.disabled=true;btn.textContent='Registrando pedido...';
    try{
      const r=await fetch('${GDS_URL}/rest/v1/rpc/create_store_order',{method:'POST',headers:{apikey:'${GDS_KEY}','Content-Type':'application/json'},body:JSON.stringify({p_customer_name:name,p_customer_phone:phone,p_fulfillment:delivery?'entrega':'retirada',p_address:address,p_notes:document.getElementById('obs').value.trim()||null,p_items:ids.map(id=>({slug:id,quantity:cart[id]}))})});
      if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.message||'Não foi possível registrar o pedido.')}
      const o=await r.json(),saved={code:o.public_code,token:o.tracking_token,phone};
      localStorage.setItem('gds_last_order',JSON.stringify(saved));
      try{parent.gdsAddTrackingShortcut(document,saved)}catch(_){ }
      const msg=gdsBuildWhatsMessage(o.public_code,name,phone,delivery,address),wa='https://wa.me/${GDS_WHATS}?text='+encodeURIComponent(msg);
      if(waWindow&&!waWindow.closed)waWindow.location.replace(wa);else window.open(wa,'_blank');
      cart={};updateCartCount();render();
      gdsShowOrderSuccess(o);
    }catch(e){if(waWindow&&!waWindow.closed)waWindow.close();alert(e.message||'Erro ao registrar o pedido.')}
    finally{btn.disabled=false;btn.textContent=label}
  };
  document.getElementById('sendWhats').onclick=sendWhats;
  `;
  d.body.appendChild(s);
});
