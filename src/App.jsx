import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { LGPDProvider } from './contexts/LGPDContext';
import { initializePWA } from './utils/pwa';

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicializa funcionalidades PWA
        await initializePWA();
        
        console.log('HelpMoto PWA inicializado com sucesso!');
      } catch (error) {
        console.error('Erro na inicialização:', error);
      }
    };

    initializeApp();
  }, []);

  // Redireciona para HomeScreen ao iniciar
  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <LGPDProvider>
          <AppNavigator />
        </LGPDProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
