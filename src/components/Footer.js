import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import './Footer.css';
import { useFloatingButtons } from '../context/FloatingButtonsContext';

const Footer = () => {
  const { showFloatingButtons, setShowFloatingButtons } = useFloatingButtons();
  const [hasShownInitialAnimation, setHasShownInitialAnimation] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    // Show initial animation on page load
    const timer = setTimeout(() => {
      // First, show the toggle button
      setShowToggleButton(true);

      // After toggle button appears, start the animation sequence
      const animationTimer = setTimeout(() => {
        setIsAnimating(true);
        setShowFloatingButtons(true);

        setTimeout(() => {
          setIsAnimating(false);
        }, 800);

        // Hide after 3 seconds
        const hideTimer = setTimeout(() => {
          setIsReturning(true);
          setShowFloatingButtons(false);

          setTimeout(() => {
            setIsReturning(false);
            setHasShownInitialAnimation(true);
          }, 600);
        }, 3000);

        return () => clearTimeout(hideTimer);
      }, 800); // Wait 0.8 seconds after toggle button appears

      return () => clearTimeout(animationTimer);
    }, 1000); // Wait 1 second after page load

    return () => clearTimeout(timer);
  }, []);

  const toggleFloatingButtons = () => {
    if (isAnimating || isReturning) return; // Prevent multiple clicks during animation

    if (showFloatingButtons) {
      // Hide icons - return to star
      setIsReturning(true);
      setShowFloatingButtons(false);

      setTimeout(() => {
        setIsReturning(false);
      }, 600);
    } else {
      // Show icons - emerge from star
      setIsAnimating(true);
      setShowFloatingButtons(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };

  // Animation variants
  const starVariants = {
    initial: { rotate: 0 },
    rotateClockwise: {
      rotate: 360,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    },
    rotateCounterClockwise: {
      rotate: -360,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      y: 0,
      transition: { duration: 0.6, ease: [0.55, 0.06, 0.68, 0.19] }
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: -15,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="floating-buttons">
        {/* WhatsApp Button */}
        {showFloatingButtons && (
          <a
            href={`https://wa.me/91${process.env.REACT_APP_PHONE_NUMBER}?text=Hello%20I%20would%20like%20to%20know%20more%20about%20your%20bakery%20products.`}
            target="_blank"
            rel="noopener noreferrer"
            className={`floating-btn whatsapp-btn ${isAnimating ? 'emerging-from-star' : isReturning ? 'returning-to-star' : ''}`}
            title="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
          </a>
        )}

        {/* Phone Call Button */}
        {showFloatingButtons && (
          <a
            href={`tel:+91${process.env.REACT_APP_PHONE_NUMBER}`}
            className={`floating-btn phone-btn ${isAnimating ? 'emerging-from-star' : isReturning ? 'returning-to-star' : ''}`}
            title="Call Us"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
            </svg>
          </a>
        )}

        {/* Toggle Button */}
        {showToggleButton && (
          <button
            onClick={toggleFloatingButtons}
            className={`floating-btn toggle-btn ${isAnimating ? 'rotating-clockwise' : isReturning ? 'rotating-counter-clockwise' : ''}`}
            title={showFloatingButtons ? "Hide Contact Options" : "Show Contact Options"}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )}
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            {/* Left Column - Company Information */}
            <div className="footer-column footer-company">
              <div className="company-logo-section">
                <div className="logo">
                  <div className="logo-icon">
                    <img
                      src={`${process.env.PUBLIC_URL}/bakery-icon-logo.png`}
                      alt="SLV Bakery Logo"
                      style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <h3 className="company-name">SLV Bakery</h3>
                </div>
                <p className="company-description">
                  SLV Bakery is your trusted local bakery, specializing in fresh-baked goods made with love and premium ingredients. From artisanal breads and pastries to custom cakes and cookies, we bring joy to every celebration with our delicious, handcrafted treats.
                </p>
              </div>
            </div>

            {/* Middle Column - Useful Links */}
            <div className="footer-column footer-links">
              <h4 className="footer-heading">USEFUL LINKS</h4>
              <ul className="footer-links-list">
                <li><a href="/" className="footer-link">Home</a></li>
                <li><a href="/about" className="footer-link">About Us</a></li>
                <li><a href="/products" className="footer-link">Products</a></li>
                <li><a href="/connections" className="footer-link">Connections</a></li>
                <li><a href="/contact" className="footer-link">Contact Us</a></li>
              </ul>
            </div>

            {/* Right Column - Address & Contact */}
            <div className="footer-column footer-contact">
              <h4 className="footer-heading">ADDRESS:</h4>
              <div className="address-info">
                <p>30, 4th Main Rd, 4th T Block West,</p>
                <p>Kumar Swamy Layout, Hassan,</p>
                <p>Karnataka 563217</p>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <span className="contact-value">+91 {process.env.REACT_APP_PHONE_NUMBER}</span>
                </div>
                {process.env.REACT_APP_SECONDARY_NUMBER && (
                  <div className="contact-item">
                    <span className="contact-label">Phone:</span>
                    <span className="contact-value">+91 {process.env.REACT_APP_SECONDARY_NUMBER}</span>
                  </div>
                )}

                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">info@slvbakery.com</span>
                </div>
              </div>
              <div className="social-media">
                <a href="#" className="social-icons instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="social-icons linkedin">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href={`https://wa.me/${process.env.REACT_APP_PHONE_NUMBER}?text=Hello%20I%20would%20like%20to%20know%20about%20the%20pricing.`} target="_blank" rel="noopener noreferrer" className="social-icons whatsapp">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <p className="copyright">
              © Copyright <span className="copyright-company">SLV Bakery</span>. All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
