// src/components/Users/UserList.jsx

import React from 'react';
import Button from '../Common/Button';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import HighlightText from './HighlightText'; // Import HighlightText

const UserList = ({
  users,
  onView,
  onEdit,
  onChangeStatus,
  onDelete,
  onSelect,
  selectedUserIds,
  searchTerm,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700 border-b">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    // Select all users
                    const allIds = users.map((user) => user._id);
                    onSelect(allIds);
                  } else {
                    // Deselect all
                    onSelect([]);
                  }
                }}
                checked={selectedUserIds.length === users.length && users.length > 0}
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700 border-b">
              Name
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700 border-b">
              Email
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700 border-b">
              Role
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700 border-b">
              Status
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700 border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="py-4 px-4 text-center text-gray-500 border-b"
              >
                No User Found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user._id)}
                    onChange={() => onSelect(user._id)}
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <HighlightText text={user.name} searchTerm={searchTerm} />
                </td>
                <td className="py-2 px-4 border-b">
                  <HighlightText text={user.email} searchTerm={searchTerm} />
                </td>
                <td className="py-2 px-4 border-b capitalize">
                  {user.role.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={clsx(
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      {
                        'bg-green-100 text-green-800':
                          user.isActive === true,
                        'bg-yellow-100 text-yellow-800':
                          user.isActive === false,
                      }
                    )}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-6 px-4 border-b space-x-2">
                  <Button
                    onClick={() => onView(user._id)}
                    className="bg-indigo-500 hover:bg-indigo-600"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => onEdit(user._id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Edit
                  </Button>
                  {user.isActive ? (
                    <Button
                      onClick={() => onChangeStatus(user._id, false)}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onChangeStatus(user._id, true)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Activate
                    </Button>
                  )}
                  <Button
                    onClick={() => onDelete(user._id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
