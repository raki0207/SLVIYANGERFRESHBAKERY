/**
 * Custom React Hook for Product Management
 * Handles fetching products from API with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../services/api';

/**
 * Hook to fetch all products
 * @param {object} filters - Filter options (category, search, etc.)
 * @returns {object} - { products, loading, error, refetch }
 */
export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await productAPI.getAllProducts(filters);
      console.log('Products API response:', data); // Debug log
      
      // Handle different response formats
      let productsArray = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data && data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (data && Array.isArray(data)) {
        productsArray = data;
      }
      
      console.log('Extracted products:', productsArray.length); // Debug log
      setProducts(productsArray);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

/**
 * Hook to fetch a single product by ID
 * @param {string|number} productId - Product ID
 * @returns {object} - { product, loading, error, refetch }
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await productAPI.getProductById(productId);
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};

/**
 * Hook to fetch featured products (Just Arrived)
 * @returns {object} - { products, loading, error, refetch }
 */
export const useJustArrivedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await productAPI.getJustArrivedProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error('Error fetching just arrived products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

/**
 * Hook to fetch freshly baked products
 * @returns {object} - { products, loading, error, refetch }
 */
export const useJustBakedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await productAPI.getJustBakedProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error('Error fetching just baked products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

/**
 * Hook to search products
 * @param {string} query - Search query
 * @returns {object} - { products, loading, error, refetch }
 */
export const useProductSearch = (query) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProducts = useCallback(async () => {
    if (!query || query.trim().length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await productAPI.searchProducts(query);
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err.message || 'Failed to search products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [query, searchProducts]);

  return {
    products,
    loading,
    error,
    refetch: searchProducts,
  };
};

