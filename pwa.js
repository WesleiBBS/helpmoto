// Utilitários para funcionalidades PWA

/**
 * Registra o Service Worker
 */
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      console.log('Service Worker registrado:', registration);
      
      // Escuta por atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão disponível
            showUpdateAvailable();
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }
};

/**
 * Mostra notificação de atualização disponível
 */
const showUpdateAvailable = () => {
  // Em uma implementação real, isso mostraria um banner ou modal
  if (window.confirm('Nova versão disponível! Deseja atualizar?')) {
    updateApp();
  }
};

/**
 * Atualiza o app para a nova versão
 */
export const updateApp = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  }
};

/**
 * Verifica se o app pode ser instalado
 */
export const canInstallPWA = () => {
  return window.deferredPrompt !== null;
};

/**
 * Instala o PWA
 */
export const installPWA = async () => {
  if (window.deferredPrompt) {
    const promptEvent = window.deferredPrompt;
    
    // Mostra o prompt de instalação
    promptEvent.prompt();
    
    // Aguarda a escolha do usuário
    const result = await promptEvent.userChoice;
    
    console.log('Resultado da instalação:', result);
    
    // Limpa o prompt
    window.deferredPrompt = null;
    
    return result.outcome === 'accepted';
  }
  
  return false;
};

/**
 * Configura listeners para eventos PWA
 */
export const setupPWAListeners = () => {
  // Listener para prompt de instalação
  window.addEventListener('beforeinstallprompt', (event) => {
    console.log('Prompt de instalação disponível');
    
    // Previne o prompt automático
    event.preventDefault();
    
    // Salva o evento para uso posterior
    window.deferredPrompt = event;
    
    // Dispara evento customizado
    window.dispatchEvent(new CustomEvent('pwa-installable'));
  });
  
  // Listener para instalação bem-sucedida
  window.addEventListener('appinstalled', (event) => {
    console.log('PWA instalado com sucesso');
    
    // Limpa o prompt salvo
    window.deferredPrompt = null;
    
    // Dispara evento customizado
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });
  
  // Listener para mudanças no status online/offline
  window.addEventListener('online', () => {
    console.log('App voltou online');
    window.dispatchEvent(new CustomEvent('app-online'));
  });
  
  window.addEventListener('offline', () => {
    console.log('App ficou offline');
    window.dispatchEvent(new CustomEvent('app-offline'));
  });
};

/**
 * Verifica se o app está rodando como PWA
 */
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

/**
 * Verifica se o dispositivo está online
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Solicita permissão para notificações
 */
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    console.log('Permissão de notificação:', permission);
    return permission === 'granted';
  }
  return false;
};

/**
 * Mostra notificação local
 */
export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      ...options,
    });
    
    return notification;
  }
  
  console.warn('Notificações não suportadas ou não permitidas');
  return null;
};

/**
 * Registra para notificações push
 */
export const subscribeToPushNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY),
      });
      
      console.log('Inscrito em notificações push:', subscription);
      
      // Enviar subscription para o servidor
      await sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Erro ao se inscrever em notificações push:', error);
    }
  }
  
  return null;
};

/**
 * Converte chave VAPID para Uint8Array
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
};

/**
 * Envia subscription para o servidor
 */
const sendSubscriptionToServer = async (subscription) => {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao enviar subscription');
    }
    
    console.log('Subscription enviada para o servidor');
  } catch (error) {
    console.error('Erro ao enviar subscription:', error);
  }
};

/**
 * Adiciona atalho à tela inicial (Android)
 */
export const addToHomeScreen = () => {
  if (window.deferredPrompt) {
    return installPWA();
  }
  
  // Para dispositivos que não suportam o prompt automático
  if (navigator.userAgent.includes('Android')) {
    showNotification('Adicionar à Tela Inicial', {
      body: 'Toque no menu do navegador e selecione "Adicionar à tela inicial"',
      requireInteraction: true,
    });
  }
  
  return false;
};

/**
 * Compartilha conteúdo usando Web Share API
 */
export const shareContent = async (data) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  }
  
  // Fallback para dispositivos que não suportam Web Share API
  if (navigator.clipboard && data.url) {
    try {
      await navigator.clipboard.writeText(data.url);
      showNotification('Link copiado!', {
        body: 'O link foi copiado para a área de transferência',
      });
      return true;
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  }
  
  return false;
};

/**
 * Obtém informações sobre a conexão de rede
 */
export const getNetworkInfo = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }
  
  return null;
};

/**
 * Verifica se o dispositivo tem bateria baixa
 */
export const getBatteryInfo = async () => {
  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      
      return {
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    } catch (error) {
      console.error('Erro ao obter informações da bateria:', error);
    }
  }
  
  return null;
};

/**
 * Configura estratégias de cache baseadas na conexão
 */
export const setupAdaptiveLoading = () => {
  const networkInfo = getNetworkInfo();
  
  if (networkInfo) {
    // Ajusta comportamento baseado na qualidade da conexão
    if (networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') {
      // Conexão lenta - prioriza cache
      console.log('Conexão lenta detectada - priorizando cache');
      return 'cache-first';
    } else if (networkInfo.saveData) {
      // Modo economia de dados
      console.log('Modo economia de dados ativo');
      return 'cache-first';
    }
  }
  
  return 'network-first';
};

/**
 * Inicializa todas as funcionalidades PWA
 */
export const initializePWA = async () => {
  console.log('Inicializando PWA...');
  
  // Registra Service Worker
  await registerServiceWorker();
  
  // Configura listeners
  setupPWAListeners();
  
  // Solicita permissão para notificações
  await requestNotificationPermission();
  
  // Configura carregamento adaptativo
  setupAdaptiveLoading();
  
  console.log('PWA inicializado com sucesso');
};

