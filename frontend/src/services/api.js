import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    // If admin endpoint, check for adminToken first, fallback to user token
    const token = localStorage.getItem('veloop_token');
    const adminToken = localStorage.getItem('veloop_admin_token');

    if (config.url?.includes('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 auth expiry
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear expired token if unauthorized
      if (originalRequest.url?.includes('/admin')) {
        localStorage.removeItem('veloop_admin_token');
        localStorage.removeItem('veloop_admin_user');
      } else {
        localStorage.removeItem('veloop_token');
        localStorage.removeItem('veloop_user');
      }
    }
    return Promise.reject(error.response?.data || { message: error.message || 'Network connection failed' });
  }
);

export const api = {
  // Auth APIs
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    getMe: () => apiClient.get('/auth/me'),
  },

  // User Profile APIs (Section 23)
  profile: {
    getMe: () => apiClient.get('/profile/me'),
    updateMe: (data) => apiClient.patch('/profile/me', data),
    getRewards: () => apiClient.get('/profile/rewards'),
    getLevelProgress: () => apiClient.get('/profile/level-progress'),
    getAchievements: () => apiClient.get('/profile/achievements'),
    getWithdrawalSummary: () => apiClient.get('/profile/withdrawal-summary'),
    getReferrals: () => apiClient.get('/profile/referrals'),
    getActivity: (limit = 15) => apiClient.get(`/profile/activity?limit=${limit}`),
  },

  // User Actions
  actions: {
    claimDailyBonus: () => apiClient.post('/actions/daily-bonus'),
    watchAd: () => apiClient.post('/actions/watch-ad'),
    convertSves: (svesAmount) => apiClient.post('/actions/convert-sves', { svesAmount }),
    submitWithdrawal: (data) => apiClient.post('/actions/withdraw', data),
  },

  // Admin APIs
  admin: {
    login: (credentials) => apiClient.post('/admin/login', credentials),
    getDashboard: () => apiClient.get('/admin/dashboard'),
    getUsers: (params) => apiClient.get('/admin/users', { params }),
    getUserDetails: (id) => apiClient.get(`/admin/users/${id}`),
    updateUserStatus: (id, data) => apiClient.patch(`/admin/users/${id}/status`, data),
    adjustBalance: (id, data) => apiClient.post(`/admin/users/${id}/adjust-balance`, data),
    getWithdrawals: (params) => apiClient.get('/admin/withdrawals', { params }),
    updateWithdrawalStatus: (id, data) => apiClient.patch(`/admin/withdrawals/${id}/status`, data),
    getLevels: () => apiClient.get('/admin/levels'),
    saveLevel: (data) => apiClient.post('/admin/levels', data),
    getAchievements: () => apiClient.get('/admin/achievements'),
    getAuditLogs: (params) => apiClient.get('/admin/audit-logs', { params }),
  },
};

export default api;
