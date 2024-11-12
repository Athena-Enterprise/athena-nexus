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
  FaBars, // Importing FaBars for the hamburger menu
  FaTimes, // Importing FaTimes for the close icon
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
    const savedMode = localStorage.getItem('isAdminMode');
    return savedMode === 'true';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle

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
    { name: 'Custom Command Management', path: '/admin/custom-command-management', icon: <FaCogs /> }, // Ensure unique icon if needed
    { name: 'Notification Management', path: '/admin/notification-management', icon: <FaCog /> },
    { name: 'Activity Log Management', path: '/admin/activity-log-management', icon: <FaThList /> },
    // Add other admin-specific menu items here
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/auth/logout', { method: 'GET', credentials: 'include' });
      if (response.ok) {
        setUser(null);
        toast.success('Logged out successfully!', { position: 'top-right', autoClose: 2000 });
        // Optionally, redirect to login or home page
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.', { position: 'top-right', autoClose: 2000 });
    }
  };

  const toggleAdminMode = () => {
    setIsAdminMode((prevMode) => {
      const newMode = !prevMode;
      toast.info(`Admin Mode ${newMode ? 'Enabled' : 'Disabled'}`, { position: 'top-right', autoClose: 2000 });
      return newMode;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button (Visible on small screens) */}
      <button
        className="md:hidden fixed top-4 left-4 z-60 p-2 bg-primary text-white rounded-md focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-base-200 shadow-lg z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out flex flex-col overflow-y-auto`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-16 bg-primary">
          <Link to="/" className="text-2xl font-bold text-white">
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
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {/* Render Regular Menu Items */}
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

            {/* Render Admin Menu Items */}
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
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 rounded-md hover:bg-error hover:text-error-content focus:outline-none transition-colors duration-200"
            data-tip="Logout"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay when Sidebar is Open on Small Screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Initialize React Tooltip */}
      <Tooltip place="right" type="dark" effect="solid" />
    </>
  );
};

export default Sidebar;
