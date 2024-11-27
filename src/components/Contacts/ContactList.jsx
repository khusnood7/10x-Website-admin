// src/components/Contacts/ContactList.jsx

import React from 'react';
import Button from '../Common/Button';
import HighlightText from '../Users/HighlightText';
import { formatDate } from '../../utils/helpers';
import clsx from 'clsx';

const ContactList = ({
  messages,
  selectedUserIds,
  handleSelect,
  handleSelectAll,
  onView,
  onDelete,
  onUpdateStatus,
  searchQuery,
  sortField,
  sortOrder,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                checked={selectedUserIds.length === messages.length && messages.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </th>
            <th className="py-3 px-6 text-left cursor-pointer">
              Name
            </th>
            <th className="py-3 px-6 text-left cursor-pointer">
              Email
            </th>
            <th className="py-3 px-6 text-left cursor-pointer">
              Subject
            </th>
            <th className="py-3 px-6 text-left cursor-pointer">
              Date
            </th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr
              key={message._id}
              className="border-b hover:bg-gray-100"
            >
              <td className="py-4 px-6">
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(message._id)}
                  onChange={() => handleSelect(message._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>

              <td className="py-4 px-6">
                <HighlightText
                  text={message.name}
                  highlight={searchQuery}
                />
              </td>
              <td className="py-4 px-6">
                <HighlightText
                  text={message.email}
                  highlight={searchQuery}
                />
              </td>
              <td className="py-4 px-6">
                {message.subject}
              </td>
              <td className="py-4 px-6">
                {formatDate(message.createdAt)}
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onView(message._id)}
                    className="bg-gradient-to-r from-black to-[#0821D2] text-white px-4 py-2 shadow-lg quantico-bold-italic text-[14px] hover:shadow-xl transition-shadow"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => onDelete(message._id)}
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 shadow-lg quantico-bold-italic text-[14px] hover:shadow-xl transition-shadow"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => onUpdateStatus(message._id, message.status === 'new' ? 'in-progress' : 'resolved')}
                    className={clsx(
                      "text-white px-4 py-2 shadow-lg quantico-bold-italic text-[14px] hover:shadow-xl transition-shadow",
                      {
                        "bg-green-500 to-green-700": message.status === 'new',
                        "bg-blue-500 to-blue-700": message.status === 'in-progress',
                        "bg-gray-500 to-gray-700": message.status === 'resolved',
                      }
                    )}
                  >
                    {message.status === 'new' && 'Mark In-Progress'}
                    {message.status === 'in-progress' && 'Mark Resolved'}
                    {message.status === 'resolved' && 'Mark In-Progress'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
