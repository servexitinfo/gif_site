import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Home.css';

import heroKraftBlackRibbon from '../assets/hero_kraft_black_ribbon.png';
import catParents from '../assets/cat_parents.png';
import catCouple from '../assets/cat_couple.png';
import catFriends from '../assets/cat_friends.png';
import catChildren from '../assets/cat_children.png';
import catColleague from '../assets/cat_colleague.png';

import productFlowerVase from '../assets/product_flower_vase.png';
import sofaMain from '../assets/sofa_main.png';
import sofaSide from '../assets/sofa_side.png';
import chairMarlow from '../assets/chair_marlow.png';
import tableBowen from '../assets/table_bowen.png';
import lampAlder from '../assets/lamp_alder.png';

export default function Home() {
  const { products, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('Popular');
  const displayProducts = products || [];

  return (
    <div className="home-container">
      
      {/* 1. HERO BANNER SECTION (ARRANGED PROPERLY MATCHING SCREENSHOT) */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 relative pt-4 space-y-6">
              
              {/* Balloon Heart Accent Doodle Top Left */}
              <div className="hero-doodle-accent">
                <svg className="w-10 h-10 text-[#FF5C8D]" viewBox="0 0 40 40" fill="none">
                  <path d="M20 30 C 14 30, 10 24, 10 17 C 10 10, 14 6, 20 6 C 26 6, 30 10, 30 17 C 30 24, 26 30, 20 30 Z" fill="#FFE4EC" stroke="#FF5C8D" strokeWidth="2" />
                  <path d="M20 30 L 20 33 L 18 35 L 22 35 Z" fill="#FF5C8D" />
                  <path d="M20 35 C 16 38, 22 40, 18 44" stroke="#FF5C8D" strokeWidth="1.5" strokeDasharray="2 2" />
                </svg>
              </div>

              {/* Stacked Main Headline */}
              <h1 className="hero-title">
                Gift For Your <br />
                <span className="hero-title-pink">Beloved</span> <br />
                <span className="hero-title-pink">Family</span>
              </h1>

              {/* Subhead Paragraph */}
              <p className="hero-subtext">
                Priding ourselves on the quality, bold colours and sustainability of our products, will give you a boost of confidence
              </p>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-4 pt-2">
                <Link to="/products" className="hero-btn-pink">
                  Shop Now
                </Link>
                <Link to="/products" className="hero-btn-outline">
                  Explore More
                </Link>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              
              {/* Coiled Twine Ribbon Top Right */}
              <div className="hero-twine-accent hidden sm:block">
                <svg className="w-24 h-24 text-[#8C6D46]" viewBox="0 0 100 100" fill="none">
                  <path d="M 20 40 C 40 10, 80 20, 60 50 C 40 80, 20 60, 50 30 C 70 10, 90 40, 80 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              <div className="hero-image-card">
                <img
                  src={heroKraftBlackRibbon}
                  alt="Gift For Your Beloved Family"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CHOOSE YOUR GIFT SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="category-section-title">CHOOSE YOUR GIFT</h2>
        <p className="category-subhead">
          Priding ourselves on the quality, bold colours and sustainability of our products, will give you a boost of confidence
        </p>

        {/* 5 Recipient Cards + 1 Action Button Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Parents */}
          <Link to="/products" className="category-card group">
            <div className="overflow-hidden aspect-[4/3] w-full flex items-center justify-center bg-[#F8F0F5]">
              <img src={catParents} alt="Parents Gift" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="category-card-footer">
              <span className="category-card-name">Parents</span>
              <span className="category-arrow">────────→</span>
            </div>
          </Link>

          {/* Couple */}
          <Link to="/products" className="category-card group">
            <div className="overflow-hidden aspect-[4/3] w-full flex items-center justify-center bg-[#F8F0F5]">
              <img src={catCouple} alt="Couple Gift" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="category-card-footer">
              <span className="category-card-name">Couple</span>
              <span className="category-arrow">────────→</span>
            </div>
          </Link>

          {/* Friends */}
          <Link to="/products" className="category-card group">
            <div className="overflow-hidden aspect-[4/3] w-full flex items-center justify-center bg-[#F8F0F5]">
              <img src={catFriends} alt="Friends Gift" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="category-card-footer">
              <span className="category-card-name">Friends</span>
              <span className="category-arrow">────────→</span>
            </div>
          </Link>

          {/* Children */}
          <Link to="/products" className="category-card group">
            <div className="overflow-hidden aspect-[4/3] w-full flex items-center justify-center bg-[#F8F0F5]">
              <img src={catChildren} alt="Children Gift" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="category-card-footer">
              <span className="category-card-name">Children</span>
              <span className="category-arrow">────────→</span>
            </div>
          </Link>

          {/* Colleague */}
          <Link to="/products" className="category-card group">
            <div className="overflow-hidden aspect-[4/3] w-full flex items-center justify-center bg-[#F8F0F5]">
              <img src={catColleague} alt="Colleague Gift" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="category-card-footer">
              <span className="category-card-name">colleague</span>
              <span className="category-arrow">────────→</span>
            </div>
          </Link>

          {/* CTA Button Card */}
          <div className="flex items-center justify-center p-4 sm:p-6">
            <Link to="/products" className="hero-btn-pink w-full sm:w-auto py-3.5 px-8 text-sm justify-center rounded-xl shadow-md hover:shadow-lg transition-all">
              Shop Now ──────→
            </Link>
          </div>

        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION (Hides automatically if no products in DB) */}
      {displayProducts && displayProducts.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <h2 className="products-section-title">FEATURED PRODUCTS</h2>

          {/* Filter Navigation Tabs */}
          <div className="products-filter-tabs">
            <span
              onClick={() => setActiveTab('New Arrivals')}
              className={activeTab === 'New Arrivals' ? 'products-filter-tab-active' : 'products-filter-tab-inactive'}
            >
              New Arrivals
            </span>
            <span className="filter-dash">────</span>
            <span
              onClick={() => setActiveTab('Popular')}
              className={activeTab === 'Popular' ? 'products-filter-tab-active' : 'products-filter-tab-inactive'}
            >
              Popular
            </span>
            <span className="filter-dash">────</span>
            <span
              onClick={() => setActiveTab('Best sells')}
              className={activeTab === 'Best sells' ? 'products-filter-tab-active' : 'products-filter-tab-inactive'}
            >
              Best sells
            </span>
            <span className="filter-dash">────</span>
            <span
              onClick={() => setActiveTab('Special')}
              className={activeTab === 'Special' ? 'products-filter-tab-active' : 'products-filter-tab-inactive'}
            >
              Special
            </span>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((p) => (
              <div key={p.id || p._id} className="product-card">
                <div className="relative">
                  
                  {/* Top Right Hanging Pink Ribbon Tag */}
                  {(p.isFeatured || p.hasRibbon) && (
                    <div className="product-ribbon-tag" title="Special Featured Gift">
                      <span className="product-ribbon-text">FEATURED</span>
                    </div>
                  )}

                  <Link to={`/product/${p.id || p._id}`} className="block">
                    <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-pink-50/60 mb-3 relative flex items-center justify-center p-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <h3 className="product-title hover:text-[#FF5C8D] transition-colors">{p.name}</h3>
                  </Link>

                  {/* Pink Rating Stars */}
                  <div className="product-stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={i < (p.rating || 5) ? 'fill-[#FF5C8D] text-[#FF5C8D]' : 'text-slate-300'}
                      />
                    ))}
                  </div>
                </div>

                {/* Price & Buy Now Button */}
                <div className="product-price-row">
                  <div>
                    {p.originalPrice && (
                      <span className="product-price-original">₹{p.originalPrice}.00</span>
                    )}
                    <span className="product-price">₹{p.price}.00</span>
                  </div>
                  <button
                    onClick={() => addToCart({ id: p.id || p._id, name: p.name, price: p.price, image: p.image, quantity: 1, color: 'Standard', size: 'Standard' })}
                    className="product-buy-btn"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}

            {/* View All Product CTA Card */}
            <div className="view-all-card">
              <Link to="/products" className="view-all-btn">
                View All Product ──────→
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
