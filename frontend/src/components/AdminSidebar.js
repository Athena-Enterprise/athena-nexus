// frontend/src/components/AdminSidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Statistics', path: '/admin/statistics' },
    { name: 'User Management', path: '/admin/users' },
    { name: 'Server Management', path: '/admin/servers' },
    { name: 'Admin Management', path: '/admin/admins' },
    { name: 'Bot Management', path: '/admin/bot' },
    { name: 'Developer Section', path: '/admin/developer' },
    { name: 'Documentation', path: '/admin/docs' },
    { name: 'Back to Main', path: '/dashboard' }, // Link back to the main dashboard
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-base-200 text-base-content shadow-lg">
      <div className="flex items-center justify-center h-16 bg-base-300">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-10">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center py-2 px-8 ${
                isActive
                  ? 'bg-primary text-primary-content'
                  : 'hover:bg-base-300 hover:text-base-content'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
