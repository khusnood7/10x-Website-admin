// src/components/Contacts/ContactDetails.jsx

import React from 'react';
import Button from '../Common/Button';
import { formatDate } from '../../utils/helpers';

const ContactDetails = ({ message, onClose, onUpdateStatus }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Contact Message Details</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {message.name}</p>
          <p><span className="font-semibold">Email:</span> {message.email}</p>
          <p><span className="font-semibold">Subject:</span> {message.subject}</p>
          <p><span className="font-semibold">Message:</span> {message.message}</p>
          <p><span className="font-semibold">Date:</span> {formatDate(message.createdAt)}</p>
          <p><span className="font-semibold">Status:</span> {message.status}</p>
        </div>
        <div className="mt-6 flex space-x-4">
          <Button
            onClick={() => onUpdateStatus(message._id, message.status === 'new' ? 'in-progress' : 'resolved')}
            className={`bg-${message.status === 'new' ? 'green' : message.status === 'in-progress' ? 'blue' : 'gray'}-500 hover:bg-${message.status === 'new' ? 'green' : message.status === 'in-progress' ? 'blue' : 'gray'}-700 text-white px-4 py-2 rounded`}
          >
            {message.status === 'new' && 'Mark In-Progress'}
            {message.status === 'in-progress' && 'Mark Resolved'}
            {message.status === 'resolved' && 'Mark In-Progress'}
          </Button>
          <Button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
