// src/components/Users/InviteUser.jsx

import React, { useState } from 'react';
import Button from '../Common/Button';
import { USER_ROLES } from '../../utils/constants';

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

    try {
      await onInvite(email, role);
      setSuccess('Invitation sent successfully.');
      setEmail('');
      setRole(USER_ROLES.USER);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-semibold mb-4">Invite New User</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
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
            <option value={USER_ROLES.SUPER_ADMIN}>Super Admin</option>
            <option value={USER_ROLES.MARKETING_MANAGER}>Marketing Manager</option>
            <option value={USER_ROLES.PRODUCT_MANAGER}>Product Manager</option>
            <option value={USER_ROLES.USER}>User</option>
          </select>
        </div>
        {/* Submit Button */}
        <div>
          <Button type="submit" className="w-full">
            Send Invitation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InviteUser;
