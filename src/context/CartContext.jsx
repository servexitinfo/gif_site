import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

import sofaMain from '../assets/sofa_main.png';
import sofaSide from '../assets/sofa_side.png';
import chairMarlow from '../assets/chair_marlow.png';
import tableBowen from '../assets/table_bowen.png';
import lampAlder from '../assets/lamp_alder.png';

const CartContext = createContext();

const initialProducts = [
  {
    id: 'gift-flower-vase',
    name: 'Artisanal Ceramic Flower Vase',
    category: 'Parents',
    price: 120,
    originalPrice: 150,
    rating: 5.0,
    reviews: 48,
    stock: 15,
    image: tableBowen,
    desc: 'Handcrafted ceramic flower vase with soft pastel rose arrangement.',
    isFeatured: true
  },
  {
    id: 'gift-teddy-bear',
    name: 'Fluffy Pink Plush Teddy Bear',
    category: 'Children',
    price: 45,
    originalPrice: 60,
    rating: 4.9,
    reviews: 92,
    stock: 25,
    image: chairMarlow,
    desc: 'Ultra-soft pink plush teddy bear toy with satin ribbon bow tie.',
    isFeatured: true
  },
  {
    id: 'gift-pen-set',
    name: 'Luxury Fountain Pen & Cufflinks Set',
    category: 'Colleague',
    price: 180,
    originalPrice: 220,
    rating: 4.8,
    reviews: 34,
    stock: 10,
    image: sofaSide,
    desc: 'Executive fountain pen & silver cufflinks in a handcrafted wooden gift presentation box.',
    isFeatured: false
  },
  {
    id: 'gift-custom-mug',
    name: 'Customized Ceramic Coffee Mug',
    category: 'Friends',
    price: 25,
    originalPrice: 35,
    rating: 4.9,
    reviews: 110,
    stock: 50,
    image: lampAlder,
    desc: 'Personalized ceramic coffee mug with gold foil handle and typography.',
    isFeatured: true
  },
  {
    id: 'gift-photo-frame',
    name: 'Memory Wood Picture Frame Set',
    category: 'Parents',
    price: 65,
    originalPrice: 85,
    rating: 4.7,
    reviews: 26,
    stock: 18,
    image: sofaMain,
    desc: 'Elegant natural wood picture frame designed for cherished family memories.',
    isFeatured: false
  },
  {
    id: 'gift-perfume-box',
    name: 'Rose Gold Perfume Gift Box',
    category: 'Couple',
    price: 95,
    originalPrice: 120,
    rating: 5.0,
    reviews: 53,
    stock: 20,
    image: tableBowen,
    desc: 'Luxury glass perfume bottle with pink floral notes and velvet gift box.',
    isFeatured: true
  }
];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState(['gift-flower-vase', 'gift-perfume-box']);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load products from localStorage or use initial list
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('gift_site_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Load orders from localStorage or set defaults
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('gift_site_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with Backend API on mount
  useEffect(() => {
    async function loadBackendData() {
      const apiProducts = await apiService.getProducts();
      if (apiProducts && apiProducts.length > 0) {
        setProducts(apiProducts);
      }
      const apiOrders = await apiService.getOrders();
      if (apiOrders) {
        setOrders(apiOrders);
      }
    }
    loadBackendData();
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

  // Product Management Methods (Admin)
  const addProduct = (newProduct) => {
    const productToAdd = {
      ...newProduct,
      id: newProduct.id || `gift-${Date.now()}`,
      rating: newProduct.rating || 5.0,
      reviews: newProduct.reviews || 1,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || newProduct.price * 1.2),
      stock: Number(newProduct.stock || 10),
      image: newProduct.image || tableBowen,
      isFeatured: newProduct.isFeatured || false
    };
    setProducts((prev) => [productToAdd, ...prev]);
    apiService.addProduct(productToAdd);
    showToast(`Added product "${productToAdd.name}"`);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    );
    apiService.updateProduct(updatedProduct.id, updatedProduct);
    showToast(`Updated product "${updatedProduct.name}"`);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    apiService.deleteProduct(id);
    showToast('Product removed');
  };

  // Order Management Methods (Admin)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedSteps = ord.steps ? ord.steps.map((step) => {
            if (newStatus === 'Shipped' && step.label.includes('Shipped')) {
              return { ...step, date: 'Dispatched', completed: true };
            }
            if (newStatus === 'Delivered') {
              return { ...step, completed: true, date: 'Delivered' };
            }
            return step;
          }) : [];

          return {
            ...ord,
            status: newStatus,
            steps: updatedSteps.length ? updatedSteps : ord.steps
          };
        }
        return ord;
      })
    );
    apiService.updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} status changed to ${newStatus}`);
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: `GIFT-${Math.floor(100000 + Math.random() * 900000)}`,
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
    apiService.createOrder(newOrder);
    clearCart();
    showToast(`Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  // Express 1-Click Single Product Purchase Flow
  const expressBuy = (productItem, customerDetails) => {
    const totalAmount = productItem.price * productItem.quantity + 50; // ₹50 express shipping
    const newOrder = {
      id: `EXPRESS-${Math.floor(100000 + Math.random() * 900000)}`,
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
    apiService.createOrder({ ...newOrder, isExpress: true });
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

  const refreshProducts = async () => {
    const apiProducts = await apiService.getProducts();
    if (apiProducts && apiProducts.length > 0) {
      setProducts(apiProducts);
    }
  };

  const refreshOrders = async () => {
    const apiOrders = await apiService.getOrders();
    if (apiOrders) {
      setOrders(apiOrders);
    }
  };

  return (
    <CartContext.Provider
      value={{
        products,
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
