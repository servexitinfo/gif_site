import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag, FiTruck, FiLock, FiGift } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingThreshold = 100;
  const isFreeShipping = subtotal >= shippingThreshold || cartItems.length === 0;
  const shippingCost = isFreeShipping ? 0 : 15;
  const grandTotal = subtotal + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#FF5C8D] flex items-center justify-center text-white font-bold">
          <FiGift className="w-5 h-5" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#23272A]">Your Gift Bag</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#FFE4EC] space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FFE4EC] flex items-center justify-center mx-auto text-[#FF5C8D]">
            <FiShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#23272A]">Your gift bag is empty</h2>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Explore our curated gift collections to add personalized keepsakes, flowers, and plush toys.
          </p>
          <div>
            <Link to="/products" className="btn-pink">
              Explore Catalog <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Item List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Free Shipping Progress Indicator */}
            <div className="p-4 rounded-2xl bg-[#FFE4EC] border border-[#FFD6E0] flex items-center gap-3">
              <FiTruck className="w-5 h-5 text-[#FF5C8D]" />
              <div className="flex-1 text-xs text-[#23272A]">
                {isFreeShipping ? (
                  <span className="font-bold text-[#FF5C8D]">🎉 You unlocked Free Express Gift Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-[#FF5C8D]">${(shippingThreshold - subtotal).toLocaleString()}.00</strong> more for Free Delivery.
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#FFE4EC] overflow-hidden divide-y divide-[#FFE4EC] shadow-sm">
              {cartItems.map((item, idx) => (
                <div key={idx} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl bg-pink-50" />
                  
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h3 className="font-heading text-base font-bold text-[#23272A]">{item.name}</h3>
                    <p className="text-xs text-[#64748B]">Edition: {item.size} | Ribbon: {item.color}</p>
                    <span className="text-xs font-bold text-[#FF5C8D]">${item.price}.00 each</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#FFD6E0] rounded-full px-3 py-1 bg-pink-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-[#64748B] hover:text-[#FF5C8D]"
                    >
                      <FiMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#23272A]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-[#64748B] hover:text-[#FF5C8D]"
                    >
                      <FiPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total & Remove */}
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-[#FF5C8D]">${(item.price * item.quantity).toLocaleString()}.00</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#94A3B8] hover:text-red-500 transition-colors p-2"
                      title="Remove Item"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#FFE4EC] shadow-sm space-y-6">
            <h3 className="font-heading text-xl font-bold text-[#23272A] pb-4 border-b border-[#FFE4EC]">
              Gift Order Summary
            </h3>

            <div className="space-y-3 text-xs text-[#64748B]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#23272A]">${subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Gift Wrapping & Delivery</span>
                <span className="font-bold text-[#FF5C8D]">{isFreeShipping ? 'Free' : `$${shippingCost}.00`}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#FFE4EC] flex justify-between text-base font-bold text-[#23272A]">
              <span>Total</span>
              <span className="text-[#FF5C8D]">${grandTotal.toLocaleString()}.00</span>
            </div>

            <div>
              <Link to="/checkout" className="w-full btn-pink py-4 text-center block">
                Proceed to Checkout <FiLock className="inline w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
