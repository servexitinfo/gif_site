import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiX, FiMenu, FiLogOut } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, setIsCartOpen, isSearchOpen, setIsSearchOpen } = useCart();
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

  const handleLogout = () => {
    localStorage.removeItem('gift_site_user');
    setUser(null);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-content">

          {/* Mobile Hamburger Toggle (Hidden on desktop) */}
          <div className="navbar-mobile-toggle md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="navbar-icon-btn p-1.5"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
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

          {/* Center Links (HOME, PRODUCTS, ORDERS) */}
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

          {/* Right Action Bar (Search, Auth / Profile, Cart) */}
          <div className="navbar-actions">
            {/* Search */}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="navbar-icon-btn" title="Search">
              <FiSearch className="navbar-icon" />
            </button>

            {/* Auth Buttons: Show ONLY when user is NOT signed in */}
            {!user ? (
              <>
                <Link to="/login" className="nav-btn-login" title="Sign In">
                  <FiUser className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="nav-btn-register hidden sm:inline-flex" title="Register Account">
                  <span>Register</span>
                </Link>
              </>
            ) : (
              /* Signed In User Profile & Logout */
              <div className="flex items-center gap-2">
                <Link
                  to="/orders"
                  className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full border border-[#FFD6E0] text-xs font-bold text-[#FF5C8D] transition-colors"
                  title="My Account / Orders"
                >
                  <FiUser className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{user.name || 'My Profile'}</span>
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

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} className="navbar-icon-btn ml-1" title="Cart">
              <FiShoppingBag className="navbar-icon" />
              {cartCount > 0 && <span className="navbar-badge">{cartCount}</span>}
            </button>
          </div>

        </div>
      </div>

      {/* Search Input Overlay */}
      {isSearchOpen && (
        <div className="bg-[#FFAEBC] px-4 py-3 border-t border-[#FF9AA2]">
          <div className="max-w-xl mx-auto flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
            <FiSearch className="w-5 h-5 text-[#FF6584]" />
            <input
              type="text"
              placeholder="Search gifts..."
              autoFocus
              className="w-full bg-transparent text-xs text-[#23272A] focus:outline-none placeholder-[#94A3B8]"
            />
            <button onClick={() => setIsSearchOpen(false)} className="text-xs font-bold text-[#FF6584] uppercase">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#FFAEBC] px-6 py-5 space-y-4 shadow-lg">
          <div className="space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block navbar-link ${isActive('/') ? 'text-[#FF5C8D] font-bold' : ''}`}
            >
              HOME
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block navbar-link ${isActive('/products') ? 'text-[#FF5C8D] font-bold' : ''}`}
            >
              PRODUCTS
            </Link>
            <Link
              to="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block navbar-link ${isActive('/orders') ? 'text-[#FF5C8D] font-bold' : ''}`}
            >
              ORDERS
            </Link>
          </div>

          <div className="pt-3 border-t border-[#FFE4EC]">
            {!user ? (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl text-xs font-bold text-[#FF5C8D] bg-pink-50 border border-[#FFD6E0] hover:bg-pink-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF5C8D] to-[#E84393] shadow-sm hover:brightness-105 transition-all"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-pink-50 p-3 rounded-2xl border border-[#FFD6E0]">
                <div className="flex items-center gap-2">
                  <FiUser className="text-[#FF5C8D] w-4 h-4" />
                  <span className="text-xs font-bold text-[#23272A]">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-[#FF5C8D] underline"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
