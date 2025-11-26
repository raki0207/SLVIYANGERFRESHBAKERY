import React, { useState, useEffect, useCallback } from 'react';
import './Login.css';
import { auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login = ({ onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [adminAccessGranted, setAdminAccessGranted] = useState(false);
  const [adminNotice, setAdminNotice] = useState({ text: '', tone: 'info' });

  const ADMIN_ACCESS_KEY = process.env.REACT_APP_ADMIN_ACCESS_KEY || 'raki-admin-panel';

  // Array of images for the carousel
  const images = [
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80'
  ];

  // Auto-scroll images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const toggleAdminMode = useCallback(() => {
    setIsAdminMode((prev) => {
      const next = !prev;

      if (next) {
        setIsSignUp(false);
      } else {
        setAdminSecretKey('');
        setAdminAccessGranted(false);
      }

      setAdminNotice({
        text: next ? 'Admin portal unlocked. Enter the secret key to proceed.' : 'Admin portal hidden.',
        tone: next ? 'success' : 'info'
      });

      return next;
    });
  }, [setIsSignUp]);

  const handleAdminUnlock = useCallback(() => {
    if (adminSecretKey.trim() === ADMIN_ACCESS_KEY) {
      setAdminAccessGranted(true);
      setAdminNotice({
        text: 'Admin key accepted. Continue with your admin credentials.',
        tone: 'success'
      });
    } else {
      setAdminAccessGranted(false);
      setAdminNotice({
        text: 'Invalid admin key.',
        tone: 'error'
      });
    }
  }, [adminSecretKey, ADMIN_ACCESS_KEY]);

  useEffect(() => {
    const handleSecretToggle = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        toggleAdminMode();
      }
    };

    window.addEventListener('keydown', handleSecretToggle);
    return () => window.removeEventListener('keydown', handleSecretToggle);
  }, [toggleAdminMode]);

  useEffect(() => {
    if (!adminNotice.text) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setAdminNotice({ text: '', tone: 'info' });
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [adminNotice]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail, {
        url: window.location.origin,
        handleCodeInApp: false
      });
      setResetMessage('Password reset email sent successfully! Please check your inbox and spam folder.');
      console.log('Password reset email sent to:', resetEmail);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetMessage('');
      }, 5000);
    } catch (error) {
      console.error('Password reset error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      switch (error.code) {
        case 'auth/invalid-email':
          setResetError('Invalid email address format.');
          break;
        case 'auth/user-not-found':
          setResetError('No account found with this email address.');
          break;
        case 'auth/network-request-failed':
          setResetError('Network error. Please check your internet connection.');
          break;
        case 'auth/too-many-requests':
          setResetError('Too many requests. Please try again later.');
          break;
        case 'auth/missing-continue-uri':
          setResetError('Configuration error. Please contact support.');
          break;
        default:
          setResetError(`Error: ${error.message || 'Failed to send reset email. Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (isAdminMode && !adminAccessGranted) {
      setError('Enter the correct admin key before logging in.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Logic
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password should be at least 6 characters');
          setLoading(false);
          return;
        }

        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Update user profile with name
        if (formData.name) {
          await updateProfile(userCredential.user, {
            displayName: formData.name
          });
        }

        // Save additional user information to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          createdAt: new Date().toISOString()
        });

        // Send email verification
        try {
          await sendEmailVerification(userCredential.user, {
            url: window.location.origin,
            handleCodeInApp: false
          });
        } catch (verificationError) {
          console.error('Error sending verification email:', verificationError);
          // Still sign out the user, but show a warning
          await signOut(auth);
          setError('Account created, but failed to send verification email. Please contact support.');
          setLoading(false);
          return;
        }

        // Sign out the user so they must verify email before logging in
        await signOut(auth);

        console.log('User signed up successfully:', userCredential.user);
        
        // Clear form data except email for convenience
        const userEmail = formData.email;
        setFormData({
          email: userEmail, // Keep email for convenience
          password: '',
          confirmPassword: '',
          name: '',
          phoneNumber: '',
          address: '',
          city: '',
          state: '',
          pincode: ''
        });
        
        // Switch to login mode immediately
        setIsSignUp(false);
        setError('');
        setSuccessMessage('Account created successfully! A verification email has been sent to your inbox. Please check your email (including spam folder) and verify your email address before logging in.');
        
        // Clear success message after 8 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 8000);
      } else {
        // Login Logic
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          // Sign out the user since email is not verified
          await signOut(auth);
          setError('Please verify your email before logging in. Check your inbox (and spam folder) for the verification email sent during signup.');
          setLoading(false);
          return;
        }

        console.log('User logged in successfully:', userCredential.user);
        
        // Trigger login success callback
        if (onLoginSuccess) {
          onLoginSuccess(userCredential.user, { admin: isAdminMode });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        {/* Image Carousel Section */}
        <div className="login-image-section" onDoubleClick={toggleAdminMode}>
          <div className="image-carousel">
            {images.map((image, index) => (
              <div
                key={index}
                className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Login Form Section */}
        <div className="login-container">
          <h2>{isAdminMode ? 'Admin Login' : (isSignUp ? 'Sign Up' : 'Login')}</h2>

          {isAdminMode && (
            <div className={`admin-mode-banner ${adminAccessGranted ? 'granted' : 'locked'}`}>
              {adminAccessGranted ? 'Admin mode unlocked. Use admin account credentials.' : 'Admin mode locked. Provide the secret key to continue.'}
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          {adminNotice.text && (
            <div className={`admin-notice ${adminNotice.tone}`}>
              {adminNotice.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {isAdminMode && (
              <div className="form-group admin-secret-form">
                <label htmlFor="adminKey">Admin Access Key</label>
                <div className="admin-secret-input-group">
                  <input
                    type="password"
                    id="adminKey"
                    name="adminKey"
                    value={adminSecretKey}
                    onChange={(e) => setAdminSecretKey(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAdminUnlock();
                      }
                    }}
                    placeholder="Enter admin access key"
                  />
                  <button
                    type="button"
                    className="admin-secret-btn"
                    onClick={handleAdminUnlock}
                  >
                    Unlock
                  </button>
                </div>
              </div>
            )}

            {isSignUp && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter your pincode"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {!isSignUp && (
                <div className="forgot-password" onClick={() => setShowForgotPassword(true)}>
                  Forgot Password?
                </div>
              )}
            </div>
            
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (isSignUp ? 'Signing Up...' : 'Logging In...') : (isSignUp ? 'Sign Up' : 'Login')}
            </button>
          </form>
          
          <div className="toggle-form">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <span
                className={isAdminMode ? 'disabled-toggle' : ''}
                onClick={() => {
                  if (isAdminMode) return;
                  setIsSignUp(!isSignUp);
                }}
              >
                {isSignUp ? ' Login' : ' Sign Up'}
              </span>
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="terms-section">
            <p>
              By continuing, you agree to our{' '}
              <a href={`${process.env.PUBLIC_URL}/termsandconditions.html`} target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href={`${process.env.PUBLIC_URL}/policy.html`} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Forgot Password Popup */}
        {showForgotPassword && (
          <div className="forgot-password-overlay" onClick={() => setShowForgotPassword(false)}>
            <div className="forgot-password-popup" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn-popup" onClick={() => setShowForgotPassword(false)}>×</button>
              <h3>Reset Password</h3>
              <p className="popup-description">Please enter your email address</p>
              
              {resetError && <div className="error-message">{resetError}</div>}
              {resetMessage && <div className="success-message">{resetMessage}</div>}
              
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
