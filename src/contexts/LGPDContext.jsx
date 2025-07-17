import React, { createContext, useContext, useState, useEffect } from 'react';

const LGPDContext = createContext();

export const LGPDProvider = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  useEffect(() => {
    // Verificar se já deu consentimento
    const consent = localStorage.getItem('lgpd_consent');
    if (consent === 'true') {
      setConsentGiven(true);
    } else {
      setShowConsentBanner(true);
    }
  }, []);

  const giveConsent = () => {
    localStorage.setItem('lgpd_consent', 'true');
    setConsentGiven(true);
    setShowConsentBanner(false);
  };

  const revokeConsent = () => {
    localStorage.removeItem('lgpd_consent');
    setConsentGiven(false);
    setShowConsentBanner(true);
  };

  return (
    <LGPDContext.Provider value={{
      consentGiven,
      showConsentBanner,
      giveConsent,
      revokeConsent
    }}>
      {children}
    </LGPDContext.Provider>
  );
};

export const useLGPD = () => {
  const context = useContext(LGPDContext);
  if (!context) {
    throw new Error('useLGPD must be used within an LGPDProvider');
  }
  return context;
};