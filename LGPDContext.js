import React, { createContext, useContext, useState, useEffect } from 'react';
import { LGPDManager, SecurityManager } from '../utils/security';
import { useAuth } from './AuthContext';

const LGPDContext = createContext();

export const LGPDProvider = ({ children }) => {
  const { user } = useAuth();
  const [consentStatus, setConsentStatus] = useState({});
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: false,
    locationTracking: false,
    analytics: false,
    marketing: false,
    notifications: false,
  });

  useEffect(() => {
    if (user?.id) {
      loadUserConsents();
      loadPrivacySettings();
    }
  }, [user]);

  const loadUserConsents = async () => {
    try {
      const consents = await LGPDManager.getConsentHistory(user.id);
      const status = {};
      
      // Processa histórico de consentimentos para obter status atual
      consents?.forEach(consent => {
        const key = `${consent.dataType}_${consent.purpose}`;
        status[key] = consent.granted;
      });
      
      setConsentStatus(status);
    } catch (error) {
      console.error('Erro ao carregar consentimentos:', error);
    }
  };

  const loadPrivacySettings = async () => {
    try {
      const settings = await SecurityManager.secureRetrieve(
        `privacy_settings_${user.id}`,
        true
      );
      
      if (settings) {
        setPrivacySettings(settings);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de privacidade:', error);
    }
  };

  const requestConsent = async (dataType, purpose, description) => {
    return new Promise((resolve) => {
      // Em uma implementação real, isso mostraria um modal de consentimento
      // Por agora, simula a concessão de consentimento
      const granted = true; // Simulação
      
      if (granted) {
        grantConsent(dataType, purpose);
      } else {
        revokeConsent(dataType, purpose);
      }
      
      resolve(granted);
    });
  };

  const grantConsent = async (dataType, purpose) => {
    try {
      await LGPDManager.recordConsent(user.id, dataType, purpose, true);
      
      const key = `${dataType}_${purpose}`;
      setConsentStatus(prev => ({
        ...prev,
        [key]: true,
      }));
      
      // Log do acesso
      await LGPDManager.logDataAccess(
        user.id,
        dataType,
        purpose,
        'user_consent'
      );
    } catch (error) {
      console.error('Erro ao conceder consentimento:', error);
    }
  };

  const revokeConsent = async (dataType, purpose) => {
    try {
      await LGPDManager.recordConsent(user.id, dataType, purpose, false);
      
      const key = `${dataType}_${purpose}`;
      setConsentStatus(prev => ({
        ...prev,
        [key]: false,
      }));
    } catch (error) {
      console.error('Erro ao revogar consentimento:', error);
    }
  };

  const hasConsent = (dataType, purpose) => {
    const key = `${dataType}_${purpose}`;
    return consentStatus[key] === true;
  };

  const updatePrivacySettings = async (newSettings) => {
    try {
      const updatedSettings = { ...privacySettings, ...newSettings };
      
      await SecurityManager.secureStore(
        `privacy_settings_${user.id}`,
        updatedSettings,
        true
      );
      
      setPrivacySettings(updatedSettings);
      
      // Registra mudanças de consentimento baseadas nas configurações
      if (newSettings.dataCollection !== undefined) {
        if (newSettings.dataCollection) {
          await grantConsent(LGPDManager.DATA_TYPES.BEHAVIORAL, LGPDManager.PURPOSES.ANALYTICS);
        } else {
          await revokeConsent(LGPDManager.DATA_TYPES.BEHAVIORAL, LGPDManager.PURPOSES.ANALYTICS);
        }
      }
      
      if (newSettings.locationTracking !== undefined) {
        if (newSettings.locationTracking) {
          await grantConsent(LGPDManager.DATA_TYPES.LOCATION, LGPDManager.PURPOSES.SERVICE_PROVISION);
        } else {
          await revokeConsent(LGPDManager.DATA_TYPES.LOCATION, LGPDManager.PURPOSES.SERVICE_PROVISION);
        }
      }
      
      if (newSettings.marketing !== undefined) {
        if (newSettings.marketing) {
          await grantConsent(LGPDManager.DATA_TYPES.PERSONAL, LGPDManager.PURPOSES.MARKETING);
        } else {
          await revokeConsent(LGPDManager.DATA_TYPES.PERSONAL, LGPDManager.PURPOSES.MARKETING);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações de privacidade:', error);
    }
  };

  const exportUserData = async () => {
    try {
      const exportedData = await LGPDManager.exportUserData(user.id);
      return exportedData;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  };

  const deleteUserData = async () => {
    try {
      await LGPDManager.deleteUserData(user.id);
    } catch (error) {
      console.error('Erro ao deletar dados:', error);
      throw error;
    }
  };

  const logDataAccess = async (dataType, purpose) => {
    try {
      await LGPDManager.logDataAccess(
        user.id,
        dataType,
        purpose,
        'app_access'
      );
    } catch (error) {
      console.error('Erro ao registrar acesso a dados:', error);
    }
  };

  const value = {
    consentStatus,
    privacySettings,
    requestConsent,
    grantConsent,
    revokeConsent,
    hasConsent,
    updatePrivacySettings,
    exportUserData,
    deleteUserData,
    logDataAccess,
    loadUserConsents,
  };

  return (
    <LGPDContext.Provider value={value}>
      {children}
    </LGPDContext.Provider>
  );
};

export const useLGPD = () => {
  const context = useContext(LGPDContext);
  if (!context) {
    throw new Error('useLGPD deve ser usado dentro de um LGPDProvider');
  }
  return context;
};

