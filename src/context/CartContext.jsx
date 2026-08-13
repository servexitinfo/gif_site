import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState(['sofa-hollis-2', 'chair-marlow']); // Default 2 wishlist items as per image
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load orders from localStorage or set defaults
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('gift_site_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const clearCart = () => {
    setCartItems([]);
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

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    try {
      localStorage.setItem('gift_site_orders', JSON.stringify(updatedOrders));
    } catch (e) {
      console.error('Failed to save order:', e);
    }
    clearCart();
    showToast(`Order #${newOrder.id} placed successfully!`);
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        orders,
        placeOrder,
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
