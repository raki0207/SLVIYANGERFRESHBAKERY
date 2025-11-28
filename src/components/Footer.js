import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import './Footer.css';
import { useFloatingButtons } from '../context/FloatingButtonsContext';
import { 
  FaWhatsapp, 
  FaPhone, 
  FaStar, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaInstagram, 
  FaLinkedin,
  FaHome,
  FaInfoCircle,
  FaBirthdayCake,
  FaHandshake,
  FaPhoneAlt
} from 'react-icons/fa';

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
            <FaWhatsapp />
          </a>
        )}

        {/* Phone Call Button */}
        {showFloatingButtons && (
          <a
            href={`tel:+91${process.env.REACT_APP_PHONE_NUMBER}`}
            className={`floating-btn phone-btn ${isAnimating ? 'emerging-from-star' : isReturning ? 'returning-to-star' : ''}`}
            title="Call Us"
          >
            <FaPhone />
          </a>
        )}

        {/* Toggle Button */}
        {showToggleButton && (
          <button
            onClick={toggleFloatingButtons}
            className={`floating-btn toggle-btn ${isAnimating ? 'rotating-clockwise' : isReturning ? 'rotating-counter-clockwise' : ''}`}
            title={showFloatingButtons ? "Hide Contact Options" : "Show Contact Options"}
          >
            <FaStar />
          </button>
        )}
      </div>

      <footer className="footer">
        <div className="footer-background-pattern"></div>
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
                <li>
                  <a href="/SLVIYANGERFRESHBAKERY/" className="footer-link">
                    <span className="link-icon"><FaHome /></span>
                    <span className="link-text">Home</span>
                  </a>
                </li>
                <li>
                  <a href="/SLVIYANGERFRESHBAKERY/about" className="footer-link">
                    <span className="link-icon"><FaInfoCircle /></span>
                    <span className="link-text">About Us</span>
                  </a>
                </li>
                <li>
                  <a href="/SLVIYANGERFRESHBAKERY/products" className="footer-link">
                    <span className="link-icon"><FaBirthdayCake /></span>
                    <span className="link-text">Products</span>
                  </a>
                </li>
                <li>
                  <a href="/SLVIYANGERFRESHBAKERY/connections" className="footer-link">
                    <span className="link-icon"><FaHandshake /></span>
                    <span className="link-text">Connections</span>
                  </a>
                </li>
                <li>
                  <a href="/SLVIYANGERFRESHBAKERY/contact" className="footer-link">
                    <span className="link-icon"><FaPhoneAlt /></span>
                    <span className="link-text">Contact Us</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Right Column - Address & Contact */}
            <div className="footer-column footer-contact">
              <h4 className="footer-heading">ADDRESS:</h4>
              <div className="address-info">
                <div className="address-item">
                  <FaMapMarkerAlt className="contact-icon-footer" />
                  <div className="address-text">
                    <p>30, 4th Main Rd, 4th T Block West,</p>
                    <p>Kumar Swamy Layout, Hassan,</p>
                    <p>Karnataka 563217</p>
                  </div>
                </div>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <FaPhone className="contact-icon-footer" />
                  <div className="contact-item-content">
                    <span className="contact-label">Phone:</span>
                    <a href={`tel:+91${process.env.REACT_APP_PHONE_NUMBER}`} className="contact-value contact-link">+91 {process.env.REACT_APP_PHONE_NUMBER}</a>
                  </div>
                </div>
                {/* {process.env.REACT_APP_SECONDARY_NUMBER && (
                  <div className="contact-item">
                    <FaPhone className="contact-icon-footer" />
                    <div className="contact-item-content">
                      <span className="contact-label">Phone:</span>
                      <a href={`tel:+91${process.env.REACT_APP_SECONDARY_NUMBER}`} className="contact-value contact-link">+91 {process.env.REACT_APP_SECONDARY_NUMBER}</a>
                    </div>
                  </div>
                )} */}

                <div className="contact-item">
                  <FaEnvelope className="contact-icon-footer" />
                  <div className="contact-item-content">
                    <span className="contact-label">Email:</span>
                    <a href="mailto:info@slvbakery.com" className="contact-value contact-link">info@slvbakery.com</a>
                  </div>
                </div>
              </div>
              <div className="social-media">
                <a href="#" className="social-icons instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-icons linkedin">
                  <FaLinkedin />
                </a>
                <a href={`https://wa.me/${process.env.REACT_APP_PHONE_NUMBER}?text=Hello%20I%20would%20like%20to%20know%20about%20the%20pricing.`} target="_blank" rel="noopener noreferrer" className="social-icons whatsapp">
                  <FaWhatsapp />
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
