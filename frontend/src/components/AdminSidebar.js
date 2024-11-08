// frontend/src/components/AdminSidebar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaTachometerAlt,
  FaUsers,
  FaServer,
  FaRobot,
  FaListAlt,
  FaCogs,
  FaSignOutAlt,
  FaUserShield,
  FaThList,
  FaCog,
} from 'react-icons/fa';
import { Switch } from '@headlessui/react'; // Using Headless UI for toggle switch
import api from '../services/api';

const AdminSidebar = () => {
  const { user, isAdminMode, toggleAdminMode, setUser } = useAuth();
  const location = useLocation();

  const userMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'Servers', path: '/dashboard/servers', icon: <FaServer /> },
    { name: 'Commands', path: '/dashboard/commands', icon: <FaThList /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
    // Add other user-specific menu items as needed
  ];

  const adminMenuItems = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'User Management', path: '/admin/users', icon: <FaUsers /> },
    { name: 'Server Management', path: '/admin/servers', icon: <FaServer /> },
    { name: 'Bot Management', path: '/admin/bot', icon: <FaRobot /> },
    { name: 'Command Management', path: '/admin/commands', icon: <FaListAlt /> },
    { name: 'Feature Management', path: '/admin/features', icon: <FaCogs /> },
    // Add other admin-specific menu items as needed
  ];

  const handleLogout = async () => {
    try {
      await api.get('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-200 w-64 shadow-lg">
      {/* User Info */}
      <div className="flex p-4 bg-base-300 relative">
        <div className="relative">
          <img
            src={
              user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`
            }
            alt="User Avatar"
            className="w-16 h-16 rounded-full"
          />
          {/* Status Label */}
          <span className="absolute bottom-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-full">
            {user.status}
          </span>
        </div>
        <div className="ml-3 flex flex-col justify-center">
          <div className="flex items-center">
            <p className="text-lg font-semibold">{user.username}</p>
          </div>
          {user.isAdmin && (
            <div className="flex items-center mt-2">
              <Switch
                checked={isAdminMode}
                onChange={toggleAdminMode}
                className={`${
                  isAdminMode ? 'bg-blue-600' : 'bg-gray-400'
                } relative inline-flex h-5 w-10 items-center rounded-full`}
              >
                <span className="sr-only">Toggle Admin Mode</span>
                <span
                  className={`${
                    isAdminMode ? 'translate-x-5' : 'translate-x-1'
                  } inline-block h-3 w-3 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
              <FaUserShield className="text-lg text-gray-700 ml-2" title="Admin Mode" />
            </div>
          )}
        </div>
      </div>

      {/* Admin Mode Banner */}
      {user.isAdmin && isAdminMode && (
        <div className="bg-red-600 text-white text-center py-1">
          <p className="text-sm font-bold">Admin Mode</p>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {(user.isAdmin && isAdminMode ? adminMenuItems : userMenuItems).map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-md hover:bg-base-300 ${
                  location.pathname === item.path ? 'bg-base-300' : ''
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 bg-base-300">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 rounded-md hover:bg-base-200"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
