import React, { useState } from 'react';
import { useLikedProducts } from '../context/LikedProductsContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductDiscount, hasDiscount } from '../utils/discountUtils';
import { FaHeart, FaLock, FaHourglassHalf, FaStar } from 'react-icons/fa';
import './Favorites.css';

const Favorites = () => {
  const { likedProducts, toggleLike, clearAllLikes, loading } = useLikedProducts();
  const { addToCart, cartItems, updateQuantity, isInCart } = useCart();
  const { currentUser } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleRemoveLike = (product, event) => {
    event.stopPropagation();
    toggleLike(product);
  };

  const handleAddToCart = (product, event) => {
    if (event) event.stopPropagation();
    addToCart(product);
  };

  // Get quantity of a product in cart
  const getProductQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle quantity change
  const handleQuantityChange = (product, newQuantity, event) => {
    if (event) event.stopPropagation();
    if (newQuantity <= 0) {
      updateQuantity(product.id, 0);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  // Show login prompt if not authenticated
  if (!currentUser) {
    return (
      <div className="favorites-container">
        <div className="empty-favorites">
          <div className="empty-icon"><FaLock /></div>
          <h2>Please login to view your favorites</h2>
          <p>Sign in to access your saved products and favorites</p>
          <a href={`${process.env.PUBLIC_URL}/`} className="browse-products-btn">Go to Login</a>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="favorites-container">
        <div className="empty-favorites">
          <div className="empty-icon"><FaHourglassHalf /></div>
          <h2>Loading your favorites...</h2>
          <p>Please wait while we fetch your saved products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <p>Products you've liked - {likedProducts.length} {likedProducts.length === 1 ? 'item' : 'items'}</p>
        {likedProducts.length > 0 && (
          <button className="clear-all-btn" onClick={clearAllLikes}>
            Clear All Favorites
          </button>
        )}
      </div>

      {likedProducts.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon"><FaHeart /></div>
          <h2>No Favorites Yet</h2>
          <p>Start exploring our products and click the heart icon to save your favorites here!</p>
          <a href={`${process.env.PUBLIC_URL}/products`} className="browse-products-btn">Browse Products</a>
        </div>
      ) : (
        <div className="favorites-grid">
          {likedProducts.map(product => {
            const productHasDiscount = hasDiscount(product);
            const displayPrice = typeof product.price === 'number' 
              ? `₹${product.price}` 
              : product.price;
            
            return (
              <div key={product.id} className={`favorite-card ${product.inStock === false ? 'sold-out' : ''}`}>
                <div className="favorite-image">
                  <img src={product.image} alt={product.name} className="favorite-img" />
                  {product.inStock === false && (
                    <div className="sold-out-overlay">
                      <div className="sold-out-badge">SOLD OUT</div>
                    </div>
                  )}
                  {productHasDiscount && (
                    <div className="fav-discount-badge">{getProductDiscount(product)}%</div>
                  )}
                  <div className="favorite-actions">
                    <button 
                      className="remove-favorite-btn"
                      onClick={(e) => handleRemoveLike(product, e)}
                      title="Remove from favorites"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="favorite-info">
                  <div className="favorite-category">{product.category}</div>
                  <h3>{product.name}</h3>
                  {product.rating && (
                    <div className="favorite-rating">
                      <span className="rating-stars"><FaStar /> {product.rating}</span>
                      {product.reviews && (
                        <span className="rating-reviews">({product.reviews} reviews)</span>
                      )}
                    </div>
                  )}
                  <p>{product.shortDescription}</p>
                  <div className="favorite-footer">
                    <div className="favorite-price-section">
                      {productHasDiscount && product.originalPrice && (
                        <span className="fav-original-price">₹{product.originalPrice}</span>
                      )}
                      <span className="favorite-price">{displayPrice}</span>
                    </div>
                    <div className="favorite-buttons">
                      <button 
                        className="view-details-btn"
                        onClick={() => handleViewDetails(product)}
                      >
                        View Details
                      </button>
                      {product.inStock === false ? (
                        <button 
                          className="add-to-cart-btn sold-out-btn"
                          disabled
                        >
                          Sold Out
                        </button>
                      ) : isInCart(product.id) && getProductQuantity(product.id) > 0 ? (
                        <div className="quantity-selector">
                          <button 
                            className="quantity-btn minus-btn"
                            onClick={(e) => handleQuantityChange(product, getProductQuantity(product.id) - 1, e)}
                            aria-label="Decrease quantity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </button>
                          <span className="quantity-value">{getProductQuantity(product.id)}</span>
                          <button 
                            className="quantity-btn plus-btn"
                            onClick={(e) => handleQuantityChange(product, getProductQuantity(product.id) + 1, e)}
                            aria-label="Increase quantity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="add-to-cart-btn"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Product Details */}
      {showModal && selectedProduct && (
        <div className={`modal-overlay ${showModal ? 'active' : ''}`} onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="modal-header">
              <div className="modal-icon">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-product-img" />
              </div>
              <div className="modal-title-section">
                <span className="modal-category">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                {selectedProduct.rating && (
                  <div className="modal-rating">
                    <span className="rating-stars"><FaStar /> {selectedProduct.rating}</span>
                    {selectedProduct.reviews && (
                      <span className="rating-reviews">({selectedProduct.reviews} reviews)</span>
                    )}
                  </div>
                )}
                <div className="modal-price-section">
                  {hasDiscount(selectedProduct) && selectedProduct.originalPrice && (
                    <span className="modal-original-price">₹{selectedProduct.originalPrice}</span>
                  )}
                  <span className="modal-price">
                    {typeof selectedProduct.price === 'number' ? `₹${selectedProduct.price}` : selectedProduct.price}
                    <span className="price-period"></span>
                  </span>
                  {hasDiscount(selectedProduct) && (
                    <span className="modal-discount-badge">Save {getProductDiscount(selectedProduct)}%</span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Description</h3>
                <p>{selectedProduct.fullDescription}</p>
              </div>

              <div className="modal-section">
                <h3>Key Features</h3>
                <ul className="features-list">
                  {selectedProduct.features.map((feature, index) => (
                    <li key={index}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h3>Specifications</h3>
                <div className="specifications-grid">
                  {selectedProduct.specifications && typeof selectedProduct.specifications === 'object' && Object.keys(selectedProduct.specifications).length > 0 ? (
                    Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="spec-item">
                        <span className="spec-label">{key}:</span>
                        <span className="spec-value">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>No specifications available</p>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                {selectedProduct.inStock === false ? (
                  <button 
                    className="modal-cart-btn sold-out-btn"
                    disabled
                  >
                    Sold Out
                  </button>
                ) : isInCart(selectedProduct.id) && getProductQuantity(selectedProduct.id) > 0 ? (
                  <div className="modal-quantity-selector">
                    <button 
                      className="modal-quantity-btn minus-btn"
                      onClick={() => handleQuantityChange(selectedProduct, getProductQuantity(selectedProduct.id) - 1)}
                      aria-label="Decrease quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <span className="modal-quantity-value">{getProductQuantity(selectedProduct.id)}</span>
                    <button 
                      className="modal-quantity-btn plus-btn"
                      onClick={() => handleQuantityChange(selectedProduct, getProductQuantity(selectedProduct.id) + 1)}
                      aria-label="Increase quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button 
                    className="modal-cart-btn"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                  </button>
                )}
                {/* <button className="modal-contact-btn">Contact Sales</button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;

