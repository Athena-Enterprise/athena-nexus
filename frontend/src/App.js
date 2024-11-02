// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UserSettings from './pages/UserSettings';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // Ensure this file exists
import AdminRoute from './components/AdminRoute'; // Ensure this file exists
import VerifyEmail from './pages/VerifyEmail';
import Navbar from './components/Navbar';
import ThemeSelector from './components/ThemeSelector';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Documentation Components
import DocsSection from './components/DocsSection';
import DocViewer from './components/DocViewer';
import DocEditor from './components/DocEditor';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          {/* Navbar and ThemeSelector are placed outside Routes to persist across pages */}
          <Navbar />
          <ThemeSelector />

          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <LandingPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Login />
                  <Footer />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <Signup />
                  <Footer />
                </>
              }
            />
            <Route
              path="/verify-email"
              element={
                <>
                  <VerifyEmail />
                  <Footer />
                </>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                  <Footer />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
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
