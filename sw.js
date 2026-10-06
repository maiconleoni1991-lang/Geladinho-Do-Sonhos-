const C='gds-v43-interactions';
const A=[
'./','./index.html','./store.html','./pwa.js','./mobile-tracking-v24.js','./order-alerts-v30.js','./brand-fix-v42.js','./visual-v16.js','./catalog-v32-loader.js','./catalog-v32.js','./store-presence-v39.js','./store-background-v43.js','./admin-products-v32.js','./admin-images-v34.js','./admin-product-sort-v35.js','./admin-security-v36.js','./admin-price-fix-v38.js','./admin-live-v39.js','./gourmet-v16.css','./hero-fix-v20.css','./hero-layout-v21.css','./manifest.webmanifest','./assets/logo-oficial.webp','./assets/app-icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png','./assets/apple-touch-icon.png','./assets/favicon-32.png','./assets/logo-v13-1.txt','./assets/logo-v13-2.txt','./assets/logo-v13-3.txt','./assets/logo-v13-4.txt','./assets/store-bg-v42-1.txt','./assets/store-bg-v42-2.txt','./assets/store-bg-v42-3.txt','./assets/store-bg-v42-4.txt','./assets/store-bg-v42-5.txt','./assets/store-bg-v42-6.txt','./assets/store-bg-v42-7.txt','./assets/hero-v2.webp','./assets/products-v2.webp','./acompanhar/','./acompanhar/index.html','./acompanhar/tracking.css','./acompanhar/tracking.js','./admin/','./admin/index.html','./admin/manifest.webmanifest','./admin/orders-v30.html','./admin/events-v41.html','./admin/reports-v30.html','./admin/manage.html'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.hostname.includes('supabase.co')||u.hostname.includes('viacep.com.br'))return;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
    if(r&&r.ok){const x=r.clone();caches.open(C).then(c=>c.put(e.request,x)).catch(()=>{})}
    return r;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=e.notification.data&&e.notification.data.url?e.notification.data.url:new URL('./acompanhar/',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async list=>{
    for(const c of list){if('focus'in c){try{if('navigate'in c)await c.navigate(url)}catch(_){}return c.focus()}}
    if(self.clients.openWindow)return self.clients.openWindow(url);
  }));
});
