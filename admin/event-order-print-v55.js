(()=>{
  if(window.__gdsEventOrderPrintV55)return;
  window.__gdsEventOrderPrintV55=true;

  const ROOT=new URL('../',location.href);
  const LOGO=new URL('assets/logo-oficial.webp?v=55',ROOT).href;
  const PIX_TXT=new URL('assets/pix-qr-v55.txt?v=55',ROOT).href;
  const STORE={
    name:'Geladinho dos Sonhos',
    address:'Rua Aparecida Marchetti Guzzo, 161 - Vale dos Sonhos - Monte Alto/SP',
    phone:'(16) 99254-2888'
  };
  let pixPromise=null;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const dateBR=v=>{if(!v)return 'Não informado';const d=new Date(String(v).slice(0,10)+'T12:00:00');return Number.isNaN(d.getTime())?'Não informado':d.toLocaleDateString('pt-BR')};
  const dateTimeBR=v=>{if(!v)return 'Não informado';const d=new Date(v);return Number.isNaN(d.getTime())?'Não informado':d.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})};
  const catLabel=c=>{const s=String(c||'').toLowerCase();if(s.includes('trad'))return 'Tradicional';if(s.includes('crem'))return 'Cremoso';if(s.includes('gour'))return 'Gourmet';if(s.includes('truf'))return 'Trufado';return c||'—'};
  function pixData(){
    if(!pixPromise)pixPromise=fetch(PIX_TXT,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('QR PIX indisponível');return r.text()}).then(t=>'data:image/png;base64,'+t.trim());
    return pixPromise;
  }
  async function getOrder(id){
    const [e,p]=await Promise.all([
      GDS48.sb.from('events').select('*,event_items(*)').eq('id',id).single(),
      GDS48.sb.from('products').select('id,name,category,price').order('name')
    ]);
    if(e.error)throw e.error;if(p.error)throw p.error;
    return {event:e.data,products:p.data||[]};
  }
  function paymentLines(raw){
    const t=String(raw||'').trim();
    return t?esc(t).replace(/\n/g,'<br>'):'A combinar com o cliente.';
  }
  function itemRows(e,products){
    const items=e.event_items||[];
    return items.map(i=>{
      const p=products.find(x=>x.id===i.product_id);
      const category=catLabel(p?.category||i.category);
      const total=Number(i.unit_price||0)*Number(i.quantity||0);
      return `<tr><td>${esc(category)}</td><td>${esc(i.product_name)}</td><td class="num">${Number(i.quantity||0)}</td><td class="num">${money(i.unit_price)}</td><td class="num">${money(total)}</td></tr>`;
    }).join('');
  }
  function buildHTML(e,products,pix){
    const items=e.event_items||[];
    const qty=items.reduce((n,i)=>n+(Number(i.quantity)||0),0);
    const dense=items.length>9?' dense':'';
    const eventWhen=`${dateBR(e.event_date)}${e.event_time?' - '+String(e.event_time).slice(0,5):''}`;
    const delivery=e.delivery_deadline?dateTimeBR(e.delivery_deadline):'A combinar';
    const eventDesc=[e.event_type,e.event_name].filter(Boolean).join(' - ')||'Não informado';
    const venue=e.venue||'Não informado';
    const notes=e.notes||'Sem observações adicionais.';
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(e.event_code||'Ordem de Encomenda')}</title><style>
      @page{size:A4 portrait;margin:7mm}
      *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      html,body{margin:0;background:#f4eef1;font-family:Arial,Helvetica,sans-serif;color:#37131f}
      .toolbar{position:sticky;top:0;z-index:99;display:flex;gap:8px;justify-content:center;padding:10px;background:#3f0d1c}
      .toolbar button{border:0;border-radius:10px;padding:11px 16px;font-weight:800;cursor:pointer}.toolbar .print{background:#ff0f68;color:#fff}.toolbar .close{background:#fff;color:#4a101e}
      .sheet{width:196mm;min-height:283mm;margin:10px auto;background:#fff;padding:0;box-shadow:0 12px 38px #43101d22;overflow:hidden}
      .topline{height:2.2mm;background:#ff0f68}
      .header{border:1px solid #efb9cb;border-radius:5mm;margin:4mm 4mm 2.5mm;padding:3mm 4mm;display:grid;grid-template-columns:58mm 1fr 30mm;gap:4mm;align-items:center;background:linear-gradient(135deg,#fff,#fff6fa)}
      .logo{width:56mm;max-height:31mm;object-fit:contain;display:block}
      .title h1{font-size:16.5pt;margin:0;color:#650f2c;letter-spacing:.2px}.title h2{font-size:10.5pt;margin:1mm 0 3mm;color:#ff0f68}.orderMeta{display:grid;grid-template-columns:1fr 1fr;gap:1mm 5mm;font-size:8.3pt}.orderMeta b{display:block;color:#754052;font-size:7.2pt;text-transform:uppercase}.orderMeta strong{font-size:10pt;color:#5b1228}
      .badge{align-self:start;justify-self:end;border:1px solid #9bd8b5;background:#eaf8ef;color:#14753e;border-radius:99px;padding:2mm 4mm;font-size:7.7pt;font-weight:900;text-align:center}
      .storebar{margin:0 4mm 2.2mm;background:#720d2e;color:#fff;border-radius:2.2mm;padding:1.7mm 2.5mm;text-align:center;font-size:7.8pt;font-weight:700}
      .sectionTitle{margin:1.6mm 4mm .9mm;color:#ff0f68;font-size:8.9pt;font-weight:900;text-transform:uppercase;border-bottom:1px solid #f4c5d5;padding-bottom:.7mm}
      .info{margin:0 4mm 2.2mm;border:1px solid #efc4d2;border-radius:4mm;display:grid;grid-template-columns:1fr 1fr;padding:2.4mm 3mm;gap:1.6mm 6mm;background:#fffafb;font-size:8.4pt}
      .info .cell b{display:block;font-size:7.1pt;color:#86586a;text-transform:uppercase;margin-bottom:.4mm}.info .full{grid-column:1/-1;border-top:1px solid #f1d9e2;padding-top:1.4mm}
      table{width:calc(100% - 8mm);margin:0 4mm 2mm;border-collapse:collapse;font-size:7.9pt}th{background:#700d2d;color:#fff;text-align:left;padding:1.55mm 1.7mm;border:1px solid #8a2d4b}td{padding:1.35mm 1.7mm;border:1px solid #efd5de}.num{text-align:right;white-space:nowrap}
      .totals{margin:0 4mm 2.1mm;border:1px solid #efc4d2;border-radius:3.5mm;display:grid;grid-template-columns:1fr 1.2fr 1.1fr 1.5fr;align-items:center;overflow:hidden;background:#fff7fa;font-size:8.3pt;font-weight:800}.totals div{padding:2.1mm 2.7mm}.totals .grand{background:#ff0f68;color:#fff;text-align:center;font-size:10.5pt;border-radius:3mm;margin:1.1mm}
      .paygrid{margin:0 4mm 2mm;display:grid;grid-template-columns:1.03fr 1.28fr .78fr;gap:2mm}.box{border:1px solid #efc4d2;border-radius:3.6mm;padding:2.4mm 3mm;background:#fffafb;min-height:34mm;font-size:7.7pt}.box h3{font-size:7.4pt;margin:0 0 1.7mm;color:#805064;text-transform:uppercase}.paymentText{line-height:1.38}.pix{border:1.5px solid #ff0f68;text-align:center;padding:2mm}.pix h3{color:#ff0f68;font-size:8.5pt;margin-bottom:1mm}.pix img{width:24mm;height:24mm;image-rendering:pixelated;display:block;margin:0 auto 1mm}.pix small{display:block;font-size:6.6pt;font-weight:700;color:#5b2235}
      .confirm{margin:0 4mm 2mm;border:1px solid #edd6bc;background:#fffaf3;border-radius:3mm;padding:2.2mm 3mm;font-size:6.5pt;line-height:1.3}.confirm b{font-size:7.5pt}.date{text-align:center;font-size:7pt;margin:2.1mm 0 5.5mm;color:#744355}.signs{margin:0 8mm 2mm;display:grid;grid-template-columns:1fr 1fr;gap:16mm;text-align:center;font-size:7pt}.signLine{border-top:1px solid #6a3043;padding-top:1.5mm;font-weight:900}.signs small{display:block;margin-top:1mm;color:#86586a;font-weight:400}.footer{margin-top:3mm;background:#720d2e;color:#fff;text-align:center;font-size:6.5pt;padding:1.7mm 2mm}
      .pixNote{font-size:6.5pt;margin-top:2mm;color:#835165;line-height:1.25}
      .dense table{font-size:7.2pt}.dense th{padding:1.15mm 1.4mm}.dense td{padding:1mm 1.4mm}.dense .paygrid{gap:1.4mm}.dense .box{min-height:31mm}.dense .confirm{font-size:6.1pt}
      @media print{html,body{background:#fff}.toolbar{display:none!important}.sheet{margin:0;box-shadow:none;width:196mm;min-height:283mm;max-height:283mm}}
      @media(max-width:820px){.sheet{width:100%;min-height:0;margin:0;box-shadow:none}.header{grid-template-columns:1fr}.logo{width:58mm}.badge{position:absolute;right:8mm;top:18mm}.paygrid{grid-template-columns:1fr}.pix img{width:36mm;height:36mm}}
    </style></head><body class="${dense.trim()}"><div class="toolbar"><button class="print" onclick="window.print()">Imprimir / Salvar em PDF</button><button class="close" onclick="window.close()">Fechar</button></div><main class="sheet"><div class="topline"></div><header class="header"><img class="logo" src="${LOGO}" alt="Geladinho dos Sonhos"><div class="title"><h1>ORDEM DE ENCOMENDA</h1><h2>E CONFIRMAÇÃO DE PEDIDO</h2><div class="orderMeta"><div><b>Pedido</b><strong>${esc(e.event_code||'—')}</strong></div><div><b>Emissão</b><strong>${new Date().toLocaleDateString('pt-BR')}</strong></div></div></div><div class="badge">${esc(e.status||'SOLICITADO')}</div></header><div class="storebar">${STORE.address} &nbsp; | &nbsp; WhatsApp: ${STORE.phone}</div>
    <div class="sectionTitle">Dados do cliente e do evento</div><section class="info"><div class="cell"><b>Cliente / Responsável</b>${esc(e.customer_name||'Não informado')}</div><div class="cell"><b>Evento</b>${esc(eventDesc)}</div><div class="cell"><b>Telefone / WhatsApp</b>${esc(e.customer_phone||'Não informado')}</div><div class="cell"><b>Data e horário</b>${esc(eventWhen)}</div><div class="cell"><b>CPF / CNPJ</b>________________________________</div><div class="cell"><b>Entrega / Retirada</b>${esc(delivery)}</div><div class="cell full"><b>Local / Endereço do evento</b>${esc(venue)}</div></section>
    <div class="sectionTitle">Itens da encomenda</div><table><thead><tr><th>Categoria</th><th>Sabor</th><th class="num">Qtd.</th><th class="num">Unit.</th><th class="num">Total</th></tr></thead><tbody>${itemRows(e,products)}</tbody></table><section class="totals"><div>${qty} unidades</div><div>Produtos: ${money(e.subtotal)}</div><div>Entrega: a combinar</div><div class="grand">TOTAL&nbsp; ${money(e.subtotal)}</div></section>
    <div class="sectionTitle">Pagamento, PIX e observações</div><section class="paygrid"><div class="box"><h3>Pagamento / sinal</h3><div class="paymentText">${paymentLines(e.payment_notes)}</div><div class="pixNote"><b>Quer pagar via PIX?</b> Escaneie o QR Code ao lado e envie o comprovante para confirmação do pagamento.</div></div><div class="box"><h3>Observações</h3><div class="paymentText">${esc(notes).replace(/\n/g,'<br>')}</div></div><div class="box pix"><h3>Pagamento via PIX</h3><img src="${pix}" alt="QR Code PIX"><small>Escaneie para pagar</small></div></section>
    <section class="confirm"><b>CONFIRMAÇÃO DA ENCOMENDA</b><br>O cliente declara ter conferido sabores, quantidades, valores, data, horário e forma de entrega/retirada. Alterações posteriores ficam sujeitas à disponibilidade e ao prazo de produção. O pedido será produzido conforme as informações registradas neste documento. Este documento confirma comercialmente a encomenda e não substitui documento fiscal quando legalmente exigido.</section><div class="date">Monte Alto/SP, ${new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})}.</div><section class="signs"><div><div class="signLine">REPRESENTANTE - GELADINHO DOS SONHOS</div><small>Nome: ______________________________</small></div><div><div class="signLine">CLIENTE / RESPONSÁVEL</div><small>Nome: ${esc(e.customer_name||'______________________________')}</small></div></section><footer class="footer">${STORE.name} - ${STORE.address} - WhatsApp ${STORE.phone}</footer></main></body></html>`;
  }
  async function openOrder(id){
    const w=window.open('','_blank');
    if(!w){alert('O navegador bloqueou a prévia. Permita pop-ups para gerar a Ordem de Encomenda.');return}
    w.document.write('<!doctype html><title>Preparando ordem...</title><body style="font-family:Arial;text-align:center;padding:40px;color:#6a2740">Preparando Ordem de Encomenda A4...</body>');
    try{
      const [{event,products},pix]=await Promise.all([getOrder(id),pixData()]);
      w.document.open();w.document.write(buildHTML(event,products,pix));w.document.close();
    }catch(err){
      w.document.open();w.document.write(`<body style="font-family:Arial;padding:30px"><h2>Não foi possível gerar a ordem</h2><p>${esc(err.message||err)}</p></body>`);w.document.close();
    }
  }
  window.printE=openOrder;
  function relabel(){document.querySelectorAll('.actions button').forEach(b=>{if((b.textContent||'').includes('PDF / Imprimir'))b.textContent='Ordem A4 / PDF'})}
  new MutationObserver(relabel).observe(document.documentElement,{childList:true,subtree:true});
  relabel();
})();
