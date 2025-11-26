# Backend API Integration Guide

This guide explains how to integrate your React frontend with a backend API to fetch and manage products.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Backend API Requirements](#backend-api-requirements)
3. [Frontend Setup](#frontend-setup)
4. [Implementation Steps](#implementation-steps)
5. [API Endpoints Structure](#api-endpoints-structure)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Currently, products are hardcoded in the frontend. To fetch products from a backend API, you need to:

1. Set up your backend API server
2. Configure API endpoints
3. Update frontend to use API service
4. Handle loading and error states

---

## 🔧 Backend API Requirements

### Required Endpoints

Your backend API should provide the following endpoints:

#### 1. Get All Products
```
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search query
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Signature Chocolate Truffle Cake",
      "category": "Cakes",
      "originalPrice": 1800,
      "price": 1500,
      "discount": 17,
      "rating": 4.9,
      "reviews": 365,
      "image": "/images/product1.jpg",
      "shortDescription": "Decadent chocolate sponge...",
      "fullDescription": "Full description...",
      "features": ["Feature 1", "Feature 2"],
      "specifications": {
        "Weight": "1.5 kg",
        "Serves": "12-14 slices"
      },
      "arrivalDate": "2025-11-24",
      "isFresh": true,
      "freshnessTag": "Baked Today"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

#### 2. Get Single Product
```
GET /api/products/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "Product Name",
  // ... same structure as above
}
```

#### 3. Get Featured Products (Just Arrived)
```
GET /api/products?featured=true&type=just-arrived
```

#### 4. Get Freshly Baked Products
```
GET /api/products?featured=true&type=just-baked
```

#### 5. Search Products
```
GET /api/products/search?q=chocolate
```

---

## 🚀 Frontend Setup

### Step 1: Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your API URL:
```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
# Or for production:
# REACT_APP_API_BASE_URL=https://your-api-domain.com/api
```

3. **Important:** Restart your React development server after changing `.env`:
```bash
npm start
```

### Step 2: API Service Layer

The API service is already created in `src/services/api.js`. It includes:
- Generic API request handler
- Product API methods
- Error handling
- Authentication token support

### Step 3: Custom Hooks

Custom hooks are available in `src/hooks/useProducts.js`:
- `useProducts()` - Fetch all products
- `useProduct(id)` - Fetch single product
- `useJustArrivedProducts()` - Fetch just arrived products
- `useJustBakedProducts()` - Fetch freshly baked products
- `useProductSearch(query)` - Search products

---

## 📝 Implementation Steps

### Option 1: Using Custom Hooks (Recommended)

#### Update `src/pages/index.js`:

```javascript
import { useJustArrivedProducts, useJustBakedProducts } from '../hooks/useProducts';

const Home = () => {
  // Replace hardcoded catalogues with API calls
  const { 
    products: justArrivedProducts, 
    loading: justArrivedLoading, 
    error: justArrivedError 
  } = useJustArrivedProducts();
  
  const { 
    products: justBakedProducts, 
    loading: justBakedLoading, 
    error: justBakedError 
  } = useJustBakedProducts();

  // Remove or comment out hardcoded catalogues:
  // const justArrivedCatalogue = useMemo(() => ([...]), []);
  // const justBakedCatalogue = useMemo(() => ([...]), []);

  // Add loading states
  if (justArrivedLoading || justBakedLoading) {
    return <div>Loading products...</div>;
  }

  // Add error handling
  if (justArrivedError || justBakedError) {
    return <div>Error loading products: {justArrivedError || justBakedError}</div>;
  }

  // Rest of your component...
};
```

#### Update `src/pages/Products.js`:

```javascript
import { useProducts } from '../hooks/useProducts';

const Products = () => {
  const [categoryFilter, setCategoryFilter] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');

  // Replace hardcoded products import
  // import { products } from '../utils/productsData';
  
  // Use API hook instead
  const { products, loading, error } = useProducts({
    category: categoryFilter !== 'All Products' ? categoryFilter : undefined,
    search: searchQuery || undefined,
  });

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Use products from API
  const filteredProducts = products; // Already filtered by API
};
```

### Option 2: Direct API Calls

If you prefer direct API calls without hooks:

```javascript
import { productAPI } from '../services/api';
import { useState, useEffect } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getAllProducts();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Use products...
};
```

---

## 🔌 API Endpoints Structure

### Expected Backend Response Formats

#### Success Response:
```json
{
  "products": [...],
  "total": 50,
  "page": 1
}
```

OR simple array:
```json
[...]
```

#### Error Response:
```json
{
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

---

## ⚠️ Error Handling

The API service includes error handling, but you should also:

1. **Handle Network Errors:**
```javascript
try {
  const products = await productAPI.getAllProducts();
} catch (error) {
  if (error.message.includes('Failed to fetch')) {
    // Network error
    console.error('Network error - check API server');
  } else {
    // API error
    console.error('API error:', error.message);
  }
}
```

2. **Fallback to Local Data:**
```javascript
const { products, loading, error } = useJustArrivedProducts();

// Fallback to hardcoded data if API fails
const displayProducts = error ? fallbackProducts : products;
```

3. **Retry Logic:**
```javascript
const fetchWithRetry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

---

## 🧪 Testing

### 1. Test API Connection

Create a test file `src/services/api.test.js`:

```javascript
import { productAPI } from './api';

// Test API connection
const testAPI = async () => {
  try {
    const products = await productAPI.getAllProducts();
    console.log('✅ API Connection Successful');
    console.log('Products:', products);
  } catch (error) {
    console.error('❌ API Connection Failed:', error);
  }
};

testAPI();
```

### 2. Test in Browser Console

Open browser console and run:
```javascript
import { productAPI } from './services/api';
productAPI.getAllProducts().then(console.log).catch(console.error);
```

### 3. Check Network Tab

- Open DevTools → Network tab
- Look for API requests
- Check status codes (200 = success, 404 = not found, 500 = server error)

---

## 🔍 Troubleshooting

### Issue: CORS Error
**Solution:** Configure your backend to allow CORS:
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: API URL Not Working
**Solution:** 
1. Check `.env` file exists and has correct URL
2. Restart React dev server after changing `.env`
3. Verify API server is running
4. Check API URL in browser Network tab

### Issue: Products Not Loading
**Solution:**
1. Check browser console for errors
2. Verify API response format matches expected structure
3. Check if API requires authentication
4. Verify network connectivity

### Issue: Environment Variables Not Working
**Solution:**
1. Ensure variables start with `REACT_APP_`
2. Restart dev server after changes
3. Check `.env` file is in project root
4. Clear browser cache

---

## 📦 Backend Example (Node.js/Express)

Here's a simple backend example:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock products data
const products = [
  {
    id: 1,
    name: "Signature Chocolate Truffle Cake",
    category: "Cakes",
    price: 1500,
    // ... other fields
  }
];

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search, featured, type } = req.query;
  
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (featured === 'true' && type === 'just-arrived') {
    filteredProducts = filteredProducts.filter(p => p.isFresh);
  }
  
  res.json(filteredProducts);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
```

---

## ✅ Checklist

- [ ] Backend API server is running
- [ ] API endpoints are implemented
- [ ] CORS is configured on backend
- [ ] `.env` file is created with correct API URL
- [ ] React dev server restarted after `.env` changes
- [ ] Components updated to use API hooks
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Tested API connection
- [ ] Verified products are loading correctly

---

## 📚 Additional Resources

- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for API requests
3. Verify backend API is accessible
4. Review error messages carefully
5. Test API endpoints directly (using Postman or curl)

Good luck with your integration! 🚀

