// src/contexts/OrderContext.jsx

import React, { createContext, useState, useCallback, useContext } from 'react';
import orderService from '../api/orderService';
import toast from 'react-hot-toast';
import AuthContext from './AuthContext'; // Import AuthContext

const OrderContext = createContext();

/**
 * OrderProvider component to wrap around parts of the app that need order data.
 */
export const OrderProvider = ({ children }) => {
  const { token, logout } = useContext(AuthContext); // Get token and logout from AuthContext
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all orders with optional filters.
   * @param {Object} params - Query parameters.
   */
  const fetchAllOrders = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllOrders(params, token);
      setOrders(data.data);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders.');
      toast.error(err.message || 'Failed to fetch orders.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Fetch authenticated user's orders with optional filters.
   * @param {Object} params - Query parameters.
   */
  const fetchMyOrders = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getMyOrders(params, token);
      setOrders(data.data);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch your orders.');
      toast.error(err.message || 'Failed to fetch your orders.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Fetch a single order by ID.
   * @param {String} id - Order ID.
   */
  const fetchOrderById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrderById(id, token);
      return data.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch the order.');
      toast.error(err.message || 'Failed to fetch the order.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Update order status.
   * @param {String} id - Order ID.
   * @param {String} status - New status.
   */
  const changeOrderStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.updateOrderStatus(id, status, token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: data.data.status } : order
        )
      );
      toast.success(data.message || 'Order status updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update order status.');
      toast.error(err.message || 'Failed to update order status.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /**
   * Cancel an order.
   * @param {String} id - Order ID.
   * @param {String} reason - Cancellation reason.
   */
  const cancelOrderById = useCallback(async (id, reason) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.cancelOrder(id, reason, token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: 'cancelled' } : order
        )
      );
      toast.success(data.message || 'Order cancelled successfully.');
    } catch (err) {
      setError(err.message || 'Failed to cancel the order.');
      toast.error(err.message || 'Failed to cancel the order.');
      if (err.message === 'Invalid token' || err.message === 'Token expired') {
        logout();
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        totalOrders,
        loading,
        error,
        fetchAllOrders,
        fetchMyOrders,
        fetchOrderById,
        changeOrderStatus,
        cancelOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
