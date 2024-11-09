// frontend/src/components/utils/AdminRoute.js

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  if (!user) {
    toast.error('You must be logged in to access this page.');
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    toast.error('You do not have permission to access this page.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
