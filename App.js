import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { LGPDProvider } from './src/contexts/LGPDContext';
import { initializePWA } from './src/utils/pwa';
import { COLORS } from './src/constants';

// Previne que a splash screen seja escondida automaticamente
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicializa funcionalidades PWA se estiver na web
        if (Platform.OS === 'web') {
          await initializePWA();
        }
        
        // Simula carregamento inicial
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Esconde a splash screen
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Erro na inicialização:', error);
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  return (
    <AuthProvider>
      <LGPDProvider>
        <StatusBar 
          style="auto" 
          backgroundColor={COLORS.primary}
          translucent={false}
        />
        <AppNavigator />
      </LGPDProvider>
    </AuthProvider>
  );
}

