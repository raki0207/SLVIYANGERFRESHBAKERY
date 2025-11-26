import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cakes',
    originalPrice: '',
    price: '',
    discount: 0,
    rating: 0,
    reviews: 0,
    image: '',
    shortDescription: '',
    fullDescription: '',
    features: [],
    specifications: {},
    featured: false,
    productType: 'regular',
    inStock: true,
    freshnessTag: '',
    isFresh: false
  });
  const [featureInput, setFeatureInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.getAllProducts({ limit: 1000 });
      const productsArray = Array.isArray(data) ? data : (data.products || []);
      setProducts(productsArray);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.shortDescription?.toLowerCase().includes(query)
    );
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  // Add feature
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  // Remove feature
  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Add specification
  const handleAddSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  // Remove specification
  const handleRemoveSpec = (key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  // Open edit modal
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'Cakes',
      originalPrice: product.originalPrice || '',
      price: product.price || '',
      discount: product.discount || 0,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      image: product.image || '',
      shortDescription: product.shortDescription || '',
      fullDescription: product.fullDescription || '',
      features: Array.isArray(product.features) ? [...product.features] : [],
      specifications: product.specifications && typeof product.specifications === 'object' 
        ? { ...product.specifications } 
        : {},
      featured: product.featured || false,
      productType: product.productType || 'regular',
      inStock: product.inStock !== undefined ? product.inStock : true,
      freshnessTag: product.freshnessTag || '',
      isFresh: product.isFresh || false
    });
    setShowEditModal(true);
  };

  // Open create modal
  const handleCreate = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      category: 'Cakes',
      originalPrice: '',
      price: '',
      discount: 0,
      rating: 0,
      reviews: 0,
      image: '',
      shortDescription: '',
      fullDescription: '',
      features: [],
      specifications: {},
      featured: false,
      productType: 'regular',
      inStock: true,
      freshnessTag: '',
      isFresh: false
    });
    setShowCreateModal(true);
  };

  // Save product (create or update)
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.category || !formData.price || !formData.image) {
        setError('Please fill in all required fields (Name, Category, Price, Image)');
        setSaving(false);
        return;
      }

      const productData = {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0
      };

      if (selectedProduct) {
        // Update existing product
        await productAPI.updateProduct(selectedProduct.id, productData);
      } else {
        // Create new product
        await productAPI.createProduct(productData);
      }

      // Refresh products list
      await fetchProducts();
      
      // Close modals
      setShowEditModal(false);
      setShowCreateModal(false);
      setSelectedProduct(null);
      setError(null);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedProduct) return;

    setSaving(true);
    setError(null);

    try {
      await productAPI.deleteProduct(selectedProduct.id);
      await fetchProducts();
      setShowDeleteModal(false);
      setSelectedProduct(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
    } finally {
      setSaving(false);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const categories = ['Cakes', 'Pastries', 'Bread', 'Dessert', 'Cookies', 'Toast', 'Sandwich', 'Biscuits', 'Namkeens', 'Softdrinks', 'Extra More'];
  const productTypes = ['regular', 'just-arrived', 'just-baked'];

  return (
    <div className="product-management">
      <div className="pm-container">
        <div className="pm-header">
          <h1>Product Management</h1>
          <p>Manage your bakery products - Add, Edit, and Delete products</p>
        </div>

        <div className="pm-toolbar">
          <div className="pm-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="pm-btn pm-btn-primary" onClick={handleCreate}>
            <FaPlus /> Add New Product
          </button>
        </div>

        {error && !saving && (
          <div className="pm-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="pm-loading">
            <FaSpinner className="spinner" />
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="pm-table-container">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="pm-empty">
                      {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="pm-product-image"
                          onError={(e) => {
                            e.target.src = `${process.env.PUBLIC_URL}/bakery-icon-logo.png`;
                          }}
                        />
                      </td>
                      <td className="pm-name">{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>
                        <span className={`pm-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <span className={`pm-featured ${product.featured ? 'yes' : 'no'}`}>
                          {product.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div className="pm-actions">
                          <button
                            className="pm-action-btn pm-edit"
                            onClick={() => handleEdit(product)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="pm-action-btn pm-delete"
                            onClick={() => handleDeleteClick(product)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit/Create Modal */}
        {(showEditModal || showCreateModal) && (
          <div className="pm-modal-overlay" onClick={() => {
            if (!saving) {
              setShowEditModal(false);
              setShowCreateModal(false);
            }
          }}>
            <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="pm-modal-header">
                <h2>{selectedProduct ? 'Edit Product' : 'Create New Product'}</h2>
                <button
                  className="pm-modal-close"
                  onClick={() => {
                    if (!saving) {
                      setShowEditModal(false);
                      setShowCreateModal(false);
                    }
                  }}
                  disabled={saving}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="pm-modal-body">
                <div className="pm-form-grid">
                  <div className="pm-form-group pm-full-width">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pm-form-group">
                    <label>Product Type</label>
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleInputChange}
                    >
                      {productTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pm-form-group">
                    <label>Original Price *</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Reviews</label>
                    <input
                      type="number"
                      name="reviews"
                      value={formData.reviews}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>

                  <div className="pm-form-group pm-full-width">
                    <label>Image URL *</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Enter image URL or path"
                      required
                    />
                  </div>

                  <div className="pm-form-group pm-full-width">
                    <label>Short Description *</label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      rows="2"
                      required
                    />
                  </div>

                  <div className="pm-form-group pm-full-width">
                    <label>Full Description *</label>
                    <textarea
                      name="fullDescription"
                      value={formData.fullDescription}
                      onChange={handleInputChange}
                      rows="4"
                      required
                    />
                  </div>

                  <div className="pm-form-group pm-full-width">
                    <label>Features</label>
                    <div className="pm-features-input">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                        placeholder="Add a feature and press Enter"
                      />
                      <button type="button" onClick={handleAddFeature}>Add</button>
                    </div>
                    <div className="pm-features-list">
                      {formData.features.map((feature, index) => (
                        <span key={index} className="pm-feature-tag">
                          {feature}
                          <button type="button" onClick={() => handleRemoveFeature(index)}>
                            <FaTimes />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pm-form-group pm-full-width">
                    <label>Specifications</label>
                    <div className="pm-specs-input">
                      <input
                        type="text"
                        value={specKey}
                        onChange={(e) => setSpecKey(e.target.value)}
                        placeholder="Key (e.g., Weight)"
                      />
                      <input
                        type="text"
                        value={specValue}
                        onChange={(e) => setSpecValue(e.target.value)}
                        placeholder="Value (e.g., 1.5 kg)"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSpec()}
                      />
                      <button type="button" onClick={handleAddSpec}>Add</button>
                    </div>
                    <div className="pm-specs-list">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="pm-spec-item">
                          <strong>{key}:</strong> {value}
                          <button type="button" onClick={() => handleRemoveSpec(key)}>
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pm-form-group">
                    <label className="pm-checkbox-label">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                      />
                      Featured Product
                    </label>
                  </div>

                  <div className="pm-form-group">
                    <label className="pm-checkbox-label">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleInputChange}
                      />
                      In Stock
                    </label>
                  </div>

                  <div className="pm-form-group">
                    <label className="pm-checkbox-label">
                      <input
                        type="checkbox"
                        name="isFresh"
                        checked={formData.isFresh}
                        onChange={handleInputChange}
                      />
                      Is Fresh
                    </label>
                  </div>

                  <div className="pm-form-group">
                    <label>Freshness Tag</label>
                    <input
                      type="text"
                      name="freshnessTag"
                      value={formData.freshnessTag}
                      onChange={handleInputChange}
                      placeholder="e.g., NEW, FRESH"
                    />
                  </div>
                </div>
              </div>

              <div className="pm-modal-footer">
                <button
                  className="pm-btn pm-btn-secondary"
                  onClick={() => {
                    if (!saving) {
                      setShowEditModal(false);
                      setShowCreateModal(false);
                    }
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="pm-btn pm-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="spinner" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="pm-modal-overlay" onClick={() => {
            if (!saving) setShowDeleteModal(false);
          }}>
            <div className="pm-modal pm-delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="pm-modal-header">
                <h2>Delete Product</h2>
                <button
                  className="pm-modal-close"
                  onClick={() => {
                    if (!saving) setShowDeleteModal(false);
                  }}
                  disabled={saving}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="pm-modal-body">
                <p>Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?</p>
                <p className="pm-warning">This action cannot be undone.</p>
              </div>

              <div className="pm-modal-footer">
                <button
                  className="pm-btn pm-btn-secondary"
                  onClick={() => {
                    if (!saving) setShowDeleteModal(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="pm-btn pm-btn-danger"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="spinner" /> Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash /> Delete Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;

