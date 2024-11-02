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
import DocEditor from '../components/DocEditor';
import DocViewer from '../components/DocViewer';

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

        {/* Documentation Routes */}
        <Route path="docs" element={<DocsSection />} />
        <Route path="docs/create" element={<DocEditor />} />
        <Route path="docs/edit/:id" element={<DocEditor />} />
        <Route path="docs/view/:id" element={<DocViewer />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
