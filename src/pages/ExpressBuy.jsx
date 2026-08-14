import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiZap, 
  FiGift, 
  FiTruck, 
  FiShield, 
  FiCheckCircle, 
  FiHeart, 
  FiStar, 
  FiClock, 
  FiArrowLeft,
  FiLock,
  FiChevronRight,
  FiCreditCard,
  FiSmartphone,
  FiDollarSign,
  FiGrid
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './ExpressBuy.css';

export default function ExpressBuy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, expressBuy } = useCart();

  // Find product by id or default to first product
  const targetProduct = products.find((p) => p.id === id || p._id === id) || products[0] || {
    id: 'gift-perfume-box',
    name: 'Rose Gold Perfume Gift Box',
    category: 'Couple',
    price: 95,
    originalPrice: 120,
    rating: 5.0,
    reviews: 53,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
    desc: 'Luxury glass perfume bottle with pink floral notes and velvet gift box.'
  };

  // Express Selection State
  const [selectedColor, setSelectedColor] = useState('Pink Ribbon');
  const [selectedSize, setSelectedSize] = useState('Deluxe Box');
  const [quantity, setQuantity] = useState(1);

  // Form State for 1-Click Purchase
  const [recipientName, setRecipientName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [giftNote, setGiftNote] = useState('');

  // Countdown timer for conversion urgency
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInstantPurchase = (e) => {
    e.preventDefault();
    if (!recipientName || !address) {
      alert('Please enter recipient name and delivery address!');
      return;
    }

    const createdOrder = expressBuy(
      {
        id: targetProduct.id,
        name: targetProduct.name,
        price: targetProduct.price,
        quantity,
        color: selectedColor,
        size: selectedSize,
        image: targetProduct.image
      },
      {
        recipientName,
        address,
        paymentMethod,
        giftNote
      }
    );

    navigate('/orders');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Back Link & Badge */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/products" className="inline-flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#FF5C8D] transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
        <span className="inline-flex items-center gap-1.5 bg-[#FF5C8D] text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
          <FiZap className="w-4 h-4 animate-bounce" /> 1-Click Express Purchase
        </span>
      </div>

      {/* Urgency Offer Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-pink-50 border border-amber-200 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-600 flex items-center justify-center flex-shrink-0">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-[#23272A] text-sm">Express Priority Dispatch Reserved</p>
            <p className="text-[#64748B]">Complete your purchase to guarantee same-day artisanal gift wrapping.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-amber-200 font-mono font-bold text-amber-600 shadow-xs">
          <span>Offer Expires In:</span>
          <span className="text-base text-[#FF5C8D]">
            {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Single Product Selling Layout (Grid 12 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Product Showcase & Details (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-pink-50 border border-[#FFE4EC] shadow-xl">
            <img src={targetProduct.image} alt={targetProduct.name} className="w-full h-full object-cover" />
            
            <span className="absolute top-4 left-4 bg-emerald-500 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase shadow-md">
              In Stock & Ready To Dispatch
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-[#FF5C8D] uppercase tracking-widest">{targetProduct.category} Gift Edition</span>
            <h1 className="font-heading text-3xl font-bold text-[#23272A]">{targetProduct.name}</h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{targetProduct.desc}</p>

            <div className="flex items-center space-x-3 pt-2">
              <span className="text-3xl font-bold text-[#FF5C8D]">₹{targetProduct.price}.00</span>
              {targetProduct.originalPrice && (
                <span className="text-sm text-[#94A3B8] line-through">₹{targetProduct.originalPrice}.00</span>
              )}
              <span className="bg-pink-100 text-[#FF5C8D] text-xs font-bold px-3 py-1 rounded-full">
                Express Special Price
              </span>
            </div>
          </div>

          {/* Ribbon & Box Edition Selectors */}
          <div className="bg-white p-5 rounded-2xl border border-[#FFE4EC] space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#23272A] mb-2">Select Satin Ribbon Theme</label>
              <div className="flex items-center gap-3">
                {['Pink Ribbon', 'Gold Satin', 'Rose Red', 'Pastel Blue'].map((colorName) => (
                  <button
                    key={colorName}
                    type="button"
                    onClick={() => setSelectedColor(colorName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedColor === colorName
                        ? 'bg-[#FF5C8D] text-white border-[#FF5C8D] shadow-sm'
                        : 'bg-pink-50 text-[#64748B] border-[#FFD6E0]'
                    }`}
                  >
                    {colorName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#23272A] mb-2">Box Edition</label>
              <div className="grid grid-cols-3 gap-2">
                {['Deluxe Box', 'Premium Box', 'Grand Hamper'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      selectedSize === sz
                        ? 'bg-[#FF5C8D] text-white border-[#FF5C8D]'
                        : 'bg-white text-[#23272A] border-[#FFE4EC]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-[#64748B]">
            <div className="bg-white p-3 rounded-xl border border-[#FFE4EC] space-y-1">
              <FiTruck className="w-5 h-5 text-[#FF5C8D] mx-auto" />
              <p className="font-bold text-[#23272A]">Express Shipping</p>
              <p>24h Dispatch</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#FFE4EC] space-y-1">
              <FiGift className="w-5 h-5 text-[#FF5C8D] mx-auto" />
              <p className="font-bold text-[#23272A]">Free Gift Box</p>
              <p>Artisanal Wrap</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#FFE4EC] space-y-1">
              <FiShield className="w-5 h-5 text-[#FF5C8D] mx-auto" />
              <p className="font-bold text-[#23272A]">Guaranteed</p>
              <p>Damage-Free</p>
            </div>
          </div>

        </div>

        {/* Right Column: Integrated 1-Click Direct Purchase Checkout Form (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FF5C8D]/30 shadow-xl space-y-6 relative">
          
          <div className="border-b border-[#FFE4EC] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C8D]">Direct Order Checkout</span>
            <h2 className="font-heading text-2xl font-bold text-[#23272A] mt-0.5">Complete Purchase Now</h2>
            <p className="text-xs text-[#64748B] mt-1">No cart needed! Enter delivery info below to place order immediately.</p>
          </div>

          <form onSubmit={handleInstantPurchase} className="space-y-4 text-xs">
            
            {/* Recipient Name */}
            <div>
              <label className="block font-bold text-[#23272A] mb-1">Recipient Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Connor"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-pink-50/60 border border-[#FFD6E0] rounded-xl px-4 py-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block font-bold text-[#23272A] mb-1">Shipping Address *</label>
              <textarea
                rows="2"
                required
                placeholder="e.g. 742 Evergreen Terrace, Springfield"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-pink-50/60 border border-[#FFD6E0] rounded-xl px-4 py-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
              />
            </div>

            {/* Gift Message */}
            <div>
              <label className="block font-bold text-[#23272A] mb-1">Personalized Gift Message (Complimentary Card)</label>
              <input
                type="text"
                placeholder="e.g. Happy Anniversary! With all my love."
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                className="w-full bg-pink-50/60 border border-[#FFD6E0] rounded-xl px-4 py-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
              />
            </div>

            {/* Payment Method Selector & Interactive Panel */}
            <div>
              <label className="block font-bold text-[#23272A] mb-2">Select Payment Option</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: FiSmartphone },
                  { id: 'card', label: 'Card', icon: FiCreditCard },
                  { id: 'netbanking', label: 'NetBanking', icon: FiGrid },
                  { id: 'cod', label: 'Cash / COD', icon: FiDollarSign }
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-2.5 rounded-xl font-bold border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === pm.id
                          ? 'bg-[#FF5C8D] text-white border-[#FF5C8D] shadow-md'
                          : 'bg-pink-50/50 text-[#23272A] border-[#FFD6E0] hover:bg-pink-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payment Details Fields */}
              <div className="mt-3">
                {paymentMethod === 'upi' && (
                  <div className="p-3.5 bg-pink-50/70 rounded-2xl border border-[#FFD6E0] space-y-2.5">
                    <p className="text-[11px] text-[#64748B]">Pay via GPay, PhonePe, Paytm, or enter UPI ID:</p>
                    <input
                      type="text"
                      placeholder="e.g. username@upi or mobile@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-white border border-[#FFD6E0] rounded-xl px-3 py-2 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                    />
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-3.5 bg-pink-50/70 rounded-2xl border border-[#FFD6E0] space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#23272A] mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8901"
                        maxLength="19"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="w-full bg-white border border-[#FFD6E0] rounded-xl px-3 py-2 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#23272A] mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          maxLength="5"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full bg-white border border-[#FFD6E0] rounded-xl px-3 py-2 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#23272A] mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength="4"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-full bg-white border border-[#FFD6E0] rounded-xl px-3 py-2 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-3.5 bg-pink-50/70 rounded-2xl border border-[#FFD6E0] space-y-2">
                    <label className="block text-[11px] font-bold text-[#23272A]">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-white border border-[#FFD6E0] rounded-xl px-3 py-2 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-3.5 bg-pink-50/70 rounded-2xl border border-[#FFD6E0]">
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      💡 <strong>Cash on Delivery selected:</strong> Pay ₹{targetProduct.price + 50}.00 via Cash, Card, or UPI scan when the courier agent delivers the gift package.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Price Breakdown */}
            <div className="bg-pink-50/70 p-4 rounded-2xl border border-[#FFE4EC] space-y-2 pt-3">
              <div className="flex justify-between text-[#64748B]">
                <span>Product Item ({selectedSize}):</span>
                <span className="font-bold text-[#23272A]">₹{targetProduct.price}.00</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Artisanal Gift Wrapping & Ribbon:</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Express Courier Shipping:</span>
                <span className="font-bold text-[#23272A]">₹50.00</span>
              </div>
              <div className="pt-2 border-t border-[#FFE4EC] flex justify-between text-sm font-bold">
                <span>Total Express Amount:</span>
                <span className="text-lg text-[#FF5C8D]">₹{targetProduct.price + 50}.00</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-pink py-4 text-sm font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 group"
            >
              <FiLock className="w-4 h-4" />
              <span>Buy Now (₹{targetProduct.price + 50}.00)</span>
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[10px] text-center text-[#94A3B8]">
              🔒 256-Bit SSL Encrypted Instant Express Checkout. 100% Guaranteed Delivery.
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}
