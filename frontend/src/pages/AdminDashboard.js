// frontend/src/pages/AdminDashboard.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Statistics from '../components/Statistics';
import UserManagement from '../components/UserManagement';
import ServerManagement from '../components/ServerManagement';
import AdminManagement from '../components/AdminManagement';
import BotManagement from '../components/BotManagement';
import DeveloperSection from '../components/DeveloperSection';
import DocsSection from '../components/DocsSection';

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="statistics" replace />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="servers" element={<ServerManagement />} />
        <Route path="admins" element={<AdminManagement />} />
        <Route path="bot" element={<BotManagement />} />
        <Route path="developer" element={<DeveloperSection />} />
        <Route path="docs" element={<DocsSection />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
