// frontend/src/components/common/Sidebar.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaServer,
  FaThList,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaTachometerAlt,
  FaRobot,
  FaCogs,
  FaUserShield,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import 'react-tooltip/dist/react-tooltip.css';

const Sidebar = () => {
  const { user, setUser } = useAuth();
  const location = useLocation();

  // Admin Mode State
  const [isAdminMode, setIsAdminMode] = useState(() => {
    // Initialize from localStorage or default to false
    const savedMode = localStorage.getItem('isAdminMode');
    return savedMode === 'true' ? true : false;
  });

  // Persist Admin Mode state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isAdminMode', isAdminMode);
  }, [isAdminMode]);

  if (!user) {
    return null; // Optionally, display a placeholder or loader
  }

  // Define Menu Items
  const userMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'Servers', path: '/dashboard/servers', icon: <FaServer /> },
    { name: 'Commands', path: '/dashboard/commands', icon: <FaThList /> },
    { name: 'Settings', path: '/settings', icon: <FaCog /> },
    // Add other user-specific menu items here
  ];

  const adminMenuItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: <FaTachometerAlt /> },
    { name: 'User Management', path: '/admin/user-management', icon: <FaUsers /> },
    { name: 'Server Management', path: '/admin/server-management', icon: <FaServer /> },
    { name: 'Bot Management', path: '/admin/bot-management', icon: <FaRobot /> },
    { name: 'Command & Feature Management', path: '/admin/command-feature-management', icon: <FaCogs /> },
    // Add other admin-specific menu items here
  ];

  const handleLogout = async () => {
    try {
      // Replace with your actual logout API call
      const response = await fetch('/auth/logout', { method: 'GET', credentials: 'include' });
      if (response.ok) {
        setUser(null);
        toast.success('Logged out successfully!', {
          position: 'top-right',
          autoClose: 2000,
        });
        // Optionally, redirect to login or home page
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const toggleAdminMode = () => {
    setIsAdminMode((prevMode) => {
      const newMode = !prevMode;
      toast.info(`Admin Mode ${newMode ? 'Enabled' : 'Disabled'}`, {
        position: 'top-right',
        autoClose: 2000,
      });
      return newMode;
    });
  };

  return (
    <div className="flex flex-col h-full text-base-content w-64 bg-base-200 transition-all duration-300">
      {/* Logo Section */}
      <div className="flex items-center justify-center p-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          Athena Nexus
        </Link>
      </div>

      {/* User Information */}
      <div className="flex flex-col items-center p-4">
        <img
          src={
            user.avatarUrl
              ? user.avatarUrl
              : `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`
          }
          alt="User Avatar"
          className="w-16 h-16 rounded-full border-2 border-gray-700"
          data-tip="User Avatar"
        />
        <p className="mt-2 text-lg font-semibold">{user.username}</p>
      </div>

      {/* Admin Mode Toggle (Visible only to Admins) */}
      {user.isAdmin && (
        <div className="flex items-center justify-center p-2">
          <FaUserShield className="text-red-500 text-xl" data-tip="Admin Tools" />
          <button
            onClick={toggleAdminMode}
            className="ml-2 flex items-center focus:outline-none transition-transform duration-200"
            aria-label="Toggle Admin Mode"
            data-tip="Enable or Disable Admin Mode"
          >
            {isAdminMode ? (
              <>
                <FaToggleOn className="text-red-500 text-2xl" />
                <span className="ml-2">Admin Mode</span>
              </>
            ) : (
              <>
                <FaToggleOff className="text-gray-400 text-2xl" />
                <span className="ml-2">Admin Mode</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Admin Mode Indicator */}
      <CSSTransition
        in={isAdminMode}
        timeout={300}
        classNames={{
          enter: 'transform transition-opacity duration-300',
          enterActive: 'opacity-100',
          exit: 'transform transition-opacity duration-300',
          exitActive: 'opacity-0',
        }}
        unmountOnExit
      >
        <div className="flex items-center justify-center py-1 bg-accent text-white">
          <span className="text-sm font-semibold">ADMIN MODE</span>
        </div>
      </CSSTransition>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {/* Render Regular Menu Items if Admin Mode is OFF */}
          {!isAdminMode &&
            userMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-md hover:bg-primary hover:text-primary-content transition-colors duration-200 ${
                    location.pathname === item.path ? 'bg-primary text-primary-content' : ''
                  }`}
                  data-tip={item.name}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}

          {/* Render Admin Menu Items if Admin Mode is ON */}
          {isAdminMode &&
            adminMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-md hover:bg-primary hover:text-primary-content transition-colors duration-200 ${
                    location.pathname === item.path ? 'bg-primary text-primary-content' : ''
                  }`}
                  data-tip={item.name}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 rounded-md hover:bg-error hover:text-error-content focus:outline-none transition-colors duration-200"
          data-tip="Logout"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="ml-3">Logout</span>
        </button>
      </div>

      {/* Initialize React Tooltip */}
      <Tooltip place="right" type="dark" effect="solid" />
    </div>
  );
};

export default Sidebar;
