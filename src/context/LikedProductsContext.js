import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const LikedProductsContext = createContext();

export const useLikedProducts = () => {
  const context = useContext(LikedProductsContext);
  if (!context) {
    throw new Error('useLikedProducts must be used within a LikedProductsProvider');
  }
  return context;
};

export const LikedProductsProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load liked products from Firestore when user logs in
  useEffect(() => {
    const loadLikesFromFirestore = async () => {
      if (!currentUser) {
        // Clear likes when user logs out
        setLikedProducts([]);
        return;
      }

      setLoading(true);
      try {
        const likesRef = doc(db, 'favorites', currentUser.uid);
        const likesDoc = await getDoc(likesRef);
        
        if (likesDoc.exists()) {
          const likesData = likesDoc.data();
          setLikedProducts(likesData.products || []);
          console.log('Favorites loaded from Firestore');
        } else {
          // No favorites exist yet, initialize empty
          setLikedProducts([]);
        }
      } catch (error) {
        console.error('Error loading favorites from Firestore:', error);
        setLikedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadLikesFromFirestore();
  }, [currentUser]);

  // Save liked products to Firestore whenever they change
  const saveLikesToFirestore = async (products) => {
    if (!currentUser) return;

    try {
      const likesRef = doc(db, 'favorites', currentUser.uid);
      await setDoc(likesRef, {
        products: products,
        userId: currentUser.uid,
        updatedAt: new Date().toISOString()
      });
      console.log('Favorites saved to Firestore');
    } catch (error) {
      console.error('Error saving favorites to Firestore:', error);
    }
  };

  const toggleLike = async (product) => {
    if (!currentUser) {
      showNotification('Please login to add favorites', 'warning');
      return;
    }

    const newLikedProducts = (() => {
      const isLiked = likedProducts.some(p => p.id === product.id);
      if (isLiked) {
        return likedProducts.filter(p => p.id !== product.id);
      } else {
        return [...likedProducts, product];
      }
    })();

    setLikedProducts(newLikedProducts);
    await saveLikesToFirestore(newLikedProducts);
  };

  const isLiked = (productId) => {
    return likedProducts.some(p => p.id === productId);
  };

  const clearAllLikes = async () => {
    if (!currentUser) return;

    setLikedProducts([]);
    try {
      const likesRef = doc(db, 'favorites', currentUser.uid);
      await deleteDoc(likesRef);
      console.log('Favorites cleared from Firestore');
    } catch (error) {
      console.error('Error clearing favorites from Firestore:', error);
    }
  };

  const value = {
    likedProducts,
    toggleLike,
    isLiked,
    clearAllLikes,
    likedCount: likedProducts.length,
    loading
  };

  return (
    <LikedProductsContext.Provider value={value}>
      {children}
    </LikedProductsContext.Provider>
  );
};
