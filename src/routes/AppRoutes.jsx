// src/routes/AppRoutes.jsx

import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import UserListPage from "../pages/UserListPage";
import UserDetailsPage from "../pages/UserDetailsPage";
import UserEditPage from "../pages/UserEditPage";
import CreateUserPage from "../pages/CreateUserPage";
import BulkUpdatePage from "../pages/BulkUpdatePage";
import InviteUserPage from "../pages/InviteUserPage";
import SettingsPage from "../pages/SettingsPage";
import ContactListPage from "../pages/ContactListPage"; // Import ContactListPage
import ContactDetailsPage from "../pages/ContactDetailsPage"; // Import ContactDetailsPage (if using separate route)
import ProtectedRoute from "../components/Common/ProtectedRoute";
import Layout from "../components/Layout/Layout";
import { CategoryProvider } from "../contexts/CategoryContext";
import CategoryListPage from "../pages/CategoryListPage";
import CouponListPage from "../pages/CouponListPage"; // Import the CouponListPage
import FAQListPage from "../pages/FAQListPage"; // Import FAQListPage
import TagListPage from "../pages/TagListPage";
import ReviewListPage from "../pages/ReviewListPage"; // Import ReviewListPage

const AppRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <LoginPage />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
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
        <Route path="users/create" element={<CreateUserPage />} />
        <Route path="users/:id" element={<UserDetailsPage />} />
        <Route path="users/edit/:id" element={<UserEditPage />} />
        <Route path="invite-user" element={<InviteUserPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="/admin/categories" element={<CategoryListPage />} />
        <Route path="coupons" element={<CouponListPage />} />{" "}
        {/* Add this route */}
        <Route path="faqs" element={<FAQListPage />} /> {/* Add FAQ route */}
        <Route path="/admin/tags" element={<TagListPage />} />
        <Route path="/admin/categories/:id" element={<CategoryListPage />} />{" "}
        {/* For viewing specific category */}
        {/* Contact Messages Routes */}
        <Route path="contacts" element={<ContactListPage />} />
        {/* If you prefer separate route for details */}
        <Route path="contacts/:id" element={<ContactDetailsPage />} />
        {/* Reviews Management */}
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'PRODUCT_MANAGER']}>
              <ReviewListPage />
            </ProtectedRoute>
          }
        />
        {/* Add more protected routes here */}
      </Route>

      {/* Redirect any unknown routes */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
