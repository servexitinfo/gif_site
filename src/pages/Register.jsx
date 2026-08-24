import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiHome, FiMapPin, FiGlobe, FiArrowRight, FiCheckCircle, FiTag } from 'react-icons/fi';
import { apiService } from '../services/api';
import sofaRoom from '../assets/sofa_room.png';
import './Login.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    district: '',
    state: 'Kerala',
    pincode: '',
    addressType: 'Home'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu & Kashmir', 'Ladakh'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await apiService.registerUser(formData);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      if (res.data) {
        localStorage.setItem('gift_site_user', JSON.stringify(res.data));
      }
      setTimeout(() => {
        navigate('/orders');
      }, 1200);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#FFE4EC] overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Image Side Banner */}
        <div className="relative hidden md:block md:col-span-5">
          <img src={sofaRoom} alt="GiftCraft Showcase" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-xs uppercase tracking-widest text-[#FF5C8D] font-bold">New Member Registration</span>
            <h3 className="font-heading text-3xl font-bold mt-1">Join GiftCraft</h3>
            <p className="text-xs opacity-90 mt-2 leading-relaxed">
              Create an account with your complete delivery profile to track orders, save shipping details, and receive fast 1-click checkouts!
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="p-6 sm:p-10 md:col-span-7 flex flex-col justify-center max-h-[85vh] overflow-y-auto">
          
          {/* Tab Switcher Bar */}
          <div className="auth-tab-bar">
            <Link
              to="/login"
              className="auth-tab-inactive"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="auth-tab-active"
            >
              Sign Up / Register
            </Link>
          </div>

          <div className="text-center md:text-left mb-5 space-y-1">
            <span className="text-xs font-bold text-[#FF5C8D] uppercase tracking-wider">Create Account & Delivery Profile</span>
            <h2 className="font-heading text-2xl font-bold text-[#23272A]">
              Member Registration
            </h2>
            <p className="text-xs text-[#64748B]">
              Enter your personal info and shipping address details below.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl text-xs font-bold mb-4 border border-emerald-200 flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Account created successfully! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {/* Account Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-[#FF5C8D]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">Mobile Number *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 text-[#FF5C8D]" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-[#FF5C8D]" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-[#FF5C8D]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>
              </div>
            </div>

            {/* Address Requirements Section Header */}
            <div className="pt-2 border-t border-[#FFE4EC]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5C8D]">Elaborated Delivery Address</span>
            </div>

            {/* Flat / House No & Street Address */}
            <div>
              <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">Flat / House No. & Building / Street *</label>
              <div className="relative">
                <FiHome className="absolute left-3 top-3 text-[#FF5C8D]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Door No. 42, Green Avenue, MG Road"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
              </div>
            </div>

            {/* Landmark & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">Landmark / Area (Optional)</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-[#FF5C8D]" />
                  <input
                    type="text"
                    placeholder="e.g. Near Metro Station / Town Hall"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">Pincode / Postal Code *</label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-3 text-[#FF5C8D]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 682001"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>
              </div>
            </div>

            {/* City, District, State */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">City / Town *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kochi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 px-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ernakulam"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 px-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-2.5 px-3 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address Type selection */}
            <div>
              <label className="block text-xs font-bold text-[#23272A] mb-1 uppercase tracking-wider">Address Type</label>
              <div className="flex items-center gap-3">
                {['Home', 'Work / Office', 'Other'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, addressType: type })}
                    className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                      formData.addressType === type
                        ? 'bg-[#FF5C8D] text-white border-[#FF5C8D]'
                        : 'bg-pink-50/50 text-slate-600 border-[#FFD6E0]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Sign Up Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Sign Up & Save Delivery Address'}</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 text-center border-t border-[#FFE4EC] pt-4">
            <Link
              to="/login"
              className="auth-secondary-btn"
            >
              <span>Already have an account? Sign In Here</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
