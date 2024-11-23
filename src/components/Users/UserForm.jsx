// src/components/Users/UserForm.jsx

import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import { USER_ROLES } from '../../utils/constants';
import { useFormik } from 'formik';
import { userFormValidationSchema } from '../../utils/validation';
import toast from 'react-hot-toast';

const UserForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: USER_ROLES.USER,
    profilePicture: null,
  });

  const [error, setError] = useState('');

  // Populate form if editing an existing user
  useEffect(() => {
    if (initialData && initialData._id) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || USER_ROLES.USER,
        profilePicture: null, // Reset profilePicture to allow re-upload if needed
      });
    }
  }, [initialData]);

  // Formik for form handling and validation
  const formik = useFormik({
    initialValues: formData,
    enableReinitialize: true, // To update form when initialData changes
    validationSchema: userFormValidationSchema,
    onSubmit: async (values) => {
      setError('');

      // Prepare form data for multipart/form-data
      const data = new FormData();
      data.append('name', values.name);
      data.append('email', values.email);
      data.append('role', values.role);
      if (values.profilePicture) {
        data.append('profilePicture', values.profilePicture);
      }

      try {
        await onSubmit(data);
      } catch (err) {
        setError(err);
        toast.error(`Failed to submit form: ${err}`);
      }
    },
  });

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">
        {initialData._id ? 'Edit User' : 'Create New User'}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`mt-1 block w-full px-3 py-2 border ${
              formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="John Doe"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`mt-1 block w-full px-3 py-2 border ${
              formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="john.doe@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>
        {/* Role Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`mt-1 block w-full px-3 py-2 bg-white border ${
              formik.touched.role && formik.errors.role ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="">Select Role</option>
            {Object.values(USER_ROLES).map((role) => (
              <option key={role} value={role}>
                {role.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
          )}
        </div>
        {/* Profile Picture Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={(e) => {
              formik.setFieldValue('profilePicture', e.currentTarget.files[0]);
            }}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formik.touched.profilePicture && formik.errors.profilePicture && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.profilePicture}</p>
          )}
        </div>
        {/* Submit Button */}
        <div>
          <Button type="submit" className="w-full">
            {initialData._id ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
