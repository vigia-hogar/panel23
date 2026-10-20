const C='vigia-v4';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return; // la API de NextDNS nunca se cachea
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('./index.html'))});
self.addEventListener('push',e=>{
  let d={title:'Vigía',body:'Aviso nuevo',tag:'vigia'};
  try{d=Object.assign(d,e.data.json())}catch(_){}
  e.waitUntil(self.registration.showNotification(d.title,{body:d.body,tag:d.tag||'vigia',icon:'icon-192.png',badge:'icon-192.png',vibrate:[200,100,200],requireInteraction:(d.p||0)>=5}));
});
