const CACHE='gds-v97-stock-guard';
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
