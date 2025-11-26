import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc, deleteDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart items from Firestore when user logs in
  useEffect(() => {
    const loadCartFromFirestore = async () => {
      if (!currentUser) {
        // Clear cart when user logs out
        setCartItems([]);
        return;
      }

      setLoading(true);
      try {
        const cartRef = doc(db, 'carts', currentUser.uid);
        const cartDoc = await getDoc(cartRef);
        
        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          setCartItems(cartData.items || []);
          console.log('Cart loaded from Firestore');
        } else {
          // No cart exists yet, initialize empty cart
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error loading cart from Firestore:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartFromFirestore();
  }, [currentUser]);

  // Save cart to Firestore whenever it changes
  const saveCartToFirestore = async (items) => {
    if (!currentUser) return;

    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      await setDoc(cartRef, {
        items: items,
        userId: currentUser.uid,
        updatedAt: new Date().toISOString()
      });
      console.log('Cart saved to Firestore');
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
    }
  };

  const addToCart = async (product) => {
    if (!currentUser) {
      showNotification('Please login to add items to cart', 'warning');
      return;
    }

    const newCartItems = (() => {
      const existingItem = cartItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item exists, increase quantity
        return cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...cartItems, { ...product, quantity: 1 }];
      }
    })();

    setCartItems(newCartItems);
    await saveCartToFirestore(newCartItems);
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) return;

    const newCartItems = cartItems.filter(item => item.id !== productId);
    setCartItems(newCartItems);
    await saveCartToFirestore(newCartItems);
  };

  const updateQuantity = async (productId, quantity) => {
    if (!currentUser) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const newCartItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(newCartItems);
    await saveCartToFirestore(newCartItems);
  };

  const clearCart = async () => {
    if (!currentUser) return;

    setCartItems([]);
    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      await deleteDoc(cartRef);
      console.log('Cart cleared from Firestore');
    } catch (error) {
      console.error('Error clearing cart from Firestore:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      // Handle both numeric price and string price formats
      const price = typeof item.price === 'number' 
        ? item.price 
        : parseFloat(item.price.replace('₹', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const proceedToCheckout = async (discountInfo = {}) => {
    if (!currentUser) {
      showNotification('Please login to proceed with checkout', 'warning');
      return;
    }

    if (cartItems.length === 0) {
      showNotification('Your cart is empty', 'warning');
      return;
    }

    try {
      // Get user profile data
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      // Calculate totals
      const subtotal = getCartTotal();
      const tax = subtotal * 0.1;
      const totalBeforeDiscount = subtotal + tax;
      const discountAmount = discountInfo.discountAmount || 0;
      const total = totalBeforeDiscount - discountAmount;

      // Prepare order data
      const orderData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price.replace('₹', '')),
          quantity: item.quantity,
          image: item.image,
          discount: item.discount || 0,
          originalPrice: item.originalPrice
        })),
        subtotal: subtotal,
        tax: tax,
        promoCode: discountInfo.promoCode || null,
        discountAmount: discountAmount,
        total: total,
        userProfile: {
          name: userData.name || 'N/A',
          email: currentUser.email,
          phoneNumber: userData.phoneNumber || 'N/A',
          address: userData.address || 'N/A',
          city: userData.city || 'N/A',
          state: userData.state || 'N/A',
          pincode: userData.pincode || 'N/A'
        },
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Save order to Firebase
      const ordersRef = collection(db, 'orders');
      const orderDoc = await addDoc(ordersRef, orderData);
      
      console.log('Order saved with ID:', orderDoc.id);

      // Prepare WhatsApp message
      const whatsappMessage = generateWhatsAppMessage(orderData, orderDoc.id);
      
      // Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/918105652158?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      // Clear cart after successful checkout
      await clearCart();
      
      showNotification('Order placed successfully! Redirecting to WhatsApp...', 'success');

    } catch (error) {
      console.error('Error during checkout:', error);
      showNotification('Failed to place order. Please try again.', 'error');
    }
  };

  const generateWhatsAppMessage = (orderData, orderId) => {
    const { userProfile, items, subtotal, tax, promoCode, discountAmount, total } = orderData;
    
    let message = `🎬 *SLV Iyangerbakery - New Order Request*\n\n`;
    
    message += `🆔 *Order ID:* ${orderId}\n\n`;
    
    message += `📋 *Customer Details:*\n`;
    message += `Name: ${userProfile.name}\n`;
    message += `Email: ${userProfile.email}\n`;
    message += `Phone: ${userProfile.phoneNumber}\n`;
    message += `Address: ${userProfile.address}, ${userProfile.city}, ${userProfile.state} - ${userProfile.pincode}\n\n`;
    
    message += `🛒 *Order Details:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.category})\n`;
      message += `   Quantity: ${item.quantity} x ₹${item.price}\n`;
      message += `   Subtotal: ₹${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `💰 *Order Summary:*\n`;
    message += `Subtotal: ₹${subtotal.toFixed(2)}\n`;
    message += `Tax (10%): ₹${tax.toFixed(2)}\n`;
    if (promoCode && discountAmount > 0) {
      message += `Promo Code (${promoCode}): -₹${discountAmount.toFixed(2)}\n`;
    }
    message += `*Total: ₹${total.toFixed(2)}*\n\n`;
    
    message += `📅 *Order Date:* ${new Date().toLocaleDateString()}\n\n`;
    message += `Please confirm this order and provide pickup/delivery details.`;
    
    return message;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    cartCount: getCartCount(),
    isInCart,
    loading,
    proceedToCheckout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
