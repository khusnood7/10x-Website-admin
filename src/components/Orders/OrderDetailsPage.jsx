// src/components/Orders/OrderDetailsPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOrders from '../../hooks/useOrders';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import toast from 'react-hot-toast';
import Select from 'react-select';
import ErrorBoundary from '../Common/ErrorBoundary'; // Ensure you have this component
import AuthContext from '../../contexts/AuthContext'; // Assuming you have an AuthContext

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext); // Retrieve the auth token from context
  const { fetchOrderById, changeOrderStatus, cancelOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Define allowed transitions
  const allowedTransitions = {
    pending: ['processing', 'shipped', 'delivered', 'cancelled'],
    processing: ['shipped', 'delivered', 'cancelled'],
    shipped: ['delivered', 'refunded'],
    delivered: ['refunded'],
    cancelled: [],
    refunded: [],
  };

  useEffect(() => {
    const getOrder = async () => {
      try {
        const fetchedOrder = await fetchOrderById(id, authToken);
        setOrder(fetchedOrder);
      } catch (err) {
        setError(err.message || 'Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [fetchOrderById, id, authToken]);

  // Early returns to prevent accessing order when it's null
  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Order not found.</p>;

  // Now order exists, safe to access order.status
  const nextAllowedStatuses = allowedTransitions[order.status] || [];

  const statusOptions = nextAllowedStatuses.map((status) => ({
    value: status,
    label: capitalize(status),
  }));

  if (nextAllowedStatuses.length === 0) {
    // No transitions allowed
    statusOptions.push({ value: order.status, label: capitalize(order.status), isDisabled: true });
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const openUpdateModal = () => {
    setNewStatus(order.status);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a new status.');
      return;
    }

    try {
      await changeOrderStatus(order._id, newStatus, authToken);
      setOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
      setIsUpdateModalOpen(false);
      toast.success('Order status updated successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to update order status.');
    }
  };

  const openCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelOrder = async (reason) => {
    if (!reason) {
      toast.error('Please provide a reason for cancellation.');
      return;
    }

    try {
      await cancelOrderById(order._id, reason, authToken);
      setOrder((prevOrder) => ({ ...prevOrder, status: 'cancelled' }));
      setIsCancelModalOpen(false);
      toast.success('Order cancelled successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order.');
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-6">
        <Button onClick={() => navigate('/admin/orders')} className="bg-gray-500 hover:bg-gray-600 mb-4">
          Back to Orders
        </Button>

        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Order Details Display */}
          <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
          <p><strong>Order Number:</strong> {order.orderNumber}</p>
          <p><strong>Status:</strong> {capitalize(order.status)}</p>
          <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Shipping Address:</strong> {formatAddress(order.shippingAddress)}</p>
          <p><strong>Billing Address:</strong> {formatAddress(order.billingAddress)}</p>

          {/* Items Table */}
          <table className="min-w-full mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <img src={item.product.thumbnail || 'https://via.placeholder.com/50'} alt={item.product.title} width="50" height="50" />
                  </td>
                  <td className="border px-4 py-2">{item.product.title}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">${item.price.toFixed(2)}</td>
                  <td className="border px-4 py-2">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            {nextAllowedStatuses.length > 0 && (
              <Button
                onClick={openUpdateModal}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Update Status
              </Button>
            )}
            {order.status !== 'cancelled' && order.status !== 'refunded' && (
              <Button
                onClick={openCancelModal}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Update Status Modal */}
        {isUpdateModalOpen && (
          <Modal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            title={`Update Status for ${order.orderNumber}`}
          >
            <div className="space-y-4">
              <Select
                options={statusOptions}
                value={statusOptions.find(option => option.value === newStatus)}
                onChange={(option) => setNewStatus(option.value)}
                placeholder="Select new status"
                isClearable
              />
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Cancel Order Modal */}
        {isCancelModalOpen && (
          <Modal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            title={`Cancel Order ${order.orderNumber}`}
          >
            <CancelOrderForm onSubmit={handleCancelOrder} />
          </Modal>
        )}
      </div>
    </ErrorBoundary>
  );
};

/**
 * Format Address Object into a String
 * @param {Object} address - Address object with keys {street, city, state, zip, country, _id}
 * @returns {string} - Formatted address string
 */
const formatAddress = (address) => {
  if (!address) return 'N/A';
  const { street, city, state, zip, country } = address;
  return `${street}, ${city}, ${state}, ${zip}, ${country}`;
};

/**
 * CancelOrderForm Component
 * A simple form to input cancellation reason.
 */
const CancelOrderForm = ({ onSubmit }) => {
  const [reason, setReason] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(reason);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason for Cancellation
        </label>
        <textarea
          id="reason"
          name="reason"
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter reason..."
        ></textarea>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={() => onSubmit(null)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Confirm Cancellation
        </Button>
      </div>
    </form>
  );
};

export default OrderDetailsPage;
