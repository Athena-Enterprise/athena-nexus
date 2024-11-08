// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import DashboardLayout from './components/DashboardLayout';
import PublicLayout from './components/PublicLayout';

// Import your pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import UserSettings from './pages/UserSettings';
import UserManagement from './components/UserManagement';
import ServerManagement from './components/ServerManagement';
import BotManagement from './components/BotManagement';
import CommandsEnabled from './components/CommandsEnabled';
import DeveloperSection from './components/DeveloperSection';
import ServerUserManagement from './components/ServerUserManagement';
import AdminManagement from './components/AdminManagement';
// ... other imports ...

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <LandingPage />
                </PublicLayout>
              }
            />
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <UserSettings />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/commands"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <CommandsEnabled />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/servers"
              element={
                <PrivateRoute>
                  <DashboardLayout>
                    <ServerUserManagement />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <UserManagement />
                  </DashboardLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/servers"
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <ServerManagement />
                  </DashboardLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bot"
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <BotManagement />
                  </DashboardLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/commands"
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <DeveloperSection />
                  </DashboardLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/admins"
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <AdminManagement />
                  </DashboardLayout>
                </AdminRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
