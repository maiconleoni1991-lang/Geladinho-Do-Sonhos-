// Geladinho dos Sonhos — service worker exclusivo da administracao.
// O objetivo aqui e isolar /admin/ do service worker da loja publica.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
