// frontend/src/components/layout/DashboardLayout.js

import React from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { Outlet } from 'react-router-dom';
import ThemeSelector from '../utils/ThemeSelector';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Theme Selector */}
      <ThemeSelector />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Outlet for Nested Routes */}
        <main className="flex-1 p-6 bg-base-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
