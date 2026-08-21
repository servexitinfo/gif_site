import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheck, FiClock, FiShield, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import catParents from '../assets/cat_parents.png';
import catCouple from '../assets/cat_couple.png';
import './Orders.css';

export default function Orders() {
  const { orders } = useCart();

  const allOrders = orders || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-[#FF5C8D] uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">
            Gift History & Tracking
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#23272A] mt-2">
            My Gift Orders ({allOrders.length})
          </h1>
        </div>
        <Link to="/products" className="hero-btn-outline text-xs py-2.5 px-6">
          Continue Shopping
        </Link>
      </div>

      {allOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#FFE4EC] text-center space-y-4 shadow-xs">
          <FiShoppingBag className="w-12 h-12 text-[#FF5C8D] mx-auto" />
          <h3 className="text-xl font-bold text-[#23272A]">No Gift Orders Found</h3>
          <p className="text-xs text-[#718096]">You haven't placed any gift orders yet.</p>
          <Link to="/products" className="hero-btn-pink inline-flex items-center gap-2">
            Shop Gift Boxes <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {allOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-[#FFE4EC] p-6 sm:p-8 space-y-6 shadow-xs hover:shadow-md transition-shadow">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#FFE4EC]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FF5C8D] bg-pink-50 px-2.5 py-0.5 rounded-lg border border-[#FFC1CC]">
                      #{order.id}
                    </span>
                    <span className="text-xs font-semibold text-[#718096]">Placed on {order.date}</span>
                  </div>
                  {order.recipientName && (
                    <p className="text-xs text-[#23272A]">
                      Recipient: <strong>{order.recipientName}</strong>
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {order.paymentMethod && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFF8F9] text-[#23272A] border border-[#FFE4EC]">
                      <FiShield className="text-emerald-500" /> {order.paymentMethod}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#FFE4EC] text-[#FF5C8D] uppercase tracking-wider">
                    <FiClock className="w-3.5 h-3.5" /> {order.status}
                  </span>
                  <div className="text-lg font-extrabold text-[#23272A]">
                    ₹{order.total.toLocaleString()}.00
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096]">Items Included:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#FFF8F9] p-3 rounded-2xl border border-[#FFE4EC]">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-white" />
                      <div className="flex-1">
                        <h5 className="text-xs font-bold text-[#23272A] line-clamp-1">{item.name}</h5>
                        <p className="text-[11px] text-[#718096]">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-[#FF5C8D]">₹{(item.price * (item.quantity || 1)).toLocaleString()}.00</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Tracking Step Bar */}
              {order.steps && (
                <div className="pt-6 border-t border-[#FFE4EC]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#23272A] mb-4 flex items-center gap-2">
                    <FiTruck className="text-[#FF5C8D]" /> Delivery Progress Tracker
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {order.steps.map((step, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                            step.completed
                              ? 'bg-[#FF5C8D] text-white shadow-sm'
                              : 'bg-slate-100 text-[#718096] border border-slate-200'
                          }`}
                        >
                          {step.completed ? <FiCheck className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${step.completed ? 'text-[#23272A]' : 'text-[#718096]'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-[#718096]">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
