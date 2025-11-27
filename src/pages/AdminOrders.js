import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaClock, FaCheckCircle, FaTimesCircle, FaSearch, FaSpinner, FaFilter, FaEye } from 'react-icons/fa';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getImageUrl } from '../utils/imageUtils';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: '#f59e0b', icon: FaClock },
    { value: 'confirmed', label: 'Confirmed', color: '#10b981', icon: FaCheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: '#ef4444', icon: FaTimesCircle }
  ];

  // Fetch all orders from Firebase
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const ordersRef = collection(db, 'orders');
      let ordersData = [];
      
      try {
        const querySnapshot = await getDocs(ordersRef);
        
        querySnapshot.forEach((docSnapshot) => {
          ordersData.push({
            id: docSnapshot.id,
            ...docSnapshot.data()
          });
        });
      } catch (queryError) {
        console.warn('Initial query failed:', queryError);
        console.warn('Error code:', queryError.code);
        console.warn('Error message:', queryError.message);
        
        // If permission denied, show specific error
        if (queryError.code === 'permission-denied') {
          setError('Permission denied. Please make sure you are logged in as admin.');
          setLoading(false);
          return;
        }
        
        throw queryError;
      }

      // Sort by createdAt (newest first)
      ordersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setOrders(ordersData);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        name: err.name
      });
      
      // Provide more specific error messages
      if (err.code === 'permission-denied') {
        setError('Permission denied. Please check Firebase security rules.');
      } else if (err.code === 'unavailable') {
        setError('Service temporarily unavailable. Please try again.');
      } else if (err.code === 'unauthenticated') {
        setError('You need to be logged in to view orders.');
      } else {
        setError(`Failed to load orders: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status info
  const getStatusInfo = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      order.id.toLowerCase().includes(searchLower) ||
      order.userProfile?.name?.toLowerCase().includes(searchLower) ||
      order.userProfile?.email?.toLowerCase().includes(searchLower) ||
      order.userProfile?.phoneNumber?.includes(searchQuery) ||
      order.customerName?.toLowerCase().includes(searchLower) ||
      order.customerEmail?.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  // View order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  return (
    <div className="admin-orders">
      <div className="admin-orders__container">
        <div className="admin-orders__header">
          <div className="admin-orders__header-icon">
            <FaShoppingBag />
          </div>
          <h1>Order Management</h1>
          <p>View and manage customer orders - Update order statuses</p>
        </div>

        {/* Stats Cards */}
        <div className="admin-orders__stats">
          <div className="admin-orders__stat-card admin-orders__stat-card--total">
            <div className="admin-orders__stat-icon"><FaShoppingBag /></div>
            <div className="admin-orders__stat-info">
              <span className="admin-orders__stat-value">{stats.total}</span>
              <span className="admin-orders__stat-label">Total Orders</span>
            </div>
          </div>
          <div className="admin-orders__stat-card admin-orders__stat-card--pending">
            <div className="admin-orders__stat-icon"><FaClock /></div>
            <div className="admin-orders__stat-info">
              <span className="admin-orders__stat-value">{stats.pending}</span>
              <span className="admin-orders__stat-label">Pending</span>
            </div>
          </div>
          <div className="admin-orders__stat-card admin-orders__stat-card--confirmed">
            <div className="admin-orders__stat-icon"><FaCheckCircle /></div>
            <div className="admin-orders__stat-info">
              <span className="admin-orders__stat-value">{stats.confirmed}</span>
              <span className="admin-orders__stat-label">Confirmed</span>
            </div>
          </div>
          <div className="admin-orders__stat-card admin-orders__stat-card--cancelled">
            <div className="admin-orders__stat-icon"><FaTimesCircle /></div>
            <div className="admin-orders__stat-info">
              <span className="admin-orders__stat-value">{stats.cancelled}</span>
              <span className="admin-orders__stat-label">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-orders__toolbar">
          <div className="admin-orders__search">
            <FaSearch className="admin-orders__search-icon" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, Email or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="admin-orders__filter">
            <FaFilter className="admin-orders__filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="admin-orders__error">
            <span>{error}</span>
            <button className="admin-orders__retry-btn" onClick={fetchOrders}>
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="admin-orders__loading">
            <FaSpinner className="admin-orders__spinner" />
            <p>Loading orders...</p>
          </div>
        ) : (
          <div className="admin-orders__list">
            {filteredOrders.length === 0 ? (
              <div className="admin-orders__empty">
                <FaShoppingBag className="admin-orders__empty-icon" />
                <h3>No Orders Found</h3>
                <p>{searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No orders have been placed yet'}</p>
              </div>
            ) : (
              filteredOrders.map(order => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={order.id} className="admin-orders__card">
                    <div className="admin-orders__card-header">
                      <div className="admin-orders__order-id">
                        <span className="admin-orders__order-id-label">Order ID:</span>
                        <span className="admin-orders__order-id-value">#{order.id.slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="admin-orders__order-date">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    <div className="admin-orders__card-body">
                      <div className="admin-orders__order-info">
                        <div className="admin-orders__customer">
                          <h4>Customer Details</h4>
                          <p><strong>Name:</strong> {order.userProfile?.name || order.customerName || 'N/A'}</p>
                          <p><strong>Email:</strong> {order.userProfile?.email || order.customerEmail || 'N/A'}</p>
                          <p><strong>Phone:</strong> {order.userProfile?.phoneNumber || order.customerPhone || 'N/A'}</p>
                          {(order.userProfile?.address || order.customerAddress) && (
                            <p><strong>Address:</strong> {order.userProfile?.address || order.customerAddress}{order.userProfile?.city ? `, ${order.userProfile.city}` : ''}</p>
                          )}
                        </div>

                        <div className="admin-orders__items-preview">
                          <h4>Items ({order.items?.length || 0})</h4>
                          <div className="admin-orders__items-thumbnails">
                            {order.items?.slice(0, 4).map((item, index) => (
                              <div key={index} className="admin-orders__item-thumb">
                                <img 
                                  src={getImageUrl(item.image)} 
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.src = `${process.env.PUBLIC_URL}/bakery-icon-logo.png`;
                                  }}
                                />
                                {index === 3 && order.items.length > 4 && (
                                  <span className="admin-orders__more-items">+{order.items.length - 4}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="admin-orders__order-total">
                          <h4>Order Total</h4>
                          <span className="admin-orders__total-amount">₹{order.total?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>

                      <div className="admin-orders__actions">
                        <div className="admin-orders__current-status">
                          <span className="admin-orders__status-label">Current Status:</span>
                          <span 
                            className="admin-orders__status-badge"
                            style={{ backgroundColor: statusInfo.color }}
                          >
                            <StatusIcon />
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="admin-orders__status-modifier">
                          <label>Change Status:</label>
                          <div className="admin-orders__status-buttons">
                            {orderStatuses.map(status => (
                              <button
                                key={status.value}
                                className={`admin-orders__status-btn ${order.status === status.value ? 'admin-orders__status-btn--active' : ''}`}
                                style={{ 
                                  '--status-color': status.color,
                                  backgroundColor: order.status === status.value ? status.color : 'transparent',
                                  borderColor: status.color,
                                  color: order.status === status.value ? 'white' : status.color
                                }}
                                onClick={() => handleStatusChange(order.id, status.value)}
                                disabled={updating === order.id || order.status === status.value}
                              >
                                {updating === order.id ? (
                                  <FaSpinner className="admin-orders__btn-spinner" />
                                ) : (
                                  <>
                                    <status.icon />
                                    {status.label}
                                  </>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button 
                          className="admin-orders__view-btn"
                          onClick={() => handleViewDetails(order)}
                        >
                          <FaEye /> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="admin-orders__modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="admin-orders__modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-orders__modal-header">
                <h2>Order Details</h2>
                <span className="admin-orders__modal-order-id">#{selectedOrder.id.slice(-8).toUpperCase()}</span>
                <button 
                  className="admin-orders__modal-close"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="admin-orders__modal-body">
                <div className="admin-orders__modal-section">
                  <h3>Customer Information</h3>
                  <div className="admin-orders__modal-info-grid">
                    <div><strong>Name:</strong> {selectedOrder.userProfile?.name || selectedOrder.customerName || 'N/A'}</div>
                    <div><strong>Email:</strong> {selectedOrder.userProfile?.email || selectedOrder.customerEmail || 'N/A'}</div>
                    <div><strong>Phone:</strong> {selectedOrder.userProfile?.phoneNumber || selectedOrder.customerPhone || 'N/A'}</div>
                    <div><strong>Address:</strong> {
                      selectedOrder.userProfile?.address 
                        ? `${selectedOrder.userProfile.address}${selectedOrder.userProfile.city ? `, ${selectedOrder.userProfile.city}` : ''}${selectedOrder.userProfile.state ? `, ${selectedOrder.userProfile.state}` : ''}${selectedOrder.userProfile.pincode ? ` - ${selectedOrder.userProfile.pincode}` : ''}`
                        : (selectedOrder.customerAddress || 'N/A')
                    }</div>
                  </div>
                </div>

                <div className="admin-orders__modal-section">
                  <h3>Order Items</h3>
                  <div className="admin-orders__modal-items">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="admin-orders__modal-item">
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = `${process.env.PUBLIC_URL}/bakery-icon-logo.png`;
                          }}
                        />
                        <div className="admin-orders__modal-item-info">
                          <h4>{item.name}</h4>
                          <p className="admin-orders__modal-item-category">{item.category}</p>
                          <p className="admin-orders__modal-item-quantity">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <div className="admin-orders__modal-item-total">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-orders__modal-section admin-orders__modal-summary">
                  <h3>Order Summary</h3>
                  <div className="admin-orders__modal-summary-row">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="admin-orders__modal-summary-row">
                    <span>Tax (10%):</span>
                    <span>₹{selectedOrder.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  {selectedOrder.promoCode && selectedOrder.discountAmount > 0 && (
                    <div className="admin-orders__modal-summary-row admin-orders__modal-summary-row--discount">
                      <span>Discount ({selectedOrder.promoCode}):</span>
                      <span>-₹{selectedOrder.discountAmount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="admin-orders__modal-summary-row admin-orders__modal-summary-row--total">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                <div className="admin-orders__modal-section">
                  <h3>Order Status</h3>
                  <div className="admin-orders__modal-status">
                    <div className="admin-orders__modal-status-current">
                      <span>Current:</span>
                      <span 
                        className="admin-orders__status-badge"
                        style={{ backgroundColor: getStatusInfo(selectedOrder.status).color }}
                      >
                        {getStatusInfo(selectedOrder.status).label}
                      </span>
                    </div>
                    <div className="admin-orders__modal-status-change">
                      <span>Change to:</span>
                      <div className="admin-orders__status-buttons">
                        {orderStatuses.map(status => (
                          <button
                            key={status.value}
                            className={`admin-orders__status-btn ${selectedOrder.status === status.value ? 'admin-orders__status-btn--active' : ''}`}
                            style={{ 
                              backgroundColor: selectedOrder.status === status.value ? status.color : 'transparent',
                              borderColor: status.color,
                              color: selectedOrder.status === status.value ? 'white' : status.color
                            }}
                            onClick={() => {
                              handleStatusChange(selectedOrder.id, status.value);
                              setSelectedOrder(prev => ({ ...prev, status: status.value }));
                            }}
                            disabled={updating === selectedOrder.id || selectedOrder.status === status.value}
                          >
                            {updating === selectedOrder.id ? (
                              <FaSpinner className="admin-orders__btn-spinner" />
                            ) : (
                              <>
                                <status.icon />
                                {status.label}
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-orders__modal-section admin-orders__modal-timestamps">
                  <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  {selectedOrder.updatedAt && (
                    <p><strong>Last Updated:</strong> {formatDate(selectedOrder.updatedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
