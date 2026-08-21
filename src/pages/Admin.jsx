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
  FiCheck,
  FiPrinter,
  FiCopy,
  FiMapPin,
  FiPhone,
  FiMail,
  FiTag,
  FiTrendingUp,
  FiBarChart2,
  FiExternalLink,
  FiUser
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Admin.css';

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus } = useCart();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'analytics' | 'products'
  
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
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  
  // Local tracking edit state per order: { [orderId]: { courier: '', tracking: '' } }
  const [trackingInputs, setTrackingInputs] = useState({});

  const categories = ['All', 'Parents', 'Couple', 'Friends', 'Children', 'Colleague'];

  // Handle Tracking Input Change
  const handleTrackingChange = (orderId, field, value) => {
    setTrackingInputs((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  // Handle Save Tracking Info
  const handleSaveTracking = (ord) => {
    const inputs = trackingInputs[ord.id] || {};
    const courier = inputs.courier !== undefined ? inputs.courier : (ord.courierPartner || 'Delhivery Express');
    const tracking = inputs.tracking !== undefined ? inputs.tracking : (ord.trackingNumber || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`);
    
    updateOrderStatus(ord.id, ord.status, { courierPartner: courier, trackingNumber: tracking });
  };

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
    const query = orderSearch.toLowerCase().trim();
    const matchesSearch = 
      o.id.toLowerCase().includes(query) || 
      (o.recipientName || '').toLowerCase().includes(query) ||
      (o.address || '').toLowerCase().includes(query) ||
      (o.trackingNumber || '').toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Calculate Dashboard Summary Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;
  const shippedOrdersCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Dashboard Top Banner Header */}
      <div className="bg-gradient-to-r from-[#FF5C8D] via-[#FF759E] to-[#FF8DAF] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-xs">
              Merchant Admin Portal
            </span>
            <span className="bg-emerald-400/30 text-emerald-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span> Live Order Tracking
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Order Tracking & Fulfillment Dashboard</h1>
          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
            Monitor real-time customer orders, update AWB tracking numbers, manage courier dispatches, and oversee gift inventory catalog.
          </p>
        </div>

        {/* Quick Action & Tab Navigation Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto relative z-10">
          
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-white text-[#FF5C8D] hover:bg-pink-50 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg transition-all transform hover:-translate-y-0.5"
            title="Create and publish a new gift product to store"
          >
            <FiPlus className="w-4 h-4 text-[#FF5C8D]" />
            <span>+ Add New Product</span>
          </button>

          <div className="flex items-center bg-white/20 p-1.5 rounded-2xl gap-2 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders' ? 'bg-white text-[#FF5C8D] shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics' ? 'bg-white text-[#FF5C8D] shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <FiBarChart2 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products' ? 'bg-white text-[#FF5C8D] shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <FiPackage className="w-4 h-4" />
              <span>Catalog ({products.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        
        {/* Card 1: Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-[#FFE4EC] shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-semibold">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-[#FF5C8D]">
              <FiShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#23272A]">{orders.length}</h3>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <FiTrendingUp className="w-3 h-3" /> All-Time Orders
          </p>
        </div>

        {/* Card 2: Processing */}
        <div className="bg-white p-4 rounded-2xl border border-[#FFE4EC] shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-semibold">Processing</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <FiClock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#23272A]">{pendingOrdersCount}</h3>
          <p className="text-[10px] text-amber-600 font-bold">Needs Packaging</p>
        </div>

        {/* Card 3: Shipped / In-Transit */}
        <div className="bg-white p-4 rounded-2xl border border-[#FFE4EC] shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-semibold">In Transit</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FiTruck className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#23272A]">{shippedOrdersCount}</h3>
          <p className="text-[10px] text-blue-600 font-bold">Courier Dispatched</p>
        </div>

        {/* Card 4: Delivered */}
        <div className="bg-white p-4 rounded-2xl border border-[#FFE4EC] shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-semibold">Delivered</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <FiCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#23272A]">{deliveredOrdersCount}</h3>
          <p className="text-[10px] text-emerald-600 font-bold">Successfully Received</p>
        </div>

        {/* Card 5: Cancelled */}
        <div className="bg-white p-4 rounded-2xl border border-[#FFE4EC] shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-semibold">Cancelled</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <FiXCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#23272A]">{cancelledOrdersCount}</h3>
          <p className="text-[10px] text-rose-600 font-bold">Voided Orders</p>
        </div>

        {/* Card 6: Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-[#FFE4EC] shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] font-semibold">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <FiDollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#23272A]">₹{totalRevenue.toLocaleString()}</h3>
          <p className="text-[10px] text-purple-600 font-bold">Razorpay Gross</p>
        </div>

      </div>

      {/* TAB 1: ORDER TRACKING DASHBOARD (PRIMARY DEFAULT) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Action & Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FFE4EC] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Order Status Pill Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    orderStatusFilter === st
                      ? 'bg-[#FF5C8D] text-white shadow-md'
                      : 'bg-pink-50 text-[#64748B] hover:text-[#FF5C8D] hover:bg-pink-100'
                  }`}
                >
                  {st} {st !== 'All' && `(${orders.filter(o => o.status === st).length})`}
                </button>
              ))}
            </div>

            {/* Real-time Order Search Input */}
            <div className="relative flex-1 md:w-80 bg-pink-50 rounded-full px-4 py-2.5 flex items-center gap-2 border border-[#FFD6E0] w-full">
              <FiSearch className="w-4 h-4 text-[#FF5C8D]" />
              <input
                type="text"
                placeholder="Search Order ID, recipient, phone, city, AWB..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="bg-transparent text-xs text-[#23272A] focus:outline-none w-full placeholder-[#94A3B8]"
              />
            </div>

          </div>

          {/* Orders Tracking Cards Feed */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#FFE4EC] space-y-3 shadow-xs">
              <FiShoppingBag className="w-12 h-12 text-[#94A3B8] mx-auto" />
              <p className="text-base font-bold text-[#23272A]">No Matching Orders Found</p>
              <p className="text-xs text-[#64748B]">Try clearing your search term or selecting a different status filter tab.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((ord) => {
                const currentCourier = (trackingInputs[ord.id]?.courier !== undefined)
                  ? trackingInputs[ord.id].courier
                  : (ord.courierPartner || 'Delhivery Express');

                const currentTracking = (trackingInputs[ord.id]?.tracking !== undefined)
                  ? trackingInputs[ord.id].tracking
                  : (ord.trackingNumber || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`);

                return (
                  <div key={ord.id} className="bg-white rounded-3xl border border-[#FFE4EC] p-6 shadow-sm hover:shadow-md transition-shadow space-y-6">
                    
                    {/* Header: ID, Date, Recipient, Quick Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#FFE4EC] pb-4">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-extrabold text-[#FF5C8D] bg-pink-50 px-2.5 py-1 rounded-lg border border-[#FFD6E0]">
                            #{ord.id}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(ord.id);
                              alert(`Copied Order ID #${ord.id}`);
                            }}
                            className="text-[#64748B] hover:text-[#FF5C8D] p-1"
                            title="Copy Order ID"
                          >
                            <FiCopy className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs text-[#94A3B8] font-medium">• Date: {ord.date}</span>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Razorpay Verified
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B]">
                          Recipient: <strong className="text-[#23272A] font-bold text-sm">{ord.recipientName}</strong>
                        </p>
                      </div>

                      {/* Status Selector & Invoice Action */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#64748B] hidden sm:inline">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                            className={`text-xs font-bold rounded-xl px-3 py-2 border text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D] ${
                              ord.status === 'Delivered' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                              ord.status === 'Shipped' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                              ord.status === 'Cancelled' ? 'bg-rose-50 border-rose-300 text-rose-800' :
                              'bg-amber-50 border-amber-300 text-amber-800'
                            }`}
                          >
                            <option value="Processing">🟡 Status: Processing</option>
                            <option value="Shipped">🔵 Status: Shipped / In Transit</option>
                            <option value="Delivered">🟢 Status: Delivered</option>
                            <option value="Cancelled">🔴 Status: Cancelled</option>
                          </select>
                        </div>

                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-3 py-2 rounded-xl bg-pink-50 text-[#FF5C8D] border border-[#FFD6E0] hover:bg-[#FF5C8D] hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
                          title="Print Shipping Label Invoice"
                        >
                          <FiPrinter className="w-4 h-4" />
                          <span className="hidden sm:inline">Invoice Slip</span>
                        </button>

                      </div>

                    </div>

                    {/* Order Visual Tracking Stepper Timeline */}
                    <div className="bg-pink-50/40 p-4 rounded-2xl border border-[#FFE4EC]">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF5C8D] block mb-3">
                        Live Tracking Progress Timeline
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        {[
                          { label: 'Order Confirmed', done: true, icon: FiCheckCircle },
                          { label: 'Gift Packaged', done: ord.status !== 'Cancelled', icon: FiPackage },
                          { label: 'Courier Shipped', done: ord.status === 'Shipped' || ord.status === 'Delivered', icon: FiTruck },
                          { label: 'Delivered', done: ord.status === 'Delivered', icon: FiCheck }
                        ].map((st, i) => {
                          const Icon = st.icon;
                          return (
                            <div key={i} className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                              st.done 
                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' 
                                : 'bg-white border-slate-200 text-slate-400 opacity-60'
                            }`}>
                              <Icon className={`w-4 h-4 ${st.done ? 'text-emerald-600' : 'text-slate-400'}`} />
                              <span className="font-bold text-[11px]">{st.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Body Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                      
                      {/* Left: Ordered Items List (6 Cols) */}
                      <div className="lg:col-span-6 space-y-3">
                        <p className="font-bold text-[#23272A] uppercase tracking-wider text-[11px]">Ordered Gift Items ({ord.items?.length || 0}):</p>
                        <div className="space-y-2">
                          {ord.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-pink-50/40 p-3 rounded-xl border border-[#FFE4EC]">
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-[#FFE4EC]" />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-[#FF5C8D]">
                                    <FiPackage className="w-6 h-6" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-[#23272A]">{item.name}</p>
                                  <p className="text-[11px] text-[#64748B]">Quantity: <strong>{item.quantity}</strong> | Price: ₹{item.price}.00</p>
                                </div>
                              </div>
                              <span className="font-extrabold text-[#FF5C8D] text-sm">₹{item.price * item.quantity}.00</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Shipping Address & Tracking Update Panel (6 Cols) */}
                      <div className="lg:col-span-6 space-y-4">
                        
                        {/* Address Details Box */}
                        <div className="bg-pink-50/30 p-4 rounded-2xl border border-[#FFE4EC] space-y-2">
                          <p className="font-bold text-[#23272A] text-xs flex items-center gap-1.5">
                            <FiMapPin className="text-[#FF5C8D]" /> Full Delivery Address & Contact
                          </p>
                          <p className="text-[#64748B] leading-relaxed bg-white p-3 rounded-xl border border-[#FFE4EC] font-sans">
                            {ord.address || 'Standard Address Info'}
                          </p>
                          
                          {ord.giftNote && (
                            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                              <strong>Gift Card Note:</strong> "{ord.giftNote}"
                            </div>
                          )}
                        </div>

                        {/* Courier Partner & AWB Tracking Number Input Panel */}
                        <div className="bg-white p-4 rounded-2xl border border-[#FFD6E0] space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#23272A] text-xs flex items-center gap-1.5">
                              <FiTruck className="text-[#FF5C8D]" /> Courier Tracking Info (AWB)
                            </span>
                            <span className="text-[10px] text-[#64748B]">Editable</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-[#64748B] mb-1">Courier Partner</label>
                              <input
                                type="text"
                                placeholder="e.g. Delhivery, BlueDart, DTDC"
                                value={currentCourier}
                                onChange={(e) => handleTrackingChange(ord.id, 'courier', e.target.value)}
                                className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl px-3 py-2 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-[#64748B] mb-1">AWB / Tracking Number</label>
                              <input
                                type="text"
                                placeholder="e.g. AWB-98765432"
                                value={currentTracking}
                                onChange={(e) => handleTrackingChange(ord.id, 'tracking', e.target.value)}
                                className="w-full bg-pink-50/50 border border-[#FFD6E0] rounded-xl px-3 py-2 text-xs text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveTracking(ord)}
                              className="px-4 py-2 rounded-xl bg-[#FF5C8D] text-white text-xs font-bold hover:bg-[#e04b79] transition-colors shadow-xs"
                            >
                              Save Tracking Details
                            </button>

                            <div className="text-right">
                              <span className="text-[10px] text-[#64748B] block">Total Order Amount</span>
                              <span className="text-base font-extrabold text-[#FF5C8D]">₹{ord.total}.00</span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: ANALYTICS & SALES DASHBOARD */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FFE4EC] shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C8D]">Sales Performance</span>
              <h2 className="font-heading text-2xl font-bold text-[#23272A] mt-0.5">Order Revenue Analytics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-pink-50/60 p-5 rounded-2xl border border-[#FFD6E0] space-y-2">
                <span className="text-xs font-bold text-[#64748B] uppercase">Total Revenue Collected</span>
                <h3 className="text-3xl font-extrabold text-[#FF5C8D]">₹{totalRevenue.toLocaleString()}.00</h3>
                <p className="text-xs text-[#64748B]">Processed via Razorpay Payment Gateway</p>
              </div>

              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase">Fulfilled Orders</span>
                <h3 className="text-3xl font-extrabold text-emerald-600">{deliveredOrdersCount}</h3>
                <p className="text-xs text-emerald-700">Delivered successfully to recipients</p>
              </div>

              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-800 uppercase">Active Order Pipeline</span>
                <h3 className="text-3xl font-extrabold text-amber-600">{pendingOrdersCount + shippedOrdersCount}</h3>
                <p className="text-xs text-amber-700">Processing or currently in transit</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS CATALOG MANAGEMENT */}
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
                    placeholder="120"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-pink-50 border border-[#FFD6E0] rounded-xl px-3.5 py-2.5 text-[#23272A] focus:outline-none focus:ring-2 focus:ring-[#FF5C8D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#23272A] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="150"
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

      {/* Invoice & Dispatch Label Printable Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto border-2 border-[#FF5C8D]">
            
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Invoice Top Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold text-[#FF5C8D] uppercase tracking-wider">GiftCraft Store Shipping Invoice</span>
                <h2 className="font-heading text-2xl font-bold text-[#23272A] mt-0.5">DISPATCH SLIP #{selectedInvoiceOrder.id}</h2>
                <p className="text-xs text-slate-500">Issued: {selectedInvoiceOrder.date}</p>
              </div>
              <div className="text-right">
                <span className="bg-[#FF5C8D] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  Razorpay Paid
                </span>
              </div>
            </div>

            {/* Dispatch Address & Courier */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">Deliver To:</span>
                <p className="font-bold text-[#23272A] text-sm">{selectedInvoiceOrder.recipientName}</p>
                <p className="text-slate-600 mt-1 leading-relaxed">{selectedInvoiceOrder.address}</p>
              </div>

              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">Shipping Details:</span>
                <p className="text-[#23272A]">Courier: <strong>{selectedInvoiceOrder.courierPartner || 'Delhivery Express'}</strong></p>
                <p className="text-[#23272A] font-mono mt-0.5">AWB: <strong>{selectedInvoiceOrder.trackingNumber || 'AWB-8921409500'}</strong></p>
                <p className="text-slate-500 mt-1">Status: <strong className="text-[#FF5C8D]">{selectedInvoiceOrder.status}</strong></p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <span className="font-bold text-slate-700 text-xs block mb-2">Package Items ({selectedInvoiceOrder.items?.length || 0}):</span>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedInvoiceOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold text-[#23272A]">{item.name}</td>
                      <td className="py-2.5 px-3 text-center font-semibold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#FF5C8D]">₹{item.price * item.quantity}.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Footer & Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Total Paid Invoice Value</span>
                <span className="text-xl font-extrabold text-[#FF5C8D]">₹{selectedInvoiceOrder.total}.00</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="btn-pink py-2.5 px-5 text-xs font-bold flex items-center gap-2"
                >
                  <FiPrinter className="w-4 h-4" /> Print Dispatch Slip
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
