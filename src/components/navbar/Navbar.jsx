import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiUser, 
  FiShoppingBag, 
  FiX, 
  FiMenu, 
  FiLogOut, 
  FiHome, 
  FiGrid, 
  FiPackage, 
  FiChevronRight
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gift_site_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gift_site_user');
      setUser(saved ? JSON.parse(saved) : null);
    } catch {
      setUser(null);
    }
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('gift_site_user');
    setUser(null);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-content">

          {/* Left Side: Mobile Hamburger Toggle + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Toggle (Visible on mobile/tablet < 1024px) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="navbar-mobile-toggle"
              aria-label="Toggle navigation menu"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <Link to="/" className="navbar-logo-group">
              <svg className="navbar-logo-mark" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 6 26 A 18 18 0 0 1 30 10" stroke="#2D2F36" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 6 20 A 12 12 0 0 1 22 10" stroke="#FF6584" strokeWidth="4" strokeLinecap="round" />
                <polygon points="26,4 34,4 30,12" fill="#FF6584" />
              </svg>
              <div className="navbar-logo-text-stack">
                <span className="navbar-logo-title">Gift</span>
                <span className="navbar-logo-sub">Craft</span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links (Visible on desktop >= 1024px) */}
          <nav className="navbar-nav">
            <Link to="/" className={`navbar-link ${isActive('/') ? 'navbar-link-active' : ''}`}>
              HOME
            </Link>
            <Link to="/products" className={`navbar-link ${isActive('/products') ? 'navbar-link-active' : ''}`}>
              PRODUCTS
            </Link>
            <Link to="/orders" className={`navbar-link ${isActive('/orders') ? 'navbar-link-active' : ''}`}>
              ORDERS
            </Link>
          </nav>

          {/* Right Action Bar (Auth, Cart) */}
          <div className="navbar-actions">
            {/* Auth Buttons: Show ONLY when user is NOT signed in */}
            {!user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link to="/login" className="nav-btn-login" title="Sign In">
                  <FiUser className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Sign In</span>
                </Link>
                <Link to="/register" className="nav-btn-register hidden sm:inline-flex" title="Register Account">
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              /* Signed In User Profile & Logout */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/orders"
                  className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full border border-[#FFD6E0] text-xs font-bold text-[#FF5C8D] transition-colors"
                  title="My Account / Orders"
                >
                  <FiUser className="w-3.5 h-3.5" />
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">{user.name || 'My Profile'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-[#64748B] hover:text-[#FF5C8D] rounded-full hover:bg-pink-50 transition-colors"
                  title="Sign Out"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button onClick={() => setIsCartOpen(true)} className="navbar-icon-btn" title="Shopping Cart">
              <FiShoppingBag className="navbar-icon" />
              {cartCount > 0 && <span className="navbar-badge">{cartCount}</span>}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Visible when open) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out Menu Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col justify-between p-6 overflow-y-auto border-r border-[#FFE4EC]">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#FFE4EC]">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="navbar-logo-group">
                  <svg className="navbar-logo-mark" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 6 26 A 18 18 0 0 1 30 10" stroke="#2D2F36" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M 6 20 A 12 12 0 0 1 22 10" stroke="#FF6584" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="26,4 34,4 30,12" fill="#FF6584" />
                  </svg>
                  <div className="navbar-logo-text-stack">
                    <span className="navbar-logo-title">Gift</span>
                    <span className="navbar-logo-sub">Craft</span>
                  </div>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#64748B] hover:text-[#FF5C8D] rounded-full hover:bg-pink-50"
                  aria-label="Close menu"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-nav-link ${isActive('/') ? 'mobile-nav-link-active' : ''}`}
                >
                  <FiHome className="w-4 h-4" />
                  <span>HOME</span>
                  <FiChevronRight className="w-4 h-4 ml-auto opacity-40" />
                </Link>

                <Link
                  to="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-nav-link ${isActive('/products') ? 'mobile-nav-link-active' : ''}`}
                >
                  <FiGrid className="w-4 h-4" />
                  <span>PRODUCTS</span>
                  <FiChevronRight className="w-4 h-4 ml-auto opacity-40" />
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-nav-link ${isActive('/orders') ? 'mobile-nav-link-active' : ''}`}
                >
                  <FiPackage className="w-4 h-4" />
                  <span>ORDERS</span>
                  <FiChevronRight className="w-4 h-4 ml-auto opacity-40" />
                </Link>
              </div>
            </div>

            {/* Footer Auth Section in Mobile Drawer */}
            <div className="pt-6 border-t border-[#FFE4EC] space-y-3">
              {!user ? (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl text-xs font-bold text-[#FF5C8D] bg-pink-50 border border-[#FFD6E0] hover:bg-pink-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiUser className="w-4 h-4" /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF5C8D] to-[#E84393] shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Register New Account</span>
                  </Link>
                </div>
              ) : (
                <div className="bg-pink-50 p-4 rounded-2xl border border-[#FFD6E0] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FF5C8D] text-white flex items-center justify-center font-bold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#23272A] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#64748B] truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-white text-[#FF5C8D] hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold border border-[#FFD6E0] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FiLogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
