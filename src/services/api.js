const RENDER_API_URL = 'https://backend-e4m8.onrender.com/api';
const LOCAL_API_URL = 'http://localhost:5001/api';

const RAW_API_URL = (import.meta.env.VITE_API_BASE_URL || RENDER_API_URL).trim();
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

async function fetchAPI(endpoint, options = {}) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const targetUrls = isLocal ? [`${LOCAL_API_URL}${path}`, `${API_BASE_URL}${path}`] : [`${API_BASE_URL}${path}`];

  let lastError;
  for (const url of targetUrls) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status < 500) {
        return res;
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Network request failed');
}

export const apiService = {
  // Products API
  async getProducts(category = 'All', search = '') {
    try {
      const query = new URLSearchParams();
      if (category && category !== 'All') query.append('category', category);
      if (search) query.append('search', search);

      const res = await fetchAPI(`/products?${query.toString()}`);
      if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('Backend API offline or unreachable, using client state:', err.message);
      return null;
    }
  },

  async getProductById(id) {
    try {
      const res = await fetchAPI(`/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      return data.data || null;
    } catch (err) {
      console.warn('Backend API error:', err.message);
      return null;
    }
  },

  async addProduct(productData) {
    try {
      const res = await fetchAPI('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('Failed to add product');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('Backend API error:', err.message);
      return null;
    }
  },

  async updateProduct(id, productData) {
    try {
      const res = await fetchAPI(`/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('Failed to update product');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('Backend API error:', err.message);
      return null;
    }
  },

  async deleteProduct(id) {
    try {
      const res = await fetchAPI(`/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete product');
      return true;
    } catch (err) {
      console.warn('Backend API error:', err.message);
      return false;
    }
  },

  // Orders API
  async getOrders() {
    try {
      const res = await fetchAPI('/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('Backend API offline or unreachable, using client state:', err.message);
      return null;
    }
  },

  async getOrderById(id) {
    try {
      const res = await fetchAPI(`/orders/${id}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      return data.data || null;
    } catch (err) {
      console.warn('Backend API error:', err.message);
      return null;
    }
  },

  async createOrder(orderData) {
    try {
      const res = await fetchAPI('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Failed to create order');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('Backend API error:', err.message);
      return null;
    }
  },

  async updateOrderStatus(id, status, trackingInfo = {}) {
    try {
      const res = await fetchAPI(`/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          courierPartner: trackingInfo.courierPartner,
          trackingNumber: trackingInfo.trackingNumber
        })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('Backend API error:', err.message);
      return null;
    }
  },

  // Auth API
  async registerUser(userData) {
    try {
      const res = await fetchAPI('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async loginUser(credentials) {
    try {
      const res = await fetchAPI('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // Razorpay Payment API
  async createRazorpayOrder(paymentData) {
    try {
      let res = await fetchAPI('/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      if (!res.ok) {
        res = await fetchAPI('/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData)
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed to create Razorpay order');
      return data;
    } catch (err) {
      console.warn('Razorpay Create Order API Warning:', err.message);
      return { success: false, error: err.message, message: err.message };
    }
  },

  async verifyRazorpayPayment(verificationData) {
    try {
      let res = await fetchAPI('/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationData)
      });
      if (!res.ok) {
        res = await fetchAPI('/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verificationData)
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Razorpay payment verification failed');
      return data;
    } catch (err) {
      console.warn('Razorpay Verification API Warning:', err.message);
      return { success: false, error: err.message, message: err.message };
    }
  }
};
