import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import Footer from './Footer';

const DashboardLayout = ({ children }) => {
  const { user, isAdminMode } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {user.isAdmin ? <AdminSidebar /> : <Sidebar />}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-base-100">
          {children}
        </main>

        {/* Footer */}
        <footer className="p-4 bg-base-200 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Athena Nexus. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;