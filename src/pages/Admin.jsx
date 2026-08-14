import React, { useState } from 'react';
import { 
  FiPackage, 
  FiShoppingBag, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiCheckCircle, 
  FiTruck, 
  FiClock, 
  FiXCircle, 
  FiFilter, 
  FiDollarSign,
  FiX,
  FiStar,
  FiCheck
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Admin.css';

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus } = useCart();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  
  // Products Management State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State for Add / Edit Product
  const [formData, setFormData] = useState({
    name: '',
    category: 'Parents',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    desc: '',
    isFeatured: false
  });

  // Orders Management State
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');

  const categories = ['All', 'Parents', 'Couple', 'Friends', 'Children', 'Colleague'];

  // Handle Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Parents',
      price: '',
      originalPrice: '',
      stock: '15',
      image: '',
      desc: '',
      isFeatured: false
    });
    setIsProductModalOpen(true);
  };

  // Handle Open Edit Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock || 10,
      image: product.image || '',
      desc: product.desc || '',
      isFeatured: product.isFeatured || false
    });
    setIsProductModalOpen(true);
  };

  // Handle Save Product Form
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price * 1.2),
        stock: Number(formData.stock || 10),
        image: formData.image || editingProduct.image,
        desc: formData.desc,
        isFeatured: formData.isFeatured
      });
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price * 1.2),
        stock: Number(formData.stock || 10),
        image: formData.image || undefined,
        desc: formData.desc,
        isFeatured: formData.isFeatured
      });
    }
    setIsProductModalOpen(false);
  };

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
      o.recipientName.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Dashboard Summary Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-[#FF5C8D] to-[#FF8DAF] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Merchant & Admin Portal
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-2">Manage Products & Orders</h1>
          <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-xl">
            Control your gift inventory, add new artisanal products, monitor incoming customer orders, and update shipping dispatch statuses.
          </p>
        </div>

        {/* Tab Switch Buttons */}
        <div className="flex items-center bg-white/20 p-1.5 rounded-2xl gap-2 backdrop-blur-md w-full md:w-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products' ? 'bg-white text-[#FF5C8D] shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <FiPackage className="w-4 h-4" />
            <span>Manage Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-white text-[#FF5C8D] shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>Manage Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#FFE4EC] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-[#FF5C8D]">
            <FiPackage className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] font-semibold">Total Catalog</p>
            <h3 className="text-2xl font-bold text-[#23272A]">{products.length} Items</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#FFE4EC] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] font-semibold">Pending / Processing</p>
            <h3 className="text-2xl font-bold text-[#23272A]">{pendingOrdersCount} Orders</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#FFE4EC] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] font-semibold">Delivered Orders</p>
            <h3 className="text-2xl font-bold text-[#23272A]">{deliveredOrdersCount} Completed</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#FFE4EC] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] font-semibold">Total Revenue</p>
            <h3 className="text-2xl font-bold text-[#23272A]">₹{totalRevenue}.00</h3>
          </div>
        </div>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Action Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FFE4EC] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProductCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    productCategoryFilter === cat
                      ? 'bg-[#FF5C8D] text-white shadow-sm'
                      : 'bg-pink-50 text-[#64748B] hover:text-[#FF5C8D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search & Add Button */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              <div className="relative flex-1 md:w-64 bg-pink-50 rounded-full px-3.5 py-2 flex items-center gap-2 border border-[#FFD6E0]">
                <FiSearch className="w-4 h-4 text-[#FF5C8D]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="bg-transparent text-xs text-[#23272A] focus:outline-none w-full placeholder-[#94A3B8]"
                />
              </div>

              <button
                onClick={handleOpenAddModal}
                className="btn-pink py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md flex-shrink-0"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

          </div>

          {/* Products Table / Grid */}
          <div className="bg-white rounded-2xl border border-[#FFE4EC] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#23272A]">
                <thead className="bg-pink-50 border-b border-[#FFE4EC] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Product Info</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFE4EC]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-sm text-[#64748B]">
                        No products found in catalog.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-pink-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-pink-50 overflow-hidden border border-[#FFE4EC] flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-[#23272A] line-clamp-1">{product.name}</p>
                              <p className="text-[11px] text-[#64748B] line-clamp-1">{product.desc}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#FF5C8D]">
                          <span className="bg-pink-100 text-[#FF5C8D] px-2.5 py-1 rounded-full text-[10px] uppercase font-bold">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#23272A]">
                          ₹{product.price}.00
                          {product.originalPrice && (
                            <span className="text-[10px] text-[#94A3B8] line-through ml-1.5">
                              ₹{product.originalPrice}.00
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            (product.stock || 0) > 5 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                          }`}>
                            {product.stock || 0} left
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => updateProduct({ ...product, isFeatured: !product.isFeatured })}
                            className={`p-1.5 rounded-lg border transition-all ${
                              product.isFeatured ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                            title="Toggle Featured"
                          >
                            <FiStar className={`w-4 h-4 ${product.isFeatured ? 'fill-amber-500' : ''}`} />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Edit Product"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${product.name}"?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                              title="Delete Product"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Action Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FFE4EC] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    orderStatusFilter === st
                      ? 'bg-[#FF5C8D] text-white shadow-sm'
                      : 'bg-pink-50 text-[#64748B] hover:text-[#FF5C8D]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search Orders */}
            <div className="relative flex-1 md:w-72 bg-pink-50 rounded-full px-3.5 py-2 flex items-center gap-2 border border-[#FFD6E0]">
              <FiSearch className="w-4 h-4 text-[#FF5C8D]" />
              <input
                type="text"
                placeholder="Search by order ID or recipient..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="bg-transparent text-xs text-[#23272A] focus:outline-none w-full placeholder-[#94A3B8]"
              />
            </div>

          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#FFE4EC] space-y-3">
              <FiShoppingBag className="w-12 h-12 text-[#94A3B8] mx-auto" />
              <p className="text-base font-bold text-[#23272A]">No Orders Found</p>
              <p className="text-xs text-[#64748B]">No customer orders match your current search/filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl border border-[#FFE4EC] p-5 sm:p-6 shadow-sm space-y-4">
                  
                  {/* Top Line Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FFE4EC] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#FF5C8D]">#{ord.id}</span>
                        <span className="text-xs text-[#94A3B8]">• {ord.date}</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">Recipient: <strong className="text-[#23272A]">{ord.recipientName}</strong></p>
                    </div>

                    {/* Status Update Control */}
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                        ord.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        ord.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {ord.status}
                      </span>

                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className="text-xs font-semibold bg-pink-50 border border-[#FFD6E0] rounded-xl px-3 py-1.5 text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                      >
                        <option value="Processing">Status: Processing</option>
                        <option value="Shipped">Status: Shipped</option>
                        <option value="Delivered">Status: Delivered</option>
                        <option value="Cancelled">Status: Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    
                    {/* Items List */}
                    <div className="md:col-span-7 space-y-2">
                      <p className="font-bold text-[#23272A]">Ordered Gift Items:</p>
                      <div className="space-y-2">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-pink-50/50 p-2.5 rounded-xl border border-[#FFE4EC]">
                            <div className="flex items-center gap-2.5">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                              )}
                              <div>
                                <p className="font-bold text-[#23272A]">{item.name}</p>
                                <p className="text-[10px] text-[#64748B]">Qty: {item.quantity} | {item.size} | {item.color}</p>
                              </div>
                            </div>
                            <span className="font-bold text-[#FF5C8D]">₹{item.price * item.quantity}.00</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Payment Details */}
                    <div className="md:col-span-5 bg-pink-50/30 p-3.5 rounded-xl border border-[#FFE4EC] space-y-2">
                      <p className="font-bold text-[#23272A]">Delivery & Payment:</p>
                      <p className="text-[#64748B]"><strong className="text-[#23272A]">Address:</strong> {ord.address || 'Standard Address'}</p>
                      <p className="text-[#64748B]"><strong className="text-[#23272A]">Payment:</strong> {ord.paymentMethod}</p>
                      {ord.giftNote && (
                        <p className="text-[#64748B] italic bg-white p-2 rounded-lg border border-[#FFE4EC]">
                          "{ord.giftNote}"
                        </p>
                      )}
                      <div className="pt-2 border-t border-[#FFE4EC] flex justify-between items-center text-sm font-bold">
                        <span>Total Paid:</span>
                        <span className="text-[#FF5C8D] text-base">₹{ord.total}.00</span>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C8D]">Catalog Manager</span>
              <h2 className="font-heading text-2xl font-bold text-[#23272A] mt-0.5">
                {editingProduct ? 'Edit Gift Product' : 'Add New Gift Product'}
              </h2>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-[#23272A] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handcrafted Rose Gold Music Box"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-pink-50 border border-[#FFD6E0] rounded-xl px-3.5 py-2.5 text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23272A] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-pink-50 border border-[#FFD6E0] rounded-xl px-3.5 py-2.5 text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#23272A] mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-pink-50 border border-[#FFD6E0] rounded-xl px-3.5 py-2.5 text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23272A] mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="95"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-pink-50 border border-[#FFD6E0] rounded-xl px-3.5 py-2.5 text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#23272A] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="120"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-pink-50 border border-[#FFD6E0] rounded-xl px-3.5 py-2.5 text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#23272A] mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-pink-50 border border-[#FFD6E0] rounded-xl px-3.5 py-2.5 text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#23272A] mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide gift details, package contents, ribbon choices..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full bg-pink-50 border border-[#FFD6E0] rounded-xl px-3.5 py-2.5 text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#FF5C8D] accent-[#FF5C8D]"
                />
                <label htmlFor="isFeatured" className="font-bold text-[#23272A] cursor-pointer">
                  Feature this gift on home showcase
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FFE4EC]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#FFE4EC] text-[#64748B] font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pink px-6 py-2.5 text-xs font-bold"
                >
                  Save Product
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
