
import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaStar, FaAward, FaCertificate, FaBirthdayCake, FaUtensils, FaGift, FaTruck, FaStore, FaCoffee, FaShoppingBag, FaUserCircle, FaUser, FaUserTie, FaUserFriends } from 'react-icons/fa';
import './Connections.css';

const Connections = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing! You\'ll receive our latest recipes, special offers, and bakery updates.');
    setEmail('');
  };

  const socialPlatforms = [
    { id: 1, name: 'Instagram', icon: FaInstagram, description: 'See our daily fresh bakes and behind-the-scenes', followers: '28K+', color: '#E4405F' },
    { id: 2, name: 'Facebook', icon: FaFacebook, description: 'Join our baking community and share your favorites', followers: '45K+', color: '#1877F2' },
    { id: 3, name: 'YouTube', icon: FaYoutube, description: 'Watch our baking tutorials and recipe videos', followers: '20K+', color: '#FF0000' },
    { id: 4, name: 'WhatsApp', icon: FaWhatsapp, description: 'Order directly and get instant updates', followers: '15K+', color: '#25D366' },
  ];

  const storeLocations = [
    { id: 1, name: 'Main Bakery', address: '30, 4th Main Rd, 4th T Block West,Kumar Swamy Layout, Hassan,Karnataka 563217', phone: '+91 810-565-2158', hours: 'Mon-Sun: 7AM-11PM', icon: FaStore, color: '#7bb3a5' },
    { id: 2, name: 'Cafe Branch(Comming Soon)', address: '13, 8th Main Rd, 4th D Block West,Kumar Swamy Layout, Hassan,Karnataka 563217', phone: '+91 810-565-2158', hours: 'Daily: 6AM-11PM', icon: FaCoffee, color: '#d2691e' },
    { id: 3, name: 'Express Outlet(Comming Soon)', address: '23, 14th Main Rd, 4th F Block West,Kumar Swamy Layout, Hassan,Karnataka 563217', phone: '+91 810-565-2158', hours: 'Mon-Fri: 8AM-9PM', icon: FaShoppingBag, color: '#f5576c' },
  ];

  const testimonials = [
    { id: 1, name: 'Sarah Johnson', role: 'Regular Customer', rating: 5, text: 'The best bakery in town! Their chocolate cake is absolutely divine. I\'ve been coming here for years and the quality never disappoints.', avatar: FaUserCircle, color: '#7bb3a5' },
    { id: 2, name: 'Michael Chen', role: 'Event Planner', rating: 5, text: 'Sweet Bakes catered our corporate event and everyone was impressed. Professional service and delicious pastries. Highly recommended!', avatar: FaUserTie, color: '#5a8f82' },
    { id: 3, name: 'Emily Rodriguez', role: 'Wedding Client', rating: 5, text: 'Our wedding cake was a masterpiece! Not only beautiful but incredibly delicious. The team worked closely with us to create our dream cake.', avatar: FaUserFriends, color: '#f5576c' },
    { id: 4, name: 'David Thompson', role: 'Food Blogger', rating: 5, text: 'As a food blogger, I\'ve tried many bakeries. Sweet Bakes stands out with their fresh ingredients and artisanal approach. Truly exceptional!', avatar: FaUser, color: '#d2691e' },
  ];

  const awards = [
    { id: 1, title: 'Best Bakery 2024', organization: 'City Food Awards', icon: FaAward, year: '2024' },
    { id: 2, title: 'Excellence in Pastry', organization: 'Baking Association', icon: FaCertificate, year: '2023' },
    { id: 3, title: 'Customer Choice', organization: 'Local Business Awards', icon: FaStar, year: '2024' },
    { id: 4, title: 'Quality Certified', organization: 'Food Safety Board', icon: FaCertificate, year: '2025' },
  ];

  const specialServices = [
    { id: 1, name: 'Custom Cakes', description: 'Design your dream cake for any occasion', icon: FaBirthdayCake, features: ['Personalized designs', 'Any flavor combination', 'Photo cakes available'] },
    { id: 2, name: 'Event Catering', description: 'Delicious pastries for your special events', icon: FaUtensils, features: ['Corporate events', 'Weddings & parties', 'Custom menus'] },
    { id: 3, name: 'Gift Boxes', description: 'Curated selections perfect for gifting', icon: FaGift, features: ['Custom assortments', 'Gift wrapping', 'Delivery available'] },
    { id: 4, name: 'Bulk Orders', description: 'Large quantities for celebrations', icon: FaTruck, features: ['Volume discounts', 'Advance ordering', 'Fresh delivery'] },
  ];

  return (
    <div className="connections-container">
      <div className="connections-header">
        <h1>Connect With Us</h1>
        <p>Stay in touch with Sweet Bakes! Follow us on social media, visit our stores, or subscribe for fresh updates and exclusive offers.</p>
      </div>

      <section className="info-social-section">
        <h2>Follow Us On Social Media</h2>
        <p className="info-section-subtitle">Get daily inspiration, baking tips, and see our fresh creations</p>
        <div className="info-social-grid">
          {socialPlatforms.map(platform => {
            const IconComponent = platform.icon;
            return (
              <div key={platform.id} className="social-card">
                <div className="social-icon" style={{ background: platform.color }}>
                  <IconComponent />
                </div>
                <h3>{platform.name}</h3>
                <p>{platform.description}</p>
                <p style={{ fontWeight: 'bold', color: '#7bb3a5', marginBottom: '15px' }}>
                  {platform.followers} Followers
                </p>
                <button className="follow-button">Follow Us</button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="info-newsletter-section">
        <h2>Subscribe To Our Newsletter</h2>
        <p>Get exclusive recipes, special discounts, new product announcements, and baking tips delivered fresh to your inbox every week!</p>
        <form className="info-newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe Now</button>
        </form>
      </section>

      <section className="info-locations-section">
        <h2>Visit Our Stores</h2>
        <p className="info-section-subtitle">Come visit us in person and experience the warmth of our freshly baked goods</p>
        <div className="info-locations-grid">
          {storeLocations.map(location => {
            const LocationIcon = location.icon;
            return (
            <div key={location.id} className="location-card">
              <div className="location-icon" style={{ color: location.color }}><LocationIcon /></div>
              <h3>{location.name}</h3>
              <div className="location-info">
                <p><FaMapMarkerAlt style={{ color: '#7bb3a5' }} /> {location.address}</p>
                <p><FaPhone style={{ color: '#7bb3a5' }} /> {location.phone}</p>
                <p><FaClock style={{ color: '#7bb3a5' }} /> {location.hours}</p>
              </div>
              <button className="location-button">Get Directions</button>
            </div>
            );
          })}
        </div>
      </section>

      <section className="info-testimonials-section">
        <h2>What Our Customers Say</h2>
        <p className="info-section-subtitle">Don't just take our word for it - hear from our satisfied customers</p>
        <div className="info-testimonials-grid">
          {testimonials.map(testimonial => {
            const AvatarIcon = testimonial.avatar;
            return (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar" style={{ color: testimonial.color }}><AvatarIcon /></div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="star-icon" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
            );
          })}
        </div>
      </section>

      <section className="info-awards-section">
        <h2>Awards & Certifications</h2>
        <p className="info-section-subtitle">Recognized for excellence in baking and customer service</p>
        <div className="info-awards-grid">
          {awards.map(award => {
            const AwardIcon = award.icon;
            return (
              <div key={award.id} className="award-card">
                <div className="award-icon-wrapper">
                  <AwardIcon className="award-icon" />
                </div>
                <h3>{award.title}</h3>
                <p className="award-organization">{award.organization}</p>
                <span className="award-year">{award.year}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="info-services-section">
        <h2>Special Services</h2>
        <p className="info-section-subtitle">We offer a range of specialized services to make your celebrations extra special</p>
        <div className="info-services-grid">
          {specialServices.map(service => {
            const ServiceIcon = service.icon;
            return (
              <div key={service.id} className="service-card">
                <div className="service-icon-wrapper">
                  <ServiceIcon className="service-icon" />
                </div>
                <h3>{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="service-button">Learn More</button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="info-contact-section">
        <h2>Get In Touch</h2>
        <div className="info-contact-grid">
          <div className="contact-card">
            <FaEnvelope className="contact-icon" style={{ color: '#7bb3a5' }} />
            <h3>Email Us</h3>
            <p>info@slvbakery.com</p>
            <p>orders@slvbakery.com</p>
          </div>
          <div className="contact-card">
            <FaPhone className="contact-icon" style={{ color: '#5a8f82' }} />
            <h3>Call Us</h3>
            <p>Main: +91 {process.env.REACT_APP_PHONE_NUMBER}</p>
            <p>Orders: +91 {process.env.REACT_APP_SECONDARY_NUMBER}</p>
          </div>
          <div className="contact-card">
            <FaWhatsapp className="contact-icon" style={{ color: '#25D366' }} />
            <h3>WhatsApp</h3>
            <p>Quick orders & inquiries</p>
            <p>+91 {process.env.REACT_APP_SECONDARY_NUMBER}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Connections;
