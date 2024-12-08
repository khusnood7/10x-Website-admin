// src/services/orderService.js

const ORDERS_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * List of allowed order statuses as per backend definitions.
 * Ensure these match exactly with the backend's allowed statuses.
 */
const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

const orderService = {
  /**
   * Helper function to build query string from params, excluding undefined or null values.
   * @param {Object} params
   * @returns {String} - Query string
   */
  buildQueryString: (params) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
    );
    return new URLSearchParams(filteredParams).toString();
  },

  /**
   * Fetch all orders with optional filters.
   * @param {Object} params - Query parameters for filtering, pagination, sorting.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  getAllOrders: async (params, token) => {
    const query = orderService.buildQueryString(params);
    const url = `${ORDERS_API_URL}/orders${query ? `?${query}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch orders');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Fetch authenticated user's orders with optional filters.
   * @param {Object} params - Query parameters for filtering, pagination.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  getMyOrders: async (params, token) => {
    const query = orderService.buildQueryString(params);
    const url = `${ORDERS_API_URL}/orders/my-orders${query ? `?${query}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch your orders');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Fetch a single order by ID.
   * @param {String} id - Order ID.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  getOrderById: async (id, token) => {
    const response = await fetch(`${ORDERS_API_URL}/orders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch the order');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Update order status.
   * @param {String} id - Order ID.
   * @param {String} status - New status.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  updateOrderStatus: async (id, status, token) => {
    // Ensure that 'status' is a valid string and matches backend expectations
    if (typeof status !== 'string' || status.trim() === '') {
      throw new Error('Invalid status value provided.');
    }

    // Normalize the status to lowercase to match backend expectations
    const normalizedStatus = status.trim().toLowerCase();

    // Validate against allowed statuses
    const validStatuses = Object.values(ORDER_STATUSES);
    if (!validStatuses.includes(normalizedStatus)) {
      throw new Error(`Invalid status value: ${normalizedStatus}. Allowed statuses are: ${validStatuses.join(', ')}`);
    }

    try {
      const response = await fetch(`${ORDERS_API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: normalizedStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed to update order status';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Log the error for debugging
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Cancel an order.
   * @param {String} id - Order ID.
   * @param {String} reason - Cancellation reason.
   * @param {String} token - JWT token for authentication.
   * @returns {Promise<Object>} - Response data.
   */
  cancelOrder: async (id, reason, token) => {
    // Ensure 'reason' is provided and is a non-empty string
    if (typeof reason !== 'string' || reason.trim() === '') {
      throw new Error('Cancellation reason must be provided and cannot be empty.');
    }

    const response = await fetch(`${ORDERS_API_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ reason: reason.trim() }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to cancel the order');
    }

    const data = await response.json();
    return data;
  },
};

export default orderService;
