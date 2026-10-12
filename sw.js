const CACHE='gds-v130-stability';
const CORE=['./','./index.html','./manifest.webmanifest','./store-v61.css','./store-v61.js','./assets/logo-oficial-hq-v65.webp','./assets/hero-gds-v63.webp','./assets/favicon-32.png','./assets/apple-touch-icon.png','./assets/icon-192.png','./assets/icon-512.png','./acompanhar/','./acompanhar/index.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin)return;
  // A administracao possui escopo proprio e nunca deve usar cache/fallback da loja.
  if(/\/admin(?:\/|$)/.test(u.pathname))return;
  if(u.hostname.includes('supabase.co')||u.hostname.includes('viacep.com.br')||u.hostname.includes('wa.me')||u.hostname.includes('cdn.jsdelivr.net'))return;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
    if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});


self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch(_){data={title:'Geladinho dos Sonhos',body:event.data?.text()||'A loja está aberta!'}}
  const title=data.title||'🍧 Geladinho dos Sonhos';
  const options={
    body:data.body||'A loja está aberta. Confira os sabores disponíveis.',
    icon:data.icon||'./assets/icon-192.png',
    badge:data.badge||'./assets/favicon-32.png',
    tag:data.tag||'gds-store-open',
    renotify:true,
    data:{url:data.url||'./'}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||'./',self.location.origin).href;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const client of list){if('focus'in client&&client.url.startsWith(self.location.origin)){client.navigate(target).catch(()=>{});return client.focus()}}
    return clients.openWindow?clients.openWindow(target):undefined;
  }));
});
