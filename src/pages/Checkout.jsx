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
  FiGrid,
  FiZap
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/api';

export default function Checkout() {
  const { cartItems, placeOrder } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay', 'card', 'upi', 'cod', 'paypal', 'applepay'
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Form State for Logged in Users or Guest Users
  const [formData, setFormData] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('gift_site_user') || '{}');
      return {
        firstName: savedUser.name ? savedUser.name.split(' ')[0] : '',
        lastName: savedUser.name ? savedUser.name.split(' ').slice(1).join(' ') || '' : '',
        email: savedUser.email || '',
        phone: savedUser.phone || '',
        altPhone: '',
        address: savedUser.address || '',
        landmark: savedUser.landmark || '',
        city: savedUser.city || '',
        district: savedUser.district || '',
        state: savedUser.state || 'Kerala',
        postalCode: savedUser.pincode || '',
        addressType: savedUser.addressType || 'Home',
        giftNote: '',
        upiId: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: ''
      };
    } catch {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        altPhone: '',
        address: '',
        landmark: '',
        city: '',
        district: '',
        state: 'Kerala',
        postalCode: '',
        addressType: 'Home',
        giftNote: '',
        upiId: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: ''
      };
    }
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu & Kashmir', 'Ladakh'
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 100 ? 0 : 15;
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFullFormattedAddress = () => {
    const parts = [
      formData.address,
      formData.landmark ? `(Landmark: ${formData.landmark})` : null,
      formData.city,
      formData.district ? `${formData.district} Dist.` : null,
      formData.state ? `${formData.state} - ${formData.postalCode}` : formData.postalCode,
      formData.addressType ? `[${formData.addressType}]` : null,
      `Ph: ${formData.phone}${formData.altPhone ? ', Alt: ' + formData.altPhone : ''}`
    ];
    return parts.filter(Boolean).join(', ');
  };

  const getPaymentLabel = (methodKey) => {
    switch (methodKey) {
      case 'razorpay': return 'Razorpay (UPI / Card / NetBanking)';
      case 'card': return 'Credit / Debit Card';
      case 'upi': return 'UPI / QR Mobile Pay';
      case 'cod': return 'Cash on Delivery (COD)';
      case 'paypal': return 'PayPal Express';
      case 'applepay': return 'Apple Pay / Google Pay';
      default: return 'Online Payment';
    }
  };

  const processStandardOrder = () => {
    const newOrder = placeOrder({
      total: grandTotal,
      paymentMethod: getPaymentLabel(paymentMethod),
      recipientName: `${formData.firstName} ${formData.lastName}`,
      address: getFullFormattedAddress(),
      giftNote: formData.giftNote,
      items: cartItems
    });
    setPlacedOrder(newOrder);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (paymentMethod === 'razorpay') {
      setIsProcessingPayment(true);
      try {
        const rzpRes = await apiService.createRazorpayOrder({
          amount: grandTotal,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        });

        if (!rzpRes?.success) {
          alert(`Razorpay Payment Error: ${rzpRes?.error || rzpRes?.message || 'Failed to create order'}`);
          setIsProcessingPayment(false);
          return;
        }

        const rzpOrder = rzpRes.order || rzpRes;
        const orderId = rzpOrder.id || rzpOrder.order_id || rzpRes.order_id;
        const keyId = rzpRes.key_id || rzpRes.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TTV4xw1KBt6Ssv';

        if (window.Razorpay && orderId) {
          const options = {
            key: keyId,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency || 'INR',
            name: 'GiftCraft Online Gift Store',
            description: 'Artisanal Gift Hamper Purchase',
            image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
            order_id: orderId,
            handler: async function (response) {
              const verifyRes = await apiService.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  total: grandTotal,
                  paymentMethod: 'Razorpay (UPI / Card)',
                  recipientName: `${formData.firstName} ${formData.lastName}`,
                  address: getFullFormattedAddress(),
                  giftNote: formData.giftNote,
                  items: cartItems
                }
              });

              if (verifyRes?.success) {
                const confirmedOrder = verifyRes.data || placeOrder({
                  total: grandTotal,
                  paymentMethod: 'Razorpay Verified',
                  recipientName: `${formData.firstName} ${formData.lastName}`,
                  address: getFullFormattedAddress(),
                  giftNote: formData.giftNote,
                  items: cartItems
                });
                setPlacedOrder(confirmedOrder);
              } else {
                alert(`Payment Verification Error: ${verifyRes?.error || verifyRes?.message || 'Signature mismatch'}`);
              }
              setIsProcessingPayment(false);
            },
            modal: {
              ondismiss: function () {
                setIsProcessingPayment(false);
                console.info('Razorpay payment modal closed by user');
              }
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: '#FF5C8D'
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            alert(`Payment Failed: ${response.error.description || response.error.reason}`);
            setIsProcessingPayment(false);
          });
          rzp.open();
        } else {
          alert('Razorpay Checkout SDK script not available.');
          setIsProcessingPayment(false);
        }
      } catch (err) {
        alert(`Payment Error: ${err.message}`);
        setIsProcessingPayment(false);
      }
    } else {
      processStandardOrder();
    }
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
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-contain object-center p-0.5 bg-pink-50" />
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#FFE4EC]">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#23272A] flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#FF5C8D] text-white rounded-full text-xs flex items-center justify-center font-sans font-bold">1</span>
                  Elaborated Shipping & Delivery Address Details
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      const u = JSON.parse(localStorage.getItem('gift_site_user') || '{}');
                      if (u.name) {
                        setFormData((prev) => ({
                          ...prev,
                          firstName: u.name.split(' ')[0] || prev.firstName,
                          lastName: u.name.split(' ').slice(1).join(' ') || prev.lastName,
                          email: u.email || prev.email,
                          phone: u.phone || prev.phone,
                          address: u.address || prev.address,
                          landmark: u.landmark || prev.landmark,
                          city: u.city || prev.city,
                          district: u.district || prev.district,
                          state: u.state || prev.state,
                          postalCode: u.pincode || prev.postalCode,
                          addressType: u.addressType || prev.addressType
                        }));
                      }
                    } catch {}
                  }}
                  className="text-xs font-bold text-[#FF5C8D] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  ⚡ Pre-fill Saved Profile Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Recipient Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">First Name *</label>
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
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Last Name *</label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>

                {/* Email & Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Email Address *</label>
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
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Primary Mobile Number *</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>

                {/* Alternate Mobile Number */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Alternate Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    name="altPhone"
                    placeholder="e.g. +91 98765 00000 (Optional for delivery agent)"
                    value={formData.altPhone}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>

                {/* Flat / House No & Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Flat / House No. & Building / Street Address *</label>
                  <input
                    required
                    type="text"
                    name="address"
                    placeholder="e.g. Door No 12B, Rose Villa, MG Road"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>

                {/* Landmark & Locality */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Landmark / Nearby Locality (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="e.g. Opposite City Hospital / Near Metro Station"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>

                {/* City & District */}
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">City / Town *</label>
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="e.g. Kochi"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">District *</label>
                  <input
                    required
                    type="text"
                    name="district"
                    placeholder="e.g. Ernakulam"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>

                {/* State & Pincode */}
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Pincode / Postal Code *</label>
                  <input
                    required
                    type="text"
                    name="postalCode"
                    maxLength={6}
                    placeholder="e.g. 682001"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>

                {/* Address Type Tag */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">Address Tag</label>
                  <div className="flex gap-3">
                    {['Home', 'Work / Office', 'Other'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, addressType: t }))}
                        className={`px-4 py-2 rounded-xl font-bold border transition-all ${
                          formData.addressType === t
                            ? 'bg-[#FF5C8D] text-white border-[#FF5C8D]'
                            : 'bg-white text-slate-600 border-[#FFE4EC]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Gift Message (Complimentary Card - Not Required) */}
                <div className="sm:col-span-2 pt-2 border-t border-[#FFE4EC]">
                  <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase">
                    Personalized Gift Message / Complimentary Card (Optional)
                  </label>
                  <textarea
                    rows="2"
                    name="giftNote"
                    placeholder="Optional message to print on complimentary greeting card..."
                    value={formData.giftNote}
                    onChange={handleInputChange}
                    className="w-full bg-[#FFF8F9] border border-[#FFE4EC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#FF5C8D]"
                  />
                </div>

              </div>
            </div>

            {/* Step 2: Payment Method (Only Razorpay) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FFE4EC] space-y-6 shadow-xs">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#23272A] flex items-center gap-2">
                <span className="w-7 h-7 bg-[#FF5C8D] text-white rounded-full text-xs flex items-center justify-center font-sans font-bold">2</span>
                Payment Method (Razorpay Secure Gateway)
              </h3>

              {/* Single Official Razorpay Option Banner */}
              <div className="p-5 rounded-2xl border-2 border-[#FF5C8D] bg-pink-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#3395FF]">Razorpay</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FF5C8D] text-white">Official Gateway</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">100% Secure</span>
                  </div>
                  <p className="text-xs text-[#23272A] font-bold">
                    Pay securely using UPI, Credit/Debit Cards, NetBanking, or Wallets
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Supports GPay, PhonePe, Paytm, Visa, Mastercard, RuPay & all major Indian Banks.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <FiLock className="w-5 h-5 text-[#FF5C8D]" />
                  <span className="text-xs font-bold text-[#FF5C8D] whitespace-nowrap">256-bit Encrypted</span>
                </div>
              </div>

              <div className="p-4 bg-pink-100/50 rounded-2xl border border-[#FFD6E0] text-xs text-[#64748B] flex items-center gap-3">
                <FiZap className="w-5 h-5 text-[#FF5C8D] flex-shrink-0" />
                <span>
                  Clicking <strong>Place Gift Order Now</strong> will open the official <strong>Razorpay Checkout</strong> popup to complete your payment instantly.
                </span>
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
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-contain object-center p-0.5 bg-pink-50" />
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
