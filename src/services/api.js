// ============================================
// API SERVICE - Frontend Integration
// ============================================

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function für API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  register: async (name, email, password) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
};

// ============================================
// PRODUCTS API
// ============================================
export const productsAPI = {
  getAll: async () => {
    return await apiCall('/products');
  },

  getById: async (id) => {
    return await apiCall(`/products/${id}`);
  },

  create: async (productData) => {
    return await apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id, productData) => {
    return await apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// AFFILIATE API
// ============================================
export const affiliateAPI = {
  generateLink: async (productId) => {
    return await apiCall('/affiliate/generate', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  getMyLinks: async () => {
    return await apiCall('/affiliate/my-links');
  },

  trackClick: async (linkCode) => {
    return await apiCall('/track/click', {
      method: 'POST',
      body: JSON.stringify({ linkCode }),
    });
  },

  trackConversion: async (linkCode, amount) => {
    return await apiCall('/track/conversion', {
      method: 'POST',
      body: JSON.stringify({ linkCode, amount }),
    });
  },
};

// ============================================
// ANALYTICS API
// ============================================
export const analyticsAPI = {
  getMyStats: async () => {
    return await apiCall('/analytics/my-stats');
  },

  getLinkStats: async (linkId) => {
    return await apiCall(`/analytics/link/${linkId}`);
  },

  getDailyStats: async () => {
    return await apiCall('/analytics/daily-stats');
  },

  getProductStats: async () => {
    return await apiCall('/analytics/product-stats');
  },
};

// ============================================
// LEADERBOARD API
// ============================================
export const leaderboardAPI = {
  getTopProducts: async () => {
    return await apiCall('/leaderboard/products');
  },

  getTopMarketers: async () => {
    return await apiCall('/leaderboard/marketers');
  },
};

// ============================================
// ADMIN API
// ============================================
export const adminAPI = {
  getAllUsers: async () => {
    return await apiCall('/admin/users');
  },

  getAllConversions: async () => {
    return await apiCall('/admin/conversions');
  },
};

// ============================================
// EXPORT ALL
// ============================================
const api = {
  auth: authAPI,
  products: productsAPI,
  affiliate: affiliateAPI,
  analytics: analyticsAPI,
  leaderboard: leaderboardAPI,
  admin: adminAPI,
};

export default api;