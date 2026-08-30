import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiCheck, FiStar, FiChevronRight, FiGift, FiTruck, FiShield, FiZap, FiArrowLeft } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/api';
import './ProductDetails.css';

// Import local image assets for fallback gallery
import sofaMain from '../assets/sofa_main.png';
import sofaSide from '../assets/sofa_side.png';
import sofaDetail from '../assets/sofa_detail.png';
import sofaRoom from '../assets/sofa_room.png';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProductById, addToCart, wishlist, toggleWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gallery State
  const [selectedImage, setSelectedImage] = useState(0);

  // Customization State
  const [selectedColor, setSelectedColor] = useState('Pink Ribbon');
  const [selectedSize, setSelectedSize] = useState('Deluxe Box');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      // Try local store first
      let target = getProductById(id) || products.find(p => p.id === id || p._id === id);
      if (!target && id) {
        // Try fetching from API
        target = await apiService.getProductById(id);
      }
      setProduct(target || products[0] || null);
      setLoading(false);
    }
    loadProduct();
  }, [id, products]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#FF5C8D] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-[#64748B] font-bold">Loading gift details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <FiGift className="w-12 h-12 text-[#FF5C8D] mx-auto" />
        <h2 className="font-heading text-2xl font-bold text-[#23272A]">Product Not Found</h2>
        <p className="text-xs text-[#64748B]">The requested gift item could not be loaded.</p>
        <Link to="/products" className="btn-pink inline-flex items-center gap-2">
          Browse All Gifts
        </Link>
      </div>
    );
  }

  const images = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : [sofaMain, sofaSide, sofaDetail, sofaRoom]);

  const getPrice = () => {
    const basePrice = product.price || 95;
    const baseOriginal = product.originalPrice || basePrice * 1.25;
    switch (selectedSize) {
      case 'Grand Hamper': return { current: Math.round(basePrice * 1.5), original: Math.round(baseOriginal * 1.5) };
      case 'Premium Box': return { current: Math.round(basePrice * 1.2), original: Math.round(baseOriginal * 1.2) };
      case 'Deluxe Box':
      default: return { current: basePrice, original: Math.round(baseOriginal) };
    }
  };

  const priceInfo = getPrice();
  const productId = product.id || product._id || id;
  const isWishlisted = wishlist.includes(productId);

  const colors = [
    { name: 'Pink Ribbon', hex: '#FF5C8D' },
    { name: 'Gold Satin', hex: '#EAB308' },
    { name: 'Rose Red', hex: '#F43F5E' },
    { name: 'Pastel Blue', hex: '#38BDF8' },
  ];

  const sizes = ['Deluxe Box', 'Premium Box', 'Grand Hamper'];

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: `${product.name} (${selectedSize})`,
      price: priceInfo.current,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: images[0]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#64748B] mb-8 font-medium">
        <Link to="/" className="hover:text-[#FF5C8D] transition-colors">Home</Link>
        <FiChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <Link to="/products" className="hover:text-[#FF5C8D] transition-colors">{product.category || 'Gifts'}</Link>
        <FiChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <span className="text-[#23272A] font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16">
        
        {/* Left Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] sm:aspect-square bg-pink-50/60 rounded-3xl overflow-hidden shadow-lg border border-[#FFE4EC] group flex items-center justify-center p-3">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain object-center transition-all duration-500 transform group-hover:scale-105"
            />
            
            <span className="absolute top-5 left-5 bg-[#FF5C8D] text-white text-[11px] font-bold tracking-wider px-3.5 py-1.5 rounded-full shadow-md uppercase z-10">
              {product.category || 'Special Gift'} Edition
            </span>

            <button
              onClick={() => toggleWishlist(productId)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#FF5C8D] hover:bg-white transition-all hover:scale-110 z-10"
              title="Save to Wishlist"
            >
              <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-[#FF5C8D] text-[#FF5C8D]' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all bg-pink-50/60 flex items-center justify-center p-1.5 ${
                  selectedImage === idx
                    ? 'border-[#FF5C8D] ring-2 ring-[#FF5C8D]/20 scale-95'
                    : 'border-transparent hover:border-[#FFD6E0]'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Product Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5C8D]">{product.category || 'Signature'} Collection</span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#23272A] mt-1 mb-2">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              {product.desc || 'Handcrafted presentation box wrapped with silk satin ribbon, plush interior lining, and personalized gift note.'}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex text-amber-400 space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-3.5 h-3.5" />
              ))}
            </div>
            <span className="font-bold text-[#23272A]">{product.rating || 5.0}</span>
            <span className="text-[#94A3B8]">({product.reviews || 48} reviews)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center space-x-3 pt-1">
            <span className="text-3xl font-bold text-[#FF5C8D] font-sans">
              ₹{priceInfo.current}.00
            </span>
            {priceInfo.original && (
              <span className="text-sm text-[#94A3B8] line-through">
                ₹{priceInfo.original}.00
              </span>
            )}
            <span className="bg-[#FFE4EC] text-[#FF5C8D] text-xs font-bold px-3 py-1 rounded-full">
              Special Gift Price
            </span>
          </div>

          {/* Stock & Availability Indicator */}
          {(() => {
            const availableStock = product.stock !== undefined ? product.stock : 10;
            const isOutOfStock = availableStock <= 0;
            const isMaxQuantity = quantity >= availableStock;

            return (
              <>
                <div className="flex items-center gap-2 pt-2">
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                      Out of Stock
                    </span>
                  ) : availableStock <= 5 ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      🔥 Low Stock: Only {availableStock} left in stock!
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      ✓ In Stock ({availableStock} available)
                    </span>
                  )}
                </div>

                {/* Quantity & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
                  {/* Stepper */}
                  <div className="flex items-center justify-between sm:justify-center border border-[#FFD6E0] bg-white rounded-full px-4 py-3 space-x-3 text-xs font-bold text-[#23272A] shadow-xs flex-shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="text-[#64748B] hover:text-[#FF5C8D] px-1 font-bold text-sm disabled:opacity-30 cursor-pointer"
                      title="Decrease Quantity"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-extrabold text-xs text-[#23272A]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                      disabled={isMaxQuantity || isOutOfStock}
                      className={`px-1 font-bold text-sm ${
                        isMaxQuantity || isOutOfStock
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-[#64748B] hover:text-[#FF5C8D] cursor-pointer'
                      }`}
                      title={isMaxQuantity ? `Max stock limit reached (${availableStock})` : 'Increase Quantity'}
                    >
                      +
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="flex-1 flex flex-col xs:flex-row items-stretch gap-2.5">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="flex-1 btn-outline-pink py-3.5 px-5 text-xs font-bold flex items-center justify-center gap-2 rounded-full whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs hover:shadow-md transition-all"
                    >
                      <FiShoppingBag className="w-4 h-4 flex-shrink-0" />
                      <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
                    </button>

                    <button
                      onClick={() => !isOutOfStock && navigate(`/express-buy/${productId}`)}
                      disabled={isOutOfStock}
                      className="flex-1 btn-pink py-3.5 px-5 text-xs font-bold flex items-center justify-center gap-2 rounded-full whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                    >
                      <FiZap className="w-4 h-4 flex-shrink-0" />
                      <span>1-Click Express Buy</span>
                    </button>
                  </div>
                </div>
              </>
            );
          })()}

          {/* Guarantees */}
          <div className="border-t border-[#FFE4EC] pt-5 space-y-3 text-xs text-[#64748B]">
            <div className="flex items-center gap-2.5">
              <FiCheck className="w-4 h-4 text-[#FF5C8D]" />
              <span>Complimentary personalized message card included</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FiTruck className="w-4 h-4 text-[#FF5C8D]" />
              <span>Express delivery available in gift-ready box</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FiShield className="w-4 h-4 text-[#FF5C8D]" />
              <span>100% Happiness & damage-free delivery guarantee</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

