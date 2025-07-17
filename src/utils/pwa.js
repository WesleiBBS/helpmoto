export const initializePWA = async () => {
  console.log('Inicializando PWA...');
  
  // Verificar se é PWA
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', registration);
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }

  // Configurar manifest
  const link = document.createElement('link');
  link.rel = 'manifest';
  link.href = '/manifest.json';
  document.head.appendChild(link);

  return Promise.resolve();
};
