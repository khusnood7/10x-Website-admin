// src/contexts/UserContext.jsx

import React, { createContext, useState, useCallback } from 'react';
import userService from '../api/userService';
import toast from 'react-hot-toast';

// Create the UserContext
const UserContext = createContext();

// UserProvider component to wrap around parts of the app that need user data
export const UserProvider = ({ children }) => {
  // State variables
  const [users, setUsers] = useState([]); // List of users
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  /**
   * Fetch all users with optional parameters (e.g., pagination, filters)
   * @param {Object} params - Query parameters for filtering, searching, and pagination
   * @returns {Object} - Contains success status and totalPages if available
   */
  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers(params);
      console.log('fetchUsers response:', data); // Debugging
      if (data.success) {
        setUsers(data.data); // Assuming data.data is the array of users
        return { success: true, totalPages: data.totalPages };
      } else {
        setError(data.message || 'Failed to fetch users.');
        toast.error(data.message || 'Failed to fetch users.');
        return { success: false };
      }
    } catch (err) {
      console.error('fetchUsers error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while fetching users.');
        toast.error(err.message || 'An error occurred while fetching users.');
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a single user by ID
   * @param {String} id - User ID
   * @returns {Object|null} - User object or null if not found
   */
  const getUserById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserById(id);
      console.log('getUserById response:', data); // Debugging
      if (data.success) {
        return data.data; // Assuming data.data is the user object
      } else {
        setError(data.message || 'Failed to fetch user details.');
        toast.error(data.message || 'Failed to fetch user details.');
        return null;
      }
    } catch (err) {
      console.error('getUserById error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while fetching user details.');
        toast.error(err.message || 'An error occurred while fetching user details.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  /**
   * Signup a user via invitation token
   * @param {string} token - Invitation token
   * @param {string} name - Name of the user
   * @param {string} password - User's password
   * @param {string} confirmPassword - Confirmation of the password
   */
  const signupViaInvite = useCallback(async (token, name, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.signupViaInvite(token, name, password, confirmPassword);
      if (data.success) {
        toast.success('Account created successfully.');
        // Optionally, log the user in by storing the token
        localStorage.setItem('authToken', data.token);
        // Redirect to dashboard or desired page
        // This should ideally be handled in the component using this function
      } else {
        setError(data.message || 'Signup failed.');
        toast.error(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error('signupViaInvite error:', err); // Debugging
      setError(err);
      toast.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new user
   * @param {FormData} userData - FormData object containing user details and optional profile picture
   */
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.createUser(userData);
      console.log('createUser response:', data); // Debugging
      if (data.success) {
        setUsers((prevUsers) => [...prevUsers, data.data]); // Assuming data.data is the created user object
        toast.success('User created successfully.');
      } else {
        setError(data.message || 'Failed to create user.');
        toast.error(data.message || 'Failed to create user.');
      }
    } catch (err) {
      console.error('createUser error:', err); // Debugging
      if (err.errors) {
        // Display specific validation errors
        err.errors.forEach((validationError) => {
          const field = Object.keys(validationError)[0];
          const message = validationError[field];
          toast.error(`${field}: ${message}`);
        });
        setError(err.message || 'Invalid input.');
      } else {
        setError(err.message || 'An error occurred while creating the user.');
        toast.error(err.message || 'An error occurred while creating the user.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing user's details
   * @param {String} id - User ID
   * @param {FormData} userData - FormData object containing updated user details and optional profile picture
   */
  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.updateUser(id, userData);
      console.log('updateUser response:', data); // Debugging
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === id ? data.data : user))
        );
        toast.success('User updated successfully.');
      } else {
        setError(data.message || 'Failed to update user.');
        toast.error(data.message || 'Failed to update user.');
      }
    } catch (err) {
      console.error('updateUser error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while updating the user.');
        toast.error(err.message || 'An error occurred while updating the user.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Permanently delete a user
   * @param {String} id - User ID
   */
  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.deleteUser(id);
      console.log('deleteUser response:', data); // Debugging
      if (data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        toast.success('User deleted successfully.');
      } else {
        setError(data.message || 'Failed to delete user.');
        toast.error(data.message || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('deleteUser error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while deleting the user.');
        toast.error(err.message || 'An error occurred while deleting the user.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset a user's password (Admin-initiated)
   * @param {String} id - User ID
   * @param {String} newPassword - New password string
   */
  const resetUserPassword = useCallback(async (id, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.resetUserPassword(id, newPassword);
      console.log('resetUserPassword response:', data); // Debugging
      if (data.success) {
        toast.success('Password has been reset successfully.');
      } else {
        setError(data.message || 'Failed to reset password.');
        toast.error(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('resetUserPassword error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while resetting the password.');
        toast.error(err.message || 'An error occurred while resetting the password.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Perform bulk updates on multiple users
   * @param {Object} bulkData - Object containing userIds and actions
   * @param {Array} bulkData.userIds - Array of user IDs
   * @param {Array} bulkData.actions - Array of action objects
   */
  const bulkUpdateUsers = useCallback(async ({ userIds, actions }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.bulkUpdateUsers({ userIds, actions });
      console.log('bulkUpdateUsers response:', data); // Debugging
      if (data.success) {
        // Optionally, refetch users or update the local state based on the response
        await fetchUsers(); // Refetching to get updated users
        toast.success('Bulk update successful.');
      } else {
        setError(data.message || 'Failed to perform bulk update.');
        toast.error(data.message || 'Failed to perform bulk update.');
      }
    } catch (err) {
      console.error('bulkUpdateUsers error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred during bulk update.');
        toast.error(err.message || 'An error occurred during bulk update.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);



  /**
   * Invite a new user by sending an invitation email
   * @param {string} email - Email of the user to invite
   * @param {string} role - Role to assign to the invited user
   */
  const inviteUser = useCallback(async (email, role) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.inviteUser(email, role);
      console.log('inviteUser response:', data); // Debugging
      if (data.success) {
        toast.success('Invitation sent successfully.');
      } else {
        setError(data.message || 'Failed to invite user.');
        toast.error(data.message || 'Failed to invite user.');
      }
    } catch (err) {
      console.error('inviteUser error:', err); // Debugging
      setError(err);
      toast.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Export user data in specified format (CSV/Excel)
   * @param {String} format - Desired export format ('csv' or 'excel')
   */
  const exportUsers = useCallback(async (format = 'csv') => {
    setLoading(true);
    setError(null);
    try {
      const blobData = await userService.exportUsers(format);
      console.log('exportUsers response:', blobData); // Debugging

      if (blobData) {
        // Check if the blob is actually an error message
        const contentType = blobData.type;
        if (contentType === 'application/json') {
          // Read the blob as text
          const text = await blobData.text();
          let errorMessage = 'Failed to export users.';
          try {
            const json = JSON.parse(text);
            if (json && json.message) {
              errorMessage = json.message;
            }
          } catch (parseError) {
            // Not JSON, keep the default error message
          }
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (contentType === 'text/csv' || contentType === 'application/vnd.ms-excel') {
          // Create a Blob from the binary data
          const blob = new Blob([blobData], { type: contentType });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `users.${format}`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url); // Clean up the URL object
          toast.success('Users exported successfully.');
        } else {
          // Handle other content types if needed
          setError('Unexpected file format received.');
          toast.error('Unexpected file format received.');
        }
      } else {
        setError('No data received for export.');
        toast.error('No data received for export.');
      }
    } catch (err) {
      console.error('exportUsers error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while exporting users.');
        toast.error(err.message || 'An error occurred while exporting users.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Change a user's active status
   * @param {String} id - User ID
   * @param {Boolean} isActive - Desired active status
   * @returns {Object} - Updated user object
   */
  const changeUserStatus = useCallback(async (id, isActive) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.changeUserStatus(id, isActive);
      console.log('changeUserStatus response:', data); // Debugging
      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === id ? data.user : user))
        );
        toast.success(`User has been ${isActive ? 'activated' : 'deactivated'} successfully.`);
        return data.user;
      } else {
        setError(data.message || 'Failed to change user status.');
        toast.error(data.message || 'Failed to change user status.');
        return null;
      }
    } catch (err) {
      console.error('changeUserStatus error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while changing user status.');
        toast.error(err.message || 'An error occurred while changing user status.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch recent login activity for a specific user
   * @param {String} id - User ID
   * @returns {Array} - Array of recent login activities
   */
  const getUserActivity = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserActivity(id);
      console.log('getUserActivity response:', data); // Debugging
      if (data.success) {
        return Array.isArray(data.activities) ? data.activities : []; // Ensure it returns an array
      } else {
        setError(data.message || 'Failed to fetch user activity.');
        toast.error(data.message || 'Failed to fetch user activity.');
        return [];
      }
    } catch (err) {
      console.error('getUserActivity error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while fetching user activity.');
        toast.error(err.message || 'An error occurred while fetching user activity.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch audit logs for a specific user
   * @param {String} id - User ID
   * @returns {Array} - Array of audit logs
   */
  const getUserAuditLogs = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserAuditLogs(id);
      console.log('getUserAuditLogs response:', data); // Debugging
      if (data.success) {
        return Array.isArray(data.auditLogs) ? data.auditLogs : []; // Ensure it returns an array
      } else {
        setError(data.message || 'Failed to fetch audit logs.');
        toast.error(data.message || 'Failed to fetch audit logs.');
        return [];
      }
    } catch (err) {
      console.error('getUserAuditLogs error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while fetching audit logs.');
        toast.error(err.message || 'An error occurred while fetching audit logs.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Count users grouped by roles
   * @returns {Array} - Array with roles and their respective counts
   */
  const countUsersByRole = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.countUsersByRole();
      console.log('countUsersByRole response:', data); // Debugging
      if (data.success) {
        return data.counts; // Assuming data.counts is an array like [{ role: 'super-admin', count: 5 }, ...]
      } else {
        setError(data.message || 'Failed to count users by role.');
        toast.error(data.message || 'Failed to count users by role.');
        return [];
      }
    } catch (err) {
      console.error('countUsersByRole error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while counting users by role.');
        toast.error(err.message || 'An error occurred while counting users by role.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get total number of users
   * @returns {Number} - Total user count
   */
  const getTotalUserCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserCount();
      console.log('getTotalUserCount response:', data); // Debugging
      if (data.success) {
        return data.totalUsers; // Assuming data.totalUsers is the total user count
      } else {
        setError(data.message || 'Failed to get total user count.');
        toast.error(data.message || 'Failed to get total user count.');
        return 0;
      }
    } catch (err) {
      console.error('getTotalUserCount error:', err); // Debugging
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while getting total user count.');
        toast.error(err.message || 'An error occurred while getting total user count.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        resetUserPassword,
        bulkUpdateUsers,
        inviteUser,
        exportUsers,
        changeUserStatus,
        getUserActivity,
        getUserAuditLogs,
        countUsersByRole,
        getTotalUserCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUsers = () => React.useContext(UserContext);

export default UserContext;
