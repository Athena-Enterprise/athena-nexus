// frontend/src/components/layout/PublicLayout.js

import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { Outlet } from 'react-router-dom';
import ThemeSelector from '../utils/ThemeSelector';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ThemeSelector />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
