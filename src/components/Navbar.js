import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaHeart } from 'react-icons/fa';
import { useLikedProducts } from '../context/LikedProductsContext';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';
import './Navbar.css';

const Navbar = ({ onLoginClick, isLoggedIn, onLogout, isAdminSession = false }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const { likedCount } = useLikedProducts();
  const { cartCount } = useCart();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    onLogout();
  };

  // Fetch all products from MongoDB on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAllProducts({ limit: 1000 });
        const productsArray = Array.isArray(data) ? data : (data.products || []);
        setAllProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products for search:', error);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query from MongoDB data
  useEffect(() => {
    if (searchQuery.trim().length > 0 && allProducts.length > 0) {
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSearchResults(results);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProducts]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setShowSearchInput(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    navigate(`/products?search=${encodeURIComponent(product.name)}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setShowSearchInput(false);
  };

  // Handle search icon click
  const handleSearchIconClick = () => {
    setShowSearchInput(true);
  };

  // Handle search close
  const handleCloseSearch = () => {
    setShowSearchInput(false);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close dropdown and suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu if clicked outside (but not if clicking the hamburger button)
      if (isMobileMenuOpen && 
          !event.target.closest('.navbar-links') && 
          !event.target.closest('.mobile-menu-toggle') && 
          !event.target.closest('.hamburger') &&
          !event.target.closest('.mobile-menu-overlay')) {
        setIsMobileMenuOpen(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        // Close search input if clicked outside (except when submitting search)
        if (showSearchInput && !event.target.closest('.navbar-search-input') && !event.target.closest('.navbar-search-button')) {
          setShowSearchInput(false);
          setSearchQuery('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchInput, isMobileMenuOpen]);


  return (
    <>
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>}
      <nav className="navbar">
        <div className="navbar-container">
        <div className="navbar-brand">
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <span className={isMobileMenuOpen ? 'hamburger active' : 'hamburger'}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div className="navbar-logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={`${process.env.PUBLIC_URL}/bakery-icon-logo.png`} 
              alt="Raki Bakery Logo" 
              style={{ height: '45px', width: '90px' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h2 className="navbar-logo">SLV Bakery</h2>
          </div>
          {/* Hamburger Menu Button */}
          {/* <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <span className={isMobileMenuOpen ? 'hamburger active' : 'hamburger'}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button> */}
          <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <NavLink to="/" className="nav-link" end onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/about" className="nav-link" onClick={closeMobileMenu}>About</NavLink>
            <NavLink to="/products" className="nav-link" onClick={closeMobileMenu}>Products</NavLink>
            <NavLink to="/connections" className="nav-link" onClick={closeMobileMenu}>Connections</NavLink>
            <NavLink to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact Us</NavLink>
          </div>
        </div>
        
        <div className="navbar-actions">
          {/* Search Icon or Search Bar */}
          {isAdminSession && (
            <NavLink
              to="/admin/products"
              className="admin-quick-link"
              onClick={closeMobileMenu}
            >
              Add Product
            </NavLink>
          )}

          <div className="navbar-search-container" ref={searchRef}>
            {!showSearchInput ? (
              <button onClick={handleSearchIconClick} className="search-icon-button" title="Search products">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            ) : (
              <>
                <form onSubmit={handleSearchSubmit} className="navbar-search-form">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="navbar-search-input"
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    autoFocus
                  />
                  <button type="submit" className="navbar-search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </button>
                  <button type="button" onClick={handleCloseSearch} className="navbar-search-close-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </form>

                {/* Search Suggestions */}
                {showSuggestions && searchResults.length > 0 && (
                  <div className="search-suggestions">
                    {searchResults.map(product => {
                      const productId = product.id || product._id;
                      return (
                        <div
                          key={productId}
                          className="search-suggestion-item"
                          onClick={() => handleSuggestionClick(product)}
                        >
                          <img src={product.image} alt={product.name} className="suggestion-image" />
                          <div className="suggestion-info">
                            <div className="suggestion-name">{product.name}</div>
                            <div className="suggestion-category">{product.category}</div>
                          </div>
                          <div className="suggestion-price">₹{product.price}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          <NavLink to="/cart" className="cart-icon">
            <FaShoppingCart />
            {cartCount > 0 && <span className="badge cart-badge">{cartCount}</span>}
          </NavLink>
          
          <NavLink to="/favorites" className="like-icon">
            <FaHeart />
            {likedCount > 0 && <span className="badge like-badge">{likedCount}</span>}
          </NavLink>
          
          {isLoggedIn ? (
            <div className="profile-container" ref={dropdownRef}>
              <div className="profile-icon" onClick={toggleDropdown}>
                <FaUserCircle />
              </div>
              {showDropdown && (
                <div className="profile-dropdown">
                  <NavLink to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    My Profile
                  </NavLink>
                  <NavLink to="/orders" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    My Orders
                  </NavLink>
                  {/* <NavLink to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    Settings
                  </NavLink> */}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
