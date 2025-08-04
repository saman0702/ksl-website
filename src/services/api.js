import axios from 'axios';

// Configuration de base d'Axios
const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://backend.katianlogistique.com/api';
  // console.log('🔗 API Base URL:', API_BASE_URL);

// Client API avec configuration de base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: process.env.NODE_ENV === 'production',
});




// Intercepteur pour ajouter le token automatiquement
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ksl_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les réponses et erreurs
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers login
      localStorage.removeItem('ksl_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authAPI = {
  // Connexion
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login/', {
        email,
        password,
      });
      
      if (response.data.access) {
        localStorage.setItem('ksl_token', response.data.access);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur login:', error);
      throw error;
    }
  },

  // Inscription
  // register: async (userData) => {
  //   try {
  //     const response = await apiClient.post('/auth/register/', userData);
  //     return response.data;
  //   } catch (error) {
  //     console.error('❌ Erreur inscription:', error);
  //     throw error;
  //   }
  // },
  register: (userData) => apiClient.post('/auth/register/', userData),

  // Déconnexion
  logout: async () => {
    try {
      await apiClient.post('/auth/logout/');
      localStorage.removeItem('ksl_token');
    } catch (error) {
      console.error('❌ Erreur logout:', error);
      localStorage.removeItem('ksl_token');
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('ksl_token');
  },
};


export const tariffAPI = {
  getTariffs: (params = {}) => apiClient.get('/client/tariffs/', { params }),

  calculateShipping: (shipmentData) =>
    apiClient.post('/tariffs/calculate/', shipmentData),
};


export const userAPI = {
  getUsers: (params = {}) => apiClient.get('/users/', { params }),

  getUser: (id) => apiClient.get(`/users/${id}/`),

  createUser: (userData) => apiClient.post('/users/', userData),
  
  createPersonnel: (personnelData) => apiClient.post('/personnel/', personnelData),

  getPersonnel: (params = {}) => apiClient.get('/personnel/', { params }),

  updatePersonnel: (id, personnelData) => apiClient.patch(`/personnel/${id}/`, personnelData),

  updateUser: (id, userData) => apiClient.patch(`/users/${id}/`, userData),

  deleteUser: (id) => apiClient.delete(`/users/${id}/`),

  suspendUser: (id) => apiClient.patch(`/users/${id}`),

  activateUser: (id) => apiClient.post(`/users/${id}/activate/`),

  resetUserPassword: (id) => apiClient.post(`/users/${id}/reset-password/`),

};


// Services de gestion des expéditions
export const expeditionAPI = {
  createExpedition: async (expeditionData) => {
    console.log('📦 [expeditionAPI.createExpedition] → Création expédition:', expeditionData);
    try {
      const response = await apiClient.post('/client/expedition/', expeditionData);
      console.log('✅ Expédition créée:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur création expédition:', error);
      throw error;
    }
  },
 
  trackExpedition: async (expedition_number, updateData) => {
    console.log(`📦 [expeditionAPI.getExpedition] → ID: ${expedition_number}`);
    try {
      const response = await apiClient.get(`/client/expedition/${expedition_number}/`);
      // console.log('✅ Expédition récupérée:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur récupération expédition:', error);
      throw error;
    }
  },

};


// Services de gestion des point realis
export const relayAPI = {
  getAllRelays: async (params = {}) => {
    console.log('🚛 [carrierAPI.getAllCarriers] → Paramètres:', params);
    try {
      const response = await apiClient.get('/client/pointrelais/', { params });
      console.log('✅ Transporteurs récupérés:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur récupération transporteurs:', error);
      throw error;
    }
  },
};

// Services de gestion des transporteurs
export const carrierAPI = {
  getAllCarriers: async (params = {}) => {
    console.log('🚛 [carrierAPI.getAllCarriers] → Paramètres:', params);
    try {
      const response = await apiClient.get('/transporteurs/', { params });
      console.log('✅ Transporteurs récupérés:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur récupération transporteurs:', error);
      throw error;
    }
  },
 
};


export default apiClient; 