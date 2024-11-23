// src/components/Users/BulkUpdate.jsx

import React, { useState } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

const BulkUpdate = ({ selectedUserIds, onBulkUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [isActive, setIsActive] = useState(null); // null indicates no change

  const handleSubmit = () => {
    const updates = selectedUserIds.map((id) => {
      const fields = {};
      if (newRole) fields.role = newRole;
      if (isActive !== null) fields.isActive = isActive;
      return { id, fields };
    });

    onBulkUpdate(updates);
    setIsModalOpen(false);
    setNewRole('');
    setIsActive(null);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} disabled={selectedUserIds.length === 0}>
        Bulk Update
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Bulk Update Users">
        <div className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Change Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">No Change</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="MARKETING_MANAGER">Marketing Manager</option>
              <option value="PRODUCT_MANAGER">Product Manager</option>
              <option value="USER">User</option>
            </select>
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Change Status</label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="activate"
                  checked={isActive === true}
                  onChange={() => setIsActive(true)}
                  className="form-radio"
                />
                <span className="ml-2">Activate</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="deactivate"
                  checked={isActive === false}
                  onChange={() => setIsActive(false)}
                  className="form-radio"
                />
                <span className="ml-2">Deactivate</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalOpen(false)} className="bg-gray-500 hover:bg-gray-600">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BulkUpdate;
