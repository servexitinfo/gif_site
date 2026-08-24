import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Products and Orders state initialized from backend API
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('gift_site_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('gift_site_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync strictly with Backend API on mount
  const refreshProducts = async () => {
    try {
      const apiProducts = await apiService.getProducts();
      if (Array.isArray(apiProducts)) {
        setProducts(apiProducts);
      }
    } catch (e) {
      console.warn('Failed to refresh products from DB:', e);
    }
  };

  const refreshOrders = async () => {
    try {
      const apiOrders = await apiService.getOrders();
      if (Array.isArray(apiOrders)) {
        setOrders(apiOrders);
      }
    } catch (e) {
      console.warn('Failed to refresh orders from DB:', e);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshOrders();
  }, []);

  // Save products to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('gift_site_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  }, [products]);

  // Save orders to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('gift_site_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }, [orders]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Product Management Methods (Admin - Direct DB Integration)
  const addProduct = async (newProduct) => {
    const productToAdd = {
      ...newProduct,
      id: newProduct.id || `gift-${Date.now()}`,
      rating: newProduct.rating || 5.0,
      reviews: newProduct.reviews || 1,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || newProduct.price * 1.2),
      stock: Number(newProduct.stock || 10),
      image: newProduct.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
      isFeatured: newProduct.isFeatured || false
    };
    setProducts((prev) => [productToAdd, ...prev]);
    await apiService.addProduct(productToAdd);
    await refreshProducts();
    showToast(`Added product "${productToAdd.name}"`);
  };

  const updateProduct = async (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    );
    await apiService.updateProduct(updatedProduct.id, updatedProduct);
    await refreshProducts();
    showToast(`Updated product "${updatedProduct.name}"`);
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await apiService.deleteProduct(id);
    await refreshProducts();
    showToast('Product removed');
  };

  // Order Management Methods (Admin - Direct DB Integration)
  const updateOrderStatus = async (orderId, newStatus, trackingInfo = {}) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedSteps = ord.steps ? ord.steps.map((step, idx) => {
            if (newStatus === 'Shipped') {
              if (idx <= 2) return { ...step, date: 'Dispatched', completed: true };
            }
            if (newStatus === 'Delivered') {
              return { ...step, completed: true, date: 'Delivered' };
            }
            return step;
          }) : [];

          return {
            ...ord,
            status: newStatus,
            trackingNumber: trackingInfo.trackingNumber !== undefined ? trackingInfo.trackingNumber : (ord.trackingNumber || ''),
            courierPartner: trackingInfo.courierPartner !== undefined ? trackingInfo.courierPartner : (ord.courierPartner || ''),
            steps: updatedSteps.length ? updatedSteps : ord.steps
          };
        }
        return ord;
      })
    );
    await apiService.updateOrderStatus(orderId, newStatus, trackingInfo);
    await refreshOrders();
    showToast(`Order #${orderId} updated to ${newStatus}`);
  };

  const placeOrder = async (orderData) => {
    const newOrder = {
      id: orderData.id || `GIFT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      total: orderData.total,
      status: 'Processing',
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      recipientName: orderData.recipientName || 'Gift Recipient',
      address: orderData.address || '',
      giftNote: orderData.giftNote || '',
      items: orderData.items || [...cartItems],
      steps: [
        { label: 'Order Placed', date: 'Just now', completed: true },
        { label: 'Artisanal Gift Wrapping', date: 'In Progress', completed: true },
        { label: 'Shipped (Express)', date: 'Expected Tomorrow', completed: false },
        { label: 'Delivered', date: 'Estimated 2 Days', completed: false }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    await apiService.createOrder(newOrder);
    await refreshOrders();
    clearCart();
    showToast(`Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  // Express 1-Click Single Product Purchase Flow
  const expressBuy = async (productItem, customerDetails) => {
    const totalAmount = productItem.price * productItem.quantity + 50; // ₹50 express shipping
    const newOrder = {
      id: customerDetails.id || `EXPRESS-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      total: totalAmount,
      status: 'Processing',
      paymentMethod: customerDetails.paymentMethod || 'Instant Card',
      recipientName: customerDetails.recipientName || 'Direct Customer',
      address: customerDetails.address || 'Express Delivery Address',
      giftNote: customerDetails.giftNote || 'Special Express Gift',
      items: [
        {
          id: productItem.id,
          name: productItem.name,
          price: productItem.price,
          quantity: productItem.quantity || 1,
          color: productItem.color || 'Pink Ribbon',
          size: productItem.size || 'Deluxe Edition',
          image: productItem.image
        }
      ],
      steps: [
        { label: 'Express Order Confirmed', date: 'Just now', completed: true },
        { label: 'Priority Gift Packaging', date: 'In Progress', completed: true },
        { label: 'Express Courier Dispatch', date: 'Within 12 Hours', completed: false },
        { label: 'Guaranteed Delivery', date: 'Tomorrow Morning', completed: false }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    await apiService.createOrder({ ...newOrder, isExpress: true });
    await refreshOrders();
    showToast(`Express Order #${newOrder.id} placed!`);
    return newOrder;
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === product.size && item.color === product.color);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size && item.color === product.color
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prev, product];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Added to wishlist');
        return [...prev, id];
      }
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getProductById = (id) => {
    if (!id) return null;
    const found = products.find((p) => p.id === id || p._id === id);
    return found || null;
  };

  return (
    <CartContext.Provider
      value={{
        products,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        orders,
        placeOrder,
        updateOrderStatus,
        expressBuy,
        refreshOrders,
        wishlist,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        cartCount,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
