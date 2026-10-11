export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function registerNotificationWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;
    return reg;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  try {
    await registerNotificationWorker();
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return 'denied';
  }
}

export async function showAppNotification(reminder) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return false;
  const title = reminder.title || 'Promemoria';
  const options = {
    body: reminder.body || '',
    tag: reminder.id || `liviu-${Date.now()}`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    silent: Boolean(reminder.quiet),
    renotify: true,
    data: { id: reminder.id }
  };

  try {
    const reg = (await navigator.serviceWorker?.getRegistration?.()) || (await registerNotificationWorker());
    if (reg?.showNotification) {
      await reg.showNotification(title, options);
      return true;
    }
  } catch {
    /* fallback sotto */
  }

  try {
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SHOW_NOTIFICATION', title, options });
      return true;
    }
  } catch {
    /* fallback sotto */
  }

  try {
    const n = new Notification(title, options);
    n.onclick = () => {
      window.focus();
      n.close();
    };
    return true;
  } catch {
    return false;
  }
}
