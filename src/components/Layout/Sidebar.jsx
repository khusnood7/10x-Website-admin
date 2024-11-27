// src/components/Sidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiClipboard, // Import FiClipboard for Categories
  FiMessageCircle,
  FiLogOut, // Corrected to FiLogOut for Logout button
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ isCollapsed }) => {
  const { logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Users", path: "/users", icon: <FiUsers /> },
    { name: "Categories", path: "/admin/categories", icon: <FiClipboard /> }, // Added Categories link with FiClipboard icon
    { name: "Contacts", path: "/contacts", icon: <FiMessageCircle /> },
    { name: "Reviews", path: "/admin/reviews", icon: <i class="fa-solid fa-face-smile"></i> },

    {
      name: "Coupons",
      path: "/coupons",
      icon: <i class="fa-solid fa-closed-captioning"></i>,
    },
    { name: "FAQs", path: "/faqs", icon: <i class="fa-solid fa-question"></i> },
    {
      name: "Tags",
      path: "/admin/tags",
      icon: <i class="fa-solid fa-tag"></i>,
    },
    { name: "Analytics", path: "/analytics", icon: <FiBarChart2 /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-900 h-screen p-4 shadow-lg transition-width duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <nav className="flex flex-col h-full justify-between">
        <div className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-4 rounded-md text-gray-800 dark:text-gray-200 ${
                  isActive
                    ? "bg-gradient-to-r from-black to-[#0821D2] text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {!isCollapsed && <span className="text-md">{link.name}</span>}
            </NavLink>
          ))}
        </div>
        <div>
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 w-full"
          >
            <FiLogOut className="text-lg" /> {/* Corrected Logout icon */}
            {!isCollapsed && <span className="text-md">Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
