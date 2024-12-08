// src/components/Orders/OrderListPage.jsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import useOrders from '../../hooks/useOrders';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import Select from 'react-select';
import Pagination from '../Common/Pagination';
import HighlightText from '../HighlightText';


const OrderListPage = () => {
  const navigate = useNavigate();
  const {
    orders,
    totalOrders,
    loading,
    error,
    fetchAllOrders,
    changeOrderStatus,
    cancelOrderById,
  } = useOrders();

  // State variables for filters
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const ordersPerPage = 10;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  // Fetch orders on component mount and when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: ordersPerPage,
      status: statusFilter ? statusFilter.value : undefined,
      search: searchQuery || undefined,
      sortField: 'createdAt',
      sortOrder: 'desc',
    };
    fetchAllOrders(params);
  }, [fetchAllOrders, currentPage, statusFilter, searchQuery]);

  // Handler for search input with debounce
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  // Status options for filtering
  const statusOptions = useMemo(
    () => [
      { value: 'pending', label: 'Pending' },
      { value: 'processing', label: 'Processing' },
      { value: 'shipped', label: 'Shipped' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'refunded', label: 'Refunded' },
    ],
    []
  );

  // Handle opening the update status modal
  const openUpdateModal = useCallback((order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsUpdateModalOpen(true);
  }, []);

  // Handle updating the order status
  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a new status.');
      return;
    }

    try {
      await changeOrderStatus(selectedOrder._id, newStatus);
      setIsUpdateModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      // Error handling is done in context
    }
  };

  // Handle opening the cancel order modal
  const openCancelModal = useCallback((order) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  }, []);

  // Handle cancelling the order
  const handleCancelOrder = async (reason) => {
    if (!reason) {
      toast.error('Please provide a reason for cancellation.');
      return;
    }

    try {
      await cancelOrderById(selectedOrder._id, reason);
      setIsCancelModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      // Error handling is done in context
    }
  };

  // Table headers
  const headers = ['Order Number', 'Customer', 'Status', 'Total', 'Created At', 'Actions'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 space-y-4 md:space-y-0">
        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          isClearable
          placeholder="Filter by Status"
          className="w-full md:w-1/4"
        />

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Order Number or Customer"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="py-3 px-6 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-100">
                  <td className="py-4 px-6">
                    <HighlightText text={order.orderNumber} highlight={searchQuery} />
                  </td>
                  <td className="py-4 px-6">
                    {order.customer ? order.customer.name : 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        order.status === 'delivered'
                          ? 'bg-green-500'
                          : order.status === 'cancelled' || order.status === 'refunded'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 flex space-x-2">
                    <Button
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => openUpdateModal(order)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Update Status
                    </Button>
                    <Button
                      onClick={() => openCancelModal(order)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Update Status Modal */}
      {isUpdateModalOpen && selectedOrder && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Status for ${selectedOrder.orderNumber}`}
        >
          <div className="space-y-4">
            <Select
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'refunded', label: 'Refunded' },
              ]}
              value={{ value: newStatus, label: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) }}
              onChange={(option) => setNewStatus(option.value)}
              placeholder="Select new status"
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
      {isCancelModalOpen && selectedOrder && (
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title={`Cancel Order ${selectedOrder.orderNumber}`}
        >
          <CancelOrderForm onSubmit={handleCancelOrder} />
        </Modal>
      )}
    </div>
  );
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

export default OrderListPage;
