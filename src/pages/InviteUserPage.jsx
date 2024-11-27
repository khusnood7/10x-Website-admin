// src/pages/InviteUserPage.jsx

import React from 'react';
import InviteUser from '../components/Users/InviteUser';
import { useUsers } from '../contexts/UserContext';

const InviteUserPage = () => {
  const { inviteUser } = useUsers();

  // Handle user invitation
  const handleInvite = async (email, role) => {
    try {
      await inviteUser(email, role);
      // toast.success('Invitation sent successfully.'); // Already handled in context
    } catch (err) {
      // toast.error(`Invitation failed: ${err}`); // Already handled in context
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Invite New User</h1>
      <InviteUser onInvite={handleInvite} />
    </div>
  );
};

export default InviteUserPage;
