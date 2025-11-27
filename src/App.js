import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Login from './components/Login';
import Home from './pages/index';
import About from './pages/About';
import Products from './pages/Products';
import Connections from './pages/Connections';
import ContactUs from './pages/ContactUs';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import ProductManagement from './pages/ProductManagement';
import AdminOrders from './pages/AdminOrders';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LikedProductsProvider } from './context/LikedProductsContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { FloatingButtonsProvider } from './context/FloatingButtonsContext';

const ADMIN_SESSION_KEY = 'raki_admin_session';

// Protected Admin Route Component
function ProtectedAdminRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const isAdminSession = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';

  if (!isLoggedIn || !isAdminSession) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
}

// Inner component that uses useNavigate - must be inside Router
function AppContentInner() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // Load admin status from localStorage on mount
  useEffect(() => {
    const storedAdminStatus = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    setIsAdminSession(storedAdminStatus);
  }, []);

  // Clear admin status if user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setIsAdminSession(false);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, [isLoggedIn]);

  // Update localStorage when admin status changes
  useEffect(() => {
    if (isAdminSession && isLoggedIn) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, [isAdminSession, isLoggedIn]);

  const handleCloseLogin = () => setShowLogin(false);
  const handleOpenLogin = () => setShowLogin(true);
  const handleLoginSuccess = (_, meta = {}) => {
    const adminSignedIn = Boolean(meta?.admin);

    setIsAdminSession(adminSignedIn);
    setShowLogin(false);

    if (adminSignedIn) {
      navigate('/admin/products');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAdminSession(false);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setShowLogin(true);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <LikedProductsProvider>
      <CartProvider>
        <FloatingButtonsProvider>
          <div className="App">

            <Navbar
              onLoginClick={handleOpenLogin}
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
              isAdminSession={isAdminSession}
            />

            {showLogin && (
              <Login
                onClose={handleCloseLogin}
                onLoginSuccess={handleLoginSuccess}
              />
            )}

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedAdminRoute>
                      <ProductManagement />
                    </ProtectedAdminRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <ProtectedAdminRoute>
                      <AdminOrders />
                    </ProtectedAdminRoute>
                  } 
                />
              </Routes>
            </main>

            <ScrollToTop />
            <Footer />

          </div>
        </FloatingButtonsProvider>
      </CartProvider>
    </LikedProductsProvider>
  );
}

function AppContent() {
  return (
    // IMPORTANT FIX FOR GITHUB PAGES
    <Router basename="/SLVIYANGERFRESHBAKERY">
      <AppContentInner />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
