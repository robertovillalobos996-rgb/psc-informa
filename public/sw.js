self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || '¡ALERTA DE ÚLTIMA HORA!';
  const options = {
    body: data.message || 'Nueva información en PSC INFORMA',
    icon: '/icon.png', 
    badge: '/badge.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200], 
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});