const CACHE = 'anbani-v4';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // version check always goes to the network
  if (url.origin === location.origin && url.pathname.endsWith('/version.json')) return;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin === location.origin && (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html'))) {
    // page: always try the fresh version first (bypassing the HTTP cache), fall back to the saved copy offline
    e.respondWith(fetch(new Request(req.url, { cache: 'no-store', credentials: 'same-origin' })).then(r => {
      if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); }
      return r;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  if (url.origin === location.origin || isFont) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })));
  }
});
