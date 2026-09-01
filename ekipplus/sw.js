const CACHE='ekipplus-creative-v3';

self.addEventListener('install',event=>{
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
    await self.clients.claim();
    const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clients){
      try{
        const url=new URL(client.url);
        if(url.pathname.includes('/mekan-atlasi/ekipplus')){
          url.searchParams.set('v','creative3');
          await client.navigate(url.href);
        }
      }catch(e){}
    }
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request)));
    return;
  }
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});