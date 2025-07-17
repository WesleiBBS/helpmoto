import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

// Configurações de segurança
const SECURITY_CONFIG = {
  // Chave para criptografia local (em produção, deve vir de variáveis de ambiente)
  ENCRYPTION_KEY: 'HelpMoto_Security_Key_2024',
  // Tempo de expiração do token (em milissegundos)
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas
  // Configurações de senha
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: true,
};

/**
 * Classe para gerenciar segurança e conformidade com LGPD
 */
export class SecurityManager {
  /**
   * Criptografa dados sensíveis antes do armazenamento
   * @param {string} data - Dados a serem criptografados
   * @returns {string} - Dados criptografados
   */
  static encryptData(data) {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECURITY_CONFIG.ENCRYPTION_KEY
      ).toString();
      return encrypted;
    } catch (error) {
      console.error('Erro ao criptografar dados:', error);
      throw new Error('Falha na criptografia dos dados');
    }
  }

  /**
   * Descriptografa dados sensíveis
   * @param {string} encryptedData - Dados criptografados
   * @returns {any} - Dados descriptografados
   */
  static decryptData(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECURITY_CONFIG.ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Erro ao descriptografar dados:', error);
      throw new Error('Falha na descriptografia dos dados');
    }
  }

  /**
   * Armazena dados de forma segura
   * @param {string} key - Chave para armazenamento
   * @param {any} data - Dados a serem armazenados
   * @param {boolean} encrypt - Se deve criptografar os dados
   */
  static async secureStore(key, data, encrypt = true) {
    try {
      const dataToStore = encrypt ? this.encryptData(data) : JSON.stringify(data);
      await SecureStore.setItemAsync(key, dataToStore);
    } catch (error) {
      console.error('Erro ao armazenar dados seguros:', error);
      throw new Error('Falha no armazenamento seguro');
    }
  }

  /**
   * Recupera dados armazenados de forma segura
   * @param {string} key - Chave do armazenamento
   * @param {boolean} decrypt - Se deve descriptografar os dados
   * @returns {any} - Dados recuperados
   */
  static async secureRetrieve(key, decrypt = true) {
    try {
      const storedData = await SecureStore.getItemAsync(key);
      if (!storedData) return null;
      
      return decrypt ? this.decryptData(storedData) : JSON.parse(storedData);
    } catch (error) {
      console.error('Erro ao recuperar dados seguros:', error);
      return null;
    }
  }

  /**
   * Remove dados armazenados de forma segura
   * @param {string} key - Chave do armazenamento
   */
  static async secureRemove(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Erro ao remover dados seguros:', error);
    }
  }

  /**
   * Valida força da senha
   * @param {string} password - Senha a ser validada
   * @returns {object} - Resultado da validação
   */
  static validatePasswordStrength(password) {
    const result = {
      isValid: true,
      errors: [],
      score: 0,
    };

    // Comprimento mínimo
    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      result.isValid = false;
      result.errors.push(`Senha deve ter pelo menos ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
    } else {
      result.score += 1;
    }

    // Letra maiúscula
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      result.isValid = false;
      result.errors.push('Senha deve conter pelo menos uma letra maiúscula');
    } else if (/[A-Z]/.test(password)) {
      result.score += 1;
    }

    // Letra minúscula
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      result.isValid = false;
      result.errors.push('Senha deve conter pelo menos uma letra minúscula');
    } else if (/[a-z]/.test(password)) {
      result.score += 1;
    }

    // Número
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
      result.isValid = false;
      result.errors.push('Senha deve conter pelo menos um número');
    } else if (/\d/.test(password)) {
      result.score += 1;
    }

    // Caractere especial
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.isValid = false;
      result.errors.push('Senha deve conter pelo menos um caractere especial');
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.score += 1;
    }

    return result;
  }

  /**
   * Gera hash seguro da senha
   * @param {string} password - Senha a ser hasheada
   * @returns {string} - Hash da senha
   */
  static hashPassword(password) {
    return CryptoJS.SHA256(password + SECURITY_CONFIG.ENCRYPTION_KEY).toString();
  }

  /**
   * Verifica se o token está válido
   * @param {string} token - Token a ser verificado
   * @returns {boolean} - Se o token é válido
   */
  static isTokenValid(token) {
    try {
      if (!token) return false;
      
      // Decodifica o token (simulação - em produção usar JWT)
      const decoded = this.decryptData(token);
      const now = Date.now();
      
      return decoded.expiry > now;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gera token de sessão
   * @param {object} userData - Dados do usuário
   * @returns {string} - Token gerado
   */
  static generateSessionToken(userData) {
    const tokenData = {
      userId: userData.id,
      userType: userData.userType,
      issued: Date.now(),
      expiry: Date.now() + SECURITY_CONFIG.TOKEN_EXPIRY,
    };
    
    return this.encryptData(tokenData);
  }
}

/**
 * Classe para gerenciar conformidade com LGPD
 */
export class LGPDManager {
  /**
   * Tipos de dados pessoais conforme LGPD
   */
  static DATA_TYPES = {
    PERSONAL: 'personal', // Nome, email, telefone
    SENSITIVE: 'sensitive', // CPF, dados biométricos
    LOCATION: 'location', // Dados de geolocalização
    BEHAVIORAL: 'behavioral', // Histórico de uso
    FINANCIAL: 'financial', // Dados de pagamento
  };

  /**
   * Finalidades de tratamento de dados
   */
  static PURPOSES = {
    SERVICE_PROVISION: 'service_provision',
    COMMUNICATION: 'communication',
    SECURITY: 'security',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing',
  };

  /**
   * Registra consentimento do usuário
   * @param {string} userId - ID do usuário
   * @param {string} dataType - Tipo de dado
   * @param {string} purpose - Finalidade
   * @param {boolean} granted - Se o consentimento foi concedido
   */
  static async recordConsent(userId, dataType, purpose, granted) {
    try {
      const consentRecord = {
        userId,
        dataType,
        purpose,
        granted,
        timestamp: new Date().toISOString(),
        version: '1.0', // Versão da política de privacidade
      };

      // Armazena o registro de consentimento
      const existingConsents = await this.getConsentHistory(userId) || [];
      existingConsents.push(consentRecord);
      
      await SecurityManager.secureStore(
        `consent_${userId}`,
        existingConsents,
        true
      );

      // Log para auditoria
      console.log('Consentimento registrado:', consentRecord);
    } catch (error) {
      console.error('Erro ao registrar consentimento:', error);
    }
  }

  /**
   * Obtém histórico de consentimentos
   * @param {string} userId - ID do usuário
   * @returns {Array} - Histórico de consentimentos
   */
  static async getConsentHistory(userId) {
    try {
      return await SecurityManager.secureRetrieve(`consent_${userId}`, true);
    } catch (error) {
      console.error('Erro ao obter histórico de consentimentos:', error);
      return [];
    }
  }

  /**
   * Verifica se há consentimento válido
   * @param {string} userId - ID do usuário
   * @param {string} dataType - Tipo de dado
   * @param {string} purpose - Finalidade
   * @returns {boolean} - Se há consentimento válido
   */
  static async hasValidConsent(userId, dataType, purpose) {
    try {
      const consents = await this.getConsentHistory(userId);
      if (!consents) return false;

      // Busca o consentimento mais recente para o tipo e finalidade
      const relevantConsents = consents.filter(
        consent => consent.dataType === dataType && consent.purpose === purpose
      );

      if (relevantConsents.length === 0) return false;

      // Retorna o status do consentimento mais recente
      const latestConsent = relevantConsents[relevantConsents.length - 1];
      return latestConsent.granted;
    } catch (error) {
      console.error('Erro ao verificar consentimento:', error);
      return false;
    }
  }

  /**
   * Anonimiza dados pessoais
   * @param {object} data - Dados a serem anonimizados
   * @returns {object} - Dados anonimizados
   */
  static anonymizeData(data) {
    const anonymized = { ...data };
    
    // Remove ou substitui campos identificáveis
    if (anonymized.name) {
      anonymized.name = 'Usuário Anônimo';
    }
    if (anonymized.email) {
      anonymized.email = 'anonimo@exemplo.com';
    }
    if (anonymized.phone) {
      anonymized.phone = '(XX) XXXXX-XXXX';
    }
    if (anonymized.document) {
      anonymized.document = 'XXX.XXX.XXX-XX';
    }
    
    // Mantém apenas dados necessários para análises
    return {
      id: anonymized.id ? 'anon_' + CryptoJS.MD5(anonymized.id).toString() : null,
      userType: anonymized.userType,
      createdAt: anonymized.createdAt,
      // Outros campos não identificáveis
    };
  }

  /**
   * Exporta dados do usuário (direito de portabilidade)
   * @param {string} userId - ID do usuário
   * @returns {object} - Dados exportados
   */
  static async exportUserData(userId) {
    try {
      // Coleta todos os dados do usuário
      const userData = await SecurityManager.secureRetrieve(`user_${userId}`, true);
      const consentHistory = await this.getConsentHistory(userId);
      
      const exportData = {
        userData,
        consentHistory,
        exportDate: new Date().toISOString(),
        format: 'JSON',
      };

      return exportData;
    } catch (error) {
      console.error('Erro ao exportar dados do usuário:', error);
      throw new Error('Falha na exportação de dados');
    }
  }

  /**
   * Remove todos os dados do usuário (direito ao esquecimento)
   * @param {string} userId - ID do usuário
   */
  static async deleteUserData(userId) {
    try {
      // Lista de chaves relacionadas ao usuário
      const userKeys = [
        `user_${userId}`,
        `consent_${userId}`,
        `preferences_${userId}`,
        `location_${userId}`,
        `payment_${userId}`,
      ];

      // Remove todos os dados
      for (const key of userKeys) {
        await SecurityManager.secureRemove(key);
      }

      // Log para auditoria
      console.log(`Dados do usuário ${userId} removidos conforme LGPD`);
    } catch (error) {
      console.error('Erro ao remover dados do usuário:', error);
      throw new Error('Falha na remoção de dados');
    }
  }

  /**
   * Registra acesso a dados pessoais para auditoria
   * @param {string} userId - ID do usuário
   * @param {string} dataType - Tipo de dado acessado
   * @param {string} purpose - Finalidade do acesso
   * @param {string} accessor - Quem acessou
   */
  static async logDataAccess(userId, dataType, purpose, accessor) {
    try {
      const accessLog = {
        userId,
        dataType,
        purpose,
        accessor,
        timestamp: new Date().toISOString(),
        ip: 'mobile_app', // Em produção, capturar IP real
      };

      // Armazena log de acesso
      const existingLogs = await SecurityManager.secureRetrieve('access_logs', true) || [];
      existingLogs.push(accessLog);
      
      // Mantém apenas os últimos 1000 logs
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }
      
      await SecurityManager.secureStore('access_logs', existingLogs, true);
    } catch (error) {
      console.error('Erro ao registrar acesso a dados:', error);
    }
  }
}

/**
 * Utilitários para validação de entrada
 */
export class InputSanitizer {
  /**
   * Remove caracteres perigosos de entrada
   * @param {string} input - Entrada a ser sanitizada
   * @returns {string} - Entrada sanitizada
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/[<>]/g, '') // Remove < e >
      .trim();
  }

  /**
   * Valida formato de email
   * @param {string} email - Email a ser validado
   * @returns {boolean} - Se o email é válido
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida se a entrada contém apenas caracteres permitidos
   * @param {string} input - Entrada a ser validada
   * @param {string} allowedChars - Regex dos caracteres permitidos
   * @returns {boolean} - Se a entrada é válida
   */
  static isValidInput(input, allowedChars) {
    const regex = new RegExp(`^[${allowedChars}]+$`);
    return regex.test(input);
  }
}

// Exporta as classes e configurações
export { SECURITY_CONFIG };
export default {
  SecurityManager,
  LGPDManager,
  InputSanitizer,
  SECURITY_CONFIG,
};

