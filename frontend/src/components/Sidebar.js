// frontend/src/components/Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCog, FaBook, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800 text-white min-h-screen">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <Link to="/dashboard" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
          <FaHome className="mr-3 h-5 w-5" />
          Home
        </Link>
        <Link to="/dashboard/commands" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
          <FaCog className="mr-3 h-5 w-5" />
          Commands Enabled
        </Link>
        <Link to="/dashboard/users" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
          <FaUsers className="mr-3 h-5 w-5" />
          Server Users
        </Link>
        <Link to="/dashboard/docs" className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
          <FaBook className="mr-3 h-5 w-5" />
          Public Documentation
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
