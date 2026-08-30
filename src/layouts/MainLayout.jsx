import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { useCart } from '../context/CartContext';
import { FiX, FiTrash2, FiShoppingBag, FiLock, FiZap } from 'react-icons/fi';
import './MainLayout.css';

export default function MainLayout({ children }) {
  const { cartItems, removeFromCart, isCartOpen, setIsCartOpen, toastMessage } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1B1F] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 text-xs font-medium animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Main Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between p-6 sm:p-8 border-l border-[#EAE4DC]">
              
              {/* Header */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#EAE4DC]">
                  <h2 className="font-serif text-xl font-medium text-[#1C1B1F] flex items-center gap-2">
                    <FiShoppingBag className="w-5 h-5 text-[#C99C67]" /> Your Shopping Bag
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-[#7A756D] hover:text-[#1C1B1F] transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Item List */}
                <div className="py-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12 text-[#7A756D]">
                      <p className="text-sm">Your bag is currently empty.</p>
                    </div>
                  ) : (
                    cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 pb-4 border-b border-[#EAE4DC]/60">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-contain object-center p-0.5 rounded-md bg-[#F4F0E8]" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-[#1C1B1F]">{item.name}</h4>
                          <p className="text-xs text-[#7A756D]">Size: {item.size} | Color: {item.color}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-[#7A756D]">Qty: {item.quantity}</span>
                            <span className="text-sm font-semibold text-[#1C1B1F]">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#9E978C] hover:text-red-600 transition-colors p-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Subtotal & Checkout */}
              {cartItems.length > 0 && (
                <div className="pt-6 border-t border-[#EAE4DC] space-y-3">
                  <div className="flex justify-between text-sm font-medium text-[#1C1B1F]">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-[#7A756D]">Shipping, taxes, and discounts calculated at checkout.</p>
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full btn-pink py-3.5 text-center block font-bold text-xs uppercase tracking-wider shadow-md"
                  >
                    Proceed to Checkout (No Login Required) <FiLock className="inline w-4 h-4 ml-1" />
                  </Link>
                  <p className="text-[10px] text-center text-[#FF5C8D] font-bold flex items-center justify-center gap-1">
                    <FiZap className="w-3.5 h-3.5" /> Fast Guest Checkout • No Registration Needed
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
