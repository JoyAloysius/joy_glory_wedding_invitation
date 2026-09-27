/** Registers the offline-support service worker in production builds only. */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker.register(swUrl).catch(() => {
      // Offline support is a progressive enhancement — ignore registration failures.
    })
  })
}
