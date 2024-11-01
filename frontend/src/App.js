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
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import VerifyEmail from './pages/VerifyEmail';
import Navbar from './components/Navbar';
import ThemeSelector from './components/ThemeSelector';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <ThemeSelector />
                  <LandingPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <ThemeSelector />
                  <Login />
                  <Footer />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <Navbar />
                  <ThemeSelector />
                  <Signup />
                  <Footer />
                </>
              }
            />
            <Route
              path="/verify-email"
              element={
                <>
                  <Navbar />
                  <ThemeSelector />
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
                  <>
                    <Navbar />
                    <ThemeSelector />
                    <Dashboard />
                    <Footer />
                  </>
                </PrivateRoute>
              }
            />

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
