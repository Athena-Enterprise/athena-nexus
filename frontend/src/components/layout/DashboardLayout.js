// frontend/src/components/layout/DashboardLayout.js

import React from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { Outlet } from 'react-router-dom';
import ThemeSelector from '../utils/ThemeSelector';

const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col"> {/* ml-64 applies from md screens and up */}
        {/* Navbar */}
        <Navbar />

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-base-100 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
