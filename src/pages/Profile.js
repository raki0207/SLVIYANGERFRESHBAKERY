import React, { useState, useEffect } from 'react';
import './Profile.css';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaMapPin } from 'react-icons/fa';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        
        if (user) {
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError('User profile not found');
          }
        } else {
          setError('Please login to view your profile');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <h1>{userData?.name || 'User'}</h1>
          <p className="profile-member-since">
            Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              {/* <button className="edit-btn">
                <FaEdit /> Edit Profile
              </button> */}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <FaUser />
                </div>
                <div className="info-details">
                  <label>Full Name</label>
                  <p>{userData?.name || 'N/A'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-details">
                  <label>Email Address</label>
                  <p>{userData?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <div className="info-details">
                  <label>Phone Number</label>
                  <p>{userData?.phoneNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-details">
                  <label>Address</label>
                  <p>{userData?.address || 'N/A'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaCity />
                </div>
                <div className="info-details">
                  <label>City</label>
                  <p>{userData?.city || 'N/A'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-details">
                  <label>State</label>
                  <p>{userData?.state || 'N/A'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaMapPin />
                </div>
                <div className="info-details">
                  <label>Pincode</label>
                  <p>{userData?.pincode || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional sections can be added here */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Account Settings</h2>
            </div>
            <div className="settings-grid">
              <button className="setting-btn">Change Password</button>
              <button className="setting-btn">Privacy Settings</button>
              <button className="setting-btn">Notification Preferences</button>
              <button className="setting-btn danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

