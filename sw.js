/* ChemQuest Upstate — offline service worker */
var C='chemquest-v1';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){return c.addAll(['./','./index.html']);}));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r||fetch(e.request).then(function(resp){
        var cp=resp.clone();
        caches.open(C).then(function(c){c.put(e.request,cp);}).catch(function(){});
        return resp;
      }).catch(function(){return caches.match('./index.html');});
    })
  );
});
