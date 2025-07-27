import axios from 'axios';

// Configuration de base d'Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backend.katianlogistique.com/api';

console.log('🔗 API Base URL:', API_BASE_URL);

// Client API avec configuration de base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
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
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register/', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      throw error;
    }
  },

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

// Service pour récupérer les tarifs
// export const tariffAPI = {
//   // Récupérer tous les tarifs
//   getTariffs: async () => {
//     try {
//       const response = await apiClient.get('/client/tariff/');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur récupération tarifs:', error);
//       throw error;
//     }
//   },

//   // Calculer un tarif
//   calculateTariff: async (shipmentData) => {
//     try {
//       const response = await apiClient.post('/tariffs/calculate/', shipmentData);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur calcul tarif:', error);
//       throw error;
//     }
//   },

//   // Récupérer les zones géographiques
//   getZones: async () => {
//     try {
//       const response = await apiClient.get('/tariffs/zones/');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur récupération zones:', error);
//       throw error;
//     }
//   },
// };

// Services de gestion des tarifs
export const tariffAPI = {
  getTariffs: (params = {}) => apiClient.get('/client/tariffs/', { params }),

  calculateShipping: (shipmentData) =>
    apiClient.post('/tariffs/calculate/', shipmentData),
};

export default apiClient; 