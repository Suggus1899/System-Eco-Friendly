import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use environment variable or fallback to localhost for development
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - maybe redirect to login
      console.warn('Unauthorized access - token may have expired');
    }
    return Promise.reject(error);
  }
);

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get cached data
const getCachedData = async (key) => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      const now = Date.now();
      if (now - parsed.timestamp < CACHE_DURATION) {
        return parsed.data;
      }
    }
    return null;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
};

// Helper function to set cached data
const setCachedData = async (key, data) => {
  try {
    const cacheObj = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheObj));
  } catch (error) {
    console.error('Cache storage error:', error);
  }
};

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
  },
  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Materials services with caching
export const materialsService = {
  getAll: async (params) => {
    const cacheKey = `materials_${JSON.stringify(params || {})}`;
    const cached = await getCachedData(cacheKey);
    
    if (cached) {
      return { data: cached };
    }
    
    try {
      const response = await api.get('/materials', { params });
      await setCachedData(cacheKey, response.data);
      return response;
    } catch (error) {
      // Return cached data if available when network fails
      if (cached) {
        return { data: cached };
      }
      throw error;
    }
  },
  getById: (id) => api.get(`/materials/${id}`),
  search: (query) => api.get('/materials', { params: { search: query } })
};

// Centers services with caching
export const centersService = {
  getAll: async (params) => {
    const cacheKey = `centers_${JSON.stringify(params || {})}`;
    const cached = await getCachedData(cacheKey);
    
    if (cached) {
      return { data: cached };
    }
    
    try {
      const response = await api.get('/centers', { params });
      await setCachedData(cacheKey, response.data);
      return response;
    } catch (error) {
      // Return cached data if available when network fails
      if (cached) {
        return { data: cached };
      }
      throw error;
    }
  },
  getById: (id) => api.get(`/centers/${id}`),
  getNearby: (latitude, longitude, radius) =>
    api.get('/centers/nearby', { params: { latitude, longitude, radius } })
};

// Schedules services with caching
export const schedulesService = {
  getAll: async (params) => {
    const cacheKey = `schedules_${JSON.stringify(params || {})}`;
    const cached = await getCachedData(cacheKey);
    
    if (cached) {
      return { data: cached };
    }
    
    try {
      const response = await api.get('/schedules', { params });
      await setCachedData(cacheKey, response.data);
      return response;
    } catch (error) {
      // Return cached data if available when network fails
      if (cached) {
        return { data: cached };
      }
      throw error;
    }
  },
  getByZone: (zone) => api.get(`/schedules/zone/${zone}`)
};

// Challenges services with caching
export const challengesService = {
  getWeekly: async () => {
    const cached = await getCachedData('weekly_challenges');
    
    if (cached) {
      return { data: cached };
    }
    
    try {
      const response = await api.get('/challenges/weekly');
      await setCachedData('weekly_challenges', response.data);
      return response;
    } catch (error) {
      // Return cached data if available when network fails
      if (cached) {
        return { data: cached };
      }
      throw error;
    }
  },
  complete: (id) => api.post(`/challenges/${id}/complete`)
};

// Users services with caching
export const usersService = {
  getProfile: async () => {
    const cached = await getCachedData('user_profile');
    
    if (cached) {
      return { data: cached };
    }
    
    try {
      const response = await api.get('/users/profile');
      await setCachedData('user_profile', response.data);
      return response;
    } catch (error) {
      // Return cached data if available when network fails
      if (cached) {
        return { data: cached };
      }
      throw error;
    }
  },
  getProgress: async () => {
    const cached = await getCachedData('user_progress');
    
    if (cached) {
      return { data: cached };
    }
    
    try {
      const response = await api.get('/users/progress');
      await setCachedData('user_progress', response.data);
      return response;
    } catch (error) {
      // Return cached data if available when network fails
      if (cached) {
        return { data: cached };
      }
      throw error;
    }
  },
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
