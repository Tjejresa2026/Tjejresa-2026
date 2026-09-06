const CACHE='tjejresan-malta-v3';
const A=['./','./index.html','./manifest.webmanifest','./icon.svg'];

self.addEventListener('install', e=>{
  self.skipWaiting(); // aktivera den nya versionen direkt, vänta inte på att alla flikar stängs
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(A)));
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim(); // ta över alla öppna flikar/appen direkt
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    fetch(e.request).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy));
      return res;
    }).catch(()=>caches.match(e.request)) // offline-läge: visa senast sparade version
  );
});
