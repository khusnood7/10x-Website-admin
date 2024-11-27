// src/pages/CreateUserPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/Users/UserForm';
import useUsers from '../hooks/useUsers';
import toast from 'react-hot-toast';
import Button from '../components/Common/Button';

const CreateUserPage = () => {
  const { createUser } = useUsers(); // Access the createUser function from UserContext
  const navigate = useNavigate(); // For navigation after successful creation

  /**
   * Handle form submission for creating a new user.
   * @param {FormData} formData - The data submitted from the UserForm.
   */
  const handleSubmit = async (formData) => {
    try {
      await createUser(formData); // Call the createUser function with form data
      toast.success('User created successfully!'); // Show success notification
      navigate('/users'); // Redirect to the user list page
    } catch (error) {
      // Error handling is managed in the UserContext and toast notifications
      console.error('Error creating user:', error);
      // Additional error handling can be implemented here if needed
    }
  };

  return (
    <div className="p-6">
      {/* Optional: Back to Users Button */}
      <div className="mb-4">
        <Button onClick={() => navigate('/users')} className="bg-gray-500 hover:bg-gray-600">
          Back to Users
        </Button>
      </div>

      {/* User Creation Form */}
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New User</h1>
        <UserForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateUserPage;
