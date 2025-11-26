import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import {
  FaRocket,FaGem,FaShieldAlt,FaComments,FaMoneyBillWave,FaTrophy,FaHandshake,FaBolt,FaFistRaised,
  FaHeart,FaUserTie,FaEnvelope,FaPhone,FaMapMarkerAlt,FaCookieBite,FaBirthdayCake,FaBreadSlice,
  FaFire,FaLeaf,FaClock,FaAward,FaUtensils
} from 'react-icons/fa';

const About = () => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [teamImage1Error, setTeamImage1Error] = useState(false);
  const [teamImage2Error, setTeamImage2Error] = useState(false);

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About SLV Iyanger Bakery</h1>
        <p>We're passionate about creating the finest baked goods with love, tradition, and the freshest ingredients</p>
      </div>

      <div className="about-content">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>Founded in 2020, SLV Iyanger Bakery started as a small family-owned business with a passion for creating delicious, fresh-baked goods. What began as a humble kitchen has grown into a beloved local bakery serving our community with love and dedication.</p>
          <p>Our master bakers bring generations of traditional baking knowledge combined with modern techniques to create exceptional pastries, breads, cakes, and treats.</p>
          <p>We believe in using only the finest ingredients, baking fresh daily, and creating memorable experiences that bring joy to every bite.</p>
        </div>
        <div className="about-image">
          {!imageError ? (
            <img 
              src={`${process.env.PUBLIC_URL}/bakerimgnew.png`} 
              alt="Our bakery" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '5rem', color: 'white' }}>
              <FaBreadSlice />
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="why-choose-section">
        <h2>Why Choose SLV Iyanger Bakery?</h2>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon"><FaRocket /></div>
            <h4>Fresh Daily</h4>
            <p>All our baked goods are made fresh every morning, ensuring the best taste and quality</p>
          </div>
          <div className="why-card">
            <div className="why-icon"><FaGem /></div>
            <h4>Premium Ingredients</h4>
            <p>We use only the finest, locally sourced ingredients in all our recipes</p>
          </div>
          <div className="why-card">
            <div className="why-icon"><FaShieldAlt /></div>
            <h4>Traditional Recipes</h4>
            <p>Time-honored baking techniques passed down through generations</p>
          </div>
          <div className="why-card">
            <div className="why-icon"><FaComments /></div>
            <h4>Custom Orders</h4>
            <p>We create personalized cakes and treats for your special occasions</p>
          </div>
          <div className="why-card">
            <div className="why-icon"><FaMoneyBillWave /></div>
            <h4>Fair Prices</h4>
            <p>Quality baked goods at affordable prices for everyone to enjoy</p>
          </div>
          <div className="why-card">
            <div className="why-icon"><FaTrophy /></div>
            <h4>Award Winning</h4>
            <p>Recognized for excellence in baking and customer satisfaction</p>
          </div>
        </div>
      </div>

      <div className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon"><FaHeart /></div>
            <h3>Passion</h3>
            <p>We bake with genuine passion and love, putting our heart into every creation that comes out of our ovens.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><FaHandshake /></div>
            <h3>Authenticity</h3>
            <p>We stay true to traditional recipes and methods, preserving the authentic flavors that make our bakery special.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><FaBolt /></div>
            <h3>Freshness</h3>
            <p>We bake fresh daily, ensuring every customer receives the highest quality products at peak freshness.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><FaFistRaised /></div>
            <h3>Community</h3>
            <p>We're proud to be part of our local community, supporting neighbors and creating lasting relationships.</p>
          </div>
        </div>
      </div>

      {/* Our Journey Timeline */}
      <div className="journey-timeline-section">
        <h2>Our Journey</h2>
        <p className="journey-subtitle">From 2010 to Present - A Sweet Story of Growth</p>
        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-year">2010</div>
            <div className="timeline-content">
              <h3>Bakery Founded</h3>
              <p>Started with a small kitchen and big dreams</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-year">2015</div>
            <div className="timeline-content">
              <h3>First Expansion</h3>
              <p>Expanded our menu and opened a larger bakery</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-year">2020</div>
            <div className="timeline-content">
              <h3>10 Years Celebration</h3>
              <p>Celebrated a decade of serving our community</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-year">2024</div>
            <div className="timeline-content">
              <h3>Present Day</h3>
              <p>Continuing to bake fresh daily with love and passion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Specialties */}
      <div className="specialties-section">
        <h2>Our Specialties</h2>
        <p className="specialties-subtitle">Discover our signature baked goods, crafted with passion and expertise</p>
        <div className="specialties-grid">
          <div className="specialty-card">
            <div className="specialty-icon"><FaBirthdayCake /></div>
            <h3>Custom Cakes</h3>
            <p>Beautifully designed cakes for birthdays, weddings, and all your special celebrations</p>
          </div>
          <div className="specialty-card">
            <div className="specialty-icon"><FaBreadSlice /></div>
            <h3>Artisanal Breads</h3>
            <p>Freshly baked breads using traditional methods and premium ingredients</p>
          </div>
          <div className="specialty-card">
            <div className="specialty-icon"><FaCookieBite /></div>
            <h3>Pastries & Cookies</h3>
            <p>Delightful pastries, cookies, and sweet treats baked fresh every morning</p>
          </div>
          <div className="specialty-card">
            <div className="specialty-icon"><FaUtensils /></div>
            <h3>Savory Items</h3>
            <p>Delicious savory baked goods perfect for breakfast, lunch, or anytime snacks</p>
          </div>
        </div>
      </div>

      {/* Our Baking Process */}
      <div className="process-section">
        <h2>Our Baking Process</h2>
        <p className="process-subtitle">From ingredients to your table, we ensure quality at every step</p>
        <div className="process-grid">
          <div className="process-step">
            <div className="process-number">1</div>
            <div className="process-icon"><FaLeaf /></div>
            <h3>Select Premium Ingredients</h3>
            <p>We carefully source the finest, freshest ingredients from trusted local suppliers</p>
          </div>
          <div className="process-step">
            <div className="process-number">2</div>
            <div className="process-icon"><FaFire /></div>
            <h3>Traditional Baking</h3>
            <p>Using time-honored recipes and techniques passed down through generations</p>
          </div>
          <div className="process-step">
            <div className="process-number">3</div>
            <div className="process-icon"><FaClock /></div>
            <h3>Fresh Daily</h3>
            <p>Every item is baked fresh each morning to ensure peak flavor and quality</p>
          </div>
          <div className="process-step">
            <div className="process-number">4</div>
            <div className="process-icon"><FaAward /></div>
            <h3>Quality Check</h3>
            <p>Each product undergoes our strict quality standards before reaching you</p>
          </div>
        </div>
      </div>

      <div className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-avatar">
              {!teamImage1Error ? (
                <img 
                  src={`${process.env.PUBLIC_URL}/bakerimg.png`} 
                  alt="Master Baker" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  onError={() => setTeamImage1Error(true)}
                />
              ) : (
                <FaUserTie style={{ fontSize: '3rem', color: 'white' }} />
              )}
            </div>
            <h3>Rakesh Kumar</h3>
            <p>Master Baker & Founder</p>
          </div>
          <div className="team-member">
            <div className="team-avatar">
              {!teamImage2Error ? (
                <img 
                  src=" /bakerimgnew.png" 
                  alt="Pastry Chef" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  onError={() => setTeamImage2Error(true)}
                />
              ) : (
                <FaBirthdayCake style={{ fontSize: '3rem', color: 'white' }} />
              )}
            </div>
            <h3>Priya Sharma</h3>
            <p>Head Pastry Chef</p>
          </div>
          <div className="team-member">
            <div className="team-avatar"><FaCookieBite style={{ fontSize: '3rem', color: 'white' }} /></div>
            <h3>Arjun Patel</h3>
            <p>Bread Specialist</p>
          </div>
          <div className="team-member">
            <div className="team-avatar"><FaBreadSlice style={{ fontSize: '3rem', color: 'white' }} /></div>
            <h3>Meera Singh</h3>
            <p>Customer Relations</p>
          </div>
        </div>
      </div>

      {/* Get in Touch Section */}
      <div className="get-in-touch-section">
        <div className="touch-content">
          <h2>Ready to Taste the Difference?</h2>
          <p>Join thousands of satisfied customers and experience the joy of fresh-baked goodness. Visit us today or place an order for your next celebration!</p>
          <div className="touch-buttons">
            <button className="touch-btn primary" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
            <button className="touch-btn secondary" onClick={() => navigate('/products')}>
              View Our Products
            </button>
          </div>
          <div className="touch-info">
            <div className="touch-info-item">
              <span className="touch-info-icon"><FaEnvelope /></span>
              <span>info@SLV Iyangerbakery.com</span>
            </div>
            <div className="touch-info-item">
              <span className="touch-info-icon"><FaPhone /></span>
              <span>+91 {process.env.REACT_APP_PHONE_NUMBER}</span>
            </div>
            <div className="touch-info-item">
              <span className="touch-info-icon"><FaMapMarkerAlt /></span>
              <span>123 Bakery Lane, Sweet City</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
