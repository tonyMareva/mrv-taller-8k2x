// Service worker Mareva — cachea la app para funcionar 100% sin conexión
// IMPORTANTE: cada vez que subas una versión nueva de index.html, sube TAMBIÉN
// este archivo cambiando el número de CACHE (v2, v3, v4...). Ese cambio es lo
// que le dice al móvil "hay versión nueva, descárgala" — si no cambia, el móvil
// se queda con la versión vieja para siempre aunque el index.html sea otro.
var CACHE='mareva-v4';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(['./','./index.html']).catch(function(){return c.add('./');});
  }).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(function(r){
      if(r)return r;
      return fetch(e.request).then(function(resp){
        var cl=resp.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,cl);});
        return resp;
      }).catch(function(){return caches.match('./');});
    })
  );
});
