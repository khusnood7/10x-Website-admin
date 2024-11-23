// src/routes/AppRoutes.jsx

import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import UserListPage from '../pages/UserListPage';
import UserDetailsPage from '../pages/UserDetailsPage';
import UserEditPage from '../pages/UserEditPage'; // Import UserEditPage
import BulkUpdatePage from '../pages/BulkUpdatePage';
import InviteUserPage from '../pages/InviteUserPage';
import SettingsPage from '../pages/SettingsPage';
// import AnalyticsPage from '../pages/AnalyticsPage'; // Assuming you have this page
import ProtectedRoute from '../components/Common/ProtectedRoute';
import Layout from '../components/Layout/Layout'; // Import Layout

const AppRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
      />

      {/* Protected Routes Nested Under Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Define all protected routes as children */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="users/:id" element={<UserDetailsPage />} />
        <Route path="users/edit/:id" element={<UserEditPage />} />
        <Route path="bulk-update" element={<BulkUpdatePage />} />
        <Route path="invite-user" element={<InviteUserPage />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* <Route path="analytics" element={<AnalyticsPage />} /> */}
        {/* Add more protected routes here */}
      </Route>

      {/* Redirect any unknown routes */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
