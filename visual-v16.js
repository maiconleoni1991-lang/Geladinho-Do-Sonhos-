(()=>{
  const frame=document.getElementById('store');
  const SB='https://qpqruhcspbdxjcnbhdhn.supabase.co';
  const KEY='sb_publishable_JVYvfl7nrRmlm17qF_KI8A_1H8mtvLk';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function stars(n){const v=Math.max(1,Math.min(5,Number(n)||5));return '★'.repeat(v)+'☆'.repeat(5-v)}
  async function loadTestimonials(d){
    const grid=d.getElementById('gdsTestimonialsGrid'); if(!grid)return;
    try{
      const r=await fetch(`${SB}/rest/v1/public_testimonials?select=rating,comment,created_at&order=created_at.desc&limit=6`,{headers:{apikey:KEY}});
      if(!r.ok)throw new Error('Falha ao carregar depoimentos');
      const rows=await r.json();
      if(!Array.isArray(rows)||!rows.length){
        grid.innerHTML='<div class="gdsTestimonialEmpty"><strong>💗 Sua opinião também pode aparecer aqui.</strong><span>Depois que o pedido for entregue, você poderá avaliar sua experiência pelo acompanhamento do pedido.</span></div>';
        return;
      }
      grid.innerHTML=rows.map(x=>`<article class="gdsTestimonialCard"><div class="gdsStars" aria-label="${Number(x.rating)||5} de 5 estrelas">${stars(x.rating)}</div><p>“${esc(x.comment)}”</p><footer><b>Cliente da loja</b><span>✓ Compra verificada</span></footer></article>`).join('');
    }catch(e){
      console.warn('Depoimentos indisponíveis',e);
      grid.innerHTML='<div class="gdsTestimonialEmpty"><strong>⭐ Avaliações dos clientes</strong><span>Os depoimentos aparecerão aqui conforme nossos clientes avaliarem os pedidos.</span></div>';
    }
  }
  function addTestimonials(d){
    if(d.getElementById('gdsTestimonials'))return;
    const target=d.querySelector('.how')||d.querySelector('footer'); if(!target)return;
    const style=d.createElement('style'); style.id='gdsTestimonialsStyle';
    style.textContent=`.gdsTestimonials{margin:40px 0 10px;padding:28px;border:1px solid #f0dfe5;border-radius:28px;background:linear-gradient(135deg,#fff,#fff5f8);box-shadow:0 18px 45px rgba(106,25,54,.08)}.gdsTestimonialsHead{text-align:center;max-width:680px;margin:0 auto 22px}.gdsTestimonialsHead small{display:inline-block;color:#ff0f68;font-weight:950;letter-spacing:.08em;text-transform:uppercase;margin-bottom:7px}.gdsTestimonialsHead h2{margin:0;color:#4d1020;font-size:clamp(25px,3vw,36px)}.gdsTestimonialsHead p{margin:8px 0 0;color:#705c63;line-height:1.55}.gdsTestimonialsGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}.gdsTestimonialCard{margin:0;background:#fff;border:1px solid #f0e1e5;border-radius:18px;padding:17px;box-shadow:0 10px 28px rgba(106,25,54,.07)}.gdsStars{color:#f4a300;font-size:19px;letter-spacing:2px}.gdsTestimonialCard p{margin:12px 0 18px;color:#4d353d;line-height:1.55;font-size:14px}.gdsTestimonialCard footer{background:transparent;color:inherit;padding:0;display:flex;flex-direction:column;gap:3px}.gdsTestimonialCard footer b{font-size:13px;color:#4d1020}.gdsTestimonialCard footer span{font-size:11px;color:#19a35a;font-weight:850}.gdsTestimonialEmpty{grid-column:1/-1;text-align:center;background:#fff;border:1px dashed #f0cad7;border-radius:18px;padding:24px}.gdsTestimonialEmpty strong{display:block;color:#4d1020;margin-bottom:7px}.gdsTestimonialEmpty span{color:#705c63;font-size:13px;line-height:1.5}.gdsTrustLine{text-align:center;margin-top:16px;color:#806a72;font-size:12px;font-weight:700}@media(max-width:780px){.gdsTestimonials{padding:22px 14px;margin-top:28px}.gdsTestimonialsGrid{grid-template-columns:1fr}.gdsTestimonialCard{padding:16px}}`;
    d.head.appendChild(style);
    const s=d.createElement('section'); s.id='gdsTestimonials'; s.className='gdsTestimonials';
    s.innerHTML='<div class="gdsTestimonialsHead"><small>Quem prova, conta</small><h2>O que nossos clientes estão achando</h2><p>Opiniões reais de clientes que já receberam seus pedidos.</p></div><div id="gdsTestimonialsGrid" class="gdsTestimonialsGrid"><div class="gdsTestimonialEmpty"><strong>Carregando avaliações...</strong></div></div><div class="gdsTrustLine">Avaliações disponíveis somente após a conclusão do pedido.</div>';
    target.parentNode.insertBefore(s,target); loadTestimonials(d);
  }
  function addCss(d,id,href){
    const old=d.getElementById(id); if(old)old.remove();
    const link=d.createElement('link'); link.id=id; link.rel='stylesheet'; link.href=href; d.head.appendChild(link);
  }
  function applyVisual(){
    try{
      if(!frame||!frame.contentDocument)return;
      const d=frame.contentDocument;
      const old=d.getElementById('gdsGourmetV15'); if(old)old.remove();
      addCss(d,'gdsGourmetV16','./gourmet-v16.css?v=21');
      addCss(d,'gdsHeroFixV20','./hero-fix-v20.css?v=21');
      addCss(d,'gdsHeroLayoutV21','./hero-layout-v21.css?v=21');
      addTestimonials(d);
    }catch(e){console.error('Falha ao aplicar visual gourmet V21',e)}
  }
  if(frame){frame.addEventListener('load',applyVisual);setTimeout(applyVisual,180);setTimeout(applyVisual,700);setTimeout(applyVisual,1500)}
})();