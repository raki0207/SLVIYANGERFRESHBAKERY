import React, { useState, useEffect, useRef, useMemo } from 'react';
import './index.css';
import {
  FaRocket, FaLock, FaStar, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaLinkedin, FaPhone, FaWhatsapp, FaArrowRight,
  FaMinus, FaPlus, FaTimes, FaCheck, FaShoppingCart, FaClock, FaSync, FaLayerGroup, FaQuoteLeft
} from 'react-icons/fa';
import { useLikedProducts } from '../context/LikedProductsContext';
import { useCart } from '../context/CartContext';
import { getProductDiscount, hasDiscount } from '../utils/discountUtils';
import { useJustArrivedProducts, useJustBakedProducts } from '../hooks/useProducts';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [submitMessage, setSubmitMessage] = useState('');
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { toggleLike, isLiked } = useLikedProducts();
  const { addToCart, cartItems, updateQuantity, isInCart } = useCart();
  const [justArrivedProducts, setJustArrivedProducts] = useState([]);
  const [justArrivedIndex, setJustArrivedIndex] = useState(0);
  const [justBakedProducts, setJustBakedProducts] = useState([]);
  const [justBakedIndex, setJustBakedIndex] = useState(0);
  const [statisticsValues, setStatisticsValues] = useState({
    teamMembers: 0,
    yearsExperience: 0,
    productsMenu: 0,
    awardsWon: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fetch products from API
  const { 
    products: justArrivedProductsFromAPI, 
    loading: justArrivedLoading, 
    error: justArrivedError 
  } = useJustArrivedProducts();
  
  const { 
    products: justBakedProductsFromAPI, 
    loading: justBakedLoading, 
    error: justBakedError 
  } = useJustBakedProducts();

  // Hero slideshow images
  const heroImages = [
    `${process.env.PUBLIC_URL}/baked-image1.jpg`,
    `${process.env.PUBLIC_URL}/bakerimgnew.png`,
    `${process.env.PUBLIC_URL}/bakerimg.png`
  ];

  // Update products from API
  useEffect(() => {
    if (justArrivedProductsFromAPI && justArrivedProductsFromAPI.length > 0) {
      // Ensure image paths are correct
      const formattedProducts = justArrivedProductsFromAPI.map(product => ({
        ...product,
        image: product.image.startsWith('http') || product.image.startsWith('/') 
          ? product.image 
          : `${process.env.PUBLIC_URL}${product.image}`
      }));
      setJustArrivedProducts(formattedProducts.slice(0, 6));
    }
  }, [justArrivedProductsFromAPI]);

  useEffect(() => {
    if (justBakedProductsFromAPI && justBakedProductsFromAPI.length > 0) {
      // Ensure image paths are correct
      const formattedProducts = justBakedProductsFromAPI.map(product => ({
        ...product,
        image: product.image.startsWith('http') || product.image.startsWith('/') 
          ? product.image 
          : `${process.env.PUBLIC_URL}${product.image}`
      }));
      setJustBakedProducts(formattedProducts.slice(0, 8));
    }
  }, [justBakedProductsFromAPI]);


  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (justArrivedProducts.length === 0) {
      if (justArrivedIndex !== 0) {
        setJustArrivedIndex(0);
      }
      return;
    }

    const productsPerView = isMobile ? 4 : 3;
    if (justArrivedProducts.length <= productsPerView && justArrivedIndex !== 0) {
      setJustArrivedIndex(0);
    } else if (justArrivedIndex >= justArrivedProducts.length) {
      setJustArrivedIndex(0);
    }
  }, [justArrivedProducts, justArrivedIndex, isMobile]);


  useEffect(() => {
    if (justBakedProducts.length === 0) {
      if (justBakedIndex !== 0) {
        setJustBakedIndex(0);
      }
      return;
    }

    const productsPerView = isMobile ? 4 : 3;
    if (justBakedProducts.length <= productsPerView && justBakedIndex !== 0) {
      setJustBakedIndex(0);
    } else if (justBakedIndex >= justBakedProducts.length) {
      setJustBakedIndex(0);
    }
  }, [justBakedProducts, justBakedIndex, isMobile]);

  const visibleJustArrivedProducts = useMemo(() => {
    const productsPerView = isMobile ? 4 : 3;
    
    if (justArrivedProducts.length <= productsPerView) {
      return justArrivedProducts;
    }

    const endIndex = justArrivedIndex + productsPerView;

    if (endIndex <= justArrivedProducts.length) {
      return justArrivedProducts.slice(justArrivedIndex, endIndex);
    }

    const firstBatch = justArrivedProducts.slice(justArrivedIndex);
    const remainingCount = productsPerView - firstBatch.length;
    return [...firstBatch, ...justArrivedProducts.slice(0, remainingCount)];
  }, [justArrivedProducts, justArrivedIndex, isMobile]);

  const visibleJustBakedProducts = useMemo(() => {
    const productsPerView = isMobile ? 4 : 3;
    
    if (justBakedProducts.length <= productsPerView) {
      return justBakedProducts;
    }

    const endIndex = justBakedIndex + productsPerView;

    if (endIndex <= justBakedProducts.length) {
      return justBakedProducts.slice(justBakedIndex, endIndex);
    }

    const firstBatch = justBakedProducts.slice(justBakedIndex);
    const remainingCount = productsPerView - firstBatch.length;
    return [...firstBatch, ...justBakedProducts.slice(0, remainingCount)];
  }, [justBakedProducts, justBakedIndex, isMobile]);

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FaStar key={i} style={{ width: '14px', height: '14px', color: '#ffc107', fill: '#ffc107' }} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FaStar key={i} style={{ width: '14px', height: '14px', color: '#ffc107' }} className="half-star" />
        );
      } else {
        stars.push(
          <FaStar key={i} style={{ width: '14px', height: '14px', color: '#ddd' }} />
        );
      }
    }
    return stars;
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleToggleLike = (product, event) => {
    event.stopPropagation();
    toggleLike(product);
  };

  const handleNextJustArrived = () => {
    const productsPerView = isMobile ? 4 : 3;
    if (justArrivedProducts.length <= productsPerView) {
      return;
    }

    setJustArrivedIndex((prevIndex) => (prevIndex + productsPerView) % justArrivedProducts.length);
  };

  const handleNextJustBaked = () => {
    const productsPerView = isMobile ? 4 : 3;
    if (justBakedProducts.length <= productsPerView) {
      return;
    }

    setJustBakedIndex((prevIndex) => (prevIndex + productsPerView) % justBakedProducts.length);
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

  // Auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [heroImages.length]);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          } else {
            setVisibleSections(prev => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax scroll effect for hero content
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Statistics count-up animation
  useEffect(() => {
    if (!visibleSections.has('statistics-section') || hasAnimated) {
      return;
    }

    const animateNumber = (target, current, setter) => {
      const startValue = current;
      const endValue = target;
      const startTime = Date.now();
      const duration = 2000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);

        setter(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setter(endValue);
        }
      };

      animate();
    };

    // Start animations
    animateNumber(12, 0, (value) => {
      setStatisticsValues(prev => ({ ...prev, teamMembers: value }));
    });
    animateNumber(10, 0, (value) => {
      setStatisticsValues(prev => ({ ...prev, yearsExperience: value }));
    });
    animateNumber(65, 0, (value) => {
      setStatisticsValues(prev => ({ ...prev, productsMenu: value }));
    });
    animateNumber(4, 0, (value) => {
      setStatisticsValues(prev => ({ ...prev, awardsWon: value }));
    });

    // Mark as animated to prevent re-running
    setHasAnimated(true);
  }, [visibleSections, hasAnimated]);

  // Form handling
  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      // Send data to Google Sheets via Google Apps Script
      // See GOOGLE_SHEETS_SETUP.md for instructions on setting up Google Sheets
      // Using URL-encoded format for better compatibility
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('phone', formData.phone);
      params.append('subject', formData.subject);
      params.append('message', formData.message);
      params.append('timestamp', new Date().toISOString());

      const response = await fetch(
        process.env.REACT_APP_GOOGLE_SCRIPT_URL || 
        "https://script.google.com/macros/s/AKfycbx7d223WCIY5kGkjVCJTWmxoxr_uUX8zbRZYSxyRl7vV5NRtxR_OtazS0mgsPM0egs__w/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString()
        }
      );

      // Since we're using no-cors mode, we can't read the response
      // But the data should be submitted successfully
      setSubmitStatus('success');
      setSubmitMessage('Your message has been sent successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 5000);

    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus('error');
      setSubmitMessage('There was an error sending your message. Please try again or contact us directly.');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url('${image}')` }}
            ></div>
          ))}
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-left-content">
            <div className="hero-text-container">
              <h1 className="hero-title">Artisanal Bakery <br />Collection</h1>
              <p className="hero-subtitle">
                Discover handcrafted cakes, pastries, and breads baked fresh daily for every celebration.
              </p>
            </div>

            <div className="hero-features">
              <div className="feature-box">
                <div className="feature-number">100+</div>
                <div className="feature-label">Handcrafted Treats</div>
              </div>
              <div className="feature-box">
                <div className="feature-number">Fresh</div>
                <div className="feature-label">Daily Bakes</div>
              </div>

            </div>
          </div>

          <div className="hero-right-content">
            <div className="camera-product">
            </div>
          </div>
        </div>
      </section>

      {/* Hero Spacer */}
      <div className="hero-spacer"></div>

      {/* Just Arrived */}
      <section
        id="just-arrived-section"
        ref={(el) => sectionRefs.current['just-arrived-section'] = el}
        className={`just-arrived-section ${visibleSections.has('just-arrived-section') ? 'animate-in' : 'animate-out'}`}
      >
        <div className="container">
          <h2 className="gradient-text-primary">Just Arrived</h2>
          <p className="subtitle">Check out our latest additions to the collection</p>
          
          {justArrivedLoading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p>Loading products...</p>
            </div>
          )}
          
          {justArrivedError && !justArrivedLoading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>
              <p>Error loading products. Please try again later.</p>
            </div>
          )}
          
          {!justArrivedLoading && !justArrivedError && justArrivedProducts.length > (isMobile ? 4 : 3) && (
            <div className="just-arrived-controls">
              <button
                type="button"
                className="just-arrived-next-btn"
                onClick={handleNextJustArrived}
              >
                Next <FaArrowRight />
              </button>
            </div>
          )}
          <div className="just-arrived-grid">
            {!justArrivedLoading && visibleJustArrivedProducts.map(product => (
              <div key={product.id} className={`just-arrived-card ${product.inStock === false ? 'sold-out' : ''}`}>
                <div className="just-arrived-image">
                  <img src={product.image} alt={product.name} className="just-arrived-img" />
                  {product.inStock === false && (
                    <div className="sold-out-overlay">
                      <div className="sold-out-badge">SOLD OUT</div>
                    </div>
                  )}
                  {hasDiscount(product) && (
                    <div className="discount-badge">{getProductDiscount(product)}%</div>
                  )}
                  <div className="product-actions-btns">
                    <button
                      className={`like-icon-btns ${isLiked(product.id) ? 'liked' : ''}`}
                      onClick={(e) => handleToggleLike(product, e)}
                      title={isLiked(product.id) ? "Unlike" : "Like"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isLiked(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    <button
                      className="view-icon-btns"
                      onClick={() => handleViewDetails(product)}
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                  <span className="new-badge">NEW</span>
                </div>
                <div className="just-arrived-content">
                  <div className="product-category">{product.category}</div>
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    <div className="stars">{renderStars(product.rating)}</div>
                    <span className="rating-value">{product.rating}</span>
                    <span className="review-count">({product.reviews} reviews)</span>
                  </div>
                  <p>{product.shortDescription}</p>
                  <div className="product-footer">
                    <div className="price-section">
                      {hasDiscount(product) && (
                        <span className="original-price">₹{product.originalPrice}</span>
                      )}
                      <span className="product-price">₹{product.price}</span>
                    </div>
                    {product.inStock === false ? (
                      <button
                        className="add-to-cart-btn-home sold-out-btn"
                        disabled
                      >
                        Sold Out
                      </button>
                    ) : isInCart(product.id) && getProductQuantity(product.id) > 0 ? (
                      <div className="quantity-selector-home">
                        <button
                          className="quantity-btn-home minus-btn"
                          onClick={(e) => handleQuantityChange(product, getProductQuantity(product.id) - 1, e)}
                          aria-label="Decrease quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="quantity-value-home">{getProductQuantity(product.id)}</span>
                        <button
                          className="quantity-btn-home plus-btn"
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
                        className="add-to-cart-btn-home"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fresherly Baked Section */}
      <section
        id="freshly-baked-section"
        ref={(el) => sectionRefs.current['freshly-baked-section'] = el}
        className={`tools-section ${visibleSections.has('freshly-baked-section') ? 'animate-in' : 'animate-out'}`}
      >
        <div className="container">
          <h2 className="gradient-text-primary">Fresherly Baked</h2>
          <p className="subtitle">Straight from our ovens — limited batches every morning</p>
          
          {justBakedLoading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
              <p>Loading products...</p>
            </div>
          )}
          
          {justBakedError && !justBakedLoading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>
              <p>Error loading products. Please try again later.</p>
            </div>
          )}
          
          {!justBakedLoading && !justBakedError && justBakedProducts.length > (isMobile ? 4 : 3) && (
            <div className="just-arrived-controls">
              <button
                type="button"
                className="just-arrived-next-btn"
                onClick={handleNextJustBaked}
              >
                Next <FaArrowRight />
              </button>
            </div>
          )}
          <div className="just-arrived-grid">
            {!justBakedLoading && visibleJustBakedProducts.map((product) => (
              <div key={product.id} className={`just-arrived-card ${product.inStock === false ? 'sold-out' : ''}`}>
                <div className="just-arrived-image">
                  <img src={product.image} alt={product.name} className="just-arrived-img" />
                  {product.inStock === false && (
                    <div className="sold-out-overlay">
                      <div className="sold-out-badge">SOLD OUT</div>
                    </div>
                  )}
                  {hasDiscount(product) && (
                    <div className="discount-badge">{getProductDiscount(product)}%</div>
                  )}
                  <div className="product-actions-btns">
                    <button
                      className={`like-icon-btns ${isLiked(product.id) ? 'liked' : ''}`}
                      onClick={(e) => handleToggleLike(product, e)}
                      title={isLiked(product.id) ? "Unlike" : "Like"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isLiked(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    <button
                      className="view-icon-btns"
                      onClick={() => handleViewDetails(product)}
                      title="View Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                  {product.freshnessTag && (
                    <span className="new-badge">{product.freshnessTag}</span>
                  )}
                </div>
                <div className="just-arrived-content">
                  <div className="product-category">{product.category}</div>
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    <div className="stars">{renderStars(product.rating)}</div>
                    <span className="rating-value">{product.rating}</span>
                    <span className="review-count">({product.reviews} reviews)</span>
                  </div>
                  <p>{product.shortDescription}</p>
                  <div className="product-footer">
                    <div className="price-section">
                      {hasDiscount(product) && (
                        <span className="original-price">₹{product.originalPrice}</span>
                      )}
                      <span className="product-price">₹{product.price}</span>
                    </div>
                    {product.inStock === false ? (
                      <button
                        className="add-to-cart-btn-home sold-out-btn"
                        disabled
                      >
                        Sold Out
                      </button>
                    ) : isInCart(product.id) && getProductQuantity(product.id) > 0 ? (
                      <div className="quantity-selector-home">
                        <button
                          className="quantity-btn-home minus-btn"
                          onClick={(e) => handleQuantityChange(product, getProductQuantity(product.id) - 1, e)}
                          aria-label="Decrease quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="quantity-value-home">{getProductQuantity(product.id)}</span>
                        <button
                          className="quantity-btn-home plus-btn"
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
                        className="add-to-cart-btn-home"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Bakery */}
      <section
        id="why-choose-section"
        ref={(el) => sectionRefs.current['why-choose-section'] = el}
        className={`why-choose-section ${visibleSections.has('why-choose-section') ? 'animate-in' : 'animate-out'}`}
      >
        <div className="container">
          <h2 className="gradient-text-primary">Why Choose Our Bakery?</h2>
          <p className="subtitle">We bring gourmet patisserie experiences to your table</p>
          <div className="why-choose-grid">
            <div className="why-choose-card">
              <div className="why-choose-icon blue">
                <FaLock />
              </div>
              <h3>Freshness Guaranteed</h3>
              <p>Every batch is crafted daily with locally sourced ingredients and artisanal techniques.</p>
            </div>
            <div className="why-choose-card">
              <div className="why-choose-icon green">
                <FaStar />
              </div>
              <h3>Tailored Creations</h3>
              <p>From flavours to finishes, we customise every bake to match your celebration and taste.</p>
            </div>
            <div className="why-choose-card">
              <div className="why-choose-icon orange">
                <FaRocket />
              </div>
              <h3>Doorstep Delivery</h3>
              <p>Enjoy temperature-controlled delivery across Bangalore with real-time order updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials-section"
        ref={(el) => sectionRefs.current['testimonials-section'] = el}
        className={`testimonials-section ${visibleSections.has('testimonials-section') ? 'animate-in' : 'animate-out'}`}
      >
        <div className="container">
          <div className="testimonials-header">
            <h2 className="gradient-text-primary">What Food Lovers Say</h2>
            <p className="subtitle">Sweet words from our happy patrons</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <FaQuoteLeft style={{ width: '40px', height: '40px' }} />
                </div>
                <p className="testimonial-text">"The custom cake was a showstopper—looked stunning and tasted even better. Delivery was perfectly on time."</p>
                <div className="testimonial-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => <FaStar key={i} className="star filled" />)}
                  </div>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Ananya</h4>
                    <span>Event Planner</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <FaQuoteLeft style={{ width: '40px', height: '40px' }} />
                </div>
                <p className="testimonial-text">"Their weekend brunch box is my go-to treat. Fresh, indulgent, and different every single time."</p>
                <div className="testimonial-rating">
                  <div className="stars">
                    {[...Array(4)].map((_, i) => <FaStar key={i} className="star filled" />)}
                    <FaStar className="star" />
                  </div>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Rahul</h4>
                    <span>Food Blogger</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <FaQuoteLeft style={{ width: '40px', height: '40px' }} />
                </div>
                <p className="testimonial-text">"Our office loved the dessert platter. The team handled special dietary requests with ease."</p>
                <div className="testimonial-rating">
                  <div className="stars">
                    {[...Array(4)].map((_, i) => <FaStar key={i} className="star filled" />)}
                    <FaStar className="star" />
                  </div>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Meera</h4>
                    <span>Corporate Chef</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        id="statistics-section"
        ref={(el) => sectionRefs.current['statistics-section'] = el}
        className={`statistics-section ${visibleSections.has('statistics-section') ? 'animate-in' : 'animate-out'}`}
      >
        <div className="statistics-container">
          <div className="statistics-banner">
            <div className="statistics-item">
              <div className="statistics-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop')" }}></div>
              <div className="statistics-overlay"></div>
              <div className="statistics-content">
                <div className="statistics-number">{statisticsValues.teamMembers}</div>
                <div className="statistics-label">TEAM MEMBERS</div>
              </div>
            </div>
            <div className="statistics-item">
              <div className="statistics-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop')" }}></div>
              <div className="statistics-overlay"></div>
              <div className="statistics-content">
                <div className="statistics-number">{statisticsValues.yearsExperience}</div>
                <div className="statistics-label">YEARS OF EXPERIENCE</div>
              </div>
            </div>
            <div className="statistics-item">
              <div className="statistics-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop')" }}></div>
              <div className="statistics-overlay"></div>
              <div className="statistics-content">
                <div className="statistics-number">{statisticsValues.productsMenu}</div>
                <div className="statistics-label">PRODUCTS IN MENU</div>
              </div>
            </div>
            <div className="statistics-item">
              <div className="statistics-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop')" }}></div>
              <div className="statistics-overlay"></div>
              <div className="statistics-content">
                <div className="statistics-number">{statisticsValues.awardsWon}</div>
                <div className="statistics-label">AWARDS WON</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section
        id="promotional-section"
        ref={(el) => sectionRefs.current['promotional-section'] = el}
        className={`promotional-section ${visibleSections.has('promotional-section') ? 'animate-in' : 'animate-out'}`}
      >
        <div className="promotional-container">
          <div className="promotional-grid">
            {/* Decorative SVG curved lines */}
            <svg className="promotional-curve curve-1" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M 0 100 Q 50 50, 100 100 T 200 100" stroke="rgba(200, 200, 200, 0.25)" strokeWidth="2" fill="none" />
            </svg>
            <svg className="promotional-curve curve-2" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M 0 100 Q 50 150, 100 100 T 200 100" stroke="rgba(200, 200, 200, 0.25)" strokeWidth="2" fill="none" />
            </svg>

            {/* Left Column - Images */}
            <div className="promotional-left-column">
              <div className="promotional-image-panel top-left">
                <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop" alt="Bakery team member" />
              </div>
              <div className="promotional-image-panel bottom-left">
                <img src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop" alt="Bakery display counter" />
              </div>
            </div>

            {/* Central Content */}
            <div className="promotional-content">
              <div className="promotional-price">ONLY 59₹</div>
              <p className="promotional-message">Make a difference and choose THE BEST for your business !</p>
              <div className="promotional-cta">
                <button className="promotional-button">PURCHASE NOW</button>
                <div className="promotional-puff">
                  <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150&h=150&fit=crop" alt="Cream puff" />
                </div>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="promotional-right-column">
              <div className="promotional-image-panel top-right">
                <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop" alt="Naked cake with berries" />
              </div>
              <div className="promotional-image-panel bottom-right">
                <img src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&h=400&fit=crop" alt="Dessert table" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Bakery Section */}
      <section
        id="best-bakery-section"
        ref={(el) => sectionRefs.current['best-bakery-section'] = el}
        className={`best-bakery-section ${visibleSections.has('best-bakery-section') ? 'animate-in' : 'animate-out'}`}
      >
        <div className="container">
          {/* Decorative wavy lines background */}
          <svg className="best-bakery-curves" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M 0 200 Q 150 100, 300 200 T 600 200 T 900 200 T 1200 200" stroke="rgba(200, 200, 200, 0.25)" strokeWidth="2" fill="none" />
            <path d="M 0 400 Q 200 350, 400 400 T 800 400 T 1200 400" stroke="rgba(200, 200, 200, 0.25)" strokeWidth="2" fill="none" />
            <path d="M 0 600 Q 100 550, 200 600 T 400 600 T 600 600 T 800 600 T 1000 600 T 1200 600" stroke="rgba(200, 200, 200, 0.25)" strokeWidth="2" fill="none" />
          </svg>

          {/* Title Section */}
          <div className="best-bakery-header">
            <p className="best-bakery-subtitle">THE BEST BAKERY</p>
            <h2 className="best-bakery-title">Raki Artisanal Bakes</h2>
          </div>

          {/* Features Grid */}
          <div className="best-bakery-features">
            <div className="best-bakery-feature">
              <div className="best-bakery-icon">
                <FaRocket style={{ width: '50px', height: '50px' }} />
              </div>
              <p className="best-bakery-feature-label">FRESHLY BAKED</p>
            </div>

            <div className="best-bakery-feature">
              <div className="best-bakery-icon">
                <FaClock style={{ width: '50px', height: '50px' }} />
              </div>
              <p className="best-bakery-feature-label">ON-TIME DELIVERY</p>
            </div>

            <div className="best-bakery-feature">
              <div className="best-bakery-icon">
                <FaSync style={{ width: '50px', height: '50px' }} />
              </div>
              <p className="best-bakery-feature-label">DAILY FRESH STOCK</p>
            </div>

            <div className="best-bakery-feature">
              <div className="best-bakery-icon">
                <FaPlus style={{ width: '50px', height: '50px' }} />
              </div>
              <p className="best-bakery-feature-label">CUSTOM ORDERS</p>
            </div>

            <div className="best-bakery-feature">
              <div className="best-bakery-icon">
                <FaLayerGroup style={{ width: '50px', height: '50px' }} />
              </div>
              <p className="best-bakery-feature-label">VARIETY OF ITEMS</p>
            </div>

            <div className="best-bakery-feature">
              <div className="best-bakery-icon">
                <FaShoppingCart style={{ width: '50px', height: '50px' }} />
              </div>
              <p className="best-bakery-feature-label">ONLINE ORDERING</p>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="best-bakery-testimonial">
            <p className="best-bakery-testimonial-text">
              Professional presentation, clean layout, and a warm, inviting design—just like a perfect bakery. We truly appreciate the smooth customer experience, which feels as delightful as it looks. Highly recommended!!!
            </p>
            <div className="best-bakery-testimonial-author">
              <div className="best-bakery-author-avatar">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" alt="Kaylee Addison" />
              </div>
              <div className="best-bakery-author-info">
                <h4 className="best-bakery-author-name">Robert Rakesh</h4>
                <p className="best-bakery-author-role">SLV Iyanger Bakery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact-section"
        ref={(el) => sectionRefs.current['contact-section'] = el}
        className={`contact-section ${visibleSections.has('contact-section') ? 'animate-in' : 'animate-out'}`}
      >
        <div className="container">
          <div className="contact-header">
            <h2 className="gradient-text-primary">Get In Touch</h2>
            <p className="subtitle">Planning a celebration? Let us craft the perfect menu of cakes and confections for you.</p>
          </div>

          <div className="contact-content">
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-header">
                <div className="form-icon">
                  <FaEnvelope />
                </div>
                <div className="form-title">
                  <h3>Send us a message</h3>
                  <p>We'll get back to you within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Your Message"
                    rows="4"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  ></textarea>
                </div>

                {submitStatus && (
                  <div className={`submit-message ${submitStatus === 'success' ? 'success' : 'error'}`}>
                    {submitStatus === 'success' ? (
                      <FaCheck style={{ marginRight: '8px' }} />
                    ) : (
                      <FaTimes style={{ marginRight: '8px' }} />
                    )}
                    <span>{submitMessage}</span>
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  <FaEnvelope />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <div className="contact-info-item">
                <div className="info-icon visit">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-content">
                  <h4>Visit Us</h4>
                  <p>30, 4th Main Rd, 4th T Block West,<br />Kumar Swamy Layout, Hassan,<br />Karnataka 563217</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon call">
                  <FaPhone />
                </div>
                <div className="info-content">
                  <h4>Call Us</h4>
                  <p>+91 {process.env.REACT_APP_PHONE_NUMBER}</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon email">
                  <FaEnvelope />
                </div>
                <div className="info-content">
                  <h4>Email Us</h4>
                  <p>slviyangerbakery@gmail.com</p>
                </div>
              </div>

              <div className="social-section">
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a href="https://www.instagram.com/bookmycamera_?igsh=MWQzaGNwNThxeGF0dQ=="
                    className="social-link instagram"
                    target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                  <a href="https://www.linkedin.com/company/bookmycamera"
                    className="social-link linkedin"
                    target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                  <a href={`https://wa.me/${process.env.REACT_APP_PHONE_NUMBER}?text=Hello%20I%20would%20like%20to%20know%20about%20the%20pricing.`}
                    className="social-link whatsapp">
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Product Details */}
      {showModal && selectedProduct && (
        <div className={`modal-overlay ${showModal ? 'active' : ''}`} onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes style={{ width: '24px', height: '24px' }} />
            </button>

            <div className="modal-header">
              <div className="modal-icon">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-product-img" />
              </div>
              <div className="modal-title-section">
                <span className="modal-category">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                <div className="modal-rating">
                  <div className="stars">{renderStars(selectedProduct.rating)}</div>
                  <span className="rating-value">{selectedProduct.rating}</span>
                  <span className="review-count">({selectedProduct.reviews} reviews)</span>
                </div>
                <div className="modal-price-section">
                  {hasDiscount(selectedProduct) && (
                    <span className="modal-original-price">₹{selectedProduct.originalPrice}</span>
                  )}
                  <span className="modal-price">₹{selectedProduct.price}<span className="price-period"></span></span>
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
                      <FaCheck style={{ width: '20px', height: '20px' }} />
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
                  <div className="modal-quantity-selector-home">
                    <button
                      className="modal-quantity-btn-home minus-btn"
                      onClick={() => handleQuantityChange(selectedProduct, getProductQuantity(selectedProduct.id) - 1)}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus style={{ width: '18px', height: '18px' }} />
                    </button>
                    <span className="modal-quantity-value-home">{getProductQuantity(selectedProduct.id)}</span>
                    <button
                      className="modal-quantity-btn-home plus-btn"
                      onClick={() => handleQuantityChange(selectedProduct, getProductQuantity(selectedProduct.id) + 1)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus style={{ width: '18px', height: '18px' }} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="modal-cart-btn"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    <FaShoppingCart style={{ width: '20px', height: '20px' }} />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
