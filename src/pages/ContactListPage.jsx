// src/pages/ContactListPage.jsx

import React, { useState, useEffect } from 'react';
import ContactList from '../components/Contacts/ContactList';
import Pagination from '../components/Common/Pagination';
import Button from '../components/Common/Button';
import useContacts from '../hooks/useContacts';
import usePagination from '../hooks/usePagination';
import toast from 'react-hot-toast';
import ContactDetails from '../components/Contacts/ContactDetails';
import Modal from '../components/Common/Modal';

const ContactListPage = () => {
  const {
    messages,
    fetchContactMessages,
    loading,
    error,
    deleteContactMessage,
    updateMessageStatus,
    exportContactMessages,
    getContactMessageById,
    totalPages, // Get totalPages from context
  } = useContacts();
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const { currentPage, goToPage } = usePagination(totalPages, 1);
  const [viewingMessage, setViewingMessage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Fetch contact messages whenever dependencies change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchQuery,
      status: statusFilter,
      sortField,
      sortOrder,
    };
    const fetchData = async () => {
      try {
        await fetchContactMessages(params); // Fetch and set messages and totalPages
      } catch (err) {
        toast.error(`Error fetching contact messages: ${err}`);
      }
    };
    fetchData();
  }, [fetchContactMessages, currentPage, searchQuery, statusFilter, sortField, sortOrder]);

  // Handle selecting a single message
  const handleSelect = (id) => {
    setSelectedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  // Handle selecting all messages
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = messages.map((msg) => msg._id);
      setSelectedMessageIds(allIds);
    } else {
      setSelectedMessageIds([]);
    }
  };

  // Handle viewing message details
  const handleView = async (id) => {
    try {
      const message = await getContactMessageById(id);
      setViewingMessage(message);
    } catch (err) {
      toast.error(`Failed to view message: ${err}`);
    }
  };

  // Handle deleting a message
  const handleDelete = (id) => {
    setMessageToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      await deleteContactMessage(messageToDelete);
      toast.success('Contact message deleted successfully.');
      setIsDeleteModalOpen(false);
      setMessageToDelete(null);
      // Refetch messages to reflect deletion
      fetchContactMessages({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        status: statusFilter,
        sortField,
        sortOrder,
      });
    } catch (err) {
      toast.error(`Failed to delete message: ${err}`);
    }
  };

  // Handle updating message status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateMessageStatus(id, newStatus);
      toast.success('Message status updated successfully.');
      // Refetch messages to reflect status change
      fetchContactMessages({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        status: statusFilter,
        sortField,
        sortOrder,
      });
    } catch (err) {
      toast.error(`Failed to update message status: ${err}`);
    }
  };

  // Handle exporting contact messages
  const handleExport = async () => {
    try {
      await exportContactMessages('csv');
      toast.success('Contact messages exported successfully.');
    } catch (err) {
      toast.error(`Export failed: ${err}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="in-progress">In-Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          className="bg-gradient-to-r from-black to-[#0821D2] text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        >
          Export Messages
        </Button>
      </div>

      {/* Contact Messages List */}
      <ContactList
        messages={messages}
        selectedUserIds={selectedMessageIds}
        handleSelect={handleSelect}
        handleSelectAll={handleSelectAll}
        onView={handleView}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
        searchQuery={searchQuery}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          goToPage(page);
        }}
      />

      {/* View Contact Details Modal */}
      {viewingMessage && (
        <Modal isOpen={!!viewingMessage} onClose={() => setViewingMessage(null)} title="Contact Message Details">
          <ContactDetails
            message={viewingMessage}
            onClose={() => setViewingMessage(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
          <div className="space-y-4">
            <p>Are you sure you want to delete the selected contact messages? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await confirmDelete();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactListPage;
