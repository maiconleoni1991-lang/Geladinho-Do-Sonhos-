const C='gds-v60-desktop-store';
const A=[
'./','./index.html','./store.html','./store-price-fix-v56.js','./store-direct-v54.js','./store-app-v59.js','./store-runtime-fix-v60.js','./store-presence-v39.js','./manifest.webmanifest','./assets/logo-oficial.webp','./assets/logo-v13-1.txt','./assets/logo-v13-2.txt','./assets/logo-v13-3.txt','./assets/logo-v13-4.txt','./assets/pix-qr-v55.txt','./assets/app-icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png','./assets/apple-touch-icon.png','./assets/favicon-32.png','./assets/store-bg-v42-1.txt','./assets/store-bg-v42-2.txt','./assets/store-bg-v42-3.txt','./assets/store-bg-v42-4.txt','./assets/store-bg-v42-5.txt','./assets/store-bg-v42-6.txt','./assets/store-bg-v42-7.txt','./assets/hero-v2.webp','./assets/products-v2.webp','./acompanhar/','./acompanhar/index.html','./acompanhar/tracking.css','./acompanhar/tracking.js','./order-alerts-v30.js','./brand-fix-v42.js','./admin/','./admin/index.html','./admin/admin-common-v48.js','./admin/admin-visitors-v52.js','./admin/admin-store-ops-v50.js','./admin/events-product-picker-v49.js','./admin/event-order-pdf-v58.js','./admin/reports-fix-v59.js','./admin/login-v48.html','./admin/mfa-v48.html','./admin/products-v48.html','./admin/orders-v48.html','./admin/events-v48.html','./admin/events-v57.html','./admin/reports-v48.html','./admin/manifest.webmanifest'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
function enhancedStore(html){
 if(html.includes('store-app-v59.js'))return html;
 const extra='<script src="./store-price-fix-v56.js?v=60"><\/script><script src="./store-direct-v54.js?v=60"><\/script><script src="./store-app-v59.js?v=60"><\/script><script src="./store-runtime-fix-v60.js?v=60"><\/script>';
 return html.replace('</body>',extra+'</body>');
}
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.hostname.includes('supabase.co')||u.hostname.includes('viacep.com.br')||u.hostname.includes('cdn.jsdelivr.net'))return;
 if(u.origin===location.origin&&u.pathname.endsWith('/store.html')){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{
   if(!r.ok)throw new Error('HTTP '+r.status);
   const h=enhancedStore(await r.text());
   return new Response(h,{status:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})
  }).catch(async()=>{
   const r=await caches.match('./store.html',{ignoreSearch:true});
   if(!r)return new Response('Loja indisponível',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
   return new Response(enhancedStore(await r.text()),{status:200,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})
  }));return;
 }
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r&&r.ok){const x=r.clone();caches.open(C).then(c=>c.put(e.request,x)).catch(()=>{})}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=e.notification.data&&e.notification.data.url?e.notification.data.url:new URL('./admin/orders-v48.html?v=60',self.registration.scope).href;e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async list=>{for(const c of list){if('focus'in c){try{if('navigate'in c)await c.navigate(url)}catch(_){}return c.focus()}}if(self.clients.openWindow)return self.clients.openWindow(url)}))});