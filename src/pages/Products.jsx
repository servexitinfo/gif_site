import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiGrid, FiList, FiStar, FiHeart, FiShoppingBag, FiGift, FiZap } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Products.css';

export default function Products() {
  const navigate = useNavigate();
  const { products, addToCart, wishlist, toggleWishlist } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['All', 'Parents', 'Couple', 'Friends', 'Children', 'Colleague'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-[#FFE4EC] text-[#FF5C8D] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          <FiGift className="w-4 h-4" /> Gift Showcase
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#23272A]">Explore All Gift Collections</h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Find the perfect present for birthdays, anniversaries, corporate celebrations, and special family moments.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-[#FFE4EC]">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#FF5C8D] text-white shadow-md'
                  : 'bg-white text-[#64748B] hover:text-[#FF5C8D] border border-[#FFE4EC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Layout Actions */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div className="relative flex-1 lg:w-64 bg-white rounded-full px-4 py-2 flex items-center gap-2 border border-[#FFD6E0]">
            <FiSearch className="w-4 h-4 text-[#FF5C8D]" />
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#23272A] focus:outline-none w-full placeholder-[#94A3B8]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border transition-colors ${
                viewMode === 'grid' ? 'bg-[#FF5C8D] text-white border-[#FF5C8D]' : 'bg-white text-[#64748B] border-[#FFE4EC]'
              }`}
              title="Grid View"
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border transition-colors ${
                viewMode === 'list' ? 'bg-[#FF5C8D] text-white border-[#FF5C8D]' : 'bg-white text-[#64748B] border-[#FFE4EC]'
              }`}
              title="List View"
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Catalog Display */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#FFE4EC] space-y-4">
          <p className="text-base text-[#64748B]">No gifts found matching "{searchQuery}".</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="btn-outline-pink">
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <div key={p.id} className="gift-card p-5 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-pink-50 mb-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(p.id || p._id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#FF5C8D] hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
                    title="Save to Wishlist"
                  >
                    <FiHeart className={`w-4 h-4 ${wishlist.includes(p.id || p._id) ? 'fill-[#FF5C8D] text-[#FF5C8D]' : ''}`} />
                  </button>
                </div>

                <span className="text-[10px] font-bold text-[#FF5C8D] uppercase tracking-widest">{p.category}</span>
                <Link to={`/product/${p.id}`} className="block mt-1">
                  <h3 className="font-heading text-lg font-bold text-[#23272A] group-hover:text-[#FF5C8D] transition-colors">
                    {p.name}
                  </h3>
                </Link>
                <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2">{p.desc}</p>
              </div>

              <div className="flex flex-col gap-2.5 pt-4 border-t border-[#FFE4EC] mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-[#FF5C8D]">₹{p.price}.00</span>
                    {p.originalPrice && (
                      <span className="text-xs text-[#94A3B8] line-through ml-2">₹{p.originalPrice}.00</span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">In Stock</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart({ ...p, quantity: 1, color: 'Pink', size: 'Standard' })}
                    className="flex-1 btn-outline-pink py-2 text-xs font-bold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/express-buy/${p.id}`)}
                    className="flex-1 btn-pink py-2 text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <FiZap className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="gift-card p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-56 aspect-4/3 rounded-2xl overflow-hidden bg-pink-50 flex-shrink-0">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <span className="text-[10px] font-bold text-[#FF5C8D] uppercase tracking-widest">{p.category}</span>
                <Link to={`/product/${p.id}`}>
                  <h3 className="font-heading text-xl font-bold text-[#23272A] hover:text-[#FF5C8D] transition-colors">{p.name}</h3>
                </Link>
                <p className="text-xs text-[#64748B]">{p.desc}</p>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <FiStar className="fill-amber-400 w-3.5 h-3.5" />
                  <span className="font-bold text-[#23272A] ml-1">{p.rating}</span>
                  <span className="text-[#94A3B8]">({p.reviews} reviews)</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 space-y-3">
                <div className="text-xl font-bold text-[#FF5C8D]">₹{p.price}.00</div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => addToCart({ ...p, quantity: 1, color: 'Pink', size: 'Standard' })}
                    className="btn-outline-pink py-2 px-5 text-xs font-bold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/express-buy/${p.id}`)}
                    className="btn-pink py-2 px-5 text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <FiZap className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
