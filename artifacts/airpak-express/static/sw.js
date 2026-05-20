// Airpak Express PWA Service Worker v1.0
const CACHE_NAME = 'airpak-v1';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/apps/airpak/img/favicon.svg',
  // CSS
  '/css/apple-tokens.css',
  '/css/glass-system.css',
  '/css/animations.css',
  '/css/components.css',
  '/css/brand-airpak.css',
  // Pages
  '/dashboard.html',
  '/settings.html',
  '/payment.html',
  '/tracking.html',
  '/messages.html',
  '/signin.html',
  '/signup.html',
  '/contact.html',
  '/faq.html',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@600;700;800&display=swap',
];

// === INSTALL ===
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching assets');
        return cache.addAll(ASSETS_TO_CACHE).catch(err => {
          console.warn('[SW] Some assets failed to cache:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// === ACTIVATE ===
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// === FETCH / CACHE-STRATEGY ===
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  const url = new URL(event.request.url);
  
  // Skip cross-origin non-GET fonts (let browser handle)
  if (url.origin !== location.origin && !url.href.includes('fonts.googleapis.com') && !url.href.includes('fonts.gstatic.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone and cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          // Only cache same-origin
          if (url.origin === location.origin) {
            cache.put(event.request, responseToCache);
          }
        });
        
        return response;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (event.request.destination === 'document') {
          return caches.match('/offline.html') || new Response(
            '<html><body style="font-family:Inter,sans-serif;background:#0a0a12;color:#fff;padding:40px;text-align:center"><h1 style="color:#CD2727">You\'re Offline</h1><p>Airpak Express is still available offline. Check your connection.</p><a href="/" style="color:#CD2727">Go Home</a></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
      });
    })
  );
});

// === PUSH NOTIFICATIONS ===
self.addEventListener('push', event => {
  let data = { title: 'Airpak Express', body: 'You have a new notification', icon: '/icons/icon-192.png', badge: '/icons/icon-72.png', tag: 'airpak-notif', url: '/' };
  
  if (event.data) {
    try { data = { ...data, ...event.data.json() }; } catch(e) {}
  }
  
  const options = {
    body: data.body || 'New update from Airpak Express',
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/icon-72.png',
    tag: data.tag || 'airpak-notif',
    renotify: true,
    requireInteraction: data.important || false,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/', date: Date.now() },
    actions: [
      { action: 'track', title: '📦 Track', icon: '/icons/track-96.png' },
      { action: 'view', title: '👁 View', icon: '/icons/icon-96.png' },
      { action: 'dismiss', title: '✕ Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// === NOTIFICATION CLICK ===
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  if (event.action === 'track') {
    event.waitUntil(clients.openWindow('/tracking.html'));
  } else if (event.action === 'view') {
    event.waitUntil(clients.openWindow(url));
  } else {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
        for (const client of clientList) {
          if (client.url.includes('/') && 'focus' in client) {
            client.focus();
            client.navigate(url);
            return;
          }
        }
        return clients.openWindow(url);
      })
    );
  }
});

// === BACKGROUND SYNC ===
self.addEventListener('sync', event => {
  if (event.tag === 'sync-shipments') {
    event.waitUntil(syncShipments());
  } else if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncShipments() {
  console.log('[SW] Background sync: shipments');
  // Notify clients to sync
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ type: 'SYNC_SHIPMENTS' }));
}

async function syncMessages() {
  console.log('[SW] Background sync: messages');
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ type: 'SYNC_MESSAGES' }));
}

// === PERIODIC SYNC (for delivery updates) ===
self.addEventListener('periodicsync', event => {
  if (event.tag === 'delivery-check') {
    event.waitUntil(checkDeliveryUpdates());
  }
});

async function checkDeliveryUpdates() {
  console.log('[SW] Periodic sync: checking delivery updates');
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ type: 'CHECK_DELIVERY' }));
}

// === MESSAGE HANDLER (from main app) ===
self.addEventListener('message', event => {
  if (!event.data) return;
  
  const { type, payload } = event.data;
  
  switch(type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_VERSION':
      event.ports[0]?.postMessage({ version: CACHE_NAME });
      break;
    case 'CACHE_URLS':
      caches.open(CACHE_NAME).then(cache => cache.addAll(payload.urls));
      break;
    case 'CLEAR_CACHE':
      caches.delete(CACHE_NAME).then(() => caches.open(CACHE_NAME));
      break;
  }
});

// === INSTALL PROMPTABLE CHECK ===
self.addEventListener('install', event => {
  // Make this service worker available immediately
  self.skipWaiting();
});

console.log('[SW] Airpak Express PWA Service Worker loaded');