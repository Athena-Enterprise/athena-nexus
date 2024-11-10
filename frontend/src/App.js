// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/admin/AdminLayout';

// Common Components
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// Admin Components
import UserManagement from './components/admin/UserManagement';
import ServerManagement from './components/admin/ServerManagement';
import CommandFeatureManagement from './components/admin/CommandFeatureManagement';
import CustomCommandManagement from './components/admin/CustomCommandManagement';
import NotificationManagement from './components/admin/NotificationManagement';
import ActivityLogManagement from './components/admin/ActivityLogManagement';
import GlobalBotManagement from './components/admin/GlobalBotManagement';

// Route Guards
import PrivateRoute from './components/utils/PrivateRoute';
import AdminRoute from './components/utils/AdminRoute';

// Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* Add more private routes here if needed */}
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/user-management" element={<UserManagement />} />
                  <Route path="/admin/server-management" element={<ServerManagement />} />
                  <Route path="/admin/command-feature-management" element={<CommandFeatureManagement />} />
                  <Route path="/admin/custom-command-management" element={<CustomCommandManagement />} />
                  <Route path="/admin/notification-management" element={<NotificationManagement />} />
                  <Route path="/admin/activity-log-management" element={<ActivityLogManagement />} />
                  <Route path="/admin/bot-management" element={<GlobalBotManagement />} />
                  {/* Add more admin routes here if needed */}
                </Route>
              </Route>

              {/* Redirect unmatched routes to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
      <ToastContainer />
    </Router>
  );
};

export default App;
