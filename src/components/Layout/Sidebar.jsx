// src/components/Layout/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiClipboard,
  FiUserPlus,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isCollapsed }) => {
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Users', path: '/users', icon: <FiUsers /> },
    { name: 'Bulk Update', path: '/bulk-update', icon: <FiClipboard /> },
    { name: 'Invite User', path: '/invite-user', icon: <FiUserPlus /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
    { name: 'Analytics', path: '/analytics', icon: <FiBarChart2 /> },
  ];

  return (
    <aside
      className={`bg-gray-100 dark:bg-gray-900 h-screen p-4 shadow-lg transition-width duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <nav className="flex flex-col h-full justify-between">
        {/* Navigation Links */}
        <div className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-4 rounded-md text-gray-800 dark:text-gray-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-black to-[#0821D2] text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {!isCollapsed && <span className="text-md">{link.name}</span>}
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div>
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 w-full"
          >
            <FiLogOut className="text-lg" />
            {!isCollapsed && <span className="text-md">Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
