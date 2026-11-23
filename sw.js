// Service worker : fonctionnement hors ligne (stale-while-revalidate) + notifications
const CACHE = 'bible-an-v25';
// Versions de la Bible téléchargées à la demande (Darby…) : cache à part, conservé d'une mise à jour à l'autre
const VCACHE = 'bible-versions-v1';
const ASSETS = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest', 'data/lsg.js', 'data/plan.js', 'data/versets.js', 'data/quiz.js', 'confidentialite.html', 'icons/icon-192.png', 'icons/icon-512.png', 'fonts/jakarta.woff2', 'fonts/inter.woff2', 'fonts/cormorant.woff2', 'fonts/cormorant-italic.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== VCACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin || new URL(req.url).pathname.startsWith('/api/')) return;
  const version = new URL(req.url).pathname.endsWith('/data/darby.js');
  e.respondWith(caches.open(version ? VCACHE : CACHE).then(async cache => {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit && version) return hit; // texte figé : inutile de le retélécharger
    const net = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});

// Liste des versets, pour afficher le verset même si le message du serveur arrive vide
self.window = self;
try { importScripts('data/versets.js'); } catch (err) {}
function versetLocal() {
  const L = self.VERSETS || [], d = new Date();
  if (!L.length) return null;
  const jour = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  return L[((jour * 24 + d.getHours()) * 47) % L.length]; // même calcul que app.js
}

// Parole de l'heure envoyée par le serveur
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  const lecture = d.type === 'lecture';
  if (!d.body && !lecture) { const v = versetLocal(); if (v) d = { title: `Parole de Dieu · ${v.r}`, body: v.t }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Parole de Dieu', {
    body: d.body || 'Ouvrez l’application pour lire la parole de l’heure.',
    icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: lecture ? 'lecture-du-jour' : 'parole-de-l-heure', renotify: true, lang: 'fr',
    data: { type: lecture ? 'lecture' : 'verset' }
  }));
});
// Toucher la notification ouvre l'appli : la bulle du verset, ou la lecture du jour pour le rappel
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const type = (e.notification.data && e.notification.data.type) || 'verset';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) if ('focus' in c) { c.postMessage({ type }); return c.focus(); }
    return self.clients.openWindow(type === 'lecture' ? './?lecture=1' : './?verset=1');
  }));
});
