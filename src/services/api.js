const RENDER_API_URL = 'https://backend-e4m8.onrender.com/api';
const LOCAL_API_URL = 'http://localhost:5001/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || RENDER_API_URL;

async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok && res.status !== 400 && res.status !== 401 && res.status !== 404) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res;
  } catch (primaryErr) {
    try {
      const localRes = await fetch(`${LOCAL_API_URL}${endpoint}`, options);
      return localRes;
    } catch (fallbackErr) {
      throw primaryErr;
    }
  }
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

  async updateOrderStatus(id, status) {
    try {
      const res = await fetchAPI(`/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
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
  }
};
