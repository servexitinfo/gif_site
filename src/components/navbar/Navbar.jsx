import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiX, FiMenu } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, setIsCartOpen, isSearchOpen, setIsSearchOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

          {/* Center Links (HOME, PRODUCT, BLOG, PORTFOLIO) */}
          <nav className="navbar-nav">
            <Link to="/" className={`navbar-link ${isActive('/') ? 'navbar-link-active' : ''}`}>
              HOME
            </Link>
            <Link to="/products" className={`navbar-link ${isActive('/products') ? 'navbar-link-active' : ''}`}>
              PRODUCT
            </Link>
            <Link to="/product/sofa-hollis-2" className={`navbar-link ${isActive('/product/sofa-hollis-2') ? 'navbar-link-active' : ''}`}>
              BLOG
            </Link>
            <Link to="/orders" className={`navbar-link ${isActive('/orders') ? 'navbar-link-active' : ''}`}>
              PORTFOLIO
            </Link>
          </nav>

          {/* Right Action Bar (Search, Account, Cart) */}
          <div className="navbar-actions">
            {/* Search */}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="navbar-icon-btn" title="Search">
              <FiSearch className="navbar-icon" />
            </button>

            {/* Account */}
            <Link to="/login" className="navbar-icon-btn" title="Account">
              <FiUser className="navbar-icon" />
            </Link>

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} className="navbar-icon-btn" title="Cart">
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
        <div className="md:hidden bg-white border-b border-[#FFAEBC] px-6 py-4 space-y-3 shadow-lg">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block navbar-link text-[#FF6584]">
            HOME
          </Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block navbar-link">
            PRODUCT
          </Link>
          <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block navbar-link">
            BLOG
          </Link>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block navbar-link">
            PORTFOLIO
          </Link>
          {/* //test */}
        </div>
      )}
    </header>
  );
}
