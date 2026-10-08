// Geladinho dos Sonhos — service worker exclusivo da administracao v98.
// Mantem o Admin instalavel como PWA sem armazenar dados privados em cache.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith(fetch(event.request,{cache:'no-store'}));
});
