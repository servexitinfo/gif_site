import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import sofaRoom from '../assets/sofa_room.png';
import './Login.css';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#EAE4DC] overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Image Side Banner */}
        <div className="relative hidden md:block">
          <img src={sofaRoom} alt="Luma Interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-xs uppercase tracking-widest text-[#C99C67] font-semibold">Member Portal</span>
            <h3 className="font-serif text-3xl font-medium mt-1">Welcome to Luma Living</h3>
            <p className="text-xs opacity-80 mt-2">Access your saved wishlist, order history, and exclusive concierge support.</p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="text-center md:text-left mb-8 space-y-2">
            <h2 className="font-serif text-3xl font-medium text-[#1C1B1F]">
              {isSignUp ? 'Create an Account' : 'Sign In'}
            </h2>
            <p className="text-xs text-[#7A756D]">
              {isSignUp ? 'Join our community for member privileges.' : 'Enter your details to access your account.'}
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[#1C1B1F] mb-1 uppercase">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-3.5 text-[#9E978C]" />
                  <input type="text" placeholder="Arshad V P" className="w-full bg-[#FAF8F5] border border-[#EAE4DC] rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1C1B1F] mb-1 uppercase">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-[#9E978C]" />
                <input type="email" placeholder="concierge@lumaliving.com" className="w-full bg-[#FAF8F5] border border-[#EAE4DC] rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1B1F] mb-1 uppercase">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-[#9E978C]" />
                <input type="password" placeholder="••••••••" className="w-full bg-[#FAF8F5] border border-[#EAE4DC] rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none" />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3.5 mt-2 text-xs">
              {isSignUp ? 'Register Account' : 'Sign In to Account'} <FiArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#EAE4DC] pt-6">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-[#7A756D] hover:text-[#1C1B1F] transition-colors font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
