import React from 'react';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaInstagram, FaFacebookF, FaPinterestP } from 'react-icons/fa6';
import { FiGift, FiTruck, FiShield, FiHeart } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="bg-[#1E1F24] text-white pt-16 pb-12 border-t border-[#FF5C8D]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-[#FF5C8D]/20 flex items-center justify-center text-[#FF5C8D]">
              <FiTruck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Same-day gift dispatch & packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-[#FF5C8D]/20 flex items-center justify-center text-[#FF5C8D]">
              <FiGift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Handcrafted Wrapping</h4>
              <p className="text-xs text-slate-400 mt-0.5">Free satin ribbon & custom cards</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-12 h-12 rounded-full bg-[#FF5C8D]/20 flex items-center justify-center text-[#FF5C8D]">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Happiness Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">100% satisfaction or easy exchange</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 py-16">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#FF5C8D] flex items-center justify-center text-white font-bold">
                <FiGift className="w-5 h-5" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight">
                Gift<span className="text-[#FF5C8D]">Craft</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Crafting unforgettable moments with curated gift boxes, personalized keepsakes, and artisanal creations for your beloved family and friends.
            </p>
          </div>

          {/* Column 1: Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF5C8D] mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Product Catalog</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Column 2: Recipient Categories */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF5C8D] mb-4">Gift By Person</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/products" className="hover:text-white transition-colors">Gifts for Parents</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Gifts for Couples</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Gifts for Friends</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Gifts for Children</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Corporate Gifts</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF5C8D] mb-4">Customer Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><span className="block text-white font-semibold">Toll-Free:</span> +1 (800) 888-GIFT</li>
              <li><span className="block text-white font-semibold">Support Email:</span> support@giftcraft.com</li>
              <li><span className="block text-white font-semibold">Service Hours:</span> 24/7 Gift Concierge</li>
            </ul>
          </div>
        </div>

        {/* Bottom Social Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Servex IT Solution Pvt Ltd. All rights reserved. Designed with <FiHeart className="inline text-[#FF5C8D] w-3 h-3 mx-0.5" /> for beloved families.
          </p>

          <div className="flex items-center space-x-3">
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF5C8D] transition-all" title="X / Twitter">
              <FaXTwitter className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF5C8D] transition-all" title="Instagram">
              <FaInstagram className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF5C8D] transition-all" title="Facebook">
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF5C8D] transition-all" title="Pinterest">
              <FaPinterestP className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
