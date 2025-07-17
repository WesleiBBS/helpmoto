import * as SecureStore from 'expo-secure-store';

// Configuração base da API
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.helpmoto.com.br/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAuthHeaders() {
    const token = await SecureStore.getItemAsync('userToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    
    const config = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Verifica se a resposta é JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Métodos HTTP
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Métodos específicos para autenticação
  async login(email, password, userType) {
    return this.post('/auth/login', { email, password, userType });
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async refreshToken() {
    return this.post('/auth/refresh');
  }

  // Métodos para usuários
  async getUserProfile() {
    return this.get('/user/profile');
  }

  async updateUserProfile(userData) {
    return this.put('/user/profile', userData);
  }

  async deleteUserAccount() {
    return this.delete('/user/account');
  }

  // Métodos para serviços
  async requestService(serviceData) {
    return this.post('/services/request', serviceData);
  }

  async getServiceHistory() {
    return this.get('/services/history');
  }

  async getServiceById(serviceId) {
    return this.get(`/services/${serviceId}`);
  }

  async cancelService(serviceId) {
    return this.put(`/services/${serviceId}/cancel`);
  }

  // Métodos para prestadores
  async getAvailableServices() {
    return this.get('/provider/services/available');
  }

  async acceptService(serviceId) {
    return this.put(`/provider/services/${serviceId}/accept`);
  }

  async updateServiceStatus(serviceId, status) {
    return this.put(`/provider/services/${serviceId}/status`, { status });
  }

  async updateProviderLocation(location) {
    return this.put('/provider/location', location);
  }

  // Métodos para pagamentos
  async processPayment(paymentData) {
    return this.post('/payments/process', paymentData);
  }

  async getPaymentMethods() {
    return this.get('/payments/methods');
  }

  async addPaymentMethod(methodData) {
    return this.post('/payments/methods', methodData);
  }

  // Métodos para geolocalização
  async getNearbyProviders(location) {
    return this.post('/location/nearby-providers', location);
  }

  async calculateServicePrice(origin, destination) {
    return this.post('/location/calculate-price', { origin, destination });
  }
}

export default new ApiService();

