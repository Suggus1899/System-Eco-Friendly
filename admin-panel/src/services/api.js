import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  }
};

// Materials services
export const materialsService = {
  getAll: (params) => api.get('/materials', { params }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (data) => api.post('/materials', data),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`)
};

// Centers services
export const centersService = {
  getAll: (params) => api.get('/centers', { params }),
  getById: (id) => api.get(`/centers/${id}`),
  getNearby: (params) => api.get('/centers/nearby', { params }),
  create: (data) => api.post('/centers', data),
  update: (id, data) => api.put(`/centers/${id}`, data),
  delete: (id) => api.delete(`/centers/${id}`)
};

// Schedules services
export const schedulesService = {
  getAll: (params) => api.get('/schedules', { params }),
  getByZone: (zone) => api.get(`/schedules/zone/${zone}`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`)
};

// Challenges services
export const challengesService = {
  getAll: (params) => api.get('/challenges', { params }),
  getWeekly: () => api.get('/challenges/weekly'),
  getById: (id) => api.get(`/challenges/${id}`),
  create: (data) => api.post('/challenges', data),
  update: (id, data) => api.put(`/challenges/${id}`, data),
  delete: (id) => api.delete(`/challenges/${id}`),
  complete: (id) => api.post(`/challenges/${id}/complete`)
};

// Users services
export const usersService = {
  getProfile: () => api.get('/users/profile'),
  getProgress: () => api.get('/users/progress'),
  getBadges: () => api.get('/users/badges'),
  updateProfile: (data) => api.put('/users/profile', data)
};

export default api;
