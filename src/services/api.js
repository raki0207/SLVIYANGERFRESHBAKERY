/**
 * API Service for Backend Communication
 * Handles all API calls to the backend server
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint (e.g., '/products')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} - Response data or error
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authentication token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }
      return text;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Product API Methods
 */
export const productAPI = {
  /**
   * Get all products
   * @param {object} params - Query parameters (category, search, page, limit)
   * @returns {Promise<Array>} - Array of products
   */
  getAllProducts: async (params = {}) => {
    // Filter out undefined/null values from params
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  /**
   * Get a single product by ID
   * @param {string|number} productId - Product ID
   * @returns {Promise<object>} - Product object
   */
  getProductById: async (productId) => {
    return apiRequest(`/products/${productId}`);
  },

  /**
   * Get products by category
   * @param {string} category - Product category
   * @returns {Promise<Array>} - Array of products in category
   */
  getProductsByCategory: async (category) => {
    return apiRequest(`/products?category=${encodeURIComponent(category)}`);
  },

  /**
   * Get featured products (Just Arrived)
   * @returns {Promise<Array>} - Array of featured products
   */
  getJustArrivedProducts: async () => {
    return apiRequest('/products?featured=true&type=just-arrived');
  },

  /**
   * Get freshly baked products
   * @returns {Promise<Array>} - Array of freshly baked products
   */
  getJustBakedProducts: async () => {
    return apiRequest('/products?featured=true&type=just-baked');
  },

  /**
   * Search products
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of matching products
   */
  searchProducts: async (query) => {
    return apiRequest(`/products/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Create a new product
   * @param {object} productData - Product data
   * @returns {Promise<object>} - Created product
   */
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  /**
   * Update an existing product
   * @param {string|number} productId - Product ID
   * @param {object} productData - Updated product data
   * @returns {Promise<object>} - Updated product
   */
  updateProduct: async (productId, productData) => {
    return apiRequest(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  /**
   * Delete a product
   * @param {string|number} productId - Product ID
   * @returns {Promise<object>} - Deletion confirmation
   */
  deleteProduct: async (productId) => {
    return apiRequest(`/products/${productId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Order API Methods (if needed)
 */
export const orderAPI = {
  createOrder: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getOrders: async (userId) => {
    return apiRequest(`/orders?userId=${userId}`);
  },

  getOrderById: async (orderId) => {
    return apiRequest(`/orders/${orderId}`);
  },
};

/**
 * User API Methods (if needed)
 */
export const userAPI = {
  getUserProfile: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  updateUserProfile: async (userId, profileData) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

export default {
  productAPI,
  orderAPI,
  userAPI,
};

