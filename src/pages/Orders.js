import React, { useState, useEffect } from 'react';
import './Orders.css';
import { FaShoppingBag, FaBoxOpen, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setError('Please login to view your orders');
        setLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, 'orders');
        
        // First try with the filtered query
        let ordersData = [];
        
        try {
          const q = query(
            ordersRef,
            where('userId', '==', currentUser.uid)
          );
          
          const querySnapshot = await getDocs(q);
          
          querySnapshot.forEach((doc) => {
            ordersData.push({
              id: doc.id,
              ...doc.data()
            });
          });
        } catch (queryError) {
          console.warn('Filtered query failed, trying to fetch all orders:', queryError);
          
          // Fallback: Get all orders and filter on client side
          // This is less efficient but works if there are index issues
          const allOrdersSnapshot = await getDocs(ordersRef);
          
          allOrdersSnapshot.forEach((doc) => {
            const orderData = doc.data();
            if (orderData.userId === currentUser.uid) {
              ordersData.push({
                id: doc.id,
                ...orderData
              });
            }
          });
        }
        
        // Sort by createdAt on the client side to avoid index requirement
        ordersData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA; // Descending order (newest first)
        });
        
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        console.error('Error details:', {
          code: err.code,
          message: err.message,
          userId: currentUser?.uid
        });
        
        // Provide more specific error messages
        if (err.code === 'permission-denied') {
          setError('Permission denied. Please check your login status.');
        } else if (err.code === 'unavailable') {
          setError('Service temporarily unavailable. Please try again.');
        } else {
          setError(`Failed to load orders: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="orders__status-icon orders__status-icon--pending" />;
      case 'confirmed':
        return <FaCheckCircle className="orders__status-icon orders__status-icon--confirmed" />;
      case 'cancelled':
        return <FaTimesCircle className="orders__status-icon orders__status-icon--cancelled" />;
      default:
        return <FaClock className="orders__status-icon orders__status-icon--pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffa500';
      case 'confirmed':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser) {
    return (
      <div className="orders__page">
        <div className="orders__container">
          <div className="orders__empty">
            <FaBoxOpen className="orders__empty-icon" />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your orders.</p>
            <a href="/" className="orders__btn orders__btn--primary">Go to Login</a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders__page">
        <div className="orders__container">
          <div className="orders__header">
            <FaShoppingBag className="orders__header-icon" />
            <h1>My Orders</h1>
            <p>View and track your orders</p>
          </div>
          <div className="orders__loading">
            <div className="orders__spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders__page">
        <div className="orders__container">
          <div className="orders__header">
            <FaShoppingBag className="orders__header-icon" />
            <h1>My Orders</h1>
            <p>View and track your orders</p>
          </div>
          <div className="orders__error">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders__page">
      <div className="orders__container">
        <div className="orders__header">
          <FaShoppingBag className="orders__header-icon" />
          <h1>My Orders</h1>
          <p>View and track your orders</p>
        </div>

        <div className="orders__content">
          {orders.length === 0 ? (
            <div className="orders__empty">
              <FaBoxOpen className="orders__empty-icon" />
              <h2>No Orders Yet</h2>
              <p>When you place an order, it will appear here.</p>
              <a href={`${process.env.PUBLIC_URL}/products`} className="orders__btn orders__btn--primary">
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="orders__list">
              {orders.map((order) => (
                <div key={order.id} className="orders__card">
                  <div className="orders__card-header">
                    <div className="orders__card-info">
                      <h3>Order #{order.id.slice(-8)}</h3>
                      <p className="orders__card-date">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="orders__card-status">
                      {getStatusIcon(order.status)}
                      <span style={{ color: getStatusColor(order.status) }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="orders__card-items">
                    <h4>Items ({order.items?.length || 0})</h4>
                    <div className="orders__items-list">
                      {order.items?.map((item, index) => (
                        <div key={index} className="orders__item">
                          <img src={item.image} alt={item.name} className="orders__item-image" />
                          <div className="orders__item-details">
                            <h5>{item.name}</h5>
                            <p className="orders__item-category">{item.category}</p>
                            <p className="orders__item-quantity">Qty: {item.quantity} x ₹{item.price}</p>
                          </div>
                          <div className="orders__item-total">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="orders__card-summary">
                    <div className="orders__summary-row">
                      <span>Subtotal:</span>
                      <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="orders__summary-row">
                      <span>Tax (10%):</span>
                      <span>₹{order.tax?.toFixed(2) || '0.00'}</span>
                    </div>
                    {order.promoCode && order.discountAmount > 0 && (
                      <div className="orders__summary-row orders__summary-row--discount">
                        <span>Discount ({order.promoCode}):</span>
                        <span className="orders__discount-amount">-₹{order.discountAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                    )}
                    <div className="orders__summary-row orders__summary-row--total">
                      <span>Total:</span>
                      <span>₹{order.total?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  {/* <div className="orders__card-actions">
                    <button className="orders__btn orders__btn--secondary">
                      <FaEye /> View Details
                    </button>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;

