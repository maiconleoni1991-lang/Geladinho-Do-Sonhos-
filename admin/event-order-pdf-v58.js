(()=>{
  if(window.__gdsEventOrderPdfV58)return;window.__gdsEventOrderPdfV58=true;
  const ROOT=new URL('../',location.href);
  const STORE={name:'Geladinho dos Sonhos',address:'Rua Aparecida Marchetti Guzzo, 161 - Vale dos Sonhos - Monte Alto/SP',phone:'(16) 99254-2888'};
  let libPromise=null,logoPromise=null,pixPromise=null;
  const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const dateBR=v=>{if(!v)return 'Nao informado';const d=new Date(String(v).slice(0,10)+'T12:00:00');return Number.isNaN(d.getTime())?'Nao informado':d.toLocaleDateString('pt-BR')};
  const dateTimeBR=v=>{if(!v)return 'A combinar';const d=new Date(v);return Number.isNaN(d.getTime())?'A combinar':d.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})};
  const catLabel=c=>{const s=String(c||'').toLowerCase();if(s.includes('trad'))return'Tradicional';if(s.includes('crem'))return'Cremoso';if(s.includes('gour'))return'Gourmet';if(s.includes('truf'))return'Trufado';return c||'-'};
  const clean=s=>String(s??'').replace(/[\r\n]+/g,' ').replace(/\s+/g,' ').trim();
  function loadPdfLib(){if(window.PDFLib)return Promise.resolve(window.PDFLib);if(libPromise)return libPromise;libPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';s.onload=()=>window.PDFLib?resolve(window.PDFLib):reject(new Error('Biblioteca PDF indisponivel'));s.onerror=()=>reject(new Error('Nao foi possivel carregar o gerador de PDF'));document.head.appendChild(s)});return libPromise}
  async function chunks(prefix,n,mime){const parts=await Promise.all(Array.from({length:n},(_,i)=>fetch(new URL(`assets/${prefix}-${i+1}.txt?v=58`,ROOT),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Arquivo visual indisponivel');return r.text()})));return `data:${mime};base64,`+parts.join('').replace(/\s+/g,'')}
  function logoData(){return logoPromise||(logoPromise=chunks('logo-v13',4,'image/webp'))}
  function pixData(){return pixPromise||(pixPromise=fetch(new URL('assets/pix-qr-v55.txt?v=58',ROOT),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('QR PIX indisponivel');return r.text()}).then(t=>'data:image/png;base64,'+t.trim()))}
  async function dataUrlToPngBytes(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(img,0,0);c.toBlob(async b=>{if(!b)return reject(new Error('Falha ao incorporar o logo'));resolve(new Uint8Array(await b.arrayBuffer()))},'image/png',1)}catch(e){reject(e)}};img.onerror=()=>reject(new Error('Logo da marca nao carregou'));img.src=src})}
  function dataUrlBytes(src){const b64=src.split(',')[1]||'';const bin=atob(b64);const out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out}
  async function getOrder(id){const [e,p]=await Promise.all([GDS48.sb.from('events').select('*,event_items(*)').eq('id',id).single(),GDS48.sb.from('products').select('id,name,category,price').order('name')]);if(e.error)throw e.error;if(p.error)throw p.error;return{event:e.data,products:p.data||[]}}
  function fitText(font,text,maxWidth,startSize,min=5.3){let size=startSize;const t=clean(text)||'-';while(size>min&&font.widthOfTextAtSize(t,size)>maxWidth)size-=.25;return{t,size}}
  function wrap(font,text,size,maxWidth,maxLines=2){const words=clean(text).split(' ');const lines=[];let line='';for(const w of words){const test=line?line+' '+w:w;if(font.widthOfTextAtSize(test,size)<=maxWidth)line=test;else{if(line)lines.push(line);line=w;if(lines.length>=maxLines-1)break}}if(line&&lines.length<maxLines)lines.push(line);if(lines.length===maxLines&&words.join(' ').length>lines.join(' ').length){let s=lines[maxLines-1];while(s.length>1&&font.widthOfTextAtSize(s+'...',size)>maxWidth)s=s.slice(0,-1);lines[maxLines-1]=s+'...'}return lines}
  function safeName(s){return clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50)||'cliente'}
  async function buildPdf(e,products){
    const {PDFDocument,StandardFonts,rgb}=await loadPdfLib();
    const [logoSrc,pixSrc]=await Promise.all([logoData(),pixData()]);
    const logoBytes=await dataUrlToPngBytes(logoSrc),pixBytes=dataUrlBytes(pixSrc);
    const pdf=await PDFDocument.create();pdf.setTitle(`Ordem de Encomenda ${e.event_code||''}`);pdf.setAuthor(STORE.name);pdf.setSubject('Ordem de encomenda e confirmacao de pedido');
    const page=pdf.addPage([595.28,841.89]);const W=page.getWidth(),H=page.getHeight();
    const reg=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);const logo=await pdf.embedPng(logoBytes),pix=await pdf.embedPng(pixBytes);
    const pink=rgb(1,.059,.408),wine=rgb(.28,.063,.118),muted=rgb(.47,.32,.38),line=rgb(.93,.76,.82),pale=rgb(1,.965,.98),green=rgb(.08,.46,.24),white=rgb(1,1,1),cream=rgb(1,.98,.95);
    const rect=(x,y,w,h,color,border=line,bw=.6)=>page.drawRectangle({x,y,width:w,height:h,color,borderColor:border,borderWidth:bw});
    const txt=(t,x,y,size=8,font=reg,color=wine)=>page.drawText(clean(t)||'-',{x,y,size,font,color});
    const fit=(t,x,y,w,size=8,font=reg,color=wine)=>{const f=fitText(font,t,w,size);page.drawText(f.t,{x,y,size:f.size,font,color})};
    page.drawRectangle({x:0,y:H-7,width:W,height:7,color:pink});
    rect(22,H-105,W-44,82,pale,line,.8);
    const logoDims=logo.scale(1);const logoW=165,logoH=Math.min(67,logoW*(logoDims.height/logoDims.width));page.drawImage(logo,{x:30,y:H-96,width:logoW,height:logoH});
    txt('ORDEM DE ENCOMENDA',214,H-58,16,bold,wine);txt('E CONFIRMACAO DE PEDIDO',214,H-75,9.5,bold,pink);txt('Pedido',214,H-92,6.5,bold,muted);fit(e.event_code||'-',214,H-104,100,9,bold,wine);txt('Emissao',334,H-92,6.5,bold,muted);txt(new Date().toLocaleDateString('pt-BR'),334,H-104,9,bold,wine);
    const status=clean(e.status||'Solicitado').toUpperCase();rect(465,H-58,96,23,rgb(.91,.98,.94),rgb(.60,.85,.70),.7);fit(status,474,H-50,80,7.2,bold,green);
    rect(22,H-125,W-44,16,wine,wine,0);fit(`${STORE.address}  |  WhatsApp: ${STORE.phone}`,33,H-120,W-66,7.2,bold,white);
    txt('DADOS DO CLIENTE E DO EVENTO',24,H-145,8,bold,pink);page.drawLine({start:{x:24,y:H-149},end:{x:W-24,y:H-149},thickness:.7,color:line});
    rect(22,H-223,W-44,68,white,line,.8);
    const left=34,right=310,label=6.2,value=8.2;
    txt('CLIENTE / RESPONSAVEL',left,H-173,label,bold,muted);fit(e.customer_name||'Nao informado',left,H-185,245,value,reg,wine);
    txt('EVENTO',right,H-173,label,bold,muted);fit([e.event_type,e.event_name].filter(Boolean).join(' - ')||'Nao informado',right,H-185,245,value,reg,wine);
    txt('TELEFONE / WHATSAPP',left,H-199,label,bold,muted);fit(e.customer_phone||'Nao informado',left,H-211,245,value,reg,wine);
    txt('DATA E HORARIO',right,H-199,label,bold,muted);fit(`${dateBR(e.event_date)}${e.event_time?' - '+String(e.event_time).slice(0,5):''}`,right,H-211,245,value,reg,wine);
    txt('CPF / CNPJ',left,H-226,label,bold,muted);fit(e.customer_document||'Nao informado',left,H-238,245,value,reg,wine);
    txt('ENTREGA / RETIRADA',right,H-226,label,bold,muted);fit(`${e.fulfillment_type||'Retirada'} - ${dateTimeBR(e.delivery_deadline)}`,right,H-238,245,value,reg,wine);
    txt('LOCAL / ENDERECO',left,H-252,label,bold,muted);fit(e.venue||'Nao informado',left,H-264,W-68,value,reg,wine);
    txt('ITENS DA ENCOMENDA',24,H-286,8,bold,pink);page.drawLine({start:{x:24,y:H-290},end:{x:W-24,y:H-290},thickness:.7,color:line});
    const items=e.event_items||[],startY=H-314,rowH=items.length<=10?18:items.length<=14?14:11.5,fontSize=items.length<=10?7.4:items.length<=14?6.5:5.6;const cols=[22,112,325,380,450,573];
    rect(cols[0],startY,cols[5]-cols[0],17,wine,wine,0);['Categoria','Sabor','Qtd.','Unit.','Total'].forEach((h,i)=>txt(h,cols[i]+5,startY+5,6.7,bold,white));
    let y=startY- rowH;items.forEach((i,idx)=>{const p=products.find(x=>x.id===i.product_id);rect(cols[0],y,cols[5]-cols[0],rowH,idx%2?pale:white,line,.35);fit(catLabel(p?.category||i.category),cols[0]+5,y+3.5,cols[1]-cols[0]-10,fontSize,reg,wine);fit(i.product_name,cols[1]+5,y+3.5,cols[2]-cols[1]-10,fontSize,reg,wine);fit(String(Number(i.quantity||0)),cols[2]+8,y+3.5,cols[3]-cols[2]-14,fontSize,reg,wine);fit(money(i.unit_price),cols[3]+5,y+3.5,cols[4]-cols[3]-8,fontSize,reg,wine);fit(money(Number(i.unit_price||0)*Number(i.quantity||0)),cols[4]+5,y+3.5,cols[5]-cols[4]-8,fontSize,bold,wine);y-=rowH});
    const qty=items.reduce((n,i)=>n+Number(i.quantity||0),0),subtotal=Number(e.subtotal||0),fee=Number(e.delivery_fee||0),deposit=Number(e.deposit_amount||0),total=subtotal+fee,balance=Number(e.balance_amount??Math.max(total-deposit,0));
    const totalY=y-28;rect(22,totalY,W-44,24,pale,line,.7);fit(`${qty} unidades`,32,totalY+8,95,8,bold,wine);fit(`Produtos: ${money(subtotal)}`,140,totalY+8,130,8,bold,wine);fit(`Entrega: ${money(fee)}`,282,totalY+8,110,8,bold,wine);rect(404,totalY+3,167,18,pink,pink,0);fit(`TOTAL ${money(total)}`,418,totalY+8,140,9,bold,white);
    const payY=totalY-98;txt('PAGAMENTO, PIX E OBSERVACOES',24,totalY-18,8,bold,pink);page.drawLine({start:{x:24,y:totalY-22},end:{x:W-24,y:totalY-22},thickness:.7,color:line});
    rect(22,payY,344,69,white,line,.7);txt('PAGAMENTO',34,payY+54,6.5,bold,muted);fit(`Forma: ${e.payment_method||'A combinar'}`,34,payY+42,160,7.5,reg,wine);fit(`Sinal: ${money(deposit)}`,34,payY+29,150,7.5,reg,wine);fit(`Saldo restante: ${money(balance)}`,190,payY+29,155,7.5,bold,pink);fit(`Situacao: ${balance<=0&&total>0?'Pago integralmente':deposit>0?'Entrada paga':'Pendente'}`,190,payY+42,155,7.5,reg,wine);const noteLines=wrap(reg,e.payment_notes||'Sem observacoes de pagamento.',6.5,316,2);noteLines.forEach((l,i)=>txt(l,34,payY+15-i*9,6.5,reg,muted));
    rect(374,payY,197,69,cream,pink,1);txt('PAGAMENTO VIA PIX',385,payY+54,7,bold,pink);page.drawImage(pix,{x:386,y:payY+7,width:51,height:51});const pixText=wrap(bold,'Quer pagar via PIX? Escaneie o QR Code e envie o comprovante para confirmacao.',6.3,120,4);pixText.forEach((l,i)=>txt(l,445,payY+41-i*9,6.3,bold,wine));
    const obsY=payY-44;rect(22,obsY,W-44,34,pale,line,.7);txt('OBSERVACOES',34,obsY+22,6.5,bold,muted);const obsLines=wrap(reg,e.notes||'Sem observacoes adicionais.',6.4,W-68,2);obsLines.forEach((l,i)=>txt(l,34,obsY+11-i*8,6.4,reg,wine));
    const confY=obsY-43;rect(22,confY,W-44,33,cream,rgb(.93,.84,.70),.7);txt('CONFIRMACAO DA ENCOMENDA',34,confY+22,6.7,bold,wine);const conf='O cliente declara ter conferido sabores, quantidades, valores, data, horario e forma de entrega/retirada. Alteracoes posteriores ficam sujeitas a disponibilidade e ao prazo de producao. Este documento confirma comercialmente a encomenda e nao substitui documento fiscal quando legalmente exigido.';wrap(reg,conf,5.7,W-68,3).forEach((l,i)=>txt(l,34,confY+12-i*7,5.7,reg,wine));
    const sigY=confY-65;txt(`Monte Alto/SP, ${new Date().toLocaleDateString('pt-BR')}.`,215,sigY+43,6.5,reg,muted);page.drawLine({start:{x:54,y:sigY+10},end:{x:265,y:sigY+10},thickness:.7,color:wine});page.drawLine({start:{x:330,y:sigY+10},end:{x:541,y:sigY+10},thickness:.7,color:wine});txt('REPRESENTANTE - GELADINHO DOS SONHOS',62,sigY-1,6.3,bold,wine);txt('CLIENTE / RESPONSAVEL',365,sigY-1,6.3,bold,wine);fit(e.customer_name||'',353,sigY-13,165,5.8,reg,muted);
    rect(0,0,W,24,wine,wine,0);fit(`${STORE.name} - ${STORE.address} - WhatsApp ${STORE.phone}`,62,8,W-124,6.4,bold,white);
    return pdf.save();
  }
  async function downloadOrder(id){const old=window.event;try{const btn=old?.target;if(btn){btn.disabled=true;btn.dataset.oldText=btn.textContent;btn.textContent='Gerando PDF...'}const {event,products}=await getOrder(id);const bytes=await buildPdf(event,products);const blob=new Blob([bytes],{type:'application/pdf'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${event.event_code||'GDS-EVT'}_${safeName(event.customer_name)}.pdf`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}catch(err){console.error(err);alert('Nao foi possivel gerar o PDF: '+(err.message||err))}finally{const btn=old?.target;if(btn){btn.disabled=false;btn.textContent=btn.dataset.oldText||'Baixar PDF A4'}}}
  window.printE=downloadOrder;
})();