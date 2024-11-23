// src/components/Users/UserDetails.jsx

import React from 'react';
import Button from '../Common/Button';
import clsx from 'clsx';
import { formatDate } from '../../utils/helpers';

const UserDetails = ({ user, onEdit, onDeactivate, onResetPassword }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Information */}
        <div>
          <p className="text-gray-700">
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Role:</span> {user.role}
          </p>
        </div>
        <div>
          <p className="text-gray-700">
            <span className="font-semibold">Registered At:</span>{' '}
            {formatDate(user.createdAt)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Status:</span>{' '}
            <span
              className={clsx(
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                {
                  'bg-green-100 text-green-800': user.isActive === true,
                  'bg-yellow-100 text-yellow-800': user.isActive === false,
                }
              )}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Last Login:</span>{' '}
            {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
          </p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="mt-6 flex space-x-2">
        <Button onClick={onEdit} className="bg-green-500 hover:bg-green-600">
          Edit
        </Button>
        {user.isActive ? (
          <Button
            onClick={onDeactivate}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Deactivate
          </Button>
        ) : (
          <Button
            onClick={onDeactivate}
            className="bg-green-500 hover:bg-green-600"
          >
            Activate
          </Button>
        )}
        <Button
          onClick={onResetPassword}
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          Reset Password
        </Button>
      </div>
      {/* Additional Sections (e.g., Recent Activity, Audit Logs) can be added here */}
    </div>
  );
};

export default UserDetails;
