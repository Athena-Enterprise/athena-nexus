// frontend/src/components/Sidebar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaServer, FaCog, FaSignOutAlt, FaThList } from 'react-icons/fa';
import api from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const { user, setUser } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'Servers', path: '/dashboard/servers', icon: <FaServer /> },
    { name: 'Commands', path: '/dashboard/commands', icon: <FaThList /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
    // Add other user-specific menu items as needed
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
      <div className="flex items-center p-4 bg-base-300">
        <img
          src={
            user.avatar
              ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
              : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`
          }
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-3">
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-sm text-gray-500">#{user.discriminator}</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
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

export default Sidebar;
