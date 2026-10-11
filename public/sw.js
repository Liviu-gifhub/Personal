/* Service worker minimale: abilita notifiche anche quando l'app non è in primo piano. */
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
      return undefined;
    })
  );
});

self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type !== 'SHOW_NOTIFICATION') return;
  const { title, options } = data;
  event.waitUntil(
    self.registration.showNotification(title || 'Promemoria', {
      body: options?.body || '',
      tag: options?.tag || 'liviu-reminder',
      icon: options?.icon || '/icon-192.png',
      badge: options?.badge || '/icon-192.png',
      silent: Boolean(options?.silent),
      renotify: true,
      data: options?.data || {}
    })
  );
});
