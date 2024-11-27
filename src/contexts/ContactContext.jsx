// src/contexts/ContactContext.js

import React, { createContext, useState, useCallback } from 'react';
import contactService from '../api/contactService';
import toast from 'react-hot-toast';

// Create the ContactContext
const ContactContext = createContext();

// ContactProvider component to wrap around parts of the app that need contact data
export const ContactProvider = ({ children }) => {
  // State variables
  const [messages, setMessages] = useState([]); // List of contact messages
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

  /**
   * Fetch contact messages with optional parameters for pagination, search, and filtering
   * @param {Object} params - Query parameters (page, limit, search, status, sortField, sortOrder)
   * @returns {Object} - Contains fetched data
   */
  const fetchContactMessages = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getContactMessages(params);
      setMessages(data.data);
      setTotalPages(data.totalPages || 1);
      console.log('Fetched Messages:', data.data);
      console.log('Total Pages:', data.totalPages);
      return data; // Return full data for further use
    } catch (err) {
      console.error('fetchContactMessages error:', err);
      setError(err.message || 'Failed to fetch contact messages.');
      toast.error(err.message || 'Failed to fetch contact messages.');
      throw err; // Re-throw to allow catching in the page
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a single contact message by ID
   * @param {String} id - Contact Message ID
   * @returns {Object|null} - Message object or null if not found
   */
  const getContactMessageById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getContactMessageById(id);
      return data; // data is the message object
    } catch (err) {
      console.error('getContactMessageById error:', err);
      setError('An error occurred while fetching message details.');
      toast.error('An error occurred while fetching message details.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a contact message by ID
   * @param {String} id - Contact Message ID
   */
  const deleteContactMessage = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await contactService.deleteContactMessage(id);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      toast.success('Contact message deleted successfully.');
    } catch (err) {
      console.error('deleteContactMessage error:', err);
      setError('An error occurred while deleting the contact message.');
      toast.error('An error occurred while deleting the contact message.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update the status of a contact message
   * @param {String} id - Contact Message ID
   * @param {String} status - New status ('new', 'in-progress', 'resolved')
   */
  const updateMessageStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      await contactService.updateMessageStatus(id, status);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, status } : msg))
      );
      toast.success('Message status updated successfully.');
    } catch (err) {
      console.error('updateMessageStatus error:', err);
      setError('An error occurred while updating message status.');
      toast.error('An error occurred while updating message status.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Export contact messages in specified format (CSV/Excel)
   * @param {String} format - Desired export format ('csv' or 'excel')
   */
  const exportContactMessages = useCallback(async (format = 'csv') => {
    setLoading(true);
    setError(null);
    try {
      const blobData = await contactService.exportContactMessages(format);
      const contentType = blobData.type;
      if (
        contentType === 'text/csv' ||
        contentType === 'application/vnd.ms-excel'
      ) {
        const url = window.URL.createObjectURL(new Blob([blobData]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `contact_messages.${format}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Contact messages exported successfully.');
      } else {
        const text = await blobData.text();
        let errorMessage = 'Failed to export contact messages.';
        try {
          const json = JSON.parse(text);
          if (json && json.message) {
            errorMessage = json.message;
          }
        } catch (parseError) {
          // Not JSON, keep default error message
        }
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('exportContactMessages error:', err);
      setError('An error occurred while exporting contact messages.');
      toast.error('An error occurred while exporting contact messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ContactContext.Provider
      value={{
        messages,
        loading,
        error,
        totalPages,
        fetchContactMessages,
        getContactMessageById,
        deleteContactMessage,
        updateMessageStatus,
        exportContactMessages,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export default ContactContext;
