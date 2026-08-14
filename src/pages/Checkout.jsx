import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiLock, 
  FiCreditCard, 
  FiTruck, 
  FiSmartphone, 
  FiDollarSign, 
  FiShield, 
  FiArrowRight, 
  FiBox,
  FiGrid
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, placeOrder } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'cod', 'paypal', 'applepay'
  const [placedOrder, setPlacedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Arshad',
    lastName: 'V P',
    email: 'arshad@example.com',
    phone: '+91 98765 43210',
    address: '123 Celebration Avenue, Suite 400',
    city: 'Kochi',
    postalCode: '682001',
    giftNote: 'Wishing you endless joy, peace, and celebration on this special occasion! 🎁',
    upiId: 'arshad@upi',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888'
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 100 ? 0 : 15;
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getPaymentLabel = (methodKey) => {
    switch (methodKey) {
      case 'card': return 'Credit / Debit Card';
      case 'upi': return 'UPI / QR Mobile Pay';
      case 'cod': return 'Cash on Delivery (COD)';
      case 'paypal': return 'PayPal Express';
      case 'applepay': return 'Apple Pay / Google Pay';
      default: return 'Online Payment';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const newOrder = placeOrder({
      total: grandTotal,
      paymentMethod: getPaymentLabel(paymentMethod),
      recipientName: `${formData.firstName} ${formData.lastName}`,
      address: `${formData.address}, ${formData.city} ${formData.postalCode}`,
      giftNote: formData.giftNote,
      items: cartItems
    });

    setPlacedOrder(newOrder);
  };

  // Order Confirmed View
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
        <div className="w-24 h-24 bg-[#FFE4EC] text-[#FF5C8D] rounded-full flex items-center justify-center mx-auto shadow-xl transform animate-bounce">
          <FiCheckCircle className="w-12 h-12" />
        </div>
        <div>
          <span className="text-xs font-bold text-[#FF5C8D] uppercase tracking-widest bg-pink-50 px-4 py-1.5 rounded-full">
            Payment Completed Successfully
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#23272A] mt-3">
            Gift Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] max-w-lg mx-auto mt-2 leading-relaxed">
            Thank you, <strong>{formData.firstName}</strong>! Your order reference{' '}
            <strong className="text-[#FF5C8D] font-mono text-base">#{placedOrder.id}</strong> has been received and is being prepared with artisanal ribbon packaging.
          </p>
        </div>

        {/* Order Details Receipt Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FFE4EC] shadow-sm text-left space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#FFE4EC]">
            <div>
              <span className="text-xs text-[#718096]">Payment Method</span>
              <p className="text-sm font-bold text-[#23272A] flex items-center gap-2 mt-0.5">
                <FiShield className="text-emerald-500" /> {placedOrder.paymentMethod}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#718096]">Delivery Recipient</span>
              <p className="text-sm font-bold text-[#23272A] mt-0.5">{placedOrder.recipientName}</p>
            </div>
            <div>
              <span className="text-xs text-[#718096]">Total Amount Paid</span>
              <p className="text-base font-extrabold text-[#FF5C8D] mt-0.5">₹{placedOrder.total.toLocaleString()}.00</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#23272A] uppercase tracking-wider mb-3">Items in Gift Box:</h4>
            <div className="space-y-3">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-pink-50" />
                  <div className="flex-1">
                    <h5 className="font-bold text-[#23272A]">{item.name}</h5>
                    <span className="text-[#718096]">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-[#23272A]">₹{(item.price * item.quantity).toLocaleString()}.00</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/orders" className="hero-btn-pink w-full sm:w-auto py-3.5 px-8">
            Track Order Status <FiArrowRight />
          </Link>
          <Link to="/products" className="hero-btn-outline w-full sm:w-auto py-3.5 px-8">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <span className="text-xs font-bold text-[#FF5C8D] uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">
          Secure Gift Delivery
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#23272A] mt-2">
          Express Checkout & Payment
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#FFE4EC] text-center space-y-4">
          <FiBox className="w-12 h-12 text-[#FF5C8D] mx-auto" />
          <h3 className="text-xl font-bold text-[#23272A]">Your Shopping Bag is Empty</h3>
          <p className="text-xs text-[#718096]">Add your favourite gift boxes to proceed with express checkout.</p>
          <Link to="/products" className="hero-btn-pink inline-flex items-center gap-2">
            Explore Gifts <FiArrowRight />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Delivery & Payment Options */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FFE4EC] space-y-6 shadow-xs">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#23272A] flex items-center gap-2">
                <span className="w-7 h-7 bg-[#FF5C8D] text-white rounded-full text-xs flex items-center justify-center font-sans font-bold">1</span>
                Recipient Shipping & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">First Name</label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Last Name</label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Street Delivery Address</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">City</label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Postal / ZIP Code</label>
                  <input
                    required
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">
                    Personalized Handwritten Gift Card Message 💌
                  </label>
                  <textarea
                    rows="3"
                    name="giftNote"
                    value={formData.giftNote}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Options */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FFE4EC] space-y-6 shadow-xs">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#23272A] flex items-center gap-2">
                <span className="w-7 h-7 bg-[#FF5C8D] text-white rounded-full text-xs flex items-center justify-center font-sans font-bold">2</span>
                Select Payment Option
              </h3>

              {/* Payment Selectable Tabs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                
                {/* 1. Credit/Debit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    paymentMethod === 'card'
                      ? 'border-[#FF5C8D] bg-[#FFE4EC] shadow-sm'
                      : 'border-[#F1F5F9] bg-[#FFF8F9] hover:border-[#FFC1CC]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <FiCreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#FF5C8D]' : 'text-[#718096]'}`} />
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white text-[#23272A]">Card</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#23272A] block">Credit / Debit Card</span>
                    <span className="text-[10px] text-[#718096]">Visa, Mastercard, AMEX</span>
                  </div>
                </button>

                {/* 2. UPI / QR Mobile Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    paymentMethod === 'upi'
                      ? 'border-[#FF5C8D] bg-[#FFE4EC] shadow-sm'
                      : 'border-[#F1F5F9] bg-[#FFF8F9] hover:border-[#FFC1CC]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <FiSmartphone className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-[#FF5C8D]' : 'text-[#718096]'}`} />
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">Instant</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#23272A] block">UPI / QR Code</span>
                    <span className="text-[10px] text-[#718096]">GPay, PhonePe, Paytm</span>
                  </div>
                </button>

                {/* 3. Cash on Delivery (COD) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    paymentMethod === 'cod'
                      ? 'border-[#FF5C8D] bg-[#FFE4EC] shadow-sm'
                      : 'border-[#F1F5F9] bg-[#FFF8F9] hover:border-[#FFC1CC]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <FiDollarSign className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-[#FF5C8D]' : 'text-[#718096]'}`} />
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">COD</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#23272A] block">Cash on Delivery</span>
                    <span className="text-[10px] text-[#718096]">Pay upon gift arrival</span>
                  </div>
                </button>

                {/* 4. PayPal */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    paymentMethod === 'paypal'
                      ? 'border-[#FF5C8D] bg-[#FFE4EC] shadow-sm'
                      : 'border-[#F1F5F9] bg-[#FFF8F9] hover:border-[#FFC1CC]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-[#003087] text-sm italic">PayPal</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Global</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#23272A] block">PayPal Express</span>
                    <span className="text-[10px] text-[#718096]">1-Click PayPal account</span>
                  </div>
                </button>

                {/* 5. Apple Pay / Google Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    paymentMethod === 'applepay'
                      ? 'border-[#FF5C8D] bg-[#FFE4EC] shadow-sm'
                      : 'border-[#F1F5F9] bg-[#FFF8F9] hover:border-[#FFC1CC]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-[#23272A] text-xs"> Pay / GPay</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">Wallet</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#23272A] block">Digital Wallet</span>
                    <span className="text-[10px] text-[#718096]">TouchID / FaceID Pay</span>
                  </div>
                </button>

              </div>

              {/* Dynamic Payment Input Panels */}
              <div className="pt-4 border-t border-[#FFE4EC]">
                
                {/* Panel 1: Card Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Card Number</label>
                      <input
                        required
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Expiry Date</label>
                        <input
                          required
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">CVC / CVV</label>
                        <input
                          required
                          type="password"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          maxLength="4"
                          placeholder="123"
                          className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel 2: UPI / QR Pay */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Enter Virtual Payment Address (VPA / UPI ID)</label>
                      <div className="flex gap-2">
                        <input
                          required
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          placeholder="username@upi"
                          className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                        />
                        <button type="button" className="px-4 bg-[#FF5C8D] text-white text-xs font-bold rounded-xl whitespace-nowrap">
                          Verify UPI
                        </button>
                      </div>
                    </div>

                    {/* Mock QR Code Display */}
                    <div className="p-4 bg-[#FFF8F9] rounded-2xl border border-[#FFE4EC] flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-24 bg-white p-2 border border-slate-200 rounded-xl shadow-xs flex items-center justify-center">
                        <FiGrid className="w-16 h-16 text-[#23272A]" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#23272A]">Instant QR Code Scan</h5>
                        <p className="text-[11px] text-[#718096] mt-1">
                          Scan using GPay, PhonePe, Paytm, or any UPI app to make instant payment of <strong>₹{grandTotal.toLocaleString()}.00</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel 3: Cash on Delivery (COD) */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-[#FFF8F9] rounded-2xl border border-[#FFE4EC] space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#23272A]">
                      <FiShield className="text-emerald-500 w-5 h-5" /> Pay Cash or Card on Delivery
                    </div>
                    <p className="text-xs text-[#718096] leading-relaxed">
                      You can pay via Cash, Credit Card, or Mobile UPI when our delivery agent brings your ribbon-wrapped gift box to your recipient's doorstep. Box inspection is permitted upon delivery.
                    </p>
                  </div>
                )}

                {/* Panel 4: PayPal */}
                {paymentMethod === 'paypal' && (
                  <div className="p-4 bg-[#FFF8F9] rounded-2xl border border-[#FFE4EC] text-center space-y-3 animate-fadeIn">
                    <p className="text-xs text-[#718096]">You will be redirected to PayPal to complete your purchase securely.</p>
                    <div className="py-2 px-6 bg-[#FFC439] text-[#003087] font-bold text-sm rounded-xl inline-block shadow-xs cursor-pointer">
                      Pay with PayPal
                    </div>
                  </div>
                )}

                {/* Panel 5: Apple/Google Pay */}
                {paymentMethod === 'applepay' && (
                  <div className="p-4 bg-[#FFF8F9] rounded-2xl border border-[#FFE4EC] text-center space-y-3 animate-fadeIn">
                    <p className="text-xs text-[#718096]">Use your device biometric authentication to pay instantly.</p>
                    <div className="py-3 px-8 bg-[#1C1B1F] text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer">
                      <span> Pay</span> / <span>GPay</span> Express
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#FFE4EC] shadow-sm space-y-6 sticky top-24">
            <h3 className="font-heading text-xl font-bold text-[#23272A] pb-4 border-b border-[#FFE4EC]">
              Gift Order Summary ({cartItems.length})
            </h3>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-pink-50" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#23272A] line-clamp-1">{item.name}</h4>
                    <span className="text-[#718096]">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-[#FF5C8D]">₹{(item.price * item.quantity).toLocaleString()}.00</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-[#FFE4EC] text-xs">
              <div className="flex justify-between text-[#718096]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#23272A]">₹{subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-[#718096]">
                <span>Ribbon Packaging & Shipping</span>
                <span className="font-semibold text-emerald-600">
                  {shippingFee === 0 ? 'FREE Express' : `₹${shippingFee}.00`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#FFE4EC] flex justify-between text-base font-extrabold text-[#23272A]">
                <span>Total Payment</span>
                <span className="text-[#FF5C8D]">₹{grandTotal.toLocaleString()}.00</span>
              </div>
            </div>

            <button type="submit" className="w-full hero-btn-pink py-4 text-center justify-center rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all">
              Place Gift Order (₹{grandTotal.toLocaleString()}.00) <FiLock className="inline w-4 h-4 ml-1" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#718096] pt-1">
              <FiShield className="text-emerald-500 w-4 h-4" /> 256-Bit SSL Encrypted Payment
            </div>
          </div>

        </form>
      )}
    </div>
  );
}
