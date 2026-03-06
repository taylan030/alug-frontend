// src/services/api.js
// Complete API service with automatic token handling

const API_URL = process.env.REACT_APP_API_URL || 'https://alug-backend.onrender.com/api';

const getToken = () => {
  return localStorage.getItem('token');
};

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Request failed');
  }
  
  return response.json();
};

// Auth API
export const auth = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: () => {
    return !!getToken();
  },
};

// Products API
export const products = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },
  
  getById: async (id) => {
    return fetchWithAuth(`/products/${id}`);
  },
  
  create: async (productData) => {
    return fetchWithAuth('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },
  
  update: async (id, productData) => {
    return fetchWithAuth(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },
  
  delete: async (id) => {
    return fetchWithAuth(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Affiliate Links API
export const affiliate = {
  // GET  → /api/affiliate/my-links
  getMyLinks: async () => {
    return fetchWithAuth('/affiliate/my-links');
  },
  
  // POST → /api/affiliate/generate  (backend expects: productId)
  generateLink: async (productId) => {
    return fetchWithAuth('/affiliate/generate', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
};

// Analytics API
export const analytics = {
  // GET → /api/analytics/my-stats
  getMyStats: async () => {
    return fetchWithAuth('/analytics/my-stats');
  },
  
  // GET → /api/analytics/daily-stats
  getDailyStats: async () => {
    return fetchWithAuth('/analytics/daily-stats');
  },
  
  // GET → /api/analytics/product-stats
  getProductStats: async () => {
    return fetchWithAuth('/analytics/product-stats');
  },
};

// Leaderboard API
export const leaderboard = {
  // GET → /api/leaderboard/marketers
  getTopMarketers: async () => {
    const response = await fetch(`${API_URL}/leaderboard/marketers`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },
  
  // GET → /api/leaderboard/products
  getTopProducts: async () => {
    const response = await fetch(`${API_URL}/leaderboard/products`);
    if (!response.ok) throw new Error('Failed to fetch top products');
    return response.json();
  },
};

// Admin API
export const admin = {
  getAllUsers: async () => {
    return fetchWithAuth('/admin/users');
  },
  
  getAllConversions: async () => {
    return fetchWithAuth('/admin/conversions');
  },
  
  getStats: async () => {
    return fetchWithAuth('/admin/stats');
  },
  
  getPayouts: async () => {
    return fetchWithAuth('/admin/payouts');
  },
  
  updateUser: async (userId, userData) => {
    return fetchWithAuth(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Payouts API
export const payouts = {
  request: async (amount) => {
    return fetchWithAuth('/payouts/request', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },
  
  getAll: async () => {
    return fetchWithAuth('/payouts/my-payouts');
  },
};

export default {
  auth,
  products,
  affiliate,
  analytics,
  leaderboard,
  admin,
  payouts,
};