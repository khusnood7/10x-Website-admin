// src/utils/validation.js

import * as Yup from 'yup';
import { USER_ROLES } from './constants';

/**
 * Validation schema for login form.
 */
export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
});



/**
 * Validation schema for user creation/editing form.
 */
export const userFormValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  role: Yup.string()
    .oneOf(Object.values(USER_ROLES), 'Invalid role')
    .required('Role is required'),
  profilePicture: Yup.mixed()
    .test(
      'fileSize',
      'File size is too large (max 5MB)',
      (value) => !value || (value && value.size <= 5242880)
    )
    .test(
      'fileFormat',
      'Unsupported file format',
      (value) =>
        !value ||
        (value &&
          ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(value.type))
    )
    .notRequired(),
});

/**
 * Validation schema for inviting a user.
 */
export const inviteUserValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  role: Yup.string()
    .oneOf(Object.values(USER_ROLES), 'Invalid role')
    .required('Role is required'),
});

// Validation schema for OTP verification
export const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
    .required('OTP is required'),
});

/**
 * Validation schema for password reset.
 */
export const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*#?&]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

// Add more validation schemas as needed
