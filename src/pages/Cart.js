import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getProductDiscount, hasDiscount } from '../utils/discountUtils';
import { FaShoppingCart, FaLock, FaHourglassHalf, FaStar, FaClipboard, FaCheck, FaTrash } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, loading, proceedToCheckout } = useCart();
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  
  const [generatedPromoCode, setGeneratedPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [promoInput, setPromoInput] = useState('');

  // Generate random promo code on component mount
  useEffect(() => {
    const generatePromoCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };
    setGeneratedPromoCode(generatePromoCode());
  }, []);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const totalBeforeDiscount = subtotal + tax;
  
  // Calculate discount: 10% of total, max ₹500
  const discountAmount = appliedPromoCode 
    ? Math.min(totalBeforeDiscount * 0.09, 500)
    : 0;
  
  const total = totalBeforeDiscount - discountAmount;

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      return; // Prevent checkout if cart is empty
    }
    await proceedToCheckout({
      promoCode: appliedPromoCode || null,
      discountAmount: discountAmount
    });
    // Clear promo code after successful checkout
    setAppliedPromoCode('');
    setPromoInput('');
  };

  const handleApplyPromo = () => {
    const inputCode = promoInput.trim().toUpperCase();
    
    if (!inputCode) {
      showNotification('Please enter a promo code', 'warning');
      return;
    }
    
    if (inputCode === generatedPromoCode) {
      setAppliedPromoCode(inputCode);
      setPromoInput('');
      showNotification('Promo code applied successfully! 10% off (up to ₹500)', 'success');
    } else {
      showNotification('Invalid promo code', 'error');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromoCode('');
    showNotification('Promo code removed', 'info');
  };

  const handleCopyPromoCode = () => {
    navigator.clipboard.writeText(generatedPromoCode);
    showNotification('Promo code copied to clipboard!', 'success');
  };

  // Show login prompt if not authenticated
  if (!currentUser) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-icon"><FaLock /></div>
          <h3>Please login to view your cart</h3>
          <p>Sign in to access your shopping cart and saved items</p>
          <a href={`${process.env.PUBLIC_URL}/`} className="continue-shopping-btn">Go to Login</a>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-icon"><FaHourglassHalf /></div>
          <h3>Loading your cart...</h3>
          <p>Please wait while we fetch your items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>Review your items and proceed to checkout</p>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <h2>Cart Items ({cartItems.length})</h2>
            {cartItems.length > 0 && (
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>
          
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon"><FaShoppingCart /></div>
              <h3>Your cart is empty</h3>
              <p>Add some items to get started!</p>
              <a href={`${process.env.PUBLIC_URL}/products`} className="continue-shopping-btn">Continue Shopping</a>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => {
                // Handle both numeric and string price formats
                const itemPrice = typeof item.price === 'number' 
                  ? item.price 
                  : parseFloat(item.price.replace('₹', ''));
                const itemHasDiscount = hasDiscount(item);
                
                return (
                  <div key={item.id} className="cart-item">
                    <div className="item-icon">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      {itemHasDiscount && (
                        <div className="cart-discount-badge">{getProductDiscount(item)}%</div>
                      )}
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <div className="item-price-section">
                        {itemHasDiscount && item.originalPrice && (
                          <span className="item-original-price">₹{item.originalPrice}</span>
                        )}
                        <p className="item-price">₹{itemPrice}</p>
                      </div>
                      {item.rating && (
                        <div className="item-rating">
                          <FaStar /> {item.rating} {item.reviews && `(${item.reviews} reviews)`}
                        </div>
                      )}
                    </div>
                    <div className="item-quantity">
                      {/* <button 
                        className="remove-btn mobile-remove-btn" 
                        onClick={() => handleRemove(item.id)}
                        title="Remove from cart"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button> */}
                      <button 
                        className="qty-btn" 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      ₹{(itemPrice * item.quantity).toFixed(2)}
                    </div>
                    {/* <button 
                        className="remove-btn mobile-remove-btn" 
                        onClick={() => handleRemove(item.id)}
                        title="Remove from cart"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button> */}
                    <button 
                      className="remove-btn desktop-remove-btn" 
                      onClick={() => handleRemove(item.id)}
                      title="Remove from cart"
                    >
                      <FaTrash className="delete-icon" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {appliedPromoCode && (
              <div className="summary-row discount-row">
                <span>Discount ({appliedPromoCode})</span>
                <span className="discount-amount">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            className={`checkout-btn ${cartItems.length === 0 ? 'disabled' : ''}`}
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
          
          <div className="promo-section">
            {!appliedPromoCode ? (
              <>
                <div className="promo-code-generate">
                  <div className="promo-code-display">
                    <span className="promo-label">Your Promo Code:</span>
                    <div className="promo-code-value">
                      <span>{generatedPromoCode}</span>
                      <button 
                        className="copy-promo-btn" 
                        onClick={handleCopyPromoCode}
                        title="Copy promo code"
                      >
                        <FaClipboard color="white" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="promo-code">
                  <input 
                    type="text" 
                    placeholder="Enter promo code" 
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                  />
                  <button onClick={handleApplyPromo}>Apply</button>
                </div>
              </>
            ) : (
              <div className="promo-applied">
                <div className="promo-applied-info">
                  <span className="promo-check"><FaCheck /></span>
                  <span>code <strong>{appliedPromoCode}</strong> applied!</span>
                  <span className="promo-discount-text">Save ₹{discountAmount.toFixed(2)}</span>
                </div>
                <button className="remove-promo-btn" onClick={handleRemovePromo}>
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
