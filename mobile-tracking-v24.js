(()=>{
const frame=document.getElementById('store');
const MARKER='/geladinhos/';
function appRoot(){
  const p=window.location.pathname;
  const i=p.indexOf(MARKER);
  if(i>=0)return new URL(p.slice(0,i+MARKER.length),window.location.origin).href.replace(/\/$/,'');
  return new URL('./',window.location.href).href.replace(/\/$/,'');
}
const ROOT=appRoot();
function lastOrder(){try{const o=JSON.parse(localStorage.getItem('gds_last_order')||'null');if(!o||!o.token)return null;if(localStorage.getItem('gds_order_closed_'+o.token)==='1')return null;return o}catch(_){return null}}
function hrefFor(o){return ROOT+'/acompanhar/'+(o&&o.token?'?t='+encodeURIComponent(o.token):'')}
function testimonialsHref(){return ROOT+'/?depoimentos=1#gdsTestimonials'}
function installMobileTracking(){
  const d=frame&&frame.contentDocument;if(!d||!d.body)return;
  const old=d.getElementById('gdsMobileTrackV24');if(old)old.remove();
  let css=d.getElementById('gdsMobileTrackCssV24');
  if(!css){css=d.createElement('style');css.id='gdsMobileTrackCssV24';css.textContent=`#gdsMobileTrackV24{position:fixed;z-index:2147483640;left:14px;bottom:14px;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;background:#fff;color:#4a101e;border:1px solid #f0d6df;border-radius:999px;padding:13px 17px;font:900 13px Inter,system-ui,Arial;box-shadow:0 14px 38px rgba(77,16,32,.24)}#gdsMobileTrackV24 .dot{width:9px;height:9px;border-radius:50%;background:#19b15b}@media(max-width:700px){#gdsMobileTrackV24{left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));border-radius:17px;padding:15px 16px;background:linear-gradient(120deg,#4a101e,#6f1c3c);color:#fff;border:0;font-size:14px}body{padding-bottom:76px!important}}`;d.head.appendChild(css)}
  const o=lastOrder(),a=d.createElement('a');a.id='gdsMobileTrackV24';a.target='_top';a.href=hrefFor(o);a.innerHTML='<span class="dot"></span><span>'+(o&&o.code?'Acompanhar pedido '+o.code:'Acompanhar pedido')+'</span><span>›</span>';d.body.appendChild(a);
  const nav=d.querySelector('.nav'),cart=d.getElementById('cartTop');if(nav&&cart){let n=d.getElementById('gdsTrackNavV24');if(!n){n=d.createElement('a');n.id='gdsTrackNavV24';n.className='cartNav';n.target='_top';n.textContent='📍';nav.insertBefore(n,cart)}n.href=hrefFor(o);n.title=o&&o.code?'Acompanhar '+o.code:'Acompanhar pedido'}
}
function enhanceWhats(){
  const w=frame&&frame.contentWindow;if(!w||typeof w.gdsBuildWhatsMessage!=='function'||w.gdsBuildWhatsMessage.__v24)return;
  const original=w.gdsBuildWhatsMessage;
  function upgraded(){
    let base=original.apply(this,arguments),o=lastOrder();
    const track=hrefFor(o),reviews=testimonialsHref();
    base+='\n\n📍 *ACOMPANHE SEU PEDIDO*\n'+track;
    base+='\n\n⭐ *DEPOIS QUE RECEBER*\nSua avaliação é muito importante para nós. Quando o pedido for entregue, use o link de acompanhamento acima para avaliar sua experiência.';
    base+='\n\n💬 *DEPOIMENTOS DE CLIENTES*\n'+reviews;
    return base;
  }
  upgraded.__v24=true;w.gdsBuildWhatsMessage=upgraded;
}
function scrollTestimonials(){
  if(new URLSearchParams(location.search).get('depoimentos')!=='1'&&location.hash!=='#gdsTestimonials')return;
  const d=frame&&frame.contentDocument;if(!d)return;const s=d.getElementById('gdsTestimonials');if(s)s.scrollIntoView({behavior:'smooth',block:'start'});
}
function hookOrderCreated(){
  if(typeof window.gdsAddTrackingShortcut!=='function'||window.gdsAddTrackingShortcut.__v24)return;
  const original=window.gdsAddTrackingShortcut;
  function hooked(d,o){localStorage.removeItem('gds_order_closed_'+(o&&o.token||''));const r=original.apply(this,arguments);setTimeout(installMobileTracking,30);return r}hooked.__v24=true;window.gdsAddTrackingShortcut=hooked;
}
function apply(){installMobileTracking();enhanceWhats();scrollTestimonials();hookOrderCreated()}
if(frame){frame.addEventListener('load',()=>{setTimeout(apply,200);setTimeout(apply,800);setTimeout(apply,1600)});setTimeout(apply,900)}
window.addEventListener('storage',()=>setTimeout(apply,50));
})();