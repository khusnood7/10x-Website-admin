// src/api/contactService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Include auth token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch all contact messages
export const getContactMessages = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/contact', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch contact messages.');
  }
};

// Fetch a single contact message by ID
export const getContactMessageById = async (id) => {
  try {
    const response = await axiosInstance.get(`/contact/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch message details.');
  }
};

// Delete a contact message
export const deleteContactMessage = async (id) => {
  try {
    const response = await axiosInstance.delete(`/contact/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete contact message.');
  }
};

// Update message status
export const updateMessageStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(`/contact/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update message status.');
  }
};

// Export messages
export const exportContactMessages = async (format = 'csv') => {
  try {
    const response = await axiosInstance.get('/contact/export', {
      responseType: 'blob',
      params: { format },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to export contact messages.');
  }
};

export default {
  getContactMessages,
  getContactMessageById,
  deleteContactMessage,
  updateMessageStatus,
  exportContactMessages,
};
