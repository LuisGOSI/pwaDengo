import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { clientsClaim } from 'workbox-core';

self.skipWaiting();
clientsClaim();

// precache
precacheAndRoute([
  { url: '/manifest.webmanifest', revision: null },
  { url: '/icons/icon-192.png', revision: null },
  { url: '/icons/icon-512.png', revision: null },
  ...self.__WB_MANIFEST
]);

// cache HTML para que la app abra offline
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'html-cache'
  })
);

// cache de assets estáticos (JS, CSS, imágenes)
registerRoute(
  ({ request }) =>
    ['script', 'style', 'image', 'font'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'assets-cache'
  })
);

// cache de GET a API
registerRoute(
  ({ url, request }) =>
    request.method === 'GET' && url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3
  })
);

// cache de supabase
registerRoute(
  ({ url, request }) =>
    request.method === 'GET' &&
    url.origin.includes('supabase.co'),
  new NetworkFirst({
    cacheName: 'supabase-cache',
    networkTimeoutSeconds: 3
  })
);

