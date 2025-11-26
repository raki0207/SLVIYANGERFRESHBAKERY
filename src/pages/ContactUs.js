import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactUs.css';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const ContactUs = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
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
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="contact-content">
        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us more about your inquiry..."
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

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="map-section">
          <h2>Find Us On The Map</h2>
          <p>Visit our office for a face-to-face meeting</p>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.28367039015467!2d75.23435975718158!3d14.625333239434381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb959245c10fcc9%3A0x54c2421c9ffcd803!2sNEW%20MODERN%20MEN&#39;S%20PARLOUR!5e0!3m2!1sen!2sin!4v1763625514795!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Raki Bakery Location"
            ></iframe>
          </div>
        </div>
      </div>



      {/* Get in Touch Section */}
      <div className="get-in-touch-section">
        <div className="touch-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers and experience the difference. Our team is ready to help you achieve your goals.</p>
          <div className="touch-buttons">
            <button className="touch-btn secondary" onClick={() => navigate('/products')}>
              View Products
            </button>
          </div>
          <div className="touch-info">
            <div className="touch-info-item">
              <span className="touch-info-icon"><FaEnvelope /></span>
              <span>info@company.com</span>
            </div>
            <div className="touch-info-item">
              <span className="touch-info-icon"><FaPhone /></span>
              <span>+91 {process.env.REACT_APP_PHONE_NUMBER}</span>
            </div>
            <div className="touch-info-item">
              <span className="touch-info-icon"><FaMapMarkerAlt /></span>
              <span>123 Business Street, Tech City</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
