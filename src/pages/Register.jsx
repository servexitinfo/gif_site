import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { apiService } from '../services/api';
import sofaRoom from '../assets/sofa_room.png';
import './Login.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await apiService.registerUser(formData);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#FFE4EC] overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Image Side Banner */}
        <div className="relative hidden md:block">
          <img src={sofaRoom} alt="GiftCraft Showcase" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-xs uppercase tracking-widest text-[#FF5C8D] font-bold">New Member Registration</span>
            <h3 className="font-heading text-3xl font-bold mt-1">Join GiftCraft</h3>
            <p className="text-xs opacity-90 mt-2 leading-relaxed">
              Create an account to track your orders, save curated wishlist hampers, and receive exclusive holiday discount codes.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          
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

          <div className="text-center md:text-left mb-6 space-y-1">
            <span className="text-xs font-bold text-[#FF5C8D] uppercase tracking-wider">Create Account</span>
            <h2 className="font-heading text-2xl font-bold text-[#23272A]">
              Member Registration
            </h2>
            <p className="text-xs text-[#64748B]">
              Enter your name and details to create a new account.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#23272A] mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-[#FF5C8D]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Arshad V P"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-3 pl-10 pr-4 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#23272A] mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-[#FF5C8D]" />
                <input
                  type="email"
                  required
                  placeholder="arshad@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-3 pl-10 pr-4 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#23272A] mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-[#FF5C8D]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-3 pl-10 pr-4 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
              </div>
            </div>

            {/* Sign Up Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              <span>{loading ? 'Creating Account...' : 'Sign Up / Register Now'}</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center border-t border-[#FFE4EC] pt-5">
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
