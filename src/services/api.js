// src/services/api.js
// Complete API service with automatic token handling

const API_URL = process.env.REACT_APP_API_URL || 'https://alug-backend.onrender.com/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add Authorization header if token exists
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
  // Login - STORES TOKEN automatically
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
    
    // CRITICAL: Store token and user in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  // Register - STORES TOKEN automatically
  register: async (email, password, name) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    const data = await response.json();
    
    // CRITICAL: Store token and user in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Check if user is logged in
  isAuthenticated: () => {
    return !!getToken();
  },
};

// Products API
export const products = {
  // Get all products (no auth required)
  getAll: async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },
  
  // Get single product
  getById: async (id) => {
    return fetchWithAuth(`/products/${id}`);
  },
  
  // Create product (ADMIN ONLY - with token)
  create: async (productData) => {
    return fetchWithAuth('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },
  
  // Update product
  update: async (id, productData) => {
    return fetchWithAuth(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },
  
  // Delete product
  delete: async (id) => {
    return fetchWithAuth(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Affiliate Links API
export const affiliate = {
  // Get all user's affiliate links
  getMyLinks: async () => {
    return fetchWithAuth('/affiliate-links');
  },
  
  // Generate affiliate link
  generateLink: async (productId) => {
    return fetchWithAuth('/affiliate-links', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },
};

// Analytics API
export const analytics = {
  // Get user stats
  getMyStats: async () => {
    return fetchWithAuth('/stats');
  },
  
  // Get daily stats
  getDailyStats: async () => {
    return fetchWithAuth('/stats/daily');
  },
  
  // Get product stats
  getProductStats: async () => {
    return fetchWithAuth('/stats/products');
  },
};

// Leaderboard API
export const leaderboard = {
  // Get top marketers
  getTopMarketers: async () => {
    return fetchWithAuth('/stats/leaderboard');
  },
  
  // Get top products
  getTopProducts: async () => {
    return fetchWithAuth('/stats/top-products');
  },
};

// Admin API
export const admin = {
  // Get all users
  getAllUsers: async () => {
    return fetchWithAuth('/admin/users');
  },
  
  // Get all conversions
  getAllConversions: async () => {
    return fetchWithAuth('/admin/conversions');
  },
  
  // Get all stats
  getStats: async () => {
    return fetchWithAuth('/admin/stats');
  },
  
  // Get all payouts
  getPayouts: async () => {
    return fetchWithAuth('/admin/payouts');
  },
  
  // Update user
  updateUser: async (userId, userData) => {
    return fetchWithAuth(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Payouts API
export const payouts = {
  // Request payout
  request: async (amount) => {
    return fetchWithAuth('/payouts', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },
  
  // Get user payouts
  getAll: async () => {
    return fetchWithAuth('/payouts');
  },
};

// Default export with all API modules
export default {
  auth,
  products,
  affiliate,
  analytics,
  leaderboard,
  admin,
  payouts,
};