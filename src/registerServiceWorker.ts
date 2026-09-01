// ==============================================================================
// 🌊 REGISTRO DO SERVICE WORKER — SUPORTE PWA OFFLINE
// ==============================================================================

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[SALVÔ PWA] Service Worker registrado com sucesso:', registration.scope);
        })
        .catch((error) => {
          console.error('[SALVÔ PWA] Falha ao registrar Service Worker:', error);
        });
    });
  }
}
