import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use environment variable or fallback to localhost for development
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Materials services
export const materialsService = {
  getAll: (params) => api.get('/materials', { params }),
  getById: (id) => api.get(`/materials/${id}`),
  search: (query) => api.get('/materials', { params: { search: query } })
};

// Centers services
export const centersService = {
  getAll: (params) => api.get('/centers', { params }),
  getById: (id) => api.get(`/centers/${id}`),
  getNearby: (latitude, longitude, radius) => 
    api.get('/centers/nearby', { params: { latitude, longitude, radius } })
};

// Schedules services
export const schedulesService = {
  getAll: (params) => api.get('/schedules', { params }),
  getByZone: (zone) => api.get(`/schedules/zone/${zone}`)
};

// Challenges services
export const challengesService = {
  getWeekly: () => api.get('/challenges/weekly'),
  complete: (id) => api.post(`/challenges/${id}/complete`)
};

// Users services
export const usersService = {
  getProfile: () => api.get('/users/profile'),
  getProgress: () => api.get('/users/progress'),
  getBadges: () => api.get('/users/badges'),
  updateProfile: (data) => api.put('/users/profile', data)
};

// Offline storage helpers
export const offlineStorage = {
  saveMaterials: async (materials) => {
    await AsyncStorage.setItem('offline_materials', JSON.stringify(materials));
  },
  getMaterials: async () => {
    const materials = await AsyncStorage.getItem('offline_materials');
    return materials ? JSON.parse(materials) : [];
  },
  saveCenters: async (centers) => {
    await AsyncStorage.setItem('offline_centers', JSON.stringify(centers));
  },
  getCenters: async () => {
    const centers = await AsyncStorage.getItem('offline_centers');
    return centers ? JSON.parse(centers) : [];
  }
};

export default api;
