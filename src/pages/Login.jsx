import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { apiService } from '../services/api';
import sofaRoom from '../assets/sofa_room.png';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gift_site_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await apiService.loginUser(formData);
    setLoading(false);

    if (res.success) {
      const userData = res.data;
      if (userData.email && userData.email.toLowerCase().includes('admin')) {
        userData.role = 'admin';
      }
      setUser(userData);
      localStorage.setItem('gift_site_user', JSON.stringify(userData));
      
      if (userData.role === 'admin' || (userData.email && userData.email.toLowerCase().includes('admin'))) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message || 'Invalid email or password');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gift_site_user');
  };

  if (user) {
    const isAdmin = user.role === 'admin' || (user.email && user.email.toLowerCase().includes('admin'));

    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#FFE4EC] p-8 text-center space-y-5 shadow-xl">
          <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center text-[#FF5C8D] mx-auto">
            <FiCheckCircle className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C8D]">
              {isAdmin ? 'Administrator Account' : 'Signed In Member'}
            </span>
            <h2 className="font-heading text-2xl font-bold text-[#23272A] mt-1">Welcome Back, {user.name}!</h2>
            <p className="text-xs text-[#64748B] mt-1">{user.email}</p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5 text-xs font-bold">
            {isAdmin ? (
              <Link to="/admin" className="btn-pink py-3 rounded-xl uppercase tracking-wider">
                Open Admin Dashboard
              </Link>
            ) : (
              <Link to="/orders" className="btn-pink py-3 rounded-xl uppercase tracking-wider">
                View My Orders
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 py-3 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#FFE4EC] overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Image Side Banner */}
        <div className="relative hidden md:block">
          <img src={sofaRoom} alt="GiftCraft Member Showcase" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-xs uppercase tracking-widest text-[#FF5C8D] font-bold">Member Portal</span>
            <h3 className="font-heading text-3xl font-bold mt-1">Welcome to GiftCraft</h3>
            <p className="text-xs opacity-90 mt-2 leading-relaxed">
              Access your saved order history, express 1-click purchases, and custom gift notes.
            </p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          
          {/* Tab Switcher Bar */}
          <div className="auth-tab-bar">
            <Link
              to="/login"
              className="auth-tab-active"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="auth-tab-inactive"
            >
              Sign Up / Register
            </Link>
          </div>

          <div className="text-center md:text-left mb-6 space-y-1">
            <span className="text-xs font-bold text-[#FF5C8D] uppercase tracking-wider">Account Portal</span>
            <h2 className="font-heading text-2xl font-bold text-[#23272A]">
              Member Sign In
            </h2>
            <p className="text-xs text-[#64748B]">
              Enter your registered email and password to log in.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 border border-red-200">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#23272A] mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-[#FF5C8D]" />
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl py-3 pl-10 pr-10 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#FF5C8D] focus:outline-none cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              <span>{loading ? 'Signing In...' : 'Sign In Now'}</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center border-t border-[#FFE4EC] pt-5">
            <Link
              to="/register"
              className="auth-secondary-btn"
            >
              <span>Don't have an account? Sign Up Here</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
