// src/pages/UserDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserDetails from '../components/Users/UserDetails';
import useUsers from '../hooks/useUsers';
import toast from 'react-hot-toast';
import Button from '../components/Common/Button';
import ResetPasswordModal from '../components/Modals/ResetPasswordModal'; // Import the modal

const UserDetailsPage = () => {
  const { id } = useParams(); // Extract user ID from URL parameters
  const navigate = useNavigate();
  const {
    getUserById,
    changeUserStatus,
    resetUserPassword,
    getUserActivity,
    getUserAuditLogs,
  } = useUsers();
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user details, activity, and audit logs on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id) {
          throw new Error('User ID is missing.');
        }
        const fetchedUser = await getUserById(id);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          throw new Error('User data is unavailable.');
        }

        const userActivity = await getUserActivity(id);
        setActivity(userActivity);

        const userAuditLogs = await getUserAuditLogs(id);
        setAuditLogs(userAuditLogs);
      } catch (err) {
        setError(err.message || 'Error fetching user data.');
        toast.error(`Error fetching user data: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, getUserById, getUserActivity, getUserAuditLogs]);

  // Handle editing the user
  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  // Handle activating/deactivating the user
  const handleDeactivate = async () => {
    try {
      await changeUserStatus(id, !user.isActive);
      setUser({ ...user, isActive: !user.isActive });
      toast.success(`User has been ${user.isActive ? 'deactivated' : 'activated'} successfully.`);
    } catch (err) {
      toast.error(`Failed to change user status: ${err}`);
    }
  };

  // Handle opening the reset password modal
  const handleOpenResetPasswordModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the reset password modal
  const handleCloseResetPasswordModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="p-6">
      <Button onClick={() => navigate(-1)} className="mb-4">
        Back to Users
      </Button>
      <UserDetails
        user={user}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        onResetPassword={handleOpenResetPasswordModal} // Pass the modal open handler
      />
      {/* Optional: Display Recent Activity and Audit Logs */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
        {Array.isArray(activity) && activity.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          <ul className="list-disc list-inside">
            {activity.map((act, index) => (
              <li key={index}>
                {act.description} on {new Date(act.date).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Audit Logs</h3>
        {Array.isArray(auditLogs) && auditLogs.length === 0 ? (
          <p>No audit logs available.</p>
        ) : (
          <ul className="list-disc list-inside">
            {auditLogs.map((log, index) => (
              <li key={index}>
                {log.action} by {log.admin} on {new Date(log.date).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={handleCloseResetPasswordModal}
        userId={user._id}
        userName={user.name}
      />
    </div>
  );
};

export default UserDetailsPage;
