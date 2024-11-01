// frontend/src/components/DashboardLayout.js

import React from 'react';
import AdminSidebar from './AdminSidebar';
import Footer from './Footer'; // Assuming you have a Footer component
import Navbar from './Navbar'; // Include Navbar if needed

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64 p-6 bg-base-100">
          {children}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
