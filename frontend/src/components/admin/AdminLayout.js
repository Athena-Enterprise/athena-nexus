// frontend/src/components/admin/AdminLayout.js

import React from 'react';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-base-200">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
