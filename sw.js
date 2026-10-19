const CACHE = 'anbani-20261019224840';
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./audio/00e2b8c65f.mp3", "./audio/03bb4df892.mp3", "./audio/066e9c301e.mp3", "./audio/0a274a4e9d.mp3", "./audio/0a35b12b65.mp3", "./audio/0d6f2da9e4.mp3", "./audio/1094cd1a70.mp3", "./audio/1282dda842.mp3", "./audio/1459d77164.mp3", "./audio/15ebe49a06.mp3", "./audio/18594b34b7.mp3", "./audio/1b58fd80f5.mp3", "./audio/2eec26a1f7.mp3", "./audio/31b5609bfe.mp3", "./audio/36640baf9e.mp3", "./audio/3e083f50c8.mp3", "./audio/40faf4ea50.mp3", "./audio/44420d8c2e.mp3", "./audio/4471ba3ef0.mp3", "./audio/462d6fce46.mp3", "./audio/463b9cf7e5.mp3", "./audio/47f74b1714.mp3", "./audio/480c4d4368.mp3", "./audio/523cc0f093.mp3", "./audio/52aa45bc48.mp3", "./audio/557fb75ee5.mp3", "./audio/58b14dbe65.mp3", "./audio/5a38ed4672.mp3", "./audio/5a84e11f3b.mp3", "./audio/5cc42eb382.mp3", "./audio/606de02120.mp3", "./audio/620c4c7cab.mp3", "./audio/67b113e065.mp3", "./audio/68d96d8b8c.mp3", "./audio/6bc8b59f77.mp3", "./audio/72263483ec.mp3", "./audio/74634f41f5.mp3", "./audio/748611d0e9.mp3", "./audio/78984f5f14.mp3", "./audio/7b0fc011c6.mp3", "./audio/7e2d96bf0f.mp3", "./audio/8262dc632e.mp3", "./audio/8709d63e80.mp3", "./audio/8a436210b7.mp3", "./audio/8d4dca6a0b.mp3", "./audio/8dca6e8ed3.mp3", "./audio/92bffae001.mp3", "./audio/95885e210a.mp3", "./audio/97523ec35d.mp3", "./audio/9abb4e7ae5.mp3", "./audio/9b99747143.mp3", "./audio/9fbc14059d.mp3", "./audio/a22c621bc9.mp3", "./audio/a62a0cb4a7.mp3", "./audio/a72a794464.mp3", "./audio/a82ba13396.mp3", "./audio/a9643cdc3b.mp3", "./audio/b3b2ddbd46.mp3", "./audio/b5445e2e79.mp3", "./audio/b6aadad50f.mp3", "./audio/bbd6683d95.mp3", "./audio/bce5eeccbf.mp3", "./audio/bdaaf1a34c.mp3", "./audio/bf53cafe65.mp3", "./audio/c0654df3fa.mp3", "./audio/c45d68f066.mp3", "./audio/c9988b03aa.mp3", "./audio/ca100cb1f4.mp3", "./audio/cd0ad7b2f8.mp3", "./audio/ce574fda44.mp3", "./audio/d7455702ac.mp3", "./audio/d8340bfd30.mp3", "./audio/d93fe7d46c.mp3", "./audio/da7ac902db.mp3", "./audio/dc0116b5bc.mp3", "./audio/f22753fda4.mp3", "./audio/f2778b719c.mp3", "./audio/f4004f9401.mp3", "./audio/f5a4cf964c.mp3", "./audio/f8b5686cc3.mp3", "./audio/fd42213ceb.mp3"];
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
