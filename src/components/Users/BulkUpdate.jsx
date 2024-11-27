// src/components/Users/BulkUpdate.jsx

import React, { useState } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { useUsers } from '../../contexts/UserContext';

const BulkUpdate = ({ selectedUserIds }) => {
  const { bulkUpdateUsers } = useUsers(); // Destructure the bulkUpdateUsers function from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Action States
  const [newRole, setNewRole] = useState('');
  const [statusAction, setStatusAction] = useState(''); // 'activate' or 'deactivate'
  const [isDelete, setIsDelete] = useState(false);
  
  // Confirmation State for Deletion
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSubmit = async () => {
    const actions = [];

    if (newRole) {
      actions.push({
        action: 'changeRole',
        data: {
          role: newRole,
        },
      });
    }

    if (statusAction) {
      actions.push({
        action: 'changeStatus',
        data: {
          isActive: statusAction === 'activate',
        },
      });
    }

    if (isDelete) {
      actions.push({
        action: 'deleteUsers',
      });
    }

    if (actions.length === 0) {
      alert('Please select at least one action to perform.');
      return;
    }

    try {
      await bulkUpdateUsers({
        userIds: selectedUserIds,
        actions: actions,
      });
      // Optionally, you can perform additional actions here like refetching users
    } catch (error) {
      console.error('bulkUpdateUsers error:', error);
      // The error is already handled in the context with toasts
    }

    // Reset States
    setIsModalOpen(false);
    setNewRole('');
    setStatusAction('');
    setIsDelete(false);
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    handleSubmit();
    setIsConfirmOpen(false);
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)} 
        disabled={selectedUserIds.length === 0}
        className="bg-gradient-to-r from-black to-[#0821D2] text-white px-4 py-2 md:px-6 md:py-3 shadow-lg quantico-bold-italic text-[16spx] hover:shadow-xl transition-shadow"
      >
        <i class="fa-brands fa-stack-overflow"></i> Bulk Update
      </Button>

      {/* Bulk Update Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Bulk Update Users">
        <div className="space-y-6">
          {/* Change Role Section */}
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Change Role</h3>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="mt-2 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select New Role --</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="MARKETING_MANAGER">Marketing Manager</option>
              <option value="PRODUCT_MANAGER">Product Manager</option>
              <option value="USER">User</option>
            </select>
          </div>

          {/* Change Status Section */}
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Change Status</h3>
            <div className="mt-2 flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="activate"
                  checked={statusAction === 'activate'}
                  onChange={() => setStatusAction('activate')}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Activate</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="deactivate"
                  checked={statusAction === 'deactivate'}
                  onChange={() => setStatusAction('deactivate')}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Deactivate</span>
              </label>
            </div>
          </div>

          {/* Delete Users Section */}
          <div className="border-t border-gray-200 pt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isDelete}
                onChange={(e) => setIsDelete(e.target.checked)}
                className="form-checkbox h-5 w-5 text-red-600"
              />
              <span className="ml-2 text-red-600 font-medium">Delete Selected Users</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button 
              onClick={() => setIsModalOpen(false)} 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Update
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      {isConfirmOpen && (
        <Modal isOpen={isConfirmOpen} onClose={cancelDelete} title="Confirm Deletion">
          <div className="space-y-4">
            <p className="text-gray-700">Are you sure you want to delete the selected users? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={cancelDelete} 
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BulkUpdate;
