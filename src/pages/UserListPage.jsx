// src/pages/UserListPage.jsx

import React, { useEffect, useState, useMemo } from 'react';
import UserList from '../components/Users/UserList';
import Pagination from '../components/Common/Pagination';
import Button from '../components/Common/Button';
import BulkUpdate from '../components/Users/BulkUpdate';
import HighlightText from '../components/Users/HighlightText'; // Import HighlightText
import useUsers from '../hooks/useUsers';
import usePagination from '../hooks/usePagination';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { USER_ROLES } from '../utils/constants';
import { debounce } from 'lodash'; // Ensure lodash is installed: npm install lodash

const UserListPage = () => {
  const {
    users,
    fetchUsers,
    loading,
    error,
    bulkUpdateUsers,
    exportUsers,
    deleteUser,
    changeUserStatus,
  } = useUsers();
  
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortField, setSortField] = useState('name'); // Default sort field
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [totalPages, setTotalPages] = useState(1);
  
  const { currentPage, setCurrentPage } = usePagination(totalPages, 1);
  const navigate = useNavigate();

  // Debounced fetch function to optimize API calls
  const debouncedFetchUsers = useMemo(
    () => debounce(async (params) => {
      try {
        const data = await fetchUsers(params);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        toast.error(`Error fetching users: ${err}`);
      }
    }, 500),
    [fetchUsers]
  );

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      query: searchQuery,
      role: roleFilter,
      sortField,
      sortOrder,
    };
    debouncedFetchUsers(params);

    // Cleanup debounce on unmount
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [debouncedFetchUsers, currentPage, searchQuery, roleFilter, sortField, sortOrder]);

  // Handle selection of individual user or all users
  const handleSelect = (id) => {
    if (Array.isArray(id)) {
      // Select all users
      setSelectedUserIds(id);
    } else {
      setSelectedUserIds((prev) =>
        prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
      );
    }
  };

  // Handle bulk update action
  const handleBulkUpdate = async (updates) => {
    try {
      await bulkUpdateUsers(updates);
      toast.success('Bulk update successful.');
      setSelectedUserIds([]);
      // Refetch users to reflect updates
      fetchUsers({
        page: currentPage,
        limit: 10,
        query: searchQuery,
        role: roleFilter,
        sortField,
        sortOrder,
      });
    } catch (err) {
      toast.error(`Bulk update failed: ${err}`);
    }
  };



  // Handle exporting users
  const handleExport = async () => {
    try {
      await exportUsers('csv');
      toast.success('Users exported successfully.');
    } catch (err) {
      toast.error(`Export failed: ${err}`);
    }
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted successfully.');
      // Refetch users to reflect deletion
      fetchUsers({
        page: currentPage,
        limit: 10,
        query: searchQuery,
        role: roleFilter,
        sortField,
        sortOrder,
      });
    } catch (err) {
      toast.error(`Failed to delete user: ${err}`);
    }
  };

  // Handle changing user status (activate/deactivate)
  const handleChangeUserStatus = async (id, isActive) => {
    try {
      await changeUserStatus(id, isActive);
      toast.success(`User has been ${isActive ? 'activated' : 'deactivated'} successfully.`);
      // Refetch users to reflect status change
      fetchUsers({
        page: currentPage,
        limit: 10,
        query: searchQuery,
        role: roleFilter,
        sortField,
        sortOrder,
      });
    } catch (err) {
      toast.error(`Failed to change user status: ${err}`);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc'); // Reset to ascending when changing field
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Search, Filter, and Sort Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
        {/* Search and Filter */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Roles</option>
            {Object.values(USER_ROLES).map((role) => (
              <option key={role} value={role}>
                {role.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>


        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <BulkUpdate selectedUserIds={selectedUserIds} onBulkUpdate={handleBulkUpdate} />
          <Button onClick={handleExport} className="bg-green-500 hover:bg-green-600">
            Export Users
          </Button>
        </div>
      </div>

      {/* User List Section */}
      <div className="bg-white shadow-md rounded-md p-4">
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <UserList
            users={users}
            onView={(id) => navigate(`/users/${id}`)}
            onEdit={(id) => navigate(`/users/edit/${id}`)}
            onChangeStatus={handleChangeUserStatus}
            onDelete={handleDelete}
            onSelect={handleSelect}
            selectedUserIds={selectedUserIds}
            searchTerm={searchQuery} // Pass searchTerm for highlighting
          />
        )}
      </div>

      {/* Pagination Section */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            fetchUsers({
              page,
              limit: 10,
              query: searchQuery,
              role: roleFilter,
              sortField,
              sortOrder,
            });
          }}
        />
      </div>
    </div>
  );
};

export default UserListPage;
