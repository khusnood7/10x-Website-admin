// src/components/Users/InviteUser.jsx

import React, { useState } from 'react';
import Button from '../Common/Button';
import { USER_ROLES } from '../../utils/constants';
import { FiAlertCircle } from 'react-icons/fi';

const InviteUser = ({ onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(USER_ROLES.USER);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!email || !role) {
      setError('Please provide both email and role.');
      return;
    }

    // Optional: Prevent inviting normal users
    if (role === USER_ROLES.USER) {
      setError("Sorry, we can't invite a normal user from this form.");
      return;
    }

    try {
      await onInvite(email, role);
      setSuccess('Invitation sent successfully.');
      setEmail('');
      setRole(USER_ROLES.USER);
      // toast.success('Invitation sent successfully.'); // Already handled in context
    } catch (err) {
      setError(err.message || 'Failed to invite user.');
      // toast.error(`Invitation failed: ${err}`); // Already handled in context
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h3 className="text-2xl font-semibold mb-4">Invite New User</h3>
      {error && (
        <div className="flex items-center text-red-500 mb-4">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center text-green-500 mb-4">
          <FiAlertCircle className="mr-2" />
          <span>{success}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="user@example.com"
          />
        </div>
        {/* Role Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Role</option>
            {Object.values(USER_ROLES).map((roleValue) => (
              <option key={roleValue} value={roleValue}>
                {roleValue.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        {/* Submit Button */}
        <div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
            Send Invitation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InviteUser;
